export type AudienceType = 'oem' | 'service_provider' | 'other';

export type SectionKey =
  | 'customer_context'
  | 'operational_value'
  | 'service_delivery'
  | 'implementation_feasibility';

export type ServitizationStageId =
  | 'pure_product'
  | 'product_oriented_services'
  | 'use_oriented_services'
  | 'result_oriented_services';

export type QuestionId =
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'Q5'
  | 'Q6'
  | 'Q7'
  | 'Q8'
  | 'Q9'
  | 'Q10'
  | 'Q11'
  | 'Q12';

export type AnswerValue = 1 | 2 | 3 | 4 | 5 | 6;

export type ValueDriverId =
  | 'availability_uptime'
  | 'production_effectiveness'
  | 'output_quality'
  | 'cost_efficiency'
  | 'safety_compliance'
  | 'technical_support_ease';

export interface QuestionOption {
  value: AnswerValue;
  label: string;
}

export interface FitCheckQuestion {
  id: QuestionId;
  index: number;
  section: SectionKey;
  prompt: string;
  options: QuestionOption[];
}

export type FitCheckAnswers = Record<QuestionId, AnswerValue>;

export interface FitCheckMetadata {
  respondentRole: string;
  targetIndustry: string;
  assetCategory: string;
  companySize: string;
}

export interface FitCheckTracking {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export interface FitCheckSubmission {
  audience: AudienceType;
  metadata: FitCheckMetadata;
  tracking: FitCheckTracking;
  answers: FitCheckAnswers;
  completedAt: string;
  persistedResponseId?: string | null;
  persistenceStatus?: 'idle' | 'saved' | 'failed';
}

export interface ServitizationStage {
  id: ServitizationStageId;
  level: number;
  title: string;
}

export interface InsightItem {
  label: string;
  score: number;
}

export interface ScoreGroupBreakdown {
  customerContextScore: number;
  valuePainScore: number;
  deliveryFeasibilityScore: number;
  implementationReadinessScore: number;
}

export interface ValueDriver {
  id: ValueDriverId;
  label: string;
}

export interface FitCheckResult extends ScoreGroupBreakdown {
  totalFitScore: number;
  recommendedStage: ServitizationStage;
  stageLevelBeforeOverrides: number;
  stageLevelAfterOverrides: number;
  dominantValueDriver: ValueDriver;
  strengths: InsightItem[];
  blockers: InsightItem[];
  interpretation: string;
  whyThisResult: string;
  nextStep: string;
  avoidForNow: string;
  overrideExplanation?: string;
}
