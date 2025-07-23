import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function History() {
  return (
    <>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6">Riwayat Deteksi</h2>
        <ul className="space-y-2">
          <li className="bg-gray-100 p-4 rounded shadow">07:30 - Mobil masuk slot 1</li>
          <li className="bg-gray-100 p-4 rounded shadow">08:15 - Mobil keluar slot 1</li>
          <li className="bg-gray-100 p-4 rounded shadow">09:05 - Mobil masuk slot 2</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
