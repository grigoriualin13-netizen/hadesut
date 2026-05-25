import { R0_TABLES, KS_RURAL, KS_URBAN } from './config.js';

export function getX0(tipConductor, sectiune) {
  if (tipConductor.includes('Torsadat')) {
    const xt = { 10: 0.098, 16: 0.098, 25: 0.097, 35: 0.089, 50: 0.086, 70: 0.085, 95: 0.084, 120: 0.083, 150: 0.082 };
    return xt[sectiune] || 0.090;
  }
  if (tipConductor.includes('Clasic')) return 0.320;
  const xc = { 2.5: 0.11, 4: 0.11, 6: 0.10, 10: 0.09, 16: 0.09, 25: 0.08, 35: 0.08, 50: 0.08, 70: 0.08, 95: 0.08, 120: 0.08, 150: 0.08, 185: 0.08, 240: 0.08 };
  return xc[sectiune] || 0.08;
}

export function getKs(nrCons, tipAmplasare) {
  const n = Math.max(0, parseInt(nrCons) || 0);
  if (n === 0) return 0;
  if (tipAmplasare === 'URBAN') {
    if (n <= 30) return KS_URBAN[n] || 0.41;
    if (n <= 40) return 0.39;
    if (n <= 50) return 0.38;
    if (n <= 60) return 0.36;
    return 0.35;
  } else {
    if (n <= 30) return KS_RURAL[n] || 0.30;
    if (n <= 40) return 0.29;
    if (n <= 50) return 0.28;
    if (n <= 60) return 0.27;
    if (n <= 80) return 0.26;
    return 0.25;
  }
}

export function getR0(tipConductor, sectiune) {
  const tbl = R0_TABLES[tipConductor];
  if (!tbl) return null;
  if (tbl[sectiune] !== undefined) return tbl[sectiune];
  const secs = Object.keys(tbl).map(Number).sort((a, b) => a - b);
  if (secs.length === 0) return null;
  let best = secs[0];
  for (const s of secs) { if (s <= sectiune) best = s; }
  return tbl[best];
}

export function calcDU_tronson(L_m, P_eff, tipRetea, sectiune) {
  if (!L_m || !P_eff || !sectiune) return 0;
  let factor = 46;
  if (tipRetea === 'Bifazat') factor = 20;
  else if (tipRetea === 'Monofazat') factor = 7.7;
  return (P_eff * L_m) / (sectiune * factor);
}
