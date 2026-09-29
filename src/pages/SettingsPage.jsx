import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, Gauge, Layers, Bell, Save, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SettingsPage = () => {
  const { hasRole } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      if (res.success) setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasRole(['admin'])) {
      alert('Only Admin users can modify system calibration settings.');
      return;
    }

    try {
      setSaving(true);
      const res = await settingsService.updateSettings(settings);
      if (res.success) {
        setSuccessMsg('Risk weights and FRP thresholds updated successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <LoadingSpinner text="Loading system threshold parameters..." />;
  }

  const isAdmin = hasRole(['admin']);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-fire-500" />
          Model Calibration, Risk Weights & FRP Thresholds
        </h1>
        <p className="text-xs text-slate-400">
          Dynamically configure domain decision-support weights, DBSCAN spatial epsilon, and alert triggers
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. FRP Intensity Thresholds */}
        <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Gauge className="w-4 h-4 text-fire-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Fire Radiative Power (FRP) Categorization Thresholds (MW)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-emerald-400 font-semibold mb-1">Low FRP (&lt; MW)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.frpThresholds?.low ?? 20}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    frpThresholds: { ...settings.frpThresholds, low: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-amber-400 font-semibold mb-1">Moderate FRP (MW)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.frpThresholds?.moderate ?? 60}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    frpThresholds: { ...settings.frpThresholds, moderate: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-orange-400 font-semibold mb-1">High FRP (MW)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.frpThresholds?.high ?? 150}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    frpThresholds: { ...settings.frpThresholds, high: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-red-400 font-semibold mb-1">Extreme FRP (&gt; MW)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.frpThresholds?.extreme ?? 250}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    frpThresholds: { ...settings.frpThresholds, extreme: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Multi-Criteria Risk Formula Weights */}
        <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Multi-Criteria Risk Score Component Weights (Sum = 1.0)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intensity Weight (w_int)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                disabled={!isAdmin}
                value={settings.riskWeights?.w_intensity ?? 0.35}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    riskWeights: { ...settings.riskWeights, w_intensity: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Spatial Weight (w_spa)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                disabled={!isAdmin}
                value={settings.riskWeights?.w_spatial ?? 0.25}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    riskWeights: { ...settings.riskWeights, w_spatial: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Exposure Weight (w_exp)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                disabled={!isAdmin}
                value={settings.riskWeights?.w_exposure ?? 0.25}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    riskWeights: { ...settings.riskWeights, w_exposure: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confidence Weight (w_cnf)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                disabled={!isAdmin}
                value={settings.riskWeights?.w_confidence ?? 0.15}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    riskWeights: { ...settings.riskWeights, w_confidence: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Clustering Parameters */}
        <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Layers className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Spatial DBSCAN Clustering Parameters
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Epsilon Distance Radius (km)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.clusteringParams?.eps_km ?? 12}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    clusteringParams: { ...settings.clusteringParams, eps_km: parseFloat(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Minimum Anomaly Samples (min_samples)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.clusteringParams?.min_samples ?? 2}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    clusteringParams: { ...settings.clusteringParams, min_samples: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fire-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-fire-600 hover:bg-fire-500 text-white font-bold rounded-xl shadow-lg shadow-fire-600/25 transition-all disabled:opacity-50 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Apply Calibrated Settings'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
