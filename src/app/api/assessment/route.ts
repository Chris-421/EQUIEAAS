import { NextResponse } from 'next/server';
import { insertAssessmentResponse } from '@/lib/persistence';
import { getSupabaseConfigError, getSupabaseRuntimeStatus } from '@/lib/supabase';
import { type FitCheckSubmission } from '@/lib/types/fit-check';

function isValidSubmission(payload: unknown): payload is FitCheckSubmission {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const submission = payload as Partial<FitCheckSubmission>;
  return Boolean(
    submission.audience &&
      submission.answers &&
      submission.metadata &&
      submission.tracking &&
      submission.completedAt,
  );
}

export async function POST(request: Request) {
  try {
    const configError = getSupabaseConfigError();
    if (configError) {
      return NextResponse.json(
        {
          success: false,
          error: configError,
          debug:
            process.env.NODE_ENV !== 'production'
              ? getSupabaseRuntimeStatus()
              : undefined,
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { submission?: FitCheckSubmission };

    if (!isValidSubmission(body.submission)) {
      return NextResponse.json(
        { success: false, error: 'Malformed assessment payload.' },
        { status: 400 },
      );
    }

    const result = await insertAssessmentResponse(body.submission);
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process assessment payload.' },
      { status: 500 },
    );
  }
}
