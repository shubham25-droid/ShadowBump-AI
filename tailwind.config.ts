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
        // Deep Slate Navy & Vivid Cobalt Blue Palette (from reference image)
        bg: '#0c1d2e',
        canvas: '#0c1d2e',
        hero: '#11253a',
        card: '#152c44',
        panel: '#152c44',
        panelHover: '#1c3854',
        line: '#23425e',
        lineSubtle: '#1a344d',
        ink: {
          primary: '#ffffff',
          secondary: '#9fb7cd',
          muted: '#6986a3',
        },
        accent: {
          DEFAULT: '#0066cc', // Reference image primary blue button
          hover: '#0055b3',
          subtle: 'rgba(0, 102, 204, 0.18)',
        },
        cobalt: {
          DEFAULT: '#0066cc',
          hover: '#0055b3',
          dark: '#084b96',
          shelf: '#0055a5',
        },
        tech: {
          DEFAULT: '#38bdf8',
          subtle: 'rgba(56, 189, 248, 0.12)',
        },
        status: {
          success: '#10b981',
          successBg: 'rgba(16, 185, 129, 0.14)',
          error: '#ef4444',
          errorBg: 'rgba(239, 68, 68, 0.14)',
          warning: '#f59e0b',
          warningBg: 'rgba(245, 158, 11, 0.14)',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(4, 11, 18, 0.45)',
        panel: '0 8px 30px rgba(4, 11, 18, 0.55)',
        glowBlue: '0 0 25px -4px rgba(0, 102, 204, 0.4)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
    },
  },
  plugins: [],
};

export default config;
