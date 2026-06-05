import { S } from './state.js';
import { R0_TABLES } from './config.js';
import { getPoleData, CONSOLE_CATALOG } from './pole-catalog.js';
import { getR0, getKs, getX0, calcDU_tronson } from './calculations.js';
import { sym, symW, symH, isConnectionActive, nextLbl } from './elements.js';
import { render, renderFlowLayer, renderVDOverlay } from './renderer.js';
import { saveState, updSel, setRotationAbs, updateConnectedCables, delSel, copyEl, pasteEl, selectEl, addMTSpanFrom } from './element-manager.js';
import { getCircuitChain } from './interaction.js';
import { toast, updateStat, applyView, calcPathLen, uid } from './utils.js';

export function updateProps() {
  const pEl = document.getElementById('props'), pb = document.getElementById('pb');
  if (!S.sel && S.multiSel.size === 0) { pEl.classList.add('hidden'); return; }
  if (!S.sel && S.multiSel.size > 0) {
    pEl.classList.remove('hidden');
    document.getElementById('ps').textContent = `${S.multiSel.size} elem. selectate`;
    document.getElementById('pt').textContent = 'SELECȚIE MULTIPLA';

    let html = `<div class="psec" style="padding:10px"><div style="color:var(--text2);font-size:10px;line-height:1.6"><b style="color:var(--accent)">${S.multiSel.size}</b> elemente selectate<br>Trage pentru mutare grupată<br><span style="color:var(--text3)">CTRL+click pentru adăugare/eliminare</span></div>
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

    const selCns = S.CN.filter(c => S.multiSel.has(c.id));
    if (selCns.length > 0) {
      const tcOpts = ['Clasic Al', 'Torsadat Al', 'Cablu Al', 'Cablu Cu', 'OL-AL'];
      const secOpts = [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
      const secOptHtml = secOpts.map(s => `<option value="${s}">${s} mm²</option>`).join('');
      html += `<div class="psec"><div class="psh">⚡ Editare Multiplă Cabluri (${selCns.length})</div>
        <div class="pr"><div class="pl">Grup Circuit</div><input class="pi" id="pm-cgroup" placeholder="Tastează și apasă Enter..."></div>
        <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="pm-tc"><option value="">-- Nu modifica --</option>${tcOpts.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
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
        <div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="pm-crow-color"></div></div>
      </div>`;
    }

    const selNodes = S.EL.filter(e => S.multiSel.has(e.id) && (e.type.startsWith('stalp_') || e.type.startsWith('firida_')));
    if (selNodes.length > 0) {
      html += `<div class="psec"><div class="psh">👥 Editare Rapidă Consumatori (${selNodes.length})</div><div style="padding:6px;max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">`;
      selNodes.forEach(node => {
        const connectedCables = S.CN.filter(c => c.fromElId === node.id || c.toElId === node.id || c.from === node.id);
        let groups = [...new Set(connectedCables.map(c => (c.circuitGroup && c.circuitGroup.trim() !== '') ? c.circuitGroup.trim() : 'Implicit'))];
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

    if (selCns.length > 0) {
      const updMultiCn = (k, v) => {
        if (v === '') return;
        saveState('editare multipla');
        S.CN.forEach(c => { if (S.multiSel.has(c.id)) c[k] = v; });
        render();
      };
      document.getElementById('pm-cgroup').addEventListener('change', ev => updMultiCn('circuitGroup', ev.target.value));
      document.getElementById('pm-tc').addEventListener('change', ev => updMultiCn('tipConductor', ev.target.value));
      document.getElementById('pm-sec').addEventListener('change', ev => { if (ev.target.value !== '') updMultiCn('sectiune', parseFloat(ev.target.value)); });
      document.getElementById('pm-tr').addEventListener('change', ev => updMultiCn('tipRetea', ev.target.value));
      document.getElementById('pm-lt').addEventListener('change', ev => updMultiCn('lineType', ev.target.value));
      buildColors(null, c => {
        saveState('culoare multipla');
        S.multiSel.forEach(id => {
          const el = S.EL.find(e => e.id === id);
          if (el) el.color = c;
          const cn = S.CN.find(x => x.id === id);
          if (cn) cn.color = c;
        });
        render();
      }, 'pm-crow-color', false);
    }

    document.getElementById('pm-stare')?.addEventListener('change', ev => {
      const v = ev.target.value;
      if (!v) return;
      saveState('stare multiplă');
      const colorMap = { proiectat_racordare: '#ef4444', intarire_inlocuire: '#a855f7', intarire_nou: '#3b82f6', coexistenta: '#eab308', demontat: '#6b7280' };
      S.multiSel.forEach(id => {
        const el = S.EL.find(e => e.id === id);
        if (el) {
          if (v === 'coexistenta' && !el.type.startsWith('stalp_')) return;
          el.stare = v; if (colorMap[v]) el.color = colorMap[v];
          if (v === 'existent') el.color = null;
        }
        const cn = S.CN.find(c => c.id === id);
        if (cn) {
          if (v === 'coexistenta') return;
          if (v === 'intarire_inlocuire' && (!cn.stare || cn.stare === 'existent') && !cn.oldTipConductor) {
            cn.oldTipConductor = cn.tipConductor || 'Clasic Al';
            cn.oldSectiune = cn.sectiune || 16;
            cn.oldTipRetea = cn.tipRetea || 'Trifazat';
          }
          cn.stare = v; if (colorMap[v]) cn.color = colorMap[v];
          if (v === 'existent' || v === 'intarire_nou') { if (v === 'existent') cn.color = '#ef4444'; delete cn.oldTipConductor; delete cn.oldSectiune; delete cn.oldTipRetea; }
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
          const node = S.EL.find(e => e.id === id);
          if (node) {
            if (!node.cons_dict) node.cons_dict = {};
            node.cons_dict[grp] = val;
            let total = 0; for (let key in node.cons_dict) total += node.cons_dict[key];
            node.consumatori = total;
            render();
          }
        });
        inp.addEventListener('change', () => saveState('editare consumatori multipla'));
      });
    }
    return;
  }

  const el = S.EL.find(x => x.id === S.sel), cn = S.CN.find(x => x.id === S.sel);
  if (!el && !cn) { pEl.classList.add('hidden'); return; }
  pEl.classList.remove('hidden');
  document.getElementById('ps').textContent = `ID·${(el || cn).id}`;
  document.getElementById('pt').textContent = el ? 'ELEMENT' : 'CONEXIUNE';

  if (el) {
    let circuitHtml = '';
    if (el.type === 'cd4' || el.type === 'cd5' || el.type === 'cd8' || el.type === 'ptab_2t' || el.type === 'ptab_1t') {
      const np = el.type === 'ptab_2t' ? 16 : (el.type === 'ptab_1t' ? 8 : parseInt(el.type.replace('cd', '')));
      let rows = '';
      for (let i = 1; i <= np; i++) {
        const chain = getCircuitChain(el.id, i), hasData = chain.cables.length > 0;
        if (!hasData) {
          rows += `<tr style="opacity:.35"><td style="color:var(--accent);font-weight:700;padding:3px 4px">C${i}</td><td colspan="3" style="padding:3px 4px;color:var(--text3)">— neconectat —</td></tr>`;
        } else {
          rows += `<tr style="border-top:1px solid var(--border2)"><td style="color:var(--accent);font-weight:700;padding:3px 4px;vertical-align:top">C${i}</td><td colspan="3" style="padding:1px 4px">`;
          if (chain.branches.length === 0) {
            rows += `<div style="display:flex;gap:6px;align-items:center;padding:2px 0"><span style="color:var(--accentg);font-weight:700">${chain.totalLength.toFixed(1)}m</span>${chain.totalConsumatori > 0 ? `<span style="color:#ff9f43;font-weight:700">👥${chain.totalConsumatori}</span>` : ''}<span style="color:var(--text2);font-size:7px">${chain.elements.map(e => e.label || '?').join('→') || '—'}</span></div>`;
          } else {
            chain.branches.forEach((br, bi) => {
              const isMulti = chain.branches.length > 1;
              rows += `<div style="display:flex;gap:5px;align-items:center;padding:2px 0;${isMulti && bi > 0 ? 'border-top:1px dashed var(--border)' : ''}">${isMulti ? `<span style="color:var(--text3);font-size:7px;min-width:14px">↳</span>` : ''}<span style="color:var(--accentg);font-weight:700;min-width:36px">${br.length.toFixed(1)}m</span>${br.consumatori > 0 ? `<span style="color:#ff9f43;font-weight:700">👥${br.consumatori}</span>` : ''}<span style="color:var(--text2);font-size:7px;word-break:break-all">${br.path.join('→') || '—'}</span></div>`;
            });
          }
          rows += `</td></tr>`;
        }
      }
      circuitHtml = `<div class="psec"><div class="psh">⚡ Circuite CD — trasee &amp; derivații</div><div style="padding:4px 6px"><table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:8px"><tr><th style="text-align:left;padding:2px 4px;color:var(--text3);width:28px">Circ.</th><th style="text-align:left;padding:2px 4px;color:var(--text3)">Derivații / Lungime / Traseu</th></tr>${rows}</table></div></div>`;
    }

    let firidaHtml = '';
    if (el.type === 'cd4' || el.type === 'cd5' || el.type === 'cd8') {
      const np = parseInt(el.type.replace('cd', ''));
      if (!el.fuses) el.fuses = new Array(np + 1).fill(true);
      const f = el.fuses;
      let circRows = '';
      for (let i = 1; i <= np; i++) {
        const on = f[i] !== false;
        circRows += `<label style="display:flex;justify-content:space-between;align-items:center;background:${on ? 'var(--bg2)' : 'rgba(255,61,113,.07)'};padding:5px 8px;border-radius:5px;border:1px solid ${on ? 'var(--border2)' : 'rgba(255,61,113,.3)'};cursor:pointer;transition:all .15s">
          <span style="font-size:9px;font-weight:700;color:${on ? 'var(--text)' : 'var(--danger)'}">C${i} — ${on ? '✅ Închis' : '🔴 Deschis'}</span>
          <input type="checkbox" onchange="toggleFuse(${el.id},${i},this.checked)" ${on ? 'checked' : ''}></label>`;
      }
      firidaHtml = `<div class="psec"><div class="psh">🔌 Separatoare Circuite CD</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px">
        <div style="display:flex;gap:4px;margin-bottom:2px">
          <button onclick="cdAllFuses(${el.id},${np},true)" style="flex:1;padding:5px;border-radius:5px;border:1px solid rgba(0,229,160,.3);background:rgba(0,229,160,.08);color:var(--accentg);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">✅ Toate închise</button>
          <button onclick="cdAllFuses(${el.id},${np},false)" style="flex:1;padding:5px;border-radius:5px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">🔴 Toate deschise</button>
        </div>${circRows}</div></div>`;
    } else if (el.type.startsWith('firida_')) {
      const f = el.fuses || []; let numIn = 0, numOut = 0;
      if (el.type === 'firida_e2_4') { numIn = 2; numOut = 4; } else if (el.type === 'firida_e3_4') { numIn = 3; numOut = 4; } else if (el.type === 'firida_e3_0') { numIn = 3; numOut = 0; }
      else if (el.type === 'firida_e2_4_det') { numIn = 2; numOut = 4; }
      else if (el.type === 'firida_gen') { numIn = el.inputs || 2; numOut = el.outputs || 4; }
      const btnS = 'padding:2px 10px;border-radius:4px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);cursor:pointer;font-size:13px;font-weight:700;line-height:1';
      let counterHtml = '';
      if (el.type === 'firida_gen') {
        counterHtml = `<div style="display:flex;flex-direction:column;gap:6px;padding:8px 6px 4px">
          <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg2);padding:5px 8px;border-radius:5px;border:1px solid var(--border2)">
            <span style="font-size:9px;font-weight:700;color:var(--text2)">Intrări</span>
            <div style="display:flex;align-items:center;gap:6px">
              <button style="${btnS}" onclick="adjustFiridaCircuits(${el.id},'in',-1)">−</button>
              <span style="font-size:12px;font-weight:800;color:var(--accent);min-width:16px;text-align:center">${numIn}</span>
              <button style="${btnS}" onclick="adjustFiridaCircuits(${el.id},'in',1)">+</button>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg2);padding:5px 8px;border-radius:5px;border:1px solid var(--border2)">
            <span style="font-size:9px;font-weight:700;color:var(--text2)">Ieșiri</span>
            <div style="display:flex;align-items:center;gap:6px">
              <button style="${btnS}" onclick="adjustFiridaCircuits(${el.id},'out',-1)">−</button>
              <span style="font-size:12px;font-weight:800;color:var(--accent);min-width:16px;text-align:center">${numOut}</span>
              <button style="${btnS}" onclick="adjustFiridaCircuits(${el.id},'out',1)">+</button>
            </div>
          </div>
        </div>`;
        const ratings = el.ratings || [];
        const common = ['16A','25A','35A','50A','63A','80A','100A','125A','160A','200A','250A','315A','400A'];
        const dlId = `dl-rat-${el.id}`;
        const inSel = `<datalist id="${dlId}">${common.map(v=>`<option value="${v}">`).join('')}</datalist>`;
        let ratingRows = `${inSel}<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:6px 6px 2px">`;
        for (let i=0;i<numIn;i++) ratingRows += `<div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:8px;color:var(--text3)">Intr. ${i+1}</div><input list="${dlId}" style="background:var(--bg2);border:1px solid var(--border2);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%" value="${ratings[i]||'NH4-50A'}" onchange="setFiridaRating(${el.id},${i},this.value)"></div>`;
        for (let i=0;i<numOut;i++) ratingRows += `<div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:8px;color:var(--text3)">Plecare ${i+1}</div><input list="${dlId}" style="background:var(--bg2);border:1px solid var(--border2);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%" value="${ratings[numIn+i]||'NH4-50A'}" onchange="setFiridaRating(${el.id},${numIn+i},this.value)"></div>`;
        ratingRows += `</div>`;
        counterHtml += `<div style="padding:0 6px 4px"><div style="font-size:8px;font-weight:700;color:var(--text3);padding:4px 2px 2px">CURENȚI NOMINALI</div>${ratingRows}</div>`;
      }
      let inpHtml = '', outpHtml = '';
      for (let i = 0; i < numIn; i++) inpHtml += `<label style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:4px 6px;border-radius:4px;border:1px solid var(--border2);cursor:pointer"><span style="font-size:9px;color:var(--text2)">${numIn === 2 ? (i === 0 ? 'Intrare St' : 'Intrare Dr') : `Intrare ${i + 1}`}</span><input type="checkbox" onchange="toggleFuse(${el.id}, ${i}, this.checked)" ${f[i] !== false ? 'checked' : ''}></label>`;
      for (let i = 0; i < numOut; i++) outpHtml += `<label style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:4px 6px;border-radius:4px;border:1px solid var(--border2);cursor:pointer"><span style="font-size:9px;color:var(--text2)">Plecare ${i + 1}</span><input type="checkbox" onchange="toggleFuse(${el.id}, ${numIn + i}, this.checked)" ${f[numIn + i] !== false ? 'checked' : ''}></label>`;
      firidaHtml = `<div class="psec"><div class="psh">🔌 Siguranțe Firidă</div>${counterHtml}<div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${inpHtml}</div>${numOut > 0 ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${outpHtml}</div>` : ''}</div></div>`;
    } else if (el.type === 'ptab_1t') {
      const f = el.fuses || new Array(10).fill(true);
      let inpHtml = `<label class="flbl">MT Trafo <input type="checkbox" onchange="toggleFuse(${el.id}, 0, this.checked)" ${f[0] !== false ? 'checked' : ''}></label><label class="flbl">JT General <input type="checkbox" onchange="toggleFuse(${el.id}, 1, this.checked)" ${f[1] !== false ? 'checked' : ''}></label>`;
      let outpHtml = ''; for (let i = 0; i < 8; i++) outpHtml += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${2 + i}, this.checked)" ${f[2 + i] !== false ? 'checked' : ''}></label>`;
      firidaHtml = `<style>.flbl{display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:3px 5px;border-radius:4px;border:1px solid var(--border2);font-size:8.5px;color:var(--text);cursor:pointer}</style><div class="psec"><div class="psh">🔌 Siguranțe PTAB 1T</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${inpHtml}</div><div style="border-top:1px solid var(--border2);margin:4px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${outpHtml}</div></div></div>`;
    } else if (el.type === 'ptab_2t') {
      const f = el.fuses || new Array(21).fill(true);
      let tr1In = `<label class="flbl">MT Tr.1 <input type="checkbox" onchange="toggleFuse(${el.id}, 0, this.checked)" ${f[0] !== false ? 'checked' : ''}></label><label class="flbl">JT Gen.1 <input type="checkbox" onchange="toggleFuse(${el.id}, 1, this.checked)" ${f[1] !== false ? 'checked' : ''}></label>`;
      let tr1Out = ''; for (let i = 0; i < 8; i++) tr1Out += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${2 + i}, this.checked)" ${f[2 + i] !== false ? 'checked' : ''}></label>`;
      let tr2In = `<label class="flbl">MT Tr.2 <input type="checkbox" onchange="toggleFuse(${el.id}, 10, this.checked)" ${f[10] !== false ? 'checked' : ''}></label><label class="flbl">JT Gen.2 <input type="checkbox" onchange="toggleFuse(${el.id}, 11, this.checked)" ${f[11] !== false ? 'checked' : ''}></label>`;
      let tr2Out = ''; for (let i = 0; i < 8; i++) tr2Out += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${12 + i}, this.checked)" ${f[12 + i] !== false ? 'checked' : ''}></label>`;
      let cupla = `<label class="flbl" style="grid-column: span 2;text-align:center;justify-content:center;color:#ff9f43;font-weight:bold;gap:10px">CUPLĂ TRANSVERSALĂ <input type="checkbox" onchange="toggleFuse(${el.id}, 20, this.checked)" ${f[20] !== false ? 'checked' : ''}></label>`;
      firidaHtml = `<style>.flbl{display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:3px 5px;border-radius:4px;border:1px solid var(--border2);font-size:8.5px;color:var(--text);cursor:pointer}</style><div class="psec"><div class="psh">🔌 Siguranțe PTAB 2T</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr1In}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr1Out}</div><div style="border-top:1px solid var(--border2);margin:2px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr2In}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr2Out}</div><div style="border-top:1px solid var(--border2);margin:2px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${cupla}</div></div></div>`;
    }

    let labelsHtml = '';
    if (el.type === 'ptab_1t' || el.type === 'trafo') {
      const t1 = el.trText || (el.type === 'trafo' ? { mv: '16A', type: 'PT Aerian', power: '160kVA', volt: '20/0.4kV', lv: '250A' } : { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' });
      labelsHtml = `<div class="psec"><div class="psh">📝 Etichete Interne Trafo</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t1-mv" value="${t1.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t1-lv" value="${t1.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t1-type" value="${t1.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t1-pow" value="${t1.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t1-volt" value="${t1.volt}"></div></div></div></div>`;
    } else if (el.type === 'ptab_2t') {
      const t1 = el.trText1 || { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
      const t2 = el.trText2 || { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
      const cpText = el.cpText || 'In=160A';
      labelsHtml = `<div class="psec"><div class="psh">📝 Etichete Trafo 1</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t1-mv" value="${t1.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t1-lv" value="${t1.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t1-type" value="${t1.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t1-pow" value="${t1.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t1-volt" value="${t1.volt}"></div></div></div></div><div class="psec"><div class="psh">📝 Etichete Trafo 2 & Cuplă</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t2-mv" value="${t2.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t2-lv" value="${t2.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t2-type" value="${t2.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t2-pow" value="${t2.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t2-volt" value="${t2.volt}"></div><div style="margin-top:4px"><div class="pl">Text Cuplă</div><input class="pi" id="p-cp-txt" value="${cpText}"></div></div></div>`;
    }

    let celMTHtml = '';
    if (el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt') {
      const cData = el.celMT || {};
      const isTrafo = el.type === 'celula_trafo_mt';
      celMTHtml = `<div class="psec"><div class="psh">⚡ Parametri Celulă MT</div>
        <div class="pr"><div class="pl">Tensiune nominală</div><input class="pi" id="p-cmt-tensiune" value="${cData.tensiune || '20kV'}"></div>
        <div class="pr"><div class="pl">Curent nominal disjunctor</div><input class="pi" id="p-cmt-curent" value="${cData.curent || (isTrafo ? '16A' : '400A')}"></div>
        ${isTrafo ? `<div class="pr"><div class="pl">Putere transformator</div><input class="pi" id="p-cmt-putere" value="${cData.putere || '100kVA'}"></div><div class="pr"><div class="pl">Tensiune transformator</div><input class="pi" id="p-cmt-volt" value="${cData.volt || '20/0.4kV'}"></div>` : ''}
        <div class="pr" style="flex-direction:row;justify-content:space-between;align-items:center"><div class="pl">Disjunctor închis</div><input type="checkbox" id="p-cmt-disj" ${cData.stare_disj !== false ? 'checked' : ''} style="transform:scale(1.3)"></div>
        ${!isTrafo ? `<div class="pr" style="flex-direction:row;justify-content:space-between;align-items:center"><div class="pl">Separator de sarcină închis</div><input type="checkbox" id="p-cmt-sep" ${cData.stare_sep !== false ? 'checked' : ''} style="transform:scale(1.3)"></div>` : ''}
      </div>`;
    }

    let ptabMonoHtml = '';
    if (el.type === 'ptab_mono') {
      const celule = el.celule || [];
      let rows = celule.map((cel, i) => {
        const tipSel = (v) => cel.tip === v ? 'selected' : '';
        return `<div style="display:flex;flex-direction:column;gap:3px;background:var(--bg2);border:1px solid var(--border2);border-radius:5px;padding:5px 6px;" id="ptmcl-${el.id}-${i}">
          <div style="display:flex;align-items:center;gap:4px;justify-content:space-between">
            <span style="font-size:9px;font-weight:800;color:var(--accent)">Celula ${i + 1}</span>
            <div style="display:flex;gap:2px">
              ${i > 0 ? `<button onclick="ptabMonoMoveCell(${el.id},${i},-1)" style="width:20px;height:20px;border-radius:3px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);cursor:pointer;font-size:10px">◀</button>` : '<span style="width:20px"></span>'}
              ${i < celule.length - 1 ? `<button onclick="ptabMonoMoveCell(${el.id},${i},1)" style="width:20px;height:20px;border-radius:3px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);cursor:pointer;font-size:10px">▶</button>` : '<span style="width:20px"></span>'}
              <button onclick="ptabMonoDelCell(${el.id},${i})" style="width:20px;height:20px;border-radius:3px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:11px;font-weight:700">×</button>
            </div>
          </div>
          <div style="display:flex;gap:4px;align-items:center">
            <select onchange="ptabMonoUpdCell(${el.id},${i},'tip',this.value)" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 4px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
              <option value="L" ${tipSel('L')}>🔌 Linie MT</option>
              <option value="T" ${tipSel('T')}>⚡ Transformator</option>
            </select>
            <label style="display:flex;align-items:center;gap:2px;font-size:8px;color:var(--text2);cursor:pointer">
              <input type="checkbox" onchange="ptabMonoUpdCell(${el.id},${i},'stare',this.checked)" ${cel.stare !== false ? 'checked' : ''}> Înch.
            </label>
          </div>
          <input placeholder="Etichetă (ex: T1, Rez.)" value="${cel.label || ''}" oninput="ptabMonoUpdCell(${el.id},${i},'label',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%">
          ${cel.tip === 'T' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">
            <input placeholder="Putere (100kVA)" value="${cel.putere || '100kVA'}" oninput="ptabMonoUpdCell(${el.id},${i},'putere',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
            <input placeholder="Tensiune (20/0.4kV)" value="${cel.volt || '20/0.4kV'}" oninput="ptabMonoUpdCell(${el.id},${i},'volt',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
          </div>` : ''}
          <input placeholder="Curent disjunctor" value="${cel.curent || (cel.tip === 'T' ? '16A' : '400A')}" oninput="ptabMonoUpdCell(${el.id},${i},'curent',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%">
        </div>`;
      }).join('');
      ptabMonoHtml = `<div class="psec"><div class="psh">⚡ Celule PTAb Monofilar (${celule.length})</div>
        <div style="padding:5px;display:flex;flex-direction:column;gap:5px">${rows}
          <div style="display:flex;gap:4px;margin-top:2px">
            <button onclick="ptabMonoAddCell(${el.id},'L')" style="flex:1;padding:5px;border-radius:4px;border:1px solid rgba(0,207,255,.3);background:rgba(0,207,255,.07);color:var(--accent);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">+ Linie MT</button>
            <button onclick="ptabMonoAddCell(${el.id},'T')" style="flex:1;padding:5px;border-radius:4px;border:1px solid rgba(0,229,160,.3);background:rgba(0,229,160,.07);color:var(--accentg);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">+ Trafo</button>
          </div>
        </div></div>`;
    }

    let baraStatieHtml = '';
    if (el.type === 'bara_statie_mt') {
      const terminale = el.terminale || [];
      const terRows = terminale.map((ter, i) => `
        <div style="display:flex;align-items:center;gap:3px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:3px 5px;">
          <span style="font-size:8px;color:var(--text3);min-width:12px">${i + 1}</span>
          <input type="number" min="0" max="100" value="${ter.pct || 0}" oninput="baraStatieTerUpd(${el.id},${i},'pct',+this.value)" style="width:44px;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 4px;color:var(--warn);font-family:'JetBrains Mono',monospace;font-size:9px;text-align:center" title="Poziție pe bară 0%=sus … 100%=jos">
          <span style="font-size:8px;color:var(--text3)">%</span>
          <input placeholder="Etichetă (opț.)" value="${ter.label || ''}" oninput="baraStatieTerUpd(${el.id},${i},'label',this.value)" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:9px">
          <button onclick="baraStatieTerDel(${el.id},${i})" style="width:18px;height:18px;border-radius:3px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:12px;line-height:1;font-weight:700;flex-shrink:0">×</button>
        </div>`).join('');
      baraStatieHtml = `<div class="psec"><div class="psh">⚡ Parametri Bară Stație MT</div>
        <div class="pr"><div class="pl">Nr. Circuit / Plecare</div><input class="pi" id="p-bs-nrc" value="${el.nrCircuit || '2'}" style="font-size:16px;font-weight:800;color:var(--warn)"></div>
        <div class="pr"><div class="pl">Nume Stație</div><input class="pi" id="p-bs-nume" value="${el.numeStatie || 'STAȚIE 20kV'}"></div>
        <div class="pr"><div class="pl">Lungime bară (px)</div><input class="pi" type="number" id="p-bs-lung" min="60" max="800" step="20" value="${el.lungime || 200}"></div>
      </div>
      <div class="psec"><div class="psh">🔌 Puncte de Conexiune (${terminale.length})</div>
        <div style="padding:5px;display:flex;flex-direction:column;gap:4px">
          <div style="font-size:8px;color:var(--text3);padding:0 2px 2px">Poziție: 0% = sus barei · 100% = jos barei</div>
          ${terRows}
          <button onclick="baraStatieTerAdd(${el.id})" style="padding:5px;border-radius:4px;border:1px solid rgba(0,207,255,.3);background:rgba(0,207,255,.07);color:var(--accent);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif;margin-top:2px">+ Adaugă punct de conexiune</button>
        </div>
      </div>`;
    }

    const showConsumatori = el.type.startsWith('firida_') || el.type.startsWith('stalp_');
    const isStalp = el.type.startsWith('stalp_');
    let consumatoriHtml = '';
    if (showConsumatori) {
      const connectedCables = S.CN.filter(c => c.fromElId === el.id || c.toElId === el.id || c.from === el.id);
      let groups = [...new Set(connectedCables.map(c => (c.circuitGroup && c.circuitGroup.trim() !== '') ? c.circuitGroup.trim() : 'Implicit'))];
      if (groups.length === 0) groups = ['Implicit'];
      if (el.consumatori && !el.cons_dict) el.cons_dict = { 'Implicit': el.consumatori };
      if (!el.cons_dict) el.cons_dict = {};
      if (!el.pv_dict) el.pv_dict = {};
      let inputsHtml = groups.map(g => `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;"><span style="font-size:9px;color:var(--text2)">${g === 'Implicit' ? 'Grup implicit / Toate' : `Grup ${g}`}</span><input class="pi p-cons-grp" data-grp="${g}" type="number" style="width:60px;padding:3px" min="0" value="${el.cons_dict[g] || 0}"></div>`).join('');
      let pvInputsHtml = groups.map(g => `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;"><span style="font-size:9px;color:var(--text2)">${g === 'Implicit' ? 'Grup implicit / Toate' : `Grup ${g}`}</span><input class="pi p-pv-grp" data-grp="${g}" type="number" step="0.1" style="width:60px;padding:3px" min="0" value="${el.pv_dict[g] || 0}"></div>`).join('');
      let poleTypeHtml = '', csFuseHtml = '';
      const isMTStalp = el.type.startsWith('stalp_mt_');
      if (isMTStalp) {
        const catD = getPoleData(el);
        const _consoleOpts = (() => {
          const g = {};
          for (const [k, v] of Object.entries(CONSOLE_CATALOG)) {
            if (!g[v.group]) g[v.group] = [];
            g[v.group].push(`<option value="${k}" ${el.console_type === k ? 'selected' : ''}>${v.desc} — T=${v.T_max} daN</option>`);
          }
          return '<option value="">— fără consolă (T_max ∞) —</option>' +
            Object.entries(g).map(([gr, opts]) => `<optgroup label="${gr}">${opts.join('')}</optgroup>`).join('');
        })();
        poleTypeHtml = `
          <div class="pr" style="background:rgba(192,112,0,.08);border-left:3px solid #c07000;padding-left:8px">
            <div class="pl" style="color:#c07000">Stâlp MT 20kV</div>
            <select class="pi" id="p-st-type">
              <optgroup label="SC Centrifugați">
                <option value="stalp_mt_sc10001" ${el.type==='stalp_mt_sc10001'?'selected':''}>SC 10001</option>
                <option value="stalp_mt_sc15006" ${el.type==='stalp_mt_sc15006'?'selected':''}>SC 15006</option>
                <option value="stalp_mt_sc15007" ${el.type==='stalp_mt_sc15007'?'selected':''}>SC 15007</option>
                <option value="stalp_mt_sc15014" ${el.type==='stalp_mt_sc15014'?'selected':''}>SC 15014</option>
                <option value="stalp_mt_sc15015" ${el.type==='stalp_mt_sc15015'?'selected':''}>SC 15015</option>
              </optgroup>
              <optgroup label="SE Vibro-Precomprimați">
                <option value="stalp_mt_se4t" ${el.type==='stalp_mt_se4t'?'selected':''}>SE 4T</option>
                <option value="stalp_mt_se5t" ${el.type==='stalp_mt_se5t'?'selected':''}>SE 5T</option>
                <option value="stalp_mt_se6t" ${el.type==='stalp_mt_se6t'?'selected':''}>SE 6T</option>
                <option value="stalp_mt_se7t" ${el.type==='stalp_mt_se7t'?'selected':''}>SE 7T</option>
                <option value="stalp_mt_se8t" ${el.type==='stalp_mt_se8t'?'selected':''}>SE 8T</option>
                <option value="stalp_mt_se9t" ${el.type==='stalp_mt_se9t'?'selected':''}>SE 9T</option>
                <option value="stalp_mt_se10t" ${el.type==='stalp_mt_se10t'?'selected':''}>SE 10T</option>
                <option value="stalp_mt_se11t" ${el.type==='stalp_mt_se11t'?'selected':''}>SE 11T</option>
              </optgroup>
            </select>
            <div style="font-size:7.5px;color:var(--text3);margin-top:3px">${catD.desc}</div>
          </div>
          <div class="pr" style="background:rgba(192,112,0,.05);border-left:3px solid #c07000;padding-left:8px">
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;flex-direction:column;gap:2px">
                <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">Consolă tip (ST34)</span>
                <select class="pi" id="p-console-type" style="font-size:9px"
                  title="Tip consolă metalică ST34 Electrica — auto-completează T_max din Anexa 1">${_consoleOpts}</select>
              </div>
              <div style="display:flex;gap:8px;align-items:flex-end">
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">H prindere [m]</span>
                  <input class="pi" id="p-h-prindere" type="number" min="2" max="25" step="0.5"
                         style="width:62px"
                         placeholder="${catD.catH != null ? catD.catH : '?'}"
                         value="${el.h_prindere_ovr != null ? el.h_prindere_ovr : ''}"
                         title="Înălțimea punctului de prindere față de sol [m]. Catalog: ${catD.catH ?? '?'}m. Gol = din catalog.">
                </div>
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">T_max horiz. [daN]</span>
                  <input class="pi" id="p-T-max-horiz" type="number" min="0" max="99999" step="50"
                         style="width:72px"
                         placeholder="${catD.catT != null ? catD.catT : '∞'}"
                         value="${el.T_max_ovr != null ? el.T_max_ovr : ''}"
                         title="Override manual T_max [daN]. Consolă: ${catD.catT ?? '∞'} daN. Gol = din consolă/catalog.">
                </div>
              </div>
              <div style="display:flex;gap:8px;align-items:flex-end;margin-top:2px">
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#4ade80;text-transform:uppercase">Cota teren [m asl]</span>
                  <input class="pi" id="p-cota-teren" type="number" min="-500" max="3000" step="0.5"
                         style="width:80px"
                         placeholder="—"
                         value="${el.cota_teren != null ? el.cota_teren : ''}"
                         title="Cota terenului la baza stâlpului [m față de nivelul mării]. Folosit la profilul în lung LEA.">
                </div>
              </div>
            </div>
          </div>
          <div class="pr">
            <button class="pi" id="p-mt-extend"
              style="width:100%;padding:7px;background:rgba(192,112,0,.15);border:1px solid #c07000;
                border-radius:5px;color:#c07000;font-weight:800;font-size:9px;cursor:pointer;letter-spacing:.05em"
              title="Adaugă un stâlp nou și 3 conexiuni RST pornind de la acest stâlp">
              + Adaugă deschidere de la acest stâlp
            </button>
          </div>`;
      } else if (isStalp) {
        poleTypeHtml = `<div class="pr"><div class="pl">🏗️ Tip Stâlp</div><select class="pi" id="p-st-type">
          <option value="stalp_se4" ${el.type === 'stalp_se4' ? 'selected' : ''}>SE 4 (Pătrat Gol)</option>
          <option value="stalp_se10" ${el.type === 'stalp_se10' ? 'selected' : ''}>SE 10 (Pătrat cu X)</option>
          <option value="stalp_cs" ${el.type === 'stalp_cs' ? 'selected' : ''}>SE 10 cu Cutie Selectivitate (CS)</option>
          <option value="stalp_sc10002" ${el.type === 'stalp_sc10002' ? 'selected' : ''}>SC10002</option>
          <option value="stalp_sc10005" ${el.type === 'stalp_sc10005' ? 'selected' : ''}>SC10005</option>
          <option value="stalp_rotund" ${el.type === 'stalp_rotund' ? 'selected' : ''}>Stâlp Rotund</option>
          <option value="stalp_rotund_special" ${el.type === 'stalp_rotund_special' ? 'selected' : ''}>Stâlp Rotund Special</option>
        </select></div>`;
        if (el.type === 'stalp_cs') csFuseHtml = `<div class="pr"><div class="pl">⚡ Siguranță CS (Amperi)</div><input class="pi" id="p-cs-fuse" type="number" step="1" style="color:var(--warn);font-weight:bold" value="${el.cs_fuse || 100}"></div>`;
      } else if (el.type.startsWith('firida_')) {
        poleTypeHtml = `<div class="pr"><div class="pl">🏗️ Tip Firidă</div><select class="pi" id="p-st-type">
          <option value="firida_e2_4" ${el.type === 'firida_e2_4' ? 'selected' : ''}>Firidă E2-4</option>
          <option value="firida_e3_4" ${el.type === 'firida_e3_4' ? 'selected' : ''}>Firidă E3-4</option>
          <option value="firida_e3_0" ${el.type === 'firida_e3_0' ? 'selected' : ''}>Firidă E3-0</option>
        </select></div>`;
      }
      consumatoriHtml = `${poleTypeHtml}${csFuseHtml}<div class="pr"><div class="pl">👥 Consumatori per Circuit</div><div style="background:var(--bg2); border:1px solid var(--border2); border-radius:4px; padding:4px 6px;">${inputsHtml}</div></div><div class="pr"><div class="pl">☀️ Putere PV instalată (kW) per Circuit</div><div style="background:var(--bg2); border:1px solid rgba(255,193,7,.3); border-radius:4px; padding:4px 6px;">${pvInputsHtml}</div></div>${isStalp ? `<div class="pr"><div class="pl">🔀 Tip Nod</div><select class="pi" id="p-nod"><option value="" ${!el.nod ? 'selected' : ''}>— Stâlp simplu —</option><option value="nod" ${el.nod === 'nod' ? 'selected' : ''}>NOD (ramificație)</option><option value="capat" ${el.nod === 'capat' ? 'selected' : ''}>CAPĂT linie</option><option value="derivatie" ${el.nod === 'derivatie' ? 'selected' : ''}>DERIVAȚIE</option></select></div>` : ''}`;
    }

    let shapeProps = '';
    if (el.type === 'rect') shapeProps = `<div class="pr"><div class="pl">Lățime Pătrat (px)</div><input class="pi" type="number" id="p-rw" value="${el.width || 100}"></div><div class="pr"><div class="pl">Înălțime Pătrat (px)</div><input class="pi" type="number" id="p-rh" value="${el.height || 100}"></div>`;
    else if (el.type === 'circle') shapeProps = `<div class="pr"><div class="pl">Rază Cerc (px)</div><input class="pi" type="number" id="p-cr" value="${el.r || 50}"></div>`;
    else if (el.type === 'busbar') shapeProps = `<div class="pr"><div class="pl">Lungime Bară (px)</div><input class="pi" type="number" id="p-bw" value="${el.width || 200}"></div>`;

    let lineProps = '';
    if (el.type === 'rect' || el.type === 'circle' || el.type === 'polyline') lineProps = `<div class="pr"><div class="pl">Tip Linie Contur</div><select class="pi" id="p-elt"><option value="solid" ${el.lineType !== 'dashed' ? 'selected' : ''}>Continuă</option><option value="dashed" ${el.lineType === 'dashed' ? 'selected' : ''}>Întreruptă</option></select></div><div class="pr"><div class="pl">Grosime Contur (px)</div><input class="pi" type="number" id="p-esw" value="${el.strokeWidth || 2}"></div>`;

    let arrowProps = '';
    if (el.type === 'polyline') arrowProps = `<div class="pr"><div class="pl">Săgeată Început</div><input type="checkbox" id="p-arr-s" ${el.arrowStart ? 'checked' : ''}></div><div class="pr"><div class="pl">Săgeată Sfârșit</div><input type="checkbox" id="p-arr-e" ${el.arrowEnd ? 'checked' : ''}></div>`;

    const stareVal = el.stare || 'existent';
    pb.innerHTML = `
      <div class="psec">
        <div class="psh">Identificare & Dimensiuni</div>
        <div class="pr"><div class="pl">Etichetă</div><textarea class="pi" id="p-lbl" rows="2">${el.label || ''}</textarea></div>
        <div class="pr"><div class="pl">Stare</div><select class="pi" id="p-stare" style="font-weight:700;color:${stareVal === 'proiectat_racordare' ? '#ef4444' : stareVal === 'intarire_inlocuire' ? '#a855f7' : stareVal === 'intarire_nou' ? '#3b82f6' : stareVal === 'coexistenta' ? '#eab308' : stareVal === 'demontat' ? '#6b7280' : 'var(--text)'}">
          <option value="existent" ${stareVal === 'existent' ? 'selected' : ''}>✔ Existent</option>
          <option value="proiectat_racordare" ${stareVal === 'proiectat_racordare' ? 'selected' : ''} style="color:#ef4444">🔴 Proiectat — Tarif Racordare</option>
          <option value="intarire_inlocuire" ${stareVal === 'intarire_inlocuire' ? 'selected' : ''} style="color:#a855f7">🟣 Întărire — Înlocuire conductor</option>
          <option value="intarire_nou" ${stareVal === 'intarire_nou' ? 'selected' : ''} style="color:#3b82f6">🔵 Întărire — Circuit/cablu nou</option>
          <option value="coexistenta" ${stareVal === 'coexistenta' ? 'selected' : ''} style="color:#eab308">🟡 Lucrări Coexistență</option>
          <option value="demontat" ${stareVal === 'demontat' ? 'selected' : ''} style="color:#6b7280">⛔ Demontat</option>
        </select></div>
        ${stareVal === 'coexistenta' && el.type.startsWith('stalp_') ? `<div class="pr" style="border-left:3px solid #eab308;padding-left:8px"><div class="pl" style="color:#eab308">Înlocuire cu tip stâlp</div><select class="pi" id="p-coex-replace" style="color:#eab308;font-weight:700">
          <option value="">— Selectează —</option>
          <option value="SE4" ${(el.coexReplace || '') === 'SE4' ? 'selected' : ''}>SE4</option>
          <option value="SE10" ${(el.coexReplace || '') === 'SE10' ? 'selected' : ''}>SE10</option>
          <option value="SC10002" ${(el.coexReplace || '') === 'SC10002' ? 'selected' : ''}>SC10002</option>
          <option value="SC10005" ${(el.coexReplace || '') === 'SC10005' ? 'selected' : ''}>SC10005</option>
          <option value="Stâlp Rotund" ${(el.coexReplace || '') === 'Stâlp Rotund' ? 'selected' : ''}>Stâlp Rotund</option>
        </select></div>` : ''}
        ${el.type === 'meter' ? `<div class="pr"><div class="pl">Text BMPT</div><input class="pi" id="p-bmpt" value="${el.bmptText || ''}"></div>` : ''}
        ${el.type !== 'polyline' && el.type !== 'rect' && el.type !== 'circle' && el.type !== 'busbar' ? `<div class="pr"><div class="pl">Scară (Mărime)</div><input class="pi" type="number" id="p-scale" step="0.1" min="0.1" max="10" value="${el.scale || 1}"></div>` : ''}
        ${el.type === 'text' ? `<div class="pr"><div class="pl">Dimensiune Text (px)</div><input class="pi" type="number" id="p-fsize" min="5" max="100" value="${el.fontSize || 10}"></div>` : ''}
        ${shapeProps}${lineProps}${arrowProps}${consumatoriHtml}
      </div>
      ${labelsHtml}${celMTHtml}${ptabMonoHtml}${baraStatieHtml}${firidaHtml}${circuitHtml}
      <div class="psec"><div class="psh">Culori</div><div class="pr"><div class="pl">Contur / Text (Principală)</div><div class="crow" id="p-crow-color"></div></div><div class="pr"><div class="pl">Umplere / Evidențiere (Secundară)</div><div class="crow" id="p-crow-fill"></div></div></div>
      <div class="psec"><div class="psh">Rotație</div><div class="rotrow"><button class="rb" onclick="rotateSel(-90)">↺</button><input type="number" id="p-rot-num" class="pi" style="width:50px;text-align:center;padding:3px" value="${el.rotation || 0}"><button class="rb" onclick="rotateSel(90)">↻</button><button class="rb" onclick="rotateSel(180)">↕</button></div><div style="padding:0 9px 9px"><input type="range" id="p-rot-slider" min="0" max="359" value="${el.rotation || 0}" style="width:100%;cursor:pointer"></div></div>
      <div style="display:flex;gap:5px;flex-shrink:0;"><button class="bprop bdup" onclick="copyEl();pasteEl()">⧉ Duplică</button><button class="bprop bdel" onclick="delSel()">🗑 Șterge</button></div>`;

    document.getElementById('p-lbl').addEventListener('input', ev => updSel('label', ev.target.value));
    document.getElementById('p-stare')?.addEventListener('change', ev => {
      const v = ev.target.value;
      el.stare = v;
      if (v === 'proiectat_racordare') el.color = '#ef4444';
      else if (v === 'intarire_inlocuire') el.color = '#a855f7';
      else if (v === 'intarire_nou') el.color = '#3b82f6';
      else if (v === 'coexistenta') el.color = '#eab308';
      else if (v === 'demontat') el.color = '#6b7280';
      if (v !== 'coexistenta') {
        S.CN.forEach(cn => {
          if (cn.fromElId === el.id || cn.toElId === el.id) {
            if (v === 'proiectat_racordare') cn.color = '#ef4444';
            else if (v === 'intarire_inlocuire') cn.color = '#a855f7';
            else if (v === 'intarire_nou') cn.color = '#3b82f6';
          }
        });
      }
      render(); updateProps();
    });
    document.getElementById('p-coex-replace')?.addEventListener('change', ev => {
      el.coexReplace = ev.target.value;
      if (ev.target.value) {
        saveState('inlocuire stalp coexistenta');
        if (!el.coexOrigType) el.coexOrigType = el.type;
        const typeMap = { 'SE4': 'stalp_se4', 'SE10': 'stalp_se10', 'SC10002': 'stalp_sc10002', 'SC10005': 'stalp_sc10005', 'Stâlp Rotund': 'stalp_rotund' };
        if (typeMap[ev.target.value]) { el.type = typeMap[ev.target.value]; render(); updateProps(); }
      }
    });
    if (el.type === 'meter') document.getElementById('p-bmpt')?.addEventListener('input', ev => updSel('bmptText', ev.target.value));
    document.getElementById('p-scale')?.addEventListener('input', ev => { const v = parseFloat(ev.target.value); if (v > 0) { el.scale = v; updateConnectedCables(el); render(); } });
    document.getElementById('p-fsize')?.addEventListener('input', ev => { const v = parseInt(ev.target.value); if (v > 0) { el.fontSize = v; render(); } });
    document.getElementById('p-rw')?.addEventListener('input', ev => updSel('width', parseInt(ev.target.value) || 100));
    document.getElementById('p-rh')?.addEventListener('input', ev => updSel('height', parseInt(ev.target.value) || 100));
    document.getElementById('p-cr')?.addEventListener('input', ev => updSel('r', parseInt(ev.target.value) || 50));
    document.getElementById('p-bw')?.addEventListener('input', ev => { updSel('width', parseInt(ev.target.value) || 200); updateConnectedCables(el); });
    document.getElementById('p-elt')?.addEventListener('change', ev => updSel('lineType', ev.target.value));
    document.getElementById('p-esw')?.addEventListener('input', ev => updSel('strokeWidth', parseFloat(ev.target.value) || 2));
    document.getElementById('p-arr-s')?.addEventListener('change', ev => updSel('arrowStart', ev.target.checked));
    document.getElementById('p-arr-e')?.addEventListener('change', ev => updSel('arrowEnd', ev.target.checked));
    document.getElementById('p-rot-num')?.addEventListener('input', ev => setRotationAbs(parseInt(ev.target.value) || 0));
    document.getElementById('p-rot-slider')?.addEventListener('input', ev => setRotationAbs(parseInt(ev.target.value) || 0));

    if (el.type === 'ptab_1t' || el.type === 'ptab_2t' || el.type === 'trafo') {
      const propMap = { mv: 'mv', type: 'type', pow: 'power', volt: 'volt', lv: 'lv' };
      ['mv', 'type', 'pow', 'volt', 'lv'].forEach(k => {
        document.getElementById(`p-t1-${k}`)?.addEventListener('input', ev => {
          if (el.type === 'ptab_1t' || el.type === 'trafo') {
            if (!el.trText) el.trText = (el.type === 'trafo') ? { mv: '16A', type: 'PT Aerian', power: '160kVA', volt: '20/0.4kV', lv: '250A' } : { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
            el.trText[propMap[k]] = ev.target.value;
          } else {
            if (!el.trText1) el.trText1 = { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' };
            el.trText1[propMap[k]] = ev.target.value;
          }
          render();
        });
        document.getElementById(`p-t2-${k}`)?.addEventListener('input', ev => { if (!el.trText2) el.trText2 = { mv: 'In=16A', type: 'TTU ONAN', power: '250kVA', volt: '20/0.4kV', lv: '400A' }; el.trText2[propMap[k]] = ev.target.value; render(); });
      });
      if (el.type === 'ptab_2t') document.getElementById('p-cp-txt')?.addEventListener('input', ev => { el.cpText = ev.target.value; render(); });
    }

    if (el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt') {
      const updCelMT = (key, val) => { if (!el.celMT) el.celMT = {}; el.celMT[key] = val; render(); };
      document.getElementById('p-cmt-tensiune')?.addEventListener('input', ev => updCelMT('tensiune', ev.target.value));
      document.getElementById('p-cmt-curent')?.addEventListener('input', ev => updCelMT('curent', ev.target.value));
      document.getElementById('p-cmt-putere')?.addEventListener('input', ev => updCelMT('putere', ev.target.value));
      document.getElementById('p-cmt-volt')?.addEventListener('input', ev => updCelMT('volt', ev.target.value));
      document.getElementById('p-cmt-disj')?.addEventListener('change', ev => updCelMT('stare_disj', ev.target.checked));
      document.getElementById('p-cmt-sep')?.addEventListener('change', ev => updCelMT('stare_sep', ev.target.checked));
    }

    if (el.type === 'bara_statie_mt') {
      document.getElementById('p-bs-nrc')?.addEventListener('input', ev => { el.nrCircuit = ev.target.value; render(); });
      document.getElementById('p-bs-nume')?.addEventListener('input', ev => { el.numeStatie = ev.target.value; render(); });
      document.getElementById('p-bs-lung')?.addEventListener('input', ev => { const v = parseInt(ev.target.value) || 200; el.lungime = v; updateConnectedCables(el); render(); });
    }

    document.querySelectorAll('.p-cons-grp').forEach(inp => {
      inp.addEventListener('input', ev => {
        const g = ev.target.dataset.grp, val = parseInt(ev.target.value) || 0;
        if (!el.cons_dict) el.cons_dict = {}; el.cons_dict[g] = val;
        let total = 0; for (let key in el.cons_dict) total += el.cons_dict[key]; el.consumatori = total; render();
      });
    });

    document.querySelectorAll('.p-pv-grp').forEach(inp => {
      inp.addEventListener('input', ev => {
        const g = ev.target.dataset.grp, val = parseFloat(ev.target.value) || 0;
        if (!el.pv_dict) el.pv_dict = {}; el.pv_dict[g] = val;
        let total = 0; for (let key in el.pv_dict) total += el.pv_dict[key]; el.p_pv = total; render();
      });
    });

    if (isStalp || el.type.startsWith('firida_')) {
      document.getElementById('p-nod')?.addEventListener('change', ev => updSel('nod', ev.target.value));
      document.getElementById('p-mt-extend')?.addEventListener('click', () => {
        addMTSpanFrom(el.id);
      });
      document.getElementById('p-cs-fuse')?.addEventListener('input', ev => {
        el.cs_fuse = parseFloat(ev.target.value) || 100;
        if (document.getElementById('vd-panel').style.display === 'flex') runVD();
      });
      document.getElementById('p-st-type')?.addEventListener('change', ev => {
        const ve = S.EL.find(x => x.id === S.sel);
        if (ve) {
          saveState('modificare tip element');
          ve.type = ev.target.value;
          if (ve.type === 'stalp_cs' && !ve.cs_fuse) ve.cs_fuse = 100;
          if (ve.type.startsWith('firida_') && !ve.fuses) {
            if (ve.type === 'firida_e2_4') ve.fuses = new Array(6).fill(true);
            else if (ve.type === 'firida_e3_4') ve.fuses = new Array(7).fill(true);
            else if (ve.type === 'firida_e3_0') ve.fuses = new Array(3).fill(true);
          }
          render(); updateProps();
          if (document.getElementById('vd-panel').style.display === 'flex') runVD();
          window.runSagMT?.();
        }
      });
      document.getElementById('p-h-prindere')?.addEventListener('change', ev => {
        const ve = S.EL.find(x => x.id === S.sel);
        if (!ve) return;
        const v = parseFloat(ev.target.value);
        ve.h_prindere_ovr = isFinite(v) && v > 0 ? v : undefined;
        window.runSagMT?.();
      });
      document.getElementById('p-T-max-horiz')?.addEventListener('change', ev => {
        const ve = S.EL.find(x => x.id === S.sel);
        if (!ve) return;
        const v = parseFloat(ev.target.value);
        ve.T_max_ovr = isFinite(v) && v > 0 ? v : undefined;
        window.runSagMT?.();
      });
      document.getElementById('p-console-type')?.addEventListener('change', ev => {
        const ve = S.EL.find(x => x.id === S.sel);
        if (!ve) return;
        ve.console_type = ev.target.value || undefined;
        updateProps();
        window.runSagMT?.();
      });
      document.getElementById('p-cota-teren')?.addEventListener('change', ev => {
        const ve = S.EL.find(x => x.id === S.sel);
        if (!ve) return;
        const v = parseFloat(ev.target.value);
        ve.cota_teren = isFinite(v) ? v : undefined;
        window.runProfilLEA?.();
      });
    }

    buildColors(el.color, c => updSel('color', c), 'p-crow-color', false);
    buildColors(el.fillColor, c => updSel('fillColor', c), 'p-crow-fill', true);

  } else {
    const tcOpts = ['Clasic Al', 'Torsadat Al', 'Cablu Al', 'Cablu Cu', 'OL-AL'];
    const secOpts = [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
    const availSec = Object.keys(R0_TABLES[cn.tipConductor || 'Clasic Al'] || {}).map(Number).sort((a, b) => a - b);
    const secOptHtml = secOpts.map(s => `<option value="${s}" ${parseFloat(cn.sectiune || 16) === s ? 'selected' : ''} ${!availSec.includes(s) ? 'disabled style="color:#555"' : ''}>${s} mm²</option>`).join('');
    const r0val = getR0(cn.tipConductor || 'Clasic Al', parseFloat(cn.sectiune) || 16);
    const r0disp = r0val ? (r0val / 1000).toFixed(4) + ' Ω/km' : '—';
    const cnStare = cn.stare || 'existent';
    pb.innerHTML = `
      <div class="psec"><div class="psh">📐 Identificare & Rute</div>
        <div class="pr"><div class="pl">Etichetă Cablu</div><input class="pi" id="p-cl" value="${cn.label || ''}"></div>
        <div class="pr"><div class="pl">Stare</div><select class="pi" id="p-cn-stare" style="font-weight:700;color:${cnStare === 'proiectat_racordare' ? '#ef4444' : cnStare === 'intarire_inlocuire' ? '#a855f7' : cnStare === 'intarire_nou' ? '#3b82f6' : cnStare === 'demontat' ? '#6b7280' : 'var(--text)'}">
          <option value="existent" ${cnStare === 'existent' ? 'selected' : ''}>✔ Existent</option>
          <option value="proiectat_racordare" ${cnStare === 'proiectat_racordare' ? 'selected' : ''} style="color:#ef4444">🔴 Proiectat — Tarif Racordare</option>
          <option value="intarire_inlocuire" ${cnStare === 'intarire_inlocuire' ? 'selected' : ''} style="color:#a855f7">🟣 Întărire — Înlocuire conductor</option>
          <option value="intarire_nou" ${cnStare === 'intarire_nou' ? 'selected' : ''} style="color:#3b82f6">🔵 Întărire — Circuit/cablu nou</option>
          <option value="demontat" ${cnStare === 'demontat' ? 'selected' : ''} style="color:#6b7280">⛔ Demontat</option>
        </select></div>
        ${cn.stare === 'intarire_inlocuire' && cn.oldTipConductor ? `<div class="pr" style="border-left:3px solid #a855f7;padding-left:8px;background:rgba(168,85,247,.05)"><div class="pl" style="color:#a855f7">Conductor vechi (înlocuit)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#a855f7;padding:4px 7px">${cn.oldTipConductor} ${cn.oldSectiune} mm² — ${cn.oldTipRetea || 'Trifazat'}</div></div>` : ''}
        <div class="pr"><div class="pl">Grup Circuit (pt. stâlpi comuni)</div><input class="pi" id="p-cgroup" value="${cn.circuitGroup || ''}" placeholder="Ex: C3, Iluminat..."></div>
        <div class="pr"><div class="pl">Lungime tronson (m)</div><div style="display:flex;gap:4px"><input class="pi" type="number" id="p-len" value="${cn.length || ''}" style="flex:1"><button class="t2" style="height:23px;padding:0 6px;min-width:auto;border-color:var(--border2);background:var(--bg3);color:var(--accent)" onclick="updSel('length', parseFloat((calcPathLen(S.CN.find(x=>x.id===${cn.id}).path)/S.pxPerMeter).toFixed(1)))" title="Recalculează distanța din desen">📐 Auto</button></div></div>
      </div>
      <div class="psec"><div class="psh">⚡ Conductor — Conform PE 132/2003</div>
        <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="p-tc">${tcOpts.map(t => `<option value="${t}" ${(cn.tipConductor || 'Clasic Al') === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        <div class="pr"><div class="pl">Secțiune (mm²)</div><select class="pi" id="p-sec">${secOptHtml}</select></div>
        <div class="pr"><div class="pl">Tip rețea</div><select class="pi" id="p-tr"><option value="Trifazat" ${(cn.tipRetea || 'Trifazat') === 'Trifazat' ? 'selected' : ''}>Trifazat (3×Un=0.4kV)</option><option value="Bifazat" ${cn.tipRetea === 'Bifazat' ? 'selected' : ''}>Bifazat (2×Un=0.4kV)</option><option value="Monofazat" ${cn.tipRetea === 'Monofazat' ? 'selected' : ''}>Monofazat (Un=0.23kV)</option></select></div>
        <div class="pr"><div class="pl">Fază MT (RST)</div><select class="pi" id="p-faza" style="font-weight:700;color:${cn.faza === 'R' ? '#ef4444' : cn.faza === 'S' ? '#22c55e' : cn.faza === 'T' ? '#3b82f6' : 'var(--text)'}"><option value="" ${!cn.faza ? 'selected' : ''} style="color:var(--text)">— (nedefinit)</option><option value="R" ${cn.faza === 'R' ? 'selected' : ''} style="color:#ef4444">R (faza R)</option><option value="S" ${cn.faza === 'S' ? 'selected' : ''} style="color:#22c55e">S (faza S)</option><option value="T" ${cn.faza === 'T' ? 'selected' : ''} style="color:#3b82f6">T (faza T)</option></select></div>
        <div class="pr"><div class="pl">r₀ (rezistență specifică)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accentg);padding:4px 7px;background:var(--bg2);border-radius:4px" id="p-r0disp">${r0disp}</div></div>
        <div class="pr"><div class="pl">Putere concentrată nod final (kW)</div><input class="pi" type="number" step="0.1" id="p-pc" value="${cn.putereConc || 0}"></div>
      </div>
      <div class="psec"><div class="psh">🖊 Afișare</div>
        <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="p-lt"><option value="solid" ${cn.lineType === 'solid' ? 'selected' : ''}>LEA — Aerian</option><option value="dashed" ${cn.lineType === 'dashed' ? 'selected' : ''}>LES — Subteran</option></select></div>
        <div class="pr"><div class="pl">Grosime linie (px)</div><input class="pi" type="number" id="p-sw" min="1" max="20" value="${cn.strokeWidth || 2}"></div>
        <div class="pr"><div class="pl">⚡ Direcție flux putere</div><select class="pi" id="p-flow">
          <option value="" ${!cn.flowDir ? 'selected' : ''}>— Fără animație —</option>
          <option value="fwd" ${cn.flowDir === 'fwd' ? 'selected' : ''}>▶ Normal (de la sursă)</option>
          <option value="rev" ${cn.flowDir === 'rev' ? 'selected' : ''}>◀ Invers (spre sursă)</option>
        </select></div>
      </div>
      <div class="psec"><div class="psh">Culori</div><div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="p-crow-color"></div></div><div class="pr"><div class="pl">Highlight / Fundal</div><div class="crow" id="p-crow-fill"></div></div></div>
      <button class="bprop bdel" onclick="delSel()">🗑 Șterge Cablu</button>`;

    document.getElementById('p-cl').addEventListener('input', ev => updSel('label', ev.target.value));
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
      else if (v === 'existent') { cn.color = '#ef4444'; delete cn.oldTipConductor; delete cn.oldSectiune; delete cn.oldTipRetea; }
      render(); updateProps();
    });
    document.getElementById('p-cgroup')?.addEventListener('input', ev => updSel('circuitGroup', ev.target.value));
    document.getElementById('p-len').addEventListener('input', ev => updSel('length', parseFloat(ev.target.value) || 0));
    document.getElementById('p-lt').addEventListener('change', ev => updSel('lineType', ev.target.value));
    document.getElementById('p-sw').addEventListener('input', ev => updSel('strokeWidth', parseInt(ev.target.value) || 2));
    document.getElementById('p-pc').addEventListener('input', ev => updSel('putereConc', parseFloat(ev.target.value) || 0));
    document.getElementById('p-tc').addEventListener('change', ev => { updSel('tipConductor', ev.target.value); setTimeout(() => { updateProps(); }, 50); });
    document.getElementById('p-sec').addEventListener('change', ev => {
      updSel('sectiune', parseFloat(ev.target.value));
      const r0 = getR0(cn.tipConductor || 'Clasic Al', parseFloat(ev.target.value));
      const d = document.getElementById('p-r0disp'); if (d) d.textContent = r0 ? (r0 / 1000).toFixed(4) + ' Ω/km' : '—';
    });
    document.getElementById('p-tr').addEventListener('change', ev => updSel('tipRetea', ev.target.value));
    document.getElementById('p-faza').addEventListener('change', ev => { const v = ev.target.value; updSel('faza', v || undefined); ev.target.style.color = v === 'R' ? '#ef4444' : v === 'S' ? '#22c55e' : v === 'T' ? '#3b82f6' : 'var(--text)'; });
    document.getElementById('p-flow')?.addEventListener('change', ev => { updSel('flowDir', ev.target.value); renderFlowLayer(); });
    buildColors(cn.color, c => updSel('color', c), 'p-crow-color', false);
    buildColors(cn.fillColor, c => updSel('fillColor', c), 'p-crow-fill', true);
  }
}

export function buildColors(cur, cb, containerId, allowNone = false) {
  const COLS = ['#111', '#444', '#888', '#dc2626', '#f97316', '#eab308', '#16a34a', '#0ea5e9', '#1d4ed8', '#7c3aed', '#be185d', '#dce8f5'];
  const cr = document.getElementById(containerId); if (!cr) return; cr.innerHTML = '';
  if (allowNone) {
    const s = document.createElement('div'); s.className = 'csw' + ((cur === 'none' || !cur) ? ' on' : ''); s.style.background = 'transparent'; s.style.position = 'relative'; s.style.overflow = 'hidden';
    s.innerHTML = '<div style="position:absolute;top:50%;left:-5px;right:-5px;height:2px;background:#ff3d71;transform:rotate(45deg)"></div>'; s.title = 'Fără umplere';
    s.onclick = () => { cr.querySelectorAll('.csw').forEach(x => x.classList.remove('on')); s.classList.add('on'); cb('none'); }; cr.appendChild(s);
  }
  COLS.forEach(c => {
    const s = document.createElement('div'); s.className = 'csw' + (c === cur ? ' on' : ''); s.style.background = c;
    s.onclick = () => { cr.querySelectorAll('.csw').forEach(x => x.classList.remove('on')); s.classList.add('on'); cb(c); }; cr.appendChild(s);
  });
}

export function clearAll() {
  if (confirm('Ești sigur că vrei să ștergi TOATĂ planșa?')) {
    saveState('clear');
    S.EL = []; S.CN = []; S.sel = null; S.multiSel.clear();
    Object.keys(S.counters).forEach(k => delete S.counters[k]);
    S.vdResults = null; document.getElementById('VD-OVL')?.remove();
    render(); updateProps(); updateStat();
    toast('Planșa a fost ștearsă!', 'ok');
  }
}

export function toggleLeg() {
  const p = document.getElementById('leg');
  p.classList.toggle('on');
  if (p.classList.contains('on')) buildLeg();
}

export function buildLeg() {
  const b = document.getElementById('leg-body'); if (!b) return;
  const counts = {}; S.EL.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
  const typeNames = {
    ptab_1t: 'PTAB 1T', ptab_2t: 'PTAB 2T', trafo: 'PT Aerian',
    firida_e2_4: 'Firidă E2-4', firida_e3_4: 'Firidă E3-4', firida_e3_0: 'Firidă E3-0',
    cd4: 'Cutie Distribuție 4P', cd5: 'CD 5P', cd8: 'CD 8P',
    meter: 'BMPT', stalp_se4: 'Stâlp SE4', stalp_se10: 'Stâlp SE10', stalp_cs: 'Stâlp cu CS',
    stalp_rotund: 'Stâlp Rotund', stalp_rotund_special: 'Stâlp Rotund Spec.',
    separator: 'Separator JT', separator_mt: 'Separator MT', manson: 'Manșon',
    priza_pamant: 'Priză de Pământ', rect: 'Pătrat', circle: 'Cerc', text: 'Text liber', polyline: 'Linie liberă',
    bara_mt: 'Bară Colectoare MT', celula_linie_mt: 'Celulă Linie MT', celula_trafo_mt: 'Celulă Transformator MT',
    ptab_mono: 'PTAb Monofilar MT', bara_statie_mt: 'Bară Stație MT'
  };
  let html = '<table class="lgt"><tr><th>Tip Element</th><th style="text-align:right">Cant.</th></tr>';
  for (const t in counts) {
    const name = typeNames[t] || t.toUpperCase();
    html += `<tr><td>${name}</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${counts[t]}</td></tr>`;
  }
  let cabLen = 0; S.CN.forEach(c => cabLen += parseFloat(c.length) || 0);
  html += `<tr><td>Conductoare / Cabluri</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${S.CN.length}<br><span style="font-size:7.5px;color:var(--text3)">${cabLen.toFixed(1)} m</span></td></tr>`;
  html += '</table>'; b.innerHTML = html;
}

export function toggleVD() {
  const p = document.getElementById('vd-panel'); const showing = p.style.display === 'flex'; p.style.display = showing ? 'none' : 'flex';
  if (!showing) {
    const srcSel = document.getElementById('vd-src'); srcSel.innerHTML = '';
    S.EL.filter(e => e.type.startsWith('cd') || e.type === 'ptab_1t').forEach(e => {
      const o = document.createElement('option'); o.value = e.id; o.textContent = e.label || e.type; srcSel.appendChild(o);
    });
    S.EL.filter(e => e.type === 'ptab_2t').forEach(e => {
      const o1 = document.createElement('option'); o1.value = e.id + '__td1'; o1.textContent = (e.label || 'PTAB') + ' — TD JT 1 (C1-C8)'; srcSel.appendChild(o1);
      const o2 = document.createElement('option'); o2.value = e.id + '__td2'; o2.textContent = (e.label || 'PTAB') + ' — TD JT 2 (C1-C8)'; srcSel.appendChild(o2);
    });
    S.EL.filter(e => e.type === 'ptab_mono').forEach(e => {
      (e.celule || []).forEach((cel, i) => {
        if (cel.tip !== 'T') return;
        const o = document.createElement('option');
        o.value = `${e.id}__cel${i}`;
        o.textContent = `${e.label || 'PTAb'} — ${cel.label || ('T' + (i + 1))} (${cel.putere || '100kVA'})`;
        srcSel.appendChild(o);
      });
    });
    if (!srcSel.options.length) srcSel.innerHTML = '<option value="">— niciun CD / PTAB —</option>';
    populateVDCircuits();
  }
}

export function populateVDCircuits() {
  const srcRaw = document.getElementById('vd-src').value;
  const circSel = document.getElementById('vd-circ');
  circSel.innerHTML = '<option value="all">Toate circuitele</option>';
  let cdId = null;
  if (srcRaw.includes('__')) cdId = parseInt(srcRaw.split('__')[0]);
  else cdId = parseInt(srcRaw);
  if (!cdId) return;
  const circuits = new Set();
  S.CN.forEach(cn => {
    if (cn.fromElId === cdId || cn.toElId === cdId) {
      if (cn.circuitGroup) circuits.add(cn.circuitGroup);
      else if (cn.fromElId === cdId && cn.fromCircuit) circuits.add('C' + cn.fromCircuit);
      else if (cn.toElId === cdId && cn.toCircuit) circuits.add('C' + cn.toCircuit);
    }
  });
  circuits.forEach(c => {
    const o = document.createElement('option'); o.value = c; o.textContent = c; circSel.appendChild(o);
  });
}

export function calcNetworkVD_ptab2t(cdElId, Pc_abonat, tipAmplasare, forceKs, tdNum) {
  const startCirc = tdNum === 1 ? 1 : 9;
  const endCirc = tdNum === 1 ? 8 : 16;
  const cdEl = S.EL.find(x => x.id === cdElId);
  const allResults = new Map();
  const trafoKVA = parseInt(document.getElementById('vd-trafo')?.value) || 250;
  const trafoImpedance = { 50: { R: 45.0, X: 120.0 }, 100: { R: 22.5, X: 60.0 }, 160: { R: 10.37, X: 37.10 }, 250: { R: 6.2, X: 18.0 }, 400: { R: 3.8, X: 11.5 }, 630: { R: 2.2, X: 7.0 }, 1000: { R: 1.3, X: 4.5 } }[trafoKVA] || { R: 6.2, X: 18.0 };
  const startIsc = (230 / Math.sqrt(trafoImpedance.R * trafoImpedance.R + trafoImpedance.X * trafoImpedance.X));
  const rootFuse = parseFloat(document.getElementById('vd-fuse')?.value) || 160;

  for (let circ = startCirc; circ <= endCirc; circ++) {
    const seedCables = S.CN.filter(cn => (cn.fromElId === cdElId && cn.fromCircuit === circ) || (cn.toElId === cdElId && cn.toCircuit === circ));
    if (seedCables.length === 0) continue;
    const circLabel = `C${circ - startCirc + 1}`;
    const traceGroup = seedCables[0].circuitGroup || circLabel;
    const nodes = new Map(), visitedEls = new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }], treeList = [];
    nodes.set(cdElId, { elId: cdElId, label: (cdEl.label || 'PTAB') + ' TD' + tdNum, children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: circLabel, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });

    while (queue.length > 0) {
      const { elId, path, L_cum } = queue.shift();
      const parentNode = nodes.get(elId);
      if (elId !== cdElId) treeList.push(elId);
      const cables = S.CN.filter(cn => cn.fromElId === elId || cn.toElId === elId);
      cables.forEach(cn => {
        if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circ.toString()) return;
        if ((cn.fromElId === cdElId && cn.fromCircuit !== circ) || (cn.toElId === cdElId && cn.toCircuit !== circ)) return;
        const currentTerm = (cn.fromElId === elId) ? cn.fromTerm : (cn.toElId === elId) ? cn.toTerm : null;
        const el = S.EL.find(x => x.id === elId);
        if (el && !isConnectionActive(el, currentTerm)) return;
        const childId = cn.fromElId === elId ? cn.toElId : (cn.toElId === elId ? cn.fromElId : null);
        if (!childId || visitedEls.has(childId)) return;
        visitedEls.add(childId);
        const childEl = S.EL.find(x => x.id === childId); if (!childEl) return;
        let childActiveFuse = parentNode.active_fuse;
        if (childEl.type === 'stalp_cs') childActiveFuse = parseFloat(childEl.cs_fuse) || 100;
        let tipConductor = cn.tipConductor || 'Clasic Al';
        let sectiune = parseFloat(cn.sectiune) || 16;
        let L = parseFloat(cn.length) || 0;
        let r0v = getR0(tipConductor, sectiune) || 0;
        let x0v = getX0(tipConductor, sectiune);
        let nrCons = 0;
        if (childEl.cons_dict) { nrCons = parseInt(childEl.cons_dict[traceGroup] || childEl.cons_dict['Implicit'] || 0) || 0; }
        else nrCons = parseInt(childEl.consumatori) || 0;
        const R_cum = parentNode.R_cum + (r0v * 2) * (L / 1000);
        const X_cum = parentNode.X_cum + x0v * 2 * (L / 1000);
        const Isc = 230 / Math.sqrt(R_cum * R_cum + X_cum * X_cum);
        const nd = { elId: childId, label: childEl.label || '?', parentId: elId, children: [], nrCons, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: parentNode.L_cumulat + L, circKey: circLabel, P_total_branch: 0, duNod: 0, duTronson: 0, path: [...path, childEl.label || '?'], P_eff: 0, r0: r0v, tipConductor, sectiune, tipRetea: cn.tipRetea || 'Trifazat', R_cum, X_cum, Isc, active_fuse: childActiveFuse, totalDownstreamCons: nrCons, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0, P_eff_dU: 0, P_tot_base: 0 };
        nodes.set(childId, nd); parentNode.children.push(childId);
        queue.push({ elId: childId, path: [...path, childEl.label || '?'], L_cum: parentNode.L_cumulat + L });
      });
    }

    for (let i = treeList.length - 1; i >= 0; i--) {
      const nId = treeList[i], node = nodes.get(nId);
      let downstream_cons = node.nrCons, I278_tranzit = 0;
      node.children.forEach(cId => { const childNode = nodes.get(cId); downstream_cons += childNode.totalDownstreamCons; I278_tranzit += childNode.P_tot_base || 0; });
      node.totalDownstreamCons = downstream_cons;
      const K278_local = node.nrCons, J273_Pc = parseFloat(Pc_abonat) || 2;
      const L278_Ks = (!isNaN(forceKs) && forceKs > 0) ? forceKs : getKs(K278_local, tipAmplasare || 'RURAL');
      const M278_distrib = K278_local * J273_Pc * L278_Ks;
      const J278_conc = node.P_cablu || 0;
      const N278_total = M278_distrib + J278_conc + I278_tranzit;
      node.P_tot_base = N278_total;
      node.P_eff_dU = (M278_distrib / 2) + J278_conc + I278_tranzit;
      node.P_total_branch = N278_total;
    }

    treeList.forEach(nId => {
      const node = nodes.get(nId);
      if (node.parentId) { const pNode = nodes.get(node.parentId); node.duTronson = calcDU_tronson(node.L, node.P_eff_dU, node.tipRetea, node.sectiune); node.duNod = pNode.duNod + node.duTronson; }
      if (node.children.length === 0) node.isEnd = true;
      allResults.set(traceGroup + '_' + nId, node);
    });
  }
  return allResults;
}

export function calcNetworkVD(cdElId, Pc_abonat, tipAmplasare, forceKs) {
  const cdEl = S.EL.find(x => x.id === cdElId);
  let numCircuits = 1;
  if (cdEl.type === 'ptab_2t') numCircuits = 16;
  else if (cdEl.type === 'ptab_1t') numCircuits = 8;
  else if (cdEl.type.startsWith('cd')) numCircuits = parseInt(cdEl.type.replace('cd', ''));
  const allResults = new Map();
  const trafoKVA = parseInt(document.getElementById('vd-trafo')?.value) || 250;
  const trafoImpedance = { 50: { R: 45.0, X: 120.0 }, 100: { R: 22.5, X: 60.0 }, 160: { R: 10.37, X: 37.10 }, 250: { R: 6.2, X: 18.0 }, 400: { R: 3.8, X: 11.5 }, 630: { R: 2.2, X: 7.0 }, 1000: { R: 1.3, X: 4.5 } }[trafoKVA] || { R: 6.2, X: 18.0 };
  const startIsc = (230 / Math.sqrt(trafoImpedance.R * trafoImpedance.R + trafoImpedance.X * trafoImpedance.X));
  const rootFuse = parseFloat(document.getElementById('vd-fuse')?.value) || 160;

  if (cdEl.type === 'ptab_mono') {
    const celule = cdEl.celule || [];
    const CW = 72, startX = cdEl.x - (celule.length * CW) / 2;
    const termY = cdEl.y + 120;
    celule.forEach((cel, i) => {
      if (cel.tip !== 'T') return;
      const cx = startX + i * CW + CW / 2;
      const seedCables = S.CN.filter(cn => {
        const p0 = cn.path[0], pN = cn.path[cn.path.length - 1]; if (!p0 || !pN) return false;
        return (Math.hypot(p0.x - cx, p0.y - termY) < 50 && (cn.fromElId === cdElId || !cn.fromElId)) ||
               (Math.hypot(pN.x - cx, pN.y - termY) < 50 && (cn.toElId === cdElId || !cn.toElId));
      });
      if (seedCables.length === 0) return;
      const traceGroup = cel.label || `T${i + 1}`;
      const nodes = new Map(), visitedEls = new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }];
      nodes.set(cdElId, { elId: cdElId, label: cdEl.label || 'PTAb', children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: traceGroup, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });
      seedCables.forEach(cn => {
        const p0 = cn.path[0], pN = cn.path[cn.path.length - 1];
        const childId = Math.hypot(p0.x - cx, p0.y - termY) < 50 ? cn.toElId : cn.fromElId;
        if (!childId || visitedEls.has(childId)) return;
        visitedEls.add(childId);
        const childEl2 = S.EL.find(x => x.id === childId); if (!childEl2) return;
        const L = parseFloat(cn.length) || 0, tipC = cn.tipConductor || 'Clasic Al', sec = parseFloat(cn.sectiune) || 16;
        const r0v = getR0(tipC, sec) || 0, x0v = getX0(tipC, sec);
        let nrCons = 0; if (childEl2.cons_dict) { nrCons = parseInt(childEl2.cons_dict[traceGroup] || childEl2.cons_dict['Implicit'] || 0) || 0; } else nrCons = parseInt(childEl2.consumatori) || 0;
        const R_cum2 = trafoImpedance.R + (r0v * 2) * (L / 1000), X_cum2 = trafoImpedance.X + x0v * 2 * (L / 1000);
        const Isc2 = 230 / Math.sqrt(R_cum2 * R_cum2 + X_cum2 * X_cum2);
        const P_eff2 = nrCons * Pc_abonat * (forceKs || getKs(nrCons, tipAmplasare));
        const du2 = calcDU_tronson(L, P_eff2, cn.tipRetea || 'Trifazat', sec);
        const nd2 = { elId: childId, label: childEl2.label || '?', children: [], nrCons, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: L, circKey: traceGroup, P_total_branch: P_eff2, duNod: du2, duTronson: du2, path: [childEl2.label || '?'], P_eff: P_eff2, r0: r0v, tipConductor: tipC, sectiune: sec, tipRetea: cn.tipRetea || 'Trifazat', R_cum: R_cum2, X_cum: X_cum2, Isc: Isc2, active_fuse: rootFuse, totalDownstreamCons: nrCons, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0 };
        nodes.set(childId, nd2); allResults.set(traceGroup + '_' + childId, nd2);
        queue.push({ elId: childId, path: [childEl2.label || '?'], L_cum: L });
      });
      while (queue.length > 0) {
        const { elId, path, L_cum } = queue.shift(); if (elId === cdElId) continue;
        const parentNode2 = nodes.get(elId); if (!parentNode2) continue;
        S.CN.filter(cn => cn.fromElId === elId || cn.toElId === elId || cn.from === elId).forEach(cn => {
          if (cn.circuitGroup && cn.circuitGroup !== traceGroup) return;
          const childId2 = cn.fromElId === elId ? cn.toElId : (cn.toElId === elId ? cn.fromElId : null);
          if (!childId2 || visitedEls.has(childId2)) return;
          visitedEls.add(childId2);
          const childEl3 = S.EL.find(x => x.id === childId2); if (!childEl3) return;
          const L = parseFloat(cn.length) || 0, tipC = cn.tipConductor || 'Clasic Al', sec = parseFloat(cn.sectiune) || 16;
          const r0v = getR0(tipC, sec) || 0, x0v = getX0(tipC, sec);
          let nrC = 0; if (childEl3.cons_dict) { nrC = parseInt(childEl3.cons_dict[traceGroup] || childEl3.cons_dict['Implicit'] || 0) || 0; } else nrC = parseInt(childEl3.consumatori) || 0;
          const R_cum3 = parentNode2.R_cum + (r0v * 2) * (L / 1000), X_cum3 = parentNode2.X_cum + x0v * 2 * (L / 1000);
          const Isc3 = 230 / Math.sqrt(R_cum3 * R_cum3 + X_cum3 * X_cum3);
          const P_eff3 = nrC * Pc_abonat * (forceKs || getKs(nrC, tipAmplasare));
          const du3 = calcDU_tronson(L, P_eff3, cn.tipRetea || 'Trifazat', sec);
          const nd3 = { elId: childId2, label: childEl3.label || '?', children: [], nrCons: nrC, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: parentNode2.L_cumulat + L, circKey: traceGroup, P_total_branch: P_eff3, duNod: parentNode2.duNod + du3, duTronson: du3, path: [...path, childEl3.label || '?'], P_eff: P_eff3, r0: r0v, tipConductor: tipC, sectiune: sec, tipRetea: cn.tipRetea || 'Trifazat', R_cum: R_cum3, X_cum: X_cum3, Isc: Isc3, active_fuse: parentNode2.active_fuse, totalDownstreamCons: nrC, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0 };
          nodes.set(childId2, nd3); allResults.set(traceGroup + '_' + childId2, nd3);
          queue.push({ elId: childId2, path: [...path, childEl3.label || '?'], L_cum: parentNode2.L_cumulat + L });
        });
      }
    });
    return allResults;
  }

  for (let circ = 1; circ <= numCircuits; circ++) {
    const seedCables = S.CN.filter(cn => (cn.fromElId === cdElId && cn.fromCircuit === circ) || (cn.toElId === cdElId && cn.toCircuit === circ));
    if (seedCables.length === 0) continue;
    const traceGroup = seedCables[0].circuitGroup || `C${circ}`;
    const nodes = new Map(), visitedEls = new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }], treeList = [];
    nodes.set(cdElId, { elId: cdElId, label: cdEl.label || 'Sursă', children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: traceGroup, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });

    while (queue.length > 0) {
      const { elId, path, L_cum } = queue.shift();
      const parentNode = nodes.get(elId);
      if (elId !== cdElId) treeList.push(elId);
      const el = S.EL.find(x => x.id === elId);
      const cables = S.CN.filter(cn => cn.fromElId === elId || cn.toElId === elId || cn.from === elId);
      cables.forEach(cn => {
        if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circ.toString()) return;
        if ((cn.fromElId === cdElId && cn.fromCircuit !== circ) || (cn.toElId === cdElId && cn.toCircuit !== circ)) return;
        const currentTerm = (cn.fromElId === elId) ? cn.fromTerm : (cn.toElId === elId) ? cn.toTerm : null;
        if (el && !isConnectionActive(el, currentTerm)) return;
        const childId = cn.fromElId === elId ? cn.toElId : (cn.toElId === elId ? cn.fromElId : null);
        if (!childId || visitedEls.has(childId)) return;
        visitedEls.add(childId);
        const childEl = S.EL.find(x => x.id === childId); if (!childEl) return;
        let childActiveFuse = parentNode.active_fuse;
        if (childEl.type === 'stalp_cs') childActiveFuse = parseFloat(childEl.cs_fuse) || 100;
        let tipConductor = cn.tipConductor || 'Clasic Al';
        let sectiune = parseFloat(cn.sectiune) || 16;
        const hasManualTip = cn.tipConductor && cn.tipConductor !== 'Clasic Al';
        const hasManualSec = cn.sectiune && cn.sectiune !== 16;
        if (!hasManualTip || !hasManualSec) {
          const checkTextForSpecs = (txt) => {
            if (!txt) return;
            const safeTxt = txt.replace(/\+25|\+35|\+50/g, '');
            if (!hasManualSec) {
              const secMatchExact = safeTxt.match(/[234]\s*x\s*(16|25|35|50|70|95|120|150|185|240)/i);
              if (secMatchExact) sectiune = parseFloat(secMatchExact[1]);
              else { const secMatch = safeTxt.match(/(?:x|\s)(16|25|35|50|70|95|120|150|185|240)(?:\s|mmp|m|$)/i); if (secMatch) sectiune = parseFloat(secMatch[1]); }
            }
            if (!hasManualTip) {
              if (txt.toLowerCase().includes('torsadat') || txt.toLowerCase().includes('nfa')) tipConductor = 'Torsadat Al';
              if (txt.toLowerCase().includes('clasic') || txt.toLowerCase().includes('acsr')) tipConductor = 'Clasic Al';
              if (txt.toLowerCase().includes('cyaby') || txt.toLowerCase().includes('ac2y')) tipConductor = 'Cablu Al';
            }
          };
          checkTextForSpecs(cn.label);
          if (cn.path.length >= 2) {
            const mx = (cn.path[0].x + cn.path[cn.path.length - 1].x) / 2;
            const my = (cn.path[0].y + cn.path[cn.path.length - 1].y) / 2;
            S.EL.filter(e => e.type === 'text').forEach(tEl => { if (Math.hypot(tEl.x - mx, tEl.y - my) < 120) checkTextForSpecs(tEl.label); });
          }
        }
        const tipRetea = cn.tipRetea || 'Trifazat', L = parseFloat(cn.length) || 0, totalLenSoFar = L_cum + L;
        let nrCons = 0;
        if (childEl.cons_dict) {
          if (childEl.cons_dict[traceGroup] !== undefined) nrCons = parseInt(childEl.cons_dict[traceGroup]) || 0;
          else if (childEl.cons_dict['Implicit'] !== undefined) nrCons = parseInt(childEl.cons_dict['Implicit']) || 0;
        } else nrCons = parseInt(childEl.consumatori) || 0;
        const P_cablu = parseFloat(cn.putereConc) || 0;
        const r0 = getR0(tipConductor, sectiune) || 0;
        const x0 = getX0(tipConductor, sectiune);
        let r_nul = r0, x_nul = x0;
        if (tipConductor.includes('Torsadat')) { if (sectiune >= 35) { r_nul = 641; x_nul = 0.086; } }
        else if (tipConductor.includes('Cablu')) { if (sectiune >= 50) r_nul = getR0(tipConductor, Math.max(16, sectiune / 2)) || (r0 * 2); }
        let R_tr = (r0 + r_nul) * (L / 1000);
        let X_tr = (x0 + x_nul) * 1000 * (L / 1000);
        const R_cum = parentNode.R_cum + R_tr;
        const X_cum = parentNode.X_cum + X_tr;
        const Z_k = Math.sqrt(R_cum * R_cum + X_cum * X_cum);
        const Isc = Z_k > 0 ? (230 / Z_k) : 0;
        const nodeData = { elId: childId, label: childEl.label || childId, parentId: elId, children: [], nrCons, P_cablu, L, L_cumulat: totalLenSoFar, duNod: 0, duTronson: 0, tipConductor, sectiune, tipRetea, lineType: cn.lineType || 'solid', path: [...path, childEl.label || '?'], circKey: traceGroup, P_total_branch: 0, P_eff: 0, R_cum, X_cum, Isc, active_fuse: childActiveFuse, protected_by: parentNode.active_fuse, isEnd: false, P_eff_dU: 0, P_tot_base: 0, r0_val: r0 };
        nodes.set(childId, nodeData); parentNode.children.push(childId); queue.push({ elId: childId, path: nodeData.path, L_cum: totalLenSoFar });
      });
    }

    for (let i = treeList.length - 1; i >= 0; i--) {
      const nId = treeList[i], node = nodes.get(nId);
      let downstream_cons = node.nrCons, I278_tranzit = 0;
      node.children.forEach(cId => { const childNode = nodes.get(cId); downstream_cons += childNode.totalDownstreamCons; I278_tranzit += childNode.P_tot_base || 0; });
      node.totalDownstreamCons = downstream_cons;
      const K278_local = node.nrCons, J273_Pc = parseFloat(Pc_abonat) || 2;
      const L278_Ks = (!isNaN(forceKs) && forceKs > 0) ? forceKs : getKs(K278_local, tipAmplasare || 'RURAL');
      const M278_distrib = K278_local * J273_Pc * L278_Ks;
      const J278_conc = node.P_cablu || 0;
      const N278_total = M278_distrib + J278_conc + I278_tranzit;
      node.P_tot_base = N278_total;
      node.P_eff_dU = (M278_distrib / 2) + J278_conc + I278_tranzit;
      node.P_total_branch = N278_total;
    }

    treeList.forEach(nId => {
      const node = nodes.get(nId);
      if (node.parentId) { const pNode = nodes.get(node.parentId); node.duTronson = calcDU_tronson(node.L, node.P_eff_dU, node.tipRetea, node.sectiune); node.duNod = pNode.duNod + node.duTronson; }
      if (node.children.length === 0) node.isEnd = true;
      allResults.set(traceGroup + '_' + nId, node);
    });
  }
  return allResults;
}

export function runVD() {
  const srcRaw = document.getElementById('vd-src').value;
  const Pc = parseFloat(document.getElementById('vd-pc').value) || 2, amp = document.getElementById('vd-amp').value;
  const fuseA = parseFloat(document.getElementById('vd-fuse').value) || 160;
  const forceKs = parseFloat(document.getElementById('vd-ks')?.value);
  const showIsc = document.getElementById('vd-show-isc')?.checked !== false;
  if (!srcRaw) { toast('Selectează o sursă', 'ac'); return; }
  const selectedCircuit = document.getElementById('vd-circ')?.value || 'all';
  let cdId, ptab2tTD = 0;
  if (srcRaw.includes('__cel')) {
    const parts = srcRaw.split('__cel'); cdId = parseInt(parts[0]);
    const parentEl = S.EL.find(x => x.id === cdId);
    if (parentEl) {
      const celIdx = parseInt(parts[1]);
      const cel = parentEl.celule?.[celIdx];
      if (cel) {
        const putereKVA = parseInt((cel.putere || '100').replace(/[^0-9]/g, '')) || 100;
        const validPowers = [50, 100, 160, 250, 400, 630, 1000];
        const closest = validPowers.reduce((a, b) => Math.abs(b - putereKVA) < Math.abs(a - putereKVA) ? b : a);
        document.getElementById('vd-trafo').value = closest;
      }
    }
  } else if (srcRaw.includes('__td')) {
    const parts = srcRaw.split('__td'); cdId = parseInt(parts[0]); ptab2tTD = parseInt(parts[1]);
  } else {
    cdId = parseInt(srcRaw);
  }
  const cdEl = S.EL.find(x => x.id === cdId);
  if (!cdEl) { toast('Sursa negăsită', 'ac'); return; }
  if (cdEl.type === 'ptab_2t' && ptab2tTD > 0) S.vdResults = calcNetworkVD_ptab2t(cdId, Pc, amp, forceKs, ptab2tTD);
  else S.vdResults = calcNetworkVD(cdId, Pc, amp, forceKs);

  const rows = [];
  S.vdResults.forEach((data) => {
    if (data.elId === cdId) return;
    if (selectedCircuit !== 'all' && data.circKey !== selectedCircuit) return;
    const el = S.EL.find(x => x.id === data.elId); if (!el) return;
    if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;
    const evalFuse = data.protected_by || fuseA;
    const iscAmps = data.Isc * 1000;
    const isIscLow = showIsc && iscAmps > 0 && iscAmps < 3 * evalFuse;
    const duColor = data.duNod > 10 ? '#ff3d71' : data.duNod > 5 ? '#ff9f43' : data.duNod > 3 ? '#eab308' : '#00e5a0';
    rows.push({ el, data, duColor, isIscLow, evalFuse });
  });
  rows.sort((a, b) => b.data.duNod - a.data.duNod);

  let html = `<table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:8px">
    <thead><tr style="border-bottom:1px solid var(--border2)"><th style="text-align:left;padding:3px 5px;color:var(--text3)">Nod</th><th style="text-align:left;padding:3px 5px;color:var(--text3)">Conductor</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">L (m)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">L cum. (m)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">r₀ (Ω/km)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">P (kW)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">ΔU tronson%</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">ΔU nod%</th>${showIsc ? '<th style="text-align:right;padding:3px 5px;color:var(--text3)">Isc 1F (kA)</th>' : ''}</tr></thead><tbody>`;
  rows.forEach(({ el, data, duColor, isIscLow, evalFuse }) => {
    const warn = isIscLow ? ` <span style="color:#ff3d71;font-weight:900" title="Isc < 3*In (${evalFuse}A). Necesar Cutie Selectivitate!">⚠️CS</span>` : (data.duNod > 10 ? ' ⚠️' : data.duNod > 5 ? ' ⚡' : '');
    html += `<tr style="border-bottom:1px solid var(--border);cursor:pointer" onclick="selectEl(${data.elId});updateProps()">
      <td style="padding:3px 5px;color:var(--accent);font-weight:700"><span style="color:var(--text3);font-size:7px">[${data.circKey}]</span> ${data.label}${warn}</td>
      <td style="padding:3px 5px;color:var(--text2)">${data.tipConductor || '—'} ${data.sectiune || ''}mm²<br><span style="color:var(--text3)">${data.tipRetea || ''}</span></td>
      <td style="text-align:right;padding:3px 5px">${data.L ? data.L.toFixed(0) : '—'}</td><td style="text-align:right;padding:3px 5px;color:var(--text3)">${data.L_cumulat ? data.L_cumulat.toFixed(0) : '—'}</td><td style="text-align:right;padding:3px 5px;color:var(--text3)">${data.r0 ? (data.r0 / 1000).toFixed(4) : '—'}</td><td style="text-align:right;padding:3px 5px">${data.P_total_branch ? data.P_total_branch.toFixed(2) : '—'}</td>
      <td style="text-align:right;padding:3px 5px;color:${data.duTronson > 3 ? '#ff9f43' : 'var(--text2)'}">${data.duTronson ? data.duTronson.toFixed(3) : '0.000'}</td><td style="text-align:right;padding:3px 5px;font-weight:700;color:${duColor}">${data.duNod.toFixed(3)}</td>
      ${showIsc ? `<td style="text-align:right;padding:3px 5px;font-weight:700;color:#ff3d71">${data.Isc ? data.Isc.toFixed(3) : '-'}</td>` : ''}</tr>`;
  });
  const maxDU = rows.length > 0 ? rows[0].data.duNod : 0, worstNode = rows.length > 0 ? rows[0] : null;
  html += `</tbody></table><div style="padding:8px 6px;border-top:1px solid var(--border2);display:flex;gap:12px;flex-wrap:wrap;margin-top:4px"><div style="font-size:8.5px"><span style="color:var(--text3)">ΔU max nod: </span><span style="color:${maxDU > 10 ? '#ff3d71' : maxDU > 5 ? '#ff9f43' : '#00e5a0'};font-weight:700">${maxDU.toFixed(3)}%</span>${worstNode ? `<span style="color:var(--text3)"> @ [${worstNode.data.circKey}] ${worstNode.data.label}</span>` : ''}</div><div style="font-size:8.5px"><span style="color:var(--text3)">Limita admisă: </span><span style="color:var(--text2)">±10% (PE 132)</span></div></div><div style="padding:4px 6px;font-size:7.5px;color:var(--text3);border-top:1px solid var(--border)">🟢 ΔU&lt;3% &nbsp; 🟡 3-5% &nbsp; 🟠 5-10% &nbsp; 🔴 &gt;10% — Click pe nod pentru selectare</div>`;
  document.getElementById('vd-body').innerHTML = html;
  if (S.vdOverlayOn) renderVDOverlay();
  toast('Calcul finalizat — ' + rows.length + ' rezultate per noduri', 'ok');
}

export function copyVDTable() {
  if (!S.vdResults || S.vdResults.size === 0) { toast('Nu există rezultate — apasă CALCULEAZĂ mai întâi', 'ac'); return; }
  const showIsc = document.getElementById('vd-show-isc')?.checked !== false;
  const rows = [];
  S.vdResults.forEach((data) => {
    const el = S.EL.find(x => x.id === data.elId); if (!el) return;
    if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'meter' ||
        el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;
    let localCons = 0;
    if (el.cons_dict) {
      const grp = data.circKey || 'Implicit';
      localCons = parseInt(el.cons_dict[grp] || el.cons_dict['Implicit'] || 0) || 0;
    } else { localCons = parseInt(el.consumatori) || 0; }
    rows.push({ label: data.label || el.label || '?', circuit: data.circKey || '', conductor: (data.tipConductor || '—') + ' ' + (data.sectiune || '') + 'mm²', L: data.L || 0, Lcum: data.L_cumulat || 0, nrCons: localCons, P: data.P_total_branch || 0, duNod: data.duNod || 0, Isc: data.Isc || 0 });
  });
  if (rows.length === 0) { toast('Nu există noduri în rezultate', 'ac'); return; }
  rows.sort((a, b) => a.circuit.localeCompare(b.circuit) || a.Lcum - b.Lcum);

  const maxDU = rows.reduce((m, r) => Math.max(m, r.duNod), 0);
  const consPerCircuit = {};
  rows.forEach(r => { if (!consPerCircuit[r.circuit]) consPerCircuit[r.circuit] = 0; consPerCircuit[r.circuit] += r.nrCons; });
  const consText = Object.entries(consPerCircuit).map(([c, n]) => `Consumatori pe ${c} = ${n} consumatori`).join('; ');

  const td = (txt, extra = '') => `<td style="border:1px solid #000;padding:3px 6px;font-size:10pt;font-family:Calibri,sans-serif${extra}">${txt}</td>`;
  const th = (txt) => `<th style="border:1px solid #000;padding:3px 6px;font-size:10pt;font-family:Calibri,sans-serif;background:#1F3864;color:#fff;font-weight:bold;text-align:center">${txt}</th>`;

  const hdrs = ['Nod', 'Circuit', 'Conductor', 'L(m)', 'L cum.(m)', 'Nr.cons.', 'P(kW)', 'ΔU nod%'];
  if (showIsc) hdrs.push('Isc 1F(kA)');

  let tableRows = '';
  rows.forEach(r => {
    const duColor = r.duNod > 10 ? '#ff0000' : r.duNod > 5 ? '#cc4400' : r.duNod > 3 ? '#856400' : '#006600';
    const cells = [
      td(r.label, ';font-weight:bold'),
      td(r.circuit, ';text-align:center'),
      td(r.conductor),
      td(r.L.toFixed(0), ';text-align:right'),
      td(r.Lcum.toFixed(0), ';text-align:right'),
      td(String(r.nrCons), ';text-align:right'),
      td(r.P.toFixed(2), ';text-align:right'),
      td(r.duNod.toFixed(3), `;text-align:right;font-weight:bold;color:${duColor}`)
    ];
    if (showIsc) cells.push(td(r.Isc > 0 ? r.Isc.toFixed(3) : '-', ';text-align:right'));
    tableRows += `<tr>${cells.join('')}</tr>`;
  });

  const html = `<html><body>
<p style="font-family:Calibri,sans-serif;font-size:11pt;font-weight:bold;margin-bottom:6px">Calcul căderi de tensiune (PE 132/2003):</p>
<table style="border-collapse:collapse;width:100%">
  <thead><tr>${hdrs.map(th).join('')}</tr></thead>
  <tbody>${tableRows}</tbody>
</table>
<p style="font-family:Calibri,sans-serif;font-size:10pt;margin-top:6px">ΔU max nod: ${maxDU.toFixed(3)}% — Limita admisă: ±10% (PE 132)</p>
<p style="font-family:Calibri,sans-serif;font-size:10pt">${consText}</p>
</body></html>`;

  const plainLines = [hdrs.join('\t')];
  rows.forEach(r => {
    const c = [r.label, r.circuit, r.conductor, r.L.toFixed(0), r.Lcum.toFixed(0), String(r.nrCons), r.P.toFixed(2), r.duNod.toFixed(3)];
    if (showIsc) c.push(r.Isc > 0 ? r.Isc.toFixed(3) : '-');
    plainLines.push(c.join('\t'));
  });
  plainLines.push('', `ΔU max nod: ${maxDU.toFixed(3)}% — Limita admisă: ±10% (PE 132)`, consText);

  try {
    navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plainLines.join('\n')], { type: 'text/plain' })
    })]).then(() => toast('Tabel copiat în clipboard ✓ (paste în Word/Excel)', 'ok')).catch(() => {
      navigator.clipboard.writeText(plainLines.join('\n')).then(() => toast('Copiat (text simplu) ✓', 'ok'));
    });
  } catch (_) {
    navigator.clipboard.writeText(plainLines.join('\n')).then(() => toast('Copiat (text simplu) ✓', 'ok'));
  }
}

export function updateGenSrcUI() {
  const src = document.getElementById('gen-src').value;
  const isPTAB = src === 'ptab_1t' || src === 'ptab_2t';
  document.getElementById('gen-cd-row').style.display = isPTAB ? 'none' : 'flex';
  document.getElementById('gen-td-row').style.display = src === 'ptab_2t' ? 'flex' : 'none';
  document.getElementById('gen-plecari-lbl').textContent = isPTAB ? 'Circuite din tablou (ramuri)' : 'Câte Plecări (Ramuri)?';
  if (isPTAB) {
    document.getElementById('gen-plecari').max = 8;
    if (parseInt(document.getElementById('gen-plecari').value) > 8) document.getElementById('gen-plecari').value = 8;
  }
}

export function toggleAutoDraw() {
  const m = document.getElementById('gen-modal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
  if (m.style.display === 'flex') { document.getElementById('deriv-container').innerHTML = ''; updateGenSrcUI(); }
}

export function addDerivRow(parentContainer, depth) {
  const c = parentContainer || document.getElementById('deriv-container');
  depth = depth || 0;
  const id = Date.now() + Math.floor(Math.random() * 10000);
  const div = document.createElement('div');
  div.className = 'deriv-row'; div.dataset.depth = depth;
  div.style.display = 'flex'; div.style.flexDirection = 'column'; div.style.gap = '4px'; div.id = `deriv-${id}`;
  div.style.marginLeft = (depth * 16) + 'px';
  div.style.borderLeft = depth > 0 ? '2px solid var(--accent)' : '2px solid var(--accentg)';
  div.style.paddingLeft = '6px'; div.style.paddingTop = '4px'; div.style.paddingBottom = '4px';
  const headerDiv = document.createElement('div');
  headerDiv.style.display = 'flex'; headerDiv.style.gap = '4px'; headerDiv.style.alignItems = 'center'; headerDiv.style.flexWrap = 'wrap';
  const depthLabel = depth === 0 ? 'Derivație' : 'Sub-derivație (niv.' + depth + ')';
  const depthColor = depth === 0 ? 'var(--accentg)' : 'var(--accent)';
  const isVertical = depth % 2 === 0;
  const dirOptions = isVertical
    ? '<option value="sus">Sus</option><option value="jos">Jos</option>'
    : '<option value="stanga">Stânga</option><option value="dreapta">Dreapta</option>';
  headerDiv.innerHTML = `
    <span style="font-size:7.5px;color:${depthColor};font-weight:800;text-transform:uppercase">${depthLabel}</span>
    <span style="font-size:8px;color:var(--text2)">La elem.:</span>
    <input type="number" class="pi d-parent" style="width:35px;padding:3px" min="1" value="3">
    <span style="font-size:8px;color:var(--text2)">Lung.:</span>
    <input type="number" class="pi d-count" style="width:35px;padding:3px" min="1" value="3">
    <select class="pi d-dir" style="width:55px;padding:3px">${dirOptions}</select>
    <select class="pi d-tip-cond" style="width:75px;padding:3px" title="Tip conductor">
      <option value="Torsadat Al">Torsadat Al</option>
      <option value="Clasic Al">Clasic Al</option>
      <option value="Cablu Al">Cablu Al</option>
      <option value="Cablu Cu">Cablu Cu</option>
    </select>
    <select class="pi d-sectiune" style="width:50px;padding:3px" title="Secțiune mm²">
      <option value="16">16</option><option value="25" selected>25</option><option value="35">35</option>
      <option value="50">50</option><option value="70">70</option><option value="95">95</option>
      <option value="120">120</option><option value="150">150</option>
    </select>
    <button onclick="addDerivRow(document.getElementById('sub-${id}'), ${depth + 1})" style="background:rgba(0,207,255,.1);border:1px solid rgba(0,207,255,.3);color:var(--accent);border-radius:4px;font-size:7px;padding:2px 5px;cursor:pointer;font-weight:bold" title="Adaugă sub-derivație">+ SUB</button>
    <button onclick="document.getElementById('deriv-${id}').remove()" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-weight:bold">✕</button>
  `;
  div.appendChild(headerDiv);
  const subContainer = document.createElement('div');
  subContainer.id = `sub-${id}`; subContainer.style.display = 'flex'; subContainer.style.flexDirection = 'column'; subContainer.style.gap = '4px'; subContainer.style.marginTop = '4px';
  div.appendChild(subContainer);
  c.appendChild(div);
}

export function runGenerator() {
  if (S.EL.length > 0 && !confirm('Atenție: Generarea automată va șterge elementele curente de pe planșă. Ești sigur că vrei să continui?')) return;
  saveState('generator auto');
  S.EL = []; S.CN = []; Object.keys(S.counters).forEach(k => delete S.counters[k]); S.sel = null; S.multiSel.clear();

  const srcType = document.getElementById('gen-src').value;
  const cdType = document.getElementById('gen-cd').value;
  const plecari = parseInt(document.getElementById('gen-plecari').value) || 1;
  const numStalpi = parseInt(document.getElementById('gen-stalpi').value) || 4;
  const stType = document.getElementById('gen-st-tip').value;
  const isSubteran = stType.startsWith('firida');

  function parseDerivations(container) {
    const derivs = [];
    const rows = container.querySelectorAll(':scope > .deriv-row');
    rows.forEach(row => {
      const p = parseInt(row.querySelector(':scope > div > .d-parent').value) || 1;
      const c = parseInt(row.querySelector(':scope > div > .d-count').value) || 1;
      const d = row.querySelector(':scope > div > .d-dir').value;
      const tc = row.querySelector(':scope > div > .d-tip-cond').value;
      const sec = parseFloat(row.querySelector(':scope > div > .d-sectiune').value) || 25;
      const subContainer = row.querySelector(':scope > div:last-child');
      const subDerivs = subContainer ? parseDerivations(subContainer) : [];
      derivs.push({ parentIdx: p, count: c, dir: d, tipConductor: tc, sectiune: sec, subDerivations: subDerivs });
    });
    return derivs;
  }
  let derivations = parseDerivations(document.getElementById('deriv-container'));

  const mainTipCond = document.getElementById('gen-tip-cond').value;
  const mainSectiune = parseFloat(document.getElementById('gen-sectiune').value) || 35;

  const CM = { ptab_1t: '#1a6ba0', ptab_2t: '#1a6ba0', trafo: '#1a6ba0', cd4: '#555', cd5: '#555', cd8: '#555', stalp_se4: '#555', stalp_se10: '#555', stalp_rotund: '#555', stalp_rotund_special: '#555', firida_e2_4: '#555', firida_e3_4: '#555', firida_e3_0: '#555' };
  const srcId = uid();
  const srcEl = { id: srcId, type: srcType, x: -100, y: 0, label: nextLbl(srcType), color: CM[srcType] || '#1a6ba0', fillColor: 'none', rotation: 0, scale: 1 };
  if (srcType === 'ptab_1t') srcEl.fuses = new Array(10).fill(true);
  if (srcType === 'ptab_2t') srcEl.fuses = new Array(21).fill(true);
  S.EL.push(srcEl);

  let distId = srcId;
  let currentX = srcType.startsWith('ptab') ? 400 : 50;

  if (srcType === 'trafo' && cdType !== 'none') {
    distId = uid() + 1;
    currentX = 150;
    const cdEl = { id: distId, type: cdType, x: currentX, y: 0, label: nextLbl(cdType), color: CM[cdType] || '#555', fillColor: 'none', rotation: 0, scale: 1 };
    S.EL.push(cdEl);
    const tTerms = sym(srcEl).terms, cdTerms = sym(cdEl).terms;
    const tOut = tTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
    const cdIn = cdTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
    S.CN.push({ id: uid() + 2, fromElId: srcId, fromTerm: { cx: tOut.cx, cy: tOut.cy }, toElId: distId, toTerm: { cx: cdIn.cx, cy: cdIn.cy }, path: [{ x: -100 + tOut.cx, y: tOut.cy }, { x: currentX + cdIn.cx, y: cdIn.cy }], label: 'Racord', length: 15, color: '#ef4444', strokeWidth: 3, lineType: 'solid', tipConductor: 'Clasic Al', sectiune: 50, tipRetea: 'Trifazat' });
    currentX += 100;
  } else if (srcType === 'trafo') {
    currentX += 50;
  }

  const distEl = S.EL.find(e => e.id === distId);
  const dTerms = sym(distEl).terms;
  const xSpacing = isSubteran ? 250 : 110;
  const ySpacing = isSubteran ? 250 : 110;
  const isPTAB2T = srcType === 'ptab_2t';
  const isPTAB = srcType === 'ptab_1t' || isPTAB2T;

  function drawBranch(startElId, startTermOut, startX, startY, circNum, branchStalpi, branchType, isDeriv, dirMultiplier, branchDerivations, derivDepth, isHorizontalDeriv, branchTipCond, branchSectiune) {
    let prevId = startElId, prevTermOut = startTermOut, lineX = startX, lineY = startY;
    derivDepth = derivDepth || 0;
    const myDerivations = branchDerivations || derivations;
    for (let s = 1; s <= branchStalpi; s++) {
      const stId = uid() + Math.floor(Math.random() * 100000);
      if (isDeriv) {
        if (isHorizontalDeriv) lineX += xSpacing * dirMultiplier;
        else lineY += (isSubteran ? 250 : 110) * dirMultiplier;
      } else { lineX += xSpacing; }
      let isCapat = false, isNod = false;
      const derivHere = myDerivations.filter(d => d.parentIdx === s);
      if (s === branchStalpi && derivHere.length === 0) isCapat = true;
      if (derivHere.length > 0) isNod = true;
      let actualType = branchType;
      if (!isSubteran && (isCapat || isNod)) {
        if (branchType === 'stalp_sc10002') actualType = 'stalp_sc10005';
        else actualType = 'stalp_se10';
      }
      let nouEl = { id: stId, type: actualType, x: lineX, y: lineY, label: nextLbl(actualType), color: CM[actualType] || '#555', fillColor: 'none', rotation: 0, scale: 1, consumatori: 2 };
      if (actualType === 'firida_e2_4') nouEl.fuses = new Array(6).fill(true);
      if (actualType === 'firida_e3_4') nouEl.fuses = new Array(7).fill(true);
      if (actualType === 'firida_e3_0') nouEl.fuses = new Array(3).fill(true);
      if (isCapat) nouEl.nod = 'capat';
      if (isNod) nouEl.nod = 'nod';
      S.EL.push(nouEl);
      const stTerms = sym(S.EL[S.EL.length - 1]).terms;
      let stIn, stOut;
      if (isSubteran) {
        const topTerms = stTerms.filter(t => t.cy < 0);
        if (topTerms.length > 0) { stIn = topTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr); stOut = topTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr); }
        else { stIn = stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr); stOut = stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr); }
      } else {
        if (isDeriv && isHorizontalDeriv) {
          if (dirMultiplier > 0) { stIn = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr); stOut = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr); }
          else { stIn = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr); stOut = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr); }
        } else if (isDeriv) {
          if (dirMultiplier < 0) { stIn = stTerms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr); stOut = stTerms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr); }
          else { stIn = stTerms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr); stOut = stTerms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr); }
        } else {
          stIn = stTerms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr);
          stOut = stTerms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
        }
      }
      const prevElForPos = S.EL.find(e => e.id === prevId);
      const p1 = prevElForPos ? { x: prevElForPos.x + prevTermOut.cx, y: prevElForPos.y + prevTermOut.cy } : { x: prevTermOut.cx, y: prevTermOut.cy };
      const lastEl = S.EL[S.EL.length - 1];
      const p2 = { x: lastEl.x + stIn.cx, y: lastEl.y + stIn.cy };
      let cPath;
      const srcElType = S.EL.find(e => e.id === prevId)?.type || '';
      const uHeight = 30;
      if (srcElType.startsWith('ptab_') && s === 1 && !isSubteran) cPath = [p1, { x: p1.x, y: p2.y }, p2];
      else if (srcElType.startsWith('ptab_') && s === 1 && isSubteran) { const dropY = p1.y + 30; cPath = [p1, { x: p1.x, y: dropY }, { x: p2.x, y: dropY }, p2]; }
      else if (isSubteran && (srcElType.startsWith('cd') || srcElType === 'trafo') && s === 1) cPath = [p1, { x: p2.x, y: p1.y }, p2];
      else if (isSubteran && !isDeriv) { const uY = Math.min(p1.y, p2.y) - uHeight; cPath = [p1, { x: p1.x, y: uY }, { x: p2.x, y: uY }, p2]; }
      else cPath = [p1, p2];
      const dLabel = derivDepth > 0 ? `SD${derivDepth}-C${circNum}-${s}` : (isDeriv ? `D${circNum}-${s}` : `C${circNum}-${s}`);
      const useTipCond = branchTipCond || mainTipCond;
      const useSectiune = branchSectiune || mainSectiune;
      const isCableLES = useTipCond.startsWith('Cablu');
      S.CN.push({ id: uid() + Math.floor(Math.random() * 100000), fromElId: prevId, fromTerm: { cx: prevTermOut.cx, cy: prevTermOut.cy }, toElId: stId, toTerm: { cx: stIn.cx, cy: stIn.cy }, path: cPath, label: dLabel, length: isDeriv ? 30 : 40, color: '#ef4444', strokeWidth: isCableLES ? 3 : 2, lineType: isCableLES ? 'dashed' : 'solid', circuitGroup: `C${circNum}`, fromCircuit: (prevId === distId) ? circNum : null, tipConductor: useTipCond, sectiune: useSectiune, tipRetea: 'Trifazat', putereConc: 0 });
      prevId = stId; prevTermOut = stOut;
      if (derivHere.length > 0) {
        derivHere.forEach(deriv => {
          const stEl = S.EL.find(e => e.id === stId);
          const dtms = sym(stEl).terms;
          let derivTermOut, dirMul, nextIsHorizontal;
          if (deriv.dir === 'sus') { derivTermOut = dtms.find(t => t.cy < -15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => (prev.cy < curr.cy) ? prev : curr); dirMul = -1; nextIsHorizontal = false; }
          else if (deriv.dir === 'jos') { derivTermOut = dtms.find(t => t.cy > 15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => (prev.cy > curr.cy) ? prev : curr); dirMul = 1; nextIsHorizontal = false; }
          else if (deriv.dir === 'dreapta') { derivTermOut = dtms.find(t => t.cx > 15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr); dirMul = 1; nextIsHorizontal = true; }
          else if (deriv.dir === 'stanga') { derivTermOut = dtms.find(t => t.cx < -15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => (prev.cx < curr.cx) ? prev : curr); dirMul = -1; nextIsHorizontal = true; }
          drawBranch(stId, derivTermOut, lineX, lineY, circNum, deriv.count, branchType, true, dirMul, deriv.subDerivations || [], derivDepth + 1, nextIsHorizontal, deriv.tipConductor, deriv.sectiune);
        });
      }
    }
  }

  if (isPTAB2T) {
    const selectedTD = parseInt(document.getElementById('gen-td').value) || 1;
    const plecariPerTD = Math.min(plecari, 8);
    const ptabBaseOffset = 150, circSpacing = ySpacing;
    const circStart = selectedTD === 1 ? 1 : 9;
    for (let c = 1; c <= plecariPerTD; c++) {
      const circInternal = circStart + (c - 1);
      let outTerm = dTerms.find(t => t.circuit === circInternal); if (!outTerm) continue;
      const startX = srcEl.x + outTerm.cx;
      const yOff = ptabBaseOffset + (c - 1) * circSpacing;
      const startY = srcEl.y + outTerm.cy + yOff;
      drawBranch(distId, outTerm, startX, startY, circInternal, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
    }
  } else if (isPTAB) {
    const plecariPTAB = Math.min(plecari, 8);
    const ptabBaseOffset = 150, circSpacing = ySpacing;
    for (let c = 1; c <= plecariPTAB; c++) {
      let outTerm = dTerms.find(t => t.circuit === c); if (!outTerm) continue;
      const startX = srcEl.x + outTerm.cx;
      const yOff = ptabBaseOffset + (c - 1) * circSpacing;
      const startY = srcEl.y + outTerm.cy + yOff;
      drawBranch(distId, outTerm, startX, startY, c, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
    }
  } else {
    for (let c = 1; c <= plecari; c++) {
      let outTerm = dTerms.find(t => t.circuit === c);
      if (!outTerm) outTerm = dTerms.reduce((prev, curr) => (prev.cx > curr.cx) ? prev : curr);
      const baseY = (c - ((plecari + 1) / 2)) * ySpacing + (isSubteran ? 100 : 0);
      drawBranch(distId, outTerm, currentX, baseY, c, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
    }
  }

  toggleAutoDraw();
  render(); updateProps(); updateStat();
  toast('✨ Schema a fost generată automat!', 'ok');
  const wElem = document.getElementById('cw');
  if (wElem) { S.view.x = wElem.clientWidth / 2 - 150; S.view.y = wElem.clientHeight / 2; S.view.s = 0.6; applyView(); }
}

export function generateVDTableSVG(startX, startY) {
  if (!S.vdResults || S.vdResults.size === 0) return { svg: '', w: 0, h: 0 };
  const cdId = parseInt(document.getElementById('vd-src').value);
  const cdLabel = S.EL.find(x => x.id === cdId)?.label || 'Sursă';
  const showIsc = document.getElementById('vd-show-isc')?.checked !== false;

  const circuitGroups = new Map();
  S.vdResults.forEach((data, key) => {
    if (data.elId === cdId) return;
    const el = S.EL.find(x => x.id === data.elId); if (!el) return;
    if (el.type.startsWith('cd') || el.type.startsWith('ptab_') || el.type === 'trafo' || el.type === 'celula_linie_mt' || el.type === 'celula_trafo_mt' || el.type === 'bara_mt' || el.type === 'bara_statie_mt') return;
    const circ = data.circKey || 'Necunoscut';
    if (!circuitGroups.has(circ)) circuitGroups.set(circ, []);
    circuitGroups.get(circ).push({ el, data });
  });
  if (circuitGroups.size === 0) return { svg: '', w: 0, h: 0 };

  const cols = [{ label: 'Nod', w: 100, align: 'start' }, { label: 'L(m)', w: 50, align: 'end' }, { label: 'L cum', w: 60, align: 'end' }, { label: 'dU nod(%)', w: 70, align: 'end' }];
  if (showIsc) cols.push({ label: 'Isc(kA)', w: 65, align: 'end' });

  const rowH = 18;
  let tableW = cols.reduce((sum, c) => sum + c.w, 0), totalH = 0;
  let svg = `<g id="export-vd-tables" transform="translate(${startX}, ${startY})">`;
  const bgColor = S.lightMode ? '#ffffff' : '#0b1220';
  const strokeColor = S.lightMode ? '#a8bccc' : '#243755';
  const textColor = S.lightMode ? '#1a2740' : '#dce8f5';
  const accentColor = S.lightMode ? '#0077cc' : '#00cfff';

  const sortedCircuits = Array.from(circuitGroups.keys()).sort();
  sortedCircuits.forEach(circ => {
    const rows = circuitGroups.get(circ); rows.sort((a, b) => b.data.duNod - a.data.duNod);
    let tableH = (rows.length + 2) * rowH;
    svg += `<g transform="translate(0, ${totalH})"><rect x="0" y="0" width="${tableW}" height="${tableH}" fill="${bgColor}" stroke="${strokeColor}" stroke-width="1.5" rx="4"/>`;
    svg += `<text x="8" y="14" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" fill="${accentColor}">CALCUL CĂDERI DE TENSIUNE — Sursa: ${cdLabel} | Circuit: ${circ}</text>`;
    let currentX = 0;
    svg += `<line x1="0" y1="${rowH}" x2="${tableW}" y2="${rowH}" stroke="${strokeColor}" stroke-width="1"/>`;
    cols.forEach(c => {
      const tx = c.align === 'start' ? currentX + 6 : currentX + c.w - 6;
      svg += `<text x="${tx}" y="${rowH + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="${textColor}" text-anchor="${c.align}">${c.label}</text>`;
      currentX += c.w;
    });
    svg += `<line x1="0" y1="${rowH * 2}" x2="${tableW}" y2="${rowH * 2}" stroke="${strokeColor}" stroke-width="1"/>`;
    rows.forEach((r, i) => {
      const y = rowH * (i + 2); let cx = 0;
      svg += `<text x="${cx + 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" font-weight="bold">${r.data.label}</text>`; cx += cols[0].w;
      svg += `<text x="${cx + cols[1].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" text-anchor="end">${r.data.L ? r.data.L.toFixed(0) : '-'}</text>`; cx += cols[1].w;
      svg += `<text x="${cx + cols[2].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" text-anchor="end">${r.data.L_cumulat ? r.data.L_cumulat.toFixed(0) : '-'}</text>`; cx += cols[2].w;
      const duCol = r.data.duNod > 10 ? '#ff3d71' : r.data.duNod > 5 ? '#ff9f43' : r.data.duNod > 3 ? '#eab308' : '#00e5a0';
      svg += `<text x="${cx + cols[3].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="${duCol}" text-anchor="end">${r.data.duNod.toFixed(3)}</text>`; cx += cols[3].w;
      if (showIsc) { svg += `<text x="${cx + cols[4].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="#ff3d71" text-anchor="end">${r.data.Isc ? r.data.Isc.toFixed(3) : '-'}</text>`; }
      if (i < rows.length - 1) svg += `<line x1="0" y1="${y + rowH}" x2="${tableW}" y2="${y + rowH}" stroke="${strokeColor}" stroke-width="0.5" stroke-dasharray="2,2"/>`;
    });
    svg += `</g>`; totalH += tableH + 15;
  });
  svg += `</g>`; return { svg, w: tableW, h: totalH > 0 ? totalH - 15 : 0 };
}

export function setFiridaRating(elId, idx, value) {
  const el = S.EL.find(e => e.id === elId);
  if (!el || el.type !== 'firida_gen') return;
  if (!el.ratings) el.ratings = [];
  el.ratings[idx] = value.trim() || 'NH4-50A';
  saveState('rating separator');
  render();
}

export function adjustFiridaCircuits(elId, type, delta) {
  const el = S.EL.find(e => e.id === elId);
  if (!el || el.type !== 'firida_gen') return;
  const nIn = el.inputs || 2;
  const nOut = el.outputs || 4;
  if (!el.fuses) el.fuses = new Array(nIn + nOut).fill(true);
  if (type === 'in' && delta > 0 && nIn < 6) {
    el.fuses.splice(nIn, 0, true);
    el.inputs = nIn + 1;
  } else if (type === 'in' && delta < 0 && nIn > 1) {
    el.fuses.splice(nIn - 1, 1);
    el.inputs = nIn - 1;
  } else if (type === 'out' && delta > 0 && nOut < 8) {
    el.fuses.push(true);
    el.outputs = nOut + 1;
  } else if (type === 'out' && delta < 0 && nOut > 0) {
    el.fuses.splice(nIn + nOut - 1, 1);
    el.outputs = nOut - 1;
  } else return;
  saveState('ajustare circuite firidă');
  render();
  updateProps();
}
