/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hero-white': '#fff',
      },
      fontSize: {
        'nav': '20px',
      },
    },
  },
  plugins: [],
}
