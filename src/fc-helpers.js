// ElectroCAD Pro v12 — FC Helpers (Fișă de Calcul)
// Calculează cantitățile de lucrări pentru Fișa de Calcul (fc_template.js)

import { EL, CN } from './state.js';

/**
 * Calculează cantitățile de elemente pentru Fișa de Calcul.
 * Returnează un Map pozițieId → cantitate (pentru coloana G din FC CALCUL).
 *
 * Pozițiile (exemplu orientativ, ajustează după template-ul tău):
 *  1 – Post Transformare (trafo/ptab)
 *  2 – Stâlpi SE4
 *  3 – Stâlpi SE10
 *  4 – Stâlpi SC10002 / SC10005
 *  5 – Stâlpi rotonzi
 *  6 – Firide (toate tipurile)
 *  7 – Separatoare JT
 *  8 – Separatoare MT
 *  9 – Mansoane
 * 10 – Prize pământ
 * 11 – BMPT contoare
 * 12 – CD-uri (toate tipurile)
 * 13 – Lungime cabluri (m) – suma lungimilor din CN
 * 14 – Nr. de conexiuni (buc)
 */
export function computeCantitatiFC() {
  const q = new Map();

  // Numără elementele după tip
  const counts = {};
  EL.forEach(el => {
    counts[el.type] = (counts[el.type] || 0) + 1;
  });

  // Poziția 1: Post Transformare
  q.set(1, (counts['trafo'] || 0) + (counts['ptab_1t'] || 0) + (counts['ptab_2t'] || 0) + (counts['ptab_mono'] || 0));

  // Poziția 2: Stâlpi SE4
  q.set(2, counts['stalp_se4'] || 0);

  // Poziția 3: Stâlpi SE10
  q.set(3, counts['stalp_se10'] || 0);

  // Poziția 4: Stâlpi speciali (SC10002, SC10005, stâlp cu CS)
  q.set(4, (counts['stalp_sc10002'] || 0) + (counts['stalp_sc10005'] || 0) + (counts['stalp_cs'] || 0));

  // Poziția 5: Stâlpi rotonzi
  q.set(5, (counts['stalp_rotund'] || 0) + (counts['stalp_rotund_special'] || 0));

  // Poziția 6: Firide
  q.set(6, (counts['firida_e2_4'] || 0) + (counts['firida_e3_4'] || 0) + (counts['firida_e3_0'] || 0));

  // Poziția 7: Separatoare JT
  q.set(7, counts['separator'] || 0);

  // Poziția 8: Separatoare MT
  q.set(8, counts['separator_mt'] || 0);

  // Poziția 9: Mansoane
  q.set(9, counts['manson'] || 0);

  // Poziția 10: Prize pământ
  q.set(10, counts['priza_pamant'] || 0);

  // Poziția 11: BMPT contoare
  q.set(11, counts['meter'] || 0);

  // Poziția 12: CD-uri
  q.set(12, (counts['cd4'] || 0) + (counts['cd5'] || 0) + (counts['cd8'] || 0));

  // Poziția 13: Lungime totală cabluri (m)
  let totalLen = 0;
  CN.forEach(c => { totalLen += parseFloat(c.length) || 0; });
  q.set(13, parseFloat(totalLen.toFixed(1)));

  // Poziția 14: Număr conexiuni
  q.set(14, CN.length);

  return q;
}
