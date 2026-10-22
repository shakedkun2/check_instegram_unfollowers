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
        instagram: {
          pink: '#E1306C',
          purple: '#C13584',
          orange: '#F56040',
          yellow: '#FCAF45',
          blue: '#405DE6'
        }
      }
    },
  },
  plugins: [],
}
