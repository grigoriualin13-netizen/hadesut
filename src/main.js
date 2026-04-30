// ElectroCAD Pro v12 — Application Entry Point (main.js)
// This file bootstraps all modules and exposes functions needed by inline event handlers.

import { GRID, ENABLE_PROSUMER_MODULE, R0_TABLES, KS_RURAL, KS_URBAN, PROS_PROFILE, PROS_PV_PROFILE, FC_CATALOG, SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { EL, CN, sel, multiSel, mode, view, panning, panS, dragging, dragEl, dragOff, multiDragStart, vxDrag, vxConn, vxIdx, connStart, connPts, connFromEl, connFromTerm, connToEl, connToTerm, connFromCircuit, connToCircuit, arrPts, calibPts, tempCalibLenPx, pendExport, exportRectStart, snapOn, orthoOn, shiftOn, clipboard, undoStack, redoStack, bgData, draggingBg, counters, vdResults, vdOverlayOn, flowAnimOn, lightMode, svgEl, VP, NL, CL, GL, prosExtraClients, saveState, undo, redo, setSvgEl, setVP, setNL, setCL, setGL, setView } from './state.js';
import { uid, svgPt, sn, toast, termWorldPos, applyView, calcPathLen, nextLbl, showProjectScreen, hideProjectScreen, recoverAutoSave, dismissRecovery } from './utils.js';
import { sym, symW, symH } from './elements.js';
import { render, renderBg, renderFlowLayer, callbacks as rendererCallbacks } from './renderer.js';
import { addElem, updateConnectedCables, copyEl, pasteEl, delSel, updSel, rotateSel, setRotationAbs, toggleFuse, cdAllFuses, getCircuitChain, startPlace, toggleSub } from './element-manager.js';
import { setMode, selectEl, finalConn, updateProps, updateStat, onDn, onMv, onUp, toggleSnap, toggleOrtho } from './interaction.js';
import { buildColors, setMultiFlow, setStat, toggleFlowAnim, toggleTheme, clearAll, clearBg, toggleBgPanel, loadBg, updateBgOp, updateBgLock, startCalib, confirmCalib, closeCalib } from './ui.js';
import { calcDU_tronson, toggleLeg, buildLeg, toggleVD, runVD, toggleVDOverlay, populateVDCircuits, renderVDOverlay, updateGenSrcUI, toggleAutoDraw, addDerivRow, runGenerator, getR0, getX0, getKs } from './calculations.js';
import { getPTpower, csConsum, svgChart, pvProfile as pvProf } from './helpers.js';
import { openFSModal, closeFSModal, resetFSForm, previewFS, copyPreviewField, copyAllPreview, generateFS, generateFC } from './fs-module.js';
import { openProsumatorModal, closeProsumatorModal, toggleProsumator, runProsumator, prosAddExtraClient, prosRemoveExtraClient, prosUpdateExtraClient, prosRenderExtraClients, prosExportCSV, prosExportPDF, prosToggleMode, prosChartHover, prosChartHoverHide, prosPVProfile, prosRefreshNodeDropdown, aggregateSchema } from './prosumator.js';
import { getProjectBounds, startExport, buildExportSVG, doExportPNG, doExportSVG, doExportPDF, doExportDXF, exportJSON, resolveCSSVars, inlineStyles, renderToCanvas } from './export.js';
import { currentProjectId, currentProjectName, autoSaveTimer, autoSaveInterval, lastAutoSave, hasUnsavedChanges, saveProjectToDB, doAutoSave, startAutoSave, clearAutoSave, markDirty, save, saveAsNew, load, newProject, clearAll as projectClearAll, updateProjectNameUI, updateAutoSaveIndicator, showNameDialog, refreshProjectList, openProject as projectOpen, deleteProject as projectDelete, getProjectData, loadProjectData } from './project.js';

// ========== Stub functions for missing auth/project features ==========

function authSkip() { console.log('authSkip: not implemented'); if (window.toast) toast('Funcție în lucru', ''); }
function authSubmit() { console.log('authSubmit: not implemented'); if (window.toast) toast('Funcție în lucru', ''); }
function toggleAuthMode() { console.log('toggleAuthMode: not implemented'); }
function authLogout() { console.log('authLogout: not implemented'); if (window.toast) toast('Funcție în lucru', ''); }
function pendingLogout() { return false; }
function openAdminPanel() { console.log('openAdminPanel: not implemented'); if (window.toast) toast('Funcție în lucru', ''); }
function closeAdminPanel() { console.log('closeAdminPanel: not implemented'); }
function approveUser() { console.log('approveUser: not implemented'); }
function rejectUser() { console.log('rejectUser: not implemented'); }
function disableUser() { console.log('disableUser: not implemented'); }
function renameProject() { console.log('renameProject: not implemented'); if (window.toast) toast('Funcție în lucru', ''); }
function initSupabase() { console.log('initSupabase: not implemented'); }
function generateUUID() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ========== Expose to window for inline event handlers ==========

// Config constants
window.GRID = GRID;
window.ENABLE_PROSUMER_MODULE = ENABLE_PROSUMER_MODULE;
window.R0_TABLES = R0_TABLES;
window.KS_RURAL = KS_RURAL;
window.KS_URBAN = KS_URBAN;
window.PROS_PROFILE = PROS_PROFILE;
window.PROS_PV_PROFILE = PROS_PV_PROFILE;
window.FC_CATALOG = FC_CATALOG;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

// Core state (needed by inline HTML event handlers)
window.EL = EL;
window.CN = CN;
window.sel = sel;
window.multiSel = multiSel;
window.mode = mode;
window.view = view;
window.panning = panning;
window.panS = panS;
window.dragging = dragging;
window.dragEl = dragEl;
window.dragOff = dragOff;
window.multiDragStart = multiDragStart;
window.vxDrag = vxDrag;
window.vxConn = vxConn;
window.vxIdx = vxIdx;
window.connStart = connStart;
window.connPts = connPts;
window.connFromEl = connFromEl;
window.connFromTerm = connFromTerm;
window.connToEl = connToEl;
window.connToTerm = connToTerm;
window.connFromCircuit = connFromCircuit;
window.connToCircuit = connToCircuit;
window.arrPts = arrPts;
window.calibPts = calibPts;
window.tempCalibLenPx = tempCalibLenPx;
window.pendExport = pendExport;
window.exportRectStart = exportRectStart;
window.snapOn = snapOn;
window.orthoOn = orthoOn;
window.shiftOn = shiftOn;
window.clipboard = clipboard;
window.undoStack = undoStack;
window.redoStack = redoStack;
window.bgData = bgData;
window.draggingBg = draggingBg;
window.counters = counters;
window.vdResults = vdResults;
window.vdOverlayOn = vdOverlayOn;
window.flowAnimOn = flowAnimOn;
window.lightMode = lightMode;
window.svgEl = svgEl;
window.VP = VP;
window.NL = NL;
window.CL = CL;
window.GL = GL;
window.prosExtraClients = prosExtraClients;

// Core functions
window.setMode = setMode;
window.selectEl = selectEl;
window.finalConn = finalConn;
// updateProps is set by ui.js via callbacks.updateProps = updateProps
window.updateStat = updateStat;
window.setStat = setStat;
window.onDn = onDn;
window.onMv = onMv;
window.onUp = onUp;
window.saveState = saveState;
window.undo = undo;
window.redo = redo;
window.toggleSnap = toggleSnap;
window.toggleOrtho = toggleOrtho;
window.startPlace = startPlace;
window.toggleSub = toggleSub;
window.copyEl = copyEl;
window.pasteEl = pasteEl;
window.getCircuitChain = getCircuitChain;

// Element management
window.addElem = addElem;
window.updateConnectedCables = updateConnectedCables;
window.copyEl = copyEl;
window.pasteEl = pasteEl;
window.delSel = delSel;
window.updSel = updSel;
window.rotateSel = rotateSel;
window.setRotationAbs = setRotationAbs;
window.toggleFuse = toggleFuse;
window.cdAllFuses = cdAllFuses;
window.getCircuitChain = getCircuitChain;

// UI functions
window.buildColors = buildColors;
window.setMultiFlow = setMultiFlow;
window.toggleFlowAnim = toggleFlowAnim;
window.toggleTheme = toggleTheme;
window.toggleAutoDraw = toggleAutoDraw;
window.updateGenSrcUI = updateGenSrcUI;
window.addDerivRow = addDerivRow;
window.runGenerator = runGenerator;
window.clearAll = clearAll;
	window.clearBg = clearBg;
	window.toggleBgPanel = toggleBgPanel;
	window.loadBg = loadBg;
	window.updateBgOp = updateBgOp;
	window.updateBgLock = updateBgLock;
	window.startCalib = startCalib;
	window.confirmCalib = confirmCalib;
	window.closeCalib = closeCalib;

// Utils
window.uid = uid;
window.svgPt = svgPt;
window.sn = sn;
window.toast = toast;
window.termWorldPos = termWorldPos;
window.applyView = applyView;
window.getR0 = getR0;
window.getX0 = getX0;
window.getKs = getKs;
window.calcPathLen = calcPathLen;
window.nextLbl = nextLbl;
window.generateUUID = generateUUID;
// Auth functions
window.authLogout = authLogout;
window.authSkip = authSkip;
window.authSubmit = authSubmit;
window.toggleAuthMode = toggleAuthMode;
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.disableUser = disableUser;
window.renameProject = renameProject;
window.pendingLogout = pendingLogout;
window.initSupabase = initSupabase;

// Helpers
window.getPTpower = getPTpower;
window.csConsum = csConsum;
window.svgChart = svgChart;
window.pvProfile = pvProf;

// Rendering
window.render = render;
window.renderBg = renderBg;
window.renderFlowLayer = renderFlowLayer;

// Calculations & VD
window.toggleLeg = toggleLeg;
window.buildLeg = buildLeg;
window.toggleVD = toggleVD;
window.populateVDCircuits = populateVDCircuits;
window.runVD = runVD;
window.toggleVDOverlay = toggleVDOverlay;
window.renderVDOverlay = renderVDOverlay;
window.calcDU_tronson = calcDU_tronson;

// FS Module
window.openFSModal = openFSModal;
window.closeFSModal = closeFSModal;
window.resetFSForm = resetFSForm;
window.previewFS = previewFS;
window.copyPreviewField = copyPreviewField;
window.copyAllPreview = copyAllPreview;
window.generateFC = generateFC;
window.generateFS = generateFS;

// Prosumator Module
window.openProsumatorModal = openProsumatorModal;
window.closeProsumatorModal = closeProsumatorModal;
window.toggleProsumator = toggleProsumator;
window.runProsumator = runProsumator;
window.prosAddExtraClient = prosAddExtraClient;
window.prosRemoveExtraClient = prosRemoveExtraClient;
window.prosUpdateExtraClient = prosUpdateExtraClient;
window.prosRenderExtraClients = prosRenderExtraClients;
window.prosExportCSV = prosExportCSV;
window.prosExportPDF = prosExportPDF;
window.prosToggleMode = prosToggleMode;
window.prosChartHover = prosChartHover;
window.prosChartHoverHide = prosChartHoverHide;
window.prosPVProfile = prosPVProfile;
window.prosRefreshNodeDropdown = prosRefreshNodeDropdown;
window.aggregateSchema = aggregateSchema;

// Export Module
window.getProjectBounds = getProjectBounds;
window.startExport = startExport;
window.buildExportSVG = buildExportSVG;
window.doExportPNG = doExportPNG;
window.doExportSVG = doExportSVG;
window.doExportPDF = doExportPDF;
window.doExportDXF = doExportDXF;
window.exportJSON = exportJSON;
window.resolveCSSVars = resolveCSSVars;
window.inlineStyles = inlineStyles;
window.renderToCanvas = renderToCanvas;

// Project Module
window.currentProjectId = currentProjectId;
window.currentProjectName = currentProjectName;
window.saveProjectToDB = saveProjectToDB;
window.doAutoSave = doAutoSave;
window.startAutoSave = startAutoSave;
window.clearAutoSave = clearAutoSave;
window.markDirty = markDirty;
window.save = save;
window.saveAsNew = saveAsNew;
window.load = load;
window.newProject = newProject;
window.clearAll = projectClearAll;
window.updateProjectNameUI = updateProjectNameUI;
window.updateAutoSaveIndicator = updateAutoSaveIndicator;
window.showNameDialog = showNameDialog;
window.refreshProjectList = refreshProjectList;
window.renderProjectList = refreshProjectList;
window.openProject = projectOpen;
window.deleteProject = projectDelete;
window.getProjectData = getProjectData;
window.loadProjectData = loadProjectData;
window.hideProjectScreen = hideProjectScreen;
window.recoverAutoSave = recoverAutoSave;
window.dismissRecovery = dismissRecovery;

// ========== Tauri Integration ==========

const { invoke } = window.__TAURI__?.core || {};

if (invoke) {
  let greetInputEl, greetMsgEl;

  async function greet() {
    greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
  }

  window.addEventListener("DOMContentLoaded", () => {
    greetInputEl = document.querySelector("#greet-input");
    greetMsgEl = document.querySelector("#greet-msg");
    const greetForm = document.querySelector("#greet-form");
    if (greetForm) {
      greetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        greet();
      });
    }
  });
}

// ========== Helper functions for inline HTML handlers ==========

// showProjectManager is showProjectScreen from utils.js
window.showProjectManager = showProjectScreen;

// Export menu toggle/close
function toggleExportMenu() {
  const menu = document.getElementById('export-menu');
  if (menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
function closeExportMenu() {
  const menu = document.getElementById('export-menu');
  if (menu) menu.style.display = 'none';
}
window.toggleExportMenu = toggleExportMenu;
window.closeExportMenu = closeExportMenu;

// ========== Init ==========

window.addEventListener("DOMContentLoaded", () => {
  const w = document.getElementById('cw');
  if (w) {
    view.x = w.clientWidth / 2;
    view.y = w.clientHeight / 2;
    applyView();
    render();
    renderBg();
  }
  const pb = document.getElementById('btn-prosumator');
  if (pb && typeof ENABLE_PROSUMER_MODULE !== 'undefined' && !ENABLE_PROSUMER_MODULE) {
    pb.style.display = 'none';
  }

  // Attach SVG event listeners via addEventListener (inline handlers removed to avoid timing issues)
  const svgElement = document.getElementById('svg');
  if (svgElement) {
    setSvgEl(svgElement);
    svgElement.addEventListener('mousedown', e => { if (typeof onDn !== 'undefined') onDn(e); });
    svgElement.addEventListener('mousemove', e => { if (typeof onMv !== 'undefined') onMv(e); });
    svgElement.addEventListener('mouseup', e => { if (typeof onUp !== 'undefined') onUp(e); });
    // Set viewport and layer references
    const vp = svgElement.getElementById('vp');
    if (vp) setVP(vp);
    const nl = svgElement.getElementById('nl');
    if (nl) setNL(nl);
    const cl = svgElement.getElementById('cl');
    if (cl) setCL(cl);
    const gl = svgElement.getElementById('gl');
    if (gl) setGL(gl);
  }

  // Attach wheel event for zoom (was inline in original)
  if (svgEl) {
    svgEl.addEventListener('wheel', e => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const r = svgEl.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      setView({ x: ox - (ox - view.x) * f, y: oy - (oy - view.y) * f, s: Math.max(0.06, Math.min(14, view.s * f)) });
      applyView();
    }, { passive: false });
  }
});

console.log('ElectroCAD Pro v12 — modules loaded');
