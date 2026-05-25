import { S } from './state.js';
import { uid, toast, updateStat } from './utils.js';
import { saveState } from './element-manager.js';
import { render } from './renderer.js';

// ── Conductor parsing ──────────────────────────────────────────────────────────
function parseConductor(str) {
  if (!str) return { tipConductor: 'Torsadat Al', sectiune: 70, tipRetea: 'Trifazat' };
  const u = str.toUpperCase();

  let tipConductor = 'Clasic Al';
  if (u.includes('TYIR') || u.includes('TORSAD') || u.includes('OL-AL') || u.includes('OLAL')) {
    tipConductor = 'Torsadat Al';
  } else if (u.includes('LES') || u.includes('XLPE') || u.includes('AC2XS') || u.includes('NAYY') || u.includes('ACB')) {
    tipConductor = 'Cablu Al';
  } else if (u.includes('LIYY') || u.includes('NYFGY') || u.includes('NYY') ||
             (u.includes('CU') && !u.includes('ACUM') && !u.includes('CIRCUIT'))) {
    tipConductor = 'Cablu Cu';
  }

  const m = str.match(/(\d+)x(\d+)/i);
  const sectiune = m ? parseInt(m[2]) : 70;
  const phases = m ? parseInt(m[1]) : 3;
  const tipRetea = phases === 1 ? 'Monofazat' : phases === 2 ? 'Bifazat' : 'Trifazat';

  return { tipConductor, sectiune, tipRetea };
}

// ── Stalp type from label ──────────────────────────────────────────────────────
function stalpTypeFromLabel(label) {
  const u = label.toUpperCase().replace(/[\s\-]/g, '');
  if (u.includes('SC10002')) return 'stalp_sc10002';
  if (u.includes('SC10005')) return 'stalp_sc10005';
  if (u.startsWith('SC'))    return 'stalp_rotund';
  if (u.startsWith('SE10')  || u.includes('/SE10') || u.includes('SE10/')) return 'stalp_se10';
  if (u.startsWith('SE4')   || u.includes('/SE4')  || u.includes('SE4/'))  return 'stalp_se4';
  if (u.startsWith('SR')    || u.includes('ROTUND')) return 'stalp_rotund';
  if (/SE10/.test(u)) return 'stalp_se10';
  if (/SE4/.test(u))  return 'stalp_se4';
  return 'stalp_se4';
}

// ── File input trigger ─────────────────────────────────────────────────────────
export function openImportXLS() {
  let inp = document.getElementById('xls-import-input');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file'; inp.id = 'xls-import-input';
    inp.accept = '.xlsx,.xls'; inp.style.display = 'none';
    inp.addEventListener('change', ev => {
      const f = ev.target.files[0];
      if (f) importFromXLS(f);
      inp.value = '';
    });
    document.body.appendChild(inp);
  }
  inp.click();
}

// ── Main import ────────────────────────────────────────────────────────────────
async function importFromXLS(file) {
  if (!window.ExcelJS) { toast('ExcelJS nu e disponibil (reîncarcă pagina)', 'ac'); return; }

  toast('Citesc fișierul Excel...', 'ac');
  let buffer;
  try { buffer = await file.arrayBuffer(); }
  catch (e) { toast('Eroare la citirea fișierului', 'ac'); return; }

  const wb = new window.ExcelJS.Workbook();
  try { await wb.xlsx.load(buffer); }
  catch (e) { toast('Fișierul nu este un Excel valid', 'ac'); return; }

  // ── Parse rows ──
  const rows = [];
  wb.eachSheet(ws => {
    let isFirst = true;
    ws.eachRow(row => {
      if (isFirst) { isFirst = false; return; } // skip header
      const vals = [];
      row.eachCell({ includeEmpty: true }, cell => {
        const v = cell.value;
        vals.push(v === null || v === undefined ? '' : String(v).trim());
      });
      // pad to 7 cols
      while (vals.length < 7) vals.push('');
      if (vals.slice(0, 4).every(v => !v)) return; // skip blank rows
      rows.push({
        post:         vals[0],
        circuit:      vals[1],
        stalpInceput: vals[2],
        stalpFinal:   vals[3],
        lungime:      parseFloat(vals[4]) || 0,
        conductor:    vals[5],
        consumatori:  parseInt(vals[6]) || 0,
      });
    });
  });

  if (rows.length === 0) { toast('Fișierul nu conține date sau formatul coloanelor nu coincide', 'ac'); return; }

  // ── Confirm ──
  if (S.EL.length > 0 && !confirm(`Importul va șterge elementele curente (${S.EL.length} elem). Continui?`)) return;

  saveState('import XLS');
  S.EL = []; S.CN = [];
  Object.keys(S.counters).forEach(k => delete S.counters[k]);
  S.sel = null; S.multiSel.clear();

  // ── Group by (POST, CIRCUIT) ──
  const postName = rows[0].post || 'Import';
  const circuitGroups = new Map();
  rows.forEach(r => {
    const key = String(r.circuit || '1').trim();
    if (!circuitGroups.has(key)) circuitGroups.set(key, []);
    circuitGroups.get(key).push(r);
  });

  const XSPACING = 130;
  const YBRANCH  = 220;
  const circKeys = [...circuitGroups.keys()];
  const numCircuits = circKeys.length;

  // ── CD type & circuit output Y helper ──
  // circPort = numărul portului CD (0-based): "C1"→0, "C2"→1 etc.
  function chooseCDType(maxPort) { return maxPort < 4 ? 'cd4' : maxPort < 5 ? 'cd5' : 'cd8'; }
  function cdOutY(cdType, portIdx) {
    const np = parseInt(cdType.replace('cd', ''));
    const BH = np * 36 + 28;
    return -BH / 2 + 16 + 36 * portIdx + 18; // relativ la centrul CD
  }

  // Determină portul CD din cheia circuitului ("2" → port index 1)
  const maxPortIdx = Math.max(...circKeys.map(k => (parseInt(k) || 1) - 1));
  const cdPortCount = Math.max(4, maxPortIdx + 1); // minim cd4

  // ── Source element (trafo) ──
  const srcId = uid();
  S.EL.push({
    id: srcId, type: 'trafo',
    x: -220, y: 0,
    label: postName,
    color: '#1a6ba0', fillColor: 'none',
    rotation: 0, scale: 1
  });

  // ── CD element între trafo și stâlpi ──
  const cdType = chooseCDType(maxPortIdx);
  const cdId   = uid();
  const cdX    = -50, cdY = 0;
  const cdNp   = parseInt(cdType.replace('cd', ''));
  S.EL.push({
    id: cdId, type: cdType,
    x: cdX, y: cdY,
    label: 'CD',
    color: '#555', fillColor: 'none',
    rotation: 0, scale: 1,
    fuses: new Array(cdNp + 1).fill(true),
  });

  // ── Connection: trafo → CD ──
  {
    const p1 = { x: -220 + 45, y: 0 };
    const p2 = { x: cdX - 70,  y: 0 };
    S.CN.push({
      id: uid(),
      fromElId: srcId, fromTerm: { cx: 45, cy: 0 },
      toElId:   cdId,  toTerm:   { cx: -70, cy: 0 },
      path: [p1, p2],
      label: 'Racord', length: 10,
      color: '#ef4444', strokeWidth: 3, lineType: 'solid',
      tipConductor: 'Torsadat Al', sectiune: 50, tipRetea: 'Trifazat',
    });
  }

  let totalStalpi = 0, totalCn = 1; // 1 = trafo→CD

  // Labels care reprezintă elemente deja create (nu stâlpi)
  const SYSTEM_RE = /^(CD|PTA|PTAB|TRAFO|POST)$/i;

  circKeys.forEach((circKey, circIdx) => {
    const allSegments = circuitGroups.get(circKey);
    const circLabel = `C${circKey}`;
    const branchY = Math.round((circIdx - (numCircuits - 1) / 2) * YBRANCH);
    // Portul CD corespunde numărului circuitului din Excel ("2" → port index 1 = C2)
    const cdPortIdx  = Math.max(0, (parseInt(circKey) || 1) - 1);
    const cdOutYRel  = cdOutY(cdType, cdPortIdx);
    const cdOutYAbs  = cdY + cdOutYRel;

    // Separă rândurile "sistem" (CD→SE10/1) de rândurile reale stalp→stalp
    const sysRow     = allSegments.find(s => SYSTEM_RE.test(s.stalpInceput.trim()));
    const segments   = allSegments.filter(s => !SYSTEM_RE.test(s.stalpInceput.trim()));
    const cdToFirstL = sysRow ? sysRow.lungime : 5; // lungimea conexiunii CD→primul stalp

    // ── Graf cu liste de adiacență (suportă ramificații) ──
    const adjList = {};   // label → [{to, lungime, conductor}]
    const hasParent = new Set();
    const consMap = {};

    segments.forEach(s => {
      if (!adjList[s.stalpInceput]) adjList[s.stalpInceput] = [];
      adjList[s.stalpInceput].push({ to: s.stalpFinal, lungime: s.lungime, conductor: s.conductor });
      hasParent.add(s.stalpFinal);
      consMap[s.stalpInceput] = s.consumatori;
    });

    const allLabels = new Set([...Object.keys(adjList), ...segments.map(s => s.stalpFinal)]);
    const rootNode  = [...allLabels].find(n => !hasParent.has(n)) || segments[0].stalpInceput;

    // ── Layout DFS: linie principală orizontală, ramificații alternează sus/jos ──
    const nodePos = {}; // label → {x, y}
    const BOFF = 160;   // offset vertical per ramificație
    let nextBranchUpY   = branchY; // ramificații impare → sus
    let nextBranchDownY = branchY; // ramificații pare  → jos

    function layoutDFS(label, x, y) {
      if (nodePos[label]) return;
      nodePos[label] = { x, y };
      const children = adjList[label] || [];
      // primul copil → continuă orizontal la același Y
      if (children.length > 0) layoutDFS(children[0].to, x + XSPACING, y);
      // copii suplimentari: impare urcă, pare coboară
      for (let i = 1; i < children.length; i++) {
        if (i % 2 === 1) {
          nextBranchUpY = Math.min(nextBranchUpY, y) - BOFF;
          layoutDFS(children[i].to, x + XSPACING, nextBranchUpY);
        } else {
          nextBranchDownY = Math.max(nextBranchDownY, y) + BOFF;
          layoutDFS(children[i].to, x + XSPACING, nextBranchDownY);
        }
      }
    }
    layoutDFS(rootNode, 200, branchY);

    // Noduri orfane (segment izolat fără legătură cu restul)
    let orphanX = 200;
    allLabels.forEach(label => {
      if (!nodePos[label]) {
        nextBranchDownY += BOFF;
        nodePos[label] = { x: orphanX, y: nextBranchDownY };
        orphanX += XSPACING;
      }
    });

    // ── Creează elemente stâlp ──
    const nodeIds = {};
    allLabels.forEach(label => {
      const pos = nodePos[label];
      const stType = stalpTypeFromLabel(label);
      const elId = uid();
      const consumers = consMap[label] ?? 0;
      const isBranch = (adjList[label]?.length || 0) > 1;
      const isLeaf   = !adjList[label] || adjList[label].length === 0;
      nodeIds[label] = elId;
      totalStalpi++;
      S.EL.push({
        id: elId, type: stType,
        x: pos.x, y: pos.y, label,
        color: '#555', fillColor: 'none',
        rotation: 0, scale: 1,
        consumatori: consumers,
        cons_dict: { [circLabel]: consumers },
        nod: isBranch ? 'nod' : (isLeaf ? 'capat' : ''),
      });
    });

    // ── Conexiune CD → primul stâlp ──
    const firstId = nodeIds[rootNode];
    if (firstId) {
      const firstEl = S.EL.find(e => e.id === firstId);
      const cond = parseConductor(segments[0]?.conductor || '');
      const p1 = { x: cdX + 70,       y: cdOutYAbs };
      const p2 = { x: firstEl.x - 22, y: branchY };
      const routeX = cdX + 110;
      const path = (Math.abs(cdOutYAbs - branchY) < 2)
        ? [p1, p2]
        : [p1, { x: routeX, y: cdOutYAbs }, { x: routeX, y: branchY }, p2];
      S.CN.push({
        id: uid(),
        fromElId: cdId,    fromTerm: { cx: 70, cy: cdOutYRel },
        toElId:   firstId, toTerm:   { cx: -22, cy: 0 },
        path,
        label: circLabel, length: cdToFirstL,
        color: '#ef4444', strokeWidth: 3, lineType: 'solid',
        tipConductor: cond.tipConductor, sectiune: cond.sectiune, tipRetea: cond.tipRetea,
        circuitGroup: circLabel,
      });
      totalCn++;
    }

    // ── Conexiuni între stâlpi (toate tronsonele din segmente) ──
    // Cele 3 terminale disponibile sus / jos pe fiecare stâlp
    const UP_TERMS   = [{ cx:  0, cy: -22 }, { cx: 13, cy: -22 }, { cx: -13, cy: -22 }];
    const DOWN_TERMS = [{ cx:  0, cy:  22 }, { cx: 13, cy:  22 }, { cx: -13, cy:  22 }];
    const termUsage  = {}; // nodeId → { up: 0, down: 0 }

    segments.forEach((seg, si) => {
      const fromId = nodeIds[seg.stalpInceput];
      const toId   = nodeIds[seg.stalpFinal];
      if (!fromId || !toId) return;
      const fromEl = S.EL.find(e => e.id === fromId);
      const toEl   = S.EL.find(e => e.id === toId);
      if (!fromEl || !toEl) return;
      const cond = parseConductor(seg.conductor);

      if (!termUsage[fromId]) termUsage[fromId] = { up: 0, down: 0 };

      // Alege terminalele și calea în funcție de direcție
      const sameY = Math.abs(fromEl.y - toEl.y) < 2;
      const sameX = Math.abs(fromEl.x - toEl.x) < 2;
      let fromTerm, toTerm, path;

      if (sameY) {
        // orizontal
        fromTerm = { cx: 22, cy: 0 }; toTerm = { cx: -22, cy: 0 };
        path = [{ x: fromEl.x + 22, y: fromEl.y }, { x: toEl.x - 22, y: toEl.y }];
      } else if (sameX) {
        // vertical pur (rar după noul layout)
        fromTerm = { cx: 0, cy: 22 }; toTerm = { cx: 0, cy: -22 };
        path = [{ x: fromEl.x, y: fromEl.y + 22 }, { x: toEl.x, y: toEl.y - 22 }];
      } else if (toEl.y < fromEl.y) {
        // ramificație sus: terminal următor disponibil de pe latura de sus
        const t = UP_TERMS[termUsage[fromId].up % UP_TERMS.length];
        termUsage[fromId].up++;
        fromTerm = t; toTerm = { cx: -22, cy: 0 };
        path = [
          { x: fromEl.x + t.cx, y: fromEl.y + t.cy },
          { x: fromEl.x + t.cx, y: toEl.y },
          { x: toEl.x - 22,     y: toEl.y },
        ];
      } else {
        // ramificație jos: terminal următor disponibil de pe latura de jos
        const t = DOWN_TERMS[termUsage[fromId].down % DOWN_TERMS.length];
        termUsage[fromId].down++;
        fromTerm = t; toTerm = { cx: -22, cy: 0 };
        path = [
          { x: fromEl.x + t.cx, y: fromEl.y + t.cy },
          { x: fromEl.x + t.cx, y: toEl.y },
          { x: toEl.x - 22,     y: toEl.y },
        ];
      }

      S.CN.push({
        id: uid(),
        fromElId: fromId, fromTerm,
        toElId:   toId,   toTerm,
        path,
        label: `${circLabel}-${si + 1}`, length: seg.lungime,
        color: '#ef4444', strokeWidth: 3, lineType: 'solid',
        tipConductor: cond.tipConductor, sectiune: cond.sectiune, tipRetea: cond.tipRetea,
        circuitGroup: circLabel,
      });
      totalCn++;
    });
  });

  render();
  updateStat();
  toast(`Import OK — ${totalStalpi} stâlpi, ${totalCn} tronsoане din "${postName}"`, 'ok');
}
