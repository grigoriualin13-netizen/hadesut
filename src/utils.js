// ElectroCAD Pro v12 — Utility Functions
import { GRID } from './config.js';
import { snapOn, svgEl, VP, counters } from './state.js';

// ========== Pure Utilities ==========

// Generate unique ID
export function uid() {
  return Date.now() + Math.floor(Math.random() * 99999);
}

// Generate UUID-like string
export function generateUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Term position in world coordinates (accounts for rotation and scale)
export function termWorldPos(el, lcx, lcy) {
  const rot = (el.rotation || 0) * Math.PI / 180;
  const sc = el.scale || 1;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  return {
    x: el.x + (lcx * sc) * cos - (lcy * sc) * sin,
    y: el.y + (lcx * sc) * sin + (lcy * sc) * cos
  };
}

// Line segment intersection (returns point if segments intersect interior)
export function getLineIntersection(p1, p2, p3, p4) {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) return null;
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  if (ua > 0.05 && ua < 0.95 && ub > 0.05 && ub < 0.95) {
    return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
  }
  return null;
}

// Calculate total path length from array of points
export function calcPathLen(pts) {
  if (!pts || pts.length < 2) return 0;
  let l = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    l += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  }
  return l;
}

// Create SVG element with namespace
export function mk(t) {
  return document.createElementNS('http://www.w3.org/2000/svg', t);
}

// Ks coefficient for residential consumers (simplified PE 132)
export function csConsum(n) {
  if (n <= 1) return 1.0;
  if (n <= 5) return 0.7;
  if (n <= 20) return 0.45;
  if (n <= 50) return 0.32;
  return 0.25;
}

// ========== Utilities with Dependencies ==========

// Snap value to grid
export function sn(v) {
  return snapOn ? Math.round(v / GRID) * GRID : v;
}

// Convert screen point to SVG world coordinates
export function svgPt(e) {
  if (!svgEl || !VP) return { x: e.clientX, y: e.clientY };
  const p = svgEl.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  return p.matrixTransform(VP.getScreenCTM().inverse());
}

// Apply view transform (pan/zoom) to SVG viewport and background
export function applyView() {
  VP.setAttribute('transform', `translate(${view.x},${view.y}) scale(${view.s})`);
  const bgL = document.getElementById('bg-layer');
  if (bgL) bgL.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.s})`;
  const zl = document.getElementById('zlbl');
  if (zl) zl.textContent = Math.round(view.s * 100) + '%';
}

// PVGIS profile lookup (summer/winter)
import { PROS_PV_PROFILE } from './config.js';
export function pvProfile(sezon) {
  // Returns the PV profile array for the given season
  // Actual data is in config.js — this is a helper that selects the right one
  return PROS_PV_PROFILE['pv_' + sezon];
}

// Generate next label for element type
export function nextLbl(t) {
  const prefix = {
    ptab_1t: 'PTAB', ptab_2t: 'PTAB', trafo: 'PT',
    firida_e2_4: 'FG', firida_e3_4: 'FG', firida_e3_0: 'FG',
    cd4: 'CD', cd5: 'CD', cd8: 'CD',
    meter: 'BMPT', stalp_se4: 'SE4', stalp_se10: 'SE10',
    stalp_cs: 'SCS', stalp_sc10002: 'SC10002', stalp_sc10005: 'SC10005',
    stalp_rotund: 'SR', stalp_rotund_special: 'SRS',
    separator: 'SEP', separator_mt: 'SMT', manson: 'M',
    priza_pamant: 'PP', text: '', rect: '', polyline: '',
    bara_mt: 'BAMT', celula_linie_mt: 'CLM', celula_trafo_mt: 'CTM',
    ptab_mono: 'PTAb', bara_statie_mt: 'BS'
  };
  const p = prefix[t] || t.slice(0, 3).toUpperCase();
  if (!p) return '';
  counters[p] = (counters[p] || 0) + 1;
  if (t.startsWith('stalp_')) return `${p}/${counters[p]}`;
  return `${p}${counters[p]}`;
}

// Toast notification
export function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = type;
  t.style.opacity = 1;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.style.opacity = 0, 3000);
}
let toastTimer;

// ========== Project Screen ==========

export function showProjectScreen() {
  const screen = document.getElementById('project-screen');
  if (screen) screen.classList.remove('hidden');
}

export function hideProjectScreen() {
  const screen = document.getElementById('project-screen');
  if (screen) screen.classList.add('hidden');
}

// ========== AutoSave Recovery ==========

export function recoverAutoSave() {
  // This needs access to dbGet, loadProjectData, currentProjectId, currentProjectName, updateProjectNameUI
  // For now, just define the function - will need to be called from main.js context
  const { dbGet } = window.__supabaseHelpers || {};
  if (!dbGet) return;
  dbGet('autosave', 'current_autosave').then(function(as) {
    if (!as || !as.data) return;
    // loadProjectData should be called from main.js
    if (window.loadProjectData) {
      window.loadProjectData(as.data);
      window.currentProjectId = as.projectId || null;
      window.currentProjectName = as.projectName || null;
      if (window.updateProjectNameUI) window.updateProjectNameUI();
      hideProjectScreen();
      if (window.toast) window.toast('Sesiune recuperată cu succes!', 'ok');
    }
  });
}

export function dismissRecovery() {
  if (window.clearAutoSave) window.clearAutoSave();
  const el = document.getElementById('ps-recovery');
  if (el) el.style.display = 'none';
}
