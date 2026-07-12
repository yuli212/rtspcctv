/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'komdigi-navy': '#00336C',
        'komdigi-green': '#00B5AA',
        'komdigi-blue': '#0093DD',
        'komdigi-gray': '#A3A3A3',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
