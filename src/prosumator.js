import { S } from './state.js';
import { ENABLE_PROSUMER_MODULE } from './config.js';
import { getR0, getKs, getX0 } from './calculations.js';
import { toast } from './utils.js';

// ── Profiles ──
const PROS_PROFILE = {"cons_vara":[0.8803,0.7929,0.7503,0.7283,0.7202,0.7577,0.8539,0.9662,1.0638,1.1343,1.1798,1.2026,1.2033,1.2165,1.2209,1.2209,1.2415,1.2841,1.2995,1.3054,1.3046,1.3384,1.3223,1.0903,0.8986,0.7951,0.7467,0.7232,0.7055,0.7349,0.8304,0.9383,1.033,1.0829,1.1365,1.1747,1.1842,1.2011,1.2114,1.2261,1.2635,1.3017,1.3325,1.3384,1.3436,1.3715,1.3406,1.102,0.9082,0.8091,0.7606,0.7379,0.7158,0.7452,0.8494,0.9706,1.0609,1.1189,1.1747,1.2048,1.2099,1.2063,1.1901,1.1864,1.1857,1.2004,1.2364,1.2562,1.2599,1.2562,1.1505,0.9508,0.8105,0.7386,0.6997,0.6799,0.6688,0.7004,0.7672,0.8443,0.9119,0.964,1.0066,1.0161,0.9889,0.9823,0.9809,0.9956,1.0095,1.0411,1.0646,1.08,1.1035,1.1718,1.1321,0.9412,0.7775,0.6953,0.652,0.6365,0.6226,0.6512,0.7393,0.8465,0.9346,0.9735,0.9985,1.0124,1.0036,1.0139,1.0168,1.0455,1.0682,1.0932,1.1182,1.1262,1.1417,1.2004,1.1696,0.9757,0.812,0.7232,0.674,0.6527,0.6387,0.6637,0.7606,0.8928,1.0095,1.0866,1.1306,1.1512,1.1505,1.1571,1.1527,1.1497,1.1769,1.1997,1.2261,1.2474,1.2687,1.309,1.2665,1.0513,0.8781,0.7731,0.718,0.6938,0.6725,0.6725,0.7232,0.7929,0.8663,0.8972,0.9221,0.9295,0.9376,0.9258,0.9199,0.9141,0.9295,0.95,0.975,1.0227,1.055,1.0991,1.0506,0.8788],"cons_iarna":[0.7192,0.6595,0.6329,0.6208,0.6418,0.7111,0.8619,1.0239,1.1408,1.2142,1.2255,1.1997,1.1836,1.182,1.1997,1.2182,1.3005,1.3859,1.3884,1.3593,1.286,1.1739,1.0312,0.8659,0.7401,0.6708,0.6418,0.6281,0.6426,0.7079,0.8393,0.9449,0.9852,1.0078,1.0135,1.0006,1.0014,0.9997,1.0143,1.053,1.1505,1.2408,1.2553,1.2408,1.1852,1.0941,0.9683,0.8191,0.7151,0.6506,0.6232,0.6144,0.6305,0.695,0.8401,0.9868,1.0892,1.1336,1.14,1.1086,1.0699,1.0602,1.0683,1.1054,1.2295,1.3666,1.3803,1.3505,1.2666,1.1425,0.9844,0.8143,0.7047,0.6442,0.6152,0.6031,0.6224,0.6942,0.8482,1.003,1.0909,1.1223,1.1191,1.0796,1.0538,1.057,1.0699,1.1183,1.2295,1.3561,1.3674,1.3311,1.2497,1.1352,0.9756,0.8232,0.7159,0.6579,0.6281,0.62,0.6321,0.6942,0.8369,0.9764,1.061,1.107,1.1005,1.0626,1.028,1.0489,1.078,1.1328,1.2457,1.3626,1.3682,1.3174,1.2408,1.1344,0.9965,0.8506,0.7369,0.6531,0.6192,0.6023,0.6136,0.6611,0.7651,0.9046,1.0933,1.2053,1.2553,1.2602,1.2416,1.2166,1.2166,1.2489,1.3811,1.544,1.5415,1.4827,1.3722,1.2344,1.0554,0.8796,0.745,0.6748,0.6313,0.616,0.6152,0.645,0.7071,0.7998,0.9328,0.9885,1.0223,1.0344,1.0384,1.0118,0.9748,1.0078,1.1062,1.2328,1.2497,1.24,1.182,1.0771,0.9369,0.7998]};
const PROS_PV_PROFILE = {"pv_vara":[0,0,0,0,0.0001,0.0067,0.0166,0.0673,0.2487,0.5952,0.6755,0.5997,0.4709,0.5931,0.523,0.3877,0.2812,0.1282,0.0204,0,0,0,0,0,0,0,0,0,0.0044,0.1255,0.2726,0.4072,0.5269,0.5883,0.5625,0.5796,0.5813,0.522,0.4554,0.3802,0.299,0.1462,0.0233,0,0,0,0,0,0,0,0,0,0.0001,0.0067,0.2619,0.3265,0,0.4331,0.5195,0.6395,0.5999,0.5467,0.4657,0.3532,0.301,0.0323,0.0366,0,0,0,0,0,0,0,0,0,0.0136,0.1188,0.2694,0.3874,0.533,0.6166,0.6645,0.674,0.6566,0.6125,0.5286,0.1319,0.0359,0.0183,0.0096,0,0,0,0,0,0,0,0,0,0,0.0393,0.055,0.1254,0.1497,0.3916,0.4071,0.662,0.5304,0.459,0.5009,0.4275,0.2827,0.117,0.0294,0,0,0,0,0,0,0,0,0,0,0.0062,0.0163,0.2071,0.1037,0.1691,0.203,0.2223,0.2559,0.1963,0.3265,0.2951,0.1533,0.0972,0.0359,0,0,0,0,0,0,0,0,0,0,0.0068,0.1598,0.3299,0.4343,0.5078,0.4994,0.6737,0.6964,0.5963,0.5915,0.4559,0.3033,0.1535,0.0384,0,0,0,0,0],"pv_iarna":[0,0,0,0,0,0,0,0.0095,0.0966,0.1863,0.1985,0.2324,0.21,0.1698,0.0665,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0026,0.0381,0.1104,0.0323,0.0623,0.0834,0.1102,0.043,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0006,0.0103,0.0397,0.0439,0.0985,0.0682,0.0413,0.0068,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0045,0.0488,0.1021,0.1164,0.1673,0.121,0.0812,0.0348,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0032,0.0425,0.1134,0.0818,0.0619,0.0635,0.034,0.0287,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0006,0.0343,0.0531,0.046,0.0399,0.0356,0.0216,0.0082,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0268,0.0411,0.0276,0.0234,0.0133,0.0529,0.0021,0,0,0,0,0,0,0,0,0,0,0,0,0]};

function csConsum(n) { if (n <= 1) return 1.0; if (n <= 5) return 0.7; if (n <= 20) return 0.45; if (n <= 50) return 0.32; return 0.25; }
function pvProfile(lat, sezon) { return PROS_PV_PROFILE['pv_' + sezon]; }

function prosFindSource() {
  const cd = S.EL.find(el => el.type.startsWith('cd'));
  if (cd) return cd;
  return S.EL.find(el => el.type === 'ptab_1t' || el.type === 'ptab_2t' || el.type === 'ptab_mono' || el.type === 'trafo');
}

function prosFindPath(targetId) {
  const source = prosFindSource();
  if (!source) return null;
  const visited = new Set([source.id]);
  const queue = [{ id: source.id, path: [] }];
  while (queue.length) {
    const cur = queue.shift();
    if (cur.id === targetId) {
      const target = S.EL.find(e => e.id === targetId);
      return { source, target, segments: cur.path };
    }
    const cables = S.CN.filter(c => c.fromElId === cur.id || c.toElId === cur.id);
    for (const cn of cables) {
      const nextId = cn.fromElId === cur.id ? cn.toElId : cn.fromElId;
      if (!nextId || visited.has(nextId)) continue;
      visited.add(nextId);
      queue.push({ id: nextId, path: [...cur.path, { cableId: cn.id, L: parseFloat(cn.length) || 0, S: parseFloat(cn.sectiune) || 16, tipC: cn.tipConductor || 'Clasic Al' }] });
    }
  }
  return null;
}

function prosBuildTree() {
  const source = prosFindSource();
  if (!source) return null;
  const nodeCables = new Map([[source.id, []]]);
  const visited = new Set([source.id]);
  const queue = [source.id];
  while (queue.length) {
    const cur = queue.shift();
    const curCables = nodeCables.get(cur);
    for (const cn of S.CN.filter(c => c.fromElId === cur || c.toElId === cur)) {
      const next = cn.fromElId === cur ? cn.toElId : cn.fromElId;
      if (!next || visited.has(next)) continue;
      visited.add(next);
      nodeCables.set(next, [...curCables, cn]);
      queue.push(next);
    }
  }
  return { source, nodeCables };
}

function prosAnalyzePath(targetId) {
  const tree = prosBuildTree();
  if (!tree || !tree.nodeCables.has(targetId)) return null;
  const targetCables = tree.nodeCables.get(targetId);
  const targetCableIds = new Set(targetCables.map(c => c.id));
  const cableChildId = new Map();
  for (const [elId, cables] of tree.nodeCables) {
    if (cables.length === 0) continue;
    cableChildId.set(cables[cables.length - 1].id, elId);
  }
  const allCableInfo = new Map();
  for (const cn of S.CN) {
    const childId = cableChildId.get(cn.id);
    if (!childId) continue;
    const childEl = S.EL.find(e => e.id === childId);
    if (!childEl) continue;
    let N_local = 0, P_PV_local = 0;
    if (childEl.cons_dict) for (const g in childEl.cons_dict) N_local += (parseInt(childEl.cons_dict[g]) || 0);
    else if (childEl.consumatori) N_local += (parseInt(childEl.consumatori) || 0);
    if (childEl.pv_dict) for (const g in childEl.pv_dict) P_PV_local += (parseFloat(childEl.pv_dict[g]) || 0);
    allCableInfo.set(cn.id, { cable: cn, childId, childLabel: childEl.label || childEl.type, N_local, P_PV_local, L: parseFloat(cn.length) || 0, S: parseFloat(cn.sectiune) || 16, tipC: cn.tipConductor || 'Clasic Al', tipRetea: cn.tipRetea || 'Trifazat' });
  }
  const downstreamCables = new Map();
  for (const C of targetCables) {
    const ds = [];
    for (const [dId, dInfo] of allCableInfo) {
      if (dId === C.id) continue;
      const childPath = tree.nodeCables.get(dInfo.childId) || [];
      if (childPath.some(cn => cn.id === C.id)) ds.push(dId);
    }
    downstreamCables.set(C.id, ds);
  }
  const cableStats = new Map();
  for (const cn of targetCables) {
    const info = allCableInfo.get(cn.id);
    cableStats.set(cn.id, { cable: cn, N_cons: 0, P_PV: 0, N_local: info ? info.N_local : 0, P_PV_local: info ? info.P_PV_local : 0, childId: info ? info.childId : null });
  }
  for (const el of S.EL) {
    if (!tree.nodeCables.has(el.id)) continue;
    let elCons = 0, elPV = 0;
    if (el.cons_dict) for (const g in el.cons_dict) elCons += (parseInt(el.cons_dict[g]) || 0);
    else if (el.consumatori) elCons += (parseInt(el.consumatori) || 0);
    if (el.pv_dict) for (const g in el.pv_dict) elPV += (parseFloat(el.pv_dict[g]) || 0);
    if (elCons === 0 && elPV === 0) continue;
    const elPath = tree.nodeCables.get(el.id);
    for (const cn of elPath) {
      if (targetCableIds.has(cn.id)) {
        const st = cableStats.get(cn.id);
        st.N_cons += elCons; st.P_PV += elPV;
      }
    }
  }
  const target = S.EL.find(e => e.id === targetId);
  return { source: tree.source, target, targetCables, cableStats, allCableInfo, downstreamCables };
}

function aggregateSchema() {
  let totalCons = 0, totalPV = 0;
  S.EL.forEach(el => {
    if (el.cons_dict) { for (const g in el.cons_dict) totalCons += (parseInt(el.cons_dict[g]) || 0); }
    else if (el.consumatori) totalCons += (parseInt(el.consumatori) || 0);
    if (el.pv_dict) { for (const g in el.pv_dict) totalPV += (parseFloat(el.pv_dict[g]) || 0); }
  });
  return { totalCons, totalPV };
}

function cableRes(S_sec) { const rho = 0.029; return { r: rho / S_sec, x: 0.08 / 1000 }; }

function svgChart(series, opts) {
  const w = opts.w || 900, h = opts.h || 200, pl = 45, pr = 15, pt = 15, pb = 38;
  const cw = w - pl - pr, ch = h - pt - pb;
  const yMin = opts.yMin, yMax = opts.yMax;
  const xN = series[0].data.length;
  const xs = i => pl + (i / (xN - 1)) * cw;
  const ys = v => pt + ch - ((v - yMin) / (yMax - yMin)) * ch;
  let out = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="background:var(--bg2);border-radius:6px;display:block">`;
  (opts.bands || []).forEach(b => { const y1 = ys(b.max), y2 = ys(b.min); out += `<rect x="${pl}" y="${Math.min(y1, y2)}" width="${cw}" height="${Math.abs(y2 - y1)}" fill="${b.color}" opacity="0.12"/>`; });
  for (let i = 0; i <= 5; i++) { const v = yMin + (yMax - yMin) * i / 5, y = ys(v); out += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="var(--border)" stroke-width="0.5" opacity="0.4"/><text x="${pl - 5}" y="${y + 3}" font-size="8" fill="var(--text3)" text-anchor="end" font-family="monospace">${v.toFixed(1)}</text>`; }
  for (let d = 0; d < 7; d++) { const x1 = xs(d * 24), x2 = xs(Math.min(d * 24 + 24, xN - 1)), isWeekend = d >= 5, fill = isWeekend ? 'rgba(255,193,7,0.06)' : (d % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'); out += `<rect x="${x1}" y="${pt}" width="${x2 - x1}" height="${ch}" fill="${fill}"/>`; }
  for (let d = 1; d < 7; d++) { const x = xs(d * 24); out += `<line x1="${x}" y1="${pt}" x2="${x}" y2="${pt + ch}" stroke="var(--border2)" stroke-width="1" opacity="0.55"/>`; }
  for (let d = 0; d < 7; d++) { for (let hh = 6; hh < 24; hh += 6) { const xT = xs(d * 24 + hh); out += `<line x1="${xT}" y1="${pt + ch}" x2="${xT}" y2="${pt + ch + 3}" stroke="var(--text3)" stroke-width="0.5" opacity="0.6"/><text x="${xT}" y="${pt + ch + 9}" font-size="6.5" fill="var(--text3)" text-anchor="middle">${hh}</text>`; } }
  const dnames = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
  for (let d = 0; d < 7; d++) { const col = d >= 5 ? '#ffc107' : 'var(--text2)'; out += `<text x="${xs(d * 24 + 12)}" y="${h - 3}" font-size="9.5" fill="${col}" font-weight="700" text-anchor="middle">${dnames[d]}</text>`; }
  if (opts.zeroLine && yMin < 0 && yMax > 0) { const y = ys(0); out += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="var(--text3)" stroke-width="1" opacity="0.6"/>`; }
  series.forEach(sr => { const pts = sr.data.map((v, i) => `${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' '); out += `<polyline fill="none" stroke="${sr.color}" stroke-width="1.5" points="${pts}" ${sr.dashed ? 'stroke-dasharray="4,3"' : ''}/>`; });
  if (opts.legend) { let lx = pl + 5, ly = pt + 12; series.forEach(sr => { out += `<line x1="${lx}" y1="${ly}" x2="${lx + 15}" y2="${ly}" stroke="${sr.color}" stroke-width="2" ${sr.dashed ? 'stroke-dasharray="3,2"' : ''}/><text x="${lx + 20}" y="${ly + 3}" font-size="9" fill="var(--text2)">${sr.label}</text>`; lx += 20 + sr.label.length * 5.5 + 10; }); }
  if (opts.yLabel) { out += `<text x="12" y="${pt + ch / 2}" font-size="9" fill="var(--text3)" transform="rotate(-90 12 ${pt + ch / 2})" text-anchor="middle">${opts.yLabel}</text>`; }
  out += `<line class="pros-hover-line" x1="0" y1="${pt}" x2="0" y2="${pt + ch}" stroke="#ffc107" stroke-width="1" opacity="0.7" pointer-events="none" style="display:none"/>`;
  out += `<rect class="pros-chart-overlay" x="${pl}" y="${pt}" width="${cw}" height="${ch}" fill="transparent" data-pl="${pl}" data-cw="${cw}" onmousemove="prosChartHover(event)" onmouseleave="prosChartHoverHide()"/>`;
  out += `</svg>`;
  return out;
}

export function prosChartHover(ev) {
  const d = window.prosTooltipData;
  if (!d) return;
  const rect = ev.currentTarget;
  const svg = rect.ownerSVGElement;
  const svgBox = svg.getBoundingClientRect();
  const pl = parseFloat(rect.getAttribute('data-pl'));
  const cw = parseFloat(rect.getAttribute('data-cw'));
  let rel = (ev.clientX - svgBox.left - pl) / cw;
  if (rel < 0) rel = 0; if (rel > 1) rel = 1;
  const idx = Math.round(rel * 167);
  const day = Math.floor(idx / 24), hour = idx % 24;
  const dnames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
  const tip = document.getElementById('pros-tooltip');
  if (!tip) return;
  const hourStr = hour.toString().padStart(2, '0') + ':00';
  tip.innerHTML = `<div style="font-weight:700;color:#ffc107;margin-bottom:4px;font-size:10.5px">${dnames[day]} ${hourStr}</div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Consum:</span><b style="color:#00cfff">${d.pCons[idx].toFixed(2)} kW</b></div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Producție PV:</span><b style="color:#ffc107">${d.pPV[idx].toFixed(2)} kW</b></div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Flux net:</span><b style="color:${d.pNet[idx] < 0 ? '#22c55e' : '#ef4444'}">${d.pNet[idx].toFixed(2)} kW</b></div>
    <div style="border-top:1px solid #444;margin-top:4px;padding-top:4px;display:flex;justify-content:space-between;gap:10px"><span>Tensiune:</span><b style="color:${d.uArr[idx] > d.Un * 1.05 || d.uArr[idx] < d.Un * 0.95 ? '#ef4444' : '#22c55e'}">${d.uArr[idx].toFixed(1)} V</b></div>
    ${d.uArrNoPV ? `<div style="display:flex;justify-content:space-between;gap:10px;font-size:9px;color:#94a3b8"><span>(fără PV):</span>${d.uArrNoPV[idx].toFixed(1)} V</div>` : ''}`;
  tip.style.display = 'block';
  const tipW = tip.offsetWidth || 200, tipH = tip.offsetHeight || 100;
  let tx = ev.clientX + 14, ty = ev.clientY + 10;
  if (tx + tipW > window.innerWidth) tx = ev.clientX - tipW - 14;
  if (ty + tipH > window.innerHeight) ty = ev.clientY - tipH - 10;
  tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
  const xLocalForLine = ev.clientX - svgBox.left;
  document.querySelectorAll('#prosumator-panel svg').forEach(sv => {
    const sb = sv.getBoundingClientRect();
    const line = sv.querySelector('.pros-hover-line');
    if (line) { const xInThisSvg = (xLocalForLine / svgBox.width) * sb.width; line.setAttribute('x1', xInThisSvg); line.setAttribute('x2', xInThisSvg); line.style.display = 'block'; }
  });
}

export function prosChartHoverHide() {
  const tip = document.getElementById('pros-tooltip');
  if (tip) tip.style.display = 'none';
  document.querySelectorAll('#prosumator-panel .pros-hover-line').forEach(l => l.style.display = 'none');
}

let prosExtraClients = [];

export function prosAddExtraClient() { prosExtraClients.push({ nodeId: '', ps: 10, ppv: 10 }); prosRenderExtraClients(); runProsumator(); }
export function prosRemoveExtraClient(idx) { prosExtraClients.splice(idx, 1); prosRenderExtraClients(); runProsumator(); }
export function prosUpdateExtraClient(idx, field, value) {
  if (!prosExtraClients[idx]) return;
  if (field === 'nodeId') prosExtraClients[idx].nodeId = value;
  else if (field === 'ps') prosExtraClients[idx].ps = parseFloat(value) || 0;
  else if (field === 'ppv') prosExtraClients[idx].ppv = parseFloat(value) || 0;
  runProsumator();
}

export function prosRenderExtraClients() {
  const list = document.getElementById('pros-extra-clients-list');
  if (!list) return;
  const candidates = S.EL.filter(el => el.type.startsWith('stalp_') || el.type.startsWith('firida_'));
  if (prosExtraClients.length === 0) {
    list.innerHTML = `<div style="font-size:9px;color:var(--text3);font-style:italic;padding:4px 0">Niciun client suplimentar. Folosește butonul <b>+ ADAUGĂ CLIENT</b> pentru a testa scenarii multi-prosumator.</div>`;
    return;
  }
  list.innerHTML = prosExtraClients.map((c, i) => `
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;font-size:9.5px;font-family:'JetBrains Mono',monospace;padding:4px 6px;background:var(--bg2);border-radius:4px;border:1px solid rgba(255,193,7,0.2)">
      <span style="color:#ffc107;font-weight:700;min-width:20px">#${i + 1}</span>
      <span style="color:var(--text3)">Nod:</span>
      <select onchange="prosUpdateExtraClient(${i},'nodeId',this.value)" style="min-width:140px;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
        <option value="">— alege —</option>
        ${candidates.map(el => `<option value="${el.id}" ${c.nodeId == el.id ? 'selected' : ''}>${el.label || el.type}</option>`).join('')}
      </select>
      <span style="color:#ef4444;font-weight:700">Ps:</span>
      <input type="number" step="0.5" value="${c.ps}" onchange="prosUpdateExtraClient(${i},'ps',this.value)" style="width:55px;background:var(--bg3);border:1px solid rgba(239,68,68,0.4);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
      <span style="color:var(--text3);font-size:8.5px">kW</span>
      <span style="color:#ffc107;font-weight:700">PV:</span>
      <input type="number" step="0.5" value="${c.ppv}" onchange="prosUpdateExtraClient(${i},'ppv',this.value)" style="width:55px;background:var(--bg3);border:1px solid rgba(255,193,7,0.4);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
      <span style="color:var(--text3);font-size:8.5px">kWp</span>
      <button onclick="prosRemoveExtraClient(${i})" style="margin-left:auto;padding:2px 8px;border-radius:3px;border:1px solid rgba(239,68,68,0.4);background:transparent;color:#ef4444;cursor:pointer;font-size:9px;font-weight:700">✕</button>
    </div>
  `).join('');
}

export function prosRefreshNodeDropdown() {
  const sel = document.getElementById('pros-node');
  if (!sel) return;
  const prev = sel.value;
  const candidates = S.EL.filter(el => el.type.startsWith('stalp_') || el.type.startsWith('firida_'));
  sel.innerHTML = '<option value="">— manual (L + S) —</option>' + candidates.map(el => `<option value="${el.id}">${el.label || el.type} (#${el.id})</option>`).join('');
  if (prev && candidates.find(e => e.id == prev)) sel.value = prev;
}

export function prosUpdateManualVisibility() {
  const mode = document.getElementById('pros-mode').value;
  const nodeSel = document.getElementById('pros-node')?.value || '';
  const useManual = mode === 'retea' || (mode === 'client' && !nodeSel);
  document.getElementById('pros-manual-len').style.display = useManual ? 'flex' : 'none';
  document.getElementById('pros-manual-sec').style.display = useManual ? 'flex' : 'none';
}

export function prosToggleMode() {
  const mode = document.getElementById('pros-mode').value;
  const isClient = mode === 'client';
  document.getElementById('pros-retea-inputs').style.display = 'flex';
  document.getElementById('pros-client-ps').style.display = isClient ? 'flex' : 'none';
  document.getElementById('pros-client-ppv').style.display = isClient ? 'flex' : 'none';
  document.getElementById('pros-client-node').style.display = isClient ? 'flex' : 'none';
  document.getElementById('pros-extra-clients-section').style.display = isClient ? 'block' : 'none';
  if (isClient) { prosRefreshNodeDropdown(); prosRenderExtraClients(); }
  prosUpdateManualVisibility();
  runProsumator();
}

export function toggleProsumator() {
  const p = document.getElementById('prosumator-panel');
  const showing = p.style.display === 'flex';
  p.style.display = showing ? 'none' : 'flex';
  if (!showing) { prosRefreshNodeDropdown(); prosRenderExtraClients(); prosUpdateManualVisibility(); runProsumator(); }
}

export function openProsumatorModal() {
  if (!ENABLE_PROSUMER_MODULE) { toast('Modul în dezvoltare', 'ac'); return; }
  toggleProsumator();
}

export function runProsumator() {
  const sezon = document.getElementById('pros-sezon').value;
  const lat = 47.16;
  const pMed = parseFloat(document.getElementById('pros-pmed').value) || 0.5;
  const L = parseFloat(document.getElementById('pros-len').value) || 300;
  const S_sec = parseFloat(document.getElementById('pros-sec').value) || 50;
  const Un = parseFloat(document.getElementById('pros-un').value) || 400;
  const mode = document.getElementById('pros-mode').value;
  const content = document.getElementById('pros-content');
  let totalCons, totalPV, csCons, pConsScale;
  const profConsRaw = PROS_PROFILE['cons_' + sezon];
  const profConsPeak = Math.max(...profConsRaw);
  const profPV = pvProfile(lat, sezon);
  const csInj = 0.95;
  const nodeId = mode === 'client' ? parseInt(document.getElementById('pros-node').value) : 0;
  let pathAnalysis = null, pathData = null;
  let existingCons = 0, existingPV = 0;
  if (nodeId) {
    pathAnalysis = prosAnalyzePath(nodeId);
    pathData = prosFindPath(nodeId);
    if (pathAnalysis && pathData && pathData.segments.length > 0) {
      const firstCable = pathData.segments[0];
      const st = pathAnalysis.cableStats.get(firstCable.cableId);
      if (st) { existingCons = st.N_cons; existingPV = st.P_PV; }
    }
  }
  const extraLoadAtNode = new Map();
  if (mode === 'client') {
    for (const cl of prosExtraClients) {
      if (!cl.nodeId) continue;
      const nid = parseInt(cl.nodeId); if (!nid) continue;
      if (!extraLoadAtNode.has(nid)) extraLoadAtNode.set(nid, { ps: 0, ppv: 0 });
      const e = extraLoadAtNode.get(nid); e.ps += cl.ps; e.ppv += cl.ppv;
    }
  }
  const extrasTotalPs = [...extraLoadAtNode.values()].reduce((s, e) => s + e.ps, 0);
  const extrasTotalPV = [...extraLoadAtNode.values()].reduce((s, e) => s + e.ppv, 0);
  if (mode === 'client') {
    let ps = parseFloat(document.getElementById('pros-ps').value); if (isNaN(ps)) ps = 15;
    let ppv = parseFloat(document.getElementById('pros-ppv').value); if (isNaN(ppv)) ppv = 25;
    totalCons = 1; totalPV = ppv; csCons = 1.0; pConsScale = ps;
  } else {
    const { totalCons: tc, totalPV: tp } = aggregateSchema();
    if (tc === 0 && tp === 0) {
      content.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text3);font-size:11px">Nu există consumatori sau prosumatori în schemă.<br>Adaugă cantități în proprietățile stâlpilor/firidelor, sau schimbă modul în <b>Client concentrat nou</b>.</div>`;
      return;
    }
    totalCons = tc; totalPV = tp; csCons = csConsum(totalCons); pConsScale = pMed * totalCons;
  }
  const csExisting = csConsum(existingCons);
  const pNet = new Array(168), pConsArr = new Array(168), pPVArr = new Array(168);
  for (let t = 0; t < 168; t++) {
    const profC_peak = profConsRaw[t] / profConsPeak;
    const pc_main = profC_peak * pConsScale * csCons;
    const pp_main = profPV[t] * totalPV * csInj;
    const pc_ext = existingCons > 0 ? existingCons * pMed * profC_peak * csExisting : 0;
    const pp_ext = existingPV > 0 ? existingPV * profPV[t] * csInj : 0;
    const pc_extras = extrasTotalPs * profC_peak;
    const pp_extras = extrasTotalPV * profPV[t] * csInj;
    pConsArr[t] = pc_main + pc_ext + pc_extras;
    pPVArr[t] = pp_main + pp_ext + pp_extras;
    pNet[t] = pConsArr[t] - pPVArr[t];
  }
  const cosPhi = 0.95, sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
  let L_real = L, sectionsInfo = `S=${S_sec}mm²`, nodeInfo = '';
  let uArr, uArrNoPV;
  let prosDebugRows = null, prosDebugRowsPeakCons = null, prosDebugHourLabel = '', prosDebugHourLabelPeakCons = '';
  if (pathAnalysis && pathData) {
    const segs = pathData.segments;
    L_real = segs.reduce((s, x) => s + x.L, 0);
    const secSet = [...new Set(segs.map(s => s.S))].sort((a, b) => a - b);
    sectionsInfo = secSet.length > 1 ? `secțiuni: ${secSet.join('/')} mm²` : `S=${secSet[0] || S_sec}mm²`;
    nodeInfo = `Sursă: <b>${pathData.source.label || pathData.source.type}</b> → Nod: <b>${pathData.target.label || pathData.target.type}</b>`;
    const cableInfo = segs.map(seg => {
      const st = pathAnalysis.cableStats.get(seg.cableId);
      const cnOrig = S.CN.find(c => c.id === seg.cableId);
      const tipRetea = (cnOrig && cnOrig.tipRetea) || 'Trifazat';
      const factor = tipRetea === 'Monofazat' ? 7.7 : (tipRetea === 'Bifazat' ? 20 : 46);
      const childId = st ? st.childId : null;
      const childEl = childId ? S.EL.find(e => e.id === childId) : null;
      return { L: seg.L, S: seg.S, tipC: seg.tipC, tipRetea, factor, N_local: st ? st.N_local : 0, P_PV_local: st ? st.P_PV_local : 0, childLabel: childEl ? (childEl.label || childEl.type) : '?' };
    });
    uArr = new Array(168); uArrNoPV = new Array(168);
    const isLastIdx = cableInfo.length - 1;
    let peakHourIdx = 0, peakProfC = 0, peakPVHourIdx = 0, peakPVValue = 0;
    for (let t = 0; t < 168; t++) { if (profPV[t] > peakPVValue) { peakPVValue = profPV[t]; peakPVHourIdx = t; } }
    const pLocalNet = (info, profC_peak, tIdx, withPV) => {
      const ks_loc = getKs(info.N_local, 'RURAL');
      let P_cons = info.N_local * pMed * ks_loc * profC_peak;
      let P_pv = withPV ? (info.P_PV_local * profPV[tIdx] * csInj) : 0;
      const extra = extraLoadAtNode.get(info.childId);
      if (extra) { P_cons += extra.ps * profC_peak; if (withPV) P_pv += extra.ppv * profPV[tIdx] * csInj; }
      return P_cons - P_pv;
    };
    for (let t = 0; t < 168; t++) {
      const profC_peak = profConsRaw[t] / profConsPeak;
      if (profC_peak > peakProfC) { peakProfC = profC_peak; peakHourIdx = t; }
      let dU_percent = 0, dU_noPV = 0;
      for (let i = 0; i < cableInfo.length; i++) {
        const ci = cableInfo[i];
        const cableId = pathData.segments[i].cableId;
        const info_C = pathAnalysis.allCableInfo.get(cableId);
        let P_local_C = pLocalNet(info_C, profC_peak, t, true);
        let P_local_C_noPV = pLocalNet(info_C, profC_peak, t, false);
        if (mode === 'client' && i === isLastIdx) { P_local_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj; P_local_C_noPV += pConsScale * profC_peak; }
        let P_passing_C = 0, P_passing_C_noPV = 0;
        for (const dId of (pathAnalysis.downstreamCables.get(cableId) || [])) {
          const info_D = pathAnalysis.allCableInfo.get(dId); if (!info_D) continue;
          P_passing_C += pLocalNet(info_D, profC_peak, t, true);
          P_passing_C_noPV += pLocalNet(info_D, profC_peak, t, false);
        }
        if (mode === 'client' && i !== isLastIdx) { P_passing_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj; P_passing_C_noPV += pConsScale * profC_peak; }
        dU_percent += (P_passing_C + P_local_C / 2) * ci.L / (ci.S * ci.factor);
        dU_noPV += (P_passing_C_noPV + P_local_C_noPV / 2) * ci.L / (ci.S * ci.factor);
      }
      uArr[t] = Un * (1 - dU_percent / 100);
      uArrNoPV[t] = Un * (1 - dU_noPV / 100);
    }
    // Build debug rows
    const tree_nc = new Map();
    {
      const src = pathAnalysis.source; const visited2 = new Set([src.id]); const queue2 = [{ id: src.id, path: [] }]; tree_nc.set(src.id, []);
      while (queue2.length) {
        const cur = queue2.shift();
        for (const cn of S.CN.filter(c => c.fromElId === cur.id || c.toElId === cur.id)) {
          const next = cn.fromElId === cur.id ? cn.toElId : cn.fromElId;
          if (!next || visited2.has(next)) continue;
          visited2.add(next); const np = [...cur.path, cn]; tree_nc.set(next, np); queue2.push({ id: next, path: np });
        }
      }
    }
    const cableDownstreamOf = (C_id) => {
      const result = [];
      for (const [dId, dInfo] of pathAnalysis.allCableInfo) {
        if (dId === C_id) continue;
        const dChildPath = tree_nc.get(dInfo.childId) || [];
        if (dChildPath.some(cn => cn.id === C_id)) result.push(dId);
      }
      return result;
    };
    const targetCableIds2 = new Set(pathData.segments.map(s => s.cableId));
    const targetPathCables = pathData.segments.map(s => pathAnalysis.allCableInfo.get(s.cableId));
    const beyondTargetCables = [];
    for (const [dId, dInfo] of pathAnalysis.allCableInfo) {
      if (targetCableIds2.has(dId)) continue;
      const dChildPath = tree_nc.get(dInfo.childId) || [];
      if (dChildPath.length <= pathData.segments.length) continue;
      let isPrefix = true;
      for (let k = 0; k < pathData.segments.length; k++) { if (dChildPath[k].id !== pathData.segments[k].cableId) { isPrefix = false; break; } }
      if (isPrefix) beyondTargetCables.push(dInfo);
    }
    beyondTargetCables.sort((a, b) => (tree_nc.get(a.childId)?.length || 0) - (tree_nc.get(b.childId)?.length || 0));
    const allRowsInfo = [...targetPathCables, ...beyondTargetCables];
    const lastTargetCableId = pathData.segments[pathData.segments.length - 1].cableId;
    const computeCableRowAt = (info_C, tIdx) => {
      const profC_peak_local = profConsRaw[tIdx] / profConsPeak;
      const ks_loc = getKs(info_C.N_local, 'RURAL');
      let P_cons_local = info_C.N_local * pMed * ks_loc * profC_peak_local;
      let P_pv_local = info_C.P_PV_local * profPV[tIdx] * csInj;
      let isClient = false, isExtra = false;
      if (mode === 'client' && info_C.cable.id === lastTargetCableId) { P_cons_local += pConsScale * profC_peak_local; P_pv_local += totalPV * profPV[tIdx] * csInj; isClient = true; }
      const extraHere = extraLoadAtNode.get(info_C.childId);
      if (extraHere) { P_cons_local += extraHere.ps * profC_peak_local; P_pv_local += extraHere.ppv * profPV[tIdx] * csInj; isExtra = true; }
      const P_local_net = P_cons_local - P_pv_local;
      let P_passing = 0;
      for (const dId of cableDownstreamOf(info_C.cable.id)) {
        const info_D = pathAnalysis.allCableInfo.get(dId); if (!info_D) continue;
        const ks_D = getKs(info_D.N_local, 'RURAL');
        let P_cons_D = info_D.N_local * pMed * ks_D * profC_peak_local;
        let P_pv_D = info_D.P_PV_local * profPV[tIdx] * csInj;
        if (mode === 'client' && info_D.cable.id === lastTargetCableId) { P_cons_D += pConsScale * profC_peak_local; P_pv_D += totalPV * profPV[tIdx] * csInj; }
        const extraD = extraLoadAtNode.get(info_D.childId);
        if (extraD) { P_cons_D += extraD.ps * profC_peak_local; P_pv_D += extraD.ppv * profPV[tIdx] * csInj; }
        P_passing += P_cons_D - P_pv_D;
      }
      const P_eff = P_passing + P_local_net / 2;
      const factor = info_C.tipRetea === 'Monofazat' ? 7.7 : (info_C.tipRetea === 'Bifazat' ? 20 : 46);
      const dU = (P_eff * info_C.L) / (info_C.S * factor);
      return { dU, P_cons_local, P_pv_local, P_passing, P_eff, ks_loc, isClient, isExtra };
    };
    const buildRowsAt = (tIdx) => {
      const dUMap = new Map();
      for (const info_C of allRowsInfo) { dUMap.set(info_C.cable.id, computeCableRowAt(info_C, tIdx)); }
      return allRowsInfo.map(info_C => {
        const r = dUMap.get(info_C.cable.id);
        const childPath = tree_nc.get(info_C.childId) || [];
        let cumul = 0; for (const cn of childPath) { const d2 = dUMap.get(cn.id); if (d2) cumul += d2.dU; }
        const isBeyondTarget = !targetCableIds2.has(info_C.cable.id);
        return { label: info_C.childLabel + (r.isClient ? ' (CLIENT)' : '') + (r.isExtra ? ' ★' : '') + (isBeyondTarget ? ' ⬇' : ''), L: info_C.L, S: info_C.S, N: info_C.N_local, ks: r.ks_loc, P_local: r.P_cons_local, P_pv: r.P_pv_local, P_passing: r.P_passing, P_eff: r.P_eff, dU: r.dU, cumul, isBeyondTarget, isExtra: r.isExtra };
      });
    };
    const formatHourLabel = (tIdx) => { const di = Math.floor(tIdx / 24), hi = tIdx % 24; return ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'][di] + ' ' + hi.toString().padStart(2, '0') + ':00'; };
    const showSecondTable = (mode === 'client' && totalPV > 0);
    if (showSecondTable) { prosDebugRows = buildRowsAt(peakPVHourIdx); prosDebugHourLabel = formatHourLabel(peakPVHourIdx); prosDebugRowsPeakCons = buildRowsAt(peakHourIdx); prosDebugHourLabelPeakCons = formatHourLabel(peakHourIdx); }
    else { prosDebugRows = buildRowsAt(peakHourIdx); prosDebugHourLabel = formatHourLabel(peakHourIdx); }
    window.prosExportDebugRows = { peakCons: prosDebugRowsPeakCons || (showSecondTable ? null : prosDebugRows), peakConsLabel: prosDebugHourLabelPeakCons || (showSecondTable ? '' : prosDebugHourLabel), peakPV: showSecondTable ? prosDebugRows : null, peakPVLabel: showSecondTable ? prosDebugHourLabel : '' };
  } else {
    const { r, x } = cableRes(Math.max(S_sec, 0.001));
    const R_path = r * (L || 1), X_path = x * (L || 1);
    const Un_safe = Un || 400;
    uArr = pNet.map(p => { const P_W = p * 1000, I = P_W / (Math.sqrt(3) * Un_safe * cosPhi); const u = Un_safe - Math.sqrt(3) * I * (R_path * cosPhi + X_path * sinPhi); return isFinite(u) ? u : Un_safe; });
  }
  const maxCons = Math.max(...pConsArr), minPNet = Math.min(...pNet);
  const maxInj = minPNet < 0 ? -minPNet : 0, hoursInverse = pNet.filter(p => p < 0).length;
  const uMax = Math.max(...uArr), uMin = Math.min(...uArr);
  const hOver = uArr.filter(u => u > Un * 1.1).length, hUnder = uArr.filter(u => u < Un * 0.9).length;
  let pvBenefitMax = 0, dU_zi_withPV_V = 0, dU_zi_noPV_V = 0;
  if (uArrNoPV) {
    for (let t = 0; t < 168; t++) {
      const diff = uArr[t] - uArrNoPV[t]; if (diff > pvBenefitMax) pvBenefitMax = diff;
      const hOfDay = t % 24;
      if (hOfDay >= 8 && hOfDay <= 18) { const dw = Un - uArr[t], dn2 = Un - uArrNoPV[t]; if (dw > dU_zi_withPV_V) dU_zi_withPV_V = dw; if (dn2 > dU_zi_noPV_V) dU_zi_noPV_V = dn2; }
    }
  }
  const dU_zi_withPV_percent = (dU_zi_withPV_V / Un) * 100, dU_zi_noPV_percent = (dU_zi_noPV_V / Un) * 100;
  window.prosTooltipData = { pCons: pConsArr, pPV: pPVArr, pNet, uArr, uArrNoPV: uArrNoPV || null, Un };
  const flowRange = Math.max(Math.abs(Math.min(...pNet)), Math.max(...pNet), 1) * 1.1;
  const chart1 = svgChart([{ data: pConsArr, color: '#00cfff', label: 'Consum' }, { data: pPVArr, color: '#ffc107', label: 'Producție PV' }, { data: pNet, color: '#ef4444', label: 'Flux net', dashed: true }], { w: Math.max(900, content.clientWidth - 30), h: 220, yMin: -flowRange, yMax: flowRange, yLabel: 'kW', zeroLine: true, legend: true });
  const uPad = Math.max(Math.abs(uMax - Un), Math.abs(Un - uMin), 15) * 1.3;
  const chart2Series = [{ data: uArr, color: '#2ecc71', label: 'U capăt (cu PV)' }];
  if (uArrNoPV && pvBenefitMax > 0.5) chart2Series.push({ data: uArrNoPV, color: '#94a3b8', label: 'U capăt fără PV', dashed: true });
  const chart2 = svgChart(chart2Series, { w: Math.max(900, content.clientWidth - 30), h: 220, yMin: Un - uPad, yMax: Un + uPad, yLabel: 'V', legend: true, bands: [{ min: Un * 1.1, max: Un + uPad, color: '#ef4444' }, { min: Un * 0.9, max: Un - uPad, color: '#ef4444' }, { min: Un * 1.05, max: Un * 1.1, color: '#eab308' }, { min: Un * 0.9, max: Un * 0.95, color: '#eab308' }, { min: Un * 0.95, max: Un * 1.05, color: '#2ecc71' }] });
  const warn = hOver > 0 ? `<span style="color:#ef4444;font-weight:700">⚠ ${hOver}h peste +10% Un</span>` : '<span style="color:#2ecc71">✓ fără supratensiune</span>';
  const warnDown = hUnder > 0 ? `<span style="color:#ef4444;font-weight:700">⚠ ${hUnder}h sub −10% Un</span>` : '<span style="color:#2ecc71">✓ fără subtensiune</span>';
  const prosEff = totalPV > 0 ? ((-Math.min(...pNet)) / totalPV * 100).toFixed(0) : '0';
  const tableRowsHtml = (rows) => rows.map(r => `<tr style="border-top:1px solid var(--border);${r.isExtra ? 'background:rgba(255,193,7,0.06)' : (r.isBeyondTarget ? 'background:rgba(148,163,184,0.06);opacity:0.85' : '')}"><td style="padding:3px 6px;${r.isBeyondTarget ? 'color:#94a3b8' : (r.isExtra ? 'color:#ffc107;font-weight:700' : '')}">${r.label}</td><td style="padding:3px 6px;text-align:right">${r.L}</td><td style="padding:3px 6px;text-align:right">${r.S}</td><td style="padding:3px 6px;text-align:right">${r.N}</td><td style="padding:3px 6px;text-align:right">${r.ks.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_local.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:${r.P_pv > 0 ? '#ffc107' : 'var(--text3)'}">${r.P_pv.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_passing.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_eff.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:#ff9f43;font-weight:700">${r.dU.toFixed(3)}%</td><td style="padding:3px 6px;text-align:right;color:#ef4444;font-weight:700">${r.cumul.toFixed(2)}%</td></tr>`).join('');
  const tableHead = '<thead><tr style="background:var(--bg3);color:var(--text3)"><th style="padding:4px 6px;text-align:left">Tronson</th><th style="padding:4px 6px">L (m)</th><th style="padding:4px 6px">S</th><th style="padding:4px 6px">N</th><th style="padding:4px 6px">ks</th><th style="padding:4px 6px">P_local (kW)</th><th style="padding:4px 6px">PV (kW)</th><th style="padding:4px 6px">P_passing</th><th style="padding:4px 6px">P_eff</th><th style="padding:4px 6px;color:#ff9f43">ΔU tronson</th><th style="padding:4px 6px;color:#ef4444">ΔU cumul</th></tr></thead>';
  content.innerHTML = `
    <div id="pros-tooltip" style="position:fixed;pointer-events:none;display:none;background:rgba(15,23,42,0.97);border:1px solid #ffc107;border-radius:6px;padding:8px 10px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;z-index:9999;min-width:180px;box-shadow:0 8px 24px rgba(0,0,0,0.6)"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode === 'client' ? 'Ps Consum client' : 'Consumatori total'}</div><div style="font-size:16px;font-weight:800;color:#00cfff">${mode === 'client' ? pConsScale.toFixed(1) + ' kW' : totalCons}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode === 'client' ? 'P_PV client' : 'Putere PV instalată'}</div><div style="font-size:16px;font-weight:800;color:#ffc107">${totalPV.toFixed(1)} kW</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max consum total</div><div style="font-size:16px;font-weight:800;color:#00cfff">${maxCons.toFixed(1)} kW</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max injecție</div><div style="font-size:16px;font-weight:800;color:${maxInj > 0 ? '#ef4444' : 'var(--text3)'}">${maxInj > 0 ? maxInj.toFixed(1) + ' kW' : '— fără injecție'}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Ore flux invers/săpt</div><div style="font-size:16px;font-weight:800;color:#ef4444">${hoursInverse}</div></div>
    </div>
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:6px 0 4px">Flux putere pe circuit (168h — o săptămână tipică)</div>
    ${chart1}
    ${prosDebugRowsPeakCons ? `<div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson — <span style="color:#ff9f43">${prosDebugHourLabelPeakCons}</span> <span style="color:#ef4444">(peak consum)</span></div><div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px"><table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">${tableHead}<tbody>${tableRowsHtml(prosDebugRowsPeakCons)}</tbody></table></div>` : ''}
    ${prosDebugRows ? `<div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson — <span style="color:#ffc107">${prosDebugHourLabel}</span></div><div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px"><table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">${tableHead}<tbody>${tableRowsHtml(prosDebugRows)}</tbody></table></div>` : ''}
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Tensiune la nodul de racordare (L=${L_real.toFixed(0)}m, ${sectionsInfo}) ${nodeInfo ? `&nbsp;&nbsp;<span style="color:#2ecc71;font-weight:400">${nodeInfo}</span>` : ''}</div>
    ${chart2}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:10px;font-size:10px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">U max / U min</div><div style="color:var(--text);font-weight:700">${uMax.toFixed(1)} V / ${uMin.toFixed(1)} V</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warn}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warnDown}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">Max injecție / P_PV instalat</div><div style="color:var(--text);font-weight:700">${prosEff}%</div></div>
      ${pvBenefitMax > 0.5 ? `<div style="background:var(--bg2);border:1px solid #2ecc71;border-radius:6px;padding:8px"><div style="color:#2ecc71;font-size:7.5px;text-transform:uppercase;font-weight:700">Beneficiu PV la amiază</div><div style="color:#2ecc71;font-weight:700">+${pvBenefitMax.toFixed(1)} V max</div></div><div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">ΔU max zi CU PV</div><div style="color:#2ecc71;font-weight:700">${dU_zi_withPV_V.toFixed(1)} V / ${dU_zi_withPV_percent.toFixed(2)}%</div></div><div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">ΔU max zi FĂRĂ PV</div><div style="color:#94a3b8;font-weight:700">${dU_zi_noPV_V.toFixed(1)} V / ${dU_zi_noPV_percent.toFixed(2)}%</div></div>` : ''}
    </div>`;
}

export function prosExportCSV() {
  const d = window.prosTooltipData;
  if (!d) { toast('Rulează analiza întâi', 'w'); return; }
  const mode = document.getElementById('pros-mode').value;
  const sezon = document.getElementById('pros-sezon').value;
  const nodeId = document.getElementById('pros-node')?.value || '';
  const targetEl = nodeId ? S.EL.find(e => e.id == nodeId) : null;
  const sep = ';', nl = '\r\n';
  const esc = v => { const s = String(v ?? ''); return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  let csv = 'ELECTROCAD PRO - ANALIZA PROSUMATOR' + nl + 'Generat' + sep + esc(new Date().toLocaleString('ro-RO')) + nl + nl;
  csv += 'PARAMETRI' + nl + 'Mod analiza' + sep + (mode === 'client' ? 'Client concentrat (ATR)' : 'Retea existenta') + nl;
  csv += 'Sezon' + sep + (sezon === 'vara' ? 'Vara (iulie)' : 'Iarna (decembrie)') + nl;
  const maxC = Math.max(...d.pCons), minN = Math.min(...d.pNet), maxInj = minN < 0 ? -minN : 0;
  const hInv = d.pNet.filter(p => p < 0).length, uMax = Math.max(...d.uArr), uMin = Math.min(...d.uArr);
  csv += nl + 'STATISTICI' + nl + 'Max consum total' + sep + maxC.toFixed(2) + ' kW' + nl + 'Max injectie' + sep + maxInj.toFixed(2) + ' kW' + nl + 'Ore flux invers' + sep + hInv + nl;
  csv += 'U max' + sep + uMax.toFixed(1) + ' V' + nl + 'U min' + sep + uMin.toFixed(1) + ' V' + nl;
  const rows = window.prosExportDebugRows;
  if (rows && rows.peakCons) { csv += nl + 'DEFALCARE PER TRONSON - PEAK CONSUM (' + esc(rows.peakConsLabel) + ')' + nl + 'Tronson' + sep + 'L (m)' + sep + 'S (mm2)' + sep + 'N' + sep + 'ks' + sep + 'P_local (kW)' + sep + 'PV (kW)' + sep + 'P_passing (kW)' + sep + 'P_eff (kW)' + sep + 'dU tronson (%)' + sep + 'dU cumul (%)' + nl; rows.peakCons.forEach(r => { csv += esc(r.label) + sep + r.L + sep + r.S + sep + r.N + sep + r.ks.toFixed(2) + sep + r.P_local.toFixed(2) + sep + r.P_pv.toFixed(2) + sep + r.P_passing.toFixed(2) + sep + r.P_eff.toFixed(2) + sep + r.dU.toFixed(3) + sep + r.cumul.toFixed(2) + nl; }); }
  csv += nl + 'SERIE TEMPORALA 168h' + nl + 'Ora_absoluta' + sep + 'Ziua' + sep + 'Ora_zi' + sep + 'Consum (kW)' + sep + 'PV (kW)' + sep + 'Flux net (kW)' + sep + 'U target (V)' + (d.uArrNoPV ? sep + 'U fara PV (V)' : '') + nl;
  const dn = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
  for (let t = 0; t < 168; t++) { const day = Math.floor(t / 24), hr = t % 24; csv += t + sep + dn[day] + sep + hr.toString().padStart(2, '0') + sep + d.pCons[t].toFixed(3) + sep + d.pPV[t].toFixed(3) + sep + d.pNet[t].toFixed(3) + sep + d.uArr[t].toFixed(2) + (d.uArrNoPV ? sep + d.uArrNoPV[t].toFixed(2) : '') + nl; }
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'prosumator_' + (targetEl ? (targetEl.label || 'nod').replace(/[^\w]/g, '_') : sezon) + '_' + new Date().toISOString().slice(0, 16).replace(/[:-]/g, '').replace('T', '_') + '.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('CSV exportat!', 'ok');
}

export function prosExportPDF() {
  if (!window.prosTooltipData) { toast('Rulează analiza întâi', 'w'); return; }
  const panel = document.getElementById('prosumator-panel');
  if (!panel) return;
  const origParent = panel.parentNode, origNextSibling = panel.nextSibling, origStyle = panel.getAttribute('style') || '';
  panel.setAttribute('style', 'position:static;display:block;width:100%;height:auto;max-height:none;overflow:visible;box-shadow:none;border:none;border-radius:0;background:white;color:black;padding:0;margin:0;');
  document.body.appendChild(panel);
  document.body.classList.add('pros-printing');
  const restore = () => { document.body.classList.remove('pros-printing'); panel.setAttribute('style', origStyle); if (origNextSibling) origParent.insertBefore(panel, origNextSibling); else origParent.appendChild(panel); };
  setTimeout(() => { const afterPrint = () => { window.removeEventListener('afterprint', afterPrint); restore(); }; window.addEventListener('afterprint', afterPrint); window.print(); setTimeout(() => { if (document.body.classList.contains('pros-printing')) restore(); }, 3000); }, 150);
}

// ── Window globals ──
window.prosChartHover = prosChartHover;
window.prosChartHoverHide = prosChartHoverHide;
window.prosAddExtraClient = prosAddExtraClient;
window.prosRemoveExtraClient = prosRemoveExtraClient;
window.prosUpdateExtraClient = prosUpdateExtraClient;
window.prosRenderExtraClients = prosRenderExtraClients;
window.prosRefreshNodeDropdown = prosRefreshNodeDropdown;
window.prosUpdateManualVisibility = prosUpdateManualVisibility;
window.prosToggleMode = prosToggleMode;
window.toggleProsumator = toggleProsumator;
window.openProsumatorModal = openProsumatorModal;
window.runProsumator = runProsumator;
window.prosExportCSV = prosExportCSV;
window.prosExportPDF = prosExportPDF;
