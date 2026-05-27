// Catalog stâlpi MT 20kV — parametri fizici pentru calcul săgeată + deviație
// H:     înălțimea punctului de prindere conductor față de sol [m]
// T_max: tracțiunea orizontală max. admisă [daN]; null = fără limitare (stâlpi N susținere)
//
// Valorile H și T_max sunt implicite din catalog și pot fi suprascrise per stâlp
// din panoul de proprietăți (câmpurile h_prindere_ovr / T_max_ovr pe elementul din S.EL).
//
// NOTĂ: valorile din catalog sunt estimative — ajustați per proiect în funcție de
// fișele tehnice ale furnizorului sau calculele de rezistență ale stâlpilor.

export const POLE_CATALOG = {
  // ── Stâlpi circulari centrifugați (SC) ──────────────────────────────────
  stalp_mt_sc10001: { desc: 'SC 10/1 — intermediar N', H: 8.5,  T_max: null },
  stalp_mt_sc15006: { desc: 'SC 10/6 — ancoraj ușor',  H: 8.5,  T_max: null },
  stalp_mt_sc15007: { desc: 'SC 10/7 — ancoraj',       H: 8.5,  T_max: null },
  stalp_mt_sc15014: { desc: 'SC 12/14 — ancoraj',      H: 10.5, T_max: null },
  stalp_mt_sc15015: { desc: 'SC 12/15 — ancoraj înalt', H: 10.5, T_max: null },
  // ── Stâlpi vibroprecomprimați (SE) ──────────────────────────────────────
  stalp_mt_se4t:  { desc: 'SE 4T',  H: 7.5,  T_max: null },
  stalp_mt_se5t:  { desc: 'SE 5T',  H: 8.0,  T_max: null },
  stalp_mt_se6t:  { desc: 'SE 6T',  H: 8.5,  T_max: null },
  stalp_mt_se7t:  { desc: 'SE 7T',  H: 9.0,  T_max: null },
  stalp_mt_se8t:  { desc: 'SE 8T',  H: 9.5,  T_max: null },
  stalp_mt_se9t:  { desc: 'SE 9T',  H: 10.0, T_max: null },
  stalp_mt_se10t: { desc: 'SE 10T', H: 10.5, T_max: null },
  stalp_mt_se11t: { desc: 'SE 11T', H: 11.0, T_max: null },
};

/**
 * Returnează parametrii fizici ai unui stâlp, combinând catalogul cu override-urile per-element.
 * @param {object|null} el - element din S.EL
 * @returns {{ H: number|null, T_max: number|null, desc: string, catH: number|null, catT: number|null }}
 */
export function getPoleData(el) {
  if (!el) return { H: null, T_max: null, desc: '?', catH: null, catT: null };
  const cat = POLE_CATALOG[el.type] ?? {};
  return {
    H:     el.h_prindere_ovr != null ? el.h_prindere_ovr : (cat.H   ?? null),
    T_max: el.T_max_ovr      != null ? el.T_max_ovr      : (cat.T_max ?? null),
    desc:  cat.desc ?? el.type,
    catH:  cat.H    ?? null,
    catT:  cat.T_max ?? null,
  };
}
