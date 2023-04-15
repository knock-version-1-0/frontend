/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'knock-main': '#B2700D',
        'knock-sub': '#464657',
        'etc': '#BFBFBF'
      }
    }
  },
  plugins: [],
}
