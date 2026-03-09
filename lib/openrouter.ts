import { adminSupabase } from './supabase/admin';

import { CHAT_MODELS, ChatModel } from './ai-config';


export interface AIServiceMetadata {
  userId?: string | null;
  roastId?: string;
  customApiKey?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  modelKey: keyof typeof CHAT_MODELS = 'anthropic/claude-3.5-haiku',
  metadata?: AIServiceMetadata,
  jsonMode: boolean = true
) {
  const apiKey = metadata?.customApiKey || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not found');
  }
  const model = CHAT_MODELS[modelKey];

  if (!model) {
    throw new Error(`Unknown model: ${modelKey}`);
  }

  const body: any = {
    model: model.id,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  };

  if (jsonMode && modelKey !== 'sonar-pro') {
    body.response_format = { type: "json_object" };
  }

  if (metadata?.temperature) {
    body.temperature = metadata.temperature;
  }

  if (metadata?.max_tokens) {
    body.max_tokens = metadata.max_tokens;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[OpenRouter] Error:', errText);
    const message = metadata?.customApiKey && response.status === 401 ? "Please check your API key and try again." : "Could not process your request. Please try again later.";
    throw new Error(message);
    // throw new Error(`OpenRouter error: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };

  // Use actual cost from OpenRouter if available, otherwise fallback to manual estimate
  const cost = usage.cost || (usage.prompt_tokens * model.pricing.input) + (usage.completion_tokens * model.pricing.output);
  if (!usage.cost) {
    console.warn('[OpenRouter] Actual Cost not provided by API, using manual estimate:', cost, usage);
  }

  if (metadata?.userId) {
    adminSupabase.from('api_usage' as any).insert({
      user_id: metadata.userId,
      roast_id: metadata?.roastId || null,
      platform: 'openrouter',
      model: model.id,
      tokens_input: usage.prompt_tokens,
      tokens_output: usage.completion_tokens,
      cost_estimate: cost,
    }).then(({ error }) => {
      if (error) console.error('[OpenRouter] Failed to log API usage:', error);
    });
  }

  return {
    text,
    cost,
    usage
  };
}

export function parseAIJSON<T>(text: string): T {
  const clean = text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    throw new Error(`AI response was not valid JSON: ${text.slice(0, 200)}`);
  }
}
