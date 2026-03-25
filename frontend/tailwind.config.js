/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
          lightest: '#334155',
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo
          dark: '#4f46e5',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Violet
          dark: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}
