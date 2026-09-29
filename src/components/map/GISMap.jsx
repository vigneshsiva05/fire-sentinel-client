import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Flame, ShieldAlert, Sparkles, AlertTriangle, Layers, Maximize2 } from 'lucide-react';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';
import { RiskBadge } from '../common/RiskBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatFRP, formatConfidence, formatCoords, formatArea } from '../../utils/formatters';

// Fix default Leaflet marker icons in Vite/Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Helper component to smoothly center on coordinate changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 6, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Helper component to fix size calculation on mount
function MapInitializer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export const GISMap = ({
  hotspots = [],
  clusters = [],
  selectedHotspot = null,
  selectedCluster = null,
  onSelectHotspot = () => {},
  onSelectCluster = () => {},
  initialCenter = [22.5937, 78.9629], // Center of India
  initialZoom = 5,
  height = '600px',
  showControls = true,
  showLegend = true,
}) => {
  const [tileProvider, setTileProvider] = useState('osm');
  const [showHotspots, setShowHotspots] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);

  // Dynamic Tile URL (100% Free & No API Key Required)
  const getTileConfig = () => {
    switch (tileProvider) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; NASA / USGS / Maxar',
          maxZoom: 19,
          subdomains: 'abc'
        };
      case 'topo':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri World Topo Map',
          maxZoom: 19,
          subdomains: 'abc'
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
          subdomains: 'abc'
        };
      case 'dark':
      default:
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
          maxZoom: 20,
          subdomains: 'abcd'
        };
    }
  };

  const tileConfig = getTileConfig();

  // Marker Risk Color Helper
  const getRiskColor = (riskLevel) => {
    switch (String(riskLevel).toUpperCase()) {
      case 'CRITICAL':
        return '#ef4444'; // Red
      case 'HIGH':
        return '#f97316'; // Orange
      case 'MODERATE':
        return '#f59e0b'; // Amber
      case 'LOW':
      default:
        return '#10b981'; // Emerald
    }
  };

  // Expose controls state to parent via renderControls / renderLegend render props
  const controlsNode = showControls ? (
    <MapControls
      tileProvider={tileProvider}
      setTileProvider={setTileProvider}
      showHotspots={showHotspots}
      setShowHotspots={setShowHotspots}
      showClusters={showClusters}
      setShowClusters={setShowClusters}
      showBoundaries={showBoundaries}
      setShowBoundaries={setShowBoundaries}
    />
  ) : null;

  const legendNode = showLegend ? <MapLegend /> : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Map toolbar: controls + legend side by side ABOVE the map */}
      {(showControls || showLegend) && (
        <div className="flex flex-wrap items-start gap-3">
          {controlsNode}
          {legendNode}
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl z-0" style={{ height, minHeight: '400px' }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapInitializer />
        <TileLayer
          key={tileProvider}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={tileConfig.maxZoom}
          subdomains={tileConfig.subdomains}
        />

        {/* Dynamic Center on focus */}
        {selectedCluster && selectedCluster.center && (
          <ChangeView
            center={[
              selectedCluster.center.latitude || selectedCluster.center.coordinates?.[1],
              selectedCluster.center.longitude || selectedCluster.center.coordinates?.[0],
            ]}
            zoom={10}
          />
        )}

        {/* 1. Fire Cluster Estimated Boundaries (Convex Hulls / Polygons) */}
        {showBoundaries &&
          clusters.map((c) => {
            const boundaryCoords = c.boundary?.coordinates?.[0] || c.boundary_geojson?.coordinates?.[0];
            if (!boundaryCoords || boundaryCoords.length < 3) return null;

            // Leaflet requires [lat, lon] tuples
            const latLngs = boundaryCoords.map((pt) => [pt[1], pt[0]]);
            const color = getRiskColor(c.riskLevel || c.risk_level);
            const isSelected = selectedCluster && (selectedCluster.clusterId === c.clusterId || selectedCluster.cluster_id === c.cluster_id);

            return (
              <Polygon
                key={`poly-${c.clusterId || c.cluster_id}`}
                positions={latLngs}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.45 : 0.2,
                  weight: isSelected ? 3 : 1.8,
                  dashArray: isSelected ? undefined : '4, 4',
                }}
                eventHandlers={{
                  click: () => onSelectCluster(c),
                }}
              >
                <Popup>
                  <div className="p-3.5 space-y-2.5 max-w-xs">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-fire-500" />
                        {c.clusterId || c.cluster_id}
                      </span>
                      <RiskBadge level={c.riskLevel || c.risk_level} score={c.riskScore || c.risk_score} />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class:</span>
                        <CategoryBadge category={c.classification} />
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Hotspots:</span>
                        <span className="text-slate-200">{c.hotspotCount || c.hotspot_count} points</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Total FRP:</span>
                        <span className="text-fire-400 font-bold">{formatFRP(c.totalFRP || c.total_frp)}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Est. Extent:</span>
                        <span className="text-slate-300">
                          {formatArea(c.estimatedAreaKm2 || c.estimated_area_km2, c.estimatedAreaHectares || c.estimated_area_hectares)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-amber-300/80 bg-amber-950/40 p-1.5 rounded border border-amber-800/40 italic">
                      {c.priorityReason || c.priority_reason || 'Thermal cluster identified.'}
                    </p>

                    <button
                      onClick={() => onSelectCluster(c)}
                      className="w-full mt-2 py-1.5 px-3 bg-fire-600 hover:bg-fire-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      View Full Intelligence
                    </button>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* 2. Individual Hotspot Points */}
        {showHotspots &&
          hotspots.map((h, idx) => {
            const lat = h.latitude || h.lat;
            const lon = h.longitude || h.lon || h.lng;
            if (!lat || !lon) return null;

            const frp = parseFloat(h.frp || 30.0);
            const radius = Math.max(5, Math.min(16, Math.sqrt(frp) * 1.8));
            const color = getRiskColor(h.riskLevel || h.risk_level);
            const isSelected = selectedHotspot && (selectedHotspot.hotspotId === h.hotspotId || selectedHotspot._id === h._id);

            return (
              <CircleMarker
                key={`hs-${h.hotspotId || h._id || idx}`}
                center={[lat, lon]}
                radius={isSelected ? radius + 4 : radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.9 : 0.75,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(h),
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#111111', background: '#ffffff', padding: '3px 8px', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#ea580c' }}>{formatFRP(frp)}</span> | {h.classification || 'Hotspot'}
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-3 space-y-2 max-w-[240px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                      <span className="text-xs font-mono font-bold text-white">
                        {h.hotspotId || `Hotspot #${idx + 1}`}
                      </span>
                      <RiskBadge level={h.riskLevel || h.risk_level} size="sm" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class:</span>
                        <CategoryBadge category={h.classification} />
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">FRP:</span>
                        <span className="text-fire-400 font-bold">{formatFRP(frp)}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-slate-300">{formatConfidence(h.confidence)}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-400">Acquired:</span>
                        <span className="text-slate-300">{h.acqDate || h.acq_date} {h.acqTime || h.acq_time}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-400">Satellite:</span>
                        <span className="text-slate-300">{h.satellite || 'MODIS'} ({h.daynight || 'D'})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectHotspot(h)}
                      className="w-full mt-2 py-1 bg-slate-800 hover:bg-fire-600 text-slate-200 hover:text-white rounded text-xs font-medium transition-colors"
                    >
                      Inspect Anomaly
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
      </div>
    </div>
  );
};
