import { S } from './state.js';
import { svgPt, sn, toast, applyView, termWorldPos, setMode, updateStat } from './utils.js';
import { getDxfSnapPoint } from './dxf-import.js';
import { isConnectionActive } from './elements.js';
import { render, renderFlowLayer, toggleFlowAnim } from './renderer.js';
import { saveState, addElem, delSel, rotateSel, copyEl, pasteEl, finalConn, updateConnectedCables, selectEl, placeMTSpanAt } from './element-manager.js';
import { updateProps } from './ui.js';
import { doExportPNG, doExportPDF, doExportSVG } from './export.js';
import { save, saveAsNew } from './project.js';

// ── DXF snap indicator ───────────────────────────────────────────────────────
let _dxfSnap = null;

function _renderDxfSnap() {
  const layer = document.getElementById('SNAP');
  if (!layer) return;
  if (!_dxfSnap) { layer.innerHTML = ''; return; }
  const { x, y, type } = _dxfSnap;
  const col = type === 'vertex' ? '#44aacc' : '#ffaa44';
  const r = 7;
  layer.innerHTML =
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="none" stroke="${col}" stroke-width="1.5" opacity="0.95"/>` +
    `<line x1="${(x-r).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x+r).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${col}" stroke-width="1.2" opacity="0.95"/>` +
    `<line x1="${x.toFixed(1)}" y1="${(y-r).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y+r).toFixed(1)}" stroke="${col}" stroke-width="1.2" opacity="0.95"/>`;
}

// ── Measure tool (multi-point polyline) ──────────────────────────────────────
let _mpts = [];

function _renderMeasure(cursorPt = null) {
  const layer = document.getElementById('MEAS');
  if (!layer) return;
  if (!_mpts.length) { layer.innerHTML = ''; return; }
  const dark = !S.lightMode;
  const mC  = dark ? '#ffd700' : '#b85000';
  const ppm = S.pxPerMeter || 5;
  const all = cursorPt ? [..._mpts, cursorPt] : _mpts;
  let html  = '';

  if (all.length >= 2)
    html += `<polyline points="${all.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"
               fill="none" stroke="${mC}" stroke-width="1.6" stroke-dasharray="7,4"/>`;

  for (const p of _mpts)
    html += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${mC}" opacity="0.9"/>`;
  if (cursorPt)
    html += `<circle cx="${cursorPt.x.toFixed(1)}" cy="${cursorPt.y.toFixed(1)}" r="3.5" fill="${mC}" opacity="0.5"/>`;

  let total = 0;
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[i], p1 = all[i + 1];
    const ddx = p1.x - p0.x, ddy = p1.y - p0.y;
    const dist = Math.hypot(ddx, ddy);
    total += dist;
    const segM = (dist / ppm).toFixed(2);
    const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
    const ux = dist > 0 ? ddx / dist : 1, uy = dist > 0 ? ddy / dist : 0;
    const lx = (mx - uy * 16).toFixed(1), ly = (my + ux * 16).toFixed(1);
    html += `<text x="${lx}" y="${ly}" font-size="11" fill="${mC}"
               font-family="JetBrains Mono,monospace" font-weight="700" text-anchor="middle"
               paint-order="stroke" stroke="#000a" stroke-width="2.5"
               stroke-linecap="round">${segM} m</text>`;
  }

  if (all.length > 2) {
    const last = all[all.length - 1];
    html += `<text x="${last.x.toFixed(1)}" y="${(last.y - 16).toFixed(1)}" font-size="13" fill="${mC}"
               font-family="JetBrains Mono,monospace" font-weight="700" text-anchor="middle"
               paint-order="stroke" stroke="#000a" stroke-width="3"
               stroke-linecap="round">Σ ${(total / ppm).toFixed(2)} m</text>`;
  }

  layer.innerHTML = html;
}

export function toggleMeasure() {
  if (S.mode === 'measure') {
    setMode('select'); _mpts = []; _renderMeasure(); _dxfSnap = null; _renderDxfSnap();
  } else {
    setMode('measure'); _mpts = []; _renderMeasure();
    toast('Click → adaugă punct. Click dreapta / Esc → finalizează.', 'ok');
  }
  const btn = document.getElementById('btn-measure');
  if (btn) btn.classList.toggle('active', S.mode === 'measure');
}

export function onDn(e) {
  const pt = svgPt(e);
  if (e.button === 2) {
    if (S.mode === 'measure') {
      if (_mpts.length >= 2) {
        const ppm = S.pxPerMeter || 5;
        let total = 0;
        for (let i = 0; i < _mpts.length - 1; i++) total += Math.hypot(_mpts[i+1].x - _mpts[i].x, _mpts[i+1].y - _mpts[i].y);
        toast(`Σ ${(total / ppm).toFixed(2)} m (${_mpts.length - 1} segmente)`, 'ok');
      }
      setMode('select'); _mpts = []; _renderMeasure(); _dxfSnap = null; _renderDxfSnap();
      const btn = document.getElementById('btn-measure'); if (btn) btn.classList.remove('active');
      return;
    }
    if (S.mode === 'connect' && S.connStart) finalConn();
    else if (S.mode === 'draw_poly') {
      if (S.arrPts.length >= 2) {
        saveState('polyline');
        S.EL.push({ id: Date.now() + Math.floor(Math.random() * 99999), type: 'polyline', x: 0, y: 0, points: [...S.arrPts], color: '#00cfff', arrowEnd: true, arrowStart: false, lineType: 'solid', strokeWidth: 2.5 });
      }
      S.arrPts = []; setMode('select'); render();
    } else setMode('select');
    return;
  }
  if (e.button === 1) { e.preventDefault(); S.panning = true; S.panS = { x: e.clientX, y: e.clientY }; return; }
  if (S.mode === 'export_box') { S.exportRectStart = { x: pt.x, y: pt.y }; return; }
  if (S.mode === 'calibrate') {
    S.calibPts.push({ x: pt.x, y: pt.y });
    if (S.calibPts.length === 1) toast('Click Punctul 2...', 'ac');
    if (S.calibPts.length === 2) {
      S.tempCalibLenPx = Math.hypot(S.calibPts[1].x - S.calibPts[0].x, S.calibPts[1].y - S.calibPts[0].y);
      if (S.tempCalibLenPx < 1) { toast('Distanță prea mică. Anulat.', 'w'); import('./renderer.js').then(m => m.closeCalib()); return; }
      document.getElementById('calib-modal').style.display = 'flex';
      document.getElementById('calib-input').value = '';
      setTimeout(() => document.getElementById('calib-input').focus(), 50);
    }
    return;
  }
  if (S.mode === 'place') { addElem(pt.x, pt.y); return; }
  if (S.mode === 'mt_span') { placeMTSpanAt(pt.x, pt.y); return; }
  if (S.mode === 'measure') {
    const snappedPt = _dxfSnap ? { x: _dxfSnap.x, y: _dxfSnap.y } : { x: pt.x, y: pt.y };
    _mpts.push(snappedPt);
    if (_mpts.length >= 2) {
      const ppm = S.pxPerMeter || 5;
      const last2 = _mpts.slice(-2);
      const segM = (Math.hypot(last2[1].x - last2[0].x, last2[1].y - last2[0].y) / ppm).toFixed(2);
      toast(`+${segM} m`, 'ok');
    }
    _renderMeasure();
    return;
  }
  if (S.mode === 'draw_poly') {
    S.arrPts.push({ x: sn(pt.x), y: sn(pt.y) });
    if (S.arrPts.length === 1) toast('Click stânga pt. puncte, click dreapta pt. finalizare', 'ac');
    return;
  }
  if (S.mode === 'connect' && S.connStart) {
    let cur;
    if (_dxfSnap) {
      cur = { x: _dxfSnap.x, y: _dxfSnap.y };
    } else {
      cur = { x: sn(pt.x), y: sn(pt.y) };
      if (S.orthoOn || S.shiftOn) {
        const last = S.connPts[S.connPts.length - 1];
        cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: sn(pt.x), y: last.y } : { x: last.x, y: sn(pt.y) };
      }
    }
    S.connPts.push(cur); return;
  }
  const tg = e.target.closest('g.el'), hb = e.target.closest('.hb');
  if (!tg && !hb && !S.bgData.locked && S.mode === 'select' && S.bgData.url) {
    if (pt.x >= S.bgData.x && pt.x <= S.bgData.x + S.bgData.w && pt.y >= S.bgData.y && pt.y <= S.bgData.y + S.bgData.h) {
      S.draggingBg = true; S.dragOff = { x: pt.x - S.bgData.x, y: pt.y - S.bgData.y }; return;
    }
  }
  if (tg || hb) return;
  if (S.mode === 'select') {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      S.selRectStart = { x: pt.x, y: pt.y }; S.selRect = null; S.panning = false;
    } else { S.multiSel.clear(); S.sel = null; updateProps(); S.selRectStart = null; S.panning = true; }
    S.panS = { x: e.clientX, y: e.clientY }; render();
  }
}

export function onMv(e) {
  const pt = svgPt(e);
  document.getElementById('stxy').textContent = `X:${Math.round(pt.x)} Y:${Math.round(pt.y)}`;
  // Clear snap indicator when not actively drawing a cable
  if (!(S.mode === 'connect' && S.connStart)) {
    if (_dxfSnap) { _dxfSnap = null; _renderDxfSnap(); }
  }
  if (S.mode === 'export_box' && S.exportRectStart) {
    const dx = pt.x - S.exportRectStart.x, dy = pt.y - S.exportRectStart.y;
    const er = document.getElementById('export-rect');
    er.setAttribute('display', 'block'); er.setAttribute('x', Math.min(S.exportRectStart.x, pt.x));
    er.setAttribute('y', Math.min(S.exportRectStart.y, pt.y));
    er.setAttribute('width', Math.abs(dx)); er.setAttribute('height', Math.abs(dy)); return;
  }
  if (S.draggingBg) {
    S.bgData.x = pt.x - S.dragOff.x; S.bgData.y = pt.y - S.dragOff.y;
    const img = document.getElementById('html-bg-img');
    if (img) { img.style.left = S.bgData.x + 'px'; img.style.top = S.bgData.y + 'px'; }
    return;
  }
  if (S.mode === 'measure') {
    if (S.dxfData) {
      _dxfSnap = getDxfSnapPoint(pt.x, pt.y, 20 / (S.view.s || 1));
    } else {
      _dxfSnap = null;
    }
    _renderDxfSnap();
    if (_mpts.length > 0) _renderMeasure(_dxfSnap ? { x: _dxfSnap.x, y: _dxfSnap.y } : pt);
    return;
  }
  if (S.mode === 'calibrate' && S.calibPts.length === 1) {
    const tp = document.getElementById('tpoly'); tp.style.display = 'block';
    tp.setAttribute('points', `${S.calibPts[0].x},${S.calibPts[0].y} ${pt.x},${pt.y}`); return;
  }
  if (S.mode === 'draw_poly' && S.arrPts.length > 0) {
    const tp = document.getElementById('tpoly'); tp.style.display = 'block';
    let cur = { x: pt.x, y: pt.y };
    if (S.orthoOn || S.shiftOn) { const last = S.arrPts[S.arrPts.length - 1]; cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: pt.y }; }
    tp.setAttribute('points', [...S.arrPts, cur].map(p => `${p.x},${p.y}`).join(' ')); return;
  }
  if (S.mode === 'connect' && S.connStart) {
    const tp = document.getElementById('tpoly'); tp.style.display = 'block';
    let cur = { x: pt.x, y: pt.y };
    const tdHov = e.target.closest('.td');
    if (tdHov) {
      const pg = tdHov.closest('g.el');
      if (pg) {
        const pe = S.EL.find(x => x.id === parseInt(pg.dataset.eid));
        if (pe) { const lcx = parseFloat(tdHov.dataset.lcx), lcy = parseFloat(tdHov.dataset.lcy); const wp = termWorldPos(pe, lcx, lcy); cur = { x: wp.x, y: wp.y }; }
      }
      _dxfSnap = null;
    } else {
      // DXF snap — priority over ortho
      if (S.dxfData) {
        const snap = getDxfSnapPoint(pt.x, pt.y, 20 / (S.view.s || 1));
        _dxfSnap = snap;
        if (snap) cur = { x: snap.x, y: snap.y };
      } else {
        _dxfSnap = null;
      }
      // Ortho/shift only when no DXF snap active
      if (!_dxfSnap && (S.orthoOn || S.shiftOn)) {
        const last = S.connPts[S.connPts.length - 1];
        cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: sn(pt.y) };
      }
    }
    _renderDxfSnap();
    tp.setAttribute('points', [...S.connPts, cur].map(p => `${p.x},${p.y}`).join(' ')); return;
  }
  if (S.dragging && S.dragEl) {
    let nx = sn(pt.x - S.dragOff.x), ny = sn(pt.y - S.dragOff.y);
    const GL = document.getElementById('GL'); GL.innerHTML = '';
    S.EL.forEach(e2 => {
      if (e2.id === S.dragEl.id) return;
      if (Math.abs(nx - e2.x) < 8) { nx = e2.x; GL.innerHTML += `<line x1="${e2.x}" y1="${ny - 200}" x2="${e2.x}" y2="${ny + 200}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`; }
      if (Math.abs(ny - e2.y) < 8) { ny = e2.y; GL.innerHTML += `<line x1="${nx - 200}" y1="${e2.y}" x2="${nx + 200}" y2="${e2.y}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`; }
    });
    S.dragEl.x = nx; S.dragEl.y = ny; updateConnectedCables(S.dragEl); render(); return;
  }
  if (S.dragging && !S.dragEl && S.multiDragStart) {
    const dx = sn(pt.x - S.multiDragStart.mouseX), dy = sn(pt.y - S.multiDragStart.mouseY);
    if (S.multiDragStart.origConnPaths) {
      S.multiDragStart.origConnPaths.forEach(orig => {
        const cn = S.CN.find(x => x.id === orig.id);
        if (cn) { for (let i = 0; i < cn.path.length; i++) { cn.path[i].x = orig.path[i].x + dx; cn.path[i].y = orig.path[i].y + dy; } }
      });
    }
    S.multiDragStart.origPositions.forEach(orig => { const el = S.EL.find(x => x.id === orig.id); if (el) { el.x = orig.x + dx; el.y = orig.y + dy; } });
    const selIds = new Set(S.multiDragStart.origPositions.map(o => o.id));
    S.CN.forEach(cn => {
      if (S.multiSel.has(cn.id)) return;
      const fromSel = selIds.has(cn.fromElId), toSel = selIds.has(cn.toElId);
      if (fromSel && toSel) {
        if (!cn._origPath) cn._origPath = JSON.parse(JSON.stringify(cn.path));
        for (let i = 0; i < cn.path.length; i++) { cn.path[i].x = cn._origPath[i].x + dx; cn.path[i].y = cn._origPath[i].y + dy; }
      } else if (fromSel || toSel) {
        if (cn.fromElId) { const fromEl = S.EL.find(x => x.id === cn.fromElId); if (fromEl && cn.fromTerm) { const wp = termWorldPos(fromEl, cn.fromTerm.cx, cn.fromTerm.cy); cn.path[0] = { x: wp.x, y: wp.y }; } }
        if (cn.toElId) { const toEl = S.EL.find(x => x.id === cn.toElId); if (toEl && cn.toTerm) { const wp = termWorldPos(toEl, cn.toTerm.cx, cn.toTerm.cy); cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y }; } }
      }
    });
    render(); return;
  }
  if (S.vxDrag && S.vxConn) {
    if (S.vxConn.type === 'polyline') S.vxConn.points[S.vxIdx] = { x: pt.x, y: pt.y };
    else S.vxConn.path[S.vxIdx] = { x: pt.x, y: pt.y };
    render(); return;
  }
  if (S.selRectStart && !S.dragging && !S.panning) {
    const dx = pt.x - S.selRectStart.x, dy = pt.y - S.selRectStart.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      S.selRect = { x1: Math.min(S.selRectStart.x, pt.x), y1: Math.min(S.selRectStart.y, pt.y), x2: Math.max(S.selRectStart.x, pt.x), y2: Math.max(S.selRectStart.y, pt.y) };
      const sr = document.getElementById('sel-rect');
      sr.setAttribute('display', 'block'); sr.setAttribute('x', S.selRect.x1); sr.setAttribute('y', S.selRect.y1);
      sr.setAttribute('width', S.selRect.x2 - S.selRect.x1); sr.setAttribute('height', S.selRect.y2 - S.selRect.y1); return;
    }
  }
  if (S.panning) { S.view.x += e.clientX - S.panS.x; S.view.y += e.clientY - S.panS.y; S.panS = { x: e.clientX, y: e.clientY }; applyView(); }
}

export function onUp(e) {
  if (S.draggingBg) { S.draggingBg = false; return; }
  if (S.dragging) { const GL = document.getElementById('GL'); if (GL) GL.innerHTML = ''; }
  if (S.mode === 'export_box' && S.exportRectStart) {
    const pt = svgPt(e);
    const minX = Math.min(S.exportRectStart.x, pt.x), minY = Math.min(S.exportRectStart.y, pt.y);
    const maxX = Math.max(S.exportRectStart.x, pt.x), maxY = Math.max(S.exportRectStart.y, pt.y);
    document.getElementById('export-rect').setAttribute('display', 'none'); S.exportRectStart = null;
    if (maxX - minX > 10 && maxY - minY > 10) {
      const bounds = { minX, minY, maxX, maxY }, type = S.pendExport; setMode('select');
      if (type === 'png') doExportPNG(bounds);
      if (type === 'pdf') doExportPDF(bounds);
      if (type === 'svg') doExportSVG(bounds);
    } else { toast('Selecție prea mică. Export anulat.', 'w'); setMode('select'); }
    return;
  }
  if (S.selRect) {
    document.getElementById('sel-rect').setAttribute('display', 'none');
    S.EL.forEach(el => { if (el.x >= S.selRect.x1 && el.x <= S.selRect.x2 && el.y >= S.selRect.y1 && el.y <= S.selRect.y2) S.multiSel.add(el.id); });
    S.CN.forEach(cn => { const inRect = cn.path.some(p => p.x >= S.selRect.x1 && p.x <= S.selRect.x2 && p.y >= S.selRect.y1 && p.y <= S.selRect.y2); if (inRect) S.multiSel.add(cn.id); });
    if (S.multiSel.size > 0) { S.sel = null; toast(S.multiSel.size + ' elem. selectate', 'ac'); }
    S.selRect = null; render(); updateProps();
  }
  if (S.multiDragStart) {
    S.multiDragStart.origPositions.forEach(orig => { const el = S.EL.find(x => x.id === orig.id); if (el) updateConnectedCables(el); });
  }
  S.CN.forEach(cn => { delete cn._origPath; });
  S.selRectStart = null; S.panning = false; S.dragging = false; S.dragEl = null; S.multiDragStart = null; S.vxDrag = false; S.vxConn = null;
  render();
  if (!(S.mode === 'connect' && S.connStart) && !(S.mode === 'calibrate' && S.calibPts.length === 1) && !(S.mode === 'draw_poly'))
    document.getElementById('tpoly').style.display = 'none';
}

export function getCircuitChain(cdElId, circuitNum) {
  const results = { cables: [], elements: [], totalLength: 0, totalConsumatori: 0, branches: [] };
  const visitedCables = new Set();
  const seedCables = S.CN.filter(cn =>
    (cn.fromElId === cdElId && cn.fromCircuit === circuitNum) ||
    (cn.toElId === cdElId && cn.toCircuit === circuitNum)
  );
  if (!seedCables.length) return results;
  const traceGroup = seedCables[0].circuitGroup || `C${circuitNum}`;

  function getOtherEnd(cn, fromId) {
    if (cn.fromElId === fromId) return cn.toElId;
    if (cn.toElId === fromId) return cn.fromElId;
    return cn.from || null;
  }

  function dfs(elId, cameFromCable, accLen, accCons, pathLabels, depth) {
    if (depth > 50) return;
    const currentEl = S.EL.find(x => x.id === elId);
    if (currentEl) {
      const currentTerm = (cameFromCable && cameFromCable.fromElId === elId) ? cameFromCable.fromTerm :
        (cameFromCable && cameFromCable.toElId === elId) ? cameFromCable.toTerm : null;
      if (!isConnectionActive(currentEl, currentTerm)) return false;
    }
    const cables = S.CN.filter(cn => cn.id !== (cameFromCable ? cameFromCable.id : null) && (cn.fromElId === elId || cn.toElId === elId || cn.from === elId));
    const nextCables = cables.filter(cn => {
      if (visitedCables.has(cn.id)) return false;
      if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circuitNum.toString()) return false;
      if ((cn.fromElId === cdElId && cn.fromCircuit !== circuitNum) || (cn.toElId === cdElId && cn.toCircuit !== circuitNum)) return false;
      const outTerm = (cn.fromElId === elId) ? cn.fromTerm : (cn.toElId === elId) ? cn.toTerm : null;
      if (currentEl && !isConnectionActive(currentEl, outTerm)) return false;
      return true;
    });
    if (nextCables.length === 0) { results.branches.push({ path: [...pathLabels], length: accLen, consumatori: accCons }); return; }
    nextCables.forEach(cn => {
      visitedCables.add(cn.id);
      if (!results.cables.find(x => x.id === cn.id)) { results.cables.push(cn); results.totalLength += parseFloat(cn.length) || 0; }
      const nextElId = getOtherEnd(cn, elId), nextEl = nextElId ? S.EL.find(x => x.id === nextElId) : null;
      const cLen = parseFloat(cn.length) || 0, newLen = accLen + cLen;
      let cons = 0;
      if (nextEl) {
        if (nextEl.cons_dict) {
          if (nextEl.cons_dict[traceGroup] !== undefined) cons = parseInt(nextEl.cons_dict[traceGroup]) || 0;
          else if (nextEl.cons_dict['Implicit'] !== undefined) cons = parseInt(nextEl.cons_dict['Implicit']) || 0;
        } else { cons = parseInt(nextEl.consumatori) || 0; }
      }
      const newCons = accCons + cons;
      if (nextEl && !results.elements.find(x => x.id === nextEl.id)) { results.elements.push(nextEl); results.totalConsumatori += cons; }
      const newPath = [...pathLabels, (nextEl ? nextEl.label : cn.label) || '?'];
      let shouldContinue = true;
      if (nextEl) {
        const childTerm = (cn.fromElId === nextElId) ? cn.fromTerm : (cn.toElId === nextElId) ? cn.toTerm : null;
        if (!isConnectionActive(nextEl, childTerm)) shouldContinue = false;
      }
      if (nextElId && shouldContinue) dfs(nextElId, cn, newLen, newCons, newPath, depth + 1);
      else results.branches.push({ path: newPath, length: newLen, consumatori: newCons });
    });
  }
  dfs(cdElId, null, 0, 0, [], 0);
  return results;
}

export function initKeyboard() {
  window.addEventListener('keydown', e => {
    S.shiftOn = e.shiftKey;
    const ae = document.activeElement;
    const inp = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && !inp) {
      if (e.key === 'z') { e.preventDefault(); import('./element-manager.js').then(m => m.undo()); return; }
      if (e.key === 'y') { e.preventDefault(); import('./element-manager.js').then(m => m.redo()); return; }
      if (e.key === 'c') { e.preventDefault(); copyEl(); return; }
      if (e.key === 'v') { e.preventDefault(); pasteEl(); return; }
      if (e.key === 's' && e.shiftKey) { e.preventDefault(); saveAsNew(); return; }
      if (e.key === 's') { e.preventDefault(); save(); return; }
    }
    if (!inp) {
      if (e.key === 'Delete' || e.key === 'Backspace') delSel();
      if (e.key === 'Escape') { S.multiSel.clear(); S.sel = null; setMode('select'); render(); updateProps(); _mpts = []; _renderMeasure(); _dxfSnap = null; _renderDxfSnap(); }
      if (e.key === 's') setMode('select');
      if (e.key === 'c') setMode('connect');
      if (e.key === 'r') rotateSel(90);
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); S.multiSel.clear(); S.EL.forEach(el => S.multiSel.add(el.id)); S.sel = null; render(); updateProps(); }
    }
  });
  window.addEventListener('keyup', e => { S.shiftOn = e.shiftKey; });
}

export function setMultiFlow(dir) {
  saveState('flux multiplu');
  S.CN.forEach(c => { if (S.multiSel.has(c.id)) c.flowDir = dir || undefined; });
  renderFlowLayer();
  render();
  const cnt = [...S.multiSel].filter(id => S.CN.find(c => c.id === id)).length;
  const msg = dir === 'fwd' ? `▶ Flux normal pe ${cnt} cabluri` :
    dir === 'rev' ? `◀ Flux invers pe ${cnt} cabluri` : 'Animație flux oprită';
  toast(msg, 'ok');
  if (dir && !S.flowAnimOn) toggleFlowAnim();
}
