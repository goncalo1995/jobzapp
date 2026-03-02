import { adminSupabase } from './supabase/admin';

export interface ChatModel {
  id: string;
  pricing: {
    input: number;
    output: number;
  };
}

export const CHAT_MODELS: Record<string, ChatModel> = {
  'claude-3-5-haiku': {
    id: 'anthropic/claude-3.5-haiku',
    pricing: { input: 0.8 / 1000000, output: 4.0 / 1000000 }
  },
  'claude-4-5-haiku': {
    id: 'anthropic/claude-haiku-4.5',
    pricing: { input: 1.0 / 1000000, output: 5.0 / 1000000 }
  },
  'claude-3-5-sonnet': {
    id: 'anthropic/claude-3.5-sonnet',
    pricing: { input: 3.0 / 1000000, output: 30.0 / 1000000 }
  },
  'claude-4-sonnet': {
    id: 'anthropic/claude-sonnet-4',
    pricing: { input: 3.0 / 1000000, output: 15.0 / 1000000 }
  },
  'claude-4-6-sonnet': {
    id: 'anthropic/claude-sonnet-4.6',
    pricing: { input: 6.0 / 1000000, output: 15.0 / 1000000 }
  },
  'sonar-pro': {
    id: 'perplexity/sonar-pro',
    pricing: { input: 3.0 / 1000000, output: 15.0 / 1000000 }
  }
};

export interface AIServiceMetadata {
  userId?: string | null;
  roastId?: string;
}

export async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  modelKey: keyof typeof CHAT_MODELS = 'claude-3-5-haiku',
  metadata?: AIServiceMetadata,
  jsonMode: boolean = true
) {
  if (!process.env.OPENROUTER_API_KEY) {
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };

  // Use actual cost from OpenRouter if available, otherwise fallback to manual estimate
  const cost = usage.cost || (usage.prompt_tokens * model.pricing.input) + (usage.completion_tokens * model.pricing.output);
  if (!usage.cost) {
    console.warn('[OpenRouter] Actual Cost not provided by API, using manual estimate:', cost, usage);
  }

  // adminSupabase.from('api_usage').insert({
  //   user_id: metadata?.userId || null,
  //   roast_id: metadata?.roastId || null,
  //   platform: 'openrouter',
  //   model: model.id,
  //   tokens_input: usage.prompt_tokens,
  //   tokens_output: usage.completion_tokens,
  //   cost_estimate: cost,
  // }).then(({ error }) => {
  //   if (error) console.error('[OpenRouter] Failed to log API usage:', error);
  // });

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
