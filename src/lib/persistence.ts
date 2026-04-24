import { calculateFitCheckResult } from '@/lib/scoring/fit-check';
import { createSupabaseServerClient, getSupabaseConfigError } from '@/lib/supabase';
import { type FitCheckSubmission } from '@/lib/types/fit-check';
import {
  type AssessmentListResult,
  type AssessmentPersistenceResult,
  type AssessmentResponseFilters,
  type AssessmentResponseInsert,
  type AssessmentResponseRecord,
} from '@/types/assessment';

const TABLE_NAME = 'assessment_responses';

function logPersistenceError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[persistence:${scope}]`, error);
  }
}

export function buildAssessmentInsert(
  submission: FitCheckSubmission,
  email?: string,
): AssessmentResponseInsert {
  // Recalculate the result on the server so persistence never depends on client-computed output.
  const result = calculateFitCheckResult(submission.answers);

  return {
    respondent_role: submission.metadata.respondentRole || null,
    target_industry: submission.metadata.targetIndustry || null,
    asset_category: submission.metadata.assetCategory || null,
    company_size: submission.metadata.companySize || null,
    source: submission.tracking.source || null,
    utm_source: submission.tracking.utmSource || null,
    utm_medium: submission.tracking.utmMedium || null,
    utm_campaign: submission.tracking.utmCampaign || null,
    answers_json: submission.answers,
    total_fit_score: result.totalFitScore,
    recommended_stage: result.recommendedStage.title,
    dominant_value_driver: result.dominantValueDriver.label,
    strengths_json: result.strengths,
    blockers_json: result.blockers,
    interpretation: result.interpretation,
    next_step: result.nextStep,
    avoid_for_now: result.avoidForNow,
    email: email?.trim() || null,
  };
}

export async function insertAssessmentResponse(
  submission: FitCheckSubmission,
  email?: string,
): Promise<AssessmentPersistenceResult> {
  const supabase = createSupabaseServerClient({
    // Prefer the service role key on the server if you add it later.
    admin: true,
  });
  if (!supabase) {
    return {
      success: false,
      error: getSupabaseConfigError() ?? 'Supabase is not configured.',
    };
  }

  try {
    const payload = buildAssessmentInsert(submission, email);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    logPersistenceError('insert', error);
    return {
      success: false,
      error: 'Failed to save assessment response.',
    };
  }
}

export async function updateAssessmentEmail(
  responseId: string,
  email: string,
): Promise<AssessmentPersistenceResult> {
  const supabase = createSupabaseServerClient({
    admin: true,
  });
  if (!supabase) {
    return {
      success: false,
      error: getSupabaseConfigError() ?? 'Supabase is not configured.',
    };
  }

  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ email: email.trim() })
      .eq('id', responseId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      id: responseId,
    };
  } catch (error) {
    logPersistenceError('email-update', error);
    return {
      success: false,
      error: 'Failed to update assessment email.',
    };
  }
}

export async function listAssessmentResponses(
  filters: AssessmentResponseFilters = {},
): Promise<AssessmentListResult> {
  const supabase = createSupabaseServerClient({
    // Prefer service role on the server if you add it later for internal admin usage.
    admin: true,
  });

  if (!supabase) {
    return {
      data: [],
      error: getSupabaseConfigError() ?? 'Supabase is not configured.',
    };
  }

  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (filters.recommendedStage) {
      query = query.eq('recommended_stage', filters.recommendedStage);
    }

    if (filters.targetIndustry) {
      query = query.ilike('target_industry', filters.targetIndustry);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      data: (data ?? []) as AssessmentResponseRecord[],
    };
  } catch (error) {
    logPersistenceError('list', error);
    return {
      data: [],
      error: 'Failed to load assessment responses.',
    };
  }
}
