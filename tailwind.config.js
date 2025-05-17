/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['neue montreal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      neue: ['neue montreal'],
      editorial: ['editorial new']
    },
    extend: {
      colors: {
        'hero-white': '#fff',
      },
      borderRadius: {
        'btn-bdrd': '12px', // Full rounded for buttons and tags
      },
      fontSize: {
        'nav': '20px',
        'nav-big': '40px',
        'projects-heading': '96px',
        'projects-heading-small': "50px",
        'projects-subheading': '32px',
        'projects-subheading-small': '20px',
        'project-title': '72px',
        'project-title-small': '40px',
        'type-small': '20px',
      },
    },
  },
  plugins: [],
}
