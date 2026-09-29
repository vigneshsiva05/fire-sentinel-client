import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const FRPTimelineChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        No FRP timeline observations available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg bg-dark-900 border border-slate-700 p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">{item.timestamp}</p>
          <p className="text-fire-400">Total FRP: <strong className="text-white">{item.totalFRP} MW</strong></p>
          <p className="text-amber-400">Avg FRP: <strong className="text-white">{item.avgFRP} MW</strong></p>
          <p className="text-slate-300">Hotspots: <strong className="text-white">{item.count}</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="frpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalFRP"
            stroke="#f97316"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#frpGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
