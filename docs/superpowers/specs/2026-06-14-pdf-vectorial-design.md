# Export PDF Vectorial — Design Spec

**Data:** 2026-06-14  
**Status:** Aprobat  
**Abordare aleasă:** Opțiunea A — Swap direct svg2pdf

---

## Problemă

`doExportPDF()` rasterizează SVG-ul la canvas → PNG → jsPDF, rezultând un PDF de calitate slabă (echivalent raster, nu vectorial). `svg2pdf.js` este deja încărcat în `index.html` (linia 10) dar neutilizat.

---

## Soluție

Înlocuim pipeline-ul de rasterizare cu un apel direct la `svg2pdf`, care convertește SVG DOM → PDF vectorial nativ.

### Flow actual (de eliminat)
```
buildExportSVG() → svgStr → Image pe Canvas → canvas.toDataURL('png') → jsPDF.addImage(PNG)
```

### Flow nou
```
buildExportSVG() → svgStr → DOMParser → SVG DOM element → svg2pdf(el, pdf) → pdf.save()
```

---

## Fișiere modificate

### 1. `src/export.js` — funcția `doExportPDF(customBounds)`

**Elimină:** blocul `canvas`, `img.onload`, `toDataURL('image/png')`, `pdf.addImage()`

**Înlocuiește cu:**
```javascript
const parser = new DOMParser();
const svgEl = parser.parseFromString(svgStr, 'image/svg+xml').documentElement;
const orient = pageW >= pageH ? 'landscape' : 'portrait';
const pdf = new jsPDF({ orientation: orient, unit: 'pt', format: [pageW, pageH], compress: true });
await svg2pdf(svgEl, pdf, { x: 0, y: 0, width: pageW, height: pageH });
let tot = 0; S.CN.forEach(c => tot += parseFloat(c.length) || 0);
pdf.setFontSize(5); pdf.setTextColor(150);
pdf.text(`ElectroCAD Pro v12  |  (c) Grigoriu Alin-Florin  |  ${new Date().toLocaleDateString('ro-RO')}  |  ${S.EL.length} elem  ${S.CN.length} conn  ${tot.toFixed(1)}m`, 4, pageH - 3);
pdf.save('schema_electrica.pdf');
```

`svg2pdf` e disponibil ca `window.svg2pdf` (deja încărcat).

### 2. `src/index.html` — override Tauri `window.doExportPDF` (linia ~1512)

Același swap ca mai sus, dar finalul salvează via Tauri:
```javascript
const pdfBytes = pdf.output('arraybuffer');
tauriSaveBinary(new Uint8Array(pdfBytes), 'schema_electrica.pdf', [{name:'PDF',extensions:['pdf']}])
  .then(p => { if (p) toast('PDF exportat: ' + p.split(/[/\\]/).pop(), 'ok'); })
  .catch(e => { toast('Eroare PDF: ' + e, ''); });
```

---

## Ce NU se schimbă

- `buildExportSVG()` — neatinsă
- Calculul dimensiunii paginii: `PX_TO_PT = 0.75`, `MAX_PT = 5080`, orientare auto landscape/portrait
- Textul footer metadata (data, nr elemente, lungime totală rețea)
- Watermark-ul `© Made by Grigoriu Alin-Florin` deja prezent în SVG via `buildExportSVG()`
- Export PNG, SVG, DXF — neafectate

---

## Risc: Diacritice

svg2pdf 2.2.3 + jsPDF 2.5.1 folosesc fonturile built-in ale jsPDF (Helvetica/Times/Courier) care nu conțin caractere românești (ă, î, â, ș, ț).

**Comportament posibil:** literele cu diacritice pot apărea ca spații, pătrate sau caractere greșite în PDF-ul vectorial.

**Strategie:** testăm după implementare pe o schemă cu etichete care conțin diacritice. Dacă e o problemă, pasul următor e embed font TTF (DejaVu Sans ~150KB base64 în jsPDF) — nu face parte din acest spec.

---

## Criterii de succes

1. PDF exportat conține vectori (linii, text, curbe) — nu imagine rasterizată
2. Calitatea nu se degradează la zoom în PDF viewer
3. Funcționează atât în browser (download direct) cât și în Tauri (dialog nativ)
4. Dimensiunea paginii, orientarea și footer-ul metadata sunt identice cu varianta anterioară
