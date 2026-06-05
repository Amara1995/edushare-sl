/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sl-green': '#1EB53A',
        'sl-white': '#FFFFFF',
        'sl-blue': '#0072C6',
      },
    },
  },
  plugins: [],
}
