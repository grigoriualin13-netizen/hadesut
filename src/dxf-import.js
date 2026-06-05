// DXF vectorial background layer — lightweight parser for LINE/LWPOLYLINE/POLYLINE/CIRCLE/ARC
// Units: DXF file is in millimetres ($INSUNITS=4), canvas is in px (S.pxPerMeter px/m)
// Coordinate mapping: svg_x = (dxf_x − cx) * s,  svg_y = −(dxf_y − cy) * s
// where cx/cy = bbox center of visible entities, s = S.pxPerMeter / 1000

import { S }          from './state.js';
import { toast, applyView } from './utils.js';

// ── Layer style table ─────────────────────────────────────────────────────────
const LAYER_STYLES = [
  { match: 'DRUMURI',     stroke: '#3b75c8', sw: 1.4 },
  { match: 'AX DRUM',    stroke: '#7ba4e0', sw: 0.6, dash: '6,4' },
  { match: 'CORP_PROPR', stroke: '#7a7a7a', sw: 0.9 },
  { match: 'Imobile',    stroke: '#c46a3a', sw: 1.0 },
  { match: 'IMOBILE',    stroke: '#c46a3a', sw: 1.0 },
  { match: 'CV CANAL',   stroke: '#44aacc', sw: 0.7, dash: '4,3' },
  { match: 'CUTIE GAZ',  stroke: '#e09d22', sw: 0.7 },
  { match: 'NR_CAD',     stroke: '#aaaaaa', sw: 0.4 },
  { match: 'Cotari',     stroke: '#aaaaaa', sw: 0.4 },
  { match: 'pct_',       stroke: '#cccccc', sw: 0.3 },
];
const STYLE_DEFAULT = { stroke: '#888888', sw: 0.6 };

function layerStyle(name) {
  for (const s of LAYER_STYLES) {
    if (name.includes(s.match)) return s;
  }
  return STYLE_DEFAULT;
}

// ── DXF parser ────────────────────────────────────────────────────────────────
// Returns { entities } where entity types are: L (line), P (polyline), C (circle), A (arc)
function parseDxf(text) {
  const lines = text.split(/\r?\n/);
  const N     = lines.length;
  let   i     = 0;

  function next() {
    while (i < N && lines[i].trim() === '') i++;  // skip blanks before group code only
    if (i >= N) return null;
    const code = parseInt(lines[i++].trim(), 10);
    // do NOT skip blank lines here — empty string is a valid DXF value
    const val  = i < N ? lines[i++].trim() : '';
    return { code, val };
  }

  const entities = [];

  let section = null;
  let etype   = null;
  let layer   = '';
  let x0, y0, x1, y1, cx, cy, r, sa, ea;
  let verts   = [];
  let closed  = false;

  // Old-style POLYLINE: collects VERTEX sub-entities until SEQEND
  let collPoly = null; // { layer, verts, closed } while collecting
  let cvx, cvy;       // current VERTEX coords

  function flushCollPoly() {
    if (!collPoly) return;
    if (cvx != null) { collPoly.verts.push({ x: cvx, y: cvy ?? 0 }); cvx = cvy = undefined; }
    if (collPoly.verts.length >= 2) entities.push({ t: 'P', layer: collPoly.layer, verts: collPoly.verts, closed: collPoly.closed });
    collPoly = null;
  }

  function commit() {
    if (!etype) return;
    if (etype === 'LINE' && x0 != null && x1 != null) {
      entities.push({ t: 'L', layer, x0, y0, x1, y1 });
    } else if (etype === 'POLY' && verts.length >= 2) {
      entities.push({ t: 'P', layer, verts: verts.slice(), closed });
    } else if (etype === 'CIRCLE' && cx != null && r > 0) {
      entities.push({ t: 'C', layer, cx, cy, r });
    } else if (etype === 'ARC' && cx != null && r > 0) {
      entities.push({ t: 'A', layer, cx, cy, r, sa, ea });
    }
    etype = null; layer = ''; verts = []; closed = false;
    x0 = y0 = x1 = y1 = cx = cy = r = sa = ea = undefined;
  }

  while (i < N) {
    const p = next();
    if (!p) break;
    const { code, val } = p;

    if (code === 0) {
      // ── Old-style POLYLINE: flush pending vertex on each new entity ──
      if (collPoly !== null) {
        if (cvx != null) { collPoly.verts.push({ x: cvx, y: cvy ?? 0 }); cvx = cvy = undefined; }
        if (val === 'VERTEX') continue;   // stay in vertex-collecting mode
        // SEQEND or any other entity terminates the polyline
        if (collPoly.verts.length >= 2) entities.push({ t: 'P', layer: collPoly.layer, verts: collPoly.verts, closed: collPoly.closed });
        collPoly = null;
        if (val === 'SEQEND') continue;   // SEQEND has no useful data
      }

      commit();
      if (val === 'SECTION') {
        const sp = next();
        section = (sp?.code === 2) ? sp.val : null;
      } else if (val === 'ENDSEC') {
        section = null;
      } else if (section === 'ENTITIES') {
        if      (val === 'LINE')       etype = 'LINE';
        else if (val === 'LWPOLYLINE') etype = 'POLY';
        else if (val === 'CIRCLE')     etype = 'CIRCLE';
        else if (val === 'ARC')        etype = 'ARC';
        else if (val === 'POLYLINE')   { etype = null; collPoly = { layer: '', verts: [], closed: false }; cvx = cvy = undefined; }
        else                            etype = null;
      }
    } else if (collPoly !== null) {
      // Group codes for POLYLINE header or VERTEX sub-entities
      if      (code === 8)  collPoly.layer = val;
      else if (code === 70) collPoly.closed = (parseInt(val, 10) & 1) !== 0;
      else if (code === 10) cvx = +val;
      else if (code === 20) cvy = +val;
    } else if (etype) {
      if      (code === 8)  { layer = val; }
      else if (etype === 'LINE') {
        if      (code === 10) x0 = +val;
        else if (code === 20) y0 = +val;
        else if (code === 11) x1 = +val;
        else if (code === 21) y1 = +val;
      } else if (etype === 'POLY') {
        if      (code === 70) closed = (parseInt(val, 10) & 1) !== 0;
        else if (code === 10) verts.push({ x: +val, y: 0 });
        else if (code === 20 && verts.length) verts[verts.length - 1].y = +val;
      } else if (etype === 'CIRCLE' || etype === 'ARC') {
        if      (code === 10) cx = +val;
        else if (code === 20) cy = +val;
        else if (code === 40) r  = +val;
        else if (code === 50) sa = +val;
        else if (code === 51) ea = +val;
      }
    }
  }
  commit();
  flushCollPoly(); // safety: file ends without SEQEND

  return entities;
}

// ── Percentile helper ─────────────────────────────────────────────────────────
function pct(arr, p) {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * s.length))];
}

// ── Compute robust bbox from entities ─────────────────────────────────────────
function computeBbox(ents) {
  const xArr = [], yArr = [];
  for (const e of ents) {
    if (e.t === 'L') { xArr.push(e.x0, e.x1); yArr.push(e.y0, e.y1); }
    else if (e.t === 'P') { for (const v of e.verts) { xArr.push(v.x); yArr.push(v.y); } }
    else if (e.t === 'C' || e.t === 'A') { xArr.push(e.cx - e.r, e.cx + e.r); yArr.push(e.cy - e.r, e.cy + e.r); }
  }
  if (!xArr.length) return { cx: 0, cy: 0, w: 0, h: 0 };
  const xLo = pct(xArr, 0.02), xHi = pct(xArr, 0.98);
  const yLo = pct(yArr, 0.02), yHi = pct(yArr, 0.98);
  return { cx: (xLo + xHi) / 2, cy: (yLo + yHi) / 2, w: xHi - xLo, h: yHi - yLo };
}

// ── SVG path data for one entity ──────────────────────────────────────────────
function entityPath(e, cx, cy, s) {
  const px = x => ((x - cx) * s).toFixed(2);
  const py = y => ((cy - y) * s).toFixed(2);   // Y flipped: DXF Y-up → SVG Y-down

  if (e.t === 'L') {
    return `M${px(e.x0)},${py(e.y0)}L${px(e.x1)},${py(e.y1)}`;
  }
  if (e.t === 'P') {
    return e.verts.map((v, i) => (i ? 'L' : 'M') + px(v.x) + ',' + py(v.y)).join('') + (e.closed ? 'Z' : '');
  }
  if (e.t === 'C') {
    const rcx = +px(e.cx), rcy = +py(e.cy), rr = +(e.r * s).toFixed(2);
    if (rr < 0.5) return '';
    return `M${(rcx - rr).toFixed(2)},${rcy} A${rr},${rr} 0 1 0 ${(rcx + rr).toFixed(2)},${rcy} A${rr},${rr} 0 1 0 ${(rcx - rr).toFixed(2)},${rcy}Z`;
  }
  if (e.t === 'A') {
    const rr = +(e.r * s).toFixed(2);
    if (rr < 0.5) return '';
    const saR = e.sa * Math.PI / 180;
    const eaR = e.ea * Math.PI / 180;
    const sx2 = ((e.cx + e.r * Math.cos(saR) - cx) * s).toFixed(2);
    const sy2 = ((cy  - (e.cy + e.r * Math.sin(saR))) * s).toFixed(2);
    const ex2 = ((e.cx + e.r * Math.cos(eaR) - cx) * s).toFixed(2);
    const ey2 = ((cy  - (e.cy + e.r * Math.sin(eaR))) * s).toFixed(2);
    let sweep = e.ea - e.sa; if (sweep < 0) sweep += 360;
    return `M${sx2},${sy2}A${rr},${rr} 0 ${sweep > 180 ? 1 : 0} 0 ${ex2},${ey2}`;
  }
  return '';
}

// ── Visible entities helper (respects checkbox selection + text filter) ───────
function _visibleEntities() {
  if (!S.dxfData) return [];
  const { allEntities, selectedLayers, layerFilter } = S.dxfData;
  if (selectedLayers && selectedLayers.size > 0)
    return allEntities.filter(e => selectedLayers.has(e.layer));
  const fLow = (layerFilter || '').toLowerCase().trim();
  return fLow ? allEntities.filter(e => e.layer.toLowerCase().includes(fLow)) : allEntities;
}

// ── Render DXF layer ──────────────────────────────────────────────────────────
export function renderDxfLayer() {
  const el = document.getElementById('DXF');
  if (!el) return;
  if (!S.dxfData) { el.innerHTML = ''; return; }

  const { bscale, opacity } = S.dxfData;
  const visible = _visibleEntities();

  if (!visible.length) { el.innerHTML = ''; return; }

  // Compute bbox of visible entities
  const { cx: bcx, cy: bcy } = computeBbox(visible);
  S.dxfData.bcx = bcx;
  S.dxfData.bcy = bcy;

  // Group by layer for minimal DOM elements
  const byLayer = new Map();
  for (const e of visible) {
    if (!byLayer.has(e.layer)) byLayer.set(e.layer, []);
    byLayer.get(e.layer).push(e);
  }

  let html = `<g opacity="${opacity ?? 0.65}">`;
  for (const [layer, ents] of byLayer) {
    const st = layerStyle(layer);
    let d = '';
    for (const e of ents) d += entityPath(e, bcx, bcy, bscale);
    if (!d) continue;
    const dashAttr = st.dash ? ` stroke-dasharray="${st.dash}"` : '';
    html += `<path d="${d}" stroke="${st.stroke}" stroke-width="${st.sw}" fill="none"${dashAttr}/>`;
  }
  html += '</g>';
  el.innerHTML = html;
}

// ── Load DXF file ─────────────────────────────────────────────────────────────
export function loadDxf(inp) {
  const f = (inp && inp.files) ? inp.files[0] : inp;
  if (!f) return;

  toast('Citesc DXF... (poate dura câteva secunde)', 'ok');
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const allEntities = parseDxf(ev.target.result);

      if (!allEntities.length) {
        toast('DXF: nu s-au găsit entități geometrice.', 'err');
        return;
      }

      // Auto-scale: if DXF extent is huge (e.g. cadastral plan in mm at >5000m span),
      // the standard scale (1px per mm * S.pxPerMeter/1000) renders sub-pixel — use auto-fit instead.
      const stdScale = S.pxPerMeter / 1000;
      const { w: extW, h: extH } = computeBbox(allEntities);
      const TARGET_PX = 800;
      const bscale = extW > 0 && Math.max(extW, extH) * stdScale < 50
        ? TARGET_PX / Math.max(extW, extH)
        : stdScale;

      // Collect unique layer names for the tooltip/info
      const layerSet = new Set(allEntities.map(e => e.layer));

      S.dxfData = { allEntities, layerFilter: '', selectedLayers: new Set(), bcx: 0, bcy: 0, bscale, bscaleBase: bscale, extW, extH, opacity: 0.65 };

      renderDxfLayer();

      toast(`DXF: ${allEntities.length} entități, ${layerSet.size} straturi.`, 'ok');

      // Show controls, populate layer info
      const ctrl = document.getElementById('dxf-controls');
      if (ctrl) ctrl.style.display = 'flex';

      const info = document.getElementById('dxf-layer-info');
      if (info) info.textContent = layerSet.size + ' straturi';

      // Populate layer list with checkboxes (sorted by entity count desc)
      const list = document.getElementById('dxf-layer-list');
      if (list) {
        const counts = {};
        for (const e of allEntities) counts[e.layer] = (counts[e.layer] || 0) + 1;
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const header = `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 10px 6px;border-bottom:1px solid var(--border2);margin-bottom:2px">
          <span style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text2)">Selectează straturi</span>
          <button onclick="clearDxfLayerSel()" style="font-size:9px;color:#44aacc;background:none;border:none;cursor:pointer;padding:0" title="Deselectează tot">✕ golește</button>
        </div>`;
        const rows = sorted.map(([l, c]) => {
          const esc = l.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
          return `<label style="display:flex;align-items:center;gap:6px;padding:3px 10px;cursor:pointer;white-space:nowrap;overflow:hidden"
                         onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
                    <input type="checkbox" data-layer="${esc}" onchange="toggleDxfLayerCheck('${esc}')" style="cursor:pointer;flex-shrink:0">
                    <span style="color:var(--text3);min-width:28px;text-align:right;font-variant-numeric:tabular-nums">${c}</span>
                    <span style="overflow:hidden;text-overflow:ellipsis">${l}</span>
                  </label>`;
        }).join('');
        list.innerHTML = header + rows;
        list.style.display = 'none';
      }

      const sl = document.getElementById('dxf-op');
      if (sl) sl.value = '0.65';
      const sf = document.getElementById('dxf-filter');
      if (sf) sf.value = '';

    } catch (err) {
      toast('Eroare DXF: ' + err.message, 'err');
    }
  };
  reader.onerror = () => toast('Eroare la citirea fișierului.', 'err');
  reader.readAsText(f, 'windows-1250');
  if (inp && inp.value !== undefined) inp.value = '';
}

// ── Filter by layer name (text — clears checkbox selection) ──────────────────
export function setDxfFilter(text) {
  if (!S.dxfData) return;
  S.dxfData.layerFilter = text;
  if (text) {
    // Clear checkbox selection when user types
    S.dxfData.selectedLayers.clear();
    document.querySelectorAll('#dxf-layer-list input[type=checkbox]').forEach(cb => { cb.checked = false; });
    _updateLayerInfo();
  }
  renderDxfLayer();
}

// ── Toggle individual layer checkbox ─────────────────────────────────────────
export function toggleDxfLayerCheck(name) {
  if (!S.dxfData) return;
  const sel = S.dxfData.selectedLayers;
  if (sel.has(name)) sel.delete(name); else sel.add(name);
  // Clear text filter when checkbox used
  S.dxfData.layerFilter = '';
  const tf = document.getElementById('dxf-filter');
  if (tf) tf.value = '';
  _updateLayerInfo();
  renderDxfLayer();
}

// ── Clear checkbox selection ──────────────────────────────────────────────────
export function clearDxfLayerSel() {
  if (!S.dxfData) return;
  S.dxfData.selectedLayers.clear();
  document.querySelectorAll('#dxf-layer-list input[type=checkbox]').forEach(cb => { cb.checked = false; });
  _updateLayerInfo();
  renderDxfLayer();
}

function _updateLayerInfo() {
  const info = document.getElementById('dxf-layer-info');
  if (!info || !S.dxfData) return;
  const n = S.dxfData.selectedLayers.size;
  const total = new Set(S.dxfData.allEntities.map(e => e.layer)).size;
  info.textContent = n > 0 ? `${n}/${total} selectate` : `${total} straturi`;
}

// ── Fit viewport to DXF extent ────────────────────────────────────────────────
export function fitDxfToView() {
  if (!S.dxfData) return;
  const { bscale, extW, extH } = S.dxfData;
  if (!extW || !extH) return;
  const cw = document.getElementById('cw');
  if (!cw) return;
  const W = cw.clientWidth, H = cw.clientHeight;
  const fitS = Math.min((W * 0.85) / (extW * bscale), (H * 0.85) / (extH * bscale));
  S.view.s = Math.max(0.06, Math.min(14, fitS));
  S.view.x = W / 2;
  S.view.y = H / 2;
  applyView();
  if (typeof window.render === 'function') window.render();
}

// ── Clear DXF layer ───────────────────────────────────────────────────────────
export function resetDxfSilent() {
  S.dxfData = null;
  renderDxfLayer();
  const ctrl = document.getElementById('dxf-controls');
  if (ctrl) ctrl.style.display = 'none';
}

export function clearDxf() {
  resetDxfSilent();
  toast('Strat DXF șters.', 'ok');
}

// Returns serializable snapshot of current DXF state (for project save).
export function getDxfProjectData() {
  if (!S.dxfData) return null;
  const { allEntities, bcx, bcy, bscale, opacity, layerFilter, selectedLayers } = S.dxfData;
  return { allEntities, bcx, bcy, bscale, opacity, layerFilter: layerFilter || '', selectedLayersArr: [...selectedLayers] };
}

// Restores DXF state from saved project data (no toast).
export function restoreDxfFromProject(saved) {
  if (!saved || !saved.allEntities) return;
  const sel = new Set(saved.selectedLayersArr || []);
  S.dxfData = { allEntities: saved.allEntities, bcx: saved.bcx || 0, bcy: saved.bcy || 0, bscale: saved.bscale || S.pxPerMeter / 1000, opacity: saved.opacity ?? 0.65, layerFilter: saved.layerFilter || '', selectedLayers: sel };

  renderDxfLayer();

  const ctrl = document.getElementById('dxf-controls');
  if (ctrl) ctrl.style.display = 'flex';

  const opEl = document.getElementById('dxf-op');
  if (opEl) opEl.value = S.dxfData.opacity;
  const sfEl = document.getElementById('dxf-filter');
  if (sfEl) sfEl.value = S.dxfData.layerFilter;

  // Rebuild layer list
  const allEntities = saved.allEntities;
  const list = document.getElementById('dxf-layer-list');
  if (list) {
    const counts = {};
    for (const e of allEntities) counts[e.layer] = (counts[e.layer] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const header = `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 10px 6px;border-bottom:1px solid var(--border2);margin-bottom:2px">
      <span style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text2)">Selectează straturi</span>
      <button onclick="clearDxfLayerSel()" style="font-size:9px;color:#44aacc;background:none;border:none;cursor:pointer;padding:0" title="Deselectează tot">✕ golește</button>
    </div>`;
    const rows = sorted.map(([l, c]) => {
      const esc = l.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const checked = sel.has(l) ? ' checked' : '';
      return `<label style="display:flex;align-items:center;gap:6px;padding:3px 10px;cursor:pointer;white-space:nowrap;overflow:hidden"
                     onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
                <input type="checkbox" data-layer="${esc}" onchange="toggleDxfLayerCheck('${esc}')"${checked} style="cursor:pointer;flex-shrink:0">
                <span style="color:var(--text3);min-width:28px;text-align:right;font-variant-numeric:tabular-nums">${c}</span>
                <span style="overflow:hidden;text-overflow:ellipsis">${l}</span>
              </label>`;
    }).join('');
    list.innerHTML = header + rows;
    list.style.display = 'none';
  }

  const layerSet = new Set(allEntities.map(e => e.layer));
  const info = document.getElementById('dxf-layer-info');
  if (info) {
    const selCount = sel.size;
    info.textContent = selCount > 0 ? `${selCount}/${layerSet.size} selectate` : `${layerSet.size} straturi`;
  }
}

// ── Opacity control ───────────────────────────────────────────────────────────
export function setDxfOpacity(val) {
  if (!S.dxfData) return;
  S.dxfData.opacity = parseFloat(val);
  const g = document.querySelector('#DXF > g');
  if (g) g.setAttribute('opacity', S.dxfData.opacity);
}

// ── Scale control ─────────────────────────────────────────────────────────────
// factorPct: percentage relative to nominal (100 = default S.pxPerMeter/1000)
export function setDxfScale(factorPct) {
  if (!S.dxfData) return;
  const base = S.dxfData.bscaleBase ?? (S.pxPerMeter / 1000);
  S.dxfData.bscale = base * (parseFloat(factorPct) / 100);
  renderDxfLayer();
}

// ── Snap to nearest DXF feature ──────────────────────────────────────────────
// Returns { x, y, type:'vertex'|'perp' } in canvas coords, or null.
// threshCanvas = snap radius in canvas units (screen_px / S.view.s).
export function getDxfSnapPoint(cx, cy, threshCanvas) {
  if (!S.dxfData) return null;
  const { bscale, bcx, bcy } = S.dxfData;
  if (!bscale) return null;
  const visible = _visibleEntities();
  if (!visible.length) return null;

  // Canvas → DXF mm
  const dx = cx / bscale + bcx;
  const dy = bcy - cy / bscale;
  const thr2 = (threshCanvas / bscale) ** 2;

  // DXF mm → canvas
  const toC = (vx, vy) => ({ x: (vx - bcx) * bscale, y: (bcy - vy) * bscale });

  let bestV = null, bestVd2 = thr2;
  let bestP = null, bestPd2 = thr2;

  for (const e of visible) {
    // Vertex candidates
    const verts = e.t === 'L'  ? [{ x: e.x0, y: e.y0 }, { x: e.x1, y: e.y1 }]
                : e.t === 'P'  ? e.verts
                : [];
    for (const v of verts) {
      const d2 = (v.x - dx) ** 2 + (v.y - dy) ** 2;
      if (d2 < bestVd2) { bestVd2 = d2; bestV = toC(v.x, v.y); }
    }

    // Segment perp-foot candidates
    const segs = e.t === 'L' ? [[e.x0, e.y0, e.x1, e.y1]]
               : e.t === 'P' ? e.verts.slice(1).map((v, i) => [e.verts[i].x, e.verts[i].y, v.x, v.y])
                   .concat(e.closed && e.verts.length > 2
                     ? [[e.verts[e.verts.length - 1].x, e.verts[e.verts.length - 1].y, e.verts[0].x, e.verts[0].y]]
                     : [])
               : [];
    for (const [x0, y0, x1, y1] of segs) {
      const ex = x1 - x0, ey = y1 - y0, len2 = ex * ex + ey * ey;
      if (len2 < 1) continue;
      const t = Math.max(0, Math.min(1, ((dx - x0) * ex + (dy - y0) * ey) / len2));
      const fx = x0 + t * ex, fy = y0 + t * ey;
      const d2 = (fx - dx) ** 2 + (fy - dy) ** 2;
      if (d2 < bestPd2) { bestPd2 = d2; bestP = toC(fx, fy); }
    }
  }

  if (bestV) return { ...bestV, type: 'vertex' };
  if (bestP) return { ...bestP, type: 'perp' };
  return null;
}

// ── Toggle layer list panel ───────────────────────────────────────────────────
export function toggleDxfLayerList() {
  const list  = document.getElementById('dxf-layer-list');
  if (!list) return;
  const arrow = document.getElementById('dxf-layer-arrow');
  const open  = list.style.display === 'none' || !list.style.display;
  list.style.display  = open ? 'block' : 'none';
  if (arrow) arrow.textContent = open ? '▲' : '▼';
}
