import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { alertService } from '../services/alertService';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatFRP, formatCoords } from '../utils/formatters';

export const AlertsPage = () => {
  const { hasRole, user } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, acknowledged: 0, resolved: 0, criticalUnresolved: 0 });
  const [loading, setLoading] = useState(true);

  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Manual Alert Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    severity: 'HIGH',
    region: 'Punjab Agricultural Sector',
    reason: '',
    latitude: 30.38,
    longitude: 75.85,
    clusterId: '',
  });

  const fetchAlertsData = async () => {
    try {
      setLoading(true);
      const [alertsRes, statsRes] = await Promise.all([
        alertService.getAlerts({ severity: severityFilter, status: statusFilter, limit: 100 }),
        alertService.getAlertStats(),
      ]);

      if (alertsRes.success) setAlerts(alertsRes.data || []);
      if (statsRes.success) setStats(statsRes.data || {});
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, [severityFilter, statusFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await alertService.updateAlertStatus(id, 'ACKNOWLEDGED');
      fetchAlertsData();
    } catch (err) {
      console.error('Acknowledge failed:', err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.updateAlertStatus(id, 'RESOLVED');
      fetchAlertsData();
    } catch (err) {
      console.error('Resolve failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert record?')) return;
    try {
      await alertService.deleteAlert(id);
      fetchAlertsData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await alertService.createAlert(newAlert);
      setCreateModalOpen(false);
      setNewAlert({
        title: '',
        message: '',
        severity: 'HIGH',
        region: 'Punjab Agricultural Sector',
        reason: '',
        latitude: 30.38,
        longitude: 75.85,
        clusterId: '',
      });
      fetchAlertsData();
    } catch (err) {
      alert(`Error creating alert: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-fire-500" />
            Tactical Fire Alerts & Decision Support Directives
          </h1>
          <p className="text-xs text-slate-400">
            Automated Satellite Threshold Triggers & Command Escalation Notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasRole(['admin', 'authority']) && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-fire-600 hover:bg-fire-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-fire-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Directive</span>
            </button>
          )}

          <button
            onClick={fetchAlertsData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-850 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Alert Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Alerts</span>
          <p className="text-2xl font-bold text-white font-mono">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Critical Unresolved</span>
          <p className="text-2xl font-bold text-red-400 font-mono">{stats.criticalUnresolved}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">New Directives</span>
          <p className="text-2xl font-bold text-amber-400 font-mono">{stats.new}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Acknowledged</span>
          <p className="text-2xl font-bold text-blue-400 font-mono">{stats.acknowledged}</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Resolved</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-xl bg-dark-850/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase text-[11px]">
          <Filter className="w-3.5 h-3.5 text-fire-500" />
          <span>Filters:</span>
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-fire-500 font-mono"
        >
          <option value="All">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MODERATE">MODERATE</option>
          <option value="LOW">LOW</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-fire-500 font-mono"
        >
          <option value="All">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <LoadingSpinner text="Fetching operational alert notifications..." />
        ) : alerts.length > 0 ? (
          alerts.map((a) => (
            <div
              key={a.alertId || a._id}
              className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                a.status === 'NEW'
                  ? 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-500/5'
                  : a.status === 'ACKNOWLEDGED'
                  ? 'bg-amber-500/5 border-amber-500/25'
                  : 'bg-dark-850/60 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <RiskBadge level={a.severity} size="md" />
                  <span className="font-mono text-xs font-bold text-white">{a.alertId}</span>
                  {a.clusterId && (
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/30">
                      Cluster: {a.clusterId}
                    </span>
                  )}
                  <span className="text-slate-400 font-medium">| {a.region}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      a.status === 'NEW'
                        ? 'bg-red-500 text-white animate-pulse'
                        : a.status === 'ACKNOWLEDGED'
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'bg-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{a.title}</h3>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{a.message}</p>
                {a.reason && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/40 mt-1.5 inline-block">
                    <strong>Trigger Condition:</strong> {a.reason}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono">
                  {a.acknowledgedByName && <span>Ack by: {a.acknowledgedByName} &bull; </span>}
                  {a.resolvedByName && <span>Resolved by: {a.resolvedByName}</span>}
                </div>

                <div className="flex items-center gap-2">
                  {a.status === 'NEW' && hasRole(['admin', 'authority']) && (
                    <button
                      onClick={() => handleAcknowledge(a.alertId || a._id)}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {a.status !== 'RESOLVED' && hasRole(['admin', 'authority']) && (
                    <button
                      onClick={() => handleResolve(a.alertId || a._id)}
                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {hasRole(['admin']) && (
                    <button
                      onClick={() => handleDelete(a.alertId || a._id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                      title="Delete Alert Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl bg-dark-850 border border-slate-800 text-slate-500 text-xs italic">
            No alerts matching active filters.
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Issue Tactical Disaster Directive" size="md">
        <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Directive Title</label>
            <input
              type="text"
              required
              value={newAlert.title}
              onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
              placeholder="e.g. HIGH FRP CROP BURNING WARNING - SANGRUR SECTOR"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-fire-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Operational Message</label>
            <textarea
              rows={3}
              required
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              placeholder="Detailed notification to emergency response units..."
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-fire-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-fire-500 font-mono"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MODERATE">MODERATE</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Region / Sector</label>
              <input
                type="text"
                value={newAlert.region}
                onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-fire-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Trigger Reason / Protocol</label>
            <input
              type="text"
              value={newAlert.reason}
              onChange={(e) => setNewAlert({ ...newAlert, reason: e.target.value })}
              placeholder="e.g. Cluster FRP exceeded 120 MW"
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-fire-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-fire-600 hover:bg-fire-500 text-white font-semibold rounded-lg shadow-lg shadow-fire-600/20 transition-all"
            >
              Dispatch Directive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
