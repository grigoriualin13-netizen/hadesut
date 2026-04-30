// ElectroCAD Pro v12 — Fișă de Soluție Module
import { EL, CN } from './state.js';
import { nextLbl, toast } from './utils.js';
import { getPTpower } from './helpers.js';
import { computeCantitatiFC } from './fc-helpers.js';

// ========== FS Modal Management ==========

export function openFSModal() {
  document.getElementById('fs-modal').style.display = 'flex';
  const ptEl = EL.find(e => e.type === 'trafo' || e.type === 'ptab_1t' || e.type === 'ptab_2t');
  if (ptEl) {
    const nrTrafo = ptEl.type === 'ptab_2t' ? '2' : '1';
    const pw = ptEl.type === 'trafo' ? (ptEl.trText || {power:'160kVA'}).power : (ptEl.trText || ptEl.trText1 || {power:'250kVA'}).power || '250kVA';
    document.getElementById('fs-pt-info').innerHTML = `Detectat: <b>${ptEl.label||ptEl.type}</b> — ${nrTrafo}x${pw}`;
    if (!document.getElementById('fs-pt-name').value) document.getElementById('fs-pt-name').value = ptEl.label || '';
  }
}

export function closeFSModal() {
  document.getElementById('fs-modal').style.display = 'none';
  document.getElementById('fs-preview-section').style.display = 'none';
}

export function resetFSForm() {
  ['fs-erre','fs-nr','fs-beneficiar','fs-localitate','fs-obiectiv','fs-putere-kw','fs-putere-kva',
   'fs-pt-name','fs-info-retea','fs-lucrari-intarire','fs-tarif','fs-tarif-data','fs-tarif-intarire',
   'fs-tarif-total','fs-coord','fs-elaborat','fs-ae-statie','fs-ae-linie','fs-ae-post','fs-ae-plecare','fs-ae-stalp'
  ].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('fs-u-pt').value = '400';
  document.getElementById('fs-u-cons').value = '380';
  document.getElementById('fs-u-capat').value = '';
  document.getElementById('fs-pt-info').innerHTML = 'Se va completa automat din schemă...';
  document.getElementById('fs-preview-section').style.display = 'none';
}

export function previewFS() { generateFS(true); }

export function copyPreviewField(id) {
  const el = document.getElementById(id);
  if (el && el.value) {
    navigator.clipboard.writeText(el.value).then(() => toast('Text copiat!', 'ok')).catch(() => {
      el.select(); document.execCommand('copy'); toast('Text copiat!', 'ok');
    });
  }
}

export function copyAllPreview() {
  const r = document.getElementById('fs-preview-racordare').value || '';
  const i = document.getElementById('fs-preview-intarire').value || '';
  const n = document.getElementById('fs-preview-retea').value || '';
  const all = `6a. SOLUȚIA DE RACORDARE:\n${r}\n\n6b. LUCRĂRI ÎNTĂRIRE REȚEA:\n${i}\n\n5. INFORMAȚII REȚEA EXISTENTĂ:\n${n}`;
  navigator.clipboard.writeText(all).then(() => toast('Tot textul copiat!', 'ok')).catch(() => {
    const tmp = document.createElement('textarea'); tmp.value = all; document.body.appendChild(tmp); tmp.select(); document.execCommand('copy'); document.body.removeChild(tmp); toast('Tot textul copiat!', 'ok');
  });
}

// ========== Fișa de Calcul (FC) ==========

export async function generateFC() {
  if (!window.ExcelJS) { toast('ExcelJS nu e încărcat!', ''); return; }
  if (!window.FC_TEMPLATE_B64) { toast('Template FC nu e încărcat (fc_template.js)!', ''); return; }
  toast('Generez Fișa de Calcul...', 'ac');

  // Decode template base64 → ArrayBuffer
  const binStr = atob(window.FC_TEMPLATE_B64);
  const buf = new ArrayBuffer(binStr.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);

  // Load template (păstrează toate stilurile: culori, borduri, font-uri, merges)
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);

  const dePrintat = wb.getWorksheet('DE PRINTAT');
  const fcCalcul  = wb.getWorksheet('FC CALCUL');

  // Header client (DE PRINTAT C1/C2/C3)
  const beneficiar = (document.getElementById('fs-beneficiar')||{}).value || '';
  const atr        = (document.getElementById('fs-nr')||{}).value || '';
  const localitate = (document.getElementById('fs-localitate')||{}).value || '';
  if (dePrintat) {
    dePrintat.getCell('C1').value = beneficiar;
    dePrintat.getCell('C2').value = atr;
    dePrintat.getCell('C3').value = localitate;
  }

  // Scrie cantitățile în FC CALCUL!G{row} (poz P → rând P+9)
  const q = computeCantitatiFC();
  if (fcCalcul) {
    q.forEach((cant, pozId) => {
      const rowNum = pozId + 9;
      fcCalcul.getCell(`G${rowNum}`).value = cant;
    });
  }

  // Reproduce VBA Worksheet_Activate: ascunde rândurile cu cantitate 0 + renumerotează coloana A
  // Verificăm direct în FC CALCUL G{i} (pentru A), Spargeri G{i-96} (B), AVIZE C{i-113} (C)
  if (dePrintat) {
    const spargeri = wb.getWorksheet('Spargeri si refacere carosabil');
    const avize    = wb.getWorksheet('AVIZE SI ACORDURI');
    const readNum = v => {
      if (v == null) return 0;
      if (typeof v === 'object' && 'result' in v) v = v.result;
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    };
    const sections = [
      { start:10,  end:94,  prefix:'A.', source:(i)=> fcCalcul ? readNum(fcCalcul.getCell(`G${i}`).value) : 0 },
      { start:99,  end:115, prefix:'B.', source:(i)=> spargeri ? readNum(spargeri.getCell(`G${i-96}`).value) : 0 },
      { start:120, end:141, prefix:'C.', source:(i)=> {
          if (!avize) return 0;
          const v = avize.getCell(`C${i-113}`).value;
          return v && String(v).trim() ? 1 : 0;
        } },
    ];
    sections.forEach(s => {
      let n = 1;
      for (let i = s.start; i <= s.end; i++) {
        const row = dePrintat.getRow(i);
        const hasCant = s.source(i) > 0;
        if (hasCant) {
          row.hidden = false;
          row.getCell(1).value = s.prefix + n;
          n++;
        } else {
          row.hidden = true;
        }
      }
    });
  }

  // Force Excel să recalculeze formulele la deschidere (altfel cached results din template rămân)
  wb.calcProperties = wb.calcProperties || {};
  wb.calcProperties.fullCalcOnLoad = true;

  // Save ca xlsx → Blob → download
  const outBuf = await wb.xlsx.writeBuffer();
  const blob = new Blob([outBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fname = `Fisa_Calcul_${(beneficiar||'client').replace(/[^\w-]/g,'_')}_${new Date().toISOString().slice(0,10)}.xlsx`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);

  toast('Fișa de Calcul generată ✓', 'ok');
}
// ========== Fișa de Soluție (FS) ==========

export async function generateFS(previewOnly) {
  if (!previewOnly && !window.docx) { toast('Librăria DOCX nu e încărcată!', ''); return; }
  if (!previewOnly) toast('Generez Fișa de Soluție...', 'ac');

  // Collect form data
  const erre = document.getElementById('fs-erre').value || 'ERRE';
  const nrDoc = document.getElementById('fs-nr').value || '';
  const beneficiar = document.getElementById('fs-beneficiar').value || '';
  const localitate = document.getElementById('fs-localitate').value || '';
  const obiectiv = document.getElementById('fs-obiectiv').value || '';
  const putereKW = document.getElementById('fs-putere-kw').value || '';
  const putereKVA = document.getElementById('fs-putere-kva').value || '';
  const ptName = document.getElementById('fs-pt-name').value || '';
  const uPT = document.getElementById('fs-u-pt').value || '400';
  const uCons = document.getElementById('fs-u-cons').value || '380';
  const uCapat = document.getElementById('fs-u-capat').value || '';
  const infoRetea = document.getElementById('fs-info-retea').value || '';
  const lucrariIntarire = document.getElementById('fs-lucrari-intarire').value || 'NU ESTE CAZUL';
  const tarif = document.getElementById('fs-tarif').value || '';
  const tarifData = document.getElementById('fs-tarif-data').value || '';
  const tarifIntarire = document.getElementById('fs-tarif-intarire').value || '';
  const tarifTotal = document.getElementById('fs-tarif-total').value || '';
  const coord = document.getElementById('fs-coord').value || '';
  const elaborat = document.getElementById('fs-elaborat').value || '';
  const aeStatie = document.getElementById('fs-ae-statie').value || '';
  const aeLinie = document.getElementById('fs-ae-linie').value || '';
  const aePost = document.getElementById('fs-ae-post').value || '';
  const aePlecare = document.getElementById('fs-ae-plecare').value || '';
  const aeStalp = document.getElementById('fs-ae-stalp').value || '';

  // Auto-detect PT data
  const ptEl = EL.find(e => e.type === 'trafo' || e.type === 'ptab_1t' || e.type === 'ptab_2t');
  const nrTrafo = ptEl && ptEl.type === 'ptab_2t' ? 2 : 1;
  const ptPower = ptEl ? getPTpower(ptEl) : '250kVA';
  const putereTrafo = parseInt(ptPower.replace(/[^0-9]/g, '')) || 250;

  // Collect proiectat elements for solution description
  const proiectRacordare = { elemente: [], cabluri: [] };
  const proiectIntarire = { elemente: [], cabluri: [] };
  EL.forEach(el => {
    if (el.stare === 'proiectat_racordare') proiectRacordare.elemente.push(el);
    if (el.stare === 'intarire_inlocuire' || el.stare === 'intarire_nou' || el.stare === 'proiectat_intarire') proiectIntarire.elemente.push(el);
  });
  CN.forEach(cn => {
    if (cn.stare === 'proiectat_racordare') proiectRacordare.cabluri.push(cn);
    if (cn.stare === 'intarire_inlocuire' || cn.stare === 'intarire_nou' || cn.stare === 'proiectat_intarire') proiectIntarire.cabluri.push(cn);
  });

  // Build solution description text
  // Official cable name mapping based on tipConductor + sectiune + tipRetea
  function getCableOfficialName(tipConductor, sectiune, tipRetea) {
    const sec = parseFloat(sectiune) || 16;
    const isMono = tipRetea === 'Monofazat';

    if (tipConductor === 'Torsadat Al' || tipConductor === 'Clasic Al') {
      // Bransament aerian NFA2X
      if (isMono) return `NFA2X ${sec}+25 mmp`;
      // Trifazat
      if (sec <= 16) return 'NFA2X 3x16+25 mmp';
      if (sec <= 35) return 'NFA2X 3x35+16 mmp';
      if (sec <= 50) return 'NFA2X 3x50+25 mmp';
      if (sec <= 70) return 'NFA2X 3x70+35 mmp';
      // Retea aeriană
      if (sec <= 95) return 'NFA2X 50 OL-AL 3x95 mmp';
      return `NFA2X 3x${sec} mmp`;
    }

    if (tipConductor === 'Cablu Al') {
      // Bransament/retea subteran NA2XBY
      if (isMono) return 'NA2XBY 2x25 mmp';
      if (sec <= 25) return 'NA2XBY 3x25+16 mmp';
      if (sec <= 35) return 'NA2XBY 3x35+16 mmp';
      if (sec <= 50) return 'NA2XBY 3x50+16 mmp';
      if (sec <= 70) return 'NA2XBY 3x70+35 mmp';
      if (sec <= 150) return 'NA2XBY 3x150+70 mmp';
      if (sec <= 185) return 'NA2XBY 3x185+95 mmp';
      if (sec <= 240) return 'NA2XBY 3x240+120 mmp';
      return `NA2XBY 3x${sec} mmp`;
    }

    if (tipConductor === 'Cablu Cu') {
      if (isMono) return `NYY 2x${sec} mmp`;
      if (sec <= 25) return 'NYY 3x25+16 mmp';
      if (sec <= 35) return 'NYY 3x35+16 mmp';
      if (sec <= 50) return 'NYY 3x50+25 mmp';
      if (sec <= 70) return 'NYY 3x70+35 mmp';
      if (sec <= 150) return 'NYY 3x150+70 mmp';
      if (sec <= 185) return 'NYY 3x185+95 mmp';
      if (sec <= 240) return 'NYY 3x240+120 mmp';
      return `NYY 3x${sec} mmp`;
    }

    return `${tipConductor} ${sec} mmp`;
  }

  // NFA2X = conductor, NA2XBY/NYY = cablu
  function getConductorOrCablu(officialName) {
    if (officialName.startsWith('NA2XBY') || officialName.startsWith('NYY')) return 'cablu';
    return 'conductor';
  }

  // Determină locul montării BMPT: pe stâlp dacă branșament < 8.05m din stâlp, altfel pe soclu de beton
  // fromFirida=true → mereu pe soclu de beton
  function getBMPTLocation(cableOrLen, fromFirida) {
    if (fromFirida) return 'pe soclu de beton la limita de proprietate';
    var len = typeof cableOrLen === 'number' ? cableOrLen : (parseFloat(cableOrLen && cableOrLen.length) || 0);
    if (len > 0 && len < 8.05) return 'pe stalpul de racord';
    return 'pe soclu de beton la limita de proprietate';
  }

  // Describe cable group with official names (available globally in generateFS)
  function describeCableGroup(cables) {
    const grouped = {};
    cables.forEach(cn => {
      const name = getCableOfficialName(cn.tipConductor || 'Cablu Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
      if (!grouped[name]) grouped[name] = 0;
      grouped[name] += parseFloat(cn.length) || 0;
    });
    return Object.entries(grouped).map(([name, len]) => {
      const tipCC = getConductorOrCablu(name);
      return `${tipCC} tip ${name} in lungime de ${len.toFixed(0)} m`;
    });
  }

  // Helper: "Din CD a PT..." or "Din TDJT a PTAb..."
  function getSourcePrefix(srcEl, ptLabel) {
    if (!srcEl) return 'Din ';
    if (srcEl.type === 'ptab_1t' || srcEl.type === 'ptab_2t') return `Din TDJT a ${ptLabel || srcEl.label || 'PTAb'}`;
    if (srcEl.type.startsWith('cd')) return `Din CD a ${ptLabel || srcEl.label || 'PT'}`;
    if (srcEl.type === 'trafo') return `Din CD a ${ptLabel || srcEl.label || 'PT'}`;
    return `Din ${srcEl.label || ''}`;
  }

  function describeCables(cabluri) {
    if (cabluri.length === 0) return '';
    const grouped = {};
    cabluri.forEach(cn => {
      const officialName = getCableOfficialName(cn.tipConductor || 'Cablu Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
      if (!grouped[officialName]) grouped[officialName] = { name: officialName, totalLen: 0 };
      grouped[officialName].totalLen += parseFloat(cn.length) || 0;
    });
    return Object.values(grouped).map(g => {
      return `cablu tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m`;
    }).join(', ');
  }

  function describeElements(elemente) {
    const types = {};
    elemente.forEach(el => {
      const tName = { meter: 'BMPT', stalp_se4: 'stâlp SE4', stalp_se10: 'stâlp SE10', stalp_sc10002: 'stâlp SC10002', stalp_sc10005: 'stâlp SC10005', stalp_rotund: 'stâlp rotund', firida_e2_4: 'firidă E2-4', firida_e3_4: 'firidă E3-4', cd4: 'CD 4P', cd5: 'CD 5P', cd8: 'CD 8P' }[el.type] || el.type;
      if (!types[tName]) types[tName] = [];
      types[tName].push(el);
    });
    return Object.entries(types).map(([name, els]) => {
      if (name === 'BMPT' && els.length === 1) {
        const bmpt = els[0];
        // Find bransament cable to this BMPT to determine location
        const bmptCable = cabluri.find(cn => cn.fromElId === bmpt.id || cn.toElId === bmpt.id);
        const bmptLen = bmptCable ? (parseFloat(bmptCable.length) || 0) : 0;
        const bmptSrcId = bmptCable ? (bmptCable.fromElId === bmpt.id ? bmptCable.toElId : bmptCable.fromElId) : null;
        const bmptSrcEl = bmptSrcId ? EL.find(e => e.id === bmptSrcId) : null;
        const bmptFromFirida = bmptSrcEl && bmptSrcEl.type && bmptSrcEl.type.startsWith('firida_');
        return `BMPT ${bmpt.bmptText || ''} montat ${getBMPTLocation(bmptLen, bmptFromFirida)}`.trim();
      }
      return els.length > 1 ? `${els.length}x ${name}` : name;
    }).join(', ');
  }

  // Build solution text by tracing the proiectat path topology
  function buildSolutionText(cabluri, elemente) {
    if (cabluri.length === 0 && elemente.length === 0) return 'Alimentarea cu energie electrica a obiectivului.';

    const proiectIds = new Set(elemente.map(e => e.id));

    // Classify proiectat elements
    const stalpiProiectati = elemente.filter(e => e.type.startsWith('stalp_'));
    const firideleProiectate = elemente.filter(e => e.type.startsWith('firida_'));
    const bmptEl = elemente.find(e => e.type === 'meter');
    const nrStalpiNoi = stalpiProiectati.length;
    const nrFirideNoi = firideleProiectate.length;
    const hasCircuit = nrStalpiNoi > 0 || nrFirideNoi > 0;
    const circuitIsSubteran = nrFirideNoi > 0 && nrStalpiNoi === 0;

    function getFiridaTypeName(el) {
      return { firida_e2_4: 'FG E2-4', firida_e3_4: 'FG E3-4', firida_e3_0: 'FG E3-0' }[el.type] || el.label || 'FG';
    }

    // Helper: describe a cable group with correct conductor/cablu
    function describeCableGroup(cables) {
      const grouped = {};
      cables.forEach(cn => {
        const name = getCableOfficialName(cn.tipConductor || 'Cablu Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
        if (!grouped[name]) grouped[name] = 0;
        grouped[name] += parseFloat(cn.length) || 0;
      });
      return Object.entries(grouped).map(([name, len]) => {
        const tipCC = getConductorOrCablu(name);
        return `${tipCC} tip ${name} in lungime de ${len.toFixed(0)} m`;
      });
    }

    // Classify cables
    const cabluriBransament = [], cabluriCircuit = [];
    cabluri.forEach(cn => {
      const fromEl = EL.find(e => e.id === cn.fromElId);
      const toEl = EL.find(e => e.id === cn.toElId);
      if ((fromEl && fromEl.type === 'meter') || (toEl && toEl.type === 'meter')) {
        cabluriBransament.push(cn);
      } else {
        cabluriCircuit.push(cn);
      }
    });

    const hasBransament = cabluriBransament.length > 0 && bmptEl;

    // BMPT text
    let bmptText = '';
    if (bmptEl) {
      const bmptCableLen = cabluriBransament.length > 0 ? (parseFloat(cabluriBransament[0].length) || 0) : 0;
      const bCable0 = cabluriBransament[0];
      const srcElId0 = bCable0 ? (bCable0.fromElId === bmptEl.id ? bCable0.toElId : bCable0.fromElId) : null;
      const srcEl0 = srcElId0 ? EL.find(e => e.id === srcElId0) : null;
      const fromFirida0 = srcEl0 && srcEl0.type && srcEl0.type.startsWith('firida_');
      bmptText = `un ${bmptEl.bmptText || bmptEl.label || 'BMPT'} montat ${getBMPTLocation(bmptCableLen, fromFirida0)}`;
    }

    // Find last element before BMPT
    let lastElBeforeBMPT = null;
    if (bmptEl && cabluriBransament.length > 0) {
      const bCable = cabluriBransament[0];
      const otherElId = bCable.fromElId === bmptEl.id ? bCable.toElId : bCable.fromElId;
      lastElBeforeBMPT = EL.find(e => e.id === otherElId);
    }

    // Find ALL source elements (existing CD/PT connected to proiectat cables)
    const sourceEls = [];
    const sourceElIds = new Set();
    cabluri.forEach(cn => {
      [cn.fromElId, cn.toElId].forEach(elId => {
        if (elId && !proiectIds.has(elId) && !sourceElIds.has(elId)) {
          const el = EL.find(e => e.id === elId);
          if (el && (!el.stare || el.stare === 'existent')) {
            const isSource = el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type.startsWith('firida_');
            if (isSource) {
              // Find which PT this CD belongs to
              let ptLabel = el.label || '';
              // Check if CD is connected to a PT via existing cable
              const ptCable = CN.filter(c => (!c.stare || c.stare === 'existent') && (c.fromElId === elId || c.toElId === elId));
              ptCable.forEach(pc => {
                const otherEnd = pc.fromElId === elId ? pc.toElId : pc.fromElId;
                const ptE = EL.find(e => e.id === otherEnd && (e.type === 'trafo' || e.type.startsWith('ptab_')));
                if (ptE) ptLabel = ptE.label || ptLabel;
              });
              // Find circuit
              let circ = '';
              const relCable = cabluri.find(c => c.fromElId === elId || c.toElId === elId);
              if (relCable) {
                if (relCable.circuitGroup) circ = relCable.circuitGroup;
                else if (relCable.fromCircuit) circ = 'C' + relCable.fromCircuit;
              }
              // Get cables from this source
              const sourceCables = cabluriCircuit.filter(cn => cn.fromElId === elId || cn.toElId === elId);
              sourceEls.push({ el, ptLabel, circuit: circ, cables: sourceCables });
              sourceElIds.add(elId);
            } else {
              // Stalp existent - simplu bransament
              let circ = '';
              const existCables = CN.filter(c => (!c.stare || c.stare === 'existent') && (c.fromElId === elId || c.toElId === elId));
              for (const c of existCables) {
                if (c.circuitGroup) { circ = c.circuitGroup; break; }
                if (c.fromCircuit) { circ = 'C' + c.fromCircuit; break; }
              }
              sourceEls.push({ el, ptLabel: el.label || '', circuit: circ, cables: [], isStalp: true });
              sourceElIds.add(elId);
            }
          }
        }
      });
    });

    // ══════════════════════════════════════════════
    // CASE: Mansonare - intercalare firida in retea subterana existenta
    // TREBUIE SA FIE PRIMUL CAZ (prioritate maxima)
    // ══════════════════════════════════════════════
    const mansoaneProiectate = elemente.filter(e => e.type === 'manson');
    const hasMansonare = mansoaneProiectate.length >= 2 && firideleProiectate.length > 0;

    if (hasMansonare) {
      const firidaGroups = [];

      firideleProiectate.forEach(fgNoua => {
        const fgNouaName = getFiridaTypeName(fgNoua);

        const myMansoane = mansoaneProiectate.filter(manson => {
          return cabluri.some(cn =>
            (cn.fromElId === manson.id && cn.toElId === fgNoua.id) ||
            (cn.toElId === manson.id && cn.fromElId === fgNoua.id)
          );
        });

        const firideExistente = [];
        myMansoane.forEach(manson => {
          cabluri.forEach(cn => {
            const otherId = cn.fromElId === manson.id ? cn.toElId : (cn.toElId === manson.id ? cn.fromElId : null);
            if (otherId && !proiectIds.has(otherId)) {
              const otherEl = EL.find(e => e.id === otherId);
              if (otherEl && otherEl.type.startsWith('firida_') && (!otherEl.stare || otherEl.stare === 'existent')) {
                if (!firideExistente.find(f => f.id === otherEl.id)) firideExistente.push(otherEl);
              }
            }
          });
        });

        const myMansonIds = new Set(myMansoane.map(m => m.id));
        const cabluriRacord = cabluriCircuit.filter(cn => myMansonIds.has(cn.fromElId) || myMansonIds.has(cn.toElId));

        const myBransamente = [];
        elemente.filter(e => e.type === 'meter').forEach(bmpt => {
          const bCable = cabluriBransament.find(cn =>
            (cn.fromElId === fgNoua.id && cn.toElId === bmpt.id) ||
            (cn.toElId === fgNoua.id && cn.fromElId === bmpt.id)
          );
          if (bCable) myBransamente.push({ bmpt, cable: bCable });
        });
        if (myBransamente.length === 0) {
          cabluriBransament.forEach(cn => {
            const fromEl = EL.find(e => e.id === cn.fromElId);
            const toEl = EL.find(e => e.id === cn.toElId);
            if (fromEl && fromEl.id === fgNoua.id && toEl && toEl.type === 'meter') myBransamente.push({ bmpt: toEl, cable: cn });
            else if (toEl && toEl.id === fgNoua.id && fromEl && fromEl.type === 'meter') myBransamente.push({ bmpt: fromEl, cable: cn });
          });
        }

        firidaGroups.push({ fgNoua, fgNouaName, firideExistente, cabluriRacord, myBransamente });
      });

      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ';

      firidaGroups.forEach((fg, fgIdx) => {
        const fg1Label = fg.firideExistente[0] ? (fg.firideExistente[0].label || 'FG') : 'FG';
        const fg2Label = fg.firideExistente[1] ? (fg.firideExistente[1].label || 'FG') : '';
        const entreText = fg2Label ? `dintre ${fg1Label} si ${fg2Label}` : `din ${fg1Label}`;

        if (fg.cabluriRacord.length > 0) {
          const grouped = {};
          fg.cabluriRacord.forEach(cn => {
            const name = getCableOfficialName(cn.tipConductor || 'Cablu Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
            if (!grouped[name]) grouped[name] = { name, lengths: [], tipCC: getConductorOrCablu(name) };
            grouped[name].lengths.push(parseFloat(cn.length) || 0);
          });
          const cableDescs = Object.values(grouped).map(g => {
            const nrBuc = g.lengths.length;
            const lenText = nrBuc > 1 ? `${nrBuc}x${(g.lengths.reduce((a,b)=>a+b,0) / nrBuc).toFixed(0)}m` : `${g.lengths[0].toFixed(0)} m`;
            return `${g.tipCC} tip ${g.name} in lungime de ${lenText}`;
          });
          text += `Se va mansona cablul existent ${entreText} cu ${cableDescs.join(', ')} pana la o ${fg.fgNouaName} proiectata si montata la limita de proprietate pe soclu de beton`;
        } else {
          text += `Se va monta o ${fg.fgNouaName} proiectata ${entreText}`;
        }

        if (fg.myBransamente.length === 1) {
          const bran = fg.myBransamente[0];
          const bmptLabel = bran.bmpt.bmptText || bran.bmpt.label || 'BMPT';
          const branLen = parseFloat(bran.cable.length) || 0;
          const branDescs = describeCableGroup([bran.cable]);
          text += `. Din ${fg.fgNouaName} proiectata, se va realiza un bransament cu ${branDescs.join(', ')}, pana la un ${bmptLabel} montat ${getBMPTLocation(branLen, true)}`;
        } else if (fg.myBransamente.length > 1) {
          const nrText = ['doua','trei','patru','cinci','sase'][fg.myBransamente.length - 2] || fg.myBransamente.length;
          text += `. Din ${fg.fgNouaName} proiectata, se vor realiza ${nrText} bransamente astfel:`;
          fg.myBransamente.forEach(bran => {
            const bmptLabel = bran.bmpt.bmptText || bran.bmpt.label || 'BMPT';
            const cableName = getCableOfficialName(bran.cable.tipConductor || 'Cablu Al', bran.cable.sectiune || 16, bran.cable.tipRetea || 'Trifazat');
            const tipCC = getConductorOrCablu(cableName);
            const len = parseFloat(bran.cable.length) || 0;
            text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}`;
          });
        }

        text += '.';
        if (fgIdx < firidaGroups.length - 1) text += ' ';
      });

      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Multiple sources (baza + rezerva)
    // ══════════════════════════════════════════════
    const cdSources = sourceEls.filter(s => !s.isStalp);
    if (cdSources.length >= 2 && hasCircuit) {
      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel:\n\n';

      // Trace cables from each source to the firida/stalp
      cdSources.forEach((src, idx) => {
        // Find all cables that form the path from this source
        const srcId = src.el.id;
        const pathCables = [];
        const visited = new Set([srcId]);
        const queue = [srcId];
        while (queue.length > 0) {
          const curId = queue.shift();
          cabluriCircuit.forEach(cn => {
            const otherId = cn.fromElId === curId ? cn.toElId : (cn.toElId === curId ? cn.fromElId : null);
            if (otherId && !visited.has(otherId) && proiectIds.has(otherId)) {
              const otherEl = EL.find(e => e.id === otherId);
              // Stop at firida (don't cross to the other source's path)
              if (otherEl && otherEl.type.startsWith('firida_')) {
                pathCables.push(cn);
                visited.add(otherId);
                // Don't continue past firida
              } else if (otherEl && otherEl.type.startsWith('stalp_')) {
                pathCables.push(cn);
                visited.add(otherId);
                queue.push(otherId);
              } else {
                pathCables.push(cn);
                visited.add(otherId);
                queue.push(otherId);
              }
            }
          });
        }

        // Also include the cable directly from source to first element
        cabluriCircuit.forEach(cn => {
          if ((cn.fromElId === srcId || cn.toElId === srcId) && !pathCables.includes(cn)) {
            pathCables.push(cn);
          }
        });

        const label = idx === 0 ? 'Alimentare de baza' : 'Alimentare de rezerva';
        const ptLbl = src.ptLabel || src.el.label || '';
        const cableDescs = describeCableGroup(pathCables);
        const srcIsFirida = src.el.type.startsWith('firida_');

        // Detect existing cable type on source for LES/LEA description
        const existCablesOnSrc = CN.filter(cn => (!cn.stare || cn.stare === 'existent') && (cn.fromElId === src.el.id || cn.toElId === src.el.id));
        let tipReteaSrc = '';
        let conductorSrc = '';
        if (existCablesOnSrc.length > 0) {
          const ec = existCablesOnSrc[0];
          conductorSrc = getCableOfficialName(ec.tipConductor || 'Cablu Al', ec.sectiune || 16, ec.tipRetea || 'Trifazat');
          tipReteaSrc = (ec.tipConductor === 'Cablu Al' || ec.tipConductor === 'Cablu Cu') ? 'LES' : 'LEA';
        }

        if (srcIsFirida) {
          // Extindere LES din firidă existentă
          text += `${label}: prin extinderea retelei existente de tip ${tipReteaSrc || 'LES'}`;
          if (conductorSrc) text += ` (${conductorSrc})`;
          if (src.circuit) text += `, circuit ${src.circuit}`;
          text += ` din ${src.el.label || 'FG'} se va poza ${cableDescs.join(', ')}`;
        } else {
          // Alimentare din CD/PT — detect existing network type
          if (firideleProiectate.length > 0) {
            text += `${label}: prin extinderea retelei existente de tip ${tipReteaSrc || 'LES'}`;
            if (conductorSrc) text += ` (${conductorSrc})`;
            if (src.circuit) text += `, circuit ${src.circuit}`;
            text += ` din ${src.el.label || getSourcePrefix(src.el, ptLbl).replace('Din ','')} se va poza ${cableDescs.join(', ')}`;
          } else {
            text += `${label}: ${getSourcePrefix(src.el, ptLbl)}, se va echipa circuit ${src.circuit || ''} cu ${cableDescs.join(', ')}`;
          }
        }

        // Find target firida
        const targetFirida = firideleProiectate.length > 0 ? firideleProiectate[0] : null;
        if (targetFirida) {
          text += ` pana la o ${getFiridaTypeName(targetFirida)} proiectata si montata pe soclu de beton`;
        }
        text += '.\n';
      });

      // Bransamente from firide to BMPTs
      if (hasBransament && firideleProiectate.length > 0) {
        const firidaBrans = [];
        firideleProiectate.forEach(fg => {
          const fgId = fg.id;
          const fgLabel = fg.label || getFiridaTypeName(fg);
          const brans = [];
          cabluriBransament.forEach(cn => {
            const otherId = cn.fromElId === fgId ? cn.toElId : (cn.toElId === fgId ? cn.fromElId : null);
            if (!otherId) return;
            const otherEl = EL.find(e => e.id === otherId);
            if (otherEl && otherEl.type === 'meter') brans.push({ bmpt: otherEl, cable: cn });
          });
          if (brans.length > 0) firidaBrans.push({ fgLabel, brans });
        });

        if (firidaBrans.length > 0) {
          text += 'Bransamente:';
          firidaBrans.forEach(fb => {
            if (fb.brans.length === 1) {
              const b = fb.brans[0];
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
              const bDescs = describeCableGroup([b.cable]);
              text += `\nDin ${fb.fgLabel} se va realiza 1 bransament cu ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
            } else {
              text += `\nDin ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
              fb.brans.forEach(b => {
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
                const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
                const tipCC = getConductorOrCablu(cableName);
                const len = parseFloat(b.cable.length) || 0;
                text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
              });
            }
          });
        }
      } else if (hasBransament) {
        const branDescs = describeCableGroup(cabluriBransament);
        text += `Bransament: ${branDescs.join(', ')}`;
        if (bmptText) text += `, pana la ${bmptText}`;
        text += '.';
      }

      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Prelungire circuit existent cu stalpi noi proiectati
    // Trigger: sursa e un stalp existent, urmat de stalpi noi proiectati + bransament
    // ══════════════════════════════════════════════
    // Determine primary source type
    const cdSource = sourceEls.find(s => !s.isStalp);
    const stalpSource = sourceEls.find(s => s.isStalp);
    // srcIsStalp only if there's NO CD/PT source — CD always takes priority
    const srcIsStalp = !!stalpSource && !cdSource;
    if (srcIsStalp && nrStalpiNoi > 0) {
      // Move stalp source to first position
      const idx = sourceEls.indexOf(stalpSource);
      if (idx > 0) { sourceEls.splice(idx, 1); sourceEls.unshift(stalpSource); }
    }
    if (srcIsStalp && nrStalpiNoi > 0 && hasBransament) {
      const src = sourceEls[0];
      const srcLabel = src.el.label || 'SE';

      // Find which existing circuit this stalp belongs to
      let existCircuit = src.circuit || '';
      if (!existCircuit) {
        CN.filter(cn => (!cn.stare || cn.stare === 'existent') && (cn.fromElId === src.el.id || cn.toElId === src.el.id)).forEach(cn => {
          if (cn.circuitGroup) existCircuit = cn.circuitGroup;
          else if (cn.label && cn.label.match(/^C\d/)) existCircuit = cn.label.split('-')[0];
        });
      }

      // Calculate total circuit extension length
      const extensionLen = cabluriCircuit.reduce((s, cn) => s + (parseFloat(cn.length) || 0), 0);
      const circDescs = describeCableGroup(cabluriCircuit);

      // Group stalpi by type prefix (e.g. SC10002, SE4, SE10)
      const stalpGroups = {};
      stalpiProiectati.forEach(st => {
        const prefix = (st.label || '').replace(/\/\d+$/, '') || { stalp_sc10002:'SC10002', stalp_sc10005:'SC10005', stalp_se4:'SE4', stalp_se10:'SE10', stalp_rotund:'SR', stalp_rotund_special:'SRS', stalp_cs:'SCS' }[st.type] || st.type;
        if (!stalpGroups[prefix]) stalpGroups[prefix] = 0;
        stalpGroups[prefix]++;
      });
      const stalpTypeText = Object.entries(stalpGroups).map(([name, cnt]) => `${cnt}x${name}`).join(' si ');

      // Find last proiectat stalp (the one before BMPT)
      const lastStalp = lastElBeforeBMPT && lastElBeforeBMPT.type.startsWith('stalp_') ? lastElBeforeBMPT : stalpiProiectati[stalpiProiectati.length - 1];
      const lastStalpLabel = lastStalp ? (lastStalp.label || 'ultimul stalp') : 'ultimul stalp';

      let text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea circuitului ${existCircuit} existent de la stalpul ${srcLabel} pe o lungime de ${extensionLen.toFixed(0)} m cu ${circDescs.join(', ')} pe stalpi noi proiectati de tip ${stalpTypeText}.`;

      // Find bransamente per stalp proiectat
      const stalpBransamente = [];
      stalpiProiectati.forEach(st => {
        const stId = st.id;
        const stLabel = st.label || 'stalp';
        const brans = [];
        cabluriBransament.forEach(cn => {
          const otherId = cn.fromElId === stId ? cn.toElId : (cn.toElId === stId ? cn.fromElId : null);
          if (!otherId) return;
          const otherEl = EL.find(e => e.id === otherId);
          if (otherEl && otherEl.type === 'meter') {
            brans.push({ bmpt: otherEl, cable: cn });
          }
        });
        if (brans.length > 0) {
          stalpBransamente.push({ stLabel, brans });
        }
      });

      // Also check source stalp for bransamente
      const srcBrans = [];
      cabluriBransament.forEach(cn => {
        const otherId = cn.fromElId === src.el.id ? cn.toElId : (cn.toElId === src.el.id ? cn.fromElId : null);
        if (!otherId) return;
        const otherEl = EL.find(e => e.id === otherId);
        if (otherEl && otherEl.type === 'meter') {
          srcBrans.push({ bmpt: otherEl, cable: cn });
        }
      });
      if (srcBrans.length > 0) {
        stalpBransamente.unshift({ stLabel: srcLabel, brans: srcBrans });
      }

      if (stalpBransamente.length > 0) {
        text += '\nBransamente:';
        stalpBransamente.forEach(sb => {
          if (sb.brans.length === 1) {
            const b = sb.brans[0];
            const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
            const bLen = parseFloat(b.cable.length) || 0;
            const bDescs = describeCableGroup([b.cable]);
            text += `\nDin stalpul ${sb.stLabel} se va realiza 1 bransament cu ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen)}.`;
          } else {
            text += `\nDin stalpul ${sb.stLabel} se vor realiza ${sb.brans.length} bransamente astfel:`;
            sb.brans.forEach(b => {
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
              const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
              const tipCC = getConductorOrCablu(cableName);
              const len = parseFloat(b.cable.length) || 0;
              text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len)}.`;
            });
          }
        });
      }

      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Extindere retea LEA existenta cu retea subterana (cablu la firida noua)
    // Trigger: stalp existent + firide proiectate (fara stalpi noi) + bransament
    // ══════════════════════════════════════════════
    if (srcIsStalp && nrFirideNoi > 0 && nrStalpiNoi === 0) {
      const src = sourceEls[0];
      const srcLabel = src.el.label || 'SE';

      // Detect existing cable type on source stalp (LEA/LES)
      const existCablesOnSrc = CN.filter(cn => (!cn.stare || cn.stare === 'existent') && (cn.fromElId === src.el.id || cn.toElId === src.el.id));
      let tipReteaExistenta = 'LEA';
      let conductorExistent = '';
      if (existCablesOnSrc.length > 0) {
        const ec = existCablesOnSrc[0];
        conductorExistent = getCableOfficialName(ec.tipConductor || 'Torsadat Al', ec.sectiune || 16, ec.tipRetea || 'Trifazat');
        if (ec.tipConductor === 'Cablu Al' || ec.tipConductor === 'Cablu Cu') tipReteaExistenta = 'LES';
      }

      // Find existing circuit on source stalp
      let existCircuit = src.circuit || '';
      if (!existCircuit) {
        existCablesOnSrc.forEach(cn => {
          if (cn.circuitGroup) existCircuit = cn.circuitGroup;
          else if (cn.label && cn.label.match(/^C\d/)) existCircuit = cn.label.split('-')[0];
        });
      }

      let text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea retelei existente de tip ${tipReteaExistenta}`;
      if (conductorExistent) text += ` (${conductorExistent})`;
      if (existCircuit) text += `, circuit ${existCircuit}`;
      text += ` astfel:`;

      // Trace the chain: stalp → cable → firida1 → cable → firida2 → ...
      const firidaChain = [];
      const visitedNodes = new Set([src.el.id]);

      function traceFromNode(nodeId, nodeLabel) {
        // Find all circuit cables from this node
        cabluriCircuit.forEach(cn => {
          const otherId = cn.fromElId === nodeId ? cn.toElId : (cn.toElId === nodeId ? cn.fromElId : null);
          if (!otherId || visitedNodes.has(otherId)) return;
          const otherEl = EL.find(e => e.id === otherId);
          if (!otherEl) return;

          if (otherEl.type.startsWith('firida_') && proiectIds.has(otherId)) {
            visitedNodes.add(otherId);
            firidaChain.push({
              firida: otherEl,
              cables: [cn],
              fromLabel: nodeLabel
            });
            // Continue tracing from this firida
            traceFromNode(otherId, otherEl.label || getFiridaTypeName(otherEl));
          }
        });
      }
      traceFromNode(src.el.id, srcLabel);

      // If no chain found, fallback to simple list
      if (firidaChain.length === 0) {
        firideleProiectate.forEach(fg => {
          firidaChain.push({ firida: fg, cables: cabluriCircuit, fromLabel: srcLabel });
        });
      }

      // Describe each firida segment
      firidaChain.forEach((seg, idx) => {
        const fgName = getFiridaTypeName(seg.firida);
        const fgLabel = seg.firida.label || fgName;
        const segDescs = describeCableGroup(seg.cables.length > 0 ? seg.cables : cabluriCircuit);
        const fromLabel = seg.fromLabel || srcLabel;

        if (idx === 0) {
          text += ` din ${fromLabel} se va poza ${segDescs.join(', ')} pana la o ${fgLabel} proiectata si montata pe soclu de beton`;
        } else {
          text += `. Din ${fromLabel} se va poza ${segDescs.join(', ')} pana la o ${fgLabel} proiectata si montata pe soclu de beton`;
        }
      });
      text += '.';

      // Find bransamente per firida
      const firidaBransamente = [];
      firidaChain.forEach(seg => {
        const fgId = seg.firida.id;
        const fgLabel = seg.firida.label || getFiridaTypeName(seg.firida);
        // Find all BMPT/FDCP/FDCE connected to this firida via proiectat cables
        const brans = [];
        cabluriBransament.forEach(cn => {
          const fromEl = EL.find(e => e.id === cn.fromElId);
          const toEl = EL.find(e => e.id === cn.toElId);
          if ((cn.fromElId === fgId && toEl && toEl.type === 'meter') || (cn.toElId === fgId && fromEl && fromEl.type === 'meter')) {
            const bmpt = cn.fromElId === fgId ? toEl : fromEl;
            brans.push({ bmpt, cable: cn });
          }
        });
        if (brans.length > 0) {
          firidaBransamente.push({ fgLabel, brans });
        }
      });

      // Also check for bransamente not linked to any firida in chain (fallback)
      if (firidaBransamente.length === 0 && cabluriBransament.length > 0) {
        const fgLabel = firidaChain.length > 0 ? (firidaChain[0].firida.label || getFiridaTypeName(firidaChain[0].firida)) : 'FG';
        const brans = [];
        cabluriBransament.forEach(cn => {
          const fromEl = EL.find(e => e.id === cn.fromElId);
          const toEl = EL.find(e => e.id === cn.toElId);
          const bmpt = (fromEl && fromEl.type === 'meter') ? fromEl : (toEl && toEl.type === 'meter') ? toEl : null;
          if (bmpt) brans.push({ bmpt, cable: cn });
        });
        if (brans.length > 0) firidaBransamente.push({ fgLabel, brans });
      }

      // Generate bransamente text
      if (firidaBransamente.length > 0) {
        text += '\nBransamente:';
        firidaBransamente.forEach(fb => {
          if (fb.brans.length === 1) {
            const b = fb.brans[0];
            const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
            const bLen = parseFloat(b.cable.length) || 0;
            const bDescs = describeCableGroup([b.cable]);
            text += `\nDin ${fb.fgLabel} se va realiza 1 bransament astfel:`;
            text += `\n- ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, true)}.`;
          } else {
            text += `\nDin ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
            fb.brans.forEach(b => {
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
              const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
              const tipCC = getConductorOrCablu(cableName);
              const len = parseFloat(b.cable.length) || 0;
              text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}.`;
            });
          }
        });
      }

      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Single source + circuit + bransament
    // ══════════════════════════════════════════════
    if (hasCircuit && hasBransament) {
      const src = sourceEls[0] || {};
      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ';

      if (src.el && !src.isStalp) {
        text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
      } else if (src.el) {
        text += `din ${src.el.label || ''}`;
      }

      const allCircCables = cabluriCircuit;
      const circDescs = describeCableGroup(allCircCables);

      if (circuitIsSubteran) {
        // Detect existing network type on source (LEA/LES)
        const srcElId = src.el ? src.el.id : null;
        const existCablesOnSrc = srcElId ? CN.filter(cn => (!cn.stare || cn.stare === 'existent') && (cn.fromElId === srcElId || cn.toElId === srcElId)) : [];
        let tipReteaExist = 'LES';
        let conductorExist = '';
        if (existCablesOnSrc.length > 0) {
          const ec = existCablesOnSrc[0];
          conductorExist = getCableOfficialName(ec.tipConductor || 'Cablu Al', ec.sectiune || 16, ec.tipRetea || 'Trifazat');
          tipReteaExist = (ec.tipConductor === 'Cablu Al' || ec.tipConductor === 'Cablu Cu') ? 'LES' : 'LEA';
        }

        // Use appropriate intro based on source type
        if (src.isStalp) {
          // Source is existing stalp — extending existing network
          text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea retelei existente de tip ${tipReteaExist}`;
          if (conductorExist) text += ` (${conductorExist})`;
          if (src.circuit) text += `, circuit ${src.circuit}`;
          text += ` astfel:`;
        } else {
          // Source is CD/PT — new circuit
          text = `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: `;
          text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
          if (src.circuit) text += `, circuit ${src.circuit}`;
          text += `,`;
        }

        // Build full route through ALL elements (stalpi + firide), not just firide
        const srcNodeId = srcElId;
        const srcNodeLabel = src.el ? (src.el.label || '') : '';

        // Build adjacency from circuit cables
        const chainAdj = {};
        const chainDeg = {};
        cabluriCircuit.forEach(cn => {
          const a = String(cn.fromElId), b = String(cn.toElId);
          if (!chainAdj[a]) chainAdj[a] = [];
          if (!chainAdj[b]) chainAdj[b] = [];
          chainAdj[a].push({ to: b, cable: cn });
          chainAdj[b].push({ to: a, cable: cn });
          chainDeg[a] = (chainDeg[a] || 0) + 1;
          chainDeg[b] = (chainDeg[b] || 0) + 1;
        });

        // DFS from source to trace all branches (handles tree topology, not just linear chain)
        const chainStart = String(srcNodeId);
        const getChainLabel = (id) => { const el = EL.find(e => e.id === Number(id)); return el ? (el.label || el.type) : ''; };
        const getChainEl = (id) => EL.find(e => e.id === Number(id));
        const chainVisited = new Set();

        // Collect all paths from source to leaf nodes using DFS
        const allPaths = [];
        function dfsTrace(nodeId, currentPath, currentCables) {
          const neighbors = (chainAdj[nodeId] || []).filter(n => !chainVisited.has(n.cable.id));
          if (neighbors.length === 0) {
            // Leaf node — save this path
            allPaths.push({ route: [...currentPath], cables: [...currentCables] });
            return;
          }
          neighbors.forEach((nb, ni) => {
            chainVisited.add(nb.cable.id);
            currentPath.push(nb.to);
            currentCables.push(nb.cable);
            if (neighbors.length > 1 && ni > 0) {
              // Branch point — start a new path from the branch point
              allPaths.push({ route: [...currentPath.slice(0, -1)], cables: [...currentCables.slice(0, -1)], continues: true });
              // Continue DFS but as a separate segment description
            }
            dfsTrace(nb.to, currentPath, currentCables);
            currentPath.pop();
            currentCables.pop();
          });
        }

        // Simpler approach: find all paths from source to each firida leaf
        // First do a BFS/DFS to get the full tree structure, then describe each branch
        const allChainNodes = new Set();
        const chainVisitedCables = new Set();
        const chainRoute = [chainStart]; const chainCables = [];

        // Walk main path first (longest or first), then describe branches
        function walkTree(nodeId) {
          const nbs = (chainAdj[nodeId] || []).filter(n => !chainVisitedCables.has(n.cable.id));
          // Sort: prefer non-firida first (walk through stalpi first, firide are branches)
          nbs.sort((a, b) => {
            const aEl = getChainEl(a.to);
            const bEl = getChainEl(b.to);
            const aIsFirida = aEl && aEl.type.startsWith('firida_') ? 1 : 0;
            const bIsFirida = bEl && bEl.type.startsWith('firida_') ? 1 : 0;
            return aIsFirida - bIsFirida;
          });
          nbs.forEach(nb => {
            chainVisitedCables.add(nb.cable.id);
            chainRoute.push(nb.to);
            chainCables.push(nb.cable);
            allChainNodes.add(nb.to);
            walkTree(nb.to);
          });
        }
        allChainNodes.add(chainStart);
        walkTree(chainStart);

        // Group consecutive segments by cable type, but break at firide (each firida must be mentioned)
        const chainGroups = [];
        chainCables.forEach((cn, i) => {
          const name = getCableOfficialName(cn.tipConductor || 'Torsadat Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
          const fromEl = getChainEl(chainRoute[i]);
          const toEl = getChainEl(chainRoute[i + 1]);
          const fromIsFirida = fromEl && fromEl.type.startsWith('firida_');
          const toIsFirida = toEl && toEl.type.startsWith('firida_');
          const last = chainGroups[chainGroups.length - 1];
          // Don't merge if current segment starts or ends at a firida
          if (last && last.name === name && !fromIsFirida && !toIsFirida) {
            last.totalLen += parseFloat(cn.length) || 0;
            last.endIdx = i + 1;
          } else {
            chainGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
          }
        });

        // Build segment-by-segment text
        chainGroups.forEach((g, gi) => {
          const fromLbl = getChainLabel(chainRoute[g.startIdx]);
          const toLbl = getChainLabel(chainRoute[g.endIdx]);
          const toEl = getChainEl(chainRoute[g.endIdx]);
          const isFirida = toEl && toEl.type.startsWith('firida_');
          // Build intermediate route labels for this group
          const grpLabels = [];
          for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
            const lbl = getChainLabel(chainRoute[ri]);
            if (lbl) grpLabels.push(lbl);
          }
          const grpRouteText = grpLabels.join(' - ');

          if (gi === 0) {
            text += ` din ${fromLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${isFirida ? 'o ' : ''}${toLbl}${isFirida ? ' proiectata si montata pe soclu de beton' : ''}`;
          } else {
            const hasMultipleStops = grpLabels.length > 2;
            text += `. Din ${fromLbl} pana la ${isFirida ? 'o ' : ''}${toLbl}${isFirida ? ' proiectata si montata pe soclu de beton' : ''} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m`;
            if (hasMultipleStops && !isFirida) text += ` pe stalpi existenti intre ${grpRouteText}`;
          }
        });
        text += '.';

        // Bransamente per firida/stalp — find all elements in chain that have BMPT connections
        const firidaBrans = [];
        [...allChainNodes].forEach(nodeId => {
          const numId = Number(nodeId);
          const nodeEl = EL.find(e => e.id === numId);
          if (!nodeEl) return;
          const nodeLabel = nodeEl.label || (nodeEl.type.startsWith('firida_') ? getFiridaTypeName(nodeEl) : nodeEl.type);
          const brans = [];
          cabluriBransament.forEach(cn => {
            const otherId = cn.fromElId === numId ? cn.toElId : (cn.toElId === numId ? cn.fromElId : null);
            if (!otherId) return;
            const otherEl = EL.find(e => e.id === otherId);
            if (otherEl && otherEl.type === 'meter') brans.push({ bmpt: otherEl, cable: cn });
          });
          if (brans.length > 0) firidaBrans.push({ fgLabel: nodeLabel, brans, isFirida: nodeEl.type.startsWith('firida_') });
        });

        if (firidaBrans.length > 0) {
          text += '\nBransamente:';
          firidaBrans.forEach(fb => {
            if (fb.brans.length === 1) {
              const b = fb.brans[0];
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
              const bDescs = describeCableGroup([b.cable]);
              text += `\nDin ${fb.fgLabel} se va realiza 1 bransament cu ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
            } else {
              text += `\nDin ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
              fb.brans.forEach(b => {
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
                const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
                const tipCC = getConductorOrCablu(cableName);
                const len = parseFloat(b.cable.length) || 0;
                text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}.`;
              });
            }
          });
        }
      } else {
        text += `, se va realiza un circuit proiectat ${src.circuit || ''} pe stalpi noi cu ${circDescs.join(', ')}`;
        const lastLbl = lastElBeforeBMPT ? (lastElBeforeBMPT.label || '') : '';
        text += `. Din ${lastLbl || 'ultimul stalp'}`;
        const branDescs = describeCableGroup(cabluriBransament);
        text += ` se va realiza un bransament cu ${branDescs.join(', ')}`;
        if (bmptText) text += `, pana la ${bmptText}`;
        text += '.';
      }
      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Circuit proiectat pe stalpi EXISTENTI + bransament
    // (cabluri proiectate intre elemente existente, apoi bransament la BMPT)
    // ══════════════════════════════════════════════
    if (cabluriCircuit.length > 0 && hasBransament && !hasCircuit) {
      const src = sourceEls.find(s => !s.isStalp) || sourceEls[0] || {};
      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ';

      if (src.el && !src.isStalp) {
        text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
      } else if (src.el) {
        text += `din ${src.el.label || ''}`;
      }

      // Find last existing stalp in the circuit (before BMPT branch point)
      let lastCircuitStalp = '';
      const circuitElIds = new Set();
      cabluriCircuit.forEach(cn => {
        [cn.fromElId, cn.toElId].forEach(id => {
          if (id) {
            const el = EL.find(e => e.id === id);
            if (el && el.type.startsWith('stalp_') && (!el.stare || el.stare === 'existent')) {
              circuitElIds.add(id);
              lastCircuitStalp = el.label || '';
            }
          }
        });
      });

      // Find the stalp from which bransament starts (element before BMPT)
      const branStalpLabel = lastElBeforeBMPT ? (lastElBeforeBMPT.label || '') : lastCircuitStalp;

      // Find existing circuit(s) on the same stalpi
      const existCircuits = new Set();
      circuitElIds.forEach(stalpId => {
        CN.filter(cn => (!cn.stare || cn.stare === 'existent') && (cn.fromElId === stalpId || cn.toElId === stalpId)).forEach(cn => {
          if (cn.circuitGroup) existCircuits.add(cn.circuitGroup);
          else if (cn.label && cn.label.match(/^C\d/)) existCircuits.add(cn.label.split('-')[0]);
        });
      });
      const comunCuText = existCircuits.size > 0 ? ` comuni cu circuit ${[...existCircuits].join(', ')}` : '';

      // Trace circuit route segment by segment
      // Build adjacency from circuit cables (exclude bransament)
      const circAdj = {};
      const circDeg = {};
      cabluriCircuit.forEach(cn => {
        const a = String(cn.fromElId), b = String(cn.toElId);
        if (!circAdj[a]) circAdj[a] = [];
        if (!circAdj[b]) circAdj[b] = [];
        circAdj[a].push({ to: b, cable: cn });
        circAdj[b].push({ to: a, cable: cn });
        circDeg[a] = (circDeg[a] || 0) + 1;
        circDeg[b] = (circDeg[b] || 0) + 1;
      });
      // Find start — prefer CD/PT source
      const circEps = Object.keys(circAdj).filter(id => circDeg[id] === 1);
      let circStart = circEps[0] || Object.keys(circAdj)[0];
      circEps.forEach(id => {
        const el = EL.find(e => e.id === Number(id));
        if (el && (el.type.startsWith('cd') || el.type === 'trafo' || el.type.startsWith('ptab_'))) circStart = id;
      });
      // Walk chain
      const circRoute = [circStart]; const circRCables = []; const circVis = new Set(); let circCur = circStart;
      while (true) { const nbs = (circAdj[circCur]||[]).filter(n => !circVis.has(n.cable.id)); if (!nbs.length) break; circVis.add(nbs[0].cable.id); circRCables.push(nbs[0].cable); circCur = nbs[0].to; circRoute.push(circCur); }

      const getRouteLabel = (id) => { const el = EL.find(e => e.id === Number(id)); return el ? (el.label || el.type) : ''; };

      // Group consecutive segments with same cable type
      const circGroups = [];
      circRCables.forEach((cn, i) => {
        const name = getCableOfficialName(cn.tipConductor || 'Torsadat Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
        const last = circGroups[circGroups.length - 1];
        if (last && last.name === name) {
          last.totalLen += parseFloat(cn.length) || 0;
          last.endIdx = i + 1;
        } else {
          circGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
        }
      });

      // Build text from grouped segments
      text += `, se va echipa un circuit proiectat ${src.circuit || ''} pe stalpi existenti${comunCuText}`;
      circGroups.forEach((g, gi) => {
        const fromLbl = getRouteLabel(circRoute[g.startIdx]);
        const toLbl = getRouteLabel(circRoute[g.endIdx]);
        // Build full route labels for this group (all intermediate stalpi)
        const groupRouteLabels = [];
        for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
          const lbl = getRouteLabel(circRoute[ri]);
          if (lbl) groupRouteLabels.push(lbl);
        }
        const groupRouteText = groupRouteLabels.join(' - ');
        if (gi === 0) {
          text += ` cu ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${toLbl}`;
        } else {
          text += `, din ${fromLbl} pana la ${toLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pe stalpi existenti intre ${groupRouteText}`;
        }
      });

      // Bransamente — group per source stalp
      const branPerStalp = {};
      cabluriBransament.forEach(cn => {
        const fromEl = EL.find(e => e.id === cn.fromElId);
        const toEl = EL.find(e => e.id === cn.toElId);
        const bmpt = (fromEl && fromEl.type === 'meter') ? fromEl : toEl;
        const srcEl = (fromEl && fromEl.type === 'meter') ? toEl : fromEl;
        if (!bmpt || !srcEl) return;
        const srcLabel = srcEl.label || srcEl.type;
        if (!branPerStalp[srcLabel]) branPerStalp[srcLabel] = [];
        branPerStalp[srcLabel].push({ bmpt, cable: cn, srcEl });
      });

      const stalpKeys = Object.keys(branPerStalp);
      if (stalpKeys.length === 1 && branPerStalp[stalpKeys[0]].length === 1) {
        // Single bransament from single stalp
        const b = branPerStalp[stalpKeys[0]][0];
        const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
        const bDescs = describeCableGroup([b.cable]);
        const bLen = parseFloat(b.cable.length) || 0;
        const isFirida = b.srcEl && b.srcEl.type.startsWith('firida_');
        text += `. Din ${stalpKeys[0]} se va realiza un bransament cu ${bDescs.join(', ')}, pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
      } else {
        // Multiple bransamente
        text += '.\nBransamente:';
        stalpKeys.forEach(srcLabel => {
          const brans = branPerStalp[srcLabel];
          const isFirida = brans[0].srcEl && brans[0].srcEl.type.startsWith('firida_');
          if (brans.length === 1) {
            const b = brans[0];
            const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
            const bDescs = describeCableGroup([b.cable]);
            const bLen = parseFloat(b.cable.length) || 0;
            text += `\nDin ${srcLabel} se va realiza 1 bransament cu ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
          } else {
            text += `\nDin ${srcLabel} se vor realiza ${brans.length} bransamente astfel:`;
            brans.forEach(b => {
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
              const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
              const tipCC = getConductorOrCablu(cableName);
              const len = parseFloat(b.cable.length) || 0;
              text += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, isFirida)}.`;
            });
          }
        });
      }
      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Doar bransament simplu
    // ══════════════════════════════════════════════
    if (hasBransament && !hasCircuit) {
      const src = sourceEls[0] || {};
      const allBranCables = [...cabluriCircuit, ...cabluriBransament];
      const branDescs = describeCableGroup(allBranCables);

      // Detect if bransament comes directly from CD/TDJT
      const srcIsCD = src.el && (src.el.type.startsWith('cd') || src.el.type.startsWith('ptab_') || src.el.type === 'trafo');

      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza';
      if (srcIsCD) {
        // Direct from CD/TDJT
        text += ` printr-un bransament din ${getSourcePrefix(src.el, src.ptLabel || ptName).replace('Din ','')}, format din ${branDescs.join(', ')}`;
      } else {
        // From existing stalp
        text += ' pe joasa tensiune';
        if (src.el) text += ` din ${src.el.label || ''}`;
        if (src.circuit) text += `, circuit nr. ${src.circuit}`;
        if (ptName) text += `, zona de post ${ptName}`;
        text += `, printr-un bransament cu ${branDescs.join(', ')}`;
      }
      if (bmptText) text += `, pana la ${bmptText}`;
      text += '.';
      return text;
    }

    // ══════════════════════════════════════════════
    // CASE: Doar circuit (fara BMPT)
    // ══════════════════════════════════════════════
    if (hasCircuit) {
      const src = sourceEls[0] || {};
      let text = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune';
      if (src.el && !src.isStalp) text += ` ${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
      else if (src.el) text += ` din ${src.el.label || ''}`;
      const allDescs = describeCableGroup(cabluriCircuit);
      const tipElem = nrStalpiNoi > 0 ? 'stalpi noi' : 'firide noi';
      text += `, se va realiza un circuit proiectat ${src.circuit || ''} pe ${tipElem} cu ${allDescs.join(', ')}`;
      text += '.';
      return text;
    }

    // Fallback
    return `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune, zona de post ${ptName || ''}.`;
  }

  // Check if we have intarire elements - if so, racordare is only bransament
  const hasIntarire = proiectIntarire.cabluri.length > 0 || proiectIntarire.elemente.length > 0;

  let solutieRacordareText = '';
  let solutieIntarireText = 'NU ESTE CAZUL';

  try {
    if (hasIntarire) {
      // ── INTARIRE: circuit proiectat ──
      // Find source PT/CD for intarire circuit
      const intarireIds = new Set(proiectIntarire.elemente.map(e => e.id));
      let intSrcEl = null, intSrcPtLabel = '', intCircuit = '';
      proiectIntarire.cabluri.forEach(cn => {
        [cn.fromElId, cn.toElId].forEach(elId => {
          if (elId && !intarireIds.has(elId) && !intSrcEl) {
            const el = EL.find(e => e.id === elId);
            if (el && (!el.stare || el.stare === 'existent')) {
              intSrcEl = el;
              if (cn.circuitGroup) intCircuit = cn.circuitGroup;
              else if (cn.fromCircuit) intCircuit = 'C' + cn.fromCircuit;
              // Find PT label if source is CD
              if (el.type.startsWith('cd')) {
                const ptCable = CN.find(c => (!c.stare || c.stare === 'existent') && (c.fromElId === elId || c.toElId === elId));
                if (ptCable) {
                  const ptId = ptCable.fromElId === elId ? ptCable.toElId : ptCable.fromElId;
                  const ptE = EL.find(e => e.id === ptId && (e.type === 'trafo' || e.type.startsWith('ptab_')));
                  if (ptE) intSrcPtLabel = ptE.label || '';
                }
              } else {
                intSrcPtLabel = el.label || '';
              }
            }
          }
        });
      });
      // Find existing circuit on same stalpi
      if (!intCircuit) {
        proiectIntarire.cabluri.forEach(cn => {
          [cn.fromElId, cn.toElId].forEach(elId => {
            if (elId && !intarireIds.has(elId)) {
              CN.filter(c => (!c.stare || c.stare === 'existent') && (c.fromElId === elId || c.toElId === elId)).forEach(c => {
                if (c.circuitGroup && !intCircuit) intCircuit = c.circuitGroup;
              });
            }
          });
        });
      }

      // Find last stalp of intarire circuit
      const intStalpi = proiectIntarire.elemente.filter(e => e.type.startsWith('stalp_'));
      let lastIntStalpLabel = '';
      // Check which stalp has no outgoing intarire cable (= end of circuit)
      intStalpi.forEach(st => {
        const outCables = proiectIntarire.cabluri.filter(cn => cn.fromElId === st.id || cn.toElId === st.id);
        // Simple: take last one
        lastIntStalpLabel = st.label || '';
      });

      // Existing circuits on same stalpi
      const existCircOnStalpi = new Set();
      proiectIntarire.cabluri.forEach(cn => {
        [cn.fromElId, cn.toElId].forEach(elId => {
          if (elId) {
            CN.filter(c => (!c.stare || c.stare === 'existent') && (c.fromElId === elId || c.toElId === elId)).forEach(c => {
              if (c.circuitGroup) existCircOnStalpi.add(c.circuitGroup);
            });
          }
        });
      });
      const comunCuText = existCircOnStalpi.size > 0 ? ` pe stalpi existenti comuni cu circuit ${[...existCircOnStalpi].join(', ')}` : '';

      const intPrefix = intSrcEl ? getSourcePrefix(intSrcEl, intSrcPtLabel) : 'Din CD';

      // Separate: extension cables (new) vs replacement cables (inlocuire)
      const replacementCables = proiectIntarire.cabluri.filter(cn => cn.stare === 'intarire_inlocuire' || cn.oldTipConductor);
      const extensionCables = proiectIntarire.cabluri.filter(cn => (cn.stare === 'intarire_nou' || (!cn.oldTipConductor && cn.stare !== 'intarire_inlocuire')) && !(EL.find(e => e.id === cn.fromElId)?.type === 'meter' || EL.find(e => e.id === cn.toElId)?.type === 'meter'));

      const intarireParts = [];

      // 1. Cable replacement (inlocuire conductor) - with full route tracing
      if (replacementCables.length > 0) {
        const getElLabel = (elId) => {
          const numId = typeof elId === 'string' ? Number(elId) : elId;
          const el = EL.find(e => e.id === numId);
          return el ? (el.label || el.type) : '';
        };

        // Build adjacency from ALL replacement cables (regardless of type)
        // Use String(id) consistently — Object.keys returns strings but cable IDs are numbers
        const adj = {};
        const degree = {};
        replacementCables.forEach(cn => {
          const a = String(cn.fromElId), b = String(cn.toElId);
          if (!adj[a]) adj[a] = [];
          if (!adj[b]) adj[b] = [];
          adj[a].push({ to: b, cable: cn });
          adj[b].push({ to: a, cable: cn });
          degree[a] = (degree[a] || 0) + 1;
          degree[b] = (degree[b] || 0) + 1;
        });

        // Find connected components (separate chains)
        const visitedNodes = new Set();
        const chains = [];
        Object.keys(adj).forEach(startCandidate => {
          if (visitedNodes.has(startCandidate)) return;
          // BFS to find all nodes in this component
          const component = new Set();
          const queue = [startCandidate];
          while (queue.length > 0) {
            const node = queue.shift();
            if (component.has(node)) continue;
            component.add(node);
            (adj[node] || []).forEach(n => { if (!component.has(n.to)) queue.push(n.to); });
          }
          // Find endpoint (degree 1) to start walk
          const endpoint = [...component].find(id => degree[id] === 1) || [...component][0];
          // Walk chain from endpoint
          const route = [endpoint];
          const routeCables = [];
          const visitedCables = new Set();
          let current = endpoint;
          while (true) {
            const neighbors = (adj[current] || []).filter(n => !visitedCables.has(n.cable.id));
            if (neighbors.length === 0) break;
            visitedCables.add(neighbors[0].cable.id);
            routeCables.push(neighbors[0].cable);
            current = neighbors[0].to;
            route.push(current);
          }
          component.forEach(n => visitedNodes.add(n));
          chains.push({ route, cables: routeCables });
        });

        // Generate text for each chain
        chains.forEach(chain => {
          const routeLabels = chain.route.map(id => getElLabel(id)).filter(l => l);
          const routeText = routeLabels.join(' - ');
          const totalLen = chain.cables.reduce((s, cn) => s + (parseFloat(cn.length) || 0), 0);

          // Check if all cables have same old→new type
          const typeKeys = new Set(chain.cables.map(cn => {
            const oldName = getCableOfficialName(cn.oldTipConductor, cn.oldSectiune || 16, cn.oldTipRetea || 'Trifazat');
            const newName = getCableOfficialName(cn.tipConductor || 'Torsadat Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
            return oldName + '→' + newName;
          }));

          // Get new cable name (same for all segments in chain)
          const cn0 = chain.cables[0];
          const newName = getCableOfficialName(cn0.tipConductor || 'Torsadat Al', cn0.sectiune || 16, cn0.tipRetea || 'Trifazat');
          const newCC = getConductorOrCablu(newName);

          if (typeKeys.size === 1) {
            // All same type — single line with full route
            const oldName = getCableOfficialName(cn0.oldTipConductor, cn0.oldSectiune || 16, cn0.oldTipRetea || 'Trifazat');
            const oldCC = getConductorOrCablu(oldName);
            intarireParts.push(`Se va inlocui ${oldCC} existent tip ${oldName} cu ${newCC} tip ${newName} intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
          } else {
            // Different old types per segment — unified text with full route and new cable
            intarireParts.push(`Se va inlocui conductorul existent intre ${routeText} pe o lungime totala de ${totalLen.toFixed(0)} m cu ${newCC} tip ${newName}.`);
          }
        });
      }

      // 2. Network extension / new circuit on intarire
      if (extensionCables.length > 0) {
        if (intStalpi.length > 0) {
          // 2a. Extension with new poles
          const intSrcLabel = intSrcEl ? (intSrcEl.label || intSrcEl.type) : '';
          const extLen = extensionCables.reduce((s, cn) => s + (parseFloat(cn.length) || 0), 0);
          const extDescs = describeCableGroup(extensionCables);

          const intStalpGroups = {};
          intStalpi.forEach(st => {
            const typeName = { stalp_sc10002:'SC10002', stalp_sc10005:'SC10005', stalp_se4:'SE4', stalp_se10:'SE10', stalp_rotund:'SR', stalp_rotund_special:'SRS', stalp_cs:'SCS' }[st.type] || st.type;
            if (!intStalpGroups[typeName]) intStalpGroups[typeName] = 0;
            intStalpGroups[typeName]++;
          });
          const stalpTypeText = Object.entries(intStalpGroups).map(([name, cnt]) => `${cnt}x${name}`).join(' si ');

          let extText = `Se va extinde reteaua existenta din ${intSrcLabel} pe o lungime de ${extLen.toFixed(0)} m cu ${extDescs.join(', ')} pe stalpi noi proiectati de tip ${stalpTypeText}`;
          if (lastIntStalpLabel) extText += ` pana la ${lastIntStalpLabel}`;
          extText += '.';
          intarireParts.push(extText);
        } else {
          // 2b. New circuit on existing infrastructure (no new poles)
          const getElLabelExt = (elId) => {
            const numId = typeof elId === 'string' ? Number(elId) : elId;
            const el = EL.find(e => e.id === numId);
            return el ? (el.label || el.type) : '';
          };
          const getElTypeExt = (elId) => {
            const numId = typeof elId === 'string' ? Number(elId) : elId;
            const el = EL.find(e => e.id === numId);
            return el ? el.type : '';
          };
          // Build adjacency
          const extAdj = {};
          const extDeg = {};
          extensionCables.forEach(cn => {
            const a = String(cn.fromElId), b = String(cn.toElId);
            if (!extAdj[a]) extAdj[a] = [];
            if (!extAdj[b]) extAdj[b] = [];
            extAdj[a].push({ to: b, cable: cn });
            extAdj[b].push({ to: a, cable: cn });
            extDeg[a] = (extDeg[a] || 0) + 1;
            extDeg[b] = (extDeg[b] || 0) + 1;
          });
          // Find connected components and trace each chain
          const extVisitedNodes = new Set();
          Object.keys(extAdj).forEach(startNode => {
            if (extVisitedNodes.has(startNode)) return;
            // BFS to find component
            const comp = new Set();
            const q = [startNode];
            while (q.length > 0) { const n = q.shift(); if (comp.has(n)) continue; comp.add(n); (extAdj[n]||[]).forEach(nb => { if (!comp.has(nb.to)) q.push(nb.to); }); }
            // Find endpoint — prefer CD/PT as start
            const eps = [...comp].filter(id => extDeg[id] === 1);
            let startId = eps[0] || [...comp][0];
            eps.forEach(id => {
              const t = getElTypeExt(id);
              if (t.startsWith('cd') || t === 'trafo' || t.startsWith('ptab_')) startId = id;
            });
            // If no endpoint is CD, check all nodes in component for CD
            if (!eps.some(id => { const t = getElTypeExt(id); return t.startsWith('cd') || t === 'trafo' || t.startsWith('ptab_'); })) {
              [...comp].forEach(id => {
                const t = getElTypeExt(id);
                if (t.startsWith('cd') || t === 'trafo' || t.startsWith('ptab_')) startId = id;
              });
            }
            // Walk chain from start
            const route = [startId]; const rCables = []; const vCables = new Set(); let cur = startId;
            while (true) { const nbs = (extAdj[cur]||[]).filter(n => !vCables.has(n.cable.id)); if (!nbs.length) break; vCables.add(nbs[0].cable.id); rCables.push(nbs[0].cable); cur = nbs[0].to; route.push(cur); }
            comp.forEach(n => extVisitedNodes.add(n));

            const routeLabels = route.map(id => getElLabelExt(id)).filter(l => l);
            const routeText = routeLabels.join(' - ');
            const totalLen = rCables.reduce((s, cn) => s + (parseFloat(cn.length) || 0), 0);
            const descs = describeCableGroup(rCables);

            // Detect circuit group
            let circuit = '';
            rCables.forEach(cn => { if (cn.circuitGroup && !circuit) circuit = cn.circuitGroup; });

            // Detect source for text prefix
            const srcEl = EL.find(e => e.id === Number(startId));
            const srcIsCD = srcEl && (srcEl.type.startsWith('cd') || srcEl.type === 'trafo' || srcEl.type.startsWith('ptab_'));
            const firstLabel = routeLabels[0] || '';
            const lastLabel = routeLabels[routeLabels.length - 1] || '';

            // Build source prefix
            let srcPrefix = '';
            if (srcIsCD) {
              // Find PT label for this CD
              let ptLabel = '';
              if (srcEl.type.startsWith('cd')) {
                const ptCable = CN.find(c => (!c.stare || c.stare === 'existent') && (c.fromElId === srcEl.id || c.toElId === srcEl.id));
                if (ptCable) {
                  const ptId = ptCable.fromElId === srcEl.id ? ptCable.toElId : ptCable.fromElId;
                  const ptE = EL.find(e => e.id === ptId && (e.type === 'trafo' || e.type.startsWith('ptab_')));
                  if (ptE) ptLabel = ptE.label || '';
                }
              }
              srcPrefix = ptLabel ? `Din ${firstLabel} a ${ptLabel}` : `Din ${firstLabel}`;
            } else {
              srcPrefix = `Din ${firstLabel}`;
            }

            // Detect existing circuits on same stalpi (common poles)
            const existCircOnRoute = new Set();
            route.forEach(nodeId => {
              const numId = Number(nodeId);
              CN.filter(c => (!c.stare || c.stare === 'existent') && (c.fromElId === numId || c.toElId === numId)).forEach(c => {
                if (c.circuitGroup && c.circuitGroup !== circuit) existCircOnRoute.add(c.circuitGroup);
              });
            });
            const comunCircText = existCircOnRoute.size > 0 ? ` comuni cu circuit ${[...existCircOnRoute].join(', ')}` : '';

            // Group consecutive segments by cable type
            const extGroups = [];
            rCables.forEach((cn, i) => {
              const name = getCableOfficialName(cn.tipConductor || 'Torsadat Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
              const last = extGroups[extGroups.length - 1];
              if (last && last.name === name) {
                last.totalLen += parseFloat(cn.length) || 0;
                last.endIdx = i + 1;
              } else {
                extGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
              }
            });

            let extText = `${srcPrefix}${circuit ? ', circuit ' + circuit : ''} se va realiza un circuit nou`;
            extGroups.forEach((g, gi) => {
              const fromLbl = getElLabelExt(route[g.startIdx]);
              const toLbl = getElLabelExt(route[g.endIdx]);
              // Build full route for this group
              const grpRouteLabels = [];
              for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
                const lbl = getElLabelExt(route[ri]);
                if (lbl) grpRouteLabels.push(lbl);
              }
              const grpRouteText = grpRouteLabels.join(' - ');
              if (gi === 0) {
                extText += ` cu ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${toLbl}`;
              } else {
                extText += `, din ${fromLbl} pana la ${toLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pe stalpi existenti${comunCircText} intre ${grpRouteText}`;
              }
            });
            if (existCircOnRoute.size > 0) {
              extText += `, prin care se vor prelua parte din consumatorii existenti de pe circuit ${[...existCircOnRoute].join(', ')}`;
            }
            extText += '.';
            intarireParts.push(extText);
          });
        }
      }

      // 3. Demolished cables (demontat)
      const demontedCables = CN.filter(cn => cn.stare === 'demontat');
      if (demontedCables.length > 0) {
        const getElLabel = (elId) => {
          const numId = typeof elId === 'string' ? Number(elId) : elId;
          const el = EL.find(e => e.id === numId);
          return el ? (el.label || el.type) : '';
        };
        // Build chains from demolished cables (same algorithm as replacement)
        const demAdj = {};
        const demDegree = {};
        demontedCables.forEach(cn => {
          const a = String(cn.fromElId), b = String(cn.toElId);
          if (!demAdj[a]) demAdj[a] = [];
          if (!demAdj[b]) demAdj[b] = [];
          demAdj[a].push({ to: b, cable: cn });
          demAdj[b].push({ to: a, cable: cn });
          demDegree[a] = (demDegree[a] || 0) + 1;
          demDegree[b] = (demDegree[b] || 0) + 1;
        });
        const demVisited = new Set();
        Object.keys(demAdj).forEach(startNode => {
          if (demVisited.has(startNode)) return;
          const comp = new Set();
          const q = [startNode];
          while (q.length > 0) { const n = q.shift(); if (comp.has(n)) continue; comp.add(n); (demAdj[n]||[]).forEach(nb => { if (!comp.has(nb.to)) q.push(nb.to); }); }
          const ep = [...comp].find(id => demDegree[id] === 1) || [...comp][0];
          const route = [ep]; const rCables = []; const vCables = new Set(); let cur = ep;
          while (true) { const nbs = (demAdj[cur]||[]).filter(n => !vCables.has(n.cable.id)); if (!nbs.length) break; vCables.add(nbs[0].cable.id); rCables.push(nbs[0].cable); cur = nbs[0].to; route.push(cur); }
          comp.forEach(n => demVisited.add(n));

          const routeLabels = route.map(id => getElLabel(id)).filter(l => l);
          const routeText = routeLabels.join(' - ');
          const totalLen = rCables.reduce((s, cn) => s + (parseFloat(cn.length) || 0), 0);

          // Get cable type description
          const demDescs = {};
          rCables.forEach(cn => {
            const name = getCableOfficialName(cn.tipConductor || 'Clasic Al', cn.sectiune || 16, cn.tipRetea || 'Trifazat');
            const cc = getConductorOrCablu(name);
            if (!demDescs[name]) demDescs[name] = { name, cc, len: 0 };
            demDescs[name].len += parseFloat(cn.length) || 0;
          });
          const demTypes = Object.values(demDescs);
          if (demTypes.length === 1) {
            intarireParts.push(`Se va demonta ${demTypes[0].cc}ul existent tip ${demTypes[0].name} intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
          } else {
            intarireParts.push(`Se va demonta conductorul existent intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
          }
        });
      }

      solutieIntarireText = intarireParts.length > 0 ? intarireParts.join('\n') : 'NU ESTE CAZUL';

      // ── RACORDARE ──
      // Check if racordare has circuit elements (firide, stalpi) — if so, use full buildSolutionText
      const racHasCircuit = proiectRacordare.elemente.some(e => e.type.startsWith('firida_') || e.type.startsWith('stalp_'));

      if (racHasCircuit) {
        // Full trace: extindere retea + firide chain + bransamente
        solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
      } else {
        // Only bransamente from intarire stalpi/firide to BMPTs
        const allBMPTs = [
          ...proiectRacordare.elemente.filter(e => e.type === 'meter'),
          ...proiectIntarire.elemente.filter(e => e.type === 'meter')
        ];
        const seenBMPTIds = new Set();
        const uniqueBMPTs = allBMPTs.filter(b => { if (seenBMPTIds.has(b.id)) return false; seenBMPTIds.add(b.id); return true; });

        const allBranCables = [...proiectRacordare.cabluri, ...proiectIntarire.cabluri].filter(cn => {
          const fromEl = EL.find(e => e.id === cn.fromElId);
          const toEl = EL.find(e => e.id === cn.toElId);
          return (fromEl && fromEl.type === 'meter') || (toEl && toEl.type === 'meter');
        });
        const seenBranIds = new Set();
        const uniqueBranCables = allBranCables.filter(c => { if (seenBranIds.has(c.id)) return false; seenBranIds.add(c.id); return true; });

        if (uniqueBMPTs.length > 0 && uniqueBranCables.length > 0) {
          if (uniqueBMPTs.length === 1) {
            const bmpt = uniqueBMPTs[0];
            const bCable = uniqueBranCables[0];
            const bmptLabel = bmpt.bmptText || bmpt.label || 'BMPT';
            const branDescs = describeCableGroup([bCable]);
            const bLen = parseFloat(bCable.length) || 0;
            const otherId = bCable.fromElId === bmpt.id ? bCable.toElId : bCable.fromElId;
            const srcEl = EL.find(e => e.id === otherId);
            const isFirida = srcEl && srcEl.type.startsWith('firida_');
            solutieRacordareText = `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune printr-un bransament cu ${branDescs.join(', ')}, pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
          } else {
            solutieRacordareText = 'Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune.\nBransamente:';
            const srcGroups = {};
            uniqueBranCables.forEach(cn => {
              const fromEl = EL.find(e => e.id === cn.fromElId);
              const toEl = EL.find(e => e.id === cn.toElId);
              const bmpt = (fromEl && fromEl.type === 'meter') ? fromEl : toEl;
              const srcElB = (fromEl && fromEl.type === 'meter') ? toEl : fromEl;
              const srcLabel = srcElB ? (srcElB.label || 'stalp') : 'stalp';
              if (!srcGroups[srcLabel]) srcGroups[srcLabel] = [];
              srcGroups[srcLabel].push({ bmpt, cable: cn });
            });
            Object.entries(srcGroups).forEach(([srcLabel, brans]) => {
              const srcElB = EL.find(e => e.label === srcLabel);
              const isFirida = srcElB && srcElB.type.startsWith('firida_');
              if (brans.length === 1) {
                const b = brans[0];
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
                const bLen = parseFloat(b.cable.length) || 0;
                const bDescs = describeCableGroup([b.cable]);
                solutieRacordareText += `\nDin ${isFirida ? '' : 'stalpul '}${srcLabel} se va realiza 1 bransament cu ${bDescs.join(', ')} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
              } else {
                solutieRacordareText += `\nDin ${isFirida ? '' : 'stalpul '}${srcLabel} se vor realiza ${brans.length} bransamente astfel:`;
                brans.forEach(b => {
                  const bmptLabel = b.bmpt.bmptText || b.bmpt.label || 'BMPT';
                  const cableName = getCableOfficialName(b.cable.tipConductor || 'Cablu Al', b.cable.sectiune || 16, b.cable.tipRetea || 'Trifazat');
                  const tipCC = getConductorOrCablu(cableName);
                  const len = parseFloat(b.cable.length) || 0;
                  solutieRacordareText += `\n- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, isFirida)}.`;
                });
              }
            });
          }
        } else if (proiectRacordare.cabluri.length > 0 || proiectRacordare.elemente.length > 0) {
          solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
        } else {
          solutieRacordareText = 'Se va stabili conform proiect.';
        }
      }
    } else {
      solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
      solutieIntarireText = lucrariIntarire;
    }
  } catch(e) {
    console.error('FS text generation error:', e);
    solutieRacordareText = solutieRacordareText || 'Eroare la generare text - completati manual.';
    solutieIntarireText = solutieIntarireText || 'NU ESTE CAZUL';
  }

  // Auto-generate section 5 text from existing network
  const existentCabluri = CN.filter(cn => !cn.stare || cn.stare === 'existent');
  const hasLEA = existentCabluri.some(cn => cn.lineType !== 'dashed');
  const hasLES = existentCabluri.some(cn => cn.lineType === 'dashed');
  let tipRetea = '';
  if (hasLEA && hasLES) tipRetea = 'LEA/LES';
  else if (hasLES) tipRetea = 'LES';
  else if (hasLEA) tipRetea = 'LEA';
  else tipRetea = 'rețea';

  // Detect ALL existing PTs in schema
  const allPTs = EL.filter(e => (e.type === 'trafo' || e.type === 'ptab_1t' || e.type === 'ptab_2t') && (!e.stare || e.stare === 'existent'));
  let autoInfoRetea = '';
  // Get actual power from PT element (using same defaults as render)
  function getPTpower(pt) {
    if (pt.type === 'trafo') return (pt.trText || { power: '160kVA' }).power || '160kVA';
    if (pt.type === 'ptab_1t') return (pt.trText || { power: '250kVA' }).power || '250kVA';
    if (pt.type === 'ptab_2t') return (pt.trText1 || { power: '250kVA' }).power || '250kVA';
    return '250kVA';
  }
  if (allPTs.length > 0) {
    const tipReteaJT = hasLES ? 'LES 0,4 kV' : 'LEA 0,4 kV';
    const isBuclat = allPTs.length >= 2;
    const tipCircuit = isBuclat ? 'buclat' : 'radial';

    // Find existing circuit names
    const existCircuits = new Set();
    existentCabluri.forEach(cn => {
      if (cn.circuitGroup) existCircuits.add(cn.circuitGroup);
    });
    const circuitText = existCircuits.size > 0 ? [...existCircuits].join(', ') : '';

    const ptNames = allPTs.map(pt => {
      const nrT = pt.type === 'ptab_2t' ? 2 : 1;
      const pw = getPTpower(pt);
      return `${pt.label || pt.type} 20/0.4 kV — ${nrT}x${pw}`;
    });

    autoInfoRetea = `In zona obiectivului exista ${tipReteaJT}`;
    if (circuitText) autoInfoRetea += `, circuit ${circuitText}`;
    autoInfoRetea += ` - ${tipCircuit} din zona de post ${ptNames.join(', ')}`;
  }
  let finalInfoRetea = infoRetea || autoInfoRetea;

  // Preview mode: show texts in editable textareas and stop
  if (previewOnly) {
    document.getElementById('fs-preview-racordare').value = solutieRacordareText || '';
    document.getElementById('fs-preview-intarire').value = solutieIntarireText || 'NU ESTE CAZUL';
    document.getElementById('fs-preview-retea').value = finalInfoRetea;
    document.getElementById('fs-preview-section').style.display = 'flex';
    toast('Previzualizare generată — poți edita textul înainte de export', 'ok');
    return;
  }

  // If preview was edited, use those texts instead
  const previewVisible = document.getElementById('fs-preview-section').style.display !== 'none';
  if (previewVisible) {
    solutieRacordareText = document.getElementById('fs-preview-racordare').value;
    solutieIntarireText = document.getElementById('fs-preview-intarire').value;
    finalInfoRetea = document.getElementById('fs-preview-retea').value;
  }

  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel, VerticalAlign } = window.docx;

  // Helper: simple table cell
  function tc(text, opts) {
    const o = opts || {};
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: text || '', size: o.size || s, bold: o.bold, font: f })], alignment: o.align || AlignmentType.LEFT })],
      width: o.width ? { size: o.width, type: WidthType.DXA } : undefined,
      verticalAlign: VerticalAlign.CENTER,
      shading: o.shading ? { fill: o.shading } : undefined,
    });
  }

  // Capture schema as image for section 3
  let schemaImageData = null;
  let schemaW = 600, schemaH = 400;
  try {
    if (EL.length > 0 || CN.length > 0) {
      const expResult = buildExportSVG(false, null);
      const scale = Math.min(2, 8000 / Math.max(expResult.W, expResult.H));
      const bgColor = lightMode ? '#ffffff' : '#ffffff'; // always white for document
      const canvas = await renderToCanvas(expResult.svgStr, expResult.W, expResult.H, expResult.vX, expResult.vY, scale, bgColor);
      // Convert to PNG blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const buf = await blob.arrayBuffer();
      schemaImageData = new Uint8Array(buf);
      // Calculate dimensions to fit page width (~16cm = ~600pt)
      const maxW = 580;
      const ratio = canvas.height / canvas.width;
      schemaW = maxW;
      schemaH = Math.round(maxW * ratio);
      if (schemaH > 500) { schemaH = 500; schemaW = Math.round(500 / ratio); }
    }
  } catch(e) { console.warn('Schema capture failed:', e); }

  // Build document - format conform MODEL_FS
  const f = 'Polo', s = 24, sb = 24; // Polo 12pt = size 24 half-points
  const p = (text, opts) => new Paragraph({ children: [new TextRun({ text, size: opts?.size || s, bold: opts?.bold, font: f })], alignment: opts?.align || AlignmentType.JUSTIFIED, spacing: { after: 0, before: 0, ...(opts?.spacing || {}) } });
  const pb = (text, opts) => p(text, { ...opts, bold: true });
  const ps = () => new Paragraph({ children: [new TextRun({ text: '', size: 2 })], spacing: { after: 0, before: 0 } });

  // Tab stops for right-aligned NR
  const { TabStopPosition, TabStopType } = window.docx;

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      footers: { default: new window.docx.Footer({ children: [
        new Paragraph({ children: [new TextRun({ text: 'DEGR E P13-F16, Ed.1', size: 16, font: f, italics: true })], alignment: AlignmentType.LEFT })
      ]}) },
      children: [
        // Header: ERRE left, NR right (no table)
        new Paragraph({
          children: [
            new TextRun({ text: erre, bold: true, size: s, font: f }),
            new TextRun({ text: '\t', size: s }),
            new TextRun({ text: 'NR: ' + nrDoc, bold: true, size: s, font: f }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
        }),

        ps(200),

        // Title
        p('FIȘA DE SOLUȚIE', { bold: true, size: 28, align: AlignmentType.CENTER }),
        p('pentru racordarea locului de consum la rețeaua electrică de joasă tensiune', { size: sb, align: AlignmentType.CENTER }),
        p(`din localitatea ${localitate} beneficiar ${beneficiar}`, { size: sb, align: AlignmentType.CENTER }),

        ps(100),
        p(`Puterea maximă absorbită simultan: ${putereKW} kW / ${putereKVA} kVA`, { bold: true, size: sb }),
        p(`Denumire obiectiv: ${obiectiv}`, { bold: true, size: sb }),

        // Section 1
        ps(200),
        pb('1. Date despre postul (stația) de transformare din care se alimentează rețeaua', { size: sb }),
        p(`1.1. Denumirea și raportul de transformare: ${ptName} 20/0.4 kV`),
        p(`1.2. Numărul și puterea transformatoarelor: ${nrTrafo}x${putereTrafo} kVA`),
        p('1.3. Tensiunea pe 0,4 kV la vârf de sarcină, măsurată la data de ________________________'),
        p('1.4. Sarcina de vârf:'),

        // T1/T2 load table
        new Table({ rows: [
          new TableRow({ children: [tc('', {size:s}), tc('R', {size:s, bold:true, align:AlignmentType.CENTER}), tc('S', {size:s, bold:true, align:AlignmentType.CENTER}), tc('T', {size:s, bold:true, align:AlignmentType.CENTER}), tc('(A)', {size:s, bold:true, align:AlignmentType.CENTER})] }),
          new TableRow({ children: [tc('T1', {size:s, bold:true}), tc('', {size:s}), tc('', {size:s}), tc('', {size:s}), tc('', {size:s})] }),
          new TableRow({ children: [tc('T2', {size:s, bold:true}), tc('', {size:s}), tc('', {size:s}), tc('', {size:s}), tc('', {size:s})] }),
        ], width: { size: 100, type: WidthType.PERCENTAGE } }),

        p('1.5. Curentul nominal al siguranțelor generale:'),
        new Table({ rows: [
          new TableRow({ children: [tc('T1', {size:s, bold:true}), tc('T2', {size:s, bold:true}), tc('(A)', {size:s, bold:true})] }),
          new TableRow({ children: [tc('', {size:s}), tc('', {size:s}), tc('', {size:s})] }),
        ], width: { size: 100, type: WidthType.PERCENTAGE } }),

        // Section 2
        ps(200),
        pb('2. Date despre rețeaua (circuitul) din care se racordează utilizatorul', { size: sb }),
        p('2.1. Denumire circuit: Circuit proiectat'),
        p('2.2. Secțiunea de 0,4 kV a PT pe care este racordată rețeaua: ________'),
        p('2.3. Curentul nominal al siguranței: ________'),
        p('2.4. Lungimea totală a rețelei pe secțiuni: ________'),
        p('2.5. Lungimea rețelei de la PT până la consumator: ________'),
        p('2.6. Numărul locurilor de consum cu S ≤ 11 kVA: ________'),
        p('2.7. Locuri de consum cu S > 11 kVA: ________'),
        p('2.8. Numărul locurilor de producere/consum racordate: ________'),
        p('2.9. Sarcina de vârf a circuitului: ________'),

        // Section 3 - schema
        ps(200),
        pb('3. Schema simplificată a rețelei', { size: sb }),
        ...(schemaImageData ? [new Paragraph({
          children: [new window.docx.ImageRun({
            data: schemaImageData,
            transformation: { width: schemaW, height: schemaH },
            type: 'png',
          })],
          alignment: AlignmentType.CENTER,
        })] : [p('(Se va atașa schema)')]),

        // Section 4
        ps(200),
        pb('4. Niveluri de tensiune', { size: sb }),
        p(`La postul de transformare: ${uPT} V`),
        p(`La punctul de racordare al noului consumator: ${uCons} V`),
        p(`La capătul rețelei: ${uCapat || '________'} V`),

        // Section 5
        ps(200),
        pb('5. Alte informații despre rețea', { size: sb }),
        p(finalInfoRetea || '-'),

        // Section 6
        ps(200),
        pb('6. Descrierea soluției de racordare propuse', { size: sb }),
        pb('a) Lucrări pentru instalația de racordare:'),
        ...(solutieRacordareText || '').split('\n').filter(ln => ln.trim()).map(ln =>
          new Paragraph({ children: [new TextRun({ text: ln.trim(), size: s, font: f })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 } })
        ),

        // ── VOLTAGE DROP TABLE after 6a) ──
        ...(() => {
          if (!vdResults || vdResults.size === 0) return [];
          const showIsc = document.getElementById('vd-show-isc')?.checked === true;
          const vdRows = [];
          vdResults.forEach((data, key) => {
            const el = EL.find(x => x.id === data.elId);
            if (!el) return;
            if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'meter' || el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;
            // Get local consumatori from element, not propagated VD value
            let localCons = 0;
            if (el.cons_dict) {
              const grp = data.circKey || 'Implicit';
              localCons = parseInt(el.cons_dict[grp] || el.cons_dict['Implicit'] || 0) || 0;
            } else {
              localCons = parseInt(el.consumatori) || 0;
            }
            vdRows.push({ label: data.label || el.label || '?', circuit: data.circKey || '', conductor: (data.tipConductor || '—') + ' ' + (data.sectiune || '') + 'mm²', L: data.L || 0, Lcum: data.L_cumulat || 0, nrCons: localCons, P: data.P_total_branch || 0, duNod: data.duNod || 0, Isc: data.Isc || 0 });
          });
          if (vdRows.length === 0) return [];
          vdRows.sort((a, b) => a.circuit.localeCompare(b.circuit) || a.Lcum - b.Lcum);

          const hdr = (text) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, size: 16, bold: true, font: f })], alignment: AlignmentType.CENTER })], shading: { fill: 'D9E2F3' }, verticalAlign: VerticalAlign.CENTER });
          const cell = (text, opts) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 16, font: f, bold: opts?.bold, color: opts?.color })], alignment: opts?.align || AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER });

          const headers = [hdr('Nod'), hdr('Circuit'), hdr('Conductor'), hdr('L(m)'), hdr('L cum.(m)'), hdr('Nr.cons.'), hdr('P(kW)'), hdr('ΔU nod%')];
          if (showIsc) headers.push(hdr('Isc 1F(kA)'));

          const tableRows = [new TableRow({ children: headers })];
          vdRows.forEach(r => {
            const duColor = r.duNod > 10 ? 'FF0000' : r.duNod > 5 ? 'FF6600' : r.duNod > 3 ? 'CC9900' : '008800';
            const cells = [
              cell(r.label, { align: AlignmentType.LEFT }), cell(r.circuit), cell(r.conductor, { align: AlignmentType.LEFT }),
              cell(r.L.toFixed(0)), cell(r.Lcum.toFixed(0)), cell(String(r.nrCons)), cell(r.P.toFixed(2)),
              cell(r.duNod.toFixed(3), { bold: true, color: duColor })
            ];
            if (showIsc) cells.push(cell(r.Isc > 0 ? r.Isc.toFixed(3) : '-'));
            tableRows.push(new TableRow({ children: cells }));
          });
          const maxDU = vdRows.reduce((m, r) => Math.max(m, r.duNod), 0);
          // Count total consumatori per circuit
          const consPerCircuit = {};
          vdRows.forEach(r => {
            if (!consPerCircuit[r.circuit]) consPerCircuit[r.circuit] = 0;
            consPerCircuit[r.circuit] += r.nrCons;
          });
          const consText = Object.entries(consPerCircuit).map(([circ, cnt]) => `Consumatori pe ${circ} = ${cnt} consumatori`).join('; ');
          const result = [
            ps(100),
            pb('Calcul căderi de tensiune (PE 132/2003):', { size: sb }),
            new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
            p(`ΔU max nod: ${maxDU.toFixed(3)}% — Limita admisă: ±10% (PE 132)`, { size: 18 }),
            p(consText, { size: 18 }),
          ];
          return result;
        })(),

        ps(100),
        pb('b) Lucrări de întărire rețea:'),
        ...(solutieIntarireText || 'NU ESTE CAZUL').split('\n').filter(ln => ln.trim()).map(ln =>
          new Paragraph({ children: [new TextRun({ text: ln.trim(), size: s, font: f })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 } })
        ),

        ps(100),
        p(`c) Puterea maximă ce poate fi absorbită fără lucrări de întărire: ${hasIntarire ? '0 kW' : 'NU ESTE CAZUL'}`),

        ps(),
        pb('d) Puncte de delimitare:'),
        pb('Punctul de racordare: COMPLETEAZA PUNCT RACORD'),
        pb('Punctul de delimitare: borne ieșire disjunctor spre consumator'),
        pb('Punctul de măsurare: COMPLETEAZA GRUP MASURA'),

        ps(),
        p(`e) datele necesare pentru stabilirea tarifului de racordare: conform Ord. 59/2013, este de: ${tarif ? tarif : '________'} lei (fără TVA), la data ${tarifData || '________'} și reprezintă:`),
        ...(tarifIntarire ? [p(`     Tarif de întărire rețea: ${tarifIntarire} lei (fără TVA)`)] : []),
        ...(tarifTotal ? [pb(`     TOTAL investiție: ${tarifTotal} lei (fără TVA)`)] : []),

        // Section 7
        ps(200),
        pb('7. Detalii și precizări privind avizele și acordurile necesare pentru realizarea soluției propuse:', { size: sb }),
        p('________'),

        // Section 8
        ps(),
        pb('8. Alte informații (prim utilizator, racordare la instalația unui prim utilizator etc.):', { size: sb }),
        ...(() => {
          const coexEls = EL.filter(e => e.stare === 'coexistenta' && e.type.startsWith('stalp_') && e.coexReplace);
          if (coexEls.length === 0) return [p('________')];
          const tipOriginal = { stalp_se4:'SE4', stalp_se10:'SE10', stalp_sc10002:'SC10002', stalp_sc10005:'SC10005', stalp_rotund:'Stâlp Rotund', stalp_rotund_special:'Stâlp Rotund Special', stalp_cs:'SCS' };
          const lines = coexEls.map(e => {
            const origType = tipOriginal[e.coexOrigType || e.type] || e.coexOrigType || e.type;
            return `Necesar inlocuire stalp existent ${e.label || ''} tip ${origType} cu stalp tip ${e.coexReplace}.`;
          });
          return [pb('Lucrări de coexistență:', { size: sb }), ...lines.map(ln => p(ln))];
        })(),

        // Section 9
        ps(200),
        pb('9. Adresa electrică', { size: sb }),
        new Table({ rows: [
          new TableRow({ children: [tc('Stație transf.', {bold:true, shading:'D9E2F3', size:s}), tc('Linie', {bold:true, shading:'D9E2F3', size:s}), tc('Post', {bold:true, shading:'D9E2F3', size:s}), tc('Plecare', {bold:true, shading:'D9E2F3', size:s}), tc('Stâlp/Firidă', {bold:true, shading:'D9E2F3', size:s})] }),
          new TableRow({ children: [tc(aeStatie, {size:s}), tc(aeLinie, {size:s}), tc(aePost, {size:s}), tc(aePlecare, {size:s}), tc(aeStalp, {size:s})] }),
        ], width: { size: 100, type: WidthType.PERCENTAGE } }),

        // Signatures - using tab stops (no table borders issues)
        ps(),
        new Paragraph({ children: [
          new TextRun({ text: 'Aprobat,', bold: true, size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'Avizat,', bold: true, size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: 'COORDONATOR ERRE', size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'SEF CORE', size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: coord, bold: true, size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'FLORIN TOMULESCU', bold: true, size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: '………………………………', size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: '………………………………', size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),

        ps(),
        new Paragraph({ children: [
          new TextRun({ text: 'Elaborat,', bold: true, size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'SEF SERV. MANAGEMENT MASURA /', size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: elaborat, bold: true, size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'REPREZENTANT ZONAL', size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: '………………………….………', size: s, font: f }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'PETRU CATALIN NECULAU', bold: true, size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
        new Paragraph({ children: [
          new TextRun({ text: '', size: s }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: '………………………………..', size: s, font: f }),
        ], tabStops: [{ type: TabStopType.RIGHT, position: 9000 }] }),
      ],
    }],
  });

  // Generate and save
  Packer.toBlob(doc).then(function(blob) {
    const fileName = `FS_${beneficiar || 'document'}_${localitate || ''}.docx`.replace(/\s+/g, '_');
    if (window.__TAURI__) {
      blob.arrayBuffer().then(function(buf) {
        window.__TAURI__.dialog.save({
          title: 'Salvează Fișa de Soluție',
          defaultPath: fileName,
          filters: [{ name: 'Word Document', extensions: ['docx'] }]
        }).then(function(path) {
          if (path) {
            window.__TAURI__.fs.writeFile(path, new Uint8Array(buf)).then(function() {
              toast('Fișă de Soluție generată: ' + path.split(/[/\\]/).pop(), 'ok');
              closeFSModal();
            });
          }
        });
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
      toast('Fișă de Soluție generată!', 'ok');
      closeFSModal();
    }
  }).catch(function(e) {
    console.error('FS generation error:', e);
    toast('Eroare generare FS: ' + e.message, '');
  });
}