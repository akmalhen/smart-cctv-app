// src/pages/Areas.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

// Fungsi helper untuk menentukan warna status
const getStatusColor = (occupied, total) => {
  if (total === 0) return 'bg-gray-400'; // Kasus jika tidak ada spot
  const occupancy = (occupied / total) * 100;
  if (occupancy === 100) return 'bg-status-red';
  if (occupancy > 80) return 'bg-status-yellow';
  return 'bg-status-green';
};

// Data Dummy (Nanti diisi dari API)
const areasData = [
  { id: 'basement', name: 'Basement', cctvCount: 5, occupied: 25, available: 0, total: 25 },
  { id: 'valet', name: 'valet', cctvCount: 4, occupied: 27, available: 3, total: 30 },
  { id: 'outdoor', name: 'Outdoor', cctvCount: 7, occupied: 10, available: 40, total: 50 },
];

const AreaCard = ({ area }) => (
  <Link 
    to={`/areas/${area.id}`} 
    className="bg-white p-6 rounded-2xl border border-gray-300 hover:shadow-lg hover:border-primary transition-all duration-200"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold text-primary capitalize">{area.name}</h3>
        <p className="text-sm text-gray-400">{area.cctvCount} CCTV</p>
      </div>
      <div className={`w-4 h-4 rounded-full ${getStatusColor(area.occupied, area.total)}`}></div>
    </div>
    <div className="mt-4 flex justify-around text-center pt-4 border-t border-gray-100">
      <div>
        <p className="text-4xl font-bold text-primary">{area.occupied}</p>
        <p className="text-sm text-gray-500">occupied</p>
      </div>
      <div className="border-l border-gray-200 mx-2"></div>
      <div>
        <p className="text-4xl font-bold text-primary">{area.available}</p>
        <p className="text-sm text-gray-500">available</p>
      </div>
    </div>
  </Link>
);

const AddCard = () => (
  <button className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200 min-h-[160px]">
    <FiPlus size={40} className="text-gray-400" />
  </button>
);

const Areas = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 text-right">Areas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {areasData.map(area => <AreaCard key={area.id} area={area} />)}
        <AddCard />
      </div>
    </div>
  );
};

export default Areas;