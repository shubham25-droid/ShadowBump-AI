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
        // Warm Neutral Light Mode Palette
        bg: '#F7F5F0',
        hero: '#EEEAE2',
        card: '#FFFFFF',
        panel: '#FFFFFF',
        line: '#E5E0D7',
        lineSubtle: '#EFECE6',
        ink: {
          primary: '#292824',
          secondary: '#77746D',
          muted: '#9E9A90',
        },
        accent: {
          DEFAULT: '#C65D32', // Burnt orange / Terracotta
          hover: '#A94825',
          subtle: '#F6EAE4',
        },
        tech: {
          DEFAULT: '#B9A58A', // Warm sand gold
          subtle: '#F4EFEA',
        },
        status: {
          success: '#38734D',
          successBg: '#EBF3ED',
          error: '#B33A32',
          errorBg: '#FDF2F0',
          warning: '#A66A16',
          warningBg: '#FDF8EE',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(41, 40, 36, 0.05), 0 1px 2px rgba(41, 40, 36, 0.03)',
        panel: '0 4px 12px rgba(41, 40, 36, 0.06)',
        elevated: '0 12px 28px rgba(41, 40, 36, 0.08)',
      },
      borderRadius: {
        'card': '10px',
        'button': '8px',
      },
    },
  },
  plugins: [],
};

export default config;
