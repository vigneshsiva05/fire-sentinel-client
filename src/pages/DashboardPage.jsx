import React, { useState, useEffect, useCallback } from 'react';
import {
  Flame,
  Radio,
  AlertTriangle,
  ShieldAlert,
  Gauge,
  Layers,
  MapPin,
  TrendingUp,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { GISMap } from '../components/map/GISMap';
import { FilterBar } from '../components/dashboard/FilterBar';
import { PriorityQueue } from '../components/dashboard/PriorityQueue';
import { RecentAlertsFeed } from '../components/dashboard/RecentAlertsFeed';
import { FireEventsTable } from '../components/dashboard/FireEventsTable';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';
import { RiskBreakdownChart } from '../components/charts/RiskBreakdownChart';
import { HotspotDetailModal } from '../components/details/HotspotDetailModal';
import { ClusterDetailModal } from '../components/details/ClusterDetailModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

import { analyticsService } from '../services/analyticsService';
import { hotspotService } from '../services/hotspotService';
import { clusterService } from '../services/clusterService';
import { useFilters } from '../context/FilterContext';
import { exportToCSV } from '../utils/exportUtils';
import { formatFRP, formatArea } from '../utils/formatters';

export const DashboardPage = () => {
  const { filters } = useFilters();

  const [kpis, setKpis] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modals state
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hotspotModalOpen, setHotspotModalOpen] = useState(false);
  const [clusterModalOpen, setClusterModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [kpiRes, catRes, riskRes, hsRes, cluRes] = await Promise.all([
        analyticsService.getKPIs(),
        analyticsService.getCategories(),
        analyticsService.getRiskLevels(),
        hotspotService.getHotspots(filters),
        clusterService.getClusters(filters),
      ]);

      if (kpiRes.success) setKpis(kpiRes.data);
      if (catRes.success) setCategoriesData(catRes.data);
      if (riskRes.success) setRiskData(riskRes.data);
      if (hsRes.success) setHotspots(hsRes.data || []);
      if (cluRes.success) setClusters(cluRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenHotspotModal = (hotspot) => {
    setSelectedHotspot(hotspot);
    setHotspotModalOpen(true);
  };

  const handleOpenClusterModal = (cluster) => {
    setSelectedCluster(cluster);
    setClusterModalOpen(true);
  };

  const handleViewClusterFromHotspot = async (clusterId) => {
    try {
      const res = await clusterService.getClusterById(clusterId);
      if (res.success && res.data) {
        setHotspotModalOpen(false);
        setSelectedCluster(res.data);
        setClusterModalOpen(true);
      }
    } catch (err) {
      console.warn('Failed to view cluster:', err);
    }
  };

  const handleExportData = () => {
    const exportData = hotspots.map((h) => ({
      HotspotID: h.hotspotId,
      Latitude: h.latitude,
      Longitude: h.longitude,
      FRP_MW: h.frp,
      Confidence: h.confidence,
      Classification: h.classification,
      RiskLevel: h.riskLevel,
      RiskScore: h.riskScore,
      Satellite: h.satellite,
      DayNight: h.daynight,
      AcqDate: h.acqDate,
      AcqTime: h.acqTime,
      ClusterID: h.clusterId,
    }));
    exportToCSV(exportData, `satellite_hotspots_dataset_${Date.now()}.csv`);
  };

  if (loading && !kpis) {
    return <LoadingSpinner text="Connecting to Satellite Telemetry & Running ML Pipeline..." />;
  }

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-10">
      {/* Top Header / Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-800 flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-fire-500" />
            Satellite Fire Operations Command
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Real-time Thermal Anomaly Detection, Spatial Clustering, AI Classification & Decision-Support System
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-100 text-surface-600 hover:text-surface-800 border border-surface-200 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KPICard
          title="Total Hotspots"
          value={kpis?.totalHotspots ?? 0}
          subtitle="NASA FIRMS Anomaly Points"
          icon={Radio}
          color="fire"
        />
        <KPICard
          title="Active Clusters"
          value={kpis?.activeClusters ?? 0}
          subtitle="DBSCAN Fire Events"
          icon={Layers}
          color="purple"
        />
        <KPICard
          title="High-Risk Fires"
          value={kpis?.highRiskFires ?? 0}
          subtitle="P1 & P2 Tactical Threats"
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Critical Alerts"
          value={kpis?.criticalAlerts ?? 0}
          subtitle="Unresolved Directives"
          icon={ShieldAlert}
          color="amber"
        />
        <KPICard
          title="Total FRP"
          value={formatFRP(kpis?.totalFRP)}
          subtitle={`Max: ${formatFRP(kpis?.maxFRP)}`}
          icon={Gauge}
          color="fire"
        />
        <KPICard
          title="Est. Affected Extent"
          value={formatArea(kpis?.totalEstimatedAreaKm2, kpis?.totalEstimatedAreaHectares)}
          subtitle="Convex Hull Polygon Area"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Global Filter Bar */}
      <FilterBar onExport={handleExportData} />

      {/* Main Grid: GIS Map + Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive GIS Command Map (Span 2) */}
        <div className="lg:col-span-2 rounded-xl border border-surface-200 bg-white p-4 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-fire-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-700">
                Live Geographic Information System (GIS)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-surface-400">
              Rendering {hotspots.length} Points & {clusters.length} Extent Polygons
            </span>
          </div>

          <GISMap
            hotspots={hotspots}
            clusters={clusters}
            selectedHotspot={selectedHotspot}
            selectedCluster={selectedCluster}
            onSelectHotspot={handleOpenHotspotModal}
            onSelectCluster={handleOpenClusterModal}
            height="520px"
          />
        </div>

        {/* Tactical Feeds Column (Span 1) */}
        <div className="space-y-6">
          <PriorityQueue clusters={clusters} onSelectCluster={handleOpenClusterModal} />
          <RecentAlertsFeed />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-surface-200 p-4 space-y-3 shadow-card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-600">
            Fire Events by AI Classification
          </h3>
          <CategoryDistributionChart data={categoriesData} />
        </div>

        <div className="rounded-xl bg-white border border-surface-200 p-4 space-y-3 shadow-card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-600">
            Fires by Calibrated Risk Level
          </h3>
          <RiskBreakdownChart data={riskData} />
        </div>
      </div>

      {/* Full Fire Events Table */}
      <FireEventsTable clusters={clusters} onSelectCluster={handleOpenClusterModal} />

      {/* Detail Modals */}
      <HotspotDetailModal
        hotspot={selectedHotspot}
        isOpen={hotspotModalOpen}
        onClose={() => setHotspotModalOpen(false)}
        onViewCluster={handleViewClusterFromHotspot}
      />

      <ClusterDetailModal
        cluster={selectedCluster}
        isOpen={clusterModalOpen}
        onClose={() => setClusterModalOpen(false)}
        onSelectHotspot={handleOpenHotspotModal}
        onStatusUpdated={fetchDashboardData}
      />
    </div>
  );
};
