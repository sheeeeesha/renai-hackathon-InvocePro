/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        exo: ['Exo', 'sans-serif'],
        lexend: ['"Lexend Giga"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],

      },
      backgroundImage: {
        'auth-bg': "url('../assets/auth_bg.jpg')",
      },
    },
  },
  plugins: [],
}

