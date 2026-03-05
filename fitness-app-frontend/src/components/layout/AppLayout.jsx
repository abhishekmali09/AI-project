import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';

const AppLayout = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      {/* Main content area: offset for sidebar on desktop, top bar on mobile */}
      <main className="lg:ml-20 xl:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
