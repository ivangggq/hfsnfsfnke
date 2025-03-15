/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0C4A41', // Darker, more contrasting teal
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#062C22', // Darkest shade for footer-like elements
        },
        secondary: {
          DEFAULT: '#0E7490', // Brighter blue for contrast
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        success: '#10B981', // Green-500
        warning: '#F59E0B', // Amber-500
        error: '#EF4444',   // Red-500
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.5',
      },
    },
  },
  plugins: [],
}