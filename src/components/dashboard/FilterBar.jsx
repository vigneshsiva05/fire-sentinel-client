import React from 'react';
import { Filter, RotateCcw, Download, Search } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { FIRE_CATEGORIES, SATELLITES } from '../../utils/constants';

const selectStyle = {
  backgroundColor: '#ffffff',
  color: '#111111',
  border: '1px solid #d0d0d0',
  borderRadius: '8px',
  padding: '6px 10px',
  fontSize: '12px',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '140px',
};

export const FilterBar = ({ onExport = null }) => {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters();

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      border: '1px solid #d0d0d0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555555', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Filter size={14} color="#f97316" />
          <span>Filters:</span>
        </div>

        {/* Fire Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Categories</option>
          {FIRE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Risk Level Dropdown */}
        <select
          value={filters.riskLevel}
          onChange={(e) => updateFilter('riskLevel', e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Risk Levels</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MODERATE">MODERATE</option>
          <option value="LOW">LOW</option>
        </select>

        {/* Satellite Platform Dropdown */}
        <select
          value={filters.satellite}
          onChange={(e) => updateFilter('satellite', e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Satellites</option>
          {SATELLITES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search cluster or location..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            style={{
              ...selectStyle,
              paddingLeft: '30px',
              width: '200px',
              fontFamily: 'monospace',
            }}
          />
          <Search size={14} color="#999999" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px',
              background: '#f5f5f5', border: '1px solid #d0d0d0',
              color: '#444444', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eaeaea'; e.currentTarget.style.color = '#111111'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#444444'; }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Export Button */}
      {onExport && (
        <button
          onClick={onExport}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            background: '#ffffff', border: '1px solid #d0d0d0',
            color: '#333333', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
        >
          <Download size={14} color="#f97316" />
          <span>Export Intel</span>
        </button>
      )}
    </div>
  );
};
