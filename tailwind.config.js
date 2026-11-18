/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // vibrant fresh emerald
          600: '#059669', // solid primary
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        canteen: {
          accent: '#ea580c', // subtle warm orange for badges/hot highlights
          dark: '#0f172a',
          surface: '#ffffff',
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
