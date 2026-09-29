import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@ignis.gov.in');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('Password@123');
  };

  return (
    <div className="p-8 rounded-2xl bg-white border border-surface-200 shadow-panel backdrop-blur-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-surface-800 tracking-tight">Mission Control Sign In</h2>
        <p className="text-xs text-surface-400 mt-1">
          Access the AI satellite fire monitoring &amp; decision support console
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Demo Accounts Selector */}
      <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-fire-500" />
          1-Click SIH Demo Role Presets:
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@ignis.gov.in')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'admin@ignis.gov.in'
                ? 'bg-purple-50 text-purple-700 border-purple-300'
                : 'bg-white text-surface-500 border-surface-200 hover:text-surface-800 hover:border-surface-300'
            }`}
          >
            <p className="font-bold">Chief Admin</p>
            <p className="text-[9px] text-surface-400 truncate">admin@ignis.gov.in</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('officer@disaster.gov.in')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'officer@disaster.gov.in'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-surface-500 border-surface-200 hover:text-surface-800 hover:border-surface-300'
            }`}
          >
            <p className="font-bold">Forest Officer</p>
            <p className="text-[9px] text-surface-400 truncate">officer@disaster.gov.in</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('researcher@isro.gov.in')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'researcher@isro.gov.in'
                ? 'bg-teal-50 text-teal-700 border-teal-300'
                : 'bg-white text-surface-500 border-surface-200 hover:text-surface-800 hover:border-surface-300'
            }`}
          >
            <p className="font-bold">ISRO Scientist</p>
            <p className="text-[9px] text-surface-400 truncate">researcher@isro.gov.in</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('viewer@public.org')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'viewer@public.org'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-surface-500 border-surface-200 hover:text-surface-800 hover:border-surface-300'
            }`}
          >
            <p className="font-bold">Public Viewer</p>
            <p className="text-[9px] text-surface-400 truncate">viewer@public.org</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-surface-600 font-semibold mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-surface-200 rounded-lg pl-9 pr-3 py-2.5 text-surface-800 placeholder-surface-400 focus:outline-none focus:border-fire-500 focus:ring-1 focus:ring-fire-500/20 font-mono transition-colors"
            />
            <Mail className="w-4 h-4 text-surface-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-surface-600 font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-surface-200 rounded-lg pl-9 pr-3 py-2.5 text-surface-800 placeholder-surface-400 focus:outline-none focus:border-fire-500 focus:ring-1 focus:ring-fire-500/20 font-mono transition-colors"
            />
            <Key className="w-4 h-4 text-surface-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-fire-600 hover:bg-fire-500 text-white font-bold rounded-xl shadow-lg shadow-fire-600/20 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-surface-400 border-t border-surface-200 pt-4">
        <span>Need an operator account? </span>
        <Link to="/register" className="text-fire-500 hover:text-fire-600 font-semibold underline">
          Register new user
        </Link>
      </div>
    </div>
  );
};
