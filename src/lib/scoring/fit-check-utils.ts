import { VALUE_DRIVERS } from '@/lib/data/fit-check';
import { type ValueDriver } from '@/lib/types/fit-check';

export function normalizeFourPointScore(value: number): number {
  const clamped = Math.min(Math.max(value, 1), 4);
  return Math.round(((clamped - 1) / 3) * 100);
}

export function averageScores(scores: number[]): number {
  if (scores.length === 0) {
    return 0;
  }

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

export function weightedAverageScore(
  scores: Array<{ score: number; weight: number }>,
): number {
  const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }

  const weightedSum = scores.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

export function getStageLevelFromScore(totalFitScore: number): number {
  if (totalFitScore < 35) {
    return 0;
  }
  if (totalFitScore <= 54) {
    return 1;
  }
  if (totalFitScore <= 74) {
    return 2;
  }
  return 3;
}

export function getValueDriverFromAnswer(value: number): ValueDriver {
  return VALUE_DRIVERS[value] ?? VALUE_DRIVERS[1];
}

export function getValueDriverScore(value: number): number {
  const scoreMap: Record<number, number> = {
    1: 92,
    2: 88,
    3: 84,
    4: 68,
    5: 95,
    6: 58,
  };

  return scoreMap[value] ?? 50;
}
