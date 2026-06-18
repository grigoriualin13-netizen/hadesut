# Editor Template-uri Fișă de Soluție — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Editor vizual accesibil exclusiv adminului pentru a gestiona template-urile (C1–C11, 6b-A–D) trimise la AI la generarea Fișei de Soluție, stocate în Supabase și folosite de toți utilizatorii.

**Architecture:** Tabel Supabase `fs_templates` cu ~18 rânduri (intro, bransamente, 11 tipare 6a, 4 tipare 6b). La generare, `fs-ai.js` fetch-uiește template-urile și construiește `systemPrompt` dinamic; fallback pe constanta hardcodată dacă Supabase e inaccesibil. Editorul se deschide dintr-un buton din user-bar vizibil doar adminului.

**Tech Stack:** Supabase (PostgreSQL + RLS), ES Modules, HTML/CSS/JS pur (fără framework nou), esbuild (build:browser)

## Global Constraints

- Niciun framework JS nou — HTML/CSS/JS pur, same style ca restul app
- `window.supabase` e deja inițializat în `app.js` — nu necesită import separat
- Butonul "Template FS" vizibil exclusiv când `is_admin = true` (email `grigoriualin13@gmail.com` sau flag DB)
- Fallback pe `HARDCODED_SYSTEM_PROMPT` dacă fetch Supabase eșuează — generarea nu se blochează
- Build: `npm run build:browser` → `docs/bundle.js`
- Drag-and-drop reordonare NOT in scope

---

## File Map

| Fișier | Acțiune | Responsabilitate |
|--------|---------|-----------------|
| `src/fs-templates-editor.js` | **Creare** | CRUD Supabase, seeding DEFAULT_TEMPLATES, funcții UI editor |
| `src/index.html` | **Modificare** | Buton "Template FS" în user-bar + HTML modal + CSS |
| `src/auth.js` | **Modificare** | Arată/ascunde `btn-fs-templates`, resetare la logout |
| `src/fs-ai.js` | **Modificare** | Extrage `HARDCODED_SYSTEM_PROMPT`, adaugă `loadSystemPrompt()` |
| `src/app.js` | **Modificare** | Import + expunere pe `window` a funcțiilor din editor |

---

## Task 1: Creare tabel Supabase `fs_templates`

**Files:**
- Niciun fișier local — SQL se rulează manual în Supabase Dashboard

**Interfaces:**
- Produces: tabel `fs_templates` cu RLS activ, accesibil prin `window.supabase`

- [ ] **Step 1: Deschide Supabase Dashboard → SQL Editor**

Mergi la `https://supabase.com/dashboard` → proiectul ElectroCAD → **SQL Editor** → **New query**.

- [ ] **Step 2: Rulează SQL-ul de creare**

Pastează și execută:

```sql
-- Creare tabel
CREATE TABLE IF NOT EXISTS fs_templates (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text         NOT NULL CHECK (section IN ('intro','bransamente','6a','6b')),
  code        text,
  name        text         NOT NULL,
  content     text         NOT NULL DEFAULT '',
  sort_order  integer      NOT NULL DEFAULT 0,
  enabled     boolean      NOT NULL DEFAULT true,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now()
);

-- Index pentru fetch ordonat
CREATE INDEX IF NOT EXISTS fs_templates_sort ON fs_templates(sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION fs_templates_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER fs_templates_updated_at
  BEFORE UPDATE ON fs_templates
  FOR EACH ROW EXECUTE FUNCTION fs_templates_set_updated_at();

-- RLS
ALTER TABLE fs_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fst_read_authenticated" ON fs_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "fst_write_admin" ON fs_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

- [ ] **Step 3: Verifică că tabela a fost creată**

În Supabase Dashboard → **Table Editor** → caută `fs_templates`. Trebuie să apară cu coloanele definite și 0 rânduri.

- [ ] **Step 4: Commit (documentație)**

```bash
git add docs/superpowers/plans/2026-06-18-fs-template-editor.md
git commit -m "docs: plan implementare editor template-uri FS"
```

---

## Task 2: Creare `src/fs-templates-editor.js`

**Files:**
- Create: `src/fs-templates-editor.js`

**Interfaces:**
- Consumes: `window.supabase` (disponibil global), `toast` din `./utils.js`
- Produces:
  - `openFSTemplatesEditor(): Promise<void>` — deschide modalul și încarcă template-urile
  - `closeFSTemplatesEditor(): void` — închide modalul
  - `fstSelectTemplate(id: string): void` — selectează un tipar din listă (apelat din onclick HTML)
  - `fstSave(): Promise<void>` — salvează tiparul curent (INSERT sau UPDATE)
  - `fstDelete(): Promise<void>` — șterge tiparul curent (doar 6a/6b)
  - `fstNewTemplate(section: string): void` — pregătește editor pentru tipar nou

- [ ] **Step 1: Crează fișierul `src/fs-templates-editor.js`**

```javascript
// fs-templates-editor.js — Editor template-uri Fișă de Soluție (admin only)
import { toast } from './utils.js';

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

// ── State intern ─────────────────────────────────────────────────────────────
let _templates = [];
let _selected  = null;

// ── Open / Close ─────────────────────────────────────────────────────────────
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
  const { data, error } = await window.supabase
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
  const { error } = await window.supabase
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
    code:      _g('fst-field-code').trim()    || null,
    name:      _g('fst-field-name').trim(),
    content:   _g('fst-field-content').trim(),
    enabled:   document.getElementById('fst-field-enabled').checked,
  };

  if (!payload.name) { toast('Numele nu poate fi gol.', 'err'); return; }

  let error;
  if (typeof _selected.id === 'string' && _selected.id.startsWith('new-')) {
    const { error: err } = await window.supabase
      .from('fs_templates')
      .insert({ ...payload, section: _selected.section, sort_order: _selected.sort_order });
    error = err;
  } else {
    const { error: err } = await window.supabase
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

  const { error } = await window.supabase
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
  const existingInSection = _templates.filter(t => t.section === section);
  const maxOrder = existingInSection.reduce((m, t) => Math.max(m, t.sort_order), 0);
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
```

- [ ] **Step 2: Commit**

```bash
git add src/fs-templates-editor.js
git commit -m "feat: adauga modul fs-templates-editor cu CRUD Supabase si DEFAULT_TEMPLATES"
```

---

## Task 3: HTML modal + CSS + buton în `src/index.html`

**Files:**
- Modify: `src/index.html`

**Interfaces:**
- Consumes: funcțiile `fstSelectTemplate`, `fstSave`, `fstDelete`, `fstNewTemplate`, `openFSTemplatesEditor`, `closeFSTemplatesEditor` expuse pe `window` (Task 6)
- Produces: `#fst-overlay`, `#fst-modal`, `#btn-fs-templates` în DOM

- [ ] **Step 1: Adaugă CSS la finalul blocului `<style>` existent**

Găsește în `src/index.html` linia care conține `</style>` (închiderea blocului CSS principal) și inserează **înainte** de ea:

```css
/* ── FS Templates Editor ─────────────────────────────────────────────────── */
#fst-overlay{position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.5);display:none}
#fst-overlay.show{display:block}
#fst-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10002;
  width:900px;max-width:95vw;height:640px;max-height:90vh;
  background:var(--panel);border:1px solid var(--border2);border-radius:16px;
  display:none;flex-direction:column;overflow:hidden;box-shadow:0 12px 48px var(--shadow)}
#fst-modal.show{display:flex}
.fst-body{display:flex;flex:1;overflow:hidden}
.fst-left{width:220px;min-width:180px;border-right:1px solid var(--border);overflow-y:auto;padding:8px 0}
.fst-right{flex:1;padding:16px 20px;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
.fst-sec-hdr{padding:6px 12px 2px;font-size:9px;font-weight:800;color:var(--text3);
  text-transform:uppercase;letter-spacing:.08em;margin-top:6px}
.fst-item{padding:6px 14px;cursor:pointer;font-size:11px;color:var(--text2);
  display:flex;align-items:center;gap:6px;transition:background .1s}
.fst-item:hover{background:var(--bg3)}
.fst-active{background:var(--bg3)!important;color:var(--accent);border-left:2px solid var(--accent)}
.fst-disabled{opacity:.45}
.fst-code{font-weight:700;color:var(--accent);min-width:36px;font-size:10px;font-family:'JetBrains Mono',monospace}
.fst-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fst-badge{font-size:8px;background:var(--danger);color:#fff;padding:1px 5px;border-radius:3px;flex-shrink:0}
.fst-field-row{display:flex;align-items:center;gap:10px;flex-shrink:0}
.fst-field-row label{font-size:10px;color:var(--text3);min-width:54px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.fst-field-row input[type=text]{flex:1;height:28px;border:1px solid var(--border);
  border-radius:6px;background:var(--bg3);color:var(--text1);padding:0 8px;
  font-size:11px;font-family:'JetBrains Mono',monospace}
.fst-content-wrap{display:flex;flex-direction:column;gap:6px;flex:1;min-height:0}
.fst-content-wrap label{font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
#fst-field-content{flex:1;min-height:160px;resize:vertical;border:1px solid var(--border);
  border-radius:6px;background:var(--bg3);color:var(--text1);padding:8px;
  font-size:11px;font-family:'JetBrains Mono',monospace;line-height:1.5}
.fst-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;padding-top:2px}
.fst-actions button{height:28px;padding:0 14px;border-radius:6px;border:1px solid var(--border);
  background:var(--bg3);color:var(--text2);font-size:10px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-weight:600;transition:all .15s}
.fst-actions button:hover{border-color:var(--accent);color:var(--accent)}
#fst-btn-save{margin-left:auto;background:var(--accent);color:#000;border-color:var(--accent)}
#fst-btn-save:hover{opacity:.85}
#fst-btn-delete{color:var(--danger);border-color:rgba(255,80,80,.4)}
#fst-btn-delete:hover{background:rgba(255,80,80,.1);border-color:var(--danger)}
```

- [ ] **Step 2: Adaugă butonul "Template FS" în user-bar**

Găsește în `src/index.html` (linia ~1751):
```html
  <button id="admin-btn" onclick="openAdminPanel()" style="display:none;color:var(--accent);border-color:rgba(0,207,255,.3)">ADMIN</button>
```

Adaugă **după** această linie (înainte de butonul DECONECTARE):
```html
  <button id="btn-fs-templates" onclick="openFSTemplatesEditor()" style="display:none;color:var(--accent);border-color:rgba(0,207,255,.3)">📋 TEMPLATE FS</button>
```

- [ ] **Step 3: Adaugă HTML-ul modalului**

Găsește în `src/index.html` blocul `<!-- ADMIN PANEL -->` (linia ~1755) și adaugă **după** `</div>` al admin-panel:

```html
<!-- FS TEMPLATES EDITOR -->
<div id="fst-overlay" onclick="closeFSTemplatesEditor()"></div>
<div id="fst-modal">
  <div class="adm-header">
    <span class="adm-title">📋 Template-uri Fișă de Soluție</span>
    <button class="adm-close" onclick="closeFSTemplatesEditor()">✕</button>
  </div>
  <div class="fst-body">
    <div class="fst-left">
      <div id="fst-list"></div>
    </div>
    <div class="fst-right">
      <div class="fst-field-row">
        <label>Cod</label>
        <input id="fst-field-code" type="text" placeholder="C1, C2, 6b-A...">
      </div>
      <div class="fst-field-row">
        <label>Nume</label>
        <input id="fst-field-name" type="text" placeholder="bransament simplu">
      </div>
      <div class="fst-field-row">
        <label>Activ</label>
        <input id="fst-field-enabled" type="checkbox" checked>
      </div>
      <div class="fst-content-wrap">
        <label>Conținut</label>
        <textarea id="fst-field-content" placeholder="Textul tiparului trimis la AI..."></textarea>
      </div>
      <div class="fst-actions">
        <button onclick="fstNewTemplate('6a')">+ Tipar 6a</button>
        <button onclick="fstNewTemplate('6b')">+ Tipar 6b</button>
        <button id="fst-btn-delete" onclick="fstDelete()" style="display:none">🗑 Șterge</button>
        <button id="fst-btn-save" onclick="fstSave()">Salvează</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/index.html
git commit -m "feat: adauga modal editor template-uri FS si buton in user-bar"
```

---

## Task 4: Vizibilitate buton + resetare la logout în `src/auth.js`

**Files:**
- Modify: `src/auth.js`

**Interfaces:**
- Consumes: `window.closeFSTemplatesEditor` (expus în Task 6)
- Produces: `btn-fs-templates` vizibil la login admin, ascuns la logout

- [ ] **Step 1: Arată `btn-fs-templates` în `checkUserApproval()` — ramura email hardcodat**

Găsește în `src/auth.js` (linia ~181):
```javascript
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.style.display = '';
    return Promise.resolve(true);
```

Înlocuiește cu:
```javascript
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.style.display = '';
    const fstBtn = document.getElementById('btn-fs-templates');
    if (fstBtn) fstBtn.style.display = '';
    return Promise.resolve(true);
```

- [ ] **Step 2: Arată `btn-fs-templates` în `checkUserApproval()` — ramura DB `is_admin`**

Găsește în `src/auth.js` (linia ~205):
```javascript
      if (currentProfile.is_admin) {
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = '';
      }
```

Înlocuiește cu:
```javascript
      if (currentProfile.is_admin) {
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = '';
        const fstBtn = document.getElementById('btn-fs-templates');
        if (fstBtn) fstBtn.style.display = '';
      }
```

- [ ] **Step 3: Resetează `btn-fs-templates` la logout în `updateUserBar()`**

Găsește în `src/auth.js` (linia ~141):
```javascript
export function updateUserBar() {
  const bar = document.getElementById('user-bar');
  const emailEl = document.getElementById('user-email-display');
  if (currentUser) {
    bar.style.display = 'flex';
    emailEl.textContent = currentUser.email;
  } else {
    bar.style.display = 'none';
    emailEl.textContent = '';
  }
}
```

Înlocuiește cu:
```javascript
export function updateUserBar() {
  const bar = document.getElementById('user-bar');
  const emailEl = document.getElementById('user-email-display');
  if (currentUser) {
    bar.style.display = 'flex';
    emailEl.textContent = currentUser.email;
  } else {
    bar.style.display = 'none';
    emailEl.textContent = '';
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.style.display = 'none';
    const fstBtn = document.getElementById('btn-fs-templates');
    if (fstBtn) fstBtn.style.display = 'none';
  }
}
```

- [ ] **Step 4: Închide modalul la logout în `authLogout()`**

Găsește în `src/auth.js` (linia ~160):
```javascript
    updateUserBar();
    closeAdminPanel();
    showAuthScreen();
```

Înlocuiește cu:
```javascript
    updateUserBar();
    closeAdminPanel();
    window.closeFSTemplatesEditor?.();
    showAuthScreen();
```

- [ ] **Step 5: Commit**

```bash
git add src/auth.js
git commit -m "feat: arata/ascunde buton Template FS dupa status admin"
```

---

## Task 5: Refactorizare `src/fs-ai.js` — `loadSystemPrompt()` cu fallback

**Files:**
- Modify: `src/fs-ai.js`

**Interfaces:**
- Consumes: `window.supabase`, `DEFAULT_TEMPLATES` (nu importat — fallback e constanta locală)
- Produces: `loadSystemPrompt(): Promise<string>` — returnează systemPrompt din DB sau fallback

- [ ] **Step 1: Extrage `systemPrompt` în `HARDCODED_SYSTEM_PROMPT`**

În `src/fs-ai.js`, găsește în funcția `generateFSWithAI()` (linia ~287):
```javascript
  const systemPrompt =
`Expert tehnic JT România ...`;
```

Mută acest bloc **înaintea** funcției `generateFSWithAI` (ca variabilă de modul), redenumind-o:

```javascript
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
```

- [ ] **Step 2: Adaugă funcția `loadSystemPrompt()` după `HARDCODED_SYSTEM_PROMPT`**

Adaugă imediat după constanta de mai sus:

```javascript
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
```

- [ ] **Step 3: Actualizează `generateFSWithAI()` să folosească `loadSystemPrompt()`**

În `generateFSWithAI()`, înlocuiește linia:
```javascript
  const systemPrompt =
`Expert tehnic JT România ...`;
```
(care a fost mutată în Step 1) cu:

```javascript
  const systemPrompt = await loadSystemPrompt();
```

- [ ] **Step 4: Commit**

```bash
git add src/fs-ai.js
git commit -m "feat: fs-ai.js incarca systemPrompt din Supabase cu fallback hardcodat"
```

---

## Task 6: Import și expunere în `src/app.js`

**Files:**
- Modify: `src/app.js`

**Interfaces:**
- Consumes: `src/fs-templates-editor.js` (Task 2)
- Produces: `window.openFSTemplatesEditor`, `window.closeFSTemplatesEditor`, `window.fstSelectTemplate`, `window.fstSave`, `window.fstDelete`, `window.fstNewTemplate`

- [ ] **Step 1: Adaugă import în `src/app.js`**

Găsește linia existentă (linia ~52):
```javascript
import { toggleAIPanel, generateFSWithAI, fsAiProviderChange } from './fs-ai.js';
```

Adaugă **după** ea:
```javascript
import {
  openFSTemplatesEditor, closeFSTemplatesEditor,
  fstSelectTemplate, fstSave, fstDelete, fstNewTemplate,
} from './fs-templates-editor.js';
```

- [ ] **Step 2: Expune funcțiile pe `window`**

Găsește în `src/app.js` blocul unde sunt expuse funcțiile FS-AI pe window (caută `window.toggleAIPanel`):
```javascript
window.toggleAIPanel     = toggleAIPanel;
window.generateFSWithAI  = generateFSWithAI;
window.fsAiProviderChange = fsAiProviderChange;
```

Adaugă **după** aceste linii:
```javascript
window.openFSTemplatesEditor  = openFSTemplatesEditor;
window.closeFSTemplatesEditor = closeFSTemplatesEditor;
window.fstSelectTemplate      = fstSelectTemplate;
window.fstSave                = fstSave;
window.fstDelete              = fstDelete;
window.fstNewTemplate         = fstNewTemplate;
```

- [ ] **Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat: expune functii editor template-uri FS pe window"
```

---

## Task 7: Build și test manual

**Files:**
- Niciun fișier nou — verificare finală

- [ ] **Step 1: Build**

```bash
npm run build:browser
```

Expected: `docs/bundle.js` regenerat fără erori.

- [ ] **Step 2: Deschide app în browser**

Deschide `docs/index.html` în browser sau serverul local. Loghează-te cu `grigoriualin13@gmail.com`.

- [ ] **Step 3: Verifică butonul "Template FS"**

În user-bar (colțul stânga-jos) trebuie să apară: `[📋 TEMPLATE FS]  [ADMIN]  [DECONECTARE]`

Dacă nu apare: verifică Task 4 Step 1-2, verifică că build-ul s-a refăcut.

- [ ] **Step 4: Deschide editorul și verifică seed-ul**

Click pe "📋 TEMPLATE FS". La prima deschidere trebuie să:
1. Apară modalul cu 2 coloane
2. Să se insereze automat cele 18 template-uri (toast "Template-uri default încărcate!")
3. Lista stângă să afișeze 4 secțiuni cu rândurile corespunzătoare

- [ ] **Step 5: Editează un tipar și salvează**

Click pe "C1 bransament simplu" → editează câmpul Conținut → click "Salvează".
Expected: toast "Salvat!" și lista se reîncarcă.

- [ ] **Step 6: Adaugă tipar nou și șterge-l**

Click "+ Tipar 6a" → completează Cod="C12", Nume="test", Conținut="test content" → "Salvează".
Expected: apare C12 în lista 6a.
Click pe C12 → "🗑 Șterge" → confirmă.
Expected: C12 dispare din listă.

- [ ] **Step 7: Verifică că AI-ul folosește template-urile din DB**

Deschide un proiect cu elemente, deschide Fișa de Soluție → click "🤖 GENEREAZĂ CU AI".
Verifică în DevTools → Network că request-ul la Supabase `fs_templates` s-a făcut.
Expected: generarea funcționează și folosește textele din DB.

- [ ] **Step 8: Verifică fallback**

Temporary: în `loadSystemPrompt()`, schimbă tabelul în `'fs_templates_xxx'` (inexistent), regenerează AI.
Expected: generarea funcționează cu promptul hardcodat (fără eroare vizibilă pentru user).
Revino la `'fs_templates'` și rebuild.

- [ ] **Step 9: Verifică că la logout butonul dispare**

Click "DECONECTARE" → butonul "📋 TEMPLATE FS" trebuie să dispară.
Loghează-te cu un alt cont (non-admin) → butonul nu trebuie să apară.

- [ ] **Step 10: Commit final**

```bash
git add docs/bundle.js docs/index.html
git commit -m "build: regenereaza bundle cu editor template-uri FS"
```
