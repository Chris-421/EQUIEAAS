import { type FitCheckAnswers, type ScoreGroupBreakdown } from '@/lib/types/fit-check';

interface OverrideResult {
  level: number;
  explanation?: string;
}

export function applyStageOverrides(
  baseLevel: number,
  answers: FitCheckAnswers,
  scores: ScoreGroupBreakdown,
): OverrideResult {
  let level = baseLevel;
  const explanations: string[] = [];

  if (answers.Q8 <= 2 && level > 2) {
    level = 2;
    explanations.push('Monitoring and value verification are not yet strong enough for outcome-based models.');
  }

  if (answers.Q7 <= 2 && level > 1) {
    level = 1;
    explanations.push('Current service capability is too limited for use-oriented or result-oriented models.');
  }

  if ((answers.Q11 <= 2 || answers.Q12 <= 2) && level > 2) {
    level = 2;
    explanations.push('Risk readiness and pilot-case quality are not yet strong enough for result-oriented contracts.');
  }

  if (answers.Q10 <= 2 && baseLevel === 3 && level > 2) {
    level = 2;
    explanations.push('Asset customization and redeployability limit immediate readiness for result-oriented scale.');
  }

  const coreDeliveryStrong = answers.Q7 >= 3 && answers.Q8 >= 3 && answers.Q9 >= 3;
  if (answers.Q10 === 1 && level === 2 && !coreDeliveryStrong) {
    level = 1;
    explanations.push('A highly customized asset profile makes use-oriented models premature at this stage.');
  }

  const allOtherScoresVeryStrong =
    scores.customerContextScore >= 75 &&
    scores.valuePainScore >= 75 &&
    scores.deliveryFeasibilityScore >= 75 &&
    scores.implementationReadinessScore >= 75;

  if (answers.Q4 === 6 && answers.Q8 <= 3 && level > 1 && !allOtherScoresVeryStrong) {
    level = 1;
    explanations.push('When the main value is support and ease of operation, product-oriented services are the better near-term fit.');
  }

  const canSupportResultModel =
    (answers.Q4 === 1 || answers.Q4 === 2) &&
    answers.Q8 >= 3 &&
    answers.Q9 >= 3 &&
    answers.Q11 >= 3 &&
    answers.Q12 >= 3;

  if (!canSupportResultModel && answers.Q4 !== 6 && explanations.length === 0) {
    return { level };
  }

  return {
    level,
    explanation: explanations.length > 0 ? explanations[0] : undefined,
  };
}
