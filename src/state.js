// Starea globală a aplicației — un singur obiect S importat de toate modulele.
// Mutațiile se fac direct pe proprietățile obiectului (S.sel = x, S.EL.push(...) etc.)

export const S = {
  // Date schemă
  EL: [],
  CN: [],

  // Selecție
  sel: null,
  multiSel: new Set(),
  selRect: null,
  selRectStart: null,

  // Mod interacțiune
  mode: 'select',
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

  // Fundal cadastral
  bgData: { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true },
  draggingBg: false,

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
  autoSaveInterval: 60000,
  lastAutoSave: 0,
  hasUnsavedChanges: false,

  // Autentificare Supabase
  supaClient: null,
  currentUser: null,
  authMode: 'login',
  currentProfile: null,

  // Prosumator
  prosExtraClients: [],

  // IndexedDB
  ecDB: null,

  // UI
  lightMode: false,
  toastTimer: null,
};
