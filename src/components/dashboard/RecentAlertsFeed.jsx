import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { RiskBadge } from '../common/RiskBadge';

export const RecentAlertsFeed = () => {
  const { alerts, acknowledgeAlert, loading } = useAlerts();
  const { hasRole } = useAuth();

  const recent = alerts.slice(0, 5);

  return (
    <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-fire-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Operational Alerts
          </h3>
        </div>
        <Link
          to="/alerts"
          className="text-[11px] text-fire-400 hover:text-fire-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>All Alerts</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {recent.length > 0 ? (
          recent.map((a) => (
            <div
              key={a.alertId || a._id}
              className={`p-3 rounded-lg border transition-all text-xs space-y-1.5 ${
                a.status === 'NEW'
                  ? 'bg-red-500/10 border-red-500/30'
                  : a.status === 'ACKNOWLEDGED'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-dark-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiskBadge level={a.severity} size="sm" />
                  <span className="font-mono text-[10px] text-slate-400">{a.region}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="font-semibold text-slate-200 text-xs leading-snug">{a.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2">{a.message}</p>

              {/* Acknowledge Button */}
              {a.status === 'NEW' && hasRole(['admin', 'authority']) && (
                <div className="pt-1.5 flex justify-end">
                  <button
                    onClick={() => acknowledgeAlert(a.alertId || a._id)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 px-2.5 py-1 rounded transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 italic">
            No recent operational alerts logged.
          </div>
        )}
      </div>
    </div>
  );
};
