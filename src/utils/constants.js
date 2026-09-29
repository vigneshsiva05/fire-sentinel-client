export const FIRE_CATEGORIES = [
  "Forest / Wildfire",
  "Agricultural / Crop Residue Burning",
  "Industrial Fire",
  "Urban / Built-up Fire",
  "Land Clearing / Other Burning",
  "Unknown"
];

export const RISK_LEVELS = [
  { label: 'Low', value: 'LOW', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { label: 'Moderate', value: 'MODERATE', color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  { label: 'High', value: 'HIGH', color: 'orange', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  { label: 'Critical', value: 'CRITICAL', color: 'red', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' }
];

export const CATEGORY_COLORS = {
  "Forest / Wildfire": "#ef4444",              // Red
  "Agricultural / Crop Residue Burning": "#f59e0b", // Amber
  "Industrial Fire": "#ec4899",               // Pink
  "Urban / Built-up Fire": "#8b5cf6",         // Purple
  "Land Clearing / Other Burning": "#06b6d4", // Cyan
  "Unknown": "#64748b"                        // Slate
};

export const SATELLITES = [
  "Terra/MODIS",
  "Aqua/MODIS",
  "SNPP/VIIRS",
  "NOAA-20/VIIRS",
  "NOAA-21/VIIRS"
];

export const ROLE_LABELS = {
  admin: { name: 'Admin', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  authority: { name: 'Authority / Officer', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  researcher: { name: 'Researcher', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  viewer: { name: 'Viewer', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
};
