import { CHAT_MODELS } from './ai-config';

export const CREDIT_COSTS = {
  RESUME_UPLOAD_PARSE: 0, 
  CV_GENERATE: 5,
  INTERVIEW_PREP_GENERATE: 5,
  ENHANCE_CURRENT_BULLET: 1,
  // Adjust these as business needs dictate
};

// Returns base cost or 0 if free tier or unknown action
export const getActionCost = (action: keyof typeof CREDIT_COSTS) => {
  return CREDIT_COSTS[action] || 0;
};

// Calculates the final cost blending the action complexity with the chosen model premium
export const calculateCreditCost = (action: keyof typeof CREDIT_COSTS, modelId?: string) => {
  const baseCost = getActionCost(action);
  if (baseCost === 0) return 0; // Free actions remain free regardless of model
  
  if (!modelId) return baseCost;
  
  const model = CHAT_MODELS[modelId];
  if (!model) return baseCost;

  return baseCost * model.credits;
};
