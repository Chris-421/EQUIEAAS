'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DiagnosticShell } from '@/components/fit-check/diagnostic-chrome';
import {
  loadFitCheckSubmission,
  updateFitCheckSubmission,
} from '@/lib/storage/fit-check';

export default function FitCheckAnalyzingPage() {
  const router = useRouter();

  useEffect(() => {
    const submission = loadFitCheckSubmission();
    if (!submission) {
      router.replace('/fit-check');
      return;
    }

    let active = true;

    const persistAssessment = async () => {
      if (submission.persistenceStatus === 'saved' && submission.persistedResponseId) {
        return;
      }

      try {
        const response = await fetch('/api/assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submission }),
        });

        const payload = (await response.json()) as {
          success?: boolean;
          id?: string;
        };

        if (!active) {
          return;
        }

        if (response.ok && payload.success && payload.id) {
          updateFitCheckSubmission((current) => ({
            ...current,
            persistedResponseId: payload.id ?? null,
            persistenceStatus: 'saved',
          }));
          return;
        }

        updateFitCheckSubmission((current) => ({
          ...current,
          persistenceStatus: 'failed',
        }));
      } catch {
        if (!active) {
          return;
        }

        updateFitCheckSubmission((current) => ({
          ...current,
          persistenceStatus: 'failed',
        }));
      }
    };

    void persistAssessment();

    const timeout = window.setTimeout(() => {
      router.push('/fit-check/results');
    }, 2200);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [router]);

  return (
    <DiagnosticShell
      headerFixed
      footerFixed
      mainClassName="items-center justify-center px-6 py-12 md:px-12"
    >
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-8 text-center">
        <div className="relative mb-2 flex h-[140px] w-[140px] items-center justify-center sm:mb-4 sm:h-[180px] sm:w-[180px]">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-[#333333]"
              cx="50"
              cy="50"
              fill="none"
              r="48"
              strokeWidth="0.5"
            />
          </svg>
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-[#333333]"
              cx="50"
              cy="50"
              fill="none"
              r="40"
              strokeWidth="2"
            />
            <motion.circle
              className="stroke-[#3b82f6]"
              cx="50"
              cy="50"
              fill="none"
              r="40"
              strokeWidth="2"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 85 }}
              transition={{ duration: 1.9, ease: 'easeInOut' }}
            />
          </svg>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[#3b82f6]" />
            <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-[#333333]" />
            <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[#333333]" />
            <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[#333333]" />
          </motion.div>
          <div className="flex h-3 w-3 rotate-45 items-center justify-center border border-[#3b82f6]">
            <div className="h-1 w-1 bg-[#3b82f6]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 border border-primary/30 bg-primary/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
            System Processing
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Analyzing your responses...
          </h1>
          <p className="max-w-[640px] text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Comparing your operational and financial profile against our EaaS maturity
            framework.
          </p>
        </div>

        <div className="mt-8 flex gap-2 opacity-40">
          <div className="h-[2px] w-8 bg-primary" />
          <div className="h-[2px] w-8 bg-[#333333]" />
          <div className="h-[2px] w-16 bg-primary" />
          <div className="h-[2px] w-8 bg-[#333333]" />
          <div className="h-[2px] w-4 bg-primary" />
        </div>
      </div>
    </DiagnosticShell>
  );
}
