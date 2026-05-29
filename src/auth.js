import { S } from './state.js';
import { toast } from './utils.js';

// ── Config ──
const SUPABASE_URL = 'https://fmvcwdopsugwqiodwtxm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdmN3ZG9wc3Vnd3Fpb2R3dHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDMzODYsImV4cCI6MjA5MTcxOTM4Nn0.rkmhhzzaGHa0d_P7RSph0X74oDLYID_c4IZGPLstJD0';
const ADMIN_EMAIL = 'grigoriualin13@gmail.com';

// ── State ──
let supaClient = null;
let currentUser = null;
let currentProfile = null;
let authMode = 'login';

// ── Callbacks set by app.js ──
let _onAuthSuccess = null;
let _onLogout = null;
export function setAuthHandlers({ onAuthSuccess, onLogout }) {
  _onAuthSuccess = onAuthSuccess;
  _onLogout = onLogout;
}

// ── Getter for project.js and others ──
export function getCloudFunctions() {
  return { currentUser, supaClient, cloudSaveProject, cloudLoadProjects, cloudGetProject, cloudDeleteProject };
}

// ── Supabase init ──
export function initSupabase() {
  try {
    if (window.supabase && window.supabase.createClient) {
      supaClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return true;
    }
  } catch (e) { console.warn('Supabase init failed:', e); }
  return false;
}

// ── Auth UI ──
export function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('auth-email').focus();
}

export function hideAuthScreen() {
  document.getElementById('auth-screen').classList.add('hidden');
}

export function toggleAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  const btn = document.getElementById('auth-submit-btn');
  const toggle = document.getElementById('auth-toggle-text');
  const label = document.getElementById('auth-mode-label');
  const nameRow = document.getElementById('auth-name-row');
  if (authMode === 'register') {
    btn.textContent = 'CREEAZĂ CONT';
    toggle.innerHTML = 'Ai deja cont? <span onclick="toggleAuthMode()">Conectează-te</span>';
    label.textContent = 'Creează un cont nou';
    nameRow.style.display = 'block';
  } else {
    btn.textContent = 'INTRĂ';
    toggle.innerHTML = 'Nu ai cont? <span onclick="toggleAuthMode()">Creează unul</span>';
    label.textContent = 'Conectează-te pentru a salva proiectele în cloud';
    nameRow.style.display = 'none';
  }
  document.getElementById('auth-error').textContent = '';
}

export function authSubmit() {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  const errEl = document.getElementById('auth-error');
  const btn = document.getElementById('auth-submit-btn');
  errEl.textContent = '';

  if (!email || !pass) { errEl.textContent = 'Completează email și parola'; return; }
  if (pass.length < 6) { errEl.textContent = 'Parola trebuie să aibă minim 6 caractere'; return; }

  btn.disabled = true;
  btn.textContent = 'Se procesează...';

  if (authMode === 'register') {
    const displayName = document.getElementById('auth-name').value.trim();
    supaClient.auth.signUp({
      email, password: pass,
      options: { data: { display_name: displayName || email.split('@')[0] } }
    }).then(res => {
      btn.disabled = false;
      if (res.error) {
        errEl.textContent = _translateAuthError(res.error.message);
        btn.textContent = 'CREEAZĂ CONT';
      } else if (res.data.user && !res.data.session) {
        errEl.style.color = 'var(--accentg)';
        errEl.textContent = 'Cont creat! Verifică email-ul pentru confirmare, apoi conectează-te.';
        btn.textContent = 'CREEAZĂ CONT';
        authMode = 'login';
        setTimeout(toggleAuthMode, 2000);
      } else {
        _onAuthSuccess_internal(res.data.user);
      }
    });
  } else {
    supaClient.auth.signInWithPassword({ email, password: pass }).then(res => {
      btn.disabled = false;
      if (res.error) {
        errEl.textContent = _translateAuthError(res.error.message);
        btn.textContent = 'INTRĂ';
      } else {
        _onAuthSuccess_internal(res.data.user);
      }
    });
  }
}

function _translateAuthError(msg) {
  if (msg.includes('Invalid login')) return 'Email sau parolă incorectă';
  if (msg.includes('already registered')) return 'Acest email este deja înregistrat';
  if (msg.includes('valid email')) return 'Adresă de email invalidă';
  if (msg.includes('Email not confirmed')) return 'Email-ul nu a fost confirmat. Verifică inbox-ul.';
  if (msg.includes('rate limit')) return 'Prea multe încercări. Așteaptă câteva minute.';
  return msg;
}

function _onAuthSuccess_internal(user) {
  currentUser = user;
  updateUserBar();
  checkUserApproval().then(approved => {
    if (approved) {
      hideAuthScreen();
      toast('Conectat: ' + user.email, 'ok');
      _onAuthSuccess && _onAuthSuccess(user);
    } else {
      _showPendingScreen();
    }
  });
}

export function updateUserBar() {
  const bar = document.getElementById('user-bar');
  const emailEl = document.getElementById('user-email-display');
  if (currentUser) {
    bar.style.display = 'flex';
    emailEl.textContent = currentUser.email;
  } else {
    bar.style.display = 'none';
    emailEl.textContent = '';
  }
}

export function authLogout() {
  if (!confirm('Vrei să te deconectezi?')) return;
  _onLogout && _onLogout();
  supaClient.auth.signOut().then(() => {
    currentUser = null;
    currentProfile = null;
    updateUserBar();
    closeAdminPanel();
    showAuthScreen();
  });
}

export function authSkip() {
  currentUser = null;
  hideAuthScreen();
  updateUserBar();
}

export function checkUserApproval() {
  if (!currentUser || !supaClient) return Promise.resolve(false);
  if (currentUser.email === ADMIN_EMAIL) {
    currentProfile = { approved: true, is_admin: true, display_name: 'Admin' };
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.style.display = '';
    return Promise.resolve(true);
  }
  return supaClient.from('profiles')
    .select('approved, is_admin, display_name')
    .eq('id', currentUser.id)
    .single()
    .then(res => {
      if (res.error) {
        if (res.error.code === 'PGRST116') return false;
        return false;
      }
      if (!res.data) return false;
      currentProfile = res.data;
      if (currentProfile.is_admin) {
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = '';
      }
      return currentProfile.approved;
    }).catch(e => { console.error('Approval check failed:', e); return false; });
}

function _showPendingScreen() {
  hideAuthScreen();
  const screen = document.getElementById('project-screen');
  screen.classList.remove('hidden');
  const listEl = document.getElementById('ps-list');
  listEl.innerHTML = '<div class="ps-empty" style="padding:40px 20px;font-size:14px">' +
    '<div style="font-size:40px;margin-bottom:16px">⏳</div>' +
    '<div style="color:var(--warn);font-weight:700;font-size:16px;margin-bottom:8px">Cont în așteptare</div>' +
    '<div style="color:var(--text3)">Contul tău (<b>' + currentUser.email + '</b>) nu a fost încă aprobat.<br>' +
    'Administratorul va fi notificat și vei primi acces în curând.</div></div>';
  document.getElementById('ps-recovery').style.display = 'none';
  const actionsEl = document.querySelector('.ps-actions');
  if (actionsEl) {
    actionsEl.innerHTML = '<button class="ps-btn secondary" onclick="pendingLogout()">Deconectare</button>' +
      '<button class="ps-btn" onclick="authSkip();hideProjectScreen()">Continuă fără cont (local)</button>';
  }
}

export function pendingLogout() {
  supaClient.auth.signOut().then(() => {
    currentUser = null;
    currentProfile = null;
    updateUserBar();
    const screen = document.getElementById('project-screen');
    screen.classList.add('hidden');
    showAuthScreen();
  });
}

// ── Admin panel ──
export function openAdminPanel() {
  if (!currentProfile || !currentProfile.is_admin) return;
  document.getElementById('admin-overlay').classList.add('show');
  document.getElementById('admin-panel').classList.add('show');
  refreshAdminList();
}

export function closeAdminPanel() {
  document.getElementById('admin-overlay').classList.remove('show');
  document.getElementById('admin-panel').classList.remove('show');
}

export function refreshAdminList() {
  const body = document.getElementById('admin-body');
  body.innerHTML = '<div class="adm-empty">Se încarcă...</div>';
  supaClient.from('profiles')
    .select('id, email, display_name, approved, is_admin, created_at')
    .order('created_at', { ascending: false })
    .then(res => {
      if (res.error) { body.innerHTML = '<div class="adm-empty">Eroare: ' + res.error.message + '</div>'; return; }
      const profiles = res.data || [];
      const pending = profiles.filter(p => !p.approved);
      const active = profiles.filter(p => p.approved);
      let html = '<div class="adm-section">În așteptare (' + pending.length + ')</div>';
      if (pending.length === 0) {
        html += '<div class="adm-empty">Niciun cont în așteptare</div>';
      } else {
        pending.forEach(p => {
          const date = new Date(p.created_at).toLocaleDateString('ro-RO');
          html += `<div class="adm-user"><div class="adm-user-info"><div class="adm-user-email">${p.email} <span class="adm-badge pending">PENDING</span></div><div class="adm-user-meta">${p.display_name || ''} — înregistrat ${date}</div></div><button class="adm-btn approve" onclick="approveUser('${p.id}')">Aprobă</button><button class="adm-btn reject" onclick="rejectUser('${p.id}')">Șterge</button></div>`;
        });
      }
      html += '<div class="adm-section" style="margin-top:8px">Conturi active (' + active.length + ')</div>';
      active.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString('ro-RO');
        const badge = p.is_admin ? '<span class="adm-badge admin">ADMIN</span>' : '<span class="adm-badge active">ACTIV</span>';
        const actions = !p.is_admin ? `<button class="adm-btn disable" onclick="disableUser('${p.id}')">Dezactivează</button>` : '';
        html += `<div class="adm-user"><div class="adm-user-info"><div class="adm-user-email">${p.email} ${badge}</div><div class="adm-user-meta">${p.display_name || ''} — din ${date}</div></div>${actions}</div>`;
      });
      body.innerHTML = html;
    });
}

export function approveUser(userId) {
  supaClient.from('profiles').update({ approved: true }).eq('id', userId).then(res => {
    if (res.error) { toast('Eroare: ' + res.error.message, ''); return; }
    toast('Cont aprobat!', 'ok'); refreshAdminList();
  });
}

export function rejectUser(userId) {
  if (!confirm('Ești sigur? Utilizatorul va fi șters permanent.')) return;
  supaClient.from('profiles').delete().eq('id', userId).then(() => {
    toast('Cont șters', 'ok'); refreshAdminList();
  });
}

export function disableUser(userId) {
  if (!confirm('Dezactivezi acest cont?')) return;
  supaClient.from('profiles').update({ approved: false }).eq('id', userId).then(res => {
    if (res.error) { toast('Eroare: ' + res.error.message, ''); return; }
    toast('Cont dezactivat', 'ok'); refreshAdminList();
  });
}

// ── Cloud Storage ──
function _isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function cloudSaveProject(projectId, projectName, data) {
  if (!currentUser || !supaClient) return Promise.resolve(null);
  const cloudId = _isValidUUID(projectId) ? projectId : crypto.randomUUID?.() || projectId;
  const row = { id: cloudId, user_id: currentUser.id, name: projectName, data, updated_at: new Date().toISOString() };
  return supaClient.from('projects').upsert(row, { onConflict: 'id' }).then(res => {
    if (res.error) { console.error('Cloud save error:', res.error.message); toast('☁ Eroare cloud: ' + res.error.message, ''); return null; }
    return res;
  });
}

function cloudLoadProjects() {
  if (!currentUser || !supaClient) return Promise.resolve([]);
  return supaClient.from('projects')
    .select('id, name, data, created_at, updated_at')
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false })
    .then(res => { if (res.error) { console.error('Cloud load error:', res.error); return []; } return res.data || []; });
}

function cloudDeleteProject(projectId) {
  if (!currentUser || !supaClient) return Promise.resolve();
  return supaClient.from('projects').delete().eq('id', projectId).eq('user_id', currentUser.id);
}

function cloudGetProject(projectId) {
  if (!currentUser || !supaClient) return Promise.resolve(null);
  return supaClient.from('projects')
    .select('*').eq('id', projectId).eq('user_id', currentUser.id).single()
    .then(res => res.error ? null : res.data);
}

export async function resumeSession(onApproved) {
  if (!supaClient) return false;
  try {
    const res = await supaClient.auth.getSession();
    if (res.data.session?.user) {
      currentUser = res.data.session.user;
      updateUserBar();
      const approved = await checkUserApproval();
      if (approved) { hideAuthScreen(); onApproved && onApproved(currentUser); }
      else { _showPendingScreen(); }
      return true;
    }
  } catch(e) { console.warn('Session check failed:', e); }
  return false;
}

export function setupAuthStateListener() {
  if (!supaClient) return;
  supaClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) { currentUser = session.user; updateUserBar(); }
    else if (event === 'SIGNED_OUT') { currentUser = null; updateUserBar(); }
  });
}
