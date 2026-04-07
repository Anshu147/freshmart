/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0C831F',
        'primary-dark': '#0A6E1A',
        accent: '#FBBF24',
        dark: '#1a1a2e',
        'dark-card': '#16213e',
        'dark-bg': '#0f0f23',
      },
    },
  },
  plugins: [],
};
