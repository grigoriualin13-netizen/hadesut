// fs-ai.js — Generare fișă de soluție via Groq / Gemini (separat de fs-module.js)
import { S }     from './state.js';
import { toast } from './utils.js';

const GROQ_KEY_LS    = 'electrocad_groq_key';
const GEMINI_KEY_LS  = 'electrocad_gemini_key';
const PROVIDER_LS    = 'electrocad_ai_provider';

const GROQ_URL    = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL  = 'llama-3.3-70b-versatile';

const GEMINI_MODEL = 'gemini-2.5-pro';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Panel toggle ──────────────────────────────────────────────────────────────
export function toggleAIPanel() {
  const panel = document.getElementById('fs-ai-panel');
  if (!panel) return;
  const show = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = show ? 'flex' : 'none';
  if (show) {
    const prov = localStorage.getItem(PROVIDER_LS) || 'groq';
    const sel = document.getElementById('fs-ai-provider');
    if (sel) sel.value = prov;
    fsAiProviderChange();
    const groqInp = document.getElementById('fs-ai-key');
    if (groqInp && !groqInp.value) groqInp.value = localStorage.getItem(GROQ_KEY_LS) || '';
    const gemInp = document.getElementById('fs-ai-gemini-key');
    if (gemInp && !gemInp.value) gemInp.value = localStorage.getItem(GEMINI_KEY_LS) || '';
  }
}

export function fsAiProviderChange() {
  const prov = document.getElementById('fs-ai-provider')?.value || 'groq';
  localStorage.setItem(PROVIDER_LS, prov);
  const groqRow   = document.getElementById('fs-ai-groq-row');
  const geminiRow = document.getElementById('fs-ai-gemini-row');
  if (groqRow)   groqRow.style.display   = prov === 'groq'   ? 'flex' : 'none';
  if (geminiRow) geminiRow.style.display = prov === 'gemini' ? 'flex' : 'none';
}

// ── Schema extractor (topologic, cu taguri EXISTENT/NOU per nod) ──────────────
const TYPE_RO = {
  trafo: 'Transformator', ptab_1t: 'PTAb 1T', ptab_2t: 'PTAb 2T',
  cd4: 'CD 4P', cd5: 'CD 5P', cd8: 'CD 8P',
  stalp_se4: 'stalp SE4', stalp_se10: 'stalp SE10',
  stalp_sc10002: 'stalp SC10002', stalp_sc10005: 'stalp SC10005',
  stalp_rotund: 'stalp rotund lemn', firida_e2_4: 'Firida E2-4',
  firida_e3_4: 'Firida E3-4', firida_e3_0: 'Firida E3-0', firida_gen: 'Firida Generala',
  meter: 'BMPT',
};

function buildSchemaSummary() {
  const elById = {};
  S.EL.forEach(e => { elById[e.id] = e; });

  function elName(e) {
    if (!e) return '?';
    if (e.type === 'meter') return e.bmptText || e.label || 'BMPT';
    return e.label || TYPE_RO[e.type] || e.type;
  }

  function elTag(e) {
    if (!e) return '';
    const s = e.stare || 'existent';
    if (s === 'existent') return '[EXISTENT]';
    if (s === 'proiectat_racordare') return '[NOU]';
    if (s === 'intarire_inlocuire') return '[INLOCUIT]';
    if (s === 'intarire_nou') return '[NOU-intarire]';
    if (s === 'demontat') return '[DEMONTAT]';
    return `[${s}]`;
  }

  const L = [];

  // ── 1. Surse (PT / CD) ───────────────────────────────────────────────────
  const sources = S.EL.filter(e =>
    e.type === 'trafo' || e.type.startsWith('ptab_') || e.type.startsWith('cd')
  );
  if (sources.length) {
    L.push('SURSE (PT / CD):');
    sources.forEach(e => {
      let s = `  ${TYPE_RO[e.type] || e.type}`;
      if (e.label) s += ` "${e.label}"`;
      const pw = e.trText?.power || e.trText1?.power || '';
      if (pw) s += ` ${pw}`;
      s += ` ${elTag(e)}`;
      L.push(s);
    });
  }

  // ── 2. Elemente de rețea (stalpi, firide) grupate pe stare ───────────────
  const reteaEl = S.EL.filter(e => e.type.startsWith('stalp_') || e.type.startsWith('firida_'));
  const rExist  = reteaEl.filter(e => !e.stare || e.stare === 'existent');
  const rNoi    = reteaEl.filter(e => e.stare === 'proiectat_racordare');
  const rInt    = reteaEl.filter(e => e.stare === 'intarire_inlocuire' || e.stare === 'intarire_nou');

  if (rExist.length) {
    L.push('\nELEMENTE DE REȚEA EXISTENTE:');
    L.push('  ' + rExist.map(e => `${elName(e)} (${TYPE_RO[e.type] || e.type})`).join(', '));
  }
  if (rNoi.length) {
    L.push('\nELEMENTE DE REȚEA NOI PROIECTATE:');
    L.push('  ' + rNoi.map(e => `${elName(e)} (${TYPE_RO[e.type] || e.type})`).join(', '));
  }
  if (rInt.length) {
    L.push('\nELEMENTE ÎNTĂRIRE:');
    L.push('  ' + rInt.map(e => `${elName(e)} ${elTag(e)}`).join(', '));
  }

  // BMPT-uri
  const bmpturi = S.EL.filter(e => e.type === 'meter');
  const bmptExist = bmpturi.filter(e => !e.stare || e.stare === 'existent');
  const bmptNoi   = bmpturi.filter(e => e.stare === 'proiectat_racordare');
  if (bmptExist.length) L.push(`  BMPT existente: ${bmptExist.map(elName).join(', ')}`);
  if (bmptNoi.length)   L.push(`  BMPT noi: ${bmptNoi.map(elName).join(', ')}`);

  // ── 3. Circuite existente — grupate pe circuitGroup ──────────────────────
  const existCN = S.CN.filter(cn => !cn.stare || cn.stare === 'existent');
  if (existCN.length) {
    L.push('\nCIRCUITE EXISTENTE:');
    const byCirc = {};
    existCN.forEach(cn => {
      const cg = cn.circuitGroup || cn.label || '(necunoscut)';
      (byCirc[cg] = byCirc[cg] || []).push(cn);
    });
    Object.entries(byCirc).forEach(([cg, cables]) => {
      const c0 = cables[0];
      L.push(`  Circuit "${cg}" — ${c0.tipConductor || 'Torsadat Al'} ${c0.sectiune || 16}mmp ${c0.tipRetea || 'Trifazat'}:`);
      cables.forEach(cn => {
        const f = elById[cn.fromElId], t = elById[cn.toElId];
        L.push(`    ${elName(f)} → ${elName(t)}: L=${cn.length || 0}m`);
      });
    });
  }

  // ── 4. Conductoare noi proiectate (racordare) ────────────────────────────
  const bmptIds = new Set(S.EL.filter(e => e.type === 'meter').map(e => e.id));
  const proiectCN = S.CN.filter(cn => cn.stare === 'proiectat_racordare');
  const bransamenteCN = proiectCN.filter(cn => bmptIds.has(cn.fromElId) || bmptIds.has(cn.toElId));
  const circuitCN     = proiectCN.filter(cn => !bmptIds.has(cn.fromElId) && !bmptIds.has(cn.toElId));

  if (circuitCN.length) {
    L.push('\nCONDUCTOARE NOI (circuit racordare) — cu starea fiecărui nod:');
    const byTip = {};
    circuitCN.forEach(cn => {
      const k = `${cn.tipConductor || 'Torsadat Al'} ${cn.sectiune || 16}mmp ${cn.tipRetea || 'Trifazat'}`;
      (byTip[k] = byTip[k] || []).push(cn);
    });
    Object.entries(byTip).forEach(([tip, cables]) => {
      L.push(`  ${tip}:`);
      cables.forEach(cn => {
        const f = elById[cn.fromElId], t = elById[cn.toElId];
        const fTag = elTag(f), tTag = elTag(t);
        let note = '';
        if (fTag === '[EXISTENT]' && tTag === '[EXISTENT]') note = '  ← conductor NOU pe stâlpi EXISTENȚI';
        else if (fTag === '[NOU]' || tTag === '[NOU]') note = '  ← conductor NOU pe stâlpi NOI';
        L.push(`    ${elName(f)}${fTag} → ${elName(t)}${tTag}: L=${cn.length || 0}m${note}`);
      });
    });
  }

  if (bransamenteCN.length) {
    L.push('\nBRANȘAMENTE NOI PROIECTATE:');
    bransamenteCN.forEach(cn => {
      const f = elById[cn.fromElId], t = elById[cn.toElId];
      const [src, dst] = bmptIds.has(cn.toElId) ? [f, t] : [t, f];
      const len = parseFloat(cn.length) || 0;
      const srcIsFirida = src && src.type && src.type.startsWith('firida_');
      const locatie = srcIsFirida || len > 8
        ? 'pe soclu de beton la limita de proprietate'
        : 'pe stalpul de racord';
      L.push(`  Din ${elName(src)}${elTag(src)} → ${elName(dst)}${elTag(dst)}: ${cn.tipConductor || 'Cablu Al'} ${cn.sectiune || 16}mmp L=${len}m → BMPT se monteaza: ${locatie}`);
    });
  }

  // ── 5. Întărire rețea ────────────────────────────────────────────────────
  const intarirCN = S.CN.filter(cn => cn.stare === 'intarire_inlocuire' || cn.stare === 'intarire_nou');
  if (rInt.length || intarirCN.length) {
    L.push('\nLUCRĂRI ÎNTĂRIRE REȚEA:');
    intarirCN.forEach(cn => {
      const f = elById[cn.fromElId], t = elById[cn.toElId];
      if (cn.stare === 'intarire_inlocuire' && cn.oldTipConductor) {
        L.push(`  Înlocuire ${cn.oldTipConductor} ${cn.oldSectiune || '?'}mmp → ${cn.tipConductor} ${cn.sectiune}mmp L=${cn.length || 0}m [${elName(f)} → ${elName(t)}]`);
      } else {
        L.push(`  Circuit nou: ${cn.tipConductor || 'Cablu Al'} ${cn.sectiune || 16}mmp L=${cn.length || 0}m [${elName(f)} → ${elName(t)}]`);
      }
    });
  }

  // ── 6. Demontări ─────────────────────────────────────────────────────────
  const demontatCN = S.CN.filter(cn => cn.stare === 'demontat');
  const demontatEL = S.EL.filter(e => e.stare === 'demontat');
  if (demontatEL.length || demontatCN.length) {
    L.push('\nDEMONTĂRI:');
    if (demontatEL.length) L.push('  Elemente: ' + demontatEL.map(elName).join(', '));
    demontatCN.forEach(cn => {
      const f = elById[cn.fromElId], t = elById[cn.toElId];
      L.push(`  ${cn.tipConductor || 'Cablu Al'} ${cn.sectiune || 16}mmp L=${cn.length || 0}m [${elName(f)} → ${elName(t)}]`);
    });
  }

  return L.join('\n') || 'Schema fara elemente sau cabluri.';
}

// ── API callers ───────────────────────────────────────────────────────────────
async function _callGroq(systemPrompt, userPrompt, key) {
  const resp = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.25,
      max_tokens: 1600,
      response_format: { type: 'json_object' },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

async function _callGemini(systemPrompt, userPrompt, key) {
  const resp = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  // Gemini 2.5 Pro poate returna thinking parts înainte de răspunsul efectiv —
  // luăm primul part care nu e "thought"
  const parts = data.candidates?.[0]?.content?.parts || [];
  const textPart = parts.find(p => !p.thought) || parts[parts.length - 1];
  const text = textPart?.text || '{}';
  return JSON.parse(text);
}

// ── System prompt hardcodat (fallback când Supabase e inaccesibil) ───────────
const HARDCODED_SYSTEM_PROMPT =
`Expert tehnic JT România (Delgaz Grid). Corectezi draft-ul față de schema electrică [EXISTENT]/[NOU] și rescrii dacă e greșit.

REGULI:
- Sec.5=NUMAI [EXISTENT]: PT, circuite existente tip/lungime cumulată. Sec.6a=NUMAI [NOU]: circuit proiectat, stalpi, BMPT. Sec.6b=NUMAI întărire; lipsă→exact: NU ESTE CAZUL
- [NOU pe stalpi EXISTENȚI]=echipare circuit; [NOU pe stalpi NOI]=extensie/prelungire
- Denumiri: NFA2X, NA2XBY, NYY, BMPT, PT, CD, LEA, LES, mmp. Lipsă→[DE COMPLETAT]
- Locatie BMPT: citeste campul "BMPT se monteaza:" din schema — respecta-l exact

BRANSAMENTE (universal): Adauga "Bransamente:" la finalul 6a daca exista in schema. Grupeaza pe stalp/firida sursa:
- 1 bransament: "Din stalpul [X] se va realiza 1 bransament cu conductor tip [..] L=[X]m pana la un [BMPT] montat [locatie]."
- N>1 din acelasi stalp: "Din stalpul [X] se vor realiza [N] bransamente astfel:\n- conductor tip [..] L=[X]m pana la [BMPT1] montat [loc].\n- conductor tip [..] L=[X]m pana la [BMPT2] montat [loc]."
- Stalpi diferiti: descrie fiecare stalp separat. Fara bransamente→nu adauga sectiunea.

TIPARE 6a — alege tiparul potrivit cu schema (toate incep cu "Alimentarea cu energie electrica a obiectivului se va realiza"):
C1 bransament simplu: "...pe joasa tensiune din stalpul [X], circuit nr.[N], zona de post [PT], printr-un bransament cu conductor tip [..] L=[X]m pana la un [BMPT] montat [loc]."
C2 stalpi noi: "...pe joasa tensiune astfel: Din [CD a PT], se va realiza circuit [CN] pe stalpi noi cu conductor tip [..] L=[X]m pana la stalpul [Y]. BRANSAMENTE."
C3 stalpi existenti: "...astfel: Din [CD a PT], se va echipa circuit [CN] pe stalpi existenti comuni cu circuit [C1] cu conductor tip [..] L=[X]m pana la stalpul [Y]. BRANSAMENTE."
C4 existenti+extensie noi: "...astfel: Din [CD], se va echipa circuit [CN] pe stalpi existenti comuni cu [C1] cu [cond.] L=[X]m pana la [Y]. Din [Y] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."
C5 extindere de la stalp existent: "...prin extinderea circuitului [C1] existent de la stalpul [X] L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."
C6 LEA→LES firida: "...prin extinderea retelei de tip LEA ([cond.existent]), circuit [C1], din stalpul [X] se va poza cablu tip [NA2XBY..] L=[X]m pana la o [FG] proiectata pe soclu de beton. BRANSAMENTE."
C7 mansonare: "...astfel: Se va mansona cablul existent dintre [FG1] si [FG2] cu cablu tip [NA2XBY..] L=[X]m pana la o [FG] proiectata la limita de proprietate. BRANSAMENTE."
C8 baza+rezerva: "...astfel:\nAlimentare de baza: din [stalp/FG], circuit [C1], se va poza [cond.] L=[X]m pana la [FG] pe soclu.\nAlimentare de rezerva: din [stalp/FG], circuit [C2], se va poza [cond.] L=[X]m pana la [FG] pe soclu. BRANSAMENTE."
C9 echipare+preluare+extensie: "...astfel: Din [CD], se va echipa circuit [CN] pe stalpi existenti comuni cu [C1] cu [cond.] L=[X]m pana la stalpul [Y], din care se va prelua circuitul existent [C1] pana la stalpul [Z]. Din [Z] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."
C10a PT nou+preluare: "...astfel: Din TDJT a [PT nou] se va alimenta reteaua existenta, preluand circuitul [C1] de la stalpul [A] pana la stalpul [B] L=[X]m, conductor existent tip [..]. BRANSAMENTE."
C10b PT nou+preluare+extensie: "...astfel: Din TDJT a [PT nou] se va alimenta reteaua existenta, preluand [C1] de la [A] la [B] L=[X]m cond.existent [..]. De la [B] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."
C10c PT nou+echipare+preluare+extensie: "...astfel: Din TDJT a [PT nou] se va echipa circuit [CN] pe stalpi existenti cu cond.[..] L=[X]m pana la [Y], de unde se va prelua [C1] pana la [Z]. Din [Z] se va extinde L=[X]m pe stalpi noi [SC..]. BRANSAMENTE."
C11 PTAb nou+cablu LES+preluare+inlocuire: "...pe joasa tensiune astfel: Din TDJT a [PTAb] se va poza cablu tip [NA2XBY..] L=[X]m pana la stalpul [Y], de unde se va prelua circuitul existent [C1] pana la stalpul [Z]. BRANSAMENTE." — 6b: "Se va inlocui conductorul existent tip [..] cu conductor tip [NFA2X..] pe tronsonul stalpul [Y]-stalpul [Z]: L=[X]m." (sau pe tronsoane multiple daca e cazul, ca la 6b-A)

TIPARE 6b:
6b-A inlocuire tronsoane: "Se va inlocui conductorul existent [tip vechi] cu conductor tip [NFA2X..] pe urmatoarele tronsoane:\n- stalpul [A]-stalpul [B]: L=[X]m\n...\nTotal: [X]m."
6b-B circuit paralel: "Se va echipa circuit nou [CN] in paralel cu [C1] pe traseul [A]-[B] cu conductor tip [..] L=[X]m pe stalpi existenti."
6b-C inlocuire+extensie: "Se va inlocui conductorul existent pe tronsonul [A]-[B] L=[X]m. De la [B] se va extinde cu [cond.] L=[X]m pe stalpi noi [SC..]."
6b-D inlocuire tot circuitul: "Se va inlocui conductorul existent tip [..] cu conductor tip [NFA2X..] pe circuitul [C1] de la [CD] pana la stalpul [X], L=[X]m total."`;

async function loadSystemPrompt() {
  try {
    const { data, error } = await window.supabase
      .from('fs_templates')
      .select('section, code, name, content, sort_order')
      .eq('enabled', true)
      .order('sort_order');

    if (error || !data || !data.length) return HARDCODED_SYSTEM_PROMPT;

    const get = sec => data
      .filter(r => r.section === sec)
      .sort((a, b) => a.sort_order - b.sort_order);

    const intro       = get('intro')[0]?.content       || '';
    const bransamente = get('bransamente')[0]?.content || '';
    const t6a = get('6a').map(t => `${t.code} ${t.name}: ${t.content}`).join('\n');
    const t6b = get('6b').map(t => `${t.code} ${t.name}: ${t.content}`).join('\n');

    return [
      intro,
      bransamente,
      'TIPARE 6a — alege tiparul potrivit cu schema (toate incep cu "Alimentarea cu energie electrica a obiectivului se va realiza"):',
      t6a,
      'TIPARE 6b:',
      t6b,
    ].join('\n\n');
  } catch (_) {
    return HARDCODED_SYSTEM_PROMPT;
  }
}

// ── Main generate function ────────────────────────────────────────────────────
export async function generateFSWithAI() {
  const prov = document.getElementById('fs-ai-provider')?.value ||
               localStorage.getItem(PROVIDER_LS) || 'groq';

  let key;
  if (prov === 'gemini') {
    const inp = document.getElementById('fs-ai-gemini-key');
    key = inp?.value?.trim() || localStorage.getItem(GEMINI_KEY_LS) || '';
    if (!key) { toast('Introduceți cheia API Gemini!', 'err'); return; }
    localStorage.setItem(GEMINI_KEY_LS, key);
  } else {
    const inp = document.getElementById('fs-ai-key');
    key = inp?.value?.trim() || localStorage.getItem(GROQ_KEY_LS) || '';
    if (!key) { toast('Introduceți cheia API Groq!', 'err'); return; }
    localStorage.setItem(GROQ_KEY_LS, key);
  }

  // Step 1: run existing algorithm for a draft with the correct format/style
  if (typeof window.previewFS === 'function') {
    try { window.previewFS(); } catch (_) {}
  }
  const getDraft = id => document.getElementById(id)?.value?.trim() || '';
  const draftRacordare = getDraft('fs-preview-racordare');
  const draftIntarire  = getDraft('fs-preview-intarire');
  const draftRetea     = getDraft('fs-preview-retea');

  const infoRetea     = document.getElementById('fs-info-retea')?.value?.trim() || '';
  const schemaSummary = buildSchemaSummary();

  const systemPrompt = await loadSystemPrompt();

  const userPrompt =
`TEXT DRAFT (generat automat de aplicație — tipar corect, posibile erori):

6a. Soluția de Racordare (draft):
${draftRacordare || '[draft indisponibil]'}

6b. Lucrări Întărire Rețea (draft):
${draftIntarire || '[draft indisponibil]'}

5. Informații Rețea Existentă (draft):
${draftRetea || '[draft indisponibil]'}

---
SCHEMA ELECTRICĂ COMPLETĂ (date de referință pentru verificare și corecție):
${schemaSummary}
${infoRetea ? '\nINFO REȚEA (completat manual de proiectant): ' + infoRetea : ''}

Returnează un JSON cu 3 câmpuri — textul corectat și completat față de draft:
{
  "racordare": "<secțiunea 6a corectată>",
  "intarire": "<secțiunea 6b corectată sau NU ESTE CAZUL>",
  "retea": "<secțiunea 5 corectată>"
}
Răspunde DOAR cu JSON valid, fără text în afara JSON-ului.`;

  const btn = document.getElementById('fs-ai-gen-btn');
  const provLabel = prov === 'gemini' ? 'Gemini' : 'Groq';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generez...'; }
  toast(`Trimit schema la ${provLabel} AI...`, 'ac');

  try {
    const parsed = prov === 'gemini'
      ? await _callGemini(systemPrompt, userPrompt, key)
      : await _callGroq(systemPrompt, userPrompt, key);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('fs-preview-racordare', parsed.racordare);
    set('fs-preview-intarire',  parsed.intarire);
    set('fs-preview-retea',     parsed.retea);

    document.getElementById('fs-preview-section').style.display = 'flex';
    toast(`Text generat cu ${provLabel}! Verifică și editează dacă e necesar.`, 'ok');

  } catch (err) {
    toast(`Eroare ${provLabel}: ` + err.message, 'err');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🤖 GENEREAZĂ CU AI'; }
  }
}
