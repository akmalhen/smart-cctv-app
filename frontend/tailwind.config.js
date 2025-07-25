/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        'primary': '#20445b',
        'primary-focus': '#305f7d',
        'base-100': '#f1f1f1',
        'dark-gray': '#6b7280',
        // Tambahkan warna status baru
        'status-red': '#cc0000',
        'status-yellow': '#cca300',
        'status-green': '#457a00',
        'card-red': '#ff9999',
        'card-yellow': '#ffeb99',
        'card-green': '#d9f4cd',
      },
      fontFamily: {
        'alice': ['Alice', 'serif'],
      },
    },
  },
  plugins: [],
}