// src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { FiLayout, FiMap, FiBarChart2, FiSettings, FiUser, FiMoreVertical, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const SidebarLink = ({ to, icon, children, isExpanded }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-primary-focus text-white' : 'text-gray-300 hover:bg-primary-focus/50 hover:text-white'
        }`
      }
    >
      {icon}
      {isExpanded && <span className="ml-4 font-alice text-lg whitespace-nowrap">{children}</span>}
    </NavLink>
  </li>
);

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen font-alice bg-base-100">
      {/* Sidebar */}
      <aside className={`bg-primary text-white flex flex-col p-4 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-20'}`}>
        <div className="flex items-center mb-10">
          {isExpanded && (
            <Link to="/dashboard">
              <img src={Logo} alt="SmartCCTV Logo" className="h-8 brightness-0 invert" />
            </Link>
          )}
          <button onClick={() => setIsExpanded(!isExpanded)} className="ml-auto text-gray-400 hover:text-white">
            {isExpanded ? <FiChevronsLeft size={24} /> : <FiChevronsRight size={24} />}
          </button>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <SidebarLink to="/dashboard" icon={<FiLayout size={24} />} isExpanded={isExpanded}>Dashboard</SidebarLink>
            <SidebarLink to="/areas" icon={<FiMap size={24} />} isExpanded={isExpanded}>Areas</SidebarLink>
            <SidebarLink to="/analytics" icon={<FiBarChart2 size={24} />} isExpanded={isExpanded}>Analytics</SidebarLink>
            <SidebarLink to="/settings" icon={<FiSettings size={24} />} isExpanded={isExpanded}>Settings</SidebarLink>
          </ul>
        </nav>
        
        <div className={`mt-auto flex items-center p-2 rounded-lg hover:bg-primary-focus/30 ${isExpanded ? '' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser size={20} />
          </div>
          {isExpanded && (
            <>
              <div className="ml-3">
                <p className="font-semibold whitespace-nowrap">User12312</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-white">
                <FiMoreVertical size={20} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;