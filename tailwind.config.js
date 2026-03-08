/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b9eff',
        'primary-dark': '#1a6fcc',
        'bg-1': '#080c12',
        'bg-2': '#0d1117',
        'bg-3': '#111820',
        'bg-4': '#16202e',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Barlow Condensed', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}