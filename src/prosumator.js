// ElectroCAD Pro v12 — Prosumator Module
import { EL, CN } from './state.js';
import { uid, toast, calcPathLen } from './utils.js';

// ========== Prosumator State ==========

let prosData = {
  pvPower: 5, // kW
  consumption: 3000, // kWh/year
  batterySize: 10, // kWh
  mode: 'self-consumption'
};

export function prosSetData(key, value) {
  prosData[key] = value;
}

export function prosGetData() { return prosData; }

// ========== Prosumator Modal ==========

export function openProsumatorModal() {
  document.getElementById('pros-modal').style.display = 'flex';
  document.getElementById('pros-pv-power').value = prosData.pvPower;
  document.getElementById('pros-consumption').value = prosData.consumption;
  document.getElementById('pros-battery').value = prosData.batterySize;
}

export function closeProsumatorModal() {
  document.getElementById('pros-modal').style.display = 'none';
}

export function toggleProsumator() {
  const btn = document.getElementById('btn-prosumator');
  if (btn) btn.classList.toggle('on');
  const panel = document.getElementById('pros-panel');
  if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

export function runProsumator(){
  const sezon = document.getElementById('pros-sezon').value;
  const lat = 47.16;
  const pMed = parseFloat(document.getElementById('pros-pmed').value) || 0.5;
  const L = parseFloat(document.getElementById('pros-len').value) || 300;
  const S = parseFloat(document.getElementById('pros-sec').value) || 50;
  const Un = parseFloat(document.getElementById('pros-un').value) || 400;

  const mode = document.getElementById('pros-mode').value;
  const content = document.getElementById('pros-content');
  let totalCons, totalPV, csCons, pConsScale;
  const profConsRaw = PROS_PROFILE['cons_'+sezon];
  const profConsPeak = Math.max(...profConsRaw);
  const profPV = pvProfile(lat, sezon);
  const csInj = 0.95;

  // Analiză topologică (client + nod selectat din schemă)
  const nodeId = mode === 'client' ? parseInt(document.getElementById('pros-node').value) : 0;
  let pathAnalysis = null, pathData = null;
  // existingCons/PV = cei care contribuie la fluxul prin PRIMUL cablu (feeder trunk) = totalul care afectează tensiunea la target
  let existingCons = 0, existingPV = 0;
  if(nodeId){
    pathAnalysis = prosAnalyzePath(nodeId);
    pathData = prosFindPath(nodeId);
    if(pathAnalysis && pathData && pathData.segments.length > 0){
      // Primul cablu al drumului — toate sarcinile în aval de sursă care alimentează target-ul trec prin el
      const firstCable = pathData.segments[0];
      const s = pathAnalysis.cableStats.get(firstCable.cableId);
      if(s){ existingCons = s.N_cons; existingPV = s.P_PV; }
    }
  }

  // Construiește map cu încărcări adiționale per nod (clienți ipotetici suplimentari)
  const extraLoadAtNode = new Map();
  if(mode === 'client'){
    for(const cl of prosExtraClients){
      if(!cl.nodeId) continue;
      const nid = parseInt(cl.nodeId);
      if(!nid) continue;
      if(!extraLoadAtNode.has(nid)) extraLoadAtNode.set(nid, { ps: 0, ppv: 0 });
      const e = extraLoadAtNode.get(nid);
      e.ps += cl.ps;
      e.ppv += cl.ppv;
    }
  }
  // Sume pentru statistici
  const extrasTotalPs = [...extraLoadAtNode.values()].reduce((s,e)=>s+e.ps, 0);
  const extrasTotalPV = [...extraLoadAtNode.values()].reduce((s,e)=>s+e.ppv, 0);

  if(mode === 'client'){
    let ps = parseFloat(document.getElementById('pros-ps').value);
    if(isNaN(ps)) ps = 15;
    let ppv = parseFloat(document.getElementById('pros-ppv').value);
    if(isNaN(ppv)) ppv = 25;
    totalCons = 1;
    totalPV = ppv;
    csCons = 1.0;
    pConsScale = ps;
  } else {
    const { totalCons: tc, totalPV: tp } = aggregateSchema();
    if(tc===0 && tp===0){
      content.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text3);font-size:11px">Nu există consumatori sau prosumatori în schemă.<br>Adaugă cantități în proprietățile stâlpilor/firidelor, sau schimbă modul în <b>Client concentrat nou</b>.</div>`;
      return;
    }
    totalCons = tc; totalPV = tp;
    csCons = csConsum(totalCons);
    pConsScale = pMed * totalCons;
  }

  // 168h series — profile peak-normalizat (peak=1.0) aliniat cu PE 132
  // Pentru consumatori schema (Pc peak per consumator): P(t) = N × Pc × ks × profile_peak_norm[t]
  const csExisting = csConsum(existingCons);
  const pNet = new Array(168), pConsArr = new Array(168), pPVArr = new Array(168);
  const pConsClientArr = new Array(168), pConsExistingArr = new Array(168);
  for(let t=0; t<168; t++){
    const profC_peak = profConsRaw[t]/profConsPeak; // peak=1.0
    // Principal: client (Ps peak) în mode=client, sau schema agregată (Pc peak) în mode=retea
    const pc_main = profC_peak * pConsScale * csCons;
    const pp_main = profPV[t] * totalPV * csInj;
    // Existing schema downstream (doar dacă integrat cu nod)
    const pc_ext = existingCons > 0 ? existingCons * pMed * profC_peak * csExisting : 0;
    const pp_ext = existingPV > 0 ? existingPV * profPV[t] * csInj : 0;
    // Clienții suplimentari ipotetici (agregați)
    const pc_extras = extrasTotalPs * profC_peak;
    const pp_extras = extrasTotalPV * profPV[t] * csInj;
    pConsClientArr[t] = pc_main;
    pConsExistingArr[t] = pc_ext;
    pConsArr[t] = pc_main + pc_ext + pc_extras;
    pPVArr[t] = pp_main + pp_ext + pp_extras;
    pNet[t] = pConsArr[t] - pPVArr[t];
  }

  // Voltage calc — dacă e selectat un nod, folosește topologia reală cu sarcini downstream per cablu
  const cosPhi = 0.95, sinPhi = Math.sqrt(1-cosPhi*cosPhi);
  let R_path, X_path, L_real = L, sectionsInfo = `S=${S}mm²`, nodeInfo = '';
  let uArr;

  let prosDebugRows = null;
  let prosDebugRowsPeakCons = null;  // al doilea tabel — peak consum hour (pentru comparație)
  let prosDebugHourLabel = '';
  let prosDebugHourLabelPeakCons = '';
  if(pathAnalysis && pathData){
    // Topology-aware: formula PE 132 ca în MACHETA: ΔU% = (P_passing + P_local/2) × L / (S × factor)
    const segs = pathData.segments; // ordine sursă → target
    L_real = segs.reduce((s,x)=>s+x.L,0);
    const secSet = [...new Set(segs.map(s=>s.S))].sort((a,b)=>a-b);
    sectionsInfo = secSet.length>1 ? `secțiuni: ${secSet.join('/')} mm²` : `S=${secSet[0]||S}mm²`;
    nodeInfo = `Sursă: <b>${pathData.source.label||pathData.source.type}</b> → Nod: <b>${pathData.target.label||pathData.target.type}</b>`;
    // Per cablu: L, S, tipRetea, N_local (la child node), P_PV_local
    const cableInfo = segs.map(seg => {
      const s = pathAnalysis.cableStats.get(seg.cableId);
      const cnOrig = CN.find(c => c.id === seg.cableId);
      const tipRetea = (cnOrig && cnOrig.tipRetea) || 'Trifazat';
      const factor = tipRetea === 'Monofazat' ? 7.7 : (tipRetea === 'Bifazat' ? 20 : 46);
      const childId = s ? s.childId : null;
      const childEl = childId ? EL.find(e=>e.id===childId) : null;
      return {
        L: seg.L, S: seg.S, tipC: seg.tipC, tipRetea, factor,
        N_local: s ? s.N_local : 0,
        P_PV_local: s ? s.P_PV_local : 0,
        childLabel: childEl ? (childEl.label || childEl.type) : '?'
      };
    });
    // ΔU la target, orar — formula PE 132 distribuită
    uArr = new Array(168);
    const uArrNoPV = new Array(168);  // scenariu control: aceleași sarcini dar cu PV = 0 (pentru a măsura beneficiu PV)
    const isLastIdx = cableInfo.length - 1;
    // Track: peak consum (pentru U_min), peak PV (pentru debug table prosumator)
    let peakHourIdx = 0, peakProfC = 0;
    let peakPVHourIdx = 0, peakPVValue = 0;
    // Detectează ora cu producție PV maximă (oricând în săptămână)
    for(let t=0; t<168; t++){
      if(profPV[t] > peakPVValue){ peakPVValue = profPV[t]; peakPVHourIdx = t; }
    }
    // Helper: compute P_local_net pentru un cablu oarecare (din allCableInfo), pentru ora t
    // Include și clienții suplimentari ipotetici atașați la child-ul cablului
    function pLocalNet(info, profC_peak, tIdx, withPV){
      const ks_loc = getKs(info.N_local, 'RURAL');
      let P_cons = info.N_local * pMed * ks_loc * profC_peak;
      let P_pv = withPV ? (info.P_PV_local * profPV[tIdx] * csInj) : 0;
      // Client suplimentar ipotetic atașat la acest nod
      const extra = extraLoadAtNode.get(info.childId);
      if(extra){
        P_cons += extra.ps * profC_peak;
        if(withPV) P_pv += extra.ppv * profPV[tIdx] * csInj;
      }
      return P_cons - P_pv;
    }
    const segIdsOnPath = new Set(cableInfo.map((_, i) => pathData.segments[i].cableId));
    for(let t=0; t<168; t++){
      const profC_peak = profConsRaw[t]/profConsPeak;
      if(profC_peak > peakProfC){ peakProfC = profC_peak; peakHourIdx = t; }
      let dU_percent = 0, dU_noPV = 0;
      for(let i=0; i<cableInfo.length; i++){
        const ci = cableInfo[i];
        const cableId = pathData.segments[i].cableId;
        const info_C = pathAnalysis.allCableInfo.get(cableId);
        // P_local pe cablu C (inclusiv client pe ultimul cablu)
        let P_local_C = pLocalNet(info_C, profC_peak, t, true);
        let P_local_C_noPV = pLocalNet(info_C, profC_peak, t, false);
        if(mode === 'client' && i === isLastIdx){
          P_local_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj;
          P_local_C_noPV += pConsScale * profC_peak;
        }
        // P_passing: sumă peste TOATE cablurile din arbore care sunt downstream de C
        let P_passing_C = 0, P_passing_C_noPV = 0;
        const dsList = pathAnalysis.downstreamCables.get(cableId) || [];
        for(const dId of dsList){
          const info_D = pathAnalysis.allCableInfo.get(dId);
          if(!info_D) continue;
          P_passing_C += pLocalNet(info_D, profC_peak, t, true);
          P_passing_C_noPV += pLocalNet(info_D, profC_peak, t, false);
        }
        // Client Ps contribuie la P_passing dacă C NU e ultimul cablu (clientul e BEYOND child of C)
        if(mode === 'client' && i !== isLastIdx){
          P_passing_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj;
          P_passing_C_noPV += pConsScale * profC_peak;
        }
        const P_eff = P_passing_C + P_local_C / 2;
        const P_effNoPV = P_passing_C_noPV + P_local_C_noPV / 2;
        dU_percent += (P_eff * ci.L) / (ci.S * ci.factor);
        dU_noPV += (P_effNoPV * ci.L) / (ci.S * ci.factor);
      }
      uArr[t] = Un * (1 - dU_percent/100);
      uArrNoPV[t] = Un * (1 - dU_noPV/100);
    }
    // Rebuild debug breakdown — 2 tabele: peak PV + peak consum (pentru comparație la ore diferite)
    const showSecondTable = (mode === 'client' && totalPV > 0);
    {
      // Helper: P_passing pentru orice cablu (toate cablurile downstream în arbore)
      const cableDownstreamOf = (C_id) => {
        const result = [];
        for(const [dId, dInfo] of pathAnalysis.allCableInfo){
          if(dId === C_id) continue;
          const dChildPath = tree_nodeCables_lookup.get(dInfo.childId) || [];
          if(dChildPath.some(cn => cn.id === C_id)) result.push(dId);
        }
        return result;
      };
      // Rebuild mic tree lookup pentru verificare downstream
      const tree_nodeCables_lookup = new Map();
      {
        const src = pathAnalysis.source;
        const visited = new Set([src.id]);
        const queue = [{id: src.id, path: []}];
        tree_nodeCables_lookup.set(src.id, []);
        while(queue.length){
          const cur = queue.shift();
          for(const cn of CN.filter(c => c.fromElId===cur.id || c.toElId===cur.id)){
            const next = cn.fromElId===cur.id ? cn.toElId : cn.fromElId;
            if(!next || visited.has(next)) continue;
            visited.add(next);
            const newPath = [...cur.path, cn];
            tree_nodeCables_lookup.set(next, newPath);
            queue.push({id: next, path: newPath});
          }
        }
      }

      // Determină cablurile care sunt DOWNSTREAM de target (inclusiv side branches)
      const targetCableIds = new Set(pathData.segments.map(s => s.cableId));
      const targetPathCables = pathData.segments.map(s => pathAnalysis.allCableInfo.get(s.cableId));
      const beyondTargetCables = [];
      for(const [dId, dInfo] of pathAnalysis.allCableInfo){
        if(targetCableIds.has(dId)) continue;
        const dChildPath = tree_nodeCables_lookup.get(dInfo.childId) || [];
        // d e downstream de target dacă targetul apare ca nod de pe drumul lui d.child
        // Check: toate cablurile din drumul target-ului trebuie să fie prefix al dChildPath
        if(dChildPath.length <= pathData.segments.length) continue;
        let isPrefix = true;
        for(let k=0; k<pathData.segments.length; k++){
          if(dChildPath[k].id !== pathData.segments[k].cableId){ isPrefix = false; break; }
        }
        if(isPrefix) beyondTargetCables.push(dInfo);
      }
      // Sortare după lungimea drumului (BFS order)
      beyondTargetCables.sort((a,b) => (tree_nodeCables_lookup.get(a.childId)?.length||0) - (tree_nodeCables_lookup.get(b.childId)?.length||0));

      const allRowsInfo = [...targetPathCables, ...beyondTargetCables];

      // Helper pentru calcul ΔU per cablu, parametrizat după ora t
      const computeCableRowAt = (info_C, tIdx) => {
        const profC_peak_local = profConsRaw[tIdx]/profConsPeak;
        const ks_loc = getKs(info_C.N_local, 'RURAL');
        let P_cons_local = info_C.N_local * pMed * ks_loc * profC_peak_local;
        let P_pv_local = info_C.P_PV_local * profPV[tIdx] * csInj;
        let isClient = false, isExtra = false;
        const lastTargetCableId = pathData.segments[pathData.segments.length-1].cableId;
        if(mode === 'client' && info_C.cable.id === lastTargetCableId){
          P_cons_local += pConsScale * profC_peak_local;
          P_pv_local += totalPV * profPV[tIdx] * csInj;
          isClient = true;
        }
        // Client suplimentar ipotetic la child
        const extraHere = extraLoadAtNode.get(info_C.childId);
        if(extraHere){
          P_cons_local += extraHere.ps * profC_peak_local;
          P_pv_local += extraHere.ppv * profPV[tIdx] * csInj;
          isExtra = true;
        }
        const P_local_net = P_cons_local - P_pv_local;
        const dsList = cableDownstreamOf(info_C.cable.id);
        let P_passing = 0;
        for(const dId of dsList){
          const info_D = pathAnalysis.allCableInfo.get(dId);
          if(!info_D) continue;
          const ks_D = getKs(info_D.N_local, 'RURAL');
          let P_cons_D = info_D.N_local * pMed * ks_D * profC_peak_local;
          let P_pv_D = info_D.P_PV_local * profPV[tIdx] * csInj;
          if(mode === 'client' && info_D.cable.id === lastTargetCableId){
            P_cons_D += pConsScale * profC_peak_local;
            P_pv_D += totalPV * profPV[tIdx] * csInj;
          }
          const extraD = extraLoadAtNode.get(info_D.childId);
          if(extraD){
            P_cons_D += extraD.ps * profC_peak_local;
            P_pv_D += extraD.ppv * profPV[tIdx] * csInj;
          }
          P_passing += P_cons_D - P_pv_D;
        }
        const P_eff = P_passing + P_local_net/2;
        const factor = info_C.tipRetea === 'Monofazat' ? 7.7 : (info_C.tipRetea === 'Bifazat' ? 20 : 46);
        const dU = (P_eff * info_C.L) / (info_C.S * factor);
        return { dU, P_cons_local, P_pv_local, P_passing, P_eff, ks_loc, isClient, isExtra };
      };

      const buildRowsAt = (tIdx) => {
        const dUMap = new Map();
        for(const info_C of allRowsInfo){
          const r = computeCableRowAt(info_C, tIdx);
          dUMap.set(info_C.cable.id, r);
        }
        return allRowsInfo.map(info_C => {
          const r = dUMap.get(info_C.cable.id);
          const childPath = tree_nodeCables_lookup.get(info_C.childId) || [];
          let cumul = 0;
          for(const cn of childPath){
            const d = dUMap.get(cn.id);
            if(d) cumul += d.dU;
          }
          const isBeyondTarget = !targetCableIds.has(info_C.cable.id);
          return {
            label: info_C.childLabel + (r.isClient ? ' (CLIENT)' : '') + (r.isExtra ? ' ★' : '') + (isBeyondTarget ? ' ⬇' : ''),
            L: info_C.L, S: info_C.S, N: info_C.N_local, ks: r.ks_loc,
            P_local: r.P_cons_local, P_pv: r.P_pv_local,
            P_passing: r.P_passing, P_eff: r.P_eff, dU: r.dU, cumul,
            isBeyondTarget, isExtra: r.isExtra
          };
        });
      };
      const formatHourLabel = (tIdx) => {
        const dayIdx = Math.floor(tIdx/24), hourOfDay = tIdx%24;
        return ['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'][dayIdx] + ' ' + hourOfDay.toString().padStart(2,'0') + ':00';
      };
      if(showSecondTable){
        prosDebugRows = buildRowsAt(peakPVHourIdx);
        prosDebugHourLabel = formatHourLabel(peakPVHourIdx);
        prosDebugRowsPeakCons = buildRowsAt(peakHourIdx);
        prosDebugHourLabelPeakCons = formatHourLabel(peakHourIdx);
      } else {
        prosDebugRows = buildRowsAt(peakHourIdx);
        prosDebugHourLabel = formatHourLabel(peakHourIdx);
      }
      // Expune pentru export CSV
      window.prosExportDebugRows = {
        peakCons: prosDebugRowsPeakCons || (showSecondTable ? null : prosDebugRows),
        peakConsLabel: prosDebugHourLabelPeakCons || (showSecondTable ? '' : prosDebugHourLabel),
        peakPV: showSecondTable ? prosDebugRows : null,
        peakPVLabel: showSecondTable ? prosDebugHourLabel : ''
      };
    }
  } else {
    // Fallback: L + S manual, flux unic pNet
    const { r, x } = cableRes(S);
    R_path = r*L; X_path = x*L;
    uArr = pNet.map(p => {
      const P_W = p*1000;
      const I = P_W/(Math.sqrt(3)*Un*cosPhi);
      const dU = Math.sqrt(3)*I*(R_path*cosPhi + X_path*sinPhi);
      return Un - dU;
    });
  }

  // Stats
  const maxCons = Math.max(...pConsArr);
  const minPNet = Math.min(...pNet);
  const maxInj = minPNet < 0 ? -minPNet : 0;  // 0 dacă nu există flux invers
  const hoursInverse = pNet.filter(p=>p<0).length;
  const uMax = Math.max(...uArr), uMin = Math.min(...uArr);
  const hOver = uArr.filter(u=>u>Un*1.1).length;
  const hUnder = uArr.filter(u=>u<Un*0.9).length;
  // Beneficiu PV la amiază — max îmbunătățire orara a tensiunii
  let pvBenefitMax = 0;
  let dU_zi_withPV_percent = 0, dU_zi_noPV_percent = 0;
  let dU_zi_withPV_V = 0, dU_zi_noPV_V = 0;
  if(typeof uArrNoPV !== 'undefined' && uArrNoPV){
    for(let t=0; t<168; t++){
      const diff = uArr[t] - uArrNoPV[t];
      if(diff > pvBenefitMax) pvBenefitMax = diff;
      // Cădere tensiune pe timp de zi (orele 8-18 cand PV e activ)
      const hOfDay = t % 24;
      if(hOfDay >= 8 && hOfDay <= 18){
        const drop_with = Un - uArr[t];
        const drop_no = Un - uArrNoPV[t];
        if(drop_with > dU_zi_withPV_V) dU_zi_withPV_V = drop_with;
        if(drop_no > dU_zi_noPV_V) dU_zi_noPV_V = drop_no;
      }
    }
    dU_zi_withPV_percent = (dU_zi_withPV_V / Un) * 100;
    dU_zi_noPV_percent = (dU_zi_noPV_V / Un) * 100;
  }

  // Expune datele globale pentru tooltip interactiv
  window.prosTooltipData = {
    pCons: pConsArr, pPV: pPVArr, pNet: pNet, uArr: uArr,
    uArrNoPV: (typeof uArrNoPV !== 'undefined' && uArrNoPV) ? uArrNoPV : null,
    Un: Un
  };

  // Chart 1: flow
  const flowRange = Math.max(Math.abs(Math.min(...pNet)), Math.max(...pNet), 1) * 1.1;
  const chart1 = svgChart(
    [
      { data: pConsArr, color:'#00cfff', label:'Consum' },
      { data: pPVArr, color:'#ffc107', label:'Producție PV' },
      { data: pNet, color:'#ef4444', label:'Flux net', dashed:true }
    ],
    { w: Math.max(900, content.clientWidth-30), h: 220, yMin: -flowRange, yMax: flowRange, yLabel:'kW', zeroLine:true, legend:true }
  );

  // Chart 2: voltage
  const uPad = Math.max(Math.abs(uMax-Un), Math.abs(Un-uMin), 15) * 1.3;
  const chart2Series = [{ data: uArr, color:'#2ecc71', label:'U capăt (cu PV)' }];
  if(typeof uArrNoPV !== 'undefined' && uArrNoPV && pvBenefitMax > 0.5){
    chart2Series.push({ data: uArrNoPV, color:'#94a3b8', label:'U capăt fără PV', dashed:true });
  }
  const chart2 = svgChart(
    chart2Series,
    {
      w: Math.max(900, content.clientWidth-30), h: 220, yMin: Un-uPad, yMax: Un+uPad, yLabel:'V', legend:true,
      bands: [
        { min: Un*1.1, max: Un+uPad, color:'#ef4444' },
        { min: Un*0.9, max: Un-uPad, color:'#ef4444' },
        { min: Un*1.05, max: Un*1.1, color:'#eab308' },
        { min: Un*0.9, max: Un*0.95, color:'#eab308' },
        { min: Un*0.95, max: Un*1.05, color:'#2ecc71' }
      ]
    }
  );

  const warn = hOver>0 ? `<span style="color:#ef4444;font-weight:700">⚠ ${hOver}h peste +10% Un</span>` : '<span style="color:#2ecc71">✓ fără supratensiune</span>';
  const warnDown = hUnder>0 ? `<span style="color:#ef4444;font-weight:700">⚠ ${hUnder}h sub −10% Un</span>` : '<span style="color:#2ecc71">✓ fără subtensiune</span>';
  const prosEff = totalPV>0 ? ((-Math.min(...pNet))/totalPV*100).toFixed(0) : '0';

  content.innerHTML = `
    <div id="pros-tooltip" style="position:fixed;pointer-events:none;display:none;background:rgba(15,23,42,0.97);border:1px solid #ffc107;border-radius:6px;padding:8px 10px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;z-index:9999;min-width:180px;box-shadow:0 8px 24px rgba(0,0,0,0.6)"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode==='client'?'Ps Consum client':'Consumatori total'}</div><div style="font-size:16px;font-weight:800;color:#00cfff">${mode==='client'?pConsScale.toFixed(1)+' kW':totalCons}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode==='client'?'P_PV client':'Putere PV instalată'}</div><div style="font-size:16px;font-weight:800;color:#ffc107">${totalPV.toFixed(1)} kW</div></div>
      ${pathAnalysis ? `
      <div style="background:var(--bg2);border:1px solid #2ecc71;border-radius:6px;padding:8px"><div style="font-size:7.5px;color:#2ecc71;font-weight:700;text-transform:uppercase">Consumatori existenți (pe drum)</div><div style="font-size:16px;font-weight:800;color:#00cfff">${existingCons}</div></div>
      <div style="background:var(--bg2);border:1px solid #2ecc71;border-radius:6px;padding:8px"><div style="font-size:7.5px;color:#2ecc71;font-weight:700;text-transform:uppercase">PV existent (pe drum)</div><div style="font-size:16px;font-weight:800;color:#ffc107">${existingPV.toFixed(1)} kW</div></div>
      ` : `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode==='client'?'Raport PV/Ps':'Cs consum'}</div><div style="font-size:16px;font-weight:800;color:var(--text)">${mode==='client'?(totalPV/pConsScale).toFixed(2)+'×':csCons.toFixed(2)}</div></div>
      `}
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max consum total</div><div style="font-size:16px;font-weight:800;color:#00cfff">${maxCons.toFixed(1)} kW</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max injecție</div><div style="font-size:16px;font-weight:800;color:${maxInj>0?'#ef4444':'var(--text3)'}">${maxInj>0 ? maxInj.toFixed(1)+' kW' : '— fără injecție'}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Ore flux invers/săpt</div><div style="font-size:16px;font-weight:800;color:#ef4444">${hoursInverse}</div></div>
    </div>
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:6px 0 4px">Flux putere pe circuit (168h — o săptămână tipică)</div>
    ${chart1}
    ${prosDebugRowsPeakCons ? `
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson — <span style="color:#ff9f43">${prosDebugHourLabelPeakCons}</span> <span style="color:#ef4444">(peak consum — worst case pentru dimensionare)</span></div>
    <div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px">
    <table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">
      <thead><tr style="background:var(--bg3);color:var(--text3)">
        <th style="padding:4px 6px;text-align:left">Tronson</th><th style="padding:4px 6px">L (m)</th><th style="padding:4px 6px">S</th><th style="padding:4px 6px">N</th><th style="padding:4px 6px">ks</th><th style="padding:4px 6px">P_local (kW)</th><th style="padding:4px 6px">PV (kW)</th><th style="padding:4px 6px">P_passing</th><th style="padding:4px 6px">P_eff</th><th style="padding:4px 6px;color:#ff9f43">ΔU tronson</th><th style="padding:4px 6px;color:#ef4444">ΔU cumul</th>
      </tr></thead>
      <tbody>
      ${prosDebugRowsPeakCons.map(r => `<tr style="border-top:1px solid var(--border);${r.isExtra?'background:rgba(255,193,7,0.06)':(r.isBeyondTarget?'background:rgba(148,163,184,0.06);opacity:0.85':'')}"><td style="padding:3px 6px;${r.isBeyondTarget?'color:#94a3b8':(r.isExtra?'color:#ffc107;font-weight:700':'')}">${r.label}</td><td style="padding:3px 6px;text-align:right">${r.L}</td><td style="padding:3px 6px;text-align:right">${r.S}</td><td style="padding:3px 6px;text-align:right">${r.N}</td><td style="padding:3px 6px;text-align:right">${r.ks.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_local.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:${r.P_pv>0?'#ffc107':'var(--text3)'}">${r.P_pv.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_passing.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_eff.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:#ff9f43;font-weight:700">${r.dU.toFixed(3)}%</td><td style="padding:3px 6px;text-align:right;color:#ef4444;font-weight:700">${r.cumul.toFixed(2)}%</td></tr>`).join('')}
      </tbody>
    </table>
    </div>
    ` : ''}
    ${prosDebugRows ? `
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson — <span style="color:#ffc107">${prosDebugHourLabel}</span> ${(mode==='client'&&totalPV>0)?'<span style="color:#2ecc71">(PV peak — prosumator în funcțiune)</span>':'(peak consum)'}</div>
    <div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px">
    <table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">
      <thead><tr style="background:var(--bg3);color:var(--text3)">
        <th style="padding:4px 6px;text-align:left">Tronson</th><th style="padding:4px 6px">L (m)</th><th style="padding:4px 6px">S</th><th style="padding:4px 6px">N</th><th style="padding:4px 6px">ks</th><th style="padding:4px 6px">P_local (kW)</th><th style="padding:4px 6px">PV (kW)</th><th style="padding:4px 6px">P_passing</th><th style="padding:4px 6px">P_eff</th><th style="padding:4px 6px;color:#ff9f43">ΔU tronson</th><th style="padding:4px 6px;color:#ef4444">ΔU cumul</th>
      </tr></thead>
      <tbody>
      ${prosDebugRows.map(r => `<tr style="border-top:1px solid var(--border);${r.isExtra?'background:rgba(255,193,7,0.06)':(r.isBeyondTarget?'background:rgba(148,163,184,0.06);opacity:0.85':'')}"><td style="padding:3px 6px;${r.isBeyondTarget?'color:#94a3b8':(r.isExtra?'color:#ffc107;font-weight:700':'')}">${r.label}</td><td style="padding:3px 6px;text-align:right">${r.L}</td><td style="padding:3px 6px;text-align:right">${r.S}</td><td style="padding:3px 6px;text-align:right">${r.N}</td><td style="padding:3px 6px;text-align:right">${r.ks.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_local.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:${r.P_pv>0?'#ffc107':'var(--text3)'}">${r.P_pv.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_passing.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_eff.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:#ff9f43;font-weight:700">${r.dU.toFixed(3)}%</td><td style="padding:3px 6px;text-align:right;color:#ef4444;font-weight:700">${r.cumul.toFixed(2)}%</td></tr>`).join('')}
      </tbody>
    </table>
    </div>
    ` : ''}
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Tensiune la nodul de racordare (L=${L_real.toFixed(0)}m, ${sectionsInfo}) — benzi: verde ±5%, galben ±10%, roșu &gt;±10% ${nodeInfo ? `&nbsp;&nbsp;<span style="color:#2ecc71;font-weight:400">${nodeInfo}</span>` : ''}</div>
    ${chart2}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:10px;font-size:10px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">U max / U min</div><div style="color:var(--text);font-weight:700">${uMax.toFixed(1)} V / ${uMin.toFixed(1)} V</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warn}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warnDown}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">Max injecție / P_PV instalat</div><div style="color:var(--text);font-weight:700">${prosEff}%</div></div>
      ${pvBenefitMax > 0.5 ? `<div style="background:var(--bg2);border:1px solid #2ecc71;border-radius:6px;padding:8px"><div style="color:#2ecc71;font-size:7.5px;text-transform:uppercase;font-weight:700">Beneficiu PV la amiază</div><div style="color:#2ecc71;font-weight:700">+${pvBenefitMax.toFixed(1)} V max <span style="color:var(--text3);font-size:9px">(doar ziua)</span></div></div>` : ''}
      ${pvBenefitMax > 0.5 ? `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">ΔU max zi (10-18h) CU PV</div><div style="color:#2ecc71;font-weight:700">${dU_zi_withPV_V.toFixed(1)} V / ${dU_zi_withPV_percent.toFixed(2)}%</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">ΔU max zi (10-18h) FĂRĂ PV</div><div style="color:#94a3b8;font-weight:700">${dU_zi_noPV_V.toFixed(1)} V / ${dU_zi_noPV_percent.toFixed(2)}%</div></div>
      ` : ''}
    </div>
    <div style="margin-top:12px;padding:8px 10px;background:var(--bg3);border-left:3px solid #ffc107;border-radius:4px;font-size:9.5px;color:var(--text2);line-height:1.5">
      <b>Mod:</b> ${mode==='client' ? `<i>Client concentrat</i> — Ps=${pConsScale.toFixed(1)} kW + ${totalPV.toFixed(1)} kWp PV. ${pathData ? `Drum real: <b>${pathData.source.label||pathData.source.type}</b> → <b>${pathData.target.label||pathData.target.type}</b> prin ${pathData.segments.length} cabluri, L=${L_real.toFixed(0)}m, ${sectionsInfo}. <b>Pe drum există ${existingCons} consumatori + ${existingPV.toFixed(1)} kW PV</b>.` : `Circuit manual L=${L}m, S=${S}mm². Selectează un nod din schemă pentru analiză topologică cu toate sarcinile existente.`}${prosExtraClients.length > 0 ? ` <span style="color:#ffc107"><b>+${prosExtraClients.length} clienți ipotetici</b>: total Ps=${extrasTotalPs.toFixed(1)} kW + ${extrasTotalPV.toFixed(1)} kWp PV (marcați cu ★ în tabel)</span>.` : ''}` : `<i>Rețea existentă</i> — agregă consumatorii și PV din schemă, analiză pe circuit echivalent reprezentativ L+S.`}<br>
      <b>Formulă:</b> PE 132 distribuit (MACHETA): <i>ΔU% = (P_passing + P_local/2) × L / (S × 46)</i>. PV scade sarcina locală (flux invers).
      <b>De ce PV nu reduce U_min:</b> U_min apare la ora de vârf consum (seara 20-21h) când PV=0. PV ajută doar între 10-16h, reducând fluxul și creșterea tensiunii la amiază — utilitate: pierderi mai mici, trafo descărcat, nu dimensionarea cablului.
      <b>Surse:</b> profil Delgaz 07/12 2022, PV PVGIS 2023 Iași.
    </div>
  `;
}

// ========== Core Analysis ==========

function prosFindSource() {
  return EL.find(e => e.type === 'trafo' || e.type === 'ptab_1t' || e.type === 'ptab_2t');
}

function prosFindPath(targetId) {
  // Build path from source to target
  const source = prosFindSource();
  if (!source) return null;
  // Simplified path finding
  const path = [];
  const visited = new Set();
  const queue = [{ id: targetId, path: [] }];
  while (queue.length > 0) {
    const { id, path: currentPath } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    const el = EL.find(e => e.id === id);
    if (!el) continue;
    if (el.id === source.id) return [...currentPath, el];
    // Find connected cables
    CN.forEach(cn => {
      let nextId = null;
      if (cn.fromElId === id) nextId = cn.toElId;
      else if (cn.toElId === id) nextId = cn.fromElId;
      if (nextId && !visited.has(nextId)) {
        queue.push({ id: nextId, path: [...currentPath, cn, el] });
      }
    });
  }
  return path;
}

function prosBuildTree() {
  const source = prosFindSource();
  if (!source) return { nodes: [], edges: [] };
  const tree = { root: source, children: [] };
  // Build tree recursively
  return tree;
}

function analyzeProsumator() {
  // Simplified analysis
  return {
    yearlySelfConsumption: prosData.consumption * 0.6,
    pvProduction: prosData.pvPower * 1100, // kWh/year (Romania average)
    gridImport: prosData.consumption * 0.4,
    gridExport: prosData.pvPower * 1100 * 0.4
  };
}

function displayProsumatorResults(result) {
  const container = document.getElementById('pros-results');
  if (!container) return;
  container.innerHTML = `
    <div style="padding:10px; font-size:11px">
      <div>Producție PV: <b>${result.pvProduction} kWh/an</b></div>
      <div>Autoconsum: <b>${result.yearlySelfConsumption} kWh/an</b></div>
      <div>Import rețea: <b>${result.gridImport} kWh/an</b></div>
      <div>Export rețea: <b>${result.gridExport} kWh/an</b></div>
    </div>
  `;
}

// ========== Extra Clients ==========

export function prosAddExtraClient() {
  if (!window.prosExtraClients) window.prosExtraClients = [];
  window.prosExtraClients.push({ name: '', consumption: 0 });
  prosRenderExtraClients();
}

export function prosRemoveExtraClient(idx) {
  if (window.prosExtraClients) window.prosExtraClients.splice(idx, 1);
  prosRenderExtraClients();
}

export function prosUpdateExtraClient(idx, field, value) {
  if (!window.prosExtraClients) window.prosExtraClients = [];
  window.prosExtraClients[idx][field] = value;
}

export function prosRenderExtraClients() {
  const container = document.getElementById('pros-extra-clients');
  if (!container) return;
  let html = '';
  (window.prosExtraClients || []).forEach((client, idx) => {
    html += `
      <div style="display:flex;gap:4px;align-items:center">
        <input type="text" value="${client.name}" onchange="prosUpdateExtraClient(${idx},'name',this.value)" style="flex:1">
        <input type="number" value="${client.consumption}" onchange="prosUpdateExtraClient(${idx},'consumption',parseFloat(this.value))" style="width:60px">
        <button onclick="prosRemoveExtraClient(${idx})">✕</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ========== Export ==========

export function prosExportCSV() {
  const result = analyzeProsumator();
  let csv = 'Metric,Value\n';
  csv += `PV Production,${result.pvProduction}\n`;
  csv += `Self Consumption,${result.yearlySelfConsumption}\n`;
  csv += `Grid Import,${result.gridImport}\n`;
  csv += `Grid Export,${result.gridExport}\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'prosumator_analiza.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('CSV exportat!', 'ok');
}

export function prosExportPDF() {
  toast('Export PDF prosumator...', 'ac');
  // PDF export logic
}

export function prosToggleMode() {
  prosData.mode = prosData.mode === 'self-consumption' ? 'full-backup' : 'self-consumption';
  const btn = document.getElementById('pros-mode-btn');
  if (btn) btn.textContent = prosData.mode === 'self-consumption' ? 'Autoconsum' : 'Backup Total';
  toast(`Mod: ${prosData.mode === 'self-consumption' ? 'Autoconsum' : 'Backup Total'}`, 'ok');
}

// ========== Chart ==========

let prosChart = null;

export function prosChartHover(ev) {
  // Chart hover logic
}

export function prosChartHoverHide() {
  const tooltip = document.getElementById('pros-chart-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// ========== PV Profile ==========

export function prosPVProfile(lat, sezon) {
  // PV production profile based on latitude and season
  const baseProfile = window.PROS_PV_PROFILE || [];
  return baseProfile;
}

export function prosRefreshNodeDropdown() {
  const sel = document.getElementById('pros-node-select');
  if (!sel) return;
  sel.innerHTML = '';
  EL.forEach(el => {
    if (el.type.startsWith('stalp_') || el.type.startsWith('firida_') || el.type === 'meter') {
      const opt = document.createElement('option');
      opt.value = el.id;
      opt.textContent = el.label || el.type;
      sel.appendChild(opt);
    }
  });
}

// ========== Aggregate Schema ==========

export function aggregateSchema() {
  // Aggregate the entire schema for prosumator analysis
  const source = prosFindSource();
  if (!source) return null;
  return {
    source: source,
    totalConsumption: EL.reduce((sum, el) => sum + (el.consumatori || 0), 0),
    totalCableLength: CN.reduce((sum, cn) => sum + (parseFloat(cn.length) || 0), 0)
  };
}
