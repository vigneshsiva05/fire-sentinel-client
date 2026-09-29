import React from 'react';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { Flame, Satellite, MapPin, Clock, Calendar, Gauge, ShieldAlert, Cpu } from 'lucide-react';
import { formatFRP, formatConfidence, formatCoords, formatDate } from '../../utils/formatters';

export const HotspotDetailModal = ({ hotspot, isOpen, onClose, onViewCluster = null }) => {
  if (!hotspot) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Hotspot Anomaly [${hotspot.hotspotId || hotspot._id}]`} size="lg">
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fire-500/10 border border-fire-500/30 flex items-center justify-center">
              <Flame className="w-7 h-7 text-fire-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white font-mono">{hotspot.hotspotId}</span>
                <RiskBadge level={hotspot.riskLevel} score={hotspot.riskScore} size="lg" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {formatCoords(hotspot.latitude, hotspot.longitude)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CategoryBadge
              category={hotspot.classification}
              confidence={hotspot.classificationConfidence}
            />
            {hotspot.clusterId && onViewCluster && (
              <button
                onClick={() => onViewCluster(hotspot.clusterId)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-colors flex items-center gap-1.5"
              >
                <span>Cluster: {hotspot.clusterId}</span>
              </button>
            )}
          </div>
        </div>

        {/* Technical Satellite & Sensor Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-fire-400" /> Fire Radiative Power
            </span>
            <p className="text-xl font-bold text-fire-400 font-mono">{formatFRP(hotspot.frp)}</p>
            <span className="text-[10px] text-slate-500">Category: {hotspot.frpCategory || 'Standard'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Detection Confidence
            </span>
            <p className="text-xl font-bold text-amber-400 font-mono">{formatConfidence(hotspot.confidence)}</p>
            <span className="text-[10px] text-slate-500">Day/Night: {hotspot.daynight === 'D' ? 'Daytime' : 'Nighttime'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Sensor Brightness
            </span>
            <p className="text-xl font-bold text-blue-400 font-mono">{hotspot.brightness || 320} K</p>
            <span className="text-[10px] text-slate-500">Ch31: {hotspot.bright_t31 || 295} K</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-purple-400" /> Satellite Observation
            </span>
            <p className="text-base font-bold text-purple-300 font-mono truncate">{hotspot.satellite || 'MODIS'}</p>
            <span className="text-[10px] text-slate-500">{formatDate(hotspot.acqDate, hotspot.acqTime)}</span>
          </div>
        </div>

        {/* Priority & Decision Recommendation */}
        <div className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-fire-500" />
              Priority Level: <span className="text-white font-mono">{hotspot.priority || 'P4 - LOW'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">Score: {hotspot.riskScore}/100</span>
          </div>
          <p className="text-xs text-slate-300 bg-dark-850 p-2.5 rounded-lg border border-slate-800">
            <strong>Incident Reasoning:</strong> {hotspot.priorityReason || 'Thermal anomaly detected within expected range.'}
          </p>
        </div>

        {/* Explainable AI Attribution Panel */}
        <ExplainabilityPanel
          contributingFeatures={hotspot.contributingFeatures}
          classification={hotspot.classification}
          probabilities={hotspot.probabilities}
        />
      </div>
    </Modal>
  );
};
