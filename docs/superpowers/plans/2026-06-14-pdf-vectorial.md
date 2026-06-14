# Export PDF Vectorial — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Înlocuiește rasterizarea SVG→Canvas→PNG→PDF cu `svg2pdf.js` pentru export PDF vectorial nativ.

**Architecture:** `doExportPDF()` din `src/export.js` și override-ul Tauri din `src/index.html` ambele elimină pipeline-ul canvas și apelează direct `window.svg2pdf(svgEl, pdf, opts)`. `buildExportSVG()` rămâne neatinsă — SVG string-ul e parsat cu `DOMParser` și trecut la svg2pdf. După render, footer-ul metadata e adăugat via `pdf.text()` ca înainte.

**Tech Stack:** jsPDF 2.5.1 (`window.jspdf`), svg2pdf.js 2.2.3 (`window.svg2pdf`) — ambele deja încărcate via CDN în `src/index.html` liniile 8 și 10. Build: `node build-browser.cjs`.

---

## Fișiere modificate

| Fișier | Modificare |
|--------|-----------|
| `src/export.js` | `doExportPDF()` liniile 272–307: elimină canvas, adaugă svg2pdf |
| `src/index.html` | Override Tauri `window.doExportPDF` liniile 1512–1553: același swap, `setTimeout(async function...)` |

---

### Task 1: Înlocuiește `doExportPDF` în `src/export.js`

**Files:**
- Modify: `src/export.js:272-307`

- [ ] **Step 1: Înlocuiește funcția `doExportPDF`**

În `src/export.js`, înlocuiește complet liniile 272–307 cu:

```javascript
export function doExportPDF(customBounds) {
  toast('⏳ Generez PDF vectorial...', 'ac');
  setTimeout(async () => {
    try {
      if (!window.jspdf) { toast('jsPDF indisponibil.', 'ac'); return; }
      if (!window.svg2pdf) { toast('svg2pdf indisponibil.', 'ac'); return; }
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
      await window.svg2pdf(svgEl, pdf, { x: 0, y: 0, width: pageW, height: pageH });
      let tot = 0; S.CN.forEach(c => tot += parseFloat(c.length) || 0);
      pdf.setFontSize(5); pdf.setTextColor(150);
      pdf.text(`ElectroCAD Pro v12  |  (c) Grigoriu Alin-Florin  |  ${new Date().toLocaleDateString('ro-RO')}  |  ${S.EL.length} elem  ${S.CN.length} conn  ${tot.toFixed(1)}m`, 4, pageH - 3);
      pdf.save('schema_electrica.pdf');
      toast('✅ PDF Vectorial exportat!', 'ok');
    } catch (err) { console.error('PDF error:', err); toast('Eroare PDF: ' + err.message, 'ac'); }
  }, 50);
}
```

- [ ] **Step 2: Build**

```bash
node build-browser.cjs
```

Așteptat: output fără erori, `docs/bundle.js` regenerat.

- [ ] **Step 3: Verificare în browser**

Deschide `docs/index.html` în browser. Adaugă câteva elemente pe schemă (stalpi, cabluri, etichete). Click Export → PDF.

Verifică:
- PDF se descarcă fără eroare în consolă
- Deschide PDF-ul în browser (drag & drop în tab): zoom la 400% — liniile și textul rămân ascuțite (vectori), nu pixelate
- Footer-ul cu data și număr elemente apare în josul paginii
- Dimensiunea paginii corespunde schemei (nu A4 fix)

- [ ] **Step 4: Commit**

```bash
git add src/export.js
git commit -m "feat: export PDF vectorial via svg2pdf (inlocuieste canvas rasterizare)"
```

---

### Task 2: Actualizează override-ul Tauri din `src/index.html`

**Files:**
- Modify: `src/index.html:1512-1553`

- [ ] **Step 1: Înlocuiește override-ul Tauri**

În `src/index.html`, găsește blocul dintre comentariile:
```
// ══════════════════════════════════════════
// OVERRIDE: doExportPDF() — PDF export
// ══════════════════════════════════════════
```
și înlocuiește tot conținutul `window.doExportPDF = function(...) { ... };` (liniile 1513–1553) cu:

```javascript
    window.doExportPDF = function(customBounds) {
      toast('Generez PDF vectorial...', 'ac');
      setTimeout(async function() {
        try {
          if (!window.jspdf) { toast('jsPDF indisponibil.', 'ac'); return; }
          if (!window.svg2pdf) { toast('svg2pdf indisponibil.', 'ac'); return; }
          var jsPDF = window.jspdf.jsPDF;
          var r = buildExportSVG(true, customBounds);
          var PX_TO_PT = 0.75;
          var pageW = r.W * PX_TO_PT, pageH = r.H * PX_TO_PT;
          var MAX_PT = 5080;
          if (pageW > MAX_PT || pageH > MAX_PT) { var f = MAX_PT / Math.max(pageW, pageH); pageW *= f; pageH *= f; }
          var parser = new DOMParser();
          var svgEl = parser.parseFromString(r.svgStr, 'image/svg+xml').documentElement;
          var orient = pageW >= pageH ? 'landscape' : 'portrait';
          var pdf = new jsPDF({ orientation: orient, unit: 'pt', format: [pageW, pageH], compress: true });
          await window.svg2pdf(svgEl, pdf, { x: 0, y: 0, width: pageW, height: pageH });
          var tot = 0; CN.forEach(function(c) { tot += parseFloat(c.length) || 0; });
          pdf.setFontSize(5); pdf.setTextColor(150);
          pdf.text('ElectroCAD Pro v12  |  (c) Grigoriu Alin-Florin  |  ' + new Date().toLocaleDateString('ro-RO') + '  |  ' + EL.length + ' elem  ' + CN.length + ' conn  ' + tot.toFixed(1) + 'm', 4, pageH - 3);
          var pdfBytes = pdf.output('arraybuffer');
          tauriSaveBinary(new Uint8Array(pdfBytes), 'schema_electrica.pdf', [{name:'PDF',extensions:['pdf']}]).then(function(p) {
            if (p) toast('PDF vectorial exportat: ' + p.split(/[/\\]/).pop(), 'ok');
          }).catch(function(e) { console.error('PDF save err:', e); toast('Eroare PDF: ' + e, ''); });
        } catch(e) { console.error('PDF err:', e); toast('Eroare PDF: ' + e, ''); }
      }, 50);
    };
```

Notă: `setTimeout(async function() {...})` în loc de `setTimeout(function() {...})` — necesar pentru `await window.svg2pdf(...)`.

- [ ] **Step 2: Build**

```bash
node build-browser.cjs
```

Așteptat: fără erori.

- [ ] **Step 3: Verificare în Tauri (dacă disponibil)**

Rulează aplicația Tauri și testează Export → PDF. Dialogul nativ de salvare trebuie să apară, PDF salvat să fie vectorial.

Dacă Tauri nu e disponibil acum, sari la step 4 — browser-ul e deja verificat în Task 1.

- [ ] **Step 4: Commit**

```bash
git add src/index.html
git commit -m "feat: update Tauri doExportPDF override la svg2pdf vectorial"
```

---

## Note post-implementare

**Diacritice:** Dacă după test textul cu ă/î/â/ș/ț apare incorect în PDF (pătrate sau lipsuri), soluția e embed font TTF în jsPDF — nu face parte din acest plan, se tratează separat dacă e necesar.

**`src-dist/index.html`:** Fișierul apare modificat în git status dar e o distribuție separată (nu e generată de build). Dacă conține și el un override PDF, actualizează manual după același pattern ca Task 2.
