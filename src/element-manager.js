// ElectroCAD Pro v12 — Element CRUD Manager
import { EL, CN, sel, multiSel, mode, pendType, setPendType, connStart, connPts, connFromEl, connFromTerm, connToEl, connToTerm, connFromCircuit, connToCircuit, dragging, dragEl, dragOff, view, panS, calibPts, tempCalibLenPx, exportRectStart, arrPts, draggingBg, bgData, pxPerMeter, vxDrag, vxConn, vxIdx, selRectStart, panning, GL, svgEl, VP, saveState, setEL, setCN, setSel, setClipboard } from './state.js';
import { uid, sn, termWorldPos, nextLbl, toast, getLineIntersection, calcPathLen, applyView } from './utils.js';
import { sym, symW, symH } from './elements.js';
import { render, renderBg, callbacks } from './renderer.js';
import { setStat } from './ui.js';

// ========== Add Element ==========

export function addElem(x, y) {
  if (!pendType) return;
  saveState('add ' + pendType);
  const CM = {
    ptab_1t: '#1a6ba0', ptab_2t: '#1a6ba0', trafo: '#1a6ba0',
    firida_e2_4: '#555', firida_e3_4: '#555', firida_e3_0: '#555',
    cd4: '#555', cd5: '#555', cd8: '#555',
    meter: '#555', stalp_se4: '#555', stalp_se10: '#555', stalp_cs: '#555',
    stalp_sc10002: '#555', stalp_sc10005: '#555', stalp_rotund: '#555', stalp_rotund_special: '#555',
    separator: '#0a5', separator_mt: '#0a5', manson: '#555', priza_pamant: '#555',
    text: '#dce8f5', rect: '#00cfff', circle: '#00cfff',
    bara_mt: '#c07000', celula_linie_mt: '#c07000', celula_trafo_mt: '#c07000',
    ptab_mono: '#c07000', bara_statie_mt: '#cc2200'
  };
  const el = { id: uid(), type: pendType, x: sn(x), y: sn(y), label: nextLbl(pendType), color: CM[pendType] || '#555', fillColor: 'none', rotation: 0, scale: 1 };
  if (pendType === 'stalp_cs') el.cs_fuse = 100;
  if (pendType === 'meter') el.bmptText = '';
  if (pendType === 'firida_e2_4') el.fuses = new Array(6).fill(true);
  if (pendType === 'firida_e3_4') el.fuses = new Array(7).fill(true);
  if (pendType === 'firida_e3_0') el.fuses = new Array(3).fill(true);
  if (pendType === 'ptab_1t') el.fuses = new Array(10).fill(true);
  if (pendType === 'ptab_2t') el.fuses = new Array(21).fill(true);
  if (pendType === 'cd4') el.fuses = new Array(5).fill(true);
  if (pendType === 'cd5') el.fuses = new Array(6).fill(true);
  if (pendType === 'cd8') el.fuses = new Array(9).fill(true);
  if (pendType === 'ptab_mono') el.celule = [
    { tip: 'L', label: 'Cel.L1', curent: '400A', tensiune: '20kV', stare: true },
    { tip: 'T', label: 'Cel.T1', curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare: true },
    { tip: 'T', label: 'Cel.T2', curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare: true },
    { tip: 'L', label: 'Cel.L2', curent: '400A', tensiune: '20kV', stare: true }
  ];
  if (pendType === 'bara_statie_mt') { el.nrCircuit = '2'; el.numeStatie = 'STATIE 20kV'; el.lungime = 200; el.terminale = [{ pct: 25, label: '' }, { pct: 50, label: '' }, { pct: 75, label: '' }]; }
  if (pendType === 'rect') { el.width = 100; el.height = 100; el.lineType = 'solid'; el.strokeWidth = 2; el.fillColor = 'none'; el.label = ''; }
  if (pendType === 'circle') { el.r = 50; el.lineType = 'solid'; el.strokeWidth = 2; el.fillColor = 'none'; el.label = ''; }
  EL.push(el);
  render();
  callbacks.selectEl?.(el.id);
  setPendType();
  callbacks.setMode?.('select');
  callbacks.updateStat?.();
}

// ========== Delete Selection ==========

export function delSel() {
  if (!sel && multiSel.size === 0) return;
  saveState('delete');
  if (multiSel.size > 0) {
    const ids = new Set(multiSel);
    setEL(EL.filter(e => !ids.has(e.id)));
    setCN(CN.filter(c => !ids.has(c.id) && !ids.has(c.fromElId) && !ids.has(c.toElId)));
    multiSel.clear();
    setSel(null);
  } else {
    setEL(EL.filter(e => e.id !== sel));
    setCN(CN.filter(c => c.id !== sel && c.fromElId !== sel && c.toElId !== sel));
    setSel(null);
  }
  render();
  callbacks.updateProps?.();
  callbacks.updateStat?.();
}

// ========== Update Selected Element Property ==========

export function updSel(k, v) {
  if (!sel) return;
  const o = EL.find(e => e.id === sel) || CN.find(c => c.id === sel);
  if (o) { o[k] = v; render(); }
}

// ========== Rotate Selected Element ==========

export function rotateSel(d) {
  const e = EL.find(x => x.id === sel);
  if (e) {
    setRotationAbs((e.rotation || 0) + d);
  }
}

export function setRotationAbs(v) {
  const e = EL.find(x => x.id === sel);
  if (e) {
    e.rotation = (v % 360 + 360) % 360;
    updateConnectedCables(e);
    render();
    const rn = document.getElementById('p-rot-num'), rs = document.getElementById('p-rot-slider');
    if (rn && rn.value != e.rotation) rn.value = e.rotation;
    if (rs && rs.value != e.rotation) rs.value = e.rotation;
  }
}

// ========== Update Connected Cables ==========

export function updateConnectedCables(el) {
  CN.forEach(cn => {
    if (cn.fromElId === el.id && cn.fromTerm && cn.path.length >= 1) {
      const wp = termWorldPos(el, cn.fromTerm.cx, cn.fromTerm.cy);
      cn.path[0] = { x: wp.x, y: wp.y };
    }
    if (cn.toElId === el.id && cn.toTerm && cn.path.length >= 1) {
      const wp = termWorldPos(el, cn.toTerm.cx, cn.toTerm.cy);
      cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y };
    }
    if (cn.from === el.id && !cn.fromElId && cn.path.length >= 1) {
      const { terms } = sym(el);
      const fp = cn.path[0];
      let best = Infinity, bw = null;
      terms.forEach(t => {
        const wp = termWorldPos(el, t.cx, t.cy);
        const d = Math.hypot(wp.x - fp.x, wp.y - fp.y);
        if (d < best) { best = d; bw = wp; }
      });
      if (bw && best < 80) cn.path[0] = { x: bw.x, y: bw.y };
    }
    if (cn.to === el.id && !cn.toElId && cn.path.length >= 1) {
      const { terms } = sym(el);
      const lp = cn.path[cn.path.length - 1];
      let best = Infinity, bw = null;
      terms.forEach(t => {
        const wp = termWorldPos(el, t.cx, t.cy);
        const d = Math.hypot(wp.x - lp.x, wp.y - lp.y);
        if (d < best) { best = d; bw = wp; }
      });
      if (bw && best < 80) cn.path[cn.path.length - 1] = { x: bw.x, y: bw.y };
    }
  });
}

// ========== Check if Connection is Active ==========

export function isConnectionActive(el, term) {
  if (!el || !term || !el.fuses) return true;
  const { terms } = sym(el);
  const idx = terms.findIndex(t => Math.abs(t.cx - term.cx) < 1 && Math.abs(t.cy - term.cy) < 1);
  if (idx === -1) return true;
  if (el.type.startsWith('firida_')) return el.fuses[idx] !== false;
  if (el.type === 'ptab_1t') { if (idx >= 2 && idx <= 9) return el.fuses[idx] !== false; }
  if (el.type === 'ptab_2t') { if (idx >= 2 && idx <= 9) return el.fuses[idx] !== false; if (idx >= 12 && idx <= 19) return el.fuses[12 + (idx - 10)] !== false; }
  return true;
}

// ========== Toggle Fuse ==========

export function toggleFuse(elId, idx, val) {
  const el = EL.find(x => x.id === elId);
  if (!el || !el.fuses) return;
  saveState('toggle fuse');
  el.fuses[idx] = val;
  render();
}

export function cdAllFuses(elId, num, val) {
  const el = EL.find(x => x.id === elId);
  if (!el || !el.fuses) return;
  saveState('all fuses');
  for (let i = 1; i <= num; i++) el.fuses[i] = val;
  render();
}



// ========== Start Place Mode ==========

export function startPlace(t) {
  setPendType(t);
  setMode('place');
  document.body.classList.add('place-active');
  document.getElementById('btn-sel')?.classList.remove('active');
  toast('Click pe planșă pentru a plasa', 'ac');
  setStat();
}

// ========== Toggle Submenu ==========

export function toggleSub(id) {
  const e = document.getElementById(id);
  if (e) e.style.display = e.style.display === 'flex' ? 'none' : 'flex';
}

// ========== Copy Selection ==========

export function copyEl() {
  const toCopyEls = EL.filter(e => multiSel.has(e.id) || sel === e.id);
  const toCopyCns = CN.filter(c => multiSel.has(c.id) || sel === c.id);
  if (toCopyEls.length === 0 && toCopyCns.length === 0) { toast('Selectează ceva', 'ac'); return; }
  setClipboard({ els: JSON.parse(JSON.stringify(toCopyEls)), cns: JSON.parse(JSON.stringify(toCopyCns)) });
  toast('⧉ ' + (toCopyEls.length + toCopyCns.length) + ' obiecte copiate!', 'ok');
}

// ========== Paste Selection ==========

export function pasteEl() {
  if (!clipboard || ((clipboard.els||[]).length === 0 && (clipboard.cns||[]).length === 0)) { toast('Clipboard gol', 'ac'); return; }
  saveState('paste');
  multiSel.clear();
  setSel(null);
  const idMap = {};
  (clipboard.els||[]).forEach(orig => {
    const n = JSON.parse(JSON.stringify(orig));
    const newId = uid() + Math.floor(Math.random()*1000);
    idMap[orig.id] = newId;
    n.id = newId;
    n.x = (n.x||0) + 40;
    n.y = (n.y||0) + 40;
    if (n.label && !['rect','circle','polyline'].includes(n.type)) n.label = n.label + '_cp';
    EL.push(n);
    multiSel.add(newId);
  });
  (clipboard.cns||[]).forEach(orig => {
    const n = JSON.parse(JSON.stringify(orig));
    const newId = uid() + Math.floor(Math.random()*1000);
    idMap[orig.id] = newId;
    n.id = newId;
    if (n.path && Array.isArray(n.path)) n.path.forEach(p => { p.x += 40; p.y += 40; });
    if (n.fromElId && idMap[n.fromElId]) n.fromElId = idMap[n.fromElId]; else n.fromElId = null;
    if (n.toElId && idMap[n.toElId]) n.toElId = idMap[n.toElId]; else n.toElId = null;
    if (n.from && idMap[n.from]) n.from = idMap[n.from]; else n.from = null;
    n.label = n.label ? n.label + '_cp' : 'C' + (CN.length + 1);
    CN.push(n);
    multiSel.add(newId);
  });
  if (multiSel.size === 1) { sel = Array.from(multiSel)[0]; multiSel.clear(); }
  render();
  updateProps();
  updateStat();
  toast('⎘ ' + ((clipboard.els||[]).length + (clipboard.cns||[]).length) + ' obiecte lipite!', 'ok');
}

// ========== Get Circuit Chain ==========

export function getCircuitChain(cdElId, circuitNum) {
  const results = { cables: [], elements: [], totalLength: 0, totalConsumatori: 0, branches: [] };
  const visitedCables = new Set();
  const seedCables = CN.filter(cn => (cn.fromElId === cdElId && cn.fromCircuit === circuitNum) || (cn.toElId === cdElId && cn.toCircuit === circuitNum));
  if (!seedCables.length) return results;
  const traceGroup = seedCables[0].circuitGroup || 'C' + circuitNum;

  function getOtherEnd(cn, fromId) {
    if (cn.fromElId === fromId) return cn.toElId;
    if (cn.toElId === fromId) return cn.fromElId;
    return cn.from || null;
  }

  function dfs(elId, cameFromCable, accLen, accCons, pathLabels, depth) {
    if (depth > 50) return;
    const currentEl = EL.find(x => x.id === elId);
    if (currentEl) {
      const currentTerm = (cameFromCable && cameFromCable.fromElId === elId) ? cameFromCable.fromTerm : ((cameFromCable && cameFromCable.toElId === elId) ? cameFromCable.toTerm : null);
      if (!isConnectionActive(currentEl, currentTerm)) return;
    }

    const cables = CN.filter(cn => cn.id !== (cameFromCable ? cameFromCable.id : null) && (cn.fromElId === elId || cn.toElId === elId || cn.from === elId));
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
      const nextElId = getOtherEnd(cn, elId);
      const nextEl = nextElId ? EL.find(x => x.id === nextElId) : null;
      const cLen = parseFloat(cn.length) || 0;
      const newLen = accLen + cLen;
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


// ========== Populate Renderer Callbacks ==========

callbacks.addElem = addElem;
callbacks.delSel = delSel;
callbacks.updSel = updSel;
callbacks.setRotationAbs = setRotationAbs;
callbacks.updateConnectedCables = updateConnectedCables;
callbacks.toggleFuse = toggleFuse;
callbacks.cdAllFuses = cdAllFuses;
