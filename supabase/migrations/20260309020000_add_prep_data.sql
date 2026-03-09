-- Add ai_prep_data JSONB array column to interviews
ALTER TABLE public.interviews 
ADD COLUMN IF NOT EXISTS ai_prep_data JSONB[] DEFAULT '{}';

-- Comment to document the structure
COMMENT ON COLUMN public.interviews.ai_prep_data IS 
'Stores an array of AI-generated interview preparation data with structure:
[
  {
    "id": "uuid",
    "created_at": "timestamp",
    "config": {
      "type": "behavioral|technical|case|mixed",
      "difficulty": "standard|hardcore",
      "time": "1hour|1day|1week"
    },
    "companyInsights": "string",
    "roleAnalysis": "string",
    "customFocus": "string",
    "trainingPlan": "string",
    "questions": [
      {
        "type": "behavioral|technical|strategic|case|mixed",
        "question": "string",
        "whyTheyAsk": "string",
        "candidateStrategy": "string",
        "hint": "string",
        "resources": [
          {
            "name": "string",
            "url": "string",
            "type": "leetcode|article|video|book|practice|cheatsheet"
          }
        ]
      }
    ],
    "keyTopics": ["string"],
    "estimatedTime": "string"
  }
]';