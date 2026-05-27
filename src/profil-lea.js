import { S } from './state.js';
import { calcSpan } from './calc-catenary.js';
import { getPoleData } from './pole-catalog.js';

// Mapare secțiune [mm²] → cheie CONDUCTORS (identică cu sag-mt.js)
const SECTION_TO_ACSR = {
  35:  'ACSR 35/6',
  50:  'ACSR 50/8',
  70:  'ACSR 70/11',
  95:  'ACSR 95/16',
  120: 'ACSR 120/7',
  150: 'ACSR 150/8',
};

// Stare internă — sincronizată din panoul sag-mt la fiecare run
let _zone      = 'D.b.4';
let _H_default = 7;
let _kpdim     = null;

// ── Helpers comuni ──────────────────────────────────────────────────────────

function elLabel(id) {
  const e = S.EL.find(x => x.id === id);
  return e?.label || e?.type?.replace('stalp_mt_', '')?.toUpperCase() || id;
}

function getMTConns() {
  const mtIds = new Set(
    S.EL.filter(e => e.type?.startsWith('stalp_mt_')).map(e => e.id)
  );
  return S.CN.filter(cn =>
    cn.tipConductor === 'OL-AL' ||
    (cn.fromElId && mtIds.has(cn.fromElId)) ||
    (cn.toElId   && mtIds.has(cn.toElId))
  );
}

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

function buildSpanChains(spanMap) {
  const adj = new Map();
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
        if (edge) chain.push({ fromId: prev, toId: cur, cns2: edge.cns2 });
      }
      prev = cur; cur = next ? next.nbr : null;
    }
    return chain;
  }
  // Preferăm să plecăm din capete de linie (grad 1) pentru lanțuri ordonate
  adj.forEach((edges, id) => {
    if (!visited.has(id) && edges.length === 1) {
      visited.add(id);
      const c = walkFrom(id, edges[0].nbr);
      if (c.length) chains.push(c);
    }
  });
  // Rămase (bucle, deschideri izolate)
  adj.forEach((edges, id) => {
    if (!visited.has(id) && edges.length) {
      visited.add(id);
      const c = walkFrom(id, edges[0].nbr);
      if (c.length) chains.push(c);
    }
  });
  return chains;
}

// ── Extragere date profil ───────────────────────────────────────────────────

/**
 * Returnează un array de lanțuri (chains), fiecare cu:
 *   { label, poles: [{id,label,H,cota_teren}], spans: [{L_m,acsr_key,sag10,sag40,...}] }
 */
export function extractProfilData() {
  const allCns = getMTConns().filter(cn => cn.fromElId && cn.toElId);
  if (!allCns.length) return [];
  const spanMap  = groupBySpan(allCns);
  const rawChains = buildSpanChains(spanMap);

  return rawChains.map(chain => {
    if (!chain.length) return null;

    // Stâlpii în ordine
    const poleIds = [chain[0].fromId, ...chain.map(s => s.toId)];
    const poles   = poleIds.map(id => {
      const el = S.EL.find(e => e.id === id);
      const pd = getPoleData(el);
      return {
        id,
        label:      elLabel(id),
        H:          pd.H ?? _H_default,
        cota_teren: el?.cota_teren ?? 0,
        hasCota:    el?.cota_teren != null,
      };
    });

    // Calculul săgeților per deschidere
    const spans = chain.map((seg, i) => {
      const cns2     = seg.cns2;
      const L        = parseFloat(cns2[0].length) || 0;
      const sec      = parseFloat(cns2[0].sectiune) || 70;
      const acsr_key = SECTION_TO_ACSR[sec] || 'ACSR 70/11';
      const H_span   = (poles[i].H + poles[i + 1].H) / 2;

      // Diferența de nivel reală între punctele de prindere (dh > 0 = dreapta mai sus)
      const attach_l = poles[i].cota_teren + poles[i].H;
      const attach_r = poles[i + 1].cota_teren + poles[i + 1].H;
      const dh       = poles[i].hasCota && poles[i + 1].hasCota ? attach_r - attach_l : 0;

      const pdL  = getPoleData(S.EL.find(e => e.id === seg.fromId));
      const pdR  = getPoleData(S.EL.find(e => e.id === seg.toId));
      const tL   = pdL.T_max, tR = pdR.T_max;
      const T_max = (tL != null && tR != null) ? Math.min(tL, tR) : (tL ?? tR ?? null);

      let sag10 = null, sag40 = null, T40 = null, q40 = null, T10 = null, q10 = null;
      let T0_dim = null, KP_calc = null, T_crit = null;
      try {
        const res = calcSpan(
          acsr_key,
          { zone: _zone, H: H_span, Av: Math.max(L, 40), terrain: 'II' },
          { L, dh },
          _kpdim,
          T_max
        );
        sag40   = res.sag40;
        T0_dim  = res.T0_dim;
        KP_calc = res.KP_dim;
        T_crit  = res.T_crit;
        const r40 = res.tension_table.find(r => r.label === '+40°C');
        const r10 = res.tension_table.find(r => r.label === '+10°C');
        if (r40) { sag40 = r40.sag_max; T40 = r40.T_norm; q40 = r40.q_norm; }
        if (r10) { sag10 = r10.sag_max; T10 = r10.T_norm; q10 = r10.q_norm; }
      } catch (_) { /* deschidere fără date suficiente */ }

      return { fromId: seg.fromId, toId: seg.toId, L_m: L, dh, acsr_key,
               sag10, sag40, T40, q40, T10, q10, T0_dim, KP_calc, T_crit };
    });

    return {
      label: `${poles[0].label} → ${poles[poles.length - 1].label}`,
      poles,
      spans,
      hasCota: poles.some(p => p.hasCota),
    };
  }).filter(Boolean);
}

// ── Constructor SVG profil ──────────────────────────────────────────────────

const MG = { top: 50, right: 60, bot: 80, left: 68 };
const IW = 860;
const IH = 210;
const N_CAT = 40; // puncte per parabolă
const GABARIT_MIN = 7.0; // NTE 003/2015 art. 137 — teren categorie I/II/III [m]

/**
 * Returnează un string SVG pentru un lanț.
 * Parabola conductor: y(t) = chord(t) − sag × 4t(1−t),  t ∈ [0,1]
 */
export function buildProfilSVG(chain) {
  const { poles, spans, hasCota } = chain;
  if (!poles.length || !spans.length) return '';

  // Poziții cumulate X [m]
  const xm = [0];
  spans.forEach(sp => xm.push(xm[xm.length - 1] + (sp.L_m || 0)));
  const L_total = xm[xm.length - 1];
  if (L_total < 1) return '';

  const px_h = IW / L_total;

  // Limite elevație
  let y_top = -Infinity, y_bot = Infinity;
  poles.forEach(p => {
    const ct = p.cota_teren;
    y_top = Math.max(y_top, ct + p.H + 1.5);
    y_bot = Math.min(y_bot, ct - 2);
  });
  spans.forEach((sp, i) => {
    if (sp.sag40 == null) return;
    const a_l = poles[i].cota_teren + poles[i].H;
    const a_r = poles[i + 1].cota_teren + poles[i + 1].H;
    y_bot = Math.min(y_bot, (a_l + a_r) / 2 - sp.sag40 - 1.5);
  });
  if (!isFinite(y_top)) y_top = 15;
  if (!isFinite(y_bot)) y_bot = 0;
  if (y_top - y_bot < 5) y_top = y_bot + 10;

  const elev_range = y_top - y_bot;
  const px_v = IH / elev_range;
  const W = IW + MG.left + MG.right;
  const H = IH + MG.top + MG.bot;

  const sx = xm_ => MG.left + xm_ * px_h;
  const sy = el_ => MG.top + (y_top - el_) * px_v;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" `
        + `viewBox="0 0 ${W} ${H}" style="background:#0f172a;font-family:'Barlow Condensed',sans-serif">`;

  // ── Grilă orizontală la cote rotunde
  const gridStep = elev_range > 50 ? 10 : elev_range > 20 ? 5 : 2;
  const gridStart = Math.ceil(y_bot / gridStep) * gridStep;
  s += '<g>';
  for (let e = gridStart; e <= y_top + 0.01; e += gridStep) {
    const yg = sy(e);
    if (yg < MG.top - 2 || yg > MG.top + IH + 2) continue;
    const ygs = yg.toFixed(1);
    s += `<line x1="${MG.left}" y1="${ygs}" x2="${MG.left + IW}" y2="${ygs}" stroke="#1e293b" stroke-width="1"/>`;
    s += `<text x="${(MG.left - 5).toFixed(1)}" y="${(yg + 3).toFixed(1)}" text-anchor="end" `
       + `font-size="8.5" fill="#475569">${e}m</text>`;
  }
  s += '</g>';

  // ── Profil teren (numai dacă cotele sunt introduse)
  if (hasCota) {
    const tPts = poles.map((p, i) => `${sx(xm[i]).toFixed(1)},${sy(p.cota_teren).toFixed(1)}`).join(' ');
    const yBase = (MG.top + IH + 4).toFixed(1);
    s += `<polygon points="${tPts} ${sx(L_total).toFixed(1)},${yBase} ${sx(0).toFixed(1)},${yBase}" `
       + `fill="rgba(92,60,20,.5)" stroke="none"/>`;
    s += `<polyline points="${tPts}" fill="none" stroke="#92400e" stroke-width="2"/>`;
    // Linia gabarit minim 7m (teren + 7m la fiecare stâlp)
    const gPts = poles.map((p, i) => `${sx(xm[i]).toFixed(1)},${sy(p.cota_teren + GABARIT_MIN).toFixed(1)}`).join(' ');
    s += `<polyline points="${gPts}" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity=".55"/>`;
    s += `<text x="${(MG.left + 4).toFixed(1)}" y="${(sy(poles[0].cota_teren + GABARIT_MIN) - 3).toFixed(1)}" `
       + `font-size="7.5" fill="#facc15" opacity=".7">gabarit ${GABARIT_MIN}m</text>`;
  } else {
    // Linie de referință teren la cota 0
    const y0 = sy(0).toFixed(1);
    s += `<line x1="${MG.left}" y1="${y0}" x2="${MG.left + IW}" y2="${y0}" `
       + `stroke="#92400e" stroke-width="1.2" stroke-dasharray="4,4" opacity=".5"/>`;
    s += `<text x="${(MG.left - 5).toFixed(1)}" y="${(sy(0) + 3).toFixed(1)}" text-anchor="end" `
       + `font-size="7.5" fill="#92400e" opacity=".7">0m</text>`;
  }

  // ── Curbe catenary per deschidere (formula exactă q·x·(L-x)/(2T))
  spans.forEach((sp, i) => {
    if (!sp.L_m) return;
    const a_l = poles[i].cota_teren + poles[i].H;
    const a_r = poles[i + 1].cota_teren + poles[i + 1].H;

    // Funcție catenary: exact cu q și T, fallback parabola simetrică
    const catPts = (q_n, T_n, sag_fb) => Array.from({ length: N_CAT + 1 }, (_, k) => {
      const t = k / N_CAT;
      const x_m  = t * sp.L_m;
      const chord = a_l + (a_r - a_l) * t;
      const sag_x = (q_n != null && T_n != null)
        ? q_n * x_m * (sp.L_m - x_m) / (2 * T_n)
        : (sag_fb ?? 0) * 4 * t * (1 - t);
      return `${sx(xm[i] + x_m).toFixed(1)},${sy(chord - sag_x).toFixed(1)}`;
    }).join(' ');

    // +40°C — portocaliu (starea de gabarit)
    if (sp.sag40 != null) {
      s += `<polyline points="${catPts(sp.q40, sp.T40, sp.sag40)}" fill="none" stroke="#f97316" stroke-width="2"/>`;

      // Poziția săgeții maxime (x_max): corectă pentru dh≠0
      const x_max40 = (sp.q40 && sp.T40)
        ? sp.L_m / 2 - sp.dh * sp.T40 / (sp.q40 * sp.L_m)
        : sp.L_m / 2;
      const t_max40 = Math.max(0.01, Math.min(0.99, x_max40 / sp.L_m));
      const chord_max = a_l + (a_r - a_l) * t_max40;
      const cond40_max = chord_max - sp.sag40;

      const x_sag_px = sx(xm[i] + x_max40);
      const y40      = sy(cond40_max);
      s += `<text x="${x_sag_px.toFixed(1)}" y="${(y40 + 12).toFixed(1)}" text-anchor="middle" `
         + `font-size="8.5" fill="#f97316">f₄₀=${sp.sag40.toFixed(2)} m</text>`;

      // Gabarit față de teren la sag_max (numai dacă cotele sunt introduse)
      if (hasCota) {
        const terrain_at_xmax = poles[i].cota_teren
          + (poles[i + 1].cota_teren - poles[i].cota_teren) * t_max40;
        const clearance = cond40_max - terrain_at_xmax;
        const ok        = clearance >= GABARIT_MIN;
        const col       = ok ? '#22c55e' : '#ef4444';
        const y_terr    = sy(terrain_at_xmax);
        const xg        = x_sag_px;

        s += `<line x1="${xg.toFixed(1)}" y1="${y_terr.toFixed(1)}" x2="${xg.toFixed(1)}" y2="${y40.toFixed(1)}" `
           + `stroke="${col}" stroke-width="1.3" stroke-dasharray="3,2"/>`;
        s += `<polygon points="${xg.toFixed(1)},${y40.toFixed(1)} `
           + `${(xg - 3.5).toFixed(1)},${(y40 + 7).toFixed(1)} `
           + `${(xg + 3.5).toFixed(1)},${(y40 + 7).toFixed(1)}" fill="${col}"/>`;
        s += `<polygon points="${xg.toFixed(1)},${y_terr.toFixed(1)} `
           + `${(xg - 3.5).toFixed(1)},${(y_terr - 7).toFixed(1)} `
           + `${(xg + 3.5).toFixed(1)},${(y_terr - 7).toFixed(1)}" fill="${col}"/>`;
        const y_lbl = (y40 + y_terr) / 2;
        s += `<rect x="${(xg - 22).toFixed(1)}" y="${(y_lbl - 8).toFixed(1)}" width="44" height="13" `
           + `rx="3" fill="${ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}" stroke="${col}" stroke-width=".6"/>`;
        s += `<text x="${xg.toFixed(1)}" y="${(y_lbl + 2).toFixed(1)}" text-anchor="middle" `
           + `font-size="8.5" fill="${col}" font-weight="700">g=${clearance.toFixed(2)}m${ok ? '' : ' ⚠'}</text>`;
      }
    }

    // +10°C — verde, linie întreruptă
    if (sp.sag10 != null) {
      s += `<polyline points="${catPts(sp.q10, sp.T10, sp.sag10)}" fill="none" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="7,3"/>`;
      const x_max10 = (sp.q10 && sp.T10)
        ? sp.L_m / 2 - sp.dh * sp.T10 / (sp.q10 * sp.L_m)
        : sp.L_m / 2;
      const t_max10 = Math.max(0.01, Math.min(0.99, x_max10 / sp.L_m));
      const y10 = sy(a_l + (a_r - a_l) * t_max10 - sp.sag10);
      s += `<text x="${sx(xm[i] + x_max10).toFixed(1)}" y="${(y10 - 5).toFixed(1)}" text-anchor="middle" `
         + `font-size="8.5" fill="#4ade80">f₁₀=${sp.sag10.toFixed(2)} m</text>`;
    }

    // Etichetă deschidere + conductor sub grafic
    const xmid_px = sx(xm[i] + sp.L_m / 2);
    s += `<text x="${xmid_px.toFixed(1)}" y="${(MG.top + IH + 18).toFixed(1)}" `
       + `text-anchor="middle" font-size="9" fill="#94a3b8">${sp.L_m.toFixed(0)} m</text>`;
    s += `<text x="${xmid_px.toFixed(1)}" y="${(MG.top + IH + 30).toFixed(1)}" `
       + `text-anchor="middle" font-size="7.5" fill="#475569">${sp.acsr_key}`
       + `${sp.dh !== 0 ? ` Δh=${sp.dh > 0 ? '+' : ''}${sp.dh.toFixed(1)}m` : ''}</text>`;
    // Separator deschidere
    s += `<line x1="${sx(xm[i]).toFixed(1)}" y1="${MG.top + IH}" `
       + `x2="${sx(xm[i]).toFixed(1)}" y2="${MG.top + IH + 12}" stroke="#334155" stroke-width="1"/>`;
  });
  // Separator capăt + distanță cumulată
  s += `<line x1="${sx(L_total).toFixed(1)}" y1="${MG.top + IH}" `
     + `x2="${sx(L_total).toFixed(1)}" y2="${MG.top + IH + 12}" stroke="#334155" stroke-width="1"/>`;

  // ── Scară X: distanțe cumulate la fiecare stâlp
  poles.forEach((p, i) => {
    const xp  = sx(xm[i]);
    const cum = xm[i].toFixed(0);
    s += `<text x="${xp.toFixed(1)}" y="${(MG.top + IH + 44).toFixed(1)}" `
       + `text-anchor="middle" font-size="7.5" fill="#64748b">${cum} m</text>`;
    s += `<line x1="${xp.toFixed(1)}" y1="${(MG.top + IH + 34).toFixed(1)}" `
       + `x2="${xp.toFixed(1)}" y2="${(MG.top + IH + 37).toFixed(1)}" stroke="#475569" stroke-width="1"/>`;
  });

  // ── Simboluri stâlpi (desen peste catenary)
  poles.forEach((p, i) => {
    const xp     = sx(xm[i]);
    const ct     = p.cota_teren;
    const yt     = sy(ct);
    const ya     = sy(ct + p.H);
    const attach = ct + p.H;    // cota prindere [m asl]
    const isLast = i === poles.length - 1;
    const side   = isLast ? -1 : 1;
    const anchor = isLast ? 'end' : 'start';
    const offX   = side * 5;

    // Fusul stâlpului
    s += `<line x1="${xp.toFixed(1)}" y1="${yt.toFixed(1)}" x2="${xp.toFixed(1)}" y2="${ya.toFixed(1)}" `
       + `stroke="#c07000" stroke-width="3"/>`;
    // Punct de prindere
    s += `<circle cx="${xp.toFixed(1)}" cy="${ya.toFixed(1)}" r="4" fill="#fbbf24" stroke="none"/>`;
    // Etichetă stâlp (deasupra punctului de prindere)
    s += `<text x="${xp.toFixed(1)}" y="${(ya - 8).toFixed(1)}" text-anchor="middle" `
       + `font-size="9.5" fill="#fbbf24" font-weight="700">${p.label}</text>`;
    // Cota prindere [m asl] — lângă punctul de prindere (portocaliu)
    if (p.hasCota) {
      s += `<text x="${(xp + offX).toFixed(1)}" y="${(ya - 1).toFixed(1)}" `
         + `text-anchor="${anchor}" font-size="7.5" fill="#fb923c" font-weight="600">`
         + `${attach.toFixed(1)}</text>`;
    }
    // Cota teren la baza stâlpului (maro)
    if (p.hasCota) {
      s += `<text x="${(xp + offX).toFixed(1)}" y="${(yt + 11).toFixed(1)}" `
         + `text-anchor="${anchor}" font-size="7.5" fill="#92400e">${ct.toFixed(1)} m</text>`;
    }
    // H prindere lângă fus (mijloc fus)
    s += `<text x="${(xp + offX).toFixed(1)}" y="${((yt + ya) / 2 + 3).toFixed(1)}" `
       + `text-anchor="${anchor}" font-size="7" fill="#c07000" opacity=".8">H=${p.H}m</text>`;
  });

  // ── Ramă + titlu
  s += `<rect x="${MG.left}" y="${MG.top}" width="${IW}" height="${IH}" `
     + `fill="none" stroke="rgba(148,163,184,.2)" stroke-width=".8"/>`;
  s += `<text x="${(W / 2).toFixed(1)}" y="${(MG.top - 14).toFixed(1)}" `
     + `text-anchor="middle" font-size="12.5" fill="#e2e8f0" font-weight="700">`
     + `Profil în lung LEA 20kV — ${chain.label}</text>`;

  // Avertisment dacă nu sunt cote teren
  if (!hasCota) {
    s += `<text x="${(W / 2).toFixed(1)}" y="${(MG.top - 2).toFixed(1)}" `
       + `text-anchor="middle" font-size="8.5" fill="#f59e0b">`
       + `⚠ Cotele de teren nu sunt introduse — profilul terenului nu este afișat</text>`;
  }

  // Legendă
  const lx = MG.left + 8, ly = MG.top + 16;
  s += `<line x1="${lx}" y1="${ly}" x2="${lx + 20}" y2="${ly}" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="6,3"/>`;
  s += `<text x="${lx + 24}" y="${ly + 3}" font-size="8.5" fill="#4ade80">+10°C</text>`;
  s += `<line x1="${lx + 65}" y1="${ly}" x2="${lx + 85}" y2="${ly}" stroke="#f97316" stroke-width="2"/>`;
  s += `<text x="${lx + 89}" y="${ly + 3}" font-size="8.5" fill="#f97316">+40°C (gabarit)</text>`;
  s += `<line x1="${lx + 175}" y1="${ly}" x2="${lx + 195}" y2="${ly}" stroke="#92400e" stroke-width="2"/>`;
  s += `<text x="${lx + 199}" y="${ly + 3}" font-size="8.5" fill="#92400e">teren</text>`;
  if (hasCota) {
    s += `<line x1="${lx + 240}" y1="${ly}" x2="${lx + 260}" y2="${ly}" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity=".7"/>`;
    s += `<text x="${lx + 264}" y="${ly + 3}" font-size="8.5" fill="#facc15" opacity=".8">gabarit ${GABARIT_MIN}m</text>`;
    s += `<line x1="${lx + 340}" y1="${ly - 4}" x2="${lx + 340}" y2="${ly + 4}" stroke="#22c55e" stroke-width="1.5"/>`;
    s += `<text x="${lx + 344}" y="${ly + 3}" font-size="8.5" fill="#22c55e">g≥7m ✓</text>`;
    s += `<line x1="${lx + 390}" y1="${ly - 4}" x2="${lx + 390}" y2="${ly + 4}" stroke="#ef4444" stroke-width="1.5"/>`;
    s += `<text x="${lx + 394}" y="${ly + 3}" font-size="8.5" fill="#ef4444">g&lt;7m ⚠</text>`;
  }

  // Scale + notă dh
  const scH = Math.max(1, Math.round(L_total / IW * 1000));
  const scV = Math.max(1, Math.round(elev_range / IH * 100));
  const hasDh = spans.some(sp => sp.dh && Math.abs(sp.dh) > 0.1);
  s += `<text x="${(W - MG.right + 4).toFixed(1)}" y="${(MG.top + IH + 60).toFixed(1)}" `
     + `text-anchor="start" font-size="7.5" fill="#475569">`
     + `Sc. horiz. 1:${scH} | Sc. vert. 1:${scV}`
     + `${hasDh ? ' | catenary exactă (dh≠0)' : ''}</text>`;
  // Notă cotă prindere
  if (hasCota) {
    s += `<text x="${(MG.left).toFixed(1)}" y="${(MG.top + IH + 60).toFixed(1)}" `
       + `font-size="7.5" fill="#fb923c" opacity=".8">`
       + `<tspan fill="#fb923c">■</tspan> cota prindere [m asl]  `
       + `<tspan fill="#92400e">■</tspan> cota teren [m asl]</text>`;
  }

  s += '</svg>';
  return s;
}

// ── Tabel sumar per deschidere ──────────────────────────────────────────────

function buildSummaryTable(chain) {
  const { poles, spans, hasCota } = chain;
  if (!spans.length) return '';

  const th = (txt, extra = '') =>
    `<th style="padding:4px 8px;border:1px solid #1e293b;background:#0f172a;`
    + `color:#94a3b8;font-weight:600;font-size:8.5px;text-align:center;white-space:nowrap${extra}">${txt}</th>`;
  const td = (txt, col = '#cbd5e1', bold = false, extra = '') =>
    `<td style="padding:3px 7px;border:1px solid #1e293b;text-align:center;`
    + `font-size:8.5px;color:${col};${bold ? 'font-weight:700;' : ''}${extra}">${txt}</td>`;

  let head = '<tr>'
    + th('Tronson')
    + th('L [m]')
    + (hasCota ? th('Δh [m]') : '')
    + th('Conductor')
    + th('T₀ dim [daN]')
    + th('KP [%]')
    + th('f₄₀ [m]')
    + th('f₁₀ [m]')
    + (hasCota ? th('Gabarit [m]') : '')
    + '</tr>';

  let rows = spans.map((sp, i) => {
    const fromLbl = elLabel(sp.fromId);
    const toLbl   = elLabel(sp.toId);
    const tronson = `${fromLbl} → ${toLbl}`;

    // Gabarit la x_max (+40°C)
    let gabaritCell = '';
    if (hasCota && sp.sag40 != null) {
      const a_l = poles[i].cota_teren + poles[i].H;
      const a_r = poles[i + 1].cota_teren + poles[i + 1].H;
      const x_max40 = (sp.q40 && sp.T40)
        ? sp.L_m / 2 - sp.dh * sp.T40 / (sp.q40 * sp.L_m)
        : sp.L_m / 2;
      const t_max40     = Math.max(0.01, Math.min(0.99, x_max40 / sp.L_m));
      const chord_max   = a_l + (a_r - a_l) * t_max40;
      const cond40_max  = chord_max - sp.sag40;
      const terrain_max = poles[i].cota_teren
        + (poles[i + 1].cota_teren - poles[i].cota_teren) * t_max40;
      const clearance   = cond40_max - terrain_max;
      const ok          = clearance >= GABARIT_MIN;
      gabaritCell = td(
        clearance.toFixed(2) + (ok ? '' : ' ⚠'),
        ok ? '#22c55e' : '#ef4444',
        true
      );
    } else if (hasCota) {
      gabaritCell = td('—', '#475569');
    }

    return '<tr>'
      + td(tronson, '#e2e8f0', false, 'text-align:left')
      + td(sp.L_m != null ? sp.L_m.toFixed(0) : '—')
      + (hasCota ? td(sp.dh != null ? (sp.dh > 0 ? '+' : '') + sp.dh.toFixed(1) : '—',
                      Math.abs(sp.dh) > 0.1 ? '#fb923c' : '#94a3b8') : '')
      + td(sp.acsr_key || '—', '#7dd3fc')
      + td(sp.T0_dim != null ? sp.T0_dim.toFixed(0) : '—', '#fbbf24')
      + td(sp.KP_calc != null ? (sp.KP_calc * 100).toFixed(0) + '%' : '—', '#a78bfa')
      + td(sp.sag40 != null ? sp.sag40.toFixed(2) : '—', '#f97316', sp.sag40 != null)
      + td(sp.sag10 != null ? sp.sag10.toFixed(2) : '—', '#4ade80')
      + gabaritCell
      + '</tr>';
  }).join('');

  return `<div style="overflow-x:auto;margin-top:0;margin-bottom:2px">
    <table style="border-collapse:collapse;background:#131c2e;width:100%;min-width:520px">
      <thead>${head}</thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

// ── API panou ────────────────────────────────────────────────────────────────

export function openProfilLEA() {
  const panel = document.getElementById('PROFIL_LEA');
  if (panel) { panel.style.display = 'flex'; runProfilLEA(); }
}

export function closeProfilLEA() {
  const panel = document.getElementById('PROFIL_LEA');
  if (panel) panel.style.display = 'none';
}

export function runProfilLEA() {
  const container = document.getElementById('profil-lea-content');
  if (!container) return;

  // Sincronizare setări din panoul sag-mt (zonă, H, KP)
  const zEl = document.getElementById('sag-zone');
  const hEl = document.getElementById('sag-h');
  const kEl = document.getElementById('sag-kpdim');
  if (zEl) _zone      = zEl.value || 'D.b.4';
  if (hEl) _H_default = parseFloat(hEl.value) || 7;
  if (kEl) _kpdim     = parseFloat(kEl.value) || null;

  const chains = extractProfilData();
  if (!chains.length) {
    container.innerHTML = '<div style="padding:24px;color:#64748b;text-align:center;font-size:11px">'
      + 'Nicio linie MT găsită în schemă.</div>';
    return;
  }

  let html = '';
  chains.forEach(chain => {
    const svg = buildProfilSVG(chain);
    if (!svg) return;
    html += `<div style="margin-bottom:4px;overflow-x:auto">${svg}</div>`;
    html += buildSummaryTable(chain);
    html += '<div style="margin-bottom:24px"></div>';
  });
  container.innerHTML = html || '<div style="padding:24px;color:#64748b;font-size:11px">'
    + 'Profilul nu poate fi generat (date insuficiente).</div>';
}

export function exportProfilSVG() {
  const chains = extractProfilData();
  if (!chains.length) return;
  chains.forEach(chain => {
    const svg = buildProfilSVG(chain);
    if (!svg) return;
    const name = `profil_lea_${chain.label.replace(/[→\s]+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.svg`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  });
}
