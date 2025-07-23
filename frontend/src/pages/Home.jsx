// src/pages/Home.jsx (Dengan Navigasi Get Started)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import CarParkVideo from '../assets/video/CarParkPos.mp4';
import UserPhotoImage from '../assets/images/user-photo.jpg';

const Home = () => {
  const howItWorksRef = useRef(null);

  const handleScrollToWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 min-h-screen flex flex-col justify-center items-center text-center">
        <div>
          <h1 className="font-alice text-6xl md:text-7xl text-primary leading-tight mb-6">
            Find Your Parking Spot,<br />Instantly!
          </h1>
          <p className="text-dark-gray mt-6 max-w-2xl mx-auto">
            Let our AI detect available spaces for you — fast, smart, and efficient.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <button 
              onClick={handleScrollToWorks}
              className="bg-transparent font-alice text-primary border border-primary px-8 py-3 rounded-md hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Learn More
            </button>
            {/* 2. Ganti <button> dengan <Link> yang mengarah ke /register */}
            <Link 
              to="/register" 
              className="bg-transparent font-alice text-primary border border-primary px-8 py-3 rounded-md hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* 2. KOTAK ABU-ABU PEMBUNGKUS UTAMA */}
      <section ref={howItWorksRef} className="max-w-6xl mx-auto px-6 pb-40 scroll-mt-24">
        <div className="bg-light-gray rounded-3xl p-8 md:p-16">
          
          {/* ... sisa konten halaman (tidak berubah) ... */}
          <div className="mb-56">
            <h2 className="font-alice text-4xl text-center text-primary mb-16">
              How It Works?
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-4 top-2 h-full w-0.5 bg-primary opacity-30"></div>
              <div className="relative pl-12 mb-8"><div className="absolute left-1.5 top-1.5 w-5 h-5 bg-primary rounded-full"></div><h3 className="font-alice text-2xl text-primary">Install a camera in your parking area.</h3><p className="text-dark-gray mt-1">Use existing CCTV or IP cameras to monitor your parking space.</p></div>
              <div className="relative pl-12 mb-8"><div className="absolute left-1.5 top-1.5 w-5 h-5 bg-primary rounded-full"></div><h3 className="font-alice text-2xl text-primary">Mark parking spots using our dashboard.</h3><p className="text-dark-gray mt-1">Define the location of each parking slot with our intuitive interface.</p></div>
              <div className="relative pl-12 mb-8"><div className="absolute left-1.5 top-1.5 w-5 h-5 bg-primary rounded-full"></div><h3 className="font-alice text-2xl text-primary">Let our AI detect available and occupied spots in real-time.</h3><p className="text-dark-gray mt-1">The system automatically analyzes the video feed to determine slot status.</p></div>
              <div className="relative pl-12"><div className="absolute left-1.5 top-1.5 w-5 h-5 bg-primary rounded-full"></div><h3 className="font-alice text-2xl text-primary">Monitor parking status live via the dashboard or app.</h3><p className="text-dark-gray mt-1">Access real-time updates anytime, from any device.</p></div>
            </div>
          </div>
          
          <div className="text-center mb-56">
            <h2 className="font-alice text-4xl text-primary">SmartCCTV in Action!</h2>
            <p className="text-dark-gray mt-2">Real-Time Parking Detection Demo</p>
            <div className="mt-8 shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
              <video className="w-full h-auto" src={CarParkVideo} autoPlay loop muted playsInline>
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-alice text-4xl text-primary mb-12">
              What Our Users Say
            </h2>
            <div className="relative max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-left">
              <div className="flex-shrink-0"><img src={UserPhotoImage} alt="Jamest Gacoor" className="w-40 h-40 rounded-md object-cover" /></div>
              <div><h3 className="font-alice text-3xl text-primary">Jamest Gacoor</h3><p className="text-dark-gray mb-4">Bojongsantos Mall Owner</p><blockquote className="text-primary italic">“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nisi lectus, consectetur vitae aliquet sed, fermentum vel sem. Nam blandit nibh ut, ultrices dolor. Vivamus pulvinar ornare sodales. Mauris accumsan lorem ullamcorper, posuere libero eu, sagittis sapien. Proin euismod non dolor non tincidunt.”</blockquote></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;