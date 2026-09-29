import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const RegionalChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        No regional fire telemetry available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg bg-dark-900 border border-slate-700 p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">{item.region}</p>
          <p className="text-slate-300">Hotspot Count: <strong className="text-white">{item.count}</strong></p>
          <p className="text-red-400">Critical Incidents: <strong className="text-white">{item.criticalCount}</strong></p>
          <p className="text-fire-400">Total FRP: <strong className="text-fire-300">{Math.round(item.totalFRP)} MW</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data.slice(0, 6)}
          margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
          <YAxis
            dataKey="region"
            type="category"
            tick={{ fill: '#cbd5e1', fontSize: 10 }}
            width={100}
            axisLine={{ stroke: '#334155' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
