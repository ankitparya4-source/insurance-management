/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"League Spartan"', 'sans-serif'],
        sans: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          50: '#edf2fb',
          100: '#dbe4f6',
          200: '#b8c9ee',
          300: '#8ba7e2',
          400: '#5b81d2',
          500: '#3960c0',
          600: '#2546a3',
          700: '#1e3887',
          800: '#182b68',
          850: '#132352',
          900: '#0f1d44',
          950: '#09112a', // Midnight Navy
        },
        cream: {
          50: '#fdfbf7', // Lightest cream surface
          100: '#faf6ee', // Canvas background cream
          200: '#f4ede0', // Soft container cream
          300: '#ece1ce', // Border / line cream
          400: '#dfcfb5',
          500: '#c8b394',
          600: '#b09673',
          700: '#947a57',
          800: '#7a6243',
          900: '#644f35',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(9, 17, 42, 0.04), 0 1px 2px -1px rgba(9, 17, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(9, 17, 42, 0.08), 0 8px 10px -6px rgba(9, 17, 42, 0.04)',
        'navy-sm': '0 2px 8px -1px rgba(9, 17, 42, 0.15)',
        'navy-lg': '0 12px 30px -4px rgba(9, 17, 42, 0.25)',
      },
    },
  },
  plugins: [],
}
