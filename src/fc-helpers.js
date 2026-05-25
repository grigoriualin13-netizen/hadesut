import { S } from './state.js';
import { calcPathLen } from './utils.js';
import { toast } from './utils.js';

export const FC_CATALOG = [
  { poz:1,  cat:'Brans.mono. radial aerian',    den:'Branşament monofazat aerian standard',                                              um:'buc', pu:1340.00 },
  { poz:2,  cat:'Brans.mono. radial aerian',    den:'Branşament monofazat aerian - deschidere suplimentară',                             um:'buc', pu:1810.00 },
  { poz:4,  cat:'Brans.mono. radial subteran',  den:'Branşament monofazat subteran standard L ≤ 20 m din LEA',                           um:'buc', pu:2060.00 },
  { poz:5,  cat:'Brans.mono. radial subteran',  den:'Branşament monofazat subteran standard L ≤ 20 m din firidă',                        um:'buc', pu:1820.00 },
  { poz:6,  cat:'Brans.mono. radial subteran',  den:'Branşament monofazat subteran - creşterea lungimii cu 1 m faţă de L = 20 m',        um:'m',   pu:60.00  },
  { poz:7,  cat:'Brans.trif. radial aerian',    den:'Branşament trifazat aerian standard',                                               um:'buc', pu:1460.00 },
  { poz:8,  cat:'Brans.trif. radial aerian',    den:'Branşament trifazat aerian - deschidere suplimentară',                              um:'buc', pu:1930.00 },
  { poz:10, cat:'Brans.trif. radial subteran',  den:'Branşament trifazat subteran standard L≤ 20m din LEA',                              um:'buc', pu:2430.00 },
  { poz:11, cat:'Brans.trif. radial subteran',  den:'Branşament trifazat subteran standard L≤ 20m din firida S≤ 20 KVA',                 um:'buc', pu:2060.00 },
  { poz:12, cat:'Brans.trif. radial subteran',  den:'Branşament trifazat subteran standard L≤ 20m din firida 20KVA<S≤30 KVA',            um:'buc', pu:2200.00 },
  { poz:13, cat:'Brans.trif. radial subteran',  den:'Branşament trifazat subteran - creşterea lungimii cu 1 m faţă de L = 20 m',         um:'m',   pu:70.00  },
  { poz:37, cat:'Costuri Specifice 2021',       den:'Extinderi - reţele electrice noi LEA JT',                                           um:'km',  pu:194598.49 },
  { poz:38, cat:'Costuri Specifice 2021',       den:'Extinderi - reţele electrice noi LES JT',                                           um:'km',  pu:257401.72 },
  { poz:40, cat:'Costuri Specifice 2021',       den:'Extinderi retele noi pe stilpi existenti LEA JT',                                   um:'km',  pu:77839.40  },
  { poz:43, cat:'Costuri Specifice 2021',       den:'Inlocuire conductor torsadat 95mm 1 KM traseu LEA 0.4 KV',                          um:'km',  pu:176583.77 },
  { poz:47, cat:'Costuri Specifice 2021',       den:'Înlocuire stâlp de JT de beton SE4 (fara material)',                                um:'buc', pu:7232.21  },
  { poz:48, cat:'Costuri Specifice 2021',       den:'Înlocuire stâlp de JT de beton SE 10 (fara material)',                              um:'buc', pu:10895.40 },
];

export function fcFindPoz(pozId) { return FC_CATALOG.find(p => p.poz === pozId); }

function fcCableLenM(cn) {
  if (cn.length != null && !isNaN(parseFloat(cn.length))) return parseFloat(cn.length);
  if (cn.pts && cn.pts.length >= 2) return calcPathLen(cn.pts) / S.pxPerMeter;
  return 0;
}

function fcCableAerian(cn) {
  const tc = (cn.tipConductor || '').toLowerCase();
  return tc.includes('torsadat') || tc.includes('clasic');
}

function fcIsMono(cn, bmptEl) {
  if (bmptEl && bmptEl.bmptText) {
    const t = bmptEl.bmptText.toUpperCase();
    if (t.includes('BMPM')) return true;
    if (t.includes('BMPT')) return false;
  }
  return cn.tipRetea === 'Monofazat';
}

function fcFromFirida(cn, bmptEl) {
  if (!bmptEl) return false;
  const otherId = cn.fromElId === bmptEl.id ? cn.toElId : cn.fromElId;
  const other = S.EL.find(e => e.id === otherId);
  return !!(other && other.type && other.type.startsWith('firida_'));
}

function fcDeschideriSupl(cn, bmptEl, lenM) {
  const otherId = cn.fromElId === bmptEl.id ? cn.toElId : cn.fromElId;
  const sePrintermediari = S.EL.filter(e =>
    e.type === 'stalp_se4' && e.stare === 'proiectat_racordare' && e.id !== otherId
  );
  if (sePrintermediari.length === 0) {
    if (lenM <= 30) return 0;
    return Math.ceil((lenM - 30) / 40);
  }
  return sePrintermediari.length;
}

export function computeCantitatiFC() {
  const q = new Map();
  const add = (pozId, n) => { if (!n) return; q.set(pozId, (q.get(pozId) || 0) + n); };

  const cabluri = S.CN.filter(cn => cn.stare === 'proiectat_racordare' || cn.stare === 'intarire_nou' || cn.stare === 'intarire_inlocuire');

  cabluri.forEach(cn => {
    const fromEl = S.EL.find(e => e.id === cn.fromElId);
    const toEl = S.EL.find(e => e.id === cn.toElId);
    const isBrans = (fromEl && fromEl.type === 'meter') || (toEl && toEl.type === 'meter');
    const lenM = fcCableLenM(cn);

    if (isBrans) {
      const bmptEl = fromEl && fromEl.type === 'meter' ? fromEl : toEl;
      const aerian = fcCableAerian(cn);
      const mono = fcIsMono(cn, bmptEl);
      const fromFirida = fcFromFirida(cn, bmptEl);
      if (aerian) {
        if (mono) { add(1, 1); add(2, fcDeschideriSupl(cn, bmptEl, lenM)); }
        else      { add(7, 1); add(8, fcDeschideriSupl(cn, bmptEl, lenM)); }
      } else {
        const supl = Math.max(0, lenM - 20);
        if (mono) {
          if (fromFirida) { add(5, 1); } else { add(4, 1); }
          add(6, Math.round(supl));
        } else {
          if (fromFirida) { add(11, 1); } else { add(10, 1); }
          add(13, Math.round(supl));
        }
      }
    } else {
      const aerian = fcCableAerian(cn);
      const km = lenM / 1000;
      if (cn.stare === 'intarire_inlocuire' && aerian) {
        add(43, km);
      } else if (aerian) {
        const stPe = [fromEl, toEl].filter(e => e && e.type && e.type.startsWith('stalp_'));
        const areStalpProiectat = stPe.some(e => e.stare === 'proiectat_racordare' || e.stare === 'intarire_nou');
        if (areStalpProiectat) add(37, km); else add(40, km);
      } else {
        add(38, km);
      }
    }
  });

  S.EL.forEach(e => {
    if (e.stare === 'intarire_inlocuire') {
      if (e.type === 'stalp_se4') add(47, 1);
      else if (e.type === 'stalp_se10') add(48, 1);
    }
  });

  return q;
}

export async function generateFC() {
  if (!window.ExcelJS) { toast('ExcelJS nu e încărcat!', ''); return; }
  if (!window.FC_TEMPLATE_B64) { toast('Template FC nu e încărcat (fc_template.js)!', ''); return; }
  toast('Generez Fișa de Calcul...', 'ac');

  const binStr = atob(window.FC_TEMPLATE_B64);
  const buf = new ArrayBuffer(binStr.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);

  const dePrintat = wb.getWorksheet('DE PRINTAT');
  const fcCalcul  = wb.getWorksheet('FC CALCUL');

  const beneficiar = (document.getElementById('fs-beneficiar') || {}).value || '';
  const atr        = (document.getElementById('fs-nr') || {}).value || '';
  const localitate = (document.getElementById('fs-localitate') || {}).value || '';
  if (dePrintat) {
    dePrintat.getCell('C1').value = beneficiar;
    dePrintat.getCell('C2').value = atr;
    dePrintat.getCell('C3').value = localitate;
  }

  const q = computeCantitatiFC();
  if (fcCalcul) {
    q.forEach((cant, pozId) => {
      fcCalcul.getCell(`G${pozId + 9}`).value = cant;
    });
  }

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
      { start: 10,  end: 94,  prefix: 'A.', source: (i) => fcCalcul ? readNum(fcCalcul.getCell(`G${i}`).value) : 0 },
      { start: 99,  end: 115, prefix: 'B.', source: (i) => spargeri ? readNum(spargeri.getCell(`G${i - 96}`).value) : 0 },
      { start: 120, end: 141, prefix: 'C.', source: (i) => {
          if (!avize) return 0;
          const v = avize.getCell(`C${i - 113}`).value;
          return v && String(v).trim() ? 1 : 0;
        }
      },
    ];
    sections.forEach(s => {
      let n = 1;
      for (let i = s.start; i <= s.end; i++) {
        const row = dePrintat.getRow(i);
        const hasCant = s.source(i) > 0;
        if (hasCant) { row.hidden = false; row.getCell(1).value = s.prefix + n; n++; }
        else { row.hidden = true; }
      }
    });
  }

  wb.calcProperties = wb.calcProperties || {};
  wb.calcProperties.fullCalcOnLoad = true;

  const outBuf = await wb.xlsx.writeBuffer();
  const blob = new Blob([outBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fname = `Fisa_Calcul_${(beneficiar || 'client').replace(/[^\w-]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = fname;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
  toast('Fișa de Calcul generată ✓', 'ok');
}

window.generateFC = generateFC;
