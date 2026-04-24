import { NextResponse } from 'next/server';
import { insertAssessmentResponse, updateAssessmentEmail } from '@/lib/persistence';
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

    const body = (await request.json()) as {
      email?: string;
      existingResponseId?: string | null;
      submission?: FitCheckSubmission;
    };

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 },
      );
    }

    if (body.existingResponseId) {
      const updateResult = await updateAssessmentEmail(body.existingResponseId, email);
      if (updateResult.success) {
        return NextResponse.json(updateResult);
      }
    }

    if (!isValidSubmission(body.submission)) {
      return NextResponse.json(
        { success: false, error: 'Missing assessment payload for email fallback save.' },
        { status: 400 },
      );
    }

    const insertResult = await insertAssessmentResponse(body.submission, email);
    return NextResponse.json(insertResult, {
      status: insertResult.success ? 200 : 500,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process email capture.' },
      { status: 500 },
    );
  }
}
