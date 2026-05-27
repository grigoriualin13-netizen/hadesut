import { S } from './state.js';
import { toast } from './utils.js';
import { MT_PHASE_PX } from './renderer.js';
import {
  CONDUCTORS, METEO_ZONES, calcLoads, findT0dim, calcSpan, solveStateEquation,
} from './calc-catenary.js';
import { getPoleData } from './pole-catalog.js';

// Mapare secțiune conductor [mm²] → cheie CONDUCTORS (SR EN 50182)
const SECTION_TO_ACSR = {
  35:  'ACSR 35/6',
  50:  'ACSR 50/8',
  70:  'ACSR 70/11',
  95:  'ACSR 95/16',
  120: 'ACSR 120/7',
  150: 'ACSR 150/8',
};

let _visible = false;
let _zone = 'D.b.4', _H = 7, _kpdim = null;

// Lungimea lanțului de izolatoare susținere MT 20kV [m] (LDI-20-II-CTS 40: 0.79m tipic)
// Contribuție la deviație: l_iz × sin(φ) = l_iz × g4_n/g6_n
const L_IZ_MT = 0.79;

// T_wind override per span — permite introducerea valorii din breviar CALMECO
// Key = "fromElId|toElId" (alfabetic sortat); Value = T_wind [daN] introdus manual
const _twindOverrides = new Map();

function spanKey(cns2) {
  const a = cns2[0].fromElId || '', b = cns2[0].toElId || '';
  return a && b ? (a < b ? `${a}|${b}` : `${b}|${a}`) : (cns2[0].id || '');
}

// sag components — unit-agnostic (daN + m or N + m, consistent within call)
function calcSag(L, g_vert, g_horiz, T0) {
  const fg    = (g_vert  * L * L) / (8 * T0);
  const delta = (g_horiz * L * L) / (8 * T0);
  const fr    = Math.sqrt(fg * fg + delta * delta);
  const theta = Math.atan2(delta, fg) * (180 / Math.PI);
  return { fg, delta, fr, theta };
}

// Computes span catenary data from section [mm²], span length [m], H [m] and optional T_max [daN]
function computeSpan(sec, L, H_span, T_max_horiz) {
  const key   = SECTION_TO_ACSR[sec] || 'ACSR 70/11';
  const cd    = CONDUCTORS[key];
  const met   = { ...METEO_ZONES[_zone], H: H_span ?? _H, Av: Math.max(L, 40), terrain: 'II' };
  const loads = calcLoads(cd, met);
  const opts  = _kpdim !== null ? { dh: 0, KP_dim: _kpdim } : { dh: 0 };
  let T0      = findT0dim(cd, loads, L, opts);
  if (T_max_horiz != null && T_max_horiz < T0) T0 = T_max_horiz;
  const EA    = cd.E * cd.A;
  // Two-step Lamé: T0_dim (-5+ch+v calcul) → T_norm_ref (-5+ch+v normate) → T_wind (+15+vmax normate)
  const T_norm_ref = solveStateEquation(loads.calcul.g7, T0, -5, loads.normate.g7, -5, L, EA, cd.alpha);
  const T_wind     = solveStateEquation(loads.normate.g7, T_norm_ref, -5, loads.normate.g6, 15, L, EA, cd.alpha);
  return { T0, T_wind, KP: T0 / cd.RTS, cd, loads };
}

function getMTConns() {
  const mtIds = new Set(S.EL
    .filter(e => e.type.startsWith('stalp_mt_') || e.type === 'separator_mt' || e.type === 'bara_statie_mt')
    .map(e => e.id));
  return S.CN.filter(cn =>
    cn.tipConductor === 'OL-AL' ||
    (cn.fromElId && mtIds.has(cn.fromElId)) ||
    (cn.toElId   && mtIds.has(cn.toElId))
  );
}

// Group connections by span (same pair of elements, regardless of order)
function groupBySpan(cns) {
  const map = new Map();
  cns.forEach(cn => {
    const a = cn.fromElId || '', b = cn.toElId || '';
    const key = a && b ? (a < b ? `${a}|${b}` : `${b}|${a}`) : cn.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(cn);
  });
  return map;
}

function elLabel(id) {
  const e = S.EL.find(x => x.id === id);
  return e ? (e.label || e.type) : '?';
}

// Returnează H_prindere medie și T_max_horiz pentru o deschidere, din catalogul stâlpilor.
function getSpanPoleData(fromElId, toElId) {
  const pL = getPoleData(S.EL.find(x => x.id === fromElId));
  const pR = getPoleData(S.EL.find(x => x.id === toElId));
  const HL = pL.H ?? _H;
  const HR = pR.H ?? _H;
  let T_max = null;
  if (pL.T_max !== null && pR.T_max !== null) T_max = Math.min(pL.T_max, pR.T_max);
  else if (pL.T_max !== null)                 T_max = pL.T_max;
  else if (pR.T_max !== null)                 T_max = pR.T_max;
  return { H: (HL + HR) / 2, HL, HR, T_max, consoleL: pL.consoleDesc, consoleR: pR.consoleDesc };
}

// ── Panel ──────────────────────────────────────────────────────────────────

export function openSagMT() {
  const p = document.getElementById('sag-mt-panel');
  if (p) { p.style.display = 'flex'; runSagMT(); }
}

export function closeSagMT() {
  const p = document.getElementById('sag-mt-panel');
  if (p) p.style.display = 'none';
}

export function runSagMT() {
  _zone  = document.getElementById('sag-zone')?.value  || 'D.b.4';
  _H     = parseFloat(document.getElementById('sag-h')?.value) || 7;
  _kpdim = parseFloat(document.getElementById('sag-kpdim')?.value) || null;
  const body = document.getElementById('sag-body');
  if (!body) return;

  const cns = getMTConns();

  if (cns.length === 0) {
    body.innerHTML = `<div style="color:var(--text3);font-size:9px;padding:14px;text-align:center">
      Nu există conexiuni MT pe schemă.<br>
      Desenează conexiuni cu <b>Tip conductor = OL-AL</b> între stâlpi MT.</div>`;
    if (_visible) renderSagLayer();
    return;
  }

  const th  = s  => `<th style="padding:4px 6px;border:1px solid var(--border2);font-size:8px;white-space:nowrap;background:var(--bg3);color:var(--text2);text-align:center">${s}</th>`;
  const tdr = (s, extra='') => `<td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:right;font-family:'JetBrains Mono',monospace${extra}">${s}</td>`;
  const tdc = (s, extra='') => `<td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:center${extra}">${s}</td>`;

  const spanMap = groupBySpan(cns);
  let rows = '';

  spanMap.forEach(cns2 => {
    const L   = parseFloat(cns2[0].length) || 0;
    const sec = parseFloat(cns2[0].sectiune) || 70;
    const key = spanKey(cns2);

    // Full catenary calculation (SR EN 50341-2-24, EDS nivel 1)
    const acsr_key = SECTION_TO_ACSR[sec] || 'ACSR 70/11';
    const cd = CONDUCTORS[acsr_key];
    const spanPole = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);

    let T0, KP, sag40, T_crit, delta, fg, T_wind_calc;
    try {
      const res = calcSpan(acsr_key,
        { zone: _zone, H: spanPole.H, Av: Math.max(L, 40), terrain: 'II' },
        { L, dh: 0 },
        _kpdim,
        spanPole.T_max);
      T0     = res.T0_dim;
      KP     = res.KP_dim * 100;
      sag40  = res.sag40;
      T_crit = res.T_crit;
      // Wind deviation at +15°C+vmax state — catenary + insulator string swing
      const row_wind = res.tension_table?.find(r => r.label === '+15+vmax');
      T_wind_calc = row_wind?.T_norm ?? T0;
      const T_wind_used = _twindOverrides.get(key) ?? T_wind_calc;
      const g4n = res.loads.normate.g4;
      const g6n = res.loads.normate.g6;
      delta = (g4n * L * L) / (8 * T_wind_used)         // deviație catenary
            + L_IZ_MT * (g4n / g6n);                     // + oscilare lanț izolator
      // Gravity sag at dimensioning state (normate g1, bare conductor)
      fg    = (res.loads.normate.g1 * L * L) / (8 * T0);
    } catch(e) {
      rows += `<tr><td colspan="11" style="color:#ef4444;padding:4px;font-size:8px">${acsr_key} — eroare calcul: ${e.message}</td></tr>`;
      return;
    }

    const fromLbl = elLabel(cns2[0].fromElId);
    const toLbl   = elLabel(cns2[0].toElId);
    const warnD   = delta > 1.5;
    const fazeLbl = cns2.map(cn => cn.faza || '?').sort().join('/');
    const KPcol   = KP > 45 ? ';color:#ef4444;font-weight:bold' : KP > 35 ? ';color:#ff9f43' : ';color:#22c55e';
    const isOvr   = _twindOverrides.has(key);
    const T_wind_disp = isOvr ? _twindOverrides.get(key) : T_wind_calc;
    const twindCell = `<td style="padding:2px 4px;border:1px solid var(--border2);text-align:center">
      <input type="number" class="twind-inp" data-key="${key}"
             placeholder="${T_wind_calc.toFixed(1)}"
             value="${isOvr ? T_wind_disp.toFixed(1) : ''}"
             min="0.1" max="9999" step="0.1"
             title="T_wind calculat: ${T_wind_calc.toFixed(1)} daN. Introdu valoarea din breviar CALMECO pt. a suprascrie."
             style="width:52px;border:1px solid ${isOvr ? '#ff9f43' : 'var(--border)'};
                    background:${isOvr ? 'rgba(255,159,67,0.15)' : 'var(--bg2)'};
                    color:${isOvr ? '#ff9f43' : 'var(--text2)'};
                    font-size:8px;padding:2px 3px;border-radius:3px;
                    font-family:'JetBrains Mono',monospace">
    </td>`;

    const tMaxActive = spanPole.T_max !== null && T0 >= spanPole.T_max * 0.99;
    const hInfo = `H=${spanPole.H.toFixed(1)}m (${spanPole.HL.toFixed(1)}+${spanPole.HR.toFixed(1)})`;
    const tMaxInfo = spanPole.T_max !== null ? ` | T_max=${spanPole.T_max}daN${tMaxActive?' ← ACTIV':''}` : '';

    rows += `<tr>
      ${tdc(`${fromLbl} → ${toLbl}`, ';font-size:7.5px;color:var(--text2)')}
      ${tdc(fazeLbl)}
      ${tdr(`${L.toFixed(0)} m`)}
      ${tdr(acsr_key, ';font-size:8px;color:var(--text2)')}
      <td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:right;font-family:'JetBrains Mono',monospace${KPcol}" title="${hInfo}${tMaxInfo}">${T0.toFixed(0)} daN${KP>45?' ⚠':''}${tMaxActive?' ⬇':''}</td>
      ${tdr(`${KP.toFixed(1)}%`, KPcol)}
      ${tdr(`${spanPole.H.toFixed(1)} m`, ';color:var(--text3);font-size:8px')}
      ${twindCell}
      ${tdr(`${sag40.toFixed(2)} m`, ';color:var(--accent)')}
      ${tdr(`${delta.toFixed(2)} m${warnD?' ⚠':''}`, warnD?';color:#ef4444;font-weight:bold':';color:#22c55e;font-weight:bold')}
      ${tdr(`${T_crit.toFixed(1)}°C`, ';color:var(--text2)')}
    </tr>`;
  });

  const metZ = METEO_ZONES[_zone] || {};
  body.innerHTML = `
    <table style="border-collapse:collapse;width:100%">
      <thead><tr>
        ${th('Tronson')}${th('Faze')}${th('L')}${th('Conductor')}
        ${th('T₀ [daN]')}${th('KP')}
        ${th('H [m]')}
        ${th('T_wind [daN]')}
        ${th('f_max 40°C [m]')}${th('δ vânt max [m]')}${th('T_crit [°C]')}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="font-size:7.5px;color:var(--text3);padding:5px 4px;border-top:1px solid var(--border)">
      ${(!_kpdim || _kpdim === 0.230) ? 'NTE 003/2015 (KP=23%)' : 'SR EN 50341-2-24 (KP=47%)'} | Zonă ${_zone}: Vb=${metZ.Vb??'?'}m/s · ch=${metZ.b_ch??'?'}mm · ρ=${metZ.rho_ch??'?'}kg/m³ | H=${_H}m &nbsp;|&nbsp;
      T₀=min(KP_dim·RTS, EDS, T_max_stalp) &nbsp;|&nbsp; H=per stâlp din catalog (hover T₀ pt. detalii) &nbsp;|&nbsp; f_max=40°C &nbsp;|&nbsp; δ=catenary(+15+vmax)+lanț(${L_IZ_MT}m) &nbsp;|&nbsp;
      <span style="color:#ff9f43">T_wind: placeholder=calculat, portocaliu=breviar CALMECO</span> &nbsp;|&nbsp;
      <span style="color:#a855f7">H implicit (pentru stâlpi fără catalog): ${_H}m</span>
    </div>`;

  // Attach T_wind override handlers (delegated — survives innerHTML rebuild)
  body.querySelectorAll('input.twind-inp').forEach(inp => {
    inp.addEventListener('change', () => {
      const k   = inp.dataset.key;
      const val = parseFloat(inp.value);
      if (val > 0 && isFinite(val)) {
        _twindOverrides.set(k, val);
      } else {
        _twindOverrides.delete(k);
      }
      runSagMT();
    });
  });

  if (_visible) renderSagLayer();
}

export function copySagMT() {
  const tbl = document.querySelector('#sag-body table');
  if (!tbl) { toast('Nu există date de copiat', 'ac'); return; }
  const lines = [...tbl.querySelectorAll('tr')]
    .map(tr => [...tr.querySelectorAll('th,td')].map(c => c.textContent.trim()).join('\t'));
  navigator.clipboard.writeText(lines.join('\n')).then(() => toast('Tabel copiat în clipboard', 'ok'));
}

export function exportSagCalcDetails() {
  _zone  = document.getElementById('sag-zone')?.value  || 'D.b.4';
  _H     = parseFloat(document.getElementById('sag-h')?.value) || 7;
  _kpdim = parseFloat(document.getElementById('sag-kpdim')?.value) || null;

  const cns = getMTConns();
  if (cns.length === 0) { toast('Nu există conexiuni MT pe schemă', 'ac'); return; }

  const spanMap    = groupBySpan(cns);
  const KP_dim_val = _kpdim !== null ? _kpdim : 0.470;
  const KP_30      = 0.240;
  const KP_15      = 0.155;
  const f_creep    = 0.95;
  const metZ       = METEO_ZONES[_zone] || {};

  const lines = [];
  lines.push('═══════════════════════════════════════════════════════════════════════════');
  lines.push('  CALCUL PAS CU PAS — SĂGEATĂ + DEVIAȚIE MT — LEA 20kV');
  lines.push('═══════════════════════════════════════════════════════════════════════════');
  lines.push(`  Zonă: ${_zone} | Vb=${metZ.Vb}m/s | ch=${metZ.b_ch}mm | ρ_ch=${metZ.rho_ch}kg/m³`);
  lines.push(`  H teren: ${_H}m | KP_dim: ${(KP_dim_val*100).toFixed(0)}% (${KP_dim_val >= 0.46 ? 'SR EN 50341-2-24:2019' : 'NTE 003/2015'})`);
  lines.push(`  EDS: KP_30=${(KP_30*100).toFixed(0)}% la -30°C | KP_15=${(KP_15*100).toFixed(0)}% la +15°C | f_creep=${f_creep}`);
  lines.push(`  Lanț izolatoare MT 20kV (LDI-20-II-CTS 40): L_iz = ${L_IZ_MT} m`);
  lines.push('');

  let idx = 0;
  spanMap.forEach(cns2 => {
    idx++;
    const L       = parseFloat(cns2[0].length) || 0;
    const sec     = parseFloat(cns2[0].sectiune) || 70;
    const key     = spanKey(cns2);
    const acsr_key = SECTION_TO_ACSR[sec] || 'ACSR 70/11';
    const fromLbl = elLabel(cns2[0].fromElId);
    const toLbl   = elLabel(cns2[0].toElId);
    const fazeLbl = cns2.map(cn => cn.faza || '?').sort().join('/');
    const Av      = Math.max(L, 40);

    const spanPoleExp = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);

    lines.push('───────────────────────────────────────────────────────────────────────────');
    lines.push(`  TRONSON ${idx}: ${fromLbl} → ${toLbl}   (Faze: ${fazeLbl})`);
    lines.push(`  Conductor: ${acsr_key}   L = ${L.toFixed(1)} m   Av = max(L,40) = ${Av.toFixed(1)} m`);
    const _cslL = spanPoleExp.consoleL ? ` [${spanPoleExp.consoleL}]` : '';
    const _cslR = spanPoleExp.consoleR ? ` [${spanPoleExp.consoleR}]` : '';
    lines.push(`  Stâlp stg. H=${spanPoleExp.HL.toFixed(1)}m${_cslL} | Stâlp dr. H=${spanPoleExp.HR.toFixed(1)}m${_cslR}`);
    lines.push(`  H_calcul = (${spanPoleExp.HL.toFixed(1)}+${spanPoleExp.HR.toFixed(1)})/2 = ${spanPoleExp.H.toFixed(2)}m${spanPoleExp.T_max!==null?' | T_max='+spanPoleExp.T_max+' daN':''}`);
    lines.push('');

    let res;
    try {
      res = calcSpan(acsr_key,
        { zone: _zone, H: spanPoleExp.H, Av, terrain: 'II' },
        { L, dh: 0 },
        _kpdim,
        spanPoleExp.T_max);
    } catch(e) {
      lines.push(`  *** EROARE CALCUL: ${e.message} ***`);
      lines.push('');
      return;
    }

    const { loads, T0_dim, tension_table } = res;
    const cd = CONDUCTORS[acsr_key];
    const EA = cd.E * cd.A;
    const b_ch = metZ.b_ch || 0;

    // ── [1] Încărcări ──────────────────────────────────────────────────────
    lines.push('  [1] ÎNCĂRCĂRI UNITARE [daN/m]');
    lines.push(`      Pw_max = ${loads.Pw_max.toFixed(4)} daN/m²  (Eurocode EN 1991-1-4, H=${spanPoleExp.H.toFixed(2)}m, teren II, Vb=${metZ.Vb}m/s)`);
    lines.push(`      GL     = ${loads.GL.toFixed(5)}  (factor deschidere: 1.631×Av^-0.2, Av=${Av.toFixed(1)}m)`);
    lines.push(`      d_bare = ${cd.d}mm = ${(cd.d/1000).toFixed(4)}m`);
    lines.push(`      d_ice  = ${cd.d}+2×${b_ch} = ${cd.d+2*b_ch}mm = ${((cd.d+2*b_ch)/1000).toFixed(4)}m`);
    lines.push('      NORMATE (limita caracteristică / sarcini fizice):');
    lines.push(`        g1_n = gc = ${loads.normate.g1.toFixed(4)} daN/m`);
    lines.push(`        g2_n = g2_phys/2.857 = ${loads.normate.g2.toFixed(4)} daN/m  [chiciură ${b_ch}mm]`);
    lines.push(`        g3_n = g1_n+g2_n = ${loads.normate.g3.toFixed(4)} daN/m  [cond.+chiciură]`);
    lines.push(`        g4_n = Pw_max×d_bare×GL/2.5 = ${loads.normate.g4.toFixed(4)} daN/m  [vânt max ↔]`);
    lines.push(`        g5_n = Pw_ice×d_ice×GL×1.1/2.5 = ${loads.normate.g5.toFixed(4)} daN/m  [vânt+chiciură ↔]`);
    lines.push(`        g6_n = √(g1_n²+g4_n²) = √(${loads.normate.g1.toFixed(4)}²+${loads.normate.g4.toFixed(4)}²) = ${loads.normate.g6.toFixed(4)} daN/m`);
    lines.push(`        g7_n = √(g3_n²+g5_n²) = √(${loads.normate.g3.toFixed(4)}²+${loads.normate.g5.toFixed(4)}²) = ${loads.normate.g7.toFixed(4)} daN/m  [stare dim. normate]`);
    lines.push('      CALCUL (pentru verificare structuri):');
    lines.push(`        g4_c = Pw_max×d_bare×GL = ${loads.calcul.g4.toFixed(4)} daN/m  [= g4_n×2.5]`);
    lines.push(`        g7_c = √(g3_c²+g5_c²) = ${loads.calcul.g7.toFixed(4)} daN/m  [stare dim. calcul]`);
    lines.push('');

    // ── [2] T₀ dimensionant ────────────────────────────────────────────────
    // Replicate findT0dim intermediate steps (dh=0 → V independent of T_h)
    const T_cl_dim  = KP_dim_val * cd.RTS * f_creep;
    const V_dim     = loads.calcul.g7 * L / 2;
    const disc_dim  = T_cl_dim * T_cl_dim - V_dim * V_dim;
    const T0_direct = disc_dim > 0 ? Math.sqrt(disc_dim) : T_cl_dim * 0.95;

    const T_cl_30 = KP_30 * cd.RTS * f_creep;
    const V_30    = loads.normate.g1 * L / 2;
    const disc_30 = T_cl_30 * T_cl_30 - V_30 * V_30;
    const T_h_30  = disc_30 > 0 ? Math.sqrt(disc_30) : T_cl_30 * 0.95;
    const T0_from30 = solveStateEquation(
      loads.normate.g1, T_h_30, -30, loads.calcul.g7, -5, L, EA, cd.alpha);

    const T_cl_15 = KP_15 * cd.RTS * f_creep;
    const V_15    = loads.normate.g1 * L / 2;
    const disc_15 = T_cl_15 * T_cl_15 - V_15 * V_15;
    const T_h_15  = disc_15 > 0 ? Math.sqrt(disc_15) : T_cl_15 * 0.95;
    const T0_from15 = solveStateEquation(
      loads.normate.g1, T_h_15, +15, loads.calcul.g7, -5, L, EA, cd.alpha);

    const minT0 = Math.min(T0_direct, T0_from30, T0_from15);
    const gov   = Math.abs(T0_dim - T0_direct) < 0.1 ? 'KP_dim' :
                  Math.abs(T0_dim - T0_from30) < 0.1 ? 'EDS -30°C' : 'EDS +15°C';

    lines.push('  [2] TRACȚIUNEA DIMENSIONANTĂ T₀  (starea -5°C+ch+v, calcul)');
    lines.push(`      RTS=${cd.RTS} daN | A=${cd.A} mm² | E=${cd.E} daN/mm² | α=${(cd.alpha*1e6).toFixed(1)}e-6/°C | EA=${EA.toFixed(0)} daN`);
    lines.push('');
    lines.push(`      a) Limita KP_dim=${(KP_dim_val*100).toFixed(0)}%  (starea -5°C+ch+v calcul):`);
    lines.push(`         T_clema = KP_dim×RTS×f_creep = ${KP_dim_val}×${cd.RTS}×${f_creep} = ${T_cl_dim.toFixed(3)} daN`);
    lines.push(`         V = g7_c×L/2 = ${loads.calcul.g7.toFixed(4)}×${(L/2).toFixed(2)} = ${V_dim.toFixed(4)} daN`);
    lines.push(`         T0_direct = √(T_cl²−V²) = √(${T_cl_dim.toFixed(3)}²−${V_dim.toFixed(4)}²) = ${T0_direct.toFixed(3)} daN`);
    lines.push('');
    lines.push(`      b) EDS la -30°C  (conductor gol, KP_30=${(KP_30*100).toFixed(0)}%):`);
    lines.push(`         T_cl_30 = ${KP_30}×${cd.RTS}×${f_creep} = ${T_cl_30.toFixed(3)} daN`);
    lines.push(`         V = g1_n×L/2 = ${loads.normate.g1.toFixed(4)}×${(L/2).toFixed(2)} = ${V_30.toFixed(4)} daN`);
    lines.push(`         T_h_30 = √(T_cl_30²−V²) = ${T_h_30.toFixed(3)} daN`);
    lines.push(`         Lamé: (-30°C, q=g1_n=${loads.normate.g1.toFixed(4)}) → (-5°C, q=g7_c=${loads.calcul.g7.toFixed(4)}), L=${L}m`);
    lines.push(`         T0_from30 = ${T0_from30.toFixed(3)} daN`);
    lines.push('');
    lines.push(`      c) EDS la +15°C  (conductor gol, KP_15=${(KP_15*100).toFixed(0)}%):`);
    lines.push(`         T_cl_15 = ${KP_15}×${cd.RTS}×${f_creep} = ${T_cl_15.toFixed(3)} daN`);
    lines.push(`         V = g1_n×L/2 = ${loads.normate.g1.toFixed(4)}×${(L/2).toFixed(2)} = ${V_15.toFixed(4)} daN`);
    lines.push(`         T_h_15 = √(T_cl_15²−V²) = ${T_h_15.toFixed(3)} daN`);
    lines.push(`         Lamé: (+15°C, q=g1_n=${loads.normate.g1.toFixed(4)}) → (-5°C, q=g7_c=${loads.calcul.g7.toFixed(4)}), L=${L}m`);
    lines.push(`         T0_from15 = ${T0_from15.toFixed(3)} daN`);
    lines.push('');
    const hasT_maxExp = spanPoleExp.T_max !== null;
    const minEDS = Math.min(T0_direct, T0_from30, T0_from15);
    const t_maxLbl = hasT_maxExp ? `, ${spanPoleExp.T_max.toFixed(0)}` : '';
    lines.push(`      T₀ = min(T0_direct, T0_from30, T0_from15${hasT_maxExp ? ', T_max_stalp' : ''})`);
    lines.push(`         = min(${T0_direct.toFixed(3)}, ${T0_from30.toFixed(3)}, ${T0_from15.toFixed(3)}${t_maxLbl})`);
    lines.push(`         = ${T0_dim.toFixed(3)} daN  ← ${hasT_maxExp && spanPoleExp.T_max <= minEDS + 0.1 ? 'T_max_stalp ← ACTIV' : gov + ' guvernează'}`);
    lines.push(`      KP = T₀/RTS = ${T0_dim.toFixed(3)}/${cd.RTS} = ${(T0_dim/cd.RTS*100).toFixed(2)}%`);
    lines.push('');

    // ── [3] Lanțul Lamé ────────────────────────────────────────────────────
    const rowNormRef  = tension_table.find(r => r.label === '-5+ch+v');
    const rowWind     = tension_table.find(r => r.label === '+15+vmax');
    const T_norm_ref  = rowNormRef?.T_norm ?? 0;
    const T_wind_calc = rowWind?.T_norm ?? T0_dim;

    const K1 = T0_dim - (loads.calcul.g7**2 * L**2 * EA) / (24 * T0_dim**2);
    const C1 = (loads.normate.g7**2 * L**2 * EA) / 24;
    const K2 = T_norm_ref - (loads.normate.g7**2 * L**2 * EA) / (24 * T_norm_ref**2)
                           - EA * cd.alpha * 20;
    const C2 = (loads.normate.g6**2 * L**2 * EA) / 24;

    lines.push('  [3] LANȚUL LAMÉ (2 pași)  —  T₂³ − K·T₂² − C = 0');
    lines.push('      Pas 1: T₀_dim (calcul, -5°C+ch+v) → T_norm_ref (normate, -5°C+ch+v)');
    lines.push(`        q1=g7_c=${loads.calcul.g7.toFixed(4)} daN/m, T1=T₀=${T0_dim.toFixed(3)} daN, θ1=-5°C`);
    lines.push(`        q2=g7_n=${loads.normate.g7.toFixed(4)} daN/m, θ2=-5°C  → Δθ=0, EA·α·Δθ=0`);
    lines.push(`        K = ${T0_dim.toFixed(3)} − (${loads.calcul.g7.toFixed(4)}²·${L}²·${EA.toFixed(0)})/(24·${T0_dim.toFixed(3)}²) = ${K1.toFixed(3)}`);
    lines.push(`        C = (${loads.normate.g7.toFixed(4)}²·${L}²·${EA.toFixed(0)})/24 = ${C1.toFixed(3)}`);
    lines.push(`        T_norm_ref = ${T_norm_ref.toFixed(4)} daN  (σ = ${(T_norm_ref/cd.A).toFixed(5)} daN/mm²)`);
    lines.push('');
    lines.push('      Pas 2: T_norm_ref (normate, -5°C+ch+v) → T_wind (normate, +15°C+vmax)');
    lines.push(`        q1=g7_n=${loads.normate.g7.toFixed(4)} daN/m, T1=${T_norm_ref.toFixed(4)} daN, θ1=-5°C`);
    lines.push(`        q2=g6_n=${loads.normate.g6.toFixed(4)} daN/m, θ2=+15°C  → Δθ=20°C`);
    lines.push(`        EA·α·Δθ = ${EA.toFixed(0)}×${(cd.alpha*1e6).toFixed(1)}e-6×20 = ${(EA*cd.alpha*20).toFixed(3)} daN`);
    lines.push(`        K = ${T_norm_ref.toFixed(4)} − (${loads.normate.g7.toFixed(4)}²·L²·EA)/(24·T²) − ${(EA*cd.alpha*20).toFixed(3)} = ${K2.toFixed(3)}`);
    lines.push(`        C = (${loads.normate.g6.toFixed(4)}²·${L}²·${EA.toFixed(0)})/24 = ${C2.toFixed(3)}`);
    lines.push(`        T_wind_calc = ${T_wind_calc.toFixed(4)} daN  (σ = ${(T_wind_calc/cd.A).toFixed(5)} daN/mm²)`);
    lines.push('');

    // ── [4] Deviație δ ──────────────────────────────────────────────────────
    const isOvr      = _twindOverrides.has(key);
    const T_wind_used = isOvr ? _twindOverrides.get(key) : T_wind_calc;
    const g4n        = loads.normate.g4;
    const g6n        = loads.normate.g6;
    const delta_cat  = (g4n * L * L) / (8 * T_wind_used);
    const delta_iz   = L_IZ_MT * (g4n / g6n);
    const delta_tot  = delta_cat + delta_iz;

    lines.push('  [4] DEVIAȚIE LATERALĂ δ  (starea +15°C+vmax normate)');
    if (isOvr) {
      lines.push(`      ⚠ T_wind OVERRIDE: ${T_wind_used.toFixed(2)} daN (introdus manual — calculat: ${T_wind_calc.toFixed(4)} daN)`);
    } else {
      lines.push(`      T_wind = ${T_wind_used.toFixed(4)} daN  (calculat prin Lamé)`);
    }
    lines.push(`      g4_n = ${g4n.toFixed(4)} daN/m  (vânt orizontal normat)`);
    lines.push(`      g6_n = ${g6n.toFixed(4)} daN/m  (rez. cond.+vânt normat)`);
    lines.push('');
    lines.push('      δ_catenary = g4_n × L² / (8 × T_wind)');
    lines.push(`               = ${g4n.toFixed(4)} × ${L.toFixed(1)}² / (8 × ${T_wind_used.toFixed(4)})`);
    lines.push(`               = ${g4n.toFixed(4)} × ${(L*L).toFixed(2)} / ${(8*T_wind_used).toFixed(4)}`);
    lines.push(`               = ${delta_cat.toFixed(5)} m`);
    lines.push('');
    lines.push('      δ_lanț    = L_iz × (g4_n / g6_n)');
    lines.push(`               = ${L_IZ_MT} × (${g4n.toFixed(4)} / ${g6n.toFixed(4)})`);
    lines.push(`               = ${L_IZ_MT} × ${(g4n/g6n).toFixed(6)}`);
    lines.push(`               = ${delta_iz.toFixed(5)} m`);
    lines.push('');
    lines.push(`      δ_total   = ${delta_cat.toFixed(5)} + ${delta_iz.toFixed(5)}`);
    lines.push(`               = ${delta_tot.toFixed(5)} m  →  ${delta_tot.toFixed(2)} m`);
    lines.push('');

    // ── [5] Săgeată gabarit ────────────────────────────────────────────────
    const row40 = tension_table.find(r => r.label === '+40°C');
    if (row40) {
      const T40 = row40.T_norm;
      lines.push('  [5] SĂGEATĂ GABARIT la +40°C');
      lines.push(`      T_40°C = ${T40.toFixed(4)} daN  (Lamé: g7_n,-5°C → g1_n,+40°C)`);
      lines.push('      f_max = g1_n × L² / (8 × T_40°C)');
      lines.push(`            = ${loads.normate.g1.toFixed(4)} × ${(L*L).toFixed(2)} / (8 × ${T40.toFixed(4)})`);
      lines.push(`            = ${((loads.normate.g1*L*L)/(8*T40)).toFixed(5)} m  →  ${res.sag40.toFixed(2)} m`);
      lines.push(`      T_crit = ${res.T_crit.toFixed(2)}°C  (temp. la care sag_termic = sag_chiciură)`);
    }
    lines.push('');
  });

  lines.push('═══════════════════════════════════════════════════════════════════════════');
  lines.push('  ElectroCAD Pro v12  —  Calcul conform SR EN 50341-2-24:2019');
  lines.push('═══════════════════════════════════════════════════════════════════════════');

  const text = lines.join('\n');
  const win = window.open('', '_blank', 'width=960,height=720,scrollbars=yes');
  if (!win) {
    navigator.clipboard.writeText(text)
      .then(() => toast('Detalii copiate în clipboard (popup blocat)', 'ok'));
    return;
  }
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>Calcul Detaliat — Săgeată + Deviație MT</title>
    <style>
      *{box-sizing:border-box}
      body{background:#0f1117;color:#c9d8ff;font-family:'Courier New',Courier,monospace;
           font-size:12.5px;padding:0;margin:0;line-height:1.55}
      .bar{position:sticky;top:0;background:#0f1117;border-bottom:1px solid #1e2a4a;
           padding:8px 16px;display:flex;gap:8px;align-items:center;z-index:10}
      .bar span{font-size:11px;color:#5a7aaa;margin-left:4px}
      button{padding:6px 14px;border:none;border-radius:5px;cursor:pointer;
             font-size:12px;font-weight:700;font-family:inherit}
      .bc{background:#3b82f6;color:#fff} .bc:hover{background:#2563eb}
      .bp{background:#374151;color:#d1d5db} .bp:hover{background:#4b5563}
      pre{padding:16px;margin:0;white-space:pre}
    </style>
  </head><body>
  <div class="bar">
    <button class="bc" id="cbtn" onclick="copyAll()">📋 Copiază tot</button>
    <button class="bp" onclick="window.print()">🖨 Print / PDF</button>
    <span>ElectroCAD Pro v12 — Calcul detaliat Săgeată + Deviație MT</span>
  </div>
  <pre id="ct"></pre>
  <script>
    document.getElementById('ct').textContent=${JSON.stringify(text)};
    function copyAll(){
      navigator.clipboard.writeText(document.getElementById('ct').textContent).then(()=>{
        const b=document.getElementById('cbtn');
        b.textContent='✓ Copiat!';
        setTimeout(()=>{b.textContent='📋 Copiază tot'},1800);
      });
    }
  </script></body></html>`);
  win.document.close();
}

// ── Chain builder: orders spans into connected sequences pole→pole→… ──────

function buildSpanChains(spanMap) {
  const adj = new Map(); // poleId → [{ nbr, cns2 }]
  spanMap.forEach(cns2 => {
    const a = cns2[0].fromElId, b = cns2[0].toElId;
    if (!a || !b) return;
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push({ nbr: b, cns2 });
    adj.get(b).push({ nbr: a, cns2 });
  });
  const visited = new Set();
  const chains  = [];
  function walkFrom(prevId, startId) {
    const chain = [];
    let prev = prevId, cur = startId;
    while (cur && !visited.has(cur)) {
      visited.add(cur);
      const edges = adj.get(cur) || [];
      const next  = edges.find(e => e.nbr !== prev && !visited.has(e.nbr));
      if (prev !== null) {
        const edge = (adj.get(prev) || []).find(e => e.nbr === cur);
        if (edge) chain.push({ fromId: prev, toId: cur, cns2: edge.cns2,
          reversed: edge.cns2[0].fromElId !== prev });
      }
      prev = cur; cur = next ? next.nbr : null;
    }
    return chain;
  }
  // Start from end-poles (degree 1) so chains are fully ordered
  adj.forEach((edges, id) => {
    if (!visited.has(id) && edges.length === 1) {
      visited.add(id);
      const c = walkFrom(id, edges[0].nbr);
      if (c.length) chains.push(c);
    }
  });
  // Remaining (cycles / isolated spans)
  adj.forEach((edges, id) => {
    if (!visited.has(id) && edges.length) {
      visited.add(id);
      const c = walkFrom(id, edges[0].nbr);
      if (c.length) chains.push(c);
    }
  });
  return chains;
}

// ── Overlay vizual pe schemă ───────────────────────────────────────────────

export function toggleSagOverlay(on) {
  _visible = on;
  renderSagLayer();
}

export function renderSagLayer() {
  const layer = document.getElementById('SAG');
  if (!layer) return;
  layer.innerHTML = '';
  if (!_visible) return;

  const cns = getMTConns();
  if (!cns.length) return;

  const dark     = !S.lightMode;
  const outlineC = dark ? 'rgba(210,225,255,0.82)' : 'rgba(20,50,120,0.78)';
  const hatchC   = dark ? 'rgba(190,210,255,0.28)' : 'rgba(20,50,120,0.20)';
  const dimC     = dark ? '#90b8ff' : '#1e3a8a';
  const arrC     = dark ? '#90b8ff' : '#1e3a8a';
  // Safety zone colours (amber/orange — distinct from the deviation eye)
  const safeC      = dark ? 'rgba(251,191,36,0.80)' : 'rgba(180,90,0,0.82)';
  const safeFillC  = dark ? 'rgba(251,191,36,0.05)' : 'rgba(251,191,36,0.04)';
  const safeHatchC = dark ? 'rgba(251,191,36,0.20)' : 'rgba(180,90,0,0.18)';

  // SVG defs (clip paths + arrow markers)
  const svgEl = document.getElementById('svg');
  let defsEl  = svgEl?.querySelector('.sag-defs-group');
  if (defsEl) defsEl.remove();
  defsEl = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defsEl.setAttribute('class', 'sag-defs-group');
  svgEl?.insertBefore(defsEl, svgEl.firstChild);

  // Arrow markers: blue for δ annotation, amber for safety zone
  defsEl.innerHTML = `
    <marker id="sag-arr" markerWidth="7" markerHeight="5"
            refX="6" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="${arrC}"/>
    </marker>
    <marker id="sag-arr2" markerWidth="7" markerHeight="5"
            refX="1" refY="2.5" orient="auto">
      <polygon points="7 0, 0 2.5, 7 5" fill="${arrC}"/>
    </marker>
    <marker id="safe-arr" markerWidth="7" markerHeight="5"
            refX="6" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="${safeC}"/>
    </marker>`;

  let clipIdx = 0;
  const spanMap = groupBySpan(cns);

  // ── Safety corridor: one connected polygon per chain (NTE 003, art.137) ──
  const SAFETY_M = 12;
  const ppmGlobal = S.pxPerMeter || 5;
  const safetyPx  = SAFETY_M * ppmGlobal;
  const chains = buildSpanChains(spanMap);

  chains.forEach(chain => {
    const upperPts = [], lowerPts = [], midData = [];
    chain.forEach(({ fromId, toId, cns2, reversed }) => {
      if (!cns2[0].path?.length) return;
      const starts = cns2.map(cn => cn.path[0]);
      const ends   = cns2.map(cn => cn.path[cn.path.length - 1]);
      let p0 = { x: starts.reduce((s,p)=>s+p.x,0)/starts.length,
                 y: starts.reduce((s,p)=>s+p.y,0)/starts.length };
      let p1 = { x: ends.reduce((s,p)=>s+p.x,0)/ends.length,
                 y: ends.reduce((s,p)=>s+p.y,0)/ends.length };
      const _fe = S.EL.find(e => e.id === cns2[0].fromElId);
      const _te = S.EL.find(e => e.id === cns2[0].toElId);
      if (_fe?.type?.startsWith('stalp_mt_')) p0 = { x: _fe.x, y: _fe.y };
      if (_te?.type?.startsWith('stalp_mt_')) p1 = { x: _te.x, y: _te.y };
      if (reversed) [p0, p1] = [p1, p0];
      const dx = p1.x-p0.x, dy = p1.y-p0.y, len = Math.hypot(dx,dy);
      if (len < 5) return;
      const ux = dx/len, uy = dy/len, nx = -uy, ny = ux;
      upperPts.push({ x: p0.x+safetyPx*nx, y: p0.y+safetyPx*ny });
      upperPts.push({ x: p1.x+safetyPx*nx, y: p1.y+safetyPx*ny });
      lowerPts.push({ x: p0.x-safetyPx*nx, y: p0.y-safetyPx*ny });
      lowerPts.push({ x: p1.x-safetyPx*nx, y: p1.y-safetyPx*ny });
      const hasFazaC = cns2.some(cn => cn.faza);
      const nProjsC  = hasFazaC
        ? cns2.map(cn => ({ R: MT_PHASE_PX, S: 0, T: -MT_PHASE_PX })[cn.faza] ?? 0)
        : [0];
      const hsC = Math.max(0, ...nProjsC.map(Math.abs));
      midData.push({ cx:(p0.x+p1.x)/2, cy:(p0.y+p1.y)/2, nx, ny, ux, uy, hs: hsC });
    });
    if (upperPts.length < 2) return;

    // Polygon: upper edge forward + lower edge reversed = closed corridor
    const allPts = [...upperPts, ...[...lowerPts].reverse()];
    const polyD  = allPts.map((p,i) => `${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

    // Hatch clip
    const zid     = `sz${clipIdx++}`;
    const zcp     = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
    zcp.setAttribute('id', zid);
    const zcpPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    zcpPath.setAttribute('d', polyD);
    zcp.appendChild(zcpPath);
    defsEl.appendChild(zcp);
    const xs = allPts.map(p=>p.x), ys = allPts.map(p=>p.y);
    const bx0=Math.min(...xs)-4, by0=Math.min(...ys)-4;
    const bx1=Math.max(...xs)+4, by1=Math.max(...ys)+4;
    const bh=by1-by0, bw=bx1-bx0, zspc=Math.max(20,safetyPx/5);
    let zLines = '';
    for (let k=-bh; k<=bw+bh; k+=zspc)
      zLines += `<line x1="${(bx0+k).toFixed(1)}" y1="${by0.toFixed(1)}" x2="${(bx0+k+bh).toFixed(1)}" y2="${by1.toFixed(1)}"/>`;

    // Annotation: middle span of the chain — R and T conductor → corridor boundary
    const mid = midData[Math.floor(midData.length/2)];
    const { cx:mcx, cy:mcy, nx:mnx, ny:mny, ux:mux, uy:muy, hs:mhs } = mid;
    // R-side: conductor rest position → R-side corridor boundary
    const rCX = mcx + mhs * mnx,      rCY = mcy + mhs * mny;
    const rBX = mcx + safetyPx * mnx, rBY = mcy + safetyPx * mny;
    // T-side: conductor rest position → T-side corridor boundary
    const tCX = mcx - mhs * mnx,      tCY = mcy - mhs * mny;
    const tBX = mcx - safetyPx * mnx, tBY = mcy - safetyPx * mny;
    // Label on R-side, offset along span
    const zLX = ((rCX+rBX)/2 + 10*mux).toFixed(1);
    const zLY = ((rCY+rBY)/2 + 10*muy).toFixed(1);

    const zg = document.createElementNS('http://www.w3.org/2000/svg','g');
    zg.setAttribute('pointer-events','none');
    zg.innerHTML = `
      <path d="${polyD}" fill="${safeFillC}" stroke="${safeC}" stroke-width="1.2" stroke-dasharray="8,5"/>
      <g clip-path="url(#${zid})">
        <g stroke="${safeHatchC}" stroke-width="0.8" fill="none">${zLines}</g>
      </g>
      <line x1="${(rCX-5*mux).toFixed(1)}" y1="${(rCY-5*muy).toFixed(1)}"
            x2="${(rCX+5*mux).toFixed(1)}" y2="${(rCY+5*muy).toFixed(1)}"
            stroke="${safeC}" stroke-width="1.6" opacity="0.9"/>
      <line x1="${rCX.toFixed(1)}" y1="${rCY.toFixed(1)}"
            x2="${rBX.toFixed(1)}" y2="${rBY.toFixed(1)}"
            stroke="${safeC}" stroke-width="1.0" marker-end="url(#safe-arr)"/>
      <line x1="${(tCX-5*mux).toFixed(1)}" y1="${(tCY-5*muy).toFixed(1)}"
            x2="${(tCX+5*mux).toFixed(1)}" y2="${(tCY+5*muy).toFixed(1)}"
            stroke="${safeC}" stroke-width="1.6" opacity="0.9"/>
      <line x1="${tCX.toFixed(1)}" y1="${tCY.toFixed(1)}"
            x2="${tBX.toFixed(1)}" y2="${tBY.toFixed(1)}"
            stroke="${safeC}" stroke-width="1.0" marker-end="url(#safe-arr)"/>
      <text x="${zLX}" y="${zLY}" font-size="9" fill="${safeC}"
            font-family="JetBrains Mono,monospace" font-weight="600"
            text-anchor="start">12m</text>`;
    layer.appendChild(zg);
  });

  // ── Per-span: deviation eye + δ annotation ────────────────────────────────
  spanMap.forEach(cns2 => {
    if (!cns2[0].path?.length) return;
    const L = parseFloat(cns2[0].length) || 0;
    if (L < 1) return;

    // ── Start/end la centrul stâlpului (stalp_mt_*) sau media terminalelor ──
    const starts = cns2.map(cn => cn.path[0]);
    const ends   = cns2.map(cn => cn.path[cn.path.length - 1]);
    const _feEye = S.EL.find(e => e.id === cns2[0].fromElId);
    const _teEye = S.EL.find(e => e.id === cns2[0].toElId);
    const p0 = _feEye?.type?.startsWith('stalp_mt_')
      ? { x: _feEye.x, y: _feEye.y }
      : { x: starts.reduce((s, p) => s + p.x, 0) / starts.length,
          y: starts.reduce((s, p) => s + p.y, 0) / starts.length };
    const p1 = _teEye?.type?.startsWith('stalp_mt_')
      ? { x: _teEye.x, y: _teEye.y }
      : { x: ends.reduce((s, p) => s + p.x, 0) / ends.length,
          y: ends.reduce((s, p) => s + p.y, 0) / ends.length };

    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const spanPx = Math.hypot(dx, dy);
    if (spanPx < 10) return;

    const ux = dx / spanPx, uy = dy / spanPx;   // unit tangent
    const nx = -uy,          ny =  ux;            // unit normal (perpendicular)

    // ── Group center at mid-span ──
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;

    // ── Perpendicular spread ──
    // If conductors have faza (RST), use the render-time phase offset (R=+MT_PHASE_PX, T=−MT_PHASE_PX)
    // so halfSpread matches what is actually drawn on screen.
    const hasFaza = cns2.some(cn => cn.faza);
    const normalProjs = hasFaza
      ? cns2.map(cn => ({ R: MT_PHASE_PX, S: 0, T: -MT_PHASE_PX })[cn.faza] ?? 0)
      : cns2.map(cn => {
          const mx = (cn.path[0].x + cn.path[cn.path.length - 1].x) / 2;
          const my = (cn.path[0].y + cn.path[cn.path.length - 1].y) / 2;
          return (mx - cx) * nx + (my - cy) * ny;
        });
    const halfSpread = Math.max(0, ...normalProjs.map(Math.abs));

    // ── Deviation of the EXTREME conductor ──
    const sec = parseFloat(cns2[0].sectiune) || 70;
    const spanPoleRender = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);
    const { T0, T_wind: T_wind_calc, loads } = computeSpan(sec, L, spanPoleRender.H, spanPoleRender.T_max);
    const T_wind = _twindOverrides.get(spanKey(cns2)) ?? T_wind_calc;
    const { delta: delta_cond } = calcSag(L, loads.normate.g1, loads.normate.g4, T_wind);
    const delta = delta_cond + L_IZ_MT * (loads.normate.g4 / loads.normate.g6);

    const ppm     = S.pxPerMeter || 5;
    const deltaPx = delta * ppm;

    // Eye half-height = spread to outer conductor + deviation of that conductor
    // Ensure minimum visual size so the eye is always clearly visible
    const minVis  = Math.max(14, halfSpread * 0.55);
    const eyeHalf = halfSpread + Math.max(deltaPx, minVis);

    // ── Eye shape: anchored at R (+ side) and T (− side) at both poles ──
    // R-side: arc from p0_R → p1_R bulging out by delta at midspan
    // T-side: arc from p1_T → p0_T bulging out by delta on the other side
    // Straight closing segments at each pole connect R↔T.
    const p0R = { x: p0.x + halfSpread * nx, y: p0.y + halfSpread * ny };
    const p1R = { x: p1.x + halfSpread * nx, y: p1.y + halfSpread * ny };
    const p0T = { x: p0.x - halfSpread * nx, y: p0.y - halfSpread * ny };
    const p1T = { x: p1.x - halfSpread * nx, y: p1.y - halfSpread * ny };
    const c1x = cx + eyeHalf * nx, c1y = cy + eyeHalf * ny; // R outer apex
    const c2x = cx - eyeHalf * nx, c2y = cy - eyeHalf * ny; // T outer apex
    const eyeD = [
      `M ${p0R.x.toFixed(2)},${p0R.y.toFixed(2)}`,
      `Q ${c1x.toFixed(2)},${c1y.toFixed(2)} ${p1R.x.toFixed(2)},${p1R.y.toFixed(2)}`,
      `L ${p1T.x.toFixed(2)},${p1T.y.toFixed(2)}`,
      `Q ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p0T.x.toFixed(2)},${p0T.y.toFixed(2)}`,
      'Z',
    ].join(' ');

    // ── Clip path (for deviation eye) ──
    const cid = `sc${clipIdx++}`;
    const cp  = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    cp.setAttribute('id', cid);
    const cpPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cpPath.setAttribute('d', eyeD);
    cp.appendChild(cpPath);
    defsEl.appendChild(cp);

    // ── Diagonal hatching (45°, clipped to eye) ──
    const pad = eyeHalf + 4;
    const bx0 = Math.min(p0.x, p1.x) - pad, by0 = Math.min(p0.y, p1.y) - pad;
    const bx1 = Math.max(p0.x, p1.x) + pad, by1 = Math.max(p0.y, p1.y) + pad;
    const bh  = by1 - by0, bw = bx1 - bx0;
    const spc = Math.max(7, eyeHalf / 8);
    let hLines = '';
    for (let k = -bh; k <= bw + bh; k += spc) {
      hLines += `<line x1="${(bx0+k).toFixed(1)}" y1="${by0.toFixed(1)}" x2="${(bx0+k+bh).toFixed(1)}" y2="${by1.toFixed(1)}"/>`;
    }

    // ── Symmetric dimension annotations: both extreme conductors → eye boundary ──
    // Use halfSpread directly so annotations are always on the R and T conductors,
    // never on S (center). Both sides are drawn so the measured quantity is unambiguous.
    const s1x = cx + halfSpread * nx,  s1y = cy + halfSpread * ny;   // R-side conductor
    const s2x = cx - halfSpread * nx,  s2y = cy - halfSpread * ny;   // T-side conductor
    const e1x = cx + eyeHalf  * nx,    e1y = cy + eyeHalf  * ny;     // R-side eye boundary
    const e2x = cx - eyeHalf  * nx,    e2y = cy - eyeHalf  * ny;     // T-side eye boundary

    // Label at midpoint of the R-side arrow, offset along span direction
    const labMx = (s1x + e1x) / 2;
    const labMy = (s1y + e1y) / 2;
    const labX  = (labMx + 12 * ux).toFixed(1);
    const labY  = (labMy + 12 * uy).toFixed(1);
    const deltaM = delta.toFixed(2);

    // ── Draw everything ──
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('pointer-events', 'none');
    g.innerHTML = `
      <g clip-path="url(#${cid})">
        <g stroke="${hatchC}" stroke-width="0.9" fill="none">${hLines}</g>
      </g>
      <path d="${eyeD}" fill="none" stroke="${outlineC}" stroke-width="1.8"/>
      <line x1="${(s1x - 6*ux).toFixed(1)}" y1="${(s1y - 6*uy).toFixed(1)}"
            x2="${(s1x + 6*ux).toFixed(1)}" y2="${(s1y + 6*uy).toFixed(1)}"
            stroke="${dimC}" stroke-width="1.8" opacity="0.9"/>
      <line x1="${(s2x - 6*ux).toFixed(1)}" y1="${(s2y - 6*uy).toFixed(1)}"
            x2="${(s2x + 6*ux).toFixed(1)}" y2="${(s2y + 6*uy).toFixed(1)}"
            stroke="${dimC}" stroke-width="1.8" opacity="0.9"/>
      <line x1="${s1x.toFixed(1)}" y1="${s1y.toFixed(1)}"
            x2="${e1x.toFixed(1)}" y2="${e1y.toFixed(1)}"
            stroke="${dimC}" stroke-width="1.2"
            marker-end="url(#sag-arr)"/>
      <line x1="${s2x.toFixed(1)}" y1="${s2y.toFixed(1)}"
            x2="${e2x.toFixed(1)}" y2="${e2y.toFixed(1)}"
            stroke="${dimC}" stroke-width="1.2"
            marker-end="url(#sag-arr)"/>
      <text x="${labX}" y="${labY}"
            font-size="9" fill="${dimC}" font-family="JetBrains Mono,monospace"
            font-weight="700" text-anchor="start">δ=${deltaM}m</text>`;
    layer.appendChild(g);
  });
}
