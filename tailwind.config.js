/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montreal: ['neue montreal'],
        editorial: ['editroial new']
      },
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
