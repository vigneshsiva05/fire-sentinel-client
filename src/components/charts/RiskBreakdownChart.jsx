import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const RiskBreakdownChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        No risk distribution data available
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MODERATE':
        return '#f59e0b';
      case 'LOW':
      default:
        return '#10b981';
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg bg-dark-900 border border-slate-700 p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">Risk Level: {item.level}</p>
          <p className="text-slate-300">Clusters: <strong className="text-white">{item.clusterCount}</strong></p>
          <p className="text-slate-300">Hotspots: <strong className="text-white">{item.hotspotCount}</strong></p>
          <p className="text-fire-400">Total FRP: <strong className="text-fire-300">{item.totalFRP} MW</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="level" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="clusterCount" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.level)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
