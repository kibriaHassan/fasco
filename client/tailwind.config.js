/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Volkhov"', 'serif'],
        sans: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        fasco: {
          black: '#000000',
          gray: '#484848',
          muted: '#8A8A8A',
          border: '#E5E5E5',
          blue: '#5B86E5',
          soft: '#EDEDED',
        },
      },
    },
  },
  plugins: [],
}
