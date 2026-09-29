import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Gauge, PieChart, Layers, Download, RefreshCw, Satellite } from 'lucide-react';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';
import { RiskBreakdownChart } from '../components/charts/RiskBreakdownChart';
import { FRPTimelineChart } from '../components/charts/FRPTimelineChart';
import { RegionalChart } from '../components/charts/RegionalChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { analyticsService } from '../services/analyticsService';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { formatFRP } from '../utils/formatters';

export const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [categories, setCategories] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [frpTimeline, setFrpTimeline] = useState([]);
  const [regions, setRegions] = useState([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [kpiRes, catRes, riskRes, timeRes, regRes] = await Promise.all([
        analyticsService.getKPIs(),
        analyticsService.getCategories(),
        analyticsService.getRiskLevels(),
        analyticsService.getFRPTimeline(),
        analyticsService.getRegions(),
      ]);

      if (kpiRes.success) setKpis(kpiRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (riskRes.success) setRiskLevels(riskRes.data);
      if (timeRes.success) setFrpTimeline(timeRes.data);
      if (regRes.success) setRegions(regRes.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportAnalyticsReport = () => {
    const report = {
      summaryKPIs: kpis,
      categoriesDistribution: categories,
      riskLevelBreakdown: riskLevels,
      frpTimelineTrends: frpTimeline,
      regionalDistribution: regions,
      generatedAt: new Date().toISOString(),
    };
    exportToJSON(report, `ignis_satellite_fire_analytics_report_${Date.now()}.json`);
  };

  if (loading) {
    return <LoadingSpinner text="Computing Multi-Factor Fire Analytics & FRP Distributions..." />;
  }

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fire-500" />
            Satellite Fire Intelligence & Multi-Variate Analytics
          </h1>
          <p className="text-xs text-slate-400">
            FRP Energy Dispersion, Temporal Spikes, AI Category Telemetry, and Vulnerability Indexes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAnalyticsReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-fire-600 hover:bg-fire-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-fire-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Intel JSON</span>
          </button>
        </div>
      </div>

      {/* FRP Over Time Curve (Full Width) */}
      <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-fire-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Fire Radiative Power (FRP) Chronological Trend
            </h3>
          </div>
          <span className="text-xs font-mono text-fire-400 font-bold">
            Aggregated Total: {formatFRP(kpis?.totalFRP)}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Thermal emission flux (MW) observed across consecutive polar-orbiting satellite passes.
        </p>
        <FRPTimelineChart data={frpTimeline} />
      </div>

      {/* Two Column Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            AI Fire Classification Distribution
          </h3>
          <CategoryDistributionChart data={categories} />
        </div>

        {/* Risk Level breakdown */}
        <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-500" />
            Multi-Criteria Risk Level Distribution
          </h3>
          <RiskBreakdownChart data={riskLevels} />
        </div>
      </div>

      {/* Regional Anomaly Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl bg-dark-850/90 border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-fire-500" />
            Regional Hotspot Density & Critical Clusters
          </h3>
          <RegionalChart data={regions} />
        </div>

        {/* Statistical Summary Box */}
        <div className="rounded-xl bg-dark-850/90 border border-slate-800 p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Sensor Telemetry Breakdown
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400">Mean Confidence:</span>
              <span className="font-bold text-amber-400">{kpis?.avgConfidence}%</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400">Mean FRP Intensity:</span>
              <span className="font-bold text-fire-400">{formatFRP(kpis?.avgFRP)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400">Peak Thermal Anomaly:</span>
              <span className="font-bold text-red-400">{formatFRP(kpis?.maxFRP)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400">Total Delineated Area:</span>
              <span className="font-bold text-blue-400">{kpis?.totalEstimatedAreaKm2} km²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
