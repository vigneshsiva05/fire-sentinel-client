import React from 'react';
import { Satellite, Map as MapIcon, Globe, Mountain, Flame, Layers } from 'lucide-react';

const panel = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  borderRadius: '10px',
  background: '#ffffff',
  border: '1px solid #d0d0d0',
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
};

const tileBtn = (active) => ({
  display: 'flex', alignItems: 'center', gap: '5px',
  padding: '5px 10px', borderRadius: '6px',
  fontSize: '12px', fontWeight: active ? 700 : 500,
  cursor: 'pointer', border: 'none',
  background: active ? '#ea580c' : 'transparent',
  color: active ? '#ffffff' : '#444444',
  transition: 'all 0.15s',
});

const layerBtn = (active, activeColor) => ({
  display: 'flex', alignItems: 'center', gap: '5px',
  padding: '5px 10px', borderRadius: '6px',
  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
  border: `1px solid ${active ? activeColor + '66' : '#d0d0d0'}`,
  background: active ? activeColor + '18' : '#f5f5f5',
  color: active ? activeColor : '#888888',
  textDecoration: active ? 'none' : 'line-through',
  transition: 'all 0.15s',
});

const divider = {
  width: '1px', height: '22px',
  background: '#d0d0d0', flexShrink: 0,
};

const label = {
  fontSize: '10px', color: '#888888',
  fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.07em',
};

export const MapControls = ({
  tileProvider,
  setTileProvider,
  showHotspots,
  setShowHotspots,
  showClusters,
  setShowClusters,
  showBoundaries,
  setShowBoundaries,
  className = '',
}) => {
  return (
    <div style={panel} className={className}>
      <span style={label}>Base Map</span>

      <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '8px', padding: '3px', gap: '2px', border: '1px solid #e0e0e0' }}>
        {[
          { key: 'osm',       label: 'Default', Icon: Globe },
          { key: 'satellite', label: 'Satellite', Icon: Satellite },
          { key: 'topo',      label: 'Topo',      Icon: Mountain },
          { key: 'dark',      label: 'Dark',       Icon: MapIcon },
        ].map(({ key, label: lbl, Icon }) => (
          <button
            key={key}
            onClick={() => setTileProvider(key)}
            style={tileBtn(tileProvider === key)}
            title={lbl}
          >
            <Icon size={12} />
            <span>{lbl}</span>
          </button>
        ))}
      </div>

      <div style={divider} />

      <span style={label}>Layers</span>

      <button onClick={() => setShowHotspots(!showHotspots)} style={layerBtn(showHotspots, '#ea580c')}>
        <Flame size={11} /> Hotspots
      </button>
      <button onClick={() => setShowClusters(!showClusters)} style={layerBtn(showClusters, '#3b82f6')}>
        <Layers size={11} /> Clusters
      </button>
      <button onClick={() => setShowBoundaries(!showBoundaries)} style={layerBtn(showBoundaries, '#9333ea')}>
        Extent Polygons
      </button>
    </div>
  );
};
