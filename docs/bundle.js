(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/state.js
  var S;
  var init_state = __esm({
    "src/state.js"() {
      S = {
        // Date schemă
        EL: [],
        CN: [],
        // Selecție
        sel: null,
        multiSel: /* @__PURE__ */ new Set(),
        selRect: null,
        selRectStart: null,
        // Mod interacțiune
        mode: "select",
        pendType: null,
        // View (pan + zoom)
        view: { x: 0, y: 0, s: 1 },
        panning: false,
        panS: { x: 0, y: 0 },
        // Drag element
        dragging: false,
        dragEl: null,
        dragOff: { x: 0, y: 0 },
        multiDragStart: null,
        // Editare vertex cablu
        vxDrag: false,
        vxConn: null,
        vxIdx: -1,
        // Conectare cabluri
        connStart: null,
        connPts: [],
        connFromEl: null,
        connFromTerm: null,
        connToEl: null,
        connToTerm: null,
        connFromCircuit: null,
        connToCircuit: null,
        // Desen liber / calibrare
        arrPts: [],
        calibPts: [],
        tempCalibLenPx: 0,
        // Export
        pendExport: null,
        exportRectStart: null,
        // Opțiuni planșă
        snapOn: true,
        orthoOn: false,
        shiftOn: false,
        // Clipboard + undo/redo
        clipboard: null,
        undoStack: [],
        redoStack: [],
        // Fundal cadastral (raster)
        bgData: { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true },
        draggingBg: false,
        // Strat DXF vectorial
        dxfData: null,
        // Contor etichete automate per tip element
        counters: {},
        // Calcul VD
        vdResults: null,
        vdOverlayOn: false,
        // Scară
        pxPerMeter: 20,
        // Animație flux
        flowAnimOn: false,
        flowAnimFrameId: null,
        // Proiect curent
        currentProjectId: null,
        currentProjectName: null,
        autoSaveTimer: null,
        autoSaveInterval: 6e4,
        lastAutoSave: 0,
        hasUnsavedChanges: false,
        // Autentificare Supabase
        supaClient: null,
        currentUser: null,
        authMode: "login",
        currentProfile: null,
        // Prosumator
        prosExtraClients: [],
        // IndexedDB
        ecDB: null,
        // UI
        lightMode: false,
        toastTimer: null
      };
    }
  });

  // src/config.js
  var GRID, MAX_UNDO, ENABLE_PROSUMER_MODULE, R0_TABLES, KS_RURAL, KS_URBAN;
  var init_config = __esm({
    "src/config.js"() {
      GRID = 20;
      MAX_UNDO = 60;
      ENABLE_PROSUMER_MODULE = true;
      R0_TABLES = {
        "Clasic Al": { 2.5: 11800, 4: 7320, 6: 4900, 10: 2940, 16: 1802, 25: 1181, 35: 833, 50: 579, 70: 437, 95: 309, 120: 246, 150: 196, 185: 158, 240: 119 },
        "Torsadat Al": { 10: 3080, 16: 1910, 25: 1200, 35: 868, 50: 591, 70: 410, 95: 320, 120: 253, 150: 206 },
        "Cablu Al": { 2.5: 11800, 4: 7812, 6: 5208, 10: 3125, 16: 1953, 25: 1250, 35: 892, 50: 525, 70: 445, 95: 328, 120: 260, 150: 208, 185: 169, 240: 130 },
        "Cablu Cu": { 2.5: 7130, 4: 4470, 6: 2970, 10: 1786, 16: 1123, 25: 738, 35: 525, 50: 372, 70: 271, 95: 192, 120: 153, 150: 122, 185: 98, 240: 78 },
        "OL-AL": { 35: 834, 50: 593, 70: 423, 95: 312, 120: 247 }
      };
      KS_RURAL = {
        0: 0,
        1: 1,
        2: 0.52,
        3: 0.52,
        4: 0.51,
        5: 0.51,
        6: 0.5,
        7: 0.5,
        8: 0.49,
        9: 0.49,
        10: 0.48,
        11: 0.48,
        12: 0.48,
        13: 0.47,
        14: 0.47,
        15: 0.47,
        16: 0.46,
        17: 0.46,
        18: 0.46,
        19: 0.45,
        20: 0.45,
        21: 0.44,
        22: 0.42,
        23: 0.4,
        24: 0.38,
        25: 0.36,
        26: 0.34,
        27: 0.33,
        28: 0.32,
        29: 0.31,
        30: 0.3
      };
      KS_URBAN = {
        0: 0,
        1: 1,
        2: 0.65,
        3: 0.64,
        4: 0.63,
        5: 0.63,
        6: 0.62,
        7: 0.62,
        8: 0.61,
        9: 0.6,
        10: 0.59,
        11: 0.58,
        12: 0.57,
        13: 0.56,
        14: 0.55,
        15: 0.54,
        16: 0.53,
        17: 0.52,
        18: 0.51,
        19: 0.51,
        20: 0.51,
        21: 0.5,
        22: 0.49,
        23: 0.48,
        24: 0.47,
        25: 0.46,
        26: 0.45,
        27: 0.44,
        28: 0.43,
        29: 0.42,
        30: 0.41
      };
    }
  });

  // src/utils.js
  function initUtils(svgEl, VP) {
    _svgEl = svgEl;
    _VP = VP;
  }
  function toast(msg, type = "") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = type;
    t.style.opacity = 1;
    clearTimeout(S.toastTimer);
    S.toastTimer = setTimeout(() => t.style.opacity = 0, 3e3);
  }
  function svgPt(e) {
    if (!_svgEl) return { x: 0, y: 0 };
    const r = _svgEl.getBoundingClientRect();
    const s = S.view.s || 1;
    return {
      x: (e.clientX - r.left - S.view.x) / s,
      y: (e.clientY - r.top - S.view.y) / s
    };
  }
  function sn(v) {
    return S.snapOn ? Math.round(v / GRID) * GRID : v;
  }
  function uid() {
    return Date.now() + Math.floor(Math.random() * 99999);
  }
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  function termWorldPos(el, lcx, lcy) {
    const rot = (el.rotation || 0) * Math.PI / 180, sc = el.scale || 1;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    return { x: el.x + lcx * sc * cos - lcy * sc * sin, y: el.y + lcx * sc * sin + lcy * sc * cos };
  }
  function getLineIntersection(p1, p2, p3, p4) {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denom === 0) return null;
    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
    if (ua > 0.05 && ua < 0.95 && ub > 0.05 && ub < 0.95)
      return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
    return null;
  }
  function calcPathLen(pts) {
    if (!pts || pts.length < 2) return 0;
    let l = 0;
    for (let i = 0; i < pts.length - 1; i++) l += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    return l;
  }
  function applyView() {
    _VP.setAttribute("transform", `translate(${S.view.x},${S.view.y}) scale(${S.view.s})`);
    const bgL = document.getElementById("bg-layer");
    if (bgL) bgL.style.transform = `translate(${S.view.x}px, ${S.view.y}px) scale(${S.view.s})`;
    document.getElementById("zlbl").textContent = Math.round(S.view.s * 100) + "%";
  }
  function updateStat() {
    document.getElementById("ste").textContent = S.EL.length + " elem";
    document.getElementById("stc").textContent = S.CN.length + " conn";
  }
  function setStat() {
    const N = { select: "SELECT", connect: "CONNECT", draw_poly: "LINIE LIBER\u0102", place: "PLASARE", calibrate: "CALIBRARE", export_box: "EXPORT SELECTIE" };
    document.getElementById("stm").textContent = N[S.mode] || S.mode.toUpperCase();
  }
  function setMode(m) {
    S.mode = m;
    S.pendType = null;
    S.connStart = null;
    S.connPts = [];
    S.arrPts = [];
    S.calibPts = [];
    S.connFromEl = null;
    S.connFromTerm = null;
    S.connToEl = null;
    S.connToTerm = null;
    S.connFromCircuit = null;
    S.connToCircuit = null;
    S.selRectStart = null;
    S.selRect = null;
    S.exportRectStart = null;
    document.getElementById("sel-rect")?.setAttribute("display", "none");
    document.getElementById("export-rect")?.setAttribute("display", "none");
    document.body.classList.remove("conn-active", "place-active", "calib-active", "export-active");
    ["btn-sel", "btn-conn", "btn-poly"].forEach((id) => document.getElementById(id)?.classList.remove("active"));
    document.getElementById("tpoly").style.display = "none";
    if (m === "select") document.getElementById("btn-sel").classList.add("active");
    if (m === "calibrate") document.body.classList.add("calib-active");
    if (m === "export_box") document.body.classList.add("export-active");
    if (m === "connect") {
      document.getElementById("btn-conn").classList.add("active");
      document.body.classList.add("conn-active");
      toast("Click terminal START \u2192 puncte pe traseu \u2192 click terminal FINAL", "ac");
    }
    if (m === "draw_poly") {
      document.getElementById("btn-poly").classList.add("active");
      document.body.classList.add("conn-active");
    }
    setStat();
  }
  function startPlace(t) {
    S.pendType = t;
    S.mode = "place";
    document.body.classList.add("place-active");
    document.getElementById("btn-sel").classList.remove("active");
    toast("Click pe plan\u0219\u0103 pentru a plasa");
    setStat();
  }
  function toggleSub(id) {
    const e = document.getElementById(id);
    e.style.display = e.style.display === "flex" ? "none" : "flex";
  }
  function toggleSnap() {
    S.snapOn = !S.snapOn;
    document.getElementById("btn-snap").classList.toggle("on", S.snapOn);
    toast(S.snapOn ? "Snap ON" : "Snap OFF");
  }
  function toggleOrtho() {
    S.orthoOn = !S.orthoOn;
    document.getElementById("btn-ortho").classList.toggle("on", S.orthoOn);
    toast(S.orthoOn ? "Orto ON" : "Orto OFF");
  }
  var _svgEl, _VP;
  var init_utils = __esm({
    "src/utils.js"() {
      init_state();
      init_config();
    }
  });

  // src/elements.js
  function nextLbl(t) {
    const prefix = {
      ptab_1t: "PTAB",
      ptab_2t: "PTAB",
      trafo: "PT",
      firida_e2_4: "FG",
      firida_e3_4: "FG",
      firida_e3_0: "FG",
      cd4: "CD",
      cd5: "CD",
      cd8: "CD",
      meter: "BMPT",
      stalp_se4: "SE4",
      stalp_se10: "SE10",
      stalp_cs: "SCS",
      stalp_sc10002: "SC10002",
      stalp_sc10005: "SC10005",
      stalp_rotund: "SR",
      stalp_rotund_special: "SRS",
      stalp_mt_sc10001: "SC10001",
      stalp_mt_sc15006: "SC15006",
      stalp_mt_sc15007: "SC15007",
      stalp_mt_sc15014: "SC15014",
      stalp_mt_sc15015: "SC15015",
      stalp_mt_se4t: "SE4T",
      stalp_mt_se5t: "SE5T",
      stalp_mt_se6t: "SE6T",
      stalp_mt_se7t: "SE7T",
      stalp_mt_se8t: "SE8T",
      stalp_mt_se9t: "SE9T",
      stalp_mt_se10t: "SE10T",
      stalp_mt_se11t: "SE11T",
      separator: "SEP",
      separator_mt: "SMT",
      manson: "M",
      priza_pamant: "PP",
      text: "",
      rect: "",
      circle: "",
      polyline: "",
      bara_mt: "BAMT",
      celula_linie_mt: "CLM",
      celula_trafo_mt: "CTM",
      ptab_mono: "PTAb",
      bara_statie_mt: "BS"
    };
    const p = prefix[t] || t.slice(0, 3).toUpperCase();
    if (!p) return "";
    S.counters[p] = (S.counters[p] || 0) + 1;
    if (t.startsWith("stalp_")) return `${p}/${S.counters[p]}`;
    return `${p}${S.counters[p]}`;
  }
  function isConnectionActive(el, term) {
    if (!el || !term || !el.fuses) return true;
    const { terms } = sym(el);
    const idx = terms.findIndex((t) => Math.abs(t.cx - term.cx) < 1 && Math.abs(t.cy - term.cy) < 1);
    if (idx === -1) return true;
    if (el.type.startsWith("firida_")) return el.fuses[idx] !== false;
    if (el.type === "ptab_1t") {
      if (idx >= 2 && idx <= 9) return el.fuses[idx] !== false;
    }
    if (el.type === "ptab_2t") {
      if (idx >= 2 && idx <= 9) return el.fuses[idx] !== false;
      if (idx >= 10 && idx <= 17) return el.fuses[12 + (idx - 10)] !== false;
    }
    return true;
  }
  function sym(el) {
    const c = el.color || "#555";
    const bg = el.fillColor || "none";
    let inner = "", terms = [];
    function fuse(lx, cy, fw, fh, fuseState) {
      const rx = lx, ry = cy - fh / 2, cx = rx + fw / 2, c_y = ry + fh / 2;
      let html = `<rect x="${rx}" y="${ry}" width="${fw}" height="${fh}" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      if (fuseState !== false) html += `<line x1="${cx}" y1="${ry + 4}" x2="${cx}" y2="${ry + fh - 4}" stroke="${c}" stroke-width="2"/>`;
      else html += `<line x1="${rx + 4}" y1="${c_y}" x2="${rx + fw - 4}" y2="${c_y}" stroke="#ff3d71" stroke-width="2"/>`;
      return html;
    }
    function td(lcx, lcy) {
      terms.push({ cx: lcx, cy: lcy });
      return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
    }
    switch (el.type) {
      case "ptab_1t": {
        const BW = 380, BH = 400;
        const f = el.fuses || new Array(10).fill(true);
        const t1 = el.trText || { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
        inner = `<rect class="sel-r" x="${-BW / 2}" y="${-BH / 2}" width="${BW}" height="${BH}" fill="transparent" stroke="transparent"/><line x1="-160" y1="-170" x2="160" y2="-170" stroke="${c}" stroke-width="4"/><text x="0" y="-178" text-anchor="middle" font-size="12" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BAR\u0102 20kV</text><circle class="td" data-lcx="-160" data-lcy="-170" data-circuit="0" cx="-160" cy="-170" r="8" stroke="transparent" fill="transparent"/><circle class="td" data-lcx="160" data-lcy="-170" data-circuit="0" cx="160" cy="-170" r="8" stroke="transparent" fill="transparent"/>`;
        terms.push({ cx: -160, cy: -170, circuit: 0 }, { cx: 160, cy: -170, circuit: 0 });
        const tx1 = 0;
        inner += `<line x1="${tx1}" y1="-170" x2="${tx1}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -144, 12, 12, f[0]) + `<text x="${tx1 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.mv}</text><rect x="${tx1 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx1}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx1},-105 ${tx1 - 5},-90 ${tx1 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx1},-70 v8 M${tx1},-70 l-6,-6 M${tx1},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx1 + 35}" y="-95" font-size="8" fill="${c}">${t1.type}</text><text x="${tx1 + 35}" y="-85" font-size="8" fill="${c}">${t1.power}</text><text x="${tx1 + 35}" y="-75" font-size="8" fill="${c}">${t1.volt}</text><line x1="${tx1}" y1="-45" x2="${tx1}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -6, 12, 18, f[1]) + `<text x="${tx1 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.lv}</text><circle cx="${tx1}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx1 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx1 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx1 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="-170" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx1}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T.</text><line x1="-160" y1="40" x2="160" y2="40" stroke="${c}" stroke-width="4"/><text x="-160" y="36" text-anchor="start" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
        const outX1 = [-112, -80, -48, -16, 16, 48, 80, 112];
        outX1.forEach((tx, i) => {
          inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[2 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 1}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
          terms.push({ cx: tx, cy: 160, circuit: i + 1 });
        });
        break;
      }
      case "ptab_2t": {
        const BW = 780, BH = 400;
        const f = el.fuses || new Array(21).fill(true);
        const t1 = el.trText1 || { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
        const t2 = el.trText2 || { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
        const cpText = el.cpText || "In=160A";
        inner = `<rect class="sel-r" x="${-BW / 2}" y="${-BH / 2}" width="${BW}" height="${BH}" fill="transparent" stroke="transparent"/><line x1="-370" y1="-170" x2="370" y2="-170" stroke="${c}" stroke-width="4"/><text x="0" y="-178" text-anchor="middle" font-size="12" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BAR\u0102 20kV</text><circle class="td" data-lcx="-370" data-lcy="-170" data-circuit="0" cx="-370" cy="-170" r="8" stroke="transparent" fill="transparent"/><circle class="td" data-lcx="370" data-lcy="-170" data-circuit="0" cx="370" cy="-170" r="8" stroke="transparent" fill="transparent"/>`;
        terms.push({ cx: -370, cy: -170, circuit: 0 }, { cx: 370, cy: -170, circuit: 0 });
        const tx1 = -200;
        inner += `<line x1="${tx1}" y1="-170" x2="${tx1}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -144, 12, 12, f[0]) + `<text x="${tx1 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.mv}</text><rect x="${tx1 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx1}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx1},-105 ${tx1 - 5},-90 ${tx1 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx1},-70 v8 M${tx1},-70 l-6,-6 M${tx1},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx1}" y="-120" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TRAFO 1</text><text x="${tx1 + 35}" y="-95" font-size="8" fill="${c}">${t1.type}</text><text x="${tx1 + 35}" y="-85" font-size="8" fill="${c}">${t1.power}</text><text x="${tx1 + 35}" y="-75" font-size="8" fill="${c}">${t1.volt}</text><line x1="${tx1}" y1="-45" x2="${tx1}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx1 - 6, -6, 12, 18, f[1]) + `<text x="${tx1 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.lv}</text><circle cx="${tx1}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx1}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx1 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx1 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx1 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="-370" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx1}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T. 1</text><line x1="-360" y1="40" x2="-40" y2="40" stroke="${c}" stroke-width="4"/><text x="-360" y="36" text-anchor="start" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
        const outX1 = [-312, -280, -248, -216, -184, -152, -120, -88];
        outX1.forEach((tx, i) => {
          inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[2 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 1}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
          terms.push({ cx: tx, cy: 160, circuit: i + 1 });
        });
        inner += `<line x1="-80" y1="40" x2="-80" y2="110" stroke="${c}" stroke-width="2"/><line x1="-80" y1="110" x2="0" y2="110" stroke="${c}" stroke-width="2"/>`;
        const tx2 = 200;
        inner += `<line x1="${tx2}" y1="-170" x2="${tx2}" y2="-120" stroke="${c}" stroke-width="2"/>` + fuse(tx2 - 6, -144, 12, 12, f[10]) + `<text x="${tx2 - 12}" y="-142" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t2.mv}</text><rect x="${tx2 - 30}" y="-115" width="60" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,4"/><circle cx="${tx2}" cy="-95" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="-70" r="18" fill="${bg}" stroke="${c}" stroke-width="2"/><polygon points="${tx2},-105 ${tx2 - 5},-90 ${tx2 + 5},-90" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${tx2},-70 v8 M${tx2},-70 l-6,-6 M${tx2},-70 l6,-6" fill="none" stroke="${c}" stroke-width="1.2"/><text x="${tx2}" y="-120" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TRAFO 2</text><text x="${tx2 + 35}" y="-95" font-size="8" fill="${c}">${t2.type}</text><text x="${tx2 + 35}" y="-85" font-size="8" fill="${c}">${t2.power}</text><text x="${tx2 + 35}" y="-75" font-size="8" fill="${c}">${t2.volt}</text><line x1="${tx2}" y1="-45" x2="${tx2}" y2="30" stroke="${c}" stroke-width="2"/>` + fuse(tx2 - 6, -6, 12, 18, f[11]) + `<text x="${tx2 - 12}" y="-5" text-anchor="end" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t2.lv}</text><circle cx="${tx2}" cy="10" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="18" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="${tx2}" cy="26" r="5" fill="${bg}" stroke="${c}" stroke-width="2"/><rect x="${tx2 + 15}" y="8" width="20" height="24" fill="none" stroke="${c}" stroke-width="1"/><text x="${tx2 + 25}" y="16" text-anchor="middle" font-size="6" fill="${c}">kWh</text><text x="${tx2 + 25}" y="26" text-anchor="middle" font-size="6" fill="${c}">kvarh</text><rect x="40" y="-20" width="340" height="190" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6,4"/><text x="${tx2}" y="-25" text-anchor="middle" font-size="10" fill="${c}" font-weight="bold">TD J.T. 2</text><line x1="40" y1="40" x2="360" y2="40" stroke="${c}" stroke-width="4"/><text x="360" y="36" text-anchor="end" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
        const outX2 = [88, 120, 152, 184, 216, 248, 280, 312];
        outX2.forEach((tx, i) => {
          inner += `<line x1="${tx}" y1="40" x2="${tx}" y2="70" stroke="${c}" stroke-width="2"/>` + fuse(tx - 5, 79, 10, 18, f[12 + i]) + `<line x1="${tx}" y1="88" x2="${tx}" y2="160" stroke="${c}" stroke-width="2"/><circle class="td" data-lcx="${tx}" data-lcy="160" data-circuit="${i + 9}" cx="${tx}" cy="160" r="8" stroke="transparent" fill="transparent"/><text x="${tx - 4}" y="140" transform="rotate(-90 ${tx - 4} 140)" font-size="8" fill="${c}">C${i + 1}</text>`;
          terms.push({ cx: tx, cy: 160, circuit: i + 9 });
        });
        inner += `<line x1="80" y1="40" x2="80" y2="110" stroke="${c}" stroke-width="2"/><line x1="80" y1="110" x2="0" y2="110" stroke="${c}" stroke-width="2"/>` + fuse(-8, 110, 16, 20, f[20]) + `<text x="0" y="135" text-anchor="middle" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace">${el.cpText || "In=160A"}</text>`;
        break;
      }
      case "rect": {
        const w = el.width || 100, h = el.height || 100, dash = el.lineType === "dashed" ? 'stroke-dasharray="10,5"' : "", sw = el.strokeWidth || 2;
        inner = `<rect class="sel-r" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="transparent" stroke="transparent" stroke-width="15"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${bg}" stroke="${c}" stroke-width="${sw}" ${dash} />`;
        break;
      }
      case "circle": {
        const r = el.r || 50, dash = el.lineType === "dashed" ? 'stroke-dasharray="10,5"' : "", sw = el.strokeWidth || 2;
        inner = `<circle class="sel-r" cx="0" cy="0" r="${r}" fill="transparent" stroke="transparent" stroke-width="15"/><circle cx="0" cy="0" r="${r}" fill="${bg}" stroke="${c}" stroke-width="${sw}" ${dash} />`;
        break;
      }
      case "trafo": {
        const t1 = el.trText || { mv: "16A", type: "PT Aerian", power: "160kVA", volt: "20/0.4kV", lv: "250A" };
        inner = `<rect class="sel-r" x="-55" y="-35" width="110" height="100" fill="none" stroke="transparent"/><circle cx="-15" cy="0" r="30" fill="${bg}" stroke="${c}" stroke-width="2"/><circle cx="15" cy="0" r="30" fill="${bg}" stroke="${c}" stroke-width="2"/><text x="0" y="44" text-anchor="middle" font-size="10" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${t1.power}</text><text x="0" y="54" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${t1.type}</text>`;
        inner += td(-45, 0) + td(45, 0);
        break;
      }
      case "firida_e2_4": {
        let tdinv = function(lcx, lcy) {
          terms.push({ cx: lcx, cy: lcy });
          return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
        };
        const BW = 140, BH = 180, BX = -70, BY = -90, FW = 14, FH = 32, fuses = el.fuses || new Array(6).fill(true);
        inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="18" x2="${BX + BW}" y2="18" stroke="${c}" stroke-width="3"/>`;
        [-40, 40].forEach((tx, i) => {
          const fuseTop = BY + 10, fuseBot = fuseTop + FH;
          inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="18" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY);
        });
        [-52, -18, 18, 52].forEach((tx, i) => {
          const fuseTop = 28, fuseBot = fuseTop + FH;
          inner += `<line x1="${tx}" y1="18" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i + 2]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH}" stroke="${c}" stroke-width="2"/>` + tdinv(tx, BY + BH);
        });
        break;
      }
      case "firida_e3_4": {
        let tdinv2 = function(lcx, lcy) {
          terms.push({ cx: lcx, cy: lcy });
          return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
        };
        const BW = 180, BH = 180, BX = -90, BY = -90, FW = 14, FH = 32, fuses = el.fuses || new Array(7).fill(true);
        inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="18" x2="${BX + BW}" y2="18" stroke="${c}" stroke-width="3"/>`;
        [-50, 0, 50].forEach((tx, i) => {
          const fuseTop = BY + 10, fuseBot = fuseTop + FH;
          inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="18" stroke="${c}" stroke-width="2"/>` + tdinv2(tx, BY);
        });
        [-65, -22, 22, 65].forEach((tx, i) => {
          const fuseTop = 28, fuseBot = fuseTop + FH;
          inner += `<line x1="${tx}" y1="18" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i + 3]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH}" stroke="${c}" stroke-width="2"/>` + tdinv2(tx, BY + BH);
        });
        break;
      }
      case "firida_e3_0": {
        let tdinv3 = function(lcx, lcy) {
          terms.push({ cx: lcx, cy: lcy });
          return `<circle class="td" data-lcx="${lcx}" data-lcy="${lcy}" cx="${lcx}" cy="${lcy}" r="8" stroke="transparent" fill="transparent"/>`;
        };
        const BW = 180, BH = 95, BX = -90, BY = -47.5, FW = 14, FH = 32, fuses = el.fuses || new Array(3).fill(true);
        inner = `<rect class="sel-r" x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="${BX}" y1="${BY + BH - 10}" x2="${BX + BW}" y2="${BY + BH - 10}" stroke="${c}" stroke-width="3"/>`;
        [-50, 0, 50].forEach((tx, i) => {
          const fuseTop = BY + 10, fuseBot = fuseTop + FH;
          inner += `<line x1="${tx}" y1="${BY}" x2="${tx}" y2="${fuseTop}" stroke="${c}" stroke-width="2"/>` + fuse(tx - FW / 2, fuseTop + FH / 2, FW, FH, fuses[i]) + `<line x1="${tx}" y1="${fuseBot}" x2="${tx}" y2="${BY + BH - 10}" stroke="${c}" stroke-width="2"/>` + tdinv3(tx, BY);
        });
        break;
      }
      case "cd4":
      case "cd5":
      case "cd8": {
        const np = parseInt(el.type.replace("cd", "")), ROW_H = 36, BH = np * ROW_H + 28, BW = 140, LX = -BW / 2, BAR_X = LX + 30, BY2 = -BH / 2, FW = 24, FH = 16;
        const f = el.fuses || new Array(np + 1).fill(true);
        inner = `<rect class="sel-r" x="${LX}" y="${BY2}" width="${BW}" height="${BH}" fill="${bg}" stroke="${c}" stroke-width="2"/>
<line x1="${BAR_X}" y1="${BY2}" x2="${BAR_X}" y2="${BY2 + BH}" stroke="${c}" stroke-width="2.5"/>`;
        const inputY = 0;
        inner += `<line x1="${LX}" y1="${inputY}" x2="${BAR_X - FW}" y2="${inputY}" stroke="${c}" stroke-width="2"/>` + fuse(BAR_X - FW, inputY, FW, FH, f[0] !== false) + `<circle class="td" data-lcx="${LX}" data-lcy="${inputY}" data-circuit="0" cx="${LX}" cy="${inputY}" r="7" stroke="transparent" fill="transparent"/>`;
        terms.push({ cx: LX, cy: inputY });
        for (let i = 0; i < np; i++) {
          const yp = BY2 + 16 + ROW_H * i + ROW_H / 2, cn2 = i + 1;
          const fuseOn = f[cn2] !== false;
          const fuseColor = fuseOn ? c : "#ef4444";
          inner += `<line x1="${BAR_X}" y1="${yp}" x2="${BAR_X + 18}" y2="${yp}" stroke="${c}" stroke-width="2"/>` + fuse(BAR_X + 18, yp, FW, FH, fuseOn) + `<line x1="${BAR_X + 18 + FW}" y1="${yp}" x2="${LX + BW}" y2="${yp}" stroke="${fuseColor}" stroke-width="2" stroke-dasharray="${fuseOn ? "none" : "6,3"}"/><text x="${LX + BW - 6}" y="${yp + 11}" text-anchor="end" font-size="8" fill="${fuseColor}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none">C${cn2}</text><circle class="td" data-lcx="${LX + BW}" data-lcy="${yp}" data-circuit="${cn2}" cx="${LX + BW}" cy="${yp}" r="7" stroke="transparent" fill="transparent"/>`;
          terms.push({ cx: LX + BW, cy: yp, circuit: cn2 });
        }
        break;
      }
      case "meter":
        inner = `<rect class="sel-r" x="-35" y="-48" width="70" height="96" fill="${bg}" stroke="${c}" stroke-width="2" rx="1"/><text x="0" y="5" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700" class="bmpt-txt">${el.bmptText || ""}</text>` + td(0, -48) + td(0, 48);
        break;
      case "stalp_se4":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_se10":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="-22" x2="22" y2="22" stroke="${c}" stroke-width="2"/><line x1="22" y1="-22" x2="-22" y2="22" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_cs":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="-22" x2="22" y2="22" stroke="${c}" stroke-width="2"/><line x1="22" y1="-22" x2="-22" y2="22" stroke="${c}" stroke-width="2"/><rect x="22" y="-12" width="18" height="24" fill="${bg !== "none" ? bg : "#243755"}" stroke="#ff9f43" stroke-width="2" rx="2"/><text x="31" y="3.5" text-anchor="middle" font-size="9" font-family="Barlow Condensed,sans-serif" fill="#ff9f43" font-weight="700">CS</text>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(40, -13) + td(40, 0) + td(40, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_sc10002":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_sc10005":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-12" y1="-12" x2="12" y2="12" stroke="${c}" stroke-width="2"/><line x1="12" y1="-12" x2="-12" y2="12" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_rotund":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_rotund_special":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><line x1="-16" y1="-16" x2="16" y2="16" stroke="${c}" stroke-width="2"/><line x1="16" y1="-16" x2="-16" y2="16" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      // ── Stâlpi MT — SC centrifugați (cerc dublu)
      case "stalp_mt_sc10001":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><circle cx="0" cy="0" r="13" fill="none" stroke="${c}" stroke-width="1.5"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_sc15006":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><circle cx="0" cy="0" r="13" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_sc15007":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><circle cx="0" cy="0" r="13" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_sc15014":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><circle cx="0" cy="0" r="13" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_sc15015":
        inner = `<circle class="sel-r" cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2.5"/><circle cx="0" cy="0" r="13" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      // ── Stâlpi MT — SE vibro-precomprimați (pătrat dublu)
      case "stalp_mt_se4t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se5t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se6t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se7t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se8t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se9t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se10t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "stalp_mt_se11t":
        inner = `<rect class="sel-r" x="-22" y="-22" width="44" height="44" fill="${bg}" stroke="${c}" stroke-width="2.5"/><rect x="-13" y="-13" width="26" height="26" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="${c}" stroke-width="2"/><line x1="9" y1="-9" x2="-9" y2="9" stroke="${c}" stroke-width="2"/><line x1="-9" y1="0" x2="9" y2="0" stroke="${c}" stroke-width="2"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${c}" stroke-width="2"/>` + td(-22, -13) + td(-22, 0) + td(-22, 13) + td(22, -13) + td(22, 0) + td(22, 13) + td(-13, -22) + td(0, -22) + td(13, -22) + td(-13, 22) + td(0, 22) + td(13, 22);
        break;
      case "priza_pamant":
        if (bg !== "none") inner += `<rect x="-25" y="-32" width="50" height="58" fill="${bg}" stroke="none" rx="4"/>`;
        inner += `<rect class="sel-r" x="-25" y="-32" width="50" height="58" fill="none" stroke="transparent"/><line x1="0" y1="-32" x2="0" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="-22" y1="0" x2="22" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="-15" y1="8" x2="15" y2="8" stroke="${c}" stroke-width="2"/><line x1="-8" y1="16" x2="8" y2="16" stroke="${c}" stroke-width="1.5"/>` + td(0, -32);
        break;
      case "separator_mt":
        inner = `<rect class="sel-r" x="-54" y="-26" width="108" height="52" fill="none" stroke="transparent"/><line x1="-54" y1="0" x2="-22" y2="0" stroke="${c}" stroke-width="2"/><line x1="22" y1="0" x2="54" y2="0" stroke="${c}" stroke-width="2"/><circle cx="0" cy="0" r="22" fill="${bg}" stroke="${c}" stroke-width="2"/><line x1="-22" y1="0" x2="22" y2="0" stroke="${c}" stroke-width="1.8"/><line x1="-10" y1="-18" x2="10" y2="18" stroke="${c}" stroke-width="2.2"/>` + td(-54, 0) + td(54, 0);
        break;
      case "separator":
        inner = `<rect class="sel-r" x="-52" y="-24" width="104" height="48" fill="${bg !== "none" ? bg : "none"}" stroke="transparent" rx="6"/><circle cx="-36" cy="0" r="6" fill="none" stroke="${c}" stroke-width="2"/><circle cx="36" cy="0" r="6" fill="none" stroke="${c}" stroke-width="2"/><line x1="-30" y1="0" x2="26" y2="-16" stroke="${c}" stroke-width="2"/>` + td(-52, 0) + td(52, 0);
        break;
      case "manson":
        inner = `<polygon class="sel-r" points="0,-22 22,0 0,22 -22,0" fill="${bg !== "none" ? bg : c}" stroke="${c}" stroke-width="1.5"/><line x1="-38" y1="0" x2="-22" y2="0" stroke="${c}" stroke-width="2.5"/><line x1="22" y1="0" x2="38" y2="0" stroke="${c}" stroke-width="2.5"/>` + td(-38, 0) + td(38, 0);
        break;
      case "ptab_mono": {
        const celule = el.celule || [];
        const CW2 = 72, CH = 240, BAR_Y = -120;
        const nC = celule.length, totalW = nC * CW2, startX = -totalW / 2;
        inner = `<rect class="sel-r" x="${startX - 6}" y="${BAR_Y - 22}" width="${totalW + 12}" height="${CH + 28}" fill="transparent" stroke="transparent"/>`;
        inner += `<rect x="${startX}" y="${BAR_Y - 5}" width="${totalW}" height="10" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/>`;
        inner += `<text x="0" y="${BAR_Y - 14}" text-anchor="middle" font-size="10" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">BAR\u0102 20kV</text>`;
        inner += `<line x1="${startX - 20}" y1="${BAR_Y}" x2="${startX}" y2="${BAR_Y}" stroke="${c}" stroke-width="2.5"/>` + td(startX - 20, BAR_Y);
        inner += `<line x1="${startX + totalW}" y1="${BAR_Y}" x2="${startX + totalW + 20}" y2="${BAR_Y}" stroke="${c}" stroke-width="2.5"/>` + td(startX + totalW + 20, BAR_Y);
        celule.forEach((cel, i) => {
          const cx2 = startX + i * CW2 + CW2 / 2;
          const isT = cel.tip === "T";
          const stare = cel.stare !== false;
          const dc = stare ? "#22c55e" : "#ef4444";
          inner += `<rect x="${startX + i * CW2}" y="${BAR_Y}" width="${CW2}" height="${CH}" fill="${el.fillColor || "none"}" stroke="${c}" stroke-width="1.2" rx="1"/>`;
          inner += `<line x1="${cx2}" y1="${BAR_Y}" x2="${cx2}" y2="${BAR_Y + 20}" stroke="${c}" stroke-width="2"/>`;
          const dTop = BAR_Y + 20, dH = 34;
          inner += `<rect x="${cx2 - 12}" y="${dTop}" width="24" height="${dH}" fill="${el.fillColor || "none"}" stroke="${c}" stroke-width="1.6" rx="1"/>`;
          if (stare) inner += `<line x1="${cx2}" y1="${dTop + 5}" x2="${cx2}" y2="${dTop + dH - 5}" stroke="${dc}" stroke-width="2.8"/>`;
          else inner += `<line x1="${cx2 - 6}" y1="${dTop + dH / 2}" x2="${cx2 + 6}" y2="${dTop + dH / 2}" stroke="${dc}" stroke-width="2.8"/>`;
          inner += `<text x="${cx2 + 15}" y="${dTop + dH / 2 + 3}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cel.curent || "16A"}</text>`;
          inner += `<line x1="${cx2}" y1="${dTop + dH}" x2="${cx2}" y2="${BAR_Y + 74}" stroke="${c}" stroke-width="2"/>`;
          const sY2 = BAR_Y + 86;
          inner += `<circle cx="${cx2}" cy="${sY2 - 12}" r="4.5" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="${cx2}" cy="${sY2 + 12}" r="4.5" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="${cx2}" y1="${sY2 - 7}" x2="${cx2}" y2="${sY2 + 7}" stroke="${c}" stroke-width="2.5"/><line x1="${cx2}" y1="${sY2 + 12}" x2="${cx2}" y2="${BAR_Y + 112}" stroke="${c}" stroke-width="2"/>`;
          if (isT) {
            const t1Y = BAR_Y + 136, t2Y = BAR_Y + 158;
            inner += `<circle cx="${cx2}" cy="${t1Y}" r="20" fill="${el.fillColor || "none"}" stroke="${c}" stroke-width="1.8"/><circle cx="${cx2}" cy="${t2Y}" r="20" fill="${el.fillColor || "none"}" stroke="${c}" stroke-width="1.8"/>`;
            inner += `<text x="${cx2}" y="${t1Y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cel.putere || "100kVA"}</text>`;
            inner += `<text x="${cx2}" y="${BAR_Y + CH - 9}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${cel.label || `T${i + 1}`}</text>`;
            inner += `<text x="${cx2}" y="${BAR_Y + CH - 1}" text-anchor="middle" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cel.volt || "20/0.4kV"}</text>`;
            inner += td(cx2, BAR_Y + CH);
          } else {
            inner += `<line x1="${cx2}" y1="${BAR_Y + 112}" x2="${cx2}" y2="${BAR_Y + CH - 20}" stroke="${c}" stroke-width="2"/><polygon points="${cx2},${BAR_Y + CH - 8} ${cx2 - 8},${BAR_Y + CH - 24} ${cx2 + 8},${BAR_Y + CH - 24}" fill="${c}"/>`;
            inner += `<text x="${cx2}" y="${BAR_Y + CH - 1}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${cel.label || `L${i + 1}`}</text>`;
            inner += td(cx2, BAR_Y + CH);
          }
          inner += td(cx2, dTop + dH / 2);
        });
        break;
      }
      case "bara_mt": {
        const BW2 = 200;
        inner = `<rect class="sel-r" x="${-BW2 / 2 - 10}" y="-20" width="${BW2 + 20}" height="40" fill="none" stroke="transparent"/><rect x="${-BW2 / 2}" y="-4" width="${BW2}" height="8" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/><text x="0" y="-12" text-anchor="middle" font-size="9" fill="${c}" font-family="JetBrains Mono,monospace" font-weight="bold">20kV</text>` + td(-BW2 / 2, 0) + td(0, 0) + td(BW2 / 2, 0);
        break;
      }
      case "celula_linie_mt": {
        const CW3 = 70, CH3 = 220;
        const cData = el.celMT || { tensiune: "20kV", curent: "400A", stare_disj: true, stare_sep: true };
        const disj_on = cData.stare_disj !== false;
        const sep_on = cData.stare_sep !== false;
        inner = `<rect class="sel-r" x="${-CW3 / 2}" y="${-CH3 / 2}" width="${CW3}" height="${CH3}" fill="none" stroke="transparent"/><rect x="${-CW3 / 2}" y="${-CH3 / 2}" width="${CW3}" height="${CH3}" fill="${bg}" stroke="${c}" stroke-width="1.5" rx="2"/>`;
        inner += `<line x1="0" y1="${-CH3 / 2}" x2="0" y2="${CH3 / 2}" stroke="${c}" stroke-width="1.5" opacity="0.15"/>`;
        const dY2 = -65;
        inner += `<line x1="0" y1="${-CH3 / 2}" x2="0" y2="${dY2 - 18}" stroke="${c}" stroke-width="2"/><rect x="-14" y="${dY2 - 18}" width="28" height="36" fill="${bg}" stroke="${c}" stroke-width="1.8" rx="1"/>`;
        const dColor2 = disj_on ? "#22c55e" : "#ef4444";
        if (disj_on) inner += `<line x1="0" y1="${dY2 - 12}" x2="0" y2="${dY2 + 12}" stroke="${dColor2}" stroke-width="3"/>`;
        else inner += `<line x1="-6" y1="${dY2}" x2="6" y2="${dY2}" stroke="${dColor2}" stroke-width="3"/>`;
        inner += `<text x="17" y="${dY2 + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData.curent || "400A"}</text>`;
        const sY3 = 20;
        inner += `<line x1="0" y1="${dY2 + 18}" x2="0" y2="${sY3 - 14}" stroke="${c}" stroke-width="2"/><circle cx="0" cy="${sY3 - 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="0" cy="${sY3 + 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`;
        const sColor2 = sep_on ? c : "#ef4444";
        if (sep_on) inner += `<line x1="0" y1="${sY3 - 11}" x2="0" y2="${sY3 + 11}" stroke="${sColor2}" stroke-width="2.5"/>`;
        else inner += `<line x1="0" y1="${sY3 - 11}" x2="8" y2="${sY3 + 4}" stroke="${sColor2}" stroke-width="2.5"/>`;
        const fY2 = 65;
        inner += `<line x1="0" y1="${sY3 + 14}" x2="0" y2="${fY2 - 10}" stroke="${c}" stroke-width="2"/><rect x="-10" y="${fY2 - 10}" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5" rx="1"/><line x1="-6" y1="${fY2}" x2="6" y2="${fY2}" stroke="#22c55e" stroke-width="2.5"/><circle cx="-8" cy="${fY2}" r="3" fill="#22c55e" stroke="none"/><text x="14" y="${fY2 + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">HRC</text>`;
        inner += `<line x1="0" y1="${fY2 + 10}" x2="0" y2="${CH3 / 2}" stroke="${c}" stroke-width="2"/><polygon points="0,${CH3 / 2} -5,${CH3 / 2 - 10} 5,${CH3 / 2 - 10}" fill="${c}"/>`;
        inner += `<text x="0" y="${-CH3 / 2 - 6}" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cData.tensiune || "20kV"}</text>`;
        inner += td(0, -CH3 / 2) + td(0, CH3 / 2) + td(-CW3 / 2, dY2) + td(CW3 / 2, dY2);
        break;
      }
      case "celula_trafo_mt": {
        const CW4 = 80, CH4 = 280;
        const cData2 = el.celMT || { tensiune: "20kV", curent: "16A", putere: "100kVA", volt: "20/0.4kV", stare_disj: true };
        const disj_on2 = cData2.stare_disj !== false;
        inner = `<rect class="sel-r" x="${-CW4 / 2}" y="${-CH4 / 2}" width="${CW4}" height="${CH4}" fill="none" stroke="transparent"/><rect x="${-CW4 / 2}" y="${-CH4 / 2}" width="${CW4}" height="${CH4}" fill="${bg}" stroke="${c}" stroke-width="1.5" rx="2"/>`;
        const dY3 = -90;
        inner += `<line x1="0" y1="${-CH4 / 2}" x2="0" y2="${dY3 - 18}" stroke="${c}" stroke-width="2"/><rect x="-14" y="${dY3 - 18}" width="28" height="36" fill="${bg}" stroke="${c}" stroke-width="1.8" rx="1"/>`;
        const dColor3 = disj_on2 ? "#22c55e" : "#ef4444";
        if (disj_on2) inner += `<line x1="0" y1="${dY3 - 12}" x2="0" y2="${dY3 + 12}" stroke="${dColor3}" stroke-width="3"/>`;
        else inner += `<line x1="-6" y1="${dY3}" x2="6" y2="${dY3}" stroke="${dColor3}" stroke-width="3"/>`;
        inner += `<text x="17" y="${dY3 + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData2.curent || "16A"}</text>`;
        const sY4 = -20;
        inner += `<line x1="0" y1="${dY3 + 18}" x2="0" y2="${sY4 - 14}" stroke="${c}" stroke-width="2"/><circle cx="0" cy="${sY4 - 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="0" cy="${sY4 + 14}" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="0" y1="${sY4 - 11}" x2="0" y2="${sY4 + 11}" stroke="${c}" stroke-width="2.5"/>`;
        const fY3 = 30;
        inner += `<line x1="0" y1="${sY4 + 14}" x2="0" y2="${fY3 - 10}" stroke="${c}" stroke-width="2"/><rect x="-10" y="${fY3 - 10}" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5" rx="1"/><line x1="-6" y1="${fY3}" x2="6" y2="${fY3}" stroke="#22c55e" stroke-width="2.5"/><circle cx="-8" cy="${fY3}" r="3" fill="#22c55e" stroke="none"/><text x="14" y="${fY3 + 4}" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">HRC</text>`;
        const tY2 = 95;
        inner += `<line x1="0" y1="${fY3 + 10}" x2="0" y2="${tY2 - 35}" stroke="${c}" stroke-width="2"/><circle cx="0" cy="${tY2 - 22}" r="16" fill="${bg}" stroke="${c}" stroke-width="1.8"/><circle cx="0" cy="${tY2 + 2}" r="16" fill="${bg}" stroke="${c}" stroke-width="1.8"/><circle cx="0" cy="${tY2 + 20}" r="10" fill="${bg}" stroke="${c}" stroke-width="1.5"/>`;
        inner += `<text x="${CW4 / 2 - 2}" y="${tY2 - 20}" text-anchor="end" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData2.putere || "100kVA"}</text><text x="${CW4 / 2 - 2}" y="${tY2 - 10}" text-anchor="end" font-size="7" fill="${c}" font-family="JetBrains Mono,monospace">${cData2.volt || "20/0.4kV"}</text>`;
        inner += `<line x1="0" y1="${tY2 + 30}" x2="0" y2="${CH4 / 2}" stroke="${c}" stroke-width="2"/><polygon points="0,${CH4 / 2} -5,${CH4 / 2 - 10} 5,${CH4 / 2 - 10}" fill="${c}"/><text x="0" y="${CH4 / 2 + 12}" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">0.4kV</text>`;
        inner += `<text x="0" y="${-CH4 / 2 - 6}" text-anchor="middle" font-size="8" fill="${c}" font-family="JetBrains Mono,monospace">${cData2.tensiune || "20kV"}</text>`;
        inner += td(0, -CH4 / 2) + td(0, CH4 / 2) + td(-CW4 / 2, dY3) + td(CW4 / 2, dY3);
        break;
      }
      case "bara_statie_mt": {
        const lung = el.lungime || 200;
        const nrC = el.nrCircuit || "2";
        const numeSt = el.numeStatie || "STA\u021AIE 20kV";
        const HB = lung;
        const BW3 = 8;
        const terminale = el.terminale || [{ pct: 25, label: "" }, { pct: 50, label: "" }, { pct: 75, label: "" }];
        inner = `<rect class="sel-r" x="${-BW3 - 22}" y="${-HB / 2 - 36}" width="${BW3 + 80}" height="${HB + 60}" fill="transparent" stroke="transparent"/>`;
        inner += `<rect x="${-BW3 / 2}" y="${-HB / 2}" width="${BW3}" height="${HB}" fill="${c}" stroke="${c}" stroke-width="1" rx="2"/>`;
        inner += `<polygon points="0,${-HB / 2 - 16} -9,${-HB / 2} 9,${-HB / 2}" fill="${c}"/>`;
        inner += `<text x="${-BW3 / 2 - 7}" y="7" text-anchor="end" font-size="24" font-weight="800" fill="${c}" font-family="Barlow Condensed,sans-serif">${nrC}</text>`;
        inner += `<text x="0" y="${-HB / 2 - 24}" text-anchor="middle" font-size="9" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${numeSt}</text>`;
        terminale.forEach((ter) => {
          const pct2 = Math.max(0, Math.min(100, ter.pct || 0));
          const dy = -HB / 2 + pct2 / 100 * HB;
          inner += `<line x1="${-BW3 / 2 - 4}" y1="${dy}" x2="${BW3 / 2 + 18}" y2="${dy}" stroke="${c}" stroke-width="2.5"/>`;
          inner += `<circle cx="${BW3 / 2 + 18}" cy="${dy}" r="3.5" fill="${c}" stroke="${c}" stroke-width="1"/>`;
          if (ter.label) inner += `<text x="${BW3 / 2 + 24}" y="${dy + 4}" font-size="8" fill="${c}" font-family="Barlow Condensed,sans-serif" font-weight="700">${ter.label}</text>`;
          inner += td(BW3 / 2 + 18, dy);
        });
        const gY = HB / 2 + 10;
        inner += `<line x1="-20" y1="${gY}" x2="20" y2="${gY}" stroke="${c}" stroke-width="3"/><line x1="-13" y1="${gY + 8}" x2="13" y2="${gY + 8}" stroke="${c}" stroke-width="2.2"/><line x1="-6" y1="${gY + 16}" x2="6" y2="${gY + 16}" stroke="${c}" stroke-width="1.5"/>`;
        break;
      }
    }
    return { inner, terms };
  }
  function symW(el) {
    const t = typeof el === "string" ? el : el.type;
    if (t === "ptab_1t") return 380;
    if (t === "ptab_2t") return 780;
    if (t === "rect") return typeof el !== "string" && el.width ? el.width : 100;
    if (t === "circle") return typeof el !== "string" && el.r ? el.r * 2 : 100;
    if (t === "ptab_mono") {
      const n = typeof el !== "string" && el.celule ? el.celule.length : 4;
      return n * 72 + 40;
    }
    if (t === "trafo") return 110;
    if (t === "firida_e2_4") return 140;
    if (t === "firida_e3_4") return 180;
    if (t === "firida_e3_0") return 180;
    if (t.startsWith("cd")) return 130;
    if (t === "meter") return 70;
    if (t === "stalp_cs") return 64;
    if (t.startsWith("stalp_")) return 48;
    if (t === "separator") return 104;
    if (t === "separator_mt") return 108;
    if (t === "manson") return 76;
    if (t === "priza_pamant") return 50;
    if (t === "bara_mt") return 220;
    if (t === "celula_linie_mt") return 70;
    if (t === "celula_trafo_mt") return 80;
    if (t === "bara_statie_mt") return 50;
    return 56;
  }
  function symH(el) {
    const t = typeof el === "string" ? el : el.type;
    if (t === "ptab_1t") return 400;
    if (t === "ptab_2t") return 400;
    if (t === "rect") return typeof el !== "string" && el.height ? el.height : 100;
    if (t === "circle") return typeof el !== "string" && el.r ? el.r * 2 : 100;
    if (t === "ptab_mono") return 262;
    if (t === "trafo") return 100;
    if (t === "firida_e2_4") return 180;
    if (t === "firida_e3_4") return 180;
    if (t === "firida_e3_0") return 95;
    if (t.startsWith("cd")) {
      const n = parseInt(t.replace("cd", ""));
      return n * 34 + 24;
    }
    if (t === "meter") return 96;
    if (t.startsWith("stalp_")) return 48;
    if (t === "separator") return 48;
    if (t === "separator_mt") return 52;
    if (t === "manson") return 44;
    if (t === "priza_pamant") return 64;
    if (t === "bara_mt") return 30;
    if (t === "celula_linie_mt") return 220;
    if (t === "celula_trafo_mt") return 280;
    if (t === "bara_statie_mt") {
      const el2 = typeof el !== "string" ? el : null;
      return (el2 && el2.lungime ? el2.lungime : 200) + 40;
    }
    return 56;
  }
  var init_elements = __esm({
    "src/elements.js"() {
      init_state();
    }
  });

  // src/pole-catalog.js
  function getPoleData(el) {
    if (!el) return { H: null, T_max: null, G_max: null, V_max: null, desc: "?", catH: null, catT: null, consoleDesc: null };
    const cat = POLE_CATALOG[el.type] ?? {};
    const consCat = el.console_type ? CONSOLE_CATALOG[el.console_type] ?? {} : {};
    const consT = consCat.T_max ?? null;
    const consG = consCat.G_max ?? null;
    const consV = consCat.V_max ?? null;
    const poleT = cat.T_max ?? null;
    return {
      H: el.h_prindere_ovr != null ? el.h_prindere_ovr : cat.H ?? null,
      T_max: el.T_max_ovr != null ? el.T_max_ovr : consT ?? poleT,
      G_max: consG,
      V_max: consV,
      desc: cat.desc ?? el.type,
      catH: cat.H ?? null,
      catT: consT ?? poleT,
      consoleDesc: consCat.desc ?? null
    };
  }
  var POLE_CATALOG, CONSOLE_CATALOG;
  var init_pole_catalog = __esm({
    "src/pole-catalog.js"() {
      POLE_CATALOG = {
        // ── Stâlpi circulari centrifugați (SC) ──────────────────────────────────
        stalp_mt_sc10001: { desc: "SC 10/1 \u2014 intermediar N", H: 8.5, T_max: null },
        stalp_mt_sc15006: { desc: "SC 10/6 \u2014 ancoraj u\u0219or", H: 8.5, T_max: null },
        stalp_mt_sc15007: { desc: "SC 10/7 \u2014 ancoraj", H: 8.5, T_max: null },
        stalp_mt_sc15014: { desc: "SC 12/14 \u2014 ancoraj", H: 10.5, T_max: null },
        stalp_mt_sc15015: { desc: "SC 12/15 \u2014 ancoraj \xEEnalt", H: 10.5, T_max: null },
        // ── Stâlpi vibroprecomprimați (SE) ──────────────────────────────────────
        stalp_mt_se4t: { desc: "SE 4T", H: 7.5, T_max: null },
        stalp_mt_se5t: { desc: "SE 5T", H: 8, T_max: null },
        stalp_mt_se6t: { desc: "SE 6T", H: 8.5, T_max: null },
        stalp_mt_se7t: { desc: "SE 7T", H: 9, T_max: null },
        stalp_mt_se8t: { desc: "SE 8T", H: 9.5, T_max: null },
        stalp_mt_se9t: { desc: "SE 9T", H: 10, T_max: null },
        stalp_mt_se10t: { desc: "SE 10T", H: 10.5, T_max: null },
        stalp_mt_se11t: { desc: "SE 11T", H: 11, T_max: null }
      };
      CONSOLE_CATALOG = {
        // ── CSO 1100 — consolă de susținere orizontală 1100 mm ───────────────────
        cso_1100_v1: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL37 v1 \u2014 L63\xD763\xD76", G_max: 440, V_max: 240, T_max: 163 },
        cso_1100_v2: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL37 v2 \u2014 L60\xD760\xD76", G_max: 440, V_max: 240, T_max: 142 },
        cso_1100_v3: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL37 v3 \u2014 L60 SR EN", G_max: 440, V_max: 240, T_max: 140 },
        cso_1100_v4: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL37 v4 \u2014 L70\xD770\xD77", G_max: 440, V_max: 240, T_max: 220 },
        cso_1100_v5: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL52 v5 \u2014 L60\xD760\xD76", G_max: 440, V_max: 240, T_max: 198 },
        cso_1100_v6: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 / OL52 v6 \u2014 asimetric", G_max: 440, V_max: 240, T_max: 114 },
        cso_1100: { group: "CSO 1100 \u2014 sus\u021Binere S.C.", desc: "CSO 1100 (ST34-MT 2026) \u2014 L60\xD760\xD76 S335", G_max: 440, V_max: 240, T_max: 198 },
        // ── CSO 1385 — consolă de susținere orizontală 1385 mm ───────────────────
        cso_1385_v1: { group: "CSO 1385 \u2014 sus\u021Binere S.C.", desc: "CSO 1385 / OL37 v1 \u2014 L70/L60", G_max: 460, V_max: 240, T_max: 138 },
        cso_1385_v2: { group: "CSO 1385 \u2014 sus\u021Binere S.C.", desc: "CSO 1385 / OL37 v2 \u2014 L70/L60", G_max: 460, V_max: 240, T_max: 143 },
        cso_1385_v3: { group: "CSO 1385 \u2014 sus\u021Binere S.C.", desc: "CSO 1385 / OL52 v3 \u2014 L70/L60", G_max: 460, V_max: 240, T_max: 198 },
        cso_1385: { group: "CSO 1385 \u2014 sus\u021Binere S.C.", desc: "CSO 1385 (ST34-MT 2026) \u2014 L70/L60 S335", G_max: 460, V_max: 240, T_max: 198 },
        // ── CIE — consolă izolație elastică susținere ────────────────────────────
        cie_v1: { group: "CIE \u2014 izol. elastic\u0103 sus\u021B.", desc: "CIE / OL37 v1 \u2014 L70/L70 (min.)", G_max: 400, V_max: 155, T_max: 86 },
        cie_v23: { group: "CIE \u2014 izol. elastic\u0103 sus\u021B.", desc: "CIE / OL37 v2-3 \u2014 cu L80\xD780\xD78", G_max: 400, V_max: 155, T_max: 129 },
        cie_v45: { group: "CIE \u2014 izol. elastic\u0103 sus\u021B.", desc: "CIE / OL37 v4-5 \u2014 STAS 7836", G_max: 400, V_max: 155, T_max: 118 },
        cie_v67: { group: "CIE \u2014 izol. elastic\u0103 sus\u021B.", desc: "CIE / OL52 v6-7", G_max: 400, V_max: 155, T_max: 123 },
        cie_150: { group: "CIE \u2014 izol. elastic\u0103 sus\u021B.", desc: "CIE 150 (ST34-MT 2026) \u2014 L70\xD770\xD77 S335", G_max: 400, V_max: 155, T_max: 123 },
        // ── CDS / CDzS — consolă dezaxată susținere ──────────────────────────────
        cds_ol37: { group: "CDS \u2014 dezaxat\u0103 sus\u021Binere", desc: "CDS / OL37", G_max: 320, V_max: 180, T_max: 70 },
        cds_ol52: { group: "CDS \u2014 dezaxat\u0103 sus\u021Binere", desc: "CDS / OL52", G_max: 320, V_max: 180, T_max: 100 },
        cdzs: { group: "CDzS \u2014 dezaxat\u0103 sus\u021Binere", desc: "CDzS (ST34-MT 2026)", G_max: 320, V_max: 180, T_max: 100 },
        // ── CDV 550 — consolă de derivație ───────────────────────────────────────
        cdv_550: { group: "CDV 550 \u2014 deriva\u021Bie", desc: "CDV 550", G_max: 150, V_max: 100, T_max: 150 },
        // ── CIT 140 — consolă de întindere și terminală ───────────────────────────
        cit_140: { group: "CIT 140 \u2014 \xEEntindere/term.", desc: "CIT 140", G_max: 330, V_max: 350, T_max: 1500 },
        // ── CDI / CDzI — consolă dezaxată de întindere ───────────────────────────
        cdi_ol37: { group: "CDI \u2014 dezaxat\u0103 \xEEntindere", desc: "CDI / OL37", G_max: 250, V_max: 150, T_max: 800 },
        cdzi: { group: "CDzI \u2014 dezaxat\u0103 \xEEntindere", desc: "CDzI (ST34-MT 2026)", G_max: 250, V_max: 150, T_max: 800 },
        // ── CSS / CSI — consolă orizontală dublu circuit susținere ───────────────
        css: { group: "CSS/CSI \u2014 d.c. sus\u021Binere", desc: "CSS \u2014 d.c. sus\u021B. superioar\u0103", G_max: 400, V_max: 250, T_max: 350 },
        csi: { group: "CSS/CSI \u2014 d.c. sus\u021Binere", desc: "CSI \u2014 d.c. sus\u021B. inferioar\u0103", G_max: 400, V_max: 250, T_max: 145 },
        // ── CDCS "Păianjen" — consolă d.c. susținere izolație elastică ───────────
        cdcs_v1: { group: 'CDCS "P\u0103ianjen" \u2014 d.c. sus\u021B. el.', desc: "CDCS v1 \u2014 U10", G_max: 200, V_max: 200, T_max: 116 },
        cdcs_v2: { group: 'CDCS "P\u0103ianjen" \u2014 d.c. sus\u021B. el.', desc: "CDCS v2 \u2014 U8", G_max: 200, V_max: 200, T_max: 87 },
        cdcs_v3: { group: 'CDCS "P\u0103ianjen" \u2014 d.c. sus\u021B. el.', desc: "CDCS v3 \u2014 U100\xD750\xD76", G_max: 200, V_max: 200, T_max: 107 },
        cdcs_v4: { group: 'CDCS "P\u0103ianjen" \u2014 d.c. sus\u021B. el.', desc: "CDCS v4 \u2014 U80\xD760\xD75", G_max: 200, V_max: 200, T_max: 119 },
        cdcs: { group: 'CDCS "P\u0103ianjen" \u2014 d.c. sus\u021B. el.', desc: "CDCS (ST34-MT 2026) \u2014 U10", G_max: 200, V_max: 200, T_max: 116 },
        // ── CIS/CII — consolă orizontală d.c. de întindere ───────────────────────
        cis_cii: { group: "CIS/CII \u2014 d.c. \xEEntindere", desc: "CIS/CII", G_max: 300, V_max: 200, T_max: 1e3 },
        // ── CDCI — consolă d.c. de întindere izolație elastică ───────────────────
        cdci: { group: "CDCI \u2014 d.c. \xEEntindere el.", desc: "CDCI", G_max: 320, V_max: 225, T_max: 1250 }
      };
    }
  });

  // src/calculations.js
  function getX0(tipConductor, sectiune) {
    if (tipConductor.includes("Torsadat")) {
      const xt = { 10: 0.098, 16: 0.098, 25: 0.097, 35: 0.089, 50: 0.086, 70: 0.085, 95: 0.084, 120: 0.083, 150: 0.082 };
      return xt[sectiune] || 0.09;
    }
    if (tipConductor.includes("Clasic")) return 0.32;
    const xc = { 2.5: 0.11, 4: 0.11, 6: 0.1, 10: 0.09, 16: 0.09, 25: 0.08, 35: 0.08, 50: 0.08, 70: 0.08, 95: 0.08, 120: 0.08, 150: 0.08, 185: 0.08, 240: 0.08 };
    return xc[sectiune] || 0.08;
  }
  function getKs(nrCons, tipAmplasare) {
    const n = Math.max(0, parseInt(nrCons) || 0);
    if (n === 0) return 0;
    if (tipAmplasare === "URBAN") {
      if (n <= 30) return KS_URBAN[n] || 0.41;
      if (n <= 40) return 0.39;
      if (n <= 50) return 0.38;
      if (n <= 60) return 0.36;
      return 0.35;
    } else {
      if (n <= 30) return KS_RURAL[n] || 0.3;
      if (n <= 40) return 0.29;
      if (n <= 50) return 0.28;
      if (n <= 60) return 0.27;
      if (n <= 80) return 0.26;
      return 0.25;
    }
  }
  function getR0(tipConductor, sectiune) {
    const tbl = R0_TABLES[tipConductor];
    if (!tbl) return null;
    if (tbl[sectiune] !== void 0) return tbl[sectiune];
    const secs = Object.keys(tbl).map(Number).sort((a, b) => a - b);
    if (secs.length === 0) return null;
    let best = secs[0];
    for (const s of secs) {
      if (s <= sectiune) best = s;
    }
    return tbl[best];
  }
  function calcDU_tronson(L_m, P_eff, tipRetea, sectiune) {
    if (!L_m || !P_eff || !sectiune) return 0;
    let factor = 46;
    if (tipRetea === "Bifazat") factor = 20;
    else if (tipRetea === "Monofazat") factor = 7.7;
    return P_eff * L_m / (sectiune * factor);
  }
  var init_calculations = __esm({
    "src/calculations.js"() {
      init_config();
    }
  });

  // src/export.js
  function getProjectBounds() {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const hasSelection = S.sel !== null || S.multiSel.size > 0;
    if (hasSelection) {
      S.EL.forEach((el) => {
        if (el.id === S.sel || S.multiSel.has(el.id)) {
          if (el.type === "polyline") {
            el.points.forEach((p) => {
              minX = Math.min(minX, p.x);
              minY = Math.min(minY, p.y);
              maxX = Math.max(maxX, p.x);
              maxY = Math.max(maxY, p.y);
            });
          } else {
            const sc = el.scale || 1, wBox = symW(el) * sc / 2 + 40, hBox = symH(el) * sc / 2 + 40;
            minX = Math.min(minX, el.x - wBox);
            minY = Math.min(minY, el.y - hBox);
            maxX = Math.max(maxX, el.x + wBox);
            maxY = Math.max(maxY, el.y + hBox);
          }
        }
      });
      S.CN.forEach((cn) => {
        if (cn.id === S.sel || S.multiSel.has(cn.id)) {
          cn.path.forEach((p) => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          });
        }
      });
      if (minX !== Infinity) return { minX, minY, maxX, maxY, isSelection: true };
    }
    if (S.bgData && S.bgData.url) return { minX: S.bgData.x, minY: S.bgData.y, maxX: S.bgData.x + S.bgData.w, maxY: S.bgData.y + S.bgData.h, isBg: true };
    if (S.EL.length === 0 && S.CN.length === 0) return null;
    S.EL.forEach((el) => {
      if (el.type === "polyline") {
        el.points.forEach((p) => {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        });
      } else {
        const sc = el.scale || 1, wBox = symW(el) * sc / 2 + 40, hBox = symH(el) * sc / 2 + 40;
        minX = Math.min(minX, el.x - wBox);
        minY = Math.min(minY, el.y - hBox);
        maxX = Math.max(maxX, el.x + wBox);
        maxY = Math.max(maxY, el.y + hBox);
      }
    });
    S.CN.forEach((cn) => {
      cn.path.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
    });
    if (minX === Infinity) return null;
    return { minX, minY, maxX, maxY };
  }
  function startExport(type) {
    if (S.EL.length === 0 && S.CN.length === 0 && !S.bgData.url) {
      toast("Plan\u0219\u0103 goal\u0103!", "w");
      return;
    }
    if (type === "dxf") {
      doExportDXF(null);
      return;
    }
    if (type === "pdf") {
      doExportPDF(null);
      return;
    }
    toast(`Se proceseaz\u0103 exportul ${type.toUpperCase()}...`, "ac");
    setMode("select");
    setTimeout(() => {
      if (type === "png") doExportPNG(null);
      if (type === "svg") doExportSVG(null);
    }, 100);
  }
  function resolveCSSVars(svgNode) {
    const cs = getComputedStyle(document.documentElement);
    const vars = {};
    [
      "--bg",
      "--bg2",
      "--bg3",
      "--panel",
      "--panel2",
      "--border",
      "--border2",
      "--accent",
      "--accentg",
      "--warn",
      "--danger",
      "--text",
      "--text2",
      "--text3",
      "--cvs",
      "--shadow",
      "--glow"
    ].forEach((v) => {
      vars[v] = cs.getPropertyValue(v).trim();
    });
    function resolveNode(node) {
      if (node.nodeType !== 1) return;
      ["fill", "stroke", "color", "stop-color"].forEach((attr) => {
        const val = node.getAttribute(attr);
        if (val && val.includes("var(")) node.setAttribute(attr, val.replace(/var\((--[\w-]+)[^)]*\)/g, (m, vn) => vars[vn] || m));
      });
      const style = node.getAttribute("style");
      if (style && style.includes("var(")) node.setAttribute("style", style.replace(/var\((--[\w-]+)[^)]*\)/g, (m, vn) => vars[vn] || m));
      Array.from(node.childNodes).forEach(resolveNode);
    }
    resolveNode(svgNode);
  }
  function inlineStyles(svgNode) {
    const isLight = S.lightMode;
    const bgCol = isLight ? "#ffffff" : "#0b1220";
    const textCol = isLight ? "#1a2740" : "#dce8f5";
    svgNode.querySelectorAll(".td, .hb, .ph").forEach((el) => el.remove());
    svgNode.querySelectorAll("[data-lcx]").forEach((el) => el.remove());
    svgNode.querySelectorAll(".sel-r").forEach((el) => {
      el.removeAttribute("class");
      if (el.getAttribute("fill") === "transparent") el.setAttribute("fill", "none");
      if (el.getAttribute("stroke") === "transparent") el.setAttribute("stroke", "none");
    });
    ["#sel-rect", "#export-rect", "#tpoly", "#GL", "#TL"].forEach((id) => {
      svgNode.querySelector(id)?.remove();
    });
    if (!S.vdOverlayOn) svgNode.querySelector("#VD-OVL")?.remove();
    function fixRgba(node) {
      if (node.nodeType !== 1) return;
      ["fill", "stroke"].forEach((attr) => {
        const val = node.getAttribute(attr);
        if (val && val.startsWith("rgba(")) {
          const m = val.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
          if (m) {
            const hex = "#" + [m[1], m[2], m[3]].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
            node.setAttribute(attr, hex);
            node.setAttribute(attr === "fill" ? "fill-opacity" : "stroke-opacity", parseFloat(m[4]).toFixed(3));
          }
        }
      });
      Array.from(node.childNodes).forEach(fixRgba);
    }
    fixRgba(svgNode);
    svgNode.querySelectorAll('[display="none"]').forEach((el) => el.remove());
    svgNode.querySelectorAll('[fill="transparent"]').forEach((el) => el.setAttribute("fill", "none"));
    svgNode.querySelectorAll('[stroke="transparent"]').forEach((el) => el.setAttribute("stroke", "none"));
    svgNode.querySelectorAll(".el-lbl").forEach((el) => {
      el.removeAttribute("class");
      el.setAttribute("paint-order", "stroke fill");
      el.setAttribute("stroke", bgCol);
      el.setAttribute("stroke-width", "3.5");
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-linejoin", "round");
      if (!el.getAttribute("fill")) el.setAttribute("fill", textCol);
    });
    svgNode.querySelectorAll(".cl").forEach((el) => {
      el.removeAttribute("class");
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-linejoin", "round");
    });
    svgNode.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"));
    svgNode.querySelectorAll("[pointer-events]").forEach((el) => el.removeAttribute("pointer-events"));
    svgNode.querySelectorAll("[cursor]").forEach((el) => el.removeAttribute("cursor"));
    svgNode.querySelectorAll("[data-eid]").forEach((el) => el.removeAttribute("data-eid"));
    svgNode.querySelectorAll("[data-circuit]").forEach((el) => el.removeAttribute("data-circuit"));
  }
  function buildExportSVG(forSVGExport = false, customBounds = null) {
    let bounds = customBounds || getProjectBounds();
    const prevSel = S.sel;
    S.sel = null;
    const prevMulti = new Set(S.multiSel);
    S.multiSel.clear();
    render();
    const cbExportTable = document.getElementById("vd-export-table");
    const includeTable = cbExportTable && cbExportTable.checked && S.vdResults;
    let tableData = { svg: "", w: 0, h: 0 };
    if (includeTable && bounds) {
      let tableX = bounds.minX, tableY = bounds.maxY + 40;
      tableData = generateVDTableSVG(tableX, tableY);
      if (tableData.h > 0) bounds = { minX: bounds.minX, minY: bounds.minY, maxX: Math.max(bounds.maxX, tableX + tableData.w), maxY: Math.max(bounds.maxY, tableY + tableData.h), isBg: bounds.isBg };
    }
    let W, H, vX, vY, pad = customBounds ? 0 : 60;
    if (bounds) {
      if (bounds.isBg && !customBounds && !includeTable) pad = 0;
      vX = bounds.minX - pad;
      vY = bounds.minY - pad;
      W = bounds.maxX - bounds.minX + pad * 2;
      H = bounds.maxY - bounds.minY + pad * 2;
    } else {
      const cw = document.getElementById("cw");
      W = cw.clientWidth;
      H = cw.clientHeight;
      vX = 0;
      vY = 0;
    }
    const svgEl = getSvgEl();
    const clone = svgEl.cloneNode(true), vpClone = clone.querySelector("#VP");
    if (vpClone) vpClone.setAttribute("transform", "translate(0,0) scale(1)");
    resolveCSSVars(clone);
    inlineStyles(clone);
    const bgColor = S.lightMode ? "#ffffff" : "#0b1220";
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", vX);
    bg.setAttribute("y", vY);
    bg.setAttribute("width", W);
    bg.setAttribute("height", H);
    bg.setAttribute("fill", bgColor);
    clone.insertBefore(bg, clone.firstChild);
    if (S.bgData.url) {
      const bgImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
      bgImg.setAttribute("href", S.bgData.url);
      bgImg.setAttribute("x", S.bgData.x);
      bgImg.setAttribute("y", S.bgData.y);
      bgImg.setAttribute("width", S.bgData.w);
      bgImg.setAttribute("height", S.bgData.h);
      bgImg.setAttribute("opacity", S.bgData.op);
      const bgGroup = clone.querySelector("#BG");
      if (bgGroup) bgGroup.appendChild(bgImg);
    }
    if (tableData.svg && vpClone) vpClone.innerHTML += tableData.svg;
    const wm = document.createElementNS("http://www.w3.org/2000/svg", "text");
    wm.setAttribute("x", vX + W - 15);
    wm.setAttribute("y", vY + H - 15);
    wm.setAttribute("text-anchor", "end");
    wm.setAttribute("font-family", "Arial, sans-serif");
    wm.setAttribute("font-size", "11");
    wm.setAttribute("font-weight", "bold");
    wm.setAttribute("fill", S.lightMode ? "#888888" : "#3d5a78");
    wm.textContent = "\xA9 Made by Grigoriu Alin-Florin";
    clone.appendChild(wm);
    clone.setAttribute("width", W);
    clone.setAttribute("height", H);
    clone.setAttribute("viewBox", `${vX} ${vY} ${W} ${H}`);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = 'text { font-family: Arial, "Helvetica Neue", sans-serif; } .cl { stroke-linecap: round; stroke-linejoin: round; }';
    clone.insertBefore(style, clone.firstChild);
    S.sel = prevSel;
    prevMulti.forEach((id) => S.multiSel.add(id));
    render();
    return { svgStr: new XMLSerializer().serializeToString(clone), W, H, vX, vY };
  }
  function renderToCanvas(svgStr, W, H, vX, vY, scale, bgColor) {
    return new Promise((resolve, reject) => {
      const ca = document.createElement("canvas");
      ca.width = W * scale;
      ca.height = H * scale;
      const ctx = ca.getContext("2d");
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, ca.width, ca.height);
      const drawSVG = () => {
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, ca.width, ca.height);
          resolve(ca);
        };
        img.onerror = () => {
          reject(new Error("Eroare la randare grafic\u0103"));
        };
        img.src = url;
      };
      if (S.bgData.url) {
        const bgI = new Image();
        bgI.onload = () => {
          ctx.globalAlpha = S.bgData.op;
          ctx.drawImage(bgI, (S.bgData.x - vX) * scale, (S.bgData.y - vY) * scale, S.bgData.w * scale, S.bgData.h * scale);
          ctx.globalAlpha = 1;
          drawSVG();
        };
        bgI.onerror = drawSVG;
        bgI.src = S.bgData.url;
      } else drawSVG();
    });
  }
  async function doExportPNG(customBounds) {
    try {
      const { svgStr, W, H, vX, vY } = buildExportSVG(false, customBounds);
      const scale = Math.min(4, 15e3 / Math.max(W, H));
      const bg = S.lightMode ? "#ffffff" : "#0b1220";
      const ca = await renderToCanvas(svgStr, W, H, vX, vY, scale, bg);
      const a = document.createElement("a");
      a.href = ca.toDataURL("image/png");
      a.download = "schema_electrica_HD.png";
      a.click();
      toast("PNG HD exportat!", "ok");
    } catch (err) {
      console.error(err);
      toast("Eroare export PNG: " + err.message, "ac");
    }
  }
  function doExportSVG(customBounds) {
    try {
      const { svgStr } = buildExportSVG(true, customBounds);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url;
      a.download = "schema_electrica_Vectorial.svg";
      a.click();
      URL.revokeObjectURL(url);
      toast("SVG Vectorial exportat cu succes!", "ok");
    } catch (err) {
      console.error(err);
      toast("Eroare export SVG: " + err.message, "ac");
    }
  }
  function doExportPDF(customBounds) {
    toast("\u23F3 Generez PDF vectorial...", "ac");
    setTimeout(async () => {
      try {
        if (!window.jspdf) {
          toast("jsPDF indisponibil.", "ac");
          return;
        }
        const { jsPDF } = window.jspdf;
        const { svgStr, W, H } = buildExportSVG(true, customBounds);
        const PX_TO_PT = 0.75;
        let pageW = W * PX_TO_PT, pageH = H * PX_TO_PT;
        const MAX_PT = 5080;
        if (pageW > MAX_PT || pageH > MAX_PT) {
          const f = MAX_PT / Math.max(pageW, pageH);
          pageW *= f;
          pageH *= f;
        }
        const SCALE = Math.min(4, 2e4 / Math.max(W, H));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(W * SCALE);
        canvas.height = Math.round(H * SCALE);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = S.lightMode ? "#ffffff" : "#0b1220";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
          };
          img.onerror = (e) => {
            console.error("SVG render error", e);
            reject(new Error("SVG render failed"));
          };
          const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
          img.src = URL.createObjectURL(blob);
        });
        const imgData = canvas.toDataURL("image/png");
        const orient = pageW >= pageH ? "landscape" : "portrait";
        const pdf = new jsPDF({ orientation: orient, unit: "pt", format: [pageW, pageH], compress: true });
        pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
        let tot = 0;
        S.CN.forEach((c) => tot += parseFloat(c.length) || 0);
        pdf.setFontSize(5);
        pdf.setTextColor(150);
        pdf.text(`ElectroCAD Pro v12  |  (c) Grigoriu Alin-Florin  |  ${(/* @__PURE__ */ new Date()).toLocaleDateString("ro-RO")}  |  ${S.EL.length} elem  ${S.CN.length} conn  ${tot.toFixed(1)}m`, 4, pageH - 3);
        pdf.save("schema_electrica.pdf");
        toast("\u2705 PDF exportat cu succes! Pagina custom-size, 300DPI echivalent.", "ok");
      } catch (err) {
        console.error("PDF error:", err);
        toast("Eroare PDF: " + err.message, "ac");
      }
    }, 50);
  }
  function doExportDXF(customBounds) {
    toast("\u23F3 Generez DXF pentru AutoCAD...", "ac");
    try {
      const bounds = customBounds || getProjectBounds();
      const offX = bounds ? bounds.minX - 50 : 0;
      const offY = bounds ? bounds.minY - 50 : 0;
      const maxY = bounds ? bounds.maxY + 50 : 1e3;
      const dxf_dx = (x) => parseFloat(((x - offX) * 0.1).toFixed(4));
      const dxf_dy = (y) => parseFloat(((maxY - y - offY) * 0.1).toFixed(4));
      let dxf = "";
      dxf += "0\nSECTION\n2\nHEADER\n";
      dxf += "9\n$ACADVER\n1\nAC1015\n9\n$INSUNITS\n70\n6\n9\n$MEASUREMENT\n70\n1\n9\n$EXTMIN\n10\n0\n20\n0\n30\n0\n";
      dxf += `9
$EXTMAX
10
${dxf_dx((bounds?.maxX || 1e3) + 50)}
20
${dxf_dy((bounds?.minY || 0) - 50)}
30
0
`;
      dxf += "0\nENDSEC\n";
      dxf += "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n10\n";
      [
        { name: "ELEMENTE", color: 5 },
        { name: "CABLURI_LEA", color: 1 },
        { name: "CABLURI_LES", color: 3 },
        { name: "ETICHETE", color: 7 },
        { name: "PTAB_MT", color: 4 },
        { name: "PTAB_JT", color: 2 },
        { name: "STALPI", color: 6 },
        { name: "FIRIDE", color: 30 },
        { name: "CADERE_U", color: 1 },
        { name: "SCHEMA_MT", color: 40 }
      ].forEach((l) => {
        dxf += `0
LAYER
2
${l.name}
70
0
62
${l.color}
6
CONTINUOUS
`;
      });
      dxf += "0\nENDTABLE\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
      const dxfLine = (x1, y1, x2, y2, layer, ltype) => `0
LINE
8
${layer}
${ltype ? "6\n" + ltype + "\n" : ""}10
${dxf_dx(x1)}
20
${dxf_dy(y1)}
11
${dxf_dx(x2)}
21
${dxf_dy(y2)}
`;
      const dxfText = (x, y, txt, layer, h = 1.5) => {
        const s = String(txt || "").replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i").replace(/ș/g, "s").replace(/ț/g, "t").replace(/Ă/g, "A").replace(/Â/g, "A").replace(/Î/g, "I").replace(/Ș/g, "S").replace(/Ț/g, "T");
        return `0
TEXT
8
${layer}
10
${dxf_dx(x)}
20
${dxf_dy(y)}
40
${h}
1
${s}
`;
      };
      const dxfPoly = (pts, layer, ltype) => {
        if (pts.length < 2) return "";
        let s = `0
LWPOLYLINE
8
${layer}
${ltype ? "6\n" + ltype + "\n" : ""}70
0
90
${pts.length}
`;
        pts.forEach((p) => {
          s += `10
${dxf_dx(p.x)}
20
${dxf_dy(p.y)}
`;
        });
        return s;
      };
      const dxfCircle = (cx, cy, r, layer) => `0
CIRCLE
8
${layer}
10
${dxf_dx(cx)}
20
${dxf_dy(cy)}
40
${(r * 0.1).toFixed(4)}
`;
      const dxfRect = (x, y, w, h, layer) => dxfLine(x, y, x + w, y, layer) + dxfLine(x + w, y, x + w, y + h, layer) + dxfLine(x + w, y + h, x, y + h, layer) + dxfLine(x, y + h, x, y, layer);
      S.CN.forEach((cn) => {
        if (cn.path.length < 2) return;
        const isS = cn.lineType === "dashed";
        dxf += dxfPoly(cn.path, isS ? "CABLURI_LES" : "CABLURI_LEA", isS ? "DASHED" : "");
        let maxL = -1, bp1 = cn.path[0], bp2 = cn.path[1];
        for (let i = 0; i < cn.path.length - 1; i++) {
          const d2 = Math.hypot(cn.path[i + 1].x - cn.path[i].x, cn.path[i + 1].y - cn.path[i].y);
          if (d2 > maxL) {
            maxL = d2;
            bp1 = cn.path[i];
            bp2 = cn.path[i + 1];
          }
        }
        const mx = (bp1.x + bp2.x) / 2, my = (bp1.y + bp2.y) / 2;
        dxf += dxfText(mx, my - 8, `${cn.label || ""} L=${cn.length || 0}m ${cn.sectiune || ""}mm2`, "ETICHETE", 1);
      });
      S.EL.forEach((el) => {
        const x = el.x, y = el.y, sc = el.scale || 1, rot = (el.rotation || 0) * Math.PI / 180;
        const rp = (lx, ly) => ({ x: x + lx * sc * Math.cos(rot) - ly * sc * Math.sin(rot), y: y + lx * sc * Math.sin(rot) + ly * sc * Math.cos(rot) });
        if (el.label) dxf += dxfText(x + 5, y - symH(el) / 2 * sc - 8, el.label, "ETICHETE", 1.5);
        switch (el.type) {
          case "ptab_1t":
          case "ptab_2t": {
            const W2 = symW(el) * sc / 2, H2 = symH(el) * sc / 2;
            dxf += dxfRect(x - W2, y - H2, W2 * 2, H2 * 2, "PTAB_MT");
            dxf += dxfLine(x - W2 + 20 * sc, y - H2 + 30 * sc, x + W2 - 20 * sc, y - H2 + 30 * sc, "PTAB_MT");
            dxf += dxfText(x, y, el.type === "ptab_2t" ? "PTAB 2T" : "PTAB 1T", "PTAB_MT", 3);
            break;
          }
          case "trafo": {
            dxf += dxfCircle(x - 15 * sc, y, 30 * sc, "PTAB_JT");
            dxf += dxfCircle(x + 15 * sc, y, 30 * sc, "PTAB_JT");
            dxf += dxfText(x, y + 50 * sc, el.trText?.power || "160kVA", "PTAB_JT", 2);
            break;
          }
          case "stalp_se4":
          case "stalp_se10":
          case "stalp_cs":
          case "stalp_rotund":
          case "stalp_rotund_special": {
            const s = 22 * sc;
            if (el.type === "stalp_rotund" || el.type === "stalp_rotund_special") {
              dxf += dxfCircle(x, y, s, "STALPI");
              if (el.type === "stalp_rotund_special") {
                const a2 = rp(-16, -16), b = rp(16, 16), c2 = rp(16, -16), d2 = rp(-16, 16);
                dxf += dxfLine(a2.x, a2.y, b.x, b.y, "STALPI");
                dxf += dxfLine(c2.x, c2.y, d2.x, d2.y, "STALPI");
              }
            } else {
              const c1 = rp(-s, -s), c2 = rp(s, -s), c3 = rp(s, s), c4 = rp(-s, s);
              dxf += dxfLine(c1.x, c1.y, c2.x, c2.y, "STALPI") + dxfLine(c2.x, c2.y, c3.x, c3.y, "STALPI") + dxfLine(c3.x, c3.y, c4.x, c4.y, "STALPI") + dxfLine(c4.x, c4.y, c1.x, c1.y, "STALPI");
              if (el.type !== "stalp_se4") {
                dxf += dxfLine(c1.x, c1.y, c3.x, c3.y, "STALPI");
                dxf += dxfLine(c2.x, c2.y, c4.x, c4.y, "STALPI");
              }
            }
            if (el.nod) dxf += dxfText(x + s + 3, y + s / 2 + 8, "[" + el.nod.toUpperCase() + "]", "ETICHETE", 1);
            break;
          }
          case "firida_e2_4":
          case "firida_e3_4":
          case "firida_e3_0": {
            const W2 = symW(el) * sc / 2, H2 = symH(el) * sc / 2;
            dxf += dxfRect(x - W2, y - H2, W2 * 2, H2 * 2, "FIRIDE");
            dxf += dxfLine(x - W2, y - H2 + 20 * sc, x + W2, y - H2 + 20 * sc, "FIRIDE");
            break;
          }
          case "cd4":
          case "cd5":
          case "cd8": {
            const W2 = symW(el) * sc / 2, H2 = symH(el) * sc / 2;
            dxf += dxfRect(x - W2, y - H2, W2 * 2, H2 * 2, "ELEMENTE");
            dxf += dxfLine(x - W2 + 30 * sc, y - H2, x - W2 + 30 * sc, y + H2, "ELEMENTE");
            break;
          }
          case "separator":
          case "separator_mt":
            dxf += dxfLine(rp(-52, 0).x, rp(-52, 0).y, rp(-22, 0).x, rp(-22, 0).y, "ELEMENTE");
            dxf += dxfLine(rp(22, 0).x, rp(22, 0).y, rp(52, 0).x, rp(52, 0).y, "ELEMENTE");
            dxf += dxfCircle(x, y, 22 * sc, "ELEMENTE");
            break;
          case "manson": {
            const pts = [rp(0, -22), rp(22, 0), rp(0, 22), rp(-22, 0), rp(0, -22)];
            dxf += dxfPoly(pts, "ELEMENTE", "");
            dxf += dxfLine(rp(-38, 0).x, rp(-38, 0).y, rp(-22, 0).x, rp(-22, 0).y, "ELEMENTE");
            dxf += dxfLine(rp(22, 0).x, rp(22, 0).y, rp(38, 0).x, rp(38, 0).y, "ELEMENTE");
            break;
          }
          case "priza_pamant":
            dxf += dxfLine(x, y - 32 * sc, x, y, "ELEMENTE");
            dxf += dxfLine(x - 22 * sc, y, x + 22 * sc, y, "ELEMENTE");
            dxf += dxfLine(x - 15 * sc, y + 8 * sc, x + 15 * sc, y + 8 * sc, "ELEMENTE");
            dxf += dxfLine(x - 8 * sc, y + 16 * sc, x + 8 * sc, y + 16 * sc, "ELEMENTE");
            break;
          case "meter":
            dxf += dxfRect(x - 35 * sc, y - 48 * sc, 70 * sc, 96 * sc, "ELEMENTE");
            dxf += dxfText(x, y + 5, el.bmptText || "BMPT", "ETICHETE", 2);
            break;
          case "rect": {
            const W2 = (el.width || 100) * sc / 2, H2 = (el.height || 100) * sc / 2;
            dxf += dxfRect(x - W2, y - H2, W2 * 2, H2 * 2, "ELEMENTE");
            break;
          }
          case "circle":
            dxf += dxfCircle(x, y, (el.r || 50) * sc, "ELEMENTE");
            break;
          case "text":
            dxf += dxfText(x, y, el.label || "", "ETICHETE", (el.fontSize || 14) * 0.1);
            break;
          case "polyline":
            if (el.points && el.points.length >= 2) dxf += dxfPoly(el.points, "ELEMENTE", "");
            break;
          case "bara_mt": {
            const BW2 = 100 * sc;
            dxf += dxfLine(x - BW2, y, x + BW2, y, "SCHEMA_MT");
            dxf += dxfText(x, y - 8 * sc, "20kV", "SCHEMA_MT", 1.5);
            break;
          }
          case "ptab_mono": {
            const celule2 = el.celule || [], CW2 = 72 * sc, CH2 = 260 * sc, BAR_Y2 = y - 130 * sc;
            const totalW2 = celule2.length * CW2, startX2 = x - totalW2 / 2;
            dxf += dxfLine(startX2, BAR_Y2, startX2 + totalW2, BAR_Y2, "SCHEMA_MT");
            dxf += dxfText(x, BAR_Y2 - 10 * sc, "BARA 20kV", "SCHEMA_MT", 2);
            dxf += dxfRect(startX2, BAR_Y2, totalW2, CH2, "SCHEMA_MT");
            celule2.forEach((cel2, i) => {
              const cx2 = startX2 + i * CW2 + CW2 / 2;
              dxf += dxfRect(startX2 + i * CW2, BAR_Y2, CW2, CH2, "SCHEMA_MT");
              dxf += dxfRect(cx2 - 13 * sc, BAR_Y2 + 22 * sc, 26 * sc, 36 * sc, "SCHEMA_MT");
              dxf += dxfCircle(cx2, BAR_Y2 + 84 * sc, 4 * sc, "SCHEMA_MT");
              dxf += dxfCircle(cx2, BAR_Y2 + 104 * sc, 4 * sc, "SCHEMA_MT");
              dxf += dxfRect(cx2 - 10 * sc, BAR_Y2 + 124 * sc, 20 * sc, 20 * sc, "SCHEMA_MT");
              if (cel2.tip === "T") {
                dxf += dxfCircle(cx2, BAR_Y2 + 184 * sc, 16 * sc, "SCHEMA_MT");
                dxf += dxfCircle(cx2, BAR_Y2 + 204 * sc, 16 * sc, "SCHEMA_MT");
                dxf += dxfText(cx2, BAR_Y2 + 184 * sc, cel2.putere || "100kVA", "ETICHETE", 1.2);
                dxf += dxfText(cx2, BAR_Y2 + CH2 - 5 * sc, cel2.label || "T", "ETICHETE", 1.5);
              } else {
                dxf += dxfText(cx2, BAR_Y2 + CH2 - 5 * sc, cel2.label || "L", "ETICHETE", 1.5);
              }
              dxf += dxfText(cx2 + 16 * sc, BAR_Y2 + 44 * sc, cel2.curent || "16A", "ETICHETE", 1);
            });
            if (el.label) dxf += dxfText(x, BAR_Y2 - 22 * sc, el.label, "ETICHETE", 2);
            break;
          }
          case "celula_linie_mt": {
            const CW2 = 35 * sc, CH2 = 110 * sc;
            dxf += dxfRect(x - CW2, y - CH2, CW2 * 2, CH2 * 2, "SCHEMA_MT");
            dxf += dxfLine(x, y - CH2, x, y + CH2, "SCHEMA_MT");
            dxf += dxfRect(x - 14 * sc, y - CH2 + 40 * sc, 28 * sc, 36 * sc, "SCHEMA_MT");
            dxf += dxfCircle(x, y, 8 * sc, "SCHEMA_MT");
            dxf += dxfRect(x - 10 * sc, y + CH2 - 60 * sc, 20 * sc, 20 * sc, "SCHEMA_MT");
            const cData = el.celMT || {};
            dxf += dxfText(x + CW2 + 3 * sc, y, cData.curent || "400A", "ETICHETE", 1.2);
            dxf += dxfText(x, y - CH2 - 8 * sc, cData.tensiune || "20kV", "ETICHETE", 1.2);
            break;
          }
          case "celula_trafo_mt": {
            const CW2 = 40 * sc, CH2 = 140 * sc;
            dxf += dxfRect(x - CW2, y - CH2, CW2 * 2, CH2 * 2, "SCHEMA_MT");
            dxf += dxfLine(x, y - CH2, x, y + CH2, "SCHEMA_MT");
            dxf += dxfRect(x - 14 * sc, y - CH2 + 30 * sc, 28 * sc, 36 * sc, "SCHEMA_MT");
            dxf += dxfCircle(x, y - 20 * sc, 8 * sc, "SCHEMA_MT");
            dxf += dxfRect(x - 10 * sc, y + 10 * sc, 20 * sc, 20 * sc, "SCHEMA_MT");
            dxf += dxfCircle(x, y + CH2 - 60 * sc, 16 * sc, "SCHEMA_MT");
            dxf += dxfCircle(x, y + CH2 - 38 * sc, 16 * sc, "SCHEMA_MT");
            const cDataT = el.celMT || {};
            dxf += dxfText(x + CW2 + 3 * sc, y + CH2 - 60 * sc, cDataT.putere || "100kVA", "ETICHETE", 1.2);
            dxf += dxfText(x + CW2 + 3 * sc, y + CH2 - 48 * sc, cDataT.volt || "20/0.4kV", "ETICHETE", 1.2);
            dxf += dxfText(x, y - CH2 - 8 * sc, cDataT.tensiune || "20kV", "ETICHETE", 1.2);
            break;
          }
          case "bara_statie_mt": {
            const lung2 = (el.lungime || 200) * sc;
            dxf += dxfLine(x, y - lung2 / 2, x, y + lung2 / 2, "SCHEMA_MT");
            dxf += dxfLine(x - 9 * sc, y - lung2 / 2, x, y - lung2 / 2 - 16 * sc, "SCHEMA_MT");
            dxf += dxfLine(x + 9 * sc, y - lung2 / 2, x, y - lung2 / 2 - 16 * sc, "SCHEMA_MT");
            (el.terminale || [{ pct: 25 }, { pct: 50 }, { pct: 75 }]).forEach((ter) => {
              const pct2 = Math.max(0, Math.min(100, ter.pct || 0));
              const terY = y - lung2 / 2 + pct2 / 100 * lung2;
              dxf += dxfLine(x - 5 * sc, terY, x + 18 * sc, terY, "SCHEMA_MT");
              if (ter.label) dxf += dxfText(x + 22 * sc, terY, ter.label, "ETICHETE", 1.2);
            });
            const gY2 = y + lung2 / 2 + 10 * sc;
            dxf += dxfLine(x - 20 * sc, gY2, x + 20 * sc, gY2, "SCHEMA_MT") + dxfLine(x - 13 * sc, gY2 + 8 * sc, x + 13 * sc, gY2 + 8 * sc, "SCHEMA_MT") + dxfLine(x - 6 * sc, gY2 + 16 * sc, x + 6 * sc, gY2 + 16 * sc, "SCHEMA_MT");
            dxf += dxfText(x - 12 * sc, y + 5 * sc, el.nrCircuit || "2", "ETICHETE", 4);
            dxf += dxfText(x, y - lung2 / 2 - 28 * sc, el.numeStatie || "STATIE 20kV", "ETICHETE", 1.8);
            if (el.label) dxf += dxfText(x + 14 * sc, y, el.label, "ETICHETE", 1.5);
            break;
          }
        }
        if (S.vdResults) {
          S.vdResults.forEach((data) => {
            if (data.duNod === 0) return;
            const elVD = S.EL.find((e) => e.id === data.elId);
            if (!elVD) return;
            dxf += dxfText(elVD.x, elVD.y - 40, `DU=${data.duNod.toFixed(2)}%`, "CADERE_U", 1);
          });
        }
      });
      dxf += "0\nENDSEC\n0\nEOF\n";
      const blob = new Blob([dxf], { type: "application/dxf" });
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url;
      a.download = "schema_electrica.dxf";
      a.click();
      URL.revokeObjectURL(url);
      toast("\u2705 DXF exportat! Deschide in AutoCAD / LibreCAD / QCAD.", "ok");
    } catch (err) {
      console.error(err);
      toast("Eroare DXF: " + err.message, "ac");
    }
  }
  function closeExportMenu() {
    const m = document.getElementById("export-menu");
    if (m) m.style.display = "none";
  }
  function toggleExportMenu() {
    const m = document.getElementById("export-menu");
    const isOpen = m.style.display === "flex";
    m.style.display = isOpen ? "none" : "flex";
    if (!isOpen) {
      setTimeout(() => {
        document.addEventListener("click", closeExportMenuOutside, { once: true });
      }, 10);
    }
  }
  function closeExportMenuOutside(e) {
    const m = document.getElementById("export-menu");
    if (m.style.display === "flex" && !m.parentElement.contains(e.target)) {
      m.style.display = "none";
    }
  }
  var init_export = __esm({
    "src/export.js"() {
      init_state();
      init_elements();
      init_renderer();
      init_utils();
      init_ui();
    }
  });

  // src/auth.js
  function setAuthHandlers({ onAuthSuccess, onLogout }) {
    _onAuthSuccess = onAuthSuccess;
    _onLogout = onLogout;
  }
  function getCloudFunctions() {
    return { currentUser, supaClient, cloudSaveProject, cloudLoadProjects, cloudGetProject, cloudDeleteProject };
  }
  function initSupabase() {
    try {
      if (window.supabase && window.supabase.createClient) {
        supaClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
      }
    } catch (e) {
      console.warn("Supabase init failed:", e);
    }
    return false;
  }
  function showAuthScreen() {
    document.getElementById("auth-screen").classList.remove("hidden");
    document.getElementById("auth-email").focus();
  }
  function hideAuthScreen() {
    document.getElementById("auth-screen").classList.add("hidden");
  }
  function toggleAuthMode() {
    authMode = authMode === "login" ? "register" : "login";
    const btn = document.getElementById("auth-submit-btn");
    const toggle = document.getElementById("auth-toggle-text");
    const label = document.getElementById("auth-mode-label");
    const nameRow = document.getElementById("auth-name-row");
    if (authMode === "register") {
      btn.textContent = "CREEAZ\u0102 CONT";
      toggle.innerHTML = 'Ai deja cont? <span onclick="toggleAuthMode()">Conecteaz\u0103-te</span>';
      label.textContent = "Creeaz\u0103 un cont nou";
      nameRow.style.display = "block";
    } else {
      btn.textContent = "INTR\u0102";
      toggle.innerHTML = 'Nu ai cont? <span onclick="toggleAuthMode()">Creeaz\u0103 unul</span>';
      label.textContent = "Conecteaz\u0103-te pentru a salva proiectele \xEEn cloud";
      nameRow.style.display = "none";
    }
    document.getElementById("auth-error").textContent = "";
  }
  function authSubmit() {
    const email = document.getElementById("auth-email").value.trim();
    const pass = document.getElementById("auth-pass").value;
    const errEl = document.getElementById("auth-error");
    const btn = document.getElementById("auth-submit-btn");
    errEl.textContent = "";
    if (!email || !pass) {
      errEl.textContent = "Completeaz\u0103 email \u0219i parola";
      return;
    }
    if (pass.length < 6) {
      errEl.textContent = "Parola trebuie s\u0103 aib\u0103 minim 6 caractere";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Se proceseaz\u0103...";
    if (authMode === "register") {
      const displayName = document.getElementById("auth-name").value.trim();
      supaClient.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: displayName || email.split("@")[0] } }
      }).then((res) => {
        btn.disabled = false;
        if (res.error) {
          errEl.textContent = _translateAuthError(res.error.message);
          btn.textContent = "CREEAZ\u0102 CONT";
        } else if (res.data.user && !res.data.session) {
          errEl.style.color = "var(--accentg)";
          errEl.textContent = "Cont creat! Verific\u0103 email-ul pentru confirmare, apoi conecteaz\u0103-te.";
          btn.textContent = "CREEAZ\u0102 CONT";
          authMode = "login";
          setTimeout(toggleAuthMode, 2e3);
        } else {
          _onAuthSuccess_internal(res.data.user);
        }
      });
    } else {
      supaClient.auth.signInWithPassword({ email, password: pass }).then((res) => {
        btn.disabled = false;
        if (res.error) {
          errEl.textContent = _translateAuthError(res.error.message);
          btn.textContent = "INTR\u0102";
        } else {
          _onAuthSuccess_internal(res.data.user);
        }
      });
    }
  }
  function _translateAuthError(msg) {
    if (msg.includes("Invalid login")) return "Email sau parol\u0103 incorect\u0103";
    if (msg.includes("already registered")) return "Acest email este deja \xEEnregistrat";
    if (msg.includes("valid email")) return "Adres\u0103 de email invalid\u0103";
    if (msg.includes("Email not confirmed")) return "Email-ul nu a fost confirmat. Verific\u0103 inbox-ul.";
    if (msg.includes("rate limit")) return "Prea multe \xEEncerc\u0103ri. A\u0219teapt\u0103 c\xE2teva minute.";
    return msg;
  }
  function _onAuthSuccess_internal(user) {
    currentUser = user;
    updateUserBar();
    checkUserApproval().then((approved) => {
      if (approved) {
        hideAuthScreen();
        toast("Conectat: " + user.email, "ok");
        _onAuthSuccess && _onAuthSuccess();
      } else {
        _showPendingScreen();
      }
    });
  }
  function updateUserBar() {
    const bar = document.getElementById("user-bar");
    const emailEl = document.getElementById("user-email-display");
    if (currentUser) {
      bar.style.display = "flex";
      emailEl.textContent = currentUser.email;
    } else {
      bar.style.display = "none";
      emailEl.textContent = "";
    }
  }
  function authLogout() {
    if (!confirm("Vrei s\u0103 te deconectezi?")) return;
    _onLogout && _onLogout();
    supaClient.auth.signOut().then(() => {
      currentUser = null;
      currentProfile = null;
      updateUserBar();
      closeAdminPanel();
      showAuthScreen();
    });
  }
  function authSkip() {
    currentUser = null;
    hideAuthScreen();
    updateUserBar();
  }
  function checkUserApproval() {
    if (!currentUser || !supaClient) return Promise.resolve(false);
    if (currentUser.email === ADMIN_EMAIL) {
      currentProfile = { approved: true, is_admin: true, display_name: "Admin" };
      const adminBtn = document.getElementById("admin-btn");
      if (adminBtn) adminBtn.style.display = "";
      return Promise.resolve(true);
    }
    return supaClient.from("profiles").select("approved, is_admin, display_name").eq("id", currentUser.id).single().then((res) => {
      if (res.error) {
        if (res.error.code === "PGRST116") return false;
        return false;
      }
      if (!res.data) return false;
      currentProfile = res.data;
      if (currentProfile.is_admin) {
        const adminBtn = document.getElementById("admin-btn");
        if (adminBtn) adminBtn.style.display = "";
      }
      return currentProfile.approved;
    }).catch((e) => {
      console.error("Approval check failed:", e);
      return false;
    });
  }
  function _showPendingScreen() {
    hideAuthScreen();
    const screen = document.getElementById("project-screen");
    screen.classList.remove("hidden");
    const listEl = document.getElementById("ps-list");
    listEl.innerHTML = '<div class="ps-empty" style="padding:40px 20px;font-size:14px"><div style="font-size:40px;margin-bottom:16px">\u23F3</div><div style="color:var(--warn);font-weight:700;font-size:16px;margin-bottom:8px">Cont \xEEn a\u0219teptare</div><div style="color:var(--text3)">Contul t\u0103u (<b>' + currentUser.email + "</b>) nu a fost \xEEnc\u0103 aprobat.<br>Administratorul va fi notificat \u0219i vei primi acces \xEEn cur\xE2nd.</div></div>";
    document.getElementById("ps-recovery").style.display = "none";
    const actionsEl = document.querySelector(".ps-actions");
    if (actionsEl) {
      actionsEl.innerHTML = '<button class="ps-btn secondary" onclick="pendingLogout()">Deconectare</button><button class="ps-btn" onclick="authSkip();hideProjectScreen()">Continu\u0103 f\u0103r\u0103 cont (local)</button>';
    }
  }
  function pendingLogout() {
    supaClient.auth.signOut().then(() => {
      currentUser = null;
      currentProfile = null;
      updateUserBar();
      const screen = document.getElementById("project-screen");
      screen.classList.add("hidden");
      showAuthScreen();
    });
  }
  function openAdminPanel() {
    if (!currentProfile || !currentProfile.is_admin) return;
    document.getElementById("admin-overlay").classList.add("show");
    document.getElementById("admin-panel").classList.add("show");
    refreshAdminList();
  }
  function closeAdminPanel() {
    document.getElementById("admin-overlay").classList.remove("show");
    document.getElementById("admin-panel").classList.remove("show");
  }
  function refreshAdminList() {
    const body = document.getElementById("admin-body");
    body.innerHTML = '<div class="adm-empty">Se \xEEncarc\u0103...</div>';
    supaClient.from("profiles").select("id, email, display_name, approved, is_admin, created_at").order("created_at", { ascending: false }).then((res) => {
      if (res.error) {
        body.innerHTML = '<div class="adm-empty">Eroare: ' + res.error.message + "</div>";
        return;
      }
      const profiles = res.data || [];
      const pending = profiles.filter((p) => !p.approved);
      const active = profiles.filter((p) => p.approved);
      let html = '<div class="adm-section">\xCEn a\u0219teptare (' + pending.length + ")</div>";
      if (pending.length === 0) {
        html += '<div class="adm-empty">Niciun cont \xEEn a\u0219teptare</div>';
      } else {
        pending.forEach((p) => {
          const date = new Date(p.created_at).toLocaleDateString("ro-RO");
          html += `<div class="adm-user"><div class="adm-user-info"><div class="adm-user-email">${p.email} <span class="adm-badge pending">PENDING</span></div><div class="adm-user-meta">${p.display_name || ""} \u2014 \xEEnregistrat ${date}</div></div><button class="adm-btn approve" onclick="approveUser('${p.id}')">Aprob\u0103</button><button class="adm-btn reject" onclick="rejectUser('${p.id}')">\u0218terge</button></div>`;
        });
      }
      html += '<div class="adm-section" style="margin-top:8px">Conturi active (' + active.length + ")</div>";
      active.forEach((p) => {
        const date = new Date(p.created_at).toLocaleDateString("ro-RO");
        const badge = p.is_admin ? '<span class="adm-badge admin">ADMIN</span>' : '<span class="adm-badge active">ACTIV</span>';
        const actions = !p.is_admin ? `<button class="adm-btn disable" onclick="disableUser('${p.id}')">Dezactiveaz\u0103</button>` : "";
        html += `<div class="adm-user"><div class="adm-user-info"><div class="adm-user-email">${p.email} ${badge}</div><div class="adm-user-meta">${p.display_name || ""} \u2014 din ${date}</div></div>${actions}</div>`;
      });
      body.innerHTML = html;
    });
  }
  function approveUser(userId) {
    supaClient.from("profiles").update({ approved: true }).eq("id", userId).then((res) => {
      if (res.error) {
        toast("Eroare: " + res.error.message, "");
        return;
      }
      toast("Cont aprobat!", "ok");
      refreshAdminList();
    });
  }
  function rejectUser(userId) {
    if (!confirm("E\u0219ti sigur? Utilizatorul va fi \u0219ters permanent.")) return;
    supaClient.from("profiles").delete().eq("id", userId).then(() => {
      toast("Cont \u0219ters", "ok");
      refreshAdminList();
    });
  }
  function disableUser(userId) {
    if (!confirm("Dezactivezi acest cont?")) return;
    supaClient.from("profiles").update({ approved: false }).eq("id", userId).then((res) => {
      if (res.error) {
        toast("Eroare: " + res.error.message, "");
        return;
      }
      toast("Cont dezactivat", "ok");
      refreshAdminList();
    });
  }
  function _isValidUUID(str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }
  function cloudSaveProject(projectId, projectName, data) {
    if (!currentUser || !supaClient) return Promise.resolve(null);
    const cloudId = _isValidUUID(projectId) ? projectId : crypto.randomUUID?.() || projectId;
    const row = { id: cloudId, user_id: currentUser.id, name: projectName, data, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    return supaClient.from("projects").upsert(row, { onConflict: "id" }).then((res) => {
      if (res.error) {
        console.error("Cloud save error:", res.error.message);
        toast("\u2601 Eroare cloud: " + res.error.message, "");
        return null;
      }
      return res;
    });
  }
  function cloudLoadProjects() {
    if (!currentUser || !supaClient) return Promise.resolve([]);
    return supaClient.from("projects").select("id, name, data, created_at, updated_at").eq("user_id", currentUser.id).order("updated_at", { ascending: false }).then((res) => {
      if (res.error) {
        console.error("Cloud load error:", res.error);
        return [];
      }
      return res.data || [];
    });
  }
  function cloudDeleteProject(projectId) {
    if (!currentUser || !supaClient) return Promise.resolve();
    return supaClient.from("projects").delete().eq("id", projectId).eq("user_id", currentUser.id);
  }
  function cloudGetProject(projectId) {
    if (!currentUser || !supaClient) return Promise.resolve(null);
    return supaClient.from("projects").select("*").eq("id", projectId).eq("user_id", currentUser.id).single().then((res) => res.error ? null : res.data);
  }
  async function resumeSession(onApproved) {
    if (!supaClient) return false;
    try {
      const res = await supaClient.auth.getSession();
      if (res.data.session?.user) {
        currentUser = res.data.session.user;
        updateUserBar();
        const approved = await checkUserApproval();
        if (approved) {
          hideAuthScreen();
          onApproved && onApproved();
        } else {
          _showPendingScreen();
        }
        return true;
      }
    } catch (e) {
      console.warn("Session check failed:", e);
    }
    return false;
  }
  function setupAuthStateListener() {
    if (!supaClient) return;
    supaClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        currentUser = session.user;
        updateUserBar();
      } else if (event === "SIGNED_OUT") {
        currentUser = null;
        updateUserBar();
      }
    });
  }
  var SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, supaClient, currentUser, currentProfile, authMode, _onAuthSuccess, _onLogout;
  var init_auth = __esm({
    "src/auth.js"() {
      init_state();
      init_utils();
      SUPABASE_URL = "https://fmvcwdopsugwqiodwtxm.supabase.co";
      SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdmN3ZG9wc3Vnd3Fpb2R3dHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDMzODYsImV4cCI6MjA5MTcxOTM4Nn0.rkmhhzzaGHa0d_P7RSph0X74oDLYID_c4IZGPLstJD0";
      ADMIN_EMAIL = "grigoriualin13@gmail.com";
      supaClient = null;
      currentUser = null;
      currentProfile = null;
      authMode = "login";
      _onAuthSuccess = null;
      _onLogout = null;
    }
  });

  // src/project.js
  function openDB() {
    return new Promise((resolve, reject) => {
      if (ecDB) {
        resolve(ecDB);
        return;
      }
      const req = indexedDB.open("ElectroCAD_Projects", 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("projects")) {
          const store = db.createObjectStore("projects", { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("autosave")) db.createObjectStore("autosave", { keyPath: "key" });
      };
      req.onsuccess = (e) => {
        ecDB = e.target.result;
        resolve(ecDB);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }
  function dbPut(storeName, data) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    }));
  }
  function dbGet(storeName, key) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    }));
  }
  function dbGetAll(storeName) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    }));
  }
  function dbDelete(storeName, key) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    }));
  }
  function markDirty() {
    hasUnsavedChanges = true;
  }
  function getProjectData() {
    return { EL: S.EL, CN: S.CN, bgData: S.bgData.url ? S.bgData : null };
  }
  function loadProjectData(data) {
    S.EL = data.EL || [];
    S.CN = data.CN || [];
    if (data.bgData) S.bgData = data.bgData;
    else S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
    S.sel = null;
    S.multiSel.clear();
    S.undoStack = [];
    S.redoStack = [];
    render();
    renderBg();
    updateProps();
    updateStat();
  }
  function updateProjectNameUI() {
    const el = document.getElementById("project-name-bar");
    if (el) el.textContent = currentProjectName || "Proiect Nou";
    document.title = (currentProjectName || "Proiect Nou") + " \u2014 ElectroCAD Pro v12";
  }
  function updateAutoSaveIndicator(text) {
    const el = document.getElementById("autosave-indicator");
    if (el) {
      el.textContent = text;
      setTimeout(() => {
        el.textContent = "";
      }, 4e3);
    }
  }
  function getLocalUserId() {
    const { currentUser: currentUser2 } = getCloudFunctions();
    return currentUser2 ? currentUser2.id : "local";
  }
  function saveProjectToDB(projectId, projectName) {
    const now = Date.now();
    const projData = getProjectData();
    const data = { id: projectId, name: projectName, data: projData, user_id: getLocalUserId(), createdAt: null, updatedAt: now };
    const { currentUser: currentUser2, supaClient: supaClient2, cloudSaveProject: cloudSaveProject2 } = getCloudFunctions();
    const localSave = dbGet("projects", projectId).then((existing) => {
      data.createdAt = existing ? existing.createdAt : now;
      return dbPut("projects", data);
    });
    if (currentUser2 && supaClient2) {
      cloudSaveProject2(projectId, projectName, projData).then((res) => {
        updateAutoSaveIndicator(res ? "\u2601 cloud sync OK" : "\u2601 cloud sync EROARE");
      }).catch((e) => {
        console.error("Cloud sync failed:", e);
        updateAutoSaveIndicator("\u2601 sync eroare");
      });
    }
    return localSave;
  }
  function doAutoSave() {
    if (!hasUnsavedChanges && currentProjectId) return;
    const asData = { key: "current_autosave", projectId: currentProjectId, projectName: currentProjectName, data: getProjectData(), savedAt: Date.now() };
    dbPut("autosave", asData).then(() => {
      hasUnsavedChanges = false;
      const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      updateAutoSaveIndicator("auto-save " + timeStr);
    }).catch((e) => console.warn("Auto-save failed:", e));
  }
  function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(doAutoSave, autoSaveInterval);
  }
  function clearAutoSave() {
    dbDelete("autosave", "current_autosave").catch(() => {
    });
  }
  function save() {
    if (currentProjectId) {
      saveProjectToDB(currentProjectId, currentProjectName).then(() => {
        hasUnsavedChanges = false;
        clearAutoSave();
        toast("Proiect salvat: " + currentProjectName, "ok");
      }).catch((e) => toast("Eroare salvare: " + e, ""));
    } else {
      showNameDialog((name) => {
        currentProjectId = generateUUID();
        currentProjectName = name;
        updateProjectNameUI();
        saveProjectToDB(currentProjectId, currentProjectName).then(() => {
          hasUnsavedChanges = false;
          clearAutoSave();
          toast("Proiect salvat: " + currentProjectName, "ok");
        });
      });
    }
  }
  function saveAsNew() {
    showNameDialog((name) => {
      currentProjectId = generateUUID();
      currentProjectName = name;
      updateProjectNameUI();
      saveProjectToDB(currentProjectId, currentProjectName).then(() => {
        hasUnsavedChanges = false;
        clearAutoSave();
        toast("Proiect salvat ca: " + currentProjectName, "ok");
      });
    }, currentProjectName ? currentProjectName + " (copie)" : "");
  }
  function exportJSON() {
    const data = { EL: S.EL, CN: S.CN, bgData: S.bgData.url ? S.bgData : null };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    const fname = (currentProjectName || "proiect_electro").replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_") + ".json";
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    toast("JSON exportat: " + fname, "ok");
  }
  function load(inp) {
    const f = inp.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        loadProjectData(data);
        currentProjectId = null;
        currentProjectName = f.name.replace(".json", "").replace(/_/g, " ");
        updateProjectNameUI();
        hideProjectScreen();
        toast("Proiect \xEEnc\u0103rcat din fi\u0219ier: " + f.name, "ok");
      } catch (err) {
        toast("Eroare la \xEEnc\u0103rcare \u2014 fi\u0219ier corupt!", "danger");
      }
    };
    r.readAsText(f);
    inp.value = "";
  }
  function showNameDialog(callback, defaultName) {
    const modal = document.getElementById("project-name-modal");
    const input = document.getElementById("pn-input");
    input.value = defaultName || "";
    modal.classList.add("show");
    input.focus();
    input.select();
    function doSave() {
      const name = input.value.trim();
      if (!name) {
        input.style.borderColor = "var(--danger)";
        return;
      }
      modal.classList.remove("show");
      input.removeEventListener("keydown", onKey);
      callback(name);
    }
    function onKey(e) {
      if (e.key === "Enter") doSave();
      if (e.key === "Escape") {
        modal.classList.remove("show");
        input.removeEventListener("keydown", onKey);
      }
    }
    input.addEventListener("keydown", onKey);
    document.getElementById("pn-save-btn").onclick = doSave;
    document.getElementById("pn-cancel-btn").onclick = () => {
      modal.classList.remove("show");
      input.removeEventListener("keydown", onKey);
    };
  }
  function showProjectManager() {
    document.getElementById("project-screen").classList.remove("hidden");
    refreshProjectList();
  }
  function hideProjectScreen() {
    document.getElementById("project-screen").classList.add("hidden");
  }
  function refreshProjectList() {
    const recoveryEl = document.getElementById("ps-recovery");
    dbGet("autosave", "current_autosave").then((as) => {
      if (as && as.data && (as.data.EL?.length > 0 || as.data.CN?.length > 0)) {
        const timeAgo = Math.round((Date.now() - as.savedAt) / 6e4);
        const timeStr = timeAgo < 1 ? "acum c\xE2teva secunde" : timeAgo < 60 ? timeAgo + " min \xEEn urm\u0103" : Math.round(timeAgo / 60) + "h \xEEn urm\u0103";
        recoveryEl.style.display = "flex";
        recoveryEl.innerHTML = `<span class="ps-recovery-text">Sesiune nesalvat\u0103 g\u0103sit\u0103${as.projectName ? " (" + as.projectName + ")" : ""} \u2014 ${timeStr}, ${as.data.EL?.length || 0} elemente</span>
        <button class="ps-recovery-btn" onclick="recoverAutoSave()">Recupereaz\u0103</button>
        <button class="ps-recovery-btn" onclick="dismissRecovery()" style="color:var(--text3);border-color:var(--border)">Ignor\u0103</button>`;
      } else {
        recoveryEl.style.display = "none";
      }
    }).catch(() => {
      recoveryEl.style.display = "none";
    });
    const userId = getLocalUserId();
    const { currentUser: currentUser2, supaClient: supaClient2, cloudLoadProjects: cloudLoadProjects2 } = getCloudFunctions();
    const localPromise = dbGetAll("projects").then((all) => all.filter((p) => !p.user_id || p.user_id === userId));
    const cloudPromise = currentUser2 && supaClient2 ? cloudLoadProjects2() : Promise.resolve([]);
    Promise.all([localPromise, cloudPromise]).then(([localProjects, cloudProjects]) => {
      const merged = {};
      localProjects.forEach((p) => {
        merged[p.id] = { id: p.id, name: p.name, data: p.data, updatedAt: p.updatedAt, source: "local" };
      });
      (cloudProjects || []).forEach((p) => {
        const cloudTime = new Date(p.updated_at).getTime();
        if (!merged[p.id] || cloudTime > merged[p.id].updatedAt) merged[p.id] = { id: p.id, name: p.name, data: p.data, updatedAt: cloudTime, source: "cloud" };
        else merged[p.id].source = "both";
      });
      _psProjects = Object.values(merged).sort((a, b) => b.updatedAt - a.updatedAt);
      const searchEl = document.getElementById("ps-search-input");
      if (_psProjects.length >= 2) {
        searchEl.style.display = "";
        searchEl.value = "";
      } else searchEl.style.display = "none";
      renderProjectList();
    });
  }
  function renderProjectList() {
    const listEl = document.getElementById("ps-list");
    const searchEl = document.getElementById("ps-search-input");
    const query = (searchEl?.value || "").trim().toLowerCase();
    if (_psProjects.length === 0) {
      listEl.innerHTML = '<div class="ps-empty">Niciun proiect salvat \xEEnc\u0103.<br>Creeaz\u0103 un proiect nou sau \xEEncarc\u0103 un fi\u0219ier JSON.</div>';
      return;
    }
    const filtered = query ? _psProjects.filter((p) => (p.name || "").toLowerCase().includes(query)) : _psProjects;
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="ps-empty">Niciun proiect nu se potrive\u0219te cu \u201E${query.replace(/</g, "&lt;")}"</div>`;
      return;
    }
    listEl.innerHTML = "";
    filtered.forEach((p) => {
      const date = new Date(p.updatedAt);
      const dateStr = date.toLocaleDateString("ro-RO") + " " + date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      const elCount = p.data?.EL?.length || 0, cnCount = p.data?.CN?.length || 0;
      const isCurrent = p.id === currentProjectId;
      const sourceIcon = p.source === "cloud" ? " \u2601" : p.source === "both" ? " \u2601\u{1F4BE}" : " \u{1F4BE}";
      const div = document.createElement("div");
      div.className = "ps-item";
      if (isCurrent) div.style.borderColor = "var(--accent)";
      div.innerHTML = `<div class="ps-item-info"><div class="ps-item-name">${p.name}${sourceIcon}${isCurrent ? " (deschis)" : ""}</div><div class="ps-item-meta">${dateStr}  |  ${elCount} elem, ${cnCount} conn</div></div>
      <button class="ps-item-del" onclick="event.stopPropagation();renameProject('${p.id}','${p.name.replace(/'/g, "\\'")}')">\u270F</button>
      <button class="ps-item-del" onclick="event.stopPropagation();deleteProject('${p.id}')">\u2715</button>`;
      div.onclick = () => openProject(p.id, p.source);
      listEl.appendChild(div);
    });
  }
  function openProject(projectId, source) {
    const { currentUser: currentUser2, supaClient: supaClient2, cloudGetProject: cloudGetProject2 } = getCloudFunctions();
    const loadLocal = dbGet("projects", projectId);
    const loadCloud = source === "cloud" && currentUser2 && supaClient2 ? cloudGetProject2(projectId) : Promise.resolve(null);
    Promise.all([loadLocal, loadCloud]).then(([local, cloud]) => {
      const p = cloud || local;
      if (!p) {
        toast("Proiectul nu a fost g\u0103sit!", "");
        return;
      }
      loadProjectData(p.data);
      currentProjectId = projectId;
      currentProjectName = p.name;
      updateProjectNameUI();
      clearAutoSave();
      hideProjectScreen();
      toast("Proiect deschis: " + p.name, "ok");
    });
  }
  function deleteProject(projectId) {
    if (!confirm("E\u0219ti sigur c\u0103 vrei s\u0103 \u0219tergi acest proiect?")) return;
    const { currentUser: currentUser2, supaClient: supaClient2, cloudDeleteProject: cloudDeleteProject2 } = getCloudFunctions();
    const promises = [dbDelete("projects", projectId)];
    if (currentUser2 && supaClient2) promises.push(cloudDeleteProject2(projectId));
    Promise.all(promises).then(() => {
      if (currentProjectId === projectId) {
        currentProjectId = null;
        currentProjectName = null;
        updateProjectNameUI();
      }
      refreshProjectList();
      toast("Proiect \u0219ters", "ok");
    });
  }
  function renameProject(projectId, oldName) {
    showNameDialog((newName) => {
      dbGet("projects", projectId).then((p) => {
        if (!p) return;
        p.name = newName;
        return dbPut("projects", p);
      }).then(() => {
        if (currentProjectId === projectId) {
          currentProjectName = newName;
          updateProjectNameUI();
        }
        refreshProjectList();
        toast("Proiect redenumit: " + newName, "ok");
      });
    }, oldName);
  }
  function recoverAutoSave() {
    dbGet("autosave", "current_autosave").then((as) => {
      if (!as || !as.data) return;
      loadProjectData(as.data);
      currentProjectId = as.projectId || null;
      currentProjectName = as.projectName || null;
      updateProjectNameUI();
      hideProjectScreen();
      toast("Sesiune recuperat\u0103 cu succes!", "ok");
    });
  }
  function dismissRecovery() {
    clearAutoSave();
    document.getElementById("ps-recovery").style.display = "none";
  }
  function newProject() {
    if (S.EL.length > 0 || S.CN.length > 0) {
      if (!confirm("Ai un proiect deschis. Vrei s\u0103 continui? (modific\u0103rile nesalvate se pierd)")) return;
    }
    S.EL = [];
    S.CN = [];
    S.sel = null;
    S.multiSel.clear();
    S.undoStack = [];
    S.redoStack = [];
    S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
    Object.keys(S.counters).forEach((k) => delete S.counters[k]);
    S.vdResults = null;
    currentProjectId = null;
    currentProjectName = null;
    updateProjectNameUI();
    render();
    renderBg();
    updateProps();
    updateStat();
    hideProjectScreen();
    toast("Proiect nou creat", "ok");
  }
  function showProjectManagerAfterAuth() {
    const { currentUser: currentUser2 } = getCloudFunctions();
    Promise.all([dbGetAll("projects"), dbGet("autosave", "current_autosave")]).then(([projects, autoSave]) => {
      const hasProjects = projects?.length > 0;
      const hasRecovery = autoSave?.data?.EL?.length > 0;
      if (hasProjects || hasRecovery || currentUser2) showProjectManager();
    }).catch((e) => console.warn("DB init check failed:", e));
  }
  var ecDB, currentProjectId, currentProjectName, autoSaveTimer, autoSaveInterval, hasUnsavedChanges, _psProjects;
  var init_project = __esm({
    "src/project.js"() {
      init_state();
      init_renderer();
      init_ui();
      init_utils();
      init_auth();
      ecDB = null;
      currentProjectId = null;
      currentProjectName = null;
      autoSaveTimer = null;
      autoSaveInterval = 6e4;
      hasUnsavedChanges = false;
      _psProjects = [];
      window.addEventListener("beforeunload", (e) => {
        if (hasUnsavedChanges && (S.EL.length > 0 || S.CN.length > 0)) {
          doAutoSave();
          e.preventDefault();
          e.returnValue = "";
        }
      });
      window.recoverAutoSave = recoverAutoSave;
      window.dismissRecovery = dismissRecovery;
      window.deleteProject = deleteProject;
      window.renameProject = renameProject;
    }
  });

  // src/interaction.js
  function _renderMeasure(pt2 = null) {
    const layer = document.getElementById("MEAS");
    if (!layer) return;
    if (!_mpt1) {
      layer.innerHTML = "";
      return;
    }
    const dark = !S.lightMode;
    const mC = dark ? "#ffd700" : "#b85000";
    if (!pt2) {
      layer.innerHTML = `
      <circle cx="${_mpt1.x.toFixed(1)}" cy="${_mpt1.y.toFixed(1)}" r="4"
              fill="${mC}" opacity="0.9"/>
      <line x1="${(_mpt1.x - 10).toFixed(1)}" y1="${_mpt1.y.toFixed(1)}"
            x2="${(_mpt1.x + 10).toFixed(1)}" y2="${_mpt1.y.toFixed(1)}"
            stroke="${mC}" stroke-width="1.3"/>
      <line x1="${_mpt1.x.toFixed(1)}" y1="${(_mpt1.y - 10).toFixed(1)}"
            x2="${_mpt1.x.toFixed(1)}" y2="${(_mpt1.y + 10).toFixed(1)}"
            stroke="${mC}" stroke-width="1.3"/>`;
      return;
    }
    const dx = pt2.x - _mpt1.x, dy = pt2.y - _mpt1.y;
    const dist = Math.hypot(dx, dy);
    const ppm = S.pxPerMeter || 5;
    const distM = (dist / ppm).toFixed(2);
    const mx = (_mpt1.x + pt2.x) / 2, my = (_mpt1.y + pt2.y) / 2;
    const ux = dist > 0 ? dx / dist : 1, uy = dist > 0 ? dy / dist : 0;
    const lx = (mx - uy * 16).toFixed(1), ly = (my + ux * 16).toFixed(1);
    layer.innerHTML = `
    <line x1="${_mpt1.x.toFixed(1)}" y1="${_mpt1.y.toFixed(1)}"
          x2="${pt2.x.toFixed(1)}" y2="${pt2.y.toFixed(1)}"
          stroke="${mC}" stroke-width="1.6" stroke-dasharray="7,4"/>
    <circle cx="${_mpt1.x.toFixed(1)}" cy="${_mpt1.y.toFixed(1)}" r="3.5"
            fill="${mC}" opacity="0.9"/>
    <circle cx="${pt2.x.toFixed(1)}" cy="${pt2.y.toFixed(1)}" r="3.5"
            fill="${mC}" opacity="0.9"/>
    <text x="${lx}" y="${ly}"
          font-size="11" fill="${mC}" font-family="JetBrains Mono,monospace"
          font-weight="700" text-anchor="middle"
          paint-order="stroke" stroke="#000a" stroke-width="2.5"
          stroke-linecap="round">${distM} m</text>`;
  }
  function toggleMeasure() {
    if (S.mode === "measure") {
      setMode("select");
      _mpt1 = null;
      _renderMeasure();
    } else {
      setMode("measure");
      _mpt1 = null;
      _renderMeasure();
      toast("Clic punct 1, clic punct 2 \u2192 distan\u021B\u0103. Esc = anulare.", "ok");
    }
    const btn = document.getElementById("btn-measure");
    if (btn) btn.classList.toggle("active", S.mode === "measure");
  }
  function onDn(e) {
    const pt = svgPt(e);
    if (e.button === 2) {
      if (S.mode === "connect" && S.connStart) finalConn();
      else if (S.mode === "draw_poly") {
        if (S.arrPts.length >= 2) {
          saveState("polyline");
          S.EL.push({ id: Date.now() + Math.floor(Math.random() * 99999), type: "polyline", x: 0, y: 0, points: [...S.arrPts], color: "#00cfff", arrowEnd: true, arrowStart: false, lineType: "solid", strokeWidth: 2.5 });
        }
        S.arrPts = [];
        setMode("select");
        render();
      } else setMode("select");
      return;
    }
    if (e.button === 1) {
      e.preventDefault();
      S.panning = true;
      S.panS = { x: e.clientX, y: e.clientY };
      return;
    }
    if (S.mode === "export_box") {
      S.exportRectStart = { x: pt.x, y: pt.y };
      return;
    }
    if (S.mode === "calibrate") {
      S.calibPts.push({ x: pt.x, y: pt.y });
      if (S.calibPts.length === 1) toast("Click Punctul 2...", "ac");
      if (S.calibPts.length === 2) {
        S.tempCalibLenPx = Math.hypot(S.calibPts[1].x - S.calibPts[0].x, S.calibPts[1].y - S.calibPts[0].y);
        if (S.tempCalibLenPx < 1) {
          toast("Distan\u021B\u0103 prea mic\u0103. Anulat.", "w");
          Promise.resolve().then(() => (init_renderer(), renderer_exports)).then((m) => m.closeCalib());
          return;
        }
        document.getElementById("calib-modal").style.display = "flex";
        document.getElementById("calib-input").value = "";
        setTimeout(() => document.getElementById("calib-input").focus(), 50);
      }
      return;
    }
    if (S.mode === "place") {
      addElem(pt.x, pt.y);
      return;
    }
    if (S.mode === "mt_span") {
      placeMTSpanAt(pt.x, pt.y);
      return;
    }
    if (S.mode === "measure") {
      if (!_mpt1) {
        _mpt1 = { x: pt.x, y: pt.y };
        _renderMeasure();
      } else {
        _renderMeasure(pt);
        const d = (Math.hypot(pt.x - _mpt1.x, pt.y - _mpt1.y) / (S.pxPerMeter || 5)).toFixed(2);
        toast(`${d} m`, "ok");
        _mpt1 = null;
      }
      return;
    }
    if (S.mode === "draw_poly") {
      S.arrPts.push({ x: sn(pt.x), y: sn(pt.y) });
      if (S.arrPts.length === 1) toast("Click st\xE2nga pt. puncte, click dreapta pt. finalizare", "ac");
      return;
    }
    if (S.mode === "connect" && S.connStart) {
      let cur = { x: sn(pt.x), y: sn(pt.y) };
      if (S.orthoOn || S.shiftOn) {
        const last = S.connPts[S.connPts.length - 1];
        cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: sn(pt.x), y: last.y } : { x: last.x, y: sn(pt.y) };
      }
      S.connPts.push(cur);
      return;
    }
    const tg = e.target.closest("g.el"), hb = e.target.closest(".hb");
    if (!tg && !hb && !S.bgData.locked && S.mode === "select" && S.bgData.url) {
      if (pt.x >= S.bgData.x && pt.x <= S.bgData.x + S.bgData.w && pt.y >= S.bgData.y && pt.y <= S.bgData.y + S.bgData.h) {
        S.draggingBg = true;
        S.dragOff = { x: pt.x - S.bgData.x, y: pt.y - S.bgData.y };
        return;
      }
    }
    if (tg || hb) return;
    if (S.mode === "select") {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        S.selRectStart = { x: pt.x, y: pt.y };
        S.selRect = null;
        S.panning = false;
      } else {
        S.multiSel.clear();
        S.sel = null;
        updateProps();
        S.selRectStart = null;
        S.panning = true;
      }
      S.panS = { x: e.clientX, y: e.clientY };
      render();
    }
  }
  function onMv(e) {
    const pt = svgPt(e);
    document.getElementById("stxy").textContent = `X:${Math.round(pt.x)} Y:${Math.round(pt.y)}`;
    if (S.mode === "export_box" && S.exportRectStart) {
      const dx = pt.x - S.exportRectStart.x, dy = pt.y - S.exportRectStart.y;
      const er = document.getElementById("export-rect");
      er.setAttribute("display", "block");
      er.setAttribute("x", Math.min(S.exportRectStart.x, pt.x));
      er.setAttribute("y", Math.min(S.exportRectStart.y, pt.y));
      er.setAttribute("width", Math.abs(dx));
      er.setAttribute("height", Math.abs(dy));
      return;
    }
    if (S.draggingBg) {
      S.bgData.x = pt.x - S.dragOff.x;
      S.bgData.y = pt.y - S.dragOff.y;
      const img = document.getElementById("html-bg-img");
      if (img) {
        img.style.left = S.bgData.x + "px";
        img.style.top = S.bgData.y + "px";
      }
      return;
    }
    if (S.mode === "measure" && _mpt1) {
      _renderMeasure(pt);
      return;
    }
    if (S.mode === "calibrate" && S.calibPts.length === 1) {
      const tp = document.getElementById("tpoly");
      tp.style.display = "block";
      tp.setAttribute("points", `${S.calibPts[0].x},${S.calibPts[0].y} ${pt.x},${pt.y}`);
      return;
    }
    if (S.mode === "draw_poly" && S.arrPts.length > 0) {
      const tp = document.getElementById("tpoly");
      tp.style.display = "block";
      let cur = { x: pt.x, y: pt.y };
      if (S.orthoOn || S.shiftOn) {
        const last = S.arrPts[S.arrPts.length - 1];
        cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: pt.y };
      }
      tp.setAttribute("points", [...S.arrPts, cur].map((p) => `${p.x},${p.y}`).join(" "));
      return;
    }
    if (S.mode === "connect" && S.connStart) {
      const tp = document.getElementById("tpoly");
      tp.style.display = "block";
      let cur = { x: pt.x, y: pt.y };
      const tdHov = e.target.closest(".td");
      if (tdHov) {
        const pg = tdHov.closest("g.el");
        if (pg) {
          const pe = S.EL.find((x) => x.id === parseInt(pg.dataset.eid));
          if (pe) {
            const lcx = parseFloat(tdHov.dataset.lcx), lcy = parseFloat(tdHov.dataset.lcy);
            const wp = termWorldPos(pe, lcx, lcy);
            cur = { x: wp.x, y: wp.y };
          }
        }
      } else if (S.orthoOn || S.shiftOn) {
        const last = S.connPts[S.connPts.length - 1];
        cur = Math.abs(pt.x - last.x) > Math.abs(pt.y - last.y) ? { x: pt.x, y: last.y } : { x: last.x, y: sn(pt.y) };
      }
      tp.setAttribute("points", [...S.connPts, cur].map((p) => `${p.x},${p.y}`).join(" "));
      return;
    }
    if (S.dragging && S.dragEl) {
      let nx = sn(pt.x - S.dragOff.x), ny = sn(pt.y - S.dragOff.y);
      const GL = document.getElementById("GL");
      GL.innerHTML = "";
      S.EL.forEach((e2) => {
        if (e2.id === S.dragEl.id) return;
        if (Math.abs(nx - e2.x) < 8) {
          nx = e2.x;
          GL.innerHTML += `<line x1="${e2.x}" y1="${ny - 200}" x2="${e2.x}" y2="${ny + 200}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`;
        }
        if (Math.abs(ny - e2.y) < 8) {
          ny = e2.y;
          GL.innerHTML += `<line x1="${nx - 200}" y1="${e2.y}" x2="${nx + 200}" y2="${e2.y}" stroke="#00cfff" stroke-width=".7" stroke-dasharray="4,4" opacity=".4"/>`;
        }
      });
      S.dragEl.x = nx;
      S.dragEl.y = ny;
      updateConnectedCables(S.dragEl);
      render();
      return;
    }
    if (S.dragging && !S.dragEl && S.multiDragStart) {
      const dx = sn(pt.x - S.multiDragStart.mouseX), dy = sn(pt.y - S.multiDragStart.mouseY);
      if (S.multiDragStart.origConnPaths) {
        S.multiDragStart.origConnPaths.forEach((orig) => {
          const cn = S.CN.find((x) => x.id === orig.id);
          if (cn) {
            for (let i = 0; i < cn.path.length; i++) {
              cn.path[i].x = orig.path[i].x + dx;
              cn.path[i].y = orig.path[i].y + dy;
            }
          }
        });
      }
      S.multiDragStart.origPositions.forEach((orig) => {
        const el = S.EL.find((x) => x.id === orig.id);
        if (el) {
          el.x = orig.x + dx;
          el.y = orig.y + dy;
        }
      });
      const selIds = new Set(S.multiDragStart.origPositions.map((o) => o.id));
      S.CN.forEach((cn) => {
        if (S.multiSel.has(cn.id)) return;
        const fromSel = selIds.has(cn.fromElId), toSel = selIds.has(cn.toElId);
        if (fromSel && toSel) {
          if (!cn._origPath) cn._origPath = JSON.parse(JSON.stringify(cn.path));
          for (let i = 0; i < cn.path.length; i++) {
            cn.path[i].x = cn._origPath[i].x + dx;
            cn.path[i].y = cn._origPath[i].y + dy;
          }
        } else if (fromSel || toSel) {
          if (cn.fromElId) {
            const fromEl = S.EL.find((x) => x.id === cn.fromElId);
            if (fromEl && cn.fromTerm) {
              const wp = termWorldPos(fromEl, cn.fromTerm.cx, cn.fromTerm.cy);
              cn.path[0] = { x: wp.x, y: wp.y };
            }
          }
          if (cn.toElId) {
            const toEl = S.EL.find((x) => x.id === cn.toElId);
            if (toEl && cn.toTerm) {
              const wp = termWorldPos(toEl, cn.toTerm.cx, cn.toTerm.cy);
              cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y };
            }
          }
        }
      });
      render();
      return;
    }
    if (S.vxDrag && S.vxConn) {
      if (S.vxConn.type === "polyline") S.vxConn.points[S.vxIdx] = { x: pt.x, y: pt.y };
      else S.vxConn.path[S.vxIdx] = { x: pt.x, y: pt.y };
      render();
      return;
    }
    if (S.selRectStart && !S.dragging && !S.panning) {
      const dx = pt.x - S.selRectStart.x, dy = pt.y - S.selRectStart.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        S.selRect = { x1: Math.min(S.selRectStart.x, pt.x), y1: Math.min(S.selRectStart.y, pt.y), x2: Math.max(S.selRectStart.x, pt.x), y2: Math.max(S.selRectStart.y, pt.y) };
        const sr = document.getElementById("sel-rect");
        sr.setAttribute("display", "block");
        sr.setAttribute("x", S.selRect.x1);
        sr.setAttribute("y", S.selRect.y1);
        sr.setAttribute("width", S.selRect.x2 - S.selRect.x1);
        sr.setAttribute("height", S.selRect.y2 - S.selRect.y1);
        return;
      }
    }
    if (S.panning) {
      S.view.x += e.clientX - S.panS.x;
      S.view.y += e.clientY - S.panS.y;
      S.panS = { x: e.clientX, y: e.clientY };
      applyView();
    }
  }
  function onUp(e) {
    if (S.draggingBg) {
      S.draggingBg = false;
      return;
    }
    if (S.dragging) {
      const GL = document.getElementById("GL");
      if (GL) GL.innerHTML = "";
    }
    if (S.mode === "export_box" && S.exportRectStart) {
      const pt = svgPt(e);
      const minX = Math.min(S.exportRectStart.x, pt.x), minY = Math.min(S.exportRectStart.y, pt.y);
      const maxX = Math.max(S.exportRectStart.x, pt.x), maxY = Math.max(S.exportRectStart.y, pt.y);
      document.getElementById("export-rect").setAttribute("display", "none");
      S.exportRectStart = null;
      if (maxX - minX > 10 && maxY - minY > 10) {
        const bounds = { minX, minY, maxX, maxY }, type = S.pendExport;
        setMode("select");
        if (type === "png") doExportPNG(bounds);
        if (type === "pdf") doExportPDF(bounds);
        if (type === "svg") doExportSVG(bounds);
      } else {
        toast("Selec\u021Bie prea mic\u0103. Export anulat.", "w");
        setMode("select");
      }
      return;
    }
    if (S.selRect) {
      document.getElementById("sel-rect").setAttribute("display", "none");
      S.EL.forEach((el) => {
        if (el.x >= S.selRect.x1 && el.x <= S.selRect.x2 && el.y >= S.selRect.y1 && el.y <= S.selRect.y2) S.multiSel.add(el.id);
      });
      S.CN.forEach((cn) => {
        const inRect = cn.path.some((p) => p.x >= S.selRect.x1 && p.x <= S.selRect.x2 && p.y >= S.selRect.y1 && p.y <= S.selRect.y2);
        if (inRect) S.multiSel.add(cn.id);
      });
      if (S.multiSel.size > 0) {
        S.sel = null;
        toast(S.multiSel.size + " elem. selectate", "ac");
      }
      S.selRect = null;
      render();
      updateProps();
    }
    if (S.multiDragStart) {
      S.multiDragStart.origPositions.forEach((orig) => {
        const el = S.EL.find((x) => x.id === orig.id);
        if (el) updateConnectedCables(el);
      });
    }
    S.CN.forEach((cn) => {
      delete cn._origPath;
    });
    S.selRectStart = null;
    S.panning = false;
    S.dragging = false;
    S.dragEl = null;
    S.multiDragStart = null;
    S.vxDrag = false;
    S.vxConn = null;
    render();
    if (!(S.mode === "connect" && S.connStart) && !(S.mode === "calibrate" && S.calibPts.length === 1) && !(S.mode === "draw_poly"))
      document.getElementById("tpoly").style.display = "none";
  }
  function getCircuitChain(cdElId, circuitNum) {
    const results = { cables: [], elements: [], totalLength: 0, totalConsumatori: 0, branches: [] };
    const visitedCables = /* @__PURE__ */ new Set();
    const seedCables = S.CN.filter(
      (cn) => cn.fromElId === cdElId && cn.fromCircuit === circuitNum || cn.toElId === cdElId && cn.toCircuit === circuitNum
    );
    if (!seedCables.length) return results;
    const traceGroup = seedCables[0].circuitGroup || `C${circuitNum}`;
    function getOtherEnd(cn, fromId) {
      if (cn.fromElId === fromId) return cn.toElId;
      if (cn.toElId === fromId) return cn.fromElId;
      return cn.from || null;
    }
    function dfs(elId, cameFromCable, accLen, accCons, pathLabels, depth) {
      if (depth > 50) return;
      const currentEl = S.EL.find((x) => x.id === elId);
      if (currentEl) {
        const currentTerm = cameFromCable && cameFromCable.fromElId === elId ? cameFromCable.fromTerm : cameFromCable && cameFromCable.toElId === elId ? cameFromCable.toTerm : null;
        if (!isConnectionActive(currentEl, currentTerm)) return false;
      }
      const cables = S.CN.filter((cn) => cn.id !== (cameFromCable ? cameFromCable.id : null) && (cn.fromElId === elId || cn.toElId === elId || cn.from === elId));
      const nextCables = cables.filter((cn) => {
        if (visitedCables.has(cn.id)) return false;
        if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circuitNum.toString()) return false;
        if (cn.fromElId === cdElId && cn.fromCircuit !== circuitNum || cn.toElId === cdElId && cn.toCircuit !== circuitNum) return false;
        const outTerm = cn.fromElId === elId ? cn.fromTerm : cn.toElId === elId ? cn.toTerm : null;
        if (currentEl && !isConnectionActive(currentEl, outTerm)) return false;
        return true;
      });
      if (nextCables.length === 0) {
        results.branches.push({ path: [...pathLabels], length: accLen, consumatori: accCons });
        return;
      }
      nextCables.forEach((cn) => {
        visitedCables.add(cn.id);
        if (!results.cables.find((x) => x.id === cn.id)) {
          results.cables.push(cn);
          results.totalLength += parseFloat(cn.length) || 0;
        }
        const nextElId = getOtherEnd(cn, elId), nextEl = nextElId ? S.EL.find((x) => x.id === nextElId) : null;
        const cLen = parseFloat(cn.length) || 0, newLen = accLen + cLen;
        let cons = 0;
        if (nextEl) {
          if (nextEl.cons_dict) {
            if (nextEl.cons_dict[traceGroup] !== void 0) cons = parseInt(nextEl.cons_dict[traceGroup]) || 0;
            else if (nextEl.cons_dict["Implicit"] !== void 0) cons = parseInt(nextEl.cons_dict["Implicit"]) || 0;
          } else {
            cons = parseInt(nextEl.consumatori) || 0;
          }
        }
        const newCons = accCons + cons;
        if (nextEl && !results.elements.find((x) => x.id === nextEl.id)) {
          results.elements.push(nextEl);
          results.totalConsumatori += cons;
        }
        const newPath = [...pathLabels, (nextEl ? nextEl.label : cn.label) || "?"];
        let shouldContinue = true;
        if (nextEl) {
          const childTerm = cn.fromElId === nextElId ? cn.fromTerm : cn.toElId === nextElId ? cn.toTerm : null;
          if (!isConnectionActive(nextEl, childTerm)) shouldContinue = false;
        }
        if (nextElId && shouldContinue) dfs(nextElId, cn, newLen, newCons, newPath, depth + 1);
        else results.branches.push({ path: newPath, length: newLen, consumatori: newCons });
      });
    }
    dfs(cdElId, null, 0, 0, [], 0);
    return results;
  }
  function initKeyboard() {
    window.addEventListener("keydown", (e) => {
      S.shiftOn = e.shiftKey;
      const ae = document.activeElement;
      const inp = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && !inp) {
        if (e.key === "z") {
          e.preventDefault();
          Promise.resolve().then(() => (init_element_manager(), element_manager_exports)).then((m) => m.undo());
          return;
        }
        if (e.key === "y") {
          e.preventDefault();
          Promise.resolve().then(() => (init_element_manager(), element_manager_exports)).then((m) => m.redo());
          return;
        }
        if (e.key === "c") {
          e.preventDefault();
          copyEl();
          return;
        }
        if (e.key === "v") {
          e.preventDefault();
          pasteEl();
          return;
        }
        if (e.key === "s" && e.shiftKey) {
          e.preventDefault();
          saveAsNew();
          return;
        }
        if (e.key === "s") {
          e.preventDefault();
          save();
          return;
        }
      }
      if (!inp) {
        if (e.key === "Delete" || e.key === "Backspace") delSel();
        if (e.key === "Escape") {
          S.multiSel.clear();
          S.sel = null;
          setMode("select");
          render();
          updateProps();
          _mpt1 = null;
          _renderMeasure();
        }
        if (e.key === "s") setMode("select");
        if (e.key === "c") setMode("connect");
        if (e.key === "r") rotateSel(90);
        if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          S.multiSel.clear();
          S.EL.forEach((el) => S.multiSel.add(el.id));
          S.sel = null;
          render();
          updateProps();
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      S.shiftOn = e.shiftKey;
    });
  }
  function setMultiFlow(dir) {
    saveState("flux multiplu");
    S.CN.forEach((c) => {
      if (S.multiSel.has(c.id)) c.flowDir = dir || void 0;
    });
    renderFlowLayer();
    render();
    const cnt = [...S.multiSel].filter((id) => S.CN.find((c) => c.id === id)).length;
    const msg = dir === "fwd" ? `\u25B6 Flux normal pe ${cnt} cabluri` : dir === "rev" ? `\u25C0 Flux invers pe ${cnt} cabluri` : "Anima\u021Bie flux oprit\u0103";
    toast(msg, "ok");
    if (dir && !S.flowAnimOn) toggleFlowAnim();
  }
  var _mpt1;
  var init_interaction = __esm({
    "src/interaction.js"() {
      init_state();
      init_utils();
      init_elements();
      init_renderer();
      init_element_manager();
      init_ui();
      init_export();
      init_project();
      _mpt1 = null;
    }
  });

  // src/ui.js
  function updateProps() {
    const pEl = document.getElementById("props"), pb = document.getElementById("pb");
    if (!S.sel && S.multiSel.size === 0) {
      pEl.classList.add("hidden");
      return;
    }
    if (!S.sel && S.multiSel.size > 0) {
      pEl.classList.remove("hidden");
      document.getElementById("ps").textContent = `${S.multiSel.size} elem. selectate`;
      document.getElementById("pt").textContent = "SELEC\u021AIE MULTIPLA";
      let html = `<div class="psec" style="padding:10px"><div style="color:var(--text2);font-size:10px;line-height:1.6"><b style="color:var(--accent)">${S.multiSel.size}</b> elemente selectate<br>Trage pentru mutare grupat\u0103<br><span style="color:var(--text3)">CTRL+click pentru ad\u0103ugare/eliminare</span></div>
      <div style="margin-top:8px"><div class="pl">Seteaz\u0103 Stare pe Toate</div><select class="pi" id="pm-stare">
        <option value="">-- Nu modifica --</option>
        <option value="existent">\u2714 Existent</option>
        <option value="proiectat_racordare" style="color:#ef4444">\u{1F534} Proiectat \u2014 Tarif Racordare</option>
        <option value="intarire_inlocuire" style="color:#a855f7">\u{1F7E3} \xCEnt\u0103rire \u2014 \xCEnlocuire conductor</option>
        <option value="intarire_nou" style="color:#3b82f6">\u{1F535} \xCEnt\u0103rire \u2014 Circuit/cablu nou</option>
        <option value="coexistenta" style="color:#eab308">\u{1F7E1} Lucr\u0103ri Coexisten\u021B\u0103</option>
        <option value="demontat" style="color:#6b7280">\u26D4 Demontat</option>
      </select></div>
    </div>`;
      const selCns = S.CN.filter((c) => S.multiSel.has(c.id));
      if (selCns.length > 0) {
        const tcOpts = ["Clasic Al", "Torsadat Al", "Cablu Al", "Cablu Cu", "OL-AL"];
        const secOpts = [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
        const secOptHtml = secOpts.map((s) => `<option value="${s}">${s} mm\xB2</option>`).join("");
        html += `<div class="psec"><div class="psh">\u26A1 Editare Multipl\u0103 Cabluri (${selCns.length})</div>
        <div class="pr"><div class="pl">Grup Circuit</div><input class="pi" id="pm-cgroup" placeholder="Tasteaz\u0103 \u0219i apas\u0103 Enter..."></div>
        <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="pm-tc"><option value="">-- Nu modifica --</option>${tcOpts.map((t) => `<option value="${t}">${t}</option>`).join("")}</select></div>
        <div class="pr"><div class="pl">Sec\u021Biune (mm\xB2)</div><select class="pi" id="pm-sec"><option value="">-- Nu modifica --</option>${secOptHtml}</select></div>
        <div class="pr"><div class="pl">Tip re\u021Bea</div><select class="pi" id="pm-tr"><option value="">-- Nu modifica --</option><option value="Trifazat">Trifazat (3\xD7Un=0.4kV)</option><option value="Bifazat">Bifazat (2\xD7Un=0.4kV)</option><option value="Monofazat">Monofazat (Un=0.23kV)</option></select></div>
        <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="pm-lt"><option value="">-- Nu modifica --</option><option value="solid">LEA \u2014 Aerian</option><option value="dashed">LES \u2014 Subteran</option></select></div>
        <div class="pr"><div class="pl">\u26A1 Flux putere (anima\u021Bie)</div>
          <div style="display:flex;gap:4px">
            <button onclick="setMultiFlow('fwd')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid rgba(234,179,8,.35);background:rgba(234,179,8,.08);color:#eab308;cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">\u25B6 Normal</button>
            <button onclick="setMultiFlow('rev')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid rgba(234,179,8,.35);background:rgba(234,179,8,.08);color:#eab308;cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">\u25C0 Invers</button>
            <button onclick="setMultiFlow('')" style="flex:1;padding:5px 4px;border-radius:5px;border:1px solid var(--border2);background:var(--bg3);color:var(--text3);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">\u2715 Opre\u0219te</button>
          </div>
        </div>
        <div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="pm-crow-color"></div></div>
      </div>`;
      }
      const selNodes = S.EL.filter((e) => S.multiSel.has(e.id) && (e.type.startsWith("stalp_") || e.type.startsWith("firida_")));
      if (selNodes.length > 0) {
        html += `<div class="psec"><div class="psh">\u{1F465} Editare Rapid\u0103 Consumatori (${selNodes.length})</div><div style="padding:6px;max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">`;
        selNodes.forEach((node) => {
          const connectedCables = S.CN.filter((c) => c.fromElId === node.id || c.toElId === node.id || c.from === node.id);
          let groups = [...new Set(connectedCables.map((c) => c.circuitGroup && c.circuitGroup.trim() !== "" ? c.circuitGroup.trim() : "Implicit"))];
          if (groups.length === 0) groups = ["Implicit"];
          if (!node.cons_dict) node.cons_dict = {};
          if (node.consumatori && Object.keys(node.cons_dict).length === 0) node.cons_dict["Implicit"] = node.consumatori;
          html += `<div style="background:var(--bg2);padding:5px 6px;border:1px solid var(--border2);border-radius:5px;display:flex;flex-direction:column;gap:5px">
                    <div style="font-size:9.5px;color:var(--accent);font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${node.label}">${node.label || "Nod"}</div>
                    <div style="display:flex;flex-wrap:wrap;gap:5px">`;
          groups.forEach((g) => {
            let val = node.cons_dict[g] || 0;
            let dispName = g === "Implicit" ? "Gen." : g;
            html += `<div style="display:flex;align-items:center;gap:4px;background:var(--bg3);padding:2px 4px;border-radius:4px;border:1px solid var(--border)">
                      <span style="font-size:8px;color:var(--text2);font-weight:bold">${dispName}</span>
                      <input type="number" class="pi p-multi-cons" data-id="${node.id}" data-grp="${g}" style="width:40px;padding:2px 4px;font-size:10px;text-align:center" min="0" value="${val}">
                   </div>`;
          });
          html += `</div></div>`;
        });
        html += `</div></div>`;
      }
      html += `<div style="display:flex;gap:5px"><button class="bprop bdup" onclick="copyEl();pasteEl()">\u29C9 Duplic\u0103 Toate</button><button class="bprop bdel" onclick="delSel()">\u{1F5D1} \u0218terge Toate</button></div>`;
      pb.innerHTML = html;
      if (selCns.length > 0) {
        const updMultiCn = (k, v) => {
          if (v === "") return;
          saveState("editare multipla");
          S.CN.forEach((c) => {
            if (S.multiSel.has(c.id)) c[k] = v;
          });
          render();
        };
        document.getElementById("pm-cgroup").addEventListener("change", (ev) => updMultiCn("circuitGroup", ev.target.value));
        document.getElementById("pm-tc").addEventListener("change", (ev) => updMultiCn("tipConductor", ev.target.value));
        document.getElementById("pm-sec").addEventListener("change", (ev) => {
          if (ev.target.value !== "") updMultiCn("sectiune", parseFloat(ev.target.value));
        });
        document.getElementById("pm-tr").addEventListener("change", (ev) => updMultiCn("tipRetea", ev.target.value));
        document.getElementById("pm-lt").addEventListener("change", (ev) => updMultiCn("lineType", ev.target.value));
        buildColors(null, (c) => {
          saveState("culoare multipla");
          S.multiSel.forEach((id) => {
            const el2 = S.EL.find((e) => e.id === id);
            if (el2) el2.color = c;
            const cn2 = S.CN.find((x) => x.id === id);
            if (cn2) cn2.color = c;
          });
          render();
        }, "pm-crow-color", false);
      }
      document.getElementById("pm-stare")?.addEventListener("change", (ev) => {
        const v = ev.target.value;
        if (!v) return;
        saveState("stare multipl\u0103");
        const colorMap = { proiectat_racordare: "#ef4444", intarire_inlocuire: "#a855f7", intarire_nou: "#3b82f6", coexistenta: "#eab308", demontat: "#6b7280" };
        S.multiSel.forEach((id) => {
          const el2 = S.EL.find((e) => e.id === id);
          if (el2) {
            if (v === "coexistenta" && !el2.type.startsWith("stalp_")) return;
            el2.stare = v;
            if (colorMap[v]) el2.color = colorMap[v];
            if (v === "existent") el2.color = null;
          }
          const cn2 = S.CN.find((c) => c.id === id);
          if (cn2) {
            if (v === "coexistenta") return;
            if (v === "intarire_inlocuire" && (!cn2.stare || cn2.stare === "existent") && !cn2.oldTipConductor) {
              cn2.oldTipConductor = cn2.tipConductor || "Clasic Al";
              cn2.oldSectiune = cn2.sectiune || 16;
              cn2.oldTipRetea = cn2.tipRetea || "Trifazat";
            }
            cn2.stare = v;
            if (colorMap[v]) cn2.color = colorMap[v];
            if (v === "existent" || v === "intarire_nou") {
              if (v === "existent") cn2.color = "#ef4444";
              delete cn2.oldTipConductor;
              delete cn2.oldSectiune;
              delete cn2.oldTipRetea;
            }
          }
        });
        render();
        updateProps();
      });
      if (selNodes.length > 0) {
        document.querySelectorAll(".p-multi-cons").forEach((inp) => {
          inp.addEventListener("input", (ev) => {
            const id = parseInt(ev.target.dataset.id);
            const grp = ev.target.dataset.grp;
            const val = parseInt(ev.target.value) || 0;
            const node = S.EL.find((e) => e.id === id);
            if (node) {
              if (!node.cons_dict) node.cons_dict = {};
              node.cons_dict[grp] = val;
              let total = 0;
              for (let key in node.cons_dict) total += node.cons_dict[key];
              node.consumatori = total;
              render();
            }
          });
          inp.addEventListener("change", () => saveState("editare consumatori multipla"));
        });
      }
      return;
    }
    const el = S.EL.find((x) => x.id === S.sel), cn = S.CN.find((x) => x.id === S.sel);
    if (!el && !cn) {
      pEl.classList.add("hidden");
      return;
    }
    pEl.classList.remove("hidden");
    document.getElementById("ps").textContent = `ID\xB7${(el || cn).id}`;
    document.getElementById("pt").textContent = el ? "ELEMENT" : "CONEXIUNE";
    if (el) {
      let circuitHtml = "";
      if (el.type === "cd4" || el.type === "cd5" || el.type === "cd8" || el.type === "ptab_2t" || el.type === "ptab_1t") {
        const np = el.type === "ptab_2t" ? 16 : el.type === "ptab_1t" ? 8 : parseInt(el.type.replace("cd", ""));
        let rows = "";
        for (let i = 1; i <= np; i++) {
          const chain = getCircuitChain(el.id, i), hasData = chain.cables.length > 0;
          if (!hasData) {
            rows += `<tr style="opacity:.35"><td style="color:var(--accent);font-weight:700;padding:3px 4px">C${i}</td><td colspan="3" style="padding:3px 4px;color:var(--text3)">\u2014 neconectat \u2014</td></tr>`;
          } else {
            rows += `<tr style="border-top:1px solid var(--border2)"><td style="color:var(--accent);font-weight:700;padding:3px 4px;vertical-align:top">C${i}</td><td colspan="3" style="padding:1px 4px">`;
            if (chain.branches.length === 0) {
              rows += `<div style="display:flex;gap:6px;align-items:center;padding:2px 0"><span style="color:var(--accentg);font-weight:700">${chain.totalLength.toFixed(1)}m</span>${chain.totalConsumatori > 0 ? `<span style="color:#ff9f43;font-weight:700">\u{1F465}${chain.totalConsumatori}</span>` : ""}<span style="color:var(--text2);font-size:7px">${chain.elements.map((e) => e.label || "?").join("\u2192") || "\u2014"}</span></div>`;
            } else {
              chain.branches.forEach((br, bi) => {
                const isMulti = chain.branches.length > 1;
                rows += `<div style="display:flex;gap:5px;align-items:center;padding:2px 0;${isMulti && bi > 0 ? "border-top:1px dashed var(--border)" : ""}">${isMulti ? `<span style="color:var(--text3);font-size:7px;min-width:14px">\u21B3</span>` : ""}<span style="color:var(--accentg);font-weight:700;min-width:36px">${br.length.toFixed(1)}m</span>${br.consumatori > 0 ? `<span style="color:#ff9f43;font-weight:700">\u{1F465}${br.consumatori}</span>` : ""}<span style="color:var(--text2);font-size:7px;word-break:break-all">${br.path.join("\u2192") || "\u2014"}</span></div>`;
              });
            }
            rows += `</td></tr>`;
          }
        }
        circuitHtml = `<div class="psec"><div class="psh">\u26A1 Circuite CD \u2014 trasee &amp; deriva\u021Bii</div><div style="padding:4px 6px"><table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:8px"><tr><th style="text-align:left;padding:2px 4px;color:var(--text3);width:28px">Circ.</th><th style="text-align:left;padding:2px 4px;color:var(--text3)">Deriva\u021Bii / Lungime / Traseu</th></tr>${rows}</table></div></div>`;
      }
      let firidaHtml = "";
      if (el.type === "cd4" || el.type === "cd5" || el.type === "cd8") {
        const np = parseInt(el.type.replace("cd", ""));
        if (!el.fuses) el.fuses = new Array(np + 1).fill(true);
        const f = el.fuses;
        let circRows = "";
        for (let i = 1; i <= np; i++) {
          const on = f[i] !== false;
          circRows += `<label style="display:flex;justify-content:space-between;align-items:center;background:${on ? "var(--bg2)" : "rgba(255,61,113,.07)"};padding:5px 8px;border-radius:5px;border:1px solid ${on ? "var(--border2)" : "rgba(255,61,113,.3)"};cursor:pointer;transition:all .15s">
          <span style="font-size:9px;font-weight:700;color:${on ? "var(--text)" : "var(--danger)"}">C${i} \u2014 ${on ? "\u2705 \xCEnchis" : "\u{1F534} Deschis"}</span>
          <input type="checkbox" onchange="toggleFuse(${el.id},${i},this.checked)" ${on ? "checked" : ""}></label>`;
        }
        firidaHtml = `<div class="psec"><div class="psh">\u{1F50C} Separatoare Circuite CD</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px">
        <div style="display:flex;gap:4px;margin-bottom:2px">
          <button onclick="cdAllFuses(${el.id},${np},true)" style="flex:1;padding:5px;border-radius:5px;border:1px solid rgba(0,229,160,.3);background:rgba(0,229,160,.08);color:var(--accentg);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">\u2705 Toate \xEEnchise</button>
          <button onclick="cdAllFuses(${el.id},${np},false)" style="flex:1;padding:5px;border-radius:5px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">\u{1F534} Toate deschise</button>
        </div>${circRows}</div></div>`;
      } else if (el.type.startsWith("firida_")) {
        const f = el.fuses || [];
        let numIn = 0, numOut = 0;
        if (el.type === "firida_e2_4") {
          numIn = 2;
          numOut = 4;
        } else if (el.type === "firida_e3_4") {
          numIn = 3;
          numOut = 4;
        } else if (el.type === "firida_e3_0") {
          numIn = 3;
          numOut = 0;
        }
        let inpHtml = "", outpHtml = "";
        for (let i = 0; i < numIn; i++) inpHtml += `<label style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:4px 6px;border-radius:4px;border:1px solid var(--border2);cursor:pointer"><span style="font-size:9px;color:var(--text2)">${numIn === 2 ? i === 0 ? "Intrare St" : "Intrare Dr" : `Intrare ${i + 1}`}</span><input type="checkbox" onchange="toggleFuse(${el.id}, ${i}, this.checked)" ${f[i] !== false ? "checked" : ""}></label>`;
        for (let i = 0; i < numOut; i++) outpHtml += `<label style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:4px 6px;border-radius:4px;border:1px solid var(--border2);cursor:pointer"><span style="font-size:9px;color:var(--text2)">Plecare ${i + 1}</span><input type="checkbox" onchange="toggleFuse(${el.id}, ${numIn + i}, this.checked)" ${f[numIn + i] !== false ? "checked" : ""}></label>`;
        firidaHtml = `<div class="psec"><div class="psh">\u{1F50C} Siguran\u021Be Firid\u0103</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${inpHtml}</div>${numOut > 0 ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${outpHtml}</div>` : ""}</div></div>`;
      } else if (el.type === "ptab_1t") {
        const f = el.fuses || new Array(10).fill(true);
        let inpHtml = `<label class="flbl">MT Trafo <input type="checkbox" onchange="toggleFuse(${el.id}, 0, this.checked)" ${f[0] !== false ? "checked" : ""}></label><label class="flbl">JT General <input type="checkbox" onchange="toggleFuse(${el.id}, 1, this.checked)" ${f[1] !== false ? "checked" : ""}></label>`;
        let outpHtml = "";
        for (let i = 0; i < 8; i++) outpHtml += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${2 + i}, this.checked)" ${f[2 + i] !== false ? "checked" : ""}></label>`;
        firidaHtml = `<style>.flbl{display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:3px 5px;border-radius:4px;border:1px solid var(--border2);font-size:8.5px;color:var(--text);cursor:pointer}</style><div class="psec"><div class="psh">\u{1F50C} Siguran\u021Be PTAB 1T</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${inpHtml}</div><div style="border-top:1px solid var(--border2);margin:4px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${outpHtml}</div></div></div>`;
      } else if (el.type === "ptab_2t") {
        const f = el.fuses || new Array(21).fill(true);
        let tr1In = `<label class="flbl">MT Tr.1 <input type="checkbox" onchange="toggleFuse(${el.id}, 0, this.checked)" ${f[0] !== false ? "checked" : ""}></label><label class="flbl">JT Gen.1 <input type="checkbox" onchange="toggleFuse(${el.id}, 1, this.checked)" ${f[1] !== false ? "checked" : ""}></label>`;
        let tr1Out = "";
        for (let i = 0; i < 8; i++) tr1Out += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${2 + i}, this.checked)" ${f[2 + i] !== false ? "checked" : ""}></label>`;
        let tr2In = `<label class="flbl">MT Tr.2 <input type="checkbox" onchange="toggleFuse(${el.id}, 10, this.checked)" ${f[10] !== false ? "checked" : ""}></label><label class="flbl">JT Gen.2 <input type="checkbox" onchange="toggleFuse(${el.id}, 11, this.checked)" ${f[11] !== false ? "checked" : ""}></label>`;
        let tr2Out = "";
        for (let i = 0; i < 8; i++) tr2Out += `<label class="flbl">C${i + 1} <input type="checkbox" onchange="toggleFuse(${el.id}, ${12 + i}, this.checked)" ${f[12 + i] !== false ? "checked" : ""}></label>`;
        let cupla = `<label class="flbl" style="grid-column: span 2;text-align:center;justify-content:center;color:#ff9f43;font-weight:bold;gap:10px">CUPL\u0102 TRANSVERSAL\u0102 <input type="checkbox" onchange="toggleFuse(${el.id}, 20, this.checked)" ${f[20] !== false ? "checked" : ""}></label>`;
        firidaHtml = `<style>.flbl{display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:3px 5px;border-radius:4px;border:1px solid var(--border2);font-size:8.5px;color:var(--text);cursor:pointer}</style><div class="psec"><div class="psh">\u{1F50C} Siguran\u021Be PTAB 2T</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr1In}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr1Out}</div><div style="border-top:1px solid var(--border2);margin:2px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr2In}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${tr2Out}</div><div style="border-top:1px solid var(--border2);margin:2px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${cupla}</div></div></div>`;
      }
      let labelsHtml = "";
      if (el.type === "ptab_1t" || el.type === "trafo") {
        const t1 = el.trText || (el.type === "trafo" ? { mv: "16A", type: "PT Aerian", power: "160kVA", volt: "20/0.4kV", lv: "250A" } : { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" });
        labelsHtml = `<div class="psec"><div class="psh">\u{1F4DD} Etichete Interne Trafo</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t1-mv" value="${t1.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t1-lv" value="${t1.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t1-type" value="${t1.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t1-pow" value="${t1.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t1-volt" value="${t1.volt}"></div></div></div></div>`;
      } else if (el.type === "ptab_2t") {
        const t1 = el.trText1 || { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
        const t2 = el.trText2 || { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
        const cpText = el.cpText || "In=160A";
        labelsHtml = `<div class="psec"><div class="psh">\u{1F4DD} Etichete Trafo 1</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t1-mv" value="${t1.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t1-lv" value="${t1.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t1-type" value="${t1.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t1-pow" value="${t1.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t1-volt" value="${t1.volt}"></div></div></div></div><div class="psec"><div class="psh">\u{1F4DD} Etichete Trafo 2 & Cupl\u0103</div><div style="padding:6px;display:flex;flex-direction:column;gap:4px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><div><div class="pl">Sig. MT</div><input class="pi" id="p-t2-mv" value="${t2.mv}"></div><div><div class="pl">Sig. JT</div><input class="pi" id="p-t2-lv" value="${t2.lv}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px"><div><div class="pl">Tip</div><input class="pi" id="p-t2-type" value="${t2.type}"></div><div><div class="pl">Putere</div><input class="pi" id="p-t2-pow" value="${t2.power}"></div><div><div class="pl">Tensiune</div><input class="pi" id="p-t2-volt" value="${t2.volt}"></div><div style="margin-top:4px"><div class="pl">Text Cupl\u0103</div><input class="pi" id="p-cp-txt" value="${cpText}"></div></div></div>`;
      }
      let celMTHtml = "";
      if (el.type === "celula_linie_mt" || el.type === "celula_trafo_mt") {
        const cData = el.celMT || {};
        const isTrafo = el.type === "celula_trafo_mt";
        celMTHtml = `<div class="psec"><div class="psh">\u26A1 Parametri Celul\u0103 MT</div>
        <div class="pr"><div class="pl">Tensiune nominal\u0103</div><input class="pi" id="p-cmt-tensiune" value="${cData.tensiune || "20kV"}"></div>
        <div class="pr"><div class="pl">Curent nominal disjunctor</div><input class="pi" id="p-cmt-curent" value="${cData.curent || (isTrafo ? "16A" : "400A")}"></div>
        ${isTrafo ? `<div class="pr"><div class="pl">Putere transformator</div><input class="pi" id="p-cmt-putere" value="${cData.putere || "100kVA"}"></div><div class="pr"><div class="pl">Tensiune transformator</div><input class="pi" id="p-cmt-volt" value="${cData.volt || "20/0.4kV"}"></div>` : ""}
        <div class="pr" style="flex-direction:row;justify-content:space-between;align-items:center"><div class="pl">Disjunctor \xEEnchis</div><input type="checkbox" id="p-cmt-disj" ${cData.stare_disj !== false ? "checked" : ""} style="transform:scale(1.3)"></div>
        ${!isTrafo ? `<div class="pr" style="flex-direction:row;justify-content:space-between;align-items:center"><div class="pl">Separator de sarcin\u0103 \xEEnchis</div><input type="checkbox" id="p-cmt-sep" ${cData.stare_sep !== false ? "checked" : ""} style="transform:scale(1.3)"></div>` : ""}
      </div>`;
      }
      let ptabMonoHtml = "";
      if (el.type === "ptab_mono") {
        const celule = el.celule || [];
        let rows = celule.map((cel, i) => {
          const tipSel = (v) => cel.tip === v ? "selected" : "";
          return `<div style="display:flex;flex-direction:column;gap:3px;background:var(--bg2);border:1px solid var(--border2);border-radius:5px;padding:5px 6px;" id="ptmcl-${el.id}-${i}">
          <div style="display:flex;align-items:center;gap:4px;justify-content:space-between">
            <span style="font-size:9px;font-weight:800;color:var(--accent)">Celula ${i + 1}</span>
            <div style="display:flex;gap:2px">
              ${i > 0 ? `<button onclick="ptabMonoMoveCell(${el.id},${i},-1)" style="width:20px;height:20px;border-radius:3px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);cursor:pointer;font-size:10px">\u25C0</button>` : '<span style="width:20px"></span>'}
              ${i < celule.length - 1 ? `<button onclick="ptabMonoMoveCell(${el.id},${i},1)" style="width:20px;height:20px;border-radius:3px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);cursor:pointer;font-size:10px">\u25B6</button>` : '<span style="width:20px"></span>'}
              <button onclick="ptabMonoDelCell(${el.id},${i})" style="width:20px;height:20px;border-radius:3px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:11px;font-weight:700">\xD7</button>
            </div>
          </div>
          <div style="display:flex;gap:4px;align-items:center">
            <select onchange="ptabMonoUpdCell(${el.id},${i},'tip',this.value)" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 4px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
              <option value="L" ${tipSel("L")}>\u{1F50C} Linie MT</option>
              <option value="T" ${tipSel("T")}>\u26A1 Transformator</option>
            </select>
            <label style="display:flex;align-items:center;gap:2px;font-size:8px;color:var(--text2);cursor:pointer">
              <input type="checkbox" onchange="ptabMonoUpdCell(${el.id},${i},'stare',this.checked)" ${cel.stare !== false ? "checked" : ""}> \xCEnch.
            </label>
          </div>
          <input placeholder="Etichet\u0103 (ex: T1, Rez.)" value="${cel.label || ""}" oninput="ptabMonoUpdCell(${el.id},${i},'label',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%">
          ${cel.tip === "T" ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">
            <input placeholder="Putere (100kVA)" value="${cel.putere || "100kVA"}" oninput="ptabMonoUpdCell(${el.id},${i},'putere',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
            <input placeholder="Tensiune (20/0.4kV)" value="${cel.volt || "20/0.4kV"}" oninput="ptabMonoUpdCell(${el.id},${i},'volt',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px">
          </div>` : ""}
          <input placeholder="Curent disjunctor" value="${cel.curent || (cel.tip === "T" ? "16A" : "400A")}" oninput="ptabMonoUpdCell(${el.id},${i},'curent',this.value)" style="background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9px;width:100%">
        </div>`;
        }).join("");
        ptabMonoHtml = `<div class="psec"><div class="psh">\u26A1 Celule PTAb Monofilar (${celule.length})</div>
        <div style="padding:5px;display:flex;flex-direction:column;gap:5px">${rows}
          <div style="display:flex;gap:4px;margin-top:2px">
            <button onclick="ptabMonoAddCell(${el.id},'L')" style="flex:1;padding:5px;border-radius:4px;border:1px solid rgba(0,207,255,.3);background:rgba(0,207,255,.07);color:var(--accent);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">+ Linie MT</button>
            <button onclick="ptabMonoAddCell(${el.id},'T')" style="flex:1;padding:5px;border-radius:4px;border:1px solid rgba(0,229,160,.3);background:rgba(0,229,160,.07);color:var(--accentg);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif">+ Trafo</button>
          </div>
        </div></div>`;
      }
      let baraStatieHtml = "";
      if (el.type === "bara_statie_mt") {
        const terminale = el.terminale || [];
        const terRows = terminale.map((ter, i) => `
        <div style="display:flex;align-items:center;gap:3px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:3px 5px;">
          <span style="font-size:8px;color:var(--text3);min-width:12px">${i + 1}</span>
          <input type="number" min="0" max="100" value="${ter.pct || 0}" oninput="baraStatieTerUpd(${el.id},${i},'pct',+this.value)" style="width:44px;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 4px;color:var(--warn);font-family:'JetBrains Mono',monospace;font-size:9px;text-align:center" title="Pozi\u021Bie pe bar\u0103 0%=sus \u2026 100%=jos">
          <span style="font-size:8px;color:var(--text3)">%</span>
          <input placeholder="Etichet\u0103 (op\u021B.)" value="${ter.label || ""}" oninput="baraStatieTerUpd(${el.id},${i},'label',this.value)" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:2px 5px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:9px">
          <button onclick="baraStatieTerDel(${el.id},${i})" style="width:18px;height:18px;border-radius:3px;border:1px solid rgba(255,61,113,.3);background:rgba(255,61,113,.07);color:var(--danger);cursor:pointer;font-size:12px;line-height:1;font-weight:700;flex-shrink:0">\xD7</button>
        </div>`).join("");
        baraStatieHtml = `<div class="psec"><div class="psh">\u26A1 Parametri Bar\u0103 Sta\u021Bie MT</div>
        <div class="pr"><div class="pl">Nr. Circuit / Plecare</div><input class="pi" id="p-bs-nrc" value="${el.nrCircuit || "2"}" style="font-size:16px;font-weight:800;color:var(--warn)"></div>
        <div class="pr"><div class="pl">Nume Sta\u021Bie</div><input class="pi" id="p-bs-nume" value="${el.numeStatie || "STA\u021AIE 20kV"}"></div>
        <div class="pr"><div class="pl">Lungime bar\u0103 (px)</div><input class="pi" type="number" id="p-bs-lung" min="60" max="800" step="20" value="${el.lungime || 200}"></div>
      </div>
      <div class="psec"><div class="psh">\u{1F50C} Puncte de Conexiune (${terminale.length})</div>
        <div style="padding:5px;display:flex;flex-direction:column;gap:4px">
          <div style="font-size:8px;color:var(--text3);padding:0 2px 2px">Pozi\u021Bie: 0% = sus barei \xB7 100% = jos barei</div>
          ${terRows}
          <button onclick="baraStatieTerAdd(${el.id})" style="padding:5px;border-radius:4px;border:1px solid rgba(0,207,255,.3);background:rgba(0,207,255,.07);color:var(--accent);cursor:pointer;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif;margin-top:2px">+ Adaug\u0103 punct de conexiune</button>
        </div>
      </div>`;
      }
      const showConsumatori = el.type.startsWith("firida_") || el.type.startsWith("stalp_");
      const isStalp = el.type.startsWith("stalp_");
      let consumatoriHtml = "";
      if (showConsumatori) {
        const connectedCables = S.CN.filter((c) => c.fromElId === el.id || c.toElId === el.id || c.from === el.id);
        let groups = [...new Set(connectedCables.map((c) => c.circuitGroup && c.circuitGroup.trim() !== "" ? c.circuitGroup.trim() : "Implicit"))];
        if (groups.length === 0) groups = ["Implicit"];
        if (el.consumatori && !el.cons_dict) el.cons_dict = { "Implicit": el.consumatori };
        if (!el.cons_dict) el.cons_dict = {};
        if (!el.pv_dict) el.pv_dict = {};
        let inputsHtml = groups.map((g) => `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;"><span style="font-size:9px;color:var(--text2)">${g === "Implicit" ? "Grup implicit / Toate" : `Grup ${g}`}</span><input class="pi p-cons-grp" data-grp="${g}" type="number" style="width:60px;padding:3px" min="0" value="${el.cons_dict[g] || 0}"></div>`).join("");
        let pvInputsHtml = groups.map((g) => `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;"><span style="font-size:9px;color:var(--text2)">${g === "Implicit" ? "Grup implicit / Toate" : `Grup ${g}`}</span><input class="pi p-pv-grp" data-grp="${g}" type="number" step="0.1" style="width:60px;padding:3px" min="0" value="${el.pv_dict[g] || 0}"></div>`).join("");
        let poleTypeHtml = "", csFuseHtml = "";
        const isMTStalp = el.type.startsWith("stalp_mt_");
        if (isMTStalp) {
          const catD = getPoleData(el);
          const _consoleOpts = (() => {
            const g = {};
            for (const [k, v] of Object.entries(CONSOLE_CATALOG)) {
              if (!g[v.group]) g[v.group] = [];
              g[v.group].push(`<option value="${k}" ${el.console_type === k ? "selected" : ""}>${v.desc} \u2014 T=${v.T_max} daN</option>`);
            }
            return '<option value="">\u2014 f\u0103r\u0103 consol\u0103 (T_max \u221E) \u2014</option>' + Object.entries(g).map(([gr, opts]) => `<optgroup label="${gr}">${opts.join("")}</optgroup>`).join("");
          })();
          poleTypeHtml = `
          <div class="pr" style="background:rgba(192,112,0,.08);border-left:3px solid #c07000;padding-left:8px">
            <div class="pl" style="color:#c07000">St\xE2lp MT 20kV</div>
            <select class="pi" id="p-st-type">
              <optgroup label="SC Centrifuga\u021Bi">
                <option value="stalp_mt_sc10001" ${el.type === "stalp_mt_sc10001" ? "selected" : ""}>SC 10001</option>
                <option value="stalp_mt_sc15006" ${el.type === "stalp_mt_sc15006" ? "selected" : ""}>SC 15006</option>
                <option value="stalp_mt_sc15007" ${el.type === "stalp_mt_sc15007" ? "selected" : ""}>SC 15007</option>
                <option value="stalp_mt_sc15014" ${el.type === "stalp_mt_sc15014" ? "selected" : ""}>SC 15014</option>
                <option value="stalp_mt_sc15015" ${el.type === "stalp_mt_sc15015" ? "selected" : ""}>SC 15015</option>
              </optgroup>
              <optgroup label="SE Vibro-Precomprima\u021Bi">
                <option value="stalp_mt_se4t" ${el.type === "stalp_mt_se4t" ? "selected" : ""}>SE 4T</option>
                <option value="stalp_mt_se5t" ${el.type === "stalp_mt_se5t" ? "selected" : ""}>SE 5T</option>
                <option value="stalp_mt_se6t" ${el.type === "stalp_mt_se6t" ? "selected" : ""}>SE 6T</option>
                <option value="stalp_mt_se7t" ${el.type === "stalp_mt_se7t" ? "selected" : ""}>SE 7T</option>
                <option value="stalp_mt_se8t" ${el.type === "stalp_mt_se8t" ? "selected" : ""}>SE 8T</option>
                <option value="stalp_mt_se9t" ${el.type === "stalp_mt_se9t" ? "selected" : ""}>SE 9T</option>
                <option value="stalp_mt_se10t" ${el.type === "stalp_mt_se10t" ? "selected" : ""}>SE 10T</option>
                <option value="stalp_mt_se11t" ${el.type === "stalp_mt_se11t" ? "selected" : ""}>SE 11T</option>
              </optgroup>
            </select>
            <div style="font-size:7.5px;color:var(--text3);margin-top:3px">${catD.desc}</div>
          </div>
          <div class="pr" style="background:rgba(192,112,0,.05);border-left:3px solid #c07000;padding-left:8px">
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;flex-direction:column;gap:2px">
                <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">Consol\u0103 tip (ST34)</span>
                <select class="pi" id="p-console-type" style="font-size:9px"
                  title="Tip consol\u0103 metalic\u0103 ST34 Electrica \u2014 auto-completeaz\u0103 T_max din Anexa 1">${_consoleOpts}</select>
              </div>
              <div style="display:flex;gap:8px;align-items:flex-end">
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">H prindere [m]</span>
                  <input class="pi" id="p-h-prindere" type="number" min="2" max="25" step="0.5"
                         style="width:62px"
                         placeholder="${catD.catH != null ? catD.catH : "?"}"
                         value="${el.h_prindere_ovr != null ? el.h_prindere_ovr : ""}"
                         title="\xCEn\u0103l\u021Bimea punctului de prindere fa\u021B\u0103 de sol [m]. Catalog: ${catD.catH ?? "?"}m. Gol = din catalog.">
                </div>
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#c07000;text-transform:uppercase">T_max horiz. [daN]</span>
                  <input class="pi" id="p-T-max-horiz" type="number" min="0" max="99999" step="50"
                         style="width:72px"
                         placeholder="${catD.catT != null ? catD.catT : "\u221E"}"
                         value="${el.T_max_ovr != null ? el.T_max_ovr : ""}"
                         title="Override manual T_max [daN]. Consol\u0103: ${catD.catT ?? "\u221E"} daN. Gol = din consol\u0103/catalog.">
                </div>
              </div>
              <div style="display:flex;gap:8px;align-items:flex-end;margin-top:2px">
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:7.5px;font-weight:700;color:#4ade80;text-transform:uppercase">Cota teren [m asl]</span>
                  <input class="pi" id="p-cota-teren" type="number" min="-500" max="3000" step="0.5"
                         style="width:80px"
                         placeholder="\u2014"
                         value="${el.cota_teren != null ? el.cota_teren : ""}"
                         title="Cota terenului la baza st\xE2lpului [m fa\u021B\u0103 de nivelul m\u0103rii]. Folosit la profilul \xEEn lung LEA.">
                </div>
              </div>
            </div>
          </div>
          <div class="pr">
            <button class="pi" id="p-mt-extend"
              style="width:100%;padding:7px;background:rgba(192,112,0,.15);border:1px solid #c07000;
                border-radius:5px;color:#c07000;font-weight:800;font-size:9px;cursor:pointer;letter-spacing:.05em"
              title="Adaug\u0103 un st\xE2lp nou \u0219i 3 conexiuni RST pornind de la acest st\xE2lp">
              + Adaug\u0103 deschidere de la acest st\xE2lp
            </button>
          </div>`;
        } else if (isStalp) {
          poleTypeHtml = `<div class="pr"><div class="pl">\u{1F3D7}\uFE0F Tip St\xE2lp</div><select class="pi" id="p-st-type">
          <option value="stalp_se4" ${el.type === "stalp_se4" ? "selected" : ""}>SE 4 (P\u0103trat Gol)</option>
          <option value="stalp_se10" ${el.type === "stalp_se10" ? "selected" : ""}>SE 10 (P\u0103trat cu X)</option>
          <option value="stalp_cs" ${el.type === "stalp_cs" ? "selected" : ""}>SE 10 cu Cutie Selectivitate (CS)</option>
          <option value="stalp_sc10002" ${el.type === "stalp_sc10002" ? "selected" : ""}>SC10002</option>
          <option value="stalp_sc10005" ${el.type === "stalp_sc10005" ? "selected" : ""}>SC10005</option>
          <option value="stalp_rotund" ${el.type === "stalp_rotund" ? "selected" : ""}>St\xE2lp Rotund</option>
          <option value="stalp_rotund_special" ${el.type === "stalp_rotund_special" ? "selected" : ""}>St\xE2lp Rotund Special</option>
        </select></div>`;
          if (el.type === "stalp_cs") csFuseHtml = `<div class="pr"><div class="pl">\u26A1 Siguran\u021B\u0103 CS (Amperi)</div><input class="pi" id="p-cs-fuse" type="number" step="1" style="color:var(--warn);font-weight:bold" value="${el.cs_fuse || 100}"></div>`;
        } else if (el.type.startsWith("firida_")) {
          poleTypeHtml = `<div class="pr"><div class="pl">\u{1F3D7}\uFE0F Tip Firid\u0103</div><select class="pi" id="p-st-type">
          <option value="firida_e2_4" ${el.type === "firida_e2_4" ? "selected" : ""}>Firid\u0103 E2-4</option>
          <option value="firida_e3_4" ${el.type === "firida_e3_4" ? "selected" : ""}>Firid\u0103 E3-4</option>
          <option value="firida_e3_0" ${el.type === "firida_e3_0" ? "selected" : ""}>Firid\u0103 E3-0</option>
        </select></div>`;
        }
        consumatoriHtml = `${poleTypeHtml}${csFuseHtml}<div class="pr"><div class="pl">\u{1F465} Consumatori per Circuit</div><div style="background:var(--bg2); border:1px solid var(--border2); border-radius:4px; padding:4px 6px;">${inputsHtml}</div></div><div class="pr"><div class="pl">\u2600\uFE0F Putere PV instalat\u0103 (kW) per Circuit</div><div style="background:var(--bg2); border:1px solid rgba(255,193,7,.3); border-radius:4px; padding:4px 6px;">${pvInputsHtml}</div></div>${isStalp ? `<div class="pr"><div class="pl">\u{1F500} Tip Nod</div><select class="pi" id="p-nod"><option value="" ${!el.nod ? "selected" : ""}>\u2014 St\xE2lp simplu \u2014</option><option value="nod" ${el.nod === "nod" ? "selected" : ""}>NOD (ramifica\u021Bie)</option><option value="capat" ${el.nod === "capat" ? "selected" : ""}>CAP\u0102T linie</option><option value="derivatie" ${el.nod === "derivatie" ? "selected" : ""}>DERIVA\u021AIE</option></select></div>` : ""}`;
      }
      let shapeProps = "";
      if (el.type === "rect") shapeProps = `<div class="pr"><div class="pl">L\u0103\u021Bime P\u0103trat (px)</div><input class="pi" type="number" id="p-rw" value="${el.width || 100}"></div><div class="pr"><div class="pl">\xCEn\u0103l\u021Bime P\u0103trat (px)</div><input class="pi" type="number" id="p-rh" value="${el.height || 100}"></div>`;
      else if (el.type === "circle") shapeProps = `<div class="pr"><div class="pl">Raz\u0103 Cerc (px)</div><input class="pi" type="number" id="p-cr" value="${el.r || 50}"></div>`;
      else if (el.type === "busbar") shapeProps = `<div class="pr"><div class="pl">Lungime Bar\u0103 (px)</div><input class="pi" type="number" id="p-bw" value="${el.width || 200}"></div>`;
      let lineProps = "";
      if (el.type === "rect" || el.type === "circle" || el.type === "polyline") lineProps = `<div class="pr"><div class="pl">Tip Linie Contur</div><select class="pi" id="p-elt"><option value="solid" ${el.lineType !== "dashed" ? "selected" : ""}>Continu\u0103</option><option value="dashed" ${el.lineType === "dashed" ? "selected" : ""}>\xCEntrerupt\u0103</option></select></div><div class="pr"><div class="pl">Grosime Contur (px)</div><input class="pi" type="number" id="p-esw" value="${el.strokeWidth || 2}"></div>`;
      let arrowProps = "";
      if (el.type === "polyline") arrowProps = `<div class="pr"><div class="pl">S\u0103geat\u0103 \xCEnceput</div><input type="checkbox" id="p-arr-s" ${el.arrowStart ? "checked" : ""}></div><div class="pr"><div class="pl">S\u0103geat\u0103 Sf\xE2r\u0219it</div><input type="checkbox" id="p-arr-e" ${el.arrowEnd ? "checked" : ""}></div>`;
      const stareVal = el.stare || "existent";
      pb.innerHTML = `
      <div class="psec">
        <div class="psh">Identificare & Dimensiuni</div>
        <div class="pr"><div class="pl">Etichet\u0103</div><textarea class="pi" id="p-lbl" rows="2">${el.label || ""}</textarea></div>
        <div class="pr"><div class="pl">Stare</div><select class="pi" id="p-stare" style="font-weight:700;color:${stareVal === "proiectat_racordare" ? "#ef4444" : stareVal === "intarire_inlocuire" ? "#a855f7" : stareVal === "intarire_nou" ? "#3b82f6" : stareVal === "coexistenta" ? "#eab308" : stareVal === "demontat" ? "#6b7280" : "var(--text)"}">
          <option value="existent" ${stareVal === "existent" ? "selected" : ""}>\u2714 Existent</option>
          <option value="proiectat_racordare" ${stareVal === "proiectat_racordare" ? "selected" : ""} style="color:#ef4444">\u{1F534} Proiectat \u2014 Tarif Racordare</option>
          <option value="intarire_inlocuire" ${stareVal === "intarire_inlocuire" ? "selected" : ""} style="color:#a855f7">\u{1F7E3} \xCEnt\u0103rire \u2014 \xCEnlocuire conductor</option>
          <option value="intarire_nou" ${stareVal === "intarire_nou" ? "selected" : ""} style="color:#3b82f6">\u{1F535} \xCEnt\u0103rire \u2014 Circuit/cablu nou</option>
          <option value="coexistenta" ${stareVal === "coexistenta" ? "selected" : ""} style="color:#eab308">\u{1F7E1} Lucr\u0103ri Coexisten\u021B\u0103</option>
          <option value="demontat" ${stareVal === "demontat" ? "selected" : ""} style="color:#6b7280">\u26D4 Demontat</option>
        </select></div>
        ${stareVal === "coexistenta" && el.type.startsWith("stalp_") ? `<div class="pr" style="border-left:3px solid #eab308;padding-left:8px"><div class="pl" style="color:#eab308">\xCEnlocuire cu tip st\xE2lp</div><select class="pi" id="p-coex-replace" style="color:#eab308;font-weight:700">
          <option value="">\u2014 Selecteaz\u0103 \u2014</option>
          <option value="SE4" ${(el.coexReplace || "") === "SE4" ? "selected" : ""}>SE4</option>
          <option value="SE10" ${(el.coexReplace || "") === "SE10" ? "selected" : ""}>SE10</option>
          <option value="SC10002" ${(el.coexReplace || "") === "SC10002" ? "selected" : ""}>SC10002</option>
          <option value="SC10005" ${(el.coexReplace || "") === "SC10005" ? "selected" : ""}>SC10005</option>
          <option value="St\xE2lp Rotund" ${(el.coexReplace || "") === "St\xE2lp Rotund" ? "selected" : ""}>St\xE2lp Rotund</option>
        </select></div>` : ""}
        ${el.type === "meter" ? `<div class="pr"><div class="pl">Text BMPT</div><input class="pi" id="p-bmpt" value="${el.bmptText || ""}"></div>` : ""}
        ${el.type !== "polyline" && el.type !== "rect" && el.type !== "circle" && el.type !== "busbar" ? `<div class="pr"><div class="pl">Scar\u0103 (M\u0103rime)</div><input class="pi" type="number" id="p-scale" step="0.1" min="0.1" max="10" value="${el.scale || 1}"></div>` : ""}
        ${el.type === "text" ? `<div class="pr"><div class="pl">Dimensiune Text (px)</div><input class="pi" type="number" id="p-fsize" min="5" max="100" value="${el.fontSize || 10}"></div>` : ""}
        ${shapeProps}${lineProps}${arrowProps}${consumatoriHtml}
      </div>
      ${labelsHtml}${celMTHtml}${ptabMonoHtml}${baraStatieHtml}${firidaHtml}${circuitHtml}
      <div class="psec"><div class="psh">Culori</div><div class="pr"><div class="pl">Contur / Text (Principal\u0103)</div><div class="crow" id="p-crow-color"></div></div><div class="pr"><div class="pl">Umplere / Eviden\u021Biere (Secundar\u0103)</div><div class="crow" id="p-crow-fill"></div></div></div>
      <div class="psec"><div class="psh">Rota\u021Bie</div><div class="rotrow"><button class="rb" onclick="rotateSel(-90)">\u21BA</button><input type="number" id="p-rot-num" class="pi" style="width:50px;text-align:center;padding:3px" value="${el.rotation || 0}"><button class="rb" onclick="rotateSel(90)">\u21BB</button><button class="rb" onclick="rotateSel(180)">\u2195</button></div><div style="padding:0 9px 9px"><input type="range" id="p-rot-slider" min="0" max="359" value="${el.rotation || 0}" style="width:100%;cursor:pointer"></div></div>
      <div style="display:flex;gap:5px;flex-shrink:0;"><button class="bprop bdup" onclick="copyEl();pasteEl()">\u29C9 Duplic\u0103</button><button class="bprop bdel" onclick="delSel()">\u{1F5D1} \u0218terge</button></div>`;
      document.getElementById("p-lbl").addEventListener("input", (ev) => updSel("label", ev.target.value));
      document.getElementById("p-stare")?.addEventListener("change", (ev) => {
        const v = ev.target.value;
        el.stare = v;
        if (v === "proiectat_racordare") el.color = "#ef4444";
        else if (v === "intarire_inlocuire") el.color = "#a855f7";
        else if (v === "intarire_nou") el.color = "#3b82f6";
        else if (v === "coexistenta") el.color = "#eab308";
        else if (v === "demontat") el.color = "#6b7280";
        if (v !== "coexistenta") {
          S.CN.forEach((cn2) => {
            if (cn2.fromElId === el.id || cn2.toElId === el.id) {
              if (v === "proiectat_racordare") cn2.color = "#ef4444";
              else if (v === "intarire_inlocuire") cn2.color = "#a855f7";
              else if (v === "intarire_nou") cn2.color = "#3b82f6";
            }
          });
        }
        render();
        updateProps();
      });
      document.getElementById("p-coex-replace")?.addEventListener("change", (ev) => {
        el.coexReplace = ev.target.value;
        if (ev.target.value) {
          saveState("inlocuire stalp coexistenta");
          if (!el.coexOrigType) el.coexOrigType = el.type;
          const typeMap = { "SE4": "stalp_se4", "SE10": "stalp_se10", "SC10002": "stalp_sc10002", "SC10005": "stalp_sc10005", "St\xE2lp Rotund": "stalp_rotund" };
          if (typeMap[ev.target.value]) {
            el.type = typeMap[ev.target.value];
            render();
            updateProps();
          }
        }
      });
      if (el.type === "meter") document.getElementById("p-bmpt")?.addEventListener("input", (ev) => updSel("bmptText", ev.target.value));
      document.getElementById("p-scale")?.addEventListener("input", (ev) => {
        const v = parseFloat(ev.target.value);
        if (v > 0) {
          el.scale = v;
          updateConnectedCables(el);
          render();
        }
      });
      document.getElementById("p-fsize")?.addEventListener("input", (ev) => {
        const v = parseInt(ev.target.value);
        if (v > 0) {
          el.fontSize = v;
          render();
        }
      });
      document.getElementById("p-rw")?.addEventListener("input", (ev) => updSel("width", parseInt(ev.target.value) || 100));
      document.getElementById("p-rh")?.addEventListener("input", (ev) => updSel("height", parseInt(ev.target.value) || 100));
      document.getElementById("p-cr")?.addEventListener("input", (ev) => updSel("r", parseInt(ev.target.value) || 50));
      document.getElementById("p-bw")?.addEventListener("input", (ev) => {
        updSel("width", parseInt(ev.target.value) || 200);
        updateConnectedCables(el);
      });
      document.getElementById("p-elt")?.addEventListener("change", (ev) => updSel("lineType", ev.target.value));
      document.getElementById("p-esw")?.addEventListener("input", (ev) => updSel("strokeWidth", parseFloat(ev.target.value) || 2));
      document.getElementById("p-arr-s")?.addEventListener("change", (ev) => updSel("arrowStart", ev.target.checked));
      document.getElementById("p-arr-e")?.addEventListener("change", (ev) => updSel("arrowEnd", ev.target.checked));
      document.getElementById("p-rot-num")?.addEventListener("input", (ev) => setRotationAbs(parseInt(ev.target.value) || 0));
      document.getElementById("p-rot-slider")?.addEventListener("input", (ev) => setRotationAbs(parseInt(ev.target.value) || 0));
      if (el.type === "ptab_1t" || el.type === "ptab_2t" || el.type === "trafo") {
        const propMap = { mv: "mv", type: "type", pow: "power", volt: "volt", lv: "lv" };
        ["mv", "type", "pow", "volt", "lv"].forEach((k) => {
          document.getElementById(`p-t1-${k}`)?.addEventListener("input", (ev) => {
            if (el.type === "ptab_1t" || el.type === "trafo") {
              if (!el.trText) el.trText = el.type === "trafo" ? { mv: "16A", type: "PT Aerian", power: "160kVA", volt: "20/0.4kV", lv: "250A" } : { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
              el.trText[propMap[k]] = ev.target.value;
            } else {
              if (!el.trText1) el.trText1 = { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
              el.trText1[propMap[k]] = ev.target.value;
            }
            render();
          });
          document.getElementById(`p-t2-${k}`)?.addEventListener("input", (ev) => {
            if (!el.trText2) el.trText2 = { mv: "In=16A", type: "TTU ONAN", power: "250kVA", volt: "20/0.4kV", lv: "400A" };
            el.trText2[propMap[k]] = ev.target.value;
            render();
          });
        });
        if (el.type === "ptab_2t") document.getElementById("p-cp-txt")?.addEventListener("input", (ev) => {
          el.cpText = ev.target.value;
          render();
        });
      }
      if (el.type === "celula_linie_mt" || el.type === "celula_trafo_mt") {
        const updCelMT = (key, val) => {
          if (!el.celMT) el.celMT = {};
          el.celMT[key] = val;
          render();
        };
        document.getElementById("p-cmt-tensiune")?.addEventListener("input", (ev) => updCelMT("tensiune", ev.target.value));
        document.getElementById("p-cmt-curent")?.addEventListener("input", (ev) => updCelMT("curent", ev.target.value));
        document.getElementById("p-cmt-putere")?.addEventListener("input", (ev) => updCelMT("putere", ev.target.value));
        document.getElementById("p-cmt-volt")?.addEventListener("input", (ev) => updCelMT("volt", ev.target.value));
        document.getElementById("p-cmt-disj")?.addEventListener("change", (ev) => updCelMT("stare_disj", ev.target.checked));
        document.getElementById("p-cmt-sep")?.addEventListener("change", (ev) => updCelMT("stare_sep", ev.target.checked));
      }
      if (el.type === "bara_statie_mt") {
        document.getElementById("p-bs-nrc")?.addEventListener("input", (ev) => {
          el.nrCircuit = ev.target.value;
          render();
        });
        document.getElementById("p-bs-nume")?.addEventListener("input", (ev) => {
          el.numeStatie = ev.target.value;
          render();
        });
        document.getElementById("p-bs-lung")?.addEventListener("input", (ev) => {
          const v = parseInt(ev.target.value) || 200;
          el.lungime = v;
          updateConnectedCables(el);
          render();
        });
      }
      document.querySelectorAll(".p-cons-grp").forEach((inp) => {
        inp.addEventListener("input", (ev) => {
          const g = ev.target.dataset.grp, val = parseInt(ev.target.value) || 0;
          if (!el.cons_dict) el.cons_dict = {};
          el.cons_dict[g] = val;
          let total = 0;
          for (let key in el.cons_dict) total += el.cons_dict[key];
          el.consumatori = total;
          render();
        });
      });
      document.querySelectorAll(".p-pv-grp").forEach((inp) => {
        inp.addEventListener("input", (ev) => {
          const g = ev.target.dataset.grp, val = parseFloat(ev.target.value) || 0;
          if (!el.pv_dict) el.pv_dict = {};
          el.pv_dict[g] = val;
          let total = 0;
          for (let key in el.pv_dict) total += el.pv_dict[key];
          el.p_pv = total;
          render();
        });
      });
      if (isStalp || el.type.startsWith("firida_")) {
        document.getElementById("p-nod")?.addEventListener("change", (ev) => updSel("nod", ev.target.value));
        document.getElementById("p-mt-extend")?.addEventListener("click", () => {
          addMTSpanFrom(el.id);
        });
        document.getElementById("p-cs-fuse")?.addEventListener("input", (ev) => {
          el.cs_fuse = parseFloat(ev.target.value) || 100;
          if (document.getElementById("vd-panel").style.display === "flex") runVD();
        });
        document.getElementById("p-st-type")?.addEventListener("change", (ev) => {
          const ve = S.EL.find((x) => x.id === S.sel);
          if (ve) {
            saveState("modificare tip element");
            ve.type = ev.target.value;
            if (ve.type === "stalp_cs" && !ve.cs_fuse) ve.cs_fuse = 100;
            if (ve.type.startsWith("firida_") && !ve.fuses) {
              if (ve.type === "firida_e2_4") ve.fuses = new Array(6).fill(true);
              else if (ve.type === "firida_e3_4") ve.fuses = new Array(7).fill(true);
              else if (ve.type === "firida_e3_0") ve.fuses = new Array(3).fill(true);
            }
            render();
            updateProps();
            if (document.getElementById("vd-panel").style.display === "flex") runVD();
            window.runSagMT?.();
          }
        });
        document.getElementById("p-h-prindere")?.addEventListener("change", (ev) => {
          const ve = S.EL.find((x) => x.id === S.sel);
          if (!ve) return;
          const v = parseFloat(ev.target.value);
          ve.h_prindere_ovr = isFinite(v) && v > 0 ? v : void 0;
          window.runSagMT?.();
        });
        document.getElementById("p-T-max-horiz")?.addEventListener("change", (ev) => {
          const ve = S.EL.find((x) => x.id === S.sel);
          if (!ve) return;
          const v = parseFloat(ev.target.value);
          ve.T_max_ovr = isFinite(v) && v > 0 ? v : void 0;
          window.runSagMT?.();
        });
        document.getElementById("p-console-type")?.addEventListener("change", (ev) => {
          const ve = S.EL.find((x) => x.id === S.sel);
          if (!ve) return;
          ve.console_type = ev.target.value || void 0;
          updateProps();
          window.runSagMT?.();
        });
        document.getElementById("p-cota-teren")?.addEventListener("change", (ev) => {
          const ve = S.EL.find((x) => x.id === S.sel);
          if (!ve) return;
          const v = parseFloat(ev.target.value);
          ve.cota_teren = isFinite(v) ? v : void 0;
          window.runProfilLEA?.();
        });
      }
      buildColors(el.color, (c) => updSel("color", c), "p-crow-color", false);
      buildColors(el.fillColor, (c) => updSel("fillColor", c), "p-crow-fill", true);
    } else {
      const tcOpts = ["Clasic Al", "Torsadat Al", "Cablu Al", "Cablu Cu", "OL-AL"];
      const secOpts = [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
      const availSec = Object.keys(R0_TABLES[cn.tipConductor || "Clasic Al"] || {}).map(Number).sort((a, b) => a - b);
      const secOptHtml = secOpts.map((s) => `<option value="${s}" ${parseFloat(cn.sectiune || 16) === s ? "selected" : ""} ${!availSec.includes(s) ? 'disabled style="color:#555"' : ""}>${s} mm\xB2</option>`).join("");
      const r0val = getR0(cn.tipConductor || "Clasic Al", parseFloat(cn.sectiune) || 16);
      const r0disp = r0val ? (r0val / 1e3).toFixed(4) + " \u03A9/km" : "\u2014";
      const cnStare = cn.stare || "existent";
      pb.innerHTML = `
      <div class="psec"><div class="psh">\u{1F4D0} Identificare & Rute</div>
        <div class="pr"><div class="pl">Etichet\u0103 Cablu</div><input class="pi" id="p-cl" value="${cn.label || ""}"></div>
        <div class="pr"><div class="pl">Stare</div><select class="pi" id="p-cn-stare" style="font-weight:700;color:${cnStare === "proiectat_racordare" ? "#ef4444" : cnStare === "intarire_inlocuire" ? "#a855f7" : cnStare === "intarire_nou" ? "#3b82f6" : cnStare === "demontat" ? "#6b7280" : "var(--text)"}">
          <option value="existent" ${cnStare === "existent" ? "selected" : ""}>\u2714 Existent</option>
          <option value="proiectat_racordare" ${cnStare === "proiectat_racordare" ? "selected" : ""} style="color:#ef4444">\u{1F534} Proiectat \u2014 Tarif Racordare</option>
          <option value="intarire_inlocuire" ${cnStare === "intarire_inlocuire" ? "selected" : ""} style="color:#a855f7">\u{1F7E3} \xCEnt\u0103rire \u2014 \xCEnlocuire conductor</option>
          <option value="intarire_nou" ${cnStare === "intarire_nou" ? "selected" : ""} style="color:#3b82f6">\u{1F535} \xCEnt\u0103rire \u2014 Circuit/cablu nou</option>
          <option value="demontat" ${cnStare === "demontat" ? "selected" : ""} style="color:#6b7280">\u26D4 Demontat</option>
        </select></div>
        ${cn.stare === "intarire_inlocuire" && cn.oldTipConductor ? `<div class="pr" style="border-left:3px solid #a855f7;padding-left:8px;background:rgba(168,85,247,.05)"><div class="pl" style="color:#a855f7">Conductor vechi (\xEEnlocuit)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#a855f7;padding:4px 7px">${cn.oldTipConductor} ${cn.oldSectiune} mm\xB2 \u2014 ${cn.oldTipRetea || "Trifazat"}</div></div>` : ""}
        <div class="pr"><div class="pl">Grup Circuit (pt. st\xE2lpi comuni)</div><input class="pi" id="p-cgroup" value="${cn.circuitGroup || ""}" placeholder="Ex: C3, Iluminat..."></div>
        <div class="pr"><div class="pl">Lungime tronson (m)</div><div style="display:flex;gap:4px"><input class="pi" type="number" id="p-len" value="${cn.length || ""}" style="flex:1"><button class="t2" style="height:23px;padding:0 6px;min-width:auto;border-color:var(--border2);background:var(--bg3);color:var(--accent)" onclick="updSel('length', parseFloat((calcPathLen(S.CN.find(x=>x.id===${cn.id}).path)/S.pxPerMeter).toFixed(1)))" title="Recalculeaz\u0103 distan\u021Ba din desen">\u{1F4D0} Auto</button></div></div>
      </div>
      <div class="psec"><div class="psh">\u26A1 Conductor \u2014 Conform PE 132/2003</div>
        <div class="pr"><div class="pl">Tip conductor</div><select class="pi" id="p-tc">${tcOpts.map((t) => `<option value="${t}" ${(cn.tipConductor || "Clasic Al") === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
        <div class="pr"><div class="pl">Sec\u021Biune (mm\xB2)</div><select class="pi" id="p-sec">${secOptHtml}</select></div>
        <div class="pr"><div class="pl">Tip re\u021Bea</div><select class="pi" id="p-tr"><option value="Trifazat" ${(cn.tipRetea || "Trifazat") === "Trifazat" ? "selected" : ""}>Trifazat (3\xD7Un=0.4kV)</option><option value="Bifazat" ${cn.tipRetea === "Bifazat" ? "selected" : ""}>Bifazat (2\xD7Un=0.4kV)</option><option value="Monofazat" ${cn.tipRetea === "Monofazat" ? "selected" : ""}>Monofazat (Un=0.23kV)</option></select></div>
        <div class="pr"><div class="pl">Faz\u0103 MT (RST)</div><select class="pi" id="p-faza" style="font-weight:700;color:${cn.faza === "R" ? "#ef4444" : cn.faza === "S" ? "#22c55e" : cn.faza === "T" ? "#3b82f6" : "var(--text)"}"><option value="" ${!cn.faza ? "selected" : ""} style="color:var(--text)">\u2014 (nedefinit)</option><option value="R" ${cn.faza === "R" ? "selected" : ""} style="color:#ef4444">R (faza R)</option><option value="S" ${cn.faza === "S" ? "selected" : ""} style="color:#22c55e">S (faza S)</option><option value="T" ${cn.faza === "T" ? "selected" : ""} style="color:#3b82f6">T (faza T)</option></select></div>
        <div class="pr"><div class="pl">r\u2080 (rezisten\u021B\u0103 specific\u0103)</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accentg);padding:4px 7px;background:var(--bg2);border-radius:4px" id="p-r0disp">${r0disp}</div></div>
        <div class="pr"><div class="pl">Putere concentrat\u0103 nod final (kW)</div><input class="pi" type="number" step="0.1" id="p-pc" value="${cn.putereConc || 0}"></div>
      </div>
      <div class="psec"><div class="psh">\u{1F58A} Afi\u0219are</div>
        <div class="pr"><div class="pl">Tip linie</div><select class="pi" id="p-lt"><option value="solid" ${cn.lineType === "solid" ? "selected" : ""}>LEA \u2014 Aerian</option><option value="dashed" ${cn.lineType === "dashed" ? "selected" : ""}>LES \u2014 Subteran</option></select></div>
        <div class="pr"><div class="pl">Grosime linie (px)</div><input class="pi" type="number" id="p-sw" min="1" max="20" value="${cn.strokeWidth || 2}"></div>
        <div class="pr"><div class="pl">\u26A1 Direc\u021Bie flux putere</div><select class="pi" id="p-flow">
          <option value="" ${!cn.flowDir ? "selected" : ""}>\u2014 F\u0103r\u0103 anima\u021Bie \u2014</option>
          <option value="fwd" ${cn.flowDir === "fwd" ? "selected" : ""}>\u25B6 Normal (de la surs\u0103)</option>
          <option value="rev" ${cn.flowDir === "rev" ? "selected" : ""}>\u25C0 Invers (spre surs\u0103)</option>
        </select></div>
      </div>
      <div class="psec"><div class="psh">Culori</div><div class="pr"><div class="pl">Culoare Linie</div><div class="crow" id="p-crow-color"></div></div><div class="pr"><div class="pl">Highlight / Fundal</div><div class="crow" id="p-crow-fill"></div></div></div>
      <button class="bprop bdel" onclick="delSel()">\u{1F5D1} \u0218terge Cablu</button>`;
      document.getElementById("p-cl").addEventListener("input", (ev) => updSel("label", ev.target.value));
      document.getElementById("p-cn-stare")?.addEventListener("change", (ev) => {
        const v = ev.target.value;
        saveState("schimbare stare cablu");
        if (v === "intarire_inlocuire" && (!cn.stare || cn.stare === "existent") && !cn.oldTipConductor) {
          cn.oldTipConductor = cn.tipConductor || "Clasic Al";
          cn.oldSectiune = cn.sectiune || 16;
          cn.oldTipRetea = cn.tipRetea || "Trifazat";
        }
        cn.stare = v;
        if (v === "proiectat_racordare") cn.color = "#ef4444";
        else if (v === "intarire_inlocuire") cn.color = "#a855f7";
        else if (v === "intarire_nou") cn.color = "#3b82f6";
        else if (v === "demontat") cn.color = "#6b7280";
        else if (v === "existent") {
          cn.color = "#ef4444";
          delete cn.oldTipConductor;
          delete cn.oldSectiune;
          delete cn.oldTipRetea;
        }
        render();
        updateProps();
      });
      document.getElementById("p-cgroup")?.addEventListener("input", (ev) => updSel("circuitGroup", ev.target.value));
      document.getElementById("p-len").addEventListener("input", (ev) => updSel("length", parseFloat(ev.target.value) || 0));
      document.getElementById("p-lt").addEventListener("change", (ev) => updSel("lineType", ev.target.value));
      document.getElementById("p-sw").addEventListener("input", (ev) => updSel("strokeWidth", parseInt(ev.target.value) || 2));
      document.getElementById("p-pc").addEventListener("input", (ev) => updSel("putereConc", parseFloat(ev.target.value) || 0));
      document.getElementById("p-tc").addEventListener("change", (ev) => {
        updSel("tipConductor", ev.target.value);
        setTimeout(() => {
          updateProps();
        }, 50);
      });
      document.getElementById("p-sec").addEventListener("change", (ev) => {
        updSel("sectiune", parseFloat(ev.target.value));
        const r0 = getR0(cn.tipConductor || "Clasic Al", parseFloat(ev.target.value));
        const d = document.getElementById("p-r0disp");
        if (d) d.textContent = r0 ? (r0 / 1e3).toFixed(4) + " \u03A9/km" : "\u2014";
      });
      document.getElementById("p-tr").addEventListener("change", (ev) => updSel("tipRetea", ev.target.value));
      document.getElementById("p-faza").addEventListener("change", (ev) => {
        const v = ev.target.value;
        updSel("faza", v || void 0);
        ev.target.style.color = v === "R" ? "#ef4444" : v === "S" ? "#22c55e" : v === "T" ? "#3b82f6" : "var(--text)";
      });
      document.getElementById("p-flow")?.addEventListener("change", (ev) => {
        updSel("flowDir", ev.target.value);
        renderFlowLayer();
      });
      buildColors(cn.color, (c) => updSel("color", c), "p-crow-color", false);
      buildColors(cn.fillColor, (c) => updSel("fillColor", c), "p-crow-fill", true);
    }
  }
  function buildColors(cur, cb, containerId, allowNone = false) {
    const COLS = ["#111", "#444", "#888", "#dc2626", "#f97316", "#eab308", "#16a34a", "#0ea5e9", "#1d4ed8", "#7c3aed", "#be185d", "#dce8f5"];
    const cr = document.getElementById(containerId);
    if (!cr) return;
    cr.innerHTML = "";
    if (allowNone) {
      const s = document.createElement("div");
      s.className = "csw" + (cur === "none" || !cur ? " on" : "");
      s.style.background = "transparent";
      s.style.position = "relative";
      s.style.overflow = "hidden";
      s.innerHTML = '<div style="position:absolute;top:50%;left:-5px;right:-5px;height:2px;background:#ff3d71;transform:rotate(45deg)"></div>';
      s.title = "F\u0103r\u0103 umplere";
      s.onclick = () => {
        cr.querySelectorAll(".csw").forEach((x) => x.classList.remove("on"));
        s.classList.add("on");
        cb("none");
      };
      cr.appendChild(s);
    }
    COLS.forEach((c) => {
      const s = document.createElement("div");
      s.className = "csw" + (c === cur ? " on" : "");
      s.style.background = c;
      s.onclick = () => {
        cr.querySelectorAll(".csw").forEach((x) => x.classList.remove("on"));
        s.classList.add("on");
        cb(c);
      };
      cr.appendChild(s);
    });
  }
  function clearAll() {
    if (confirm("E\u0219ti sigur c\u0103 vrei s\u0103 \u0219tergi TOAT\u0102 plan\u0219a?")) {
      saveState("clear");
      S.EL = [];
      S.CN = [];
      S.sel = null;
      S.multiSel.clear();
      Object.keys(S.counters).forEach((k) => delete S.counters[k]);
      S.vdResults = null;
      document.getElementById("VD-OVL")?.remove();
      render();
      updateProps();
      updateStat();
      toast("Plan\u0219a a fost \u0219tears\u0103!", "ok");
    }
  }
  function toggleLeg() {
    const p = document.getElementById("leg");
    p.classList.toggle("on");
    if (p.classList.contains("on")) buildLeg();
  }
  function buildLeg() {
    const b = document.getElementById("leg-body");
    if (!b) return;
    const counts = {};
    S.EL.forEach((e) => counts[e.type] = (counts[e.type] || 0) + 1);
    const typeNames = {
      ptab_1t: "PTAB 1T",
      ptab_2t: "PTAB 2T",
      trafo: "PT Aerian",
      firida_e2_4: "Firid\u0103 E2-4",
      firida_e3_4: "Firid\u0103 E3-4",
      firida_e3_0: "Firid\u0103 E3-0",
      cd4: "Cutie Distribu\u021Bie 4P",
      cd5: "CD 5P",
      cd8: "CD 8P",
      meter: "BMPT",
      stalp_se4: "St\xE2lp SE4",
      stalp_se10: "St\xE2lp SE10",
      stalp_cs: "St\xE2lp cu CS",
      stalp_rotund: "St\xE2lp Rotund",
      stalp_rotund_special: "St\xE2lp Rotund Spec.",
      separator: "Separator JT",
      separator_mt: "Separator MT",
      manson: "Man\u0219on",
      priza_pamant: "Priz\u0103 de P\u0103m\xE2nt",
      rect: "P\u0103trat",
      circle: "Cerc",
      text: "Text liber",
      polyline: "Linie liber\u0103",
      bara_mt: "Bar\u0103 Colectoare MT",
      celula_linie_mt: "Celul\u0103 Linie MT",
      celula_trafo_mt: "Celul\u0103 Transformator MT",
      ptab_mono: "PTAb Monofilar MT",
      bara_statie_mt: "Bar\u0103 Sta\u021Bie MT"
    };
    let html = '<table class="lgt"><tr><th>Tip Element</th><th style="text-align:right">Cant.</th></tr>';
    for (const t in counts) {
      const name = typeNames[t] || t.toUpperCase();
      html += `<tr><td>${name}</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${counts[t]}</td></tr>`;
    }
    let cabLen = 0;
    S.CN.forEach((c) => cabLen += parseFloat(c.length) || 0);
    html += `<tr><td>Conductoare / Cabluri</td><td style="text-align:right;font-weight:bold;color:var(--accent)">${S.CN.length}<br><span style="font-size:7.5px;color:var(--text3)">${cabLen.toFixed(1)} m</span></td></tr>`;
    html += "</table>";
    b.innerHTML = html;
  }
  function toggleVD() {
    const p = document.getElementById("vd-panel");
    const showing = p.style.display === "flex";
    p.style.display = showing ? "none" : "flex";
    if (!showing) {
      const srcSel = document.getElementById("vd-src");
      srcSel.innerHTML = "";
      S.EL.filter((e) => e.type.startsWith("cd") || e.type === "ptab_1t").forEach((e) => {
        const o = document.createElement("option");
        o.value = e.id;
        o.textContent = e.label || e.type;
        srcSel.appendChild(o);
      });
      S.EL.filter((e) => e.type === "ptab_2t").forEach((e) => {
        const o1 = document.createElement("option");
        o1.value = e.id + "__td1";
        o1.textContent = (e.label || "PTAB") + " \u2014 TD JT 1 (C1-C8)";
        srcSel.appendChild(o1);
        const o2 = document.createElement("option");
        o2.value = e.id + "__td2";
        o2.textContent = (e.label || "PTAB") + " \u2014 TD JT 2 (C1-C8)";
        srcSel.appendChild(o2);
      });
      S.EL.filter((e) => e.type === "ptab_mono").forEach((e) => {
        (e.celule || []).forEach((cel, i) => {
          if (cel.tip !== "T") return;
          const o = document.createElement("option");
          o.value = `${e.id}__cel${i}`;
          o.textContent = `${e.label || "PTAb"} \u2014 ${cel.label || "T" + (i + 1)} (${cel.putere || "100kVA"})`;
          srcSel.appendChild(o);
        });
      });
      if (!srcSel.options.length) srcSel.innerHTML = '<option value="">\u2014 niciun CD / PTAB \u2014</option>';
      populateVDCircuits();
    }
  }
  function populateVDCircuits() {
    const srcRaw = document.getElementById("vd-src").value;
    const circSel = document.getElementById("vd-circ");
    circSel.innerHTML = '<option value="all">Toate circuitele</option>';
    let cdId = null;
    if (srcRaw.includes("__")) cdId = parseInt(srcRaw.split("__")[0]);
    else cdId = parseInt(srcRaw);
    if (!cdId) return;
    const circuits = /* @__PURE__ */ new Set();
    S.CN.forEach((cn) => {
      if (cn.fromElId === cdId || cn.toElId === cdId) {
        if (cn.circuitGroup) circuits.add(cn.circuitGroup);
        else if (cn.fromElId === cdId && cn.fromCircuit) circuits.add("C" + cn.fromCircuit);
        else if (cn.toElId === cdId && cn.toCircuit) circuits.add("C" + cn.toCircuit);
      }
    });
    circuits.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      circSel.appendChild(o);
    });
  }
  function calcNetworkVD_ptab2t(cdElId, Pc_abonat, tipAmplasare, forceKs, tdNum) {
    const startCirc = tdNum === 1 ? 1 : 9;
    const endCirc = tdNum === 1 ? 8 : 16;
    const cdEl = S.EL.find((x) => x.id === cdElId);
    const allResults = /* @__PURE__ */ new Map();
    const trafoKVA = parseInt(document.getElementById("vd-trafo")?.value) || 250;
    const trafoImpedance = { 50: { R: 45, X: 120 }, 100: { R: 22.5, X: 60 }, 160: { R: 10.37, X: 37.1 }, 250: { R: 6.2, X: 18 }, 400: { R: 3.8, X: 11.5 }, 630: { R: 2.2, X: 7 }, 1e3: { R: 1.3, X: 4.5 } }[trafoKVA] || { R: 6.2, X: 18 };
    const startIsc = 230 / Math.sqrt(trafoImpedance.R * trafoImpedance.R + trafoImpedance.X * trafoImpedance.X);
    const rootFuse = parseFloat(document.getElementById("vd-fuse")?.value) || 160;
    for (let circ = startCirc; circ <= endCirc; circ++) {
      const seedCables = S.CN.filter((cn) => cn.fromElId === cdElId && cn.fromCircuit === circ || cn.toElId === cdElId && cn.toCircuit === circ);
      if (seedCables.length === 0) continue;
      const circLabel = `C${circ - startCirc + 1}`;
      const traceGroup = seedCables[0].circuitGroup || circLabel;
      const nodes = /* @__PURE__ */ new Map(), visitedEls = /* @__PURE__ */ new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }], treeList = [];
      nodes.set(cdElId, { elId: cdElId, label: (cdEl.label || "PTAB") + " TD" + tdNum, children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: circLabel, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });
      while (queue.length > 0) {
        const { elId, path, L_cum } = queue.shift();
        const parentNode = nodes.get(elId);
        if (elId !== cdElId) treeList.push(elId);
        const cables = S.CN.filter((cn) => cn.fromElId === elId || cn.toElId === elId);
        cables.forEach((cn) => {
          if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circ.toString()) return;
          if (cn.fromElId === cdElId && cn.fromCircuit !== circ || cn.toElId === cdElId && cn.toCircuit !== circ) return;
          const currentTerm = cn.fromElId === elId ? cn.fromTerm : cn.toElId === elId ? cn.toTerm : null;
          const el = S.EL.find((x) => x.id === elId);
          if (el && !isConnectionActive(el, currentTerm)) return;
          const childId = cn.fromElId === elId ? cn.toElId : cn.toElId === elId ? cn.fromElId : null;
          if (!childId || visitedEls.has(childId)) return;
          visitedEls.add(childId);
          const childEl = S.EL.find((x) => x.id === childId);
          if (!childEl) return;
          let childActiveFuse = parentNode.active_fuse;
          if (childEl.type === "stalp_cs") childActiveFuse = parseFloat(childEl.cs_fuse) || 100;
          let tipConductor = cn.tipConductor || "Clasic Al";
          let sectiune = parseFloat(cn.sectiune) || 16;
          let L = parseFloat(cn.length) || 0;
          let r0v = getR0(tipConductor, sectiune) || 0;
          let x0v = getX0(tipConductor, sectiune);
          let nrCons = 0;
          if (childEl.cons_dict) {
            nrCons = parseInt(childEl.cons_dict[traceGroup] || childEl.cons_dict["Implicit"] || 0) || 0;
          } else nrCons = parseInt(childEl.consumatori) || 0;
          const R_cum = parentNode.R_cum + r0v * 2 * (L / 1e3);
          const X_cum = parentNode.X_cum + x0v * 2 * (L / 1e3);
          const Isc = 230 / Math.sqrt(R_cum * R_cum + X_cum * X_cum);
          const nd = { elId: childId, label: childEl.label || "?", parentId: elId, children: [], nrCons, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: parentNode.L_cumulat + L, circKey: circLabel, P_total_branch: 0, duNod: 0, duTronson: 0, path: [...path, childEl.label || "?"], P_eff: 0, r0: r0v, tipConductor, sectiune, tipRetea: cn.tipRetea || "Trifazat", R_cum, X_cum, Isc, active_fuse: childActiveFuse, totalDownstreamCons: nrCons, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0, P_eff_dU: 0, P_tot_base: 0 };
          nodes.set(childId, nd);
          parentNode.children.push(childId);
          queue.push({ elId: childId, path: [...path, childEl.label || "?"], L_cum: parentNode.L_cumulat + L });
        });
      }
      for (let i = treeList.length - 1; i >= 0; i--) {
        const nId = treeList[i], node = nodes.get(nId);
        let downstream_cons = node.nrCons, I278_tranzit = 0;
        node.children.forEach((cId) => {
          const childNode = nodes.get(cId);
          downstream_cons += childNode.totalDownstreamCons;
          I278_tranzit += childNode.P_tot_base || 0;
        });
        node.totalDownstreamCons = downstream_cons;
        const K278_local = node.nrCons, J273_Pc = parseFloat(Pc_abonat) || 2;
        const L278_Ks = !isNaN(forceKs) && forceKs > 0 ? forceKs : getKs(K278_local, tipAmplasare || "RURAL");
        const M278_distrib = K278_local * J273_Pc * L278_Ks;
        const J278_conc = node.P_cablu || 0;
        const N278_total = M278_distrib + J278_conc + I278_tranzit;
        node.P_tot_base = N278_total;
        node.P_eff_dU = M278_distrib / 2 + J278_conc + I278_tranzit;
        node.P_total_branch = N278_total;
      }
      treeList.forEach((nId) => {
        const node = nodes.get(nId);
        if (node.parentId) {
          const pNode = nodes.get(node.parentId);
          node.duTronson = calcDU_tronson(node.L, node.P_eff_dU, node.tipRetea, node.sectiune);
          node.duNod = pNode.duNod + node.duTronson;
        }
        if (node.children.length === 0) node.isEnd = true;
        allResults.set(traceGroup + "_" + nId, node);
      });
    }
    return allResults;
  }
  function calcNetworkVD(cdElId, Pc_abonat, tipAmplasare, forceKs) {
    const cdEl = S.EL.find((x) => x.id === cdElId);
    let numCircuits = 1;
    if (cdEl.type === "ptab_2t") numCircuits = 16;
    else if (cdEl.type === "ptab_1t") numCircuits = 8;
    else if (cdEl.type.startsWith("cd")) numCircuits = parseInt(cdEl.type.replace("cd", ""));
    const allResults = /* @__PURE__ */ new Map();
    const trafoKVA = parseInt(document.getElementById("vd-trafo")?.value) || 250;
    const trafoImpedance = { 50: { R: 45, X: 120 }, 100: { R: 22.5, X: 60 }, 160: { R: 10.37, X: 37.1 }, 250: { R: 6.2, X: 18 }, 400: { R: 3.8, X: 11.5 }, 630: { R: 2.2, X: 7 }, 1e3: { R: 1.3, X: 4.5 } }[trafoKVA] || { R: 6.2, X: 18 };
    const startIsc = 230 / Math.sqrt(trafoImpedance.R * trafoImpedance.R + trafoImpedance.X * trafoImpedance.X);
    const rootFuse = parseFloat(document.getElementById("vd-fuse")?.value) || 160;
    if (cdEl.type === "ptab_mono") {
      const celule = cdEl.celule || [];
      const CW = 72, startX = cdEl.x - celule.length * CW / 2;
      const termY = cdEl.y + 120;
      celule.forEach((cel, i) => {
        if (cel.tip !== "T") return;
        const cx = startX + i * CW + CW / 2;
        const seedCables = S.CN.filter((cn) => {
          const p0 = cn.path[0], pN = cn.path[cn.path.length - 1];
          if (!p0 || !pN) return false;
          return Math.hypot(p0.x - cx, p0.y - termY) < 50 && (cn.fromElId === cdElId || !cn.fromElId) || Math.hypot(pN.x - cx, pN.y - termY) < 50 && (cn.toElId === cdElId || !cn.toElId);
        });
        if (seedCables.length === 0) return;
        const traceGroup = cel.label || `T${i + 1}`;
        const nodes = /* @__PURE__ */ new Map(), visitedEls = /* @__PURE__ */ new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }];
        nodes.set(cdElId, { elId: cdElId, label: cdEl.label || "PTAb", children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: traceGroup, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });
        seedCables.forEach((cn) => {
          const p0 = cn.path[0], pN = cn.path[cn.path.length - 1];
          const childId = Math.hypot(p0.x - cx, p0.y - termY) < 50 ? cn.toElId : cn.fromElId;
          if (!childId || visitedEls.has(childId)) return;
          visitedEls.add(childId);
          const childEl2 = S.EL.find((x) => x.id === childId);
          if (!childEl2) return;
          const L = parseFloat(cn.length) || 0, tipC = cn.tipConductor || "Clasic Al", sec = parseFloat(cn.sectiune) || 16;
          const r0v = getR0(tipC, sec) || 0, x0v = getX0(tipC, sec);
          let nrCons = 0;
          if (childEl2.cons_dict) {
            nrCons = parseInt(childEl2.cons_dict[traceGroup] || childEl2.cons_dict["Implicit"] || 0) || 0;
          } else nrCons = parseInt(childEl2.consumatori) || 0;
          const R_cum2 = trafoImpedance.R + r0v * 2 * (L / 1e3), X_cum2 = trafoImpedance.X + x0v * 2 * (L / 1e3);
          const Isc2 = 230 / Math.sqrt(R_cum2 * R_cum2 + X_cum2 * X_cum2);
          const P_eff2 = nrCons * Pc_abonat * (forceKs || getKs(nrCons, tipAmplasare));
          const du2 = calcDU_tronson(L, P_eff2, cn.tipRetea || "Trifazat", sec);
          const nd2 = { elId: childId, label: childEl2.label || "?", children: [], nrCons, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: L, circKey: traceGroup, P_total_branch: P_eff2, duNod: du2, duTronson: du2, path: [childEl2.label || "?"], P_eff: P_eff2, r0: r0v, tipConductor: tipC, sectiune: sec, tipRetea: cn.tipRetea || "Trifazat", R_cum: R_cum2, X_cum: X_cum2, Isc: Isc2, active_fuse: rootFuse, totalDownstreamCons: nrCons, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0 };
          nodes.set(childId, nd2);
          allResults.set(traceGroup + "_" + childId, nd2);
          queue.push({ elId: childId, path: [childEl2.label || "?"], L_cum: L });
        });
        while (queue.length > 0) {
          const { elId, path, L_cum } = queue.shift();
          if (elId === cdElId) continue;
          const parentNode2 = nodes.get(elId);
          if (!parentNode2) continue;
          S.CN.filter((cn) => cn.fromElId === elId || cn.toElId === elId || cn.from === elId).forEach((cn) => {
            if (cn.circuitGroup && cn.circuitGroup !== traceGroup) return;
            const childId2 = cn.fromElId === elId ? cn.toElId : cn.toElId === elId ? cn.fromElId : null;
            if (!childId2 || visitedEls.has(childId2)) return;
            visitedEls.add(childId2);
            const childEl3 = S.EL.find((x) => x.id === childId2);
            if (!childEl3) return;
            const L = parseFloat(cn.length) || 0, tipC = cn.tipConductor || "Clasic Al", sec = parseFloat(cn.sectiune) || 16;
            const r0v = getR0(tipC, sec) || 0, x0v = getX0(tipC, sec);
            let nrC = 0;
            if (childEl3.cons_dict) {
              nrC = parseInt(childEl3.cons_dict[traceGroup] || childEl3.cons_dict["Implicit"] || 0) || 0;
            } else nrC = parseInt(childEl3.consumatori) || 0;
            const R_cum3 = parentNode2.R_cum + r0v * 2 * (L / 1e3), X_cum3 = parentNode2.X_cum + x0v * 2 * (L / 1e3);
            const Isc3 = 230 / Math.sqrt(R_cum3 * R_cum3 + X_cum3 * X_cum3);
            const P_eff3 = nrC * Pc_abonat * (forceKs || getKs(nrC, tipAmplasare));
            const du3 = calcDU_tronson(L, P_eff3, cn.tipRetea || "Trifazat", sec);
            const nd3 = { elId: childId2, label: childEl3.label || "?", children: [], nrCons: nrC, P_cablu: parseFloat(cn.putereConc) || 0, L, L_cumulat: parentNode2.L_cumulat + L, circKey: traceGroup, P_total_branch: P_eff3, duNod: parentNode2.duNod + du3, duTronson: du3, path: [...path, childEl3.label || "?"], P_eff: P_eff3, r0: r0v, tipConductor: tipC, sectiune: sec, tipRetea: cn.tipRetea || "Trifazat", R_cum: R_cum3, X_cum: X_cum3, Isc: Isc3, active_fuse: parentNode2.active_fuse, totalDownstreamCons: nrC, totalDownstreamPcablu: parseFloat(cn.putereConc) || 0 };
            nodes.set(childId2, nd3);
            allResults.set(traceGroup + "_" + childId2, nd3);
            queue.push({ elId: childId2, path: [...path, childEl3.label || "?"], L_cum: parentNode2.L_cumulat + L });
          });
        }
      });
      return allResults;
    }
    for (let circ = 1; circ <= numCircuits; circ++) {
      const seedCables = S.CN.filter((cn) => cn.fromElId === cdElId && cn.fromCircuit === circ || cn.toElId === cdElId && cn.toCircuit === circ);
      if (seedCables.length === 0) continue;
      const traceGroup = seedCables[0].circuitGroup || `C${circ}`;
      const nodes = /* @__PURE__ */ new Map(), visitedEls = /* @__PURE__ */ new Set([cdElId]), queue = [{ elId: cdElId, path: [], L_cum: 0 }], treeList = [];
      nodes.set(cdElId, { elId: cdElId, label: cdEl.label || "Surs\u0103", children: [], nrCons: 0, P_cablu: 0, L_cumulat: 0, circKey: traceGroup, P_total_branch: 0, duNod: 0, duTronson: 0, path: [], P_eff: 0, R_cum: trafoImpedance.R, X_cum: trafoImpedance.X, Isc: startIsc, active_fuse: rootFuse, totalDownstreamCons: 0, totalDownstreamPcablu: 0 });
      while (queue.length > 0) {
        const { elId, path, L_cum } = queue.shift();
        const parentNode = nodes.get(elId);
        if (elId !== cdElId) treeList.push(elId);
        const el = S.EL.find((x) => x.id === elId);
        const cables = S.CN.filter((cn) => cn.fromElId === elId || cn.toElId === elId || cn.from === elId);
        cables.forEach((cn) => {
          if (cn.circuitGroup && cn.circuitGroup !== traceGroup && cn.circuitGroup !== circ.toString()) return;
          if (cn.fromElId === cdElId && cn.fromCircuit !== circ || cn.toElId === cdElId && cn.toCircuit !== circ) return;
          const currentTerm = cn.fromElId === elId ? cn.fromTerm : cn.toElId === elId ? cn.toTerm : null;
          if (el && !isConnectionActive(el, currentTerm)) return;
          const childId = cn.fromElId === elId ? cn.toElId : cn.toElId === elId ? cn.fromElId : null;
          if (!childId || visitedEls.has(childId)) return;
          visitedEls.add(childId);
          const childEl = S.EL.find((x) => x.id === childId);
          if (!childEl) return;
          let childActiveFuse = parentNode.active_fuse;
          if (childEl.type === "stalp_cs") childActiveFuse = parseFloat(childEl.cs_fuse) || 100;
          let tipConductor = cn.tipConductor || "Clasic Al";
          let sectiune = parseFloat(cn.sectiune) || 16;
          const hasManualTip = cn.tipConductor && cn.tipConductor !== "Clasic Al";
          const hasManualSec = cn.sectiune && cn.sectiune !== 16;
          if (!hasManualTip || !hasManualSec) {
            const checkTextForSpecs = (txt) => {
              if (!txt) return;
              const safeTxt = txt.replace(/\+25|\+35|\+50/g, "");
              if (!hasManualSec) {
                const secMatchExact = safeTxt.match(/[234]\s*x\s*(16|25|35|50|70|95|120|150|185|240)/i);
                if (secMatchExact) sectiune = parseFloat(secMatchExact[1]);
                else {
                  const secMatch = safeTxt.match(/(?:x|\s)(16|25|35|50|70|95|120|150|185|240)(?:\s|mmp|m|$)/i);
                  if (secMatch) sectiune = parseFloat(secMatch[1]);
                }
              }
              if (!hasManualTip) {
                if (txt.toLowerCase().includes("torsadat") || txt.toLowerCase().includes("nfa")) tipConductor = "Torsadat Al";
                if (txt.toLowerCase().includes("clasic") || txt.toLowerCase().includes("acsr")) tipConductor = "Clasic Al";
                if (txt.toLowerCase().includes("cyaby") || txt.toLowerCase().includes("ac2y")) tipConductor = "Cablu Al";
              }
            };
            checkTextForSpecs(cn.label);
            if (cn.path.length >= 2) {
              const mx = (cn.path[0].x + cn.path[cn.path.length - 1].x) / 2;
              const my = (cn.path[0].y + cn.path[cn.path.length - 1].y) / 2;
              S.EL.filter((e) => e.type === "text").forEach((tEl) => {
                if (Math.hypot(tEl.x - mx, tEl.y - my) < 120) checkTextForSpecs(tEl.label);
              });
            }
          }
          const tipRetea = cn.tipRetea || "Trifazat", L = parseFloat(cn.length) || 0, totalLenSoFar = L_cum + L;
          let nrCons = 0;
          if (childEl.cons_dict) {
            if (childEl.cons_dict[traceGroup] !== void 0) nrCons = parseInt(childEl.cons_dict[traceGroup]) || 0;
            else if (childEl.cons_dict["Implicit"] !== void 0) nrCons = parseInt(childEl.cons_dict["Implicit"]) || 0;
          } else nrCons = parseInt(childEl.consumatori) || 0;
          const P_cablu = parseFloat(cn.putereConc) || 0;
          const r0 = getR0(tipConductor, sectiune) || 0;
          const x0 = getX0(tipConductor, sectiune);
          let r_nul = r0, x_nul = x0;
          if (tipConductor.includes("Torsadat")) {
            if (sectiune >= 35) {
              r_nul = 641;
              x_nul = 0.086;
            }
          } else if (tipConductor.includes("Cablu")) {
            if (sectiune >= 50) r_nul = getR0(tipConductor, Math.max(16, sectiune / 2)) || r0 * 2;
          }
          let R_tr = (r0 + r_nul) * (L / 1e3);
          let X_tr = (x0 + x_nul) * 1e3 * (L / 1e3);
          const R_cum = parentNode.R_cum + R_tr;
          const X_cum = parentNode.X_cum + X_tr;
          const Z_k = Math.sqrt(R_cum * R_cum + X_cum * X_cum);
          const Isc = Z_k > 0 ? 230 / Z_k : 0;
          const nodeData = { elId: childId, label: childEl.label || childId, parentId: elId, children: [], nrCons, P_cablu, L, L_cumulat: totalLenSoFar, duNod: 0, duTronson: 0, tipConductor, sectiune, tipRetea, lineType: cn.lineType || "solid", path: [...path, childEl.label || "?"], circKey: traceGroup, P_total_branch: 0, P_eff: 0, R_cum, X_cum, Isc, active_fuse: childActiveFuse, protected_by: parentNode.active_fuse, isEnd: false, P_eff_dU: 0, P_tot_base: 0, r0_val: r0 };
          nodes.set(childId, nodeData);
          parentNode.children.push(childId);
          queue.push({ elId: childId, path: nodeData.path, L_cum: totalLenSoFar });
        });
      }
      for (let i = treeList.length - 1; i >= 0; i--) {
        const nId = treeList[i], node = nodes.get(nId);
        let downstream_cons = node.nrCons, I278_tranzit = 0;
        node.children.forEach((cId) => {
          const childNode = nodes.get(cId);
          downstream_cons += childNode.totalDownstreamCons;
          I278_tranzit += childNode.P_tot_base || 0;
        });
        node.totalDownstreamCons = downstream_cons;
        const K278_local = node.nrCons, J273_Pc = parseFloat(Pc_abonat) || 2;
        const L278_Ks = !isNaN(forceKs) && forceKs > 0 ? forceKs : getKs(K278_local, tipAmplasare || "RURAL");
        const M278_distrib = K278_local * J273_Pc * L278_Ks;
        const J278_conc = node.P_cablu || 0;
        const N278_total = M278_distrib + J278_conc + I278_tranzit;
        node.P_tot_base = N278_total;
        node.P_eff_dU = M278_distrib / 2 + J278_conc + I278_tranzit;
        node.P_total_branch = N278_total;
      }
      treeList.forEach((nId) => {
        const node = nodes.get(nId);
        if (node.parentId) {
          const pNode = nodes.get(node.parentId);
          node.duTronson = calcDU_tronson(node.L, node.P_eff_dU, node.tipRetea, node.sectiune);
          node.duNod = pNode.duNod + node.duTronson;
        }
        if (node.children.length === 0) node.isEnd = true;
        allResults.set(traceGroup + "_" + nId, node);
      });
    }
    return allResults;
  }
  function runVD() {
    const srcRaw = document.getElementById("vd-src").value;
    const Pc = parseFloat(document.getElementById("vd-pc").value) || 2, amp = document.getElementById("vd-amp").value;
    const fuseA = parseFloat(document.getElementById("vd-fuse").value) || 160;
    const forceKs = parseFloat(document.getElementById("vd-ks")?.value);
    const showIsc = document.getElementById("vd-show-isc")?.checked !== false;
    if (!srcRaw) {
      toast("Selecteaz\u0103 o surs\u0103", "ac");
      return;
    }
    const selectedCircuit = document.getElementById("vd-circ")?.value || "all";
    let cdId, ptab2tTD = 0;
    if (srcRaw.includes("__cel")) {
      const parts = srcRaw.split("__cel");
      cdId = parseInt(parts[0]);
      const parentEl = S.EL.find((x) => x.id === cdId);
      if (parentEl) {
        const celIdx = parseInt(parts[1]);
        const cel = parentEl.celule?.[celIdx];
        if (cel) {
          const putereKVA = parseInt((cel.putere || "100").replace(/[^0-9]/g, "")) || 100;
          const validPowers = [50, 100, 160, 250, 400, 630, 1e3];
          const closest = validPowers.reduce((a, b) => Math.abs(b - putereKVA) < Math.abs(a - putereKVA) ? b : a);
          document.getElementById("vd-trafo").value = closest;
        }
      }
    } else if (srcRaw.includes("__td")) {
      const parts = srcRaw.split("__td");
      cdId = parseInt(parts[0]);
      ptab2tTD = parseInt(parts[1]);
    } else {
      cdId = parseInt(srcRaw);
    }
    const cdEl = S.EL.find((x) => x.id === cdId);
    if (!cdEl) {
      toast("Sursa neg\u0103sit\u0103", "ac");
      return;
    }
    if (cdEl.type === "ptab_2t" && ptab2tTD > 0) S.vdResults = calcNetworkVD_ptab2t(cdId, Pc, amp, forceKs, ptab2tTD);
    else S.vdResults = calcNetworkVD(cdId, Pc, amp, forceKs);
    const rows = [];
    S.vdResults.forEach((data) => {
      if (data.elId === cdId) return;
      if (selectedCircuit !== "all" && data.circKey !== selectedCircuit) return;
      const el = S.EL.find((x) => x.id === data.elId);
      if (!el) return;
      if (el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type === "celula_linie_mt" || el.type === "celula_trafo_mt" || el.type === "bara_mt" || el.type === "bara_statie_mt") return;
      const evalFuse = data.protected_by || fuseA;
      const iscAmps = data.Isc * 1e3;
      const isIscLow = showIsc && iscAmps > 0 && iscAmps < 3 * evalFuse;
      const duColor = data.duNod > 10 ? "#ff3d71" : data.duNod > 5 ? "#ff9f43" : data.duNod > 3 ? "#eab308" : "#00e5a0";
      rows.push({ el, data, duColor, isIscLow, evalFuse });
    });
    rows.sort((a, b) => b.data.duNod - a.data.duNod);
    let html = `<table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:8px">
    <thead><tr style="border-bottom:1px solid var(--border2)"><th style="text-align:left;padding:3px 5px;color:var(--text3)">Nod</th><th style="text-align:left;padding:3px 5px;color:var(--text3)">Conductor</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">L (m)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">L cum. (m)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">r\u2080 (\u03A9/km)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">P (kW)</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">\u0394U tronson%</th><th style="text-align:right;padding:3px 5px;color:var(--text3)">\u0394U nod%</th>${showIsc ? '<th style="text-align:right;padding:3px 5px;color:var(--text3)">Isc 1F (kA)</th>' : ""}</tr></thead><tbody>`;
    rows.forEach(({ el, data, duColor, isIscLow, evalFuse }) => {
      const warn = isIscLow ? ` <span style="color:#ff3d71;font-weight:900" title="Isc < 3*In (${evalFuse}A). Necesar Cutie Selectivitate!">\u26A0\uFE0FCS</span>` : data.duNod > 10 ? " \u26A0\uFE0F" : data.duNod > 5 ? " \u26A1" : "";
      html += `<tr style="border-bottom:1px solid var(--border);cursor:pointer" onclick="selectEl(${data.elId});updateProps()">
      <td style="padding:3px 5px;color:var(--accent);font-weight:700"><span style="color:var(--text3);font-size:7px">[${data.circKey}]</span> ${data.label}${warn}</td>
      <td style="padding:3px 5px;color:var(--text2)">${data.tipConductor || "\u2014"} ${data.sectiune || ""}mm\xB2<br><span style="color:var(--text3)">${data.tipRetea || ""}</span></td>
      <td style="text-align:right;padding:3px 5px">${data.L ? data.L.toFixed(0) : "\u2014"}</td><td style="text-align:right;padding:3px 5px;color:var(--text3)">${data.L_cumulat ? data.L_cumulat.toFixed(0) : "\u2014"}</td><td style="text-align:right;padding:3px 5px;color:var(--text3)">${data.r0 ? (data.r0 / 1e3).toFixed(4) : "\u2014"}</td><td style="text-align:right;padding:3px 5px">${data.P_total_branch ? data.P_total_branch.toFixed(2) : "\u2014"}</td>
      <td style="text-align:right;padding:3px 5px;color:${data.duTronson > 3 ? "#ff9f43" : "var(--text2)"}">${data.duTronson ? data.duTronson.toFixed(3) : "0.000"}</td><td style="text-align:right;padding:3px 5px;font-weight:700;color:${duColor}">${data.duNod.toFixed(3)}</td>
      ${showIsc ? `<td style="text-align:right;padding:3px 5px;font-weight:700;color:#ff3d71">${data.Isc ? data.Isc.toFixed(3) : "-"}</td>` : ""}</tr>`;
    });
    const maxDU = rows.length > 0 ? rows[0].data.duNod : 0, worstNode = rows.length > 0 ? rows[0] : null;
    html += `</tbody></table><div style="padding:8px 6px;border-top:1px solid var(--border2);display:flex;gap:12px;flex-wrap:wrap;margin-top:4px"><div style="font-size:8.5px"><span style="color:var(--text3)">\u0394U max nod: </span><span style="color:${maxDU > 10 ? "#ff3d71" : maxDU > 5 ? "#ff9f43" : "#00e5a0"};font-weight:700">${maxDU.toFixed(3)}%</span>${worstNode ? `<span style="color:var(--text3)"> @ [${worstNode.data.circKey}] ${worstNode.data.label}</span>` : ""}</div><div style="font-size:8.5px"><span style="color:var(--text3)">Limita admis\u0103: </span><span style="color:var(--text2)">\xB110% (PE 132)</span></div></div><div style="padding:4px 6px;font-size:7.5px;color:var(--text3);border-top:1px solid var(--border)">\u{1F7E2} \u0394U&lt;3% &nbsp; \u{1F7E1} 3-5% &nbsp; \u{1F7E0} 5-10% &nbsp; \u{1F534} &gt;10% \u2014 Click pe nod pentru selectare</div>`;
    document.getElementById("vd-body").innerHTML = html;
    if (S.vdOverlayOn) renderVDOverlay();
    toast("Calcul finalizat \u2014 " + rows.length + " rezultate per noduri", "ok");
  }
  function copyVDTable() {
    if (!S.vdResults || S.vdResults.size === 0) {
      toast("Nu exist\u0103 rezultate \u2014 apas\u0103 CALCULEAZ\u0102 mai \xEEnt\xE2i", "ac");
      return;
    }
    const showIsc = document.getElementById("vd-show-isc")?.checked !== false;
    const rows = [];
    S.vdResults.forEach((data) => {
      const el = S.EL.find((x) => x.id === data.elId);
      if (!el) return;
      if (el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type === "meter" || el.type === "celula_linie_mt" || el.type === "celula_trafo_mt" || el.type === "bara_mt" || el.type === "bara_statie_mt") return;
      let localCons = 0;
      if (el.cons_dict) {
        const grp = data.circKey || "Implicit";
        localCons = parseInt(el.cons_dict[grp] || el.cons_dict["Implicit"] || 0) || 0;
      } else {
        localCons = parseInt(el.consumatori) || 0;
      }
      rows.push({ label: data.label || el.label || "?", circuit: data.circKey || "", conductor: (data.tipConductor || "\u2014") + " " + (data.sectiune || "") + "mm\xB2", L: data.L || 0, Lcum: data.L_cumulat || 0, nrCons: localCons, P: data.P_total_branch || 0, duNod: data.duNod || 0, Isc: data.Isc || 0 });
    });
    if (rows.length === 0) {
      toast("Nu exist\u0103 noduri \xEEn rezultate", "ac");
      return;
    }
    rows.sort((a, b) => a.circuit.localeCompare(b.circuit) || a.Lcum - b.Lcum);
    const maxDU = rows.reduce((m, r) => Math.max(m, r.duNod), 0);
    const consPerCircuit = {};
    rows.forEach((r) => {
      if (!consPerCircuit[r.circuit]) consPerCircuit[r.circuit] = 0;
      consPerCircuit[r.circuit] += r.nrCons;
    });
    const consText = Object.entries(consPerCircuit).map(([c, n]) => `Consumatori pe ${c} = ${n} consumatori`).join("; ");
    const td = (txt, extra = "") => `<td style="border:1px solid #000;padding:3px 6px;font-size:10pt;font-family:Calibri,sans-serif${extra}">${txt}</td>`;
    const th = (txt) => `<th style="border:1px solid #000;padding:3px 6px;font-size:10pt;font-family:Calibri,sans-serif;background:#1F3864;color:#fff;font-weight:bold;text-align:center">${txt}</th>`;
    const hdrs = ["Nod", "Circuit", "Conductor", "L(m)", "L cum.(m)", "Nr.cons.", "P(kW)", "\u0394U nod%"];
    if (showIsc) hdrs.push("Isc 1F(kA)");
    let tableRows = "";
    rows.forEach((r) => {
      const duColor = r.duNod > 10 ? "#ff0000" : r.duNod > 5 ? "#cc4400" : r.duNod > 3 ? "#856400" : "#006600";
      const cells = [
        td(r.label, ";font-weight:bold"),
        td(r.circuit, ";text-align:center"),
        td(r.conductor),
        td(r.L.toFixed(0), ";text-align:right"),
        td(r.Lcum.toFixed(0), ";text-align:right"),
        td(String(r.nrCons), ";text-align:right"),
        td(r.P.toFixed(2), ";text-align:right"),
        td(r.duNod.toFixed(3), `;text-align:right;font-weight:bold;color:${duColor}`)
      ];
      if (showIsc) cells.push(td(r.Isc > 0 ? r.Isc.toFixed(3) : "-", ";text-align:right"));
      tableRows += `<tr>${cells.join("")}</tr>`;
    });
    const html = `<html><body>
<p style="font-family:Calibri,sans-serif;font-size:11pt;font-weight:bold;margin-bottom:6px">Calcul c\u0103deri de tensiune (PE 132/2003):</p>
<table style="border-collapse:collapse;width:100%">
  <thead><tr>${hdrs.map(th).join("")}</tr></thead>
  <tbody>${tableRows}</tbody>
</table>
<p style="font-family:Calibri,sans-serif;font-size:10pt;margin-top:6px">\u0394U max nod: ${maxDU.toFixed(3)}% \u2014 Limita admis\u0103: \xB110% (PE 132)</p>
<p style="font-family:Calibri,sans-serif;font-size:10pt">${consText}</p>
</body></html>`;
    const plainLines = [hdrs.join("	")];
    rows.forEach((r) => {
      const c = [r.label, r.circuit, r.conductor, r.L.toFixed(0), r.Lcum.toFixed(0), String(r.nrCons), r.P.toFixed(2), r.duNod.toFixed(3)];
      if (showIsc) c.push(r.Isc > 0 ? r.Isc.toFixed(3) : "-");
      plainLines.push(c.join("	"));
    });
    plainLines.push("", `\u0394U max nod: ${maxDU.toFixed(3)}% \u2014 Limita admis\u0103: \xB110% (PE 132)`, consText);
    try {
      navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plainLines.join("\n")], { type: "text/plain" })
      })]).then(() => toast("Tabel copiat \xEEn clipboard \u2713 (paste \xEEn Word/Excel)", "ok")).catch(() => {
        navigator.clipboard.writeText(plainLines.join("\n")).then(() => toast("Copiat (text simplu) \u2713", "ok"));
      });
    } catch (_) {
      navigator.clipboard.writeText(plainLines.join("\n")).then(() => toast("Copiat (text simplu) \u2713", "ok"));
    }
  }
  function updateGenSrcUI() {
    const src = document.getElementById("gen-src").value;
    const isPTAB = src === "ptab_1t" || src === "ptab_2t";
    document.getElementById("gen-cd-row").style.display = isPTAB ? "none" : "flex";
    document.getElementById("gen-td-row").style.display = src === "ptab_2t" ? "flex" : "none";
    document.getElementById("gen-plecari-lbl").textContent = isPTAB ? "Circuite din tablou (ramuri)" : "C\xE2te Plec\u0103ri (Ramuri)?";
    if (isPTAB) {
      document.getElementById("gen-plecari").max = 8;
      if (parseInt(document.getElementById("gen-plecari").value) > 8) document.getElementById("gen-plecari").value = 8;
    }
  }
  function toggleAutoDraw() {
    const m = document.getElementById("gen-modal");
    m.style.display = m.style.display === "flex" ? "none" : "flex";
    if (m.style.display === "flex") {
      document.getElementById("deriv-container").innerHTML = "";
      updateGenSrcUI();
    }
  }
  function addDerivRow(parentContainer, depth) {
    const c = parentContainer || document.getElementById("deriv-container");
    depth = depth || 0;
    const id = Date.now() + Math.floor(Math.random() * 1e4);
    const div = document.createElement("div");
    div.className = "deriv-row";
    div.dataset.depth = depth;
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "4px";
    div.id = `deriv-${id}`;
    div.style.marginLeft = depth * 16 + "px";
    div.style.borderLeft = depth > 0 ? "2px solid var(--accent)" : "2px solid var(--accentg)";
    div.style.paddingLeft = "6px";
    div.style.paddingTop = "4px";
    div.style.paddingBottom = "4px";
    const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.gap = "4px";
    headerDiv.style.alignItems = "center";
    headerDiv.style.flexWrap = "wrap";
    const depthLabel = depth === 0 ? "Deriva\u021Bie" : "Sub-deriva\u021Bie (niv." + depth + ")";
    const depthColor = depth === 0 ? "var(--accentg)" : "var(--accent)";
    const isVertical = depth % 2 === 0;
    const dirOptions = isVertical ? '<option value="sus">Sus</option><option value="jos">Jos</option>' : '<option value="stanga">St\xE2nga</option><option value="dreapta">Dreapta</option>';
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
    <select class="pi d-sectiune" style="width:50px;padding:3px" title="Sec\u021Biune mm\xB2">
      <option value="16">16</option><option value="25" selected>25</option><option value="35">35</option>
      <option value="50">50</option><option value="70">70</option><option value="95">95</option>
      <option value="120">120</option><option value="150">150</option>
    </select>
    <button onclick="addDerivRow(document.getElementById('sub-${id}'), ${depth + 1})" style="background:rgba(0,207,255,.1);border:1px solid rgba(0,207,255,.3);color:var(--accent);border-radius:4px;font-size:7px;padding:2px 5px;cursor:pointer;font-weight:bold" title="Adaug\u0103 sub-deriva\u021Bie">+ SUB</button>
    <button onclick="document.getElementById('deriv-${id}').remove()" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-weight:bold">\u2715</button>
  `;
    div.appendChild(headerDiv);
    const subContainer = document.createElement("div");
    subContainer.id = `sub-${id}`;
    subContainer.style.display = "flex";
    subContainer.style.flexDirection = "column";
    subContainer.style.gap = "4px";
    subContainer.style.marginTop = "4px";
    div.appendChild(subContainer);
    c.appendChild(div);
  }
  function runGenerator() {
    if (S.EL.length > 0 && !confirm("Aten\u021Bie: Generarea automat\u0103 va \u0219terge elementele curente de pe plan\u0219\u0103. E\u0219ti sigur c\u0103 vrei s\u0103 continui?")) return;
    saveState("generator auto");
    S.EL = [];
    S.CN = [];
    Object.keys(S.counters).forEach((k) => delete S.counters[k]);
    S.sel = null;
    S.multiSel.clear();
    const srcType = document.getElementById("gen-src").value;
    const cdType = document.getElementById("gen-cd").value;
    const plecari = parseInt(document.getElementById("gen-plecari").value) || 1;
    const numStalpi = parseInt(document.getElementById("gen-stalpi").value) || 4;
    const stType = document.getElementById("gen-st-tip").value;
    const isSubteran = stType.startsWith("firida");
    function parseDerivations(container) {
      const derivs = [];
      const rows = container.querySelectorAll(":scope > .deriv-row");
      rows.forEach((row) => {
        const p = parseInt(row.querySelector(":scope > div > .d-parent").value) || 1;
        const c = parseInt(row.querySelector(":scope > div > .d-count").value) || 1;
        const d = row.querySelector(":scope > div > .d-dir").value;
        const tc = row.querySelector(":scope > div > .d-tip-cond").value;
        const sec = parseFloat(row.querySelector(":scope > div > .d-sectiune").value) || 25;
        const subContainer = row.querySelector(":scope > div:last-child");
        const subDerivs = subContainer ? parseDerivations(subContainer) : [];
        derivs.push({ parentIdx: p, count: c, dir: d, tipConductor: tc, sectiune: sec, subDerivations: subDerivs });
      });
      return derivs;
    }
    let derivations = parseDerivations(document.getElementById("deriv-container"));
    const mainTipCond = document.getElementById("gen-tip-cond").value;
    const mainSectiune = parseFloat(document.getElementById("gen-sectiune").value) || 35;
    const CM = { ptab_1t: "#1a6ba0", ptab_2t: "#1a6ba0", trafo: "#1a6ba0", cd4: "#555", cd5: "#555", cd8: "#555", stalp_se4: "#555", stalp_se10: "#555", stalp_rotund: "#555", stalp_rotund_special: "#555", firida_e2_4: "#555", firida_e3_4: "#555", firida_e3_0: "#555" };
    const srcId = uid();
    const srcEl = { id: srcId, type: srcType, x: -100, y: 0, label: nextLbl(srcType), color: CM[srcType] || "#1a6ba0", fillColor: "none", rotation: 0, scale: 1 };
    if (srcType === "ptab_1t") srcEl.fuses = new Array(10).fill(true);
    if (srcType === "ptab_2t") srcEl.fuses = new Array(21).fill(true);
    S.EL.push(srcEl);
    let distId = srcId;
    let currentX = srcType.startsWith("ptab") ? 400 : 50;
    if (srcType === "trafo" && cdType !== "none") {
      distId = uid() + 1;
      currentX = 150;
      const cdEl = { id: distId, type: cdType, x: currentX, y: 0, label: nextLbl(cdType), color: CM[cdType] || "#555", fillColor: "none", rotation: 0, scale: 1 };
      S.EL.push(cdEl);
      const tTerms = sym(srcEl).terms, cdTerms = sym(cdEl).terms;
      const tOut = tTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
      const cdIn = cdTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
      S.CN.push({ id: uid() + 2, fromElId: srcId, fromTerm: { cx: tOut.cx, cy: tOut.cy }, toElId: distId, toTerm: { cx: cdIn.cx, cy: cdIn.cy }, path: [{ x: -100 + tOut.cx, y: tOut.cy }, { x: currentX + cdIn.cx, y: cdIn.cy }], label: "Racord", length: 15, color: "#ef4444", strokeWidth: 3, lineType: "solid", tipConductor: "Clasic Al", sectiune: 50, tipRetea: "Trifazat" });
      currentX += 100;
    } else if (srcType === "trafo") {
      currentX += 50;
    }
    const distEl = S.EL.find((e) => e.id === distId);
    const dTerms = sym(distEl).terms;
    const xSpacing = isSubteran ? 250 : 110;
    const ySpacing = isSubteran ? 250 : 110;
    const isPTAB2T = srcType === "ptab_2t";
    const isPTAB = srcType === "ptab_1t" || isPTAB2T;
    function drawBranch(startElId, startTermOut, startX, startY, circNum, branchStalpi, branchType, isDeriv, dirMultiplier, branchDerivations, derivDepth, isHorizontalDeriv, branchTipCond, branchSectiune) {
      let prevId = startElId, prevTermOut = startTermOut, lineX = startX, lineY = startY;
      derivDepth = derivDepth || 0;
      const myDerivations = branchDerivations || derivations;
      for (let s = 1; s <= branchStalpi; s++) {
        const stId = uid() + Math.floor(Math.random() * 1e5);
        if (isDeriv) {
          if (isHorizontalDeriv) lineX += xSpacing * dirMultiplier;
          else lineY += (isSubteran ? 250 : 110) * dirMultiplier;
        } else {
          lineX += xSpacing;
        }
        let isCapat = false, isNod = false;
        const derivHere = myDerivations.filter((d) => d.parentIdx === s);
        if (s === branchStalpi && derivHere.length === 0) isCapat = true;
        if (derivHere.length > 0) isNod = true;
        let actualType = branchType;
        if (!isSubteran && (isCapat || isNod)) {
          if (branchType === "stalp_sc10002") actualType = "stalp_sc10005";
          else actualType = "stalp_se10";
        }
        let nouEl = { id: stId, type: actualType, x: lineX, y: lineY, label: nextLbl(actualType), color: CM[actualType] || "#555", fillColor: "none", rotation: 0, scale: 1, consumatori: 2 };
        if (actualType === "firida_e2_4") nouEl.fuses = new Array(6).fill(true);
        if (actualType === "firida_e3_4") nouEl.fuses = new Array(7).fill(true);
        if (actualType === "firida_e3_0") nouEl.fuses = new Array(3).fill(true);
        if (isCapat) nouEl.nod = "capat";
        if (isNod) nouEl.nod = "nod";
        S.EL.push(nouEl);
        const stTerms = sym(S.EL[S.EL.length - 1]).terms;
        let stIn, stOut;
        if (isSubteran) {
          const topTerms = stTerms.filter((t) => t.cy < 0);
          if (topTerms.length > 0) {
            stIn = topTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
            stOut = topTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
          } else {
            stIn = stTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
            stOut = stTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
          }
        } else {
          if (isDeriv && isHorizontalDeriv) {
            if (dirMultiplier > 0) {
              stIn = stTerms.find((t) => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
              stOut = stTerms.find((t) => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
            } else {
              stIn = stTerms.find((t) => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
              stOut = stTerms.find((t) => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
            }
          } else if (isDeriv) {
            if (dirMultiplier < 0) {
              stIn = stTerms.find((t) => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => prev.cy > curr.cy ? prev : curr);
              stOut = stTerms.find((t) => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => prev.cy < curr.cy ? prev : curr);
            } else {
              stIn = stTerms.find((t) => t.cy < -15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => prev.cy < curr.cy ? prev : curr);
              stOut = stTerms.find((t) => t.cy > 15 && Math.abs(t.cx) < 5) || stTerms.reduce((prev, curr) => prev.cy > curr.cy ? prev : curr);
            }
          } else {
            stIn = stTerms.find((t) => t.cx < -15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
            stOut = stTerms.find((t) => t.cx > 15 && Math.abs(t.cy) < 5) || stTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
          }
        }
        const prevElForPos = S.EL.find((e) => e.id === prevId);
        const p1 = prevElForPos ? { x: prevElForPos.x + prevTermOut.cx, y: prevElForPos.y + prevTermOut.cy } : { x: prevTermOut.cx, y: prevTermOut.cy };
        const lastEl = S.EL[S.EL.length - 1];
        const p2 = { x: lastEl.x + stIn.cx, y: lastEl.y + stIn.cy };
        let cPath;
        const srcElType = S.EL.find((e) => e.id === prevId)?.type || "";
        const uHeight = 30;
        if (srcElType.startsWith("ptab_") && s === 1 && !isSubteran) cPath = [p1, { x: p1.x, y: p2.y }, p2];
        else if (srcElType.startsWith("ptab_") && s === 1 && isSubteran) {
          const dropY = p1.y + 30;
          cPath = [p1, { x: p1.x, y: dropY }, { x: p2.x, y: dropY }, p2];
        } else if (isSubteran && (srcElType.startsWith("cd") || srcElType === "trafo") && s === 1) cPath = [p1, { x: p2.x, y: p1.y }, p2];
        else if (isSubteran && !isDeriv) {
          const uY = Math.min(p1.y, p2.y) - uHeight;
          cPath = [p1, { x: p1.x, y: uY }, { x: p2.x, y: uY }, p2];
        } else cPath = [p1, p2];
        const dLabel = derivDepth > 0 ? `SD${derivDepth}-C${circNum}-${s}` : isDeriv ? `D${circNum}-${s}` : `C${circNum}-${s}`;
        const useTipCond = branchTipCond || mainTipCond;
        const useSectiune = branchSectiune || mainSectiune;
        const isCableLES = useTipCond.startsWith("Cablu");
        S.CN.push({ id: uid() + Math.floor(Math.random() * 1e5), fromElId: prevId, fromTerm: { cx: prevTermOut.cx, cy: prevTermOut.cy }, toElId: stId, toTerm: { cx: stIn.cx, cy: stIn.cy }, path: cPath, label: dLabel, length: isDeriv ? 30 : 40, color: "#ef4444", strokeWidth: isCableLES ? 3 : 2, lineType: isCableLES ? "dashed" : "solid", circuitGroup: `C${circNum}`, fromCircuit: prevId === distId ? circNum : null, tipConductor: useTipCond, sectiune: useSectiune, tipRetea: "Trifazat", putereConc: 0 });
        prevId = stId;
        prevTermOut = stOut;
        if (derivHere.length > 0) {
          derivHere.forEach((deriv) => {
            const stEl = S.EL.find((e) => e.id === stId);
            const dtms = sym(stEl).terms;
            let derivTermOut, dirMul, nextIsHorizontal;
            if (deriv.dir === "sus") {
              derivTermOut = dtms.find((t) => t.cy < -15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => prev.cy < curr.cy ? prev : curr);
              dirMul = -1;
              nextIsHorizontal = false;
            } else if (deriv.dir === "jos") {
              derivTermOut = dtms.find((t) => t.cy > 15 && Math.abs(t.cx) < 5) || dtms.reduce((prev, curr) => prev.cy > curr.cy ? prev : curr);
              dirMul = 1;
              nextIsHorizontal = false;
            } else if (deriv.dir === "dreapta") {
              derivTermOut = dtms.find((t) => t.cx > 15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
              dirMul = 1;
              nextIsHorizontal = true;
            } else if (deriv.dir === "stanga") {
              derivTermOut = dtms.find((t) => t.cx < -15 && Math.abs(t.cy) < 5) || dtms.reduce((prev, curr) => prev.cx < curr.cx ? prev : curr);
              dirMul = -1;
              nextIsHorizontal = true;
            }
            drawBranch(stId, derivTermOut, lineX, lineY, circNum, deriv.count, branchType, true, dirMul, deriv.subDerivations || [], derivDepth + 1, nextIsHorizontal, deriv.tipConductor, deriv.sectiune);
          });
        }
      }
    }
    if (isPTAB2T) {
      const selectedTD = parseInt(document.getElementById("gen-td").value) || 1;
      const plecariPerTD = Math.min(plecari, 8);
      const ptabBaseOffset = 150, circSpacing = ySpacing;
      const circStart = selectedTD === 1 ? 1 : 9;
      for (let c = 1; c <= plecariPerTD; c++) {
        const circInternal = circStart + (c - 1);
        let outTerm = dTerms.find((t) => t.circuit === circInternal);
        if (!outTerm) continue;
        const startX = srcEl.x + outTerm.cx;
        const yOff = ptabBaseOffset + (c - 1) * circSpacing;
        const startY = srcEl.y + outTerm.cy + yOff;
        drawBranch(distId, outTerm, startX, startY, circInternal, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
      }
    } else if (isPTAB) {
      const plecariPTAB = Math.min(plecari, 8);
      const ptabBaseOffset = 150, circSpacing = ySpacing;
      for (let c = 1; c <= plecariPTAB; c++) {
        let outTerm = dTerms.find((t) => t.circuit === c);
        if (!outTerm) continue;
        const startX = srcEl.x + outTerm.cx;
        const yOff = ptabBaseOffset + (c - 1) * circSpacing;
        const startY = srcEl.y + outTerm.cy + yOff;
        drawBranch(distId, outTerm, startX, startY, c, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
      }
    } else {
      for (let c = 1; c <= plecari; c++) {
        let outTerm = dTerms.find((t) => t.circuit === c);
        if (!outTerm) outTerm = dTerms.reduce((prev, curr) => prev.cx > curr.cx ? prev : curr);
        const baseY = (c - (plecari + 1) / 2) * ySpacing + (isSubteran ? 100 : 0);
        drawBranch(distId, outTerm, currentX, baseY, c, numStalpi, stType, false, 0, derivations, 0, false, mainTipCond, mainSectiune);
      }
    }
    toggleAutoDraw();
    render();
    updateProps();
    updateStat();
    toast("\u2728 Schema a fost generat\u0103 automat!", "ok");
    const wElem = document.getElementById("cw");
    if (wElem) {
      S.view.x = wElem.clientWidth / 2 - 150;
      S.view.y = wElem.clientHeight / 2;
      S.view.s = 0.6;
      applyView();
    }
  }
  function generateVDTableSVG(startX, startY) {
    if (!S.vdResults || S.vdResults.size === 0) return { svg: "", w: 0, h: 0 };
    const cdId = parseInt(document.getElementById("vd-src").value);
    const cdLabel = S.EL.find((x) => x.id === cdId)?.label || "Surs\u0103";
    const showIsc = document.getElementById("vd-show-isc")?.checked !== false;
    const circuitGroups = /* @__PURE__ */ new Map();
    S.vdResults.forEach((data, key) => {
      if (data.elId === cdId) return;
      const el = S.EL.find((x) => x.id === data.elId);
      if (!el) return;
      if (el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type === "celula_linie_mt" || el.type === "celula_trafo_mt" || el.type === "bara_mt" || el.type === "bara_statie_mt") return;
      const circ = data.circKey || "Necunoscut";
      if (!circuitGroups.has(circ)) circuitGroups.set(circ, []);
      circuitGroups.get(circ).push({ el, data });
    });
    if (circuitGroups.size === 0) return { svg: "", w: 0, h: 0 };
    const cols = [{ label: "Nod", w: 100, align: "start" }, { label: "L(m)", w: 50, align: "end" }, { label: "L cum", w: 60, align: "end" }, { label: "dU nod(%)", w: 70, align: "end" }];
    if (showIsc) cols.push({ label: "Isc(kA)", w: 65, align: "end" });
    const rowH = 18;
    let tableW = cols.reduce((sum, c) => sum + c.w, 0), totalH = 0;
    let svg = `<g id="export-vd-tables" transform="translate(${startX}, ${startY})">`;
    const bgColor = S.lightMode ? "#ffffff" : "#0b1220";
    const strokeColor = S.lightMode ? "#a8bccc" : "#243755";
    const textColor = S.lightMode ? "#1a2740" : "#dce8f5";
    const accentColor = S.lightMode ? "#0077cc" : "#00cfff";
    const sortedCircuits = Array.from(circuitGroups.keys()).sort();
    sortedCircuits.forEach((circ) => {
      const rows = circuitGroups.get(circ);
      rows.sort((a, b) => b.data.duNod - a.data.duNod);
      let tableH = (rows.length + 2) * rowH;
      svg += `<g transform="translate(0, ${totalH})"><rect x="0" y="0" width="${tableW}" height="${tableH}" fill="${bgColor}" stroke="${strokeColor}" stroke-width="1.5" rx="4"/>`;
      svg += `<text x="8" y="14" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" fill="${accentColor}">CALCUL C\u0102DERI DE TENSIUNE \u2014 Sursa: ${cdLabel} | Circuit: ${circ}</text>`;
      let currentX = 0;
      svg += `<line x1="0" y1="${rowH}" x2="${tableW}" y2="${rowH}" stroke="${strokeColor}" stroke-width="1"/>`;
      cols.forEach((c) => {
        const tx = c.align === "start" ? currentX + 6 : currentX + c.w - 6;
        svg += `<text x="${tx}" y="${rowH + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="${textColor}" text-anchor="${c.align}">${c.label}</text>`;
        currentX += c.w;
      });
      svg += `<line x1="0" y1="${rowH * 2}" x2="${tableW}" y2="${rowH * 2}" stroke="${strokeColor}" stroke-width="1"/>`;
      rows.forEach((r, i) => {
        const y = rowH * (i + 2);
        let cx = 0;
        svg += `<text x="${cx + 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" font-weight="bold">${r.data.label}</text>`;
        cx += cols[0].w;
        svg += `<text x="${cx + cols[1].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" text-anchor="end">${r.data.L ? r.data.L.toFixed(0) : "-"}</text>`;
        cx += cols[1].w;
        svg += `<text x="${cx + cols[2].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" fill="${textColor}" text-anchor="end">${r.data.L_cumulat ? r.data.L_cumulat.toFixed(0) : "-"}</text>`;
        cx += cols[2].w;
        const duCol = r.data.duNod > 10 ? "#ff3d71" : r.data.duNod > 5 ? "#ff9f43" : r.data.duNod > 3 ? "#eab308" : "#00e5a0";
        svg += `<text x="${cx + cols[3].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="${duCol}" text-anchor="end">${r.data.duNod.toFixed(3)}</text>`;
        cx += cols[3].w;
        if (showIsc) {
          svg += `<text x="${cx + cols[4].w - 6}" y="${y + 13}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" fill="#ff3d71" text-anchor="end">${r.data.Isc ? r.data.Isc.toFixed(3) : "-"}</text>`;
        }
        if (i < rows.length - 1) svg += `<line x1="0" y1="${y + rowH}" x2="${tableW}" y2="${y + rowH}" stroke="${strokeColor}" stroke-width="0.5" stroke-dasharray="2,2"/>`;
      });
      svg += `</g>`;
      totalH += tableH + 15;
    });
    svg += `</g>`;
    return { svg, w: tableW, h: totalH > 0 ? totalH - 15 : 0 };
  }
  var init_ui = __esm({
    "src/ui.js"() {
      init_state();
      init_config();
      init_pole_catalog();
      init_calculations();
      init_elements();
      init_renderer();
      init_element_manager();
      init_interaction();
      init_utils();
    }
  });

  // src/element-manager.js
  var element_manager_exports = {};
  __export(element_manager_exports, {
    addElem: () => addElem,
    addMTSpanFrom: () => addMTSpanFrom,
    copyEl: () => copyEl,
    delSel: () => delSel,
    finalConn: () => finalConn,
    pasteEl: () => pasteEl,
    placeMTSpanAt: () => placeMTSpanAt,
    redo: () => redo,
    rotateSel: () => rotateSel,
    saveState: () => saveState,
    selectEl: () => selectEl,
    setMTConnect: () => setMTConnect,
    setRotationAbs: () => setRotationAbs,
    startMTSpan: () => startMTSpan,
    undo: () => undo,
    updSel: () => updSel,
    updateConnectedCables: () => updateConnectedCables
  });
  function setMTConnect(faza) {
    _pendingFaza = faza;
    _pendingSecMT = parseInt(document.getElementById("mt-sec-sel")?.value) || 70;
    setMode("connect");
    ["R", "S", "T"].forEach((f) => {
      const btn = document.getElementById(`btn-mt-${f}`);
      if (!btn) return;
      btn.style.borderColor = f === faza ? FAZA_COL[f] : "var(--border2)";
      btn.style.background = f === faza ? FAZA_COL[f] + "22" : "";
    });
    toast(`Connect MT \u2014 Faza ${faza} \xB7 OL-AL ${_pendingSecMT}mm\xB2`, "ok");
  }
  function saveState(lbl) {
    S.undoStack.push({ lbl, E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
    if (S.undoStack.length > MAX_UNDO) S.undoStack.shift();
    S.redoStack = [];
  }
  function undo() {
    if (!S.undoStack.length) {
      toast("Nimic de anulat", "ac");
      return;
    }
    S.redoStack.push({ E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
    const s = S.undoStack.pop();
    S.EL = JSON.parse(s.E);
    S.CN = JSON.parse(s.C);
    S.sel = null;
    render();
    updateProps();
    updateStat();
    toast("\u21A9 Undo", "ok");
  }
  function redo() {
    if (!S.redoStack.length) {
      toast("Nimic de ref\u0103cut", "ac");
      return;
    }
    S.undoStack.push({ E: JSON.stringify(S.EL), C: JSON.stringify(S.CN) });
    const s = S.redoStack.pop();
    S.EL = JSON.parse(s.E);
    S.CN = JSON.parse(s.C);
    S.sel = null;
    render();
    updateProps();
    updateStat();
    toast("\u21AA Redo", "ok");
  }
  function copyEl() {
    const toCopyEls = S.EL.filter((e) => S.multiSel.has(e.id) || S.sel === e.id);
    const toCopyCns = S.CN.filter((c) => S.multiSel.has(c.id) || S.sel === c.id);
    if (toCopyEls.length === 0 && toCopyCns.length === 0) {
      toast("Selecteaz\u0103 ceva", "ac");
      return;
    }
    S.clipboard = { els: JSON.parse(JSON.stringify(toCopyEls)), cns: JSON.parse(JSON.stringify(toCopyCns)) };
    toast(`\u29C9 ${toCopyEls.length + toCopyCns.length} obiecte copiate!`, "ok");
  }
  function pasteEl() {
    if (!S.clipboard || (S.clipboard.els || []).length === 0 && (S.clipboard.cns || []).length === 0) {
      toast("Clipboard gol", "ac");
      return;
    }
    saveState("paste");
    S.multiSel.clear();
    S.sel = null;
    const idMap = {};
    (S.clipboard.els || []).forEach((orig) => {
      const n = JSON.parse(JSON.stringify(orig)), newId = uid() + Math.floor(Math.random() * 1e3);
      idMap[orig.id] = newId;
      n.id = newId;
      n.x = (n.x || 0) + 40;
      n.y = (n.y || 0) + 40;
      if (n.label && !["rect", "circle", "polyline"].includes(n.type)) n.label = n.label + "_cp";
      S.EL.push(n);
      S.multiSel.add(newId);
    });
    (S.clipboard.cns || []).forEach((orig) => {
      const n = JSON.parse(JSON.stringify(orig)), newId = uid() + Math.floor(Math.random() * 1e3);
      idMap[orig.id] = newId;
      n.id = newId;
      if (n.path && Array.isArray(n.path)) n.path.forEach((p) => {
        p.x += 40;
        p.y += 40;
      });
      if (n.fromElId && idMap[n.fromElId]) n.fromElId = idMap[n.fromElId];
      else n.fromElId = null;
      if (n.toElId && idMap[n.toElId]) n.toElId = idMap[n.toElId];
      else n.toElId = null;
      if (n.from && idMap[n.from]) n.from = idMap[n.from];
      else n.from = null;
      n.label = n.label ? n.label + "_cp" : `C${S.CN.length + 1}`;
      S.CN.push(n);
      S.multiSel.add(newId);
    });
    if (S.multiSel.size === 1) {
      S.sel = Array.from(S.multiSel)[0];
      S.multiSel.clear();
    }
    render();
    updateProps();
    updateStat();
    toast(`\u2398 ${(S.clipboard.els || []).length + (S.clipboard.cns || []).length} obiecte lipite!`, "ok");
  }
  function addElem(x, y) {
    if (!S.pendType) return;
    saveState("add " + S.pendType);
    const CM = {
      ptab_1t: "#1a6ba0",
      ptab_2t: "#1a6ba0",
      trafo: "#1a6ba0",
      firida_e2_4: "#555",
      firida_e3_4: "#555",
      firida_e3_0: "#555",
      cd4: "#555",
      cd5: "#555",
      cd8: "#555",
      meter: "#555",
      stalp_se4: "#555",
      stalp_se10: "#555",
      stalp_cs: "#555",
      stalp_sc10002: "#555",
      stalp_sc10005: "#555",
      stalp_rotund: "#555",
      stalp_rotund_special: "#555",
      separator: "#0a5",
      separator_mt: "#0a5",
      manson: "#555",
      priza_pamant: "#555",
      text: "#dce8f5",
      rect: "#00cfff",
      circle: "#00cfff",
      bara_mt: "#c07000",
      celula_linie_mt: "#c07000",
      celula_trafo_mt: "#c07000",
      ptab_mono: "#c07000",
      bara_statie_mt: "#cc2200"
    };
    const el = {
      id: uid(),
      type: S.pendType,
      x: sn(x),
      y: sn(y),
      label: nextLbl(S.pendType),
      color: CM[S.pendType] || "#555",
      fillColor: "none",
      rotation: 0,
      scale: 1
    };
    if (S.pendType === "stalp_cs") el.cs_fuse = 100;
    if (S.pendType === "meter") el.bmptText = "";
    if (S.pendType === "firida_e2_4") el.fuses = new Array(6).fill(true);
    if (S.pendType === "firida_e3_4") el.fuses = new Array(7).fill(true);
    if (S.pendType === "firida_e3_0") el.fuses = new Array(3).fill(true);
    if (S.pendType === "ptab_1t") el.fuses = new Array(10).fill(true);
    if (S.pendType === "ptab_2t") el.fuses = new Array(21).fill(true);
    if (S.pendType === "cd4") el.fuses = new Array(5).fill(true);
    if (S.pendType === "cd5") el.fuses = new Array(6).fill(true);
    if (S.pendType === "cd8") el.fuses = new Array(9).fill(true);
    if (S.pendType === "ptab_mono") el.celule = [
      { tip: "L", label: "Cel.L1", curent: "400A", tensiune: "20kV", stare: true },
      { tip: "T", label: "Cel.T1", curent: "16A", putere: "100kVA", volt: "20/0.4kV", stare: true },
      { tip: "T", label: "Cel.T2", curent: "16A", putere: "100kVA", volt: "20/0.4kV", stare: true },
      { tip: "L", label: "Cel.L2", curent: "400A", tensiune: "20kV", stare: true }
    ];
    if (S.pendType === "bara_statie_mt") {
      el.nrCircuit = "2";
      el.numeStatie = "STA\u021AIE 20kV";
      el.lungime = 200;
      el.terminale = [{ pct: 25, label: "" }, { pct: 50, label: "" }, { pct: 75, label: "" }];
    }
    if (S.pendType === "rect") {
      el.width = 100;
      el.height = 100;
      el.lineType = "solid";
      el.strokeWidth = 2;
      el.fillColor = "none";
      el.label = "";
    }
    if (S.pendType === "circle") {
      el.r = 50;
      el.lineType = "solid";
      el.strokeWidth = 2;
      el.fillColor = "none";
      el.label = "";
    }
    S.EL.push(el);
    render();
    selectEl(el.id);
    S.pendType = null;
    setMode("select");
    updateStat();
  }
  function delSel() {
    if (!S.sel && S.multiSel.size === 0) return;
    saveState("delete");
    if (S.multiSel.size > 0) {
      const ids = new Set(S.multiSel);
      S.EL = S.EL.filter((e) => !ids.has(e.id));
      S.CN = S.CN.filter((c) => !ids.has(c.id) && !ids.has(c.fromElId) && !ids.has(c.toElId));
      S.multiSel.clear();
      S.sel = null;
    } else {
      S.EL = S.EL.filter((e) => e.id !== S.sel);
      S.CN = S.CN.filter((c) => c.id !== S.sel && c.fromElId !== S.sel && c.toElId !== S.sel);
      S.sel = null;
    }
    render();
    updateProps();
    updateStat();
  }
  function updSel(k, v) {
    if (!S.sel) return;
    const o = S.EL.find((e) => e.id === S.sel) || S.CN.find((c) => c.id === S.sel);
    if (o) {
      o[k] = v;
      render();
    }
  }
  function rotateSel(d) {
    const e = S.EL.find((x) => x.id === S.sel);
    if (e) setRotationAbs((e.rotation || 0) + d);
  }
  function setRotationAbs(v) {
    const e = S.EL.find((x) => x.id === S.sel);
    if (e) {
      e.rotation = (v % 360 + 360) % 360;
      updateConnectedCables(e);
      render();
      const rn = document.getElementById("p-rot-num"), rs = document.getElementById("p-rot-slider");
      if (rn && rn.value != e.rotation) rn.value = e.rotation;
      if (rs && rs.value != e.rotation) rs.value = e.rotation;
    }
  }
  function selectEl(id) {
    S.sel = id;
    render();
    updateProps();
  }
  function startMTSpan() {
    _mtSpanPrevId = null;
    _mtSpanType = document.getElementById("mt-stalp-type")?.value || "stalp_mt_se5t";
    _mtSpanSec = parseInt(document.getElementById("mt-sec-sel")?.value) || 70;
    setMode("mt_span");
    toast("Tronson MT \u2014 clic: st\xE2lp 1, clic: st\xE2lp 2 \u2026 Esc stop", "ok");
  }
  function addMTSpanFrom(fromPoleId) {
    const el = S.EL.find((e) => e.id === fromPoleId);
    if (!el) return;
    _mtSpanPrevId = fromPoleId;
    _mtSpanType = el.type;
    _mtSpanSec = parseInt(document.getElementById("mt-sec-sel")?.value) || 70;
    setMode("mt_span");
    toast(`Prelungire MT de la ${el.label || el.type} \u2014 clic: st\xE2lp nou. Esc stop`, "ok");
  }
  function placeMTSpanAt(x, y) {
    saveState("mt span");
    const newEl = {
      id: uid(),
      type: _mtSpanType,
      x: sn(x),
      y: sn(y),
      rotation: 0,
      scale: 1,
      label: nextLbl(_mtSpanType),
      color: "#555",
      fillColor: "none",
      stare: "existent"
    };
    S.EL.push(newEl);
    if (_mtSpanPrevId) {
      const prev = S.EL.find((e) => e.id === _mtSpanPrevId);
      if (prev) _connectMTPoles(prev, newEl, _mtSpanSec);
    }
    _mtSpanPrevId = newEl.id;
    selectEl(newEl.id);
    render();
    updateStat();
  }
  function _connectMTPoles(fromEl, toEl, sec) {
    const dx = toEl.x - fromEl.x, dy = toEl.y - fromEl.y;
    const horiz = Math.abs(dx) >= Math.abs(dy);
    let ftx, fty, ttx, tty;
    if (horiz) {
      ftx = dx > 0 ? 22 : -22;
      fty = 0;
      ttx = dx > 0 ? -22 : 22;
      tty = 0;
    } else {
      fty = dy > 0 ? 22 : -22;
      ftx = 0;
      tty = dy > 0 ? -22 : 22;
      ttx = 0;
    }
    const wp0 = termWorldPos(fromEl, ftx, fty);
    const wp1 = termWorldPos(toEl, ttx, tty);
    const lenM = parseFloat((Math.hypot(dx, dy) / (S.pxPerMeter || 5)).toFixed(1));
    const idx = S.CN.length;
    ["R", "S", "T"].forEach((faza, i) => {
      S.CN.push({
        id: uid(),
        fromElId: fromEl.id,
        fromTerm: { cx: ftx, cy: fty },
        toElId: toEl.id,
        toTerm: { cx: ttx, cy: tty },
        path: [{ x: wp0.x, y: wp0.y }, { x: wp1.x, y: wp1.y }],
        label: `L${idx + i + 1}`,
        length: lenM,
        color: FAZA_COL[faza],
        fillColor: "none",
        lineType: "solid",
        strokeWidth: 2.5,
        tipConductor: "OL-AL",
        sectiune: sec,
        tipRetea: "Trifazat",
        putereConc: 0,
        faza
      });
    });
  }
  function updateConnectedCables(el) {
    S.CN.forEach((cn) => {
      if (cn.fromElId === el.id && cn.fromTerm && cn.path.length >= 1) {
        const wp = termWorldPos(el, cn.fromTerm.cx, cn.fromTerm.cy);
        cn.path[0] = { x: wp.x, y: wp.y };
      }
      if (cn.toElId === el.id && cn.toTerm && cn.path.length >= 1) {
        const wp = termWorldPos(el, cn.toTerm.cx, cn.toTerm.cy);
        cn.path[cn.path.length - 1] = { x: wp.x, y: wp.y };
      }
      if (cn.from === el.id && !cn.fromElId && cn.path.length >= 1) {
        const { terms } = sym(el);
        const fp = cn.path[0];
        let best = Infinity, bw = null;
        terms.forEach((t) => {
          const wp = termWorldPos(el, t.cx, t.cy);
          const d = Math.hypot(wp.x - fp.x, wp.y - fp.y);
          if (d < best) {
            best = d;
            bw = wp;
          }
        });
        if (bw && best < 80) cn.path[0] = { x: bw.x, y: bw.y };
      }
      if (cn.to === el.id && !cn.toElId && cn.path.length >= 1) {
        const { terms } = sym(el);
        const lp = cn.path[cn.path.length - 1];
        let best = Infinity, bw = null;
        terms.forEach((t) => {
          const wp = termWorldPos(el, t.cx, t.cy);
          const d = Math.hypot(wp.x - lp.x, wp.y - lp.y);
          if (d < best) {
            best = d;
            bw = wp;
          }
        });
        if (bw && best < 80) cn.path[cn.path.length - 1] = { x: bw.x, y: bw.y };
      }
    });
  }
  function finalConn() {
    if (!S.connStart || S.connPts.length < 2) return;
    saveState("connect");
    let cableName = `C${S.CN.length + 1}`;
    const circSrc = S.connFromCircuit ? S.connFromEl : S.connToCircuit ? S.connToEl : null;
    const circNum = S.connFromCircuit || S.connToCircuit;
    if (circSrc && circNum) {
      const cdEl = S.EL.find((x) => x.id === circSrc);
      if (cdEl) cableName = `${cdEl.label || "CD"}-C${circNum}`;
    }
    const autoLenM = parseFloat((calcPathLen(S.connPts) / S.pxPerMeter).toFixed(1));
    const isMT = !!_pendingFaza;
    S.CN.push({
      id: uid(),
      fromElId: S.connFromEl,
      fromTerm: S.connFromTerm,
      toElId: S.connToEl,
      toTerm: S.connToTerm,
      path: [...S.connPts],
      label: cableName,
      length: autoLenM,
      color: isMT ? FAZA_COL[_pendingFaza] : "#ef4444",
      fillColor: "none",
      lineType: "solid",
      strokeWidth: isMT ? 2.5 : 2,
      fromCircuit: S.connFromCircuit,
      toCircuit: S.connToCircuit,
      tipConductor: isMT ? "OL-AL" : "Clasic Al",
      sectiune: isMT ? _pendingSecMT : 16,
      tipRetea: "Trifazat",
      putereConc: 0,
      ...isMT ? { faza: _pendingFaza } : {}
    });
    S.connStart = null;
    S.connPts = [];
    S.connFromEl = null;
    S.connFromTerm = null;
    S.connToEl = null;
    S.connToTerm = null;
    S.connFromCircuit = null;
    S.connToCircuit = null;
    setMode("select");
    render();
    updateStat();
  }
  var _pendingFaza, _pendingSecMT, FAZA_COL, _mtSpanPrevId, _mtSpanType, _mtSpanSec;
  var init_element_manager = __esm({
    "src/element-manager.js"() {
      init_state();
      init_config();
      init_utils();
      init_elements();
      init_renderer();
      init_ui();
      _pendingFaza = null;
      _pendingSecMT = 70;
      FAZA_COL = { R: "#ef4444", S: "#22c55e", T: "#3b82f6" };
      _mtSpanPrevId = null;
      _mtSpanType = "stalp_mt_se5t";
      _mtSpanSec = 70;
      window.baraStatieTerUpd = function(elId, idx, key, val) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el || !el.terminale) return;
        saveState("edit terminal bara");
        el.terminale[idx][key] = val;
        updateConnectedCables(el);
        render();
        updateProps();
      };
      window.baraStatieTerAdd = function(elId) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el) return;
        saveState("add terminal bara");
        if (!el.terminale) el.terminale = [];
        const used = el.terminale.map((t) => t.pct).sort((a, b) => a - b);
        let newPct = 50;
        if (used.length > 0) {
          const gaps = [];
          if (used[0] > 5) gaps.push({ start: 0, end: used[0] });
          for (let i = 0; i < used.length - 1; i++) if (used[i + 1] - used[i] > 10) gaps.push({ start: used[i], end: used[i + 1] });
          if (used[used.length - 1] < 95) gaps.push({ start: used[used.length - 1], end: 100 });
          if (gaps.length > 0) {
            const best = gaps.reduce((a, b) => b.end - b.start > a.end - a.start ? b : a);
            newPct = Math.round((best.start + best.end) / 2);
          }
        }
        el.terminale.push({ pct: newPct, label: "" });
        render();
        updateProps();
      };
      window.baraStatieTerDel = function(elId, idx) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el || !el.terminale) return;
        if (el.terminale.length <= 1) {
          toast("Minim un terminal!", "ac");
          return;
        }
        saveState("del terminal bara");
        el.terminale.splice(idx, 1);
        render();
        updateProps();
      };
      window.ptabMonoUpdCell = function(elId, idx, key, val) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el || !el.celule) return;
        saveState("edit celula");
        el.celule[idx][key] = val;
        render();
        updateProps();
      };
      window.ptabMonoAddCell = function(elId, tip) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el) return;
        saveState("add celula");
        if (!el.celule) el.celule = [];
        const n = el.celule.filter((c) => c.tip === tip).length + 1;
        if (tip === "T") el.celule.push({ tip: "T", label: `T${n}`, curent: "16A", putere: "100kVA", volt: "20/0.4kV", stare: true });
        else el.celule.push({ tip: "L", label: `L${n}`, curent: "400A", tensiune: "20kV", stare: true });
        render();
        updateProps();
        updateStat();
      };
      window.ptabMonoDelCell = function(elId, idx) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el || !el.celule) return;
        if (el.celule.length <= 1) {
          toast("Minim o celul\u0103!", "ac");
          return;
        }
        saveState("del celula");
        el.celule.splice(idx, 1);
        render();
        updateProps();
        updateStat();
      };
      window.ptabMonoMoveCell = function(elId, idx, dir) {
        const el = S.EL.find((x) => x.id === elId);
        if (!el || !el.celule) return;
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= el.celule.length) return;
        saveState("move celula");
        const tmp = el.celule[idx];
        el.celule[idx] = el.celule[newIdx];
        el.celule[newIdx] = tmp;
        render();
        updateProps();
      };
      window.toggleFuse = function(id, idx, state) {
        saveState("toggle fuse");
        const el = S.EL.find((x) => x.id === id);
        if (el) {
          if (!el.fuses) {
            if (el.type === "firida_e2_4") el.fuses = new Array(6).fill(true);
            if (el.type === "firida_e3_4") el.fuses = new Array(7).fill(true);
            if (el.type === "firida_e3_0") el.fuses = new Array(3).fill(true);
            if (el.type === "ptab_1t") el.fuses = new Array(10).fill(true);
            if (el.type === "ptab_2t") el.fuses = new Array(21).fill(true);
            if (el.type === "cd4") el.fuses = new Array(5).fill(true);
            if (el.type === "cd5") el.fuses = new Array(6).fill(true);
            if (el.type === "cd8") el.fuses = new Array(9).fill(true);
          }
          el.fuses[idx] = state;
          render();
          if (S.flowAnimOn) renderFlowLayer();
          if (document.getElementById("vd-panel").style.display === "flex" && document.getElementById("vd-src").value) runVD();
        }
      };
      window.cdAllFuses = function(id, np, state) {
        saveState("toggle all fuses");
        const el = S.EL.find((x) => x.id === id);
        if (!el) return;
        if (!el.fuses) el.fuses = new Array(np + 1).fill(true);
        for (let i = 1; i <= np; i++) el.fuses[i] = state;
        render();
        if (S.flowAnimOn) renderFlowLayer();
        updateProps();
        toast(state ? "\u2705 Toate circuitele \xEEnchise" : "\u{1F534} Toate circuitele deschise", state ? "ok" : "ac");
      };
    }
  });

  // src/renderer.js
  var renderer_exports = {};
  __export(renderer_exports, {
    MT_PHASE_PX: () => MT_PHASE_PX,
    clearBg: () => clearBg,
    closeCalib: () => closeCalib,
    confirmCalib: () => confirmCalib,
    getSvgEl: () => getSvgEl,
    initRenderer: () => initRenderer,
    loadBg: () => loadBg,
    mk: () => mk,
    render: () => render,
    renderBg: () => renderBg,
    renderFlowLayer: () => renderFlowLayer,
    renderVDOverlay: () => renderVDOverlay,
    startCalib: () => startCalib,
    toggleBgPanel: () => toggleBgPanel,
    toggleFlowAnim: () => toggleFlowAnim,
    toggleTheme: () => toggleTheme,
    toggleVDOverlay: () => toggleVDOverlay,
    updateBgLock: () => updateBgLock,
    updateBgOp: () => updateBgOp
  });
  function initRenderer(svgEl, VP, NL, CL, GL) {
    _svgEl2 = svgEl;
    _VP2 = VP;
    _NL = NL;
    _CL = CL;
    _GL = GL;
  }
  function getSvgEl() {
    return _svgEl2;
  }
  function mk(t) {
    return document.createElementNS("http://www.w3.org/2000/svg", t);
  }
  function _mtOffsetPath(path, faza, fromElId, toElId) {
    const dir = _MT_FAZA_DIR[faza];
    if (!dir || path.length < 2) return path;
    const p0 = path[0], pn = path[path.length - 1];
    const dx = pn.x - p0.x, dy = pn.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return path;
    const nx = -dy / len, ny = dx / len;
    const off = dir * MT_PHASE_PX;
    const result = path.map((p) => ({ x: p.x + nx * off, y: p.y + ny * off }));
    const _clip = (pt, elId) => {
      const el = elId ? S.EL.find((e) => e.id === elId) : null;
      if (!el || !el.type?.startsWith("stalp_mt_")) return pt;
      const ex = pt.x - el.x, ey = pt.y - el.y, d = Math.hypot(ex, ey);
      if (d <= _MT_POLE_R || d < 0.1) return pt;
      return { x: el.x + ex / d * _MT_POLE_R, y: el.y + ey / d * _MT_POLE_R };
    };
    result[0] = _clip(result[0], fromElId);
    result[result.length - 1] = _clip(result[result.length - 1], toElId);
    return result;
  }
  function renderBg() {
    const bgL = document.getElementById("bg-layer");
    if (!bgL) return;
    if (!S.bgData.url) {
      bgL.innerHTML = "";
      return;
    }
    bgL.innerHTML = `<img id="html-bg-img" src="${S.bgData.url}" style="position:absolute; left:${S.bgData.x}px; top:${S.bgData.y}px; width:${S.bgData.w}px; height:${S.bgData.h}px; opacity:${S.bgData.op}; will-change:transform;" />`;
  }
  function toggleBgPanel() {
    const p = document.getElementById("bg-panel");
    p.style.display = p.style.display === "flex" ? "none" : "flex";
  }
  function loadBg(inp) {
    const f = inp.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        S.bgData = { url: e.target.result, x: -img.width / 2, y: -img.height / 2, w: img.width, h: img.height, op: parseFloat(document.getElementById("bg-op").value), locked: document.getElementById("bg-lock").checked };
        renderBg();
        toast("Fundal \xEEnc\u0103rcat! \xCEl po\u021Bi calibra pentru o distan\u021B\u0103 exact\u0103.", "ok");
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(f);
    inp.value = "";
  }
  function updateBgOp(val) {
    S.bgData.op = parseFloat(val);
    const img = document.getElementById("html-bg-img");
    if (img) img.style.opacity = S.bgData.op;
  }
  function updateBgLock(val) {
    S.bgData.locked = val;
  }
  function clearBg() {
    if (confirm("\u0218tergi fundalul cadastral?")) {
      S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
      renderBg();
    }
  }
  function startCalib() {
    if (!S.bgData.url) {
      toast("\xCEnc\u0103rca\u021Bi un fundal mai \xEEnt\xE2i!", "ac");
      return;
    }
    setMode("calibrate");
    toast("Click P1, apoi P2 pe hart\u0103.", "ac");
  }
  function confirmCalib() {
    const d_m = document.getElementById("calib-input").value;
    if (d_m && !isNaN(parseFloat(d_m)) && parseFloat(d_m) > 0) {
      const target_px = parseFloat(d_m) * S.pxPerMeter;
      const scale = target_px / S.tempCalibLenPx;
      if (S.bgData.url) {
        S.bgData.w *= scale;
        S.bgData.h *= scale;
        S.bgData.x = S.calibPts[0].x - (S.calibPts[0].x - S.bgData.x) * scale;
        S.bgData.y = S.calibPts[0].y - (S.calibPts[0].y - S.bgData.y) * scale;
        renderBg();
        toast("Scar\u0103 fundal calibrat\u0103 cu succes!", "ok");
      }
    } else {
      toast("Calibrare anulat\u0103 (valoare invalid\u0103).", "w");
    }
    closeCalib();
  }
  function closeCalib() {
    document.getElementById("calib-modal").style.display = "none";
    setMode("select");
    S.calibPts = [];
    S.tempCalibLenPx = 0;
    document.getElementById("tpoly").style.display = "none";
  }
  function toggleTheme() {
    S.lightMode = !S.lightMode;
    document.documentElement.setAttribute("data-theme", S.lightMode ? "light" : "");
    document.getElementById("btn-theme").textContent = S.lightMode ? "\u2600\uFE0F" : "\u{1F319}";
    render();
    toast(S.lightMode ? "\u2600\uFE0F Tem\u0103 luminoas\u0103" : "\u{1F319} Tem\u0103 \xEEntunecat\u0103");
  }
  function toggleVDOverlay() {
    S.vdOverlayOn = document.getElementById("vd-overlay").checked;
    if (S.vdOverlayOn && S.vdResults) renderVDOverlay();
    else document.getElementById("VD-OVL")?.remove();
  }
  function renderVDOverlay() {
    let ovl = document.getElementById("VD-OVL");
    if (!ovl) {
      ovl = document.createElementNS("http://www.w3.org/2000/svg", "g");
      ovl.id = "VD-OVL";
      _VP2.appendChild(ovl);
    }
    ovl.innerHTML = "";
    if (!S.vdResults) return;
    const fuseA = parseFloat(document.getElementById("vd-fuse")?.value) || 160;
    const showIsc = document.getElementById("vd-show-isc")?.checked !== false;
    const byEl = /* @__PURE__ */ new Map();
    S.vdResults.forEach((data) => {
      if (!byEl.has(data.elId)) byEl.set(data.elId, []);
      byEl.get(data.elId).push(data);
    });
    byEl.forEach((dataList, elId) => {
      const el = S.EL.find((x) => x.id === elId);
      if (!el || el.type === "text" || el.type === "polyline") return;
      if (el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type === "celula_linie_mt" || el.type === "celula_trafo_mt" || el.type === "bara_mt" || el.type === "bara_statie_mt") return;
      dataList.forEach((data, index) => {
        if (data.duNod === 0 && !data.duTronson) return;
        const evalFuse = data.protected_by || fuseA;
        const iscAmps = data.Isc * 1e3;
        const isIscLow = showIsc && iscAmps > 0 && iscAmps < 3 * evalFuse;
        let col = data.duNod > 10 ? "#ff3d71" : data.duNod > 5 ? "#ff9f43" : data.duNod > 3 ? "#eab308" : "#00e5a0";
        let bgHex = col, bgOp = data.duNod > 10 ? "0.18" : data.duNod > 5 ? "0.15" : data.duNod > 3 ? "0.12" : "0.10";
        if (isIscLow) {
          col = "#ff3d71";
          bgHex = "#ff3d71";
          bgOp = "0.18";
        }
        const txtDU = `[${data.circKey}] \u0394U=${data.duNod.toFixed(2)}%`;
        const hasIsc = showIsc && (data.isEnd || el.nod === "capat" || isIscLow);
        let txtIsc = hasIsc ? `Isc=${data.Isc.toFixed(3)}kA${isIscLow ? " \u26A0 CS!" : ""}` : "";
        const bwDU = txtDU.length * 5.5 + 10, bhLine = 14;
        const bw = Math.max(bwDU, hasIsc ? txtIsc.length * 5.5 + 10 : 0);
        const totalH = hasIsc ? bhLine * 2 + 2 : bhLine;
        const yOffset = -totalH - 28 - index * (totalH + 4);
        ovl.innerHTML += `<rect x="${el.x - bw / 2}" y="${el.y + yOffset}" width="${bw}" height="${totalH}" fill="${bgHex}" fill-opacity="${bgOp}" stroke="${col}" stroke-width="1" rx="3" pointer-events="none"/>`;
        ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5}" text-anchor="middle" font-size="8.5" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none">${txtDU}</text>`;
        if (hasIsc) ovl.innerHTML += `<text x="${el.x}" y="${el.y + yOffset + 10.5 + bhLine}" text-anchor="middle" font-size="7.5" fill="${isIscLow ? "#ff3d71" : "#ff9f43"}" font-family="JetBrains Mono,monospace" font-weight="600" pointer-events="none">${txtIsc}</text>`;
      });
    });
  }
  function toggleFlowAnim() {
    S.flowAnimOn = !S.flowAnimOn;
    const btn = document.getElementById("btn-flow");
    btn.classList.toggle("on", S.flowAnimOn);
    btn.style.background = S.flowAnimOn ? "rgba(234,179,8,.15)" : "";
    btn.style.color = S.flowAnimOn ? "#eab308" : "";
    btn.style.borderColor = S.flowAnimOn ? "rgba(234,179,8,.45)" : "";
    renderFlowLayer();
    toast(S.flowAnimOn ? "\u26A1 Anima\u021Bie flux activat\u0103" : "Anima\u021Bie flux oprit\u0103", S.flowAnimOn ? "ok" : "");
  }
  function renderFlowLayer() {
    const gl = document.getElementById("GL");
    if (!gl) return;
    gl.innerHTML = "";
    if (!S.flowAnimOn) return;
    S.CN.forEach((cn) => {
      if (!cn.flowDir || !cn.path || cn.path.length < 2) return;
      if (cn.fromElId && cn.fromCircuit) {
        const srcEl = S.EL.find((e) => e.id === cn.fromElId);
        if (srcEl && srcEl.fuses && srcEl.fuses[cn.fromCircuit] === false) return;
      }
      if (cn.toElId && cn.toCircuit) {
        const srcEl = S.EL.find((e) => e.id === cn.toElId);
        if (srcEl && srcEl.fuses && srcEl.fuses[cn.toCircuit] === false) return;
      }
      const col = cn.color || "#ef4444", sw = Math.max(2, (cn.strokeWidth || 2) + 1.5), isRev = cn.flowDir === "rev";
      let dStr = `M ${cn.path[0].x},${cn.path[0].y} `;
      for (let i = 1; i < cn.path.length; i++) dStr += `L ${cn.path[i].x},${cn.path[i].y} `;
      let totalLen = 0;
      for (let i = 0; i < cn.path.length - 1; i++) totalLen += Math.hypot(cn.path[i + 1].x - cn.path[i].x, cn.path[i + 1].y - cn.path[i].y);
      const speedClass = totalLen < 100 ? "fast" : totalLen > 500 ? "slow" : "";
      const offset = Math.random() * 40;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", dStr);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", col);
      path.setAttribute("stroke-width", sw);
      path.setAttribute("stroke-opacity", "0.85");
      path.setAttribute("class", `flow-arrow${isRev ? " rev" : ""}${speedClass ? " " + speedClass : ""}`);
      path.style.animationDelay = `-${offset.toFixed(1)}s`;
      gl.appendChild(path);
      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", dStr);
      path2.setAttribute("fill", "none");
      path2.setAttribute("stroke", "#ffffff");
      path2.setAttribute("stroke-width", Math.max(1.5, sw * 0.45));
      path2.setAttribute("stroke-opacity", "0.7");
      path2.setAttribute("class", `flow-arrow${isRev ? " rev" : ""}${speedClass ? " " + speedClass : ""}`);
      path2.style.animationDelay = `-${offset.toFixed(1)}s`;
      gl.appendChild(path2);
    });
  }
  function render() {
    _NL.innerHTML = "";
    _CL.innerHTML = "";
    S.CN.forEach((cn) => {
      const isSel = cn.id === S.sel || S.multiSel.has(cn.id), col = cn.color || "#ef4444", sw = cn.strokeWidth || 2, dash = cn.lineType === "dashed" ? 'stroke-dasharray="10,5"' : "";
      const rp = cn.faza ? _mtOffsetPath(cn.path, cn.faza, cn.fromElId, cn.toElId) : cn.path;
      let dStr = "", JUMP_R = 6;
      if (rp.length > 0) {
        for (let i = 0; i < rp.length - 1; i++) {
          const p1 = rp[i], p2 = rp[i + 1];
          if (i === 0) dStr += `M ${p1.x},${p1.y} `;
          let inters = [];
          S.CN.forEach((otherCn) => {
            if (otherCn.id >= cn.id) return;
            for (let j = 0; j < otherCn.path.length - 1; j++) {
              const int = getLineIntersection(p1, p2, otherCn.path[j], otherCn.path[j + 1]);
              if (int) inters.push({ x: int.x, y: int.y, dist: Math.hypot(int.x - p1.x, int.y - p1.y) });
            }
          });
          inters.sort((a, b) => a.dist - b.dist);
          const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy);
          if (len > 0) {
            const ux = dx / len, uy = dy / len;
            let validInters = [];
            inters.forEach((int) => {
              if (validInters.length === 0) {
                if (int.dist > JUMP_R && len - int.dist > JUMP_R) validInters.push(int);
              } else {
                if (int.dist - validInters[validInters.length - 1].dist > JUMP_R * 2.5 && len - int.dist > JUMP_R) validInters.push(int);
              }
            });
            validInters.forEach((int) => {
              dStr += `L ${int.x - ux * JUMP_R},${int.y - uy * JUMP_R} A ${JUMP_R} ${JUMP_R} 0 0 1 ${int.x + ux * JUMP_R},${int.y + uy * JUMP_R} `;
            });
          }
          dStr += `L ${p2.x},${p2.y} `;
        }
      }
      const g = mk("g");
      g.setAttribute("class", `conn ${isSel ? "sel" : ""}`);
      const isDemontat = cn.stare === "demontat", demDash = isDemontat ? 'stroke-dasharray="8,6"' : "", finalDash = dash || demDash;
      let hlPath = "";
      if (cn.fillColor && cn.fillColor !== "none") hlPath = `<path d="${dStr}" fill="none" stroke="${cn.fillColor}" stroke-width="${sw + 8}" opacity="0.45" pointer-events="none"/>`;
      let demXmarks = "";
      if (isDemontat && cn.path.length >= 2) {
        for (let i = 0; i < cn.path.length - 1; i++) {
          const p1 = cn.path[i], p2 = cn.path[i + 1], segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const xCount = Math.max(1, Math.floor(segLen / 40));
          for (let j = 1; j <= xCount; j++) {
            const t2 = j / (xCount + 1), cx2 = p1.x + (p2.x - p1.x) * t2, cy2 = p1.y + (p2.y - p1.y) * t2, xr = 4;
            demXmarks += `<line x1="${cx2 - xr}" y1="${cy2 - xr}" x2="${cx2 + xr}" y2="${cy2 + xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
            demXmarks += `<line x1="${cx2 + xr}" y1="${cy2 - xr}" x2="${cx2 - xr}" y2="${cy2 + xr}" stroke="#6b7280" stroke-width="2" pointer-events="none"/>`;
          }
        }
      }
      const pts = rp.map((p) => `${p.x},${p.y}`).join(" ");
      g.innerHTML = `<polyline class="hb" points="${pts}" fill="none" stroke="transparent" stroke-width="16" style="pointer-events:stroke;cursor:pointer"/>${hlPath}<path class="cl" d="${dStr}" fill="none" stroke="${col}" stroke-width="${isSel ? sw + 2 : sw}" ${finalDash} pointer-events="none"/>${demXmarks}`;
      if (rp.length >= 2) {
        let maxLen = -1, bestP1 = rp[0], bestP2 = rp[1];
        for (let i = 0; i < rp.length - 1; i++) {
          let d = Math.hypot(rp[i + 1].x - rp[i].x, rp[i + 1].y - rp[i].y);
          if (d > maxLen) {
            maxLen = d;
            bestP1 = rp[i];
            bestP2 = rp[i + 1];
          }
        }
        let mx = (bestP1.x + bestP2.x) / 2, my = (bestP1.y + bestP2.y) / 2;
        let isHoriz = Math.abs(bestP2.x - bestP1.x) >= Math.abs(bestP2.y - bestP1.y);
        let tx = mx, ty = my, rot = 0;
        if (isHoriz) {
          ty -= 7;
        } else {
          tx += 7;
          rot = -90;
        }
        let tr = rot ? `transform="rotate(${rot} ${tx} ${ty})"` : "";
        let hlStyle = cn.fillColor && cn.fillColor !== "none" ? `stroke:${cn.fillColor}; stroke-width:3px; paint-order:stroke fill;` : "";
        g.innerHTML += `<text class="el-lbl" x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="9" fill="${col}" font-family="JetBrains Mono,monospace" font-weight="700" pointer-events="none" style="${hlStyle}" ${tr}>L=${cn.length || 0}m</text>`;
        if (cn.faza) {
          const fazaCol = { R: "#ef4444", S: "#22c55e", T: "#3b82f6" }[cn.faza] || "#888";
          const bx = isHoriz ? mx + 18 : mx + 18, by = isHoriz ? my - 7 : my + 12;
          g.innerHTML += `<circle cx="${bx}" cy="${by}" r="6" fill="${fazaCol}" stroke="rgba(0,0,0,.25)" stroke-width="1" pointer-events="none"/><text x="${bx}" y="${by}" text-anchor="middle" dominant-baseline="central" font-size="7.5" fill="white" font-weight="bold" pointer-events="none">${cn.faza}</text>`;
        }
      }
      g.querySelector(".hb").addEventListener("mousedown", (ev) => {
        ev.stopPropagation();
        if (S.mode === "select") {
          if (ev.ctrlKey || ev.metaKey) {
            if (S.multiSel.has(cn.id)) S.multiSel.delete(cn.id);
            else S.multiSel.add(cn.id);
            S.sel = null;
            render();
            updateProps();
            return;
          }
          if (S.multiSel.size > 1 && S.multiSel.has(cn.id)) {
            S.multiDragStart = { mouseX: svgPt(ev).x, mouseY: svgPt(ev).y, origPositions: S.EL.filter((e) => S.multiSel.has(e.id)).map((e) => ({ id: e.id, x: e.x, y: e.y })), origConnPaths: S.CN.filter((c) => S.multiSel.has(c.id)).map((c) => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) })) };
            const _selIds = new Set(S.multiDragStart.origPositions.map((o) => o.id));
            S.CN.forEach((cn2) => {
              if (!S.multiSel.has(cn2.id) && (_selIds.has(cn2.fromElId) && _selIds.has(cn2.toElId))) cn2._origPath = JSON.parse(JSON.stringify(cn2.path));
            });
            S.dragging = true;
            S.dragEl = null;
          } else {
            S.multiSel.clear();
            selectEl(cn.id);
          }
        }
      });
      if (isSel && S.mode === "select") {
        cn.path.forEach((p, i) => {
          const h = mk("circle");
          h.setAttribute("class", "ph");
          h.setAttribute("cx", p.x);
          h.setAttribute("cy", p.y);
          h.setAttribute("r", "6");
          h.addEventListener("mousedown", (ev) => {
            ev.stopPropagation();
            if (ev.button === 2 && cn.path.length > 2) {
              saveState("rmv pt");
              cn.path.splice(i, 1);
              render();
            } else {
              S.vxDrag = true;
              S.vxConn = cn;
              S.vxIdx = i;
            }
          });
          g.appendChild(h);
        });
      }
      _CL.appendChild(g);
    });
    S.EL.forEach((el) => {
      if (el.type === "poly_arrow") {
        el.type = "polyline";
        el.arrowEnd = true;
        el.arrowStart = false;
        el.lineType = "solid";
        el.strokeWidth = 2.5;
      }
      const isSel = el.id === S.sel;
      if (el.type === "text") {
        const g2 = mk("g");
        g2.setAttribute("class", `el ${isSel ? "sel" : ""}`);
        g2.dataset.eid = el.id;
        const hlStyle2 = el.fillColor && el.fillColor !== "none" ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : "";
        const sc = el.scale || 1;
        g2.setAttribute("transform", `translate(${el.x},${el.y}) rotate(${el.rotation || 0}) scale(${sc})`);
        g2.innerHTML = `<text x="0" y="0" font-size="${el.fontSize || 10}" fill="${el.color || (S.lightMode ? "#1a2740" : "#dce8f5")}" font-family="Barlow Condensed,sans-serif" font-weight="700" style="${hlStyle2}">${el.label || "Text"}</text>`;
        g2.addEventListener("mousedown", (ev) => {
          if (S.mode === "select") {
            ev.stopPropagation();
            S.dragging = true;
            S.dragEl = el;
            S.dragOff = { x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y };
            selectEl(el.id);
          }
        });
        _NL.appendChild(g2);
        return;
      }
      if (el.type === "polyline") {
        const g2 = mk("g");
        g2.setAttribute("class", `el ${isSel ? "sel" : ""}`);
        g2.dataset.eid = el.id;
        const pts = el.points.map((p) => `${p.x},${p.y}`).join(" "), dash = el.lineType === "dashed" ? 'stroke-dasharray="10,5"' : "", sw = el.strokeWidth || 2.5;
        let markersDef = "";
        if (el.arrowEnd) markersDef += `<marker id="arr-e-${el.id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${el.color || "#00cfff"}"/></marker>`;
        if (el.arrowStart) markersDef += `<marker id="arr-s-${el.id}" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><polygon points="0 0,8 3,0 6" fill="${el.color || "#00cfff"}"/></marker>`;
        let markersAttr = "";
        if (el.arrowEnd) markersAttr += ` marker-end="url(#arr-e-${el.id})"`;
        if (el.arrowStart) markersAttr += ` marker-start="url(#arr-s-${el.id})"`;
        g2.innerHTML = `<defs>${markersDef}</defs><polyline points="${pts}" fill="none" stroke="${el.color || "#00cfff"}" stroke-width="${sw}" ${dash} ${markersAttr}/>`;
        if (isSel) el.points.forEach((p, i) => {
          const h = mk("circle");
          h.setAttribute("class", "ph");
          h.setAttribute("cx", p.x);
          h.setAttribute("cy", p.y);
          h.setAttribute("r", "6");
          h.addEventListener("mousedown", (ev) => {
            ev.stopPropagation();
            S.vxDrag = true;
            S.vxConn = el;
            S.vxIdx = i;
          });
          g2.appendChild(h);
        });
        g2.addEventListener("mousedown", (ev) => {
          if (S.mode === "select") {
            ev.stopPropagation();
            S.dragging = true;
            S.dragEl = el;
            S.dragOff = { x: svgPt(ev).x - el.points[0].x, y: svgPt(ev).y - el.points[0].y };
            selectEl(el.id);
          }
        });
        _NL.appendChild(g2);
        return;
      }
      const { inner } = sym(el);
      const g = mk("g");
      g.setAttribute("class", `el ${isSel ? "sel" : ""}`);
      g.dataset.eid = el.id;
      g.setAttribute("transform", `translate(${el.x},${el.y}) rotate(${el.rotation || 0}) scale(${el.scale || 1})`);
      const isMSel = S.multiSel.has(el.id), wBox = symW(el), hBox = symH(el);
      let selBox = "";
      if (isSel) selBox = `<rect x="${-wBox / 2 - 5}" y="${-hBox / 2 - 5}" width="${wBox + 10}" height="${hBox + 10}" fill="none" stroke="rgba(0,207,255,.7)" stroke-width="2" stroke-dasharray="5,3" rx="3" pointer-events="none"/>`;
      else if (isMSel) selBox = `<rect x="${-wBox / 2 - 5}" y="${-hBox / 2 - 5}" width="${wBox + 10}" height="${hBox + 10}" fill="rgba(0,207,255,.06)" stroke="rgba(0,207,255,.45)" stroke-width="1.5" stroke-dasharray="4,4" rx="3" pointer-events="none"/>`;
      const hlStyle = el.fillColor && el.fillColor !== "none" ? `stroke:${el.fillColor}; stroke-width:4px; paint-order:stroke fill;` : "";
      let lbl = "";
      if (el.label) {
        if (!el.type.startsWith("firida_") && !el.type.startsWith("stalp_") && !el.type.startsWith("ptab_")) {
          lbl = `<text class="el-lbl" x="12" y="${-(hBox / 2) - 10}" text-anchor="start" font-size="11" fill="${el.color || (S.lightMode ? "#1a2740" : "#dce8f5")}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ""}</text>`;
        } else {
          const ly = hBox / 2 + 16, nodBadge = el.nod ? `<text class="el-lbl" x="12" y="${ly + 12}" text-anchor="start" font-size="8" fill="${el.nod === "nod" ? "#ff9f43" : el.nod === "capat" ? "#00e5a0" : "#00cfff"}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">[${el.nod.toUpperCase()}]</text>` : "";
          lbl = `<text class="el-lbl" x="12" y="${ly}" text-anchor="start" font-size="11" fill="${el.color || (S.lightMode ? "#1a2740" : "#dce8f5")}" font-family="Barlow Condensed,sans-serif" font-weight="700" pointer-events="none" style="${hlStyle}">${el.label || ""}</text>${nodBadge}`;
        }
      }
      g.innerHTML = selBox + inner + lbl;
      g.addEventListener("mousedown", (ev) => {
        if (S.mode === "select") {
          ev.stopPropagation();
          if (ev.ctrlKey || ev.metaKey) {
            if (S.multiSel.has(el.id)) S.multiSel.delete(el.id);
            else S.multiSel.add(el.id);
            S.sel = null;
            render();
            updateProps();
            return;
          }
          if (S.multiSel.size > 1 && S.multiSel.has(el.id)) {
            S.multiDragStart = { mouseX: svgPt(ev).x, mouseY: svgPt(ev).y, origPositions: S.EL.filter((e) => S.multiSel.has(e.id)).map((e) => ({ id: e.id, x: e.x, y: e.y })), origConnPaths: S.CN.filter((c) => S.multiSel.has(c.id)).map((c) => ({ id: c.id, path: JSON.parse(JSON.stringify(c.path)) })) };
            const _selIds = new Set(S.multiDragStart.origPositions.map((o) => o.id));
            S.CN.forEach((cn2) => {
              if (!S.multiSel.has(cn2.id) && (_selIds.has(cn2.fromElId) && _selIds.has(cn2.toElId))) cn2._origPath = JSON.parse(JSON.stringify(cn2.path));
            });
            S.dragging = true;
            S.dragEl = null;
          } else {
            S.multiSel.clear();
            S.dragging = true;
            S.dragEl = el;
            S.dragOff = { x: svgPt(ev).x - el.x, y: svgPt(ev).y - el.y };
            selectEl(el.id);
          }
          render();
        }
      });
      g.querySelectorAll(".td").forEach((tdEl) => {
        tdEl.addEventListener("mousedown", (ev) => {
          if (S.mode !== "connect") return;
          ev.stopPropagation();
          const lcx = parseFloat(tdEl.dataset.lcx), lcy = parseFloat(tdEl.dataset.lcy), circuit = tdEl.dataset.circuit ? parseInt(tdEl.dataset.circuit) : null, wp = termWorldPos(el, lcx, lcy);
          if (!S.connStart) {
            S.connStart = el.id;
            S.connPts = [{ x: wp.x, y: wp.y }];
            S.connFromEl = el.id;
            S.connFromTerm = { cx: lcx, cy: lcy };
            S.connFromCircuit = circuit;
            S.connToEl = null;
            S.connToTerm = null;
            S.connToCircuit = null;
            toast("Terminal START \u2014 click pe plan\u0219\u0103 sau alt terminal", "ac");
          } else {
            S.connToEl = el.id;
            S.connToTerm = { cx: lcx, cy: lcy };
            S.connToCircuit = circuit;
            S.connPts.push({ x: wp.x, y: wp.y });
            finalConn();
          }
        });
      });
      if (el.type === "meter") {
        const tn = g.querySelector(".bmpt-txt");
        if (tn) tn.addEventListener("dblclick", (ev) => {
          ev.stopPropagation();
          const nv = prompt("Editeaz\u0103 BMPT:", el.bmptText || "");
          if (nv !== null) {
            saveState("edit bmpt");
            el.bmptText = nv;
            render();
          }
        });
      }
      _NL.appendChild(g);
    });
    if (S.vdOverlayOn && S.vdResults) renderVDOverlay();
    if (S.flowAnimOn) renderFlowLayer();
  }
  var _svgEl2, _VP2, _NL, _CL, _GL, MT_PHASE_PX, _MT_FAZA_DIR, _MT_POLE_R;
  var init_renderer = __esm({
    "src/renderer.js"() {
      init_state();
      init_utils();
      init_elements();
      init_element_manager();
      init_ui();
      MT_PHASE_PX = 14;
      _MT_FAZA_DIR = { R: 1, S: 0, T: -1 };
      _MT_POLE_R = 22;
    }
  });

  // src/app.js
  init_state();
  init_config();
  init_utils();
  init_renderer();
  init_interaction();
  init_ui();
  init_element_manager();
  init_project();
  init_auth();
  init_export();

  // src/fc-helpers.js
  init_state();
  init_utils();
  init_utils();
  function fcCableLenM(cn) {
    if (cn.length != null && !isNaN(parseFloat(cn.length))) return parseFloat(cn.length);
    if (cn.pts && cn.pts.length >= 2) return calcPathLen(cn.pts) / S.pxPerMeter;
    return 0;
  }
  function fcCableAerian(cn) {
    const tc = (cn.tipConductor || "").toLowerCase();
    return tc.includes("torsadat") || tc.includes("clasic");
  }
  function fcIsMono(cn, bmptEl) {
    if (bmptEl && bmptEl.bmptText) {
      const t = bmptEl.bmptText.toUpperCase();
      if (t.includes("BMPM")) return true;
      if (t.includes("BMPT")) return false;
    }
    return cn.tipRetea === "Monofazat";
  }
  function fcFromFirida(cn, bmptEl) {
    if (!bmptEl) return false;
    const otherId = cn.fromElId === bmptEl.id ? cn.toElId : cn.fromElId;
    const other = S.EL.find((e) => e.id === otherId);
    return !!(other && other.type && other.type.startsWith("firida_"));
  }
  function fcDeschideriSupl(cn, bmptEl, lenM) {
    const otherId = cn.fromElId === bmptEl.id ? cn.toElId : cn.fromElId;
    const sePrintermediari = S.EL.filter(
      (e) => e.type === "stalp_se4" && e.stare === "proiectat_racordare" && e.id !== otherId
    );
    if (sePrintermediari.length === 0) {
      if (lenM <= 30) return 0;
      return Math.ceil((lenM - 30) / 40);
    }
    return sePrintermediari.length;
  }
  function computeCantitatiFC() {
    const q = /* @__PURE__ */ new Map();
    const add = (pozId, n) => {
      if (!n) return;
      q.set(pozId, (q.get(pozId) || 0) + n);
    };
    const cabluri = S.CN.filter((cn) => cn.stare === "proiectat_racordare" || cn.stare === "intarire_nou" || cn.stare === "intarire_inlocuire");
    cabluri.forEach((cn) => {
      const fromEl = S.EL.find((e) => e.id === cn.fromElId);
      const toEl = S.EL.find((e) => e.id === cn.toElId);
      const isBrans = fromEl && fromEl.type === "meter" || toEl && toEl.type === "meter";
      const lenM = fcCableLenM(cn);
      if (isBrans) {
        const bmptEl = fromEl && fromEl.type === "meter" ? fromEl : toEl;
        const aerian = fcCableAerian(cn);
        const mono = fcIsMono(cn, bmptEl);
        const fromFirida = fcFromFirida(cn, bmptEl);
        if (aerian) {
          if (mono) {
            add(1, 1);
            add(2, fcDeschideriSupl(cn, bmptEl, lenM));
          } else {
            add(7, 1);
            add(8, fcDeschideriSupl(cn, bmptEl, lenM));
          }
        } else {
          const supl = Math.max(0, lenM - 20);
          if (mono) {
            if (fromFirida) {
              add(5, 1);
            } else {
              add(4, 1);
            }
            add(6, Math.round(supl));
          } else {
            if (fromFirida) {
              add(11, 1);
            } else {
              add(10, 1);
            }
            add(13, Math.round(supl));
          }
        }
      } else {
        const aerian = fcCableAerian(cn);
        const km = lenM / 1e3;
        if (cn.stare === "intarire_inlocuire" && aerian) {
          add(43, km);
        } else if (aerian) {
          const stPe = [fromEl, toEl].filter((e) => e && e.type && e.type.startsWith("stalp_"));
          const areStalpProiectat = stPe.some((e) => e.stare === "proiectat_racordare" || e.stare === "intarire_nou");
          if (areStalpProiectat) add(37, km);
          else add(40, km);
        } else {
          add(38, km);
        }
      }
    });
    S.EL.forEach((e) => {
      if (e.stare === "intarire_inlocuire") {
        if (e.type === "stalp_se4") add(47, 1);
        else if (e.type === "stalp_se10") add(48, 1);
      }
    });
    return q;
  }
  async function generateFC() {
    if (!window.ExcelJS) {
      toast("ExcelJS nu e \xEEnc\u0103rcat!", "");
      return;
    }
    if (!window.FC_TEMPLATE_B64) {
      toast("Template FC nu e \xEEnc\u0103rcat (fc_template.js)!", "");
      return;
    }
    toast("Generez Fi\u0219a de Calcul...", "ac");
    const binStr = atob(window.FC_TEMPLATE_B64);
    const buf = new ArrayBuffer(binStr.length);
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const dePrintat = wb.getWorksheet("DE PRINTAT");
    const fcCalcul = wb.getWorksheet("FC CALCUL");
    const beneficiar = (document.getElementById("fs-beneficiar") || {}).value || "";
    const atr = (document.getElementById("fs-nr") || {}).value || "";
    const localitate = (document.getElementById("fs-localitate") || {}).value || "";
    if (dePrintat) {
      dePrintat.getCell("C1").value = beneficiar;
      dePrintat.getCell("C2").value = atr;
      dePrintat.getCell("C3").value = localitate;
    }
    const q = computeCantitatiFC();
    if (fcCalcul) {
      q.forEach((cant, pozId) => {
        fcCalcul.getCell(`G${pozId + 9}`).value = cant;
      });
    }
    if (dePrintat) {
      const spargeri = wb.getWorksheet("Spargeri si refacere carosabil");
      const avize = wb.getWorksheet("AVIZE SI ACORDURI");
      const readNum = (v) => {
        if (v == null) return 0;
        if (typeof v === "object" && "result" in v) v = v.result;
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
      };
      const sections = [
        { start: 10, end: 94, prefix: "A.", source: (i) => fcCalcul ? readNum(fcCalcul.getCell(`G${i}`).value) : 0 },
        { start: 99, end: 115, prefix: "B.", source: (i) => spargeri ? readNum(spargeri.getCell(`G${i - 96}`).value) : 0 },
        {
          start: 120,
          end: 141,
          prefix: "C.",
          source: (i) => {
            if (!avize) return 0;
            const v = avize.getCell(`C${i - 113}`).value;
            return v && String(v).trim() ? 1 : 0;
          }
        }
      ];
      sections.forEach((s) => {
        let n = 1;
        for (let i = s.start; i <= s.end; i++) {
          const row = dePrintat.getRow(i);
          const hasCant = s.source(i) > 0;
          if (hasCant) {
            row.hidden = false;
            row.getCell(1).value = s.prefix + n;
            n++;
          } else {
            row.hidden = true;
          }
        }
      });
    }
    wb.calcProperties = wb.calcProperties || {};
    wb.calcProperties.fullCalcOnLoad = true;
    const outBuf = await wb.xlsx.writeBuffer();
    const blob = new Blob([outBuf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fname = `Fisa_Calcul_${(beneficiar || "client").replace(/[^\w-]/g, "_")}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 100);
    toast("Fi\u0219a de Calcul generat\u0103 \u2713", "ok");
  }
  window.generateFC = generateFC;

  // src/fs-module.js
  init_state();
  init_utils();
  init_export();
  function openFSModal() {
    document.getElementById("fs-modal").style.display = "flex";
    const ptEl = S.EL.find((e) => e.type === "trafo" || e.type === "ptab_1t" || e.type === "ptab_2t");
    if (ptEl) {
      const nrTrafo = ptEl.type === "ptab_2t" ? "2" : "1";
      const pw = ptEl.type === "trafo" ? (ptEl.trText || { power: "160kVA" }).power : (ptEl.trText || ptEl.trText1 || { power: "250kVA" }).power || "250kVA";
      document.getElementById("fs-pt-info").innerHTML = `Detectat: <b>${ptEl.label || ptEl.type}</b> \u2014 ${nrTrafo}x${pw}`;
      if (!document.getElementById("fs-pt-name").value) document.getElementById("fs-pt-name").value = ptEl.label || "";
    }
  }
  function closeFSModal() {
    document.getElementById("fs-modal").style.display = "none";
    document.getElementById("fs-preview-section").style.display = "none";
  }
  function resetFSForm() {
    [
      "fs-erre",
      "fs-nr",
      "fs-beneficiar",
      "fs-localitate",
      "fs-obiectiv",
      "fs-putere-kw",
      "fs-putere-kva",
      "fs-pt-name",
      "fs-info-retea",
      "fs-lucrari-intarire",
      "fs-tarif",
      "fs-tarif-data",
      "fs-tarif-intarire",
      "fs-tarif-total",
      "fs-coord",
      "fs-elaborat",
      "fs-ae-statie",
      "fs-ae-linie",
      "fs-ae-post",
      "fs-ae-plecare",
      "fs-ae-stalp"
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    document.getElementById("fs-u-pt").value = "400";
    document.getElementById("fs-u-cons").value = "380";
    document.getElementById("fs-u-capat").value = "";
    document.getElementById("fs-pt-info").innerHTML = "Se va completa automat din schem\u0103...";
    document.getElementById("fs-preview-section").style.display = "none";
  }
  function previewFS() {
    generateFS(true);
  }
  function copyPreviewField(id) {
    const el = document.getElementById(id);
    if (el && el.value) {
      navigator.clipboard.writeText(el.value).then(() => toast("Text copiat!", "ok")).catch(() => {
        el.select();
        document.execCommand("copy");
        toast("Text copiat!", "ok");
      });
    }
  }
  function copyAllPreview() {
    const r = document.getElementById("fs-preview-racordare").value || "";
    const i = document.getElementById("fs-preview-intarire").value || "";
    const n = document.getElementById("fs-preview-retea").value || "";
    const all = `6a. SOLU\u021AIA DE RACORDARE:
${r}

6b. LUCR\u0102RI \xCENT\u0102RIRE RE\u021AEA:
${i}

5. INFORMA\u021AII RE\u021AEA EXISTENT\u0102:
${n}`;
    navigator.clipboard.writeText(all).then(() => toast("Tot textul copiat!", "ok")).catch(() => {
      const tmp = document.createElement("textarea");
      tmp.value = all;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      toast("Tot textul copiat!", "ok");
    });
  }
  async function generateFS(previewOnly) {
    if (!previewOnly && !window.docx) {
      toast("Libr\u0103ria DOCX nu e \xEEnc\u0103rcat\u0103!", "");
      return;
    }
    if (!previewOnly) toast("Generez Fi\u0219a de Solu\u021Bie...", "ac");
    const erre = document.getElementById("fs-erre").value || "ERRE";
    const nrDoc = document.getElementById("fs-nr").value || "";
    const beneficiar = document.getElementById("fs-beneficiar").value || "";
    const localitate = document.getElementById("fs-localitate").value || "";
    const obiectiv = document.getElementById("fs-obiectiv").value || "";
    const putereKW = document.getElementById("fs-putere-kw").value || "";
    const putereKVA = document.getElementById("fs-putere-kva").value || "";
    const ptName = document.getElementById("fs-pt-name").value || "";
    const uPT = document.getElementById("fs-u-pt").value || "400";
    const uCons = document.getElementById("fs-u-cons").value || "380";
    const uCapat = document.getElementById("fs-u-capat").value || "";
    const infoRetea = document.getElementById("fs-info-retea").value || "";
    const lucrariIntarire = document.getElementById("fs-lucrari-intarire").value || "NU ESTE CAZUL";
    const tarif = document.getElementById("fs-tarif").value || "";
    const tarifData = document.getElementById("fs-tarif-data").value || "";
    const tarifIntarire = document.getElementById("fs-tarif-intarire").value || "";
    const tarifTotal = document.getElementById("fs-tarif-total").value || "";
    const coord = document.getElementById("fs-coord").value || "";
    const elaborat = document.getElementById("fs-elaborat").value || "";
    const aeStatie = document.getElementById("fs-ae-statie").value || "";
    const aeLinie = document.getElementById("fs-ae-linie").value || "";
    const aePost = document.getElementById("fs-ae-post").value || "";
    const aePlecare = document.getElementById("fs-ae-plecare").value || "";
    const aeStalp = document.getElementById("fs-ae-stalp").value || "";
    const ptEl = S.EL.find((e) => e.type === "trafo" || e.type === "ptab_1t" || e.type === "ptab_2t");
    const nrTrafo = ptEl && ptEl.type === "ptab_2t" ? 2 : 1;
    const ptPower = ptEl ? getPTpower(ptEl) : "250kVA";
    const putereTrafo = parseInt(ptPower.replace(/[^0-9]/g, "")) || 250;
    const proiectRacordare = { elemente: [], cabluri: [] };
    const proiectIntarire = { elemente: [], cabluri: [] };
    S.EL.forEach((el) => {
      if (el.stare === "proiectat_racordare") proiectRacordare.elemente.push(el);
      if (el.stare === "intarire_inlocuire" || el.stare === "intarire_nou" || el.stare === "proiectat_intarire") proiectIntarire.elemente.push(el);
    });
    S.CN.forEach((cn) => {
      if (cn.stare === "proiectat_racordare") proiectRacordare.cabluri.push(cn);
      if (cn.stare === "intarire_inlocuire" || cn.stare === "intarire_nou" || cn.stare === "proiectat_intarire") proiectIntarire.cabluri.push(cn);
    });
    function getCableOfficialName(tipConductor, sectiune, tipRetea2) {
      const sec = parseFloat(sectiune) || 16;
      const isMono = tipRetea2 === "Monofazat";
      if (tipConductor === "Torsadat Al" || tipConductor === "Clasic Al") {
        if (isMono) return `NFA2X ${sec}+25 mmp`;
        if (sec <= 16) return "NFA2X 3x16+25 mmp";
        if (sec <= 35) return "NFA2X 3x35+16 mmp";
        if (sec <= 50) return "NFA2X 3x50+25 mmp";
        if (sec <= 70) return "NFA2X 3x70+35 mmp";
        if (sec <= 95) return "NFA2X 50 OL-AL 3x95 mmp";
        return `NFA2X 3x${sec} mmp`;
      }
      if (tipConductor === "Cablu Al") {
        if (isMono) return "NA2XBY 2x25 mmp";
        if (sec <= 25) return "NA2XBY 3x25+16 mmp";
        if (sec <= 35) return "NA2XBY 3x35+16 mmp";
        if (sec <= 50) return "NA2XBY 3x50+16 mmp";
        if (sec <= 70) return "NA2XBY 3x70+35 mmp";
        if (sec <= 150) return "NA2XBY 3x150+70 mmp";
        if (sec <= 185) return "NA2XBY 3x185+95 mmp";
        if (sec <= 240) return "NA2XBY 3x240+120 mmp";
        return `NA2XBY 3x${sec} mmp`;
      }
      if (tipConductor === "Cablu Cu") {
        if (isMono) return `NYY 2x${sec} mmp`;
        if (sec <= 25) return "NYY 3x25+16 mmp";
        if (sec <= 35) return "NYY 3x35+16 mmp";
        if (sec <= 50) return "NYY 3x50+25 mmp";
        if (sec <= 70) return "NYY 3x70+35 mmp";
        if (sec <= 150) return "NYY 3x150+70 mmp";
        if (sec <= 185) return "NYY 3x185+95 mmp";
        if (sec <= 240) return "NYY 3x240+120 mmp";
        return `NYY 3x${sec} mmp`;
      }
      return `${tipConductor} ${sec} mmp`;
    }
    function getConductorOrCablu(officialName) {
      if (officialName.startsWith("NA2XBY") || officialName.startsWith("NYY")) return "cablu";
      return "conductor";
    }
    function getBMPTLocation(cableOrLen, fromFirida) {
      if (fromFirida) return "pe soclu de beton la limita de proprietate";
      const len = typeof cableOrLen === "number" ? cableOrLen : parseFloat(cableOrLen && cableOrLen.length) || 0;
      if (len > 0 && len < 8.05) return "pe stalpul de racord";
      return "pe soclu de beton la limita de proprietate";
    }
    function describeCableGroup(cables) {
      const grouped = {};
      cables.forEach((cn) => {
        const name = getCableOfficialName(cn.tipConductor || "Cablu Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
        if (!grouped[name]) grouped[name] = 0;
        grouped[name] += parseFloat(cn.length) || 0;
      });
      return Object.entries(grouped).map(([name, len]) => {
        const tipCC = getConductorOrCablu(name);
        return `${tipCC} tip ${name} in lungime de ${len.toFixed(0)} m`;
      });
    }
    function getSourcePrefix(srcEl, ptLabel) {
      if (!srcEl) return "Din ";
      if (srcEl.type === "ptab_1t" || srcEl.type === "ptab_2t") return `Din TDJT a ${ptLabel || srcEl.label || "PTAb"}`;
      if (srcEl.type.startsWith("cd")) return `Din CD a ${ptLabel || srcEl.label || "PT"}`;
      if (srcEl.type === "trafo") return `Din CD a ${ptLabel || srcEl.label || "PT"}`;
      return `Din ${srcEl.label || ""}`;
    }
    function describeCables(cabluri) {
      if (cabluri.length === 0) return "";
      const grouped = {};
      cabluri.forEach((cn) => {
        const officialName = getCableOfficialName(cn.tipConductor || "Cablu Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
        if (!grouped[officialName]) grouped[officialName] = { name: officialName, totalLen: 0 };
        grouped[officialName].totalLen += parseFloat(cn.length) || 0;
      });
      return Object.values(grouped).map((g) => `cablu tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m`).join(", ");
    }
    function describeElements(elemente) {
      const types = {};
      elemente.forEach((el) => {
        const tName = {
          meter: "BMPT",
          stalp_se4: "st\xE2lp SE4",
          stalp_se10: "st\xE2lp SE10",
          stalp_sc10002: "st\xE2lp SC10002",
          stalp_sc10005: "st\xE2lp SC10005",
          stalp_rotund: "st\xE2lp rotund",
          firida_e2_4: "firid\u0103 E2-4",
          firida_e3_4: "firid\u0103 E3-4",
          cd4: "CD 4P",
          cd5: "CD 5P",
          cd8: "CD 8P"
        }[el.type] || el.type;
        if (!types[tName]) types[tName] = [];
        types[tName].push(el);
      });
      return Object.entries(types).map(([name, els]) => {
        if (name === "BMPT" && els.length === 1) {
          const bmpt = els[0];
          const bmptCable = proiectRacordare.cabluri.find((cn) => cn.fromElId === bmpt.id || cn.toElId === bmpt.id);
          const bmptLen = bmptCable ? parseFloat(bmptCable.length) || 0 : 0;
          const bmptSrcId = bmptCable ? bmptCable.fromElId === bmpt.id ? bmptCable.toElId : bmptCable.fromElId : null;
          const bmptSrcEl = bmptSrcId ? S.EL.find((e) => e.id === bmptSrcId) : null;
          const bmptFromFirida = bmptSrcEl && bmptSrcEl.type && bmptSrcEl.type.startsWith("firida_");
          return `BMPT ${bmpt.bmptText || ""} montat ${getBMPTLocation(bmptLen, bmptFromFirida)}`.trim();
        }
        return els.length > 1 ? `${els.length}x ${name}` : name;
      }).join(", ");
    }
    function buildSolutionText(cabluri, elemente) {
      if (cabluri.length === 0 && elemente.length === 0) return "Alimentarea cu energie electrica a obiectivului.";
      const proiectIds = new Set(elemente.map((e) => e.id));
      const stalpiProiectati = elemente.filter((e) => e.type.startsWith("stalp_"));
      const firideleProiectate = elemente.filter((e) => e.type.startsWith("firida_"));
      const bmptEl = elemente.find((e) => e.type === "meter");
      const nrStalpiNoi = stalpiProiectati.length;
      const nrFirideNoi = firideleProiectate.length;
      const hasCircuit = nrStalpiNoi > 0 || nrFirideNoi > 0;
      const circuitIsSubteran = nrFirideNoi > 0 && nrStalpiNoi === 0;
      function getFiridaTypeName(el) {
        return { firida_e2_4: "FG E2-4", firida_e3_4: "FG E3-4", firida_e3_0: "FG E3-0" }[el.type] || el.label || "FG";
      }
      function describeCableGroup2(cables) {
        const grouped = {};
        cables.forEach((cn) => {
          const name = getCableOfficialName(cn.tipConductor || "Cablu Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
          if (!grouped[name]) grouped[name] = 0;
          grouped[name] += parseFloat(cn.length) || 0;
        });
        return Object.entries(grouped).map(([name, len]) => {
          const tipCC = getConductorOrCablu(name);
          return `${tipCC} tip ${name} in lungime de ${len.toFixed(0)} m`;
        });
      }
      const cabluriBransament = [], cabluriCircuit = [];
      cabluri.forEach((cn) => {
        const fromEl = S.EL.find((e) => e.id === cn.fromElId);
        const toEl = S.EL.find((e) => e.id === cn.toElId);
        if (fromEl && fromEl.type === "meter" || toEl && toEl.type === "meter") {
          cabluriBransament.push(cn);
        } else {
          cabluriCircuit.push(cn);
        }
      });
      const hasBransament = cabluriBransament.length > 0 && bmptEl;
      let bmptText = "";
      if (bmptEl) {
        const bmptCableLen = cabluriBransament.length > 0 ? parseFloat(cabluriBransament[0].length) || 0 : 0;
        const bCable0 = cabluriBransament[0];
        const srcElId0 = bCable0 ? bCable0.fromElId === bmptEl.id ? bCable0.toElId : bCable0.fromElId : null;
        const srcEl0 = srcElId0 ? S.EL.find((e) => e.id === srcElId0) : null;
        const fromFirida0 = srcEl0 && srcEl0.type && srcEl0.type.startsWith("firida_");
        bmptText = `un ${bmptEl.bmptText || bmptEl.label || "BMPT"} montat ${getBMPTLocation(bmptCableLen, fromFirida0)}`;
      }
      let lastElBeforeBMPT = null;
      if (bmptEl && cabluriBransament.length > 0) {
        const bCable = cabluriBransament[0];
        const otherElId = bCable.fromElId === bmptEl.id ? bCable.toElId : bCable.fromElId;
        lastElBeforeBMPT = S.EL.find((e) => e.id === otherElId);
      }
      const sourceEls = [];
      const sourceElIds = /* @__PURE__ */ new Set();
      cabluri.forEach((cn) => {
        [cn.fromElId, cn.toElId].forEach((elId) => {
          if (elId && !proiectIds.has(elId) && !sourceElIds.has(elId)) {
            const el = S.EL.find((e) => e.id === elId);
            if (el && (!el.stare || el.stare === "existent")) {
              const isSource = el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type.startsWith("firida_");
              if (isSource) {
                let ptLabel = el.label || "";
                const ptCable = S.CN.filter((c) => (!c.stare || c.stare === "existent") && (c.fromElId === elId || c.toElId === elId));
                ptCable.forEach((pc) => {
                  const otherEnd = pc.fromElId === elId ? pc.toElId : pc.fromElId;
                  const ptE = S.EL.find((e) => e.id === otherEnd && (e.type === "trafo" || e.type.startsWith("ptab_")));
                  if (ptE) ptLabel = ptE.label || ptLabel;
                });
                let circ = "";
                const relCable = cabluri.find((c) => c.fromElId === elId || c.toElId === elId);
                if (relCable) {
                  if (relCable.circuitGroup) circ = relCable.circuitGroup;
                  else if (relCable.fromCircuit) circ = "C" + relCable.fromCircuit;
                }
                const sourceCables = cabluriCircuit.filter((cn2) => cn2.fromElId === elId || cn2.toElId === elId);
                sourceEls.push({ el, ptLabel, circuit: circ, cables: sourceCables });
                sourceElIds.add(elId);
              } else {
                let circ = "";
                const existCables = S.CN.filter((c) => (!c.stare || c.stare === "existent") && (c.fromElId === elId || c.toElId === elId));
                for (const c of existCables) {
                  if (c.circuitGroup) {
                    circ = c.circuitGroup;
                    break;
                  }
                  if (c.fromCircuit) {
                    circ = "C" + c.fromCircuit;
                    break;
                  }
                }
                sourceEls.push({ el, ptLabel: el.label || "", circuit: circ, cables: [], isStalp: true });
                sourceElIds.add(elId);
              }
            }
          }
        });
      });
      const mansoaneProiectate = elemente.filter((e) => e.type === "manson");
      const hasMansonare = mansoaneProiectate.length >= 2 && firideleProiectate.length > 0;
      if (hasMansonare) {
        const firidaGroups = [];
        firideleProiectate.forEach((fgNoua) => {
          const fgNouaName = getFiridaTypeName(fgNoua);
          const myMansoane = mansoaneProiectate.filter(
            (manson) => cabluri.some((cn) => cn.fromElId === manson.id && cn.toElId === fgNoua.id || cn.toElId === manson.id && cn.fromElId === fgNoua.id)
          );
          const firideExistente = [];
          myMansoane.forEach((manson) => {
            cabluri.forEach((cn) => {
              const otherId = cn.fromElId === manson.id ? cn.toElId : cn.toElId === manson.id ? cn.fromElId : null;
              if (otherId && !proiectIds.has(otherId)) {
                const otherEl = S.EL.find((e) => e.id === otherId);
                if (otherEl && otherEl.type.startsWith("firida_") && (!otherEl.stare || otherEl.stare === "existent")) {
                  if (!firideExistente.find((f2) => f2.id === otherEl.id)) firideExistente.push(otherEl);
                }
              }
            });
          });
          const myMansonIds = new Set(myMansoane.map((m) => m.id));
          const cabluriRacord = cabluriCircuit.filter((cn) => myMansonIds.has(cn.fromElId) || myMansonIds.has(cn.toElId));
          const myBransamente = [];
          elemente.filter((e) => e.type === "meter").forEach((bmpt) => {
            const bCable = cabluriBransament.find(
              (cn) => cn.fromElId === fgNoua.id && cn.toElId === bmpt.id || cn.toElId === fgNoua.id && cn.fromElId === bmpt.id
            );
            if (bCable) myBransamente.push({ bmpt, cable: bCable });
          });
          if (myBransamente.length === 0) {
            cabluriBransament.forEach((cn) => {
              const fromEl = S.EL.find((e) => e.id === cn.fromElId);
              const toEl = S.EL.find((e) => e.id === cn.toElId);
              if (fromEl && fromEl.id === fgNoua.id && toEl && toEl.type === "meter") myBransamente.push({ bmpt: toEl, cable: cn });
              else if (toEl && toEl.id === fgNoua.id && fromEl && fromEl.type === "meter") myBransamente.push({ bmpt: fromEl, cable: cn });
            });
          }
          firidaGroups.push({ fgNoua, fgNouaName, firideExistente, cabluriRacord, myBransamente });
        });
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ";
        firidaGroups.forEach((fg, fgIdx) => {
          const fg1Label = fg.firideExistente[0] ? fg.firideExistente[0].label || "FG" : "FG";
          const fg2Label = fg.firideExistente[1] ? fg.firideExistente[1].label || "FG" : "";
          const entreText = fg2Label ? `dintre ${fg1Label} si ${fg2Label}` : `din ${fg1Label}`;
          if (fg.cabluriRacord.length > 0) {
            const grouped = {};
            fg.cabluriRacord.forEach((cn) => {
              const name = getCableOfficialName(cn.tipConductor || "Cablu Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
              if (!grouped[name]) grouped[name] = { name, lengths: [], tipCC: getConductorOrCablu(name) };
              grouped[name].lengths.push(parseFloat(cn.length) || 0);
            });
            const cableDescs = Object.values(grouped).map((g) => {
              const nrBuc = g.lengths.length;
              const lenText = nrBuc > 1 ? `${nrBuc}x${(g.lengths.reduce((a, b) => a + b, 0) / nrBuc).toFixed(0)}m` : `${g.lengths[0].toFixed(0)} m`;
              return `${g.tipCC} tip ${g.name} in lungime de ${lenText}`;
            });
            text += `Se va mansona cablul existent ${entreText} cu ${cableDescs.join(", ")} pana la o ${fg.fgNouaName} proiectata si montata la limita de proprietate pe soclu de beton`;
          } else {
            text += `Se va monta o ${fg.fgNouaName} proiectata ${entreText}`;
          }
          if (fg.myBransamente.length === 1) {
            const bran = fg.myBransamente[0];
            const bmptLabel = bran.bmpt.bmptText || bran.bmpt.label || "BMPT";
            const branLen = parseFloat(bran.cable.length) || 0;
            const branDescs = describeCableGroup2([bran.cable]);
            text += `. Din ${fg.fgNouaName} proiectata, se va realiza un bransament cu ${branDescs.join(", ")}, pana la un ${bmptLabel} montat ${getBMPTLocation(branLen, true)}`;
          } else if (fg.myBransamente.length > 1) {
            const nrText = ["doua", "trei", "patru", "cinci", "sase"][fg.myBransamente.length - 2] || fg.myBransamente.length;
            text += `. Din ${fg.fgNouaName} proiectata, se vor realiza ${nrText} bransamente astfel:`;
            fg.myBransamente.forEach((bran) => {
              const bmptLabel = bran.bmpt.bmptText || bran.bmpt.label || "BMPT";
              const cableName = getCableOfficialName(bran.cable.tipConductor || "Cablu Al", bran.cable.sectiune || 16, bran.cable.tipRetea || "Trifazat");
              const tipCC = getConductorOrCablu(cableName);
              const len = parseFloat(bran.cable.length) || 0;
              text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}`;
            });
          }
          text += ".";
          if (fgIdx < firidaGroups.length - 1) text += " ";
        });
        return text;
      }
      const cdSources = sourceEls.filter((s2) => !s2.isStalp);
      if (cdSources.length >= 2 && hasCircuit) {
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel:\n\n";
        cdSources.forEach((src, idx) => {
          const srcId = src.el.id;
          const pathCables = [];
          const visited = /* @__PURE__ */ new Set([srcId]);
          const queue = [srcId];
          while (queue.length > 0) {
            const curId = queue.shift();
            cabluriCircuit.forEach((cn) => {
              const otherId = cn.fromElId === curId ? cn.toElId : cn.toElId === curId ? cn.fromElId : null;
              if (otherId && !visited.has(otherId) && proiectIds.has(otherId)) {
                const otherEl = S.EL.find((e) => e.id === otherId);
                if (otherEl && otherEl.type.startsWith("firida_")) {
                  pathCables.push(cn);
                  visited.add(otherId);
                } else if (otherEl && otherEl.type.startsWith("stalp_")) {
                  pathCables.push(cn);
                  visited.add(otherId);
                  queue.push(otherId);
                } else {
                  pathCables.push(cn);
                  visited.add(otherId);
                  queue.push(otherId);
                }
              }
            });
          }
          cabluriCircuit.forEach((cn) => {
            if ((cn.fromElId === srcId || cn.toElId === srcId) && !pathCables.includes(cn)) pathCables.push(cn);
          });
          const label = idx === 0 ? "Alimentare de baza" : "Alimentare de rezerva";
          const ptLbl = src.ptLabel || src.el.label || "";
          const cableDescs = describeCableGroup2(pathCables);
          const srcIsFirida = src.el.type.startsWith("firida_");
          const existCablesOnSrc = S.CN.filter((cn) => (!cn.stare || cn.stare === "existent") && (cn.fromElId === src.el.id || cn.toElId === src.el.id));
          let tipReteaSrc = "", conductorSrc = "";
          if (existCablesOnSrc.length > 0) {
            const ec = existCablesOnSrc[0];
            conductorSrc = getCableOfficialName(ec.tipConductor || "Cablu Al", ec.sectiune || 16, ec.tipRetea || "Trifazat");
            tipReteaSrc = ec.tipConductor === "Cablu Al" || ec.tipConductor === "Cablu Cu" ? "LES" : "LEA";
          }
          if (srcIsFirida) {
            text += `${label}: prin extinderea retelei existente de tip ${tipReteaSrc || "LES"}`;
            if (conductorSrc) text += ` (${conductorSrc})`;
            if (src.circuit) text += `, circuit ${src.circuit}`;
            text += ` din ${src.el.label || "FG"} se va poza ${cableDescs.join(", ")}`;
          } else {
            if (firideleProiectate.length > 0) {
              text += `${label}: prin extinderea retelei existente de tip ${tipReteaSrc || "LES"}`;
              if (conductorSrc) text += ` (${conductorSrc})`;
              if (src.circuit) text += `, circuit ${src.circuit}`;
              text += ` din ${src.el.label || getSourcePrefix(src.el, ptLbl).replace("Din ", "")} se va poza ${cableDescs.join(", ")}`;
            } else {
              text += `${label}: ${getSourcePrefix(src.el, ptLbl)}, se va echipa circuit ${src.circuit || ""} cu ${cableDescs.join(", ")}`;
            }
          }
          const targetFirida = firideleProiectate.length > 0 ? firideleProiectate[0] : null;
          if (targetFirida) text += ` pana la o ${getFiridaTypeName(targetFirida)} proiectata si montata pe soclu de beton`;
          text += ".\n";
        });
        if (hasBransament && firideleProiectate.length > 0) {
          const firidaBrans = [];
          firideleProiectate.forEach((fg) => {
            const fgId = fg.id;
            const fgLabel = fg.label || getFiridaTypeName(fg);
            const brans = [];
            cabluriBransament.forEach((cn) => {
              const otherId = cn.fromElId === fgId ? cn.toElId : cn.toElId === fgId ? cn.fromElId : null;
              if (!otherId) return;
              const otherEl = S.EL.find((e) => e.id === otherId);
              if (otherEl && otherEl.type === "meter") brans.push({ bmpt: otherEl, cable: cn });
            });
            if (brans.length > 0) firidaBrans.push({ fgLabel, brans });
          });
          if (firidaBrans.length > 0) {
            text += "Bransamente:";
            firidaBrans.forEach((fb) => {
              if (fb.brans.length === 1) {
                const b = fb.brans[0];
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                const bDescs = describeCableGroup2([b.cable]);
                text += `
Din ${fb.fgLabel} se va realiza 1 bransament cu ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
              } else {
                text += `
Din ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
                fb.brans.forEach((b) => {
                  const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                  const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                  const tipCC = getConductorOrCablu(cableName);
                  const len = parseFloat(b.cable.length) || 0;
                  text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
                });
              }
            });
          }
        } else if (hasBransament) {
          const branDescs = describeCableGroup2(cabluriBransament);
          text += `Bransament: ${branDescs.join(", ")}`;
          if (bmptText) text += `, pana la ${bmptText}`;
          text += ".";
        }
        return text;
      }
      const cdSource = sourceEls.find((s2) => !s2.isStalp);
      const stalpSource = sourceEls.find((s2) => s2.isStalp);
      const srcIsStalp = !!stalpSource && !cdSource;
      if (srcIsStalp && nrStalpiNoi > 0) {
        const idx = sourceEls.indexOf(stalpSource);
        if (idx > 0) {
          sourceEls.splice(idx, 1);
          sourceEls.unshift(stalpSource);
        }
      }
      if (srcIsStalp && nrStalpiNoi > 0 && hasBransament) {
        const src = sourceEls[0];
        const srcLabel = src.el.label || "SE";
        let existCircuit = src.circuit || "";
        if (!existCircuit) {
          S.CN.filter((cn) => (!cn.stare || cn.stare === "existent") && (cn.fromElId === src.el.id || cn.toElId === src.el.id)).forEach((cn) => {
            if (cn.circuitGroup) existCircuit = cn.circuitGroup;
            else if (cn.label && cn.label.match(/^C\d/)) existCircuit = cn.label.split("-")[0];
          });
        }
        const extensionLen = cabluriCircuit.reduce((s2, cn) => s2 + (parseFloat(cn.length) || 0), 0);
        const circDescs = describeCableGroup2(cabluriCircuit);
        const stalpGroups = {};
        stalpiProiectati.forEach((st) => {
          const prefix = (st.label || "").replace(/\/\d+$/, "") || { stalp_sc10002: "SC10002", stalp_sc10005: "SC10005", stalp_se4: "SE4", stalp_se10: "SE10", stalp_rotund: "SR", stalp_rotund_special: "SRS", stalp_cs: "SCS" }[st.type] || st.type;
          if (!stalpGroups[prefix]) stalpGroups[prefix] = 0;
          stalpGroups[prefix]++;
        });
        const stalpTypeText = Object.entries(stalpGroups).map(([name, cnt]) => `${cnt}x${name}`).join(" si ");
        const lastStalp = lastElBeforeBMPT && lastElBeforeBMPT.type.startsWith("stalp_") ? lastElBeforeBMPT : stalpiProiectati[stalpiProiectati.length - 1];
        const lastStalpLabel = lastStalp ? lastStalp.label || "ultimul stalp" : "ultimul stalp";
        let text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea circuitului ${existCircuit} existent de la stalpul ${srcLabel} pe o lungime de ${extensionLen.toFixed(0)} m cu ${circDescs.join(", ")} pe stalpi noi proiectati de tip ${stalpTypeText}.`;
        const stalpBransamente = [];
        stalpiProiectati.forEach((st) => {
          const stId = st.id;
          const stLabel = st.label || "stalp";
          const brans = [];
          cabluriBransament.forEach((cn) => {
            const otherId = cn.fromElId === stId ? cn.toElId : cn.toElId === stId ? cn.fromElId : null;
            if (!otherId) return;
            const otherEl = S.EL.find((e) => e.id === otherId);
            if (otherEl && otherEl.type === "meter") brans.push({ bmpt: otherEl, cable: cn });
          });
          if (brans.length > 0) stalpBransamente.push({ stLabel, brans });
        });
        const srcBrans = [];
        cabluriBransament.forEach((cn) => {
          const otherId = cn.fromElId === src.el.id ? cn.toElId : cn.toElId === src.el.id ? cn.fromElId : null;
          if (!otherId) return;
          const otherEl = S.EL.find((e) => e.id === otherId);
          if (otherEl && otherEl.type === "meter") srcBrans.push({ bmpt: otherEl, cable: cn });
        });
        if (srcBrans.length > 0) stalpBransamente.unshift({ stLabel: srcLabel, brans: srcBrans });
        if (stalpBransamente.length > 0) {
          text += "\nBransamente:";
          stalpBransamente.forEach((sb2) => {
            if (sb2.brans.length === 1) {
              const b = sb2.brans[0];
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
              const bLen = parseFloat(b.cable.length) || 0;
              const bDescs = describeCableGroup2([b.cable]);
              text += `
Din stalpul ${sb2.stLabel} se va realiza 1 bransament cu ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen)}.`;
            } else {
              text += `
Din stalpul ${sb2.stLabel} se vor realiza ${sb2.brans.length} bransamente astfel:`;
              sb2.brans.forEach((b) => {
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                const tipCC = getConductorOrCablu(cableName);
                const len = parseFloat(b.cable.length) || 0;
                text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len)}.`;
              });
            }
          });
        }
        return text;
      }
      if (srcIsStalp && nrFirideNoi > 0 && nrStalpiNoi === 0) {
        let traceFromNode = function(nodeId, nodeLabel) {
          cabluriCircuit.forEach((cn) => {
            const otherId = cn.fromElId === nodeId ? cn.toElId : cn.toElId === nodeId ? cn.fromElId : null;
            if (!otherId || visitedNodes.has(otherId)) return;
            const otherEl = S.EL.find((e) => e.id === otherId);
            if (!otherEl) return;
            if (otherEl.type.startsWith("firida_") && proiectIds.has(otherId)) {
              visitedNodes.add(otherId);
              firidaChain.push({ firida: otherEl, cables: [cn], fromLabel: nodeLabel });
              traceFromNode(otherId, otherEl.label || getFiridaTypeName(otherEl));
            }
          });
        };
        const src = sourceEls[0];
        const srcLabel = src.el.label || "SE";
        const existCablesOnSrc = S.CN.filter((cn) => (!cn.stare || cn.stare === "existent") && (cn.fromElId === src.el.id || cn.toElId === src.el.id));
        let tipReteaExistenta = "LEA", conductorExistent = "";
        if (existCablesOnSrc.length > 0) {
          const ec = existCablesOnSrc[0];
          conductorExistent = getCableOfficialName(ec.tipConductor || "Torsadat Al", ec.sectiune || 16, ec.tipRetea || "Trifazat");
          if (ec.tipConductor === "Cablu Al" || ec.tipConductor === "Cablu Cu") tipReteaExistenta = "LES";
        }
        let existCircuit = src.circuit || "";
        if (!existCircuit) {
          existCablesOnSrc.forEach((cn) => {
            if (cn.circuitGroup) existCircuit = cn.circuitGroup;
            else if (cn.label && cn.label.match(/^C\d/)) existCircuit = cn.label.split("-")[0];
          });
        }
        let text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea retelei existente de tip ${tipReteaExistenta}`;
        if (conductorExistent) text += ` (${conductorExistent})`;
        if (existCircuit) text += `, circuit ${existCircuit}`;
        text += ` astfel:`;
        const firidaChain = [];
        const visitedNodes = /* @__PURE__ */ new Set([src.el.id]);
        traceFromNode(src.el.id, srcLabel);
        if (firidaChain.length === 0) firideleProiectate.forEach((fg) => firidaChain.push({ firida: fg, cables: cabluriCircuit, fromLabel: srcLabel }));
        firidaChain.forEach((seg, idx) => {
          const fgName = getFiridaTypeName(seg.firida);
          const fgLabel = seg.firida.label || fgName;
          const segDescs = describeCableGroup2(seg.cables.length > 0 ? seg.cables : cabluriCircuit);
          const fromLabel = seg.fromLabel || srcLabel;
          if (idx === 0) text += ` din ${fromLabel} se va poza ${segDescs.join(", ")} pana la o ${fgLabel} proiectata si montata pe soclu de beton`;
          else text += `. Din ${fromLabel} se va poza ${segDescs.join(", ")} pana la o ${fgLabel} proiectata si montata pe soclu de beton`;
        });
        text += ".";
        const firidaBransamente = [];
        firidaChain.forEach((seg) => {
          const fgId = seg.firida.id;
          const fgLabel = seg.firida.label || getFiridaTypeName(seg.firida);
          const brans = [];
          cabluriBransament.forEach((cn) => {
            const fromEl = S.EL.find((e) => e.id === cn.fromElId);
            const toEl = S.EL.find((e) => e.id === cn.toElId);
            if (cn.fromElId === fgId && toEl && toEl.type === "meter" || cn.toElId === fgId && fromEl && fromEl.type === "meter") {
              const bmpt = cn.fromElId === fgId ? toEl : fromEl;
              brans.push({ bmpt, cable: cn });
            }
          });
          if (brans.length > 0) firidaBransamente.push({ fgLabel, brans });
        });
        if (firidaBransamente.length === 0 && cabluriBransament.length > 0) {
          const fgLabel = firidaChain.length > 0 ? firidaChain[0].firida.label || getFiridaTypeName(firidaChain[0].firida) : "FG";
          const brans = [];
          cabluriBransament.forEach((cn) => {
            const fromEl = S.EL.find((e) => e.id === cn.fromElId);
            const toEl = S.EL.find((e) => e.id === cn.toElId);
            const bmpt = fromEl && fromEl.type === "meter" ? fromEl : toEl && toEl.type === "meter" ? toEl : null;
            if (bmpt) brans.push({ bmpt, cable: cn });
          });
          if (brans.length > 0) firidaBransamente.push({ fgLabel, brans });
        }
        if (firidaBransamente.length > 0) {
          text += "\nBransamente:";
          firidaBransamente.forEach((fb) => {
            if (fb.brans.length === 1) {
              const b = fb.brans[0];
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
              const bLen = parseFloat(b.cable.length) || 0;
              const bDescs = describeCableGroup2([b.cable]);
              text += `
Din ${fb.fgLabel} se va realiza 1 bransament astfel:
- ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, true)}.`;
            } else {
              text += `
Din ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
              fb.brans.forEach((b) => {
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                const tipCC = getConductorOrCablu(cableName);
                const len = parseFloat(b.cable.length) || 0;
                text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}.`;
              });
            }
          });
        }
        return text;
      }
      if (hasCircuit && hasBransament) {
        const src = sourceEls[0] || {};
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ";
        if (src.el && !src.isStalp) text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
        else if (src.el) text += `din ${src.el.label || ""}`;
        const allCircCables = cabluriCircuit;
        const circDescs = describeCableGroup2(allCircCables);
        if (circuitIsSubteran) {
          let walkTree = function(nodeId) {
            const nbs = (chainAdj[nodeId] || []).filter((n) => !chainVisitedCables.has(n.cable.id));
            nbs.sort((a, b) => {
              const aEl = getChainEl(a.to);
              const bEl = getChainEl(b.to);
              return (aEl && aEl.type.startsWith("firida_") ? 1 : 0) - (bEl && bEl.type.startsWith("firida_") ? 1 : 0);
            });
            nbs.forEach((nb) => {
              chainVisitedCables.add(nb.cable.id);
              chainRoute.push(nb.to);
              chainCables.push(nb.cable);
              allChainNodes.add(nb.to);
              walkTree(nb.to);
            });
          };
          const srcElId = src.el ? src.el.id : null;
          const existCablesOnSrc = srcElId ? S.CN.filter((cn) => (!cn.stare || cn.stare === "existent") && (cn.fromElId === srcElId || cn.toElId === srcElId)) : [];
          let tipReteaExist = "LES", conductorExist = "";
          if (existCablesOnSrc.length > 0) {
            const ec = existCablesOnSrc[0];
            conductorExist = getCableOfficialName(ec.tipConductor || "Cablu Al", ec.sectiune || 16, ec.tipRetea || "Trifazat");
            tipReteaExist = ec.tipConductor === "Cablu Al" || ec.tipConductor === "Cablu Cu" ? "LES" : "LEA";
          }
          if (src.isStalp) {
            text = `Alimentarea cu energie electrica a obiectivului se va realiza prin extinderea retelei existente de tip ${tipReteaExist}`;
            if (conductorExist) text += ` (${conductorExist})`;
            if (src.circuit) text += `, circuit ${src.circuit}`;
            text += ` astfel:`;
          } else {
            text = `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: `;
            text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
            if (src.circuit) text += `, circuit ${src.circuit}`;
            text += `,`;
          }
          const srcNodeId = srcElId;
          const chainAdj = {};
          cabluriCircuit.forEach((cn) => {
            const a = String(cn.fromElId), b = String(cn.toElId);
            if (!chainAdj[a]) chainAdj[a] = [];
            if (!chainAdj[b]) chainAdj[b] = [];
            chainAdj[a].push({ to: b, cable: cn });
            chainAdj[b].push({ to: a, cable: cn });
          });
          const chainStart = String(srcNodeId);
          const getChainLabel = (id) => {
            const el = S.EL.find((e) => e.id === Number(id));
            return el ? el.label || el.type : "";
          };
          const getChainEl = (id) => S.EL.find((e) => e.id === Number(id));
          const allChainNodes = /* @__PURE__ */ new Set();
          const chainVisitedCables = /* @__PURE__ */ new Set();
          const chainRoute = [chainStart];
          const chainCables = [];
          allChainNodes.add(chainStart);
          walkTree(chainStart);
          const chainGroups = [];
          chainCables.forEach((cn, i) => {
            const name = getCableOfficialName(cn.tipConductor || "Torsadat Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
            const fromEl = getChainEl(chainRoute[i]);
            const toEl = getChainEl(chainRoute[i + 1]);
            const fromIsFirida = fromEl && fromEl.type.startsWith("firida_");
            const toIsFirida = toEl && toEl.type.startsWith("firida_");
            const last = chainGroups[chainGroups.length - 1];
            if (last && last.name === name && !fromIsFirida && !toIsFirida) {
              last.totalLen += parseFloat(cn.length) || 0;
              last.endIdx = i + 1;
            } else chainGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
          });
          chainGroups.forEach((g, gi) => {
            const fromLbl = getChainLabel(chainRoute[g.startIdx]);
            const toLbl = getChainLabel(chainRoute[g.endIdx]);
            const toEl = getChainEl(chainRoute[g.endIdx]);
            const isFirida = toEl && toEl.type.startsWith("firida_");
            const grpLabels = [];
            for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
              const lbl = getChainLabel(chainRoute[ri]);
              if (lbl) grpLabels.push(lbl);
            }
            const grpRouteText = grpLabels.join(" - ");
            if (gi === 0) text += ` din ${fromLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${isFirida ? "o " : ""}${toLbl}${isFirida ? " proiectata si montata pe soclu de beton" : ""}`;
            else {
              const hasMultipleStops = grpLabels.length > 2;
              text += `. Din ${fromLbl} pana la ${isFirida ? "o " : ""}${toLbl}${isFirida ? " proiectata si montata pe soclu de beton" : ""} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m`;
              if (hasMultipleStops && !isFirida) text += ` pe stalpi existenti intre ${grpRouteText}`;
            }
          });
          text += ".";
          const firidaBrans = [];
          [...allChainNodes].forEach((nodeId) => {
            const numId = Number(nodeId);
            const nodeEl = S.EL.find((e) => e.id === numId);
            if (!nodeEl) return;
            const nodeLabel = nodeEl.label || (nodeEl.type.startsWith("firida_") ? getFiridaTypeName(nodeEl) : nodeEl.type);
            const brans = [];
            cabluriBransament.forEach((cn) => {
              const otherId = cn.fromElId === numId ? cn.toElId : cn.toElId === numId ? cn.fromElId : null;
              if (!otherId) return;
              const otherEl = S.EL.find((e) => e.id === otherId);
              if (otherEl && otherEl.type === "meter") brans.push({ bmpt: otherEl, cable: cn });
            });
            if (brans.length > 0) firidaBrans.push({ fgLabel: nodeLabel, brans, isFirida: nodeEl.type.startsWith("firida_") });
          });
          if (firidaBrans.length > 0) {
            text += "\nBransamente:";
            firidaBrans.forEach((fb) => {
              if (fb.brans.length === 1) {
                const b = fb.brans[0];
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                const bDescs = describeCableGroup2([b.cable]);
                text += `
Din ${fb.fgLabel} se va realiza 1 bransament cu ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(0, true)}.`;
              } else {
                text += `
Din ${fb.fgLabel} se vor realiza ${fb.brans.length} bransamente astfel:`;
                fb.brans.forEach((b) => {
                  const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                  const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                  const tipCC = getConductorOrCablu(cableName);
                  const len = parseFloat(b.cable.length) || 0;
                  text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, true)}.`;
                });
              }
            });
          }
        } else {
          text += `, se va realiza un circuit proiectat ${src.circuit || ""} pe stalpi noi cu ${circDescs.join(", ")}`;
          const lastLbl = lastElBeforeBMPT ? lastElBeforeBMPT.label || "" : "";
          text += `. Din ${lastLbl || "ultimul stalp"}`;
          const branDescs = describeCableGroup2(cabluriBransament);
          text += ` se va realiza un bransament cu ${branDescs.join(", ")}`;
          if (bmptText) text += `, pana la ${bmptText}`;
          text += ".";
        }
        return text;
      }
      if (cabluriCircuit.length > 0 && hasBransament && !hasCircuit) {
        const src = sourceEls.find((s2) => !s2.isStalp) || sourceEls[0] || {};
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune astfel: ";
        if (src.el && !src.isStalp) text += `${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
        else if (src.el) text += `din ${src.el.label || ""}`;
        let lastCircuitStalp = "";
        const circuitElIds = /* @__PURE__ */ new Set();
        cabluriCircuit.forEach((cn) => {
          [cn.fromElId, cn.toElId].forEach((id) => {
            if (id) {
              const el = S.EL.find((e) => e.id === id);
              if (el && el.type.startsWith("stalp_") && (!el.stare || el.stare === "existent")) {
                circuitElIds.add(id);
                lastCircuitStalp = el.label || "";
              }
            }
          });
        });
        const branStalpLabel = lastElBeforeBMPT ? lastElBeforeBMPT.label || "" : lastCircuitStalp;
        const existCircuits = /* @__PURE__ */ new Set();
        circuitElIds.forEach((stalpId) => {
          S.CN.filter((cn) => (!cn.stare || cn.stare === "existent") && (cn.fromElId === stalpId || cn.toElId === stalpId)).forEach((cn) => {
            if (cn.circuitGroup) existCircuits.add(cn.circuitGroup);
            else if (cn.label && cn.label.match(/^C\d/)) existCircuits.add(cn.label.split("-")[0]);
          });
        });
        const comunCuText = existCircuits.size > 0 ? ` comuni cu circuit ${[...existCircuits].join(", ")}` : "";
        const circAdj = {};
        const circDeg = {};
        cabluriCircuit.forEach((cn) => {
          const a = String(cn.fromElId), b = String(cn.toElId);
          if (!circAdj[a]) circAdj[a] = [];
          if (!circAdj[b]) circAdj[b] = [];
          circAdj[a].push({ to: b, cable: cn });
          circAdj[b].push({ to: a, cable: cn });
          circDeg[a] = (circDeg[a] || 0) + 1;
          circDeg[b] = (circDeg[b] || 0) + 1;
        });
        const circEps = Object.keys(circAdj).filter((id) => circDeg[id] === 1);
        let circStart = circEps[0] || Object.keys(circAdj)[0];
        circEps.forEach((id) => {
          const el = S.EL.find((e) => e.id === Number(id));
          if (el && (el.type.startsWith("cd") || el.type === "trafo" || el.type.startsWith("ptab_"))) circStart = id;
        });
        const circRoute = [circStart];
        const circRCables = [];
        const circVis = /* @__PURE__ */ new Set();
        let circCur = circStart;
        while (true) {
          const nbs = (circAdj[circCur] || []).filter((n) => !circVis.has(n.cable.id));
          if (!nbs.length) break;
          circVis.add(nbs[0].cable.id);
          circRCables.push(nbs[0].cable);
          circCur = nbs[0].to;
          circRoute.push(circCur);
        }
        const getRouteLabel = (id) => {
          const el = S.EL.find((e) => e.id === Number(id));
          return el ? el.label || el.type : "";
        };
        const circGroups = [];
        circRCables.forEach((cn, i) => {
          const name = getCableOfficialName(cn.tipConductor || "Torsadat Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
          const last = circGroups[circGroups.length - 1];
          if (last && last.name === name) {
            last.totalLen += parseFloat(cn.length) || 0;
            last.endIdx = i + 1;
          } else circGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
        });
        text += `, se va echipa un circuit proiectat ${src.circuit || ""} pe stalpi existenti${comunCuText}`;
        circGroups.forEach((g, gi) => {
          const fromLbl = getRouteLabel(circRoute[g.startIdx]);
          const toLbl = getRouteLabel(circRoute[g.endIdx]);
          const groupRouteLabels = [];
          for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
            const lbl = getRouteLabel(circRoute[ri]);
            if (lbl) groupRouteLabels.push(lbl);
          }
          const groupRouteText = groupRouteLabels.join(" - ");
          if (gi === 0) text += ` cu ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${toLbl}`;
          else text += `, din ${fromLbl} pana la ${toLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pe stalpi existenti intre ${groupRouteText}`;
        });
        const branPerStalp = {};
        cabluriBransament.forEach((cn) => {
          const fromEl = S.EL.find((e) => e.id === cn.fromElId);
          const toEl = S.EL.find((e) => e.id === cn.toElId);
          const bmpt = fromEl && fromEl.type === "meter" ? fromEl : toEl;
          const srcEl = fromEl && fromEl.type === "meter" ? toEl : fromEl;
          if (!bmpt || !srcEl) return;
          const srcLabel = srcEl.label || srcEl.type;
          if (!branPerStalp[srcLabel]) branPerStalp[srcLabel] = [];
          branPerStalp[srcLabel].push({ bmpt, cable: cn, srcEl });
        });
        const stalpKeys = Object.keys(branPerStalp);
        if (stalpKeys.length === 1 && branPerStalp[stalpKeys[0]].length === 1) {
          const b = branPerStalp[stalpKeys[0]][0];
          const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
          const bDescs = describeCableGroup2([b.cable]);
          const bLen = parseFloat(b.cable.length) || 0;
          const isFirida = b.srcEl && b.srcEl.type.startsWith("firida_");
          text += `. Din ${stalpKeys[0]} se va realiza un bransament cu ${bDescs.join(", ")}, pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
        } else {
          text += ".\nBransamente:";
          stalpKeys.forEach((srcLabel) => {
            const brans = branPerStalp[srcLabel];
            const isFirida = brans[0].srcEl && brans[0].srcEl.type.startsWith("firida_");
            if (brans.length === 1) {
              const b = brans[0];
              const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
              const bDescs = describeCableGroup2([b.cable]);
              const bLen = parseFloat(b.cable.length) || 0;
              text += `
Din ${srcLabel} se va realiza 1 bransament cu ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
            } else {
              text += `
Din ${srcLabel} se vor realiza ${brans.length} bransamente astfel:`;
              brans.forEach((b) => {
                const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                const tipCC = getConductorOrCablu(cableName);
                const len = parseFloat(b.cable.length) || 0;
                text += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, isFirida)}.`;
              });
            }
          });
        }
        return text;
      }
      if (hasBransament && !hasCircuit) {
        const src = sourceEls[0] || {};
        const allBranCables = [...cabluriCircuit, ...cabluriBransament];
        const branDescs = describeCableGroup2(allBranCables);
        const srcIsCD = src.el && (src.el.type.startsWith("cd") || src.el.type.startsWith("ptab_") || src.el.type === "trafo");
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza";
        if (srcIsCD) {
          text += ` printr-un bransament din ${getSourcePrefix(src.el, src.ptLabel || ptName).replace("Din ", "")}, format din ${branDescs.join(", ")}`;
        } else {
          text += " pe joasa tensiune";
          if (src.el) text += ` din ${src.el.label || ""}`;
          if (src.circuit) text += `, circuit nr. ${src.circuit}`;
          if (ptName) text += `, zona de post ${ptName}`;
          text += `, printr-un bransament cu ${branDescs.join(", ")}`;
        }
        if (bmptText) text += `, pana la ${bmptText}`;
        text += ".";
        return text;
      }
      if (hasCircuit) {
        const src = sourceEls[0] || {};
        let text = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune";
        if (src.el && !src.isStalp) text += ` ${getSourcePrefix(src.el, src.ptLabel || ptName)}`;
        else if (src.el) text += ` din ${src.el.label || ""}`;
        const allDescs = describeCableGroup2(cabluriCircuit);
        const tipElem = nrStalpiNoi > 0 ? "stalpi noi" : "firide noi";
        text += `, se va realiza un circuit proiectat ${src.circuit || ""} pe ${tipElem} cu ${allDescs.join(", ")}.`;
        return text;
      }
      return `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune, zona de post ${ptName || ""}.`;
    }
    const hasIntarire = proiectIntarire.cabluri.length > 0 || proiectIntarire.elemente.length > 0;
    let solutieRacordareText = "";
    let solutieIntarireText = "NU ESTE CAZUL";
    try {
      if (hasIntarire) {
        const intarireIds = new Set(proiectIntarire.elemente.map((e) => e.id));
        let intSrcEl = null, intSrcPtLabel = "", intCircuit = "";
        proiectIntarire.cabluri.forEach((cn) => {
          [cn.fromElId, cn.toElId].forEach((elId) => {
            if (elId && !intarireIds.has(elId) && !intSrcEl) {
              const el = S.EL.find((e) => e.id === elId);
              if (el && (!el.stare || el.stare === "existent")) {
                intSrcEl = el;
                if (cn.circuitGroup) intCircuit = cn.circuitGroup;
                else if (cn.fromCircuit) intCircuit = "C" + cn.fromCircuit;
                if (el.type.startsWith("cd")) {
                  const ptCable = S.CN.find((c) => (!c.stare || c.stare === "existent") && (c.fromElId === elId || c.toElId === elId));
                  if (ptCable) {
                    const ptId = ptCable.fromElId === elId ? ptCable.toElId : ptCable.fromElId;
                    const ptE = S.EL.find((e) => e.id === ptId && (e.type === "trafo" || e.type.startsWith("ptab_")));
                    if (ptE) intSrcPtLabel = ptE.label || "";
                  }
                } else {
                  intSrcPtLabel = el.label || "";
                }
              }
            }
          });
        });
        if (!intCircuit) {
          proiectIntarire.cabluri.forEach((cn) => {
            [cn.fromElId, cn.toElId].forEach((elId) => {
              if (elId && !intarireIds.has(elId)) {
                S.CN.filter((c) => (!c.stare || c.stare === "existent") && (c.fromElId === elId || c.toElId === elId)).forEach((c) => {
                  if (c.circuitGroup && !intCircuit) intCircuit = c.circuitGroup;
                });
              }
            });
          });
        }
        const intStalpi = proiectIntarire.elemente.filter((e) => e.type.startsWith("stalp_"));
        let lastIntStalpLabel = "";
        intStalpi.forEach((st) => {
          lastIntStalpLabel = st.label || "";
        });
        const existCircOnStalpi = /* @__PURE__ */ new Set();
        proiectIntarire.cabluri.forEach((cn) => {
          [cn.fromElId, cn.toElId].forEach((elId) => {
            if (elId) {
              S.CN.filter((c) => (!c.stare || c.stare === "existent") && (c.fromElId === elId || c.toElId === elId)).forEach((c) => {
                if (c.circuitGroup) existCircOnStalpi.add(c.circuitGroup);
              });
            }
          });
        });
        const intarireParts = [];
        const replacementCables = proiectIntarire.cabluri.filter((cn) => cn.stare === "intarire_inlocuire" || cn.oldTipConductor);
        const extensionCables = proiectIntarire.cabluri.filter(
          (cn) => (cn.stare === "intarire_nou" || !cn.oldTipConductor && cn.stare !== "intarire_inlocuire") && !(S.EL.find((e) => e.id === cn.fromElId)?.type === "meter" || S.EL.find((e) => e.id === cn.toElId)?.type === "meter")
        );
        if (replacementCables.length > 0) {
          const getElLabel = (elId) => {
            const el = S.EL.find((e) => e.id === (typeof elId === "string" ? Number(elId) : elId));
            return el ? el.label || el.type : "";
          };
          const adj = {};
          const degree = {};
          replacementCables.forEach((cn) => {
            const a = String(cn.fromElId), b = String(cn.toElId);
            if (!adj[a]) adj[a] = [];
            if (!adj[b]) adj[b] = [];
            adj[a].push({ to: b, cable: cn });
            adj[b].push({ to: a, cable: cn });
            degree[a] = (degree[a] || 0) + 1;
            degree[b] = (degree[b] || 0) + 1;
          });
          const visitedNodes = /* @__PURE__ */ new Set();
          const chains = [];
          Object.keys(adj).forEach((startCandidate) => {
            if (visitedNodes.has(startCandidate)) return;
            const component = /* @__PURE__ */ new Set();
            const queue = [startCandidate];
            while (queue.length > 0) {
              const node = queue.shift();
              if (component.has(node)) continue;
              component.add(node);
              (adj[node] || []).forEach((n) => {
                if (!component.has(n.to)) queue.push(n.to);
              });
            }
            const endpoint = [...component].find((id) => degree[id] === 1) || [...component][0];
            const route = [endpoint];
            const routeCables = [];
            const visitedCables = /* @__PURE__ */ new Set();
            let current = endpoint;
            while (true) {
              const neighbors = (adj[current] || []).filter((n) => !visitedCables.has(n.cable.id));
              if (!neighbors.length) break;
              visitedCables.add(neighbors[0].cable.id);
              routeCables.push(neighbors[0].cable);
              current = neighbors[0].to;
              route.push(current);
            }
            component.forEach((n) => visitedNodes.add(n));
            chains.push({ route, cables: routeCables });
          });
          chains.forEach((chain) => {
            const routeLabels = chain.route.map((id) => getElLabel(id)).filter((l) => l);
            const routeText = routeLabels.join(" - ");
            const totalLen = chain.cables.reduce((s2, cn) => s2 + (parseFloat(cn.length) || 0), 0);
            const cn0 = chain.cables[0];
            const newName = getCableOfficialName(cn0.tipConductor || "Torsadat Al", cn0.sectiune || 16, cn0.tipRetea || "Trifazat");
            const newCC = getConductorOrCablu(newName);
            const typeKeys = new Set(chain.cables.map((cn) => {
              const oldName = getCableOfficialName(cn.oldTipConductor, cn.oldSectiune || 16, cn.oldTipRetea || "Trifazat");
              return oldName + "\u2192" + getCableOfficialName(cn.tipConductor || "Torsadat Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
            }));
            if (typeKeys.size === 1) {
              const oldName = getCableOfficialName(cn0.oldTipConductor, cn0.oldSectiune || 16, cn0.oldTipRetea || "Trifazat");
              const oldCC = getConductorOrCablu(oldName);
              intarireParts.push(`Se va inlocui ${oldCC} existent tip ${oldName} cu ${newCC} tip ${newName} intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
            } else {
              intarireParts.push(`Se va inlocui conductorul existent intre ${routeText} pe o lungime totala de ${totalLen.toFixed(0)} m cu ${newCC} tip ${newName}.`);
            }
          });
        }
        if (extensionCables.length > 0) {
          if (intStalpi.length > 0) {
            const intSrcLabel = intSrcEl ? intSrcEl.label || intSrcEl.type : "";
            const extLen = extensionCables.reduce((s2, cn) => s2 + (parseFloat(cn.length) || 0), 0);
            const extDescs = describeCableGroup(extensionCables);
            const intStalpGroups = {};
            intStalpi.forEach((st) => {
              const typeName = { stalp_sc10002: "SC10002", stalp_sc10005: "SC10005", stalp_se4: "SE4", stalp_se10: "SE10", stalp_rotund: "SR", stalp_rotund_special: "SRS", stalp_cs: "SCS" }[st.type] || st.type;
              if (!intStalpGroups[typeName]) intStalpGroups[typeName] = 0;
              intStalpGroups[typeName]++;
            });
            const stalpTypeText = Object.entries(intStalpGroups).map(([name, cnt]) => `${cnt}x${name}`).join(" si ");
            let extText = `Se va extinde reteaua existenta din ${intSrcLabel} pe o lungime de ${extLen.toFixed(0)} m cu ${extDescs.join(", ")} pe stalpi noi proiectati de tip ${stalpTypeText}`;
            if (lastIntStalpLabel) extText += ` pana la ${lastIntStalpLabel}`;
            intarireParts.push(extText + ".");
          } else {
            const getElLabelExt = (elId) => {
              const el = S.EL.find((e) => e.id === (typeof elId === "string" ? Number(elId) : elId));
              return el ? el.label || el.type : "";
            };
            const getElTypeExt = (elId) => {
              const el = S.EL.find((e) => e.id === (typeof elId === "string" ? Number(elId) : elId));
              return el ? el.type : "";
            };
            const extAdj = {};
            const extDeg = {};
            extensionCables.forEach((cn) => {
              const a = String(cn.fromElId), b = String(cn.toElId);
              if (!extAdj[a]) extAdj[a] = [];
              if (!extAdj[b]) extAdj[b] = [];
              extAdj[a].push({ to: b, cable: cn });
              extAdj[b].push({ to: a, cable: cn });
              extDeg[a] = (extDeg[a] || 0) + 1;
              extDeg[b] = (extDeg[b] || 0) + 1;
            });
            const extVisitedNodes = /* @__PURE__ */ new Set();
            Object.keys(extAdj).forEach((startNode) => {
              if (extVisitedNodes.has(startNode)) return;
              const comp = /* @__PURE__ */ new Set();
              const q = [startNode];
              while (q.length > 0) {
                const n = q.shift();
                if (comp.has(n)) continue;
                comp.add(n);
                (extAdj[n] || []).forEach((nb) => {
                  if (!comp.has(nb.to)) q.push(nb.to);
                });
              }
              const eps = [...comp].filter((id) => extDeg[id] === 1);
              let startId = eps[0] || [...comp][0];
              eps.forEach((id) => {
                const t = getElTypeExt(id);
                if (t.startsWith("cd") || t === "trafo" || t.startsWith("ptab_")) startId = id;
              });
              if (!eps.some((id) => {
                const t = getElTypeExt(id);
                return t.startsWith("cd") || t === "trafo" || t.startsWith("ptab_");
              })) {
                [...comp].forEach((id) => {
                  const t = getElTypeExt(id);
                  if (t.startsWith("cd") || t === "trafo" || t.startsWith("ptab_")) startId = id;
                });
              }
              const route = [startId];
              const rCables = [];
              const vCables = /* @__PURE__ */ new Set();
              let cur = startId;
              while (true) {
                const nbs = (extAdj[cur] || []).filter((n) => !vCables.has(n.cable.id));
                if (!nbs.length) break;
                vCables.add(nbs[0].cable.id);
                rCables.push(nbs[0].cable);
                cur = nbs[0].to;
                route.push(cur);
              }
              comp.forEach((n) => extVisitedNodes.add(n));
              const routeLabels = route.map((id) => getElLabelExt(id)).filter((l) => l);
              const totalLen = rCables.reduce((s2, cn) => s2 + (parseFloat(cn.length) || 0), 0);
              let circuit = "";
              rCables.forEach((cn) => {
                if (cn.circuitGroup && !circuit) circuit = cn.circuitGroup;
              });
              const srcEl = S.EL.find((e) => e.id === Number(startId));
              const srcIsCD = srcEl && (srcEl.type.startsWith("cd") || srcEl.type === "trafo" || srcEl.type.startsWith("ptab_"));
              const firstLabel = routeLabels[0] || "";
              const lastLabel = routeLabels[routeLabels.length - 1] || "";
              let srcPrefix = "";
              if (srcIsCD) {
                let ptLabel = "";
                if (srcEl.type.startsWith("cd")) {
                  const ptCable = S.CN.find((c) => (!c.stare || c.stare === "existent") && (c.fromElId === srcEl.id || c.toElId === srcEl.id));
                  if (ptCable) {
                    const ptId = ptCable.fromElId === srcEl.id ? ptCable.toElId : ptCable.fromElId;
                    const ptE = S.EL.find((e) => e.id === ptId && (e.type === "trafo" || e.type.startsWith("ptab_")));
                    if (ptE) ptLabel = ptE.label || "";
                  }
                }
                srcPrefix = ptLabel ? `Din ${firstLabel} a ${ptLabel}` : `Din ${firstLabel}`;
              } else {
                srcPrefix = `Din ${firstLabel}`;
              }
              const existCircOnRoute = /* @__PURE__ */ new Set();
              route.forEach((nodeId) => {
                const numId = Number(nodeId);
                S.CN.filter((c) => (!c.stare || c.stare === "existent") && (c.fromElId === numId || c.toElId === numId)).forEach((c) => {
                  if (c.circuitGroup && c.circuitGroup !== circuit) existCircOnRoute.add(c.circuitGroup);
                });
              });
              const comunCircText = existCircOnRoute.size > 0 ? ` comuni cu circuit ${[...existCircOnRoute].join(", ")}` : "";
              const extGroups = [];
              rCables.forEach((cn, i) => {
                const name = getCableOfficialName(cn.tipConductor || "Torsadat Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
                const last = extGroups[extGroups.length - 1];
                if (last && last.name === name) {
                  last.totalLen += parseFloat(cn.length) || 0;
                  last.endIdx = i + 1;
                } else extGroups.push({ name, cc: getConductorOrCablu(name), totalLen: parseFloat(cn.length) || 0, startIdx: i, endIdx: i + 1 });
              });
              let extText = `${srcPrefix}${circuit ? ", circuit " + circuit : ""} se va realiza un circuit nou`;
              extGroups.forEach((g, gi) => {
                const toLbl = getElLabelExt(route[g.endIdx]);
                const fromLbl = getElLabelExt(route[g.startIdx]);
                const grpRouteLabels = [];
                for (let ri = g.startIdx; ri <= g.endIdx; ri++) {
                  const lbl = getElLabelExt(route[ri]);
                  if (lbl) grpRouteLabels.push(lbl);
                }
                const grpRouteText = grpRouteLabels.join(" - ");
                if (gi === 0) extText += ` cu ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pana la ${toLbl}`;
                else extText += `, din ${fromLbl} pana la ${toLbl} se va poza ${g.cc} tip ${g.name} in lungime de ${g.totalLen.toFixed(0)} m pe stalpi existenti${comunCircText} intre ${grpRouteText}`;
              });
              if (existCircOnRoute.size > 0) extText += `, prin care se vor prelua parte din consumatorii existenti de pe circuit ${[...existCircOnRoute].join(", ")}`;
              intarireParts.push(extText + ".");
            });
          }
        }
        const demontedCables = S.CN.filter((cn) => cn.stare === "demontat");
        if (demontedCables.length > 0) {
          const getElLabel = (elId) => {
            const el = S.EL.find((e) => e.id === (typeof elId === "string" ? Number(elId) : elId));
            return el ? el.label || el.type : "";
          };
          const demAdj = {};
          const demDegree = {};
          demontedCables.forEach((cn) => {
            const a = String(cn.fromElId), b = String(cn.toElId);
            if (!demAdj[a]) demAdj[a] = [];
            if (!demAdj[b]) demAdj[b] = [];
            demAdj[a].push({ to: b, cable: cn });
            demAdj[b].push({ to: a, cable: cn });
            demDegree[a] = (demDegree[a] || 0) + 1;
            demDegree[b] = (demDegree[b] || 0) + 1;
          });
          const demVisited = /* @__PURE__ */ new Set();
          Object.keys(demAdj).forEach((startNode) => {
            if (demVisited.has(startNode)) return;
            const comp = /* @__PURE__ */ new Set();
            const q = [startNode];
            while (q.length > 0) {
              const n = q.shift();
              if (comp.has(n)) continue;
              comp.add(n);
              (demAdj[n] || []).forEach((nb) => {
                if (!comp.has(nb.to)) q.push(nb.to);
              });
            }
            const ep = [...comp].find((id) => demDegree[id] === 1) || [...comp][0];
            const route = [ep];
            const rCables = [];
            const vCables = /* @__PURE__ */ new Set();
            let cur = ep;
            while (true) {
              const nbs = (demAdj[cur] || []).filter((n) => !vCables.has(n.cable.id));
              if (!nbs.length) break;
              vCables.add(nbs[0].cable.id);
              rCables.push(nbs[0].cable);
              cur = nbs[0].to;
              route.push(cur);
            }
            comp.forEach((n) => demVisited.add(n));
            const routeLabels = route.map((id) => getElLabel(id)).filter((l) => l);
            const routeText = routeLabels.join(" - ");
            const totalLen = rCables.reduce((s2, cn) => s2 + (parseFloat(cn.length) || 0), 0);
            const demDescs = {};
            rCables.forEach((cn) => {
              const name = getCableOfficialName(cn.tipConductor || "Clasic Al", cn.sectiune || 16, cn.tipRetea || "Trifazat");
              const cc = getConductorOrCablu(name);
              if (!demDescs[name]) demDescs[name] = { name, cc, len: 0 };
              demDescs[name].len += parseFloat(cn.length) || 0;
            });
            const demTypes = Object.values(demDescs);
            if (demTypes.length === 1) intarireParts.push(`Se va demonta ${demTypes[0].cc}ul existent tip ${demTypes[0].name} intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
            else intarireParts.push(`Se va demonta conductorul existent intre ${routeText} pe o lungime de ${totalLen.toFixed(0)} m.`);
          });
        }
        solutieIntarireText = intarireParts.length > 0 ? intarireParts.join("\n") : "NU ESTE CAZUL";
        const racHasCircuit = proiectRacordare.elemente.some((e) => e.type.startsWith("firida_") || e.type.startsWith("stalp_"));
        if (racHasCircuit) {
          solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
        } else {
          const allBMPTs = [...proiectRacordare.elemente.filter((e) => e.type === "meter"), ...proiectIntarire.elemente.filter((e) => e.type === "meter")];
          const seenBMPTIds = /* @__PURE__ */ new Set();
          const uniqueBMPTs = allBMPTs.filter((b) => {
            if (seenBMPTIds.has(b.id)) return false;
            seenBMPTIds.add(b.id);
            return true;
          });
          const allBranCables = [...proiectRacordare.cabluri, ...proiectIntarire.cabluri].filter((cn) => {
            const fromEl = S.EL.find((e) => e.id === cn.fromElId);
            const toEl = S.EL.find((e) => e.id === cn.toElId);
            return fromEl && fromEl.type === "meter" || toEl && toEl.type === "meter";
          });
          const seenBranIds = /* @__PURE__ */ new Set();
          const uniqueBranCables = allBranCables.filter((c) => {
            if (seenBranIds.has(c.id)) return false;
            seenBranIds.add(c.id);
            return true;
          });
          if (uniqueBMPTs.length > 0 && uniqueBranCables.length > 0) {
            if (uniqueBMPTs.length === 1) {
              const bmpt = uniqueBMPTs[0];
              const bCable = uniqueBranCables[0];
              const bmptLabel = bmpt.bmptText || bmpt.label || "BMPT";
              const branDescs = describeCableGroup([bCable]);
              const bLen = parseFloat(bCable.length) || 0;
              const otherId = bCable.fromElId === bmpt.id ? bCable.toElId : bCable.fromElId;
              const srcEl = S.EL.find((e) => e.id === otherId);
              const isFirida = srcEl && srcEl.type.startsWith("firida_");
              solutieRacordareText = `Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune printr-un bransament cu ${branDescs.join(", ")}, pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
            } else {
              solutieRacordareText = "Alimentarea cu energie electrica a obiectivului se va realiza pe joasa tensiune.\nBransamente:";
              const srcGroups = {};
              uniqueBranCables.forEach((cn) => {
                const fromEl = S.EL.find((e) => e.id === cn.fromElId);
                const toEl = S.EL.find((e) => e.id === cn.toElId);
                const bmpt = fromEl && fromEl.type === "meter" ? fromEl : toEl;
                const srcElB = fromEl && fromEl.type === "meter" ? toEl : fromEl;
                const srcLabel = srcElB ? srcElB.label || "stalp" : "stalp";
                if (!srcGroups[srcLabel]) srcGroups[srcLabel] = [];
                srcGroups[srcLabel].push({ bmpt, cable: cn });
              });
              Object.entries(srcGroups).forEach(([srcLabel, brans]) => {
                const srcElB = S.EL.find((e) => e.label === srcLabel);
                const isFirida = srcElB && srcElB.type.startsWith("firida_");
                if (brans.length === 1) {
                  const b = brans[0];
                  const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                  const bLen = parseFloat(b.cable.length) || 0;
                  const bDescs = describeCableGroup([b.cable]);
                  solutieRacordareText += `
Din ${isFirida ? "" : "stalpul "}${srcLabel} se va realiza 1 bransament cu ${bDescs.join(", ")} pana la un ${bmptLabel} montat ${getBMPTLocation(bLen, isFirida)}.`;
                } else {
                  solutieRacordareText += `
Din ${isFirida ? "" : "stalpul "}${srcLabel} se vor realiza ${brans.length} bransamente astfel:`;
                  brans.forEach((b) => {
                    const bmptLabel = b.bmpt.bmptText || b.bmpt.label || "BMPT";
                    const cableName = getCableOfficialName(b.cable.tipConductor || "Cablu Al", b.cable.sectiune || 16, b.cable.tipRetea || "Trifazat");
                    const tipCC = getConductorOrCablu(cableName);
                    const len = parseFloat(b.cable.length) || 0;
                    solutieRacordareText += `
- ${tipCC} tip ${cableName} in lungime de ${len.toFixed(0)} m pana la un ${bmptLabel} montat ${getBMPTLocation(len, isFirida)}.`;
                  });
                }
              });
            }
          } else if (proiectRacordare.cabluri.length > 0 || proiectRacordare.elemente.length > 0) {
            solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
          } else {
            solutieRacordareText = "Se va stabili conform proiect.";
          }
        }
      } else {
        solutieRacordareText = buildSolutionText(proiectRacordare.cabluri, proiectRacordare.elemente);
        solutieIntarireText = lucrariIntarire;
      }
    } catch (e) {
      console.error("FS text generation error:", e);
      solutieRacordareText = solutieRacordareText || "Eroare la generare text - completati manual.";
      solutieIntarireText = solutieIntarireText || "NU ESTE CAZUL";
    }
    const existentCabluri = S.CN.filter((cn) => !cn.stare || cn.stare === "existent");
    const hasLEA = existentCabluri.some((cn) => cn.lineType !== "dashed");
    const hasLES = existentCabluri.some((cn) => cn.lineType === "dashed");
    let tipRetea = "";
    if (hasLEA && hasLES) tipRetea = "LEA/LES";
    else if (hasLES) tipRetea = "LES";
    else if (hasLEA) tipRetea = "LEA";
    else tipRetea = "re\u021Bea";
    const allPTs = S.EL.filter((e) => (e.type === "trafo" || e.type === "ptab_1t" || e.type === "ptab_2t") && (!e.stare || e.stare === "existent"));
    let autoInfoRetea = "";
    function getPTpower(pt) {
      if (pt.type === "trafo") return (pt.trText || { power: "160kVA" }).power || "160kVA";
      if (pt.type === "ptab_1t") return (pt.trText || { power: "250kVA" }).power || "250kVA";
      if (pt.type === "ptab_2t") return (pt.trText1 || { power: "250kVA" }).power || "250kVA";
      return "250kVA";
    }
    if (allPTs.length > 0) {
      const tipReteaJT = hasLES ? "LES 0,4 kV" : "LEA 0,4 kV";
      const isBuclat = allPTs.length >= 2;
      const tipCircuit = isBuclat ? "buclat" : "radial";
      const existCircuits = /* @__PURE__ */ new Set();
      existentCabluri.forEach((cn) => {
        if (cn.circuitGroup) existCircuits.add(cn.circuitGroup);
      });
      const circuitText = existCircuits.size > 0 ? [...existCircuits].join(", ") : "";
      const ptNames = allPTs.map((pt) => {
        const nrT = pt.type === "ptab_2t" ? 2 : 1;
        const pw = getPTpower(pt);
        return `${pt.label || pt.type} 20/0.4 kV \u2014 ${nrT}x${pw}`;
      });
      autoInfoRetea = `In zona obiectivului exista ${tipReteaJT}`;
      if (circuitText) autoInfoRetea += `, circuit ${circuitText}`;
      autoInfoRetea += ` - ${tipCircuit} din zona de post ${ptNames.join(", ")}`;
    }
    let finalInfoRetea = infoRetea || autoInfoRetea;
    if (previewOnly) {
      document.getElementById("fs-preview-racordare").value = solutieRacordareText || "";
      document.getElementById("fs-preview-intarire").value = solutieIntarireText || "NU ESTE CAZUL";
      document.getElementById("fs-preview-retea").value = finalInfoRetea;
      document.getElementById("fs-preview-section").style.display = "flex";
      toast("Previzualizare generat\u0103 \u2014 po\u021Bi edita textul \xEEnainte de export", "ok");
      return;
    }
    const previewVisible = document.getElementById("fs-preview-section").style.display !== "none";
    if (previewVisible) {
      solutieRacordareText = document.getElementById("fs-preview-racordare").value;
      solutieIntarireText = document.getElementById("fs-preview-intarire").value;
      finalInfoRetea = document.getElementById("fs-preview-retea").value;
    }
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      BorderStyle,
      HeadingLevel,
      VerticalAlign
    } = window.docx;
    const { TabStopPosition, TabStopType } = window.docx;
    const f = "Polo", s = 24, sb = 24;
    const p = (text, opts) => new Paragraph({ children: [new TextRun({ text, size: opts?.size || s, bold: opts?.bold, font: f })], alignment: opts?.align || AlignmentType.JUSTIFIED, spacing: { after: 0, before: 0, ...opts?.spacing || {} } });
    const pb = (text, opts) => p(text, { ...opts, bold: true });
    const ps = () => new Paragraph({ children: [new TextRun({ text: "", size: 2 })], spacing: { after: 0, before: 0 } });
    function tc(text, opts) {
      const o = opts || {};
      return new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: text || "", size: o.size || s, bold: o.bold, font: f })], alignment: o.align || AlignmentType.LEFT })],
        width: o.width ? { size: o.width, type: WidthType.DXA } : void 0,
        verticalAlign: VerticalAlign.CENTER,
        shading: o.shading ? { fill: o.shading } : void 0
      });
    }
    let schemaImageData = null, schemaW = 600, schemaH = 400;
    try {
      if (S.EL.length > 0 || S.CN.length > 0) {
        const expResult = buildExportSVG(false, null);
        const scale = Math.min(2, 8e3 / Math.max(expResult.W, expResult.H));
        const bgColor = "#ffffff";
        const canvas = await renderToCanvas(expResult.svgStr, expResult.W, expResult.H, expResult.vX, expResult.vY, scale, bgColor);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        const buf = await blob.arrayBuffer();
        schemaImageData = new Uint8Array(buf);
        const maxW = 580;
        const ratio = canvas.height / canvas.width;
        schemaW = maxW;
        schemaH = Math.round(maxW * ratio);
        if (schemaH > 500) {
          schemaH = 500;
          schemaW = Math.round(500 / ratio);
        }
      }
    } catch (e) {
      console.warn("Schema capture failed:", e);
    }
    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        footers: { default: new window.docx.Footer({ children: [
          new Paragraph({ children: [new TextRun({ text: "DEGR E P13-F16, Ed.1", size: 16, font: f, italics: true })], alignment: AlignmentType.LEFT })
        ] }) },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: erre, bold: true, size: s, font: f }),
              new TextRun({ text: "	", size: s }),
              new TextRun({ text: "NR: " + nrDoc, bold: true, size: s, font: f })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }]
          }),
          ps(),
          p("FI\u0218A DE SOLU\u021AIE", { bold: true, size: 28, align: AlignmentType.CENTER }),
          p("pentru racordarea locului de consum la re\u021Beaua electric\u0103 de joas\u0103 tensiune", { size: sb, align: AlignmentType.CENTER }),
          p(`din localitatea ${localitate} beneficiar ${beneficiar}`, { size: sb, align: AlignmentType.CENTER }),
          ps(),
          p(`Puterea maxim\u0103 absorbit\u0103 simultan: ${putereKW} kW / ${putereKVA} kVA`, { bold: true, size: sb }),
          p(`Denumire obiectiv: ${obiectiv}`, { bold: true, size: sb }),
          ps(),
          pb("1. Date despre postul (sta\u021Bia) de transformare din care se alimenteaz\u0103 re\u021Beaua", { size: sb }),
          p(`1.1. Denumirea \u0219i raportul de transformare: ${ptName} 20/0.4 kV`),
          p(`1.2. Num\u0103rul \u0219i puterea transformatoarelor: ${nrTrafo}x${putereTrafo} kVA`),
          p("1.3. Tensiunea pe 0,4 kV la v\xE2rf de sarcin\u0103, m\u0103surat\u0103 la data de ________________________"),
          p("1.4. Sarcina de v\xE2rf:"),
          new Table({ rows: [
            new TableRow({ children: [tc("", { size: s }), tc("R", { size: s, bold: true, align: AlignmentType.CENTER }), tc("S", { size: s, bold: true, align: AlignmentType.CENTER }), tc("T", { size: s, bold: true, align: AlignmentType.CENTER }), tc("(A)", { size: s, bold: true, align: AlignmentType.CENTER })] }),
            new TableRow({ children: [tc("T1", { size: s, bold: true }), tc("", { size: s }), tc("", { size: s }), tc("", { size: s }), tc("", { size: s })] }),
            new TableRow({ children: [tc("T2", { size: s, bold: true }), tc("", { size: s }), tc("", { size: s }), tc("", { size: s }), tc("", { size: s })] })
          ], width: { size: 100, type: WidthType.PERCENTAGE } }),
          p("1.5. Curentul nominal al siguran\u021Belor generale:"),
          new Table({ rows: [
            new TableRow({ children: [tc("T1", { size: s, bold: true }), tc("T2", { size: s, bold: true }), tc("(A)", { size: s, bold: true })] }),
            new TableRow({ children: [tc("", { size: s }), tc("", { size: s }), tc("", { size: s })] })
          ], width: { size: 100, type: WidthType.PERCENTAGE } }),
          ps(),
          pb("2. Date despre re\u021Beaua (circuitul) din care se racordeaz\u0103 utilizatorul", { size: sb }),
          p("2.1. Denumire circuit: Circuit proiectat"),
          p("2.2. Sec\u021Biunea de 0,4 kV a PT pe care este racordat\u0103 re\u021Beaua: ________"),
          p("2.3. Curentul nominal al siguran\u021Bei: ________"),
          p("2.4. Lungimea total\u0103 a re\u021Belei pe sec\u021Biuni: ________"),
          p("2.5. Lungimea re\u021Belei de la PT p\xE2n\u0103 la consumator: ________"),
          p("2.6. Num\u0103rul locurilor de consum cu S \u2264 11 kVA: ________"),
          p("2.7. Locuri de consum cu S > 11 kVA: ________"),
          p("2.8. Num\u0103rul locurilor de producere/consum racordate: ________"),
          p("2.9. Sarcina de v\xE2rf a circuitului: ________"),
          ps(),
          pb("3. Schema simplificat\u0103 a re\u021Belei", { size: sb }),
          ...schemaImageData ? [new Paragraph({
            children: [new window.docx.ImageRun({ data: schemaImageData, transformation: { width: schemaW, height: schemaH }, type: "png" })],
            alignment: AlignmentType.CENTER
          })] : [p("(Se va ata\u0219a schema)")],
          ps(),
          pb("4. Niveluri de tensiune", { size: sb }),
          p(`La postul de transformare: ${uPT} V`),
          p(`La punctul de racordare al noului consumator: ${uCons} V`),
          p(`La cap\u0103tul re\u021Belei: ${uCapat || "________"} V`),
          ps(),
          pb("5. Alte informa\u021Bii despre re\u021Bea", { size: sb }),
          p(finalInfoRetea || "-"),
          ps(),
          pb("6. Descrierea solu\u021Biei de racordare propuse", { size: sb }),
          pb("a) Lucr\u0103ri pentru instala\u021Bia de racordare:"),
          ...(solutieRacordareText || "").split("\n").filter((ln) => ln.trim()).map(
            (ln) => new Paragraph({ children: [new TextRun({ text: ln.trim(), size: s, font: f })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 } })
          ),
          // Voltage drop table after 6a)
          ...(() => {
            if (!S.vdResults || S.vdResults.size === 0) return [];
            const showIsc = document.getElementById("vd-show-isc")?.checked === true;
            const vdRows = [];
            S.vdResults.forEach((data) => {
              const el = S.EL.find((x) => x.id === data.elId);
              if (!el) return;
              if (el.type.startsWith("cd") || el.type.startsWith("ptab_") || el.type === "trafo" || el.type === "meter" || el.type === "celula_linie_mt" || el.type === "celula_trafo_mt" || el.type === "bara_mt" || el.type === "bara_statie_mt") return;
              let localCons = 0;
              if (el.cons_dict) {
                const grp = data.circKey || "Implicit";
                localCons = parseInt(el.cons_dict[grp] || el.cons_dict["Implicit"] || 0) || 0;
              } else {
                localCons = parseInt(el.consumatori) || 0;
              }
              vdRows.push({ label: data.label || el.label || "?", circuit: data.circKey || "", conductor: (data.tipConductor || "\u2014") + " " + (data.sectiune || "") + "mm\xB2", L: data.L || 0, Lcum: data.L_cumulat || 0, nrCons: localCons, P: data.P_total_branch || 0, duNod: data.duNod || 0, Isc: data.Isc || 0 });
            });
            if (vdRows.length === 0) return [];
            vdRows.sort((a, b) => a.circuit.localeCompare(b.circuit) || a.Lcum - b.Lcum);
            const hdr = (text) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, size: 16, bold: true, font: f })], alignment: AlignmentType.CENTER })], shading: { fill: "D9E2F3" }, verticalAlign: VerticalAlign.CENTER });
            const cell = (text, opts) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 16, font: f, bold: opts?.bold, color: opts?.color })], alignment: opts?.align || AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER });
            const headers = [hdr("Nod"), hdr("Circuit"), hdr("Conductor"), hdr("L(m)"), hdr("L cum.(m)"), hdr("Nr.cons."), hdr("P(kW)"), hdr("\u0394U nod%")];
            if (showIsc) headers.push(hdr("Isc 1F(kA)"));
            const tableRows = [new TableRow({ children: headers })];
            vdRows.forEach((r) => {
              const duColor = r.duNod > 10 ? "FF0000" : r.duNod > 5 ? "FF6600" : r.duNod > 3 ? "CC9900" : "008800";
              const cells = [
                cell(r.label, { align: AlignmentType.LEFT }),
                cell(r.circuit),
                cell(r.conductor, { align: AlignmentType.LEFT }),
                cell(r.L.toFixed(0)),
                cell(r.Lcum.toFixed(0)),
                cell(String(r.nrCons)),
                cell(r.P.toFixed(2)),
                cell(r.duNod.toFixed(3), { bold: true, color: duColor })
              ];
              if (showIsc) cells.push(cell(r.Isc > 0 ? r.Isc.toFixed(3) : "-"));
              tableRows.push(new TableRow({ children: cells }));
            });
            const maxDU = vdRows.reduce((m, r) => Math.max(m, r.duNod), 0);
            const consPerCircuit = {};
            vdRows.forEach((r) => {
              if (!consPerCircuit[r.circuit]) consPerCircuit[r.circuit] = 0;
              consPerCircuit[r.circuit] += r.nrCons;
            });
            const consText = Object.entries(consPerCircuit).map(([circ, cnt]) => `Consumatori pe ${circ} = ${cnt} consumatori`).join("; ");
            return [
              ps(),
              pb("Calcul c\u0103deri de tensiune (PE 132/2003):", { size: sb }),
              new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
              p(`\u0394U max nod: ${maxDU.toFixed(3)}% \u2014 Limita admis\u0103: \xB110% (PE 132)`, { size: 18 }),
              p(consText, { size: 18 })
            ];
          })(),
          ps(),
          pb("b) Lucr\u0103ri de \xEEnt\u0103rire re\u021Bea:"),
          ...(solutieIntarireText || "NU ESTE CAZUL").split("\n").filter((ln) => ln.trim()).map(
            (ln) => new Paragraph({ children: [new TextRun({ text: ln.trim(), size: s, font: f })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 } })
          ),
          ps(),
          p(`c) Puterea maxim\u0103 ce poate fi absorbit\u0103 f\u0103r\u0103 lucr\u0103ri de \xEEnt\u0103rire: ${hasIntarire ? "0 kW" : "NU ESTE CAZUL"}`),
          ps(),
          pb("d) Puncte de delimitare:"),
          pb("Punctul de racordare: COMPLETEAZA PUNCT RACORD"),
          pb("Punctul de delimitare: borne ie\u0219ire disjunctor spre consumator"),
          pb("Punctul de m\u0103surare: COMPLETEAZA GRUP MASURA"),
          ps(),
          p(`e) datele necesare pentru stabilirea tarifului de racordare: conform Ord. 59/2013, este de: ${tarif ? tarif : "________"} lei (f\u0103r\u0103 TVA), la data ${tarifData || "________"} \u0219i reprezint\u0103:`),
          ...tarifIntarire ? [p(`     Tarif de \xEEnt\u0103rire re\u021Bea: ${tarifIntarire} lei (f\u0103r\u0103 TVA)`)] : [],
          ...tarifTotal ? [pb(`     TOTAL investi\u021Bie: ${tarifTotal} lei (f\u0103r\u0103 TVA)`)] : [],
          ps(),
          pb("7. Detalii \u0219i preciz\u0103ri privind avizele \u0219i acordurile necesare pentru realizarea solu\u021Biei propuse:", { size: sb }),
          p("________"),
          ps(),
          pb("8. Alte informa\u021Bii (prim utilizator, racordare la instala\u021Bia unui prim utilizator etc.):", { size: sb }),
          ...(() => {
            const coexEls = S.EL.filter((e) => e.stare === "coexistenta" && e.type.startsWith("stalp_") && e.coexReplace);
            if (coexEls.length === 0) return [p("________")];
            const tipOriginal = { stalp_se4: "SE4", stalp_se10: "SE10", stalp_sc10002: "SC10002", stalp_sc10005: "SC10005", stalp_rotund: "St\xE2lp Rotund", stalp_rotund_special: "St\xE2lp Rotund Special", stalp_cs: "SCS" };
            const lines = coexEls.map((e) => {
              const origType = tipOriginal[e.coexOrigType || e.type] || e.coexOrigType || e.type;
              return `Necesar inlocuire stalp existent ${e.label || ""} tip ${origType} cu stalp tip ${e.coexReplace}.`;
            });
            return [pb("Lucr\u0103ri de coexisten\u021B\u0103:", { size: sb }), ...lines.map((ln) => p(ln))];
          })(),
          ps(),
          pb("9. Adresa electric\u0103", { size: sb }),
          new Table({ rows: [
            new TableRow({ children: [tc("Sta\u021Bie transf.", { bold: true, shading: "D9E2F3", size: s }), tc("Linie", { bold: true, shading: "D9E2F3", size: s }), tc("Post", { bold: true, shading: "D9E2F3", size: s }), tc("Plecare", { bold: true, shading: "D9E2F3", size: s }), tc("St\xE2lp/Firid\u0103", { bold: true, shading: "D9E2F3", size: s })] }),
            new TableRow({ children: [tc(aeStatie, { size: s }), tc(aeLinie, { size: s }), tc(aePost, { size: s }), tc(aePlecare, { size: s }), tc(aeStalp, { size: s })] })
          ], width: { size: 100, type: WidthType.PERCENTAGE } }),
          ps(),
          new Paragraph({ children: [new TextRun({ text: "Aprobat,", bold: true, size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "Avizat,", bold: true, size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: "COORDONATOR ERRE", size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "SEF CORE", size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: coord, bold: true, size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "FLORIN TOMULESCU", bold: true, size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          ps(),
          new Paragraph({ children: [new TextRun({ text: "Elaborat,", bold: true, size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "SEF SERV. MANAGEMENT MASURA /", size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: elaborat, bold: true, size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "REPREZENTANT ZONAL", size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.\u2026\u2026\u2026", size: s, font: f }), new TextRun({ text: "	" }), new TextRun({ text: "PETRU CATALIN NECULAU", bold: true, size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] }),
          new Paragraph({ children: [new TextRun({ text: "", size: s }), new TextRun({ text: "	" }), new TextRun({ text: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026..", size: s, font: f })], tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }] })
        ]
      }]
    });
    Packer.toBlob(doc).then(function(blob) {
      const fileName = `FS_${beneficiar || "document"}_${localitate || ""}.docx`.replace(/\s+/g, "_");
      if (window.__TAURI__) {
        blob.arrayBuffer().then(function(buf) {
          window.__TAURI__.dialog.save({ title: "Salveaz\u0103 Fi\u0219a de Solu\u021Bie", defaultPath: fileName, filters: [{ name: "Word Document", extensions: ["docx"] }] }).then(function(path) {
            if (path) {
              window.__TAURI__.fs.writeFile(path, new Uint8Array(buf)).then(function() {
                toast("Fi\u0219\u0103 de Solu\u021Bie generat\u0103: " + path.split(/[/\\]/).pop(), "ok");
                closeFSModal();
              });
            }
          });
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        toast("Fi\u0219\u0103 de Solu\u021Bie generat\u0103!", "ok");
        closeFSModal();
      }
    }).catch(function(e) {
      console.error("FS generation error:", e);
      toast("Eroare generare FS: " + e.message, "");
    });
  }
  window.openFSModal = openFSModal;
  window.closeFSModal = closeFSModal;
  window.resetFSForm = resetFSForm;
  window.previewFS = previewFS;
  window.copyPreviewField = copyPreviewField;
  window.copyAllPreview = copyAllPreview;
  window.generateFS = generateFS;

  // src/prosumator.js
  init_state();
  init_config();
  init_calculations();
  init_utils();
  var PROS_PROFILE = { "cons_vara": [0.8803, 0.7929, 0.7503, 0.7283, 0.7202, 0.7577, 0.8539, 0.9662, 1.0638, 1.1343, 1.1798, 1.2026, 1.2033, 1.2165, 1.2209, 1.2209, 1.2415, 1.2841, 1.2995, 1.3054, 1.3046, 1.3384, 1.3223, 1.0903, 0.8986, 0.7951, 0.7467, 0.7232, 0.7055, 0.7349, 0.8304, 0.9383, 1.033, 1.0829, 1.1365, 1.1747, 1.1842, 1.2011, 1.2114, 1.2261, 1.2635, 1.3017, 1.3325, 1.3384, 1.3436, 1.3715, 1.3406, 1.102, 0.9082, 0.8091, 0.7606, 0.7379, 0.7158, 0.7452, 0.8494, 0.9706, 1.0609, 1.1189, 1.1747, 1.2048, 1.2099, 1.2063, 1.1901, 1.1864, 1.1857, 1.2004, 1.2364, 1.2562, 1.2599, 1.2562, 1.1505, 0.9508, 0.8105, 0.7386, 0.6997, 0.6799, 0.6688, 0.7004, 0.7672, 0.8443, 0.9119, 0.964, 1.0066, 1.0161, 0.9889, 0.9823, 0.9809, 0.9956, 1.0095, 1.0411, 1.0646, 1.08, 1.1035, 1.1718, 1.1321, 0.9412, 0.7775, 0.6953, 0.652, 0.6365, 0.6226, 0.6512, 0.7393, 0.8465, 0.9346, 0.9735, 0.9985, 1.0124, 1.0036, 1.0139, 1.0168, 1.0455, 1.0682, 1.0932, 1.1182, 1.1262, 1.1417, 1.2004, 1.1696, 0.9757, 0.812, 0.7232, 0.674, 0.6527, 0.6387, 0.6637, 0.7606, 0.8928, 1.0095, 1.0866, 1.1306, 1.1512, 1.1505, 1.1571, 1.1527, 1.1497, 1.1769, 1.1997, 1.2261, 1.2474, 1.2687, 1.309, 1.2665, 1.0513, 0.8781, 0.7731, 0.718, 0.6938, 0.6725, 0.6725, 0.7232, 0.7929, 0.8663, 0.8972, 0.9221, 0.9295, 0.9376, 0.9258, 0.9199, 0.9141, 0.9295, 0.95, 0.975, 1.0227, 1.055, 1.0991, 1.0506, 0.8788], "cons_iarna": [0.7192, 0.6595, 0.6329, 0.6208, 0.6418, 0.7111, 0.8619, 1.0239, 1.1408, 1.2142, 1.2255, 1.1997, 1.1836, 1.182, 1.1997, 1.2182, 1.3005, 1.3859, 1.3884, 1.3593, 1.286, 1.1739, 1.0312, 0.8659, 0.7401, 0.6708, 0.6418, 0.6281, 0.6426, 0.7079, 0.8393, 0.9449, 0.9852, 1.0078, 1.0135, 1.0006, 1.0014, 0.9997, 1.0143, 1.053, 1.1505, 1.2408, 1.2553, 1.2408, 1.1852, 1.0941, 0.9683, 0.8191, 0.7151, 0.6506, 0.6232, 0.6144, 0.6305, 0.695, 0.8401, 0.9868, 1.0892, 1.1336, 1.14, 1.1086, 1.0699, 1.0602, 1.0683, 1.1054, 1.2295, 1.3666, 1.3803, 1.3505, 1.2666, 1.1425, 0.9844, 0.8143, 0.7047, 0.6442, 0.6152, 0.6031, 0.6224, 0.6942, 0.8482, 1.003, 1.0909, 1.1223, 1.1191, 1.0796, 1.0538, 1.057, 1.0699, 1.1183, 1.2295, 1.3561, 1.3674, 1.3311, 1.2497, 1.1352, 0.9756, 0.8232, 0.7159, 0.6579, 0.6281, 0.62, 0.6321, 0.6942, 0.8369, 0.9764, 1.061, 1.107, 1.1005, 1.0626, 1.028, 1.0489, 1.078, 1.1328, 1.2457, 1.3626, 1.3682, 1.3174, 1.2408, 1.1344, 0.9965, 0.8506, 0.7369, 0.6531, 0.6192, 0.6023, 0.6136, 0.6611, 0.7651, 0.9046, 1.0933, 1.2053, 1.2553, 1.2602, 1.2416, 1.2166, 1.2166, 1.2489, 1.3811, 1.544, 1.5415, 1.4827, 1.3722, 1.2344, 1.0554, 0.8796, 0.745, 0.6748, 0.6313, 0.616, 0.6152, 0.645, 0.7071, 0.7998, 0.9328, 0.9885, 1.0223, 1.0344, 1.0384, 1.0118, 0.9748, 1.0078, 1.1062, 1.2328, 1.2497, 1.24, 1.182, 1.0771, 0.9369, 0.7998] };
  var PROS_PV_PROFILE = { "pv_vara": [0, 0, 0, 0, 1e-4, 67e-4, 0.0166, 0.0673, 0.2487, 0.5952, 0.6755, 0.5997, 0.4709, 0.5931, 0.523, 0.3877, 0.2812, 0.1282, 0.0204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44e-4, 0.1255, 0.2726, 0.4072, 0.5269, 0.5883, 0.5625, 0.5796, 0.5813, 0.522, 0.4554, 0.3802, 0.299, 0.1462, 0.0233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1e-4, 67e-4, 0.2619, 0.3265, 0, 0.4331, 0.5195, 0.6395, 0.5999, 0.5467, 0.4657, 0.3532, 0.301, 0.0323, 0.0366, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0136, 0.1188, 0.2694, 0.3874, 0.533, 0.6166, 0.6645, 0.674, 0.6566, 0.6125, 0.5286, 0.1319, 0.0359, 0.0183, 96e-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0393, 0.055, 0.1254, 0.1497, 0.3916, 0.4071, 0.662, 0.5304, 0.459, 0.5009, 0.4275, 0.2827, 0.117, 0.0294, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62e-4, 0.0163, 0.2071, 0.1037, 0.1691, 0.203, 0.2223, 0.2559, 0.1963, 0.3265, 0.2951, 0.1533, 0.0972, 0.0359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68e-4, 0.1598, 0.3299, 0.4343, 0.5078, 0.4994, 0.6737, 0.6964, 0.5963, 0.5915, 0.4559, 0.3033, 0.1535, 0.0384, 0, 0, 0, 0, 0], "pv_iarna": [0, 0, 0, 0, 0, 0, 0, 95e-4, 0.0966, 0.1863, 0.1985, 0.2324, 0.21, 0.1698, 0.0665, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26e-4, 0.0381, 0.1104, 0.0323, 0.0623, 0.0834, 0.1102, 0.043, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6e-4, 0.0103, 0.0397, 0.0439, 0.0985, 0.0682, 0.0413, 68e-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45e-4, 0.0488, 0.1021, 0.1164, 0.1673, 0.121, 0.0812, 0.0348, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32e-4, 0.0425, 0.1134, 0.0818, 0.0619, 0.0635, 0.034, 0.0287, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6e-4, 0.0343, 0.0531, 0.046, 0.0399, 0.0356, 0.0216, 82e-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0268, 0.0411, 0.0276, 0.0234, 0.0133, 0.0529, 21e-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
  function csConsum(n) {
    if (n <= 1) return 1;
    if (n <= 5) return 0.7;
    if (n <= 20) return 0.45;
    if (n <= 50) return 0.32;
    return 0.25;
  }
  function pvProfile(lat, sezon) {
    return PROS_PV_PROFILE["pv_" + sezon];
  }
  function prosFindSource() {
    const cd = S.EL.find((el) => el.type.startsWith("cd"));
    if (cd) return cd;
    return S.EL.find((el) => el.type === "ptab_1t" || el.type === "ptab_2t" || el.type === "ptab_mono" || el.type === "trafo");
  }
  function prosFindPath(targetId) {
    const source = prosFindSource();
    if (!source) return null;
    const visited = /* @__PURE__ */ new Set([source.id]);
    const queue = [{ id: source.id, path: [] }];
    while (queue.length) {
      const cur = queue.shift();
      if (cur.id === targetId) {
        const target = S.EL.find((e) => e.id === targetId);
        return { source, target, segments: cur.path };
      }
      const cables = S.CN.filter((c) => c.fromElId === cur.id || c.toElId === cur.id);
      for (const cn of cables) {
        const nextId = cn.fromElId === cur.id ? cn.toElId : cn.fromElId;
        if (!nextId || visited.has(nextId)) continue;
        visited.add(nextId);
        queue.push({ id: nextId, path: [...cur.path, { cableId: cn.id, L: parseFloat(cn.length) || 0, S: parseFloat(cn.sectiune) || 16, tipC: cn.tipConductor || "Clasic Al" }] });
      }
    }
    return null;
  }
  function prosBuildTree() {
    const source = prosFindSource();
    if (!source) return null;
    const nodeCables = /* @__PURE__ */ new Map([[source.id, []]]);
    const visited = /* @__PURE__ */ new Set([source.id]);
    const queue = [source.id];
    while (queue.length) {
      const cur = queue.shift();
      const curCables = nodeCables.get(cur);
      for (const cn of S.CN.filter((c) => c.fromElId === cur || c.toElId === cur)) {
        const next = cn.fromElId === cur ? cn.toElId : cn.fromElId;
        if (!next || visited.has(next)) continue;
        visited.add(next);
        nodeCables.set(next, [...curCables, cn]);
        queue.push(next);
      }
    }
    return { source, nodeCables };
  }
  function prosAnalyzePath(targetId) {
    const tree = prosBuildTree();
    if (!tree || !tree.nodeCables.has(targetId)) return null;
    const targetCables = tree.nodeCables.get(targetId);
    const targetCableIds = new Set(targetCables.map((c) => c.id));
    const cableChildId = /* @__PURE__ */ new Map();
    for (const [elId, cables] of tree.nodeCables) {
      if (cables.length === 0) continue;
      cableChildId.set(cables[cables.length - 1].id, elId);
    }
    const allCableInfo = /* @__PURE__ */ new Map();
    for (const cn of S.CN) {
      const childId = cableChildId.get(cn.id);
      if (!childId) continue;
      const childEl = S.EL.find((e) => e.id === childId);
      if (!childEl) continue;
      let N_local = 0, P_PV_local = 0;
      if (childEl.cons_dict) for (const g in childEl.cons_dict) N_local += parseInt(childEl.cons_dict[g]) || 0;
      else if (childEl.consumatori) N_local += parseInt(childEl.consumatori) || 0;
      if (childEl.pv_dict) for (const g in childEl.pv_dict) P_PV_local += parseFloat(childEl.pv_dict[g]) || 0;
      allCableInfo.set(cn.id, { cable: cn, childId, childLabel: childEl.label || childEl.type, N_local, P_PV_local, L: parseFloat(cn.length) || 0, S: parseFloat(cn.sectiune) || 16, tipC: cn.tipConductor || "Clasic Al", tipRetea: cn.tipRetea || "Trifazat" });
    }
    const downstreamCables = /* @__PURE__ */ new Map();
    for (const C of targetCables) {
      const ds = [];
      for (const [dId, dInfo] of allCableInfo) {
        if (dId === C.id) continue;
        const childPath = tree.nodeCables.get(dInfo.childId) || [];
        if (childPath.some((cn) => cn.id === C.id)) ds.push(dId);
      }
      downstreamCables.set(C.id, ds);
    }
    const cableStats = /* @__PURE__ */ new Map();
    for (const cn of targetCables) {
      const info = allCableInfo.get(cn.id);
      cableStats.set(cn.id, { cable: cn, N_cons: 0, P_PV: 0, N_local: info ? info.N_local : 0, P_PV_local: info ? info.P_PV_local : 0, childId: info ? info.childId : null });
    }
    for (const el of S.EL) {
      if (!tree.nodeCables.has(el.id)) continue;
      let elCons = 0, elPV = 0;
      if (el.cons_dict) for (const g in el.cons_dict) elCons += parseInt(el.cons_dict[g]) || 0;
      else if (el.consumatori) elCons += parseInt(el.consumatori) || 0;
      if (el.pv_dict) for (const g in el.pv_dict) elPV += parseFloat(el.pv_dict[g]) || 0;
      if (elCons === 0 && elPV === 0) continue;
      const elPath = tree.nodeCables.get(el.id);
      for (const cn of elPath) {
        if (targetCableIds.has(cn.id)) {
          const st = cableStats.get(cn.id);
          st.N_cons += elCons;
          st.P_PV += elPV;
        }
      }
    }
    const target = S.EL.find((e) => e.id === targetId);
    return { source: tree.source, target, targetCables, cableStats, allCableInfo, downstreamCables };
  }
  function aggregateSchema() {
    let totalCons = 0, totalPV = 0;
    S.EL.forEach((el) => {
      if (el.cons_dict) {
        for (const g in el.cons_dict) totalCons += parseInt(el.cons_dict[g]) || 0;
      } else if (el.consumatori) totalCons += parseInt(el.consumatori) || 0;
      if (el.pv_dict) {
        for (const g in el.pv_dict) totalPV += parseFloat(el.pv_dict[g]) || 0;
      }
    });
    return { totalCons, totalPV };
  }
  function cableRes(S_sec) {
    const rho = 0.029;
    return { r: rho / S_sec, x: 0.08 / 1e3 };
  }
  function svgChart(series, opts) {
    const w = opts.w || 900, h = opts.h || 200, pl = 45, pr = 15, pt = 15, pb = 38;
    const cw = w - pl - pr, ch = h - pt - pb;
    const yMin = opts.yMin, yMax = opts.yMax;
    const xN = series[0].data.length;
    const xs = (i) => pl + i / (xN - 1) * cw;
    const ys = (v) => pt + ch - (v - yMin) / (yMax - yMin) * ch;
    let out = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="background:var(--bg2);border-radius:6px;display:block">`;
    (opts.bands || []).forEach((b) => {
      const y1 = ys(b.max), y2 = ys(b.min);
      out += `<rect x="${pl}" y="${Math.min(y1, y2)}" width="${cw}" height="${Math.abs(y2 - y1)}" fill="${b.color}" opacity="0.12"/>`;
    });
    for (let i = 0; i <= 5; i++) {
      const v = yMin + (yMax - yMin) * i / 5, y = ys(v);
      out += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="var(--border)" stroke-width="0.5" opacity="0.4"/><text x="${pl - 5}" y="${y + 3}" font-size="8" fill="var(--text3)" text-anchor="end" font-family="monospace">${v.toFixed(1)}</text>`;
    }
    for (let d = 0; d < 7; d++) {
      const x1 = xs(d * 24), x2 = xs(Math.min(d * 24 + 24, xN - 1)), isWeekend = d >= 5, fill = isWeekend ? "rgba(255,193,7,0.06)" : d % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent";
      out += `<rect x="${x1}" y="${pt}" width="${x2 - x1}" height="${ch}" fill="${fill}"/>`;
    }
    for (let d = 1; d < 7; d++) {
      const x = xs(d * 24);
      out += `<line x1="${x}" y1="${pt}" x2="${x}" y2="${pt + ch}" stroke="var(--border2)" stroke-width="1" opacity="0.55"/>`;
    }
    for (let d = 0; d < 7; d++) {
      for (let hh = 6; hh < 24; hh += 6) {
        const xT = xs(d * 24 + hh);
        out += `<line x1="${xT}" y1="${pt + ch}" x2="${xT}" y2="${pt + ch + 3}" stroke="var(--text3)" stroke-width="0.5" opacity="0.6"/><text x="${xT}" y="${pt + ch + 9}" font-size="6.5" fill="var(--text3)" text-anchor="middle">${hh}</text>`;
      }
    }
    const dnames = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];
    for (let d = 0; d < 7; d++) {
      const col = d >= 5 ? "#ffc107" : "var(--text2)";
      out += `<text x="${xs(d * 24 + 12)}" y="${h - 3}" font-size="9.5" fill="${col}" font-weight="700" text-anchor="middle">${dnames[d]}</text>`;
    }
    if (opts.zeroLine && yMin < 0 && yMax > 0) {
      const y = ys(0);
      out += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="var(--text3)" stroke-width="1" opacity="0.6"/>`;
    }
    series.forEach((sr) => {
      const pts = sr.data.map((v, i) => `${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(" ");
      out += `<polyline fill="none" stroke="${sr.color}" stroke-width="1.5" points="${pts}" ${sr.dashed ? 'stroke-dasharray="4,3"' : ""}/>`;
    });
    if (opts.legend) {
      let lx = pl + 5, ly = pt + 12;
      series.forEach((sr) => {
        out += `<line x1="${lx}" y1="${ly}" x2="${lx + 15}" y2="${ly}" stroke="${sr.color}" stroke-width="2" ${sr.dashed ? 'stroke-dasharray="3,2"' : ""}/><text x="${lx + 20}" y="${ly + 3}" font-size="9" fill="var(--text2)">${sr.label}</text>`;
        lx += 20 + sr.label.length * 5.5 + 10;
      });
    }
    if (opts.yLabel) {
      out += `<text x="12" y="${pt + ch / 2}" font-size="9" fill="var(--text3)" transform="rotate(-90 12 ${pt + ch / 2})" text-anchor="middle">${opts.yLabel}</text>`;
    }
    out += `<line class="pros-hover-line" x1="0" y1="${pt}" x2="0" y2="${pt + ch}" stroke="#ffc107" stroke-width="1" opacity="0.7" pointer-events="none" style="display:none"/>`;
    out += `<rect class="pros-chart-overlay" x="${pl}" y="${pt}" width="${cw}" height="${ch}" fill="transparent" data-pl="${pl}" data-cw="${cw}" onmousemove="prosChartHover(event)" onmouseleave="prosChartHoverHide()"/>`;
    out += `</svg>`;
    return out;
  }
  function prosChartHover(ev) {
    const d = window.prosTooltipData;
    if (!d) return;
    const rect = ev.currentTarget;
    const svg = rect.ownerSVGElement;
    const svgBox = svg.getBoundingClientRect();
    const pl = parseFloat(rect.getAttribute("data-pl"));
    const cw = parseFloat(rect.getAttribute("data-cw"));
    let rel = (ev.clientX - svgBox.left - pl) / cw;
    if (rel < 0) rel = 0;
    if (rel > 1) rel = 1;
    const idx = Math.round(rel * 167);
    const day = Math.floor(idx / 24), hour = idx % 24;
    const dnames = ["Luni", "Mar\u021Bi", "Miercuri", "Joi", "Vineri", "S\xE2mb\u0103t\u0103", "Duminic\u0103"];
    const tip = document.getElementById("pros-tooltip");
    if (!tip) return;
    const hourStr = hour.toString().padStart(2, "0") + ":00";
    tip.innerHTML = `<div style="font-weight:700;color:#ffc107;margin-bottom:4px;font-size:10.5px">${dnames[day]} ${hourStr}</div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Consum:</span><b style="color:#00cfff">${d.pCons[idx].toFixed(2)} kW</b></div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Produc\u021Bie PV:</span><b style="color:#ffc107">${d.pPV[idx].toFixed(2)} kW</b></div>
    <div style="display:flex;justify-content:space-between;gap:10px"><span>Flux net:</span><b style="color:${d.pNet[idx] < 0 ? "#22c55e" : "#ef4444"}">${d.pNet[idx].toFixed(2)} kW</b></div>
    <div style="border-top:1px solid #444;margin-top:4px;padding-top:4px;display:flex;justify-content:space-between;gap:10px"><span>Tensiune:</span><b style="color:${d.uArr[idx] > d.Un * 1.05 || d.uArr[idx] < d.Un * 0.95 ? "#ef4444" : "#22c55e"}">${d.uArr[idx].toFixed(1)} V</b></div>
    ${d.uArrNoPV ? `<div style="display:flex;justify-content:space-between;gap:10px;font-size:9px;color:#94a3b8"><span>(f\u0103r\u0103 PV):</span>${d.uArrNoPV[idx].toFixed(1)} V</div>` : ""}`;
    tip.style.display = "block";
    const tipW = tip.offsetWidth || 200, tipH = tip.offsetHeight || 100;
    let tx = ev.clientX + 14, ty = ev.clientY + 10;
    if (tx + tipW > window.innerWidth) tx = ev.clientX - tipW - 14;
    if (ty + tipH > window.innerHeight) ty = ev.clientY - tipH - 10;
    tip.style.left = tx + "px";
    tip.style.top = ty + "px";
    const xLocalForLine = ev.clientX - svgBox.left;
    document.querySelectorAll("#prosumator-panel svg").forEach((sv) => {
      const sb = sv.getBoundingClientRect();
      const line = sv.querySelector(".pros-hover-line");
      if (line) {
        const xInThisSvg = xLocalForLine / svgBox.width * sb.width;
        line.setAttribute("x1", xInThisSvg);
        line.setAttribute("x2", xInThisSvg);
        line.style.display = "block";
      }
    });
  }
  function prosChartHoverHide() {
    const tip = document.getElementById("pros-tooltip");
    if (tip) tip.style.display = "none";
    document.querySelectorAll("#prosumator-panel .pros-hover-line").forEach((l) => l.style.display = "none");
  }
  var prosExtraClients = [];
  function prosAddExtraClient() {
    prosExtraClients.push({ nodeId: "", ps: 10, ppv: 10 });
    prosRenderExtraClients();
    runProsumator();
  }
  function prosRemoveExtraClient(idx) {
    prosExtraClients.splice(idx, 1);
    prosRenderExtraClients();
    runProsumator();
  }
  function prosUpdateExtraClient(idx, field, value) {
    if (!prosExtraClients[idx]) return;
    if (field === "nodeId") prosExtraClients[idx].nodeId = value;
    else if (field === "ps") prosExtraClients[idx].ps = parseFloat(value) || 0;
    else if (field === "ppv") prosExtraClients[idx].ppv = parseFloat(value) || 0;
    runProsumator();
  }
  function prosRenderExtraClients() {
    const list = document.getElementById("pros-extra-clients-list");
    if (!list) return;
    const candidates = S.EL.filter((el) => el.type.startsWith("stalp_") || el.type.startsWith("firida_"));
    if (prosExtraClients.length === 0) {
      list.innerHTML = `<div style="font-size:9px;color:var(--text3);font-style:italic;padding:4px 0">Niciun client suplimentar. Folose\u0219te butonul <b>+ ADAUG\u0102 CLIENT</b> pentru a testa scenarii multi-prosumator.</div>`;
      return;
    }
    list.innerHTML = prosExtraClients.map((c, i) => `
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;font-size:9.5px;font-family:'JetBrains Mono',monospace;padding:4px 6px;background:var(--bg2);border-radius:4px;border:1px solid rgba(255,193,7,0.2)">
      <span style="color:#ffc107;font-weight:700;min-width:20px">#${i + 1}</span>
      <span style="color:var(--text3)">Nod:</span>
      <select onchange="prosUpdateExtraClient(${i},'nodeId',this.value)" style="min-width:140px;background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
        <option value="">\u2014 alege \u2014</option>
        ${candidates.map((el) => `<option value="${el.id}" ${c.nodeId == el.id ? "selected" : ""}>${el.label || el.type}</option>`).join("")}
      </select>
      <span style="color:#ef4444;font-weight:700">Ps:</span>
      <input type="number" step="0.5" value="${c.ps}" onchange="prosUpdateExtraClient(${i},'ps',this.value)" style="width:55px;background:var(--bg3);border:1px solid rgba(239,68,68,0.4);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
      <span style="color:var(--text3);font-size:8.5px">kW</span>
      <span style="color:#ffc107;font-weight:700">PV:</span>
      <input type="number" step="0.5" value="${c.ppv}" onchange="prosUpdateExtraClient(${i},'ppv',this.value)" style="width:55px;background:var(--bg3);border:1px solid rgba(255,193,7,0.4);border-radius:3px;padding:3px 5px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:9.5px">
      <span style="color:var(--text3);font-size:8.5px">kWp</span>
      <button onclick="prosRemoveExtraClient(${i})" style="margin-left:auto;padding:2px 8px;border-radius:3px;border:1px solid rgba(239,68,68,0.4);background:transparent;color:#ef4444;cursor:pointer;font-size:9px;font-weight:700">\u2715</button>
    </div>
  `).join("");
  }
  function prosRefreshNodeDropdown() {
    const sel = document.getElementById("pros-node");
    if (!sel) return;
    const prev = sel.value;
    const candidates = S.EL.filter((el) => el.type.startsWith("stalp_") || el.type.startsWith("firida_"));
    sel.innerHTML = '<option value="">\u2014 manual (L + S) \u2014</option>' + candidates.map((el) => `<option value="${el.id}">${el.label || el.type} (#${el.id})</option>`).join("");
    if (prev && candidates.find((e) => e.id == prev)) sel.value = prev;
  }
  function prosUpdateManualVisibility() {
    const mode = document.getElementById("pros-mode").value;
    const nodeSel = document.getElementById("pros-node")?.value || "";
    const useManual = mode === "retea" || mode === "client" && !nodeSel;
    document.getElementById("pros-manual-len").style.display = useManual ? "flex" : "none";
    document.getElementById("pros-manual-sec").style.display = useManual ? "flex" : "none";
  }
  function prosToggleMode() {
    const mode = document.getElementById("pros-mode").value;
    const isClient = mode === "client";
    document.getElementById("pros-retea-inputs").style.display = "flex";
    document.getElementById("pros-client-ps").style.display = isClient ? "flex" : "none";
    document.getElementById("pros-client-ppv").style.display = isClient ? "flex" : "none";
    document.getElementById("pros-client-node").style.display = isClient ? "flex" : "none";
    document.getElementById("pros-extra-clients-section").style.display = isClient ? "block" : "none";
    if (isClient) {
      prosRefreshNodeDropdown();
      prosRenderExtraClients();
    }
    prosUpdateManualVisibility();
    runProsumator();
  }
  function toggleProsumator() {
    const p = document.getElementById("prosumator-panel");
    const showing = p.style.display === "flex";
    p.style.display = showing ? "none" : "flex";
    if (!showing) {
      prosRefreshNodeDropdown();
      prosRenderExtraClients();
      prosUpdateManualVisibility();
      runProsumator();
    }
  }
  function openProsumatorModal() {
    if (!ENABLE_PROSUMER_MODULE) {
      toast("Modul \xEEn dezvoltare", "ac");
      return;
    }
    toggleProsumator();
  }
  function runProsumator() {
    const sezon = document.getElementById("pros-sezon").value;
    const lat = 47.16;
    const pMed = parseFloat(document.getElementById("pros-pmed").value) || 0.5;
    const L = parseFloat(document.getElementById("pros-len").value) || 300;
    const S_sec = parseFloat(document.getElementById("pros-sec").value) || 50;
    const Un = parseFloat(document.getElementById("pros-un").value) || 400;
    const mode = document.getElementById("pros-mode").value;
    const content = document.getElementById("pros-content");
    let totalCons, totalPV, csCons, pConsScale;
    const profConsRaw = PROS_PROFILE["cons_" + sezon];
    const profConsPeak = Math.max(...profConsRaw);
    const profPV = pvProfile(lat, sezon);
    const csInj = 0.95;
    const nodeId = mode === "client" ? parseInt(document.getElementById("pros-node").value) : 0;
    let pathAnalysis = null, pathData = null;
    let existingCons = 0, existingPV = 0;
    if (nodeId) {
      pathAnalysis = prosAnalyzePath(nodeId);
      pathData = prosFindPath(nodeId);
      if (pathAnalysis && pathData && pathData.segments.length > 0) {
        const firstCable = pathData.segments[0];
        const st = pathAnalysis.cableStats.get(firstCable.cableId);
        if (st) {
          existingCons = st.N_cons;
          existingPV = st.P_PV;
        }
      }
    }
    const extraLoadAtNode = /* @__PURE__ */ new Map();
    if (mode === "client") {
      for (const cl of prosExtraClients) {
        if (!cl.nodeId) continue;
        const nid = parseInt(cl.nodeId);
        if (!nid) continue;
        if (!extraLoadAtNode.has(nid)) extraLoadAtNode.set(nid, { ps: 0, ppv: 0 });
        const e = extraLoadAtNode.get(nid);
        e.ps += cl.ps;
        e.ppv += cl.ppv;
      }
    }
    const extrasTotalPs = [...extraLoadAtNode.values()].reduce((s, e) => s + e.ps, 0);
    const extrasTotalPV = [...extraLoadAtNode.values()].reduce((s, e) => s + e.ppv, 0);
    if (mode === "client") {
      let ps = parseFloat(document.getElementById("pros-ps").value);
      if (isNaN(ps)) ps = 15;
      let ppv = parseFloat(document.getElementById("pros-ppv").value);
      if (isNaN(ppv)) ppv = 25;
      totalCons = 1;
      totalPV = ppv;
      csCons = 1;
      pConsScale = ps;
    } else {
      const { totalCons: tc, totalPV: tp } = aggregateSchema();
      if (tc === 0 && tp === 0) {
        content.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text3);font-size:11px">Nu exist\u0103 consumatori sau prosumatori \xEEn schem\u0103.<br>Adaug\u0103 cantit\u0103\u021Bi \xEEn propriet\u0103\u021Bile st\xE2lpilor/firidelor, sau schimb\u0103 modul \xEEn <b>Client concentrat nou</b>.</div>`;
        return;
      }
      totalCons = tc;
      totalPV = tp;
      csCons = csConsum(totalCons);
      pConsScale = pMed * totalCons;
    }
    const csExisting = csConsum(existingCons);
    const pNet = new Array(168), pConsArr = new Array(168), pPVArr = new Array(168);
    for (let t = 0; t < 168; t++) {
      const profC_peak = profConsRaw[t] / profConsPeak;
      const pc_main = profC_peak * pConsScale * csCons;
      const pp_main = profPV[t] * totalPV * csInj;
      const pc_ext = existingCons > 0 ? existingCons * pMed * profC_peak * csExisting : 0;
      const pp_ext = existingPV > 0 ? existingPV * profPV[t] * csInj : 0;
      const pc_extras = extrasTotalPs * profC_peak;
      const pp_extras = extrasTotalPV * profPV[t] * csInj;
      pConsArr[t] = pc_main + pc_ext + pc_extras;
      pPVArr[t] = pp_main + pp_ext + pp_extras;
      pNet[t] = pConsArr[t] - pPVArr[t];
    }
    const cosPhi = 0.95, sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    let L_real = L, sectionsInfo = `S=${S_sec}mm\xB2`, nodeInfo = "";
    let uArr, uArrNoPV;
    let prosDebugRows = null, prosDebugRowsPeakCons = null, prosDebugHourLabel = "", prosDebugHourLabelPeakCons = "";
    if (pathAnalysis && pathData) {
      const segs = pathData.segments;
      L_real = segs.reduce((s, x) => s + x.L, 0);
      const secSet = [...new Set(segs.map((s) => s.S))].sort((a, b) => a - b);
      sectionsInfo = secSet.length > 1 ? `sec\u021Biuni: ${secSet.join("/")} mm\xB2` : `S=${secSet[0] || S_sec}mm\xB2`;
      nodeInfo = `Surs\u0103: <b>${pathData.source.label || pathData.source.type}</b> \u2192 Nod: <b>${pathData.target.label || pathData.target.type}</b>`;
      const cableInfo = segs.map((seg) => {
        const st = pathAnalysis.cableStats.get(seg.cableId);
        const cnOrig = S.CN.find((c) => c.id === seg.cableId);
        const tipRetea = cnOrig && cnOrig.tipRetea || "Trifazat";
        const factor = tipRetea === "Monofazat" ? 7.7 : tipRetea === "Bifazat" ? 20 : 46;
        const childId = st ? st.childId : null;
        const childEl = childId ? S.EL.find((e) => e.id === childId) : null;
        return { L: seg.L, S: seg.S, tipC: seg.tipC, tipRetea, factor, N_local: st ? st.N_local : 0, P_PV_local: st ? st.P_PV_local : 0, childLabel: childEl ? childEl.label || childEl.type : "?" };
      });
      uArr = new Array(168);
      uArrNoPV = new Array(168);
      const isLastIdx = cableInfo.length - 1;
      let peakHourIdx = 0, peakProfC = 0, peakPVHourIdx = 0, peakPVValue = 0;
      for (let t = 0; t < 168; t++) {
        if (profPV[t] > peakPVValue) {
          peakPVValue = profPV[t];
          peakPVHourIdx = t;
        }
      }
      const pLocalNet = (info, profC_peak, tIdx, withPV) => {
        const ks_loc = getKs(info.N_local, "RURAL");
        let P_cons = info.N_local * pMed * ks_loc * profC_peak;
        let P_pv = withPV ? info.P_PV_local * profPV[tIdx] * csInj : 0;
        const extra = extraLoadAtNode.get(info.childId);
        if (extra) {
          P_cons += extra.ps * profC_peak;
          if (withPV) P_pv += extra.ppv * profPV[tIdx] * csInj;
        }
        return P_cons - P_pv;
      };
      for (let t = 0; t < 168; t++) {
        const profC_peak = profConsRaw[t] / profConsPeak;
        if (profC_peak > peakProfC) {
          peakProfC = profC_peak;
          peakHourIdx = t;
        }
        let dU_percent = 0, dU_noPV = 0;
        for (let i = 0; i < cableInfo.length; i++) {
          const ci = cableInfo[i];
          const cableId = pathData.segments[i].cableId;
          const info_C = pathAnalysis.allCableInfo.get(cableId);
          let P_local_C = pLocalNet(info_C, profC_peak, t, true);
          let P_local_C_noPV = pLocalNet(info_C, profC_peak, t, false);
          if (mode === "client" && i === isLastIdx) {
            P_local_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj;
            P_local_C_noPV += pConsScale * profC_peak;
          }
          let P_passing_C = 0, P_passing_C_noPV = 0;
          for (const dId of pathAnalysis.downstreamCables.get(cableId) || []) {
            const info_D = pathAnalysis.allCableInfo.get(dId);
            if (!info_D) continue;
            P_passing_C += pLocalNet(info_D, profC_peak, t, true);
            P_passing_C_noPV += pLocalNet(info_D, profC_peak, t, false);
          }
          if (mode === "client" && i !== isLastIdx) {
            P_passing_C += pConsScale * profC_peak - totalPV * profPV[t] * csInj;
            P_passing_C_noPV += pConsScale * profC_peak;
          }
          dU_percent += (P_passing_C + P_local_C / 2) * ci.L / (ci.S * ci.factor);
          dU_noPV += (P_passing_C_noPV + P_local_C_noPV / 2) * ci.L / (ci.S * ci.factor);
        }
        uArr[t] = Un * (1 - dU_percent / 100);
        uArrNoPV[t] = Un * (1 - dU_noPV / 100);
      }
      const tree_nc = /* @__PURE__ */ new Map();
      {
        const src = pathAnalysis.source;
        const visited2 = /* @__PURE__ */ new Set([src.id]);
        const queue2 = [{ id: src.id, path: [] }];
        tree_nc.set(src.id, []);
        while (queue2.length) {
          const cur = queue2.shift();
          for (const cn of S.CN.filter((c) => c.fromElId === cur.id || c.toElId === cur.id)) {
            const next = cn.fromElId === cur.id ? cn.toElId : cn.fromElId;
            if (!next || visited2.has(next)) continue;
            visited2.add(next);
            const np = [...cur.path, cn];
            tree_nc.set(next, np);
            queue2.push({ id: next, path: np });
          }
        }
      }
      const cableDownstreamOf = (C_id) => {
        const result = [];
        for (const [dId, dInfo] of pathAnalysis.allCableInfo) {
          if (dId === C_id) continue;
          const dChildPath = tree_nc.get(dInfo.childId) || [];
          if (dChildPath.some((cn) => cn.id === C_id)) result.push(dId);
        }
        return result;
      };
      const targetCableIds2 = new Set(pathData.segments.map((s) => s.cableId));
      const targetPathCables = pathData.segments.map((s) => pathAnalysis.allCableInfo.get(s.cableId));
      const beyondTargetCables = [];
      for (const [dId, dInfo] of pathAnalysis.allCableInfo) {
        if (targetCableIds2.has(dId)) continue;
        const dChildPath = tree_nc.get(dInfo.childId) || [];
        if (dChildPath.length <= pathData.segments.length) continue;
        let isPrefix = true;
        for (let k = 0; k < pathData.segments.length; k++) {
          if (dChildPath[k].id !== pathData.segments[k].cableId) {
            isPrefix = false;
            break;
          }
        }
        if (isPrefix) beyondTargetCables.push(dInfo);
      }
      beyondTargetCables.sort((a, b) => (tree_nc.get(a.childId)?.length || 0) - (tree_nc.get(b.childId)?.length || 0));
      const allRowsInfo = [...targetPathCables, ...beyondTargetCables];
      const lastTargetCableId = pathData.segments[pathData.segments.length - 1].cableId;
      const computeCableRowAt = (info_C, tIdx) => {
        const profC_peak_local = profConsRaw[tIdx] / profConsPeak;
        const ks_loc = getKs(info_C.N_local, "RURAL");
        let P_cons_local = info_C.N_local * pMed * ks_loc * profC_peak_local;
        let P_pv_local = info_C.P_PV_local * profPV[tIdx] * csInj;
        let isClient = false, isExtra = false;
        if (mode === "client" && info_C.cable.id === lastTargetCableId) {
          P_cons_local += pConsScale * profC_peak_local;
          P_pv_local += totalPV * profPV[tIdx] * csInj;
          isClient = true;
        }
        const extraHere = extraLoadAtNode.get(info_C.childId);
        if (extraHere) {
          P_cons_local += extraHere.ps * profC_peak_local;
          P_pv_local += extraHere.ppv * profPV[tIdx] * csInj;
          isExtra = true;
        }
        const P_local_net = P_cons_local - P_pv_local;
        let P_passing = 0;
        for (const dId of cableDownstreamOf(info_C.cable.id)) {
          const info_D = pathAnalysis.allCableInfo.get(dId);
          if (!info_D) continue;
          const ks_D = getKs(info_D.N_local, "RURAL");
          let P_cons_D = info_D.N_local * pMed * ks_D * profC_peak_local;
          let P_pv_D = info_D.P_PV_local * profPV[tIdx] * csInj;
          if (mode === "client" && info_D.cable.id === lastTargetCableId) {
            P_cons_D += pConsScale * profC_peak_local;
            P_pv_D += totalPV * profPV[tIdx] * csInj;
          }
          const extraD = extraLoadAtNode.get(info_D.childId);
          if (extraD) {
            P_cons_D += extraD.ps * profC_peak_local;
            P_pv_D += extraD.ppv * profPV[tIdx] * csInj;
          }
          P_passing += P_cons_D - P_pv_D;
        }
        const P_eff = P_passing + P_local_net / 2;
        const factor = info_C.tipRetea === "Monofazat" ? 7.7 : info_C.tipRetea === "Bifazat" ? 20 : 46;
        const dU = P_eff * info_C.L / (info_C.S * factor);
        return { dU, P_cons_local, P_pv_local, P_passing, P_eff, ks_loc, isClient, isExtra };
      };
      const buildRowsAt = (tIdx) => {
        const dUMap = /* @__PURE__ */ new Map();
        for (const info_C of allRowsInfo) {
          dUMap.set(info_C.cable.id, computeCableRowAt(info_C, tIdx));
        }
        return allRowsInfo.map((info_C) => {
          const r = dUMap.get(info_C.cable.id);
          const childPath = tree_nc.get(info_C.childId) || [];
          let cumul = 0;
          for (const cn of childPath) {
            const d2 = dUMap.get(cn.id);
            if (d2) cumul += d2.dU;
          }
          const isBeyondTarget = !targetCableIds2.has(info_C.cable.id);
          return { label: info_C.childLabel + (r.isClient ? " (CLIENT)" : "") + (r.isExtra ? " \u2605" : "") + (isBeyondTarget ? " \u2B07" : ""), L: info_C.L, S: info_C.S, N: info_C.N_local, ks: r.ks_loc, P_local: r.P_cons_local, P_pv: r.P_pv_local, P_passing: r.P_passing, P_eff: r.P_eff, dU: r.dU, cumul, isBeyondTarget, isExtra: r.isExtra };
        });
      };
      const formatHourLabel = (tIdx) => {
        const di = Math.floor(tIdx / 24), hi = tIdx % 24;
        return ["Luni", "Mar\u021Bi", "Miercuri", "Joi", "Vineri", "S\xE2mb\u0103t\u0103", "Duminic\u0103"][di] + " " + hi.toString().padStart(2, "0") + ":00";
      };
      const showSecondTable = mode === "client" && totalPV > 0;
      if (showSecondTable) {
        prosDebugRows = buildRowsAt(peakPVHourIdx);
        prosDebugHourLabel = formatHourLabel(peakPVHourIdx);
        prosDebugRowsPeakCons = buildRowsAt(peakHourIdx);
        prosDebugHourLabelPeakCons = formatHourLabel(peakHourIdx);
      } else {
        prosDebugRows = buildRowsAt(peakHourIdx);
        prosDebugHourLabel = formatHourLabel(peakHourIdx);
      }
      window.prosExportDebugRows = { peakCons: prosDebugRowsPeakCons || (showSecondTable ? null : prosDebugRows), peakConsLabel: prosDebugHourLabelPeakCons || (showSecondTable ? "" : prosDebugHourLabel), peakPV: showSecondTable ? prosDebugRows : null, peakPVLabel: showSecondTable ? prosDebugHourLabel : "" };
    } else {
      const { r, x } = cableRes(Math.max(S_sec, 1e-3));
      const R_path = r * (L || 1), X_path = x * (L || 1);
      const Un_safe = Un || 400;
      uArr = pNet.map((p) => {
        const P_W = p * 1e3, I = P_W / (Math.sqrt(3) * Un_safe * cosPhi);
        const u = Un_safe - Math.sqrt(3) * I * (R_path * cosPhi + X_path * sinPhi);
        return isFinite(u) ? u : Un_safe;
      });
    }
    const maxCons = Math.max(...pConsArr), minPNet = Math.min(...pNet);
    const maxInj = minPNet < 0 ? -minPNet : 0, hoursInverse = pNet.filter((p) => p < 0).length;
    const uMax = Math.max(...uArr), uMin = Math.min(...uArr);
    const hOver = uArr.filter((u) => u > Un * 1.1).length, hUnder = uArr.filter((u) => u < Un * 0.9).length;
    let pvBenefitMax = 0, dU_zi_withPV_V = 0, dU_zi_noPV_V = 0;
    if (uArrNoPV) {
      for (let t = 0; t < 168; t++) {
        const diff = uArr[t] - uArrNoPV[t];
        if (diff > pvBenefitMax) pvBenefitMax = diff;
        const hOfDay = t % 24;
        if (hOfDay >= 8 && hOfDay <= 18) {
          const dw = Un - uArr[t], dn2 = Un - uArrNoPV[t];
          if (dw > dU_zi_withPV_V) dU_zi_withPV_V = dw;
          if (dn2 > dU_zi_noPV_V) dU_zi_noPV_V = dn2;
        }
      }
    }
    const dU_zi_withPV_percent = dU_zi_withPV_V / Un * 100, dU_zi_noPV_percent = dU_zi_noPV_V / Un * 100;
    window.prosTooltipData = { pCons: pConsArr, pPV: pPVArr, pNet, uArr, uArrNoPV: uArrNoPV || null, Un };
    const flowRange = Math.max(Math.abs(Math.min(...pNet)), Math.max(...pNet), 1) * 1.1;
    const chart1 = svgChart([{ data: pConsArr, color: "#00cfff", label: "Consum" }, { data: pPVArr, color: "#ffc107", label: "Produc\u021Bie PV" }, { data: pNet, color: "#ef4444", label: "Flux net", dashed: true }], { w: Math.max(900, content.clientWidth - 30), h: 220, yMin: -flowRange, yMax: flowRange, yLabel: "kW", zeroLine: true, legend: true });
    const uPad = Math.max(Math.abs(uMax - Un), Math.abs(Un - uMin), 15) * 1.3;
    const chart2Series = [{ data: uArr, color: "#2ecc71", label: "U cap\u0103t (cu PV)" }];
    if (uArrNoPV && pvBenefitMax > 0.5) chart2Series.push({ data: uArrNoPV, color: "#94a3b8", label: "U cap\u0103t f\u0103r\u0103 PV", dashed: true });
    const chart2 = svgChart(chart2Series, { w: Math.max(900, content.clientWidth - 30), h: 220, yMin: Un - uPad, yMax: Un + uPad, yLabel: "V", legend: true, bands: [{ min: Un * 1.1, max: Un + uPad, color: "#ef4444" }, { min: Un * 0.9, max: Un - uPad, color: "#ef4444" }, { min: Un * 1.05, max: Un * 1.1, color: "#eab308" }, { min: Un * 0.9, max: Un * 0.95, color: "#eab308" }, { min: Un * 0.95, max: Un * 1.05, color: "#2ecc71" }] });
    const warn = hOver > 0 ? `<span style="color:#ef4444;font-weight:700">\u26A0 ${hOver}h peste +10% Un</span>` : '<span style="color:#2ecc71">\u2713 f\u0103r\u0103 supratensiune</span>';
    const warnDown = hUnder > 0 ? `<span style="color:#ef4444;font-weight:700">\u26A0 ${hUnder}h sub \u221210% Un</span>` : '<span style="color:#2ecc71">\u2713 f\u0103r\u0103 subtensiune</span>';
    const prosEff = totalPV > 0 ? (-Math.min(...pNet) / totalPV * 100).toFixed(0) : "0";
    const tableRowsHtml = (rows) => rows.map((r) => `<tr style="border-top:1px solid var(--border);${r.isExtra ? "background:rgba(255,193,7,0.06)" : r.isBeyondTarget ? "background:rgba(148,163,184,0.06);opacity:0.85" : ""}"><td style="padding:3px 6px;${r.isBeyondTarget ? "color:#94a3b8" : r.isExtra ? "color:#ffc107;font-weight:700" : ""}">${r.label}</td><td style="padding:3px 6px;text-align:right">${r.L}</td><td style="padding:3px 6px;text-align:right">${r.S}</td><td style="padding:3px 6px;text-align:right">${r.N}</td><td style="padding:3px 6px;text-align:right">${r.ks.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_local.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:${r.P_pv > 0 ? "#ffc107" : "var(--text3)"}">${r.P_pv.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_passing.toFixed(2)}</td><td style="padding:3px 6px;text-align:right">${r.P_eff.toFixed(2)}</td><td style="padding:3px 6px;text-align:right;color:#ff9f43;font-weight:700">${r.dU.toFixed(3)}%</td><td style="padding:3px 6px;text-align:right;color:#ef4444;font-weight:700">${r.cumul.toFixed(2)}%</td></tr>`).join("");
    const tableHead = '<thead><tr style="background:var(--bg3);color:var(--text3)"><th style="padding:4px 6px;text-align:left">Tronson</th><th style="padding:4px 6px">L (m)</th><th style="padding:4px 6px">S</th><th style="padding:4px 6px">N</th><th style="padding:4px 6px">ks</th><th style="padding:4px 6px">P_local (kW)</th><th style="padding:4px 6px">PV (kW)</th><th style="padding:4px 6px">P_passing</th><th style="padding:4px 6px">P_eff</th><th style="padding:4px 6px;color:#ff9f43">\u0394U tronson</th><th style="padding:4px 6px;color:#ef4444">\u0394U cumul</th></tr></thead>';
    content.innerHTML = `
    <div id="pros-tooltip" style="position:fixed;pointer-events:none;display:none;background:rgba(15,23,42,0.97);border:1px solid #ffc107;border-radius:6px;padding:8px 10px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;z-index:9999;min-width:180px;box-shadow:0 8px 24px rgba(0,0,0,0.6)"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode === "client" ? "Ps Consum client" : "Consumatori total"}</div><div style="font-size:16px;font-weight:800;color:#00cfff">${mode === "client" ? pConsScale.toFixed(1) + " kW" : totalCons}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">${mode === "client" ? "P_PV client" : "Putere PV instalat\u0103"}</div><div style="font-size:16px;font-weight:800;color:#ffc107">${totalPV.toFixed(1)} kW</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max consum total</div><div style="font-size:16px;font-weight:800;color:#00cfff">${maxCons.toFixed(1)} kW</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Max injec\u021Bie</div><div style="font-size:16px;font-weight:800;color:${maxInj > 0 ? "#ef4444" : "var(--text3)"}">${maxInj > 0 ? maxInj.toFixed(1) + " kW" : "\u2014 f\u0103r\u0103 injec\u021Bie"}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="font-size:7.5px;color:var(--text3);font-weight:700;text-transform:uppercase">Ore flux invers/s\u0103pt</div><div style="font-size:16px;font-weight:800;color:#ef4444">${hoursInverse}</div></div>
    </div>
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:6px 0 4px">Flux putere pe circuit (168h \u2014 o s\u0103pt\u0103m\xE2n\u0103 tipic\u0103)</div>
    ${chart1}
    ${prosDebugRowsPeakCons ? `<div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson \u2014 <span style="color:#ff9f43">${prosDebugHourLabelPeakCons}</span> <span style="color:#ef4444">(peak consum)</span></div><div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px"><table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">${tableHead}<tbody>${tableRowsHtml(prosDebugRowsPeakCons)}</tbody></table></div>` : ""}
    ${prosDebugRows ? `<div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Defalcare per tronson \u2014 <span style="color:#ffc107">${prosDebugHourLabel}</span></div><div style="overflow-x:auto;background:var(--bg2);border-radius:6px;padding:6px"><table style="width:100%;border-collapse:collapse;font-size:9.5px;font-family:'JetBrains Mono',monospace">${tableHead}<tbody>${tableRowsHtml(prosDebugRows)}</tbody></table></div>` : ""}
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin:14px 0 4px">Tensiune la nodul de racordare (L=${L_real.toFixed(0)}m, ${sectionsInfo}) ${nodeInfo ? `&nbsp;&nbsp;<span style="color:#2ecc71;font-weight:400">${nodeInfo}</span>` : ""}</div>
    ${chart2}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:10px;font-size:10px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">U max / U min</div><div style="color:var(--text);font-weight:700">${uMax.toFixed(1)} V / ${uMin.toFixed(1)} V</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warn}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px">${warnDown}</div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">Max injec\u021Bie / P_PV instalat</div><div style="color:var(--text);font-weight:700">${prosEff}%</div></div>
      ${pvBenefitMax > 0.5 ? `<div style="background:var(--bg2);border:1px solid #2ecc71;border-radius:6px;padding:8px"><div style="color:#2ecc71;font-size:7.5px;text-transform:uppercase;font-weight:700">Beneficiu PV la amiaz\u0103</div><div style="color:#2ecc71;font-weight:700">+${pvBenefitMax.toFixed(1)} V max</div></div><div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">\u0394U max zi CU PV</div><div style="color:#2ecc71;font-weight:700">${dU_zi_withPV_V.toFixed(1)} V / ${dU_zi_withPV_percent.toFixed(2)}%</div></div><div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px"><div style="color:var(--text3);font-size:7.5px;text-transform:uppercase;font-weight:700">\u0394U max zi F\u0102R\u0102 PV</div><div style="color:#94a3b8;font-weight:700">${dU_zi_noPV_V.toFixed(1)} V / ${dU_zi_noPV_percent.toFixed(2)}%</div></div>` : ""}
    </div>`;
  }
  function prosExportCSV() {
    const d = window.prosTooltipData;
    if (!d) {
      toast("Ruleaz\u0103 analiza \xEEnt\xE2i", "w");
      return;
    }
    const mode = document.getElementById("pros-mode").value;
    const sezon = document.getElementById("pros-sezon").value;
    const nodeId = document.getElementById("pros-node")?.value || "";
    const targetEl = nodeId ? S.EL.find((e) => e.id == nodeId) : null;
    const sep = ";", nl = "\r\n";
    const esc = (v) => {
      const s = String(v ?? "");
      return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    let csv = "ELECTROCAD PRO - ANALIZA PROSUMATOR" + nl + "Generat" + sep + esc((/* @__PURE__ */ new Date()).toLocaleString("ro-RO")) + nl + nl;
    csv += "PARAMETRI" + nl + "Mod analiza" + sep + (mode === "client" ? "Client concentrat (ATR)" : "Retea existenta") + nl;
    csv += "Sezon" + sep + (sezon === "vara" ? "Vara (iulie)" : "Iarna (decembrie)") + nl;
    const maxC = Math.max(...d.pCons), minN = Math.min(...d.pNet), maxInj = minN < 0 ? -minN : 0;
    const hInv = d.pNet.filter((p) => p < 0).length, uMax = Math.max(...d.uArr), uMin = Math.min(...d.uArr);
    csv += nl + "STATISTICI" + nl + "Max consum total" + sep + maxC.toFixed(2) + " kW" + nl + "Max injectie" + sep + maxInj.toFixed(2) + " kW" + nl + "Ore flux invers" + sep + hInv + nl;
    csv += "U max" + sep + uMax.toFixed(1) + " V" + nl + "U min" + sep + uMin.toFixed(1) + " V" + nl;
    const rows = window.prosExportDebugRows;
    if (rows && rows.peakCons) {
      csv += nl + "DEFALCARE PER TRONSON - PEAK CONSUM (" + esc(rows.peakConsLabel) + ")" + nl + "Tronson" + sep + "L (m)" + sep + "S (mm2)" + sep + "N" + sep + "ks" + sep + "P_local (kW)" + sep + "PV (kW)" + sep + "P_passing (kW)" + sep + "P_eff (kW)" + sep + "dU tronson (%)" + sep + "dU cumul (%)" + nl;
      rows.peakCons.forEach((r) => {
        csv += esc(r.label) + sep + r.L + sep + r.S + sep + r.N + sep + r.ks.toFixed(2) + sep + r.P_local.toFixed(2) + sep + r.P_pv.toFixed(2) + sep + r.P_passing.toFixed(2) + sep + r.P_eff.toFixed(2) + sep + r.dU.toFixed(3) + sep + r.cumul.toFixed(2) + nl;
      });
    }
    csv += nl + "SERIE TEMPORALA 168h" + nl + "Ora_absoluta" + sep + "Ziua" + sep + "Ora_zi" + sep + "Consum (kW)" + sep + "PV (kW)" + sep + "Flux net (kW)" + sep + "U target (V)" + (d.uArrNoPV ? sep + "U fara PV (V)" : "") + nl;
    const dn = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];
    for (let t = 0; t < 168; t++) {
      const day = Math.floor(t / 24), hr = t % 24;
      csv += t + sep + dn[day] + sep + hr.toString().padStart(2, "0") + sep + d.pCons[t].toFixed(3) + sep + d.pPV[t].toFixed(3) + sep + d.pNet[t].toFixed(3) + sep + d.uArr[t].toFixed(2) + (d.uArrNoPV ? sep + d.uArrNoPV[t].toFixed(2) : "") + nl;
    }
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = "prosumator_" + (targetEl ? (targetEl.label || "nod").replace(/[^\w]/g, "_") : sezon) + "_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:-]/g, "").replace("T", "_") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    toast("CSV exportat!", "ok");
  }
  function prosExportPDF() {
    if (!window.prosTooltipData) {
      toast("Ruleaz\u0103 analiza \xEEnt\xE2i", "w");
      return;
    }
    const panel = document.getElementById("prosumator-panel");
    if (!panel) return;
    const origParent = panel.parentNode, origNextSibling = panel.nextSibling, origStyle = panel.getAttribute("style") || "";
    panel.setAttribute("style", "position:static;display:block;width:100%;height:auto;max-height:none;overflow:visible;box-shadow:none;border:none;border-radius:0;background:white;color:black;padding:0;margin:0;");
    document.body.appendChild(panel);
    document.body.classList.add("pros-printing");
    const restore = () => {
      document.body.classList.remove("pros-printing");
      panel.setAttribute("style", origStyle);
      if (origNextSibling) origParent.insertBefore(panel, origNextSibling);
      else origParent.appendChild(panel);
    };
    setTimeout(() => {
      const afterPrint = () => {
        window.removeEventListener("afterprint", afterPrint);
        restore();
      };
      window.addEventListener("afterprint", afterPrint);
      window.print();
      setTimeout(() => {
        if (document.body.classList.contains("pros-printing")) restore();
      }, 3e3);
    }, 150);
  }
  window.prosChartHover = prosChartHover;
  window.prosChartHoverHide = prosChartHoverHide;
  window.prosAddExtraClient = prosAddExtraClient;
  window.prosRemoveExtraClient = prosRemoveExtraClient;
  window.prosUpdateExtraClient = prosUpdateExtraClient;
  window.prosRenderExtraClients = prosRenderExtraClients;
  window.prosRefreshNodeDropdown = prosRefreshNodeDropdown;
  window.prosUpdateManualVisibility = prosUpdateManualVisibility;
  window.prosToggleMode = prosToggleMode;
  window.toggleProsumator = toggleProsumator;
  window.openProsumatorModal = openProsumatorModal;
  window.runProsumator = runProsumator;
  window.prosExportCSV = prosExportCSV;
  window.prosExportPDF = prosExportPDF;

  // src/import-xls.js
  init_state();
  init_utils();
  init_element_manager();
  init_renderer();
  function parseConductor(str) {
    if (!str) return { tipConductor: "Torsadat Al", sectiune: 70, tipRetea: "Trifazat" };
    const u = str.toUpperCase();
    let tipConductor = "Clasic Al";
    if (u.includes("TYIR") || u.includes("TORSAD") || u.includes("OL-AL") || u.includes("OLAL")) {
      tipConductor = "Torsadat Al";
    } else if (u.includes("LES") || u.includes("XLPE") || u.includes("AC2XS") || u.includes("NAYY") || u.includes("ACB")) {
      tipConductor = "Cablu Al";
    } else if (u.includes("LIYY") || u.includes("NYFGY") || u.includes("NYY") || u.includes("CU") && !u.includes("ACUM") && !u.includes("CIRCUIT")) {
      tipConductor = "Cablu Cu";
    }
    const m = str.match(/(\d+)x(\d+)/i);
    const sectiune = m ? parseInt(m[2]) : 70;
    const phases = m ? parseInt(m[1]) : 3;
    const tipRetea = phases === 1 ? "Monofazat" : phases === 2 ? "Bifazat" : "Trifazat";
    return { tipConductor, sectiune, tipRetea };
  }
  function stalpTypeFromLabel(label) {
    const u = label.toUpperCase().replace(/[\s\-]/g, "");
    if (u.includes("SC10002")) return "stalp_sc10002";
    if (u.includes("SC10005")) return "stalp_sc10005";
    if (u.startsWith("SC")) return "stalp_rotund";
    if (u.startsWith("SE10") || u.includes("/SE10") || u.includes("SE10/")) return "stalp_se10";
    if (u.startsWith("SE4") || u.includes("/SE4") || u.includes("SE4/")) return "stalp_se4";
    if (u.startsWith("SR") || u.includes("ROTUND")) return "stalp_rotund";
    if (/SE10/.test(u)) return "stalp_se10";
    if (/SE4/.test(u)) return "stalp_se4";
    return "stalp_se4";
  }
  function openImportXLS() {
    let inp = document.getElementById("xls-import-input");
    if (!inp) {
      inp = document.createElement("input");
      inp.type = "file";
      inp.id = "xls-import-input";
      inp.accept = ".xlsx,.xls";
      inp.style.display = "none";
      inp.addEventListener("change", (ev) => {
        const f = ev.target.files[0];
        if (f) importFromXLS(f);
        inp.value = "";
      });
      document.body.appendChild(inp);
    }
    inp.click();
  }
  async function importFromXLS(file) {
    if (!window.ExcelJS) {
      toast("ExcelJS nu e disponibil (re\xEEncarc\u0103 pagina)", "ac");
      return;
    }
    toast("Citesc fi\u0219ierul Excel...", "ac");
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch (e) {
      toast("Eroare la citirea fi\u0219ierului", "ac");
      return;
    }
    const wb = new window.ExcelJS.Workbook();
    try {
      await wb.xlsx.load(buffer);
    } catch (e) {
      toast("Fi\u0219ierul nu este un Excel valid", "ac");
      return;
    }
    const rows = [];
    wb.eachSheet((ws) => {
      let isFirst = true;
      ws.eachRow((row) => {
        if (isFirst) {
          isFirst = false;
          return;
        }
        const vals = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          const v = cell.value;
          vals.push(v === null || v === void 0 ? "" : String(v).trim());
        });
        while (vals.length < 7) vals.push("");
        if (vals.slice(0, 4).every((v) => !v)) return;
        rows.push({
          post: vals[0],
          circuit: vals[1],
          stalpInceput: vals[2],
          stalpFinal: vals[3],
          lungime: parseFloat(vals[4]) || 0,
          conductor: vals[5],
          consumatori: parseInt(vals[6]) || 0
        });
      });
    });
    if (rows.length === 0) {
      toast("Fi\u0219ierul nu con\u021Bine date sau formatul coloanelor nu coincide", "ac");
      return;
    }
    if (S.EL.length > 0 && !confirm(`Importul va \u0219terge elementele curente (${S.EL.length} elem). Continui?`)) return;
    saveState("import XLS");
    S.EL = [];
    S.CN = [];
    Object.keys(S.counters).forEach((k) => delete S.counters[k]);
    S.sel = null;
    S.multiSel.clear();
    const postName = rows[0].post || "Import";
    const circuitGroups = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      const key = String(r.circuit || "1").trim();
      if (!circuitGroups.has(key)) circuitGroups.set(key, []);
      circuitGroups.get(key).push(r);
    });
    const XSPACING = 130;
    const YBRANCH = 220;
    const circKeys = [...circuitGroups.keys()];
    const numCircuits = circKeys.length;
    function chooseCDType(maxPort) {
      return maxPort < 4 ? "cd4" : maxPort < 5 ? "cd5" : "cd8";
    }
    function cdOutY(cdType2, portIdx) {
      const np = parseInt(cdType2.replace("cd", ""));
      const BH = np * 36 + 28;
      return -BH / 2 + 16 + 36 * portIdx + 18;
    }
    const maxPortIdx = Math.max(...circKeys.map((k) => (parseInt(k) || 1) - 1));
    const cdPortCount = Math.max(4, maxPortIdx + 1);
    const srcId = uid();
    S.EL.push({
      id: srcId,
      type: "trafo",
      x: -220,
      y: 0,
      label: postName,
      color: "#1a6ba0",
      fillColor: "none",
      rotation: 0,
      scale: 1
    });
    const cdType = chooseCDType(maxPortIdx);
    const cdId = uid();
    const cdX = -50, cdY = 0;
    const cdNp = parseInt(cdType.replace("cd", ""));
    S.EL.push({
      id: cdId,
      type: cdType,
      x: cdX,
      y: cdY,
      label: "CD",
      color: "#555",
      fillColor: "none",
      rotation: 0,
      scale: 1,
      fuses: new Array(cdNp + 1).fill(true)
    });
    {
      const p1 = { x: -220 + 45, y: 0 };
      const p2 = { x: cdX - 70, y: 0 };
      S.CN.push({
        id: uid(),
        fromElId: srcId,
        fromTerm: { cx: 45, cy: 0 },
        toElId: cdId,
        toTerm: { cx: -70, cy: 0 },
        path: [p1, p2],
        label: "Racord",
        length: 10,
        color: "#ef4444",
        strokeWidth: 3,
        lineType: "solid",
        tipConductor: "Torsadat Al",
        sectiune: 50,
        tipRetea: "Trifazat"
      });
    }
    let totalStalpi = 0, totalCn = 1;
    const SYSTEM_RE = /^(CD|PTA|PTAB|TRAFO|POST)$/i;
    circKeys.forEach((circKey, circIdx) => {
      const allSegments = circuitGroups.get(circKey);
      const circLabel = `C${circKey}`;
      const branchY = Math.round((circIdx - (numCircuits - 1) / 2) * YBRANCH);
      const cdPortIdx = Math.max(0, (parseInt(circKey) || 1) - 1);
      const cdOutYRel = cdOutY(cdType, cdPortIdx);
      const cdOutYAbs = cdY + cdOutYRel;
      const sysRow = allSegments.find((s) => SYSTEM_RE.test(s.stalpInceput.trim()));
      const segments = allSegments.filter((s) => !SYSTEM_RE.test(s.stalpInceput.trim()));
      const cdToFirstL = sysRow ? sysRow.lungime : 5;
      const adjList = {};
      const hasParent = /* @__PURE__ */ new Set();
      const consMap = {};
      segments.forEach((s) => {
        if (!adjList[s.stalpInceput]) adjList[s.stalpInceput] = [];
        adjList[s.stalpInceput].push({ to: s.stalpFinal, lungime: s.lungime, conductor: s.conductor });
        hasParent.add(s.stalpFinal);
        consMap[s.stalpInceput] = s.consumatori;
      });
      const allLabels = /* @__PURE__ */ new Set([...Object.keys(adjList), ...segments.map((s) => s.stalpFinal)]);
      const rootNode = [...allLabels].find((n) => !hasParent.has(n)) || segments[0].stalpInceput;
      const nodePos = {};
      const BOFF = 160;
      let nextBranchUpY = branchY;
      let nextBranchDownY = branchY;
      function layoutDFS(label, x, y) {
        if (nodePos[label]) return;
        nodePos[label] = { x, y };
        const children = adjList[label] || [];
        if (children.length > 0) layoutDFS(children[0].to, x + XSPACING, y);
        for (let i = 1; i < children.length; i++) {
          if (i % 2 === 1) {
            nextBranchUpY = Math.min(nextBranchUpY, y) - BOFF;
            layoutDFS(children[i].to, x + XSPACING, nextBranchUpY);
          } else {
            nextBranchDownY = Math.max(nextBranchDownY, y) + BOFF;
            layoutDFS(children[i].to, x + XSPACING, nextBranchDownY);
          }
        }
      }
      layoutDFS(rootNode, 200, branchY);
      let orphanX = 200;
      allLabels.forEach((label) => {
        if (!nodePos[label]) {
          nextBranchDownY += BOFF;
          nodePos[label] = { x: orphanX, y: nextBranchDownY };
          orphanX += XSPACING;
        }
      });
      const nodeIds = {};
      allLabels.forEach((label) => {
        const pos = nodePos[label];
        const stType = stalpTypeFromLabel(label);
        const elId = uid();
        const consumers = consMap[label] ?? 0;
        const isBranch = (adjList[label]?.length || 0) > 1;
        const isLeaf = !adjList[label] || adjList[label].length === 0;
        nodeIds[label] = elId;
        totalStalpi++;
        S.EL.push({
          id: elId,
          type: stType,
          x: pos.x,
          y: pos.y,
          label,
          color: "#555",
          fillColor: "none",
          rotation: 0,
          scale: 1,
          consumatori: consumers,
          cons_dict: { [circLabel]: consumers },
          nod: isBranch ? "nod" : isLeaf ? "capat" : ""
        });
      });
      const firstId = nodeIds[rootNode];
      if (firstId) {
        const firstEl = S.EL.find((e) => e.id === firstId);
        const cond = parseConductor(segments[0]?.conductor || "");
        const p1 = { x: cdX + 70, y: cdOutYAbs };
        const p2 = { x: firstEl.x - 22, y: branchY };
        const routeX = cdX + 110;
        const path = Math.abs(cdOutYAbs - branchY) < 2 ? [p1, p2] : [p1, { x: routeX, y: cdOutYAbs }, { x: routeX, y: branchY }, p2];
        S.CN.push({
          id: uid(),
          fromElId: cdId,
          fromTerm: { cx: 70, cy: cdOutYRel },
          toElId: firstId,
          toTerm: { cx: -22, cy: 0 },
          path,
          label: circLabel,
          length: cdToFirstL,
          color: "#ef4444",
          strokeWidth: 3,
          lineType: "solid",
          tipConductor: cond.tipConductor,
          sectiune: cond.sectiune,
          tipRetea: cond.tipRetea,
          circuitGroup: circLabel
        });
        totalCn++;
      }
      const UP_TERMS = [{ cx: 0, cy: -22 }, { cx: 13, cy: -22 }, { cx: -13, cy: -22 }];
      const DOWN_TERMS = [{ cx: 0, cy: 22 }, { cx: 13, cy: 22 }, { cx: -13, cy: 22 }];
      const termUsage = {};
      segments.forEach((seg, si) => {
        const fromId = nodeIds[seg.stalpInceput];
        const toId = nodeIds[seg.stalpFinal];
        if (!fromId || !toId) return;
        const fromEl = S.EL.find((e) => e.id === fromId);
        const toEl = S.EL.find((e) => e.id === toId);
        if (!fromEl || !toEl) return;
        const cond = parseConductor(seg.conductor);
        if (!termUsage[fromId]) termUsage[fromId] = { up: 0, down: 0 };
        const sameY = Math.abs(fromEl.y - toEl.y) < 2;
        const sameX = Math.abs(fromEl.x - toEl.x) < 2;
        let fromTerm, toTerm, path;
        if (sameY) {
          fromTerm = { cx: 22, cy: 0 };
          toTerm = { cx: -22, cy: 0 };
          path = [{ x: fromEl.x + 22, y: fromEl.y }, { x: toEl.x - 22, y: toEl.y }];
        } else if (sameX) {
          fromTerm = { cx: 0, cy: 22 };
          toTerm = { cx: 0, cy: -22 };
          path = [{ x: fromEl.x, y: fromEl.y + 22 }, { x: toEl.x, y: toEl.y - 22 }];
        } else if (toEl.y < fromEl.y) {
          const t = UP_TERMS[termUsage[fromId].up % UP_TERMS.length];
          termUsage[fromId].up++;
          fromTerm = t;
          toTerm = { cx: -22, cy: 0 };
          path = [
            { x: fromEl.x + t.cx, y: fromEl.y + t.cy },
            { x: fromEl.x + t.cx, y: toEl.y },
            { x: toEl.x - 22, y: toEl.y }
          ];
        } else {
          const t = DOWN_TERMS[termUsage[fromId].down % DOWN_TERMS.length];
          termUsage[fromId].down++;
          fromTerm = t;
          toTerm = { cx: -22, cy: 0 };
          path = [
            { x: fromEl.x + t.cx, y: fromEl.y + t.cy },
            { x: fromEl.x + t.cx, y: toEl.y },
            { x: toEl.x - 22, y: toEl.y }
          ];
        }
        S.CN.push({
          id: uid(),
          fromElId: fromId,
          fromTerm,
          toElId: toId,
          toTerm,
          path,
          label: `${circLabel}-${si + 1}`,
          length: seg.lungime,
          color: "#ef4444",
          strokeWidth: 3,
          lineType: "solid",
          tipConductor: cond.tipConductor,
          sectiune: cond.sectiune,
          tipRetea: cond.tipRetea,
          circuitGroup: circLabel
        });
        totalCn++;
      });
    });
    render();
    updateStat();
    toast(`Import OK \u2014 ${totalStalpi} st\xE2lpi, ${totalCn} tronso\u0430\u043D\u0435 din "${postName}"`, "ok");
  }

  // src/sag-mt.js
  init_state();
  init_utils();
  init_renderer();

  // src/calc-catenary.js
  var CONDUCTORS = {
    "ACSR 35/6": { A: 41.55, d: 8.4, gc: 0.1475, E: 7600, alpha: 189e-7, RTS: 1240 },
    "ACSR 50/8": { A: 56.29, d: 9.6, gc: 0.199, E: 7428.2, alpha: 188e-7, RTS: 1681 },
    "ACSR 70/11": { A: 81.09, d: 11.4, gc: 0.2874, E: 7300, alpha: 19e-6, RTS: 2290 },
    "ACSR 95/16": { A: 111.9, d: 13.5, gc: 0.3921, E: 7300, alpha: 19e-6, RTS: 3080 },
    "ACSR 120/7": { A: 127.9, d: 15, gc: 0.456, E: 7600, alpha: 189e-7, RTS: 3660 },
    "ACSR 150/8": { A: 158.1, d: 16.6, gc: 0.568, E: 7600, alpha: 189e-7, RTS: 4300 }
  };
  var METEO_ZONES = {
    // zona: { V_b [m/s] fara chiciura, V_b_ice [m/s] cu chiciura, b_ch [mm], rho_ch [kg/m3] }
    "A.b.1": { Vb: 22, Vb_ice: 11, b_ch: 10, rho_ch: 600 },
    "B.b.2": { Vb: 26, Vb_ice: 14, b_ch: 15, rho_ch: 700 },
    "C.b.3": { Vb: 30, Vb_ice: 15, b_ch: 20, rho_ch: 700 },
    "D.b.4": { Vb: 37, Vb_ice: 17, b_ch: 27, rho_ch: 700 },
    "E.b.5": { Vb: 42, Vb_ice: 20, b_ch: 35, rho_ch: 700 }
  };
  var GAMMA_CH = 2.857;
  var GAMMA_V = 2.5;
  var TERRAIN_Z0 = { I: 0.01, II: 0.05, III: 0.3, IV: 1 };
  var TERRAIN_ZMIN = { I: 1, II: 4, III: 8, IV: 16 };
  var RHO_AIR = 1.25;
  function calcWindPressure(V_b, H, terrain = "II") {
    const z0 = TERRAIN_Z0[terrain] ?? 0.05;
    const zmin = TERRAIN_ZMIN[terrain] ?? 4;
    const z = Math.max(H, zmin);
    const kr = 0.19 * (z0 / 0.05) ** 0.07;
    const cr = kr * Math.log(z / z0);
    const Iv = kr / cr;
    const qb = 0.5 * RHO_AIR * V_b ** 2;
    const qp = (1 + 7 * Iv) * cr ** 2 * qb;
    return qp / 10;
  }
  function calcSpanFactor(Av) {
    const A = 0.719 * 60 ** 0.2;
    return Math.min(1, A * Av ** -0.2);
  }
  function calcLoads(cd, met) {
    const { d, gc } = cd;
    const { b_ch, rho_ch } = met;
    let Pw_max, Pw_ice;
    if (met.Pw_max !== void 0) {
      Pw_max = met.Pw_max;
      Pw_ice = met.Pw_ice;
    } else {
      Pw_max = calcWindPressure(met.Vb, met.H, met.terrain ?? "II");
      Pw_ice = calcWindPressure(met.Vb_ice, met.H, met.terrain ?? "II");
    }
    const GL = met.GL !== void 0 ? met.GL : calcSpanFactor(met.Av ?? 60);
    const d_bare = d / 1e3;
    const d_ice = (d + 2 * b_ch) / 1e3;
    const g1_c = gc;
    const g1_n = gc;
    const A_ice = Math.PI * b_ch * (d + b_ch);
    const g2_phys = rho_ch * A_ice * 981e-9;
    const g2_c = g2_phys;
    const g2_n = g2_c / GAMMA_CH;
    const g3_c = g1_c + g2_c;
    const g3_n = g1_n + g2_n;
    const g4_c = Pw_max * d_bare * GL;
    const g4_n = g4_c / GAMMA_V;
    const g5_c = Pw_ice * d_ice * GL * 1.1;
    const g5_n = g5_c / GAMMA_V;
    const g6_c = Math.hypot(g1_c, g4_c);
    const g6_n = Math.hypot(g1_n, g4_n);
    const g7_c = Math.hypot(g3_c, g5_c);
    const g7_n = Math.hypot(g3_n, g5_n);
    const Pw_av = Pw_ice / 4;
    const g8_c = Pw_av * d_ice * GL * 1.1;
    const g9_c = Math.hypot(g3_c, g8_c);
    return {
      Pw_max,
      Pw_ice,
      GL,
      normate: { g1: g1_n, g2: g2_n, g3: g3_n, g4: g4_n, g5: g5_n, g6: g6_n, g7: g7_n },
      calcul: {
        g1: g1_c,
        g2: g2_c,
        g3: g3_c,
        g4: g4_c,
        g5: g5_c,
        g6: g6_c,
        g7: g7_c,
        g8: g8_c,
        g9: g9_c
      }
    };
  }
  function solveStateEquation(q1, T1, theta1, q2, theta2, L, EA, alpha) {
    const K = T1 - q1 * q1 * L * L * EA / (24 * T1 * T1) - EA * alpha * (theta2 - theta1);
    const C = q2 * q2 * L * L * EA / 24;
    let T = Math.max(T1, Math.cbrt(C), 1);
    for (let i = 0; i < 40; i++) {
      const f = T * T * T - K * T * T - C;
      const fp = 3 * T * T - 2 * K * T;
      if (Math.abs(fp) < 1e-12) break;
      const dT = f / fp;
      T -= dT;
      if (Math.abs(dT) < 1e-8) break;
    }
    return Math.max(T, 0.01);
  }
  var TEMP_STATES = [
    { theta: -30, label: "-30\xB0C", qKey: "g1" },
    { theta: -20, label: "-20\xB0C", qKey: "g1" },
    { theta: -10, label: "-10\xB0C", qKey: "g1" },
    { theta: -5, label: "-5\xB0C", qKey: "g1" },
    { theta: 0, label: "0\xB0C", qKey: "g1" },
    { theta: 5, label: "+5\xB0C", qKey: "g1" },
    { theta: 10, label: "+10\xB0C", qKey: "g1" },
    { theta: 15, label: "+15\xB0C", qKey: "g1" },
    { theta: 20, label: "+20\xB0C", qKey: "g1" },
    { theta: 25, label: "+25\xB0C", qKey: "g1" },
    { theta: 30, label: "+30\xB0C", qKey: "g1" },
    { theta: 35, label: "+35\xB0C", qKey: "g1" },
    { theta: 40, label: "+40\xB0C", qKey: "g1" },
    // starea max săgeată gabarit
    { theta: -5, label: "-5+ch", qKey: "g3" },
    // conductor+chiciură
    { theta: -5, label: "-5+ch+v", qKey: "g7" },
    // dimensionantă
    { theta: 15, label: "+15+vmax", qKey: "g6" }
    // conductor+vânt max
  ];
  function calcTensionTable(cd, loads, L, dh, T0_dim) {
    const EA = cd.E * cd.A;
    const alpha = cd.alpha;
    const T_norm_ref = solveStateEquation(
      loads.calcul.g7,
      T0_dim,
      -5,
      loads.normate.g7,
      /* theta2 */
      -5,
      L,
      EA,
      alpha
    );
    return TEMP_STATES.map(({ theta, label, qKey }) => {
      const q_n = loads.normate[qKey] ?? loads.normate.g1;
      const q_c = loads.calcul[qKey] ?? loads.calcul.g1;
      const T_n = solveStateEquation(loads.normate.g7, T_norm_ref, -5, q_n, theta, L, EA, alpha);
      const T_c = solveStateEquation(loads.calcul.g7, T0_dim, -5, q_c, theta, L, EA, alpha);
      const sag_mid = q_n * L * L / (8 * T_n);
      const x_max = L / 2 - dh * T_n / (q_n * L);
      const sag_max = x_max > 0 && x_max < L ? q_n * x_max * (L - x_max) / (2 * T_n) : sag_mid;
      return {
        label,
        theta,
        q_norm: q_n,
        q_calc: q_c,
        T_norm: T_n,
        T_calc: T_c,
        sigma_norm: T_n / cd.A,
        sigma_calc: T_c / cd.A,
        sag_mid,
        sag_max
      };
    });
  }
  function findCriticalTemperature(cd, loads, L, dh, T0_dim) {
    const EA = cd.E * cd.A;
    const T_norm_ref = solveStateEquation(
      loads.calcul.g7,
      T0_dim,
      -5,
      loads.normate.g7,
      -5,
      L,
      EA,
      cd.alpha
    );
    const q_g1 = loads.normate.g1;
    const q_g3 = loads.normate.g3;
    const q_ref = loads.normate.g7;
    const T_ch = solveStateEquation(q_ref, T_norm_ref, -5, q_g3, -5, L, EA, cd.alpha);
    const sag_ch = q_g3 * L * L / (8 * T_ch);
    let lo = -40, hi = 100;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const T_m = solveStateEquation(q_ref, T_norm_ref, -5, q_g1, mid, L, EA, cd.alpha);
      const sag_m = q_g1 * L * L / (8 * T_m);
      if (sag_m < sag_ch) lo = mid;
      else hi = mid;
      if (hi - lo < 0.01) break;
    }
    return (lo + hi) / 2;
  }
  function findT0dim(cd, loads, L, {
    KP_dim = 0.47,
    KP_30 = 0.24,
    KP_15 = 0.155,
    f_creep = 0.95,
    dh = 0
  } = {}) {
    const EA = cd.E * cd.A;
    const adh = Math.abs(dh);
    function toHoriz(T_cl, q) {
      let Th = T_cl * 0.999;
      for (let i = 0; i < 25; i++) {
        const V = q * L / 2 + Th * adh / L;
        const disc = T_cl * T_cl - V * V;
        if (disc <= 0) return Math.max(T_cl * 0.95, 1);
        const Th_new = Math.sqrt(disc);
        if (Math.abs(Th_new - Th) < 1e-3) return Th_new;
        Th = 0.5 * (Th + Th_new);
      }
      return Th;
    }
    const T_cl_dim = KP_dim * cd.RTS * f_creep;
    const T0_direct = toHoriz(T_cl_dim, loads.calcul.g7);
    const T_cl_30 = KP_30 * cd.RTS * f_creep;
    const T_h_30 = toHoriz(T_cl_30, loads.normate.g1);
    const T0_from30 = solveStateEquation(
      loads.normate.g1,
      T_h_30,
      -30,
      loads.calcul.g7,
      -5,
      L,
      EA,
      cd.alpha
    );
    const T_cl_15 = KP_15 * cd.RTS * f_creep;
    const T_h_15 = toHoriz(T_cl_15, loads.normate.g1);
    const T0_from15 = solveStateEquation(
      loads.normate.g1,
      T_h_15,
      15,
      loads.calcul.g7,
      -5,
      L,
      EA,
      cd.alpha
    );
    return Math.min(T0_direct, T0_from30, T0_from15);
  }
  function calcGabarit(T40, q40, L, dh, y_left, y_right, terrain = []) {
    const N_pts = 200;
    let minGab = Infinity, x_min = L / 2, y_cond_min = 0, y_ter_min = 0;
    for (let i = 0; i <= N_pts; i++) {
      const x = i / N_pts * L;
      const y_chord = y_left + (y_right - y_left) * (x / L);
      const sag = q40 * x * (L - x) / (2 * T40);
      const y_c = y_chord - sag;
      let y_t = y_left - dh * (x / L) - (y_right - y_left) * (x / L);
      if (terrain.length >= 2) {
        const seg = terrain.findIndex((p) => p.x > x);
        if (seg > 0) {
          const p0 = terrain[seg - 1], p1 = terrain[seg];
          const t = (x - p0.x) / (p1.x - p0.x);
          y_t = p0.y + t * (p1.y - p0.y);
        } else if (seg === -1) {
          y_t = terrain[terrain.length - 1].y;
        } else {
          y_t = terrain[0].y;
        }
      } else {
        y_t = 0;
      }
      const gab = y_c - y_t;
      if (gab < minGab) {
        minGab = gab;
        x_min = x;
        y_cond_min = y_c;
        y_ter_min = y_t;
      }
    }
    return {
      gabarit: minGab,
      x_min,
      y_cond: y_cond_min,
      y_teren: y_ter_min,
      sag_at_x: q40 * x_min * (L - x_min) / (2 * T40)
    };
  }
  function calcSpan(conductor, meteo, span, KP_dim = null, T_max_horiz = null) {
    const cd = typeof conductor === "string" ? { ...CONDUCTORS[conductor] } : { ...conductor };
    if (!cd || !cd.A) throw new Error(`Conductor necunoscut: ${conductor}`);
    let met = { ...meteo };
    if (met.zone && METEO_ZONES[met.zone]) {
      Object.assign(met, METEO_ZONES[met.zone]);
    }
    const loads = calcLoads(cd, met);
    const { L, dh = 0, h_left = 9, h_right = 9, terrain_profile = [] } = span;
    let T0_dim;
    if (KP_dim !== null) {
      T0_dim = findT0dim(cd, loads, L, {
        KP_dim,
        dh,
        f_creep: 0.95,
        KP_30: 0.24,
        KP_15: 0.155
      });
    } else {
      T0_dim = findT0dim(cd, loads, L, { dh });
    }
    if (T_max_horiz !== null && T0_dim > T_max_horiz) {
      T0_dim = Math.max(T_max_horiz, 0.1);
    }
    const tension_table = calcTensionTable(cd, loads, L, dh, T0_dim);
    const T_crit = findCriticalTemperature(cd, loads, L, dh, T0_dim);
    const row40 = tension_table.find((r) => r.label === "+40\xB0C");
    const T40 = row40.T_norm;
    const sigma40 = T40 / cd.A;
    const sag40 = row40.sag_max;
    let gabaritResult = null;
    if (terrain_profile.length >= 2) {
      const y_left = terrain_profile[0].y + h_left;
      const y_right = terrain_profile[terrain_profile.length - 1].y + h_right;
      gabaritResult = calcGabarit(
        T40,
        loads.normate.g1,
        L,
        dh,
        y_left,
        y_right,
        terrain_profile
      );
    }
    return {
      loads,
      T0_dim,
      sigma0_dim: T0_dim / cd.A,
      KP_dim: T0_dim / cd.RTS,
      tension_table,
      T_crit,
      T40,
      sigma40,
      sag40,
      gabarit: gabaritResult
    };
  }

  // src/sag-mt.js
  init_pole_catalog();
  var SECTION_TO_ACSR = {
    35: "ACSR 35/6",
    50: "ACSR 50/8",
    70: "ACSR 70/11",
    95: "ACSR 95/16",
    120: "ACSR 120/7",
    150: "ACSR 150/8"
  };
  var _visible = false;
  var _zone = "D.b.4";
  var _H = 7;
  var _kpdim = null;
  var _avSpan = false;
  var L_IZ_MT = 0.79;
  var _twindOverrides = /* @__PURE__ */ new Map();
  var _kpdimOverrides = /* @__PURE__ */ new Map();
  var _sagMeasOverrides = /* @__PURE__ */ new Map();
  function getSagMeasOverrides() {
    return _sagMeasOverrides;
  }
  function spanKey(cns2) {
    const a = cns2[0].fromElId || "", b = cns2[0].toElId || "";
    return a && b ? a < b ? `${a}|${b}` : `${b}|${a}` : cns2[0].id || "";
  }
  function calcSag(L, g_vert, g_horiz, T0) {
    const fg = g_vert * L * L / (8 * T0);
    const delta = g_horiz * L * L / (8 * T0);
    const fr = Math.sqrt(fg * fg + delta * delta);
    const theta = Math.atan2(delta, fg) * (180 / Math.PI);
    return { fg, delta, fr, theta };
  }
  function computeSpan(sec, L, H_span, T_max_horiz) {
    const key = SECTION_TO_ACSR[sec] || "ACSR 70/11";
    const cd = CONDUCTORS[key];
    const met = { ...METEO_ZONES[_zone], H: H_span ?? _H, Av: Math.max(L, 40), terrain: "II" };
    const loads = calcLoads(cd, met);
    const opts = _kpdim !== null ? { dh: 0, KP_dim: _kpdim } : { dh: 0 };
    let T0 = findT0dim(cd, loads, L, opts);
    if (T_max_horiz != null && T_max_horiz < T0) T0 = T_max_horiz;
    const EA = cd.E * cd.A;
    const T_norm_ref = solveStateEquation(loads.calcul.g7, T0, -5, loads.normate.g7, -5, L, EA, cd.alpha);
    const T_wind = solveStateEquation(loads.normate.g7, T_norm_ref, -5, loads.normate.g6, 15, L, EA, cd.alpha);
    return { T0, T_wind, KP: T0 / cd.RTS, cd, loads };
  }
  function getMTConns() {
    const mtIds = new Set(S.EL.filter((e) => e.type.startsWith("stalp_mt_") || e.type === "separator_mt" || e.type === "bara_statie_mt").map((e) => e.id));
    return S.CN.filter(
      (cn) => cn.tipConductor === "OL-AL" || cn.fromElId && mtIds.has(cn.fromElId) || cn.toElId && mtIds.has(cn.toElId)
    );
  }
  function groupBySpan(cns) {
    const map = /* @__PURE__ */ new Map();
    cns.forEach((cn) => {
      const a = cn.fromElId || "", b = cn.toElId || "";
      const key = a && b ? a < b ? `${a}|${b}` : `${b}|${a}` : cn.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(cn);
    });
    return map;
  }
  function elLabel(id) {
    const e = S.EL.find((x) => x.id === id);
    return e ? e.label || e.type : "?";
  }
  function isTensionConsole(ck) {
    if (!ck) return false;
    const k = ck.toLowerCase();
    return k.startsWith("cit") || k.startsWith("cdi") || k.startsWith("cdci");
  }
  function getSpanPoleData(fromElId, toElId) {
    const elL = S.EL.find((x) => x.id === fromElId);
    const elR = S.EL.find((x) => x.id === toElId);
    const pL = getPoleData(elL);
    const pR = getPoleData(elR);
    const HL = pL.H ?? _H;
    const HR = pR.H ?? _H;
    let T_max = null;
    if (pL.T_max !== null && pR.T_max !== null) T_max = Math.min(pL.T_max, pR.T_max);
    else if (pL.T_max !== null) T_max = pL.T_max;
    else if (pR.T_max !== null) T_max = pR.T_max;
    const cotaL = elL?.cota_teren;
    const cotaR = elR?.cota_teren;
    const dh = cotaL != null && cotaR != null ? cotaR + HR - (cotaL + HL) : 0;
    const hasDh = cotaL != null && cotaR != null;
    const ckL = elL?.console_type ?? null;
    const ckR = elR?.console_type ?? null;
    const hasSwing = !isTensionConsole(ckL) || !isTensionConsole(ckR);
    const gL = pL.G_max, gR = pR.G_max, vL = pL.V_max, vR = pR.V_max;
    const G_max = gL != null && gR != null ? Math.min(gL, gR) : gL ?? gR ?? null;
    const V_max = vL != null && vR != null ? Math.min(vL, vR) : vL ?? vR ?? null;
    return {
      H: (HL + HR) / 2,
      HL,
      HR,
      T_max,
      G_max,
      V_max,
      dh,
      hasDh,
      cotaL,
      cotaR,
      hasSwing,
      consoleL: pL.consoleDesc,
      consoleR: pR.consoleDesc
    };
  }
  function openSagMT() {
    const p = document.getElementById("sag-mt-panel");
    if (p) {
      p.style.display = "flex";
      runSagMT();
    }
  }
  function closeSagMT() {
    const p = document.getElementById("sag-mt-panel");
    if (p) p.style.display = "none";
  }
  function runSagMT() {
    _zone = document.getElementById("sag-zone")?.value || "D.b.4";
    _H = parseFloat(document.getElementById("sag-h")?.value) || 7;
    _kpdim = parseFloat(document.getElementById("sag-kpdim")?.value) || null;
    _avSpan = document.getElementById("sag-av-span")?.checked ?? false;
    const body = document.getElementById("sag-body");
    if (!body) return;
    const cns = getMTConns();
    if (cns.length === 0) {
      body.innerHTML = `<div style="color:var(--text3);font-size:9px;padding:14px;text-align:center">
      Nu exist\u0103 conexiuni MT pe schem\u0103.<br>
      Deseneaz\u0103 conexiuni cu <b>Tip conductor = OL-AL</b> \xEEntre st\xE2lpi MT.</div>`;
      if (_visible) renderSagLayer();
      return;
    }
    const th = (s) => `<th style="padding:4px 6px;border:1px solid var(--border2);font-size:8px;white-space:nowrap;background:var(--bg3);color:var(--text2);text-align:center">${s}</th>`;
    const tdr = (s, extra = "") => `<td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:right;font-family:'JetBrains Mono',monospace${extra}">${s}</td>`;
    const tdc = (s, extra = "") => `<td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:center${extra}">${s}</td>`;
    const spanMap = groupBySpan(cns);
    let rows = "";
    spanMap.forEach((cns2) => {
      const L = parseFloat(cns2[0].length) || 0;
      const sec = parseFloat(cns2[0].sectiune) || 70;
      const key = spanKey(cns2);
      const acsr_key = SECTION_TO_ACSR[sec] || "ACSR 70/11";
      const cd = CONDUCTORS[acsr_key];
      const spanPole = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);
      const span_kpdim = _kpdimOverrides.get(key) ?? _kpdim;
      let T0, KP, sag40, T_crit, delta, fg, T_wind_calc, gabarit, f40_real, gabarit_real, res;
      let G_actual = null, V_actual = null;
      try {
        const terrainProfile = spanPole.cotaL != null && spanPole.cotaR != null ? [{ x: 0, y: spanPole.cotaL }, { x: L, y: spanPole.cotaR }] : [];
        const H_wind = Math.max(spanPole.HL, spanPole.HR);
        const Av = _avSpan ? L : Math.max(L, 40);
        res = calcSpan(
          acsr_key,
          { zone: _zone, H: H_wind, Av, terrain: "II" },
          {
            L,
            dh: spanPole.dh,
            h_left: spanPole.HL,
            h_right: spanPole.HR,
            terrain_profile: terrainProfile
          },
          span_kpdim,
          spanPole.T_max
        );
        T0 = res.T0_dim;
        KP = res.KP_dim * 100;
        sag40 = res.sag40;
        T_crit = res.T_crit;
        gabarit = res.gabarit?.gabarit ?? null;
        const row_wind = res.tension_table?.find((r) => r.label === "+15+vmax");
        T_wind_calc = row_wind?.T_norm ?? T0;
        const T_wind_used = _twindOverrides.get(key) ?? T_wind_calc;
        const g4n = res.loads.normate.g4;
        const g6n = res.loads.normate.g6;
        delta = g4n * L * L / (8 * T_wind_used) + (spanPole.hasSwing ? L_IZ_MT * (g4n / g6n) : 0);
        fg = res.loads.normate.g1 * L * L / (8 * T0);
        G_actual = res.loads.normate.g3 * L;
        V_actual = res.loads.normate.g4 * L;
      } catch (e) {
        rows += `<tr><td colspan="15" style="color:#ef4444;padding:4px;font-size:8px">${acsr_key} \u2014 eroare calcul: ${e.message}</td></tr>`;
        return;
      }
      const sfm = _sagMeasOverrides.get(key);
      if (sfm?.f_meas > 0) {
        try {
          const EA_sfm = cd.E * cd.A;
          const g1 = res.loads.normate.g1;
          const f_sag = spanPole.H - sfm.f_meas;
          if (f_sag > 0.1) {
            const T_h_f = g1 * L * L / (8 * f_sag);
            const T_40r = solveStateEquation(g1, T_h_f, sfm.T_meas, g1, 40, L, EA_sfm, cd.alpha);
            f40_real = g1 * L * L / (8 * T_40r);
            gabarit_real = spanPole.H - f40_real;
          }
        } catch (_e) {
        }
      }
      const fromLbl = elLabel(cns2[0].fromElId);
      const toLbl = elLabel(cns2[0].toElId);
      const warnD = delta > 1.5;
      const fazeLbl = cns2.map((cn) => cn.faza || "?").sort().join("/");
      const KPcol = KP > 45 ? ";color:#ef4444;font-weight:bold" : KP > 35 ? ";color:#ff9f43" : ";color:#22c55e";
      const isOvr = _twindOverrides.has(key);
      const T_wind_disp = isOvr ? _twindOverrides.get(key) : T_wind_calc;
      const twindCell = `<td style="padding:2px 4px;border:1px solid var(--border2);text-align:center">
      <input type="number" class="twind-inp" data-key="${key}"
             placeholder="${T_wind_calc.toFixed(1)}"
             value="${isOvr ? T_wind_disp.toFixed(1) : ""}"
             min="0.1" max="9999" step="0.1"
             title="T_wind calculat: ${T_wind_calc.toFixed(1)} daN. Introdu valoarea din breviar CALMECO pt. a suprascrie."
             style="width:52px;border:1px solid ${isOvr ? "#ff9f43" : "var(--border)"};
                    background:${isOvr ? "rgba(255,159,67,0.15)" : "var(--bg2)"};
                    color:${isOvr ? "#ff9f43" : "var(--text2)"};
                    font-size:8px;padding:2px 3px;border-radius:3px;
                    font-family:'JetBrains Mono',monospace">
    </td>`;
      const tMaxActive = spanPole.T_max !== null && T0 >= spanPole.T_max * 0.99;
      const dhStr = spanPole.hasDh && Math.abs(spanPole.dh) > 0.05 ? ` | \u0394h=${spanPole.dh > 0 ? "+" : ""}${spanPole.dh.toFixed(1)}m` : "";
      const hInfo = `H=${spanPole.H.toFixed(1)}m (${spanPole.HL.toFixed(1)}+${spanPole.HR.toFixed(1)})${dhStr}`;
      const tMaxInfo = spanPole.T_max !== null ? ` | T_max=${spanPole.T_max}daN${tMaxActive ? " \u2190 ACTIV" : ""}` : "";
      const isKpOvr = _kpdimOverrides.has(key);
      const kpOvrDec = _kpdimOverrides.get(key);
      const globalKpPct = ((_kpdim ?? 0.23) * 100).toFixed(0);
      const kpdimCell = `<td style="padding:2px 4px;border:1px solid var(--border2);text-align:center">
      <input type="number" class="kpdim-inp" data-key="${key}"
             placeholder="${globalKpPct}"
             value="${isKpOvr ? (kpOvrDec * 100).toFixed(0) : ""}"
             min="5" max="100" step="1"
             title="KP_dim global: ${globalKpPct}%. Introdu % pt. override per-deschidere (ex: 47 pt. SR EN 50341-2-24 sau 23 pt. NTE 003). KP rezultat = ${KP.toFixed(1)}%."
             style="width:38px;border:1px solid ${isKpOvr ? "#ff9f43" : "var(--border)"};
                    background:${isKpOvr ? "rgba(255,159,67,0.15)" : "var(--bg2)"};
                    color:${isKpOvr ? "#ff9f43" : "var(--text2)"};
                    font-size:8px;padding:2px 3px;border-radius:3px;
                    font-family:'JetBrains Mono',monospace">
    </td>`;
      const hasSfm = (sfm?.f_meas ?? 0) > 0;
      const sfmInpStyle = (active) => `border:1px solid ${active ? "#f59e0b" : "var(--border)"};background:${active ? "rgba(245,158,11,0.15)" : "var(--bg2)"};color:${active ? "#f59e0b" : "var(--text2)"};font-size:7.5px;padding:2px;border-radius:3px;font-family:'JetBrains Mono',monospace`;
      const terenCell = `<td style="padding:2px 3px;border:1px solid var(--border2);text-align:center;white-space:nowrap">
      <input type="number" class="fmeas-inp" data-key="${key}"
             placeholder="gab[m]" value="${hasSfm ? sfm.f_meas.toFixed(2) : ""}"
             min="0.01" max="30" step="0.01"
             title="Gabarit m\u0103surat \xEEn teren [m] \u2014 \xEEn\u0103l\u021Bimea conductorului fa\u021B\u0103 de sol. Ex: 7.0. Se converte\u0219te intern la s\u0103geat\u0103: f_sag = H_prindere \u2212 gabarit. Introdu \u0219i temperatura \u2192 f\u2084\u2080 real prin Lam\xE9."
             style="width:44px;${sfmInpStyle(hasSfm)}">
      <input type="number" class="tmeas-inp" data-key="${key}"
             placeholder="T\xB0C" value="${hasSfm ? sfm.T_meas.toFixed(0) : ""}"
             min="-40" max="50" step="1"
             title="Temperatura la care ai m\u0103surat gabaritul [\xB0C]"
             style="width:34px;${sfmInpStyle(hasSfm)}">
    </td>`;
      const f40rCell = f40_real != null ? `<td style="padding:3px 4px;border:1px solid var(--border2);font-size:8.5px;text-align:right;
                   font-family:'JetBrains Mono',monospace;color:#f59e0b;font-weight:bold"
             title="f\u2084\u2080 calculat din sageat\u0103 m\u0103surat\u0103 + Lam\xE9. Gabarit midspan (simplificat).">
           ${f40_real.toFixed(2)} m<br><span style="font-size:7px;color:${gabarit_real < 7 ? "#ef4444" : "#22c55e"}"
             title="Gabarit real la midspan">${gabarit_real.toFixed(2)} m gab.</span></td>` : `<td style="padding:3px 6px;border:1px solid var(--border2);font-size:8px;text-align:center;color:var(--text3)">\u2014</td>`;
      const g3n = res.loads.normate.g3;
      const g4n_cons = res.loads.normate.g4;
      const L_max_G = spanPole.G_max && g3n > 0 ? spanPole.G_max / g3n : null;
      const L_max_V = spanPole.V_max && g4n_cons > 0 ? spanPole.V_max / g4n_cons : null;
      const L_max_cons = L_max_G != null && L_max_V != null ? Math.min(L_max_G, L_max_V) : L_max_G ?? L_max_V ?? null;
      const G_pct = spanPole.G_max && G_actual ? G_actual / spanPole.G_max * 100 : null;
      const V_pct = spanPole.V_max && V_actual ? V_actual / spanPole.V_max * 100 : null;
      const T_pct = spanPole.T_max && T0 ? T0 / spanPole.T_max * 100 : null;
      const maxPct = Math.max(G_pct ?? 0, V_pct ?? 0, T_pct ?? 0);
      const pvtColor = (pct2) => pct2 == null ? "var(--text3)" : pct2 > 100 ? "#ef4444" : pct2 > 80 ? "#ff9f43" : "#22c55e";
      const pvtBold = (pct2) => pct2 != null && pct2 > 80 ? "font-weight:bold;" : "";
      const lmStr = (lm) => lm != null ? ` (L_max=${lm.toFixed(0)}m)` : "";
      const pvtStr = (lbl, pct2, maxV, lm) => pct2 != null ? `<span style="color:${pvtColor(pct2)};${pvtBold(pct2)}">${lbl}:${pct2.toFixed(0)}%${pct2 > 100 ? ` \u26A0 max=${maxV}daN` : ""}</span>` + (pct2 > 100 && lm != null ? `<br><span style="color:#ef4444;font-size:7px;font-weight:bold"> \u2192 reduce L&lt;${lm.toFixed(0)}m</span>` : `<span style="color:var(--text3);font-size:7px"> /${maxV}daN</span>`) : `<span style="color:var(--text3)">${lbl}:\u2014</span>`;
      const pvtTitle = `Verificare consol\u0103 ST34-MT:
G=${G_actual?.toFixed(1) ?? "?"} daN / G_max=${spanPole.G_max ?? "?"} daN${lmStr(L_max_G)} \u2014 vertical (cond+ch)
V=${V_actual?.toFixed(1) ?? "?"} daN / V_max=${spanPole.V_max ?? "?"} daN${lmStr(L_max_V)} \u2014 transversal (v\xE2nt)
T=${T0?.toFixed(0) ?? "?"} daN / T_max=${spanPole.T_max ?? "?"} daN \u2014 axial (trac\u021Biune dim.)
` + (L_max_cons != null ? `
Deschidere max. admis\u0103 de consol\u0103: ${L_max_cons.toFixed(0)} m` : "") + (G_pct == null && V_pct == null ? "\nSeteaz\u0103 tipul de consol\u0103 \xEEn propriet\u0103\u021Bile st\xE2lpului." : "");
      const pvtBgColor = maxPct > 100 ? "rgba(239,68,68,0.08)" : maxPct > 80 ? "rgba(255,159,67,0.08)" : "transparent";
      const hasGVT = G_pct != null || V_pct != null || T_pct != null;
      const consoleCell = `<td style="padding:3px 5px;border:1px solid var(--border2);font-size:7.5px;
                              text-align:left;white-space:nowrap;background:${pvtBgColor}"
                             title="${pvtTitle}">
      ${hasGVT ? pvtStr("G", G_pct, spanPole.G_max, L_max_G) + "<br>" + pvtStr("V", V_pct, spanPole.V_max, L_max_V) + "<br>" + pvtStr("T", T_pct, spanPole.T_max, null) + (L_max_cons != null ? `<br><span style="color:var(--text3);font-size:7px">L_max=${L_max_cons.toFixed(0)}m</span>` : "") : `<span style="color:var(--text3);font-size:7px">consol\u0103<br>nesetat\u0103</span>`}
    </td>`;
      rows += `<tr>
      ${tdc(`${fromLbl} \u2192 ${toLbl}`, ";font-size:7.5px;color:var(--text2)")}
      ${tdc(fazeLbl)}
      ${tdr(`${L.toFixed(0)} m`)}
      ${tdr(acsr_key, ";font-size:8px;color:var(--text2)")}
      <td style="padding:3px 6px;border:1px solid var(--border2);font-size:8.5px;text-align:right;font-family:'JetBrains Mono',monospace${KPcol}" title="${hInfo}${tMaxInfo}">${T0.toFixed(0)} daN${KP > 45 ? " \u26A0" : ""}${tMaxActive ? " \u2B07" : ""}</td>
      ${kpdimCell}
      <td style="padding:3px 6px;border:1px solid var(--border2);font-size:8px;text-align:right;font-family:'JetBrains Mono',monospace;color:var(--text3)" title="${hInfo}${tMaxInfo}">${spanPole.H.toFixed(1)} m${spanPole.hasDh && Math.abs(spanPole.dh) > 0.05 ? `<br><span style="font-size:7px;color:#64748b">\u0394h${spanPole.dh > 0 ? "+" : ""}${spanPole.dh.toFixed(1)}m</span>` : ""}</td>
      ${twindCell}
      ${tdr(`${sag40.toFixed(2)} m`, ";color:var(--accent)")}
      ${tdr(`${delta.toFixed(2)} m${warnD ? " \u26A0" : ""}`, warnD ? ";color:#ef4444;font-weight:bold" : ";color:#22c55e;font-weight:bold")}
      ${tdr(`${T_crit.toFixed(1)}\xB0C`, ";color:var(--text2)")}
      ${gabarit != null ? tdr(
        `${gabarit.toFixed(2)} m${gabarit < 7 ? " \u26A0" : ""}`,
        gabarit < 7 ? ";color:#ef4444;font-weight:bold" : ";color:#22c55e;font-weight:bold"
      ) : tdc("\u2014", ";color:var(--text3);font-size:8px")}
      ${terenCell}
      ${f40rCell}
      ${consoleCell}
    </tr>`;
    });
    const metZ = METEO_ZONES[_zone] || {};
    body.innerHTML = `
    <table style="border-collapse:collapse;width:100%">
      <thead><tr>
        ${th("Tronson")}${th("Faze")}${th("L")}${th("Conductor")}
        ${th("T\u2080 [daN]")}${th("KP_dim [%]")}
        ${th("H [m]")}
        ${th("T_wind [daN]")}
        ${th("f_max 40\xB0C [m]")}${th("\u03B4 v\xE2nt max [m]")}${th("T_crit [\xB0C]")}${th("Gabarit [m]")}
        ${th("gab.teren/T\xB0C")}${th("f\u2084\u2080 real [m]")}${th("Consol\u0103 G/V/T")}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="font-size:7.5px;color:var(--text3);padding:5px 4px;border-top:1px solid var(--border)">
      ${!_kpdim ? "Auto \u2014 EDS SR EN 50341-2-24 (CALMECO)" : _kpdim === 0.23 ? "NTE legacy \u2014 KP=23% (multi-span)" : `SR EN 50341-2-24 \u2014 KP=${(_kpdim * 100).toFixed(0)}%`} | Zon\u0103 ${_zone}: Vb=${metZ.Vb ?? "?"}m/s \xB7 ch=${metZ.b_ch ?? "?"}mm \xB7 \u03C1=${metZ.rho_ch ?? "?"}kg/m\xB3 | H=${_H}m &nbsp;|&nbsp;
      T\u2080=min(KP_dim\xB7RTS, EDS, T_max_stalp) &nbsp;|&nbsp; H_v\xE2nt=max(H_stg,H_dr) &nbsp;|&nbsp; Av=${_avSpan ? "L (CALMECO)" : "max(L,40) (NTE)"} &nbsp;|&nbsp; f_max=40\xB0C &nbsp;|&nbsp; \u03B4=catenary(+15+vmax)+lan\u021B(${L_IZ_MT}m, doar sus\u021Binere) &nbsp;|&nbsp;
      <span style="color:#ff9f43">T_wind: placeholder=calculat, portocaliu=breviar CALMECO</span> &nbsp;|&nbsp;
      <span style="color:#a855f7">H implicit (pentru st\xE2lpi f\u0103r\u0103 catalog): ${_H}m</span> &nbsp;|&nbsp;
      <span style="color:#22c55e">Gabarit \u22657m \u2713 (NTE 003 art.137) \u2014 apare numai c\xE2nd cotele de teren sunt introduse</span> &nbsp;|&nbsp;
      <span style="color:#f59e0b">gab.teren: introdu gabaritul m\u0103surat [m] (\xEEn\u0103l\u021Bimea conductorului fa\u021B\u0103 de sol) + temperatura [\xB0C] \u2192 f\u2084\u2080 real prin Lam\xE9 (verificare linie existent\u0103)</span> &nbsp;|&nbsp;
      <span style="color:#22c55e">Consol\u0103 G/V/T (ST34-MT): G=greutate\xB7L (normate g3), V=v\xE2nt\xB7L (normate g4), T=T\u2080_dim \u2014 verde \u226480%, portocaliu 80\u2013100%, ro\u0219u &gt;100%</span>
    </div>`;
    body.querySelectorAll("input.twind-inp").forEach((inp) => {
      inp.addEventListener("change", () => {
        const k = inp.dataset.key;
        const val = parseFloat(inp.value);
        if (val > 0 && isFinite(val)) {
          _twindOverrides.set(k, val);
        } else {
          _twindOverrides.delete(k);
        }
        runSagMT();
      });
    });
    body.querySelectorAll("input.kpdim-inp").forEach((inp) => {
      inp.addEventListener("change", () => {
        const k = inp.dataset.key;
        const pct2 = parseFloat(inp.value);
        if (pct2 >= 5 && pct2 <= 100 && isFinite(pct2)) {
          _kpdimOverrides.set(k, pct2 / 100);
        } else {
          _kpdimOverrides.delete(k);
        }
        runSagMT();
      });
    });
    body.querySelectorAll("input.fmeas-inp, input.tmeas-inp").forEach((inp) => {
      inp.addEventListener("change", () => {
        const k = inp.dataset.key;
        const fInp = body.querySelector(`input.fmeas-inp[data-key="${k}"]`);
        const tInp = body.querySelector(`input.tmeas-inp[data-key="${k}"]`);
        const fVal = parseFloat(fInp?.value);
        const tVal = parseFloat(tInp?.value);
        if (fVal > 0 && isFinite(fVal)) {
          _sagMeasOverrides.set(k, { f_meas: fVal, T_meas: isFinite(tVal) ? tVal : 20 });
        } else {
          _sagMeasOverrides.delete(k);
        }
        runSagMT();
      });
    });
    if (_visible) renderSagLayer();
  }
  function copySagMT() {
    const tbl = document.querySelector("#sag-body table");
    if (!tbl) {
      toast("Nu exist\u0103 date de copiat", "ac");
      return;
    }
    const lines = [...tbl.querySelectorAll("tr")].map((tr) => [...tr.querySelectorAll("th,td")].map((c) => c.textContent.trim()).join("	"));
    navigator.clipboard.writeText(lines.join("\n")).then(() => toast("Tabel copiat \xEEn clipboard", "ok"));
  }
  function exportSagCalcDetails() {
    _zone = document.getElementById("sag-zone")?.value || "D.b.4";
    _H = parseFloat(document.getElementById("sag-h")?.value) || 7;
    _kpdim = parseFloat(document.getElementById("sag-kpdim")?.value) || null;
    const cns = getMTConns();
    if (cns.length === 0) {
      toast("Nu exist\u0103 conexiuni MT pe schem\u0103", "ac");
      return;
    }
    const spanMap = groupBySpan(cns);
    const KP_dim_val = _kpdim !== null ? _kpdim : 0.47;
    const KP_30 = 0.24;
    const KP_15 = 0.155;
    const f_creep = 0.95;
    const metZ = METEO_ZONES[_zone] || {};
    const lines = [];
    lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
    lines.push("  CALCUL PAS CU PAS \u2014 S\u0102GEAT\u0102 + DEVIA\u021AIE MT \u2014 LEA 20kV");
    lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
    lines.push(`  Zon\u0103: ${_zone} | Vb=${metZ.Vb}m/s | ch=${metZ.b_ch}mm | \u03C1_ch=${metZ.rho_ch}kg/m\xB3`);
    lines.push(`  H teren: ${_H}m | KP_dim: ${(KP_dim_val * 100).toFixed(0)}% (${KP_dim_val >= 0.46 ? "SR EN 50341-2-24:2019" : "NTE 003/2015"})`);
    lines.push(`  EDS: KP_30=${(KP_30 * 100).toFixed(0)}% la -30\xB0C | KP_15=${(KP_15 * 100).toFixed(0)}% la +15\xB0C | f_creep=${f_creep}`);
    lines.push(`  Lan\u021B izolatoare MT 20kV (LDI-20-II-CTS 40): L_iz = ${L_IZ_MT} m`);
    lines.push("");
    let idx = 0;
    spanMap.forEach((cns2) => {
      idx++;
      const L = parseFloat(cns2[0].length) || 0;
      const sec = parseFloat(cns2[0].sectiune) || 70;
      const key = spanKey(cns2);
      const acsr_key = SECTION_TO_ACSR[sec] || "ACSR 70/11";
      const fromLbl = elLabel(cns2[0].fromElId);
      const toLbl = elLabel(cns2[0].toElId);
      const fazeLbl = cns2.map((cn) => cn.faza || "?").sort().join("/");
      const Av = _avSpan ? L : Math.max(L, 40);
      const spanPoleExp = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);
      const H_wind_exp = Math.max(spanPoleExp.HL, spanPoleExp.HR);
      lines.push("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
      lines.push(`  TRONSON ${idx}: ${fromLbl} \u2192 ${toLbl}   (Faze: ${fazeLbl})`);
      lines.push(`  Conductor: ${acsr_key}   L = ${L.toFixed(1)} m   Av = ${_avSpan ? "L" : "max(L,40)"} = ${Av.toFixed(1)} m`);
      const _cslL = spanPoleExp.consoleL ? ` [${spanPoleExp.consoleL}]` : "";
      const _cslR = spanPoleExp.consoleR ? ` [${spanPoleExp.consoleR}]` : "";
      lines.push(`  St\xE2lp stg. H=${spanPoleExp.HL.toFixed(1)}m${_cslL} | St\xE2lp dr. H=${spanPoleExp.HR.toFixed(1)}m${_cslR}`);
      lines.push(`  H_v\xE2nt = max(${spanPoleExp.HL.toFixed(1)},${spanPoleExp.HR.toFixed(1)}) = ${H_wind_exp.toFixed(1)}m${spanPoleExp.T_max !== null ? " | T_max=" + spanPoleExp.T_max + " daN" : ""}`);
      if (spanPoleExp.hasDh) {
        lines.push(`  dh = ${spanPoleExp.dh > 0 ? "+" : ""}${spanPoleExp.dh.toFixed(2)} m  (din cota_teren st\xE2lpi \u2014 diferen\u021B\u0103 nivel prindere)`);
      }
      const span_kpdim_exp = _kpdimOverrides.get(key) ?? _kpdim;
      if (_kpdimOverrides.has(key)) {
        lines.push(`  KP_dim: ${(_kpdimOverrides.get(key) * 100).toFixed(0)}% (OVERRIDE per deschidere; global=${_kpdim ? (_kpdim * 100).toFixed(0) + "%" : "auto"})`);
      }
      lines.push("");
      let res;
      try {
        res = calcSpan(
          acsr_key,
          { zone: _zone, H: H_wind_exp, Av, terrain: "II" },
          { L, dh: spanPoleExp.dh, h_left: spanPoleExp.HL, h_right: spanPoleExp.HR },
          span_kpdim_exp,
          spanPoleExp.T_max
        );
      } catch (e) {
        lines.push(`  *** EROARE CALCUL: ${e.message} ***`);
        lines.push("");
        return;
      }
      const { loads, T0_dim, tension_table } = res;
      const cd = CONDUCTORS[acsr_key];
      const EA = cd.E * cd.A;
      const b_ch = metZ.b_ch || 0;
      lines.push("  [1] \xCENC\u0102RC\u0102RI UNITARE [daN/m]");
      lines.push(`      Pw_max = ${loads.Pw_max.toFixed(4)} daN/m\xB2  (Eurocode EN 1991-1-4, H=${spanPoleExp.H.toFixed(2)}m, teren II, Vb=${metZ.Vb}m/s)`);
      lines.push(`      GL     = ${loads.GL.toFixed(5)}  (factor deschidere: 1.631\xD7Av^-0.2, Av=${Av.toFixed(1)}m)`);
      lines.push(`      d_bare = ${cd.d}mm = ${(cd.d / 1e3).toFixed(4)}m`);
      lines.push(`      d_ice  = ${cd.d}+2\xD7${b_ch} = ${cd.d + 2 * b_ch}mm = ${((cd.d + 2 * b_ch) / 1e3).toFixed(4)}m`);
      lines.push("      NORMATE (limita caracteristic\u0103 / sarcini fizice):");
      lines.push(`        g1_n = gc = ${loads.normate.g1.toFixed(4)} daN/m`);
      lines.push(`        g2_n = g2_phys/2.857 = ${loads.normate.g2.toFixed(4)} daN/m  [chiciur\u0103 ${b_ch}mm]`);
      lines.push(`        g3_n = g1_n+g2_n = ${loads.normate.g3.toFixed(4)} daN/m  [cond.+chiciur\u0103]`);
      lines.push(`        g4_n = Pw_max\xD7d_bare\xD7GL/2.5 = ${loads.normate.g4.toFixed(4)} daN/m  [v\xE2nt max \u2194]`);
      lines.push(`        g5_n = Pw_ice\xD7d_ice\xD7GL\xD71.1/2.5 = ${loads.normate.g5.toFixed(4)} daN/m  [v\xE2nt+chiciur\u0103 \u2194]`);
      lines.push(`        g6_n = \u221A(g1_n\xB2+g4_n\xB2) = \u221A(${loads.normate.g1.toFixed(4)}\xB2+${loads.normate.g4.toFixed(4)}\xB2) = ${loads.normate.g6.toFixed(4)} daN/m`);
      lines.push(`        g7_n = \u221A(g3_n\xB2+g5_n\xB2) = \u221A(${loads.normate.g3.toFixed(4)}\xB2+${loads.normate.g5.toFixed(4)}\xB2) = ${loads.normate.g7.toFixed(4)} daN/m  [stare dim. normate]`);
      lines.push("      CALCUL (pentru verificare structuri):");
      lines.push(`        g4_c = Pw_max\xD7d_bare\xD7GL = ${loads.calcul.g4.toFixed(4)} daN/m  [= g4_n\xD72.5]`);
      lines.push(`        g7_c = \u221A(g3_c\xB2+g5_c\xB2) = ${loads.calcul.g7.toFixed(4)} daN/m  [stare dim. calcul]`);
      lines.push("");
      const T_cl_dim = KP_dim_val * cd.RTS * f_creep;
      const V_dim = loads.calcul.g7 * L / 2;
      const disc_dim = T_cl_dim * T_cl_dim - V_dim * V_dim;
      const T0_direct = disc_dim > 0 ? Math.sqrt(disc_dim) : T_cl_dim * 0.95;
      const T_cl_30 = KP_30 * cd.RTS * f_creep;
      const V_30 = loads.normate.g1 * L / 2;
      const disc_30 = T_cl_30 * T_cl_30 - V_30 * V_30;
      const T_h_30 = disc_30 > 0 ? Math.sqrt(disc_30) : T_cl_30 * 0.95;
      const T0_from30 = solveStateEquation(
        loads.normate.g1,
        T_h_30,
        -30,
        loads.calcul.g7,
        -5,
        L,
        EA,
        cd.alpha
      );
      const T_cl_15 = KP_15 * cd.RTS * f_creep;
      const V_15 = loads.normate.g1 * L / 2;
      const disc_15 = T_cl_15 * T_cl_15 - V_15 * V_15;
      const T_h_15 = disc_15 > 0 ? Math.sqrt(disc_15) : T_cl_15 * 0.95;
      const T0_from15 = solveStateEquation(
        loads.normate.g1,
        T_h_15,
        15,
        loads.calcul.g7,
        -5,
        L,
        EA,
        cd.alpha
      );
      const minT0 = Math.min(T0_direct, T0_from30, T0_from15);
      const gov = Math.abs(T0_dim - T0_direct) < 0.1 ? "KP_dim" : Math.abs(T0_dim - T0_from30) < 0.1 ? "EDS -30\xB0C" : "EDS +15\xB0C";
      lines.push("  [2] TRAC\u021AIUNEA DIMENSIONANT\u0102 T\u2080  (starea -5\xB0C+ch+v, calcul)");
      lines.push(`      RTS=${cd.RTS} daN | A=${cd.A} mm\xB2 | E=${cd.E} daN/mm\xB2 | \u03B1=${(cd.alpha * 1e6).toFixed(1)}e-6/\xB0C | EA=${EA.toFixed(0)} daN`);
      lines.push("");
      lines.push(`      a) Limita KP_dim=${(KP_dim_val * 100).toFixed(0)}%  (starea -5\xB0C+ch+v calcul):`);
      lines.push(`         T_clema = KP_dim\xD7RTS\xD7f_creep = ${KP_dim_val}\xD7${cd.RTS}\xD7${f_creep} = ${T_cl_dim.toFixed(3)} daN`);
      lines.push(`         V = g7_c\xD7L/2 = ${loads.calcul.g7.toFixed(4)}\xD7${(L / 2).toFixed(2)} = ${V_dim.toFixed(4)} daN`);
      lines.push(`         T0_direct = \u221A(T_cl\xB2\u2212V\xB2) = \u221A(${T_cl_dim.toFixed(3)}\xB2\u2212${V_dim.toFixed(4)}\xB2) = ${T0_direct.toFixed(3)} daN`);
      lines.push("");
      lines.push(`      b) EDS la -30\xB0C  (conductor gol, KP_30=${(KP_30 * 100).toFixed(0)}%):`);
      lines.push(`         T_cl_30 = ${KP_30}\xD7${cd.RTS}\xD7${f_creep} = ${T_cl_30.toFixed(3)} daN`);
      lines.push(`         V = g1_n\xD7L/2 = ${loads.normate.g1.toFixed(4)}\xD7${(L / 2).toFixed(2)} = ${V_30.toFixed(4)} daN`);
      lines.push(`         T_h_30 = \u221A(T_cl_30\xB2\u2212V\xB2) = ${T_h_30.toFixed(3)} daN`);
      lines.push(`         Lam\xE9: (-30\xB0C, q=g1_n=${loads.normate.g1.toFixed(4)}) \u2192 (-5\xB0C, q=g7_c=${loads.calcul.g7.toFixed(4)}), L=${L}m`);
      lines.push(`         T0_from30 = ${T0_from30.toFixed(3)} daN`);
      lines.push("");
      lines.push(`      c) EDS la +15\xB0C  (conductor gol, KP_15=${(KP_15 * 100).toFixed(0)}%):`);
      lines.push(`         T_cl_15 = ${KP_15}\xD7${cd.RTS}\xD7${f_creep} = ${T_cl_15.toFixed(3)} daN`);
      lines.push(`         V = g1_n\xD7L/2 = ${loads.normate.g1.toFixed(4)}\xD7${(L / 2).toFixed(2)} = ${V_15.toFixed(4)} daN`);
      lines.push(`         T_h_15 = \u221A(T_cl_15\xB2\u2212V\xB2) = ${T_h_15.toFixed(3)} daN`);
      lines.push(`         Lam\xE9: (+15\xB0C, q=g1_n=${loads.normate.g1.toFixed(4)}) \u2192 (-5\xB0C, q=g7_c=${loads.calcul.g7.toFixed(4)}), L=${L}m`);
      lines.push(`         T0_from15 = ${T0_from15.toFixed(3)} daN`);
      lines.push("");
      const hasT_maxExp = spanPoleExp.T_max !== null;
      const minEDS = Math.min(T0_direct, T0_from30, T0_from15);
      const t_maxLbl = hasT_maxExp ? `, ${spanPoleExp.T_max.toFixed(0)}` : "";
      lines.push(`      T\u2080 = min(T0_direct, T0_from30, T0_from15${hasT_maxExp ? ", T_max_stalp" : ""})`);
      lines.push(`         = min(${T0_direct.toFixed(3)}, ${T0_from30.toFixed(3)}, ${T0_from15.toFixed(3)}${t_maxLbl})`);
      lines.push(`         = ${T0_dim.toFixed(3)} daN  \u2190 ${hasT_maxExp && spanPoleExp.T_max <= minEDS + 0.1 ? "T_max_stalp \u2190 ACTIV" : gov + " guverneaz\u0103"}`);
      lines.push(`      KP = T\u2080/RTS = ${T0_dim.toFixed(3)}/${cd.RTS} = ${(T0_dim / cd.RTS * 100).toFixed(2)}%`);
      lines.push("");
      const rowNormRef = tension_table.find((r) => r.label === "-5+ch+v");
      const rowWind = tension_table.find((r) => r.label === "+15+vmax");
      const T_norm_ref = rowNormRef?.T_norm ?? 0;
      const T_wind_calc = rowWind?.T_norm ?? T0_dim;
      const K1 = T0_dim - loads.calcul.g7 ** 2 * L ** 2 * EA / (24 * T0_dim ** 2);
      const C1 = loads.normate.g7 ** 2 * L ** 2 * EA / 24;
      const K2 = T_norm_ref - loads.normate.g7 ** 2 * L ** 2 * EA / (24 * T_norm_ref ** 2) - EA * cd.alpha * 20;
      const C2 = loads.normate.g6 ** 2 * L ** 2 * EA / 24;
      lines.push("  [3] LAN\u021AUL LAM\xC9 (2 pa\u0219i)  \u2014  T\u2082\xB3 \u2212 K\xB7T\u2082\xB2 \u2212 C = 0");
      lines.push("      Pas 1: T\u2080_dim (calcul, -5\xB0C+ch+v) \u2192 T_norm_ref (normate, -5\xB0C+ch+v)");
      lines.push(`        q1=g7_c=${loads.calcul.g7.toFixed(4)} daN/m, T1=T\u2080=${T0_dim.toFixed(3)} daN, \u03B81=-5\xB0C`);
      lines.push(`        q2=g7_n=${loads.normate.g7.toFixed(4)} daN/m, \u03B82=-5\xB0C  \u2192 \u0394\u03B8=0, EA\xB7\u03B1\xB7\u0394\u03B8=0`);
      lines.push(`        K = ${T0_dim.toFixed(3)} \u2212 (${loads.calcul.g7.toFixed(4)}\xB2\xB7${L}\xB2\xB7${EA.toFixed(0)})/(24\xB7${T0_dim.toFixed(3)}\xB2) = ${K1.toFixed(3)}`);
      lines.push(`        C = (${loads.normate.g7.toFixed(4)}\xB2\xB7${L}\xB2\xB7${EA.toFixed(0)})/24 = ${C1.toFixed(3)}`);
      lines.push(`        T_norm_ref = ${T_norm_ref.toFixed(4)} daN  (\u03C3 = ${(T_norm_ref / cd.A).toFixed(5)} daN/mm\xB2)`);
      lines.push("");
      lines.push("      Pas 2: T_norm_ref (normate, -5\xB0C+ch+v) \u2192 T_wind (normate, +15\xB0C+vmax)");
      lines.push(`        q1=g7_n=${loads.normate.g7.toFixed(4)} daN/m, T1=${T_norm_ref.toFixed(4)} daN, \u03B81=-5\xB0C`);
      lines.push(`        q2=g6_n=${loads.normate.g6.toFixed(4)} daN/m, \u03B82=+15\xB0C  \u2192 \u0394\u03B8=20\xB0C`);
      lines.push(`        EA\xB7\u03B1\xB7\u0394\u03B8 = ${EA.toFixed(0)}\xD7${(cd.alpha * 1e6).toFixed(1)}e-6\xD720 = ${(EA * cd.alpha * 20).toFixed(3)} daN`);
      lines.push(`        K = ${T_norm_ref.toFixed(4)} \u2212 (${loads.normate.g7.toFixed(4)}\xB2\xB7L\xB2\xB7EA)/(24\xB7T\xB2) \u2212 ${(EA * cd.alpha * 20).toFixed(3)} = ${K2.toFixed(3)}`);
      lines.push(`        C = (${loads.normate.g6.toFixed(4)}\xB2\xB7${L}\xB2\xB7${EA.toFixed(0)})/24 = ${C2.toFixed(3)}`);
      lines.push(`        T_wind_calc = ${T_wind_calc.toFixed(4)} daN  (\u03C3 = ${(T_wind_calc / cd.A).toFixed(5)} daN/mm\xB2)`);
      lines.push("");
      const isOvr = _twindOverrides.has(key);
      const T_wind_used = isOvr ? _twindOverrides.get(key) : T_wind_calc;
      const g4n = loads.normate.g4;
      const g6n = loads.normate.g6;
      const delta_cat = g4n * L * L / (8 * T_wind_used);
      const delta_iz = L_IZ_MT * (g4n / g6n);
      const delta_tot = delta_cat + delta_iz;
      lines.push("  [4] DEVIA\u021AIE LATERAL\u0102 \u03B4  (starea +15\xB0C+vmax normate)");
      if (isOvr) {
        lines.push(`      \u26A0 T_wind OVERRIDE: ${T_wind_used.toFixed(2)} daN (introdus manual \u2014 calculat: ${T_wind_calc.toFixed(4)} daN)`);
      } else {
        lines.push(`      T_wind = ${T_wind_used.toFixed(4)} daN  (calculat prin Lam\xE9)`);
      }
      lines.push(`      g4_n = ${g4n.toFixed(4)} daN/m  (v\xE2nt orizontal normat)`);
      lines.push(`      g6_n = ${g6n.toFixed(4)} daN/m  (rez. cond.+v\xE2nt normat)`);
      lines.push("");
      lines.push("      \u03B4_catenary = g4_n \xD7 L\xB2 / (8 \xD7 T_wind)");
      lines.push(`               = ${g4n.toFixed(4)} \xD7 ${L.toFixed(1)}\xB2 / (8 \xD7 ${T_wind_used.toFixed(4)})`);
      lines.push(`               = ${g4n.toFixed(4)} \xD7 ${(L * L).toFixed(2)} / ${(8 * T_wind_used).toFixed(4)}`);
      lines.push(`               = ${delta_cat.toFixed(5)} m`);
      lines.push("");
      lines.push("      \u03B4_lan\u021B    = L_iz \xD7 (g4_n / g6_n)");
      lines.push(`               = ${L_IZ_MT} \xD7 (${g4n.toFixed(4)} / ${g6n.toFixed(4)})`);
      lines.push(`               = ${L_IZ_MT} \xD7 ${(g4n / g6n).toFixed(6)}`);
      lines.push(`               = ${delta_iz.toFixed(5)} m`);
      lines.push("");
      lines.push(`      \u03B4_total   = ${delta_cat.toFixed(5)} + ${delta_iz.toFixed(5)}`);
      lines.push(`               = ${delta_tot.toFixed(5)} m  \u2192  ${delta_tot.toFixed(2)} m`);
      lines.push("");
      const row40 = tension_table.find((r) => r.label === "+40\xB0C");
      if (row40) {
        const T40 = row40.T_norm;
        lines.push("  [5] S\u0102GEAT\u0102 GABARIT la +40\xB0C");
        lines.push(`      T_40\xB0C = ${T40.toFixed(4)} daN  (Lam\xE9: g7_n,-5\xB0C \u2192 g1_n,+40\xB0C)`);
        lines.push("      f_max = g1_n \xD7 L\xB2 / (8 \xD7 T_40\xB0C)");
        lines.push(`            = ${loads.normate.g1.toFixed(4)} \xD7 ${(L * L).toFixed(2)} / (8 \xD7 ${T40.toFixed(4)})`);
        lines.push(`            = ${(loads.normate.g1 * L * L / (8 * T40)).toFixed(5)} m  \u2192  ${res.sag40.toFixed(2)} m`);
        lines.push(`      T_crit = ${res.T_crit.toFixed(2)}\xB0C  (temp. la care sag_termic = sag_chiciur\u0103)`);
      }
      lines.push("");
    });
    lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
    lines.push("  ElectroCAD Pro v12  \u2014  Calcul conform SR EN 50341-2-24:2019");
    lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
    const text = lines.join("\n");
    const win = window.open("", "_blank", "width=960,height=720,scrollbars=yes");
    if (!win) {
      navigator.clipboard.writeText(text).then(() => toast("Detalii copiate \xEEn clipboard (popup blocat)", "ok"));
      return;
    }
    win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>Calcul Detaliat \u2014 S\u0103geat\u0103 + Devia\u021Bie MT</title>
    <style>
      *{box-sizing:border-box}
      body{background:#0f1117;color:#c9d8ff;font-family:'Courier New',Courier,monospace;
           font-size:12.5px;padding:0;margin:0;line-height:1.55}
      .bar{position:sticky;top:0;background:#0f1117;border-bottom:1px solid #1e2a4a;
           padding:8px 16px;display:flex;gap:8px;align-items:center;z-index:10}
      .bar span{font-size:11px;color:#5a7aaa;margin-left:4px}
      button{padding:6px 14px;border:none;border-radius:5px;cursor:pointer;
             font-size:12px;font-weight:700;font-family:inherit}
      .bc{background:#3b82f6;color:#fff} .bc:hover{background:#2563eb}
      .bp{background:#374151;color:#d1d5db} .bp:hover{background:#4b5563}
      pre{padding:16px;margin:0;white-space:pre}
    </style>
  </head><body>
  <div class="bar">
    <button class="bc" id="cbtn" onclick="copyAll()">\u{1F4CB} Copiaz\u0103 tot</button>
    <button class="bp" onclick="window.print()">\u{1F5A8} Print / PDF</button>
    <span>ElectroCAD Pro v12 \u2014 Calcul detaliat S\u0103geat\u0103 + Devia\u021Bie MT</span>
  </div>
  <pre id="ct"></pre>
  <script>
    document.getElementById('ct').textContent=${JSON.stringify(text)};
    function copyAll(){
      navigator.clipboard.writeText(document.getElementById('ct').textContent).then(()=>{
        const b=document.getElementById('cbtn');
        b.textContent='\u2713 Copiat!';
        setTimeout(()=>{b.textContent='\u{1F4CB} Copiaz\u0103 tot'},1800);
      });
    }
  <\/script></body></html>`);
    win.document.close();
  }
  function buildSpanChains(spanMap) {
    const adj = /* @__PURE__ */ new Map();
    spanMap.forEach((cns2) => {
      const a = cns2[0].fromElId, b = cns2[0].toElId;
      if (!a || !b) return;
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push({ nbr: b, cns2 });
      adj.get(b).push({ nbr: a, cns2 });
    });
    const visited = /* @__PURE__ */ new Set();
    const chains = [];
    function walkFrom(prevId, startId) {
      const chain = [];
      let prev = prevId, cur = startId;
      while (cur && !visited.has(cur)) {
        visited.add(cur);
        const edges = adj.get(cur) || [];
        const next = edges.find((e) => e.nbr !== prev && !visited.has(e.nbr));
        if (prev !== null) {
          const edge = (adj.get(prev) || []).find((e) => e.nbr === cur);
          if (edge) chain.push({
            fromId: prev,
            toId: cur,
            cns2: edge.cns2,
            reversed: edge.cns2[0].fromElId !== prev
          });
        }
        prev = cur;
        cur = next ? next.nbr : null;
      }
      return chain;
    }
    adj.forEach((edges, id) => {
      if (!visited.has(id) && edges.length === 1) {
        visited.add(id);
        const c = walkFrom(id, edges[0].nbr);
        if (c.length) chains.push(c);
      }
    });
    adj.forEach((edges, id) => {
      if (!visited.has(id) && edges.length) {
        visited.add(id);
        const c = walkFrom(id, edges[0].nbr);
        if (c.length) chains.push(c);
      }
    });
    return chains;
  }
  function toggleSagOverlay(on) {
    _visible = on;
    renderSagLayer();
  }
  function renderSagLayer() {
    const layer = document.getElementById("SAG");
    if (!layer) return;
    layer.innerHTML = "";
    if (!_visible) return;
    const cns = getMTConns();
    if (!cns.length) return;
    const dark = !S.lightMode;
    const outlineC = dark ? "rgba(210,225,255,0.82)" : "rgba(20,50,120,0.78)";
    const hatchC = dark ? "rgba(190,210,255,0.28)" : "rgba(20,50,120,0.20)";
    const dimC = dark ? "#90b8ff" : "#1e3a8a";
    const arrC = dark ? "#90b8ff" : "#1e3a8a";
    const safeC = dark ? "rgba(251,191,36,0.80)" : "rgba(180,90,0,0.82)";
    const safeFillC = dark ? "rgba(251,191,36,0.05)" : "rgba(251,191,36,0.04)";
    const safeHatchC = dark ? "rgba(251,191,36,0.20)" : "rgba(180,90,0,0.18)";
    const svgEl = document.getElementById("svg");
    let defsEl = svgEl?.querySelector(".sag-defs-group");
    if (defsEl) defsEl.remove();
    defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defsEl.setAttribute("class", "sag-defs-group");
    svgEl?.insertBefore(defsEl, svgEl.firstChild);
    defsEl.innerHTML = `
    <marker id="sag-arr" markerWidth="7" markerHeight="5"
            refX="6" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="${arrC}"/>
    </marker>
    <marker id="sag-arr2" markerWidth="7" markerHeight="5"
            refX="1" refY="2.5" orient="auto">
      <polygon points="7 0, 0 2.5, 7 5" fill="${arrC}"/>
    </marker>
    <marker id="safe-arr" markerWidth="7" markerHeight="5"
            refX="6" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="${safeC}"/>
    </marker>`;
    let clipIdx = 0;
    const spanMap = groupBySpan(cns);
    const SAFETY_M = 12;
    const ppmGlobal = S.pxPerMeter || 5;
    const safetyPx = SAFETY_M * ppmGlobal;
    const chains = buildSpanChains(spanMap);
    chains.forEach((chain) => {
      const upperPts = [], lowerPts = [], midData = [];
      chain.forEach(({ fromId, toId, cns2, reversed }) => {
        if (!cns2[0].path?.length) return;
        const starts = cns2.map((cn) => cn.path[0]);
        const ends = cns2.map((cn) => cn.path[cn.path.length - 1]);
        let p0 = {
          x: starts.reduce((s, p) => s + p.x, 0) / starts.length,
          y: starts.reduce((s, p) => s + p.y, 0) / starts.length
        };
        let p1 = {
          x: ends.reduce((s, p) => s + p.x, 0) / ends.length,
          y: ends.reduce((s, p) => s + p.y, 0) / ends.length
        };
        const _fe = S.EL.find((e) => e.id === cns2[0].fromElId);
        const _te = S.EL.find((e) => e.id === cns2[0].toElId);
        if (_fe?.type?.startsWith("stalp_mt_")) p0 = { x: _fe.x, y: _fe.y };
        if (_te?.type?.startsWith("stalp_mt_")) p1 = { x: _te.x, y: _te.y };
        if (reversed) [p0, p1] = [p1, p0];
        const dx = p1.x - p0.x, dy = p1.y - p0.y, len = Math.hypot(dx, dy);
        if (len < 5) return;
        const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
        upperPts.push({ x: p0.x + safetyPx * nx, y: p0.y + safetyPx * ny });
        upperPts.push({ x: p1.x + safetyPx * nx, y: p1.y + safetyPx * ny });
        lowerPts.push({ x: p0.x - safetyPx * nx, y: p0.y - safetyPx * ny });
        lowerPts.push({ x: p1.x - safetyPx * nx, y: p1.y - safetyPx * ny });
        const hasFazaC = cns2.some((cn) => cn.faza);
        const nProjsC = hasFazaC ? cns2.map((cn) => ({ R: MT_PHASE_PX, S: 0, T: -MT_PHASE_PX })[cn.faza] ?? 0) : [0];
        const hsC = Math.max(0, ...nProjsC.map(Math.abs));
        midData.push({ cx: (p0.x + p1.x) / 2, cy: (p0.y + p1.y) / 2, nx, ny, ux, uy, hs: hsC });
      });
      if (upperPts.length < 2) return;
      const allPts = [...upperPts, ...[...lowerPts].reverse()];
      const polyD = allPts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
      const zid = `sz${clipIdx++}`;
      const zcp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      zcp.setAttribute("id", zid);
      const zcpPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      zcpPath.setAttribute("d", polyD);
      zcp.appendChild(zcpPath);
      defsEl.appendChild(zcp);
      const xs = allPts.map((p) => p.x), ys = allPts.map((p) => p.y);
      const bx0 = Math.min(...xs) - 4, by0 = Math.min(...ys) - 4;
      const bx1 = Math.max(...xs) + 4, by1 = Math.max(...ys) + 4;
      const bh = by1 - by0, bw = bx1 - bx0, zspc = Math.max(20, safetyPx / 5);
      let zLines = "";
      for (let k = -bh; k <= bw + bh; k += zspc)
        zLines += `<line x1="${(bx0 + k).toFixed(1)}" y1="${by0.toFixed(1)}" x2="${(bx0 + k + bh).toFixed(1)}" y2="${by1.toFixed(1)}"/>`;
      const mid = midData[Math.floor(midData.length / 2)];
      const { cx: mcx, cy: mcy, nx: mnx, ny: mny, ux: mux, uy: muy, hs: mhs } = mid;
      const rCX = mcx + mhs * mnx, rCY = mcy + mhs * mny;
      const rBX = mcx + safetyPx * mnx, rBY = mcy + safetyPx * mny;
      const tCX = mcx - mhs * mnx, tCY = mcy - mhs * mny;
      const tBX = mcx - safetyPx * mnx, tBY = mcy - safetyPx * mny;
      const zLX = ((rCX + rBX) / 2 + 10 * mux).toFixed(1);
      const zLY = ((rCY + rBY) / 2 + 10 * muy).toFixed(1);
      const zg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      zg.setAttribute("pointer-events", "none");
      zg.innerHTML = `
      <path d="${polyD}" fill="${safeFillC}" stroke="${safeC}" stroke-width="1.2" stroke-dasharray="8,5"/>
      <g clip-path="url(#${zid})">
        <g stroke="${safeHatchC}" stroke-width="0.8" fill="none">${zLines}</g>
      </g>
      <line x1="${(rCX - 5 * mux).toFixed(1)}" y1="${(rCY - 5 * muy).toFixed(1)}"
            x2="${(rCX + 5 * mux).toFixed(1)}" y2="${(rCY + 5 * muy).toFixed(1)}"
            stroke="${safeC}" stroke-width="1.6" opacity="0.9"/>
      <line x1="${rCX.toFixed(1)}" y1="${rCY.toFixed(1)}"
            x2="${rBX.toFixed(1)}" y2="${rBY.toFixed(1)}"
            stroke="${safeC}" stroke-width="1.0" marker-end="url(#safe-arr)"/>
      <line x1="${(tCX - 5 * mux).toFixed(1)}" y1="${(tCY - 5 * muy).toFixed(1)}"
            x2="${(tCX + 5 * mux).toFixed(1)}" y2="${(tCY + 5 * muy).toFixed(1)}"
            stroke="${safeC}" stroke-width="1.6" opacity="0.9"/>
      <line x1="${tCX.toFixed(1)}" y1="${tCY.toFixed(1)}"
            x2="${tBX.toFixed(1)}" y2="${tBY.toFixed(1)}"
            stroke="${safeC}" stroke-width="1.0" marker-end="url(#safe-arr)"/>
      <text x="${zLX}" y="${zLY}" font-size="9" fill="${safeC}"
            font-family="JetBrains Mono,monospace" font-weight="600"
            text-anchor="start">12m</text>`;
      layer.appendChild(zg);
    });
    spanMap.forEach((cns2) => {
      if (!cns2[0].path?.length) return;
      const L = parseFloat(cns2[0].length) || 0;
      if (L < 1) return;
      const starts = cns2.map((cn) => cn.path[0]);
      const ends = cns2.map((cn) => cn.path[cn.path.length - 1]);
      const _feEye = S.EL.find((e) => e.id === cns2[0].fromElId);
      const _teEye = S.EL.find((e) => e.id === cns2[0].toElId);
      const p0 = _feEye?.type?.startsWith("stalp_mt_") ? { x: _feEye.x, y: _feEye.y } : {
        x: starts.reduce((s, p) => s + p.x, 0) / starts.length,
        y: starts.reduce((s, p) => s + p.y, 0) / starts.length
      };
      const p1 = _teEye?.type?.startsWith("stalp_mt_") ? { x: _teEye.x, y: _teEye.y } : {
        x: ends.reduce((s, p) => s + p.x, 0) / ends.length,
        y: ends.reduce((s, p) => s + p.y, 0) / ends.length
      };
      const dx = p1.x - p0.x, dy = p1.y - p0.y;
      const spanPx = Math.hypot(dx, dy);
      if (spanPx < 10) return;
      const ux = dx / spanPx, uy = dy / spanPx;
      const nx = -uy, ny = ux;
      const cx = (p0.x + p1.x) / 2;
      const cy = (p0.y + p1.y) / 2;
      const hasFaza = cns2.some((cn) => cn.faza);
      const normalProjs = hasFaza ? cns2.map((cn) => ({ R: MT_PHASE_PX, S: 0, T: -MT_PHASE_PX })[cn.faza] ?? 0) : cns2.map((cn) => {
        const mx = (cn.path[0].x + cn.path[cn.path.length - 1].x) / 2;
        const my = (cn.path[0].y + cn.path[cn.path.length - 1].y) / 2;
        return (mx - cx) * nx + (my - cy) * ny;
      });
      const halfSpread = Math.max(0, ...normalProjs.map(Math.abs));
      const sec = parseFloat(cns2[0].sectiune) || 70;
      const spanPoleRender = getSpanPoleData(cns2[0].fromElId, cns2[0].toElId);
      const { T0, T_wind: T_wind_calc, loads } = computeSpan(sec, L, spanPoleRender.H, spanPoleRender.T_max);
      const T_wind = _twindOverrides.get(spanKey(cns2)) ?? T_wind_calc;
      const { delta: delta_cond } = calcSag(L, loads.normate.g1, loads.normate.g4, T_wind);
      const delta = delta_cond + L_IZ_MT * (loads.normate.g4 / loads.normate.g6);
      const ppm = S.pxPerMeter || 5;
      const deltaPx = delta * ppm;
      const minVis = Math.max(14, halfSpread * 0.55);
      const eyeHalf = halfSpread + Math.max(deltaPx, minVis);
      const p0R = { x: p0.x + halfSpread * nx, y: p0.y + halfSpread * ny };
      const p1R = { x: p1.x + halfSpread * nx, y: p1.y + halfSpread * ny };
      const p0T = { x: p0.x - halfSpread * nx, y: p0.y - halfSpread * ny };
      const p1T = { x: p1.x - halfSpread * nx, y: p1.y - halfSpread * ny };
      const c1x = cx + eyeHalf * nx, c1y = cy + eyeHalf * ny;
      const c2x = cx - eyeHalf * nx, c2y = cy - eyeHalf * ny;
      const eyeD = [
        `M ${p0R.x.toFixed(2)},${p0R.y.toFixed(2)}`,
        `Q ${c1x.toFixed(2)},${c1y.toFixed(2)} ${p1R.x.toFixed(2)},${p1R.y.toFixed(2)}`,
        `L ${p1T.x.toFixed(2)},${p1T.y.toFixed(2)}`,
        `Q ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p0T.x.toFixed(2)},${p0T.y.toFixed(2)}`,
        "Z"
      ].join(" ");
      const cid = `sc${clipIdx++}`;
      const cp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      cp.setAttribute("id", cid);
      const cpPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      cpPath.setAttribute("d", eyeD);
      cp.appendChild(cpPath);
      defsEl.appendChild(cp);
      const pad = eyeHalf + 4;
      const bx0 = Math.min(p0.x, p1.x) - pad, by0 = Math.min(p0.y, p1.y) - pad;
      const bx1 = Math.max(p0.x, p1.x) + pad, by1 = Math.max(p0.y, p1.y) + pad;
      const bh = by1 - by0, bw = bx1 - bx0;
      const spc = Math.max(7, eyeHalf / 8);
      let hLines = "";
      for (let k = -bh; k <= bw + bh; k += spc) {
        hLines += `<line x1="${(bx0 + k).toFixed(1)}" y1="${by0.toFixed(1)}" x2="${(bx0 + k + bh).toFixed(1)}" y2="${by1.toFixed(1)}"/>`;
      }
      const s1x = cx + halfSpread * nx, s1y = cy + halfSpread * ny;
      const s2x = cx - halfSpread * nx, s2y = cy - halfSpread * ny;
      const e1x = cx + eyeHalf * nx, e1y = cy + eyeHalf * ny;
      const e2x = cx - eyeHalf * nx, e2y = cy - eyeHalf * ny;
      const labMx = (s1x + e1x) / 2;
      const labMy = (s1y + e1y) / 2;
      const labX = (labMx + 12 * ux).toFixed(1);
      const labY = (labMy + 12 * uy).toFixed(1);
      const deltaM = delta.toFixed(2);
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("pointer-events", "none");
      g.innerHTML = `
      <g clip-path="url(#${cid})">
        <g stroke="${hatchC}" stroke-width="0.9" fill="none">${hLines}</g>
      </g>
      <path d="${eyeD}" fill="none" stroke="${outlineC}" stroke-width="1.8"/>
      <line x1="${(s1x - 6 * ux).toFixed(1)}" y1="${(s1y - 6 * uy).toFixed(1)}"
            x2="${(s1x + 6 * ux).toFixed(1)}" y2="${(s1y + 6 * uy).toFixed(1)}"
            stroke="${dimC}" stroke-width="1.8" opacity="0.9"/>
      <line x1="${(s2x - 6 * ux).toFixed(1)}" y1="${(s2y - 6 * uy).toFixed(1)}"
            x2="${(s2x + 6 * ux).toFixed(1)}" y2="${(s2y + 6 * uy).toFixed(1)}"
            stroke="${dimC}" stroke-width="1.8" opacity="0.9"/>
      <line x1="${s1x.toFixed(1)}" y1="${s1y.toFixed(1)}"
            x2="${e1x.toFixed(1)}" y2="${e1y.toFixed(1)}"
            stroke="${dimC}" stroke-width="1.2"
            marker-end="url(#sag-arr)"/>
      <line x1="${s2x.toFixed(1)}" y1="${s2y.toFixed(1)}"
            x2="${e2x.toFixed(1)}" y2="${e2y.toFixed(1)}"
            stroke="${dimC}" stroke-width="1.2"
            marker-end="url(#sag-arr)"/>
      <text x="${labX}" y="${labY}"
            font-size="9" fill="${dimC}" font-family="JetBrains Mono,monospace"
            font-weight="700" text-anchor="start">\u03B4=${deltaM}m</text>`;
      layer.appendChild(g);
    });
  }

  // src/profil-lea.js
  init_state();
  init_pole_catalog();
  var SECTION_TO_ACSR2 = {
    35: "ACSR 35/6",
    50: "ACSR 50/8",
    70: "ACSR 70/11",
    95: "ACSR 95/16",
    120: "ACSR 120/7",
    150: "ACSR 150/8"
  };
  var _zone2 = "D.b.4";
  var _H_default = 7;
  var _kpdim2 = null;
  var _avSpan2 = false;
  function izolatieLabel(key) {
    if (!key) return null;
    const k = key.toLowerCase();
    if (k.startsWith("cdci")) return "IZOL. D.C. \xCENTINDERE EL.";
    if (k.startsWith("cdi")) return "IZOL. DEZAXAT\u0102 \xCENTING.";
    if (k.startsWith("cis") || k.startsWith("cii")) return "IZOL. D.C. \xCENTINDERE";
    if (k.startsWith("cit")) return "IZOLA\u021AIE \xCENTINDERE";
    if (k.startsWith("cdcs")) return "IZOL. D.C. SUS\u021A. EL.";
    if (k.startsWith("cie")) return "IZOLA\u021AIE ELASTIC\u0102 SUS\u021A.";
    if (k.startsWith("css") || k.startsWith("csi")) return "CONSOL\u0102 D.C. SUS\u021AINERE";
    if (k.startsWith("cds")) return "DEZAXAT\u0102 SUS\u021AINERE";
    if (k.startsWith("cso")) return "CONSOL\u0102 SUS\u021AINERE";
    if (k.startsWith("cdv")) return "CONSOL\u0102 DERIVA\u021AIE";
    return null;
  }
  function elLabel2(id) {
    const e = S.EL.find((x) => x.id === id);
    return e?.label || e?.type?.replace("stalp_mt_", "")?.toUpperCase() || id;
  }
  function getMTConns2() {
    const mtIds = new Set(
      S.EL.filter((e) => e.type?.startsWith("stalp_mt_")).map((e) => e.id)
    );
    return S.CN.filter(
      (cn) => cn.tipConductor === "OL-AL" || cn.fromElId && mtIds.has(cn.fromElId) || cn.toElId && mtIds.has(cn.toElId)
    );
  }
  function groupBySpan2(cns) {
    const map = /* @__PURE__ */ new Map();
    cns.forEach((cn) => {
      const a = cn.fromElId || "", b = cn.toElId || "";
      const key = a && b ? a < b ? `${a}|${b}` : `${b}|${a}` : cn.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(cn);
    });
    return map;
  }
  function buildSpanChains2(spanMap) {
    const adj = /* @__PURE__ */ new Map();
    spanMap.forEach((cns2) => {
      const a = cns2[0].fromElId, b = cns2[0].toElId;
      if (!a || !b) return;
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push({ nbr: b, cns2 });
      adj.get(b).push({ nbr: a, cns2 });
    });
    const visited = /* @__PURE__ */ new Set();
    const chains = [];
    function walkFrom(prevId, startId) {
      const chain = [];
      let prev = prevId, cur = startId;
      while (cur && !visited.has(cur)) {
        visited.add(cur);
        const edges = adj.get(cur) || [];
        const next = edges.find((e) => e.nbr !== prev && !visited.has(e.nbr));
        if (prev !== null) {
          const edge = (adj.get(prev) || []).find((e) => e.nbr === cur);
          if (edge) chain.push({ fromId: prev, toId: cur, cns2: edge.cns2 });
        }
        prev = cur;
        cur = next ? next.nbr : null;
      }
      return chain;
    }
    adj.forEach((edges, id) => {
      if (!visited.has(id) && edges.length === 1) {
        visited.add(id);
        const c = walkFrom(id, edges[0].nbr);
        if (c.length) chains.push(c);
      }
    });
    adj.forEach((edges, id) => {
      if (!visited.has(id) && edges.length) {
        visited.add(id);
        const c = walkFrom(id, edges[0].nbr);
        if (c.length) chains.push(c);
      }
    });
    return chains;
  }
  function extractProfilData() {
    const allCns = getMTConns2().filter((cn) => cn.fromElId && cn.toElId);
    if (!allCns.length) return [];
    const spanMap = groupBySpan2(allCns);
    const rawChains = buildSpanChains2(spanMap);
    return rawChains.map((chain) => {
      if (!chain.length) return null;
      const poleIds = [chain[0].fromId, ...chain.map((s) => s.toId)];
      const poles = poleIds.map((id) => {
        const el = S.EL.find((e) => e.id === id);
        const pd = getPoleData(el);
        const ck = el?.console_type ?? null;
        const cc = ck ? CONSOLE_CATALOG[ck] ?? {} : {};
        return {
          id,
          label: elLabel2(id),
          H: pd.H ?? _H_default,
          cota_teren: el?.cota_teren ?? 0,
          hasCota: el?.cota_teren != null,
          pole_desc: pd.desc ? pd.desc.split(" \u2014 ")[0] : null,
          console_short: cc.desc ? cc.desc.replace(/\s+v\d.*$/i, "").replace(/\s*\/\s*OL\d+.*/i, "").trim() : null,
          izolatie_lbl: izolatieLabel(ck)
        };
      });
      const spans = chain.map((seg, i) => {
        const cns2 = seg.cns2;
        const L = parseFloat(cns2[0].length) || 0;
        const sec = parseFloat(cns2[0].sectiune) || 70;
        const acsr_key = SECTION_TO_ACSR2[sec] || "ACSR 70/11";
        const H_span = (poles[i].H + poles[i + 1].H) / 2;
        const attach_l = poles[i].cota_teren + poles[i].H;
        const attach_r = poles[i + 1].cota_teren + poles[i + 1].H;
        const dh = poles[i].hasCota && poles[i + 1].hasCota ? attach_r - attach_l : 0;
        const pdL = getPoleData(S.EL.find((e) => e.id === seg.fromId));
        const pdR = getPoleData(S.EL.find((e) => e.id === seg.toId));
        const tL = pdL.T_max, tR = pdR.T_max;
        const T_max = tL != null && tR != null ? Math.min(tL, tR) : tL ?? tR ?? null;
        let sag10 = null, sag40 = null, T40 = null, q40 = null, T10 = null, q10 = null;
        let T0_dim = null, KP_calc = null, T_crit = null, T_wind = null, q_wind = null;
        try {
          const H_wind = Math.max(poles[i].H, poles[i + 1].H);
          const Av = _avSpan2 ? L : Math.max(L, 40);
          const res = calcSpan(
            acsr_key,
            { zone: _zone2, H: H_wind, Av, terrain: "II" },
            { L, dh },
            _kpdim2,
            T_max
          );
          sag40 = res.sag40;
          T0_dim = res.T0_dim;
          KP_calc = res.KP_dim;
          T_crit = res.T_crit;
          const r40 = res.tension_table.find((r) => r.label === "+40\xB0C");
          const r10 = res.tension_table.find((r) => r.label === "+10\xB0C");
          const rWd = res.tension_table.find((r) => r.label === "+15+vmax");
          if (r40) {
            sag40 = r40.sag_max;
            T40 = r40.T_norm;
            q40 = r40.q_norm;
          }
          if (r10) {
            sag10 = r10.sag_max;
            T10 = r10.T_norm;
            q10 = r10.q_norm;
          }
          if (rWd) {
            T_wind = rWd.T_norm;
          }
          q_wind = res.loads?.normate?.g4 ?? null;
        } catch (_) {
        }
        let sag40_real = null, sag10_real = null, T40_real = null, T10_real = null;
        const sfmKey = seg.fromId < seg.toId ? `${seg.fromId}|${seg.toId}` : `${seg.toId}|${seg.fromId}`;
        const sfm = getSagMeasOverrides().get(sfmKey);
        if (sfm?.f_meas > 0) {
          try {
            const cd = CONDUCTORS[acsr_key];
            const EA = cd.E * cd.A;
            const g1 = cd.gc;
            const f_sag = H_span - sfm.f_meas;
            if (f_sag > 0.1) {
              const T_hf = g1 * L * L / (8 * f_sag);
              T40_real = solveStateEquation(g1, T_hf, sfm.T_meas, g1, 40, L, EA, cd.alpha);
              sag40_real = g1 * L * L / (8 * T40_real);
              const T10r = solveStateEquation(g1, T_hf, sfm.T_meas, g1, 10, L, EA, cd.alpha);
              sag10_real = g1 * L * L / (8 * T10r);
              T10_real = T10r;
            }
          } catch (_) {
          }
        }
        return {
          fromId: seg.fromId,
          toId: seg.toId,
          L_m: L,
          dh,
          acsr_key,
          sag10,
          sag40,
          T40,
          q40,
          T10,
          q10,
          T0_dim,
          KP_calc,
          T_crit,
          T_wind,
          q_wind,
          sag40_real,
          sag10_real,
          T40_real,
          T10_real,
          f_meas: sfm?.f_meas ?? null,
          T_meas: sfm?.T_meas ?? null
        };
      });
      return {
        label: `${poles[0].label} \u2192 ${poles[poles.length - 1].label}`,
        poles,
        spans,
        hasCota: poles.some((p) => p.hasCota)
      };
    }).filter(Boolean);
  }
  var MG = { top: 95, right: 60, bot: 80, left: 68 };
  var IW = 860;
  var IH = 210;
  var N_CAT = 40;
  var GABARIT_MIN = 7;
  function buildProfilSVG(chain) {
    const { poles, spans, hasCota } = chain;
    if (!poles.length || !spans.length) return "";
    const xm = [0];
    spans.forEach((sp) => xm.push(xm[xm.length - 1] + (sp.L_m || 0)));
    const L_total = xm[xm.length - 1];
    if (L_total < 1) return "";
    const px_h = IW / L_total;
    let y_top = -Infinity, y_bot = Infinity;
    poles.forEach((p) => {
      const ct = p.cota_teren;
      y_top = Math.max(y_top, ct + p.H + 1.5);
      y_bot = Math.min(y_bot, ct - 2);
    });
    spans.forEach((sp, i) => {
      const a_l = poles[i].cota_teren + poles[i].H;
      const a_r = poles[i + 1].cota_teren + poles[i + 1].H;
      const chord_mid = (a_l + a_r) / 2;
      if (sp.sag40 != null)
        y_bot = Math.min(y_bot, chord_mid - sp.sag40 - 1.5);
      if (sp.sag40_real != null)
        y_bot = Math.min(y_bot, chord_mid - sp.sag40_real - 1.5);
    });
    if (!isFinite(y_top)) y_top = 15;
    if (!isFinite(y_bot)) y_bot = 0;
    if (y_top - y_bot < 5) y_top = y_bot + 10;
    const elev_range = y_top - y_bot;
    const px_v = IH / elev_range;
    const W = IW + MG.left + MG.right;
    const H = IH + MG.top + MG.bot;
    const sx = (xm_) => MG.left + xm_ * px_h;
    const sy = (el_) => MG.top + (y_top - el_) * px_v;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background:#0f172a;font-family:'Barlow Condensed',sans-serif">`;
    const gridStep = elev_range > 50 ? 10 : elev_range > 20 ? 5 : 2;
    const gridStart = Math.ceil(y_bot / gridStep) * gridStep;
    s += "<g>";
    for (let e = gridStart; e <= y_top + 0.01; e += gridStep) {
      const yg = sy(e);
      if (yg < MG.top - 2 || yg > MG.top + IH + 2) continue;
      const ygs = yg.toFixed(1);
      s += `<line x1="${MG.left}" y1="${ygs}" x2="${MG.left + IW}" y2="${ygs}" stroke="#1e293b" stroke-width="1"/>`;
      s += `<text x="${(MG.left - 5).toFixed(1)}" y="${(yg + 3).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#475569">${e}m</text>`;
    }
    s += "</g>";
    if (hasCota) {
      const tPts = poles.map((p, i) => `${sx(xm[i]).toFixed(1)},${sy(p.cota_teren).toFixed(1)}`).join(" ");
      const yBase = (MG.top + IH + 4).toFixed(1);
      s += `<polygon points="${tPts} ${sx(L_total).toFixed(1)},${yBase} ${sx(0).toFixed(1)},${yBase}" fill="rgba(92,60,20,.5)" stroke="none"/>`;
      s += `<polyline points="${tPts}" fill="none" stroke="#92400e" stroke-width="2"/>`;
      const gPts = poles.map((p, i) => `${sx(xm[i]).toFixed(1)},${sy(p.cota_teren + GABARIT_MIN).toFixed(1)}`).join(" ");
      s += `<polyline points="${gPts}" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity=".55"/>`;
      s += `<text x="${(MG.left + 4).toFixed(1)}" y="${(sy(poles[0].cota_teren + GABARIT_MIN) - 3).toFixed(1)}" font-size="7.5" fill="#facc15" opacity=".7">gabarit ${GABARIT_MIN}m</text>`;
    } else {
      const y0 = sy(0).toFixed(1);
      s += `<line x1="${MG.left}" y1="${y0}" x2="${MG.left + IW}" y2="${y0}" stroke="#92400e" stroke-width="1.2" stroke-dasharray="4,4" opacity=".5"/>`;
      s += `<text x="${(MG.left - 5).toFixed(1)}" y="${(sy(0) + 3).toFixed(1)}" text-anchor="end" font-size="7.5" fill="#92400e" opacity=".7">0m</text>`;
    }
    const CORR_Y = 32;
    const CORR_MAX_H = 20;
    let hasCorr = false;
    spans.forEach((sp, i) => {
      if (!sp.T_wind || !sp.q_wind || !sp.L_m) return;
      hasCorr = true;
      const x_left = sx(xm[i]);
      const x_right = sx(xm[i + 1]);
      const lower = Array.from({ length: 21 }, (_, k) => {
        const t = k / 20;
        const x_m = t * sp.L_m;
        const dlt = sp.q_wind * x_m * (sp.L_m - x_m) / (2 * sp.T_wind);
        const bh = Math.min(dlt * px_v, CORR_MAX_H);
        return `${sx(xm[i] + x_m).toFixed(1)},${(CORR_Y + bh).toFixed(1)}`;
      });
      const upperL = `${x_left.toFixed(1)},${CORR_Y} ${x_right.toFixed(1)},${CORR_Y}`;
      const lowerR = [...lower].reverse().join(" ");
      s += `<polygon points="${upperL} ${lowerR}" fill="rgba(192,132,252,.10)" stroke="none"/>`;
      s += `<polyline points="${lower.join(" ")}" fill="none" stroke="#c084fc" stroke-width="1" opacity=".55"/>`;
      const xmid = sx(xm[i] + sp.L_m / 2);
      const delta_mid = sp.q_wind * sp.L_m * sp.L_m / (8 * sp.T_wind);
      const y_lbl = CORR_Y + Math.min(delta_mid * px_v, CORR_MAX_H) / 2 + 5;
      s += `<text x="${xmid.toFixed(1)}" y="${y_lbl.toFixed(1)}" text-anchor="middle" font-size="8" fill="#c084fc" font-weight="600">${sp.L_m.toFixed(0)} m</text>`;
    });
    if (hasCorr) {
      s += `<line x1="${MG.left}" y1="${CORR_Y}" x2="${(MG.left + IW).toFixed(1)}" y2="${CORR_Y}" stroke="#c084fc" stroke-width=".8" opacity=".4"/>`;
      s += `<text x="${MG.left}" y="${CORR_Y - 3}" font-size="7.5" fill="#c084fc" font-weight="700" opacity=".8">AX LEA 20kV \u2014 culoar devia\u021Bie (\xB1\u03B4 v\xE2nt)</text>`;
    }
    spans.forEach((sp, i) => {
      if (!sp.L_m) return;
      const a_l = poles[i].cota_teren + poles[i].H;
      const a_r = poles[i + 1].cota_teren + poles[i + 1].H;
      const x_max40 = sp.q40 && sp.T40 ? sp.L_m / 2 - sp.dh * sp.T40 / (sp.q40 * sp.L_m) : sp.L_m / 2;
      const x_max10 = sp.q10 && sp.T10 ? sp.L_m / 2 - sp.dh * sp.T10 / (sp.q10 * sp.L_m) : sp.L_m / 2;
      const t_max40 = Math.max(0.01, Math.min(0.99, x_max40 / sp.L_m));
      const t_max10 = Math.max(0.01, Math.min(0.99, x_max10 / sp.L_m));
      const catPts = (q_n, T_n, sag_fb) => Array.from({ length: N_CAT + 1 }, (_, k) => {
        const t = k / N_CAT;
        const x_m = t * sp.L_m;
        const chord = a_l + (a_r - a_l) * t;
        const sag_x = q_n != null && T_n != null ? q_n * x_m * (sp.L_m - x_m) / (2 * T_n) : (sag_fb ?? 0) * 4 * t * (1 - t);
        return `${sx(xm[i] + x_m).toFixed(1)},${sy(chord - sag_x).toFixed(1)}`;
      }).join(" ");
      let gab40 = null, gab10 = null;
      if (hasCota) {
        if (sp.sag40 != null) {
          const t = t_max40;
          const chord = a_l + (a_r - a_l) * t;
          const cond = chord - sp.sag40;
          const terr = poles[i].cota_teren + (poles[i + 1].cota_teren - poles[i].cota_teren) * t;
          gab40 = { xpx: sx(xm[i] + x_max40), yc: sy(cond), yt: sy(terr), cl: cond - terr };
        }
        if (sp.sag10 != null) {
          const t = t_max10;
          const chord = a_l + (a_r - a_l) * t;
          const cond = chord - sp.sag10;
          const terr = poles[i].cota_teren + (poles[i + 1].cota_teren - poles[i].cota_teren) * t;
          gab10 = { xpx: sx(xm[i] + x_max10), yc: sy(cond), yt: sy(terr), cl: cond - terr };
        }
      }
      if (sp.sag40 != null) {
        s += `<polyline points="${catPts(sp.q40, sp.T40, sp.sag40)}" fill="none" stroke="#f97316" stroke-width="2"/>`;
        if (sp.L_m >= 30) {
          const y40lbl = sy(a_l + (a_r - a_l) * t_max40 - sp.sag40);
          s += `<text x="${sx(xm[i] + x_max40).toFixed(1)}" y="${(y40lbl + 12).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#f97316">f\u2084\u2080=${sp.sag40.toFixed(2)} m</text>`;
        }
      }
      if (sp.sag10 != null) {
        s += `<polyline points="${catPts(sp.q10, sp.T10, sp.sag10)}" fill="none" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="7,3"/>`;
        if (sp.L_m >= 30) {
          const y10lbl = sy(a_l + (a_r - a_l) * t_max10 - sp.sag10);
          s += `<text x="${sx(xm[i] + x_max10).toFixed(1)}" y="${(y10lbl - 5).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#4ade80">f\u2081\u2080=${sp.sag10.toFixed(2)} m</text>`;
        }
      }
      if (gab40 || gab10) {
        const OVERLAP_PX = 50;
        const combined = gab40 && gab10 && Math.abs(gab40.xpx - gab10.xpx) < OVERLAP_PX;
        const drawIndicator = (xg, yc, yt, clearance, col, arrowSz, dashW) => {
          const y_lbl = (yc + yt) / 2;
          s += `<line x1="${xg.toFixed(1)}" y1="${yt.toFixed(1)}" x2="${xg.toFixed(1)}" y2="${yc.toFixed(1)}" stroke="${col}" stroke-width="${dashW}" stroke-dasharray="3,2"/>`;
          s += `<polygon points="${xg.toFixed(1)},${yc.toFixed(1)} ${(xg - arrowSz).toFixed(1)},${(yc + arrowSz * 2).toFixed(1)} ${(xg + arrowSz).toFixed(1)},${(yc + arrowSz * 2).toFixed(1)}" fill="${col}"/>`;
          s += `<polygon points="${xg.toFixed(1)},${yt.toFixed(1)} ${(xg - arrowSz).toFixed(1)},${(yt - arrowSz * 2).toFixed(1)} ${(xg + arrowSz).toFixed(1)},${(yt - arrowSz * 2).toFixed(1)}" fill="${col}"/>`;
          return y_lbl;
        };
        if (combined) {
          const xc = (gab40.xpx + gab10.xpx) / 2;
          const yc = Math.min(gab40.yc, gab10.yc);
          const yt = (gab40.yt + gab10.yt) / 2;
          const ok40 = gab40.cl >= GABARIT_MIN;
          const ok10 = gab10.cl >= GABARIT_MIN;
          const col40 = ok40 ? "#22c55e" : "#ef4444";
          const col10 = ok10 ? "#4ade80" : "#ef4444";
          const wCol = !ok40 || !ok10 ? "#ef4444" : "#22c55e";
          const y_lbl = drawIndicator(xc, yc, yt, null, wCol, 3, 1.3);
          const W2 = 94, H2 = 14;
          s += `<rect x="${(xc - W2 / 2).toFixed(1)}" y="${(y_lbl - H2 / 2).toFixed(1)}" width="${W2}" height="${H2}" rx="3" fill="rgba(15,23,42,.88)" stroke="${wCol}" stroke-width=".7"/>`;
          s += `<text x="${(xc - W2 / 2 + 5).toFixed(1)}" y="${(y_lbl + 3).toFixed(1)}" text-anchor="start" font-size="8" fill="${col10}">g\u2081\u2080=${gab10.cl.toFixed(2)}m${ok10 ? "" : " \u26A0"}</text>`;
          s += `<text x="${(xc + W2 / 2 - 5).toFixed(1)}" y="${(y_lbl + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="${col40}" font-weight="700">g\u2084\u2080=${gab40.cl.toFixed(2)}m${ok40 ? "" : " \u26A0"}</text>`;
        } else {
          if (gab40) {
            const ok40 = gab40.cl >= GABARIT_MIN;
            const col40 = ok40 ? "#22c55e" : "#ef4444";
            const y_lbl = drawIndicator(gab40.xpx, gab40.yc, gab40.yt, gab40.cl, col40, 3.5, 1.3);
            s += `<rect x="${(gab40.xpx - 22).toFixed(1)}" y="${(y_lbl - 7).toFixed(1)}" width="44" height="13" rx="3" fill="${ok40 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)"}" stroke="${col40}" stroke-width=".6"/>`;
            s += `<text x="${gab40.xpx.toFixed(1)}" y="${(y_lbl + 3).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="${col40}" font-weight="700">g\u2084\u2080=${gab40.cl.toFixed(2)}m${ok40 ? "" : " \u26A0"}</text>`;
          }
          if (gab10) {
            const ok10 = gab10.cl >= GABARIT_MIN;
            const col10 = ok10 ? "#4ade80" : "#ef4444";
            const y_lbl = drawIndicator(gab10.xpx, gab10.yc, gab10.yt, gab10.cl, col10, 2.5, 1);
            s += `<rect x="${(gab10.xpx - 21).toFixed(1)}" y="${(y_lbl - 6).toFixed(1)}" width="42" height="11" rx="2" fill="${ok10 ? "rgba(74,222,128,.1)" : "rgba(239,68,68,.1)"}" stroke="${col10}" stroke-width=".5"/>`;
            s += `<text x="${gab10.xpx.toFixed(1)}" y="${(y_lbl + 2).toFixed(1)}" text-anchor="middle" font-size="7.5" fill="${col10}">g\u2081\u2080=${gab10.cl.toFixed(2)}m${ok10 ? "" : " \u26A0"}</text>`;
          }
        }
      }
      if (sp.sag40_real != null) {
        const q_bare = sp.q10;
        const x_max40r = q_bare && sp.T40_real ? sp.L_m / 2 - sp.dh * sp.T40_real / (q_bare * sp.L_m) : sp.L_m / 2;
        const t40r = Math.max(0.01, Math.min(0.99, x_max40r / sp.L_m));
        const chord_r = a_l + (a_r - a_l) * t40r;
        const cond40r = chord_r - sp.sag40_real;
        const xg40r = sx(xm[i] + x_max40r);
        const y40r = sy(cond40r);
        s += `<polyline points="${catPts(q_bare, sp.T40_real, sp.sag40_real)}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>`;
        if (sp.L_m >= 30) {
          s += `<text x="${xg40r.toFixed(1)}" y="${(y40r + 13).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#f59e0b" font-weight="700">f\u2084\u2080\u2605=${sp.sag40_real.toFixed(2)} m</text>`;
        }
        if (hasCota) {
          const terrain40r = poles[i].cota_teren + (poles[i + 1].cota_teren - poles[i].cota_teren) * t40r;
          const clr40r = cond40r - terrain40r;
          const ok40r = clr40r >= GABARIT_MIN;
          const colR = ok40r ? "#f59e0b" : "#ef4444";
          const yt40r = sy(terrain40r);
          s += `<line x1="${(xg40r + 14).toFixed(1)}" y1="${yt40r.toFixed(1)}" x2="${(xg40r + 14).toFixed(1)}" y2="${y40r.toFixed(1)}" stroke="${colR}" stroke-width="1.3" stroke-dasharray="4,2"/>`;
          s += `<polygon points="${(xg40r + 14).toFixed(1)},${y40r.toFixed(1)} ${(xg40r + 10.5).toFixed(1)},${(y40r + 7).toFixed(1)} ${(xg40r + 17.5).toFixed(1)},${(y40r + 7).toFixed(1)}" fill="${colR}"/>`;
          s += `<polygon points="${(xg40r + 14).toFixed(1)},${yt40r.toFixed(1)} ${(xg40r + 10.5).toFixed(1)},${(yt40r - 7).toFixed(1)} ${(xg40r + 17.5).toFixed(1)},${(yt40r - 7).toFixed(1)}" fill="${colR}"/>`;
          const ylR = (y40r + yt40r) / 2;
          s += `<rect x="${(xg40r + 14 - 22).toFixed(1)}" y="${(ylR - 8).toFixed(1)}" width="44" height="13" rx="3" fill="${ok40r ? "rgba(245,158,11,.2)" : "rgba(239,68,68,.2)"}" stroke="${colR}" stroke-width=".7"/>`;
          s += `<text x="${(xg40r + 14).toFixed(1)}" y="${(ylR + 2).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="${colR}" font-weight="700">g\u2605=${clr40r.toFixed(2)}m${ok40r ? "" : " \u26A0"}</text>`;
        }
        if (sp.sag10_real != null) {
          s += `<polyline points="${catPts(q_bare, sp.T10_real, sp.sag10_real)}" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,3" opacity=".7"/>`;
        }
      }
      const xmid_px = sx(xm[i] + sp.L_m / 2);
      s += `<text x="${xmid_px.toFixed(1)}" y="${(MG.top + IH + 18).toFixed(1)}" text-anchor="middle" font-size="9" fill="#94a3b8">${sp.L_m.toFixed(0)} m</text>`;
      s += `<text x="${xmid_px.toFixed(1)}" y="${(MG.top + IH + 30).toFixed(1)}" text-anchor="middle" font-size="7.5" fill="#475569">${sp.acsr_key}${sp.dh !== 0 ? ` \u0394h=${sp.dh > 0 ? "+" : ""}${sp.dh.toFixed(1)}m` : ""}</text>`;
      s += `<line x1="${sx(xm[i]).toFixed(1)}" y1="${MG.top + IH}" x2="${sx(xm[i]).toFixed(1)}" y2="${MG.top + IH + 12}" stroke="#334155" stroke-width="1"/>`;
    });
    s += `<line x1="${sx(L_total).toFixed(1)}" y1="${MG.top + IH}" x2="${sx(L_total).toFixed(1)}" y2="${MG.top + IH + 12}" stroke="#334155" stroke-width="1"/>`;
    poles.forEach((p, i) => {
      const xp = sx(xm[i]);
      const cum = xm[i].toFixed(0);
      s += `<text x="${xp.toFixed(1)}" y="${(MG.top + IH + 44).toFixed(1)}" text-anchor="middle" font-size="7.5" fill="#64748b">${cum} m</text>`;
      s += `<line x1="${xp.toFixed(1)}" y1="${(MG.top + IH + 34).toFixed(1)}" x2="${xp.toFixed(1)}" y2="${(MG.top + IH + 37).toFixed(1)}" stroke="#475569" stroke-width="1"/>`;
    });
    poles.forEach((p, i) => {
      const xp = sx(xm[i]);
      const ct = p.cota_teren;
      const yt = sy(ct);
      const ya = sy(ct + p.H);
      const attach = ct + p.H;
      const isLast = i === poles.length - 1;
      const side = isLast ? -1 : 1;
      const anchor = isLast ? "end" : "start";
      const offX = side * 5;
      s += `<line x1="${xp.toFixed(1)}" y1="${yt.toFixed(1)}" x2="${xp.toFixed(1)}" y2="${ya.toFixed(1)}" stroke="#c07000" stroke-width="3"/>`;
      s += `<circle cx="${xp.toFixed(1)}" cy="${ya.toFixed(1)}" r="4" fill="#fbbf24" stroke="none"/>`;
      s += `<text x="${xp.toFixed(1)}" y="${(ya - 8).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="#fbbf24" font-weight="700">${p.label}</text>`;
      if (p.hasCota) {
        s += `<text x="${(xp + offX).toFixed(1)}" y="${(ya - 1).toFixed(1)}" text-anchor="${anchor}" font-size="7.5" fill="#fb923c" font-weight="600">${attach.toFixed(1)}</text>`;
      }
      if (p.hasCota) {
        s += `<text x="${(xp + offX).toFixed(1)}" y="${(yt + 11).toFixed(1)}" text-anchor="${anchor}" font-size="7.5" fill="#92400e">${ct.toFixed(1)} m</text>`;
      }
      const adjSpanForH = side > 0 ? spans[i]?.L_m ?? 999 : spans[i - 1]?.L_m ?? 999;
      if (adjSpanForH >= 30) {
        s += `<text x="${(xp + offX).toFixed(1)}" y="${((yt + ya) / 2 + 3).toFixed(1)}" text-anchor="${anchor}" font-size="7" fill="#c07000" opacity=".8">H=${p.H}m</text>`;
      }
      const annLines = [];
      if (p.pole_desc) annLines.push({ txt: p.pole_desc, col: "#94a3b8" });
      if (p.console_short) annLines.push({ txt: p.console_short, col: "#7dd3fc" });
      if (p.izolatie_lbl) annLines.push({ txt: p.izolatie_lbl, col: "#c084fc" });
      if (annLines.length) {
        const ann_y_bot = ya - 20 - (annLines.length - 1) * 10;
        s += `<line x1="${xp.toFixed(1)}" y1="${(ya - 10).toFixed(1)}" x2="${xp.toFixed(1)}" y2="${ann_y_bot.toFixed(1)}" stroke="#334155" stroke-width=".6" stroke-dasharray="2,3"/>`;
        annLines.forEach((ln, li) => {
          s += `<text x="${(xp + offX * 1.6).toFixed(1)}" y="${(ya - 20 - li * 10).toFixed(1)}" text-anchor="${anchor}" font-size="6.5" fill="${ln.col}" opacity=".9">${ln.txt}</text>`;
        });
      }
    });
    s += `<rect x="${MG.left}" y="${MG.top}" width="${IW}" height="${IH}" fill="none" stroke="rgba(148,163,184,.2)" stroke-width=".8"/>`;
    s += `<text x="${(W / 2).toFixed(1)}" y="15" text-anchor="middle" font-size="12.5" fill="#e2e8f0" font-weight="700">Profil \xEEn lung LEA 20kV \u2014 ${chain.label}</text>`;
    if (!hasCota) {
      s += `<text x="${(W / 2).toFixed(1)}" y="28" text-anchor="middle" font-size="8.5" fill="#f59e0b">\u26A0 Cotele de teren nu sunt introduse \u2014 profilul terenului nu este afi\u0219at</text>`;
    }
    const lx = MG.left + 8, ly = MG.top + 16;
    s += `<line x1="${lx}" y1="${ly}" x2="${lx + 20}" y2="${ly}" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="6,3"/>`;
    s += `<text x="${lx + 24}" y="${ly + 3}" font-size="8.5" fill="#4ade80">+10\xB0C</text>`;
    s += `<line x1="${lx + 65}" y1="${ly}" x2="${lx + 85}" y2="${ly}" stroke="#f97316" stroke-width="2"/>`;
    s += `<text x="${lx + 89}" y="${ly + 3}" font-size="8.5" fill="#f97316">+40\xB0C (gabarit)</text>`;
    const hasReal = spans.some((sp) => sp.sag40_real != null);
    if (hasReal) {
      s += `<line x1="${lx + 175}" y1="${ly}" x2="${lx + 195}" y2="${ly}" stroke="#f59e0b" stroke-width="2.5"/>`;
      s += `<text x="${lx + 199}" y="${ly + 3}" font-size="8.5" fill="#f59e0b" font-weight="700">\u2605 +40\xB0C real (teren)</text>`;
      s += `<line x1="${lx + 310}" y1="${ly}" x2="${lx + 330}" y2="${ly}" stroke="#92400e" stroke-width="2"/>`;
    } else {
      s += `<line x1="${lx + 175}" y1="${ly}" x2="${lx + 195}" y2="${ly}" stroke="#92400e" stroke-width="2"/>`;
    }
    const lx_teren = hasReal ? lx + 334 : lx + 199;
    s += `<text x="${lx_teren + 4}" y="${ly + 3}" font-size="8.5" fill="#92400e">teren</text>`;
    if (hasCota) {
      const lx_gab = lx_teren + 45;
      s += `<line x1="${lx_gab}" y1="${ly}" x2="${lx_gab + 20}" y2="${ly}" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity=".7"/>`;
      s += `<text x="${lx_gab + 24}" y="${ly + 3}" font-size="8.5" fill="#facc15" opacity=".8">gabarit ${GABARIT_MIN}m</text>`;
      const lx_ok = lx_gab + 100;
      s += `<line x1="${lx_ok}" y1="${ly - 4}" x2="${lx_ok}" y2="${ly + 4}" stroke="#22c55e" stroke-width="1.5"/>`;
      s += `<text x="${lx_ok + 4}" y="${ly + 3}" font-size="8.5" fill="#22c55e">g\u22657m \u2713</text>`;
      s += `<line x1="${lx_ok + 52}" y1="${ly - 4}" x2="${lx_ok + 52}" y2="${ly + 4}" stroke="#ef4444" stroke-width="1.5"/>`;
      s += `<text x="${lx_ok + 56}" y="${ly + 3}" font-size="8.5" fill="#ef4444">g&lt;7m \u26A0</text>`;
      if (!hasReal) {
        s += `<text x="${lx_ok + 112}" y="${ly + 3}" font-size="8" fill="#94a3b8">\u25A0 tip st\xE2lp</text>`;
        s += `<text x="${lx_ok + 172}" y="${ly + 3}" font-size="8" fill="#7dd3fc">\u25A0 consol\u0103</text>`;
        s += `<text x="${lx_ok + 222}" y="${ly + 3}" font-size="8" fill="#c084fc">\u25A0 izola\u021Bie</text>`;
      }
    }
    const scH = Math.max(1, Math.round(L_total / IW * 1e3));
    const scV = Math.max(1, Math.round(elev_range / IH * 100));
    const hasDh = spans.some((sp) => sp.dh && Math.abs(sp.dh) > 0.1);
    s += `<text x="${(W - MG.right + 4).toFixed(1)}" y="${(MG.top + IH + 60).toFixed(1)}" text-anchor="start" font-size="7.5" fill="#475569">Sc. horiz. 1:${scH} | Sc. vert. 1:${scV}${hasDh ? " | catenary exact\u0103 (dh\u22600)" : ""}</text>`;
    if (hasCota) {
      s += `<text x="${MG.left.toFixed(1)}" y="${(MG.top + IH + 60).toFixed(1)}" font-size="7.5" fill="#fb923c" opacity=".8"><tspan fill="#fb923c">\u25A0</tspan> cota prindere [m asl]  <tspan fill="#92400e">\u25A0</tspan> cota teren [m asl]</text>`;
    }
    s += "</svg>";
    return s;
  }
  function buildSummaryTable(chain) {
    const { poles, spans, hasCota } = chain;
    if (!spans.length) return "";
    const th = (txt, extra = "") => `<th style="padding:4px 8px;border:1px solid #1e293b;background:#0f172a;color:#94a3b8;font-weight:600;font-size:8.5px;text-align:center;white-space:nowrap${extra}">${txt}</th>`;
    const td = (txt, col = "#cbd5e1", bold = false, extra = "") => `<td style="padding:3px 7px;border:1px solid #1e293b;text-align:center;font-size:8.5px;color:${col};${bold ? "font-weight:700;" : ""}${extra}">${txt}</td>`;
    let head = "<tr>" + th("Tronson") + th("L [m]") + (hasCota ? th("\u0394h [m]") : "") + th("Conductor") + th("T\u2080 dim [daN]") + th("KP [%]") + th("f\u2084\u2080 [m]") + th("f\u2081\u2080 [m]") + (hasCota ? th("G\u2084\u2080 [m]") : "") + (hasCota ? th("G\u2081\u2080 [m]") : "") + "</tr>";
    let rows = spans.map((sp, i) => {
      const fromLbl = elLabel2(sp.fromId);
      const toLbl = elLabel2(sp.toId);
      const tronson = `${fromLbl} \u2192 ${toLbl}`;
      let g40Cell = "", g10Cell = "";
      if (hasCota) {
        const a_l = poles[i].cota_teren + poles[i].H;
        const a_r = poles[i + 1].cota_teren + poles[i + 1].H;
        const calcClearance = (sag, q, T) => {
          if (sag == null) return null;
          const xm = q && T ? sp.L_m / 2 - sp.dh * T / (q * sp.L_m) : sp.L_m / 2;
          const t = Math.max(0.01, Math.min(0.99, xm / sp.L_m));
          const cond = a_l + (a_r - a_l) * t - sag;
          const terr = poles[i].cota_teren + (poles[i + 1].cota_teren - poles[i].cota_teren) * t;
          return cond - terr;
        };
        const c40 = calcClearance(sp.sag40, sp.q40, sp.T40);
        const c10 = calcClearance(sp.sag10, sp.q10, sp.T10);
        const fmtG = (c) => c != null ? td(c.toFixed(2) + (c < GABARIT_MIN ? " \u26A0" : ""), c >= GABARIT_MIN ? "#22c55e" : "#ef4444", true) : td("\u2014", "#475569");
        g40Cell = fmtG(c40);
        g10Cell = fmtG(c10);
      }
      return "<tr>" + td(tronson, "#e2e8f0", false, "text-align:left") + td(sp.L_m != null ? sp.L_m.toFixed(0) : "\u2014") + (hasCota ? td(
        sp.dh != null ? (sp.dh > 0 ? "+" : "") + sp.dh.toFixed(1) : "\u2014",
        Math.abs(sp.dh) > 0.1 ? "#fb923c" : "#94a3b8"
      ) : "") + td(sp.acsr_key || "\u2014", "#7dd3fc") + td(sp.T0_dim != null ? sp.T0_dim.toFixed(0) : "\u2014", "#fbbf24") + td(sp.KP_calc != null ? (sp.KP_calc * 100).toFixed(0) + "%" : "\u2014", "#a78bfa") + td(sp.sag40 != null ? sp.sag40.toFixed(2) : "\u2014", "#f97316", sp.sag40 != null) + td(sp.sag10 != null ? sp.sag10.toFixed(2) : "\u2014", "#4ade80") + g40Cell + g10Cell + "</tr>";
    }).join("");
    return `<div style="overflow-x:auto;margin-top:0;margin-bottom:2px">
    <table style="border-collapse:collapse;background:#131c2e;width:100%;min-width:520px">
      <thead>${head}</thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
  }
  function openProfilLEA() {
    const panel = document.getElementById("PROFIL_LEA");
    if (panel) {
      panel.style.display = "flex";
      runProfilLEA();
    }
  }
  function closeProfilLEA() {
    const panel = document.getElementById("PROFIL_LEA");
    if (panel) panel.style.display = "none";
  }
  function runProfilLEA() {
    const container = document.getElementById("profil-lea-content");
    if (!container) return;
    const zEl = document.getElementById("sag-zone");
    const hEl = document.getElementById("sag-h");
    const kEl = document.getElementById("sag-kpdim");
    if (zEl) _zone2 = zEl.value || "D.b.4";
    if (hEl) _H_default = parseFloat(hEl.value) || 7;
    if (kEl) _kpdim2 = parseFloat(kEl.value) || null;
    _avSpan2 = document.getElementById("sag-av-span")?.checked ?? false;
    const chains = extractProfilData();
    if (!chains.length) {
      container.innerHTML = '<div style="padding:24px;color:#64748b;text-align:center;font-size:11px">Nicio linie MT g\u0103sit\u0103 \xEEn schem\u0103.</div>';
      return;
    }
    let html = "";
    chains.forEach((chain) => {
      const svg = buildProfilSVG(chain);
      if (!svg) return;
      html += `<div style="margin-bottom:4px;overflow-x:auto">${svg}</div>`;
      html += buildSummaryTable(chain);
      html += '<div style="margin-bottom:24px"></div>';
    });
    container.innerHTML = html || '<div style="padding:24px;color:#64748b;font-size:11px">Profilul nu poate fi generat (date insuficiente).</div>';
  }
  function exportProfilSVG() {
    const chains = extractProfilData();
    if (!chains.length) return;
    chains.forEach((chain) => {
      const svg = buildProfilSVG(chain);
      if (!svg) return;
      const name = `profil_lea_${chain.label.replace(/[→\s]+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}.svg`;
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // src/dxf-import.js
  init_state();
  init_utils();
  var LAYER_STYLES = [
    { match: "DRUMURI", stroke: "#3b75c8", sw: 1.4 },
    { match: "AX DRUM", stroke: "#7ba4e0", sw: 0.6, dash: "6,4" },
    { match: "CORP_PROPR", stroke: "#7a7a7a", sw: 0.9 },
    { match: "Imobile", stroke: "#c46a3a", sw: 1 },
    { match: "IMOBILE", stroke: "#c46a3a", sw: 1 },
    { match: "CV CANAL", stroke: "#44aacc", sw: 0.7, dash: "4,3" },
    { match: "CUTIE GAZ", stroke: "#e09d22", sw: 0.7 },
    { match: "NR_CAD", stroke: "#aaaaaa", sw: 0.4 },
    { match: "Cotari", stroke: "#aaaaaa", sw: 0.4 },
    { match: "pct_", stroke: "#cccccc", sw: 0.3 }
  ];
  var STYLE_DEFAULT = { stroke: "#888888", sw: 0.6 };
  function layerStyle(name) {
    for (const s of LAYER_STYLES) {
      if (name.includes(s.match)) return s;
    }
    return STYLE_DEFAULT;
  }
  function parseDxf(text) {
    const lines = text.split(/\r?\n/);
    const N = lines.length;
    let i = 0;
    function next() {
      while (i < N && lines[i].trim() === "") i++;
      if (i >= N) return null;
      const code = parseInt(lines[i++].trim(), 10);
      const val = i < N ? lines[i++].trim() : "";
      return { code, val };
    }
    const entities = [];
    let section = null;
    let etype = null;
    let layer = "";
    let x0, y0, x1, y1, cx, cy, r, sa, ea;
    let verts = [];
    let closed = false;
    function commit() {
      if (!etype) return;
      if (etype === "LINE" && x0 != null && x1 != null) {
        entities.push({ t: "L", layer, x0, y0, x1, y1 });
      } else if (etype === "POLY" && verts.length >= 2) {
        entities.push({ t: "P", layer, verts: verts.slice(), closed });
      } else if (etype === "CIRCLE" && cx != null && r > 0) {
        entities.push({ t: "C", layer, cx, cy, r });
      } else if (etype === "ARC" && cx != null && r > 0) {
        entities.push({ t: "A", layer, cx, cy, r, sa, ea });
      }
      etype = null;
      layer = "";
      verts = [];
      closed = false;
      x0 = y0 = x1 = y1 = cx = cy = r = sa = ea = void 0;
    }
    while (i < N) {
      const p = next();
      if (!p) break;
      const { code, val } = p;
      if (code === 0) {
        commit();
        if (val === "SECTION") {
          const sp = next();
          section = sp?.code === 2 ? sp.val : null;
        } else if (val === "ENDSEC") {
          section = null;
        } else if (section === "ENTITIES" || section === "BLOCKS") {
          if (val === "LINE") etype = "LINE";
          else if (val === "LWPOLYLINE") etype = "POLY";
          else if (val === "CIRCLE") etype = "CIRCLE";
          else if (val === "ARC") etype = "ARC";
          else etype = null;
        }
      } else if (etype) {
        if (code === 8) {
          layer = val;
        } else if (etype === "LINE") {
          if (code === 10) x0 = +val;
          else if (code === 20) y0 = +val;
          else if (code === 11) x1 = +val;
          else if (code === 21) y1 = +val;
        } else if (etype === "POLY") {
          if (code === 70) closed = (parseInt(val, 10) & 1) !== 0;
          else if (code === 10) verts.push({ x: +val, y: 0 });
          else if (code === 20 && verts.length) verts[verts.length - 1].y = +val;
        } else if (etype === "CIRCLE" || etype === "ARC") {
          if (code === 10) cx = +val;
          else if (code === 20) cy = +val;
          else if (code === 40) r = +val;
          else if (code === 50) sa = +val;
          else if (code === 51) ea = +val;
        }
      }
    }
    commit();
    return entities;
  }
  function pct(arr, p) {
    if (!arr.length) return 0;
    const s = arr.slice().sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  }
  function computeBbox(ents) {
    const xArr = [], yArr = [];
    for (const e of ents) {
      if (e.t === "L") {
        xArr.push(e.x0, e.x1);
        yArr.push(e.y0, e.y1);
      } else if (e.t === "P") {
        for (const v of e.verts) {
          xArr.push(v.x);
          yArr.push(v.y);
        }
      } else if (e.t === "C" || e.t === "A") {
        xArr.push(e.cx - e.r, e.cx + e.r);
        yArr.push(e.cy - e.r, e.cy + e.r);
      }
    }
    if (!xArr.length) return { cx: 0, cy: 0 };
    const xLo = pct(xArr, 0.02), xHi = pct(xArr, 0.98);
    const yLo = pct(yArr, 0.02), yHi = pct(yArr, 0.98);
    return { cx: (xLo + xHi) / 2, cy: (yLo + yHi) / 2 };
  }
  function entityPath(e, cx, cy, s) {
    const px = (x) => ((x - cx) * s).toFixed(2);
    const py = (y) => ((cy - y) * s).toFixed(2);
    if (e.t === "L") {
      return `M${px(e.x0)},${py(e.y0)}L${px(e.x1)},${py(e.y1)}`;
    }
    if (e.t === "P") {
      return e.verts.map((v, i) => (i ? "L" : "M") + px(v.x) + "," + py(v.y)).join("") + (e.closed ? "Z" : "");
    }
    if (e.t === "C") {
      const rcx = +px(e.cx), rcy = +py(e.cy), rr = +(e.r * s).toFixed(2);
      if (rr < 0.5) return "";
      return `M${(rcx - rr).toFixed(2)},${rcy} A${rr},${rr} 0 1 0 ${(rcx + rr).toFixed(2)},${rcy} A${rr},${rr} 0 1 0 ${(rcx - rr).toFixed(2)},${rcy}Z`;
    }
    if (e.t === "A") {
      const rr = +(e.r * s).toFixed(2);
      if (rr < 0.5) return "";
      const saR = e.sa * Math.PI / 180;
      const eaR = e.ea * Math.PI / 180;
      const sx2 = ((e.cx + e.r * Math.cos(saR) - cx) * s).toFixed(2);
      const sy2 = ((cy - (e.cy + e.r * Math.sin(saR))) * s).toFixed(2);
      const ex2 = ((e.cx + e.r * Math.cos(eaR) - cx) * s).toFixed(2);
      const ey2 = ((cy - (e.cy + e.r * Math.sin(eaR))) * s).toFixed(2);
      let sweep = e.ea - e.sa;
      if (sweep < 0) sweep += 360;
      return `M${sx2},${sy2}A${rr},${rr} 0 ${sweep > 180 ? 1 : 0} 0 ${ex2},${ey2}`;
    }
    return "";
  }
  function renderDxfLayer() {
    const el = document.getElementById("DXF");
    if (!el) return;
    if (!S.dxfData) {
      el.innerHTML = "";
      return;
    }
    const { allEntities, layerFilter, bscale, opacity } = S.dxfData;
    const fLow = (layerFilter || "").toLowerCase().trim();
    const visible = fLow ? allEntities.filter((e) => e.layer.toLowerCase().includes(fLow)) : allEntities;
    if (!visible.length) {
      el.innerHTML = "";
      return;
    }
    const { cx: bcx, cy: bcy } = computeBbox(visible);
    S.dxfData.bcx = bcx;
    S.dxfData.bcy = bcy;
    const byLayer = /* @__PURE__ */ new Map();
    for (const e of visible) {
      if (!byLayer.has(e.layer)) byLayer.set(e.layer, []);
      byLayer.get(e.layer).push(e);
    }
    let html = `<g opacity="${opacity ?? 0.65}">`;
    for (const [layer, ents] of byLayer) {
      const st = layerStyle(layer);
      let d = "";
      for (const e of ents) d += entityPath(e, bcx, bcy, bscale);
      if (!d) continue;
      const dashAttr = st.dash ? ` stroke-dasharray="${st.dash}"` : "";
      html += `<path d="${d}" stroke="${st.stroke}" stroke-width="${st.sw}" fill="none"${dashAttr}/>`;
    }
    html += "</g>";
    el.innerHTML = html;
  }
  function loadDxf(inp) {
    const f = inp && inp.files ? inp.files[0] : inp;
    if (!f) return;
    toast("Citesc DXF... (poate dura c\xE2teva secunde)", "ok");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const allEntities = parseDxf(ev.target.result);
        if (!allEntities.length) {
          toast("DXF: nu s-au g\u0103sit entit\u0103\u021Bi geometrice.", "err");
          return;
        }
        const bscale = S.pxPerMeter / 1e3;
        const layerSet = new Set(allEntities.map((e) => e.layer));
        S.dxfData = { allEntities, layerFilter: "", bcx: 0, bcy: 0, bscale, opacity: 0.65 };
        renderDxfLayer();
        toast(`DXF: ${allEntities.length} entit\u0103\u021Bi, ${layerSet.size} straturi.`, "ok");
        const ctrl = document.getElementById("dxf-controls");
        if (ctrl) ctrl.style.display = "flex";
        const info = document.getElementById("dxf-layer-info");
        if (info) {
          const tops = [...layerSet].slice(0, 80).join(", ");
          info.title = tops;
          info.textContent = layerSet.size + ' straturi. Filtreaz\u0103 de ex: "PS Don" sau "DRUM".';
        }
        const sl = document.getElementById("dxf-op");
        if (sl) sl.value = "0.65";
        const sf = document.getElementById("dxf-filter");
        if (sf) sf.value = "";
      } catch (err) {
        toast("Eroare DXF: " + err.message, "err");
      }
    };
    reader.onerror = () => toast("Eroare la citirea fi\u0219ierului.", "err");
    reader.readAsText(f, "windows-1250");
    if (inp && inp.value !== void 0) inp.value = "";
  }
  function setDxfFilter(text) {
    if (!S.dxfData) return;
    S.dxfData.layerFilter = text;
    renderDxfLayer();
  }
  function clearDxf() {
    S.dxfData = null;
    renderDxfLayer();
    const ctrl = document.getElementById("dxf-controls");
    if (ctrl) ctrl.style.display = "none";
    toast("Strat DXF \u0219ters.", "ok");
  }
  function setDxfOpacity(val) {
    if (!S.dxfData) return;
    S.dxfData.opacity = parseFloat(val);
    const g = document.querySelector("#DXF > g");
    if (g) g.setAttribute("opacity", S.dxfData.opacity);
  }
  function setDxfScale(factorPct) {
    if (!S.dxfData) return;
    S.dxfData.bscale = S.pxPerMeter / 1e3 * (parseFloat(factorPct) / 100);
    renderDxfLayer();
  }

  // src/app.js
  function init() {
    const svgEl = document.getElementById("svg");
    const VP = document.getElementById("VP");
    const NL = document.getElementById("NL");
    const CL = document.getElementById("CL");
    const GL = document.getElementById("GL");
    initUtils(svgEl, VP);
    initRenderer(svgEl, VP, NL, CL, GL);
    initKeyboard();
    const w = document.getElementById("cw");
    S.view.x = w.clientWidth / 2;
    S.view.y = w.clientHeight / 2;
    applyView();
    render();
    renderBg();
    const pb = document.getElementById("btn-prosumator");
    if (pb && !ENABLE_PROSUMER_MODULE) pb.style.display = "none";
    if (window.__TAURI__) return;
    startAutoSave();
    setAuthHandlers({
      onAuthSuccess: showProjectManagerAfterAuth,
      onLogout: () => {
      }
    });
    const hasSupabase = initSupabase();
    if (hasSupabase) {
      setupAuthStateListener();
      resumeSession(showProjectManagerAfterAuth).then((resumed) => {
        if (!resumed) showAuthScreen();
      }).catch(() => showAuthScreen());
    } else {
      showProjectManagerAfterAuth();
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const svgEl = document.getElementById("svg");
    if (svgEl) {
      svgEl.addEventListener("wheel", (e) => {
        e.preventDefault();
        const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        const r = svgEl.getBoundingClientRect();
        const ox = e.clientX - r.left, oy = e.clientY - r.top;
        S.view.x = ox - (ox - S.view.x) * f;
        S.view.y = oy - (oy - S.view.y) * f;
        S.view.s = Math.max(0.06, Math.min(14, S.view.s * f));
        applyView();
      }, { passive: false });
    }
    ["auth-email", "auth-pass", "auth-name"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") authSubmit();
      });
    });
  });
  window.addEventListener("beforeunload", (e) => {
    if (S.hasUnsavedChanges && (S.EL.length > 0 || S.CN.length > 0)) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  window.onload = init;
  window.onDn = onDn;
  window.onMv = onMv;
  window.onUp = onUp;
  window.setMultiFlow = setMultiFlow;
  window.render = render;
  window.renderBg = renderBg;
  window.applyView = applyView;
  window.S = S;
  window.setMode = setMode;
  window.startPlace = startPlace;
  window.toggleSub = toggleSub;
  window.toggleSnap = toggleSnap;
  window.toggleOrtho = toggleOrtho;
  window.updateStat = updateStat;
  window.toast = toast;
  window.toggleBgPanel = toggleBgPanel;
  window.loadBg = loadBg;
  window.updateBgOp = updateBgOp;
  window.updateBgLock = updateBgLock;
  window.clearBg = clearBg;
  window.startCalib = startCalib;
  window.confirmCalib = confirmCalib;
  window.closeCalib = closeCalib;
  window.toggleTheme = toggleTheme;
  window.toggleVDOverlay = toggleVDOverlay;
  window.toggleFlowAnim = toggleFlowAnim;
  window.renderFlowLayer = renderFlowLayer;
  window.saveState = saveState;
  window.undo = undo;
  window.redo = redo;
  window.copyEl = copyEl;
  window.pasteEl = pasteEl;
  window.addElem = addElem;
  window.delSel = delSel;
  window.updSel = updSel;
  window.rotateSel = rotateSel;
  window.setRotationAbs = setRotationAbs;
  window.selectEl = selectEl;
  window.updateConnectedCables = updateConnectedCables;
  window.finalConn = finalConn;
  window.setMTConnect = setMTConnect;
  window.startMTSpan = startMTSpan;
  window.addMTSpanFrom = addMTSpanFrom;
  window.updateProps = updateProps;
  window.clearAll = clearAll;
  window.toggleLeg = toggleLeg;
  window.buildLeg = buildLeg;
  window.toggleVD = toggleVD;
  window.runVD = runVD;
  window.copyVDTable = copyVDTable;
  window.populateVDCircuits = populateVDCircuits;
  window.updateGenSrcUI = updateGenSrcUI;
  window.toggleAutoDraw = toggleAutoDraw;
  window.openImportXLS = openImportXLS;
  window.addDerivRow = addDerivRow;
  window.runGenerator = runGenerator;
  window.generateVDTableSVG = generateVDTableSVG;
  window.save = save;
  window.saveAsNew = saveAsNew;
  window.exportJSON = exportJSON;
  window.load = load;
  window.showProjectManager = showProjectManager;
  window.hideProjectScreen = hideProjectScreen;
  window.deleteProject = deleteProject;
  window.renameProject = renameProject;
  window.recoverAutoSave = recoverAutoSave;
  window.dismissRecovery = dismissRecovery;
  window.newProject = newProject;
  window.showProjectManagerAfterAuth = showProjectManagerAfterAuth;
  window.markDirty = markDirty;
  window.renderProjectList = renderProjectList;
  window.toggleMTPanel = () => {
    const p = document.getElementById("mt-panel");
    const btn = document.getElementById("btn-mt-panel");
    const show = p.style.display !== "flex";
    p.style.display = show ? "flex" : "none";
    if (btn) btn.classList.toggle("active", show);
  };
  window.toggleAuthMode = toggleAuthMode;
  window.authSubmit = authSubmit;
  window.authLogout = authLogout;
  window.authSkip = authSkip;
  window.openAdminPanel = openAdminPanel;
  window.closeAdminPanel = closeAdminPanel;
  window.refreshAdminList = refreshAdminList;
  window.approveUser = approveUser;
  window.rejectUser = rejectUser;
  window.disableUser = disableUser;
  window.pendingLogout = pendingLogout;
  window.checkUserApproval = checkUserApproval;
  window.startExport = startExport;
  window.doExportPNG = doExportPNG;
  window.doExportSVG = doExportSVG;
  window.doExportPDF = doExportPDF;
  window.doExportDXF = doExportDXF;
  window.toggleExportMenu = toggleExportMenu;
  window.closeExportMenu = closeExportMenu;
  window.generateFC = generateFC;
  window.computeCantitatiFC = computeCantitatiFC;
  window.openSagMT = openSagMT;
  window.closeSagMT = closeSagMT;
  window.runSagMT = runSagMT;
  window.copySagMT = copySagMT;
  window.exportSagCalcDetails = exportSagCalcDetails;
  window.toggleSagOverlay = toggleSagOverlay;
  window.renderSagLayer = renderSagLayer;
  window.toggleMeasure = toggleMeasure;
  window.openProfilLEA = openProfilLEA;
  window.closeProfilLEA = closeProfilLEA;
  window.runProfilLEA = runProfilLEA;
  window.exportProfilSVG = exportProfilSVG;
  window.loadDxf = loadDxf;
  window.clearDxf = clearDxf;
  window.setDxfOpacity = setDxfOpacity;
  window.setDxfScale = setDxfScale;
  window.setDxfFilter = setDxfFilter;
  window.renderDxfLayer = renderDxfLayer;
  window.openFSModal = openFSModal;
  window.closeFSModal = closeFSModal;
  window.resetFSForm = resetFSForm;
  window.previewFS = previewFS;
  window.copyPreviewField = copyPreviewField;
  window.copyAllPreview = copyAllPreview;
  window.generateFS = generateFS;
})();
