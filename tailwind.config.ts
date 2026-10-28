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
        background: '#07090e',
        canvas: '#0b0f19',
        panel: '#101626',
        panelHover: '#151d33',
        card: '#0d1322',
        border: {
          DEFAULT: '#1c263d',
          subtle: '#161f33',
          glow: 'rgba(56, 189, 248, 0.25)',
        },
        ink: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        brand: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 50% -20%, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.08), transparent 70%)',
        'cyan-indigo': 'linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #8b5cf6 100%)',
        'nvidia-glow': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'crimson-glow': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        glowViolet: '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        glowGreen: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        card: '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
