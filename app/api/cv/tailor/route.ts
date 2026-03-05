// app/api/cv/tailor/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callOpenRouter, parseAIJSON } from '@/lib/openrouter';

const TAILOR_SYSTEM_PROMPT = `
You are an expert career coach and professional CV writer. 
Your goal is to tailor a user's career data to a specific job description.

INSTRUCTIONS:
1. Rewrite the "summary" to be a compelling 3-5 sentence professional summary focused on the target role.
2. Optimize "experience" bullet points to highlight achievements and skills that match the job description. Use action verbs and quantify where possible.
3. Filter and prioritize "skills" to show the most relevant ones. Group them into logical categories (e.g., "Languages", "Frameworks", "Cloud Platforms").
4. Keep "full_name", "education", and "projects" mostly as is, but you can refine project descriptions if they match the role's tech stack.
5. Strictly return the tailored data in the EXACT same JSON structure as provided.

JSON STRUCTURE:
{
  "full_name": "string",
  "current_role": "string",
  "summary": "string",
  "skills": [{"category": "string", "items": ["string"]}],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "period": "string",
      "points": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "period": "string",
      "points": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "tech_stack": ["string"]
    }
  ]
}

6. CRITICAL: The end result MUST fit in a one-page CV. Be concise, prioritize the most relevant information, and use bullet points effectively.
7. Contact information is provided separately and should NOT be modified by the AI.

Only return the JSON object. Do not add any conversational text.
`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const betaUsers = process.env.BETA_USERS?.split(",");
    if (!betaUsers?.includes(user.email)) {
      return NextResponse.json({ error: 'Currently only available for beta users' }, { status: 401 });
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

    return NextResponse.json({ success: true, tailoredData });
  } catch (err: any) {
    console.error('[AI Tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
