import { STAGE_CONTENT } from '@/lib/data/fit-check';
import {
  type FitCheckAnswers,
  type InsightItem,
  type ScoreGroupBreakdown,
  type ServitizationStageId,
  type ValueDriver,
} from '@/lib/types/fit-check';
import { normalizeFourPointScore } from '@/lib/scoring/fit-check-utils';

function getPositiveScore(value: number) {
  return normalizeFourPointScore(value);
}

function getNegativeScore(value: number) {
  return 100 - normalizeFourPointScore(value);
}

export function getStrengths(answers: FitCheckAnswers): InsightItem[] {
  return [
    { label: 'High operational criticality', score: getPositiveScore(answers.Q1) },
    { label: 'Severe underperformance consequences', score: getPositiveScore(answers.Q3) },
    { label: 'Strong CapEx-to-OpEx need', score: getPositiveScore(answers.Q6) },
    { label: 'Strong service capability', score: getPositiveScore(answers.Q7) },
    { label: 'Strong monitoring / measurability', score: getPositiveScore(answers.Q8) },
    { label: 'Predictable maintenance profile', score: getPositiveScore(answers.Q9) },
    { label: 'Standardized / redeployable asset', score: getPositiveScore(answers.Q10) },
    { label: 'Strong risk / contract readiness', score: getPositiveScore(answers.Q11) },
    { label: 'Strong pilot business case', score: getPositiveScore(answers.Q12) },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function getBlockers(answers: FitCheckAnswers): InsightItem[] {
  return [
    { label: 'Weak operational criticality', score: getNegativeScore(answers.Q1) },
    { label: 'Low financial motive for EaaS', score: getNegativeScore(answers.Q6) },
    { label: 'Weak service capability', score: getNegativeScore(answers.Q7) },
    { label: 'Poor measurability', score: getNegativeScore(answers.Q8) },
    { label: 'Unpredictable maintenance', score: getNegativeScore(answers.Q9) },
    { label: 'Asset too customized', score: getNegativeScore(answers.Q10) },
    {
      label: 'Weak risk absorption / contract readiness',
      score: getNegativeScore(answers.Q11),
    },
    { label: 'Weak business case', score: getNegativeScore(answers.Q12) },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function getValueDriverAdvice(valueDriver: ValueDriver): {
  why: string;
  next: string;
} {
  switch (valueDriver.id) {
    case 'availability_uptime':
      return {
        why: 'The dominant value driver is uptime continuity, which makes proactive service and measurable performance logic more relevant.',
        next: 'Center the pilot around uptime assurance, proactive interventions, and continuity metrics.',
      };
    case 'production_effectiveness':
      return {
        why: 'The value case is tied to throughput and efficiency, which supports access-based or performance-led offers when delivery conditions are strong.',
        next: 'Test a pilot around throughput, cycle efficiency, or utilization improvement on one controlled use case.',
      };
    case 'output_quality':
      return {
        why: 'Process stability and output quality matter most here, so service logic should focus on measured operating consistency.',
        next: 'Design the pilot around quality stability, process tuning, and measured service interventions.',
      };
    case 'cost_efficiency':
      return {
        why: 'The case is primarily economic, so the strongest EaaS angle is predictable lifecycle cost and staged service expansion.',
        next: 'Lead with lifecycle-cost visibility, maintenance predictability, and staged contract packaging.',
      };
    case 'safety_compliance':
      return {
        why: 'Safety and compliance raise the value of monitored obligations and controlled service delivery.',
        next: 'Pilot monitored compliance support with explicit audit, traceability, and service-governance commitments.',
      };
    case 'technical_support_ease':
      return {
        why: 'The strongest customer need is support and ease of operation, which typically favors product-oriented services first.',
        next: 'Prioritize remote diagnostics, operator support, training, and structured response workflows before heavier models.',
      };
  }
}

function getScoreNarrative(scores: ScoreGroupBreakdown): string {
  const strongestGroup = [
    { label: 'customer context', score: scores.customerContextScore },
    { label: 'operational value at stake', score: scores.valuePainScore },
    { label: 'delivery feasibility', score: scores.deliveryFeasibilityScore },
    {
      label: 'implementation readiness',
      score: scores.implementationReadinessScore,
    },
  ].sort((a, b) => b.score - a.score)[0];

  const weakestGroup = [
    { label: 'customer context', score: scores.customerContextScore },
    { label: 'operational value at stake', score: scores.valuePainScore },
    { label: 'delivery feasibility', score: scores.deliveryFeasibilityScore },
    {
      label: 'implementation readiness',
      score: scores.implementationReadinessScore,
    },
  ].sort((a, b) => a.score - b.score)[0];

  return `Your strongest score area is ${strongestGroup.label}, while the main limiting factor is ${weakestGroup.label}.`;
}

export function getAdviceContent(
  stageId: ServitizationStageId,
  valueDriver: ValueDriver,
  scores: ScoreGroupBreakdown,
): {
  interpretation: string;
  whyThisResult: string;
  nextStep: string;
  avoidForNow: string;
} {
  const stageContent = STAGE_CONTENT[stageId];
  const driverAdvice = getValueDriverAdvice(valueDriver);
  const scoreNarrative = getScoreNarrative(scores);

  return {
    interpretation: stageContent.interpretation,
    whyThisResult: `${driverAdvice.why} ${scoreNarrative}`,
    nextStep: `${stageContent.nextStep} ${driverAdvice.next}`,
    avoidForNow: stageContent.avoidForNow,
  };
}
