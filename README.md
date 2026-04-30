# ElectroCAD Pro v12

> **Singura aplicație românească de proiectare rețele electrice JT/MT care integrează schemă CAD, calcul PE 132, analiză prosumator pe profile reale și generare automată Fișa de Soluție și Fișa de Calcul tarif racordare — totul într-un singur executabil, fără abonament, fără cloud, fără dependințe.**

**Autor:** ing. Grigoriu Alin-Florin — inginer electric, Distribuție Energie Electrică Iași
**Versiune:** 12.0.0
**Platformă:** Windows x64 (Tauri v2 / Rust + HTML5) + variantă browser-only pe GitHub Pages
**Status:** în uz de proiectanți din zona Moldovei pentru dosare ATR reale către Delgaz Grid

---

## De ce ElectroCAD Pro?

Un proiectant de rețele JT pierde zilnic **2–4 ore** reintroducând aceleași date în trei instrumente diferite: AutoCAD pentru schemă, Excel pentru calcule PE 132 și Word pentru Fișa de Soluție. ElectroCAD Pro înlocuiește toate trei.

| Flux clasic | ElectroCAD Pro |
|---|---|
| AutoCAD + bloc-diagrame manuale | Editor CAD cu **20+ componente** dedicate rețelelor JT/MT |
| Excel cu formule copiate între fișiere | **Calcul PE 132 live** direct pe schema desenată |
| Word cu șabloane copiate și adaptate | **Generare automată DOCX** Fișă de Soluție (9 cazuri tehnice detectate) |
| Introducere manuală în FISA_CALCUL.xlsm | **Export XLSX** direct în formatul oficial Delgaz |
| Analiză prosumator? → foaie separată, aproximativă | **Simulare orară 168h** cu profile reale Delgaz + PVGIS |

**Un singur fișier proiect `.json` conține toată rețeaua, toate calculele și toate documentele generate.**

---

## Pentru cine

- **Proiectanți independenți** și **firme de proiectare** care livrează dosare ATR pentru Delgaz / DEER / E-Distribuție
- **Departamente tehnice din operatorii de distribuție** care verifică soluții de racordare
- **Integratori fotovoltaici** care au nevoie să demonstreze impactul PV asupra rețelei existente
- **Studenți și cadre didactice** (ingineria energetică, electroenergetică) — aplicație didactică completă pe PE 132
- **Inspectori ANRE / experți tehnici** care verifică dimensionări

---

## Ce face, pe scurt

1. **Desenezi schema** — PT, CD/TDJT, stâlpi, firide, branșamente, cabluri — pe un canvas SVG
2. **Declari consumatorii și PV** — dicționar pe stâlp/firidă, per circuit
3. **Apeși un buton** — aplicația calculează ΔU, Isc, identifică topologia, validează normativ
4. **Exportă** — PNG/SVG/PDF/DXF pentru schemă, DOCX pentru Fișa de Soluție, XLSX pentru tariful de racordare

Totul **offline**, fără server, fără licență cloud, fără expunere de date.

---

## 1. Modulul CONSUMATOR (clasic)

### Model de date
- Fiecare stâlp sau firidă poate avea `cons_dict` = dicționar `{grup_circuit: nr_consumatori}`
- Agregat automat în `el.consumatori` = total
- Per-circuit (grup conductor) permite rețele multi-circuit pe același stâlp

### Parametri calculului
- **Pc** (putere contractată/consumator): implicit 2 kW casnic, configurabil în VD și Prosumator
- **Ks** (coeficient simultaneitate): tabelat pe număr de consumatori și mediu (rural/urban) conform PE 132
- **Mediu**: selector Rural/Urban (schimbă curba Ks)

### Tabel Ks (PE 132)

| N consumatori | Ks Rural | Ks Urban |
|---|---|---|
| 1 | 1.000 | 1.000 |
| 2 | 0.520 | 0.650 |
| 5 | 0.510 | 0.630 |
| 10 | 0.480 | 0.590 |
| 20 | 0.450 | 0.510 |
| 30 | 0.300 | 0.410 |
| 50 | 0.280 | 0.380 |
| > 60 | 0.250–0.270 | 0.350–0.410 |

### Puterea efectivă pe tronson
```
P_eff_local = N_at_child_node × Pc × Ks(N_at_child_node)
```
Consumatorii la nodul-capăt al tronsonului sunt tratați ca **distribuiți uniform** pe tronson (factor ½ în formulă).

---

## 2. Modulul PROSUMATOR / FOTOVOLTAIC

Modul dedicat analizei clienților care devin prosumatori (consumator + PV) sau pentru clienți noi concentrați cu cerere ATR.

**Acesta este diferențiatorul major al aplicației față de orice alt instrument de pe piața românească.**

### Model de date
- Paralel cu `cons_dict`: fiecare element poate avea `pv_dict` = `{grup_circuit: kWp_instalat}`
- Agregat în `el.p_pv` (kW total)
- Default `{}` → zero impact pe proiectele fără PV

### Moduri de analiză
Butonul **„ANALIZĂ PROSUMATOR"** deschide un panou cu 2 moduri selectabile:

#### A) Mod „Rețea existentă (din schemă)"
- Agregă toți consumatorii și PV-ul declarate în schemă
- Calcul pe circuit echivalent (L + S reprezentative manual)
- Util pentru analiză de sistem — cât stresează rețeaua consumul total vs producția totală PV

#### B) Mod „Client concentrat nou (ATR)"
Pentru evaluare ATR prosumator cu client punctual:
- Inputs: **Ps Consum client** (kW, contract) și **P_PV instalat client** (kWp invertor)
- Selector **Nod racordare** din schemă (dropdown cu toți stâlpii/firidele)
- Aplicația **calculează automat drumul** de la sursă (CD/PTAB) la nodul ales
- Folosește lungimile și secțiunile **reale** ale cablurilor din schemă
- Include sarcinile existente pe drum (consumatori + PV pe noduri intermediare)
- Include și rețeaua **downstream de client** (restul feeder-ului continuă)

### Profile temporale reale

**Profil consum** — Delgaz Grid, Profil rezidual oficial:
- Vară: săpt. 4–10 iulie 2022 (168 valori orare)
- Iarnă: săpt. 5–11 decembrie 2022 (168 valori orare)
- Normalizare: media săptămânală = 1.0
- Sursă: https://delgaz.ro/energie-electrica/profiluri-reziduale

**Profil PV** — PVGIS v5.3 JRC EU:
- Date măsurate satelit pentru Iași, anul 2023
- Săptămâna vară: 3–9 iulie 2023
- Săptămâna iarnă: 4–10 decembrie 2023
- Randament sistem: 14% pierderi (standard PV)
- Include variabilitatea reală (zile înnorate, soare filtrat)
- Sursă: https://re.jrc.ec.europa.eu/pvg_tools/en/

### Ce rezultă
1. **Flux putere** pe 168h — consum total, producție PV totală, flux net
2. **Tensiune la nodul de racordare** pe 168h (2 curbe: cu PV vs fără PV)
3. **Tabel „Defalcare per tronson"** — două tabele consecutive:
   - Peak consum (seara, worst case pentru dimensionare)
   - Peak PV (amiaza, prosumator în funcțiune)
4. **Statistici** — max consum, max injecție, ore flux invers, ΔU max zi cu/fără PV, beneficiu PV
5. **Tooltip interactiv** la hover — valorile consum/PV/flux/tensiune pentru orice oră din săptămână

---

## 3. Calcul cădere de tensiune (VD)

### Bază normativă
Calculul se efectuează conform **PE 132/2003** — „Normativ privind proiectarea rețelelor electrice de distribuție publică".

### Formulă PE 132 distribuită
```
ΔU(%) = (P_passing + P_local / 2) × L / (S × K)
```

| Simbol | Semnificație |
|---|---|
| ΔU(%) | cădere de tensiune procentuală pe tronson |
| P_passing | puterea care trece prin tronson spre consumatori din aval (kW) |
| P_local | puterea consumată la nodul-capăt al tronsonului (kW) |
| L | lungimea tronsonului (m) |
| S | secțiunea conductorului (mm²) |
| K | factor tip rețea: **46** trifazat, **20** bifazat, **7.7** monofazat |

Factorul K conține implicit tensiunea nominală (400V), conductivitatea Al (γ = 34) și cos φ = 0.95.

### Interpretare „distribuit"
Consumatorii la un nod nu sunt „concentrați" la un punct — sunt considerați distribuiți uniform pe tronsonul care duce la acel nod, de aceea `P_local / 2` (contribuția medie = jumătate din totalul local).

### Cumulativ la client
```
ΔU_cumul (%) la nod N = Σ ΔU_tronson pe drumul source → N
U_nod = Un × (1 − ΔU_cumul / 100)
```

### Limite normative
| Normativ | ΔU max admis |
|---|---|
| PE 132 rețea rurală | 8% |
| PE 132 rețea urbană | 5% |
| NTE 401 / Ord. ANRE 228 (regim normal) | ±10% |

---

## 4. Calcul curent de scurtcircuit (Isc)

### Formulă
```
Isc = U_faza / √(R_cum² + X_cum²)
```
- **U_faza** = 230 V
- **R_cum**, **X_cum** (mΩ) = impedanța cumulată de la transformator până în punct

### Impedanța transformatorului
| S_trafo (kVA) | R_trafo (mΩ) | X_trafo (mΩ) |
|---|---|---|
| 50 | 45.0 | 120.0 |
| 100 | 22.5 | 60.0 |
| 160 | 10.37 | 37.10 |
| 250 | 6.2 | 18.0 |
| 400 | 3.8 | 11.5 |
| 630 | 2.2 | 7.0 |
| 1000 | 1.3 | 4.5 |

### Verificare protecții
```
Isc > 3 × In_siguranță
```
Aplicația afișează **warning roșu** în tabel dacă Isc ≤ 3 × curent nominal al siguranței de pe tronson — poziția nu e protejată corespunzător la scurtcircuit.

### Tabele rezistivități (R0 în mΩ/km, X0 în Ω/km)

**Torsadat Al (NFA2X):**
| Secțiune | 25 | 35 | 50 | 70 | 95 | 120 | 150 |
|---|---|---|---|---|---|---|---|
| R0 | 1200 | 868 | 591 | 410 | 320 | 253 | 206 |
| X0 | 0.097 | 0.089 | 0.086 | 0.085 | 0.084 | 0.083 | 0.082 |

**Clasic Al (LEA):**
| Secțiune | 25 | 35 | 50 | 70 | 95 | 120 | 150 |
|---|---|---|---|---|---|---|---|
| R0 | 1181 | 833 | 579 | 437 | 309 | 246 | 196 |
| X0 | 0.320 (toate) |

**Cablu Al (NA2XBY):**
| Secțiune | 25 | 35 | 50 | 70 | 95 | 120 | 150 |
|---|---|---|---|---|---|---|---|
| R0 | 1250 | 892 | 525 | 445 | 328 | 260 | 208 |
| X0 | 0.08 (toate) |

---

## 5. Exemple practice de calcul

### Exemplul 1 — rețea scurtă rurală, 3 consumatori

**Schemă:**
```
PT 160 kVA → CD → SE4/1 (1 cons) → SE4/2 (1 cons) → SE4/3 (1 cons)
              [40m TYIR 50]  [50m TYIR 50]  [50m TYIR 50]
```
Toate tronsoanele: Torsadat Al 50 mm², trifazat. Pc = 2 kW, mediu rural.

**Calcul ΔU (la peak consum):**

| Tronson | L (m) | N_local | Ks | P_local (kW) | P_passing (kW) | P_eff (kW) | ΔU tronson | ΔU cumul |
|---|---|---|---|---|---|---|---|---|
| CD→SE4/1 | 40 | 1 | 1.00 | 2.00 | 4.00 | 5.00 | 0.087% | **0.09%** |
| SE4/1→SE4/2 | 50 | 1 | 1.00 | 2.00 | 2.00 | 3.00 | 0.065% | **0.15%** |
| SE4/2→SE4/3 | 50 | 1 | 1.00 | 2.00 | 0.00 | 1.00 | 0.022% | **0.17%** |

**Rezultat:** cădere totală la SE4/3 = 0.17% — mult sub limita 8% (rural). Rețea subdimensionată în siguranță.

**Calcul Isc la SE4/3:**
- R_cum = 10.37 + (591 × 2 × 140/1000) = 10.37 + 165.48 = 175.85 mΩ
- X_cum = 37.10 + (0.086 × 2 × 140) = 37.10 + 24.08 = 61.18 mΩ
- Isc = 230 / √(175.85² + 61.18²) = 230 / 186.2 = **1.235 kA**

Protejare cu siguranță 63A: Isc / In = 1235/63 = 19.6 × → OK (> 3×).

---

### Exemplul 2 — rețea medie cu prosumator la capăt

**Schemă:**
```
PT 250 kVA → CD → SE10/1 (5 cons) → SE10/2 (5 cons) → SE10/3 (5 cons + 10 kWp PV)
              [100m TYIR 50]     [150m TYIR 50]     [200m TYIR 50]
```
Total 15 consumatori rurali + 1 prosumator cu 10 kWp PV la SE10/3. Pc = 2 kW.

#### Peak consum (seara, PV = 0)

| Tronson | L | P_local | P_passing | P_eff | ΔU tronson | ΔU cumul |
|---|---|---|---|---|---|---|
| CD→SE10/1 | 100 | 5.10 | 10.20 | 12.75 | 0.554% | 0.55% |
| SE10/1→SE10/2 | 150 | 5.10 | 5.10 | 7.65 | 0.499% | 1.05% |
| SE10/2→SE10/3 | 200 | 5.10 | 0.00 | 2.55 | 0.222% | **1.28%** |

P_local = 5 × 2 × 0.51 = 5.10 kW/nod (Ks(5) = 0.51 rural).

**Rezultat peak consum:** ΔU la SE10/3 = 1.28% — OK sub 8%.

#### Peak PV (amiaza, consum profile ~0.87, PV ~0.7 × 10 × 0.95 = 6.65 kW)

| Tronson | P_local | P_passing | P_eff | ΔU tronson | ΔU cumul |
|---|---|---|---|---|---|
| CD→SE10/1 | 4.44 | 4.44 + (-2.21) = 2.23 | 4.45 | 0.193% | 0.19% |
| SE10/1→SE10/2 | 4.44 | -2.21 | 0.01 | 0.001% | 0.19% |
| SE10/2→SE10/3 | 4.44 − 6.65 = **-2.21** | 0.00 | -1.105 | **-0.096%** | **0.10%** |

**Rezultat peak PV:** ΔU la SE10/3 = 0.10% (față de 1.28% la peak consum). PV-ul reduce fluxul net aproape la zero pe ultimul tronson → tensiunea se stabilizează aproape de nominal.

#### Concluzii practice
- **Pentru dimensionare (ATR)**: worst case = peak consum (1.28%)
- **Pentru calitate energie zilnic**: prosumatorul îmbunătățește tensiunea la amiază cu ~1.2% = ~5 V
- **Risc supratensiune**: dacă P_PV >> consum local, tensiunea poate urca peste +5% / +10%. Aici 10 kWp < 15 consumatori × 2 = 30 kW → fără risc.

---

## 6. Normative și standarde aplicate

| Referință | Utilizare în ElectroCAD |
|---|---|
| **PE 132/2003** | Formulă cădere tensiune distribuită, Ks rural/urban, limite ΔU, calcul Isc |
| **NTE 401/03/00** | Limite tensiune la utilizatori finali (±10% Un regim normal) |
| **NTE 007/08/00** | Condiții tehnice cabluri și conductoare |
| **Ord. ANRE 228/2018** | Prosumatori — condiții tehnice racordare |
| **Ord. ANRE 143/2014** | Profile normate de consum (referință pentru Delgaz) |
| **Ord. ANRE 105/2022** | Contract-cadru furnizare |
| **Regulament ANRE Racordare (Ord. 59/2013, Ord. 7/2022)** | Procedura ATR, Fișa de Soluție |
| **DEGR E P13-F16 Ed.1** | Formatul oficial Fișa de Soluție Delgaz |

**Surse date reale:**
- Profile consum: Delgaz Grid — `https://delgaz.ro/energie-electrica/profiluri-reziduale`
- Profile PV: PVGIS JRC — `https://re.jrc.ec.europa.eu/pvg_tools/en/`

---

## 7. Cazuri generate automat pentru Fișa de Soluție

Aplicația detectează automat 9 cazuri tehnice de racordare din schemă și generează textul Fișei de Soluție conform formularului oficial DEGR E P13-F16:

1. **Mansonare / intercalare firidă** — mansoane proiectate + firidă proiectată între firide existente. Suportă multi-firide și multi-branșamente per firidă.
2. **Multi-PT (bază + rezervă)** — 2 posturi existente alimentează aceeași firidă proiectată. Text separat pentru sursă bază și rezervă.
3. **Circuit aerian pe stâlpi NOI + branșament** — CD/TDJT → stâlpi proiectați → branșament → BMPT. Detectare automată stâlpi noi vs existenți.
4. **Circuit subteran cu firidă proiectată + branșament** — CD/TDJT → cablu subteran → FG proiectată → branșament → BMPT.
5. **Circuit proiectat pe stâlpi EXISTENȚI + branșament** — cabluri proiectate pe stâlpi existenți. Detectare circuit comun existent (radial vs buclat).
6. **Branșament simplu din stâlp existent** — stâlp existent → cablu proiectat → BMPT.
7. **Branșament direct din CD/TDJT** — fără stâlpi intermediari.
8. **Doar circuit proiectat (fără BMPT)** — extindere pur de rețea.
9. **Separare Racordare + Întărire** — detecție automată după culoare: **roșu** (proiectat_racordare) → 6a, **mov** (întărire_înlocuire) sau **albastru** (întărire_nou) → 6b, demontări → 6c.

### Distincții automate în toate cazurile
- CD (PT Aerian) vs TDJT (PTAB 1T/2T)
- Conductor aerian (NFA2X) vs cablu subteran (NA2XBY)
- Monofazat vs trifazat (din proprietatea `tipRetea` a cablului)
- Radial vs buclat (detectat pe topologia schemei)
- Putere trafo citită dinamic din proprietatea elementului sursă
- Cablu continuu detectat (unificare cablu când are aceeași secțiune pe tot traseul)

---

## 8. Fișa de Calcul Tarif Racordare (XLSX)

Generator separat care populează template-ul oficial Delgaz `FISA_CALCUL.xlsm`:
- Mapare automată elemente schemă → poziții din catalogul FC (87 poziții)
- Cantități pentru: branșamente mono/trif (aerian/subteran), extinderi LEA/LES, PTAB, firide, BMPT (după amperaj), avize/acorduri, spargeri carosabil
- Ascundere automată rânduri cu cantitate zero
- Renumerotare A.1, A.2... pe secțiuni
- Export `.xlsx` (fără VBA), compatibil cu formularul Delgaz

---

## 9. Editor — funcționalități principale

### Elemente suportate (20+ tipuri)
- **Surse**: PT aerian, PTAB 1T/2T, PTAb Mono (cu celule trafo independente)
- **Distribuție**: CD 4/5/8 plecări, TDJT, bare colectoare MT
- **Stâlpi JT**: SE4, SE10, SE10 CS (cu siguranță), SC10002, SC10005, rotund, rotund special
- **Firide**: E2-4 (6 siguranțe), E3-4 (7 siguranțe), E3-0 (3 siguranțe)
- **Branșamente**: BMPT mono/trif, cu text configurabil
- **Auxiliare**: separatoare, mansoane, prize de pământ, puncte de conexiune
- **MT**: celule linie, celule trafo, bara stație MT, separatoare MT

### Stări element (cu cod de culoare standard Delgaz)
- Existent (culoare normală)
- Proiectat — Tarif Racordare (roșu)
- Întărire — Înlocuire conductor (mov)
- Întărire — Circuit/cablu nou (albastru)
- Lucrări coexistență (galben)
- Demontat (gri cu X)

### Generator automat rețea
Generare schemă completă dintr-un singur click plecând de la PT/PTAB:
- Circuite, derivații și sub-derivații recursive
- Selector tip conductor și secțiune pe fiecare ramură
- Suport LEA (stâlpi) sau LES (firide subterane)
- Trasee curate: L-shape din PTAB, U-shape între firide

### Export
- **PNG** HD (până la 4× rezoluție nativă)
- **SVG** vectorial (Inkscape, Illustrator, CorelDraw)
- **PDF** vectorial cu footer proiect
- **DXF** cu layere separate (AutoCAD, LibreCAD, QCAD)
- **JSON** pentru backup/versioning proiect
- **DOCX** Fișă de Soluție
- **XLSX** Fișă de Calcul

### Fundal cadastral
Import PNG/JPG ca strat de fundal, calibrare scară (măsurare distanță reală între 2 puncte), opacitate și blocare. Poți desena rețeaua direct peste planul cadastral al zonei.

---

## 10. Shortcut-uri tastatură

| Tastă | Acțiune |
|---|---|
| S | Mod selectare |
| C | Mod conectare cablu |
| R | Rotire element 90° |
| Delete | Șterge element selectat |
| Ctrl+Z / Ctrl+Y | Undo / Redo |
| Ctrl+C / Ctrl+V | Copiere / Lipire |
| Ctrl+S / Ctrl+O | Salvare / Deschidere proiect |
| Ctrl+A | Selectează tot |
| Scroll mouse | Zoom in/out |
| Click dreapta drag | Pan (mișcare canvas) |
| Shift (ținut) | Ortogonalitate pe conexiuni |

---

## 11. Avantaje competitive (de ce nu AutoCAD + Excel?)

| Criteriu | AutoCAD + Excel + Word | ElectroCAD Pro |
|---|---|---|
| Timp ciclu complet (schemă + calcul + FS + FC) | 4–8 ore | **30–60 min** |
| Erori de transcriere între instrumente | frecvente | **zero** (o singură sursă de adevăr) |
| Actualizare automată calcule la modificarea schemei | manuală | **instant** |
| Analiză prosumator | inexistentă, aproximări | **profile reale 168h** |
| Licență anuală | ~1500–3000 EUR (AutoCAD LT) | **gratuit pentru utilizare proprie** |
| Funcționează offline, fără cloud | parțial | **integral** |
| Învățare | zile–săptămâni | **sub 1 oră** |
| Export dosare Delgaz formatat oficial | manual | **automat (DOCX + XLSX)** |

---

## 12. Stack tehnic

- **Frontend**: HTML5 + SVG + JavaScript vanilla (fără framework) — ~8000 linii, single-file
- **Desktop wrapper**: Tauri v2 (Rust) — binar nativ, ~8 MB, fără Electron bloat
- **Generare documente**: `docx.js` pentru Fișa de Soluție, generator XLSX custom pentru Fișa de Calcul
- **Build**: JavaScript obfuscation, MSI installer Windows
- **Deploy browser-only**: GitHub Pages, fără server

### Rulare
```bash
# Mod dezvoltare (Tauri cu hot-reload)
npm run dev

# Build release cu obfuscare + installer MSI
npm run build

# Doar obfuscare JS (fără build)
npm run obfuscate
```

Codul sursă editabil: `src/index.html` (HTML + JS + CSS inline).
Pentru testare rapidă în browser: deschide direct `src/index.html` cu Chrome (nu necesită server).

---

## 13. Context de proiect

ElectroCAD Pro este dezvoltat de **ing. Grigoriu Alin-Florin**, inginer electric la Distribuție Energie Electrică Iași, pe baza experienței directe din proiectele de racordare reale executate în aria Delgaz. Fiecare caz tehnic generat automat corespunde unei situații întâlnite pe teren, iar formatele documentelor sunt validate cu verificatorii Delgaz.

Aplicația este în dezvoltare activă. Modulul de prosumator a fost integrat în 2026 pentru a răspunde valului de cereri ATR fotovoltaice generat de schemele de sprijin naționale (Casa Verde Fotovoltaice, programe regionale).

---

## 14. Contact și colaborări

**Autor:** ing. Grigoriu Alin-Florin
**Email:** louischoleski@gmail.com
**Locație:** Iași, România

Deschis pentru:
- Colaborări cu firme de proiectare electrică
- Integrări cu fluxuri interne ale operatorilor de distribuție
- Proiecte de cercetare în domeniul rețelelor inteligente / prosumatori
- Prezentări la conferințe tehnice (CNEE, SIER, SIELMEN)
- Licențiere instituțională

---

© 2026 Grigoriu Alin-Florin — ElectroCAD Pro v12
