import {
  type FitCheckAnswers,
  type FitCheckSubmission,
  type InsightItem,
} from '@/lib/types/fit-check';

export interface AssessmentResponseRecord {
  id: string;
  created_at: string;
  respondent_role: string | null;
  target_industry: string | null;
  asset_category: string | null;
  company_size: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  answers_json: FitCheckAnswers;
  total_fit_score: number;
  recommended_stage: string;
  dominant_value_driver: string | null;
  strengths_json: InsightItem[];
  blockers_json: InsightItem[];
  interpretation: string | null;
  next_step: string | null;
  avoid_for_now: string | null;
  email: string | null;
}

export interface AssessmentResponseInsert {
  respondent_role: string | null;
  target_industry: string | null;
  asset_category: string | null;
  company_size: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  answers_json: FitCheckAnswers;
  total_fit_score: number;
  recommended_stage: string;
  dominant_value_driver: string | null;
  strengths_json: InsightItem[];
  blockers_json: InsightItem[];
  interpretation: string | null;
  next_step: string | null;
  avoid_for_now: string | null;
  email?: string | null;
}

export interface AssessmentResponseFilters {
  recommendedStage?: string;
  targetIndustry?: string;
}

export interface AssessmentPersistenceResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface AssessmentListResult {
  data: AssessmentResponseRecord[];
  error?: string;
}

export interface PersistAssessmentPayload {
  submission: FitCheckSubmission;
  email?: string;
  existingResponseId?: string | null;
}
