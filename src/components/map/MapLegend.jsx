import React from 'react';
import { CATEGORY_COLORS } from '../../utils/constants';

export const MapLegend = ({ className = '' }) => {
  const panel = {
    padding: '10px 16px',
    borderRadius: '10px',
    background: '#ffffff',
    border: '1px solid #d0d0d0',
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
    fontSize: '11px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 24px',
    alignItems: 'flex-start',
  };

  const sectionLabel = {
    fontSize: '9px', fontWeight: 700, color: '#888888',
    letterSpacing: '0.09em', textTransform: 'uppercase',
    display: 'block', marginBottom: '5px',
  };

  const row = (extra = {}) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    color: '#333333', fontSize: '11px', fontFamily: 'monospace',
    marginBottom: '3px', ...extra,
  });

  const dot = (color, pulse = false) => ({
    width: '11px', height: '11px', borderRadius: '50%',
    backgroundColor: color, border: `1.5px solid ${color}`,
    flexShrink: 0,
    animation: pulse ? 'pulse 1.5s infinite' : 'none',
  });

  const sq = (color) => ({
    width: '10px', height: '10px', borderRadius: '3px',
    backgroundColor: color, flexShrink: 0,
  });

  const divider = {
    width: '1px', alignSelf: 'stretch',
    background: '#e0e0e0', flexShrink: 0,
  };

  return (
    <div style={panel} className={className}>
      {/* Risk Levels */}
      <div>
        <span style={sectionLabel}>Risk & FRP Severity</span>
        <div style={row()}><span style={dot('#10b981')} /> Low (0–35)</div>
        <div style={row()}><span style={dot('#f59e0b')} /> Moderate (36–60)</div>
        <div style={row()}><span style={dot('#f97316')} /> High (61–79)</div>
        <div style={row({ color: '#b91c1c', fontWeight: 600 })}><span style={dot('#ef4444', true)} /> Critical (80+)</div>
      </div>

      <div style={divider} />

      {/* AI Classification */}
      <div>
        <span style={sectionLabel}>AI Event Classification</span>
        {[
          ['Forest / Wildfire',   CATEGORY_COLORS?.['Forest / Wildfire']                   || '#22c55e'],
          ['Crop Residue',        CATEGORY_COLORS?.['Agricultural / Crop Residue Burning']  || '#eab308'],
          ['Industrial Flare',    CATEGORY_COLORS?.['Industrial Fire']                      || '#f97316'],
          ['Urban Fire',          CATEGORY_COLORS?.['Urban / Built-up Fire']                 || '#ef4444'],
        ].map(([label, color]) => (
          <div key={label} style={row()}><span style={sq(color)} />{label}</div>
        ))}
      </div>

      <div style={divider} />

      {/* Geometry Types */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', fontSize: '10px', color: '#777777' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="12" viewBox="0 0 16 12"><polygon points="8,1 15,11 1,11" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3,2"/></svg>
          Polygon = Extent
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="12" viewBox="0 0 16 12"><circle cx="8" cy="6" r="4" fill="#f97316" fillOpacity="0.85"/></svg>
          Point = Hotspot
        </div>
      </div>
    </div>
  );
};
