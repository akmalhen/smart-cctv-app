// src/pages/AreaDetail.jsx (Versi Benar dan Aman)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';

// Fungsi helper (tidak berubah)
const getCardBgColor = (occupied, total) => {
  if (total === 0) return 'bg-gray-200 text-gray-500';
  const occupancy = (occupied / total) * 100;
  if (occupancy === 100) return 'bg-card-red text-red-800';
  if (occupancy > 80) return 'bg-card-yellow text-yellow-800';
  return 'bg-card-green text-green-800';
};

// Data Dummy (tidak berubah)
const cameraData = {
  basement: [
    { id: 'bs-a', name: 'Basement-A', occupied: 20, available: 0, total: 20 },
    { id: 'bs-b', name: 'Basement-B', occupied: 20, available: 0, total: 20 },
    { id: 'bs-c', name: 'Basement-C', occupied: 15, available: 5, total: 20 },
    { id: 'bs-d', name: 'Basement-D', occupied: 5, available: 15, total: 20 },
    { id: 'bs-e', name: 'Basement-E', occupied: 2, available: 18, total: 20 },
    { id: 'bs-f', name: 'Basement-F', occupied: 19, available: 1, total: 20 },
  ],
  valet: [ { id: 'v-a', name: 'Valet-A', occupied: 10, available: 5, total: 15 } ],
  outdoor: [ { id: 'o-a', name: 'Outdoor-A', occupied: 5, available: 20, total: 25 } ],
};

const CameraCard = ({ camera }) => {
  const bgColor = getCardBgColor(camera.occupied, camera.total);
  return (
    <div className={`p-6 rounded-2xl border border-gray-300 ${bgColor}`}>
      <h3 className="text-xl font-bold">{camera.name}</h3>
      <div className="mt-4 flex justify-around text-center pt-4">
        <div>
          <p className="text-4xl font-bold">{camera.occupied}</p>
          <p className="text-sm">occupied</p>
        </div>
        <div className="border-l border-current opacity-30 mx-2"></div>
        <div>
          <p className="text-4xl font-bold">{camera.available}</p>
          <p className="text-sm">available</p>
        </div>
      </div>
    </div>
  );
};

const AddCameraCard = () => (
    <button className="bg-gray-200 p-6 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200 min-h-[160px]">
      <FiPlus size={40} className="text-gray-400" />
    </button>
);

const AreaDetail = () => {
  const { areaId } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  // --- LOGIKA YANG DIPERBAIKI DI SINI ---
  // 1. Ambil data, jika tidak ada, default ke array kosong
  const currentCameraData = cameraData[areaId] || [];
  
  // 2. Tentukan nama area dengan aman, beri fallback jika areaId tidak ada
  const areaName = areaId ? areaId.charAt(0).toUpperCase() + areaId.slice(1) : "Area Tidak Ditemukan";

  // 3. Tambahkan kondisi jika areaId tidak valid
  if (!areaId || !cameraData[areaId]) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-500">Error: Area tidak ditemukan.</h1>
        <button onClick={() => navigate('/areas')} className="mt-4 text-blue-500 hover:underline">
          Kembali ke Daftar Area
        </button>
      </div>
    );
  }
  // --- AKHIR DARI LOGIKA YANG DIPERBAIKI ---

  return (
    <div>
      <header className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <FiArrowLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-4xl font-bold text-primary capitalize">{areaName}</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentCameraData.map(camera => <CameraCard key={camera.id} camera={camera} />)}
        <AddCameraCard />
      </div>
    </div>
  );
};

export default AreaDetail;