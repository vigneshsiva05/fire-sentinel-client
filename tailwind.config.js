/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        surface: {
          50:  '#ffffff',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d0d0d0',
          400: '#999999',
          500: '#666666',
          600: '#444444',
          700: '#222222',
          800: '#111111',
        },
        dark: {
          950: '#ffffff',
          900: '#f5f5f5',
          850: '#eeeeee',
          800: '#e0e0e0',
          700: '#cccccc',
          600: '#aaaaaa',
        },
        fire: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        risk: {
          low:      '#059669',
          moderate: '#d97706',
          high:     '#ea580c',
          critical: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card':  '0 1px 4px 0 rgba(0,0,0,0.08), 0 4px 16px 0 rgba(0,0,0,0.06)',
        'panel': '0 2px 8px 0 rgba(0,0,0,0.10)',
        'nav':   '0 1px 0 0 #e0e0e0',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow':  'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
