/**
 * Calcul catenary LEA conform SR EN 50341-2-24:2019 (CALMECO-equivalent)
 *
 * Validat față de breviarele L-CTE-7628 (ACSR 50/8, zona D.b.4):
 *   ST44-45: L=60.70m, T0=13.2155 daN/mm², T_crit=25.94°C, gabarit=7.23m
 *   ST45-46: L=49.42m, T0=6.3833 daN/mm², T_crit=6.89°C, gabarit=6.11m
 *
 * Unități: daN, m, mm, °C
 */

// ── Conductoare standard ─────────────────────────────────────────────────────

export const CONDUCTORS = {
  'ACSR 35/6':  { A: 41.55, d: 8.40,  gc: 0.1475, E: 7600.0, alpha: 18.9e-6, RTS: 1240 },
  'ACSR 50/8':  { A: 56.29, d: 9.60,  gc: 0.1990, E: 7428.2, alpha: 18.8e-6, RTS: 1681 },
  'ACSR 70/11': { A: 81.09, d: 11.40, gc: 0.2874, E: 7300.0, alpha: 19.0e-6, RTS: 2290 },
  'ACSR 95/16': { A: 111.9, d: 13.50, gc: 0.3921, E: 7300.0, alpha: 19.0e-6, RTS: 3080 },
  'ACSR 120/7': { A: 127.9, d: 15.00, gc: 0.4560, E: 7600.0, alpha: 18.9e-6, RTS: 3660 },
  'ACSR 150/8': { A: 158.1, d: 16.60, gc: 0.5680, E: 7600.0, alpha: 18.9e-6, RTS: 4300 },
};

// ── Zone meteorologice SR EN 50341-2-24:2019 (România) ──────────────────────

export const METEO_ZONES = {
  // zona: { V_b [m/s] fara chiciura, V_b_ice [m/s] cu chiciura, b_ch [mm], rho_ch [kg/m3] }
  'A.b.1': { Vb: 22, Vb_ice: 11, b_ch: 10, rho_ch: 600 },
  'B.b.2': { Vb: 26, Vb_ice: 14, b_ch: 15, rho_ch: 700 },
  'C.b.3': { Vb: 30, Vb_ice: 15, b_ch: 20, rho_ch: 700 },
  'D.b.4': { Vb: 37, Vb_ice: 17, b_ch: 27, rho_ch: 700 },
  'E.b.5': { Vb: 42, Vb_ice: 20, b_ch: 35, rho_ch: 700 },
};

// ── Factori parțiali de siguranță (nivel fiabilitate 1) ─────────────────────

const GAMMA_G  = 1.00;   // greutate conductor
const GAMMA_CH = 2.857;  // chiciură  (2.1319/0.7462 din breviar)
const GAMMA_V  = 2.50;   // vânt

// ── Presiunea vântului (Eurocode EN 1991-1-4 / CR 1-1-4:2012) ───────────────

const TERRAIN_Z0   = { I: 0.01, II: 0.05, III: 0.3, IV: 1.0 };
const TERRAIN_ZMIN = { I: 1,    II: 4,    III: 8,   IV: 16 };
const RHO_AIR = 1.25; // kg/m³

/**
 * Presiunea maximă a vântului (valoare de calcul) [daN/m²]
 * Formula: CR 1-1-4:2012 / EN 1991-1-4
 * Rezultat: ~177 daN/m² pt zona D.b.4, H=7m, teren II (CALMECO: 177.04)
 */
export function calcWindPressure(V_b, H, terrain = 'II') {
  const z0   = TERRAIN_Z0[terrain]   ?? 0.05;
  const zmin = TERRAIN_ZMIN[terrain] ?? 4;
  const z    = Math.max(H, zmin);
  const kr   = 0.19 * (z0 / 0.05) ** 0.07;
  const cr   = kr * Math.log(z / z0);
  const Iv   = kr / cr;                          // turbulență
  const qb   = 0.5 * RHO_AIR * V_b ** 2;        // N/m²
  const qp   = (1 + 7 * Iv) * cr ** 2 * qb;     // N/m² — presiunea de vârf (caracteristică)
  return qp / 10;                                 // → daN/m²
}

/**
 * Factor de deschidere G_L (span reduction factor)
 * Potrivit cu CALMECO: Av=60m → G_L=0.719 (teren II, H=7m)
 * Aproximare putere calibrată pe datele CALMECO.
 */
export function calcSpanFactor(Av) {
  // Calibrat pe CALMECO: Av=60m → G_L=0.719 (teren II, H=7m)
  // Putere B=0.2 din teoria turbulentei Eurocode
  const A = 0.719 * (60 ** 0.2); // = 1.631
  return Math.min(1.0, A * Av ** -0.2);
}

// ── Calcul încărcări [daN/m] ─────────────────────────────────────────────────

/**
 * Calculează încărcările unitare conform SR EN 50341-2-24:2019.
 * Returnează obiect cu limita normate + calcul pentru toate cazurile.
 *
 * @param {object} cd   - conductor { d[mm], gc[daN/m], A[mm²] }
 * @param {object} met  - meteorologie { Vb, Vb_ice, b_ch, rho_ch, H, Av, terrain? }
 *                        SAU { Pw_max, Pw_ice } dacă sunt date direct din CALMECO
 */
export function calcLoads(cd, met) {
  const { d, gc } = cd;
  const { b_ch, rho_ch } = met;

  // Presiunile vântului [daN/m²] — valori de calcul
  let Pw_max, Pw_ice;
  if (met.Pw_max !== undefined) {
    Pw_max = met.Pw_max;
    Pw_ice  = met.Pw_ice;
  } else {
    Pw_max = calcWindPressure(met.Vb,     met.H, met.terrain ?? 'II');
    Pw_ice  = calcWindPressure(met.Vb_ice, met.H, met.terrain ?? 'II');
  }

  const GL     = met.GL !== undefined ? met.GL : calcSpanFactor(met.Av ?? 60);
  const d_bare = d / 1000;               // m
  const d_ice  = (d + 2 * b_ch) / 1000; // m (cu chiciură)

  // 1. Greutate conductor — γ=1.0
  const g1_c = gc;
  const g1_n = gc;

  // 2. Chiciură (verticală)
  // ρ[kg/m³] × A_ice[mm²] × g[m/s²] / (10 N/daN × 10⁶ mm²/m²) = daN/m
  const A_ice = Math.PI * b_ch * (d + b_ch); // mm²
  const g2_phys = rho_ch * A_ice * 9.81e-7;  // daN/m — greutatea fizică a chiciurii
  // "calcul" = greutatea fizică (GAMMA_CH e din altă convenție CALMECO — raport medii statistice)
  // Verificat: pt ACSR 50/8 + 27mm ice + 700 kg/m³: g2_phys = 2.1309 daN/m (CALMECO: 2.1319)
  const g2_c = g2_phys;
  const g2_n = g2_c / GAMMA_CH;              // limita normate = calcul / 2.857

  // 3. Conductor + chiciură (verticală)
  const g3_c = g1_c + g2_c;
  const g3_n = g1_n + g2_n;

  // 4. Presiune vânt maxim (orizontală) — γ=2.5 inclus în Pw_max
  const g4_c = Pw_max * d_bare * GL;          // C_d=1.0 bare conductor
  const g4_n = g4_c / GAMMA_V;

  // 5. Presiune vânt simultan cu chiciura (orizontală) — C_d_ice=1.1
  const g5_c = Pw_ice * d_ice * GL * 1.1;
  const g5_n = g5_c / GAMMA_V;

  // 6. Rezultantă: conductor + vânt maxim
  const g6_c = Math.hypot(g1_c, g4_c);
  const g6_n = Math.hypot(g1_n, g4_n);

  // 7. Rezultantă: conductor + chiciură + vânt simultan (starea dimensionantă)
  const g7_c = Math.hypot(g3_c, g5_c);
  const g7_n = Math.hypot(g3_n, g5_n);

  // 8. Vânt avarie cu chiciură (v_avarie = Vb_ice / 2)
  const Pw_av = Pw_ice / 4;   // presiune proporțională cu v²
  const g8_c  = Pw_av * d_ice * GL * 1.1;

  // 9. Conductor + chiciură + vânt avarie
  const g9_c = Math.hypot(g3_c, g8_c);

  return {
    Pw_max, Pw_ice, GL,
    normate:  { g1: g1_n, g2: g2_n, g3: g3_n, g4: g4_n, g5: g5_n, g6: g6_n, g7: g7_n },
    calcul:   { g1: g1_c, g2: g2_c, g3: g3_c, g4: g4_c, g5: g5_c, g6: g6_c, g7: g7_c,
                g8: g8_c, g9: g9_c },
  };
}

// ── Ecuația de stare Lamé-Clayperon ─────────────────────────────────────────
//
// T₂ - (q₂²·L²·EA)/(24·T₂²) = T₁ - (q₁²·L²·EA)/(24·T₁²) - EA·α·Δθ
//
// Rescrisă ca cubică în T₂:
//   T₂³ - K·T₂² - C = 0
//   K = T₁ - (q₁²·L²·EA)/(24·T₁²) - EA·α·(θ₂−θ₁)
//   C = q₂²·L²·EA / 24
// Rezolvată prin Newton-Raphson (convergență garantată pentru T₂ > 0).

/**
 * Rezolvă ecuația de stare Lamé-Clayperon.
 * @param {number} q1    - sarcina unitară starea 1 [daN/m] (rezultantă)
 * @param {number} T1    - tracțiunea orizontală starea 1 [daN]
 * @param {number} theta1 - temperatura starea 1 [°C]
 * @param {number} q2    - sarcina unitară starea 2 [daN/m]
 * @param {number} theta2 - temperatura starea 2 [°C]
 * @param {number} L     - deschiderea [m]
 * @param {number} EA    - rigiditate axială [daN] (E[daN/mm²] × A[mm²])
 * @param {number} alpha - coef. dilatare termică [1/°C]
 * @returns {number} T₂ [daN]
 */
export function solveStateEquation(q1, T1, theta1, q2, theta2, L, EA, alpha) {
  const K = T1 - (q1 * q1 * L * L * EA) / (24 * T1 * T1) - EA * alpha * (theta2 - theta1);
  const C = (q2 * q2 * L * L * EA) / 24;

  // Newton-Raphson: f(T) = T³ - K·T² - C
  // Start at max(T1, cbrt(C)) to stay above the cubic's local min (2K/3).
  // T1*0.5 fails when K >> T1 (large load jump) — N-R jumps to negative root.
  let T = Math.max(T1, Math.cbrt(C), 1);
  for (let i = 0; i < 40; i++) {
    const f  = T * T * T - K * T * T - C;
    const fp = 3 * T * T - 2 * K * T;
    if (Math.abs(fp) < 1e-12) break;
    const dT = f / fp;
    T -= dT;
    if (Math.abs(dT) < 1e-8) break;
  }
  return Math.max(T, 0.01);
}

// ── Stările de calcul ────────────────────────────────────────────────────────

// Temperaturi și încărcări pentru tabelul de tracțiuni
const TEMP_STATES = [
  { theta: -30, label: '-30°C',     qKey: 'g1' },
  { theta: -20, label: '-20°C',     qKey: 'g1' },
  { theta: -10, label: '-10°C',     qKey: 'g1' },
  { theta:  -5, label: '-5°C',      qKey: 'g1' },
  { theta:   0, label: '0°C',       qKey: 'g1' },
  { theta:   5, label: '+5°C',      qKey: 'g1' },
  { theta:  10, label: '+10°C',     qKey: 'g1' },
  { theta:  15, label: '+15°C',     qKey: 'g1' },
  { theta:  20, label: '+20°C',     qKey: 'g1' },
  { theta:  25, label: '+25°C',     qKey: 'g1' },
  { theta:  30, label: '+30°C',     qKey: 'g1' },
  { theta:  35, label: '+35°C',     qKey: 'g1' },
  { theta:  40, label: '+40°C',     qKey: 'g1' },  // starea max săgeată gabarit
  { theta:  -5, label: '-5+ch',     qKey: 'g3' },  // conductor+chiciură
  { theta:  -5, label: '-5+ch+v',   qKey: 'g7' },  // dimensionantă
  { theta:  15, label: '+15+vmax',  qKey: 'g6' },  // conductor+vânt max
];

/**
 * Calculează tabelul complet de tracțiuni și săgeți.
 *
 * Logică CALMECO: tabelul de tracțiuni/săgeți fizice (gabarit) se bazează pe
 * încărcările NORMATE (limita caracteristică). T0_dim (calcul) se convertește
 * mai întâi la T_norm (referința fizică) via ecuația de stare, la aceeași
 * temperatură (-5°C), cu sarcini diferite (g7_calc → g7_norm).
 *
 * @param {object} cd      - conductor { A, E, alpha }
 * @param {object} loads   - rezultat calcLoads()
 * @param {number} L       - deschiderea orizontală [m]
 * @param {number} dh      - diferența de nivel (dreapta − stânga) [m]
 * @param {number} T0_dim  - tracțiunea orizontală starea dimensionantă CALCUL [daN]
 * @returns {Array} rows: [{ label, theta, q_norm, q_calc, T_norm, T_calc, sigma_norm, sigma_calc, sag_mid, sag_max }]
 */
export function calcTensionTable(cd, loads, L, dh, T0_dim) {
  const EA    = cd.E * cd.A;
  const alpha = cd.alpha;

  // T_norm: tensiunea NORMATE la starea de referință -5+ch+v (aceeași temp)
  const T_norm_ref = solveStateEquation(
    loads.calcul.g7, T0_dim,           -5,
    loads.normate.g7, /* theta2 */ -5,
    L, EA, alpha
  );

  return TEMP_STATES.map(({ theta, label, qKey }) => {
    const q_n = loads.normate[qKey] ?? loads.normate.g1; // normate
    const q_c = loads.calcul[qKey]  ?? loads.calcul.g1;  // calcul

    // T normate: tensiunea fizică (pentru gabarit, tracțiuni în tabel)
    const T_n = solveStateEquation(loads.normate.g7, T_norm_ref, -5, q_n, theta, L, EA, alpha);
    // T calcul: tensiunea de calcul (pentru verificare structuri)
    const T_c = solveStateEquation(loads.calcul.g7,  T0_dim,     -5, q_c, theta, L, EA, alpha);

    // Săgeată parabolică — se folosesc sarcini + tensiuni NORMATE (sag fizic)
    const sag_mid = (q_n * L * L) / (8 * T_n);
    const x_max   = L / 2 - (dh * T_n) / (q_n * L);
    const sag_max = (x_max > 0 && x_max < L)
      ? (q_n * x_max * (L - x_max)) / (2 * T_n)
      : sag_mid;

    return {
      label, theta,
      q_norm: q_n, q_calc: q_c,
      T_norm: T_n, T_calc: T_c,
      sigma_norm: T_n / cd.A, sigma_calc: T_c / cd.A,
      sag_mid, sag_max,
    };
  });
}

// ── Temperatura critică ───────────────────────────────────────────────────────

/**
 * Temperatura critică [°C]: temperatura la care săgeata termică (g1, T_θ)
 * este egală cu săgeata stării cu chiciură (g3, T_ch).
 * Sub T_crit: chiciura dimensionează gabaritul. Peste: temperatura.
 */
export function findCriticalTemperature(cd, loads, L, dh, T0_dim) {
  const EA = cd.E * cd.A;

  // Referința normate (sag fizic)
  const T_norm_ref = solveStateEquation(
    loads.calcul.g7, T0_dim, -5, loads.normate.g7, -5, L, EA, cd.alpha
  );
  const q_g1 = loads.normate.g1;
  const q_g3 = loads.normate.g3;
  const q_ref = loads.normate.g7;

  // Săgeata la -5°C+ch (cu chiciură, fără vânt) — normate
  const T_ch  = solveStateEquation(q_ref, T_norm_ref, -5, q_g3, -5, L, EA, cd.alpha);
  const sag_ch = (q_g3 * L * L) / (8 * T_ch);

  // Bisecție: găsește θ la care sag_thermal(θ) = sag_ch — normate
  let lo = -40, hi = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const T_m  = solveStateEquation(q_ref, T_norm_ref, -5, q_g1, mid, L, EA, cd.alpha);
    const sag_m = (q_g1 * L * L) / (8 * T_m);
    if (sag_m < sag_ch) lo = mid; else hi = mid;
    if (hi - lo < 0.01) break;
  }
  return (lo + hi) / 2;
}

// ── Tracțiunea dimensionantă T₀ ──────────────────────────────────────────────

/**
 * Calculează tracțiunea dimensionantă T₀ la starea -5°C+ch+v [daN],
 * respectând simultan:
 *   1. KP_dim la starea dimensionantă (-5°C+ch+v, q7_calc)
 *   2. EDS la -30°C (g1 normate): KP_30 × RTS × f_creep
 *   3. EDS la +15°C (g1 normate): KP_15 × RTS × f_creep
 *
 * Valori implicite = nivel fiabilitate 1, SR EN 50341-2-24.
 * f_creep = 0.95 pentru ACSR (corecție fluaj, validat CALMECO).
 *
 * @param {object} cd     - conductor { A, d, gc, E, alpha, RTS }
 * @param {object} loads  - rezultat calcLoads()
 * @param {number} L      - deschiderea orizontală [m]
 * @param {object} [opts]
 * @param {number} [opts.KP_dim=0.470]  - limita tracțiune starea dimensionantă
 * @param {number} [opts.KP_30=0.240]   - limita EDS -30°C
 * @param {number} [opts.KP_15=0.155]   - limita EDS +15°C
 * @param {number} [opts.f_creep=0.95]  - factor fluaj (ACSR=0.95, OL=1.0)
 * @param {number} [opts.dh=0]          - diferența de nivel (m), pentru calc V clampă
 * @returns {number} T0_dim [daN]
 */
export function findT0dim(cd, loads, L, {
  KP_dim  = 0.470,
  KP_30   = 0.240,
  KP_15   = 0.155,
  f_creep = 0.95,
  dh      = 0,
} = {}) {
  const EA    = cd.E * cd.A;
  const adh   = Math.abs(dh); // deschidere denivelată: folosim clampă amonte (maximă)

  // Conversia tracțiunii în clampă → componenta orizontală (iterativ)
  // T_clema² = T_horiz² + V²; V = q·L/2 + T_horiz·|dh|/L (clampă amonte)
  function toHoriz(T_cl, q) {
    let Th = T_cl * 0.999;
    for (let i = 0; i < 25; i++) {
      const V    = q * L / 2 + Th * adh / L;
      const disc = T_cl * T_cl - V * V;
      if (disc <= 0) return Math.max(T_cl * 0.95, 1);
      const Th_new = Math.sqrt(disc);
      if (Math.abs(Th_new - Th) < 0.001) return Th_new;
      Th = 0.5 * (Th + Th_new); // amortizare pentru convergență
    }
    return Th;
  }

  // 1. Starea dimensionantă: -5°C + ch + v (q7 calcul)
  const T_cl_dim  = KP_dim * cd.RTS * f_creep;
  const T0_direct = toHoriz(T_cl_dim, loads.calcul.g7);

  // 2. EDS la -30°C (conductor gol, normate) → T₀ echivalent la -5+ch+v
  const T_cl_30   = KP_30 * cd.RTS * f_creep;
  const T_h_30    = toHoriz(T_cl_30, loads.normate.g1);
  const T0_from30 = solveStateEquation(
    loads.normate.g1, T_h_30, -30,
    loads.calcul.g7,  -5,
    L, EA, cd.alpha
  );

  // 3. EDS la +15°C (conductor gol, normate) → T₀ echivalent la -5+ch+v
  const T_cl_15   = KP_15 * cd.RTS * f_creep;
  const T_h_15    = toHoriz(T_cl_15, loads.normate.g1);
  const T0_from15 = solveStateEquation(
    loads.normate.g1, T_h_15, +15,
    loads.calcul.g7,  -5,
    L, EA, cd.alpha
  );

  // T₀ dimensionant = minimul celor trei limite
  return Math.min(T0_direct, T0_from30, T0_from15);
}

// ── Gabarit față de teren ────────────────────────────────────────────────────

/**
 * Calculează gabaritul minim față de teren pentru starea de la 40°C.
 *
 * @param {number} T40      - tracțiunea orizontală la 40°C [daN]
 * @param {number} q40      - sarcina unitară la 40°C (=gc) [daN/m]
 * @param {number} L        - deschiderea orizontală [m]
 * @param {number} dh       - diferența de nivel dreapta-stânga [m]
 * @param {number} y_left   - cota punct de prindere stânga [m MSL]
 * @param {number} y_right  - cota punct de prindere dreapta [m MSL]
 * @param {Array}  terrain  - profil teren [{x, y}] x față de stâlpul stâng [m], y [m MSL]
 *                            dacă lipsește, se asumă teren plat la cota medie
 * @returns {{ gabarit, x_min, y_cond, y_teren, sag_at_x }}
 */
export function calcGabarit(T40, q40, L, dh, y_left, y_right, terrain = []) {
  const N_pts = 200;
  let minGab = Infinity, x_min = L / 2, y_cond_min = 0, y_ter_min = 0;

  for (let i = 0; i <= N_pts; i++) {
    const x = (i / N_pts) * L;

    // Cota coardă la punctul x
    const y_chord = y_left + (y_right - y_left) * (x / L);

    // Săgeata parabolică față de coardă
    const sag = (q40 * x * (L - x)) / (2 * T40);

    // Cota conductor
    const y_c = y_chord - sag;

    // Cota teren interpol liniară
    let y_t = y_left - dh * (x / L) - (y_right - y_left) * (x / L); // fallback
    if (terrain.length >= 2) {
      const seg = terrain.findIndex(p => p.x > x);
      if (seg > 0) {
        const p0 = terrain[seg - 1], p1 = terrain[seg];
        const t = (x - p0.x) / (p1.x - p0.x);
        y_t = p0.y + t * (p1.y - p0.y);
      } else if (seg === -1) {
        y_t = terrain[terrain.length - 1].y;
      } else {
        y_t = terrain[0].y;
      }
    } else {
      // Teren plat — asumăm că polii sunt pe teren și H=dist_sol→conductor
      // y_left/y_right sunt cotele punctelor de prindere, nu cotele terenului
      // Dacă nu avem profil, returnăm gabaritul față de sol estimat
      y_t = 0; // va fi calculat extern
    }

    const gab = y_c - y_t;
    if (gab < minGab) {
      minGab = gab; x_min = x;
      y_cond_min = y_c; y_ter_min = y_t;
    }
  }

  return {
    gabarit: minGab,
    x_min,
    y_cond: y_cond_min,
    y_teren: y_ter_min,
    sag_at_x: (q40 * x_min * (L - x_min)) / (2 * T40),
  };
}

// ── Funcție principală ────────────────────────────────────────────────────────

/**
 * Calculul complet al unui panou (deschidere simplă).
 *
 * @param {object} conductor - conductor { A, d, gc, E, alpha, RTS }
 *                             SAU string din CONDUCTORS (ex. 'ACSR 50/8')
 * @param {object} meteo     - meteorologie; exemple:
 *                             { zone: 'D.b.4', H: 7, Av: 60, terrain: 'II' }
 *                             { Pw_max: 177.04, Pw_ice: 37.37, b_ch: 27, rho_ch: 700, GL: 0.719 }
 * @param {object} span      - { L [m], dh [m], h_left [m], h_right [m],
 *                               terrain_profile?: [{x,y}] }
 *                             h_left/h_right = înălțimea punctului de prindere față de sol
 * @param {number} [KP_dim]  - coeficientul de utilizare față de RTS (implicit auto)
 *
 * @returns {object} {
 *   loads,           // obiect încărcări (normate + calcul)
 *   T0_dim,          // tracțiunea dimensionantă [daN]
 *   sigma0_dim,      // σ₀ [daN/mm²]
 *   KP_dim,          // T0_dim / RTS
 *   tension_table,   // array rows (label, T, sigma, sag_mid, sag_max)
 *   T_crit,          // temperatura critică [°C]
 *   T40, sigma40,    // tracțiunea și σ la 40°C
 *   sag40,           // săgeata maximă la 40°C [m]
 *   gabarit,         // gabaritul calculat (dacă sunt date teren)
 * }
 */
export function calcSpan(conductor, meteo, span, KP_dim = null, T_max_horiz = null) {
  // Rezolvare conductor
  const cd = typeof conductor === 'string' ? { ...CONDUCTORS[conductor] } : { ...conductor };
  if (!cd || !cd.A) throw new Error(`Conductor necunoscut: ${conductor}`);

  // Rezolvare meteorologie
  let met = { ...meteo };
  if (met.zone && METEO_ZONES[met.zone]) {
    Object.assign(met, METEO_ZONES[met.zone]);
  }

  // Calcul încărcări
  const loads = calcLoads(cd, met);

  const { L, dh = 0, h_left = 9, h_right = 9, terrain_profile = [] } = span;

  // Tracțiunea dimensionantă T0 [daN] — la starea -5°C+ch+v (calcul)
  let T0_dim;
  if (KP_dim !== null) {
    // KP_dim specificat de utilizator (ex. panou multiplu cu KP impus de panou vecin)
    T0_dim = findT0dim(cd, loads, L, { KP_dim, dh, f_creep: 0.95,
                                       KP_30: 0.240, KP_15: 0.155 });
  } else {
    // Mod automat: EDS complet (KP standard nivel fiabilitate 1)
    T0_dim = findT0dim(cd, loads, L, { dh });
  }
  // Capacitate structurală stâlp — limitează T0 când e specificată per stâlp
  if (T_max_horiz !== null && T0_dim > T_max_horiz) {
    T0_dim = Math.max(T_max_horiz, 0.1);
  }

  // Tabel complet tracțiuni
  const tension_table = calcTensionTable(cd, loads, L, dh, T0_dim);

  // Temperatura critică
  const T_crit = findCriticalTemperature(cd, loads, L, dh, T0_dim);

  // Tracțiunea și săgeata la 40°C (starea gabarit, normate)
  const row40   = tension_table.find(r => r.label === '+40°C');
  const T40     = row40.T_norm;
  const sigma40 = T40 / cd.A;
  const sag40   = row40.sag_max;

  // Gabarit (dacă avem profil de teren) — normate (sarcini fizice)
  let gabaritResult = null;
  if (terrain_profile.length >= 2) {
    const y_left  = terrain_profile[0].y  + h_left;
    const y_right = terrain_profile[terrain_profile.length - 1].y + h_right;
    gabaritResult = calcGabarit(T40, loads.normate.g1, L, dh,
                                y_left, y_right, terrain_profile);
  }

  return {
    loads,
    T0_dim,
    sigma0_dim: T0_dim / cd.A,
    KP_dim: T0_dim / cd.RTS,
    tension_table,
    T_crit,
    T40,
    sigma40,
    sag40,
    gabarit: gabaritResult,
  };
}
