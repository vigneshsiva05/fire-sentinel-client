import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-fire-500/10 border border-fire-500/30 flex items-center justify-center">
        <Flame className="w-8 h-8 text-fire-500" />
      </div>
      <h1 className="text-3xl font-bold font-mono text-white">404 - Coordinates Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The satellite telemetry sector or page you requested does not exist in the active GIS database.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-fire-600 hover:bg-fire-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-fire-600/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Mission Control</span>
      </Link>
    </div>
  );
};
