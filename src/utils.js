import { S } from './state.js';
import { GRID, MAX_UNDO } from './config.js';

// ── DOM references (set after init) ──
let _svgEl, _VP;
export function initUtils(svgEl, VP) { _svgEl = svgEl; _VP = VP; }

// ── Toast ──
export function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = type; t.style.opacity = 1;
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => t.style.opacity = 0, 3000);
}

// ── Coordonate ──
export function svgPt(e) {
  if (!_svgEl) return { x: 0, y: 0 };
  const r = _svgEl.getBoundingClientRect();
  const s = S.view.s || 1;
  return {
    x: (e.clientX - r.left - S.view.x) / s,
    y: (e.clientY - r.top  - S.view.y) / s
  };
}
export function sn(v) { return S.snapOn ? Math.round(v / GRID) * GRID : v; }
export function uid() { return Date.now() + Math.floor(Math.random() * 99999); }
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function termWorldPos(el, lcx, lcy) {
  const rot = (el.rotation || 0) * Math.PI / 180, sc = el.scale || 1;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  return { x: el.x + (lcx * sc) * cos - (lcy * sc) * sin, y: el.y + (lcx * sc) * sin + (lcy * sc) * cos };
}

export function getLineIntersection(p1, p2, p3, p4) {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) return null;
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  if (ua > 0.05 && ua < 0.95 && ub > 0.05 && ub < 0.95)
    return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
  return null;
}

export function calcPathLen(pts) {
  if (!pts || pts.length < 2) return 0;
  let l = 0;
  for (let i = 0; i < pts.length - 1; i++) l += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  return l;
}

// ── View ──
export function applyView() {
  _VP.setAttribute('transform', `translate(${S.view.x},${S.view.y}) scale(${S.view.s})`);
  const bgL = document.getElementById('bg-layer');
  if (bgL) bgL.style.transform = `translate(${S.view.x}px, ${S.view.y}px) scale(${S.view.s})`;
  document.getElementById('zlbl').textContent = Math.round(S.view.s * 100) + '%';
}

// ── Statistici planșă ──
export function updateStat() {
  document.getElementById('ste').textContent = S.EL.length + ' elem';
  document.getElementById('stc').textContent = S.CN.length + ' conn';
}

export function setStat() {
  const N = { select: 'SELECT', connect: 'CONNECT', draw_poly: 'LINIE LIBERĂ', place: 'PLASARE', calibrate: 'CALIBRARE', export_box: 'EXPORT SELECTIE' };
  document.getElementById('stm').textContent = N[S.mode] || S.mode.toUpperCase();
}

// ── Mod interacțiune ──
export function setMode(m) {
  S.mode = m; S.pendType = null; S.connStart = null; S.connPts = []; S.arrPts = []; S.calibPts = [];
  S.connFromEl = null; S.connFromTerm = null; S.connToEl = null; S.connToTerm = null;
  S.connFromCircuit = null; S.connToCircuit = null; S.selRectStart = null; S.selRect = null; S.exportRectStart = null;
  document.getElementById('sel-rect')?.setAttribute('display', 'none');
  document.getElementById('export-rect')?.setAttribute('display', 'none');
  document.body.classList.remove('conn-active', 'place-active', 'calib-active', 'export-active');
  ['btn-sel', 'btn-conn', 'btn-poly'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('tpoly').style.display = 'none';
  if (m === 'select') document.getElementById('btn-sel').classList.add('active');
  if (m === 'calibrate') document.body.classList.add('calib-active');
  if (m === 'export_box') document.body.classList.add('export-active');
  if (m === 'connect') {
    document.getElementById('btn-conn').classList.add('active');
    document.body.classList.add('conn-active');
    toast('Click terminal START → puncte pe traseu → click terminal FINAL', 'ac');
  }
  if (m === 'draw_poly') {
    document.getElementById('btn-poly').classList.add('active');
    document.body.classList.add('conn-active');
  }
  setStat();
}

export function startPlace(t) {
  S.pendType = t; S.mode = 'place';
  document.body.classList.add('place-active');
  document.getElementById('btn-sel').classList.remove('active');
  toast('Click pe planșă pentru a plasa'); setStat();
}

export function toggleSub(id) {
  const e = document.getElementById(id);
  e.style.display = e.style.display === 'flex' ? 'none' : 'flex';
}

// ── Snap / Ortho ──
export function toggleSnap() {
  S.snapOn = !S.snapOn;
  document.getElementById('btn-snap').classList.toggle('on', S.snapOn);
  toast(S.snapOn ? 'Snap ON' : 'Snap OFF');
}

export function toggleOrtho() {
  S.orthoOn = !S.orthoOn;
  document.getElementById('btn-ortho').classList.toggle('on', S.orthoOn);
  toast(S.orthoOn ? 'Orto ON' : 'Orto OFF');
}
