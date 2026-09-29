import React, { useState, useEffect } from 'react';
import { GISMap } from '../components/map/GISMap';
import { FilterBar } from '../components/dashboard/FilterBar';
import { HotspotDetailModal } from '../components/details/HotspotDetailModal';
import { ClusterDetailModal } from '../components/details/ClusterDetailModal';
import { hotspotService } from '../services/hotspotService';
import { clusterService } from '../services/clusterService';
import { useFilters } from '../context/FilterContext';
import { Map, Layers, Radio, Sparkles, Flame } from 'lucide-react';

export const LiveMapPage = () => {
  const { filters } = useFilters();

  const [hotspots, setHotspots] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hotspotModalOpen, setHotspotModalOpen] = useState(false);
  const [clusterModalOpen, setClusterModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hsRes, cluRes] = await Promise.all([
          hotspotService.getHotspots(filters),
          clusterService.getClusters(filters),
        ]);
        if (hsRes.success) setHotspots(hsRes.data || []);
        if (cluRes.success) setClusters(cluRes.data || []);
      } catch (err) {
        console.error('Map data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleOpenHotspot = (h) => {
    setSelectedHotspot(h);
    setHotspotModalOpen(true);
  };

  const handleOpenCluster = (c) => {
    setSelectedCluster(c);
    setClusterModalOpen(true);
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-fire-500" />
            Full-Spectrum GIS Fire Map
          </h1>
          <p className="text-xs text-slate-400">
            High-Resolution Spatial Clustering & Convex Hull Event Extent Visualization
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <span className="px-2.5 py-1 rounded bg-dark-850 border border-slate-700">
            Hotspots: <strong className="text-fire-400">{hotspots.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-dark-850 border border-slate-700">
            Clusters: <strong className="text-blue-400">{clusters.length}</strong>
          </span>
        </div>
      </div>

      <FilterBar />

      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-dark-850">
        <GISMap
          hotspots={hotspots}
          clusters={clusters}
          selectedHotspot={selectedHotspot}
          selectedCluster={selectedCluster}
          onSelectHotspot={handleOpenHotspot}
          onSelectCluster={handleOpenCluster}
          height="calc(100vh - 250px)"
        />
      </div>

      <HotspotDetailModal
        hotspot={selectedHotspot}
        isOpen={hotspotModalOpen}
        onClose={() => setHotspotModalOpen(false)}
      />

      <ClusterDetailModal
        cluster={selectedCluster}
        isOpen={clusterModalOpen}
        onClose={() => setClusterModalOpen(false)}
        onSelectHotspot={handleOpenHotspot}
      />
    </div>
  );
};
