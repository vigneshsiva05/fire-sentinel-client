import React from 'react';
import { AlertOctagon, Flame, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatFRP, formatCoords, formatArea } from '../../utils/formatters';

export const PriorityQueue = ({ clusters = [], onSelectCluster }) => {
  // Sort clusters by risk score and total FRP descending
  const prioritized = [...clusters]
    .filter((c) => (c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH') && c.status !== 'EXTINGUISHED')
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 5);

  if (prioritized.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-center py-8">
        <ShieldAlert className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
        <p className="text-xs font-semibold text-slate-300">No Critical Priority Fires Active</p>
        <p className="text-[11px] text-slate-500 mt-0.5">All monitored spatial clusters are within nominal limits.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Tactical Priority Incident Queue
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
          {prioritized.length} Escalations
        </span>
      </div>

      <div className="space-y-2.5">
        {prioritized.map((c) => {
          const lat = c.center?.latitude || c.center?.coordinates?.[1];
          const lon = c.center?.longitude || c.center?.coordinates?.[0];

          return (
            <div
              key={c.clusterId || c._id}
              onClick={() => onSelectCluster(c)}
              className="group p-3 rounded-lg bg-dark-900/80 border border-slate-800 hover:border-fire-500/50 hover:bg-slate-800/40 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono group-hover:text-fire-400 transition-colors">
                    {c.clusterId}
                  </span>
                  <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-fire-400 transition-colors" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <CategoryBadge category={c.classification} showIcon={false} />
                <span className="text-fire-400 font-bold">{formatFRP(c.totalFRP || c.maxFRP)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[170px]">{formatCoords(lat, lon)}</span>
                <span className="text-slate-300 font-mono">{c.hotspotCount} pts | {formatArea(c.estimatedAreaKm2)}</span>
              </div>

              <p className="text-[10px] text-amber-300/80 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/40 truncate">
                {c.priorityReason || 'Elevated risk parameters detected.'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
