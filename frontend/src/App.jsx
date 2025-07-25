// src/App.jsx (Versi Benar)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Areas from './pages/Areas';
import AreaDetail from './pages/AreaDetail';

// Komponen dummy untuk Analytics & Settings jika belum ada file-nya
const Analytics = () => <div>Halaman Analytics</div>;
const Settings = () => <div>Halaman Settings</div>;

function App() {
  return (
    <Routes>
      {/* Rute Publik (tanpa DashboardLayout) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rute Privat (SEMUA dibungkus oleh SATU DashboardLayout) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/areas" element={<Areas />} />
        {/* Nama parameter harus sama dengan yang Anda gunakan di useParams() */}
        <Route path="/areas/:areaId" element={<AreaDetail />} /> 
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;