// ElectroCAD Pro v12 — Interaction & Event Handlers (minimal, will be filled in step 8)

// Module-level persistent variables (not in state.js)
let selRect = null;
import { EL, CN, sel, multiSel, mode, connStart, connPts, connFromEl, connFromTerm, connToEl, connToTerm, connFromCircuit, connToCircuit, dragging, dragEl, dragOff, multiDragStart, vxDrag, vxConn, vxIdx, shiftOn, orthoOn, panning, panS, calibPts, tempCalibLenPx, exportRectStart, selRectStart, arrPts, draggingBg, dragOff as bgDragOff, bgData, pxPerMeter, saveState, setMode as _setMode, setSel as _setSel, setConnStart as _setConnStart, setConnPts as _setConnPts, setConnFromEl as _setConnFromEl, setConnFromTerm as _setConnFromTerm, setConnToEl as _setConnToEl, setConnToTerm as _setConnToTerm, setConnFromCircuit as _setConnFromCircuit, setConnToCircuit as _setConnToCircuit, setArrPts as _setArrPts, setPanning as _setPanning, setPanS as _setPanS, setDragging as _setDragging, setDragEl as _setDragEl, setDragOff as _setDragOff, setMultiDragStart as _setMultiDragStart, setVxDrag as _setVxDrag, setVxConn as _setVxConn, setVxIdx as _setVxIdx, setShiftOn as _setShiftOn, setOrthoOn as _setOrthoOn, setCalibPts as _setCalibPts, setTempCalibLenPx as _setTempCalibLenPx, setExportRectStart as _setExportRectStart, setDraggingBg as _setDraggingBg, setSelRectStart as _setSelRectStart, setSnapOn as _setSnapOn, setClipboard as _setClipboard } from './state.js';
import { svgPt, toast, uid, termWorldPos, sn, calcPathLen } from './utils.js';
import { sym } from './elements.js';
import { render, renderBg, callbacks } from './renderer.js';

// ========== Mode Management ==========

export function setMode(m) {
  _setMode(m);
  document.body.className = m === 'select' ? '' : 'mode-' + m;
  const cw = document.getElementById('cw');
  if (cw) cw.style.cursor = m === 'connect' ? 'crosshair' : m === 'place' ? 'copy' : m === 'draw_poly' ? 'crosshair' : m === 'calibrate' ? 'crosshair' : m === 'export_box' ? 'crosshair' : 'default';
  const stm = document.getElementById('stm');
  if (stm) stm.textContent = m === 'select' ? 'SELECT' : m === 'place' ? 'PLACE' : m === 'connect' ? 'CONNECT' : m === 'draw_poly' ? 'POLY' : m === 'calibrate' ? 'CALIB' : m === 'export_box' ? 'EXPORT' : m.toUpperCase();
}

// ========== Element Selection ==========

export function selectEl(id) {
  _setSel(id);
  render();
  callbacks.updateProps?.();
}

// ========== Connection Finalization ==========

export function finalConn() {
  if (!connStart || connPts.length < 2) return;
  saveState('connect');
  let cableName = `C${CN.length + 1}`;
  const circSrc = connFromCircuit ? connFromEl : (connToCircuit ? connToEl : null);
  const circNum = connFromCircuit || connToCircuit;
  if (circSrc && circNum) {
    const cdEl = EL.find(x => x.id === circSrc);
    if (cdEl) cableName = `${cdEl.label || 'CD'}-C${circNum}`;
  }
  const autoLenM = parseFloat((calcPathLen(connPts) / pxPerMeter).toFixed(1));
  CN.push({
    id: uid(), fromElId: connFromEl, fromTerm: connFromTerm,
    toElId: connToEl, toTerm: connToTerm,
    path: [...connPts], label: cableName, length: autoLenM,
    color: '#ef4444', fillColor: 'none', lineType: 'solid', strokeWidth: 2,
    fromCircuit: connFromCircuit, toCircuit: connToCircuit,
    tipConductor: 'Clasic Al', sectiune: 16, tipRetea: 'Trifazat', putereConc: 0
  });
  _setConnStart(null); _setConnPts([]); _setConnFromEl(null); _setConnFromTerm(null);
  _setConnToEl(null); _setConnToTerm(null); _setConnFromCircuit(null); _setConnToCircuit(null);
  setMode('select');
  render();
  updateStat();
}

// ========== Update Props Panel (placeholder, will be moved from index.html in step 10) ==========

export function updateProps() {
  // To be implemented in ui.js (step 10)
  // For now, just a stub that tries to call the real one if it exists
  if (typeof window._updateProps === 'function') window._updateProps();
}

// ========== Update Stats (placeholder, will be moved from index.html in step 10) ==========

export function updateStat() {
  const ste = document.getElementById('ste');
  const stc = document.getElementById('stc');
  if (ste) ste.textContent = EL.length + ' elem';
  if (stc) stc.textContent = CN.length + ' conn';
}

// ========== Save State (imported from state.js) ==========

export { saveState } from './state.js';

// ========== Mouse Event Handlers ==========

export function onDn(e) {
  const pt = svgPt(e);
  if (e.button === 2) {
    if (mode === 'connect' && connStart) callbacks.finalConn?.();
    else if (mode === 'draw_poly') {
      if (arrPts.length >= 2) {
        saveState('polyline');
        EL.push({ id: uid(), type: 'polyline', x: 0, y: 0, points: [...arrPts], color: '#00cfff', arrowEnd: true, arrowStart: false, lineType: 'solid', strokeWidth: 2.5 });
      }
      _setArrPts([]);
      callbacks.setMode?.('select');
      render();
    } else { callbacks.setMode?.('select'); }
    return;
  }
  if (e.button === 1) { e.preventDefault(); _setPanning(true); _setPanS({ x: e.clientX, y: e.clientY }); return; }
  if (mode === 'export_box') { _setExportRectStart({ x: pt.x, y: pt.y }); return; }
  if (mode === 'calibrate') {
    calibPts.push({ x: pt.x, y: pt.y });
    if (calibPts.length === 1) { toast('Click Punctul 2...', 'ac'); }
    if (calibPts.length === 2) {
      _setTempCalibLenPx(Math.hypot(calibPts[1].x - calibPts[0].x, calibPts[1].y - calibPts[0].y));
      if (tempCalibLenPx < 1) { toast('Distanță prea mică. Anulat.', 'w'); callbacks.closeCalib?.(); return; }
      document.getElementById('calib-modal').style.display = 'flex';
      document.getElementById('calib-input').value = '';
      setTimeout(() => document.getElementById('calib-input').focus(), 50);
    }
    return;
  }
  if (mode === 'place') { if (typeof addElem !== 'undefined') addElem(pt.x, pt.y); else if (window.addElem) window.addElem(pt.x, pt.y); return; }
  if (mode === 'draw_poly') {
    arrPts.push({ x: sn(pt.x), y: sn(pt.y) });
    if (arrPts.length === 1) toast('Click stânga pt. puncte, click dreapta pt. finalizare', 'ac');
    return;
  }
  if (mode === 'connect' && connStart) {
    let cur = { x: sn(pt.x), y: sn(pt.y) };
    if (orthoOn || shiftOn) {
      const last = connPts[connPts.length - 1];
      cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: sn(pt.x), y: last.y } : { x: last.x, y: sn(pt.y) };
    }
    connPts.push(cur);
    return;
  }
  const tg = e.target.closest('g.el'), hb = e.target.closest('.hb');
  if (!tg && !hb && !bgData.locked && mode === 'select' && bgData.url) {
    if (pt.x >= bgData.x && pt.x <= bgData.x + bgData.w && pt.y >= bgData.y && pt.y <= bgData.y + bgData.h) {
      _setDraggingBg(true);
      _setDragOff({ x: pt.x - bgData.x, y: pt.y - bgData.y });
      return;
    }
  }
  if (tg || hb) return;
  if (mode === 'select') {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      _setSelRectStart({ x: pt.x, y: pt.y });
      selRect = null;
      _setPanning(false);
    } else {
      multiSel.clear();
      _setSel(null);
      callbacks.updateProps?.();
      _setSelRectStart(null);
      _setPanning(true);
    }
    _setPanS({ x: e.clientX, y: e.clientY });
    render();
  }
}

export function onMv(e) {
  const pt = svgPt(e);
  const stxy = document.getElementById('stxy');
  if (stxy) stxy.textContent = `X:${Math.round(pt.x)} Y:${Math.round(pt.y)}`;
  if (mode === 'export_box' && exportRectStart) {
    const dx = pt.x - exportRectStart.x, dy = pt.y - exportRectStart.y;
    const er = document.getElementById('export-rect');
    er.setAttribute('display', 'block');
    er.setAttribute('x', Math.min(exportRectStart.x, pt.x));
    er.setAttribute('y', Math.min(exportRectStart.y, pt.y));
    er.setAttribute('width', Math.abs(dx));
    er.setAttribute('height', Math.abs(dy));
    return;
  }
  if (draggingBg) {
    bgData.x = pt.x - dragOff.x;
    bgData.y = pt.y - dragOff.y;
    const img = document.getElementById('html-bg-img');
    if (img) { img.style.left = bgData.x + 'px'; img.style.top = bgData.y + 'px'; }
    return;
  }
  if (mode === 'calibrate' && calibPts.length === 1) {
    const tp = document.getElementById('tpoly');
    tp.style.display = 'block';
    tp.setAttribute('points', `${calibPts[0].x},${calibPts[0].y} ${pt.x},${pt.y}`);
    return;
  }
  if (mode === 'draw_poly' && arrPts.length > 0) {
    const tp = document.getElementById('tpoly');
    tp.style.display = 'block';
    let cur = { x: pt.x, y: pt.y };
    if (orthoOn || shiftOn) {
      const last = arrPts[arrPts.length - 1];
      cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: pt.y };
    }
    tp.setAttribute('points', [...arrPts, cur].map(p => `${p.x},${p.y}`).join(' '));
    return;
  }
  if (mode === 'connect' && connStart) {
    const tp = document.getElementById('tpoly');
    tp.style.display = 'block';
    let cur = { x: pt.x, y: pt.y };
    const tdHov = e.target.closest('.td');
    if (tdHov) {
      const pg = tdHov.closest('g.el');
      if (pg) {
        const pe = EL.find(x => x.id === parseInt(pg.dataset.eid));
        if (pe) {
          const lcx = parseFloat(tdHov.dataset.lcx), lcy = parseFloat(tdHov.dataset.lcy);
          const wp = termWorldPos(pe, lcx, lcy);
          cur = { x: wp.x, y: wp.y };
        }
      }
    } else if (orthoOn || shiftOn) {
      const last = connPts[connPts.length - 1];
      cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: pt.y };
    }
    tp.setAttribute('points', [...connPts, cur].map(p => `${p.x},${p.y}`).join(' '));
    return;
  }
  if (dragging && dragEl) {
    let nx = sn(pt.x - dragOff.x), ny = sn(pt.y - dragOff.y);
    GL.innerHTML = '';
    EL.forEach(e2 => {
      if (e2.id === dragEl.id) return;
      if (Math.abs(nx - e2.x) < 8) { nx = e2.x; GL.innerHTML += `<line x1="${e2.x}" y1="${ny - 200}" x2="${e2.x}" y2="${ny + 200}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`; }
      if (Math.abs(ny - e2.y) < 8) { ny = e2.y; GL.innerHTML += `<line x1="${nx - 200}" y1="${e2.y}" x2="${nx + 200}" y2="${e2.y}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`; }
    });
    dragEl.x = nx; dragEl.y = ny;
    updateConnectedCables(dragEl);
    render();
    return;
  }
  if (dragging && !dragEl && multiDragStart) {
    const dx = sn(pt.x - multiDragStart.mouseX), dy = sn(pt.y - multiDragStart.mouseY);
    if (multiDragStart.origConnPaths) {
      multiDragStart.origConnPaths.forEach(orig => {
        const cn = CN.find(x => x.id === orig.id);
        if (cn) { for (let i = 0; i < cn.path.length; i++) { cn.path[i].x = orig.path[i].x + dx; cn.path[i].y = orig.path[i].y + dy; } }
      });
    }
    multiDragStart.origPositions.forEach(orig => {
      const el = EL.find(x => x.id === orig.id);
      if (el) { el.x = orig.x + dx; el.y = orig.y + dy; }
    });
    const selIds = new Set(multiDragStart.origPositions.map(o => o.id));
    CN.forEach(cn => {
      if (multiSel.has(cn.id)) return;
      const fromSel = selIds.has(cn.fromElId);
      const toSel = selIds.has(cn.toElId);
      if (fromSel && toSel) {
        if (!cn._origPath) cn._origPath = JSON.parse(JSON.stringify(cn.path));
        for (let i = 0; i < cn.path.length; i++) { cn.path[i].x = cn._origPath[i].x + dx; cn.path[i].y = cn._origPath[i].y + dy; }
      } else if (fromSel || toSel) {
        if (cn.fromElId) {
          const fromEl = EL.find(x => x.id === cn.fromElId);
          if (fromEl && cn.fromTerm) { const wp = termWorldPos(fromEl, cn.fromTerm.cx, cn.fromTerm.cy); cn.path[0] = { x: wp.x, y: wp.y }; }
        }
        if (cn.toElId) {
          const toEl = EL.find(x => x.id === cn.toElId);
          if (toEl && cn.toTerm) { const wp = termWorldPos(toEl, cn.toTerm.cx, cn.toTerm.cy); cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y }; }
        }
      }
    });
    render();
    return;
  }
  if (vxDrag && vxConn) {
    if (vxConn.type === 'polyline') vxConn.points[vxIdx] = { x: pt.x, y: pt.y };
    else vxConn.path[vxIdx] = { x: pt.x, y: pt.y };
    render();
    return;
  }
  if (selRectStart && !dragging && !panning) {
    const dx = pt.x - selRectStart.x, dy = pt.y - selRectStart.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      selRect = { x1: Math.min(selRectStart.x, pt.x), y1: Math.min(selRectStart.y, pt.y), x2: Math.max(selRectStart.x, pt.x), y2: Math.max(selRectStart.y, pt.y) };
      const sr = document.getElementById('sel-rect');
      sr.setAttribute('display', 'block');
      sr.setAttribute('x', selRect.x1);
      sr.setAttribute('y', selRect.y1);
      sr.setAttribute('width', selRect.x2 - selRect.x1);
      sr.setAttribute('height', selRect.y2 - selRect.y1);
      return;
    }
  }
  if (panning) {
    view.x += e.clientX - panS.x;
    view.y += e.clientY - panS.y;
    _setPanS({ x: e.clientX, y: e.clientY });
    applyView();
  }
}

export function onUp(e) {
  if (draggingBg) { _setDraggingBg(false); return; }
  if (dragging) GL.innerHTML = '';
  if (mode === 'export_box' && exportRectStart) {
    const pt = svgPt(e);
    const minX = Math.min(exportRectStart.x, pt.x), minY = Math.min(exportRectStart.y, pt.y);
    const maxX = Math.max(exportRectStart.x, pt.x), maxY = Math.max(exportRectStart.y, pt.y);
    document.getElementById('export-rect').setAttribute('display', 'none');
    _setExportRectStart(null);
    if (maxX - minX > 10 && maxY - minY > 10) {
      const bounds = { minX, minY, maxX, maxY }, type = pendExport;
      callbacks.setMode?.('select');
      if (type === 'png') callbacks.doExportPNG?.(bounds);
      if (type === 'pdf') callbacks.doExportPDF?.(bounds);
      if (type === 'svg') callbacks.doExportSVG?.(bounds);
    } else { toast('Selecție prea mică. Export anulat.', 'w'); callbacks.setMode?.('select'); }
    return;
  }
  if (selRect) {
    const sr = document.getElementById('sel-rect');
    sr.setAttribute('display', 'none');
    EL.forEach(el => { if (el.x >= selRect.x1 && el.x <= selRect.x2 && el.y >= selRect.y1 && el.y <= selRect.y2) multiSel.add(el.id); });
    CN.forEach(cn => {
      const inRect = cn.path.some(p => p.x >= selRect.x1 && p.x <= selRect.x2 && p.y >= selRect.y1 && p.y <= selRect.y2);
      if (inRect) multiSel.add(cn.id);
    });
    if (multiSel.size > 0) { _setSel(null); toast(multiSel.size + ' elem. selectate', 'ac'); }
    selRect = null;
    render();
    callbacks.updateProps?.();
  }
  if (multiDragStart) {
    multiDragStart.origPositions.forEach(orig => {
      const el = EL.find(x => x.id === orig.id);
      if (el) updateConnectedCables(el);
    });
  }
  CN.forEach(cn => { delete cn._origPath; });
  _setSelRectStart(null);
  _setPanning(false);
  _setDragging(false);
  _setDragEl(null);
  _setMultiDragStart(null);
  _setVxDrag(false);
  _setVxConn(null);
  render();
  if (!(mode === 'connect' && connStart) && !(mode === 'calibrate' && calibPts.length === 1) && !(mode === 'draw_poly')) {
    document.getElementById('tpoly').style.display = 'none';
  }
}

// ========== Toggle Snap/Ortho ==========

export function toggleSnap() {
  _setSnapOn(!snapOn);
  document.getElementById('btn-snap')?.classList.toggle('on', snapOn);
  toast(snapOn ? 'Snap ON' : 'Snap OFF', 'ac');
}

export function toggleOrtho() {
  _setOrthoOn(!orthoOn);
  document.getElementById('btn-ortho')?.classList.toggle('on', orthoOn);
  toast(orthoOn ? 'Ortho ON' : 'Ortho OFF', 'ac');
}

// Make event handlers available globally (for HTML event handlers)
if (typeof window !== 'undefined') {
  window.onDn = onDn;
  window.onMv = onMv;
  window.onUp = onUp;
  window.toggleSnap = toggleSnap;
  window.toggleOrtho = toggleOrtho;
}

// ========== Populate Renderer Callbacks ==========
// This avoids circular dependencies between renderer.js and interaction.js

callbacks.selectEl = selectEl;
callbacks.finalConn = finalConn;
callbacks.setMode = setMode;
// updateProps callback is set by ui.js (real implementation)
callbacks.updateStat = updateStat;
callbacks.saveState = saveState;
callbacks.closeCalib = () => {
  document.getElementById('calib-modal').style.display = 'none';
  callbacks.setMode?.('select');
  _setCalibPts([]);
  _setTempCalibLenPx(0);
  document.getElementById('tpoly').style.display = 'none';
};
