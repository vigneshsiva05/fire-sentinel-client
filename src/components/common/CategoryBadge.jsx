import React from 'react';
import { Trees, Wheat, Factory, Building2, Flame, HelpCircle } from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants';

export const CategoryBadge = ({ category = 'Unknown', confidence = null, showIcon = true }) => {
  const getIcon = () => {
    switch (category) {
      case 'Forest / Wildfire':
        return <Trees className="w-3.5 h-3.5 text-red-400" />;
      case 'Agricultural / Crop Residue Burning':
        return <Wheat className="w-3.5 h-3.5 text-amber-400" />;
      case 'Industrial Fire':
        return <Factory className="w-3.5 h-3.5 text-pink-400" />;
      case 'Urban / Built-up Fire':
        return <Building2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'Land Clearing / Other Burning':
        return <Flame className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const color = CATEGORY_COLORS[category] || '#64748b';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      {showIcon && getIcon()}
      <span className="truncate max-w-[170px]">{category}</span>
      {confidence !== null && (
        <span style={{ fontSize: '10px', fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.08)', padding: '1px 4px', borderRadius: '3px' }}>
          {Math.round(confidence > 1 ? confidence : confidence * 100)}%
        </span>
      )}
    </span>
  );
};
