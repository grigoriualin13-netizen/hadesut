import { S } from './state.js';
import { render, renderBg } from './renderer.js';
import { updateProps } from './ui.js';
import { toast, generateUUID, updateStat } from './utils.js';
import { getCloudFunctions } from './auth.js';

// ── IndexedDB ──
let ecDB = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (ecDB) { resolve(ecDB); return; }
    const req = indexedDB.open('ElectroCAD_Projects', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('autosave')) db.createObjectStore('autosave', { keyPath: 'key' });
    };
    req.onsuccess = e => { ecDB = e.target.result; resolve(ecDB); };
    req.onerror = e => reject(e.target.error);
  });
}

function dbPut(storeName, data) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(data);
    tx.oncomplete = () => resolve(); tx.onerror = e => reject(e.target.error);
  }));
}

function dbGet(storeName, key) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result); req.onerror = e => reject(e.target.error);
  }));
}

function dbGetAll(storeName) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []); req.onerror = e => reject(e.target.error);
  }));
}

function dbDelete(storeName, key) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve(); tx.onerror = e => reject(e.target.error);
  }));
}

// ── State ──
let currentProjectId = null;
let currentProjectName = null;
let autoSaveTimer = null;
const autoSaveInterval = 60000;
let hasUnsavedChanges = false;

export function markDirty() { hasUnsavedChanges = true; }

function getProjectData() {
  return { EL: S.EL, CN: S.CN, bgData: S.bgData.url ? S.bgData : null };
}

function loadProjectData(data) {
  S.EL = data.EL || []; S.CN = data.CN || [];
  if (data.bgData) S.bgData = data.bgData;
  else S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
  S.sel = null; S.multiSel.clear(); S.undoStack = []; S.redoStack = [];
  render(); renderBg(); updateProps(); updateStat();
}

function updateProjectNameUI() {
  const el = document.getElementById('project-name-bar');
  if (el) el.textContent = currentProjectName || 'Proiect Nou';
  document.title = (currentProjectName || 'Proiect Nou') + ' — ElectroCAD Pro v12';
}

function updateAutoSaveIndicator(text) {
  const el = document.getElementById('autosave-indicator');
  if (el) { el.textContent = text; setTimeout(() => { el.textContent = ''; }, 4000); }
}

function getLocalUserId() {
  const { currentUser } = getCloudFunctions();
  return currentUser ? currentUser.id : 'local';
}

function saveProjectToDB(projectId, projectName) {
  const now = Date.now();
  const projData = getProjectData();
  const data = { id: projectId, name: projectName, data: projData, user_id: getLocalUserId(), createdAt: null, updatedAt: now };
  const { currentUser, supaClient, cloudSaveProject } = getCloudFunctions();
  const localSave = dbGet('projects', projectId).then(existing => {
    data.createdAt = existing ? existing.createdAt : now;
    return dbPut('projects', data);
  });
  if (currentUser && supaClient) {
    cloudSaveProject(projectId, projectName, projData).then(res => {
      updateAutoSaveIndicator(res ? '☁ cloud sync OK' : '☁ cloud sync EROARE');
    }).catch(e => { console.error('Cloud sync failed:', e); updateAutoSaveIndicator('☁ sync eroare'); });
  }
  return localSave;
}

function doAutoSave() {
  if (!hasUnsavedChanges && currentProjectId) return;
  const asData = { key: 'current_autosave', projectId: currentProjectId, projectName: currentProjectName, data: getProjectData(), savedAt: Date.now() };
  dbPut('autosave', asData).then(() => {
    hasUnsavedChanges = false;
    const timeStr = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    updateAutoSaveIndicator('auto-save ' + timeStr);
  }).catch(e => console.warn('Auto-save failed:', e));
}

export function startAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(doAutoSave, autoSaveInterval);
}

function clearAutoSave() {
  dbDelete('autosave', 'current_autosave').catch(() => {});
}

// ── Save / Load ──
export function save() {
  if (currentProjectId) {
    saveProjectToDB(currentProjectId, currentProjectName).then(() => {
      hasUnsavedChanges = false; clearAutoSave();
      toast('Proiect salvat: ' + currentProjectName, 'ok');
    }).catch(e => toast('Eroare salvare: ' + e, ''));
  } else {
    showNameDialog(name => {
      currentProjectId = generateUUID(); currentProjectName = name;
      updateProjectNameUI();
      saveProjectToDB(currentProjectId, currentProjectName).then(() => {
        hasUnsavedChanges = false; clearAutoSave();
        toast('Proiect salvat: ' + currentProjectName, 'ok');
      });
    });
  }
}

export function saveAsNew() {
  showNameDialog(name => {
    currentProjectId = generateUUID(); currentProjectName = name;
    updateProjectNameUI();
    saveProjectToDB(currentProjectId, currentProjectName).then(() => {
      hasUnsavedChanges = false; clearAutoSave();
      toast('Proiect salvat ca: ' + currentProjectName, 'ok');
    });
  }, currentProjectName ? currentProjectName + ' (copie)' : '');
}

export function exportJSON() {
  const data = { EL: S.EL, CN: S.CN, bgData: S.bgData.url ? S.bgData : null };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  const fname = (currentProjectName || 'proiect_electro').replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') + '.json';
  a.href = url; a.download = fname; a.click(); URL.revokeObjectURL(url);
  toast('JSON exportat: ' + fname, 'ok');
}

export function load(inp) {
  const f = inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      loadProjectData(data);
      currentProjectId = null;
      currentProjectName = f.name.replace('.json', '').replace(/_/g, ' ');
      updateProjectNameUI();
      hideProjectScreen();
      toast('Proiect încărcat din fișier: ' + f.name, 'ok');
    } catch (err) { toast('Eroare la încărcare — fișier corupt!', 'danger'); }
  };
  r.readAsText(f); inp.value = '';
}

// ── Name dialog ──
function showNameDialog(callback, defaultName) {
  const modal = document.getElementById('project-name-modal');
  const input = document.getElementById('pn-input');
  input.value = defaultName || ''; modal.classList.add('show'); input.focus(); input.select();
  function doSave() {
    const name = input.value.trim();
    if (!name) { input.style.borderColor = 'var(--danger)'; return; }
    modal.classList.remove('show'); input.removeEventListener('keydown', onKey); callback(name);
  }
  function onKey(e) { if (e.key === 'Enter') doSave(); if (e.key === 'Escape') { modal.classList.remove('show'); input.removeEventListener('keydown', onKey); } }
  input.addEventListener('keydown', onKey);
  document.getElementById('pn-save-btn').onclick = doSave;
  document.getElementById('pn-cancel-btn').onclick = () => { modal.classList.remove('show'); input.removeEventListener('keydown', onKey); };
}

// ── Project Manager ──
export function showProjectManager() {
  document.getElementById('project-screen').classList.remove('hidden');
  refreshProjectList();
}

export function hideProjectScreen() {
  document.getElementById('project-screen').classList.add('hidden');
}

let _psProjects = [];

function refreshProjectList() {
  const recoveryEl = document.getElementById('ps-recovery');
  dbGet('autosave', 'current_autosave').then(as => {
    if (as && as.data && (as.data.EL?.length > 0 || as.data.CN?.length > 0)) {
      const timeAgo = Math.round((Date.now() - as.savedAt) / 60000);
      const timeStr = timeAgo < 1 ? 'acum câteva secunde' : timeAgo < 60 ? timeAgo + ' min în urmă' : Math.round(timeAgo / 60) + 'h în urmă';
      recoveryEl.style.display = 'flex';
      recoveryEl.innerHTML = `<span class="ps-recovery-text">Sesiune nesalvată găsită${as.projectName ? ' (' + as.projectName + ')' : ''} — ${timeStr}, ${as.data.EL?.length || 0} elemente</span>
        <button class="ps-recovery-btn" onclick="recoverAutoSave()">Recuperează</button>
        <button class="ps-recovery-btn" onclick="dismissRecovery()" style="color:var(--text3);border-color:var(--border)">Ignoră</button>`;
    } else { recoveryEl.style.display = 'none'; }
  }).catch(() => { recoveryEl.style.display = 'none'; });

  const userId = getLocalUserId();
  const { currentUser, supaClient, cloudLoadProjects } = getCloudFunctions();
  const localPromise = dbGetAll('projects').then(all => all.filter(p => !p.user_id || p.user_id === userId));
  const cloudPromise = (currentUser && supaClient) ? cloudLoadProjects() : Promise.resolve([]);

  Promise.all([localPromise, cloudPromise]).then(([localProjects, cloudProjects]) => {
    const merged = {};
    localProjects.forEach(p => { merged[p.id] = { id: p.id, name: p.name, data: p.data, updatedAt: p.updatedAt, source: 'local' }; });
    (cloudProjects || []).forEach(p => {
      const cloudTime = new Date(p.updated_at).getTime();
      if (!merged[p.id] || cloudTime > merged[p.id].updatedAt) merged[p.id] = { id: p.id, name: p.name, data: p.data, updatedAt: cloudTime, source: 'cloud' };
      else merged[p.id].source = 'both';
    });
    _psProjects = Object.values(merged).sort((a, b) => b.updatedAt - a.updatedAt);
    const searchEl = document.getElementById('ps-search-input');
    if (_psProjects.length >= 2) { searchEl.style.display = ''; searchEl.value = ''; }
    else searchEl.style.display = 'none';
    renderProjectList();
  });
}

export function renderProjectList() {
  const listEl = document.getElementById('ps-list');
  const searchEl = document.getElementById('ps-search-input');
  const query = (searchEl?.value || '').trim().toLowerCase();
  if (_psProjects.length === 0) { listEl.innerHTML = '<div class="ps-empty">Niciun proiect salvat încă.<br>Creează un proiect nou sau încarcă un fișier JSON.</div>'; return; }
  const filtered = query ? _psProjects.filter(p => (p.name || '').toLowerCase().includes(query)) : _psProjects;
  if (filtered.length === 0) { listEl.innerHTML = `<div class="ps-empty">Niciun proiect nu se potrivește cu „${query.replace(/</g,'&lt;')}"</div>`; return; }
  listEl.innerHTML = '';
  filtered.forEach(p => {
    const date = new Date(p.updatedAt);
    const dateStr = date.toLocaleDateString('ro-RO') + ' ' + date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const elCount = p.data?.EL?.length || 0, cnCount = p.data?.CN?.length || 0;
    const isCurrent = p.id === currentProjectId;
    const sourceIcon = p.source === 'cloud' ? ' ☁' : p.source === 'both' ? ' ☁💾' : ' 💾';
    const div = document.createElement('div'); div.className = 'ps-item';
    if (isCurrent) div.style.borderColor = 'var(--accent)';
    div.innerHTML = `<div class="ps-item-info"><div class="ps-item-name">${p.name}${sourceIcon}${isCurrent ? ' (deschis)' : ''}</div><div class="ps-item-meta">${dateStr}  |  ${elCount} elem, ${cnCount} conn</div></div>
      <button class="ps-item-del" onclick="event.stopPropagation();renameProject('${p.id}','${p.name.replace(/'/g,"\\'")}')">✏</button>
      <button class="ps-item-del" onclick="event.stopPropagation();deleteProject('${p.id}')">✕</button>`;
    div.onclick = () => openProject(p.id, p.source);
    listEl.appendChild(div);
  });
}

function openProject(projectId, source) {
  const { currentUser, supaClient, cloudGetProject } = getCloudFunctions();
  const loadLocal = dbGet('projects', projectId);
  const loadCloud = (source === 'cloud' && currentUser && supaClient) ? cloudGetProject(projectId) : Promise.resolve(null);
  Promise.all([loadLocal, loadCloud]).then(([local, cloud]) => {
    const p = cloud || local;
    if (!p) { toast('Proiectul nu a fost găsit!', ''); return; }
    loadProjectData(p.data);
    currentProjectId = projectId; currentProjectName = p.name;
    updateProjectNameUI(); clearAutoSave(); hideProjectScreen();
    toast('Proiect deschis: ' + p.name, 'ok');
  });
}

export function deleteProject(projectId) {
  if (!confirm('Ești sigur că vrei să ștergi acest proiect?')) return;
  const { currentUser, supaClient, cloudDeleteProject } = getCloudFunctions();
  const promises = [dbDelete('projects', projectId)];
  if (currentUser && supaClient) promises.push(cloudDeleteProject(projectId));
  Promise.all(promises).then(() => {
    if (currentProjectId === projectId) { currentProjectId = null; currentProjectName = null; updateProjectNameUI(); }
    refreshProjectList(); toast('Proiect șters', 'ok');
  });
}

export function renameProject(projectId, oldName) {
  showNameDialog(newName => {
    dbGet('projects', projectId).then(p => { if (!p) return; p.name = newName; return dbPut('projects', p); }).then(() => {
      if (currentProjectId === projectId) { currentProjectName = newName; updateProjectNameUI(); }
      refreshProjectList(); toast('Proiect redenumit: ' + newName, 'ok');
    });
  }, oldName);
}

export function recoverAutoSave() {
  dbGet('autosave', 'current_autosave').then(as => {
    if (!as || !as.data) return;
    loadProjectData(as.data);
    currentProjectId = as.projectId || null; currentProjectName = as.projectName || null;
    updateProjectNameUI(); hideProjectScreen(); toast('Sesiune recuperată cu succes!', 'ok');
  });
}

export function dismissRecovery() {
  clearAutoSave(); document.getElementById('ps-recovery').style.display = 'none';
}

export function newProject() {
  if (S.EL.length > 0 || S.CN.length > 0) {
    if (!confirm('Ai un proiect deschis. Vrei să continui? (modificările nesalvate se pierd)')) return;
  }
  S.EL = []; S.CN = []; S.sel = null; S.multiSel.clear(); S.undoStack = []; S.redoStack = [];
  S.bgData = { url: null, x: 0, y: 0, w: 0, h: 0, op: 0.5, locked: true };
  Object.keys(S.counters).forEach(k => delete S.counters[k]);
  S.vdResults = null;
  currentProjectId = null; currentProjectName = null;
  updateProjectNameUI();
  render(); renderBg(); updateProps(); updateStat();
  hideProjectScreen(); toast('Proiect nou creat', 'ok');
}

export function showProjectManagerAfterAuth() {
  const { currentUser } = getCloudFunctions();
  Promise.all([dbGetAll('projects'), dbGet('autosave', 'current_autosave')]).then(([projects, autoSave]) => {
    const hasProjects = projects?.length > 0;
    const hasRecovery = autoSave?.data?.EL?.length > 0;
    if (hasProjects || hasRecovery || currentUser) showProjectManager();
  }).catch(e => console.warn('DB init check failed:', e));
}

// ── Warn on close ──
window.addEventListener('beforeunload', e => {
  if (hasUnsavedChanges && (S.EL.length > 0 || S.CN.length > 0)) {
    doAutoSave(); e.preventDefault(); e.returnValue = '';
  }
});

// ── Window globals for onclick handlers ──
window.recoverAutoSave = recoverAutoSave;
window.dismissRecovery = dismissRecovery;
window.deleteProject = deleteProject;
window.renameProject = renameProject;
