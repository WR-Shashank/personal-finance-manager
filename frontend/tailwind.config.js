/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#030012',
          card: 'rgba(10, 8, 28, 0.45)',
          panel: 'rgba(16, 12, 42, 0.6)',
          border: 'rgba(255, 255, 255, 0.05)',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        brand: {
          violet: '#6366f1',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          neon: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        'neon-glow': '0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
        'emerald-glow': '0 0 15px rgba(16, 185, 129, 0.4)',
        'rose-glow': '0 0 15px rgba(244, 63, 94, 0.4)',
      },
      animation: {
        'mesh-1': 'mesh-drift-1 25s ease infinite alternate',
        'mesh-2': 'mesh-drift-2 30s ease infinite alternate',
        'mesh-3': 'mesh-drift-3 20s ease infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        'mesh-drift-1': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.15)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'mesh-drift-2': {
          '0%': { transform: 'translate(0px, 0px) scale(1.1)' },
          '50%': { transform: 'translate(-40px, 30px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1.1)' },
        },
        'mesh-drift-3': {
          '0%': { transform: 'translate(0px, 0px) scale(0.95)' },
          '33%': { transform: 'translate(40px, 40px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, -30px) scale(1.05)' },
          '100%': { transform: 'translate(0px, 0px) scale(0.95)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
      }
    },
  },
  plugins: [],
}
