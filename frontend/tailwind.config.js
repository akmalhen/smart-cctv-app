/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#20445b',      // Biru tua dari desain
        'light-gray': '#E9E9E9',    // Warna latar abu-abu muda (sedikit disesuaikan dari #d9d9d9 agar lebih cocok)
        'dark-gray': '#6b7280',    // Abu-abu untuk teks deskripsi
      },
      fontFamily: {
        // 'sans' adalah font default, kita ganti dengan font lain jika perlu
        // Kita buat font kustom bernama 'alice'
        'alice': ['Alice', 'serif'],
      },
    },
  },
  plugins: [],
}