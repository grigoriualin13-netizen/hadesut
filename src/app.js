import { S } from './state.js';
import { ENABLE_PROSUMER_MODULE } from './config.js';
import {
  initUtils, applyView, toast, setMode, startPlace,
  toggleSub, toggleSnap, toggleOrtho, updateStat
} from './utils.js';
import {
  initRenderer, render, renderBg, getSvgEl,
  toggleBgPanel, loadBg, updateBgOp, updateBgLock, clearBg,
  startCalib, confirmCalib, closeCalib,
  toggleTheme, toggleVDOverlay, toggleFlowAnim, renderFlowLayer
} from './renderer.js';
import { onDn, onMv, onUp, initKeyboard, setMultiFlow, toggleMeasure } from './interaction.js';
import {
  updateProps, clearAll, toggleLeg, buildLeg,
  toggleVD, runVD, populateVDCircuits, copyVDTable,
  updateGenSrcUI, toggleAutoDraw, addDerivRow, runGenerator,
  generateVDTableSVG
} from './ui.js';
import {
  saveState, undo, redo, copyEl, pasteEl,
  addElem, delSel, updSel, rotateSel, setRotationAbs,
  selectEl, updateConnectedCables, finalConn,
  setMTConnect, startMTSpan, addMTSpanFrom
} from './element-manager.js';
import {
  startAutoSave, save, saveAsNew, exportJSON, load,
  showProjectManager, hideProjectScreen,
  deleteProject, renameProject, recoverAutoSave,
  dismissRecovery, newProject, showProjectManagerAfterAuth,
  markDirty, renderProjectList
} from './project.js';
import {
  initSupabase, showAuthScreen, hideAuthScreen,
  toggleAuthMode, authSubmit, authLogout, authSkip,
  updateUserBar, openAdminPanel, closeAdminPanel,
  refreshAdminList, approveUser, rejectUser, disableUser,
  checkUserApproval, pendingLogout, setAuthHandlers,
  resumeSession, setupAuthStateListener
} from './auth.js';
import {
  startExport, buildExportSVG,
  doExportPNG, doExportSVG, doExportPDF, doExportDXF,
  toggleExportMenu, closeExportMenu
} from './export.js';
import { generateFC, computeCantitatiFC } from './fc-helpers.js';
import {
  openFSModal, closeFSModal, resetFSForm, previewFS,
  copyPreviewField, copyAllPreview, generateFS
} from './fs-module.js';
import './prosumator.js'; // side-effect: sets window.runProsumator etc.
import { openImportXLS } from './import-xls.js';
import { openSagMT, closeSagMT, runSagMT, copySagMT, exportSagCalcDetails, toggleSagOverlay, renderSagLayer } from './sag-mt.js';

// ── Init ──────────────────────────────────────────────────────────────────

function init() {
  const svgEl = document.getElementById('svg');
  const VP    = document.getElementById('VP');
  const NL    = document.getElementById('NL');
  const CL    = document.getElementById('CL');
  const GL    = document.getElementById('GL');

  initUtils(svgEl, VP);
  initRenderer(svgEl, VP, NL, CL, GL);
  initKeyboard();

  const w = document.getElementById('cw');
  S.view.x = w.clientWidth / 2;
  S.view.y = w.clientHeight / 2;
  applyView();
  render();
  renderBg();

  const pb = document.getElementById('btn-prosumator');
  if (pb && !ENABLE_PROSUMER_MODULE) pb.style.display = 'none';

  if (window.__TAURI__) return;

  startAutoSave();

  setAuthHandlers({
    onAuthSuccess: showProjectManagerAfterAuth,
    onLogout: () => {},
  });

  const hasSupabase = initSupabase();
  if (hasSupabase) {
    setupAuthStateListener();
    resumeSession(showProjectManagerAfterAuth).then(resumed => {
      if (!resumed) showAuthScreen();
    }).catch(() => showAuthScreen());
  } else {
    showProjectManagerAfterAuth();
  }
}

// ── SVG wheel + auth enter keys on DOM ready ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const svgEl = document.getElementById('svg');
  if (svgEl) {
    svgEl.addEventListener('wheel', e => {
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

  ['auth-email', 'auth-pass', 'auth-name'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') authSubmit(); });
  });
});

window.addEventListener('beforeunload', e => {
  if (S.hasUnsavedChanges && (S.EL.length > 0 || S.CN.length > 0)) {
    e.preventDefault();
    e.returnValue = '';
  }
});

window.onload = init;

// ── Window globals ────────────────────────────────────────────────────────
// SVG mouse handlers (used by HTML onmousedown/onmousemove/onmouseup attrs)
window.onDn = onDn;
window.onMv = onMv;
window.onUp = onUp;
window.setMultiFlow = setMultiFlow;

// Core rendering
window.render    = render;
window.renderBg  = renderBg;
window.applyView = applyView;
window.S         = S;

// Utils
window.setMode      = setMode;
window.startPlace   = startPlace;
window.toggleSub    = toggleSub;
window.toggleSnap   = toggleSnap;
window.toggleOrtho  = toggleOrtho;
window.updateStat   = updateStat;
window.toast        = toast;

// Renderer
window.toggleBgPanel   = toggleBgPanel;
window.loadBg          = loadBg;
window.updateBgOp      = updateBgOp;
window.updateBgLock    = updateBgLock;
window.clearBg         = clearBg;
window.startCalib      = startCalib;
window.confirmCalib    = confirmCalib;
window.closeCalib      = closeCalib;
window.toggleTheme     = toggleTheme;
window.toggleVDOverlay = toggleVDOverlay;
window.toggleFlowAnim  = toggleFlowAnim;
window.renderFlowLayer = renderFlowLayer;

// Element manager
window.saveState      = saveState;
window.undo           = undo;
window.redo           = redo;
window.copyEl         = copyEl;
window.pasteEl        = pasteEl;
window.addElem        = addElem;
window.delSel         = delSel;
window.updSel         = updSel;
window.rotateSel      = rotateSel;
window.setRotationAbs = setRotationAbs;
window.selectEl       = selectEl;
window.updateConnectedCables = updateConnectedCables;
window.finalConn      = finalConn;
window.setMTConnect   = setMTConnect;
window.startMTSpan    = startMTSpan;
window.addMTSpanFrom  = addMTSpanFrom;

// UI
window.updateProps       = updateProps;
window.clearAll          = clearAll;
window.toggleLeg         = toggleLeg;
window.buildLeg          = buildLeg;
window.toggleVD          = toggleVD;
window.runVD             = runVD;
window.copyVDTable       = copyVDTable;
window.populateVDCircuits = populateVDCircuits;
window.updateGenSrcUI    = updateGenSrcUI;
window.toggleAutoDraw    = toggleAutoDraw;
window.openImportXLS     = openImportXLS;
window.addDerivRow       = addDerivRow;

window.runGenerator      = runGenerator;
window.generateVDTableSVG = generateVDTableSVG;

// Project
window.save                    = save;
window.saveAsNew               = saveAsNew;
window.exportJSON              = exportJSON;
window.load                    = load;
window.showProjectManager      = showProjectManager;
window.hideProjectScreen       = hideProjectScreen;
window.deleteProject           = deleteProject;
window.renameProject           = renameProject;
window.recoverAutoSave         = recoverAutoSave;
window.dismissRecovery         = dismissRecovery;
window.newProject              = newProject;
window.showProjectManagerAfterAuth = showProjectManagerAfterAuth;
window.markDirty               = markDirty;
window.renderProjectList       = renderProjectList;

// MT Panel toggle
window.toggleMTPanel = () => {
  const p = document.getElementById('mt-panel');
  const btn = document.getElementById('btn-mt-panel');
  const show = p.style.display !== 'flex';
  p.style.display = show ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', show);
};

// Auth
window.toggleAuthMode    = toggleAuthMode;
window.authSubmit        = authSubmit;
window.authLogout        = authLogout;
window.authSkip          = authSkip;
window.openAdminPanel    = openAdminPanel;
window.closeAdminPanel   = closeAdminPanel;
window.refreshAdminList  = refreshAdminList;
window.approveUser       = approveUser;
window.rejectUser        = rejectUser;
window.disableUser       = disableUser;
window.pendingLogout     = pendingLogout;
window.checkUserApproval = checkUserApproval;

// Export
window.startExport      = startExport;
window.doExportPNG      = doExportPNG;
window.doExportSVG      = doExportSVG;
window.doExportPDF      = doExportPDF;
window.doExportDXF      = doExportDXF;
window.toggleExportMenu = toggleExportMenu;
window.closeExportMenu  = closeExportMenu;

// Fișa de Calcul
window.generateFC         = generateFC;
window.computeCantitatiFC = computeCantitatiFC;

// Calcul Săgeată + Deviație MT
window.openSagMT        = openSagMT;
window.closeSagMT       = closeSagMT;
window.runSagMT         = runSagMT;
window.copySagMT           = copySagMT;
window.exportSagCalcDetails = exportSagCalcDetails;
window.toggleSagOverlay    = toggleSagOverlay;
window.renderSagLayer   = renderSagLayer;
window.toggleMeasure    = toggleMeasure;

// Fișa de Soluție (also set by fs-module.js itself, kept here for explicitness)
window.openFSModal      = openFSModal;
window.closeFSModal     = closeFSModal;
window.resetFSForm      = resetFSForm;
window.previewFS        = previewFS;
window.copyPreviewField = copyPreviewField;
window.copyAllPreview   = copyAllPreview;
window.generateFS       = generateFS;
