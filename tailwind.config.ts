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
        // Refined Warm-Neutral Visual Identity (Linear / Vercel / Stryker inspired)
        bg: '#F7F5F0',
        canvas: '#F7F5F0',
        hero: '#EEEAE2',
        card: '#FFFFFF',
        panel: '#FFFFFF',
        panelHover: '#FAF8F4',
        line: '#E5E0D7',
        lineSubtle: '#ECE7DF',
        ink: {
          primary: '#292824',
          secondary: '#77746D',
          muted: '#9E9A90',
        },
        accent: {
          DEFAULT: '#C65D32', // Burnt Orange
          hover: '#A94825',
          subtle: 'rgba(198, 93, 50, 0.08)',
        },
        tech: {
          DEFAULT: '#B9A58A',
          subtle: 'rgba(185, 165, 138, 0.15)',
        },
        status: {
          success: '#38734D',
          successBg: 'rgba(56, 115, 77, 0.08)',
          error: '#B33A32',
          errorBg: 'rgba(179, 58, 50, 0.08)',
          warning: '#A66A16',
          warningBg: 'rgba(166, 106, 22, 0.08)',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(41, 40, 36, 0.06), 0 1px 2px rgba(41, 40, 36, 0.04)',
        panel: '0 4px 12px rgba(41, 40, 36, 0.06)',
        subtle: '0 1px 2px rgba(41, 40, 36, 0.05)',
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
