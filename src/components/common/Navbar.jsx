import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Bell, Database, RefreshCw, User, LogOut, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import { uploadService } from '../../services/uploadService';
import { ROLE_LABELS } from '../../utils/constants';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { alerts, unreadCount, criticalCount } = useAlerts();
  const navigate = useNavigate();

  const [utcTime, setUtcTime] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState(null);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadDemo = async (type) => {
    try {
      setDemoLoading(true);
      setShowDemoMenu(false);
      const res = await uploadService.loadDemoDataset(type);
      setDemoMessage(`Loaded: ${res.data?.stats?.valid_records || 0} hotspots`);
      setTimeout(() => setDemoMessage(null), 4000);
      window.location.reload();
    } catch (err) {
      console.error('Demo load failed:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all hotspots, clusters, and alerts to blank state?')) return;
    try {
      setDemoLoading(true);
      await uploadService.resetData();
      window.location.reload();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  const roleInfo = user?.role ? ROLE_LABELS[user.role] : ROLE_LABELS.viewer;

  return (
    <header className="h-16 border-b border-surface-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-nav">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fire-500 to-red-600 flex items-center justify-center shadow-lg shadow-fire-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-surface-800 font-mono">IGNIS<span className="text-fire-500">-AI</span></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-fire-50 text-fire-600 border border-fire-200 px-1.5 py-0.5 rounded">
                SIH 2026
              </span>
            </div>
            <p className="text-[10px] text-surface-400 uppercase tracking-wider font-mono">
              Satellite Thermal Anomaly & Risk Engine
            </p>
          </div>
        </Link>
      </div>

      {/* Center Live Clock */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-200 font-mono text-xs text-surface-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow"></span>
        <span className="text-surface-400">TELEMETRY:</span>
        <span className="font-semibold text-surface-700">{utcTime || 'SYNCHRONIZING...'}</span>
      </div>

      {/* Actions & User State */}
      <div className="flex items-center gap-3">
        {/* Demo Data Quick Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            disabled={demoLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-fire-500/10 text-fire-400 border border-fire-500/30 hover:bg-fire-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{demoLoading ? 'Ingesting...' : 'Demo Presets'}</span>
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-surface-200 shadow-2xl p-2 z-50 text-xs animate-fade-in">
              <div className="px-2 py-1.5 font-semibold text-surface-600 border-b border-surface-200 flex items-center justify-between">
                <span>NASA FIRMS Datasets</span>
                <Database className="w-3.5 h-3.5 text-fire-400" />
              </div>
              <button
                onClick={() => handleLoadDemo('firms_viirs')}
                className="w-full text-left px-2.5 py-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-800 transition-colors flex items-center justify-between"
              >
                <span>Real VIIRS 375m Active (India)</span>
                <span className="text-[10px] text-fire-400 font-mono">VIIRS NRT</span>
              </button>
              <button
                onClick={() => handleLoadDemo('firms_modis')}
                className="w-full text-left px-2.5 py-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-800 transition-colors flex items-center justify-between"
              >
                <span>Real MODIS 1km Data (India)</span>
                <span className="text-[10px] text-blue-400 font-mono">MODIS 6.1</span>
              </button>
              <button
                onClick={() => handleLoadDemo('punjab')}
                className="w-full text-left px-2.5 py-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-800 transition-colors flex items-center justify-between"
              >
                <span>Punjab Agricultural Stubble</span>
                <span className="text-[10px] text-amber-400 font-mono">Dense Agri</span>
              </button>
              <button
                onClick={() => handleLoadDemo('uttarakhand')}
                className="w-full text-left px-2.5 py-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-800 transition-colors flex items-center justify-between"
              >
                <span>Uttarakhand Wildfire Spike</span>
                <span className="text-[10px] text-red-400 font-mono">High FRP</span>
              </button>
              <div className="border-t border-surface-200 mt-1 pt-1 space-y-1">
                <a
                  href="https://firms.modaps.eosdis.nasa.gov/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-fire-400 hover:bg-fire-500/10 transition-colors flex items-center justify-between"
                >
                  <span>NASA FIRMS Download Portal</span>
                  <span className="text-[10px] font-mono">EOSDIS ↗</span>
                </a>
                <button
                  onClick={handleResetData}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Clear All Active Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {demoMessage && (
          <span className="text-xs text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-2 py-1 rounded">
            <CheckCircle2 className="w-3 h-3" />
            {demoMessage}
          </span>
        )}

        {/* Alerts Icon */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          title="Tactical Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Role Badge / Login Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-2 border-l border-surface-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-surface-800 truncate max-w-[130px]">{user.name}</p>
              <span className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold uppercase rounded border ${roleInfo.badge}`}>
                {roleInfo.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fire-600 hover:bg-fire-500 text-white text-xs font-semibold shadow-lg shadow-fire-600/20 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};
