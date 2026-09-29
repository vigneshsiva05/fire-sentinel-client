import React, { useState } from 'react';
import { Flame, Eye, ArrowUpDown, Download, Layers } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatFRP, formatCoords, formatArea } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';

export const FireEventsTable = ({ clusters = [], onSelectCluster }) => {
  const [sortField, setSortField] = useState('riskScore');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const sortedClusters = [...clusters].sort((a, b) => {
    let valA = a[sortField] || 0;
    let valB = b[sortField] || 0;
    if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleExportCSV = () => {
    const flatData = clusters.map((c) => ({
      ClusterID: c.clusterId,
      Classification: c.classification,
      RiskLevel: c.riskLevel,
      RiskScore: c.riskScore,
      HotspotsCount: c.hotspotCount,
      TotalFRP_MW: c.totalFRP,
      MaxFRP_MW: c.maxFRP,
      EstimatedArea_Km2: c.estimatedAreaKm2,
      CentroidLat: c.center?.latitude || c.center?.coordinates?.[1],
      CentroidLon: c.center?.longitude || c.center?.coordinates?.[0],
      Status: c.status,
      FirstDetected: c.firstDetected,
      LastDetected: c.lastDetected,
    }));
    exportToCSV(flatData, `satellite_fire_clusters_${Date.now()}.csv`);
  };

  const thStyle = {
    padding: '10px 12px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: '#444444',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '10px 12px',
    color: '#222222',
    fontSize: '12px',
    fontFamily: 'monospace',
    borderBottom: '1px solid #eeeeee',
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #d0d0d0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px',
        padding: '14px 16px',
        borderBottom: '1px solid #e8e8e8',
        backgroundColor: '#fafafa',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="#f97316" />
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Active Satellite Fire Events & Clusters
          </h3>
          <span style={{ fontSize: '12px', color: '#777777', fontFamily: 'monospace' }}>({clusters.length} tracked)</span>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            background: '#ffffff', border: '1px solid #d0d0d0',
            color: '#333333', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          <Download size={13} color="#f97316" />
          <span>Export Table CSV</span>
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              {[
                { label: 'Cluster ID', field: 'clusterId' },
                { label: 'Centroid Location', field: null },
                { label: 'AI Classification', field: null },
                { label: 'Hotspots', field: 'hotspotCount' },
                { label: 'Total FRP', field: 'totalFRP' },
                { label: 'Est. Extent', field: 'estimatedAreaKm2' },
                { label: 'Risk Level', field: 'riskScore' },
                { label: 'Status', field: null },
                { label: 'Action', field: null, align: 'right' },
              ].map((col) => (
                <th
                  key={col.label}
                  style={{ ...thStyle, textAlign: col.align || 'left' }}
                  onClick={col.field ? () => handleSort(col.field) : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                    {col.label}
                    {col.field && <ArrowUpDown size={11} color="#999" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedClusters.length > 0 ? (
              sortedClusters.map((c) => {
                const lat = c.center?.latitude || c.center?.coordinates?.[1];
                const lon = c.center?.longitude || c.center?.coordinates?.[0];
                return (
                  <tr
                    key={c.clusterId || c._id}
                    style={{ backgroundColor: '#ffffff' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#111111' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Flame size={13} color="#f97316" />
                        {c.clusterId}
                      </div>
                    </td>
                    <td style={tdStyle}>{formatCoords(lat, lon)}</td>
                    <td style={tdStyle}><CategoryBadge category={c.classification} /></td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#111111' }}>{c.hotspotCount}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#ea580c' }}>{formatFRP(c.totalFRP)}</td>
                    <td style={tdStyle}>{formatArea(c.estimatedAreaKm2, c.estimatedAreaHectares)}</td>
                    <td style={tdStyle}><RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" /></td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                        backgroundColor: c.status === 'ACTIVE' ? '#fee2e2' : c.status === 'CONTAINED' ? '#fef9c3' : '#dcfce7',
                        color: c.status === 'ACTIVE' ? '#b91c1c' : c.status === 'CONTAINED' ? '#92400e' : '#166534',
                      }}>
                        {c.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectCluster(c)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '5px 10px', borderRadius: '6px',
                          background: '#fff7ed', border: '1px solid #fed7aa',
                          color: '#c2410c', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.color = '#c2410c'; }}
                      >
                        <Eye size={12} />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: '#888888', fontStyle: 'italic' }}>
                  No fire event clusters match the active filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
