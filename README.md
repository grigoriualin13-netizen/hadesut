# ElectroCAD Pro v12

Aplicatie profesionala pentru proiectarea retelelor electrice de distributie de joasa si medie tensiune.

**Autor:** Grigoriu Alin-Florin  
**Tehnologie:** Tauri v2 (Rust + HTML/JS)  
**Platforma:** Windows x64

---

## Functionalitati principale

### Editor CAD
- Canvas SVG interactiv cu pan, zoom, grid, snap si ortogonalitate
- 20+ tipuri de componente electrice: posturi de transformare (PTA, PTAB 1T, PTAB 2T), firide (E2-4, E3-4, E3-0), cutii distributie (CD 4/5/8P), stalpi (SE4, SE10, rotund), BMPT, separatoare, mansoane, prize de pamant
- Schema monofilara MT: bare colectoare, celule linie/trafo, PTAb monofilar, bara statie
- Conexiuni/cabluri cu trasee editabile punct cu punct
- Drag & drop, selectie multipla (Ctrl+Click, selectie dreptunghiulara)
- Copy/paste, undo/redo (60 nivele)
- Rotatie, scalare, culori configurabile per element
- Teme dark/light

### Sistem de stare (Existent / Proiectat)
- Fiecare element si cablu poate fi marcat ca:
  - **Existent** (culoare normala)
  - **Proiectat - Tarif Racordare** (rosu)
  - **Proiectat - Tarif Intarire Retea** (mov)
- Selectie multipla cu schimbare stare pe toate elementele odata
- Colorare automata la schimbarea starii

### Generator automat de retea
- Generare automata de circuite din PT Aerian, PTAB 1T sau PTAB 2T
- Derivatii si sub-derivatii recursive (sus/jos, stanga/dreapta)
- Selectie tip conductor si sectiune pe circuit principal si pe fiecare derivatie
- Suport stalpi noi sau firide (LEA/LES)
- Generare corecta a cablurilor cu trasee curate (L-shape din PTAB, U-shape intre firide)

### Calcul caderi de tensiune si scurtcircuit
- Calcul conform normativului PE 132/2003
- Selectie sursa: CD, TDJT, PTAb Mono (per celula trafo)
- PTAB 2T: calcul separat pe TD JT 1 si TD JT 2
- Overlay vizual pe schema cu DeltaU si Isc
- Detectie curent scurtcircuit insuficient (< 3x In siguranta)

### Export
- **PNG** HD (pana la 4x rezolutie)
- **SVG** vectorial (compatibil Inkscape, Illustrator)
- **PDF** vectorial cu footer
- **DXF** (compatibil AutoCAD, LibreCAD, QCAD) cu layere separate

### Generare Fisa de Solutie (DOCX)
- Generare automata a documentului "Fisa de Solutie" conform formularului DEGR E P13-F16, Ed.1
- Detectie automata a 9 cazuri de solutie tehnica (vezi mai jos)
- Denumiri oficiale cabluri: NFA2X (conductor aerian), NA2XBY (cablu subteran)
- Captura automata a schemei ca imagine in document
- Detectie retea radiala vs buclata
- Sectiuni complete: date PT, retea, tensiuni, solutie racordare, intarire, tarife, adresa electrica, semnaturi

### Fundal cadastral
- Import imagine (PNG/JPG) ca fundal
- Calibrare scara (masurare distanta reala)
- Opacitate si blocare configurabile

---

## Calcul caderi de tensiune - Metoda si formule

### Baza normativa
Calculul se efectueaza conform **PE 132/2003** - "Normativ privind proiectarea retelelor electrice de distributie publica" si **NTE 007/08/00** - normative tehnice energetice.

### Formula de calcul

Caderea de tensiune pe un tronson se calculeaza cu formula:

```
DeltaU(%) = (P_eff x L) / (S x K)
```

Unde:
- **DeltaU(%)** = caderea de tensiune procentuala pe tronson
- **P_eff** = puterea efectiva transportata pe tronson (kW)
- **L** = lungimea tronsonului (m)
- **S** = sectiunea conductorului (mm2)
- **K** = factor dependent de tipul retelei:
  - Trifazat: K = 46
  - Bifazat: K = 20
  - Monofazat: K = 7.7

### Puterea efectiva (P_eff)

```
P_eff = N x Pc x Ks
```

Unde:
- **N** = numarul de consumatori alimentati prin tronson
- **Pc** = puterea de calcul per abonat (kW) - implicit 2 kW
- **Ks** = coeficientul de simultaneitate (conform PE 132)

### Coeficientul de simultaneitate (Ks)

Valorile Ks sunt diferentiate pe mediu (rural/urban) conform PE 132:

| Nr. consumatori | Ks Rural | Ks Urban |
|-----------------|----------|----------|
| 1               | 1.000    | 1.000    |
| 2               | 0.520    | 0.650    |
| 3               | 0.520    | 0.640    |
| 5               | 0.510    | 0.630    |
| 10              | 0.480    | 0.590    |
| 15              | 0.470    | 0.540    |
| 20              | 0.450    | 0.510    |
| 30              | 0.300    | 0.410    |
| 40              | 0.290    | 0.390    |
| 50              | 0.280    | 0.380    |
| >60             | 0.250    | 0.350    |

### Rezistenta specifica (R0)

Valorile R0 (milliohm/km) sunt tabelate pe tip conductor si sectiune:

**Torsadat Al (NFA2X):**

| Sectiune (mm2) | 10    | 16    | 25    | 35   | 50   | 70   | 95   | 120  | 150  |
|-----------------|-------|-------|-------|------|------|------|------|------|------|
| R0 (milliohm/km)     | 3080  | 1910  | 1200  | 868  | 591  | 410  | 320  | 253  | 206  |

**Cablu Al (NA2XBY):**

| Sectiune (mm2) | 10    | 16    | 25    | 35   | 50   | 70   | 95   | 120  | 150  | 185  | 240  |
|-----------------|-------|-------|-------|------|------|------|------|------|------|------|------|
| R0 (milliohm/km)     | 3125  | 1953  | 1250  | 892  | 525  | 445  | 328  | 260  | 208  | 169  | 130  |

### Reactanta specifica (X0)

| Tip conductor   | X0 (ohm/km)        |
|------------------|--------------------|
| Clasic Al (LEA)  | 0.320              |
| Torsadat Al      | 0.084 - 0.098      |
| Cablu Al/Cu      | 0.08 - 0.11        |

### Curentul de scurtcircuit (Isc)

```
Isc = U / sqrt(R_cum^2 + X_cum^2)
```

Unde:
- **U** = 230 V (tensiunea de faza)
- **R_cum** = rezistenta cumulata de la trafo pana la punctul de calcul (milliohm)
- **X_cum** = reactanta cumulata de la trafo pana la punctul de calcul (milliohm)

Impedanta transformatorului (R_trafo, X_trafo) in milliohm:

| Putere trafo (kVA) | R (milliohm) | X (milliohm)  |
|---------------------|--------|---------|
| 50                  | 45.0   | 120.0   |
| 100                 | 22.5   | 60.0    |
| 160                 | 10.37  | 37.10   |
| 250                 | 6.2    | 18.0    |
| 400                 | 3.8    | 11.5    |
| 630                 | 2.2    | 7.0     |
| 1000                | 1.3    | 4.5     |

### Exemplu de calcul

**Date initiale:**
- Post transformare: PTA 250 kVA
- Circuit C1: 5 stalpi, conductor Torsadat Al 35 mm2, fiecare tronson 40 m
- Mediu: Rural
- Pc = 2 kW/abonat
- Consumatori pe fiecare stalp: 3

**Calcul pe tronsonul 1 (CD -> Stalp 1):**
- N = 15 consumatori (toti de dupa tronson 1)
- Ks = 0.47 (rural, 15 consumatori)
- P_eff = 15 x 2 x 0.47 = 14.1 kW
- DeltaU1 = (14.1 x 40) / (35 x 46) = 0.350%

**Calcul pe tronsonul 2 (Stalp 1 -> Stalp 2):**
- N = 12 consumatori
- Ks = 0.48
- P_eff = 12 x 2 x 0.48 = 11.52 kW
- DeltaU2 = (11.52 x 40) / (35 x 46) = 0.286%

**Calcul pe tronsonul 5 (Stalp 4 -> Stalp 5):**
- N = 3 consumatori
- Ks = 0.52
- P_eff = 3 x 2 x 0.52 = 3.12 kW
- DeltaU5 = (3.12 x 40) / (35 x 46) = 0.078%

**Caderea totala la ultimul stalp:**
- DeltaU_total = DeltaU1 + DeltaU2 + DeltaU3 + DeltaU4 + DeltaU5
- Limita admisa: 8% (rural) / 5% (urban)

**Curentul de scurtcircuit la Stalp 5:**
- R_cum = R_trafo + 5 x (R0 x 2 x L/1000) = 6.2 + 5 x (868 x 2 x 40/1000) = 6.2 + 347.2 = 353.4 milliohm
- X_cum = X_trafo + 5 x (X0 x 2 x L/1000) = 18.0 + 5 x (0.089 x 2 x 40) = 18.0 + 35.6 = 53.6 milliohm
- Isc = 230 / sqrt(353.4^2 + 53.6^2) = 230 / 357.4 = 0.644 kA

---

## Cazuri generate automat pentru Fisa de Solutie

### 1. Mansonare/Intercalare firida
Detectie: 2+ mansoane proiectate + firida proiectata intre firide existente.
Suporta multi-firide si multi-bransamente per firida.

### 2. Multi-PT (baza + rezerva)
Detectie: 2 posturi existente alimenteaza o firida proiectata.
Text separat pentru alimentare de baza si alimentare de rezerva.

### 3. Circuit aerian pe stalpi NOI + bransament
Detectie: CD/TDJT -> stalpi proiectati -> bransament -> BMPT.

### 4. Circuit subteran cu firida proiectata + bransament
Detectie: CD/TDJT -> cablu subteran -> FG proiectata -> bransament -> BMPT.

### 5. Circuit proiectat pe stalpi EXISTENTI + bransament
Detectie: cabluri proiectate pe stalpi existenti. Detecteaza circuitul comun existent.

### 6. Bransament simplu din stalp existent
Detectie: stalp existent -> cablu proiectat -> BMPT.

### 7. Bransament direct din CD/TDJT
Detectie: CD/TDJT -> cablu proiectat -> BMPT (fara stalpi intermediari).

### 8. Doar circuit proiectat (fara BMPT)
Detectie: circuit nou fara bransament la consumator.

### 9. Separare Racordare + Intarire
Detectie automata: elemente mov (intarire) la 6b, elemente rosii (racordare) la 6a.

### Distinctii automate in toate cazurile
- CD (PT Aerian) vs TDJT (PTAB 1T/2T)
- Conductor (NFA2X) vs Cablu (NA2XBY)
- Monofazat vs Trifazat
- Radial vs Buclat (sectiunea 5)
- Putere trafo dinamica din schema

---

## Shortcut-uri tastatura

| Tasta         | Actiune                    |
|---------------|----------------------------|
| S             | Mod selectare              |
| C             | Mod conectare cablu        |
| R             | Rotire element 90 grade    |
| Delete        | Sterge element selectat    |
| Ctrl+Z        | Undo                       |
| Ctrl+Y        | Redo                       |
| Ctrl+C        | Copiere                    |
| Ctrl+V        | Lipire                     |
| Ctrl+S        | Salvare proiect            |
| Ctrl+O        | Deschide proiect           |
| Ctrl+Shift+S  | Salvare ca...              |
| Ctrl+A        | Selecteaza tot             |
| Scroll mouse  | Zoom in/out                |
| Click dreapta | Pan (miscare canvas)       |

---

## Dezvoltare

```bash
# Mod dezvoltare (cu hot-reload)
npm run dev

# Build release cu obfuscare + installer
npm run build

# Doar obfuscare (fara build)
npm run obfuscate
```

Codul sursa se editeaza in `src/index.html`. La build, se genereaza automat `src-dist/index.html` (obfuscat) care e inclus in executabil.

---

(c) Grigoriu Alin-Florin - ElectroCAD Pro v12
