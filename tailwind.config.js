/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        'surface-light': '#1f1f1f',
        border: '#2a2a2a',
        accent: '#c8ff00',
        'accent-hover': '#d4ff33',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
