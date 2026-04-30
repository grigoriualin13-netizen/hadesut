// ElectroCAD Pro v12 — Element Symbols & SVG Definitions
import { counters } from './state.js';

// ========== Element Type Definitions ==========

export const ELEMENT_TYPES = {
  ptab_1t: { name: 'PTAB 1T', category: 'posturi', label: 'PTAB' },
  ptab_2t: { name: 'PTAB 2T', category: 'posturi', label: 'PTAB' },
  ptab_mono: { name: 'PTAB Mono', category: 'posturi', label: 'PTAb' },
  trafo: { name: 'PT Aerian', category: 'jt_mt', label: 'PT' },
  firida_e2_4: { name: 'Firidă E2-4', category: 'jt', label: 'FG' },
  firida_e3_4: { name: 'Firidă E3-4', category: 'jt', label: 'FG' },
  firida_e3_0: { name: 'Firidă E3-0', category: 'jt', label: 'FG' },
  cd4: { name: 'CD 4 Plecări', category: 'jt', label: 'CD' },
  cd5: { name: 'CD 5 Plecări', category: 'jt', label: 'CD' },
  cd8: { name: 'CD 8 Plecări', category: 'jt', label: 'CD' },
  meter: { name: 'BMPT', category: 'jt', label: 'BMPT' },
  stalp_se4: { name: 'Stâlp SE4', category: 'stalpi', label: 'SE4' },
  stalp_se10: { name: 'Stâlp SE10', category: 'stalpi', label: 'SE10' },
  stalp_cs: { name: 'Stâlp CS', category: 'stalpi', label: 'SCS' },
  stalp_sc10002: { name: 'Stâlp SC10002', category: 'stalpi', label: 'SC10002' },
  stalp_sc10005: { name: 'Stâlp SC10005', category: 'stalpi', label: 'SC10005' },
  stalp_rotund: { name: 'Stâlp Rotund', category: 'stalpi', label: 'SR' },
  stalp_rotund_special: { name: 'Stâlp Special', category: 'stalpi', label: 'SRS' },
  separator: { name: 'Separator JT', category: 'jt_mt', label: 'SEP' },
  separator_mt: { name: 'Separator MT', category: 'jt_mt', label: 'SMT' },
  manson: { name: 'Manson', category: 'jt', label: 'M' },
  priza_pamant: { name: 'Priză Pământ', category: 'jt', label: 'PP' },
  text: { name: 'Text Liber', category: 'desen', label: '' },
  rect: { name: 'Dreptunghi', category: 'desen', label: '' },
  circle: { name: 'Cerc', category: 'desen', label: '' },
  polyline: { name: 'Linie Liberă', category: 'desen', label: '' },
  bara_mt: { name: 'Bară Stație MT', category: 'jt_mt', label: 'BAMT' },
  celula_linie_mt: { name: 'Celulă Linie MT', category: 'jt_mt', label: 'CLM' },
  celula_trafo_mt: { name: 'Celulă Trafo MT', category: 'jt_mt', label: 'CTM' },
  bara_statie_mt: { name: 'Bară Stație MT', category: 'jt_mt', label: 'BS' }
};

// ========== Symbol Size Helpers ==========

export function symW(el) {
  const t = typeof el === 'string' ? el : el.type;
  if (t === 'ptab_1t') return 380;
  if (t === 'ptab_2t') return 780;
  if (t === 'rect') return (typeof el !== 'string' && el.width) ? el.width : 100;
  if (t === 'circle') return (typeof el !== 'string' && el.r) ? el.r * 2 : 100;
  if (t === 'ptab_mono') { const n = (typeof el !== 'string' && el.celule) ? el.celule.length : 4; return n * 72 + 40; }
  if (t === 'trafo') return 110;
  if (t === 'firida_e2_4') return 140;
  if (t === 'firida_e3_4') return 180;
  if (t === 'firida_e3_0') return 180;
  if (t.startsWith('cd')) return 130;
  if (t === 'meter') return 70;
  if (t === 'stalp_cs') return 64;
  if (t.startsWith('stalp_')) return 48;
  if (t === 'separator') return 104;
  if (t === 'separator_mt') return 108;
  if (t === 'manson') return 76;
  if (t === 'priza_pamant') return 50;
  if (t === 'bara_mt') return 220;
  if (t === 'celula_linie_mt') return 70;
  if (t === 'celula_trafo_mt') return 80;
  if (t === 'bara_statie_mt') { const el2 = typeof el !== 'string' ? el : null; return (el2 && el2.lungime ? el2.lungime : 200) + 40; }
  return 56;
}

export function symH(el) {
  const t = typeof el === 'string' ? el : el.type;
  if (t === 'ptab_1t') return 400;
  if (t === 'ptab_2t') return 400;
  if (t === 'rect') return (typeof el !== 'string' && el.height) ? el.height : 100;
  if (t === 'circle') return (typeof el !== 'string' && el.r) ? el.r * 2 : 100;
  if (t === 'ptab_mono') return 262;
  if (t === 'trafo') return 100;
  if (t === 'firida_e2_4') return 180;
  if (t === 'firida_e3_4') return 180;
  if (t === 'firida_e3_0') return 95;
  if (t.startsWith('cd')) { const n = parseInt(t.replace('cd', '')); return n * 34 + 24; }
  if (t === 'meter') return 96;
  if (t.startsWith('stalp_')) return 48;
  if (t === 'separator') return 48;
  if (t === 'separator_mt') return 52;
  if (t === 'manson') return 44;
  if (t === 'priza_pamant') return 64;
  if (t === 'bara_mt') return 30;
  if (t === 'celula_linie_mt') return 220;
  if (t === 'celula_trafo_mt') return 280;
  if (t === 'bara_statie_mt') { const el2 = typeof el !== 'string' ? el : null; return (el2 && el2.lungime ? el2.lungime : 200) + 40; }
  return 56;
}

// ========== Main Symbol Renderer ==========

export function sym(el) {
  const c = el.color || '#555';
  const bg = el.fillColor || 'none';
  let inner = '';
  let terms = [];

  function fuse(lx, cy, fw, fh, fuseState) {
    const rx = lx, ry = cy - fh / 2, cx = rx + fw / 2, c_y = ry + fh / 2;
    let html = `<rect x="${rx}" y="${ry}" width="${fw}" height="${fh}" fill="none" stroke="${c}" stroke-width="1.5"/>`;
    if (fuseState !== false) {
      html += `<line x1="${cx}" y1="${ry + 4}" x2="${cx}" y2="${ry + fh - 4}" stroke="${c}" stroke-width="2"/>`;
    } else {
      html += `<line x1="${cx - 4}" y1="${c_y}" x2="${cx + 4}" y2="${c_y}" stroke="#ff3d71" stroke-width="2"/>`;
    }
    return html;
  }

  function td(lcx, lcy) {
    terms.push({ cx: lcx, cy: lcy });
    return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
  }

  function tdinv(lcx, lcy) {
    terms.push({ cx: lcx, cy: lcy });
    return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
  }

  switch (el.type) {
    case 'ptab_1t': {
      const BW = 380, BH = 400;
      const f = el.fuses || new Array(10).fill(true);
      const t1 = el.trText || { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
      inner = `<rect class="sel-r" x="${-BW/2}" y="${-BH/2}" width="${BW}" height="${BH}" fill="transparent" stroke="transparent"/><line x1="-160" y1="-170" x2="160" y2="-170" stroke="${c}" stroke-width="4"/><text x="0" y="-178" text-anchor="middle" font-size="12" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BARĂ 20kV</text><circle class="td" data-lcx="-160" data-lcy="-170" data-circuit="0" cx="-160" cy="-170" r="8" stroke="transparent" fill="transparent"/><circle class="td" data-lcx="160" data-lcy="-170" data-circuit="0" cx="160" cy="-170" r="8" stroke="transparent" fill="transparent"/>`;
      terms.push({ cx: -160, cy: -170, circuit: 0 }, { cx: 160, cy: -170, circuit: 0 });
      const tx1 = 0;
      inner += `<line x1="${tx1}" y1="-170" x2="${tx1}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -144, 12, 12, f[0]) + `<text x="${tx1 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.mv}</text><rect x="${tx1 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx1}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx1},-105 ${tx1 - 5},-90 ${tx1 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx1},-70 v8 M${tx1},-70 l-6,-6 M${tx1},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx1 + 35}" y="-95" text-anchor="middle" font-size="6" fill="${c}">${t1.type}</text><text x="${tx1 + 35}" y="-85" text-anchor="middle" font-size="6" fill="${c}">${t1.power}</text><text x="${tx1 + 35}" y="-75" text-anchor="middle" font-size="6" fill="${c}">${t1.volt}</text><line x1="${tx1}" y1="-45" x2="${tx1}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -6, 12, 18, f[1]) + `<text x="${tx1 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.lv}</text><circle cx="${tx1}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx1 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx1 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx1 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="-170" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx1}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T.</text><line x1="-160" y1="40" x2="160" y2="40" stroke="${c}" stroke-width="4"/><text x="-160" y="36" text-anchor="start" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
      const outX1 = [-112, -80, -48, -16, 16, 48, 80, 112];
      outX1.forEach((tx, i) => {
        inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[2 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 1}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
        terms.push({ cx: tx, cy: 160, circuit: i + 1 });
      });
      break;
    }
    case 'ptab_2t': {
      const BW = 780, BH = 400;
      const f = el.fuses || new Array(21).fill(true);
      const t1 = el.trText1 || { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
      const t2 = el.trText2 || { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
      const cpText = el.cpText || 'In=160A';
      inner = `<rect class="sel-r" x="${-BW/2}" y="${-BH/2}" width="${BW}" height="${BH}" fill="transparent" stroke="transparent"/><line x1="-370" y1="-170" x2="370" y2="-170" stroke="${c}" stroke-width="4"/><text x="0" y="-178" text-anchor="middle" font-size="12" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BARĂ 20kV</text><circle class="td" data-lcx="-370" data-lcy="-170" data-circuit="0" cx="-370" cy="-170" r="8" stroke="transparent" fill="transparent"/><circle class="td" data-lcx="370" data-lcy="-170" data-circuit="0" cx="370" cy="-170" r="8" stroke="transparent" fill="transparent"/>`;
      terms.push({ cx: -370, cy: -170, circuit: 0 }, { cx: 370, cy: -170, circuit: 0 });
      const tx1 = -200;
      inner += `<line x1="${tx1}" y1="-170" x2="${tx1}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -144, 12, 12, f[0]) + `<text x="${tx1 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.mv}</text><rect x="${tx1 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx1}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx1},-105 ${tx1 - 5},-90 ${tx1 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx1},-70 v8 M${tx1},-70 l-6,-6 M${tx1},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx1}" y="-120" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TRAFO 1</text><text x="${tx1 + 35}" y="-95" text-anchor="middle" font-size="6" fill="${c}">${t1.type}</text><text x="${tx1 + 35}" y="-85" text-anchor="middle" font-size="6" fill="${c}">${t1.power}</text><text x="${tx1 + 35}" y="-75" text-anchor="middle" font-size="6" fill="${c}">${t1.volt}</text><line x1="${tx1}" y1="-45" x2="${tx1}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -6, 12, 18, f[1]) + `<text x="${tx1 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.lv}</text><circle cx="${tx1}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx1 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx1 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx1 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="-370" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx1}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T. 1</text><line x1="-360" y1="40" x2="-40" y2="40" stroke="${c}" stroke-width="4"/><text x="-360" y="36" text-anchor="start" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
      const outX1 = [-312, -280, -248, -216, -184, -152, -120];
      outX1.forEach((tx, i) => {
        inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[2 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 1}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
        terms.push({ cx: tx, cy: 160, circuit: i + 1 });
      });
      inner += `<line x1="-80" y1="40" x2="-80" y2="110" stroke="${c}" stroke-width="2"/><line x1="-80" y1="110" x2="0" y2="110" stroke="${c}" stroke-width="2"/>`;
      const tx2 = 200;
      inner += `<line x1="${tx2}" y1="-170" x2="${tx2}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx2 - 6, -144, 12, 12, f[10]) + `<text x="${tx2 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t2.mv}</text><rect x="${tx2 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx2}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx2},-105 ${tx2 - 5},-90 ${tx2 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx2},-70 v8 M${tx2},-70 l-6,-6 M${tx2},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx2}" y="-120" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TRAFO 2</text><text x="${tx2 + 35}" y="-95" text-anchor="middle" font-size="6" fill="${c}">${t2.type}</text><text x="${tx2 + 35}" y="-85" text-anchor="middle" font-size="6" fill="${c}">${t2.power}</text><text x="${tx2 + 35}" y="-75" text-anchor="middle" font-size="6" fill="${c}">${t2.volt}</text><line x1="${tx2}" y1="-45" x2="${tx2}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx2 - 6, -6, 12, 18, f[11]) + `<text x="${tx2 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t2.lv}</text><circle cx="${tx2}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx2 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx2 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx2 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="40" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx2}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T. 2</text><line x1="40" y1="40" x2="360" y2="40" stroke="${c}" stroke-width="4"/><text x="360" y="36" text-anchor="end" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
      const outX2 = [88, 120, 152, 184, 216, 248, 280, 312];
      outX2.forEach((tx, i) => {
        inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[12 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 9}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
        terms.push({ cx: tx, cy: 160, circuit: i + 9 });
      });
      inner += `<line x1="80" y1="40" x2="80" y2="110" stroke="${c}" stroke-width="2"/><line x1="80" y1="110" x2="0" y2="110" stroke="${c}" stroke-width="2"/>` + fuse(-8, 110, 16, 20, f[20]) + `<text x="0" y="135" text-anchor="middle" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">${cpText}</text>`;
      break;
    }
    case 'ptab_mono': {
      const celule = el.celule || [];
      const CW = 72, CH = 240, BAR_Y = -120;
      const nC = celule.length, totalW = nC * CW, startX = -totalW / 2;
      inner = `<rect class="sel-r" x="${startX - 6}" y="${BAR_Y - 22}" width="${totalW + 12}" height="${CH + 28}" fill="transparent" stroke="transparent"/>`;
      inner += `<rect x="${startX}" y="${BAR_Y - 5}" width="${totalW}" height="10" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/>`;
      inner += `<text x="0" y="${BAR_Y - 14}" text-anchor="middle" font-size="10" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BARĂ 20kV</text>`;
      inner += `<line x1="${startX - 20}" y1="${BAR_Y}" x2="${startX}" y2="${BAR_Y}" stroke="${c}" stroke-width="2.5"/>`;
      inner += td(startX - 20, BAR_Y);
      inner += `<line x1="${startX + totalW}" y1="${BAR_Y}" x2="${startX + totalW + 20}" y2="${BAR_Y}" stroke="${c}" stroke-width="2.5"/>`;
      inner += td(startX + totalW + 20, BAR_Y);
      celule.forEach((cel, i) => {
        const cx = startX + i * CW + CW / 2;
        const isT = cel.tip === 'T';
        const stare = cel.stare !== false;
        const dc = stare ? '#22c55e' : '#ef4444';
        inner += `<rect x="${startX + i * CW}" y="${BAR_Y}" width="${CW}" height="${CH}" fill="${el.fillColor || 'none'}" stroke="${c}" stroke-width="1.2" rx="1"/>`;
        inner += `<line x1="${cx}" y1="${BAR_Y}" x2="${cx}" y2="${BAR_Y + 20}" stroke="${c}" stroke-width="2"/>`;
        const dTop = BAR_Y + 20, dH = 34;
        inner += `<rect x="${cx - 12}" y="${dTop}" width="24" height="${dH}" fill="${el.fillColor || 'none'}" stroke="${c}" stroke-width="1.6" rx="1"/>`;
        if (stare) {
          inner += `<line x1="${cx}" y1="${dTop + 5}" x2="${cx}" y2="${dTop + dH - 5}" stroke="${dc}" stroke-width="2.8"/>`;
        } else {
          inner += `<line x1="${cx - 6}" y1="${dTop + dH / 2}" x2="${cx + 6}" y2="${dTop + dH / 2}" stroke="${dc}" stroke-width="2.8"/>`;
        }
        inner += `<text x="${cx + 15}" y="${dTop + dH / 2 + 3}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cel.curent || '16A'}</text>`;
        inner += `<line x1="${cx}" y1="${dTop + dH}" x2="${cx}" y2="${BAR_Y + 74}" stroke="${c}" stroke-width="2"/>`;
        const sY = BAR_Y + 86;
        inner += `<circle cx="${cx}" cy="${sY - 12}" r="4.5" fill="none" stroke="${c}" stroke-width="1.5"/>`;
        inner += `<circle cx="${cx}" cy="${sY + 12}" r="4.5" fill="none" stroke="${c}" stroke-width="1.5"/>`;
        inner += `<line x1="${cx}" y1="${sY - 7}" x2="${cx}" y2="${sY + 7}" stroke="${c}" stroke-width="2.5"/>`;
        if (isT) {
          const t1Y = BAR_Y + 136, t2Y = BAR_Y + 158;
          inner += `<circle cx="${cx}" cy="${t1Y}" r="20" fill="${el.fillColor || 'none'}" stroke="${c}" stroke-width="1.8"/>`;
          inner += `<circle cx="${cx}" cy="${t2Y}" r="20" fill="${el.fillColor || 'none'}" stroke="${c}" stroke-width="1.8"/>`;
          inner += `<text x="${cx}" y="${t1Y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cel.putere || '100kVA'}</text>`;
          const lblT = cel.label || `T${i + 1}`;
          inner += `<text x="${cx}" y="${BAR_Y + CH - 9}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${lblT}</text>`;
          inner += `<text x="${cx}" y="${BAR_Y + CH - 1}" text-anchor="middle" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cel.volt || '20/0.4kV'}</text>`;
          inner += td(cx, BAR_Y + CH);
        } else {
          inner += `<line x1="${cx}" y1="${BAR_Y + 112}" x2="${cx}" y2="${BAR_Y + CH - 20}" stroke="${c}" stroke-width="2"/>`;
          inner += `<polygon points="${cx},${BAR_Y + CH - 8} ${cx - 8},${BAR_Y + CH - 24} ${cx + 8},${BAR_Y + CH - 24}" fill="${c}"/>`;
          const lblL = cel.label || `L${i + 1}`;
          inner += `<text x="${cx}" y="${BAR_Y + CH - 1}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${lblL}</text>`;
          inner += td(cx, BAR_Y + CH);
        }
        inner += td(cx, dTop + dH / 2);
      });
      break;
    }
    case 'rect': {
      const w = el.width || 100, h = el.height || 100;
      const dash = el.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '';
      const sw = el.strokeWidth || 2;
      inner = `<rect class="sel-r" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="transparent" stroke="transparent" stroke-width="15"/><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${bg}" stroke="${c}" stroke-width="${sw}" ${dash} />`;
      break;
    }
    case 'circle': {
      const r = el.r || 50;
      const dash = el.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '';
      const sw = el.strokeWidth || 2;
      inner = `<circle class="sel-r" cx="0" cy="0" r="${r}" fill="transparent" stroke="transparent" stroke-width="15"/><circle cx="0" cy="0" r="${r}" fill="${bg}" stroke="${c}" stroke-width="${sw}" ${dash} />`;
      break;
    }
    case 'trafo': {
      const t1 = el.trText || { mv: '16A', type: 'PT Aerian', power: '160kVA', volt: '20/0.4kV', lv: '250A' };
      inner = `<rect class="sel-r" x="-55" y="-35" width="110" height="100" fill="none" stroke="transparent"/><circle cx="-15" cy="0" r="30" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="15" cy="0" r="30" fill="${bg}" stroke="${c}" stroke-width="2"/><text x="0" y="44" text-anchor="middle" font-size="10" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${t1.power}</text><text x="0" y="54" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.type}</text>`;
      inner += td(-45, 0) + td(45, 0);
      break;
    }
    case 'firida_e2_4': {
      const BW = 140, BH = 180, BX = -70, BY = -90, FW = 14, FH = 32;
      const fuses = el.fuses || new Array(6).fill(true);
      inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="18" x2="${BX + BW}" y2="18" stroke="${c}" stroke-width="3"/>`;
      [-40, 40].forEach((tx, i) => {
        const fuseTop = BY + 10, fuseBot = fuseTop + FH;
        inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="18" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY);
      });
      [-52, -18, 18, 52].forEach((tx, i) => {
        const fuseTop = 28, fuseBot = fuseTop + FH;
        inner += `<line x1="${tx}" y1="18" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i + 2]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH}" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY + BH);
      });
      break;
    }
    case 'firida_e3_4': {
      const BW = 180, BH = 180, BX = -90, BY = -90, FW = 14, FH = 32;
      const fuses = el.fuses || new Array(7).fill(true);
      inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="18" x2="${BX + BW}" y2="18" stroke="${c}" stroke-width="3"/>`;
      [-50, 0, 50].forEach((tx, i) => {
        const fuseTop = BY + 10, fuseBot = fuseTop + FH;
        inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="18" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY);
      });
      [-65, -22, 22, 65].forEach((tx, i) => {
        const fuseTop = 28, fuseBot = fuseTop + FH;
        inner += `<line x1="${tx}" y1="18" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i + 3]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH}" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY + BH);
      });
      break;
    }
    case 'firida_e3_0': {
      const BW = 180, BH = 95, BX = -90, BY = -47.5, FW = 14, FH = 32;
      const fuses = el.fuses || new Array(3).fill(true);
      inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="${BY + BH - 10}" x2="${BX + BW}" y2="${BY + BH - 10}" stroke="${c}" stroke-width="3"/>`;
      [-50, 0, 50].forEach((tx, i) => {
        const fuseTop = BY + 10, fuseBot = fuseTop + FH;
        inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH - 10}" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY);
      });
      break;
    }
    case 'cd4': case 'cd5': case 'cd8': {
      const np = parseInt(el.type.replace('cd', ''));
      const ROW_H = 36, BH = np * ROW_H + 28, BW = 140, LX = -BW / 2, BAR_X = LX + 30, BY2 = -BH / 2, FW = 14, FH = 32;
      const f = el.fuses || new Array(np + 1).fill(true);
      inner = `<rect class="sel-r" x="${LX}" y="${BY2}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/>`;
      inner += `<line x1="${BAR_X}" y1="${BY2}" x2="${BAR_X}" y2="${BY2 + BH}" stroke="${c}" stroke-width="2.5"/>`;
      const inputY = 0;
      inner += `<line x1="${LX}" y1="${inputY}" x2="${BAR_X - FW}" y2="${inputY}" stroke="${c}" stroke-width="2"/>`;
      inner += fuse(BAR_X - FW, inputY, FW, FH, f[0] !== false);
      inner += `<circle class="td" data-lcx="${LX}" data-lcy="${inputY}" data-circuit="0" cx="${LX}" cy="${inputY}" r="7" stroke="transparent" fill="transparent"/>`;
      terms.push({ cx: LX, cy: inputY });
      for (let i = 0; i < np; i++) {
        const yp = BY2 + 16 + ROW_H * i + ROW_H / 2;
        const cn2 = i + 1;
        const fuseOn = f[cn2] !== false;
        const fuseColor = fuseOn ? c : '#ef4444';
        inner += `<line x1="${BAR_X}" y1="${yp}" x2="${BAR_X + 18}" y2="${yp}" stroke="${c}" stroke-width="2"/>`;
        inner += fuse(BAR_X + 18, yp, FW, FH, fuseOn);
        inner += `<line x1="${BAR_X + 18 + FW}" y1="${yp}" x2="${BAR_X + BW}" y2="${yp}" stroke="${fuseColor}" stroke-width="2" stroke-dasharray="${fuseOn ? 'none' : '6,3'}"/>`;
        inner += `<text x="${BAR_X + BW - 6}" y="${yp + 11}" text-anchor="end" font-size="8" fill="${fuseColor}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none">C${cn2}</text>`;
        inner += `<circle class="td" data-lcx="${BAR_X + BW}" data-lcy="${yp}" data-circuit="${cn2}" cx="${BAR_X + BW}" cy="${yp}" r="7" stroke="transparent" fill="transparent"/>`;
        terms.push({ cx: BAR_X + BW, cy: yp, circuit: cn2 });
      }
      break;
    }
    case 'meter': {
      inner = `<rect class="sel-r" x="-35" y="-48" width="70" height="96" fill="${bg}" stroke="${c}" stroke-width="2" rx="1"/><text x="0" y="5" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700" class="bmpt-txt">${el.bmptText || ''}</text>`;
      inner += td(0, -48) + td(0, 48);
      break;
    }
    case 'stalp_se4': {
      inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_se10': {
      inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="-22" x2="22" y2="22" stroke="${c}" stroke-width="2"/><line x1="22" y1="-22" x2="-22" y2="22" stroke="${c}" stroke-width="2"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_cs': {
      inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="-22" x2="22" y2="22" stroke="${c}" stroke-width="2"/><line x1="22" y1="-22" x2="-22" y2="22" stroke="${c}" stroke-width="2"/><rect x="22" y="-12" width="18" height="24" fill="${bg !== 'none' ? bg : '#243755'}" stroke="#ff9f43" stroke-width="2" rx="2"/><text x="31" y="-13" text-anchor="middle" font-size="9" fill="#ff9f43" font-family="Barlow Condensed,sans-serif" font-weight="700">CS</text>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_sc10002': {
      inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_sc10005': {
      inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-16" y1="-16" x2="16" y2="16" stroke="${c}" stroke-width="2"/><line x1="16" y1="-16" x2="-16" y2="16" stroke="${c}" stroke-width="2"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_rotund': {
      inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'stalp_rotund_special': {
      inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-16" y1="-16" x2="16" y2="16" stroke="${c}" stroke-width="2"/><line x1="16" y1="-16" x2="-16" y2="16" stroke="${c}" stroke-width="2"/>${td(-22, -13)}${td(-22, 0)}${td(-22, 13)}${td(22, -13)}${td(22, 0)}${td(22, 13)}${td(-13, -22)}${td(0, -22)}${td(13, -22)}${td(-13, 22)}${td(0, 22)}${td(13, 22)}`;
      break;
    }
    case 'priza_pamant': {
      if (bg !== 'none') inner += `<rect x="-25" y="-32" width="50" height="58" fill="${bg}" stroke="${c}" stroke-width="2" rx="4"/>`;
      inner += `<rect class="sel-r" x="-25" y="-32" width="50" height="58" fill="none" stroke="transparent"/><line x1="0" y1="-32" x2="0" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="0" x2="22" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="-15" y1="8" x2="15" y2="8" stroke="${c}" stroke-width="1.5"/><line x1="-8" y1="16" x2="8" y2="16" stroke="${c}" stroke-width="1.5"/><line x1="-3" y1="24" x2="3" y2="24" stroke="${c}" stroke-width="1.5"/>`;
      inner += td(0, -32);
      break;
    }
    case 'separator_mt': {
      inner = `<rect class="sel-r" x="-54" y="-26" width="108" height="52" fill="${bg}" stroke="${c}" stroke-width="2.5" rx="4"/><line x1="-54" y1="0" x2="-22" y2="0" stroke="${c}" stroke-width="2"/><line x1="22" y1="0" x2="54" y2="0" stroke="${c}" stroke-width="2"/><circle cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2"/>`;
      inner += td(-54, 0) + td(54, 0);
      break;
    }
    case 'separator': {
      inner = `<rect class="sel-r" x="-52" y="-24" width="104" height="48" fill="${bg !== 'none' ? bg : 'none'}" stroke="transparent" rx="6"/><circle cx="-36" cy="0" r="6" fill="none" stroke="${c}" stroke-width="2"/><circle cx="36" cy="0" r="6" fill="none" stroke="${c}" stroke-width="2"/><line x1="-30" y1="0" x2="30" y2="0" stroke="${c}" stroke-width="2"/><line x1="-36" y1="0" x2="-52" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="36" y1="0" x2="52" y2="0" stroke="${c}" stroke-width="2.5"/>`;
      inner += td(-52, 0) + td(52, 0);
      break;
    }
    case 'manson': {
      inner = `<polygon class="sel-r" points="0,-22 22,0 0,22 -22,0" fill="${bg !== 'none' ? bg : c}" stroke="${c}" stroke-width="1.5"/><line x1="-38" y1="0" x2="-22" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="22" y1="0" x2="38" y2="0" stroke="${c}" stroke-width="2.5"/>`;
      inner += td(-38, 0) + td(38, 0);
      break;
    }
    case 'bara_mt': {
      const BW = 200, BH = 20;
      inner = `<rect class="sel-r" x="${-BW/2 - 10}" y="${-BH/2 - 10}" width="${BW + 20}" height="${BH + 20}" fill="none" stroke="transparent"/>`;
      inner += `<rect x="${-BW/2}" y="-4" width="${BW}" height="8" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/>`;
      inner += `<text x="0" y="-12" text-anchor="middle" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">20kV</text>`;
      inner += td(-BW / 2, 0) + td(0, 0) + td(BW / 2, 0);
      break;
    }
    case 'celula_linie_mt': {
      const CW = 70, CH = 220;
      const cData = el.celMT || { tensiune: '20kV', curent: '400A', stare_disj: true, stare_sep: true };
      const disj_on = cData.stare_disj !== false;
      const sep_on = cData.stare_sep !== false;
      inner = `<rect class="sel-r" x="${-CW/2}" y="${-CH/2}" width="${CW}" height="${CH}" fill="none" stroke="transparent"/>`;
      inner += `<rect x="${-CW/2}" y="${-CH/2}" width="${CW}" height="${CH}" fill="${bg}" stroke="${c}" stroke-width="1.5" rx="2"/>`;
      inner += `<line x1="0" y1="${-CH/2}" x2="0" y2="${-65 - 18}" stroke="${c}" stroke-width="2"/>`;
      const dY = -65;
      inner += `<line x1="0" y1="${-CH/2}" x2="0" y2="${dY - 18}" stroke="${c}" stroke-width="2"/>`;
      inner += `<rect x="-14" y="${dY - 18}" width="28" height="36" fill="${bg}" stroke="${c}" stroke-width="1.8" rx="1"/>`;
      const dColor = disj_on ? '#22c55e' : '#ef4444';
      if (disj_on) {
        inner += `<line x1="0" y1="${dY - 12}" x2="0" y2="${dY + 12}" stroke="${dColor}" stroke-width="3"/>`;
      } else {
        inner += `<line x1="-6" y1="${dY}" x2="6" y2="${dY}" stroke="${dColor}" stroke-width="3"/>`;
      }
      inner += `<text x="17" y="${dY + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData.curent || '400A'}</text>`;
      inner += `<line x1="0" y1="${dY + 18}" x2="0" y2="${-20}" stroke="${c}" stroke-width="2"/>`;
      const sY = 20;
      inner += `<line x1="0" y1="${-20}" x2="0" y2="${sY - 14}" stroke="${c}" stroke-width="2"/>`;
      inner += `<circle cx="0" cy="${sY - 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      inner += `<circle cx="0" cy="${sY + 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      const sColor = sep_on ? c : '#ef4444';
      if (sep_on) {
        inner += `<line x1="0" y1="${sY - 11}" x2="0" y2="${sY + 11}" stroke="${sColor}" stroke-width="2.5"/>`;
      } else {
        inner += `<line x1="-5" y1="${sY}" x2="5" y2="${sY}" stroke="${sColor}" stroke-width="2.5"/>`;
      }
      const fY = 65;
      inner += `<line x1="0" y1="${sY + 14}" x2="0" y2="${fY - 10}" stroke="${c}" stroke-width="2"/>`;
      inner += `<rect x="-10" y="${fY - 10}" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5" rx="1"/>`;
      inner += `<line x1="-6" y1="${fY}" x2="6" y2="${fY}" stroke="#22c55e" stroke-width="2.5"/>`;
      inner += `<circle cx="-8" cy="${fY}" r="3" fill="#22c55e" stroke="none"/>`;
      inner += `<text x="14" y="${fY + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">HRC</text>`;
      inner += `<line x1="0" y1="${fY + 10}" x2="0" y2="${CH/2}" stroke="${c}" stroke-width="2"/>`;
      inner += `<polygon points="0,${CH/2} -5,${CH/2 - 10} 5,${CH/2 - 10}" fill="${c}"/>`;
      inner += `<text x="0" y="${-CH/2 - 6}" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cData.tensiune || '20kV'}</text>`;
      inner += td(0, -CH / 2) + td(0, CH / 2) + td(-CW / 2, dY) + td(CW / 2, dY);
      break;
    }
    case 'celula_trafo_mt': {
      const CW = 80, CH = 280;
      const cData = el.celMT || { tensiune: '20kV', curent: '16A', putere: '100kVA', volt: '20/0.4kV', stare_disj: true };
      const disj_on = cData.stare_disj !== false;
      inner = `<rect class="sel-r" x="${-CW/2}" y="${-CH/2}" width="${CW}" height="${CH}" fill="none" stroke="transparent"/>`;
      inner += `<rect x="${-CW/2}" y="${-CH/2}" width="${CW}" height="${CH}" fill="${bg}" stroke="${c}" stroke-width="1.5" rx="2"/>`;
      const dY = -90;
      inner += `<line x1="0" y1="${-CH/2}" x2="0" y2="${dY - 18}" stroke="${c}" stroke-width="2"/>`;
      inner += `<rect x="-14" y="${dY - 18}" width="28" height="36" fill="${bg}" stroke="${c}" stroke-width="1.8" rx="1"/>`;
      const dColor = disj_on ? '#22c55e' : '#ef4444';
      if (disj_on) {
        inner += `<line x1="0" y1="${dY - 12}" x2="0" y2="${dY + 12}" stroke="${dColor}" stroke-width="3"/>`;
      } else {
        inner += `<line x1="-6" y1="${dY}" x2="6" y2="${dY}" stroke="${dColor}" stroke-width="3"/>`;
      }
      inner += `<text x="17" y="${dY + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData.curent || '16A'}</text>`;
      const sY = -20;
      inner += `<line x1="0" y1="${dY + 18}" x2="0" y2="${sY - 14}" stroke="${c}" stroke-width="2"/>`;
      inner += `<circle cx="0" cy="${sY - 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      inner += `<circle cx="0" cy="${sY + 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      inner += `<line x1="0" y1="${sY - 11}" x2="0" y2="${sY + 11}" stroke="${c}" stroke-width="2.5"/>`;
      const fY = 30;
      inner += `<line x1="0" y1="${sY + 14}" x2="0" y2="${fY - 10}" stroke="${c}" stroke-width="2"/>`;
      inner += `<rect x="-10" y="${fY - 10}" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5" rx="1"/>`;
      inner += `<line x1="-6" y1="${fY}" x2="6" y2="${fY}" stroke="#22c55e" stroke-width="2.5"/>`;
      inner += `<circle cx="-8" cy="${fY}" r="3" fill="#22c55e" stroke="none"/>`;
      inner += `<text x="14" y="${fY + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">HRC</text>`;
      const tY = 95;
      inner += `<line x1="0" y1="${fY + 10}" x2="0" y2="${tY - 35}" stroke="${c}" stroke-width="2"/>`;
      inner += `<circle cx="0" cy="${tY - 22}" r="16" fill="${bg}" stroke="${c}" stroke-width="1.8"/>`;
      inner += `<circle cx="0" cy="${tY + 2}" r="16" fill="${bg}" stroke="${c}" stroke-width="1.8"/>`;
      inner += `<text x="${CW / 2 - 2}" y="${tY - 20}" text-anchor="end" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData.putere || '100kVA'}</text>`;
      inner += `<text x="${CW / 2 - 2}" y="${tY - 10}" text-anchor="end" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData.volt || '20/0.4kV'}</text>`;
      inner += `<line x1="0" y1="${tY + 30}" x2="0" y2="${CH/2}" stroke="${c}" stroke-width="2"/>`;
      inner += `<polygon points="0,${CH/2} -5,${CH/2 - 10} 5,${CH/2 - 10}" fill="${c}"/>`;
      inner += `<text x="0" y="${-CH/2 - 6}" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cData.tensiune || '20kV'}</text>`;
      inner += td(0, -CH / 2) + td(0, CH / 2) + td(-CW / 2, dY) + td(CW / 2, dY);
      break;
    }
    case 'bara_statie_mt': {
      const lung = el.lungime || 200;
      const nrC = el.nrCircuit || '2';
      const numeSt = el.numeStatie || 'STAȚIE 20kV';
      const HB = lung, BW = 8;
      const LX = -BW / 2, BY2 = -HB / 2;
      const inputY = 0;
      inner = `<rect class="sel-r" x="${LX - 22}" y="${BY2}" width="${BW + 80}" height="${HB}" fill="transparent" stroke="transparent"/>`;
      inner += `<rect x="${LX}" y="${BY2}" width="${BW}" height="${HB}" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/>`;
      inner += `<polygon points="${LX},${BY2 - 16} ${LX - 9},${BY2} ${LX + 9},${BY2}" fill="${c}"/>`;
      inner += `<text x="${LX - 7}" y="7" text-anchor="end" font-size="24" font-weight="800" fill="${c}" font-family="Barlow Condensed,sans-serif">${nrC}</text>`;
      inner += `<text x="0" y="${BY2 - 24}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${numeSt}</text>`;
      const terminale = el.terminale || [{ pct: 25, label: '' }, { pct: 50, label: '' }, { pct: 75, label: '' }];
      inner += `<line x1="${LX}" y1="${inputY}" x2="${LX - FW}" y2="${inputY}" stroke="${c}" stroke-width="2"/>`;
      inner += fuse(LX - FW, inputY, FW, FH, true);
      inner += `<circle class="td" data-lcx="${LX}" data-lcy="${inputY}" data-circuit="0" cx="${LX}" cy="${inputY}" r="7" stroke="transparent" fill="transparent"/>`;
      terms.push({ cx: LX, cy: inputY });
      for (let i = 0; i < terminale.length; i++) {
        const ter = terminale[i];
        const pct = Math.max(0, Math.min(100, ter.pct || 0));
        const dy = BY2 + (pct / 100) * HB;
        inner += `<line x1="${LX}" y1="${dy}" x2="${LX + 18}" y2="${dy}" stroke="${c}" stroke-width="2"/>`;
        inner += fuse(LX + 18, dy, FW, FH, true);
        inner += `<line x1="${LX + 18 + FW}" y1="${dy}" x2="${LX + BW}" y2="${dy}" stroke="${c}" stroke-width="2" stroke-dasharray="none"/>`;
        inner += `<text x="${LX + BW - 6}" y="${dy + 11}" text-anchor="end" font-size="8" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none">C${i + 1}</text>`;
        inner += `<circle class="td" data-lcx="${LX + BW}" data-lcy="${dy}" data-circuit="${i + 1}" cx="${LX + BW}" cy="${dy}" r="7" stroke="transparent" fill="transparent"/>`;
        terms.push({ cx: LX + BW, cy: dy, circuit: i + 1 });
      }
      break;
    }
  }
  return { inner, terms };
}

// (duplicate removed - symW and symH are defined above)
