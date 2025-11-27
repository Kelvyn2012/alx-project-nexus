/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#657786',
        like: '#E0245E',
        share: '#17BF63',
        dark: {
          50: '#E8E9ED',
          100: '#C8CAD1',
          200: '#A4A7B3',
          300: '#808495',
          400: '#65697E',
          500: '#4A4E67',
          600: '#43475F',
          700: '#3A3E54',
          800: '#32354A',
          850: '#1E2139',
          900: '#16182B',
          950: '#0D0E1A',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #16182B 0%, #1E2139 100%)',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
