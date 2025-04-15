/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F0F3F7',
        secondary: '#E4E9F2',
        accent: '#6C5CE7',
      },
      boxShadow: {
        'neu': '8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF',
        'neu-inset': 'inset 8px 8px 16px #D1D9E6, inset -8px -8px 16px #FFFFFF',
      },
    },
  },
  plugins: [],
} 