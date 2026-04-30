// ElectroCAD Pro v12 — Helper Functions

// Get PT power based on element type
export function getPTpower(pt) {
  if (pt.type === 'trafo') return (pt.trText || { power: '160kVA' }).power || '160kVA';
  if (pt.type === 'ptab_1t') return (pt.trText || { power: '250kVA' }).power || '250kVA';
  if (pt.type === 'ptab_2t') return (pt.trText1 || { power: '250kVA' }).power || '250kVA';
  return '250kVA';
}

// Consumer simultaneity factor based on count
export function csConsum(n) {
  if (n <= 1) return 1.0;
  if (n <= 5) return 0.7;
  if (n <= 20) return 0.45;
  if (n <= 50) return 0.32;
  return 0.25;
}

// SVG Chart helper
export function svgChart(series, opts) {
  // Simplified chart rendering
  return '';
}

// PV Profile
export function pvProfile(lat, sezon) {
  // Return PV production profile based on latitude and season
  return [];
}
