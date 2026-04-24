'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AudienceSelector } from '@/components/fit-check/audience-selector';
import {
  DiagnosticShell,
  MaterialSymbol,
} from '@/components/fit-check/diagnostic-chrome';
import { QuestionStep } from '@/components/fit-check/question-step';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EMPTY_METADATA, FIT_CHECK_QUESTIONS, SECTION_LABELS } from '@/lib/data/fit-check';
import { saveFitCheckSubmission } from '@/lib/storage/fit-check';
import { getTrackingFromWindow } from '@/lib/tracking';
import {
  type AnswerValue,
  type AudienceType,
  type FitCheckAnswers,
  type QuestionId,
  type SectionKey,
} from '@/lib/types/fit-check';

const TOTAL_QUESTIONS = FIT_CHECK_QUESTIONS.length;

const SECTION_META: Record<
  SectionKey,
  { order: number; description: string }
> = {
  customer_context: {
    order: 1,
    description:
      'Assess the customer context, the operational criticality of the asset, and the motive for a service-based model.',
  },
  operational_value: {
    order: 2,
    description:
      'Clarify where operational value is really created and what type of pain or consequence is at stake.',
  },
  service_delivery: {
    order: 3,
    description:
      'Check whether your current service model, monitoring capability, and asset profile can support delivery.',
  },
  implementation_feasibility: {
    order: 4,
    description:
      'Test whether the business can realistically absorb risk and pilot a credible commercial offer.',
  },
};

type PartialAnswers = Partial<Record<QuestionId, AnswerValue>>;

function toCompleteAnswers(answers: PartialAnswers): FitCheckAnswers | null {
  const complete = {} as FitCheckAnswers;

  for (const question of FIT_CHECK_QUESTIONS) {
    const value = answers[question.id];
    if (!value) {
      return null;
    }
    complete[question.id] = value;
  }

  return complete;
}

export default function FitCheckPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<AudienceType | null>(null);
  const [answers, setAnswers] = useState<PartialAnswers>({});

  const currentQuestion = step > 0 ? FIT_CHECK_QUESTIONS[step - 1] : null;
  const progress = step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100);
  const progressLabel = step === 0 ? 'Profile Setup' : `Step ${step} of ${TOTAL_QUESTIONS}`;

  const canContinue = useMemo(() => {
    if (step === 0) {
      return Boolean(audience);
    }
    if (!currentQuestion) {
      return false;
    }
    return Boolean(answers[currentQuestion.id]);
  }, [answers, audience, currentQuestion, step]);

  const currentSectionMeta = currentQuestion
    ? SECTION_META[currentQuestion.section]
    : {
        order: 1,
        description:
          'Capture lightweight context for storage and personalization before scoring begins.',
      };

  const sectionEyebrow = currentQuestion
    ? `Section ${currentSectionMeta.order}: ${SECTION_LABELS[currentQuestion.section]}`
    : 'Section 1: Initial Profiling';

  const sectionTitle = currentQuestion ? SECTION_LABELS[currentQuestion.section] : 'Set the context';

  const sectionDescription = currentSectionMeta.description;

  const handleAnswerChange = (questionId: QuestionId, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleBack = () => {
    if (step === 0) {
      router.push('/');
      return;
    }

    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    if (step < TOTAL_QUESTIONS) {
      setStep((prev) => prev + 1);
      return;
    }

    const completeAnswers = toCompleteAnswers(answers);
    if (!completeAnswers || !audience) {
      return;
    }

    saveFitCheckSubmission({
      audience,
      metadata: EMPTY_METADATA,
      tracking: getTrackingFromWindow(),
      answers: completeAnswers,
      completedAt: new Date().toISOString(),
      persistedResponseId: null,
      persistenceStatus: 'idle',
    });

    router.push('/fit-check/analyzing');
  };

  return (
    <DiagnosticShell mainClassName="px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="mb-12 w-full md:mb-16">
          <div className="mb-3 flex items-end justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.22em] text-outline">
              Diagnostic Progress
            </span>
            <span className="text-sm text-on-surface-variant">{progressLabel}</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-14 md:gap-20">
          <section className="flex flex-col gap-8">
            <header className="border-b border-border pb-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-outline">
                {sectionEyebrow}
              </p>
              <h1 className="mt-4 font-serif text-3xl font-medium text-white sm:text-4xl md:text-5xl">
                {sectionTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                {sectionDescription}
              </p>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              {step === 0 ? (
                <motion.div
                  key="audience"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AudienceSelector value={audience} onChange={setAudience} />
                </motion.div>
              ) : currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <QuestionStep
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>

          <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
            <Button variant="outline" onClick={handleBack}>
              <MaterialSymbol icon="arrow_back" className="text-[18px]" />
              {step === 0 ? 'Back to Landing' : 'Back'}
            </Button>
            <Button onClick={handleContinue} disabled={!canContinue}>
              {step === TOTAL_QUESTIONS ? 'Analyze Fit' : 'Next'}
              <MaterialSymbol icon="arrow_forward" className="text-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </DiagnosticShell>
  );
}
