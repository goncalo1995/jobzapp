// app/api/prep/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';
import { callOpenRouter, parseAIJSON } from '@/lib/openrouter';
import { INTERVIEW_PREP_SYSTEM_PROMPT } from '@/lib/prompts';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { calculateCreditCost } from '@/lib/credit-costs';
import { getUserTier } from '@/lib/tier-limits';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Apply AI rate limiting
  const rateLimitResponse = await checkRateLimit(request, true);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      profile, jobDescription, customFocus, model, customApiKey, 
      prepType, hardness, timeToPrepare, interviewId 
    } = await request.json();

    if (!profile || !jobDescription) {
      return NextResponse.json({ error: 'Profile and Job Description are required' }, { status: 400 });
    }

    const isByok = !!customApiKey;
    const selectedModel = model || 'anthropic/claude-3.5-sonnet';

    // 0. Enforce BYOK Limits
    if (isByok) {
       const { tier } = await getUserTier();
       if (tier === 'free') {
          return NextResponse.json({ error: 'Bring-Your-Own-Key is only available on the Accelerator plan.' }, { status: 403 });
       }
    }

    // 1. Check & Deduct Credits
    let expectedCost = calculateCreditCost('INTERVIEW_PREP_GENERATE', selectedModel);

    if (!isByok && expectedCost > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('ai_credits')
        .eq('id', user.id)
        .single();
        
      if (profileError || !profileData || profileData.ai_credits < expectedCost) {
        return NextResponse.json({ error: 'Insufficient AI credits' }, { status: 402 });
      }

      // Deduct credits
      await adminSupabase.rpc('deduct_ai_credits', {
        target_user_id: user.id,
        amount: expectedCost,
        p_action: 'interview_prep',
        p_metadata: { interviewId, model: selectedModel }
      });
    }

    // 2. Call AI
    // TODO check if worth passing profile to interview prep
    // CANDIDATE PROFILE:
    // ${JSON.stringify(profile, null, 2)}
    const userPrompt = `
JOB DESCRIPTION:
${jobDescription}

CONFIGURATION:
- Preparation Type: ${prepType || 'Mixed'}
- Difficulty Level: ${hardness || 'Standard'}
- Time to Prepare: ${timeToPrepare || '1 week'}

${customFocus ? `CANDIDATE CUSTOM FOCUS:\n${customFocus}` : ''}
    `;

    try {
      const aiResponse = await callOpenRouter(
        INTERVIEW_PREP_SYSTEM_PROMPT,
        userPrompt,
        selectedModel,
        {
          userId: user.id,
          customApiKey: customApiKey,
          temperature: 0.7,
          max_tokens: 4000
        }
      );

      console.log('[AI Interview Prep] Generated Markdown Length:', aiResponse.text.length);

      const parsedJson = parseAIJSON<any>(aiResponse.text);

      if (parsedJson.error) {
        throw new Error(parsedJson.error);
      }

      const newPrep = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        config: {
          type: prepType,
          difficulty: hardness,
          time: timeToPrepare
        },
        ...parsedJson
      };

      // 3. Save to DB if interviewId is provided
      if (interviewId) {
        // Fetch existing history to append
        const { data: interviewData } = await supabase
          .from('interviews')
          .select('ai_prep_data, job_application_id, job_applications!inner(user_id)')
          .eq('id', interviewId)
          // Ensure the outer user owns the parent job application
          .eq('job_applications.user_id', user.id)
          .single();

        let history: any[] = [];
        if (interviewData?.ai_prep_data) {
          if (Array.isArray(interviewData.ai_prep_data)) {
            history = interviewData.ai_prep_data;
          }
        }
        
        history.push(newPrep);

        const { error: updateError } = await supabase
          .from('interviews')
          .update({ 
            ai_prep_data: history
          })
          .eq('id', interviewId);
          
        if (updateError) {
          console.error('[AI Interview Prep] Failed to save to DB:', updateError);
        } else {
          console.log('[AI Interview Prep] Saved to DB array for interview:', interviewId);
        }
      }

      return NextResponse.json({ prepData: newPrep });
      
    } catch (aiError: any) {
      // Refund credits if AI call fails
      console.error('[AI Interview Prep] AI error, refunding credits:', aiError);
      
      if (!isByok && expectedCost > 0) {
        await adminSupabase.rpc('increment_ai_credits' as any, {
          target_user_id: user.id,
          amount: expectedCost,
          p_action: 'refund_interview_prep',
          p_metadata: { aiError: aiError.message }
        });
      }
      
      return NextResponse.json({ 
        error: aiError.message || 'Failed to generate interview preparation' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[AI Interview Prep] Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}