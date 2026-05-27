// Catalog stâlpi MT 20kV — parametri fizici pentru calcul săgeată + deviație
// H:     înălțimea punctului de prindere conductor față de sol [m]
// T_max: tracțiunea orizontală max. admisă [daN]; null = fără limitare (stâlpi N susținere)
//
// Valorile H și T_max sunt implicite din catalog și pot fi suprascrise per stâlp
// din panoul de proprietăți (câmpurile h_prindere_ovr / T_max_ovr pe elementul din S.EL).

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

// Catalog console metalice ST34 Electrica SA — eforturi maxime admise Anexa 1
// T_max = efort axial T [daN] = tracțiunea orizontală max. admisă pe consolă
// Sursa: Specificație Tehnică ST34 Electrica SA, 2010, Anexa 1 (pag. 10–20)
export const CONSOLE_CATALOG = {
  // ── CSO 1100 — consolă de susținere orizontală 1100 mm ───────────────────
  cso_1100_v1: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL37 v1 — L63×63×6',    T_max: 163 },
  cso_1100_v2: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL37 v2 — L60×60×6',    T_max: 142 },
  cso_1100_v3: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL37 v3 — L60 SR EN',   T_max: 140 },
  cso_1100_v4: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL37 v4 — L70×70×7',   T_max: 220 },
  cso_1100_v5: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL52 v5 — L60×60×6',   T_max: 198 },
  cso_1100_v6: { group: 'CSO 1100 — susținere S.C.', desc: 'CSO 1100 / OL52 v6 — asimetric',   T_max: 114 },
  // ── CSO 1385 — consolă de susținere orizontală 1385 mm ───────────────────
  cso_1385_v1: { group: 'CSO 1385 — susținere S.C.', desc: 'CSO 1385 / OL37 v1 — L70/L60',     T_max: 138 },
  cso_1385_v2: { group: 'CSO 1385 — susținere S.C.', desc: 'CSO 1385 / OL37 v2 — L70/L60',     T_max: 143 },
  cso_1385_v3: { group: 'CSO 1385 — susținere S.C.', desc: 'CSO 1385 / OL52 v3 — L70/L60',     T_max: 198 },
  // ── CIE — consolă izolație elastică susținere ────────────────────────────
  cie_v1:  { group: 'CIE — izol. elastică susț.', desc: 'CIE / OL37 v1 — L70/L70 (min.)', T_max: 86  },
  cie_v23: { group: 'CIE — izol. elastică susț.', desc: 'CIE / OL37 v2-3 — cu L80×80×8',  T_max: 129 },
  cie_v45: { group: 'CIE — izol. elastică susț.', desc: 'CIE / OL37 v4-5 — STAS 7836',    T_max: 118 },
  cie_v67: { group: 'CIE — izol. elastică susț.', desc: 'CIE / OL52 v6-7',                T_max: 123 },
  // ── CDS — consolă dezaxată susținere ─────────────────────────────────────
  cds_ol37: { group: 'CDS — dezaxată susținere',   desc: 'CDS / OL37',                     T_max: 70  },
  cds_ol52: { group: 'CDS — dezaxată susținere',   desc: 'CDS / OL52',                     T_max: 100 },
  // ── CDV 550 — consolă de derivație ───────────────────────────────────────
  cdv_550:  { group: 'CDV 550 — derivație',        desc: 'CDV 550',                         T_max: 150 },
  // ── CIT 140 — consolă de întindere și terminală ───────────────────────────
  cit_140:  { group: 'CIT 140 — întindere/term.',  desc: 'CIT 140',                         T_max: 1500 },
  // ── CDI — consolă dezaxată de întindere ──────────────────────────────────
  cdi_ol37: { group: 'CDI — dezaxată întindere',   desc: 'CDI / OL37',                      T_max: 800 },
  // ── CSS / CSI — consolă orizontală dublu circuit susținere ───────────────
  css: { group: 'CSS/CSI — d.c. susținere', desc: 'CSS — d.c. susț. superioară',            T_max: 350 },
  csi: { group: 'CSS/CSI — d.c. susținere', desc: 'CSI — d.c. susț. inferioară',            T_max: 145 },
  // ── CDCS "Păianjen" — consolă d.c. susținere izolație elastică ───────────
  cdcs_v1: { group: 'CDCS "Păianjen" — d.c. susț. el.', desc: 'CDCS v1 — U10',            T_max: 116 },
  cdcs_v2: { group: 'CDCS "Păianjen" — d.c. susț. el.', desc: 'CDCS v2 — U8',             T_max: 87  },
  cdcs_v3: { group: 'CDCS "Păianjen" — d.c. susț. el.', desc: 'CDCS v3 — U100×50×6',      T_max: 107 },
  cdcs_v4: { group: 'CDCS "Păianjen" — d.c. susț. el.', desc: 'CDCS v4 — U80×60×5',       T_max: 119 },
  // ── CIS/CII — consolă orizontală d.c. de întindere ───────────────────────
  cis_cii: { group: 'CIS/CII — d.c. întindere',   desc: 'CIS/CII',                         T_max: 1000 },
  // ── CDCI — consolă d.c. de întindere izolație elastică ───────────────────
  cdci:    { group: 'CDCI — d.c. întindere el.',  desc: 'CDCI',                             T_max: 1250 },
};

/**
 * Returnează parametrii fizici ai unui stâlp, combinând catalogul cu override-urile per-element.
 * Prioritate T_max: el.T_max_ovr > console_type catalog > pole catalog > null
 * @param {object|null} el - element din S.EL
 * @returns {{ H, T_max, desc, catH, catT, consoleDesc }}
 */
export function getPoleData(el) {
  if (!el) return { H: null, T_max: null, desc: '?', catH: null, catT: null, consoleDesc: null };
  const cat     = POLE_CATALOG[el.type] ?? {};
  const consCat = el.console_type ? (CONSOLE_CATALOG[el.console_type] ?? {}) : {};
  const consT   = consCat.T_max ?? null;
  const poleT   = cat.T_max     ?? null;
  return {
    H:           el.h_prindere_ovr != null ? el.h_prindere_ovr : (cat.H ?? null),
    T_max:       el.T_max_ovr      != null ? el.T_max_ovr      : (consT ?? poleT),
    desc:        cat.desc    ?? el.type,
    catH:        cat.H       ?? null,
    catT:        consT ?? poleT,      // placeholder afișat în câmpul T_max din UI
    consoleDesc: consCat.desc ?? null,
  };
}
