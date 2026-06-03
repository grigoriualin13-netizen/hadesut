import { S } from './state.js';
import { MAX_UNDO } from './config.js';
import { uid, sn, toast, calcPathLen, termWorldPos, setMode, updateStat } from './utils.js';
import { sym, nextLbl } from './elements.js';
import { render, renderFlowLayer } from './renderer.js';
import { updateProps, runVD } from './ui.js';

// ── Pending MT phase for next connection ──────────────────────────────────
let _pendingFaza = null;
let _pendingSecMT = 70;

const FAZA_COL = { R: '#ef4444', S: '#22c55e', T: '#3b82f6' };

export function setMTConnect(faza) {
  _pendingFaza  = faza;
  _pendingSecMT = parseInt(document.getElementById('mt-sec-sel')?.value) || 70;
  setMode('connect');
  // Highlight active phase button
  ['R', 'S', 'T'].forEach(f => {
    const btn = document.getElementById(`btn-mt-${f}`);
    if (!btn) return;
    btn.style.borderColor  = f === faza ? FAZA_COL[f] : 'var(--border2)';
    btn.style.background   = f === faza ? FAZA_COL[f] + '22' : '';
  });
  toast(`Connect MT — Faza ${faza} · OL-AL ${_pendingSecMT}mm²`, 'ok');
}

export function saveState(lbl) {
  S.undoStack.push({ lbl, E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
  if (S.undoStack.length > MAX_UNDO) S.undoStack.shift();
  S.redoStack = [];
}

export function undo() {
  if (!S.undoStack.length) { toast('Nimic de anulat', 'ac'); return; }
  S.redoStack.push({ E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
  const s = S.undoStack.pop();
  S.EL = JSON.parse(s.E); S.CN = JSON.parse(s.C);
  S.sel = null; render(); updateProps(); updateStat(); toast('↩ Undo', 'ok');
}

export function redo() {
  if (!S.redoStack.length) { toast('Nimic de refăcut', 'ac'); return; }
  S.undoStack.push({ E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
  const s = S.redoStack.pop();
  S.EL = JSON.parse(s.E); S.CN = JSON.parse(s.C);
  S.sel = null; render(); updateProps(); updateStat(); toast('↪ Redo', 'ok');
}

export function copyEl() {
  const toCopyEls = S.EL.filter(e => S.multiSel.has(e.id) || S.sel === e.id);
  const toCopyCns = S.CN.filter(c => S.multiSel.has(c.id) || S.sel === c.id);
  if (toCopyEls.length === 0 && toCopyCns.length === 0) { toast('Selectează ceva', 'ac'); return; }
  S.clipboard = { els: JSON.parse(JSON.stringify(toCopyEls)), cns: JSON.parse(JSON.stringify(toCopyCns)) };
  toast(`⧉ ${toCopyEls.length + toCopyCns.length} obiecte copiate!`, 'ok');
}

export function pasteEl() {
  if (!S.clipboard || ((S.clipboard.els || []).length === 0 && (S.clipboard.cns || []).length === 0)) {
    toast('Clipboard gol', 'ac'); return;
  }
  saveState('paste'); S.multiSel.clear(); S.sel = null; const idMap = {};
  (S.clipboard.els || []).forEach(orig => {
    const n = JSON.parse(JSON.stringify(orig)), newId = uid() + Math.floor(Math.random() * 1000);
    idMap[orig.id] = newId; n.id = newId; n.x = (n.x || 0) + 40; n.y = (n.y || 0) + 40;
    if (n.label && !['rect', 'circle', 'polyline'].includes(n.type)) n.label = n.label + '_cp';
    S.EL.push(n); S.multiSel.add(newId);
  });
  (S.clipboard.cns || []).forEach(orig => {
    const n = JSON.parse(JSON.stringify(orig)), newId = uid() + Math.floor(Math.random() * 1000);
    idMap[orig.id] = newId; n.id = newId;
    if (n.path && Array.isArray(n.path)) n.path.forEach(p => { p.x += 40; p.y += 40; });
    if (n.fromElId && idMap[n.fromElId]) n.fromElId = idMap[n.fromElId]; else n.fromElId = null;
    if (n.toElId && idMap[n.toElId]) n.toElId = idMap[n.toElId]; else n.toElId = null;
    if (n.from && idMap[n.from]) n.from = idMap[n.from]; else n.from = null;
    n.label = n.label ? n.label + '_cp' : `C${S.CN.length + 1}`;
    S.CN.push(n); S.multiSel.add(newId);
  });
  if (S.multiSel.size === 1) { S.sel = Array.from(S.multiSel)[0]; S.multiSel.clear(); }
  render(); updateProps(); updateStat();
  toast(`⎘ ${(S.clipboard.els || []).length + (S.clipboard.cns || []).length} obiecte lipite!`, 'ok');
}

export function addElem(x, y) {
  if (!S.pendType) return; saveState('add ' + S.pendType);
  const CM = {
    ptab_1t: '#1a6ba0', ptab_2t: '#1a6ba0', trafo: '#1a6ba0',
    firida_e2_4: '#555', firida_e3_4: '#555', firida_e3_0: '#555',
    cd4: '#555', cd5: '#555', cd8: '#555', meter: '#555',
    stalp_se4: '#555', stalp_se10: '#555', stalp_cs: '#555',
    stalp_sc10002: '#555', stalp_sc10005: '#555', stalp_rotund: '#555',
    stalp_rotund_special: '#555', separator: '#0a5', separator_mt: '#0a5',
    manson: '#555', priza_pamant: '#555', text: '#dce8f5',
    rect: '#00cfff', circle: '#00cfff',
    bara_mt: '#c07000', celula_linie_mt: '#c07000', celula_trafo_mt: '#c07000',
    ptab_mono: '#c07000', bara_statie_mt: '#cc2200'
  };
  const el = {
    id: uid(), type: S.pendType, x: sn(x), y: sn(y),
    label: nextLbl(S.pendType), color: CM[S.pendType] || '#555',
    fillColor: 'none', rotation: 0, scale: 1, _layer: 'proiectat'
  };
  if (S.pendType === 'stalp_cs') el.cs_fuse = 100;
  if (S.pendType === 'meter') el.bmptText = '';
  if (S.pendType === 'firida_e2_4') el.fuses = new Array(6).fill(true);
  if (S.pendType === 'firida_e3_4') el.fuses = new Array(7).fill(true);
  if (S.pendType === 'firida_e3_0') el.fuses = new Array(3).fill(true);
  if (S.pendType === 'ptab_1t') el.fuses = new Array(10).fill(true);
  if (S.pendType === 'ptab_2t') el.fuses = new Array(21).fill(true);
  if (S.pendType === 'cd4') el.fuses = new Array(5).fill(true);
  if (S.pendType === 'cd5') el.fuses = new Array(6).fill(true);
  if (S.pendType === 'cd8') el.fuses = new Array(9).fill(true);
  if (S.pendType === 'ptab_mono') el.celule = [
    { tip: 'L', label: 'Cel.L1', curent: '400A', tensiune: '20kV', stare: true },
    { tip: 'T', label: 'Cel.T1', curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare: true },
    { tip: 'T', label: 'Cel.T2', curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare: true },
    { tip: 'L', label: 'Cel.L2', curent: '400A', tensiune: '20kV', stare: true }
  ];
  if (S.pendType === 'bara_statie_mt') {
    el.nrCircuit = '2'; el.numeStatie = 'STAȚIE 20kV'; el.lungime = 200;
    el.terminale = [{ pct: 25, label: '' }, { pct: 50, label: '' }, { pct: 75, label: '' }];
  }
  if (S.pendType === 'rect') { el.width = 100; el.height = 100; el.lineType = 'solid'; el.strokeWidth = 2; el.fillColor = 'none'; el.label = ''; }
  if (S.pendType === 'circle') { el.r = 50; el.lineType = 'solid'; el.strokeWidth = 2; el.fillColor = 'none'; el.label = ''; }
  S.EL.push(el); render(); selectEl(el.id); S.pendType = null; setMode('select'); updateStat();
}

export function delSel() {
  if (!S.sel && S.multiSel.size === 0) return; saveState('delete');
  if (S.multiSel.size > 0) {
    const ids = new Set(S.multiSel);
    S.EL = S.EL.filter(e => !ids.has(e.id));
    S.CN = S.CN.filter(c => !ids.has(c.id) && !ids.has(c.fromElId) && !ids.has(c.toElId));
    S.multiSel.clear(); S.sel = null;
  } else {
    S.EL = S.EL.filter(e => e.id !== S.sel);
    S.CN = S.CN.filter(c => c.id !== S.sel && c.fromElId !== S.sel && c.toElId !== S.sel);
    S.sel = null;
  }
  render(); updateProps(); updateStat();
}

export function updSel(k, v) {
  if (!S.sel) return;
  const o = S.EL.find(e => e.id === S.sel) || S.CN.find(c => c.id === S.sel);
  if (o) { o[k] = v; render(); }
}

export function rotateSel(d) {
  const e = S.EL.find(x => x.id === S.sel);
  if (e) setRotationAbs((e.rotation || 0) + d);
}

export function setRotationAbs(v) {
  const e = S.EL.find(x => x.id === S.sel);
  if (e) {
    e.rotation = (v % 360 + 360) % 360;
    updateConnectedCables(e); render();
    const rn = document.getElementById('p-rot-num'), rs = document.getElementById('p-rot-slider');
    if (rn && rn.value != e.rotation) rn.value = e.rotation;
    if (rs && rs.value != e.rotation) rs.value = e.rotation;
  }
}

export function selectEl(id) { S.sel = id; render(); updateProps(); }

// ── MT Span placement ──────────────────────────────────────────────────────

let _mtSpanPrevId = null;
let _mtSpanType   = 'stalp_mt_se5t';
let _mtSpanSec    = 70;

export function startMTSpan() {
  _mtSpanPrevId = null;
  _mtSpanType   = document.getElementById('mt-stalp-type')?.value || 'stalp_mt_se5t';
  _mtSpanSec    = parseInt(document.getElementById('mt-sec-sel')?.value) || 70;
  setMode('mt_span');
  toast('Tronson MT — clic: stâlp 1, clic: stâlp 2 … Esc stop', 'ok');
}

export function addMTSpanFrom(fromPoleId) {
  const el = S.EL.find(e => e.id === fromPoleId);
  if (!el) return;
  _mtSpanPrevId = fromPoleId;
  _mtSpanType   = el.type;
  _mtSpanSec    = parseInt(document.getElementById('mt-sec-sel')?.value) || 70;
  setMode('mt_span');
  toast(`Prelungire MT de la ${el.label || el.type} — clic: stâlp nou. Esc stop`, 'ok');
}

export function placeMTSpanAt(x, y) {
  saveState('mt span');
  const newEl = {
    id: uid(), type: _mtSpanType,
    x: sn(x), y: sn(y), rotation: 0, scale: 1,
    label: nextLbl(_mtSpanType),
    color: '#555', fillColor: 'none', stare: 'existent', _layer: 'proiectat',
  };
  S.EL.push(newEl);

  if (_mtSpanPrevId) {
    const prev = S.EL.find(e => e.id === _mtSpanPrevId);
    if (prev) _connectMTPoles(prev, newEl, _mtSpanSec);
  }

  _mtSpanPrevId = newEl.id;
  selectEl(newEl.id);
  render(); updateStat();
}

function _connectMTPoles(fromEl, toEl, sec) {
  const dx = toEl.x - fromEl.x, dy = toEl.y - fromEl.y;
  const horiz = Math.abs(dx) >= Math.abs(dy);
  let ftx, fty, ttx, tty;
  if (horiz) {
    ftx = dx > 0 ?  22 : -22;  fty = 0;
    ttx = dx > 0 ? -22 :  22;  tty = 0;
  } else {
    fty = dy > 0 ?  22 : -22;  ftx = 0;
    tty = dy > 0 ? -22 :  22;  ttx = 0;
  }
  const wp0 = termWorldPos(fromEl, ftx, fty);
  const wp1 = termWorldPos(toEl,   ttx, tty);
  const lenM = parseFloat((Math.hypot(dx, dy) / (S.pxPerMeter || 5)).toFixed(1));
  const idx  = S.CN.length;

  ['R', 'S', 'T'].forEach((faza, i) => {
    S.CN.push({
      id: uid(),
      fromElId: fromEl.id, fromTerm: { cx: ftx, cy: fty },
      toElId:   toEl.id,   toTerm:   { cx: ttx, cy: tty },
      path:     [{ x: wp0.x, y: wp0.y }, { x: wp1.x, y: wp1.y }],
      label:    `L${idx + i + 1}`, length: lenM,
      color:    FAZA_COL[faza], fillColor: 'none',
      lineType: 'solid', strokeWidth: 2.5,
      tipConductor: 'OL-AL', sectiune: sec,
      tipRetea: 'Trifazat', putereConc: 0, faza,
    });
  });
}

// ──────────────────────────────────────────────────────────────────────────

export function updateConnectedCables(el) {
  S.CN.forEach(cn => {
    if (cn.fromElId === el.id && cn.fromTerm && cn.path.length >= 1) {
      const wp = termWorldPos(el, cn.fromTerm.cx, cn.fromTerm.cy);
      cn.path[0] = { x: wp.x, y: wp.y };
    }
    if (cn.toElId === el.id && cn.toTerm && cn.path.length >= 1) {
      const wp = termWorldPos(el, cn.toTerm.cx, cn.toTerm.cy);
      cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y };
    }
    if (cn.from === el.id && !cn.fromElId && cn.path.length >= 1) {
      const { terms } = sym(el); const fp = cn.path[0]; let best = Infinity, bw = null;
      terms.forEach(t => { const wp = termWorldPos(el, t.cx, t.cy); const d = Math.hypot(wp.x - fp.x, wp.y - fp.y); if (d < best) { best = d; bw = wp; } });
      if (bw && best < 80) cn.path[0] = { x: bw.x, y: bw.y };
    }
    if (cn.to === el.id && !cn.toElId && cn.path.length >= 1) {
      const { terms } = sym(el); const lp = cn.path[cn.path.length - 1]; let best = Infinity, bw = null;
      terms.forEach(t => { const wp = termWorldPos(el, t.cx, t.cy); const d = Math.hypot(wp.x - lp.x, wp.y - lp.y); if (d < best) { best = d; bw = wp; } });
      if (bw && best < 80) cn.path[cn.path.length - 1] = { x: bw.x, y: bw.y };
    }
  });
}

export function finalConn() {
  if (!S.connStart || S.connPts.length < 2) return; saveState('connect');
  let cableName = `C${S.CN.length + 1}`;
  const circSrc = S.connFromCircuit ? S.connFromEl : (S.connToCircuit ? S.connToEl : null);
  const circNum = S.connFromCircuit || S.connToCircuit;
  if (circSrc && circNum) {
    const cdEl = S.EL.find(x => x.id === circSrc);
    if (cdEl) cableName = `${cdEl.label || 'CD'}-C${circNum}`;
  }
  const autoLenM = parseFloat((calcPathLen(S.connPts) / S.pxPerMeter).toFixed(1));
  const isMT = !!_pendingFaza;
  S.CN.push({
    id: uid(), fromElId: S.connFromEl, fromTerm: S.connFromTerm, toElId: S.connToEl, toTerm: S.connToTerm,
    path: [...S.connPts], label: cableName, length: autoLenM,
    color: isMT ? FAZA_COL[_pendingFaza] : '#ef4444', fillColor: 'none',
    lineType: 'solid', strokeWidth: isMT ? 2.5 : 2,
    fromCircuit: S.connFromCircuit, toCircuit: S.connToCircuit,
    tipConductor: isMT ? 'OL-AL'    : 'Clasic Al',
    sectiune:     isMT ? _pendingSecMT : 16,
    tipRetea: 'Trifazat', putereConc: 0, _layer: 'proiectat',
    ...(isMT ? { faza: _pendingFaza } : {}),
  });
  S.connStart = null; S.connPts = []; S.connFromEl = null; S.connFromTerm = null;
  S.connToEl = null; S.connToTerm = null; S.connFromCircuit = null; S.connToCircuit = null;
  setMode('select'); render(); updateStat();
}

// ── Existent / Proiectat layer system ────────────────────────────────────────

export function fixeazaExistent() {
  saveState('fixează existent');
  S.EL.forEach(el => {
    el._layer = 'existent';
    el._exPos = { x: el.x, y: el.y, rotation: el.rotation || 0, scale: el.scale || 1 };
    if (el.points) el._exPoints = JSON.parse(JSON.stringify(el.points));
  });
  S.CN.forEach(cn => {
    cn._layer = 'existent';
    cn._exPath = JSON.parse(JSON.stringify(cn.path));
  });
  render();
  toast('Toate elementele marcate ca Existente — pozițiile sunt înghețate', 'ok');
}

export function setSchemaMode(mode) {
  S.schemaMode = mode;
  const btnE = document.getElementById('btn-mode-existent');
  const btnP = document.getElementById('btn-mode-proiectat');
  if (btnE) btnE.classList.toggle('on', mode === 'existent');
  if (btnP) btnP.classList.toggle('on', mode === 'proiectat');
  if (mode === 'existent') { S.multiSel.clear(); S.sel = null; setMode('select'); }
  render();
  toast(mode === 'existent' ? 'Mod Existent — rețeaua actuală (read-only)' : 'Mod Proiectat — toate elementele vizibile', 'ok');
}

window.baraStatieTerUpd = function (elId, idx, key, val) {
  const el = S.EL.find(x => x.id === elId); if (!el || !el.terminale) return;
  saveState('edit terminal bara');
  el.terminale[idx][key] = val;
  updateConnectedCables(el); render(); updateProps();
};

window.baraStatieTerAdd = function (elId) {
  const el = S.EL.find(x => x.id === elId); if (!el) return;
  saveState('add terminal bara');
  if (!el.terminale) el.terminale = [];
  const used = el.terminale.map(t => t.pct).sort((a, b) => a - b);
  let newPct = 50;
  if (used.length > 0) {
    const gaps = [];
    if (used[0] > 5) gaps.push({ start: 0, end: used[0] });
    for (let i = 0; i < used.length - 1; i++) if (used[i + 1] - used[i] > 10) gaps.push({ start: used[i], end: used[i + 1] });
    if (used[used.length - 1] < 95) gaps.push({ start: used[used.length - 1], end: 100 });
    if (gaps.length > 0) {
      const best = gaps.reduce((a, b) => (b.end - b.start) > (a.end - a.start) ? b : a);
      newPct = Math.round((best.start + best.end) / 2);
    }
  }
  el.terminale.push({ pct: newPct, label: '' });
  render(); updateProps();
};

window.baraStatieTerDel = function (elId, idx) {
  const el = S.EL.find(x => x.id === elId); if (!el || !el.terminale) return;
  if (el.terminale.length <= 1) { toast('Minim un terminal!', 'ac'); return; }
  saveState('del terminal bara');
  el.terminale.splice(idx, 1);
  render(); updateProps();
};

window.ptabMonoUpdCell = function (elId, idx, key, val) {
  const el = S.EL.find(x => x.id === elId); if (!el || !el.celule) return;
  saveState('edit celula');
  el.celule[idx][key] = val;
  render(); updateProps();
};

window.ptabMonoAddCell = function (elId, tip) {
  const el = S.EL.find(x => x.id === elId); if (!el) return;
  saveState('add celula');
  if (!el.celule) el.celule = [];
  const n = el.celule.filter(c => c.tip === tip).length + 1;
  if (tip === 'T') el.celule.push({ tip: 'T', label: `T${n}`, curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare: true });
  else el.celule.push({ tip: 'L', label: `L${n}`, curent: '400A', tensiune: '20kV', stare: true });
  render(); updateProps(); updateStat();
};

window.ptabMonoDelCell = function (elId, idx) {
  const el = S.EL.find(x => x.id === elId); if (!el || !el.celule) return;
  if (el.celule.length <= 1) { toast('Minim o celulă!', 'ac'); return; }
  saveState('del celula');
  el.celule.splice(idx, 1);
  render(); updateProps(); updateStat();
};

window.ptabMonoMoveCell = function (elId, idx, dir) {
  const el = S.EL.find(x => x.id === elId); if (!el || !el.celule) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= el.celule.length) return;
  saveState('move celula');
  const tmp = el.celule[idx]; el.celule[idx] = el.celule[newIdx]; el.celule[newIdx] = tmp;
  render(); updateProps();
};

window.toggleFuse = function (id, idx, state) {
  saveState('toggle fuse');
  const el = S.EL.find(x => x.id === id);
  if (el) {
    if (!el.fuses) {
      if (el.type === 'firida_e2_4') el.fuses = new Array(6).fill(true);
      if (el.type === 'firida_e3_4') el.fuses = new Array(7).fill(true);
      if (el.type === 'firida_e3_0') el.fuses = new Array(3).fill(true);
      if (el.type === 'ptab_1t') el.fuses = new Array(10).fill(true);
      if (el.type === 'ptab_2t') el.fuses = new Array(21).fill(true);
      if (el.type === 'cd4') el.fuses = new Array(5).fill(true);
      if (el.type === 'cd5') el.fuses = new Array(6).fill(true);
      if (el.type === 'cd8') el.fuses = new Array(9).fill(true);
    }
    el.fuses[idx] = state; render();
    if (S.flowAnimOn) renderFlowLayer();
    if (document.getElementById('vd-panel').style.display === 'flex' && document.getElementById('vd-src').value) runVD();
  }
};

window.cdAllFuses = function (id, np, state) {
  saveState('toggle all fuses');
  const el = S.EL.find(x => x.id === id); if (!el) return;
  if (!el.fuses) el.fuses = new Array(np + 1).fill(true);
  for (let i = 1; i <= np; i++) el.fuses[i] = state;
  render();
  if (S.flowAnimOn) renderFlowLayer();
  updateProps();
  toast(state ? '✅ Toate circuitele închise' : '🔴 Toate circuitele deschise', state ? 'ok' : 'ac');
};
