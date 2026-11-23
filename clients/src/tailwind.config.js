/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#fff4e8', 100: '#ffe3c2', 200: '#ffc78a', 500: '#f58220', 600: '#e06f0c', 700: '#b85a09' },
      },
      fontFamily: { sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
