// lib/ai-parsing.ts
import { callOpenRouter, parseAIJSON } from './openrouter';

const PARSING_SYSTEM_PROMPT = `
You are an expert career data extractor. Your task is to take a "raw brain dump" of someone's career (could be a resume, a bio, or just notes) and extract structured information into a clean JSON format.

The JSON should follow this structure:
{
  "full_name": "string",
  "current_role": "string",
  "summary": "string",
  "skills": ["string"],
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
      "period": "string"
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

Be concise. If information is missing, leave it as null or an empty array. Do not hallucinate.
`;

export async function parseCareerBio(rawBio: string, userId: string) {
  const result = await callOpenRouter(
    PARSING_SYSTEM_PROMPT,
    `Extract career data from this text:\n\n${rawBio}`,
    'claude-3-5-sonnet',
    { userId }
  );

  return parseAIJSON(result.text);
}
