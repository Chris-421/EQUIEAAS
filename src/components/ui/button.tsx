import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  default:
    'border border-primary bg-primary text-white hover:bg-blue-700 hover:border-blue-700',
  outline:
    'border border-border bg-transparent text-on-surface hover:border-outline hover:bg-surface-container-low',
  ghost: 'border border-transparent bg-transparent text-on-surface hover:bg-surface-container-low',
};

const sizeClassMap: Record<ButtonSize, string> = {
  default: 'h-11 px-5 text-[11px]',
  sm: 'h-9 px-3 text-[10px]',
  lg: 'h-12 px-7 text-[11px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-none font-semibold uppercase tracking-[0.2em] transition-all duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45',
          variantClassMap[variant],
          sizeClassMap[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
