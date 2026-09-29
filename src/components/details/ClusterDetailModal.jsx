import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Flame, MapPin, Gauge, Layers, ShieldCheck, AlertOctagon, CheckCircle2, Radio, Info } from 'lucide-react';
import { clusterService } from '../../services/clusterService';
import { formatFRP, formatConfidence, formatCoords, formatArea } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export const ClusterDetailModal = ({ cluster, isOpen, onClose, onSelectHotspot = null, onStatusUpdated = () => {} }) => {
  const { hasRole } = useAuth();
  const [memberHotspots, setMemberHotspots] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('ACTIVE');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const clusterId = cluster?.clusterId || cluster?.cluster_id;

  useEffect(() => {
    if (cluster && isOpen) {
      setCurrentStatus(cluster.status || 'ACTIVE');
      fetchClusterHotspots();
    }
  }, [cluster, isOpen]);

  const fetchClusterHotspots = async () => {
    if (!clusterId) return;
    try {
      setLoadingMembers(true);
      const res = await clusterService.getClusterHotspots(clusterId);
      if (res.success) {
        setMemberHotspots(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch cluster hotspots:', err.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await clusterService.updateClusterStatus(clusterId, newStatus);
      if (res.success) {
        setCurrentStatus(newStatus);
        onStatusUpdated(res.data);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!cluster) return null;

  const lat = cluster.center?.latitude || cluster.center?.coordinates?.[1];
  const lon = cluster.center?.longitude || cluster.center?.coordinates?.[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Fire Event Cluster [${clusterId}]`} size="xl">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fire-500/15 border border-fire-500/30 flex items-center justify-center">
              <Flame className="w-7 h-7 text-fire-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white font-mono">{clusterId}</span>
                <RiskBadge level={cluster.riskLevel || cluster.risk_level} score={cluster.riskScore || cluster.risk_score} size="lg" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Centroid: {formatCoords(lat, lon)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CategoryBadge category={cluster.classification} />
            
            {/* Tactical Status Tag / Switcher */}
            {hasRole(['admin', 'authority']) ? (
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="bg-dark-850 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-fire-500"
              >
                <option value="ACTIVE">Status: ACTIVE</option>
                <option value="CONTAINED">Status: CONTAINED</option>
                <option value="EXTINGUISHED">Status: EXTINGUISHED</option>
                <option value="MONITORING">Status: MONITORING</option>
              </select>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-xs font-semibold text-slate-300">
                {currentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Spatial & Energetic Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Total Radiative Power
            </span>
            <p className="text-xl font-bold text-fire-400 font-mono">{formatFRP(cluster.totalFRP || cluster.total_frp)}</p>
            <span className="text-[10px] text-slate-500">Max Peak: {formatFRP(cluster.maxFRP || cluster.max_frp)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Hotspot Aggregation
            </span>
            <p className="text-xl font-bold text-white font-mono">
              {cluster.hotspotCount || cluster.hotspot_count} <span className="text-xs text-slate-400">anomalies</span>
            </p>
            <span className="text-[10px] text-slate-500">DBSCAN Epsilon: 12 km</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Estimated Affected Area
            </span>
            <p className="text-lg font-bold text-blue-400 font-mono">
              {formatArea(cluster.estimatedAreaKm2 || cluster.estimated_area_km2, cluster.estimatedAreaHectares || cluster.estimated_area_hectares)}
            </p>
            <span className="text-[10px] text-slate-500">Convex Hull Delineation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Detection Timeline
            </span>
            <p className="text-xs font-bold text-slate-200 font-mono">
              {cluster.firstDetected || cluster.first_detected || 'Recent pass'}
            </p>
            <span className="text-[10px] text-slate-500">
              Last: {cluster.lastDetected || cluster.last_detected || 'Ongoing'}
            </span>
          </div>
        </div>

        {/* Priority Action Directive */}
        <div className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              Priority Protocol: <span className="text-fire-400 font-mono">{cluster.priority || 'P1 - CRITICAL'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Risk Index: {cluster.riskScore || cluster.risk_score}/100
            </span>
          </div>
          <p className="text-xs text-slate-300 bg-dark-850 p-2.5 rounded-lg border border-slate-800">
            <strong>Action Directive:</strong> {cluster.actionRecommended || cluster.action_recommended || 'Ground reconnaissance and alert notification.'}
          </p>
          <p className="text-[11px] text-slate-400">
            <strong>Reasoning:</strong> {cluster.priorityReason || cluster.priority_reason || 'Multi-point thermal cluster identified with elevated FRP.'}
          </p>
        </div>

        {/* Member Hotspots List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-fire-400" />
              Member Hotspot Telemetry ({memberHotspots.length || cluster.hotspotCount || cluster.hotspot_count})
            </h4>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-dark-900/50">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-dark-850 text-slate-400 text-[10px] uppercase border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Coordinates</th>
                  <th className="p-2.5">FRP</th>
                  <th className="p-2.5">Confidence</th>
                  <th className="p-2.5">Satellite</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {memberHotspots.length > 0 ? (
                  memberHotspots.map((h, i) => (
                    <tr key={h._id || i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-2.5 font-bold text-white">{h.hotspotId}</td>
                      <td className="p-2.5">{formatCoords(h.latitude, h.longitude)}</td>
                      <td className="p-2.5 font-bold text-fire-400">{formatFRP(h.frp)}</td>
                      <td className="p-2.5 text-slate-300">{formatConfidence(h.confidence)}</td>
                      <td className="p-2.5 text-slate-400">{h.satellite} ({h.daynight})</td>
                      <td className="p-2.5 text-right">
                        {onSelectHotspot && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectHotspot(h);
                            }}
                            className="text-xs text-fire-400 hover:text-fire-300 underline"
                          >
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-500 italic">
                      {loadingMembers ? 'Loading member hotspots...' : 'No detailed member records loaded.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Boundary Disclaimer */}
        <div className="p-3 rounded-lg bg-dark-850/80 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {cluster.boundaryDisclaimer ||
              'Estimated fire-event extent generated from hotspot spatial envelope. Not pixel-level satellite image segmentation.'}
          </span>
        </div>
      </div>
    </Modal>
  );
};
