'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedScore } from '@/components/fit-check/animated-score';
import {
  DiagnosticShell,
  MaterialSymbol,
} from '@/components/fit-check/diagnostic-chrome';
import { EmailCapture } from '@/components/fit-check/email-capture';
import { StageContinuum } from '@/components/fit-check/stage-continuum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AUDIENCE_OPTIONS } from '@/lib/data/fit-check';
import { calculateFitCheckResult } from '@/lib/scoring/fit-check';
import { loadFitCheckSubmission } from '@/lib/storage/fit-check';
import { type FitCheckSubmission } from '@/lib/types/fit-check';

function getAudienceLabel(audience: FitCheckSubmission['audience']) {
  return AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label ?? 'Other';
}

function getMetadataRows(submission: FitCheckSubmission) {
  return [
    { label: 'Business Type', value: getAudienceLabel(submission.audience) },
    { label: 'Respondent Role', value: submission.metadata.respondentRole },
    { label: 'Target Industry', value: submission.metadata.targetIndustry },
    { label: 'Asset Category', value: submission.metadata.assetCategory },
    { label: 'Company Size', value: submission.metadata.companySize },
  ].filter((item) => item.value);
}

export default function FitCheckResultsPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<FitCheckSubmission | null>(null);

  useEffect(() => {
    const payload = loadFitCheckSubmission();

    if (!payload) {
      router.replace('/fit-check');
      return;
    }

    setSubmission(payload);
  }, [router]);

  const result = useMemo(() => {
    if (!submission) {
      return null;
    }
    return calculateFitCheckResult(submission.answers);
  }, [submission]);

  if (!result || !submission) {
    return null;
  }

  const metadataRows = getMetadataRows(submission);

  return (
    <DiagnosticShell mainClassName="px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 md:gap-16">
        <section className="relative overflow-hidden border-b border-border pb-10 md:pb-14">
          <div className="absolute inset-0 bg-industrial-glow opacity-90" />
          <div className="absolute right-0 top-0 h-40 w-40 bg-[#FFD600]/10 blur-3xl" />
          <div className="absolute left-0 top-10 h-48 w-48 bg-blue-700/10 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-outline">
                Diagnostic Results
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
                Your Best Current Fit: <span className="text-primary">{result.recommendedStage.title}</span>
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                {result.interpretation}
              </p>
            </div>
            <div className="w-full border border-blue-700/40 bg-gradient-to-br from-blue-700/25 via-primary/15 to-[#FFD600]/10 px-5 py-5 shadow-panel sm:w-auto sm:px-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-outline">
                Total Fit Score
              </p>
              <p className="mt-2 text-4xl font-semibold leading-none text-white sm:text-5xl">
                <AnimatedScore value={result.totalFitScore} />
                <span className="text-lg text-on-surface-variant">/100</span>
              </p>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="h-full border-blue-700/20 bg-gradient-to-br from-card via-card to-blue-700/15 p-6 sm:p-8">
              <CardHeader className="border-b border-border p-0 pb-5 sm:pb-6">
                <div className="flex items-center gap-4">
                  <MaterialSymbol icon="analytics" className="text-3xl text-blue-700" />
                  <div>
                    <CardTitle className="text-2xl text-white sm:text-3xl">Recommended Stage</CardTitle>
                    <CardDescription className="mt-2 text-base text-on-surface-variant">
                      Deterministic recommendation based on customer context, value at stake, delivery feasibility, and implementation readiness.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-0 pt-6 sm:pt-8">
                <StageContinuum activeLevel={result.stageLevelAfterOverrides} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-b border-border pb-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                      Interpretation
                    </p>
                    <p className="mt-2 text-base leading-7 text-white">{result.interpretation}</p>
                  </div>
                  <div className="border-b border-border pb-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                      Dominant Value Driver
                    </p>
                    <p className="mt-2 text-base leading-7 text-blue-700">
                      {result.dominantValueDriver.label}
                    </p>
                  </div>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Why This Result
                  </p>
                  <p className="mt-2 text-base leading-7 text-on-surface">
                    {result.whyThisResult}
                  </p>
                </div>
                {result.overrideExplanation ? (
                  <p className="text-sm leading-7 text-on-surface-variant">
                    {result.overrideExplanation}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card className="h-full border-[#FFD600]/20 bg-gradient-to-br from-card to-[#FFD600]/10 p-6 sm:p-8">
              <CardHeader className="border-b border-border p-0 pb-5 sm:pb-6">
                <div className="flex items-center gap-4">
                  <MaterialSymbol icon="tune" className="text-3xl text-[#FFD600]" />
                  <CardTitle className="text-2xl text-white sm:text-3xl">Fit Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-0 pt-6 sm:pt-8">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Customer Context
                  </span>
                  <span className="text-base font-semibold text-blue-700">
                    {result.customerContextScore}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Value / Pain
                  </span>
                  <span className="text-base font-semibold text-blue-700">
                    {result.valuePainScore}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Delivery Feasibility
                  </span>
                  <span className="text-base font-semibold text-blue-700">
                    {result.deliveryFeasibilityScore}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Implementation Readiness
                  </span>
                  <span className="text-base font-semibold text-blue-700">
                    {result.implementationReadinessScore}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.3 }}
          >
            <Card className="h-full border-blue-700/20 bg-gradient-to-br from-card to-blue-700/15 p-6 sm:p-8">
              <CardHeader className="border-b border-border p-0 pb-5 sm:pb-6">
                <CardTitle className="text-2xl text-white sm:text-3xl">Top Strengths</CardTitle>
                <CardDescription className="mt-2 text-base text-on-surface-variant">
                  The strongest fit signals currently supporting servitization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0 pt-6 sm:pt-8">
                {result.strengths.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <MaterialSymbol icon="check_box" className="mt-1 text-[#FFD600]" />
                    <p className="text-base leading-7 text-on-surface">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
          >
            <Card className="h-full border-[#FFD600]/20 bg-gradient-to-br from-card to-[#FFD600]/8 p-6 sm:p-8">
              <CardHeader className="border-b border-border p-0 pb-5 sm:pb-6">
                <CardTitle className="text-2xl text-white sm:text-3xl">Primary Blockers</CardTitle>
                <CardDescription className="mt-2 text-base text-on-surface-variant">
                  The main constraints reducing near-term EaaS readiness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0 pt-6 sm:pt-8">
                {result.blockers.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <MaterialSymbol icon="warning" className="mt-1 text-[#FFD600]" />
                    <p className="text-base leading-7 text-on-surface">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.3 }}
            className="md:col-span-3"
          >
            <Card className="border-blue-700/20 bg-gradient-to-r from-card via-card to-blue-700/15 p-6 sm:p-8">
              <CardHeader className="border-b border-border p-0 pb-5 sm:pb-6">
                <CardTitle className="text-2xl text-white sm:text-3xl">Recommended Next Step</CardTitle>
                <CardDescription className="mt-2 text-base text-on-surface-variant">
                  Deterministic advice based on the current stage fit and dominant value driver.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-0 pt-6 sm:pt-8">
                <div className="border-b border-border pb-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Do Next
                  </p>
                  <p className="mt-2 text-base leading-7 text-blue-700">{result.nextStep}</p>
                </div>
                <div className="border-b border-border pb-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    What Not To Do Yet
                  </p>
                  <p className="mt-2 text-base leading-7 text-white">{result.avoidForNow}</p>
                </div>
                {metadataRows.length > 0 ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                      Captured Context
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {metadataRows.map((item) => (
                        <div key={item.label} className="border border-border bg-surface-container-low px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm text-on-surface">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.3 }}
        >
          <EmailCapture submission={submission} />
        </motion.section>

        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/fit-check">Retake Assessment</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Landing</Link>
          </Button>
        </div>
      </div>
    </DiagnosticShell>
  );
}
