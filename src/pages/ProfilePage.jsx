import React, { useState } from 'react';
import { User, Shield, Building, Mail, Calendar, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ROLE_LABELS } from '../utils/constants';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const roleInfo = user?.role ? ROLE_LABELS[user.role] : ROLE_LABELS.viewer;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authService.updateProfile({ name, department });
      setMsg('Profile updated successfully');
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[800px] mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="w-5 h-5 text-fire-500" />
          Operator Profile & Access Credentials
        </h1>
        <p className="text-xs text-slate-400">
          Role-based permissions and disaster response unit credentials
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-fire-500/15 border border-fire-500/30 flex items-center justify-center font-mono text-2xl font-bold text-fire-400">
            {user?.name?.slice(0, 2).toUpperCase() || 'OP'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white">{user?.name || 'Guest User'}</h2>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${roleInfo.badge}`}>
                {roleInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email || 'N/A'}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department / Operations Force</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-fire-600 hover:bg-fire-500 text-white font-bold rounded-xl shadow-lg shadow-fire-600/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
