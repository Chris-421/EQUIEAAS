'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DiagnosticShell,
  MaterialSymbol,
} from '@/components/fit-check/diagnostic-chrome';

const CREDIBILITY_POINTS = [
  { icon: 'schedule', label: 'Takes 3-4 minutes' },
  { icon: 'fact_check', label: 'Research-based structured diagnostic' },
  { icon: 'analytics', label: 'Tailored advice, not just a score' },
];

interface LandingViewProps {
  fitCheckHref: string;
}

export function LandingView({ fitCheckHref }: LandingViewProps) {

  return (
    <DiagnosticShell mainClassName="justify-center px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-[980px]">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-10"
        >
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-outline">
              EQUI Diagnostic Suite
            </p>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
              Is EaaS right for your business?
            </h1>
            <p className="max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
              Evaluate your readiness for Equipment-as-a-Service and discover the
              optimal service model for your equipment business.
            </p>
          </div>

          <div>
            <Button
              asChild
              size="lg"
              className="bg-blue-700 border-blue-700 hover:bg-blue-600 hover:border-blue-600"
            >
              <Link href={fitCheckHref}>
                Start the Fit Check
                <MaterialSymbol icon="arrow_forward" className="text-base" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 border-t border-surface-container-high pt-8 sm:grid-cols-3">
            {CREDIBILITY_POINTS.map((point, index) => (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.28 }}
                className="flex flex-col gap-1"
              >
                <MaterialSymbol icon={point.icon} className="text-xl text-secondary" />
                <span className="text-sm text-on-secondary-container">{point.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </DiagnosticShell>
  );
}
