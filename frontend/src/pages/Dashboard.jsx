import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard Kamera</h2>
        <video controls className="max-w-3xl mx-auto rounded shadow">
          <source src="/assets/video/carParkPos.mp4" type="video/mp4" />
          Browser Anda tidak mendukung tag video.
        </video>
      </main>
      <Footer />
    </>
  );
}
