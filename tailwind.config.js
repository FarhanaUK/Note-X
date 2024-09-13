// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ensure 'class' is set for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'button-light': 'rgb(219, 234, 254)',
        'button-dark': 'rgb(64 64 64)',
        'text-dark': '#f0f0f0',
        'input-dark-bg': 'rgb(15, 23, 42)',
        'input-dark-bg-1': 'rgb(107, 114, 128)',
        'input-dark-bg-2': 'rgb(64 64 64)',
        
      },
    },
  },
  
  plugins: [],
};
