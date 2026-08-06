/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Edit these to change the whole site palette.
        leaf: {
          50: '#F1F8F3',
          100: '#DCEEE1',
          200: '#B6DCC1',
          300: '#84C39A',
          400: '#4FA372',
          500: '#2E8556',
          600: '#1F6B44',
          700: '#1A5537',
          800: '#16412C',
          900: '#0E2B1D',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
