/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        python: {
          blue: {
            DEFAULT: '#3776AB',
            dark: '#1e415e',
            light: '#5a9fd4',
            50: '#f0f7fc',
            100: '#e1eff8',
            500: '#3776AB',
            600: '#2b5d88',
            700: '#1e415e',
            900: '#13283a',
          },
          yellow: {
            DEFAULT: '#FFD43B',
            dark: '#e5b810',
            light: '#ffe375',
            50: '#fffdf0',
            100: '#fff9d6',
            500: '#FFD43B',
            600: '#e5b810',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
