'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { type AnswerValue, type FitCheckQuestion } from '@/lib/types/fit-check';
import { cn } from '@/lib/utils';

interface QuestionStepProps {
  question: FitCheckQuestion;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function QuestionStep({ question, value, onChange }: QuestionStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-outline">
          Question {question.index}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
          {question.prompt}
        </h2>
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => {
          const active = value === option.value;

          return (
            <motion.button
              type="button"
              key={option.value}
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="text-left"
            >
              <Card
                className={cn(
                  'flex items-start gap-4 bg-surface-container-lowest px-5 py-5 transition-colors duration-200',
                  active
                    ? 'border-primary bg-[#111827] shadow-panel'
                    : 'hover:border-secondary hover:bg-[#1a1a1a]',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                    active
                      ? 'border-blue-700 bg-blue-700'
                      : 'border-border bg-transparent',
                  )}
                />
                <div>
                  <p className="text-sm font-medium leading-relaxed text-white sm:text-base">
                    {option.label}
                  </p>
                </div>
              </Card>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
