/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        violet: {
          300: '#ea00ff',
          400: '#ea00ff',
          500: '#ea00ff',
          600: '#ea00ff',
        },
        purple: {
          300: '#ea00ff',
          400: '#ea00ff',
          600: '#ea00ff',
        },
        dark: {
          950: '#07060e', // Primary deep canvas
          900: '#0c0a18', // Section surface
          850: '#131124', // Card base
          800: '#1b1834', // Hover card / modal
          750: '#231f42', // Elevated interactive surface
          700: '#2f2b57', // Border standard
          600: '#423d77', // Border hover
        },
        brand: {
          purple: '#ea00ff',
          violet: '#ea00ff',
          electric: '#ea00ff',
          neon: '#ea00ff',
          cyan: '#06b6d4',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 40px -10px rgba(234, 0, 255, 0.45)',
        'glow-violet': '0 0 50px -12px rgba(234, 0, 255, 0.5)',
        'glow-subtle': '0 0 25px -5px rgba(234, 0, 255, 0.25)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
