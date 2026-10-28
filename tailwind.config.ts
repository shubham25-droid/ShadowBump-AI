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
        background: '#090d16',
        surface: {
          50: '#1e293b',
          100: '#151d2c',
          200: '#0f1623',
          300: '#0b101a',
          card: '#0e1422',
          border: '#1e293b'
        },
        brand: {
          DEFAULT: '#0284c7', // Sky-600
          light: '#38bdf8',
          dark: '#0369a1'
        },
        status: {
          match: '#10b981', // emerald
          diff: '#f59e0b',  // amber
          regression: '#ef4444', // red
          error: '#8b5cf6'  // violet
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
};

export default config;
