export interface CalibrationAnswers {
  premortem: string;
  fermi: string;
  symmetry: string;
  secondOrder: string;
  inversion: string;
}

export interface ScoreRule {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface ScoreResult {
  score: number;
  label: 'low' | 'elevated' | 'critical';
  firedRules: ScoreRule[];
  totalRules: number;
}

export interface RoastReport {
  verdict: string;
  fatalFlaws: Array<{
    title: string;
    body: string;
    severity: 'fatal' | 'serious' | 'moderate';
  }>;
  termiteMoment: {
    title: string;
    body: string;
  };
  countermeasures: Array<{
    title: string;
    method: string;
    body: string;
  }>;
  survivalScore: number;
  survivalRationale: string;
  closingLine: string;
  tweetableInsight: string;
  riskiestAssumption?: { assumption: string; testThisWeek: string };
  oneFixThisWeek?: { fix: string; howToImplement: string };
  biggestScalingRisk?: { risk: string; fixItNow: string };
  pivotOrPersist?: 'pivot' | 'persist' | 'pivot-with-conditions';
}

// Stored in roasts.result (JSONB column)
export interface StoredRoastResult extends RoastReport {
  skepticismScore: number;
  generatedAt: string;
  pdfBase64: string;
}