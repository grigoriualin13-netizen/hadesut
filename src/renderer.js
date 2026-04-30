// ElectroCAD Pro v12 — SVG Rendering Engine
import { EL, CN, sel, multiSel, mode, vdOverlayOn, vdResults, flowAnimOn, VP, NL, CL, GL, bgData, connStart, connPts, connFromEl, connFromTerm, connToEl, connToTerm, connFromCircuit, connToCircuit, dragging, dragEl, dragOff, multiDragStart, vxDrag, vxConn, vxIdx, pxPerMeter, setSel, setMultiDragStart, setDragging, setDragEl, setDragOff, setVxDrag, setVxConn, setVxIdx, setConnStart, setConnPts, setConnFromEl, setConnFromTerm, setConnToEl, setConnToTerm, setConnFromCircuit, setConnToCircuit } from './state.js';
import { termWorldPos, getLineIntersection, calcPathLen, mk, nextLbl, toast, svgPt } from './utils.js';
import { sym, symW, symH } from './elements.js';

// Callbacks for functions defined in other modules (avoids circular dependencies)
export const callbacks = {
  selectEl: null,
  finalConn: null,
  setMode: null,
  updateProps: null,
  updateStat: null,
  saveState: null,
  addElem: null,
};

// ========== Background Rendering ==========

export function renderBg() {
  const bgL = document.getElementById('bg-layer');
  if (!bgL) return;
  if (!bgData.url) { bgL.innerHTML = ''; return; }
  bgL.innerHTML = `<img id="html-bg-img" src="${bgData.url}" style="position:absolute; left:${bgData.x}px; top:${bgData.y}px; width:${bgData.w}px; height:${bgData.h}px; opacity:${bgData.op}; will-change:transform;" />`;
}

// ========== Voltage Drop Overlay ==========

export function renderVDOverlay() {
  let ovl = document.getElementById('VD-OVL');
  if (!ovl) { ovl = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ovl.id = 'VD-OVL'; VP.appendChild(ovl); }
  ovl.innerHTML = '';
  if (!vdResults) return;

  const fuseA = parseFloat(document.getElementById('vd-fuse')?.value) || 160;
  const showIsc = document.getElementById('vd-show-isc')?.checked !== false;

  const byEl = new Map();
  vdResults.forEach((data) => {
    if (!byEl.has(data.elId)) byEl.set(data.elId, []);
    byEl.get(data.elId).push(data);
  });

  byEl.forEach((dataList, elId) => {
    const el = EL.find(x => x.id === elId);
    if (!el || el.type === 'text' || el.type === 'polyline') return;
    if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;

    dataList.forEach((data, index) => {
      if (data.duNod === 0 && !data.duTronson) return;
      const evalFuse = data.protected_by || fuseA;
      const iscAmps = data.Isc * 1000;
      const isIscLow = showIsc && iscAmps > 0 && iscAmps < 3 * evalFuse;

      let col = data.duNod > 10 ? '#ff3d71' : data.duNod > 5 ? '#ff9f43' : data.duNod > 3 ? '#eab308' : '#00e5a0';
      let bgHex = data.duNod > 10 ? '#ff3d71' : data.duNod > 5 ? '#ff9f43' : data.duNod > 3 ? '#eab308' : '#00e5a0';
      let bgOp = data.duNod > 10 ? '0.18' : data.duNod > 5 ? '0.15' : data.duNod > 3 ? '0.12' : '0.10';
      if (isIscLow) { col = '#ff3d71'; bgHex = '#ff3d71'; bgOp = '0.18'; }

      const txtDU = `[${data.circKey}] ΔU=${data.duNod.toFixed(2)}%`;
      const hasIsc = showIsc && (data.isEnd || el.nod === 'capat' || isIscLow);
      let txtIsc = '';
      if (hasIsc) {
        txtIsc = `Isc=${data.Isc.toFixed(3)}kA`;
        if (isIscLow) txtIsc += ` ⚠ CS!`;
      }

      const bwDU = txtDU.length * 5.5 + 10, bhLine = 14;
      const bwIsc = hasIsc ? txtIsc.length * 5.5 + 10 : 0;
      const bw = Math.max(bwDU, bwIsc);
      const totalH = hasIsc ? bhLine * 2 + 2 : bhLine;
      const yOffset = -totalH - 28 - (index * (totalH + 4));

      ovl.innerHTML += `<rect x="${el.x - bw / 2}" y="${el.y + yOffset}" width="${bw}" height="${totalH}" fill="${bgHex}" fill-opacity="${bgOp}" stroke="${col}" stroke-width="1" rx="3" pointer-events="none"/>`;
      ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5}" text-anchor="middle" font-size="8.5" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none">${txtDU}</text>`;
      if (hasIsc) {
        const iscCol = isIscLow ? '#ff3d71' : '#ff9f43';
        ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5 + bhLine}" text-anchor="middle" font-size="7.5" fill="${iscCol}" font-family="JetBrains Mono,monospace" font-weight="600" pointer-events="none">${txtIsc}</text>`;
      }
    });
  });
}

// ========== Flow Layer Rendering ==========

export function renderFlowLayer() {
  const gl = document.getElementById('GL');
  if (!gl) return;
  gl.innerHTML = '';
  if (!flowAnimOn) return;

  CN.forEach(cn => {
    if (!cn.flowDir || !cn.path || cn.path.length < 2) return;

    if (cn.fromElId && cn.fromCircuit) {
      const srcEl = EL.find(e => e.id === cn.fromElId);
      if (srcEl && srcEl.fuses && srcEl.fuses[cn.fromCircuit] === false) return;
    }
    if (cn.toElId && cn.toCircuit) {
      const srcEl = EL.find(e => e.id === cn.toElId);
      if (srcEl && srcEl.fuses && srcEl.fuses[cn.toCircuit] === false) return;
    }

    const col = cn.color || '#ef4444';
    const sw = Math.max(2, (cn.strokeWidth || 2) + 1.5);
    const isRev = cn.flowDir === 'rev';

    let dStr = `M ${cn.path[0].x},${cn.path[0].y} `;
    for (let i = 1; i < cn.path.length; i++) {
      dStr += `L ${cn.path[i].x},${cn.path[i].y} `;
    }

    let totalLen = 0;
    for (let i = 0; i < cn.path.length - 1; i++) {
      totalLen += Math.hypot(cn.path[i + 1].x - cn.path[i].x, cn.path[i + 1].y - cn.path[i].y);
    }
    const speedClass = totalLen < 100 ? 'fast' : totalLen > 500 ? 'slow' : '';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', dStr);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', col);
    path.setAttribute('stroke-width', sw);
    path.setAttribute('stroke-opacity', '0.85');
    path.setAttribute('class', `flow-arrow${isRev ? ' rev' : ''}${speedClass ? ' ' + speedClass : ''}`);
    const offset = Math.random() * 40;
    path.style.animationDelay = `-${offset.toFixed(1)}s`;
    gl.appendChild(path);

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', dStr);
    path2.setAttribute('fill', 'none');
    path2.setAttribute('stroke', '#ffffff');
    path2.setAttribute('stroke-width', Math.max(1.5, sw * 0.45));
    path2.setAttribute('stroke-opacity', '0.7');
    path2.setAttribute('class', `flow-arrow${isRev ? ' rev' : ''}${speedClass ? ' ' + speedClass : ''}`);
    path2.style.animationDelay = `-${offset.toFixed(1)}s`;
    gl.appendChild(path2);
  });
}

// ========== Main Render Function ==========

export function render() {
  NL.innerHTML = '';
  CL.innerHTML = '';

  // Render connections
  CN.forEach(cn => {
    const isSel = cn.id === sel || multiSel.has(cn.id),
          col = cn.color || '#ef4444',
          sw = cn.strokeWidth || 2,
          dash = cn.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '';
    const pts = cn.path.map(p => `${p.x},${p.y}`).join(' ');
    let dStr = '', JUMP_R = 6;

    if (cn.path.length > 0) {
      for (let i = 0; i < cn.path.length - 1; i++) {
        const p1 = cn.path[i], p2 = cn.path[i + 1];
        if (i === 0) dStr += `M ${p1.x},${p1.y} `;
        let inters = [];
        CN.forEach(otherCn => {
          if (otherCn.id >= cn.id) return;
          for (let j = 0; j < otherCn.path.length - 1; j++) {
            const int = getLineIntersection(p1, p2, otherCn.path[j], otherCn.path[j + 1]);
            if (int) inters.push({ x: int.x, y: int.y, dist: Math.hypot(int.x - p1.x, int.y - p1.y) });
          }
        });
        inters.sort((a, b) => a.dist - b.dist);
        const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy);
        if (len > 0) {
          const ux = dx / len, uy = dy / len;
          let validInters = [];
          inters.forEach(int => {
            if (validInters.length === 0) {
              if (int.dist > JUMP_R && len - int.dist > JUMP_R) validInters.push(int);
            } else {
              if (int.dist - validInters[validInters.length - 1].dist > JUMP_R * 2.5 && len - int.dist > JUMP_R) validInters.push(int);
            }
          });
          validInters.forEach(int => {
            dStr += `L ${int.x - ux * JUMP_R},${int.y - uy * JUMP_R} A ${JUMP_R} ${JUMP_R} 0 0 1 ${int.x + ux * JUMP_R},${int.y + uy * JUMP_R} `;
          });
        }
        dStr += `L ${p2.x},${p2.y} `;
      }
    }

    const g = mk('g');
    g.setAttribute('class', `conn ${isSel ? 'sel' : ''}`);

    const isDemontat = cn.stare === 'demontat';
    const demDash = isDemontat ? 'stroke-dasharray="8,6"' : '';
    const finalDash = dash || demDash;

    let hlPath = '';
    if (cn.fillColor && cn.fillColor !== 'none') {
      hlPath = `<path d="${dStr}" fill="none" stroke="${cn.fillColor}" stroke-width="${sw + 8}" opacity="0.45" pointer-events="none"/>`;
    }

    let demXmarks = '';
    if (isDemontat && cn.path.length >= 2) {
      for (let i = 0; i < cn.path.length - 1; i++) {
        const p1 = cn.path[i], p2 = cn.path[i + 1];
        const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const xCount = Math.max(1, Math.floor(segLen / 40));
        for (let j = 1; j <= xCount; j++) {
          const t = j / (xCount + 1);
          const cx = p1.x + (p2.x - p1.x) * t, cy = p1.y + (p2.y - p1.y) * t;
          const xr = 4;
          demXmarks += `<line x1="${cx - xr}" y1="${cy - xr}" x2="${cx + xr}" y2="${cy + xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
          demXmarks += `<line x1="${cx + xr}" y1="${cy - xr}" x2="${cx - xr}" y2="${cy + xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
        }
      }
    }

    g.innerHTML = `<polyline class="hb" points="${pts}" fill="none" stroke="transparent" stroke-width="16" style="pointer-events:stroke;cursor:pointer"/>${hlPath}<path class="cl" d="${dStr}" fill="none" stroke="${col}" stroke-width="${isSel ? sw + 2 : sw}" ${finalDash} pointer-events="none"/>${demXmarks}`;

    if (cn.path.length >= 2) {
      let maxLen = -1, bestP1 = cn.path[0], bestP2 = cn.path[1];
      for (let i = 0; i < cn.path.length - 1; i++) {
        let d = Math.hypot(cn.path[i + 1].x - cn.path[i].x, cn.path[i + 1].y - cn.path[i].y);
        if (d > maxLen) { maxLen = d; bestP1 = cn.path[i]; bestP2 = cn.path[i + 1]; }
      }
      let mx = (bestP1.x + bestP2.x) / 2, my = (bestP1.y + bestP2.y) / 2;
      let isHoriz = Math.abs(bestP2.x - bestP1.x) >= Math.abs(bestP2.y - bestP1.y);
      let tx = mx, ty = my, rot = 0;
      if (isHoriz) { ty -= 7; } else { tx += 7; rot = -90; }
      let tr = rot ? `transform="rotate(${rot} ${tx} ${ty})"` : '';
      let hlStyle = cn.fillColor && cn.fillColor !== 'none' ? `stroke:${cn.fillColor}; stroke-width:3px; paint-order:stroke fill;` : '';
      g.innerHTML += `<text class="el-lbl" x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="9" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none" style="${hlStyle}" ${tr}>L=${cn.length || 0}m</text>`;
    }

    g.querySelector('.hb').addEventListener('mousedown', ev => {
      ev.stopPropagation();
      if (mode === 'select') {
        if (ev.ctrlKey || ev.metaKey) {
          if (multiSel.has(cn.id)) multiSel.delete(cn.id); else multiSel.add(cn.id);
          setSel(null);
          render();
          callbacks.updateProps?.();
          return;
        }
        if (multiSel.size > 1 && multiSel.has(cn.id)) {
          setMultiDragStart({
            mouseX: svgPt(ev).x, mouseY: svgPt(ev).y,
            origPositions: EL.filter(e => multiSel.has(e.id)).map(e => ({ id: e.id, x: e.x, y: e.y })),
            origConnPaths: CN.filter(c => multiSel.has(c.id)).map(c => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) }))
          });
          const _selIds = new Set(multiDragStart.origPositions.map(o => o.id));
          CN.forEach(cn2 => {
            if (!multiSel.has(cn2.id) && (_selIds.has(cn2.fromElId) && _selIds.has(cn2.toElId))) {
              cn2._origPath = JSON.parse(JSON.stringify(cn2.path));
            }
          });
          setDragging(true);
          setDragEl(null);
        } else {
          multiSel.clear();
          callbacks.selectEl?.(cn.id);
        }
      }
    });

    if (isSel && mode === 'select') {
      cn.path.forEach((p, i) => {
        const h = mk('circle');
        h.setAttribute('class', 'ph');
        h.setAttribute('cx', p.x);
        h.setAttribute('cy', p.y);
        h.setAttribute('r', '6');
        h.addEventListener('mousedown', ev => {
          ev.stopPropagation();
          if (ev.button === 2 && cn.path.length > 2) {
            callbacks.saveState?.('rmv pt');
            cn.path.splice(i, 1);
            render();
          } else {
            setVxDrag(true);
            setVxConn(cn);
            setVxIdx(i);
          }
        });
        g.appendChild(h);
      });
    }

    CL.appendChild(g);
  });

  // Render elements
  EL.forEach(el => {
    if (el.type === 'poly_arrow') { el.type = 'polyline'; el.arrowEnd = true; el.arrowStart = false; el.lineType = 'solid'; el.strokeWidth = 2.5; }

    const isSel = el.id === sel;
    if (el.type === 'text') {
      const g = mk('g');
      g.setAttribute('class', `el ${isSel ? 'sel' : ''}`);
      g.dataset.eid = el.id;
      const hlStyle = el.fillColor && el.fillColor !== 'none' ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : '';
      const sc = el.scale || 1;
      g.setAttribute('transform', `translate(${el.x},${el.y}) rotate(${el.rotation || 0}) scale(${sc})`);
      g.innerHTML = `<text x="0" y="0" font-size="${el.fontSize || 10}" fill="${el.color || (document.documentElement.getAttribute('data-theme') === 'light' ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" style="${hlStyle}">${el.label || 'Text'}</text>`;
      g.addEventListener('mousedown', ev => {
        if (mode === 'select') {
          ev.stopPropagation();
          setDragging(true);
          setDragEl(el);
          setDragOff({ x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y });
          callbacks.selectEl?.(el.id);
        }
      });
      NL.appendChild(g);
      return;
    }

    if (el.type === 'polyline') {
      const g = mk('g');
      g.setAttribute('class', `el ${isSel ? 'sel' : ''}`);
      g.dataset.eid = el.id;
      const pts = el.points.map(p => `${p.x},${p.y}`).join(' ');
      const dash = el.lineType === 'dashed' ? 'stroke-dasharray="10,5"' : '';
      const sw = el.strokeWidth || 2.5;
      let markersDef = '';
      if (el.arrowEnd) markersDef += `<marker id="arr-e-${el.id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${el.color || '#00cfff'}"/></marker>`;
      if (el.arrowStart) markersDef += `<marker id="arr-s-${el.id}" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><polygon points="0 0,8 3,0 6" fill="${el.color || '#00cfff'}"/></marker>`;
      let markersAttr = '';
      if (el.arrowEnd) markersAttr += ` marker-end="url(#arr-e-${el.id})"`;
      if (el.arrowStart) markersAttr += ` marker-start="url(#arr-s-${el.id})"`;
      g.innerHTML = `<defs>${markersDef}</defs><polyline points="${pts}" fill="none" stroke="${el.color || '#00cfff'}" stroke-width="${sw}" ${dash} ${markersAttr}/>`;
      if (isSel) {
        el.points.forEach((p, i) => {
          const h = mk('circle');
          h.setAttribute('class', 'ph');
          h.setAttribute('cx', p.x);
          h.setAttribute('cy', p.y);
          h.setAttribute('r', '6');
          h.addEventListener('mousedown', ev => { ev.stopPropagation(); setVxDrag(true); vxConn = el; setVxIdx(i); });
          g.appendChild(h);
        });
      }
      g.addEventListener('mousedown', ev => {
        if (mode === 'select') {
          ev.stopPropagation();
          setDragging(true);
          setDragEl(el);
          setDragOff({ x: svgPt(ev).x - el.points[0].x, y: svgPt(ev).y - el.points[0].y });
          callbacks.selectEl?.(el.id);
        }
      });
      NL.appendChild(g);
      return;
    }

    const { inner } = sym(el);
    const g = mk('g');
    g.setAttribute('class', `el ${isSel ? 'sel' : ''}`);
    g.dataset.eid = el.id;
    g.setAttribute('transform', `translate(${el.x},${el.y}) rotate(${el.rotation || 0}) scale(${el.scale || 1})`);

    const isMSel = multiSel.has(el.id);
    const wBox = symW(el), hBox = symH(el);
    let selBox = '';
    if (isSel) {
      selBox = `<rect x="${-wBox / 2 - 5}" y="${-hBox / 2 - 5}" width="${wBox + 10}" height="${hBox + 10}" fill="none" stroke="rgba(0,207,255,.7)" stroke-width="2" stroke-dasharray="5,3" rx="3" pointer-events="none"/>`;
    } else if (isMSel) {
      selBox = `<rect x="${-wBox / 2 - 5}" y="${-hBox / 2 - 5}" width="${wBox + 10}" height="${hBox + 10}" fill="rgba(0,207,255,.06)" stroke="rgba(0,207,255,.45)" stroke-width="1.5" stroke-dasharray="4,4" rx="3" pointer-events="none"/>`;
    }

    const hlStyle = el.fillColor && el.fillColor !== 'none' ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : '';
    let lbl = '';
    if (el.label) {
      if (!el.type.startsWith('firida_') && !el.type.startsWith('stalp_') && !el.type.startsWith('ptab_')) {
        lbl = `<text class="el-lbl" x="12" y="${-(hBox / 2) - 10}" text-anchor="start" font-size="11" fill="${el.color || (document.documentElement.getAttribute('data-theme') === 'light' ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ''}</text>`;
      } else {
        const ly = (hBox / 2) + 16;
        const nodBadge = el.nod ? `<text class="el-lbl" x="12" y="${ly + 12}" text-anchor="start" font-size="8" fill="${el.nod === 'nod' ? '#ff9f43' : el.nod === 'capat' ? '#00e5a0' : '#00cfff'}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">[${el.nod.toUpperCase()}]</text>` : '';
        lbl = `<text class="el-lbl" x="12" y="${ly}" text-anchor="start" font-size="11" fill="${el.color || (document.documentElement.getAttribute('data-theme') === 'light' ? '#1a2740' : '#dce8f5')}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ''}</text>${nodBadge}`;
      }
    }

    g.innerHTML = selBox + inner + lbl;

    g.addEventListener('mousedown', ev => {
      if (mode === 'select') {
        ev.stopPropagation();
        if (ev.ctrlKey || ev.metaKey) {
          if (multiSel.has(el.id)) multiSel.delete(el.id); else multiSel.add(el.id);
          setSel(null);
          render();
          callbacks.updateProps?.();
          return;
        }
        if (multiSel.size > 1 && multiSel.has(el.id)) {
          setMultiDragStart({
            mouseX: svgPt(ev).x, mouseY: svgPt(ev).y,
            origPositions: EL.filter(e => multiSel.has(e.id)).map(e => ({ id: e.id, x: e.x, y: e.y })),
            origConnPaths: CN.filter(c => multiSel.has(c.id)).map(c => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) }))
          });
          const _selIds = new Set(multiDragStart.origPositions.map(o => o.id));
          CN.forEach(cn => {
            if (!multiSel.has(cn.id) && (_selIds.has(cn.fromElId) && _selIds.has(cn.toElId))) {
              cn._origPath = JSON.parse(JSON.stringify(cn.path));
            }
          });
          setDragging(true);
          setDragEl(null);
        } else {
          multiSel.clear();
          setDragging(true);
          setDragEl(el);
          setDragOff({ x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y });
          callbacks.selectEl?.(el.id);
        }
        render();
      }
    });

    g.querySelectorAll('.td').forEach(tdEl => {
      tdEl.addEventListener('mousedown', ev => {
        if (mode !== 'connect') return;
        ev.stopPropagation();
        const lcx = parseFloat(tdEl.dataset.lcx), lcy = parseFloat(tdEl.dataset.lcy);
        const circuit = tdEl.dataset.circuit ? parseInt(tdEl.dataset.circuit) : null;
        const wp = termWorldPos(el, lcx, lcy);
        if (!connStart) {
          setConnStart(el.id);
          setConnPts([{ x: wp.x, y: wp.y }]);
          setConnFromEl(el.id);
          setConnFromTerm({ cx: lcx, cy: lcy });
          setConnFromCircuit(circuit);
          setConnToEl(null);
          setConnToTerm(null);
          setConnToCircuit(null);
          if (typeof toast === 'function') toast('Terminal START — click pe planșă sau alt terminal', 'ac');
        } else {
          setConnToEl(el.id);
          setConnToTerm({ cx: lcx, cy: lcy });
          setConnToCircuit(circuit);
          connPts.push({ x: wp.x, y: wp.y });
          callbacks.finalConn?.();
        }
      });
    });

    if (el.type === 'meter') {
      const tn = g.querySelector('.bmpt-txt');
      if (tn) {
        tn.addEventListener('dblclick', ev => {
          ev.stopPropagation();
          const nv = prompt('Editează BMPT:', el.bmptText || '');
          if (nv !== null) {
            callbacks.saveState?.('edit bmpt');
            el.bmptText = nv;
            render();
          }
        });
      }
    }

    NL.appendChild(g);
  });

  if (vdOverlayOn && vdResults) {
    renderVDOverlay();
  }
  if (flowAnimOn) {
    renderFlowLayer();
  }
}
