export interface ChatModel {
  id: string;
  name: string;
  credits: number;
  pricing: {
    input: number;
    output: number;
  };
}

export const CHAT_MODELS: Record<string, ChatModel> = {
  'anthropic/claude-3.5-haiku': {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    credits: 1,
    pricing: { input: 0.8 / 1000000, output: 4.0 / 1000000 }
  },
  'anthropic/claude-haiku-4.5': {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude 4.5 Haiku',
    credits: 1,
    pricing: { input: 1.0 / 1000000, output: 5.0 / 1000000 }
  },
  'anthropic/claude-3.5-sonnet': {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    credits: 3,
    pricing: { input: 3.0 / 1000000, output: 30.0 / 1000000 }
  },
  'anthropic/claude-sonnet-4': {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    credits: 2,
    pricing: { input: 3.0 / 1000000, output: 15.0 / 1000000 }
  },
  'anthropic/claude-sonnet-4.6': {
    id: 'anthropic/claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    credits: 3,
    pricing: { input: 6.0 / 1000000, output: 15.0 / 1000000 }
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    credits: 2,
    pricing: { input: 5.0 / 1000000, output: 15.0 / 1000000 }
  },
  'openai/gpt-4o-mini': {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o mini',
    credits: 1,
    pricing: { input: 0.25 / 1000000, output: 1.25 / 1000000 }
  },
  'openai/gpt-5-mini': {
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 mini',
    credits: 1,
    pricing: { input: 0.25 / 1000000, output: 1.25 / 1000000 }
  },
  'google/gemini-2.5-flash': {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    credits: 1,
    pricing: { input: 0.25 / 1000000, output: 1.5 / 1000000 }
  }
};
