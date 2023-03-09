/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { 
        'sans': ['BRNebula-Regular', 'sans-serif'],
        'nebula': ['BRNebula-Regular', 'sans-serif'],
        'nebula-thin': ['BRNebula-Thin', 'sans-serif'],
        'nebula-light': ['BRNebula-Light', 'sans-serif'],
        'nebula-semibold': ['BRNebula-SemiBold', 'sans-serif'],
        'nebula-bold': ['BRNebula-Bold', 'sans-serif'],
      },
      colors: {
        'interorange': '#FE4800',
      }
    },
  },
  plugins: [],
}
