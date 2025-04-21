/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        intelQEDarkBlue: '#2081c3', 
        intelQEBlue:'#429ad6',
        intelQELightBlue: '#63d2ff', 
        intelQELightGreen: '#78d5d7', 
        intelQELightOlive: '#bed8d4', 
        intelQEOffWhite: '#f7f9f9', 
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
