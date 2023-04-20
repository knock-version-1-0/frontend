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
        'knock-main': '#A33DF3',
        'knock-sub': '#2983D6',
        'etc': '#BFBFBF'
      }
    }
  },
  plugins: [],
}
