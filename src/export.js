import { S } from './state.js';
import { symW, symH } from './elements.js';
import { render, getSvgEl } from './renderer.js';
import { setMode, toast } from './utils.js';
import { generateVDTableSVG } from './ui.js';

export function getProjectBounds() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const hasSelection = S.sel !== null || S.multiSel.size > 0;
  if (hasSelection) {
    S.EL.forEach(el => {
      if (el.id === S.sel || S.multiSel.has(el.id)) {
        if (el.type === 'polyline') {
          el.points.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
        } else {
          const sc = el.scale || 1, wBox = symW(el) * sc / 2 + 40, hBox = symH(el) * sc / 2 + 40;
          minX = Math.min(minX, el.x - wBox); minY = Math.min(minY, el.y - hBox); maxX = Math.max(maxX, el.x + wBox); maxY = Math.max(maxY, el.y + hBox);
        }
      }
    });
    S.CN.forEach(cn => {
      if (cn.id === S.sel || S.multiSel.has(cn.id)) {
        cn.path.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
      }
    });
    if (minX !== Infinity) return { minX, minY, maxX, maxY, isSelection: true };
  }
  if (S.bgData && S.bgData.url) return { minX: S.bgData.x, minY: S.bgData.y, maxX: S.bgData.x + S.bgData.w, maxY: S.bgData.y + S.bgData.h, isBg: true };
  if (S.EL.length === 0 && S.CN.length === 0) return null;
  S.EL.forEach(el => {
    if (el.type === 'polyline') {
      el.points.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    } else {
      const sc = el.scale || 1, wBox = symW(el) * sc / 2 + 40, hBox = symH(el) * sc / 2 + 40;
      minX = Math.min(minX, el.x - wBox); minY = Math.min(minY, el.y - hBox); maxX = Math.max(maxX, el.x + wBox); maxY = Math.max(maxY, el.y + hBox);
    }
  });
  S.CN.forEach(cn => {
    cn.path.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
  });
  if (minX === Infinity) return null;
  return { minX, minY, maxX, maxY };
}

export function startExport(type) {
  if (S.EL.length === 0 && S.CN.length === 0 && !S.bgData.url) { toast('Planșă goală!', 'w'); return; }
  if (type === 'dxf') { doExportDXF(null); return; }
  if (type === 'pdf') { doExportPDF(null); return; }
  toast(`Se procesează exportul ${type.toUpperCase()}...`, 'ac');
  setMode('select');
  setTimeout(() => {
    if (type === 'png') doExportPNG(null);
    if (type === 'svg') doExportSVG(null);
  }, 100);
}

function resolveCSSVars(svgNode) {
  const cs = getComputedStyle(document.documentElement);
  const vars = {};
  ['--bg','--bg2','--bg3','--panel','--panel2','--border','--border2',
   '--accent','--accentg','--warn','--danger','--text','--text2','--text3',
   '--cvs','--shadow','--glow'].forEach(v => { vars[v] = cs.getPropertyValue(v).trim(); });
  function resolveNode(node) {
    if (node.nodeType !== 1) return;
    ['fill','stroke','color','stop-color'].forEach(attr => {
      const val = node.getAttribute(attr);
      if (val && val.includes('var(')) node.setAttribute(attr, val.replace(/var\((--[\w-]+)[^)]*\)/g, (m, vn) => vars[vn] || m));
    });
    const style = node.getAttribute('style');
    if (style && style.includes('var(')) node.setAttribute('style', style.replace(/var\((--[\w-]+)[^)]*\)/g, (m, vn) => vars[vn] || m));
    Array.from(node.childNodes).forEach(resolveNode);
  }
  resolveNode(svgNode);
}

function inlineStyles(svgNode) {
  const isLight = S.lightMode;
  const bgCol = isLight ? '#ffffff' : '#0b1220';
  const textCol = isLight ? '#1a2740' : '#dce8f5';

  svgNode.querySelectorAll('.td, .hb, .ph').forEach(el => el.remove());
  svgNode.querySelectorAll('[data-lcx]').forEach(el => el.remove());
  svgNode.querySelectorAll('.sel-r').forEach(el => {
    el.removeAttribute('class');
    if (el.getAttribute('fill') === 'transparent') el.setAttribute('fill', 'none');
    if (el.getAttribute('stroke') === 'transparent') el.setAttribute('stroke', 'none');
  });
  ['#sel-rect','#export-rect','#tpoly','#GL','#TL'].forEach(id => { svgNode.querySelector(id)?.remove(); });
  if (!S.vdOverlayOn) svgNode.querySelector('#VD-OVL')?.remove();

  function fixRgba(node) {
    if (node.nodeType !== 1) return;
    ['fill','stroke'].forEach(attr => {
      const val = node.getAttribute(attr);
      if (val && val.startsWith('rgba(')) {
        const m = val.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (m) {
          const hex = '#' + [m[1],m[2],m[3]].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
          node.setAttribute(attr, hex);
          node.setAttribute(attr === 'fill' ? 'fill-opacity' : 'stroke-opacity', parseFloat(m[4]).toFixed(3));
        }
      }
    });
    Array.from(node.childNodes).forEach(fixRgba);
  }
  fixRgba(svgNode);

  svgNode.querySelectorAll('[display="none"]').forEach(el => el.remove());
  svgNode.querySelectorAll('[fill="transparent"]').forEach(el => el.setAttribute('fill','none'));
  svgNode.querySelectorAll('[stroke="transparent"]').forEach(el => el.setAttribute('stroke','none'));
  svgNode.querySelectorAll('.el-lbl').forEach(el => {
    el.removeAttribute('class');
    el.setAttribute('paint-order','stroke fill');
    el.setAttribute('stroke', bgCol);
    el.setAttribute('stroke-width','3.5');
    el.setAttribute('stroke-linecap','round');
    el.setAttribute('stroke-linejoin','round');
    if (!el.getAttribute('fill')) el.setAttribute('fill', textCol);
  });
  svgNode.querySelectorAll('.cl').forEach(el => {
    el.removeAttribute('class');
    el.setAttribute('stroke-linecap','round');
    el.setAttribute('stroke-linejoin','round');
  });
  svgNode.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
  svgNode.querySelectorAll('[pointer-events]').forEach(el => el.removeAttribute('pointer-events'));
  svgNode.querySelectorAll('[cursor]').forEach(el => el.removeAttribute('cursor'));
  svgNode.querySelectorAll('[data-eid]').forEach(el => el.removeAttribute('data-eid'));
  svgNode.querySelectorAll('[data-circuit]').forEach(el => el.removeAttribute('data-circuit'));
}

function _getDxfBounds() {
  const dd = S.dxfData;
  if (!dd || !dd.allEntities || !dd.allEntities.length) return null;
  const { allEntities, bcx, bcy, bscale } = dd;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const e of allEntities) {
    const pts = e.t === 'L' ? [[e.x0, e.y0], [e.x1, e.y1]]
              : e.t === 'P' ? (e.verts || []).map(v => [v.x, v.y])
              : (e.t === 'C' || e.t === 'A') ? [[e.cx - e.r, e.cy], [e.cx + e.r, e.cy], [e.cx, e.cy - e.r], [e.cx, e.cy + e.r]]
              : [];
    for (const [dx, dy] of pts) {
      const cx = (dx - bcx) * bscale, cy = (bcy - dy) * bscale;
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
    }
  }
  return minX === Infinity ? null : { minX, minY, maxX, maxY };
}

export function buildExportSVG(forSVGExport = false, customBounds = null) {
  const prevSel = S.sel; S.sel = null;
  const prevMulti = new Set(S.multiSel); S.multiSel.clear(); render();
  let bounds = customBounds || getProjectBounds();
  if (!customBounds) {
    const dxfB = _getDxfBounds();
    if (dxfB) {
      if (!bounds) bounds = dxfB;
      else { bounds = { minX: Math.min(bounds.minX, dxfB.minX), minY: Math.min(bounds.minY, dxfB.minY), maxX: Math.max(bounds.maxX, dxfB.maxX), maxY: Math.max(bounds.maxY, dxfB.maxY), isBg: bounds.isBg }; }
    }
  }
  const cbExportTable = document.getElementById('vd-export-table');
  const includeTable = cbExportTable && cbExportTable.checked && S.vdResults;
  let tableData = { svg: '', w: 0, h: 0 };

  if (includeTable && bounds) {
    let tableX = bounds.minX, tableY = bounds.maxY + 40;
    tableData = generateVDTableSVG(tableX, tableY);
    if (tableData.h > 0) bounds = { minX: bounds.minX, minY: bounds.minY, maxX: Math.max(bounds.maxX, tableX + tableData.w), maxY: Math.max(bounds.maxY, tableY + tableData.h), isBg: bounds.isBg };
  }

  let W, H, vX, vY, pad = customBounds ? 0 : 60;
  if (bounds) {
    if (bounds.isBg && !customBounds && !includeTable) pad = 0;
    vX = bounds.minX - pad; vY = bounds.minY - pad;
    W = (bounds.maxX - bounds.minX) + pad * 2; H = (bounds.maxY - bounds.minY) + pad * 2;
  } else {
    const cw = document.getElementById('cw'); W = cw.clientWidth; H = cw.clientHeight; vX = 0; vY = 0;
  }

  const svgEl = getSvgEl();
  const clone = svgEl.cloneNode(true), vpClone = clone.querySelector('#VP');
  if (vpClone) vpClone.setAttribute('transform', 'translate(0,0) scale(1)');

  resolveCSSVars(clone);
  inlineStyles(clone);

  const bgColor = S.lightMode ? '#ffffff' : '#0b1220';
  const bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
  bg.setAttribute('x', vX); bg.setAttribute('y', vY);
  bg.setAttribute('width', W); bg.setAttribute('height', H);
  bg.setAttribute('fill', bgColor);
  clone.insertBefore(bg, clone.firstChild);

  if (S.bgData.url) {
    const bgImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    bgImg.setAttribute('href', S.bgData.url);
    bgImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', S.bgData.url);
    bgImg.setAttribute('x', S.bgData.x); bgImg.setAttribute('y', S.bgData.y);
    bgImg.setAttribute('width', S.bgData.w); bgImg.setAttribute('height', S.bgData.h);
    bgImg.setAttribute('opacity', S.bgData.op);
    const bgGroup = clone.querySelector('#BG') || (vpClone || clone);
    bgGroup.insertBefore(bgImg, bgGroup.firstChild);
  }

  if (tableData.svg && vpClone) vpClone.innerHTML += tableData.svg;

  const wm = document.createElementNS('http://www.w3.org/2000/svg','text');
  wm.setAttribute('x', vX + W - 15); wm.setAttribute('y', vY + H - 15);
  wm.setAttribute('text-anchor','end');
  wm.setAttribute('font-family','Arial, sans-serif');
  wm.setAttribute('font-size','11');
  wm.setAttribute('font-weight','bold');
  wm.setAttribute('fill', S.lightMode ? '#888888' : '#3d5a78');
  wm.textContent = '© Made by Grigoriu Alin-Florin';
  clone.appendChild(wm);

  clone.setAttribute('width', W); clone.setAttribute('height', H);
  clone.setAttribute('viewBox', `${vX} ${vY} ${W} ${H}`);
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');

  const style = document.createElementNS('http://www.w3.org/2000/svg','style');
  style.textContent = 'text { font-family: Arial, "Helvetica Neue", sans-serif; } .cl { stroke-linecap: round; stroke-linejoin: round; }';
  clone.insertBefore(style, clone.firstChild);

  S.sel = prevSel; prevMulti.forEach(id => S.multiSel.add(id)); render();
  return { svgStr: new XMLSerializer().serializeToString(clone), W, H, vX, vY };
}

export function renderToCanvas(svgStr, W, H, vX, vY, scale, bgColor) {
  return new Promise((resolve, reject) => {
    const ca = document.createElement('canvas');
    ca.width = W * scale; ca.height = H * scale;
    const ctx = ca.getContext('2d'); ctx.fillStyle = bgColor; ctx.fillRect(0, 0, ca.width, ca.height);
    const drawSVG = () => {
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, ca.width, ca.height); resolve(ca); };
      img.onerror = () => { reject(new Error('Eroare la randare grafică')); };
      img.src = url;
    };
    if (S.bgData.url) {
      const bgI = new Image();
      bgI.onload = () => { ctx.globalAlpha = S.bgData.op; ctx.drawImage(bgI, (S.bgData.x - vX) * scale, (S.bgData.y - vY) * scale, S.bgData.w * scale, S.bgData.h * scale); ctx.globalAlpha = 1.0; drawSVG(); };
      bgI.onerror = drawSVG; bgI.src = S.bgData.url;
    } else drawSVG();
  });
}

export async function doExportPNG(customBounds) {
  try {
    const { svgStr, W, H, vX, vY } = buildExportSVG(false, customBounds);
    const scale = Math.min(4, 15000 / Math.max(W, H));
    const bg = S.lightMode ? '#ffffff' : '#0b1220';
    const ca = await renderToCanvas(svgStr, W, H, vX, vY, scale, bg);
    const a = document.createElement('a'); a.href = ca.toDataURL('image/png'); a.download = 'schema_electrica_HD.png'; a.click();
    toast('PNG HD exportat!', 'ok');
  } catch (err) { console.error(err); toast('Eroare export PNG: ' + err.message, 'ac'); }
}

export function doExportSVG(customBounds) {
  try {
    const { svgStr } = buildExportSVG(true, customBounds);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'schema_electrica_Vectorial.svg'; a.click(); URL.revokeObjectURL(url);
    toast('SVG Vectorial exportat cu succes!', 'ok');
  } catch (err) { console.error(err); toast('Eroare export SVG: ' + err.message, 'ac'); }
}

export function doExportPDF(customBounds) {
  toast('⏳ Generez PDF vectorial...', 'ac');
  setTimeout(async () => {
    try {
      if (!window.jspdf) { toast('jsPDF indisponibil.', 'ac'); return; }
      const { jsPDF } = window.jspdf;
      const { svgStr, W, H } = buildExportSVG(true, customBounds);
      const PX_TO_PT = 0.75;
      let pageW = W * PX_TO_PT, pageH = H * PX_TO_PT;
      const MAX_PT = 5080;
      if (pageW > MAX_PT || pageH > MAX_PT) { const f = MAX_PT / Math.max(pageW, pageH); pageW *= f; pageH *= f; }
      const parser = new DOMParser();
      const svgEl = parser.parseFromString(svgStr, 'image/svg+xml').documentElement;
      const orient = pageW >= pageH ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ orientation: orient, unit: 'pt', format: [pageW, pageH], compress: true });
      const _svg2pdfFn = typeof pdf.svg === 'function' ? ((el, p, o) => p.svg(el, o))
                       : window.svg2pdf && typeof window.svg2pdf.svg2pdf === 'function' ? ((el, p, o) => window.svg2pdf.svg2pdf(el, p, o))
                       : typeof window.svg2pdf === 'function' ? window.svg2pdf
                       : null;
      if (!_svg2pdfFn) { toast('svg2pdf indisponibil.', 'ac'); return; }
      await _svg2pdfFn(svgEl, pdf, { x: 0, y: 0, width: pageW, height: pageH });
      let tot = 0; S.CN.forEach(c => tot += parseFloat(c.length) || 0);
      pdf.setFontSize(5); pdf.setTextColor(150);
      pdf.text(`ElectroCAD Pro v12  |  (c) Grigoriu Alin-Florin  |  ${new Date().toLocaleDateString('ro-RO')}  |  ${S.EL.length} elem  ${S.CN.length} conn  ${tot.toFixed(1)}m`, 4, pageH - 3);
      pdf.save('schema_electrica.pdf');
      toast('✅ PDF Vectorial exportat!', 'ok');
    } catch (err) { console.error('PDF error:', err); toast('Eroare PDF: ' + err.message, 'ac'); }
  }, 50);
}

export function doExportDXF(customBounds) {
  toast('⏳ Generez DXF pentru AutoCAD...', 'ac');
  try {
    const bounds = customBounds || getProjectBounds();
    const offX = bounds ? bounds.minX - 50 : 0;
    const offY = bounds ? bounds.minY - 50 : 0;
    const maxY = bounds ? bounds.maxY + 50 : 1000;
    const dxf_dx = x => parseFloat(((x - offX) * 0.1).toFixed(4));
    const dxf_dy = y => parseFloat(((maxY - y - offY) * 0.1).toFixed(4));
    let dxf = '';

    dxf += '0\nSECTION\n2\nHEADER\n';
    dxf += '9\n$ACADVER\n1\nAC1015\n9\n$INSUNITS\n70\n6\n9\n$MEASUREMENT\n70\n1\n9\n$EXTMIN\n10\n0\n20\n0\n30\n0\n';
    dxf += `9\n$EXTMAX\n10\n${dxf_dx((bounds?.maxX||1000)+50)}\n20\n${dxf_dy((bounds?.minY||0)-50)}\n30\n0\n`;
    dxf += '0\nENDSEC\n';

    dxf += '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n10\n';
    [{ name:'ELEMENTE',color:5 },{ name:'CABLURI_LEA',color:1 },{ name:'CABLURI_LES',color:3 },
     { name:'ETICHETE',color:7 },{ name:'PTAB_MT',color:4 },{ name:'PTAB_JT',color:2 },
     { name:'STALPI',color:6 },{ name:'FIRIDE',color:30 },{ name:'CADERE_U',color:1 },{ name:'SCHEMA_MT',color:40 }
    ].forEach(l => { dxf += `0\nLAYER\n2\n${l.name}\n70\n0\n62\n${l.color}\n6\nCONTINUOUS\n`; });
    dxf += '0\nENDTABLE\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';

    const dxfLine = (x1,y1,x2,y2,layer,ltype) => `0\nLINE\n8\n${layer}\n${ltype?'6\n'+ltype+'\n':''}10\n${dxf_dx(x1)}\n20\n${dxf_dy(y1)}\n11\n${dxf_dx(x2)}\n21\n${dxf_dy(y2)}\n`;
    const dxfText = (x,y,txt,layer,h=1.5) => { const s = String(txt||'').replace(/ă/g,'a').replace(/â/g,'a').replace(/î/g,'i').replace(/ș/g,'s').replace(/ț/g,'t').replace(/Ă/g,'A').replace(/Â/g,'A').replace(/Î/g,'I').replace(/Ș/g,'S').replace(/Ț/g,'T'); return `0\nTEXT\n8\n${layer}\n10\n${dxf_dx(x)}\n20\n${dxf_dy(y)}\n40\n${h}\n1\n${s}\n`; };
    const dxfPoly = (pts,layer,ltype) => { if(pts.length<2) return ''; let s=`0\nLWPOLYLINE\n8\n${layer}\n${ltype?'6\n'+ltype+'\n':''}70\n0\n90\n${pts.length}\n`; pts.forEach(p=>{s+=`10\n${dxf_dx(p.x)}\n20\n${dxf_dy(p.y)}\n`;}); return s; };
    const dxfCircle = (cx,cy,r,layer) => `0\nCIRCLE\n8\n${layer}\n10\n${dxf_dx(cx)}\n20\n${dxf_dy(cy)}\n40\n${(r*0.1).toFixed(4)}\n`;
    const dxfRect = (x,y,w,h,layer) => dxfLine(x,y,x+w,y,layer)+dxfLine(x+w,y,x+w,y+h,layer)+dxfLine(x+w,y+h,x,y+h,layer)+dxfLine(x,y+h,x,y,layer);

    S.CN.forEach(cn => {
      if (cn.path.length < 2) return;
      const isS = cn.lineType === 'dashed';
      dxf += dxfPoly(cn.path, isS ? 'CABLURI_LES' : 'CABLURI_LEA', isS ? 'DASHED' : '');
      let maxL = -1, bp1 = cn.path[0], bp2 = cn.path[1];
      for (let i = 0; i < cn.path.length-1; i++) { const d2 = Math.hypot(cn.path[i+1].x-cn.path[i].x, cn.path[i+1].y-cn.path[i].y); if(d2>maxL){maxL=d2;bp1=cn.path[i];bp2=cn.path[i+1];} }
      const mx = (bp1.x+bp2.x)/2, my = (bp1.y+bp2.y)/2;
      dxf += dxfText(mx, my-8, `${cn.label||''} L=${cn.length||0}m ${cn.sectiune||''}mm2`, 'ETICHETE', 1.0);
    });

    S.EL.forEach(el => {
      const x=el.x, y=el.y, sc=el.scale||1, rot=(el.rotation||0)*Math.PI/180;
      const rp = (lx,ly) => ({ x: x+(lx*sc)*Math.cos(rot)-(ly*sc)*Math.sin(rot), y: y+(lx*sc)*Math.sin(rot)+(ly*sc)*Math.cos(rot) });
      if (el.label) dxf += dxfText(x+5, y-symH(el)/2*sc-8, el.label, 'ETICHETE', 1.5);
      switch (el.type) {
        case 'ptab_1t': case 'ptab_2t': {
          const W2=symW(el)*sc/2, H2=symH(el)*sc/2;
          dxf += dxfRect(x-W2,y-H2,W2*2,H2*2,'PTAB_MT');
          dxf += dxfLine(x-W2+20*sc,y-H2+30*sc,x+W2-20*sc,y-H2+30*sc,'PTAB_MT');
          dxf += dxfText(x,y,el.type==='ptab_2t'?'PTAB 2T':'PTAB 1T','PTAB_MT',3);
          break;
        }
        case 'trafo': {
          dxf += dxfCircle(x-15*sc,y,30*sc,'PTAB_JT');
          dxf += dxfCircle(x+15*sc,y,30*sc,'PTAB_JT');
          dxf += dxfText(x,y+50*sc,(el.trText?.power)||'160kVA','PTAB_JT',2);
          break;
        }
        case 'stalp_se4': case 'stalp_se10': case 'stalp_cs':
        case 'stalp_rotund': case 'stalp_rotund_special': {
          const s=22*sc;
          if (el.type==='stalp_rotund'||el.type==='stalp_rotund_special') {
            dxf += dxfCircle(x,y,s,'STALPI');
            if (el.type==='stalp_rotund_special') { const a=rp(-16,-16),b=rp(16,16),c2=rp(16,-16),d2=rp(-16,16); dxf+=dxfLine(a.x,a.y,b.x,b.y,'STALPI'); dxf+=dxfLine(c2.x,c2.y,d2.x,d2.y,'STALPI'); }
          } else {
            const c1=rp(-s,-s),c2=rp(s,-s),c3=rp(s,s),c4=rp(-s,s);
            dxf+=dxfLine(c1.x,c1.y,c2.x,c2.y,'STALPI')+dxfLine(c2.x,c2.y,c3.x,c3.y,'STALPI')+dxfLine(c3.x,c3.y,c4.x,c4.y,'STALPI')+dxfLine(c4.x,c4.y,c1.x,c1.y,'STALPI');
            if (el.type!=='stalp_se4') { dxf+=dxfLine(c1.x,c1.y,c3.x,c3.y,'STALPI'); dxf+=dxfLine(c2.x,c2.y,c4.x,c4.y,'STALPI'); }
          }
          if (el.nod) dxf += dxfText(x+s+3,y+s/2+8,'['+el.nod.toUpperCase()+']','ETICHETE',1.0);
          break;
        }
        case 'firida_e2_4': case 'firida_e3_4': case 'firida_e3_0': {
          const W2=symW(el)*sc/2, H2=symH(el)*sc/2;
          dxf+=dxfRect(x-W2,y-H2,W2*2,H2*2,'FIRIDE');
          dxf+=dxfLine(x-W2,y-H2+20*sc,x+W2,y-H2+20*sc,'FIRIDE');
          break;
        }
        case 'cd4': case 'cd5': case 'cd8': {
          const W2=symW(el)*sc/2, H2=symH(el)*sc/2;
          dxf+=dxfRect(x-W2,y-H2,W2*2,H2*2,'ELEMENTE');
          dxf+=dxfLine(x-W2+30*sc,y-H2,x-W2+30*sc,y+H2,'ELEMENTE');
          break;
        }
        case 'separator': case 'separator_mt':
          dxf+=dxfLine(rp(-52,0).x,rp(-52,0).y,rp(-22,0).x,rp(-22,0).y,'ELEMENTE');
          dxf+=dxfLine(rp(22,0).x,rp(22,0).y,rp(52,0).x,rp(52,0).y,'ELEMENTE');
          dxf+=dxfCircle(x,y,22*sc,'ELEMENTE');
          break;
        case 'manson': {
          const pts=[rp(0,-22),rp(22,0),rp(0,22),rp(-22,0),rp(0,-22)];
          dxf+=dxfPoly(pts,'ELEMENTE','');
          dxf+=dxfLine(rp(-38,0).x,rp(-38,0).y,rp(-22,0).x,rp(-22,0).y,'ELEMENTE');
          dxf+=dxfLine(rp(22,0).x,rp(22,0).y,rp(38,0).x,rp(38,0).y,'ELEMENTE');
          break;
        }
        case 'priza_pamant':
          dxf+=dxfLine(x,y-32*sc,x,y,'ELEMENTE');
          dxf+=dxfLine(x-22*sc,y,x+22*sc,y,'ELEMENTE');
          dxf+=dxfLine(x-15*sc,y+8*sc,x+15*sc,y+8*sc,'ELEMENTE');
          dxf+=dxfLine(x-8*sc,y+16*sc,x+8*sc,y+16*sc,'ELEMENTE');
          break;
        case 'meter':
          dxf+=dxfRect(x-35*sc,y-48*sc,70*sc,96*sc,'ELEMENTE');
          dxf+=dxfText(x,y+5,el.bmptText||'BMPT','ETICHETE',2);
          break;
        case 'rect': { const W2=(el.width||100)*sc/2, H2=(el.height||100)*sc/2; dxf+=dxfRect(x-W2,y-H2,W2*2,H2*2,'ELEMENTE'); break; }
        case 'circle': dxf+=dxfCircle(x,y,(el.r||50)*sc,'ELEMENTE'); break;
        case 'text': dxf+=dxfText(x,y,el.label||'','ETICHETE',(el.fontSize||14)*0.1); break;
        case 'polyline': if(el.points&&el.points.length>=2) dxf+=dxfPoly(el.points,'ELEMENTE',''); break;
        case 'bara_mt': { const BW2=100*sc; dxf+=dxfLine(x-BW2,y,x+BW2,y,'SCHEMA_MT'); dxf+=dxfText(x,y-8*sc,'20kV','SCHEMA_MT',1.5); break; }
        case 'ptab_mono': {
          const celule2=el.celule||[], CW2=72*sc, CH2=260*sc, BAR_Y2=y-130*sc;
          const totalW2=celule2.length*CW2, startX2=x-totalW2/2;
          dxf+=dxfLine(startX2,BAR_Y2,startX2+totalW2,BAR_Y2,'SCHEMA_MT');
          dxf+=dxfText(x,BAR_Y2-10*sc,'BARA 20kV','SCHEMA_MT',2);
          dxf+=dxfRect(startX2,BAR_Y2,totalW2,CH2,'SCHEMA_MT');
          celule2.forEach((cel2,i)=>{ const cx2=startX2+i*CW2+CW2/2; dxf+=dxfRect(startX2+i*CW2,BAR_Y2,CW2,CH2,'SCHEMA_MT'); dxf+=dxfRect(cx2-13*sc,BAR_Y2+22*sc,26*sc,36*sc,'SCHEMA_MT'); dxf+=dxfCircle(cx2,BAR_Y2+84*sc,4*sc,'SCHEMA_MT'); dxf+=dxfCircle(cx2,BAR_Y2+104*sc,4*sc,'SCHEMA_MT'); dxf+=dxfRect(cx2-10*sc,BAR_Y2+124*sc,20*sc,20*sc,'SCHEMA_MT'); if(cel2.tip==='T'){dxf+=dxfCircle(cx2,BAR_Y2+184*sc,16*sc,'SCHEMA_MT');dxf+=dxfCircle(cx2,BAR_Y2+204*sc,16*sc,'SCHEMA_MT');dxf+=dxfText(cx2,BAR_Y2+184*sc,cel2.putere||'100kVA','ETICHETE',1.2);dxf+=dxfText(cx2,BAR_Y2+CH2-5*sc,cel2.label||'T','ETICHETE',1.5);}else{dxf+=dxfText(cx2,BAR_Y2+CH2-5*sc,cel2.label||'L','ETICHETE',1.5);}dxf+=dxfText(cx2+16*sc,BAR_Y2+44*sc,cel2.curent||'16A','ETICHETE',1.0); });
          if(el.label) dxf+=dxfText(x,BAR_Y2-22*sc,el.label,'ETICHETE',2);
          break;
        }
        case 'celula_linie_mt': {
          const CW2=35*sc,CH2=110*sc; dxf+=dxfRect(x-CW2,y-CH2,CW2*2,CH2*2,'SCHEMA_MT'); dxf+=dxfLine(x,y-CH2,x,y+CH2,'SCHEMA_MT'); dxf+=dxfRect(x-14*sc,y-CH2+40*sc,28*sc,36*sc,'SCHEMA_MT'); dxf+=dxfCircle(x,y,8*sc,'SCHEMA_MT'); dxf+=dxfRect(x-10*sc,y+CH2-60*sc,20*sc,20*sc,'SCHEMA_MT');
          const cData=el.celMT||{}; dxf+=dxfText(x+CW2+3*sc,y,cData.curent||'400A','ETICHETE',1.2); dxf+=dxfText(x,y-CH2-8*sc,cData.tensiune||'20kV','ETICHETE',1.2);
          break;
        }
        case 'celula_trafo_mt': {
          const CW2=40*sc,CH2=140*sc; dxf+=dxfRect(x-CW2,y-CH2,CW2*2,CH2*2,'SCHEMA_MT'); dxf+=dxfLine(x,y-CH2,x,y+CH2,'SCHEMA_MT'); dxf+=dxfRect(x-14*sc,y-CH2+30*sc,28*sc,36*sc,'SCHEMA_MT'); dxf+=dxfCircle(x,y-20*sc,8*sc,'SCHEMA_MT'); dxf+=dxfRect(x-10*sc,y+10*sc,20*sc,20*sc,'SCHEMA_MT'); dxf+=dxfCircle(x,y+CH2-60*sc,16*sc,'SCHEMA_MT'); dxf+=dxfCircle(x,y+CH2-38*sc,16*sc,'SCHEMA_MT');
          const cDataT=el.celMT||{}; dxf+=dxfText(x+CW2+3*sc,y+CH2-60*sc,cDataT.putere||'100kVA','ETICHETE',1.2); dxf+=dxfText(x+CW2+3*sc,y+CH2-48*sc,cDataT.volt||'20/0.4kV','ETICHETE',1.2); dxf+=dxfText(x,y-CH2-8*sc,cDataT.tensiune||'20kV','ETICHETE',1.2);
          break;
        }
        case 'bara_statie_mt': {
          const lung2=(el.lungime||200)*sc;
          dxf+=dxfLine(x,y-lung2/2,x,y+lung2/2,'SCHEMA_MT');
          dxf+=dxfLine(x-9*sc,y-lung2/2,x,y-lung2/2-16*sc,'SCHEMA_MT');
          dxf+=dxfLine(x+9*sc,y-lung2/2,x,y-lung2/2-16*sc,'SCHEMA_MT');
          (el.terminale||[{pct:25},{pct:50},{pct:75}]).forEach(ter=>{ const pct=Math.max(0,Math.min(100,ter.pct||0)); const terY=y-lung2/2+(pct/100)*lung2; dxf+=dxfLine(x-5*sc,terY,x+18*sc,terY,'SCHEMA_MT'); if(ter.label) dxf+=dxfText(x+22*sc,terY,ter.label,'ETICHETE',1.2); });
          const gY2=y+lung2/2+10*sc;
          dxf+=dxfLine(x-20*sc,gY2,x+20*sc,gY2,'SCHEMA_MT')+dxfLine(x-13*sc,gY2+8*sc,x+13*sc,gY2+8*sc,'SCHEMA_MT')+dxfLine(x-6*sc,gY2+16*sc,x+6*sc,gY2+16*sc,'SCHEMA_MT');
          dxf+=dxfText(x-12*sc,y+5*sc,el.nrCircuit||'2','ETICHETE',4);
          dxf+=dxfText(x,y-lung2/2-28*sc,el.numeStatie||'STATIE 20kV','ETICHETE',1.8);
          if(el.label) dxf+=dxfText(x+14*sc,y,el.label,'ETICHETE',1.5);
          break;
        }
      }
      if (S.vdResults) {
        S.vdResults.forEach(data => {
          if (data.duNod === 0) return;
          const elVD = S.EL.find(e => e.id === data.elId); if (!elVD) return;
          dxf += dxfText(elVD.x, elVD.y-40, `DU=${data.duNod.toFixed(2)}%`, 'CADERE_U', 1.0);
        });
      }
    });

    dxf += '0\nENDSEC\n0\nEOF\n';
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'schema_electrica.dxf'; a.click(); URL.revokeObjectURL(url);
    toast('✅ DXF exportat! Deschide in AutoCAD / LibreCAD / QCAD.', 'ok');
  } catch (err) { console.error(err); toast('Eroare DXF: ' + err.message, 'ac'); }
}

export function closeExportMenu() {
  const m = document.getElementById('export-menu');
  if (m) m.style.display = 'none';
}

export function toggleExportMenu() {
  const m = document.getElementById('export-menu');
  const isOpen = m.style.display === 'flex';
  m.style.display = isOpen ? 'none' : 'flex';
  if (!isOpen) {
    setTimeout(() => {
      document.addEventListener('click', closeExportMenuOutside, { once: true });
    }, 10);
  }
}
function closeExportMenuOutside(e) {
  const m = document.getElementById('export-menu');
  if (m.style.display === 'flex' && !m.parentElement.contains(e.target)) {
    m.style.display = 'none';
  }
}
