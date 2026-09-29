export const formatFRP = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.0 MW';
  return `${Number(val).toFixed(1)} MW`;
};

export const formatConfidence = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Math.round(Number(val))}%`;
};

export const formatCoords = (lat, lon) => {
  if (lat === undefined || lon === undefined) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
};

export const formatDate = (dateStr, timeStr) => {
  if (!dateStr) return 'N/A';
  if (!timeStr) return dateStr;
  const timeFormatted = timeStr.length === 4 ? `${timeStr.slice(0, 2)}:${timeStr.slice(2)} UTC` : timeStr;
  return `${dateStr} ${timeFormatted}`;
};

export const formatArea = (km2, hectares) => {
  if (!km2 && !hectares) return '0.0 km²';
  if (km2 >= 1.0) return `${Number(km2).toFixed(2)} km² (${Number(hectares || km2 * 100).toFixed(0)} ha)`;
  return `${Number(hectares || km2 * 100).toFixed(1)} ha`;
};
