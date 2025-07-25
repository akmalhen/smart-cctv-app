// src/pages/Dashboard.jsx
import React from 'react';
// DIUBAH: Impor diperbaiki dengan menambahkan CartesianGrid
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

// Data Dummy (sama seperti sebelumnya, bisa diisi dari API nanti)
const overviewData = [
  { name: 'areas', value: '5' },
  { name: 'cameras', value: '30' },
  { name: 'spots', value: '150' },
  { name: 'availables', value: '68' },
];

const areaSummaryData = [
  { name: 'Basement', total: 200, occupied: 25 },
  { name: 'Valet', total: 50, occupied: 45 },
];

const barChartData = [
  { name: 'Basement A', occupied: 4 },
  { name: 'Basement C', occupied: 10 },
  { name: 'Parkir A', occupied: 15 },
  { name: 'Parkir D', occupied: 8 },
  { name: 'Outdoor B', occupied: 11 },
  { name: 'Outdoor F', occupied: 28 },
  { name: 'Other', occupied: 19 },
];

const lineChartData = [
  { time: '9 AM', Occupancy: 30 },
  { time: '12 AM', Occupancy: 65 },
  { time: '15 AM', Occupancy: 80 },
  { time: '18 AM', Occupancy: 72 },
  { time: '21 AM', Occupancy: 60 },
];

const OverviewCard = ({ item }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-300 text-center">
    <p className="text-5xl font-bold text-primary">{item.value}</p>
    <p className="text-gray-500 capitalize mt-1">{item.name}</p>
  </div>
);

const AreaCard = ({ area }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-300">
    <h3 className="text-xl font-bold text-primary">{area.name}</h3>
    <p className="text-sm text-gray-400 mb-4">{area.total} spots</p>
    <div className="flex justify-around text-center">
      <div>
        <p className="text-3xl font-bold text-primary">{area.occupied}</p>
        <p className="text-sm text-gray-500">occupied</p>
      </div>
      <div className="border-l border-gray-200 mx-2"></div>
      <div>
        <p className="text-3xl font-bold text-primary">{area.total - area.occupied}</p>
        <p className="text-sm text-gray-500">available</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 text-right">Dashboard</h1>

      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewData.map(item => <OverviewCard key={item.name} item={item} />)}
        </div>
      </section>

      {/* Area Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areaSummaryData.map(area => <AreaCard key={area.name} area={area} />)}
        {/* Kartu "See More" sebagai Link */}
        <Link to="/areas" className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200">
          <p className="text-gray-400 text-lg">see more</p>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
          {/* Bar Chart */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Availability by spots</h3>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#6b7280' }} />
                        <Tooltip cursor={{fill: 'rgba(241, 241, 241, 0.5)'}}/>
                        <Bar dataKey="occupied" fill="#305f7d" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Occupancy Rate</h3>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Line type="monotone" dataKey="Occupancy" stroke="#20445b" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;