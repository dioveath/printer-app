/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { 
        'sans': ['Roboto-Regular', 'sans-serif'],
        'nebula': ['Montserrat-Medium', 'sans-serif'],
        'nebula-thin': ['Montserrat-Thin', 'sans-serif'],
        'nebula-light': ['Montserrat-Regular', 'sans-serif'],
        'nebula-semibold': ['Montserrat-SemiBold', 'sans-serif'],
        'nebula-bold': ['Montserrat-Bold', 'sans-serif'],
      },
      colors: {
        'interorange': '#FE4800',
      }
    },
  },
  plugins: [],
}
