/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        explorer: {
          teal: {
            900: 'var(--color-explorer-teal-900)',
            800: 'var(--color-explorer-teal-800)',
            600: 'var(--color-explorer-teal-600)',
            400: 'var(--color-explorer-teal-400)',
          },
          orange: {
            500: 'var(--color-explorer-orange-500)',
            400: 'var(--color-explorer-orange-400)',
          },
          sand: {
            100: 'var(--color-explorer-sand-100)',
            50: 'var(--color-explorer-sand-50)',
          },
          slate: {
            900: 'var(--color-explorer-slate-900)',
            600: 'var(--color-explorer-slate-600)',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
