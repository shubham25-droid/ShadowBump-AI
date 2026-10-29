import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Sky-Cyan Light Visual Identity (matching user reference)
        bg: '#EAF7FB',
        canvas: '#EAF7FB',
        hero: '#D6F3FB',
        card: '#FFFFFF',
        panel: '#FFFFFF',
        panelHover: '#F0FAFD',
        line: '#C8E7F2',
        lineSubtle: '#D8EFF6',
        ink: {
          primary: '#142638',   // Deep navy charcoal from reference image
          secondary: '#45647E', // Crisp slate-blue
          muted: '#7596AF',
        },
        accent: {
          DEFAULT: '#0284C7', // Sky Azure / Cyan
          hover: '#0369A1',
          subtle: 'rgba(2, 132, 199, 0.08)',
        },
        tech: {
          DEFAULT: '#0EA5E9',
          subtle: 'rgba(14, 165, 233, 0.12)',
        },
        status: {
          success: '#059669',
          successBg: '#E6F7F3',
          error: '#DC2626',
          errorBg: '#FEE2E2',
          warning: '#D97706',
          warningBg: '#FEF3C7',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(20, 38, 56, 0.05), 0 1px 2px rgba(20, 38, 56, 0.03)',
        panel: '0 4px 14px rgba(20, 38, 56, 0.06)',
        subtle: '0 1px 2px rgba(20, 38, 56, 0.04)',
        pill: '0 2px 8px rgba(166, 235, 254, 0.35)',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
