# Design: Editor Template-uri Fișă de Soluție

**Data:** 2026-06-18  
**Autor:** Admin (grigoriualin13@gmail.com)  
**Scope:** Panou admin pentru CRUD template-uri folosite la generarea FS cu AI

---

## Problema

Template-urile (tipare C1–C11, 6b-A–D, reguli universale) sunt hardcodate ca string literal în `src/fs-ai.js`. Orice modificare necesită editarea codului și rebuild. Scopul este un editor vizual accesibil doar adminului, cu stocare centralizată în Supabase, astfel încât toți utilizatorii folosesc mereu versiunea curentă.

---

## Decizie arhitecturală

**Tabel Supabase `fs_templates` + fetch la generare.**  
La click pe "GENEREAZĂ CU AI", app-ul fetch-uiește template-urile din Supabase și construiește `systemPrompt` dinamic. Fallback pe template-urile hardcodate dacă fetch-ul eșuează.

---

## 1. Structura datelor

### Tabel Supabase: `fs_templates`

| Câmp | Tip | Constrângeri |
|------|-----|-------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `section` | text | NOT NULL — valori: `'intro'`, `'bransamente'`, `'6a'`, `'6b'` |
| `code` | text | nullable — `null` pentru intro/bransamente, `'C1'`…`'C11'` / `'6b-A'`…`'6b-D'` |
| `name` | text | NOT NULL — etichetă scurtă (ex: "bransament simplu") |
| `content` | text | NOT NULL — textul complet al tiparului |
| `sort_order` | integer | NOT NULL, default 0 — ordine în cadrul secțiunii |
| `enabled` | boolean | NOT NULL, default true |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | default `now()` |

**~18 rânduri inițiale:**
- 1 × `intro` — introducere + blocul REGULI
- 1 × `bransamente` — regula universală bransamente
- 11 × `6a` — C1 prin C11
- 4 × `6b` — 6b-A prin 6b-D

### RLS (Row Level Security)

```sql
-- Orice utilizator autentificat poate citi
CREATE POLICY "read_all" ON fs_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Doar admin poate scrie
CREATE POLICY "admin_write" ON fs_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### Seeding automat

La primul deschis al editorului de admin, dacă `SELECT COUNT(*) FROM fs_templates` returnează 0, modulul inserează template-urile default din constanta `DEFAULT_TEMPLATES` definită în `src/fs-templates-editor.js`. Niciun script SQL manual.

---

## 2. Construcția systemPrompt la generare

### Fișier: `src/fs-ai.js` — funcție nouă `loadSystemPrompt()`

```javascript
async function loadSystemPrompt() {
  const { data, error } = await window.supabase
    .from('fs_templates')
    .select('section, code, name, content, sort_order')
    .eq('enabled', true)
    .order('sort_order');

  if (error || !data?.length) return HARDCODED_SYSTEM_PROMPT; // fallback

  const get = sec => data
    .filter(r => r.section === sec)
    .sort((a, b) => a.sort_order - b.sort_order);

  const intro       = get('intro')[0]?.content || '';
  const bransamente = get('bransamente')[0]?.content || '';
  const t6a = get('6a').map(t => `${t.code} ${t.name}: "${t.content}"`).join('\n');
  const t6b = get('6b').map(t => `${t.code} ${t.name}: "${t.content}"`).join('\n');

  return [
    intro,
    bransamente,
    'TIPARE 6a — alege tiparul potrivit cu schema (toate incep cu "Alimentarea cu energie electrica a obiectivului se va realiza"):',
    t6a,
    'TIPARE 6b:',
    t6b,
  ].join('\n\n');
}
```

`generateFSWithAI()` înlocuiește constanta `systemPrompt` cu `await loadSystemPrompt()`.

**Fallback:** dacă Supabase e inaccesibil (offline, eroare), se folosește `HARDCODED_SYSTEM_PROMPT` — constanta existentă mutată din inline în variabilă exportată. Generarea nu se blochează niciodată.

**Supabase** — deja disponibil ca `window.supabase` din `app.js`, fără import suplimentar.

---

## 3. UI Admin

### Buton în topbar

Vizibil exclusiv când `isCurrentUserAdmin() === true`. Plasat în `src/index.html` lângă butoanele "Admin" și "Deconectare":

```html
<button id="btn-fs-templates" onclick="openFSTemplatesEditor()"
        style="display:none">📋 Template FS</button>
```

Afișat/ascuns în `auth.js` unde se setează vizibilitatea butoanelor admin.

### Modal editor — `id="fs-templates-modal"`

**Layout două coloane:**

```
┌─────────────────────────────────────────────────────────┐
│  Editare Template-uri Fișă de Soluție          [× Închide]│
├──────────────────┬──────────────────────────────────────┤
│ Reguli Generale  │  Cod:    [C2          ]               │
│ Bransamente      │  Nume:   [stalpi noi  ]               │
│ ── 6a ──         │  Activ:  [✓]                          │
│  C1 bransament   │                                       │
│▶ C2 stalpi noi   │  Conținut:                            │
│  C3 existenti    │  ┌────────────────────────────────┐   │
│  ...             │  │ ...textul tiparului...         │   │
│  C11 PTAb        │  └────────────────────────────────┘   │
│ ── 6b ──         │                                       │
│  6b-A inlocuire  │  [ + Tipar Nou ]  [ 🗑 Șterge ]       │
│  6b-B paralel    │                      [ Salvează ]     │
│  6b-C ext        │                                       │
│  6b-D tot circ.  │                                       │
└──────────────────┴──────────────────────────────────────┘
```

**Interacțiuni:**

| Acțiune | Comportament |
|---------|-------------|
| Click tipar în stânga | Încarcă câmpurile în editorul din dreapta |
| Salvează | `UPSERT` în Supabase (`id` prezent → UPDATE, absent → INSERT), toast confirmare |
| Șterge | Disponibil doar pentru tipare 6a/6b (nu intro/bransamente). Confirmare dialog înainte de DELETE |
| + Tipar Nou | Adaugă intrare nouă în secțiunea activă (6a sau 6b), câmpuri goale, cod editabil |
| Toggle Activ | Setează `enabled=false` — tiparul nu apare în systemPrompt dar rămâne în DB |

**Niciun framework nou** — HTML/CSS/JS pur, același stil cu modalele existente din app.

---

## 4. Fișiere afectate

| Fișier | Modificare |
|--------|------------|
| `src/fs-ai.js` | Adaugă `loadSystemPrompt()`, mută `systemPrompt` hardcodat în `HARDCODED_SYSTEM_PROMPT` |
| `src/fs-templates-editor.js` | **Fișier nou** — logica editorului: CRUD Supabase, seeding, `openFSTemplatesEditor()` |
| `src/index.html` | Adaugă buton "📋 Template FS" în topbar + HTML modal editor |
| `src/auth.js` | Afișează/ascunde butonul "📋 Template FS" după `isCurrentUserAdmin()` |
| `src/app.js` | Import `openFSTemplatesEditor` din `fs-templates-editor.js`, expus pe `window` |

---

## 5. Constrângeri și non-scopuri

- Editorul este **exclusiv admin** (grigoriualin13@gmail.com sau `is_admin=true`)
- Nu există versionare/istoric al modificărilor — se poate adăuga ulterior
- Nu există preview live al systemPrompt — editarea e text direct
- Ordinea tiparelor în UI reflectă `sort_order` din DB — reordonarea drag-and-drop **nu** e în scope pentru această iterație
