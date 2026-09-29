import React from 'react';

export const KPICard = ({ title, value, subtitle, icon: Icon, trend, color = 'fire', loading = false }) => {
  const colorMap = {
    fire: {
      border: 'border-fire-500/20 hover:border-fire-500/40',
      bg: 'bg-fire-500/10',
      text: 'text-fire-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    },
  }[color] || {};

  return (
    <div
      className={`group relative rounded-xl border bg-white p-5 backdrop-blur-md transition-all duration-300 shadow-card ${colorMap.border} ${colorMap.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap.bg} ${colorMap.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-24 bg-surface-200 animate-pulse rounded"></div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-surface-800 font-mono">{value}</span>
            {trend && <span className="text-xs text-emerald-400 font-medium">{trend}</span>}
          </div>
        )}
        {subtitle && <p className="mt-1 text-xs text-surface-400 truncate">{subtitle}</p>}
      </div>
    </div>
  );
};
