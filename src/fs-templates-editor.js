// fs-templates-editor.js — Editor template-uri Fișă de Soluție (admin only)
import { toast } from './utils.js';
import { getCloudFunctions } from './auth.js';

function _db() { return getCloudFunctions().supaClient; }

// ── Template-uri default (seed la prima deschidere) ──────────────────────────
export const DEFAULT_TEMPLATES = [
  {
    section: 'intro', code: null, name: 'Introducere + Reguli Generale',
    sort_order: 0, enabled: true,
    content: `Expert tehnic JT România (Delgaz Grid). Corectezi draft-ul față de schema electrică [EXISTENT]/[NOU] și rescrii dacă e greșit.

REGULI:
- Sec.5=NUMAI [EXISTENT]: PT, circuite existente tip/lungime cumulată. Sec.6a=NUMAI [NOU]: circuit proiectat, stalpi, BMPT. Sec.6b=NUMAI întărire; lipsă→exact: NU ESTE CAZUL
- [NOU pe stalpi EXISTENȚI]=echipare circuit; [NOU pe stalpi NOI]=extensie/prelungire
- Denumiri: NFA2X, NA2XBY, NYY, BMPT, PT, CD, LEA, LES, mmp. Lipsă→[DE COMPLETAT]
- Locatie BMPT: citeste campul "BMPT se monteaza:" din schema — respecta-l exact`,
  },
  {
    section: 'bransamente', code: null, name: 'Regula Universală Bransamente',
    sort_order: 1, enabled: true,
    content: `BRANSAMENTE (universal): Adauga "Bransamente:" la finalul 6a daca exista in schema. Grupeaza pe stalp/firida sursa:
- 1 bransament: "Din stalpul [X] se va realiza 1 bransament cu conductor tip [..] L=[X]m pana la un [BMPT] montat [locatie]."
- N>1 din acelasi stalp: "Din stalpul [X] se vor realiza [N] bransamente astfel:\\n- conductor tip [..] L=[X]m pana la [BMPT1] montat [loc].\\n- conductor tip [..] L=[X]m pana la [BMPT2] montat [loc]."
- Stalpi diferiti: descrie fiecare stalp separat. Fara bransamente→nu adauga sectiunea.`,
  },
  {
    section: '6a', code: 'C1', name: 'bransament simplu',
    sort_order: 10, enabled: true,
    content: `"...pe joasa tensiune din stalpul [X], circuit nr.[N], zona de post [PT], printr-un bransament cu conductor tip [..] L=[X]m pana la un [BMPT] montat [loc]."`,
  },
  {
    section: '6a', code: 'C2', name: 'stalpi noi',
    sort_order: 11, enabled: true,
    content: `"...pe joasa tensiune astfel: Din [CD a PT], se va realiza circuit [CN] pe stalpi noi cu conductor tip [..] L=[X]m pana la stalpul [Y]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C3', name: 'stalpi existenti',
    sort_order: 12, enabled: true,
    content: `"...astfel: Din [CD a PT], se va echipa circuit [CN] pe stalpi existenti comuni cu circuit [C1] cu conductor tip [..] L=[X]m pana la stalpul [Y]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C4', name: 'existenti+extensie noi',
    sort_order: 13, enabled: true,
    content: `"...astfel: Din [CD], se va echipa circuit [CN] pe stalpi existenti comuni cu [C1] cu [cond.] L=[X]m pana la [Y]. Din [Y] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C5', name: 'extindere de la stalp existent',
    sort_order: 14, enabled: true,
    content: `"...prin extinderea circuitului [C1] existent de la stalpul [X] L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C6', name: 'LEA→LES firida',
    sort_order: 15, enabled: true,
    content: `"...prin extinderea retelei de tip LEA ([cond.existent]), circuit [C1], din stalpul [X] se va poza cablu tip [NA2XBY..] L=[X]m pana la o [FG] proiectata pe soclu de beton. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C7', name: 'mansonare',
    sort_order: 16, enabled: true,
    content: `"...astfel: Se va mansona cablul existent dintre [FG1] si [FG2] cu cablu tip [NA2XBY..] L=[X]m pana la o [FG] proiectata la limita de proprietate. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C8', name: 'baza+rezerva',
    sort_order: 17, enabled: true,
    content: `"...astfel:\\nAlimentare de baza: din [stalp/FG], circuit [C1], se va poza [cond.] L=[X]m pana la [FG] pe soclu.\\nAlimentare de rezerva: din [stalp/FG], circuit [C2], se va poza [cond.] L=[X]m pana la [FG] pe soclu. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C9', name: 'echipare+preluare+extensie',
    sort_order: 18, enabled: true,
    content: `"...astfel: Din [CD], se va echipa circuit [CN] pe stalpi existenti comuni cu [C1] cu [cond.] L=[X]m pana la stalpul [Y], din care se va prelua circuitul existent [C1] pana la stalpul [Z]. Din [Z] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C10a', name: 'PT nou+preluare',
    sort_order: 19, enabled: true,
    content: `"...astfel: Din TDJT a [PT nou] se va alimenta reteaua existenta, preluand circuitul [C1] de la stalpul [A] pana la stalpul [B] L=[X]m, conductor existent tip [..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C10b', name: 'PT nou+preluare+extensie',
    sort_order: 20, enabled: true,
    content: `"...astfel: Din TDJT a [PT nou] se va alimenta reteaua existenta, preluand [C1] de la [A] la [B] L=[X]m cond.existent [..]. De la [B] se va extinde L=[X]m cu conductor tip [..] pe stalpi noi de tip [SC..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C10c', name: 'PT nou+echipare+preluare+extensie',
    sort_order: 21, enabled: true,
    content: `"...astfel: Din TDJT a [PT nou] se va echipa circuit [CN] pe stalpi existenti cu cond.[..] L=[X]m pana la [Y], de unde se va prelua [C1] pana la [Z]. Din [Z] se va extinde L=[X]m pe stalpi noi [SC..]. BRANSAMENTE."`,
  },
  {
    section: '6a', code: 'C11', name: 'PTAb nou+cablu LES+preluare+inlocuire',
    sort_order: 22, enabled: true,
    content: `"...pe joasa tensiune astfel: Din TDJT a [PTAb] se va poza cablu tip [NA2XBY..] L=[X]m pana la stalpul [Y], de unde se va prelua circuitul existent [C1] pana la stalpul [Z]. BRANSAMENTE." — 6b: "Se va inlocui conductorul existent tip [..] cu conductor tip [NFA2X..] pe tronsonul stalpul [Y]-stalpul [Z]: L=[X]m." (sau pe tronsoane multiple daca e cazul, ca la 6b-A)`,
  },
  {
    section: '6b', code: '6b-A', name: 'inlocuire tronsoane',
    sort_order: 30, enabled: true,
    content: `"Se va inlocui conductorul existent [tip vechi] cu conductor tip [NFA2X..] pe urmatoarele tronsoane:\\n- stalpul [A]-stalpul [B]: L=[X]m\\n...\\nTotal: [X]m."`,
  },
  {
    section: '6b', code: '6b-B', name: 'circuit paralel',
    sort_order: 31, enabled: true,
    content: `"Se va echipa circuit nou [CN] in paralel cu [C1] pe traseul [A]-[B] cu conductor tip [..] L=[X]m pe stalpi existenti."`,
  },
  {
    section: '6b', code: '6b-C', name: 'inlocuire+extensie',
    sort_order: 32, enabled: true,
    content: `"Se va inlocui conductorul existent pe tronsonul [A]-[B] L=[X]m. De la [B] se va extinde cu [cond.] L=[X]m pe stalpi noi [SC..]."`,
  },
  {
    section: '6b', code: '6b-D', name: 'inlocuire tot circuitul',
    sort_order: 33, enabled: true,
    content: `"Se va inlocui conductorul existent tip [..] cu conductor tip [NFA2X..] pe circuitul [C1] de la [CD] pana la stalpul [X], L=[X]m total."`,
  },
];

// ── State intern ──────────────────────────────────────────────────────────────
let _templates = [];
let _selected  = null;

// ── Open / Close ──────────────────────────────────────────────────────────────
export async function openFSTemplatesEditor() {
  document.getElementById('fst-overlay').classList.add('show');
  document.getElementById('fst-modal').classList.add('show');
  await _loadTemplates();
}

export function closeFSTemplatesEditor() {
  document.getElementById('fst-overlay').classList.remove('show');
  document.getElementById('fst-modal').classList.remove('show');
}

// ── Load + Seed ───────────────────────────────────────────────────────────────
async function _loadTemplates() {
  const { data, error } = await _db()
    .from('fs_templates')
    .select('*')
    .order('sort_order');

  if (error) {
    toast('Eroare la încărcarea template-urilor: ' + error.message, 'err');
    return;
  }

  if (!data || data.length === 0) {
    await _seedDefaults();
    return _loadTemplates();
  }

  _templates = data;
  _renderList();
}

async function _seedDefaults() {
  const { error } = await _db()
    .from('fs_templates')
    .insert(DEFAULT_TEMPLATES);
  if (error) toast('Eroare seed template-uri: ' + error.message, 'err');
  else toast('Template-uri default încărcate!', 'ok');
}

// ── Render list ───────────────────────────────────────────────────────────────
function _renderList() {
  const list = document.getElementById('fst-list');
  if (!list) return;

  const sections = [
    { key: 'intro',       label: 'Reguli Generale' },
    { key: 'bransamente', label: 'Bransamente' },
    { key: '6a',          label: '6a — Tipare Racordare' },
    { key: '6b',          label: '6b — Tipare Întărire' },
  ];

  list.innerHTML = sections.map(sec => {
    const items = _templates.filter(t => t.section === sec.key);
    const itemsHtml = items.map(t => `
      <div class="fst-item${_selected && t.id === _selected.id ? ' fst-active' : ''}${!t.enabled ? ' fst-disabled' : ''}"
           onclick="fstSelectTemplate('${t.id}')">
        ${t.code ? `<span class="fst-code">${t.code}</span>` : ''}
        <span class="fst-name">${t.name}</span>
        ${!t.enabled ? '<span class="fst-badge">OFF</span>' : ''}
      </div>`).join('');
    return `<div class="fst-sec-hdr">${sec.label}</div>${itemsHtml}`;
  }).join('');
}

// ── Select ────────────────────────────────────────────────────────────────────
export function fstSelectTemplate(id) {
  _selected = _templates.find(t => t.id === id) || null;
  if (!_selected) return;
  _renderList();

  _v('fst-field-code',    _selected.code    || '');
  _v('fst-field-name',    _selected.name    || '');
  _v('fst-field-content', _selected.content || '');
  document.getElementById('fst-field-enabled').checked = _selected.enabled;

  const canDel = _selected.section === '6a' || _selected.section === '6b';
  document.getElementById('fst-btn-delete').style.display = canDel ? '' : 'none';
}

// ── Save ──────────────────────────────────────────────────────────────────────
export async function fstSave() {
  if (!_selected) { toast('Selectează un tipar mai întâi.', 'err'); return; }

  const payload = {
    code:       _g('fst-field-code').trim() || null,
    name:       _g('fst-field-name').trim(),
    content:    _g('fst-field-content').trim(),
    enabled:    document.getElementById('fst-field-enabled').checked,
    updated_at: new Date().toISOString(),
  };

  if (!payload.name) { toast('Numele nu poate fi gol.', 'err'); return; }

  let error;
  if (typeof _selected.id === 'string' && _selected.id.startsWith('new-')) {
    const { error: err } = await _db()
      .from('fs_templates')
      .insert({ ...payload, section: _selected.section, sort_order: _selected.sort_order });
    error = err;
  } else {
    const { error: err } = await _db()
      .from('fs_templates')
      .update(payload)
      .eq('id', _selected.id);
    error = err;
  }

  if (error) { toast('Eroare la salvare: ' + error.message, 'err'); return; }
  toast('Salvat!', 'ok');
  _selected = null;
  _clearEditor();
  await _loadTemplates();
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function fstDelete() {
  if (!_selected) return;
  if (!confirm(`Ștergi tiparul "${_selected.code || _selected.name}"? Acțiunea e ireversibilă.`)) return;

  const { error } = await _db()
    .from('fs_templates')
    .delete()
    .eq('id', _selected.id);

  if (error) { toast('Eroare la ștergere: ' + error.message, 'err'); return; }
  toast('Tipar șters.', 'ok');
  _selected = null;
  _clearEditor();
  await _loadTemplates();
}

// ── New ───────────────────────────────────────────────────────────────────────
export function fstNewTemplate(section) {
  const inSection   = _templates.filter(t => t.section === section);
  const maxOrder    = inSection.reduce((m, t) => Math.max(m, t.sort_order), 0);
  _selected = {
    id:         'new-' + Date.now(),
    section,
    code:       '',
    name:       '',
    content:    '',
    enabled:    true,
    sort_order: maxOrder + 1,
  };
  _renderList();
  _clearEditor();
  document.getElementById('fst-field-enabled').checked = true;
  document.getElementById('fst-btn-delete').style.display = 'none';
  document.getElementById('fst-field-code').focus();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _v(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function _g(id)      { return document.getElementById(id)?.value || ''; }

function _clearEditor() {
  _v('fst-field-code', '');
  _v('fst-field-name', '');
  _v('fst-field-content', '');
  document.getElementById('fst-field-enabled').checked = true;
  document.getElementById('fst-btn-delete').style.display = 'none';
}
