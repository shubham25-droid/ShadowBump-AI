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
        // Exact Clinical Slate-Navy & Royal Cobalt Palette from Reference Screenshot
        bg: '#081827',
        canvas: '#081827',
        hero: '#0c243e',
        card: '#0f2945',
        panel: '#0f2945',
        panelHover: '#16395e',
        line: '#1c456e',
        lineSubtle: '#143555',
        ink: {
          primary: '#ffffff',
          secondary: '#bcd2e5',
          muted: '#779cb8',
        },
        accent: {
          DEFAULT: '#0064d2', // Exact "Plan your visit" vibrant blue button
          hover: '#0053b3',
          subtle: 'rgba(0, 100, 210, 0.2)',
        },
        shelf: {
          blue1: '#005ba8', // Bottom shelf card 1 in reference
          blue2: '#0062b8', // Bottom shelf card 2 in reference
          blue3: '#005096', // Bottom shelf card 3 in reference
        },
        tech: {
          DEFAULT: '#38bdf8',
          subtle: 'rgba(56, 189, 248, 0.15)',
        },
        status: {
          success: '#10b981',
          successBg: 'rgba(16, 185, 129, 0.16)',
          error: '#ef4444',
          errorBg: 'rgba(239, 68, 68, 0.16)',
          warning: '#f59e0b',
          warningBg: 'rgba(245, 158, 11, 0.16)',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(3, 10, 18, 0.5)',
        panel: '0 8px 30px rgba(3, 10, 18, 0.65)',
        glowBlue: '0 0 30px -3px rgba(0, 100, 210, 0.55)',
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
