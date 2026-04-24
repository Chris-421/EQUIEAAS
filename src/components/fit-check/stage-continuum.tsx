import { SERVITIZATION_STAGES } from '@/lib/data/fit-check';
import { cn } from '@/lib/utils';

interface StageContinuumProps {
  activeLevel: number;
}

export function StageContinuum({ activeLevel }: StageContinuumProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SERVITIZATION_STAGES.map((stage, index) => {
          const active = index === activeLevel;
          const reached = index <= activeLevel;

          return (
            <div
              key={stage.id}
              className={cn(
                'border p-4 transition-colors',
                active
                  ? 'border-blue-700 bg-blue-700/12'
                  : reached
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-surface-container-lowest',
              )}
            >
              <div
                className={cn(
                  'mb-3 h-[3px] w-full',
                  active ? 'bg-blue-700' : reached ? 'bg-primary/45' : 'bg-border',
                )}
              />
              <p
                className={cn(
                  'text-[11px] uppercase tracking-[0.2em]',
                  active ? 'text-blue-700' : reached ? 'text-primary' : 'text-outline',
                )}
              >
                {active ? 'Current Fit' : reached ? 'Viable Path' : 'Later Stage'}
              </p>
              <p
                className={cn(
                  'mt-2 font-serif text-lg leading-snug',
                  active ? 'text-white' : 'text-on-surface',
                )}
              >
                {stage.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
