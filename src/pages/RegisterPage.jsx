import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Key, User, Building, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'authority',
    department: 'State Wildfire Response Force',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-dark-850/95 border border-slate-700/60 shadow-2xl backdrop-blur-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Register Operator Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Create new authorized credentials for disaster management operations
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Officer Rohit Sharma"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-fire-500"
            />
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
          <div className="relative">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. officer@disaster.gov.in"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-fire-500 font-mono"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-fire-500 font-mono"
            />
            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Designated Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-fire-500 font-mono"
            >
              <option value="authority">Authority / Officer</option>
              <option value="researcher">Researcher</option>
              <option value="viewer">Viewer (Read-Only)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Forest Dept"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-fire-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-fire-600 hover:bg-fire-500 text-white font-bold rounded-xl shadow-lg shadow-fire-600/25 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Credentials...' : 'Register Operator Account'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
        <span>Already registered? </span>
        <Link to="/login" className="text-fire-400 hover:text-fire-300 font-semibold underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
