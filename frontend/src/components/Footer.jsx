// src/components/Footer.jsx
import React from 'react';
import Logo from '../assets/images/logo.png'; // Ganti dengan path logo Anda
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Logo and Socials */}
          <div className="col-span-1 md:col-span-1">
            <img src={Logo} alt="SmartCCTV Logo" className="h-8 mb-4 brightness-0 invert" />
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:opacity-80"><FaInstagram size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaTwitter size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaFacebookF size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaYoutube size={24} /></a>
            </div>
            <p className="text-sm">support@smartcctv.com</p>
            <p className="text-sm">+62-123-4567-8910</p>
          </div>

          {/* Column 2, 3, 4: Links */}
          <div>
            <h4 className="font-bold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">How It Works</a></li>
              <li><a href="#" className="hover:underline">Demo</a></li>
              <li><a href="#" className="hover:underline">Testimonials</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Cond.</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>

        </div>
        <div className="mt-12 border-t border-gray-500 pt-6 text-center text-sm">
          <p>© 2025 SmartCCTV</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;