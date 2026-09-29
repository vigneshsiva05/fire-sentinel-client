import React, { useState } from 'react';
import { Info, AlertTriangle, X } from 'lucide-react';

export const DisclaimerBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between gap-3 relative z-20">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-fire-600 font-semibold uppercase tracking-wider text-[11px] bg-fire-50 border border-fire-200 px-2 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3" />
          SIH Prototype Protocol
        </span>
        <span className="text-amber-700">
          <strong className="text-amber-900">Data Segregation Notice:</strong> Satellite Coordinates & FRP represent observed data. AI Classifications, Risk Scores & Polygon Boundaries are estimated model outputs for decision-support.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-900 transition-colors p-1"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
