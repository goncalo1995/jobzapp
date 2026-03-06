// app/api/cv/tailor/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callOpenRouter, parseAIJSON } from '@/lib/openrouter';

import { TAILOR_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('ai_credits')
      .eq('id', user.id)
      .single();

    if (!userProfile || (userProfile.ai_credits ?? 0) < 1) {
      return NextResponse.json({ error: 'Not enough AI Credits. Please purchase a plan or top-up.' }, { status: 402 });
    }

    const { profile, jobDescription } = await request.json();

    if (!profile || !jobDescription) {
      return NextResponse.json({ error: 'Missing profile or job description' }, { status: 400 });
    }

    const userPrompt = `
USER CAREER DATA:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please tailor this CV data to the job description above.
`;

    const result = await callOpenRouter(
      TAILOR_SYSTEM_PROMPT,
      userPrompt,
      'claude-3-5-sonnet',
      { userId: user.id }
    );

    const tailoredData = parseAIJSON(result.text);

    // Deduct credit
    await supabase
      .from('user_profiles')
      .update({ ai_credits: (userProfile.ai_credits ?? 0) - 1 })
      .eq('id', user.id);

    return NextResponse.json({ success: true, tailoredData });
  } catch (err: any) {
    console.error('[AI Tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
