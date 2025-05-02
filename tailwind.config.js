/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"neue montreal"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      neue: ['"neue montreal"'],
      editorial: ['"editorial new"']
    },
    extend: {
      colors: {
        'hero-white': '#fff',
      },
      fontSize: {
        'nav': '20px',
        'nav-big': '40px',
      },
    },
  },
  plugins: [],
}
