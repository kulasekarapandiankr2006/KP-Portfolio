/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F17',
          secondary: '#111827',
          tertiary: '#1E293B',
          card: '#131C2E',
          cardHover: '#18243C',
          surface: '#0F172A',
        },
        engineering: {
          cyan: '#06B6D4',
          cyanGlow: '#22D3EE',
          blue: '#0284C7',
          blueGlow: '#38BDF8',
          amber: '#F59E0B',
          amberGlow: '#FBBF24',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#A855F7',
          slate: '#64748B',
          border: '#1E293B',
          borderHover: '#334155',
          borderHighlight: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cad-grid': 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 1px, transparent 1px)',
        'cad-grid-dense': 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
        'circuit-pattern': 'linear-gradient(to right, rgba(30, 41, 59, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.4) 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(2, 132, 199, 0.15), transparent 70%)',
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '32px 32px',
        'grid-lg': '48px 48px',
      },
      boxShadow: {
        'tech-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'tech-blue': '0 0 25px -5px rgba(2, 132, 199, 0.3)',
        'tech-amber': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(30, 41, 59, 0.7)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fadeIn': 'fadeIn 0.4s ease-out both',
        'slideUp': 'slideUp 0.5s ease-out both',
        'slideInLeft': 'slideInLeft 0.4s ease-out both',
        'scaleIn': 'scaleIn 0.3s ease-out both',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}
