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
        background: '#F7F5F0',
        panel: '#FFFFFF',
        ink: {
          primary: '#292824',
          secondary: '#77746D',
          muted: '#9E9B93',
        },
        line: {
          DEFAULT: '#E5E0D7',
          subtle: '#EFECE6',
        },
        accent: {
          DEFAULT: '#C65D32',
          hover: '#A94825',
          subtle: '#FAF1ED',
        },
        status: {
          success: '#38734D',
          'success-bg': '#EEF5F0',
          warning: '#A66A16',
          'warning-bg': '#FBF5EB',
          error: '#B33A32',
          'error-bg': '#FAECEB',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgba(41, 40, 36, 0.04)',
        card: '0 1px 3px 0 rgba(41, 40, 36, 0.06), 0 1px 2px -1px rgba(41, 40, 36, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
