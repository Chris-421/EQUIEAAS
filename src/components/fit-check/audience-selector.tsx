'use client';

import { motion } from 'framer-motion';
import { AUDIENCE_OPTIONS } from '@/lib/data/fit-check';
import { type AudienceType } from '@/lib/types/fit-check';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AudienceSelectorProps {
  value: AudienceType | null;
  onChange: (audience: AudienceType) => void;
}

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  return (
    <div className="grid gap-3">
      {AUDIENCE_OPTIONS.map((option, index) => {
        const active = value === option.value;

        return (
          <motion.button
            type="button"
            key={option.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.28 }}
            onClick={() => onChange(option.value)}
            className="text-left"
          >
            <Card
              className={cn(
                'flex items-start gap-4 bg-surface-container-lowest px-5 py-5 transition-colors duration-200 sm:px-6 sm:py-6',
                active
                  ? 'border-primary bg-[#111827] shadow-panel'
                  : 'hover:border-secondary hover:bg-[#1a1a1a]',
              )}
            >
              <span
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  active ? 'border-blue-700 bg-blue-700' : 'border-border bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition-colors',
                    active ? 'bg-blue-700' : 'bg-transparent',
                  )}
                />
              </span>
              <div className="space-y-1">
                <p className="text-base font-medium tracking-tight text-white sm:text-lg">
                  {option.label}
                </p>
                <p className="max-w-2xl text-sm leading-relaxed text-outline">
                  {option.description}
                </p>
              </div>
            </Card>
          </motion.button>
        );
      })}
    </div>
  );
}
