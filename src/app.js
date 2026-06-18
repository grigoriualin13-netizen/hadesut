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
import { onDn, onMv, onUp, initKeyboard, setMultiFlow, toggleMeasure, startDim, clearDims } from './interaction.js';
import {
  updateProps, clearAll, toggleLeg, buildLeg,
  toggleVD, runVD, populateVDCircuits, copyVDTable,
  updateGenSrcUI, toggleAutoDraw, addDerivRow, runGenerator,
  generateVDTableSVG, adjustFiridaCircuits, setFiridaRating, distributeElements
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
  resumeSession, setupAuthStateListener, isCurrentUserAdmin
} from './auth.js';
import { renderDimLayer } from './renderer.js';
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
import { toggleAIPanel, generateFSWithAI, fsAiProviderChange } from './fs-ai.js';
import {
  openFSTemplatesEditor, closeFSTemplatesEditor,
  fstSelectTemplate, fstSave, fstDelete, fstNewTemplate,
} from './fs-templates-editor.js';
import './prosumator.js'; // side-effect: sets window.runProsumator etc.
import { openImportXLS } from './import-xls.js';
import { openSagMT, closeSagMT, runSagMT, copySagMT, exportSagCalcDetails, toggleSagOverlay, renderSagLayer } from './sag-mt.js';
import { openProfilLEA, closeProfilLEA, runProfilLEA, exportProfilSVG } from './profil-lea.js';
import { loadDxf, clearDxf, setDxfOpacity, setDxfScale, setDxfFilter, renderDxfLayer, toggleDxfLayerList, toggleDxfLayerCheck, clearDxfLayerSel, getDxfSnapPoint, fitDxfToView } from './dxf-import.js';

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
    onAuthSuccess: () => { _applyFeatureGating(); showProjectManagerAfterAuth(); },
    onLogout: () => { _applyFeatureGating(); },
    onStateChange: () => { _applyFeatureGating(); },
  });

  const hasSupabase = initSupabase();
  if (hasSupabase) {
    setupAuthStateListener();
    resumeSession(() => { _applyFeatureGating(); showProjectManagerAfterAuth(); }).then(resumed => {
      if (!resumed) showAuthScreen();
    }).catch(() => showAuthScreen());
  } else {
    showProjectManagerAfterAuth();
  }
}

// ── Feature gating ────────────────────────────────────────────────────────

function _applyFeatureGating() {
  const ok = isCurrentUserAdmin();
  const mt = document.getElementById('mt-section');
  if (mt) mt.style.display = ok ? 'contents' : 'none';
  const sag = document.getElementById('btn-sag-mt');
  if (sag) sag.style.display = ok ? '' : 'none';
}

// ── Touch support (mobile) ────────────────────────────────────────────────

function _initTouch(svgEl) {
  let _pinchDist = 0;
  let _pinchActive = false;
  let _touchDragging = false;

  function fakeEv(type, touch, orig) {
    return {
      type, clientX: touch.clientX, clientY: touch.clientY,
      button: 0, buttons: type === 'mouseup' ? 0 : 1,
      ctrlKey: orig.ctrlKey || false, metaKey: orig.metaKey || false,
      shiftKey: orig.shiftKey || false,
      target: orig.target,
      preventDefault() {}, stopPropagation() {}
    };
  }

  function dist2(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  svgEl.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      _pinchActive = true;
      _pinchDist = dist2(e);
      if (_touchDragging) { onUp(fakeEv('mouseup', e.touches[0], e)); _touchDragging = false; }
    } else if (e.touches.length === 1 && !_pinchActive) {
      _touchDragging = true;
      onDn(fakeEv('mousedown', e.touches[0], e));
    }
  }, { passive: false });

  let _pinchCx = 0, _pinchCy = 0;

  svgEl.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      if (!_pinchActive) {
        _pinchActive = true; _pinchDist = dist2(e);
        _pinchCx = cx; _pinchCy = cy;
        return;
      }
      const d = dist2(e);
      const f = d / _pinchDist;
      _pinchDist = d;
      const r = svgEl.getBoundingClientRect();
      const ox = cx - r.left, oy = cy - r.top;
      // zoom around pinch center
      S.view.x = ox - (ox - S.view.x) * f;
      S.view.y = oy - (oy - S.view.y) * f;
      S.view.s = Math.max(0.06, Math.min(14, S.view.s * f));
      // pan from center movement
      S.view.x += cx - _pinchCx;
      S.view.y += cy - _pinchCy;
      _pinchCx = cx; _pinchCy = cy;
      applyView();
    } else if (e.touches.length === 1 && _touchDragging) {
      onMv(fakeEv('mousemove', e.touches[0], e));
    }
  }, { passive: false });

  svgEl.addEventListener('touchend', e => {
    e.preventDefault();
    if (e.touches.length === 0) _pinchActive = false;
    if (e.touches.length < 2) _pinchActive = false;
    if (_touchDragging && e.changedTouches.length > 0) {
      onUp(fakeEv('mouseup', e.changedTouches[0], e));
      _touchDragging = false;
    }
  }, { passive: false });
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
    _initTouch(svgEl);
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
window.adjustFiridaCircuits = adjustFiridaCircuits;
window.setFiridaRating      = setFiridaRating;
window.distributeElements   = distributeElements;

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
window.startDim         = startDim;
window.clearDims        = clearDims;
window.renderDimLayer   = renderDimLayer;

// Profil în lung LEA
window.openProfilLEA   = openProfilLEA;
window.closeProfilLEA  = closeProfilLEA;
window.runProfilLEA    = runProfilLEA;
window.exportProfilSVG = exportProfilSVG;

// DXF vectorial background
window.loadDxf             = loadDxf;
window.clearDxf            = clearDxf;
window.fitDxfToView        = fitDxfToView;
window.setDxfOpacity       = setDxfOpacity;
window.setDxfScale         = setDxfScale;
window.setDxfFilter        = setDxfFilter;
window.renderDxfLayer      = renderDxfLayer;
window.toggleDxfLayerList  = toggleDxfLayerList;
window.toggleDxfLayerCheck = toggleDxfLayerCheck;
window.clearDxfLayerSel    = clearDxfLayerSel;

// Fișa de Soluție (also set by fs-module.js itself, kept here for explicitness)
window.openFSModal      = openFSModal;
window.closeFSModal     = closeFSModal;
window.resetFSForm      = resetFSForm;
window.previewFS        = previewFS;
window.copyPreviewField = copyPreviewField;
window.copyAllPreview   = copyAllPreview;
window.generateFS       = generateFS;

// Fișa de Soluție — AI (Groq / Gemini, complet separat)
window.toggleAIPanel     = toggleAIPanel;
window.generateFSWithAI  = generateFSWithAI;
window.fsAiProviderChange = fsAiProviderChange;

// FS Templates Editor (admin only)
window.openFSTemplatesEditor  = openFSTemplatesEditor;
window.closeFSTemplatesEditor = closeFSTemplatesEditor;
window.fstSelectTemplate      = fstSelectTemplate;
window.fstSave                = fstSave;
window.fstDelete              = fstDelete;
window.fstNewTemplate         = fstNewTemplate;
