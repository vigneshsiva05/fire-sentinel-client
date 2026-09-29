import React from 'react';
import { Flame } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading AI Satellite Telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-fire-500 animate-spin"></div>
        <Flame className="w-5 h-5 text-fire-500 absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-400 tracking-wide font-mono">{text}</p>
    </div>
  );
};
