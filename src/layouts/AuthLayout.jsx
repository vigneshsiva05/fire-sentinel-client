import React from 'react';
import { Outlet } from 'react-router-dom';
import { Flame } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fire-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fire-500 to-red-600 flex items-center justify-center shadow-xl shadow-fire-500/25 mb-3">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-800 font-mono">
            IGNIS<span className="text-fire-500">-AI</span>
          </h1>
          <p className="text-xs text-surface-400 font-mono tracking-wider mt-1">
            Satellite Fire Detection & Risk Assessment
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
