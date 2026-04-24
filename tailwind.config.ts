import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        outline: 'hsl(var(--outline))',
        'outline-variant': 'hsl(var(--outline-variant))',
        'surface-container-lowest': 'hsl(var(--surface-container-lowest))',
        'surface-container-low': 'hsl(var(--surface-container-low))',
        'surface-container': 'hsl(var(--surface-container))',
        'surface-container-high': 'hsl(var(--surface-container-high))',
        'surface-container-highest': 'hsl(var(--surface-container-highest))',
        'surface-variant': 'hsl(var(--surface-variant))',
        'on-surface': 'hsl(var(--on-surface))',
        'on-surface-variant': 'hsl(var(--on-surface-variant))',
        'on-secondary-container': 'hsl(var(--on-secondary-container))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(0, 0, 0, 0.18)',
        panel: '0 0 0 1px rgba(59, 130, 246, 0.18)',
      },
      backgroundImage: {
        'industrial-grid':
          'linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
        'industrial-glow':
          'radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 42%), radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.05), transparent 28%)',
      },
      backgroundSize: {
        grid: '20px 20px',
      },
    },
  },
  plugins: [],
};

export default config;
