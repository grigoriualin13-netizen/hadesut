// ElectroCAD Pro v12 — Project Management Module
import { EL, CN, bgData, sel, multiSel, undoStack, redoStack, counters, vdResults, saveState, setSel, setVdResults } from './state.js';
import { toast } from './utils.js';
import { updateStat } from './ui.js';
import { render, renderBg } from './renderer.js';
import { updateProps } from './interaction.js';

// ========== Project State ==========

export let currentProjectId = null;
export let currentProjectName = null;
export let autoSaveTimer = null;
export const autoSaveInterval = 60000; // 60 seconds
export let lastAutoSave = 0;
export let hasUnsavedChanges = false;

// ========== IndexedDB Helpers ==========

let ecDB = null;

function openDB() {
  return new Promise(function(resolve, reject) {
    if (ecDB) { resolve(ecDB); return; }
    var req = indexedDB.open('ElectroCAD_Projects', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('projects')) {
        var store = db.createObjectStore('projects', { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('autosave')) {
        db.createObjectStore('autosave', { keyPath: 'key' });
      }
    };
    req.onsuccess = function(e) { ecDB = e.target.result; resolve(ecDB); };
    req.onerror = function(e) { reject(e.target.error); };
  });
}

function dbPut(storeName, data) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(data);
      tx.oncomplete = function() { resolve(); };
      tx.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function dbGet(storeName, key) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(storeName, 'readonly');
      var req = tx.objectStore(storeName).get(key);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function dbGetAll(storeName) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(storeName, 'readonly');
      var req = tx.objectStore(storeName).getAll();
      req.onsuccess = function() { resolve(req.result || []); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function dbDelete(storeName, key) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = function() { resolve(); };
      tx.onerror = function(e) { reject(e.target.error); };
    });
  });
}

// ========== Project Data Helpers ==========

export function getProjectData() {
  return { EL, CN, bgData: bgData.url ? bgData : null };
}

export function loadProjectData(data) {
  EL.length = 0; CN.length = 0;
  if (data.EL) data.EL.forEach(e => EL.push(e));
  if (data.CN) data.CN.forEach(c => CN.push(c));
  if (data.bgData) Object.assign(bgData, data.bgData);
  setSel(null); multiSel.clear(); undoStack.length = 0; redoStack.length = 0;
  render(); renderBg(); updateProps(); updateStat();
}

// ========== Project Name UI ==========

export function updateProjectNameUI() {
  var el = document.getElementById('project-name-bar');
  if (el) el.textContent = currentProjectName || 'Proiect Nou';
  if (!window.__TAURI__) {
    document.title = (currentProjectName || 'Proiect Nou') + ' — ElectroCAD Pro v12';
  }
}

export function updateAutoSaveIndicator(text) {
  var el = document.getElementById('autosave-indicator');
  if (el) { el.textContent = text; setTimeout(function() { el.textContent = ''; }, 4000); }
}

// ========== Save Project ==========

export function saveProjectToDB(projectId, projectName) {
  var now = Date.now();
  var projData = getProjectData();
  var data = {
    id: projectId, name: projectName, data: projData,
    user_id: null, // TODO: get from auth module
    createdAt: null, updatedAt: now
  };
  return dbGet('projects', projectId).then(function(existing) {
    if (existing) data.createdAt = existing.createdAt;
    else data.createdAt = now;
    return dbPut('projects', data);
  });
}

export function doAutoSave() {
  if (!hasUnsavedChanges && currentProjectId) return;
  var asData = {
    key: 'current_autosave', projectId: currentProjectId, projectName: currentProjectName,
    data: getProjectData(), savedAt: Date.now()
  };
  dbPut('autosave', asData).then(function() {
    lastAutoSave = Date.now(); hasUnsavedChanges = false;
    var timeStr = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    updateAutoSaveIndicator('auto-save ' + timeStr);
  }).catch(function(e) { console.warn('Auto-save failed:', e); });
}

export function startAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(doAutoSave, autoSaveInterval);
}

export function clearAutoSave() {
  dbDelete('autosave', 'current_autosave').catch(function() {});
}

export function markDirty() { hasUnsavedChanges = true; }

// ========== Save / Save As ==========

export function save() {
  if (window.__TAURI__) { /* Tauri save */ return; }
  if (currentProjectId) {
    saveProjectToDB(currentProjectId, currentProjectName).then(function() {
      hasUnsavedChanges = false; clearAutoSave();
      toast('Proiect salvat: ' + currentProjectName, 'ok');
    }).catch(function(e) { toast('Eroare salvare: ' + e, ''); });
  } else {
    showNameDialog(function(name) {
      currentProjectId = genUUID();
      currentProjectName = name;
      updateProjectNameUI();
      saveProjectToDB(currentProjectId, currentProjectName).then(function() {
        hasUnsavedChanges = false; clearAutoSave();
        toast('Proiect salvat: ' + currentProjectName, 'ok');
      });
    });
  }
}

export function saveAsNew() {
  if (window.__TAURI__) { /* Tauri save */ return; }
  showNameDialog(function(name) {
    currentProjectId = genUUID();
    currentProjectName = name;
    updateProjectNameUI();
    saveProjectToDB(currentProjectId, currentProjectName).then(function() {
      hasUnsavedChanges = false; clearAutoSave();
      toast('Proiect salvat ca: ' + currentProjectName, 'ok');
    });
  }, currentProjectName ? currentProjectName + ' (copie)' : '');
}

// ========== Load / New Project ==========

export function load(inp) {
  if (!inp) return;
  var file = inp.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function() {
    try {
      var data = JSON.parse(reader.result);
      loadProjectData(data);
      currentProjectId = genUUID();
      currentProjectName = file.name.replace(/\.json$/i, '');
      updateProjectNameUI();
      toast('Proiect încărcat: ' + currentProjectName, 'ok');
    } catch (e) { toast('Eroare la încărcare: ' + e.message, ''); }
  };
  reader.readAsText(file);
  inp.value = '';
}

export function newProject() {
  if (hasUnsavedChanges && !confirm('Ai modificări nesalvate. Continui?')) return;
  EL.length = 0; CN.length = 0; setSel(null); multiSel.clear();
  Object.keys(counters).forEach(k => delete counters[k]);
  setVdResults(null); currentProjectId = null; currentProjectName = null;
  updateProjectNameUI();
  render(); renderBg(); updateProps(); updateStat();
  toast('Proiect nou creat', 'ok');
}

export function clearAll() {
  if (!confirm('Ești sigur că vrei să ștergi TOATĂ planșa?')) return;
  saveState('clear');
  EL.length = 0; CN.length = 0; setSel(null); multiSel.clear();
  Object.keys(counters).forEach(k => delete counters[k]);
  setVdResults(null); document.getElementById('VD-OVL')?.remove();
  render(); updateProps(); updateStat();
  toast('Planșa a fost ștearsă!', 'ok');
}

// ========== Export JSON ==========

export function exportJSON() {
  var data = { EL, CN, bgData: bgData.url ? bgData : null };
  var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var fname = (currentProjectName || 'proiect_electro').replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') + '.json';
  a.href = url; a.download = fname; a.click();
  URL.revokeObjectURL(url);
  toast('JSON exportat: ' + fname, 'ok');
}

// ========== Show Name Dialog ==========

export function showNameDialog(callback, defaultName) {
  var modal = document.getElementById('project-name-modal');
  var input = document.getElementById('project-name-input');
  if (modal && input) {
    input.value = defaultName || currentProjectName || '';
    modal.classList.add('show');
    input.focus(); input.select();
    function doSave() {
      var name = input.value.trim();
      if (!name) { input.style.borderColor = 'var(--danger)'; return; }
      modal.classList.remove('show');
      input.removeEventListener('keydown', onKey);
      callback(name);
    }
    function onKey(e) {
      if (e.key === 'Enter') doSave();
      if (e.key === 'Escape') { modal.classList.remove('show'); input.removeEventListener('keydown', onKey); }
    }
    input.addEventListener('keydown', onKey);
  }
}

// ========== Project List ==========

export function refreshProjectList() {
  dbGetAll('projects').then(function(projects) {
    var container = document.getElementById('project-list');
    if (!container) return;
    if (projects.length === 0) {
      container.innerHTML = '<div class="ps-empty">Niciun proiect salvat</div>';
      return;
    }
    projects.sort(function(a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    var html = '';
    projects.forEach(function(p) {
      html += `<div class="ps-item" onclick="openProject('${p.id}', 'local')">
        <div class="ps-item-info"><div class="ps-item-name">${p.name}</div>
        <div class="ps-item-meta">Modificat: ${new Date(p.updatedAt).toLocaleDateString('ro-RO')}</div></div>
        <button class="ps-item-del" onclick="event.stopPropagation(); deleteProject('${p.id}')">🗑</button></div>`;
    });
    container.innerHTML = html;
  }).catch(function() {});
}

export function openProject(projectId, source) {
  dbGet('projects', projectId).then(function(proj) {
    if (!proj) { toast('Proiect negăsit!', ''); return; }
    loadProjectData(proj.data);
    currentProjectId = projectId; currentProjectName = proj.name;
    updateProjectNameUI();
    var screen = document.getElementById('project-screen');
    if (screen) screen.classList.add('hidden');
    toast('Proiect deschis: ' + proj.name, 'ok');
  });
}

export function deleteProject(projectId) {
  if (!confirm('Ștergi acest proiect?')) return;
  dbDelete('projects', projectId).then(function() {
    refreshProjectList();
    toast('Proiect șters', 'ok');
  });
}
