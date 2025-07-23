// src/components/Navbar.jsx
import React from 'react';
import Logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  const navLinks = ["Home", "How it works", "Demo", "Testimonials", "Contact"];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/">
          <img src={Logo} alt="SmartCCTV Logo" className="h-8" />
        </a>
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-primary font-alice text-lg md:text-xl hover:text-opacity-80 transition-opacity"
            >
              {link}
            </a>
          ))}
        </div>
        <Link to="/login" className="bg-primary text-white font-alice px-6 py-2 rounded-md hover:bg-opacity-90 transition-opacity">
            Login
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
