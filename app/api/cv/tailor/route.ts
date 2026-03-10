import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { callOpenRouter, parseAIJSON } from '@/lib/openrouter';
import { TAILOR_SYSTEM_PROMPT } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import { calculateCreditCost } from '@/lib/credit-costs';
import { getUserTier } from '@/lib/tier-limits';

export async function POST(request: NextRequest) {
  // Apply AI rate limiting
  const rateLimitResponse = await checkRateLimit(request, true);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // const betaUsers = process.env.BETA_USERS?.split(",");
    // if (!betaUsers?.includes(user.email)) {
    //   return NextResponse.json({ error: 'Currently only available for beta users' }, { status: 401 });
    // }

    const { profile, jobDescription, model = "anthropic/claude-3.5-sonnet", customApiKey } = await request.json();

    const expectedCost = calculateCreditCost('COVER_LETTER_GENERATE', model);
    const isByok = !!customApiKey;

    if (!profile || !jobDescription) {
      return NextResponse.json({ error: 'Missing profile or job description' }, { status: 400 });
    }

    // 0. Enforce BYOK Limits
    if (isByok) {
       const { tier } = await getUserTier();
       if (tier === 'free') {
          return NextResponse.json({ error: 'Bring-Your-Own-Key is only available on the Accelerator plan.' }, { status: 403 });
       }
    }

    // Secure decrement: atomic check and deduction BEFORE AI call (SKIP if BYOK)
    if (!isByok && expectedCost > 0) {
      const { data: success, error: deductError } = await supabase.rpc('deduct_ai_credits' as any, {
        target_user_id: user.id,
        amount: expectedCost,
        p_action: 'cv_tailor',
        p_metadata: { model }
      });

      if (deductError || !success) {
        console.warn('[AI Tailor] Insufficient credits or deduct error:', deductError);
        return NextResponse.json({ error: `Not enough AI Credits. This action requires ${expectedCost} credits.` }, { status: 402 });
      }
    }

    const userPrompt = `
USER CAREER DATA:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please tailor this CV data to the job description above.
`;

    try {
      const result = await callOpenRouter(
        TAILOR_SYSTEM_PROMPT,
        userPrompt,
        model,
        { 
          userId: user.id,
          customApiKey: customApiKey
        }
      );

      const tailoredData = parseAIJSON(result.text);

      return NextResponse.json({ success: true, tailoredData });
    } catch (aiError: any) {
      console.error('[AI Tailor] OpenRouter error, refunding credits:', aiError);
      
      // Refund credits using service role since user cannot call increment_ai_credits
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      if (!isByok && expectedCost > 0) {
        await supabaseAdmin.rpc('increment_ai_credits' as any, {
          target_user_id: user.id,
          amount: expectedCost,
          p_action: 'refund_cv_tailor',
          p_metadata: { aiError: aiError.message }
        });
      }
      
      throw aiError;
    }

  } catch (err: any) {
    console.error('[AI Tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
