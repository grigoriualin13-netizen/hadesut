// ElectroCAD Pro v12 — UI Panel & Property Editor
import { EL, CN, sel, multiSel, mode, connStart, connPts, connFromEl, connFromCircuit, connToEl, connToCircuit, flowAnimOn, dragging, dragEl, dragOff, multiDragStart, vxDrag, vxConn, vxIdx, shiftOn, orthoOn, panning, panS, calibPts, tempCalibLenPx, exportRectStart, arrPts, draggingBg, bgData, pxPerMeter, saveState, flowAnimOn as flowAnimOnState, setBgData, setCalibPts, setTempCalibLenPx } from './state.js';
import { uid, sn, termWorldPos, nextLbl, toast, getLineIntersection, calcPathLen, applyView } from './utils.js';
import { ELEMENT_TYPES, sym, symW, symH } from './elements.js';
import { render, renderBg, renderFlowLayer, callbacks } from './renderer.js';
import { addElem, delSel, updSel, rotateSel, setRotationAbs, updateConnectedCables, isConnectionActive, toggleFuse, cdAllFuses, getCircuitChain } from './element-manager.js';
import { setMode } from './interaction.js';

// ========== Update Stats ==========

export function updateStat() {
  const ste = document.getElementById('ste');
  const stc = document.getElementById('stc');
  if (ste) ste.textContent = EL.length + ' elem';
  if (stc) stc.textContent = CN.length + ' conn';
}

// ========== Build Color Picker ==========

export function buildColors(cur, cb, containerId, allowNone = false) {
  const COLS = ['#111','#444','#888','#dc2626','#f97316','#eab308','#16a34a','#0ea5e9','#1d4ed8','#7c3aed','#be185d','#dce8f5'];
  const cr = document.getElementById(containerId);
  if (!cr) return;
  cr.innerHTML = '';
  if (allowNone) {
    const s = document.createElement('div');
    s.className = 'csw' + ((cur === 'none' || !cur) ? ' on' : '');
    s.style.background = 'transparent';
    s.style.position = 'relative';
    s.style.overflow = 'hidden';
    s.innerHTML = '<div style="position:absolute;top:50%;left:-5px;right:-5px;height:2px;background:#ff3d71;transform:rotate(45deg)"></div>';
    s.title = 'Fără umplere';
    s.onclick = () => { cr.querySelectorAll('.csw').forEach(x => x.classList.remove('on')); s.classList.add('on'); cb('none'); };
    cr.appendChild(s);
  }
  COLS.forEach(c => {
    const s = document.createElement('div');
    s.className = 'csw' + (c === cur ? ' on' : '');
    s.style.background = c;
    s.onclick = () => { cr.querySelectorAll('.csw').forEach(x => x.classList.remove('on')); s.classList.add('on'); cb(c); };
    cr.appendChild(s);
  });
}

// ========== Set Multi Flow ==========

export function setMultiFlow(dir) {
  saveState('flux multiplu');
  CN.forEach(c => { if (multiSel.has(c.id)) c.flowDir = dir || undefined; });
  renderFlowLayer();
  render();
  const msg = dir === 'fwd' ? `▶ Flux normal pe ${[...multiSel].filter(id => CN.find(c => c.id === id)).length} cabluri` :
            dir === 'rev' ? `◀ Flux invers pe ${[...multiSel].filter(id => CN.find(c => c.id === id)).length} cabluri` :
            'Animație flux oprită';
  toast(msg, 'ok');
  if (dir && !flowAnimOnState) {
    // Activează automat animația dacă nu e pornită
    callbacks.toggleFlowAnim?.();
  }
}

// ========== Update Props (main property panel) ==========

export function updateProps() {
  const pEl = document.getElementById('props'), pb = document.getElementById('pb');
  if (!sel && multiSel.size === 0) { pEl?.classList.add('hidden'); return; }

  // MULTI-SELECTION
  if (!sel && multiSel.size > 0) {
    pEl.classList.remove('hidden');
    document.getElementById('ps').textContent = `${multiSel.size} elem. selectate`;
    document.getElementById('pt').textContent = 'SELECȚIE MULTIPLA';

    let html = `<div class="p-sec" style="padding:10px"><div style="color:var(--text2);font-size:10px;line-height:1.6"><b style="color:var(--accent)">${multiSel.size}</b> elemente selectate<br>Trage pentru mutare grupată<br><span style="color:var(--text3)">CTRL+click pentru adăugare/eliminare</span></div>
      <div style="margin-top:8px"><div class="pl">Setează Stare pe Toate</div><select class="pi" id="pm-stare">
        <option value="">-- Nu modifica --</option>
        <option value="existent">✔ Existent</option>
        <option value="proiectat_racordare" style="color:#ef4444">🔴 Proiectat — Tarif Racordare</option>
        <option value="intarire_inlocuire" style="color:#a855f7">🟣 Întărire — Înlocuire conductor</option>
        <option value="intarire_nou" style="color:#3b82f6">🔵 Întărire — Circuit/cablu nou</option>
        <option value="coexistenta" style="color:#eab308">🟡 Lucrări Coexistență</option>
        <option value="demontat" style="color:#6b7280">⛔ Demontat</option>
      </select></div>
    </div>`;

    const selCns = CN.filter(c => multiSel.has(c.id));
    if (selCns.length > 0) {
      const tcOpts = ['Clasic Al','Torsadat Al','Cablu Al','Cablu Cu'];
      const secOpts = [2.5,4,6,10,16,25,35,50,70,95,120,150,185,240];
      const secOptHtml = secOpts.map(s => `<option value="${s}">${s} mm²</option>`).join('');
      html += `<div class="p-sec"><div class="psh">⚡ Editare Multiplă Cabluri (${selCns.length})</div>
          <div class="pr"><div class="pl">Grup Circuit</div><input class="pi" id="pm-cgroup" placeholder="Tastează și apasă Enter..."></div>
          <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="pm-tc"><option value="">-- Nu modifica --</option>${tcOpts.map(t=>`<option value="${t}">${t}</option>`).join('')}</select></div>
          <div class="pr"><div class="pl">Secțiune (mm²)</div><select class="pi" id="pm-sec"><option value="">-- Nu modifica --</option>${secOptHtml}</select></div>
          <div class="pr"><div class="pl">Tip rețea</div><select class="pi" id="pm-tr"><option value="">-- Nu modifica --</option><option value="Trifazat">Trifazat (3×Un=0.4kV)</option><option value="Bifazat">Bifazat (2×Un=0.4kV)</option><option value="Monofazat">Monofazat (Un=0.23kV)</option></select></div>
          <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="pm-lt"><option value="">-- Nu modifica --</option><option value="solid">LEA — Aerian</option><option value="dashed">LES — Subteran</option></select></div>
          <div class="pr"><div class="pl">⚡ Flux putere (animație)</div>
            <div style="display:flex;gap:4px">
              <button onclick="setMultiFlow('fwd')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid rgba(234,179,8,.35);background:rgba(234,179,8,.08);color:#eab308;cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">▶ Normal</button>
              <button onclick="setMultiFlow('rev')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid rgba(234,179,8,.35);background:rgba(234,179,8,.08);color:#eab308;cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">◀ Invers</button>
              <button onclick="setMultiFlow('')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid var(--border2);background:var(--bg3);color:var(--text3);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">✕ Oprește</button>
            </div>
          </div>
          <div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="pm-c-row-color"></div></div>
        </div>`;
    }

    const selNodes = EL.filter(e => multiSel.has(e.id) && (e.type.startsWith('stalp_') || e.type.startsWith('firida_')));
    if (selNodes.length > 0) {
      html += `<div class="p-sec"><div class="psh">👥 Editare Rapidă Consumatori (${selNodes.length})</div><div style="padding:6px;max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">`;
      selNodes.forEach(node => {
        const connectedCables = CN.filter(c => c.fromElId === node.id || c.toElId === node.id || c.from === node.id);
        let groups = [...new Set(connectedCables.map(c => (c.circuitGroup && c.circuitGroup.trim() != '') ? c.circuitGroup.trim() : 'Implicit'))];
        if (groups.length === 0) groups = ['Implicit'];
        if (!node.cons_dict) node.cons_dict = {};
        if (node.consumatori && Object.keys(node.cons_dict).length === 0) node.cons_dict['Implicit'] = node.consumatori;
        html += `<div style="background:var(--bg2);padding:5px 6px;border:1px solid var(--border2);border-radius:5px;display:flex;flex-direction:column;gap:5px">
                        <div style="font-size:9.5px;color:var(--accent);font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${node.label}">${node.label || 'Nod'}</div>
                        <div style="display:flex;flex-wrap:wrap;gap:5px">`;
        groups.forEach(g => {
          let val = node.cons_dict[g] || 0;
          let dispName = g === 'Implicit' ? 'Gen.' : g;
          html += `<div style="display:flex;align-items:center;gap:4px;background:var(--bg3);padding:2px 4px;border-radius:4px;border:1px solid var(--border)">
                            <span style="font-size:8px;color:var(--text2);font-weight:bold">${dispName}</span>
                            <input type="number" class="pi p-multi-cons" data-id="${node.id}" data-grp="${g}" style="width:40px;padding:2px 4px;font-size:10px;text-align:center" min="0" value="${val}">
                         </div>`;
        });
        html += `</div></div>`;
      });
      html += `</div></div>`;
    }

    html += `<div style="display:flex;gap:5px"><button class="bprop bdup" onclick="copyEl();pasteEl()">⧉ Duplică Toate</button><button class="bprop bdel" onclick="delSel()">🗑 Șterge Toate</button></div>`;
    pb.innerHTML = html;

    // Attach event listeners for multi-selection
    if (selCns.length > 0) {
      const updMultiCn = (k, v) => {
        if (v === "") return;
        saveState('editare multipla');
        CN.forEach(c => { if (multiSel.has(c.id)) c[k] = v; });
        render();
      };
      document.getElementById('pm-cgroup')?.addEventListener('change', ev => updMultiCn('circuitGroup', ev.target.value));
      document.getElementById('pm-tc')?.addEventListener('change', ev => updMultiCn('tipConductor', ev.target.value));
      document.getElementById('pm-sec')?.addEventListener('change', ev => { if(ev.target.value !== "") updMultiCn('sectiune', parseFloat(ev.target.value)); });
      document.getElementById('pm-tr')?.addEventListener('change', ev => updMultiCn('tipRetea', ev.target.value));
      document.getElementById('pm-lt')?.addEventListener('change', ev => updMultiCn('lineType', ev.target.value));
      buildColors(null, c => {
        saveState('culoare multipla');
        multiSel.forEach(id => {
          const el = EL.find(e => e.id === id);
          if (el) el.color = c;
          const cn = CN.find(x => x.id === id);
          if (cn) cn.color = c;
        });
        render();
      }, 'pm-c-row-color', false);
    }

    // Multi-stare handler
    document.getElementById('pm-stare')?.addEventListener('change', ev => {
      const v = ev.target.value;
      if (!v) return;
      saveState('stare multiplă');
      const colorMap = { proiectat_racordare: '#ef4444', intarire_inlocuire: '#a855f7', intarire_nou: '#3b82f6', coexistenta: '#eab308', demontat: '#6b7280' };
      multiSel.forEach(id => {
        const el = EL.find(e => e.id === id);
        if (el) {
          if (v === 'coexistenta' && !el.type.startsWith('stalp_')) return;
          el.stare = v; if (colorMap[v]) el.color = colorMap[v];
          if (v === 'existent') el.color = null;
        }
        const cn = CN.find(c => c.id === id);
        if (cn) {
          if (v === 'coexistenta') return;
          if (v === 'intarire_inlocuire' && (!cn.stare || cn.stare === 'existent') && !cn.oldTipConductor) {
            cn.oldTipConductor = cn.tipConductor || 'Clasic Al';
            cn.oldSectiune = cn.sectiune || 16;
            cn.oldTipRetea = cn.tipRetea || 'Trifazat';
          }
          cn.stare = v; if (colorMap[v]) cn.color = colorMap[v];
          if (v === 'existent' || v === 'intarire_nou') { if(v=='existent') cn.color = '#ef4444'; delete cn.oldTipConductor; delete cn.oldSectiune; delete cn.oldTipRetea; }
        }
      });
      render(); updateProps();
    });

    if (selNodes.length > 0) {
      document.querySelectorAll('.p-multi-cons').forEach(inp => {
        inp.addEventListener('input', ev => {
          const id = parseInt(ev.target.dataset.id);
          const grp = ev.target.dataset.grp;
          const val = parseInt(ev.target.value) || 0;
          const node = EL.find(e => e.id === id);
          if (node) {
            if (!node.cons_dict) node.cons_dict = {};
            node.cons_dict[grp] = val;
            let total = 0; for(let key in node.cons_dict) total += node.cons_dict[key];
            node.consumatori = total;
            render();
          }
        });
        inp.addEventListener('change', () => saveState('editare consumatori multipla'));
      });
    }
    return;
  }

  // SINGLE SELECTION
  const el = EL.find(x => x.id === sel);
  const cn = CN.find(x => x.id === sel);
  if (!el && !cn) { pEl.classList.add('hidden'); return; }
  pEl.classList.remove('hidden');
  document.getElementById('ps').textContent = `ID·${(el||cn).id}`;
  document.getElementById('pt').textContent = el ? 'ELEMENT' : 'CONEXIUNE';

  if (el) {
    let html = '';
    // Element label & rotation
    html += `<div class="p-sec"><div class="psh">⚙ ${ELEMENT_TYPES[el.type]?.name || el.type}</div>
      <div class="pr"><div class="pl">Etichetă</div><input class="pi" id="p-label" value="${el.label||''}"></div>
      <div class="pr"><div class="pl">Rotație (°)</div><input class="pi" type="number" id="p-rot" value="${el.rotation||0}" min="0" max="359" step="15"></div>`;

    // Consumatori for stalp_*, firida_* (nodes)
    if (el.type.startsWith('stalp_') || el.type.startsWith('firida_')) {
      if (!el.cons_dict) el.cons_dict = {};
      if (!el.consumatori) el.consumatori = 0;
      const groups = Object.keys(el.cons_dict).length > 0 ? Object.keys(el.cons_dict) : ['Implicit'];
      html += `<div class="pr"><div class="pl">Consumatori</div><div style="display:flex;flex-direction:column;gap:4px">`;
      groups.forEach(g => {
        const val = el.cons_dict[g] || 0;
        html += `<div style="display:flex;align-items:center;gap:4px"><span style="font-size:8px;color:var(--text3);min-width:28px">${g}:</span><input type="number" class="pi p-cons" data-grp="${g}" style="width:50px;font-size:10px" min="0" value="${val}"></div>`;
      });
      html += `</div></div>`;
      if (el.type === 'stalp_cs') {
        html += `<div class="pr"><div class="pl">Fusibil CS (A)</div><input class="pi" type="number" id="p-cs-fuse" value="${el.cs_fuse||100}" min="0" step="10"></div>`;
      }
    }

    // Fuses for firida_*, cd*, ptab_*
    if (el.type.startsWith('firida_') || el.type.startsWith('cd') || el.type.startsWith('ptab_')) {
      const nf = el.type.startsWith('cd') ? parseInt(el.type.replace('cd','')) : (el.type==='ptab_1t'?10:(el.type==='ptab_2t'?21:el.fuses?.length||0));
      const fuses = el.fuses || new Array(nf).fill(true);
      html += `<div class="p-sec"><div class="psh">🔥 Fuzioane</div><div style="display:flex;flex-wrap:wrap;gap:4px">`;
      for (let i = 0; i < nf; i++) {
        const on = fuses[i] !== false;
        const bgC = on ? 'var(--accent)' : 'var(--danger)';
        const txC = on ? 'var(--bg)' : '#fff';
        const label = el.type.startsWith('cd') ? 'C'+(i+1) : 'T'+(i+1);
        html += '<div onclick="toggleFuse(' + el.id + ',' + i + ')" style="padding:3px 6px;border-radius:4px;cursor:pointer;font-size:8px;font-weight:700;background:' + bgC + ';color:' + txC + '">' + label + '</div>';

      }
      html += `</div></div>`;
    }

    // Transformer text for ptab_*, trafo
    if (el.type.startsWith('ptab_') || el.type === 'trafo') {
      const t = el.trText || { mv:'In=16A', type:'TTU ONAN', power:'250kVA', volt:'20/0.4kV', lv:'400A' };
      html += `<div class="p-sec"><div class="psh">⚡ Transformator</div>
        <div class="pr"><div class="pl">MVA / Tip</div><input class="pi" id="p-tr-mv" value="${t.mv||''}" style="font-size:10px"></div>
        <div class="pr"><div class="pl">Putere / Tip</div><input class="pi" id="p-tr-power" value="${t.power||''}" style="font-size:10px"></div>
        <div class="pr"><div class="pl">Tensiune</div><input class="pi" id="p-tr-volt" value="${t.volt||''}" style="font-size:10px"></div>
        <div class="pr"><div class="pl">I_n jos (A)</div><input class="pi" id="p-tr-lv" value="${t.lv||''}" style="font-size:10px"></div></div>`;
    }

    // BMPT text
    if (el.type === 'meter') {
      html += `<div class="p-sec"><div class="psh">⚡ Contor</div>
        <div class="pr"><div class="pl">Text BMPT</div><input class="pi" id="p-bmpt-text" value="${el.bmptText||''}" style="font-size:10px"></div></div>`;
    }

    // Stare
    const stare = el.stare || 'existent';
    html += `<div class="p-sec"><div class="psh">📌 Stare</div>
      <div class="pr"><div class="pl">Stare element</div><select class="pi" id="p-stare" style="font-weight:700;color:${stare=='proiectat_racordare'?'#ef4444':stare=='intarire_inlocuire'?'#a855f7':stare=='intarire_nou'?'#3b82f6':stare=='demontat'?'#6b7280':'var(--text)'}">
        <option value="existent" ${stare=='existent'?'selected':''}>✔ Existent</option>
        <option value="proiectat_racordare" ${stare=='proiectat_racordare'?'selected':''} style="color:#ef4444">🔴 Proiectat — Tarif Racordare</option>
        <option value="intarire_inlocuire" ${stare=='intarire_inlocuire'?'selected':''} style="color:#a855f7">🟣 Întărire — Înlocuire conductor</option>
        <option value="intarire_nou" ${stare=='intarire_nou'?'selected':''} style="color:#3b82f6">🔵 Întărire — Circuit/cablu nou</option>
        <option value="coexistenta" ${stare=='coexistenta'?'selected':''} style="color:#eab308">🟡 Lucrări Coexistență</option>
        <option value="demontat" ${stare=='demontat'?'selected':''} style="color:#6b7280">⛔ Demontat</option>
      </select></div></div>`;

    // Dimensions for rect / circle
    if (el.type === 'rect') {
      html += `<div class="p-sec"><div class="psh">📐 Dimensiuni</div>
        <div class="pr"><div class="pl">Lățime (px)</div><input class="pi" type="number" id="p-rect-w" value="${el.width||100}" min="10" step="10"></div>
        <div class="pr"><div class="pl">Înălțime (px)</div><input class="pi" type="number" id="p-rect-h" value="${el.height||100}" min="10" step="10"></div></div>`;
    }
    if (el.type === 'circle') {
      html += `<div class="p-sec"><div class="psh">📐 Dimensiuni</div>
        <div class="pr"><div class="pl">Rază (px)</div><input class="pi" type="number" id="p-circle-r" value="${el.r||50}" min="10" step="5"></div></div>`;
    }

    // Scale
    if (el.scale !== undefined) {
      html += `<div class="pr"><div class="pl">Scalare</div><input class="pi" type="number" id="p-scale" value="${el.scale||1}" min="0.1" max="5" step="0.1"></div>`;
    }

    // Colors
    html += `<div class="p-sec"><div class="psh">🎨 Culori</div>
      <div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="p-row-color"></div></div>
      <div class="pr"><div class="pl">Culoare Fundal</div><div class="crow" id="p-row-fill"></div></div></div>`;

    // Line type & stroke for applicable elements
    if (el.type !== 'cd4' && el.type !== 'cd5' && el.type !== 'cd8' && !el.type.startsWith('ptab_') && el.type !== 'trafo' && el.type !== 'meter') {
      const lt = el.lineType || 'solid';
      const sw = el.strokeWidth || 2;
      html += `<div class="p-sec"><div class="psh">✏️ Linie</div>
        <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="p-lt">
          <option value="solid" ${lt==='solid'?'selected':''}>Continuă</option>
          <option value="dashed" ${lt==='dashed'?'selected':''}>Întreruptă</option>
        </select></div>
        <div class="pr"><div class="pl">Grosime (px)</div><input class="pi" type="number" id="p-sw" value="${sw}" min="1" max="10" step="1"></div></div>`;
    }

    // Delete button
    html += `<div style="display:flex;gap:5px;margin-top:8px"><button class="bprop bdel" onclick="delSel()">🗑️ Șterge Element</button></div>`;

    // Circuit info for CD/PTAB types
    if (el.type === 'cd4' || el.type === 'cd5' || el.type === 'cd8' || el.type === 'ptab_2t' || el.type === 'ptab_1t') {
      const np = el.type === 'ptab_2t' ? 16 : (el.type === 'ptab_1t' ? 8 : parseInt(el.type.replace('cd','')));
      let rows = '';
      for (let i = 1; i <= np; i++) {
        const chain = getCircuitChain(el.id, i);
        if (chain.cables.length === 0) {
          rows += `<tr style="opacity:.35"><td style="color:var(--accent);font-weight:700;padding:3px 4px">C${i}</td><td colspan="3" style="padding:3px 4px;color:var(--text3)">— neconectat —</td></tr>`;
        } else {
          rows += `<tr style="border-top:1px solid var(--border2)"><td style="color:var(--accent);font-weight:700;padding:3px 4px;vertical-align:top">C${i}</td><td colspan="3" style="padding:1px 4px">`;
          if (chain.branches.length === 0) {
            rows += `<div style="display:flex;gap:6px;align-items:center;padding:2px 0"><span style="color:var(--accentg);font-weight:700">${chain.totalLength.toFixed(1)}m</span>${chain.totalConsumatori>0?`<span style="color:#ff9f43;font-weight:700">👥${chain.totalConsumatori}</span>`:''}<span style="color:var(--text2);font-size:7px">${chain.elements.map(e=>e.label||'?').join('→')||'—'}</span></div>`;
          } else {
            chain.branches.forEach((br, bi) => {
              const isMulti = chain.branches.length > 1;
              rows += `<div style="display:flex;gap:5px;align-items:center;padding:2px 0;${isMulti&&bi>0?'border-top:1px dashed var(--border)':''}">${isMulti?`<span style="color:var(--text3);font-size:7px;min-width:14px">↳</span>`:''}<span style="color:var(--accentg);font-weight:700;min-width:36px">${br.length.toFixed(1)}m</span>${br.consumatori>0?`<span style="color:#ff9f43;font-weight:700">👥${br.consumatori}</span>`:''}<span style="color:var(--text2);font-size:7px;word-break:break-all">${br.path.join('→')||'—'}</span></div>`;
            });
          }
          rows += `</td></tr>`;
        }
      }
      html += `<div class="p-sec"><div class="psh">⚡ Circuite CD — trasee &amp; derivații</div><div style="padding:4px 6px"><table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:8px"><tr><th style="text-align:left;padding:3px 4px;color:var(--text3);width:28px">Circ.</th><th style="text-align:left;padding:3px 4px;color:var(--text3)">Derivații / Lungime / Traseu</th></tr>${rows}</table></div></div>`;
    }

    pb.innerHTML = html;
    // Attach event listeners
    document.getElementById('p-label')?.addEventListener('input', ev => updSel('label', ev.target.value));
    document.getElementById('p-rot')?.addEventListener('input', ev => setRotationAbs(parseFloat(ev.target.value)||0));
    document.getElementById('p-stare')?.addEventListener('change', ev => {
      const v = ev.target.value;
      saveState('stare element');
      const colorMap = { proiectat_racordare:'#ef4444', intarire_inlocuire:'#a855f7', intarire_nou:'#3b82f6', coexistenta:'#eab308', demontat:'#6b7280' };
      el.stare = v; if (colorMap[v]) el.color = colorMap[v]; if (v==='existent') el.color = null;
      render(); updateProps();
    });
    document.getElementById('p-scale')?.addEventListener('input', ev => updSel('scale', parseFloat(ev.target.value)||1));
    document.getElementById('p-sw')?.addEventListener('input', ev => updSel('strokeWidth', parseInt(ev.target.value)||2));
    document.getElementById('p-lt')?.addEventListener('change', ev => updSel('lineType', ev.target.value));
    document.getElementById('p-rect-w')?.addEventListener('input', ev => updSel('width', parseFloat(ev.target.value)||100));
    document.getElementById('p-rect-h')?.addEventListener('input', ev => updSel('height', parseFloat(ev.target.value)||100));
    document.getElementById('p-circle-r')?.addEventListener('input', ev => updSel('r', parseFloat(ev.target.value)||50));
    document.getElementById('p-cs-fuse')?.addEventListener('input', ev => updSel('cs_fuse', parseFloat(ev.target.value)||100));
    document.getElementById('p-tr-mv')?.addEventListener('input', ev => {
      if (!el.trText) el.trText = {}; el.trText.mv = ev.target.value;
      render();
    });
    document.getElementById('p-tr-power')?.addEventListener('input', ev => {
      if (!el.trText) el.trText = {}; el.trText.power = ev.target.value;
      render();
    });
    document.getElementById('p-tr-volt')?.addEventListener('input', ev => {
      if (!el.trText) el.trText = {}; el.trText.volt = ev.target.value;
      render();
    });
    document.getElementById('p-tr-lv')?.addEventListener('input', ev => {
      if (!el.trText) el.trText = {}; el.trText.lv = ev.target.value;
      render();
    });
    document.getElementById('p-bmpt-text')?.addEventListener('input', ev => updSel('bmptText', ev.target.value));
    document.querySelectorAll('.p-cons').forEach(inp => {
      inp.addEventListener('input', ev => {
        const grp = ev.target.dataset.grp;
        if (!el.cons_dict) el.cons_dict = {};
        el.cons_dict[grp] = parseFloat(ev.target.value)||0;
        let total = 0; for(let k in el.cons_dict) total += el.cons_dict[k];
        el.consumatori = total;
        render();
      });
    });
    buildColors(el.color, c => { updSel('color', c); render(); }, 'p-row-color', false);
    buildColors(el.fillColor||'none', c => { updSel('fillColor', c==='none'?c:''); render(); }, 'p-row-fill', true);
  }

  // Connection properties (if a connection is selected)
  if (cn) {
    const tcOpts = ['Clasic Al','Torsadat Al','Cablu Al','Cablu Cu'];
    const secOpts = [2.5,4,6,10,16,25,35,50,70,95,120,150,185,240];
    const availSec = Object.keys(R0_TABLES[cn.tipConductor||'Clasic Al']||{}).map(Number).sort((a,b)=>a-b);
    const secOptHtml = secOpts.map(s=> `<option value="${s}" ${parseFloat(cn.sectiune||16)===s?'selected':''} ${!availSec.includes(s)?'disabled style="color:#555"':''}>${s} mm²</option>`).join('');
    const r0val = getR0(cn.tipConductor||'Clasic Al', parseFloat(cn.sectiune)||16);
    const r0disp = r0val ? (r0val/1000).toFixed(4)+' Ω/km' : '—';
    const cnStare = cn.stare || 'existent';

    pb.innerHTML += `
      <div class="p-sec"><div class="psh">📐 Identificare & Rute</div>
        <div class="pr"><div class="pl">Etichetă Cablu</div><input class="pi" id="p-cl" value="${cn.label||''}"></div>
        <div class="pr"><div class="pl">Stare</div><select class="pi" id="p-cn-stare" style="font-weight:700;color:${cnStare=='proiectat_racordare'?'#ef4444':cnStare=='intarire_inlocuire'?'#a855f7':cnStare=='intarire_nou'?'#3b82f6':cnStare=='demontat'?'#6b7280':'var(--text)'}">
          <option value="existent" ${cnStare=='existent'?'selected':''}>✔ Existent</option>
          <option value="proiectat_racordare" ${cnStare=='proiectat_racordare'?'selected':''} style="color:#ef4444">🔴 Proiectat — Tarif Racordare</option>
          <option value="intarire_inlocuire" ${cnStare=='intarire_inlocuire'?'selected':''} style="color:#a855f7">🟣 Întărire — Înlocuire conductor</option>
          <option value="intarire_nou" ${cnStare=='intarire_nou'?'selected':''} style="color:#3b82f6">🔵 Întărire — Circuit/cablu nou</option>
          <option value="demontat" ${cnStare=='demontat'?'selected':''} style="color:#6b7280">⛔ Demontat</option>
        </select></div>
        ${cn.stare === 'intarire_inlocuire' && cn.oldTipConductor ? `<div class="pr" style="border-left:3px solid #a855f7;padding-left:8px;background:rgba(168,85,247,.05)"><div class="pl" style="color:#a855f7">Conductor vechi (înlocuit)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#a855f7;padding:4px 7px">${cn.oldTipConductor} ${cn.oldSectiune} mm² — ${cn.oldTipRetea||'Trifazat'}</div><div style="font-size:7px;color:var(--text3);margin-top:2px">Setează mai jos noul tip de conductor. Căderea de tensiune va folosi valorile noi.</div></div>` : ''}
        <div class="pr"><div class="pl">Grup Circuit (pt. stâlpi comuni)</div><input class="pi" id="p-cgroup" value="${cn.circuitGroup||''}" placeholder="Ex: C3, Iluminat..."><div style="font-size:7px;color:var(--text3);margin-top:2px">Dată este completat, căderea de tensiune va urmări doar cablurile din același grup.</div></div>
        <div class="pr"><div class="pl">Lungime tronson (m)</div><div style="display:flex;gap:4px"><input class="pi" type="number" id="p-len" value="${cn.length||''}" style="flex:1"><button class="t2" style="height:23px;padding:0 6px;min-width:auto;border-color:var(--border2);background:var(--bg3);color:var(--accent)" onclick="updSel('length', parseFloat((calcPathLen(CN.find(x=>x.id===${cn.id}).path)/pxPerMeter).toFixed(1))" title="Recalculează distanța din desen">📐 Auto</button></div></div>
      </div>
      <div class="p-sec"><div class="psh">⚡ Conductor — Conform PE 132/2003</div>
        <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="p-tc">${tcOpts.map(t=>`<option value="${t}" ${(cn.tipConductor||'Clasic Al')===t?'selected':''}>${t}</option>`).join('')}</select></div>
        <div class="pr"><div class="pl">Secțiune (mm²)</div><select class="pi" id="p-sec">${secOptHtml}</select></div>
        <div class="pr"><div class="pl">Tip rețea</div><select class="pi" id="p-tr"><option value="Trifazat" ${cn.tipRetea||'Trifazat'==='Trifazat'?'selected':''}>Trifazat (3×Un=0.4kV)</option><option value="Bifazat" ${cn.tipRetea==='Bifazat'?'selected':''}>Bifazat (2×Un=0.4kV)</option><option value="Monofazat" ${cn.tipRetea==='Monofazat'?'selected':''}>Monofazat (Un=0.23kV)</option></select></div>
        <div class="pr"><div class="pl">r₀ (rezistență specifică)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accentg);padding:4px 7px">${r0disp}</div></div>
        <div class="pr"><div class="pl">Putere concentrată nod final (kW)</div><input class="pi" type="number" step="0.1" id="p-pc" value="${cn.putereConc||0}"></div>
      </div>
      <div class="p-sec"><div class="psh">🖊 Afișare</div>
        <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="p-lt"><option value="solid" ${cn.lineType!='dashed'?'selected':''}>Continuă</option><option value="dashed" ${cn.lineType=='dashed'?'selected':''}>Întreruptă</option></select></div>
        <div class="pr"><div class="pl">Grosime linie (px)</div><input class="pi" type="number" id="p-sw" min="1" max="20" value="${cn.strokeWidth||2}"></div>
        <div class="pr"><div class="pl">⚡ Direcție flux putere</div><select class="pi" id="p-flow">
          <option value="" ${!cn.flowDir?'selected':''}>— Fără aninație —</option>
          <option value="fwd" ${cn.flowDir=='fwd'?'selected':''}>▶ Normal (de la sursă)</option>
          <option value="rev" ${cn.flowDir=='rev'?'selected':''}>◀ Invers (spre sursă)</option>
        </select></div>
      </div>
      <div class="p-sec"><div class="psh">Culori</div><div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="p-c-row-color"></div></div>
        <div class="pr"><div class="pl">Highlight / Fundal</div><div class="crow" id="p-c-row-fill"></div></div>
      </div>
      <button class="bprop bdel" onclick="delSel()">🗑 Șterge Cablu</button>`;

    // Attach event listeners for connection properties
    document.getElementById('p-cl')?.addEventListener('input', ev => updSel('label', ev.target.value));
    document.getElementById('p-cn-stare')?.addEventListener('change', ev => {
      const v = ev.target.value;
      saveState('schimbare stare cablu');
      if (v === 'intarire_inlocuire' && (!cn.stare || cn.stare === 'existent') && !cn.oldTipConductor) {
        cn.oldTipConductor = cn.tipConductor || 'Clasic Al';
        cn.oldSectiune = cn.sectiune || 16;
        cn.oldTipRetea = cn.tipRetea || 'Trifazat';
      }
      cn.stare = v;
      if (v === 'proiectat_racordare') cn.color = '#ef4444';
      else if (v === 'intarire_inlocuire') cn.color = '#a855f7';
      else if (v === 'intarire_nou') cn.color = '#3b82f6';
      else if (v === 'demontat') cn.color = '#6b7280';
      else if (v === 'existent' || v === 'intarire_nou') { if(v=='existent') cn.color = '#ef4444'; delete cn.oldTipConductor; delete cn.oldSectiune; delete cn.oldTipRetea; }
      render(); updateProps();
    });
    document.getElementById('p-cgroup')?.addEventListener('input', ev => updSel('circuitGroup', ev.target.value));
    document.getElementById('p-len')?.addEventListener('input', ev => updSel('length', parseFloat(ev.target.value)||0));
    document.getElementById('p-tc')?.addEventListener('change', ev => { updSel('tipConductor', ev.target.value); setTimeout(()=>{updateProps();},50); });
    document.getElementById('p-sec')?.addEventListener('change', ev => { updSel('sectiune', parseFloat(ev.target.value)); const r0=getR0(cn.tipConductor||'Clasic Al',parseFloat(ev.target.value)); const d=document.getElementById('p-r0disp'); if(d) d.textContent=r0?(r0/1000).toFixed(4)+' Ω/km':'—'; });
    document.getElementById('p-tr')?.addEventListener('change', ev => updSel('tipRetea', ev.target.value));
    document.getElementById('p-sw')?.addEventListener('input', ev => updSel('strokeWidth', parseInt(ev.target.value)||2));
    document.getElementById('p-pc')?.addEventListener('input', ev => updSel('putereConc', parseFloat(ev.target.value)||0));
    document.getElementById('p-flow')?.addEventListener('change', ev => { updSel('flowDir', ev.target.value); renderFlowLayer(); });
    buildColors(cn.color, c => updSel('color', c), 'p-c-row-color', false);
    buildColors(cn.fillColor, c => updSel('fillColor', c), 'p-c-row-fill', true);
  }
}

// ========== Populate Callbacks ==========

callbacks.updateProps = updateProps;
callbacks.updateStat = updateStat;
callbacks.buildColors = buildColors;
callbacks.setMultiFlow = setMultiFlow;

// Make functions available globally (for HTML event handlers)
if (typeof window !== 'undefined') {
  window.setMultiFlow = setMultiFlow;
  window.buildColors = buildColors;
  window.updateProps = updateProps;
}


// ========== Set Status Bar Text ==========

export function setStat() {
  const N = { select: 'SELECT', connect: 'CONNECT', draw_poly: 'LINIE LIBERĂ', place: 'PLASARE', calibrate: 'CALIBRARE', export_box: 'EXPORT SELECTIE' };
  const stmode = document.getElementById('stmode');
  if (stmode) stmode.textContent = N[mode] || mode.toUpperCase();
}

// ========== Toggle Flow Animation ==========

export function toggleFlowAnim() {
  const flowAnimOn = !window.flowAnimOn;
  window.flowAnimOn = flowAnimOn;
  const btn = document.getElementById('btn-flow');
  btn.classList.toggle('on', flowAnimOn);
  btn.style.background = flowAnimOn ? 'rgba(234,179,8,.15)' : '';
  btn.style.color = flowAnimOn ? '#eab308' : '';
  btn.style.borderColor = flowAnimOn ? 'rgba(234,179,8,.45)' : '';
  if (window.renderFlowLayer) window.renderFlowLayer();
  toast(flowAnimOn ? '⚡ Animație flux activată' : 'Animație flux oprită', flowAnimOn ? 'ok' : '');
}

// ========== Toggle Theme ==========

export function toggleTheme() {
  const lightMode = !window.lightMode;
  window.lightMode = lightMode;
  document.documentElement.setAttribute('data-theme', lightMode ? 'light' : '');
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = lightMode ? '☀️' : '🌙';
  if (window.render) window.render();
  toast(lightMode ? '☀️ Temă luminoasă' : '🌙 Temă întunecată', 'ok');
}

// ========== Clear All ==========

export function clearAll() {
  if (!confirm('Ești sigur că vrei să ștergi TOATĂ planșa?')) return;
  if (window.saveState) window.saveState('clear');
  window.EL.length = 0;
  window.CN.length = 0;
  window.sel = null;
  window.multiSel?.clear();
  if (window.counters) Object.keys(window.counters).forEach(k => delete window.counters[k]);
  window.vdResults = null;
  document.getElementById('VD-OVL')?.remove();
  if (window.render) window.render();
  if (window.updateProps) window.updateProps();
  if (window.updateStat) window.updateStat();
  toast('Planșa a fost ștearsă!', 'ok');
}

// ========== Background Panel Functions ==========

export function toggleBgPanel() {
  const p = document.getElementById('bg-panel');
  if (p) p.style.display = p.style.display === 'flex' ? 'none' : 'flex';
}

export function loadBg(inp) {
  const f = inp.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      setBgData({
        url: e.target.result,
        x: -img.width / 2,
        y: -img.height / 2,
        w: img.width,
        h: img.height,
        op: parseFloat(document.getElementById('bg-op').value),
        locked: document.getElementById('bg-lock').checked
      });
      renderBg();
      toast('Fundal încărcat! Îl poți calibra pentru o distanță exactă.', 'ok');
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(f);
  inp.value = '';
}

export function updateBgOp(val) {
  bgData.op = parseFloat(val);
  const img = document.getElementById('html-bg-img');
  if (img) img.style.opacity = bgData.op;
}

export function updateBgLock(val) {
  bgData.locked = val;
}

export function clearBg() {
  if (!confirm('Ștergi fundalul cadastral?')) return;
  setBgData({ url: null, x:0, y:0, w:0, h:0, op:0.5, locked: true });
  renderBg();
}

export function startCalib() {
  if (!bgData.url) { toast('Încărcați un fundal mai întâi!', 'ac'); return; }
  setMode('calibrate');
  toast('Click P1, apoi P2 pe hartă.', 'ac');
}

export function confirmCalib() {
  const d_m = document.getElementById('calib-input').value;
  if (d_m && !isNaN(parseFloat(d_m)) && parseFloat(d_m) > 0) {
    const target_px = parseFloat(d_m) * pxPerMeter;
    const scale = target_px / tempCalibLenPx;
    if (bgData.url) {
      bgData.w *= scale; bgData.h *= scale;
      bgData.x = calibPts[0].x - (calibPts[0].x - bgData.x) * scale;
      bgData.y = calibPts[0].y - (calibPts[0].y - bgData.y) * scale;
      renderBg();
      toast('Scară fundal calibrată cu succes!', 'ok');
    }
  } else {
    toast('Calibrare anulată (valoare invalidă).', 'w');
  }
  closeCalib();
}

export function closeCalib() {
  const modal = document.getElementById('calib-modal');
  if (modal) modal.style.display = 'none';
  setMode('select');
  setCalibPts([]);
  setTempCalibLenPx(0);
  const tpoly = document.getElementById('tpoly');
  if (tpoly) tpoly.style.display = 'none';
}
