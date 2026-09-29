import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Bell,
  History,
  UploadCloud,
  Sliders,
  User,
  Flame,
  Radio
} from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

export const Sidebar = () => {
  const { unreadCount } = useAlerts();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live GIS Map', path: '/map', icon: Map, badge: 'Live' },
    { name: 'Analytics & Trends', path: '/analytics', icon: BarChart3 },
    { name: 'Tactical Alerts', path: '/alerts', icon: Bell, count: unreadCount },
    { name: 'Historical Archive', path: '/historical', icon: History },
    { name: 'Data Ingestion', path: '/upload', icon: UploadCloud },
    { name: 'Risk & Thresholds', path: '/settings', icon: Sliders },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-surface-200 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] shadow-sm">
      <div className="p-4 space-y-6">
        {/* Operations Status Card */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">FIRMS Ingest Active</p>
              <p className="text-[10px] text-emerald-600 font-mono">DBSCAN + RF Ready</p>
            </div>
          </div>
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-fire-50 text-fire-600 border border-fire-200 font-semibold shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}

                {item.count > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white font-mono">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        {/* External NASA FIRMS Quick Hub */}
        <div className="pt-2 border-t border-surface-200 space-y-2">
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-surface-400">
            NASA EOSDIS Satellite Data
          </p>
          <div className="space-y-1">
            <a
              href="https://firms.modaps.eosdis.nasa.gov/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-surface-400 hover:text-fire-600 hover:bg-fire-50 transition-all border border-transparent hover:border-fire-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-3.5 h-3.5 text-fire-500 group-hover:animate-pulse" />
                <span>FIRMS Download</span>
              </div>
              <span className="text-[10px] text-surface-400 font-mono group-hover:text-fire-500">↗</span>
            </a>

            <a
              href="https://firms.modaps.eosdis.nasa.gov/map/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-surface-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                <span>Global Fire Map</span>
              </div>
              <span className="text-[10px] text-surface-400 font-mono group-hover:text-blue-500">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="p-4 border-t border-surface-200 bg-surface-50 text-[11px] text-surface-400">
        <div className="flex items-center justify-between text-slate-400">
          <span>AI Stack:</span>
          <span className="text-surface-600 font-mono">FastAPI / RF</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 mt-1">
          <span>Clustering:</span>
          <span className="text-surface-600 font-mono">DBSCAN + ConvexHull</span>
        </div>
        <div className="mt-3 pt-2 border-t border-surface-200 text-[10px] text-surface-400 text-center">
          Smart India Hackathon 2026
        </div>
      </div>
    </aside>
  );
};

