// src/pages/Login.jsx (Alignment Sempurna)
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
      {/* Panel Kiri (Form) */}
      <div className="w-full md:w-1/4 bg-primary text-white px-8 md:px-12 flex flex-col">
        
        {/* Bagian Atas Form */}
        <div className="pt-8 md:pt-12">
          <Link to="/">
            <img src={Logo} alt="SmartCCTV Logo" className="h-8 mb-16 brightness-0 invert" />
          </Link>
          <h2 className="font-alice text-3xl mb-8">Login to your account</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <input type="email" id="email" className="w-full bg-primary border-2 border-gray-400 rounded-2xl p-3 focus:outline-none focus:border-white transition-colors"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input type="password" id="password" className="w-full bg-primary border-2 border-gray-400 rounded-2xl p-3 focus:outline-none focus:border-white transition-colors"/>
            </div>
          </form>
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-gray-400"></div>
            <span className="mx-4 text-gray-300 text-sm">or login with google</span>
            <div className="flex-grow h-px bg-gray-400"></div>
          </div>
          <button className="w-full bg-white text-primary font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
            <FcGoogle size={24} />
            <span>Login with Google</span>
          </button>
        </div>
        
        {/* Bagian Bawah Form (Footer) */}
        <div className="mt-auto flex justify-between items-center pb-8 md:pb-12">
          <p className="text-sm">
            Don't have account? <Link to="/register" className="font-bold hover:underline">sign-in</Link>
          </p>
          <button className="bg-white text-primary font-bold px-8 py-2 rounded-2xl hover:opacity-90 transition-opacity">
            Done
          </button>
        </div>
      </div>

      {/* Panel Kanan (Konten Hero) */}
      <div className="hidden md:flex md:w-3/5 items-center justify-center p-12 bg-white">
        <div className="text-center">
          <h1 className="font-alice text-6xl text-primary leading-tight mb-6">Find Your Parking Spot,<br />Instantly!</h1>
          <p className="text-dark-gray mt-6 max-w-2xl mx-auto">Let our AI detect available spaces for you — fast, smart, and efficient.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;