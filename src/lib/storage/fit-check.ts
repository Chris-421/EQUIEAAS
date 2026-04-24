import { EMPTY_METADATA, FIT_CHECK_STORAGE_KEY } from '@/lib/data/fit-check';
import { EMPTY_TRACKING } from '@/lib/tracking';
import { type FitCheckSubmission } from '@/lib/types/fit-check';

export function saveFitCheckSubmission(payload: FitCheckSubmission) {
  if (typeof window === 'undefined') {
    return;
  }
  // Session storage keeps the submitted payload available across the analyze/results route transition.
  window.sessionStorage.setItem(FIT_CHECK_STORAGE_KEY, JSON.stringify(payload));
}

export function updateFitCheckSubmission(
  updater: (current: FitCheckSubmission) => FitCheckSubmission,
) {
  const current = loadFitCheckSubmission();
  if (!current) {
    return;
  }

  saveFitCheckSubmission(updater(current));
}

export function loadFitCheckSubmission(): FitCheckSubmission | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(FIT_CHECK_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FitCheckSubmission>;

    if (!parsed.audience || !parsed.answers || !parsed.completedAt) {
      return null;
    }

    return {
      audience: parsed.audience,
      answers: parsed.answers,
      completedAt: parsed.completedAt,
      metadata: {
        ...EMPTY_METADATA,
        ...parsed.metadata,
      },
      tracking: {
        ...EMPTY_TRACKING,
        ...parsed.tracking,
      },
      persistedResponseId: parsed.persistedResponseId ?? null,
      persistenceStatus: parsed.persistenceStatus ?? 'idle',
    };
  } catch {
    return null;
  }
}
