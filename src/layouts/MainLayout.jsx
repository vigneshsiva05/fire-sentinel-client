import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-700 selection:bg-fire-500 selection:text-white">
      <Navbar />
      <DisclaimerBanner />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-surface-50 to-surface-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
