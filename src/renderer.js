import { S } from './state.js';
import { applyView, termWorldPos, calcPathLen, getLineIntersection, setMode, toast, sn, svgPt, updateStat } from './utils.js';
import { sym, symW, symH } from './elements.js';
// Circular: element-manager and ui import render() from here — use export function (live binding)
import { selectEl, saveState, finalConn } from './element-manager.js';
import { updateProps } from './ui.js';

let _svgEl, _VP, _NL, _CL, _GL;
export function initRenderer(svgEl, VP, NL, CL, GL) {
  _svgEl = svgEl; _VP = VP; _NL = NL; _CL = CL; _GL = GL;
}
export function getSvgEl() { return _svgEl; }

export function mk(t) { return document.createElementNS('http://www.w3.org/2000/svg', t); }

// MT phase visual offset — perpendicular to span: R=+14px, S=0, T=−14px
export const MT_PHASE_PX = 14;
const _MT_FAZA_DIR = { R: 1, S: 0, T: -1 };
const _MT_POLE_R = 22;
function _mtOffsetPath(path, faza, fromElId, toElId) {
  const dir = _MT_FAZA_DIR[faza];
  if (!dir || path.length < 2) return path;
  const p0 = path[0], pn = path[path.length - 1];
  const dx = pn.x - p0.x, dy = pn.y - p0.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return path;
  const nx = -dy / len, ny = dx / len;
  const off = dir * MT_PHASE_PX;
  const result = path.map(p => ({ x: p.x + nx * off, y: p.y + ny * off }));
  // Dacă offsetul mută endpoint-ul în AFARA cercului stâlpului, îl aduce pe granița cercului.
  // Cercul cu fill acoperă tot ce e înăuntru — endpoint-urile pe/în cerc sunt invizibile.
  const _clip = (pt, elId) => {
    const el = elId ? S.EL.find(e => e.id === elId) : null;
    if (!el || !el.type?.startsWith('stalp_mt_')) return pt;
    const ex = pt.x - el.x, ey = pt.y - el.y, d = Math.hypot(ex, ey);
    if (d <= _MT_POLE_R || d < 0.1) return pt;
    return { x: el.x + ex / d * _MT_POLE_R, y: el.y + ey / d * _MT_POLE_R };
  };
  result[0] = _clip(result[0], fromElId);
  result[result.length - 1] = _clip(result[result.length - 1], toElId);
  return result;
}

// ── Background ──
export function renderBg() {
  const bgL = document.getElementById('bg-layer');
  if (!bgL) return;
  if (!S.bgData.url) { bgL.innerHTML = ''; return; }
  bgL.innerHTML = `<img id="html-bg-img" src="${S.bgData.url}" style="position:absolute; left:${S.bgData.x}px; top:${S.bgData.y}px; width:${S.bgData.w}px; height:${S.bgData.h}px; opacity:${S.bgData.op}; will-change:transform;" />`;
}

export function toggleBgPanel() {
  const p = document.getElementById('bg-panel');
  p.style.display = p.style.display === 'flex' ? 'none' : 'flex';
}

export function loadBg(inp) {
  const f = inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      S.bgData = { url: e.target.result, x: -img.width / 2, y: -img.height / 2, w: img.width, h: img.height, op: parseFloat(document.getElementById('bg-op').value), locked: document.getElementById('bg-lock').checked };
      renderBg(); toast('Fundal încărcat! Îl poți calibra pentru o distanță exactă.', 'ok');
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(f); inp.value = '';
}

export function updateBgOp(val) {
  S.bgData.op = parseFloat(val);
  const img = document.getElementById('html-bg-img');
  if (img) img.style.opacity = S.bgData.op;
}

export function updateBgLock(val) { S.bgData.locked = val; }

export function clearBg() {
  if (confirm('Ștergi fundalul cadastral?')) {
    S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
    renderBg();
  }
}

export function startCalib() {
  if (!S.bgData.url) { toast('Încărcați un fundal mai întâi!', 'ac'); return; }
  setMode('calibrate'); toast('Click P1, apoi P2 pe hartă.', 'ac');
}

export function confirmCalib() {
  const d_m = document.getElementById('calib-input').value;
  if (d_m && !isNaN(parseFloat(d_m)) && parseFloat(d_m) > 0) {
    const target_px = parseFloat(d_m) * S.pxPerMeter;
    const scale = target_px / S.tempCalibLenPx;
    if (S.bgData.url) {
      S.bgData.w *= scale; S.bgData.h *= scale;
      S.bgData.x = S.calibPts[0].x - (S.calibPts[0].x - S.bgData.x) * scale;
      S.bgData.y = S.calibPts[0].y - (S.calibPts[0].y - S.bgData.y) * scale;
      renderBg(); toast('Scară fundal calibrată cu succes!', 'ok');
    }
  } else { toast('Calibrare anulată (valoare invalidă).', 'w'); }
  closeCalib();
}

export function closeCalib() {
  document.getElementById('calib-modal').style.display = 'none';
  setMode('select'); S.calibPts = []; S.tempCalibLenPx = 0;
  document.getElementById('tpoly').style.display = 'none';
}

// ── Theme ──
export function toggleTheme() {
  S.lightMode = !S.lightMode;
  document.documentElement.setAttribute('data-theme', S.lightMode ? 'light' : '');
  document.getElementById('btn-theme').textContent = S.lightMode ? '☀️' : '🌙';
  render(); toast(S.lightMode ? '☀️ Temă luminoasă' : '🌙 Temă întunecată');
}

// ── VD Overlay ──
export function toggleVDOverlay() {
  S.vdOverlayOn = document.getElementById('vd-overlay').checked;
  if (S.vdOverlayOn && S.vdResults) renderVDOverlay();
  else document.getElementById('VD-OVL')?.remove();
}

export function renderVDOverlay() {
  let ovl = document.getElementById('VD-OVL');
  if (!ovl) { ovl = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ovl.id = 'VD-OVL'; _VP.appendChild(ovl); }
  ovl.innerHTML = ''; if (!S.vdResults) return;
  const fuseA = parseFloat(document.getElementById('vd-fuse')?.value) || 160;
  const showIsc = document.getElementById('vd-show-isc')?.checked !== false;
  const byEl = new Map();
  S.vdResults.forEach((data) => { if (!byEl.has(data.elId)) byEl.set(data.elId, []); byEl.get(data.elId).push(data); });
  byEl.forEach((dataList, elId) => {
    const el = S.EL.find(x => x.id === elId);
    if (!el || el.type === 'text' || el.type === 'polyline') return;
    if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;
    dataList.forEach((data, index) => {
      if (data.duNod === 0 && !data.duTronson) return;
      const evalFuse = data.protected_by || fuseA;
      const iscAmps = data.Isc * 1000;
      const isIscLow = showIsc && iscAmps > 0 && iscAmps < 3 * evalFuse;
      let col = data.duNod > 10 ? '#ff3d71' : data.duNod > 5 ? '#ff9f43' : data.duNod > 3 ? '#eab308' : '#00e5a0';
      let bgHex = col, bgOp = data.duNod > 10 ? '0.18' : data.duNod > 5 ? '0.15' : data.duNod > 3 ? '0.12' : '0.10';
      if (isIscLow) { col = '#ff3d71'; bgHex = '#ff3d71'; bgOp = '0.18'; }
      const txtDU = `[${data.circKey}] ΔU=${data.duNod.toFixed(2)}%`;
      const hasIsc = showIsc && (data.isEnd || el.nod === 'capat' || isIscLow);
      let txtIsc = hasIsc ? `Isc=${data.Isc.toFixed(3)}kA${isIscLow ? ' ⚠ CS!' : ''}` : '';
      const bwDU = txtDU.length * 5.5 + 10, bhLine = 14;
      const bw = Math.max(bwDU, hasIsc ? txtIsc.length * 5.5 + 10 : 0);
      const totalH = hasIsc ? bhLine * 2 + 2 : bhLine;
      const yOffset = -totalH - 28 - (index * (totalH + 4));
      ovl.innerHTML += `<rect x="${el.x - bw / 2}" y="${el.y + yOffset}" width="${bw}" height="${totalH}" fill="${bgHex}" fill-opacity="${bgOp}" stroke="${col}" stroke-width="1" rx="3" pointer-events="none"/>`;
      ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5}" text-anchor="middle" font-size="8.5" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none">${txtDU}</text>`;
      if (hasIsc) ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5 + bhLine}" text-anchor="middle" font-size="7.5" fill="${isIscLow ? '#ff3d71' : '#ff9f43'}" font-family="JetBrains Mono,monospace" font-weight="600" pointer-events="none">${txtIsc}</text>`;
    });
  });
}

// ── Flow Animation ──
export function toggleFlowAnim() {
  S.flowAnimOn = !S.flowAnimOn;
  const btn = document.getElementById('btn-flow');
  btn.classList.toggle('on', S.flowAnimOn);
  btn.style.background = S.flowAnimOn ? 'rgba(234,179,8,.15)' : '';
  btn.style.color = S.flowAnimOn ? '#eab308' : '';
  btn.style.borderColor = S.flowAnimOn ? 'rgba(234,179,8,.45)' : '';
  renderFlowLayer();
  toast(S.flowAnimOn ? '⚡ Animație flux activată' : 'Animație flux oprită', S.flowAnimOn ? 'ok' : '');
}

export function renderFlowLayer() {
  const gl = document.getElementById('GL');
  if (!gl) return;
  gl.innerHTML = '';
  if (!S.flowAnimOn) return;
  S.CN.forEach(cn => {
    if (!cn.flowDir || !cn.path || cn.path.length < 2) return;
    if (cn.fromElId && cn.fromCircuit) { const srcEl = S.EL.find(e => e.id === cn.fromElId); if (srcEl && srcEl.fuses && srcEl.fuses[cn.fromCircuit] === false) return; }
    if (cn.toElId && cn.toCircuit) { const srcEl = S.EL.find(e => e.id === cn.toElId); if (srcEl && srcEl.fuses && srcEl.fuses[cn.toCircuit] === false) return; }
    const col = cn.color || '#ef4444', sw = Math.max(2, (cn.strokeWidth || 2) + 1.5), isRev = cn.flowDir === 'rev';
    let dStr = `M ${cn.path[0].x},${cn.path[0].y} `;
    for (let i = 1; i < cn.path.length; i++) dStr += `L ${cn.path[i].x},${cn.path[i].y} `;
    let totalLen = 0;
    for (let i = 0; i < cn.path.length - 1; i++) totalLen += Math.hypot(cn.path[i + 1].x - cn.path[i].x, cn.path[i + 1].y - cn.path[i].y);
    const speedClass = totalLen < 100 ? 'fast' : totalLen > 500 ? 'slow' : '';
    const offset = Math.random() * 40;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', dStr); path.setAttribute('fill', 'none'); path.setAttribute('stroke', col); path.setAttribute('stroke-width', sw); path.setAttribute('stroke-opacity', '0.85');
    path.setAttribute('class', `flow-arrow${isRev ? ' rev' : ''}${speedClass ? ' ' + speedClass : ''}`);
    path.style.animationDelay = `-${offset.toFixed(1)}s`; gl.appendChild(path);
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', dStr); path2.setAttribute('fill', 'none'); path2.setAttribute('stroke', '#ffffff'); path2.setAttribute('stroke-width', Math.max(1.5, sw * 0.45)); path2.setAttribute('stroke-opacity', '0.7');
    path2.setAttribute('class', `flow-arrow${isRev ? ' rev' : ''}${speedClass ? ' ' + speedClass : ''}`);
    path2.style.animationDelay = `-${offset.toFixed(1)}s`; gl.appendChild(path2);
  });
}

// ── Dimension SVG helper (shared by render + preview) ────────────────────────
function _dimSVG(d, isSel = false) {
  const { p1, p2, offset } = d;
  const ddx = p2.x - p1.x, ddy = p2.y - p1.y;
  const len = Math.hypot(ddx, ddy);
  if (len < 2) return '';
  const dark = !S.lightMode;
  const col  = isSel ? '#00cfff' : (dark ? '#00e5a0' : '#007a55');
  const ppm  = S.pxPerMeter || 5;
  const OVS = 10, GAP = 5, ARL = 9, ARW = 3.5, TXTOFF = 10;
  const ux = ddx / len, uy = ddy / len;
  const nx = -uy, ny = ux;
  const ns = offset >= 0 ? 1 : -1;
  const d1x = p1.x + nx * offset, d1y = p1.y + ny * offset;
  const d2x = p2.x + nx * offset, d2y = p2.y + ny * offset;
  const gv = GAP * ns, ov = (Math.abs(offset) + OVS) * ns;
  let h = '';
  if (isSel) h += `<line x1="${d1x.toFixed(1)}" y1="${d1y.toFixed(1)}" x2="${d2x.toFixed(1)}" y2="${d2y.toFixed(1)}" stroke="rgba(0,207,255,.3)" stroke-width="10" pointer-events="none"/>`;
  h += `<line x1="${d1x.toFixed(1)}" y1="${d1y.toFixed(1)}" x2="${d2x.toFixed(1)}" y2="${d2y.toFixed(1)}" stroke="transparent" stroke-width="14" style="pointer-events:stroke;cursor:pointer"/>`;
  h += `<line x1="${(p1.x+nx*gv).toFixed(1)}" y1="${(p1.y+ny*gv).toFixed(1)}" x2="${(p1.x+nx*ov).toFixed(1)}" y2="${(p1.y+ny*ov).toFixed(1)}" stroke="${col}" stroke-width="0.9" opacity="0.85" pointer-events="none"/>`;
  h += `<line x1="${(p2.x+nx*gv).toFixed(1)}" y1="${(p2.y+ny*gv).toFixed(1)}" x2="${(p2.x+nx*ov).toFixed(1)}" y2="${(p2.y+ny*ov).toFixed(1)}" stroke="${col}" stroke-width="0.9" opacity="0.85" pointer-events="none"/>`;
  h += `<line x1="${d1x.toFixed(1)}" y1="${d1y.toFixed(1)}" x2="${d2x.toFixed(1)}" y2="${d2y.toFixed(1)}" stroke="${col}" stroke-width="1.2" opacity="0.9" pointer-events="none"/>`;
  const b1x = d1x+ux*ARL, b1y = d1y+uy*ARL;
  h += `<polygon points="${d1x.toFixed(1)},${d1y.toFixed(1)} ${(b1x-nx*ARW).toFixed(1)},${(b1y-ny*ARW).toFixed(1)} ${(b1x+nx*ARW).toFixed(1)},${(b1y+ny*ARW).toFixed(1)}" fill="${col}" opacity="0.9" pointer-events="none"/>`;
  const b2x = d2x-ux*ARL, b2y = d2y-uy*ARL;
  h += `<polygon points="${d2x.toFixed(1)},${d2y.toFixed(1)} ${(b2x-nx*ARW).toFixed(1)},${(b2y-ny*ARW).toFixed(1)} ${(b2x+nx*ARW).toFixed(1)},${(b2y+ny*ARW).toFixed(1)}" fill="${col}" opacity="0.9" pointer-events="none"/>`;
  const mx = (d1x+d2x)/2+nx*ns*TXTOFF, my = (d1y+d2y)/2+ny*ns*TXTOFF;
  let ang = Math.atan2(ddy, ddx) * 180 / Math.PI;
  if (ang > 90) ang -= 180; else if (ang < -90) ang += 180;
  h += `<text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" font-size="11" fill="${col}"
         font-family="JetBrains Mono,monospace" font-weight="700" text-anchor="middle" dominant-baseline="central"
         transform="rotate(${ang.toFixed(1)},${mx.toFixed(1)},${my.toFixed(1)})"
         paint-order="stroke" stroke="${dark?'#000a':'#fffa'}" stroke-width="2.5"
         stroke-linecap="round" pointer-events="none">${(len/ppm).toFixed(2)} m</text>`;
  return h;
}

// ── Dimension placement preview (only during active placement) ────────────────
export function renderDimLayer(preview = null) {
  const el = document.getElementById('DIM');
  if (!el) return;
  el.innerHTML = preview ? _dimSVG(preview) : '';
}

// ── Main Render ──
export function render() {
  _NL.innerHTML = ''; _CL.innerHTML = '';

  S.CN.forEach(cn => {
    if (S.schemaMode === 'existent' && cn._layer === 'proiectat') return;
    const _cnFaded = S.schemaMode === 'proiectat' && cn._layer === 'existent';
    const renderPath = (S.schemaMode === 'existent' && cn._exPath) ? cn._exPath : cn.path;
    const isSel = cn.id === S.sel || S.multiSel.has(cn.id), col = cn.color || '#ef4444', sw = cn.strokeWidth || 2, dash = cn.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '';
    const rp = cn.faza ? _mtOffsetPath(renderPath, cn.faza, cn.fromElId, cn.toElId) : renderPath;
    let dStr = '', JUMP_R = 6;
    if (rp.length > 0) {
      for (let i = 0; i < rp.length - 1; i++) {
        const p1 = rp[i], p2 = rp[i + 1]; if (i === 0) dStr += `M ${p1.x},${p1.y} `;
        let inters = [];
        S.CN.forEach(otherCn => {
          if (otherCn.id >= cn.id) return;
          const otherRP = (S.schemaMode === 'existent' && otherCn._exPath) ? otherCn._exPath : otherCn.path;
          for (let j = 0; j < otherRP.length - 1; j++) {
            const int = getLineIntersection(p1, p2, otherRP[j], otherRP[j + 1]);
            if (int) inters.push({ x: int.x, y: int.y, dist: Math.hypot(int.x - p1.x, int.y - p1.y) });
          }
        });
        inters.sort((a, b) => a.dist - b.dist);
        const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy);
        if (len > 0) {
          const ux = dx / len, uy = dy / len; let validInters = [];
          inters.forEach(int => {
            if (validInters.length === 0) { if (int.dist > JUMP_R && len - int.dist > JUMP_R) validInters.push(int); }
            else { if (int.dist - validInters[validInters.length - 1].dist > JUMP_R * 2.5 && len - int.dist > JUMP_R) validInters.push(int); }
          });
          validInters.forEach(int => { dStr += `L ${int.x - ux * JUMP_R},${int.y - uy * JUMP_R} A ${JUMP_R} ${JUMP_R} 0 0 1 ${int.x + ux * JUMP_R},${int.y + uy * JUMP_R} `; });
        }
        dStr += `L ${p2.x},${p2.y} `;
      }
    }
    const g = mk('g'); g.setAttribute('class', `conn ${isSel ? 'sel' : ''}`);
    if (_cnFaded) g.setAttribute('opacity', '0.72');
    const isDemontat = cn.stare === 'demontat', demDash = isDemontat ? 'stroke-dasharray="8,6"' : '', finalDash = dash || demDash;
    let hlPath = ''; if (cn.fillColor && cn.fillColor !== 'none') hlPath = `<path d="${dStr}" fill="none" stroke="${cn.fillColor}" stroke-width="${sw + 8}" opacity="0.45" pointer-events="none"/>`;
    let demXmarks = '';
    if (isDemontat && renderPath.length >= 2) {
      for (let i = 0; i < renderPath.length - 1; i++) {
        const p1 = renderPath[i], p2 = renderPath[i + 1], segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const xCount = Math.max(1, Math.floor(segLen / 40));
        for (let j = 1; j <= xCount; j++) {
          const t2 = j / (xCount + 1), cx2 = p1.x + (p2.x - p1.x) * t2, cy2 = p1.y + (p2.y - p1.y) * t2, xr = 4;
          demXmarks += `<line x1="${cx2-xr}" y1="${cy2-xr}" x2="${cx2+xr}" y2="${cy2+xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
          demXmarks += `<line x1="${cx2+xr}" y1="${cy2-xr}" x2="${cx2-xr}" y2="${cy2+xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
        }
      }
    }
    const pts = rp.map(p => `${p.x},${p.y}`).join(' ');
    g.innerHTML = `<polyline class="hb" points="${pts}" fill="none" stroke="transparent" stroke-width="16" style="pointer-events:stroke;cursor:pointer"/>${hlPath}<path class="cl" d="${dStr}" fill="none" stroke="${col}" stroke-width="${isSel ? sw + 2 : sw}" ${finalDash} pointer-events="none"/>${demXmarks}`;
    if (rp.length >= 2) {
      let maxLen = -1, bestP1 = rp[0], bestP2 = rp[1];
      for (let i = 0; i < rp.length - 1; i++) { let d = Math.hypot(rp[i + 1].x - rp[i].x, rp[i + 1].y - rp[i].y); if (d > maxLen) { maxLen = d; bestP1 = rp[i]; bestP2 = rp[i + 1]; } }
      let mx = (bestP1.x + bestP2.x) / 2, my = (bestP1.y + bestP2.y) / 2;
      let isHoriz = Math.abs(bestP2.x - bestP1.x) >= Math.abs(bestP2.y - bestP1.y);
      let tx = mx, ty = my, rot = 0;
      if (isHoriz) { ty -= 7; } else { tx += 7; rot = -90; }
      let tr = rot ? `transform="rotate(${rot} ${tx} ${ty})"` : '';
      let hlStyle = cn.fillColor && cn.fillColor !== 'none' ? `stroke:${cn.fillColor}; stroke-width:3px; paint-order:stroke fill;` : '';
      g.innerHTML += `<text class="el-lbl" x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="9" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none" style="${hlStyle}" ${tr}>L=${cn.length || 0}m</text>`;
      if (cn.faza) {
        const fazaCol = {R:'#ef4444',S:'#22c55e',T:'#3b82f6'}[cn.faza] || '#888';
        const bx = isHoriz ? mx + 18 : mx + 18, by = isHoriz ? my - 7 : my + 12;
        g.innerHTML += `<circle cx="${bx}" cy="${by}" r="6" fill="${fazaCol}" stroke="rgba(0,0,0,.25)" stroke-width="1" pointer-events="none"/><text x="${bx}" y="${by}" text-anchor="middle" dominant-baseline="central" font-size="7.5" fill="white" font-weight="bold" pointer-events="none">${cn.faza}</text>`;
      }
    }
    g.querySelector('.hb').addEventListener('mousedown', ev => {
      ev.stopPropagation();
      if (S.mode === 'select') {
        if (ev.ctrlKey || ev.metaKey) { if (S.multiSel.has(cn.id)) S.multiSel.delete(cn.id); else S.multiSel.add(cn.id); S.sel = null; render(); updateProps(); return; }
        if (S.multiSel.size > 1 && S.multiSel.has(cn.id)) {
          S.multiDragStart = { mouseX: svgPt(ev).x, mouseY: svgPt(ev).y, origPositions: S.EL.filter(e => S.multiSel.has(e.id)).map(e => ({ id: e.id, x: e.x, y: e.y })), origConnPaths: S.CN.filter(c => S.multiSel.has(c.id)).map(c => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) })) };
          const _selIds = new Set(S.multiDragStart.origPositions.map(o => o.id));
          S.CN.forEach(cn2 => { if (!S.multiSel.has(cn2.id) && (_selIds.has(cn2.fromElId) && _selIds.has(cn2.toElId))) cn2._origPath = JSON.parse(JSON.stringify(cn2.path)); });
          S.dragging = true; S.dragEl = null;
        } else { S.multiSel.clear(); selectEl(cn.id); }
      }
    });
    if (isSel && S.mode === 'select') {
      cn.path.forEach((p, i) => {
        const h = mk('circle'); h.setAttribute('class', 'ph'); h.setAttribute('cx', p.x); h.setAttribute('cy', p.y); h.setAttribute('r', '6');
        h.addEventListener('mousedown', ev => { ev.stopPropagation(); if (ev.button === 2 && cn.path.length > 2) { saveState('rmv pt'); cn.path.splice(i, 1); render(); } else { S.vxDrag = true; S.vxConn = cn; S.vxIdx = i; } });
        g.appendChild(h);
      });
    }
    _CL.appendChild(g);
  });

  S.EL.forEach(el => {
    if (S.schemaMode === 'existent' && el._layer === 'proiectat') return;
    const _elFaded = S.schemaMode === 'proiectat' && el._layer === 'existent';
    if (el.type === 'dim') {
      const isSel = el.id === S.sel || S.multiSel.has(el.id);
      const g = mk('g'); g.setAttribute('class', `el ${isSel ? 'sel' : ''}`); g.dataset.eid = el.id;
      if (_elFaded) g.setAttribute('opacity', '0.72');
      g.innerHTML = _dimSVG(el, isSel);
      g.addEventListener('mousedown', ev => {
        if (S.mode === 'select') {
          ev.stopPropagation();
          if (ev.ctrlKey || ev.metaKey) { if (S.multiSel.has(el.id)) S.multiSel.delete(el.id); else S.multiSel.add(el.id); S.sel = null; render(); updateProps(); return; }
          S.multiSel.clear(); selectEl(el.id);
        }
      });
      _NL.appendChild(g); return;
    }
    if (el.type === 'poly_arrow') { el.type = 'polyline'; el.arrowEnd = true; el.arrowStart = false; el.lineType = 'solid'; el.strokeWidth = 2.5; }
    const isSel = el.id === S.sel;
    const _useEx = S.schemaMode === 'existent' && el._exPos;
    const renderX = _useEx ? el._exPos.x : el.x;
    const renderY = _useEx ? el._exPos.y : el.y;
    const renderRot = _useEx ? (el._exPos.rotation || 0) : (el.rotation || 0);
    const renderScale = _useEx ? (el._exPos.scale || 1) : (el.scale || 1);
    if (el.type === 'text') {
      const g = mk('g'); g.setAttribute('class', `el ${isSel ? 'sel' : ''}`); g.dataset.eid = el.id;
      if (_elFaded) g.setAttribute('opacity', '0.72');
      const hlStyle = el.fillColor && el.fillColor !== 'none' ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : '';
      g.setAttribute('transform', `translate(${renderX},${renderY}) rotate(${renderRot}) scale(${renderScale})`);
      g.innerHTML = `<text x="0" y="0" font-size="${el.fontSize || 10}" fill="${el.color || (S.lightMode ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" style="${hlStyle}">${el.label || 'Text'}</text>`;
      g.addEventListener('mousedown', ev => { if (S.mode === 'select') { ev.stopPropagation(); S.dragging = true; S.dragEl = el; S.dragOff = { x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y }; selectEl(el.id); } });
      _NL.appendChild(g); return;
    }
    if (el.type === 'polyline') {
      const g = mk('g'); g.setAttribute('class', `el ${isSel ? 'sel' : ''}`); g.dataset.eid = el.id;
      if (_elFaded) g.setAttribute('opacity', '0.72');
      const renderPts = (_useEx && el._exPoints) ? el._exPoints : el.points;
      const pts = renderPts.map(p => `${p.x},${p.y}`).join(' '), dash = el.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '', sw = el.strokeWidth || 2.5;
      let markersDef = '';
      if (el.arrowEnd) markersDef += `<marker id="arr-e-${el.id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${el.color || '#00cfff'}"/></marker>`;
      if (el.arrowStart) markersDef += `<marker id="arr-s-${el.id}" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><polygon points="0 0,8 3,0 6" fill="${el.color || '#00cfff'}"/></marker>`;
      let markersAttr = '';
      if (el.arrowEnd) markersAttr += ` marker-end="url(#arr-e-${el.id})"`;
      if (el.arrowStart) markersAttr += ` marker-start="url(#arr-s-${el.id})"`;
      g.innerHTML = `<defs>${markersDef}</defs><polyline points="${pts}" fill="none" stroke="${el.color || '#00cfff'}" stroke-width="${sw}" ${dash} ${markersAttr}/>`;
      if (isSel) el.points.forEach((p, i) => { const h = mk('circle'); h.setAttribute('class', 'ph'); h.setAttribute('cx', p.x); h.setAttribute('cy', p.y); h.setAttribute('r', '6'); h.addEventListener('mousedown', ev => { ev.stopPropagation(); S.vxDrag = true; S.vxConn = el; S.vxIdx = i; }); g.appendChild(h); });
      g.addEventListener('mousedown', ev => { if (S.mode === 'select') { ev.stopPropagation(); S.dragging = true; S.dragEl = el; S.dragOff = { x: svgPt(ev).x - el.points[0].x, y: svgPt(ev).y - el.points[0].y }; selectEl(el.id); } });
      _NL.appendChild(g); return;
    }

    const { inner } = sym(el); const g = mk('g'); g.setAttribute('class', `el ${isSel ? 'sel' : ''}`); g.dataset.eid = el.id;
    if (_elFaded) g.setAttribute('opacity', '0.72');
    g.setAttribute('transform', `translate(${renderX},${renderY}) rotate(${renderRot}) scale(${renderScale})`);
    const isMSel = S.multiSel.has(el.id), wBox = symW(el), hBox = symH(el);
    let selBox = '';
    if (isSel) selBox = `<rect x="${-wBox/2-5}" y="${-hBox/2-5}" width="${wBox+10}" height="${hBox+10}" fill="none" stroke="rgba(0,207,255,.7)" stroke-width="2" stroke-dasharray="5,3" rx="3" pointer-events="none"/>`;
    else if (isMSel) selBox = `<rect x="${-wBox/2-5}" y="${-hBox/2-5}" width="${wBox+10}" height="${hBox+10}" fill="rgba(0,207,255,.06)" stroke="rgba(0,207,255,.45)" stroke-width="1.5" stroke-dasharray="4,4" rx="3" pointer-events="none"/>`;
    const hlStyle = el.fillColor && el.fillColor !== 'none' ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : '';
    let lbl = '';
    if (el.label) {
      if (!el.type.startsWith('firida_') && !el.type.startsWith('stalp_') && !el.type.startsWith('ptab_')) {
        lbl = `<text class="el-lbl" x="12" y="${-(hBox/2)-10}" text-anchor="start" font-size="11" fill="${el.color || (S.lightMode ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ''}</text>`;
      } else {
        const ly = (hBox / 2) + 16, nodBadge = el.nod ? `<text class="el-lbl" x="12" y="${ly+12}" text-anchor="start" font-size="8" fill="${el.nod==='nod'?'#ff9f43':el.nod==='capat'?'#00e5a0':'#00cfff'}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">[${el.nod.toUpperCase()}]</text>` : '';
        lbl = `<text class="el-lbl" x="12" y="${ly}" text-anchor="start" font-size="11" fill="${el.color || (S.lightMode ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ''}</text>${nodBadge}`;
      }
    }
    g.innerHTML = selBox + inner + lbl;

    g.addEventListener('mousedown', ev => {
      if (S.mode === 'select') {
        ev.stopPropagation();
        if (ev.ctrlKey || ev.metaKey) { if (S.multiSel.has(el.id)) S.multiSel.delete(el.id); else S.multiSel.add(el.id); S.sel = null; render(); updateProps(); return; }
        if (S.multiSel.size > 1 && S.multiSel.has(el.id)) {
          S.multiDragStart = { mouseX: svgPt(ev).x, mouseY: svgPt(ev).y, origPositions: S.EL.filter(e => S.multiSel.has(e.id)).map(e => ({ id: e.id, x: e.x, y: e.y })), origConnPaths: S.CN.filter(c => S.multiSel.has(c.id)).map(c => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) })) };
          const _selIds = new Set(S.multiDragStart.origPositions.map(o => o.id));
          S.CN.forEach(cn2 => { if (!S.multiSel.has(cn2.id) && (_selIds.has(cn2.fromElId) && _selIds.has(cn2.toElId))) cn2._origPath = JSON.parse(JSON.stringify(cn2.path)); });
          S.dragging = true; S.dragEl = null;
        } else { S.multiSel.clear(); S.dragging = true; S.dragEl = el; S.dragOff = { x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y }; selectEl(el.id); }
        render();
      }
    });

    g.querySelectorAll('.td').forEach(tdEl => {
      tdEl.addEventListener('mousedown', ev => {
        if (S.mode !== 'connect') return; ev.stopPropagation();
        const lcx = parseFloat(tdEl.dataset.lcx), lcy = parseFloat(tdEl.dataset.lcy), circuit = tdEl.dataset.circuit ? parseInt(tdEl.dataset.circuit) : null, wp = termWorldPos(el, lcx, lcy);
        if (!S.connStart) { S.connStart = el.id; S.connPts = [{ x: wp.x, y: wp.y }]; S.connFromEl = el.id; S.connFromTerm = { cx: lcx, cy: lcy }; S.connFromCircuit = circuit; S.connToEl = null; S.connToTerm = null; S.connToCircuit = null; toast('Terminal START — click pe planșă sau alt terminal', 'ac'); }
        else { S.connToEl = el.id; S.connToTerm = { cx: lcx, cy: lcy }; S.connToCircuit = circuit; S.connPts.push({ x: wp.x, y: wp.y }); finalConn(); }
      });
    });

    if (el.type === 'meter') {
      const tn = g.querySelector('.bmpt-txt');
      if (tn) tn.addEventListener('dblclick', ev => { ev.stopPropagation(); const nv = prompt('Editează BMPT:', el.bmptText || ''); if (nv !== null) { saveState('edit bmpt'); el.bmptText = nv; render(); } });
    }
    _NL.appendChild(g);
  });

  if (S.vdOverlayOn && S.vdResults) renderVDOverlay();
  if (S.flowAnimOn) renderFlowLayer();
}
