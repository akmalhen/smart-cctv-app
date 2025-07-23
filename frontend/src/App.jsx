// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import komponen dan halaman Anda
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // 1. IMPORT Register.jsx

function App() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="bg-white">
      {showHeaderFooter && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* 2. TAMBAHKAN Route ini */}
        </Routes>
      </main>
      
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;