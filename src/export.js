// ElectroCAD Pro v12 — Export Module
import { EL, CN, bgData, vdOverlayOn, lightMode, VP, pxPerMeter } from './state.js';
import { calcPathLen, toast } from './utils.js';
import { vdResults } from './state.js';

// ========== Export Constants ==========

const MAX_PT = 5080;
const PX_TO_PT = 0.75;

// ========== Get Project Bounds ==========

export function getProjectBounds() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const hasSelection = window.sel !== null || window.multiSel?.size > 0;
  if (hasSelection) {
    EL.forEach(el => {
      if (el.id === window.sel || window.multiSel?.has(el.id)) {
        if (el.type === 'polyline') {
          el.points.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
        } else {
          const sc = el.scale || 1, wBox = (window.symW(el) * sc / 2 + 40), hBox = (window.symH(el) * sc / 2 + 40);
          minX = Math.min(minX, el.x - wBox); minY = Math.min(minY, el.y - hBox); maxX = Math.max(maxX, el.x + wBox); maxY = Math.max(maxY, el.y + hBox);
        }
      }
    });
    CN.forEach(cn => {
      if (cn.id === window.sel || window.multiSel?.has(cn.id)) {
        cn.path.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
      }
    });
    if (minX !== Infinity) return { minX, minY, maxX, maxY, isSelection: true };
  }
  if (bgData && bgData.url) return { minX: bgData.x, minY: bgData.y, maxX: bgData.x + bgData.w, maxY: bgData.y + bgData.h, isBg: true };
  if (EL.length === 0 && CN.length === 0) return null;
  EL.forEach(el => {
    if (el.type === 'polyline') {
      el.points.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    } else {
      const sc = el.scale || 1, wBox = (window.symW(el) * sc / 2 + 40), hBox = (window.symH(el) * sc / 2 + 40);
      minX = Math.min(minX, el.x - wBox); minY = Math.min(minY, el.y - hBox); maxX = Math.max(maxX, el.x + wBox); maxY = Math.max(maxY, el.y + hBox);
    }
  });
  CN.forEach(cn => {
    cn.path.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
  });
  if (minX === Infinity) return null;
  return { minX, minY, maxX, maxY };
}

// ========== Start Export ==========

export function startExport(type) {
  if (EL.length === 0 && CN.length === 0 && !bgData.url) { toast('Planșă goală!', 'w'); return; }
  if (type === 'dxf') { doExportDXF(null); return; }
  if (type === 'pdf') { doExportPDF(null); return; }
  toast(`Se procesează exportul ${type.toUpperCase()}...`, 'ac');
  window.setMode?.('select');
  setTimeout(() => {
    if (type === 'png') doExportPNG(null);
    if (type === 'svg') doExportSVG(null);
  }, 100);
}

// ========== Build Export SVG ==========

export function buildExportSVG(forSVGExport = false, customBounds = null) {
  const bounds = customBounds || getProjectBounds();
  if (!bounds) return { svg: '', W: 0, H: 0 };
  const pad = 50;
  const W = (bounds.maxX - bounds.minX) + pad * 2;
  const H = (bounds.maxY - bounds.minY) + pad * 2;
  const vX = -bounds.minX + pad;
  const vY = -bounds.minY + pad;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<rect width="100%" height="100%" fill="${lightMode ? '#ffffff' : '#0b1220'}"/>`;
  svg += `<g transform="translate(${vX}, ${vY})">`;
  svg += window.renderBg ? '<g id="export-bg">' + (document.getElementById('bg-layer')?.innerHTML || '') + '</g>' : '';
  svg += '<g id="export-elements">' + (document.getElementById('EL')?.innerHTML || '') + '</g>';
  svg += '<g id="export-connections">' + (document.getElementById('CN')?.innerHTML || '') + '</g>';
  if (vdOverlayOn && vdResults) {
    svg += '<g id="export-vd-overlay">' + (document.getElementById('VD-OVL')?.innerHTML || '') + '</g>';
  }
  svg += '</g></svg>';
  return { svg, W, H, vX, vY };
}

// ========== PNG Export ==========

export async function doExportPNG(customBounds) {
  try {
    const { svgStr, W, H, vX, vY } = buildExportSVG(false, customBounds);
    const scale = Math.min(4, 15000 / Math.max(W, H));
    const bg = lightMode ? '#ffffff' : '#0b1220';
    const ca = await renderToCanvas(svgStr, W, H, vX, vY, scale, bg);
    const a = document.createElement('a'); a.href = ca.toDataURL('image/png'); a.download = 'schema_electrica_HD.png'; a.click();
    toast('PNG HD exportat!', 'ok');
  } catch (err) { console.error(err); toast('Eroare export PNG: ' + err.message, 'ac'); }
}

// ========== SVG Export ==========

export function doExportSVG(customBounds) {
  try {
    const { svgStr } = buildExportSVG(true, customBounds);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'schema_electrica_Vectorial.svg'; a.click();
    URL.revokeObjectURL(url);
    toast('SVG Vectorial exportat cu succes!', 'ok');
  } catch (err) { console.error(err); toast('Eroare export SVG: ' + err.message, 'ac'); }
}

// ========== PDF Export ==========

export async function doExportPDF(customBounds) {
  toast('⏳ Generez PDF vectorial...', 'ac');
  setTimeout(async () => {
    try {
      if (!window.jspdf) { toast('jsPDF indisponibil.', 'ac'); return; }
      const { jsPDF } = window.jspdf;
      const { svgStr, W, H } = buildExportSVG(true, customBounds);
      let pageW = W * PX_TO_PT, pageH = H * PX_TO_PT;
      if (pageW > MAX_PT || pageH > MAX_PT) {
        const f = MAX_PT / Math.max(pageW, pageH);
        pageW *= f; pageH *= f;
      }
      const SCALE = Math.min(4, 20000 / Math.max(W, H));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(W * SCALE);
      canvas.height = Math.round(H * SCALE);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = lightMode ? '#ffffff' : '#0b1220';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); resolve(); };
        img.onerror = (e) => { console.error('SVG render error', e); reject(new Error('SVG render failed')); };
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        img.src = URL.createObjectURL(blob);
      });
      const imgData = canvas.toDataURL('image/png');
      const orient = pageW >= pageH ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ orientation: orient, unit: 'pt', format: [pageW, pageH], compress: true });
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);
      let tot = 0; CN.forEach(c => tot += parseFloat(c.length) || 0);
      pdf.setFontSize(5); pdf.setTextColor(150);
      pdf.text(`ElectroCAD Pro v12 | (c) Grigore Alin-Florin | ${new Date().toLocaleDateString('ro-RO')} | ${EL.length} elem ${CN.length} conn ${tot.toFixed(1)}m`, 4, pageH - 3);
      pdf.save('schema_electrica.pdf');
      toast('✅ PDF exportat cu succes!', 'ok');
    } catch (err) {
      console.error('PDF error:', err);
      toast('Eroare PDF: ' + err.message, 'ac');
    }
  }, 50);
}

// ========== DXF Export ==========

export function doExportDXF(customBounds) {
  toast('⏳ Generez DXF pentru AutoCAD...', 'ac');
  try {
    const bounds = customBounds || getProjectBounds();
    const offX = bounds ? bounds.minX - 50 : 0;
    const offY = bounds ? bounds.minY - 50 : 0;
    const maxY = bounds ? bounds.maxY + 50 : 1000;
    const dx = x => parseFloat(((x - offX) * 0.1).toFixed(4));
    const dy = y => parseFloat(((maxY - y - offY) * 0.1).toFixed(4));
    let dxf = '';
    dxf += '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n';
    dxf += '9\n$INSUNITS\n70\n6\n9\n$MEASUREMENT\n70\n1\n';
    dxf += '9\n$EXTMIN\n10\n0\n20\n0\n30\n0\n';
    dxf += `9\n$EXTMAX\n10\n${dx((bounds?.maxX || 1000) + 50)}\n20\n${dy((bounds?.minY || 0) - 50)}\n30\n0\n`;
    dxf += '0\nENDSEC\n';
    dxf += '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n10\n';
    const layers = [
      { name: 'ELEMENTE', color: 5 }, { name: 'CABLURI_LEA', color: 1 },
      { name: 'CABLURI_LES', color: 3 }, { name: 'ETICHETE', color: 7 },
      { name: 'PTAB_MT', color: 4 }, { name: 'PTAB_JT', color: 2 },
      { name: 'STALPI', color: 6 }, { name: 'FIRIDE', color: 30 },
      { name: 'CADERE_U', color: 1 }, { name: 'SCHEMA_MT', color: 40 },
    ];
    layers.forEach(l => {
      dxf += `0\nLAYER\n2\n${l.name}\n70\n0\n62\n${l.color}\n6\nCONTINUOUS\n`;
    });
    dxf += '0\nENDTABLE\n0\nENDSEC\n';
    dxf += '0\nSECTION\n2\nENTITIES\n';
    const dxfLine = (x1, y1, x2, y2, layer, ltype) =>
      `0\nLINE\n8\n${layer}\n${ltype ? '6\n' + ltype + '\n' : ''}10\n${dx(x1)}\n20\n${dy(y1)}\n11\n${dx(x2)}\n21\n${dy(y2)}\n`;
    CN.forEach(cn => {
      if (cn.path.length < 2) return;
      const isS = cn.lineType === 'dashed';
      const layer = isS ? 'CABLURI_LES' : 'CABLURI_LEA';
      for (let i = 0; i < cn.path.length - 1; i++) {
        dxf += dxfLine(cn.path[i].x, cn.path[i].y, cn.path[i + 1].x, cn.path[i + 1].y, layer, isS ? 'DASHED' : '');
      }
    });
    dxf += '0\nENDSEC\n0\nEOF\n';
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'schema_electrica.dxf'; a.click();
    URL.revokeObjectURL(url);
    toast('DXF exportat!', 'ok');
  } catch (err) { console.error(err); toast('Eroare export DXF: ' + err.message, 'ac'); }
}

// ========== Render to Canvas ==========

export function renderToCanvas(svgStr, W, H, vX, vY, scale, bgColor) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor || '#0b1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); resolve(canvas); };
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    img.src = URL.createObjectURL(blob);
  });
}

// ========== Export JSON ==========

export function exportJSON() {
  const data = { EL, CN, bgData: bgData.url ? bgData : null };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fname = (window.currentProjectName || 'proiect_electro').replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') + '.json';
  a.href = url; a.download = fname; a.click();
  URL.revokeObjectURL(url);
  toast('JSON exportat: ' + fname, 'ok');
}

// ========== CSS & Style Helpers for Export ==========

export function resolveCSSVars(svgNode) {
  const cs = getComputedStyle(document.documentElement);
  const vars = {};
  ['--bg', '--bg2', '--bg3', '--panel', '--panel2', '--border', '--border2',
    '--accent', '--accentg', '--warn', '--danger', '--text', '--text2', '--text3',
    '--cvs', '--shadow', '--glow'].forEach(v => {
    vars[v] = cs.getPropertyValue(v).trim();
  });
  function resolveNode(node) {
    if (node.nodeType !== 1) return;
    ['fill', 'stroke', 'color', 'stop-color'].forEach(attr => {
      const val = node.getAttribute(attr);
      if (val && val.includes('var(')) {
        const resolved = val.replace(/var\((--[\w-]+)[^)]*\)/g, (m, varName) => vars[varName] || m);
        node.setAttribute(attr, resolved);
      }
    });
    const style = node.getAttribute('style');
    if (style && style.includes('var(')) {
      const resolved = style.replace(/var\((--[\w-]+)[^)]*\)/g, (m, varName) => vars[varName] || m);
      node.setAttribute('style', resolved);
    }
    Array.from(node.childNodes).forEach(resolveNode);
  }
  resolveNode(svgNode);
}

export function inlineStyles(svgNode) {
  const isLight = lightMode;
  const bgCol = isLight ? '#ffffff' : '#0b1220';
  const textCol = isLight ? '#1a2740' : '#dce8f5';
  svgNode.querySelectorAll('.td, .hb, .ph').forEach(el => el.remove());
  svgNode.querySelectorAll('[data-lcx]').forEach(el => el.remove());
  svgNode.querySelectorAll('.sel-r').forEach(el => {
    el.removeAttribute('class');
    if (el.getAttribute('fill') === 'transparent') el.setAttribute('fill', 'none');
    if (el.getAttribute('stroke') === 'transparent') el.setAttribute('stroke', 'none');
  });
  ['#sel-rect', '#export-rect', '#tpoly', '#GL', '#TL'].forEach(id => {
    svgNode.querySelector(id)?.remove();
  });
  if (!vdOverlayOn) svgNode.querySelector('#VD-OVL')?.remove();
  function fixRgba(node) {
    if (node.nodeType !== 1) return;
    ['fill', 'stroke'].forEach(attr => {
      const val = node.getAttribute(attr);
      if (val && val.startsWith('rgba(')) {
        const m = val.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (m) {
          const hex = '#' + [m[1], m[2], m[3]].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
          node.setAttribute(attr, hex);
          node.setAttribute(attr === 'fill' ? 'fill-opacity' : 'stroke-opacity', parseFloat(m[4]).toFixed(3));
        }
      }
    });
    Array.from(node.childNodes).forEach(fixRgba);
  }
  fixRgba(svgNode);
  svgNode.querySelectorAll('[display="none"]').forEach(el => el.remove());
  svgNode.querySelectorAll('[fill="transparent"]').forEach(el => el.setAttribute('fill', 'none'));
  svgNode.querySelectorAll('[stroke="transparent"]').forEach(el => el.setAttribute('stroke', 'none'));
  svgNode.querySelectorAll('.el-lbl').forEach(el => {
    el.removeAttribute('class');
    el.setAttribute('paint-order', 'stroke fill');
    el.setAttribute('stroke', bgCol);
    el.setAttribute('stroke-width', '3.5');
    el.setAttribute('fill', textCol);
  });
}
