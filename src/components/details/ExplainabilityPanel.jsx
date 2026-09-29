import React from 'react';
import { Sparkles, HelpCircle, Activity, Info } from 'lucide-react';

export const ExplainabilityPanel = ({ contributingFeatures = [], classification = '', probabilities = {} }) => {
  const featureLabelMap = {
    frp: 'Fire Radiative Power (MW)',
    brightness: 'Channel Brightness Temp (K)',
    bright_t31: 'Channel 31 Background Temp (K)',
    confidence: 'Satellite Detection Confidence',
    is_day: 'Daytime Solar Flag',
    thermal_ratio: 'Thermal Brightness Ratio (Ch21/Ch31)',
    log_frp: 'Logarithmic FRP Scale',
    scan: 'Satellite Sensor Scan (km)',
    track: 'Satellite Sensor Track (km)',
    hour_normalized: 'Time of Day Normalized',
    hotspot_local_density: 'Hotspot Spatial Clustering Density (10km)',
    est_forest_distance_km: 'Proximity to Forest Canopy (km)',
    est_agri_distance_km: 'Proximity to Agricultural Farmland (km)',
    est_urban_distance_km: 'Proximity to Urban / Built-up Area (km)'
  };

  return (
    <div className="space-y-4 rounded-xl bg-dark-900/70 border border-slate-800 p-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fire-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Explainable AI (XAI) Attribution
          </h4>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
          RandomForest-SIH-v1.0
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Top contributing geospatial and thermal features driving the model prediction towards{' '}
        <strong className="text-fire-400">{classification}</strong>:
      </p>

      {/* Feature Importance Bars */}
      <div className="space-y-2.5">
        {contributingFeatures && contributingFeatures.length > 0 ? (
          contributingFeatures.map((feat, idx) => {
            const label = featureLabelMap[feat.feature] || feat.feature;
            const weight = feat.importance_weight || 0.25;
            const percentage = Math.round(weight * 100);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 truncate max-w-[220px]">{label}</span>
                  <span className="text-slate-400">
                    Val: <strong className="text-white">{feat.value}</strong> ({percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-fire-500 transition-all duration-500"
                    style={{ width: `${Math.max(10, Math.min(100, percentage * 2.5))}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-500 italic py-2">
            No specific feature attributions recorded for this anomaly.
          </div>
        )}
      </div>

      {/* Class Probabilities Distribution */}
      {probabilities && Object.keys(probabilities).length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Class Prediction Probabilities:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {Object.entries(probabilities).map(([cls, prob]) => (
              <div key={cls} className="flex justify-between p-1.5 rounded bg-dark-850 border border-slate-800/80">
                <span className="text-slate-400 truncate max-w-[130px]">{cls}</span>
                <span className={`font-bold ${cls === classification ? 'text-fire-400' : 'text-slate-500'}`}>
                  {Math.round(Number(prob) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-[10px] text-slate-500 flex items-start gap-1.5 pt-2 border-t border-slate-800/50">
        <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
        <span>Attributions calculated using Random Forest Gini feature importances & spatial distance priors.</span>
      </div>
    </div>
  );
};
