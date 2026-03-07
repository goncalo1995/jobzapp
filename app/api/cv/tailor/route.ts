import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { callOpenRouter, parseAIJSON } from '@/lib/openrouter';
import { CHAT_MODELS } from '@/lib/ai-config';

import { TAILOR_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(request: Request) {
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

    const modelConfig = CHAT_MODELS[model as keyof typeof CHAT_MODELS];
    const expectedCost = modelConfig?.credits ?? 2;
    const isByok = !!customApiKey;

    if (!profile || !jobDescription) {
      return NextResponse.json({ error: 'Missing profile or job description' }, { status: 400 });
    }

    // Secure decrement: atomic check and deduction BEFORE AI call (SKIP if BYOK)
    if (!isByok) {
      const { data: success, error: deductError } = await supabase.rpc('deduct_ai_credits' as any, {
        target_user_id: user.id,
        amount: expectedCost
      });

      if (deductError || !success) {
        console.warn('[AI Tailor] Insufficient credits or deduct error:', deductError);
        return NextResponse.json({ error: `Not enough AI Credits. This model requires ${expectedCost} credits.` }, { status: 402 });
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
      
      await supabaseAdmin.rpc('increment_ai_credits' as any, {
        user_id: user.id,
        amount: expectedCost
      });
      
      throw aiError;
    }

  } catch (err: any) {
    console.error('[AI Tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
