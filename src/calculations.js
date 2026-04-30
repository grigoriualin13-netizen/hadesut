// ElectroCAD Pro v12 — Electrical Calculations
import { R0_TABLES, KS_RURAL, KS_URBAN } from './config.js';

// ========== Reactance & Resistance ==========

// Get reactance X0 (Ω/km) based on conductor type and section
export function getX0(tipConductor, sectiune) {
  if (tipConductor.includes('Torsadat')) {
    const xt = {10:0.098, 16:0.098, 25:0.097, 35:0.089, 50:0.086, 70:0.085, 95:0.084, 120:0.083, 150:0.082};
    return xt[sectiune] || 0.090;
  }
  if (tipConductor.includes('Clasic')) return 0.320;
  const xc = {2.5:0.11, 4:0.11, 6:0.10, 10:0.09, 16:0.09, 25:0.08, 35:0.08, 50:0.08, 70:0.08, 95:0.08, 120:0.08, 150:0.08, 185:0.08, 240:0.08};
  return xc[sectiune] || 0.08;
}

// Get Ks coefficient (simultaneity factor) based on consumer count and area type
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

// Get resistance R0 (Ω/km) from table, with fallback to nearest lower section
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

// Calculate voltage drop per tronson (PE 132 formula)
// L_m: length (m), P_eff: effective power (kW), tipRetea: network type, sectiune: section (mm²)
export function calcDU_tronson(L_m, P_eff, tipRetea, sectiune) {
  if (!L_m || !P_eff || !sectiune) return 0;
  // FORMULA: ((P/2 + J + I) * D) / (E * factor)
  let factor = 46;  // Trifazat
  if (tipRetea === 'Bifazat') factor = 20;
  else if (tipRetea === 'Monofazat') factor = 7.7;
  return (P_eff * L_m) / (sectiune * factor);
}

// Cable resistance per meter (ρ = 0.029 Ω·mm²/m for Al)
export function cableRes(S) {
  const rho = 0.029;
  return { r: rho / S, x: 0.08 / 1000 };
}

// ========== Network Voltage Drop (PE 132) ==========

// Calculate VD for a network starting from a CD element
// This is a complex function that analyzes the network topology
export function calcNetworkVD(cdElId, Pc_abonat, tipAmplasare, forceKs) {
  // This function requires access to EL, CN, and vdResults from state
  // It will be implemented to work with imported state
  // For now, this is a placeholder that imports and uses state
  return null;
}

export function calcNetworkVD_ptab2t(cdElId, Pc_abonat, tipAmplasare, forceKs, tdNum) {
  // Similar to calcNetworkVD but for PTAB 2T configuration
  return null;
}

// ========== Voltage Drop UI Functions ==========

import { EL, CN, vdResults, vdOverlayOn, saveState, pxPerMeter, counters, view } from './state.js';
import { uid, toast, nextLbl, termWorldPos, calcPathLen, sn, applyView } from './utils.js';
import { sym, symW, symH } from './elements.js';
import { render, renderBg, renderFlowLayer, callbacks } from './renderer.js';

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

export function toggleLeg() {
  const p = document.getElementById('leg');
  p.classList.toggle('on');
  if (p.classList.contains('on')) buildLeg();
}

export function buildLeg() {
  const b = document.getElementById('leg-body'); if (!b) return;
  const counts = {}; EL.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
  const typeNames = {
    ptab_1t: 'PTAB 1T', ptab_2t: 'PTAB 2T', trafo: 'PT Aerian',
    firida_e2_4: 'Firidă E2-4', firida_e3_4: 'Firidă E3-4', firida_e3_0: 'Firidă E3-0',
    cd4: 'Cutie Distribuție 4P', cd5: 'CD 5P', cd8: 'CD 8P',
    meter: 'BMPT', stalp_se4: 'Stâlp SE4', stalp_se10: 'Stâlp SE10', stalp_cs: 'Stâlp cu CS',
    stalp_rotund: 'Stâlp Rotund', stalp_rotund_special: 'Stâlp Rotund Spec.',
    separator: 'Separator JT', separator_mt: 'Separator MT', manson: 'Manșon',
    priza_pamant: 'Priză de Pământ', rect: 'Pătrat', circle: 'Cerc', text: 'Text liber', polyline: 'Linie liberă',
    bara_mt: 'Bară Colectoare MT', celula_linie_mt: 'Celulă Linie MT', celula_trafo_mt: 'Celulă Transformator MT',
    ptab_mono: 'PTAb Monofilar MT', bara_statie_mt: 'Bară Stație MT'
  };
  let html = '<table class="lgt"><tr><th>Tip Element</th><th style="text-align:right">Cant.</th></tr>';
  for (const t in counts) {
    const name = typeNames[t] || t.toUpperCase();
    html += `<tr><td>${name}</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${counts[t]}</td></tr>`;
  }
  let cabLen = 0; CN.forEach(c => cabLen += parseFloat(c.length) || 0);
  html += `<tr><td>Conductoare / Cabluri</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${CN.length}<br><span style="font-size:7.5px;color:var(--text3)">${cabLen.toFixed(1)} m</span></td></tr>`;
  html += '</table>'; b.innerHTML = html;
}

export function toggleVD() {
  const p = document.getElementById('vd-panel');
  const showing = p.style.display === 'flex';
  p.style.display = showing ? 'none' : 'flex';
  if (!showing) {
    const sel = document.getElementById('vd-src'); sel.innerHTML = '';
    EL.filter(e => e.type.startsWith('cd') || e.type === 'ptab_1t').forEach(e => {
      const o = document.createElement('option'); o.value = e.id; o.textContent = e.label || e.type; sel.appendChild(o);
    });
    EL.filter(e => e.type === 'ptab_2t').forEach(e => {
      const o1 = document.createElement('option'); o1.value = e.id + '__td1'; o1.textContent = (e.label || 'PTAB') + ' — TD JT 1 (C1-C8)'; sel.appendChild(o1);
      const o2 = document.createElement('option'); o2.value = e.id + '__td2'; o2.textContent = (e.label || 'PTAB') + ' — TD JT 2 (C1-C8)'; sel.appendChild(o2);
    });
    if (!sel.options.length) sel.innerHTML = '<option value="">— niciun CD / PTAB —</option>';
    populateVDCircuits();
  }
}

export function populateVDCircuits() {
  const srcRaw = document.getElementById('vd-src')?.value;
  const circSel = document.getElementById('vd-circ');
  if (!circSel) return;
  circSel.innerHTML = '<option value="all">Toate circuitele</option>';
  if (!srcRaw) return;
  let cdId = parseInt(srcRaw.includes('__') ? srcRaw.split('__')[0] : srcRaw);
  if (!cdId) return;
  const circuits = new Set();
  CN.forEach(cn => {
    if (cn.fromElId === cdId || cn.toElId === cdId) {
      if (cn.circuitGroup) circuits.add(cn.circuitGroup);
      else if (cn.fromElId === cdId && cn.fromCircuit) circuits.add('C' + cn.fromCircuit);
      else if (cn.toElId === cdId && cn.toCircuit) circuits.add('C' + cn.toCircuit);
    }
  });
  circuits.forEach(c => {
    const o = document.createElement('option'); o.value = c; o.textContent = c; circSel.appendChild(o);
  });
}

export function runVD() {
  // Placeholder for VD calculation - references existing vdResults
  toast('Calculul căderii de tensiune...', 'ac');
  // The actual implementation would go here
  render();
}

export function toggleVDOverlay() {
  setVdOverlayOn(document.getElementById('vd-overlay')?.checked);
  if (vdOverlayOn && vdResults) renderVDOverlay();
  else document.getElementById('VD-OVL')?.remove();
}

export function renderVDOverlay() {
  let ovl = document.getElementById('VD-OVL');
  if (!ovl) { ovl = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ovl.id = 'VD-OVL'; window.VP?.appendChild(ovl); }
  ovl.innerHTML = '';
  if (!vdResults) return;
  // VD overlay rendering logic here
  render();
}

export function updateGenSrcUI() {
  const src = document.getElementById('gen-src')?.value;
  const isPTAB = src === 'ptab_1t' || src === 'ptab_2t';
  document.getElementById('gen-cd-row').style.display = isPTAB ? 'none' : 'flex';
  document.getElementById('gen-td-row').style.display = src === 'ptab_2t' ? 'flex' : 'none';
  document.getElementById('gen-plecari-lbl').textContent = isPTAB ? 'Circuite din tablou (ramuri)' : 'Câte Plecări (Ramuri)?';
  if (isPTAB) {
    document.getElementById('gen-plecari').max = 8;
    if (parseInt(document.getElementById('gen-plecari').value) > 8) document.getElementById('gen-plecari').value = 8;
  }
}

export function toggleAutoDraw() {
  const m = document.getElementById('gen-modal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
  if (m.style.display === 'flex') { document.getElementById('deriv-container').innerHTML = ''; updateGenSrcUI(); }
}

export function addDerivRow(parentContainer, depth) {
  const c = parentContainer || document.getElementById('deriv-container');
  depth = depth || 0;
  const id = Date.now() + Math.floor(Math.random() * 10000);
  const div = document.createElement('div');
  div.className = 'deriv-row'; div.dataset.depth = depth;
  div.style.display = 'flex'; div.style.flexDirection = 'column'; div.style.gap = '4px'; div.id = `deriv-${id}`;
  div.style.marginLeft = (depth * 16) + 'px';
  div.style.borderLeft = depth > 0 ? '2px solid var(--accent)' : '2px solid var(--accentg)';
  div.style.paddingLeft = '6px'; div.style.paddingTop = '4px'; div.style.paddingBottom = '4px';
  const isVertical = depth % 2 === 0;
  const dirOptions = isVertical
    ? '<option value="sus">Sus</option><option value="jos">Jos</option>'
    : '<option value="stanga">Stânga</option><option value="dreapta">Dreapta</option>';
  div.innerHTML = `
    <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
      <span style="font-size:7.5px;color:${depth === 0 ? 'var(--accentg)' : 'var(--accent)'};font-weight:800">${depth === 0 ? 'Derivație' : 'Sub-derivație (niv.' + depth + ')'}</span>
      <input type="number" class="pi d-parent" style="width:35px;padding:3px" min="1" value="3">
      <input type="number" class="pi d-count" style="width:35px;padding:3px" min="1" value="3">
      <select class="pi d-dir" style="width:55px;padding:3px">${dirOptions}</select>
      <select class="pi d-tip-cond" style="width:75px;padding:3px">
        <option value="Torsadat Al">Torsadat Al</option>
        <option value="Clasic Al">Clasic Al</option>
        <option value="Cablu Al">Cablu Al</option>
        <option value="Cablu Cu">Cablu Cu</option>
      </select>
      <select class="pi d-sectiune" style="width:50px;padding:3px">
        <option value="16">16</option><option value="25" selected>25</option>
        <option value="35">35</option><option value="50">50</option>
        <option value="70">70</option><option value="95">95</option>
        <option value="120">120</option><option value="150">150</option>
      </select>
      <button onclick="addDerivRow(document.getElementById('sub-${id}'), ${depth + 1})" style="background:rgba(0,207,255,.1);border:1px solid rgba(0,207,255,.3);color:var(--accent);border-radius:4px;font-size:7px;padding:2px 5px;cursor:pointer;font-weight:bold">+ SUB</button>
      <button onclick="document.getElementById('deriv-${id}').remove()" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-weight:bold">✕</button>
    </div>`;
  const subContainer = document.createElement('div');
  subContainer.id = `sub-${id}`; subContainer.style.display = 'flex'; subContainer.style.flexDirection = 'column'; subContainer.style.gap = '4px'; subContainer.style.marginTop = '4px';
  div.appendChild(subContainer); c.appendChild(div);
}

// This is the fully adapted runGenerator from the old app
export function runGenerator() {
    if(EL.length > 0 && !confirm('Atenție: Generarea automată va șterge elementele curente de pe planșă. Ești sigur că vrei să continui?')) return;
    saveState('generator auto');
    EL.length = 0; CN.length = 0; if (counters) { Object.keys(counters).forEach(k => { delete counters[k]; }); } window.sel = null; if (window.multiSel) window.multiSel.clear();

    const srcType = document.getElementById('gen-src').value;
    const cdType = document.getElementById('gen-cd').value;
    const plecari = parseInt(document.getElementById('gen-plecari').value) || 1;
    const numStalpi = parseInt(document.getElementById('gen-stalpi').value) || 4;
    const stType = document.getElementById('gen-st-tip').value;
    const isSubteran = stType.startsWith('firida');

    // Parse derivations recursively from the UI tree
    function parseDerivations(container) {
        const derivs = [];
        const rows = container.querySelectorAll(':scope > .deriv-row');
        rows.forEach(row => {
            const p = parseInt(row.querySelector(':scope > div > .d-parent').value) || 1;
            const c = parseInt(row.querySelector(':scope > div > .d-count').value) || 1;
            const d = row.querySelector(':scope > div > .d-dir').value;
            const tc = row.querySelector(':scope > div > .d-tip-cond').value;
            const sec = parseFloat(row.querySelector(':scope > div > .d-sectiune').value) || 25;
            const subContainer = row.querySelector(':scope > div:last-child');
            const subDerivs = subContainer ? parseDerivations(subContainer) : [];
            derivs.push({ parentIdx: p, count: c, dir: d, tipConductor: tc, sectiune: sec, subDerivations: subDerivs });
        });
        return derivs;
    }
    let derivations = parseDerivations(document.getElementById('deriv-container'));

    const mainTipCond = document.getElementById('gen-tip-cond').value;
    const mainSectiune = parseFloat(document.getElementById('gen-sectiune').value) || 35;

    // CM is already defined at top of file
    const srcId = uid();

    const srcEl = { id: srcId, type: srcType, x: -100, y: 0, label: nextLbl(srcType), color: CM[srcType] || '#1a6ba0', fillColor: 'none', rotation: 0, scale: 1 };
    if(srcType === 'ptab_1t') srcEl.fuses = new Array(10).fill(true);
    if(srcType === 'ptab_2t') srcEl.fuses = new Array(21).fill(true);
    EL.push(srcEl);

    let distId = srcId;
    let currentX = srcType.startsWith('ptab') ? 400 : 50;

    if (srcType === 'trafo' && cdType !== 'none') {
        distId = uid() + 1;
        currentX = 150;
        const cdEl = { id: distId, type: cdType, x: currentX, y: 0, label: nextLbl(cdType), color: CM[cdType] || '#555', fillColor: 'none', rotation: 0, scale: 1 };
        EL.push(cdEl);

        const tTerms = sym(srcEl).terms, cdTerms = sym(cdEl).terms;
        const tOut = tTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
        const cdIn = cdTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);

        CN.push({
            id: uid() + 2, fromElId: srcId, fromTerm: {cx: tOut.cx, cy: tOut.cy},
            toElId: distId, toTerm: {cx: cdIn.cx, cy: cdIn.cy},
            path: [{x: -100 + tOut.cx, y: tOut.cy}, {x: currentX + cdIn.cx, y: cdIn.cy}],
            label: 'Racord', length: 15, color: '#ef4444', strokeWidth: 3, lineType: 'solid',
            tipConductor: 'Clasic Al', sectiune: 50, tipRetea: 'Trifazat'
        });
        currentX += 100;
    } else if (srcType === 'trafo') {
        currentX += 50;
    }

    const distEl = EL.find(e => e.id === distId);
    const dTerms = sym(distEl).terms;
    const xSpacing = isSubteran ? 250 : 110;
    const ySpacing = isSubteran ? 250 : 110;

    // For PTAB 2T: limit plecari to max 8 per tablou, generate for both tablouri
    const isPTAB2T = srcType === 'ptab_2t';
    const isPTAB = srcType === 'ptab_1t' || isPTAB2T;

    function drawBranch(startElId, startTermOut, startX, startY, circNum, branchStalpi, branchType, isDeriv, dirMultiplier, branchDerivations, derivDepth, isHorizontalDeriv, branchTipCond, branchSectiune) {
        let prevId = startElId;
        let prevTermOut = startTermOut;
        let lineX = startX;
        let lineY = startY;
        derivDepth = derivDepth || 0;
        // Use passed derivations for this branch, or top-level derivations for main branch
        const myDerivations = branchDerivations || derivations;

        for (let s = 1; s <= branchStalpi; s++) {
            const stId = uid() + Math.floor(Math.random() * 100000);

            if (isDeriv) {
                if (isHorizontalDeriv) {
                    // Sub-derivatie orizontala (stanga/dreapta)
                    lineX += xSpacing * dirMultiplier;
                } else {
                    // Derivatie verticala (sus/jos)
                    lineY += (isSubteran ? 250 : 110) * dirMultiplier;
                }
            } else {
                lineX += xSpacing;
            }

            let isCapat = false;
            let isNod = false;

            // Check if any derivations branch from this element
            const derivHere = myDerivations.filter(d => d.parentIdx === s);

            if (s === branchStalpi && derivHere.length === 0) isCapat = true;
            if (derivHere.length > 0) isNod = true;

            let actualType = branchType;
            if (!isSubteran && (isCapat || isNod)) {
                if (branchType === 'stalp_sc10002') actualType = 'stalp_sc10005';
                else actualType = 'stalp_se10';
            }

            let nouEl = { id: stId, type: actualType, x: lineX, y: lineY, label: nextLbl(actualType), color: CM[actualType]||'#555', fillColor: 'none', rotation: 0, scale: 1, consumatori: 2 };
            if (actualType === 'firida_e2_4') nouEl.fuses = new Array(6).fill(true);
            if (actualType === 'firida_e3_4') nouEl.fuses = new Array(7).fill(true);
            if (actualType === 'firida_e3_0') nouEl.fuses = new Array(3).fill(true);

            if (isCapat) nouEl.nod = 'capat';
            if (isNod) nouEl.nod = 'nod';

            EL.push(nouEl);

            const stTerms = sym(EL[EL.length-1]).terms;
            let stIn, stOut;

            if (isSubteran) {
                const topTerms = stTerms.filter(t => t.cy < 0);
                if (topTerms.length > 0) {
                    stIn = topTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                    stOut = topTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                } else {
                    stIn = stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                    stOut = stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                }
            } else {
                if (isDeriv && isHorizontalDeriv) {
                    if (dirMultiplier > 0) {
                        stIn = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                        stOut = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                    } else {
                        stIn = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                        stOut = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                    }
                } else if (isDeriv) {
                    if (dirMultiplier < 0) {
                        stIn = stTerms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr);
                        stOut = stTerms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr);
                    } else {
                        stIn = stTerms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr);
                        stOut = stTerms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr);
                    }
                } else {
                    stIn = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                    stOut = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                }
            }

            const p1 = termWorldPos(EL.find(e=>e.id===prevId), prevTermOut.cx, prevTermOut.cy);
            const p2 = termWorldPos(EL[EL.length-1], stIn.cx, stIn.cy);

            let cPath;
            const srcElType = EL.find(e=>e.id===prevId)?.type || '';
            const destElType = EL[EL.length-1]?.type || '';
            const uHeight = 30; // height of the U/L bend

            if (srcElType.startsWith('ptab_') && s === 1 && !isSubteran) {
                // First cable from PTAB (aerian): down then horizontal
                cPath = [p1, {x: p1.x, y: p2.y}, p2];
            } else if (srcElType.startsWith('ptab_') && s === 1 && isSubteran) {
                // TDJT to firida: down, horizontal right, down into firida
                const dropY = p1.y + 30;
                cPath = [p1, {x: p1.x, y: dropY}, {x: p2.x, y: dropY}, p2];
            } else if (isSubteran && (srcElType.startsWith('cd') || srcElType === 'trafo') && s === 1) {
                // CD to firida: horizontal right, then down into firida (L shape)
                cPath = [p1, {x: p2.x, y: p1.y}, p2];
            } else if (isSubteran && !isDeriv) {
                // Between firide: U shape (up from firida1, horizontal, down into firida2)
                const uY = Math.min(p1.y, p2.y) - uHeight;
                cPath = [p1, {x: p1.x, y: uY}, {x: p2.x, y: uY}, p2];
            } else {
                cPath = [p1, p2];
            }

            const dLabel = derivDepth > 0 ? `SD${derivDepth}-C${circNum}-${s}` : (isDeriv ? `D${circNum}-${s}` : `C${circNum}-${s}`);

            const useTipCond = branchTipCond || mainTipCond;
            const useSectiune = branchSectiune || mainSectiune;
            const isCableLES = useTipCond.startsWith('Cablu');

            CN.push({
                id: uid() + Math.floor(Math.random() * 100000), fromElId: prevId, fromTerm: {cx: prevTermOut.cx, cy: prevTermOut.cy},
                toElId: stId, toTerm: {cx: stIn.cx, cy: stIn.cy},
                path: cPath,
                label: dLabel, length: isDeriv ? 30 : 40, color: '#ef4444',
                strokeWidth: isCableLES ? 3 : 2,
                lineType: isCableLES ? 'dashed' : 'solid',
                circuitGroup: `C${circNum}`, fromCircuit: (prevId === distId) ? circNum : null,
                tipConductor: useTipCond,
                sectiune: useSectiune,
                tipRetea: 'Trifazat', putereConc: 0
            });

            prevId = stId;
            prevTermOut = stOut;

            // Process derivations at this element (works for any depth)
            if (derivHere.length > 0) {
                derivHere.forEach(deriv => {
                    const stEl = EL.find(e => e.id === stId);
                    const dtms = sym(stEl).terms;
                    let derivTermOut;
                    let dirMul, nextIsHorizontal;

                    if (deriv.dir === 'sus') {
                        derivTermOut = dtms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr);
                        dirMul = -1; nextIsHorizontal = false;
                    } else if (deriv.dir === 'jos') {
                        derivTermOut = dtms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr);
                        dirMul = 1; nextIsHorizontal = false;
                    } else if (deriv.dir === 'dreapta') {
                        derivTermOut = dtms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
                        dirMul = 1; nextIsHorizontal = true;
                    } else if (deriv.dir === 'stanga') {
                        derivTermOut = dtms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
                        dirMul = -1; nextIsHorizontal = true;
                    }

                    drawBranch(stId, derivTermOut, lineX, lineY, circNum, deriv.count, branchType, true, dirMul, deriv.subDerivations || [], derivDepth + 1, nextIsHorizontal, deriv.tipConductor, deriv.sectiune);
                });
            }
        }
    }

    if (isPTAB2T) {
        // PTAB 2T: generate circuits only for selected TD
        const selectedTD = parseInt(document.getElementById('gen-td').value) || 1;
        const plecariPerTD = Math.min(plecari, 8);
        const ptabBaseOffset = 150;
        const circSpacing = ySpacing;
        const circStart = selectedTD === 1 ? 1 : 9; // TD1: circuits 1-8, TD2: circuits 9-16
        for (let c = 1; c <= plecariPerTD; c++) {
            const circInternal = circStart + (c - 1);
            let outTerm = dTerms.find(t => t.circuit === circInternal);
            if (!outTerm) continue;
            const startX = srcEl.x + outTerm.cx;
            const yOff = ptabBaseOffset + (c - 1) * circSpacing;
            const startY = srcEl.y + outTerm.cy + yOff;
            drawBranch(distId, outTerm, startX, startY, circInternal, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
        }
    } else if (isPTAB) {
        // PTAB 1T: circuits 1-8 directly from PTAB terminals
        const plecariPTAB = Math.min(plecari, 8);
        const ptabBaseOffset = 150;
        const circSpacing = ySpacing;
        for (let c = 1; c <= plecariPTAB; c++) {
            let outTerm = dTerms.find(t => t.circuit === c);
            if (!outTerm) continue;
            const startX = srcEl.x + outTerm.cx;
            const yOff = ptabBaseOffset + (c - 1) * circSpacing;
            const startY = srcEl.y + outTerm.cy + yOff;
            drawBranch(distId, outTerm, startX, startY, c, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
        }
    } else {
        // PT Aerian + CD: standard behavior
        for (let c = 1; c <= plecari; c++) {
            let circNum = c;
            let outTerm = dTerms.find(t => t.circuit === circNum);
            if(!outTerm) outTerm = dTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
            const baseY = (c - ((plecari + 1) / 2)) * ySpacing + (isSubteran ? 100 : 0);
            drawBranch(distId, outTerm, currentX, baseY, circNum, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
        }
    }

    // Close modal
    const genModal = document.getElementById('gen-modal');
    if (genModal) genModal.style.display = 'none';
    render();
    if (callbacks.updateProps) callbacks.updateProps();
    if (callbacks.updateStat) callbacks.updateStat();
    toast('✨ Schema a fost generată automat!', 'ok');

    const wElem = document.getElementById('cw');
    if (wElem) {
        view.x = wElem.clientWidth/2 - 150; view.y = wElem.clientHeight/2; view.s = 0.6; applyView();
    }
}



