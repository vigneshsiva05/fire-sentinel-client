import React from 'react';

export const RiskBadge = ({ level = 'LOW', score = null, size = 'sm' }) => {
  const lvl = String(level).toUpperCase();

  const config = {
    CRITICAL: {
      bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5', dot: '#ef4444', pulse: true,
    },
    HIGH: {
      bg: '#ffedd5', text: '#c2410c', border: '#fdba74', dot: '#f97316', pulse: true,
    },
    MODERATE: {
      bg: '#fef9c3', text: '#92400e', border: '#fde68a', dot: '#f59e0b', pulse: false,
    },
    LOW: {
      bg: '#dcfce7', text: '#166534', border: '#86efac', dot: '#22c55e', pulse: false,
    },
  }[lvl] || {
    bg: '#f5f5f5', text: '#444444', border: '#d0d0d0', dot: '#999999', pulse: false,
  };

  const padding = size === 'lg' ? '4px 12px' : '2px 8px';
  const fontSize = size === 'lg' ? '13px' : '11px';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      borderRadius: '9999px', border: `1px solid ${config.border}`,
      backgroundColor: config.bg, color: config.text,
      padding, fontSize, fontWeight: 600,
    }}>
      <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
        {config.pulse && (
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            backgroundColor: config.dot, opacity: 0.6,
            animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
          }} />
        )}
        <span style={{
          position: 'relative', display: 'inline-flex', borderRadius: '50%',
          width: '8px', height: '8px', backgroundColor: config.dot,
        }} />
      </span>
      <span>{lvl}</span>
      {score !== null && <span style={{ opacity: 0.75, fontFamily: 'monospace' }}>({score})</span>}
    </span>
  );
};
