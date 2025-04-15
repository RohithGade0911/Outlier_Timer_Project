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
        primary: '#F0F3F7',
        secondary: '#E4E9F2',
        accent: '#6C5CE7',
        dark: {
          primary: '#1a1b1e',
          secondary: '#2d2e32',
          accent: '#8B7FF7',
        }
      },
      boxShadow: {
        'neu': '8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF',
        'neu-inset': 'inset 8px 8px 16px #D1D9E6, inset -8px -8px 16px #FFFFFF',
        'neu-dark': '8px 8px 16px #151618, -8px -8px 16px #1f2024',
        'neu-dark-inset': 'inset 8px 8px 16px #151618, inset -8px -8px 16px #1f2024',
      },
    },
  },
  plugins: [],
} 