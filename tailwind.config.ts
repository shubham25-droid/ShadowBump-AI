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
        // Refined Grey / Slate / Charcoal Palette
        background: '#101115',
        canvas: '#16171d',
        panel: '#1c1f26',
        panelHover: '#252832',
        card: '#181a21',
        grey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          750: '#2c313d',
          800: '#1f242d',
          850: '#171a22',
          900: '#111318',
          950: '#0b0c0f',
        },
        border: {
          DEFAULT: '#2c303c',
          subtle: '#222530',
          bright: '#4b5563',
          glow: 'rgba(209, 213, 219, 0.2)',
        },
        ink: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
        brand: {
          silver: '#e5e7eb',
          titanium: '#cbd5e1',
          slate: '#94a3b8',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          cyan: '#38bdf8',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'titanium-gradient': 'linear-gradient(135deg, #ffffff 0%, #d1d5db 50%, #9ca3af 100%)',
        'silver-glow': 'radial-gradient(circle at 50% -20%, rgba(209, 213, 219, 0.12), transparent 70%)',
        'grey-surface': 'linear-gradient(180deg, #1f222b 0%, #15171e 100%)',
      },
      boxShadow: {
        glowGrey: '0 0 25px -5px rgba(209, 213, 219, 0.18)',
        glowSubtle: '0 0 20px -3px rgba(156, 163, 175, 0.12)',
        card: '0 8px 30px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
