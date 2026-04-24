import { SERVITIZATION_STAGES } from '@/lib/data/fit-check';
import { getAdviceContent, getBlockers, getStrengths } from '@/lib/scoring/fit-check-insights';
import { applyStageOverrides } from '@/lib/scoring/fit-check-overrides';
import {
  averageScores,
  getStageLevelFromScore,
  getValueDriverFromAnswer,
  getValueDriverScore,
  normalizeFourPointScore,
  weightedAverageScore,
} from '@/lib/scoring/fit-check-utils';
import { type FitCheckAnswers, type FitCheckResult } from '@/lib/types/fit-check';

function getCustomerContextScore(answers: FitCheckAnswers): number {
  return averageScores([
    normalizeFourPointScore(answers.Q1),
    normalizeFourPointScore(answers.Q2),
    normalizeFourPointScore(answers.Q3),
    normalizeFourPointScore(answers.Q6),
  ]);
}

function getValuePainScore(answers: FitCheckAnswers): number {
  return averageScores([
    getValueDriverScore(answers.Q4),
    normalizeFourPointScore(answers.Q5),
  ]);
}

function getDeliveryFeasibilityScore(answers: FitCheckAnswers): number {
  return averageScores([
    normalizeFourPointScore(answers.Q7),
    normalizeFourPointScore(answers.Q8),
    normalizeFourPointScore(answers.Q9),
    normalizeFourPointScore(answers.Q10),
  ]);
}

function getImplementationReadinessScore(answers: FitCheckAnswers): number {
  return averageScores([
    normalizeFourPointScore(answers.Q11),
    normalizeFourPointScore(answers.Q12),
  ]);
}

export function calculateFitCheckResult(answers: FitCheckAnswers): FitCheckResult {
  const customerContextScore = getCustomerContextScore(answers);
  const valuePainScore = getValuePainScore(answers);
  const deliveryFeasibilityScore = getDeliveryFeasibilityScore(answers);
  const implementationReadinessScore = getImplementationReadinessScore(answers);

  const totalFitScore = weightedAverageScore([
    { score: customerContextScore, weight: 25 },
    { score: valuePainScore, weight: 20 },
    { score: deliveryFeasibilityScore, weight: 35 },
    { score: implementationReadinessScore, weight: 20 },
  ]);

  const baseLevel = getStageLevelFromScore(totalFitScore);
  const overrideResult = applyStageOverrides(baseLevel, answers, {
    customerContextScore,
    valuePainScore,
    deliveryFeasibilityScore,
    implementationReadinessScore,
  });

  const dominantValueDriver = getValueDriverFromAnswer(answers.Q4);
  const recommendedStage = SERVITIZATION_STAGES[overrideResult.level];
  const advice = getAdviceContent(recommendedStage.id, dominantValueDriver, {
    customerContextScore,
    valuePainScore,
    deliveryFeasibilityScore,
    implementationReadinessScore,
  });

  return {
    totalFitScore,
    recommendedStage,
    stageLevelBeforeOverrides: baseLevel,
    stageLevelAfterOverrides: overrideResult.level,
    customerContextScore,
    valuePainScore,
    deliveryFeasibilityScore,
    implementationReadinessScore,
    dominantValueDriver,
    strengths: getStrengths(answers),
    blockers: getBlockers(answers),
    interpretation: advice.interpretation,
    whyThisResult: advice.whyThisResult,
    nextStep: advice.nextStep,
    avoidForNow: advice.avoidForNow,
    overrideExplanation: overrideResult.explanation,
  };
}
