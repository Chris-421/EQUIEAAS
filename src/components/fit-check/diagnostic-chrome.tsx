import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DiagnosticShellProps {
  children: ReactNode;
  headerFixed?: boolean;
  footerFixed?: boolean;
  mainClassName?: string;
}

interface BarProps {
  fixed?: boolean;
}

export function MaterialSymbol({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn('material-symbols-outlined', className)}>
      {icon}
    </span>
  );
}

export function DiagnosticHeader({ fixed = false }: BarProps) {
  return (
    <header
      className={cn(
        'z-50 w-full border-b border-zinc-800 bg-black',
        fixed ? 'fixed top-0' : 'relative',
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center px-6 py-5 md:px-12 md:py-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-none border border-transparent px-0 py-1 text-white transition-colors hover:text-white"
        >
          <MaterialSymbol icon="architecture" className="text-[1.6rem] text-primary" />
          <span className="font-serif text-lg font-bold uppercase tracking-[0.28em] text-white md:text-xl">
            EQUI
          </span>
        </Link>
      </div>
    </header>
  );
}

export function DiagnosticFooter({ fixed = false }: BarProps) {
  return (
    <footer
      className={cn(
        'w-full border-t border-zinc-800 bg-black',
        fixed ? 'fixed bottom-0 z-50' : 'relative mt-auto',
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-6 text-[10px] uppercase tracking-[0.2em] md:flex-row md:px-12 md:py-8">
        <div className="text-center text-zinc-400 md:text-left">
          &copy; 2024 INDUSTRIAL STRATEGY GROUP. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <a className="text-zinc-600 transition-colors hover:text-white" href="#">
            Privacy Policy
          </a>
          <a className="text-zinc-600 transition-colors hover:text-white" href="#">
            Terms of Assessment
          </a>
          <a className="text-zinc-600 transition-colors hover:text-white" href="#">
            Methodology
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function DiagnosticShell({
  children,
  headerFixed = false,
  footerFixed = false,
  mainClassName,
}: DiagnosticShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DiagnosticHeader fixed={headerFixed} />
      <main
        className={cn(
          'flex min-h-[calc(100vh-158px)] flex-col',
          headerFixed ? 'pt-[92px]' : '',
          footerFixed ? 'pb-[92px]' : '',
          mainClassName,
        )}
      >
        {children}
      </main>
      <DiagnosticFooter fixed={footerFixed} />
    </div>
  );
}
