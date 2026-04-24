'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updateFitCheckSubmission } from '@/lib/storage/fit-check';
import { type FitCheckSubmission } from '@/lib/types/fit-check';

interface EmailCaptureProps {
  submission: FitCheckSubmission;
}

export function EmailCapture({ submission }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/assessment/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          existingResponseId: submission.persistedResponseId,
          submission,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        id?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        setError(payload.error ?? 'Unable to save your email right now.');
        setSubmitting(false);
        return;
      }

      updateFitCheckSubmission((current) => ({
        ...current,
        persistedResponseId: payload.id ?? current.persistedResponseId ?? null,
        persistenceStatus: 'saved',
      }));

      setSubmitted(true);
    } catch {
      setError('Unable to save your email right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card px-8 py-10 md:px-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <CardHeader className="p-0 md:max-w-lg">
          <CardTitle className="text-3xl text-white">Send me my result summary</CardTitle>
          <CardDescription className="mt-3 text-base text-on-surface-variant">
            Optional. Add your work email and we will attach it to the assessment record you
            just completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-md p-0">
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-primary/30 bg-primary/10 px-4 py-4 text-sm text-white"
            >
              Thanks. Your result summary request has been recorded.
            </motion.p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label
                htmlFor="results-email"
                className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant"
              >
                Work Email
              </label>
              <Input
                id="results-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="border-x-0 border-t-0 px-0 text-white placeholder:text-zinc-600 focus:border-primary"
              />
              {error ? (
                <p className="text-sm text-[#FFD600]">{error}</p>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  We only use this to connect your summary to the assessment you just completed.
                </p>
              )}
              <Button type="submit" className="self-start" disabled={submitting}>
                {submitting ? 'Saving...' : 'Send Me My Result Summary'}
              </Button>
            </form>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
