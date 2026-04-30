// ElectroCAD Pro v12 — Application State
import { MAX_UNDO } from './config.js';

// Use window properties if already set by inline script (for migration period)
const w = typeof window !== 'undefined' ? window : {};

// Core state — reuse window vars if they exist (set by legacy inline script during migration)
export let EL = w.EL || [];
export let CN = w.CN || [];
export let sel = w.sel !== undefined ? w.sel : null;
export let multiSel = w.multiSel || new Set();
export let mode = w.mode || 'select';

// Pending element type (set by startPlace, used by addElem)
export let pendType = w.pendType || null;

// View state (pan/zoom)
export let view = w.view || { x: 0, y: 0, s: 1 };
export let panning = w.panning !== undefined ? w.panning : false;
export let panS = w.panS || { x: 0, y: 0 };

// Dragging state
export let dragging = w.dragging !== undefined ? w.dragging : false;
export let dragEl = w.dragEl || null;
export let dragOff = w.dragOff || { x: 0, y: 0 };
export let multiDragStart = w.multiDragStart || null;

// Vertex editing state
export let vxDrag = w.vxDrag !== undefined ? w.vxDrag : false;
export let vxConn = w.vxConn || null;
export let vxIdx = w.vxIdx !== undefined ? w.vxIdx : -1;

// Connection drawing state
export let connStart = w.connStart !== undefined ? w.connStart : null;
export let connPts = w.connPts || [];
export let connFromEl = w.connFromEl || null;
export let connFromTerm = w.connFromTerm || null;
export let connToEl = w.connToEl || null;
export let connToTerm = w.connToTerm || null;
export let connFromCircuit = w.connFromCircuit || null;
export let connToCircuit = w.connToCircuit || null;

// Arrow points, calibration points
export let arrPts = w.arrPts || [];
export let calibPts = w.calibPts || [];
export let tempCalibLenPx = w.tempCalibLenPx || 0;

// Export state
export let pendExport = w.pendExport || null;
export let exportRectStart = w.exportRectStart || null;
export let selRectStart = w.selRectStart || null;

// UI state
export let snapOn = w.snapOn !== undefined ? w.snapOn : true;
export let orthoOn = w.orthoOn !== undefined ? w.orthoOn : false;
export let shiftOn = w.shiftOn !== undefined ? w.shiftOn : false;

// Clipboard
export let clipboard = w.clipboard || null;

// Undo/Redo stacks
export let undoStack = w.undoStack || [];
export let redoStack = w.redoStack || [];

// Background image data
export let bgData = w.bgData || { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
export let draggingBg = w.draggingBg !== undefined ? w.draggingBg : false;

// Calibration: pixels per meter (set by calibration feature)
export let pxPerMeter = w.pxPerMeter || 0;

// Element counters
export let counters = w.counters || {};

// Voltage drop results
export let vdResults = w.vdResults || null;
export let vdOverlayOn = w.vdOverlayOn !== undefined ? w.vdOverlayOn : false;

// Flow animation
export let flowAnimOn = w.flowAnimOn !== undefined ? w.flowAnimOn : false;
export let lightMode = w.lightMode !== undefined ? w.lightMode : false;

// SVG element references (set in init)
export let svgEl = w.svgEl || null;
export let VP = w.VP || null;
export let NL = w.NL || null;
export let CL = w.CL || null;
export let GL = w.GL || null;

// Prosumator extra clients
export let prosExtraClients = w.prosExtraClients || [];

// ========== Setter functions for cross-module state mutation ==========

export function setMode(v) { mode = v; }
export function setSel(v) { sel = v; }
export function setMultiSel(v) { multiSel = v; }
export function setPendType(v) { pendType = v; }
export function setView(v) { view = v; }
export function setPanning(v) { panning = v; }
export function setPanS(v) { panS = v; }
export function setDragging(v) { dragging = v; }
export function setDragEl(v) { dragEl = v; }
export function setDragOff(v) { dragOff = v; }
export function setMultiDragStart(v) { multiDragStart = v; }
export function setVxDrag(v) { vxDrag = v; }
export function setVxConn(v) { vxConn = v; }
export function setVxIdx(v) { vxIdx = v; }
export function setConnStart(v) { connStart = v; }
export function setConnPts(v) { connPts = v; }
export function setConnFromEl(v) { connFromEl = v; }
export function setConnFromTerm(v) { connFromTerm = v; }
export function setConnToEl(v) { connToEl = v; }
export function setConnToTerm(v) { connToTerm = v; }
export function setConnFromCircuit(v) { connFromCircuit = v; }
export function setConnToCircuit(v) { connToCircuit = v; }
export function setArrPts(v) { arrPts = v; }
export function setCalibPts(v) { calibPts = v; }
export function setTempCalibLenPx(v) { tempCalibLenPx = v; }
export function setPendExport(v) { pendExport = v; }
export function setExportRectStart(v) { exportRectStart = v; }
export function setSelRectStart(v) { selRectStart = v; }
export function setSnapOn(v) { snapOn = v; }
export function setOrthoOn(v) { orthoOn = v; }
export function setShiftOn(v) { shiftOn = v; }
export function setClipboard(v) { clipboard = v; }
export function setBgData(v) { bgData = v; }
export function setDraggingBg(v) { draggingBg = v; }
export function setPxPerMeter(v) { pxPerMeter = v; }
export function setCounters(v) { counters = v; }
export function setVdResults(v) { vdResults = v; }
export function setVdOverlayOn(v) { vdOverlayOn = v; }
export function setFlowAnimOn(v) { flowAnimOn = v; }
export function setLightMode(v) { lightMode = v; }
export function setSvgEl(v) { svgEl = v; }
export function setVP(v) { VP = v; }
export function setNL(v) { NL = v; }
export function setCL(v) { CL = v; }
export function setGL(v) { GL = v; }
export function setProsExtraClients(v) { prosExtraClients = v; }
export function setEL(v) { EL = v; }
export function setCN(v) { CN = v; }

// ========== State Mutation Functions ==========

export function saveState(lbl) {
  undoStack.push({ lbl, E: JSON.stringify(EL), C: JSON.stringify(CN) });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}

export function undo() {
  if (!undoStack.length) { toast('Nimic de anulat', 'ac'); return; }
  redoStack.push({ E: JSON.stringify(EL), C: JSON.stringify(CN) });
  const s = undoStack.pop();
  EL = JSON.parse(s.E);
  CN = JSON.parse(s.C);
  sel = null;
  render();
  updateProps();
  updateStat();
  toast('↩ Undo', 'ok');
}

export function redo() {
  if (!redoStack.length) { toast('Nimic de refăcut', 'ac'); return; }
  undoStack.push({ E: JSON.stringify(EL), C: JSON.stringify(CN) });
  const s = redoStack.pop();
  EL = JSON.parse(s.E);
  CN = JSON.parse(s.C);
  sel = null;
  render();
  updateProps();
  updateStat();
  toast('↪ Redo', 'ok');
}
