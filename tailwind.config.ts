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
        // Clinical Slate-Grey & Royal Blue Palette (From Reference Image)
        bg: '#17212b',
        canvas: '#17212b',
        hero: '#1c2834',
        card: '#202e3b',
        panel: '#202e3b',
        panelHover: '#283949',
        line: '#2e4153',
        lineSubtle: '#243443',
        ink: {
          primary: '#ffffff',
          secondary: '#a7b9c9',
          muted: '#6f8496',
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
