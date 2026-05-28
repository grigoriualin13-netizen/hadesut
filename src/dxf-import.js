// DXF vectorial background layer — lightweight parser for LINE/LWPOLYLINE/CIRCLE/ARC
// Units: DXF file is in millimetres ($INSUNITS=4), canvas is in px (S.pxPerMeter px/m)
// Coordinate mapping: svg_x = (dxf_x − cx) * s,  svg_y = −(dxf_y − cy) * s
// where cx/cy = bbox center of visible entities, s = S.pxPerMeter / 1000

import { S }     from './state.js';
import { toast } from './utils.js';

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
      commit();
      if (val === 'SECTION') {
        const sp = next();
        section = (sp?.code === 2) ? sp.val : null;
      } else if (val === 'ENDSEC') {
        section = null;
      } else if (section === 'ENTITIES' || section === 'BLOCKS') {
        if      (val === 'LINE')       etype = 'LINE';
        else if (val === 'LWPOLYLINE') etype = 'POLY';
        else if (val === 'CIRCLE')     etype = 'CIRCLE';
        else if (val === 'ARC')        etype = 'ARC';
        else                            etype = null;
      }
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
  if (!xArr.length) return { cx: 0, cy: 0 };
  const xLo = pct(xArr, 0.02), xHi = pct(xArr, 0.98);
  const yLo = pct(yArr, 0.02), yHi = pct(yArr, 0.98);
  return { cx: (xLo + xHi) / 2, cy: (yLo + yHi) / 2 };
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

// ── Render DXF layer ──────────────────────────────────────────────────────────
export function renderDxfLayer() {
  const el = document.getElementById('DXF');
  if (!el) return;
  if (!S.dxfData) { el.innerHTML = ''; return; }

  const { allEntities, layerFilter, bscale, opacity } = S.dxfData;

  // Apply layer filter
  const fLow = (layerFilter || '').toLowerCase().trim();
  const visible = fLow
    ? allEntities.filter(e => e.layer.toLowerCase().includes(fLow))
    : allEntities;

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

      // Scale: DXF in mm, canvas px (S.pxPerMeter px = 1 m = 1000 mm)
      const bscale = S.pxPerMeter / 1000;

      // Collect unique layer names for the tooltip/info
      const layerSet = new Set(allEntities.map(e => e.layer));

      S.dxfData = { allEntities, layerFilter: '', bcx: 0, bcy: 0, bscale, opacity: 0.65 };

      renderDxfLayer();

      toast(`DXF: ${allEntities.length} entități, ${layerSet.size} straturi.`, 'ok');

      // Show controls, populate layer info
      const ctrl = document.getElementById('dxf-controls');
      if (ctrl) ctrl.style.display = 'flex';

      const info = document.getElementById('dxf-layer-info');
      if (info) {
        // Group by prefix for summary
        const tops = [...layerSet].slice(0, 80).join(', ');
        info.title = tops;
        info.textContent = layerSet.size + ' straturi. Filtrează de ex: "PS Don" sau "DRUM".';
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

// ── Filter by layer name ──────────────────────────────────────────────────────
export function setDxfFilter(text) {
  if (!S.dxfData) return;
  S.dxfData.layerFilter = text;
  renderDxfLayer();
}

// ── Clear DXF layer ───────────────────────────────────────────────────────────
export function clearDxf() {
  S.dxfData = null;
  renderDxfLayer();
  const ctrl = document.getElementById('dxf-controls');
  if (ctrl) ctrl.style.display = 'none';
  toast('Strat DXF șters.', 'ok');
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
  S.dxfData.bscale = (S.pxPerMeter / 1000) * (parseFloat(factorPct) / 100);
  renderDxfLayer();
}
