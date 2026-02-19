/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#fdecd3',
          200: '#fad6a5',
          300: '#f7ba6d',
          400: '#f39333',
          500: '#f07518',
          600: '#e1580e',
          700: '#bb3f0e',
          800: '#953213',
          900: '#792b13',
        },
      },
    },
  },
  plugins: [],
}
