import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/constants';

export const CategoryDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        No classification data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.category || 'Unknown',
    value: d.count || 0,
    totalFRP: d.totalFRP || 0,
    color: CATEGORY_COLORS[d.category] || '#64748b',
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg bg-dark-900 border border-slate-700 p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">{item.name}</p>
          <p className="text-slate-300">Hotspots: <strong className="text-white">{item.value}</strong></p>
          <p className="text-fire-400">Total FRP: <strong className="text-fire-300">{item.totalFRP} MW</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-[10px]">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
            <span className="text-slate-400 truncate max-w-[120px]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
