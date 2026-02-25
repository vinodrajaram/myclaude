/* ═══════════════════════════════════════════════
   ANCHOR — Banking Link Aggregator
   app.js — All application logic
   ═══════════════════════════════════════════════ */

'use strict';

// ─── Storage Keys ───────────────────────────────
const KEY_LINKS    = 'anchor_links';
const KEY_CATS     = 'anchor_categories';
const KEY_USERS    = 'anchor_users';
const KEY_CURRENT  = 'anchor_current_user';
const KEY_USERDATA = 'anchor_user_data';

// ─── State ──────────────────────────────────────
let state = {
  links:       [],
  categories:  [],
  users:       [],
  currentUser: null,
  userData:    {},      // { username: { favorites: [], clicks: {} } }
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'frequency',  // 'frequency' | 'alpha' | 'recent'
};

// ─── Storage Helpers ────────────────────────────
const load  = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save  = (key, val) => localStorage.setItem(key, JSON.stringify(val));

function loadState() {
  state.links      = load(KEY_LINKS,   []);
  state.categories = load(KEY_CATS,    []);
  state.users      = load(KEY_USERS,   []);
  state.currentUser= load(KEY_CURRENT, null);
  state.userData   = load(KEY_USERDATA,{});
}

function saveLinks()    { save(KEY_LINKS,    state.links); }
function saveCategories(){ save(KEY_CATS,    state.categories); }
function saveUsers()    { save(KEY_USERS,    state.users); }
function saveCurrentUser(){ save(KEY_CURRENT, state.currentUser); }
function saveUserData() { save(KEY_USERDATA, state.userData); }

// ─── User Data Helpers ──────────────────────────
function getUD(user) {
  if (!state.userData[user]) state.userData[user] = { favorites: [], clicks: {} };
  return state.userData[user];
}

function isFavorite(linkId) {
  if (!state.currentUser) return false;
  return getUD(state.currentUser).favorites.includes(linkId);
}

function toggleFavorite(linkId) {
  if (!state.currentUser) return;
  const ud = getUD(state.currentUser);
  const idx = ud.favorites.indexOf(linkId);
  if (idx === -1) ud.favorites.push(linkId);
  else ud.favorites.splice(idx, 1);
  saveUserData();
}

function getClickCount(linkId) {
  if (!state.currentUser) return 0;
  return getUD(state.currentUser).clicks[linkId] || 0;
}

function recordClick(linkId) {
  if (!state.currentUser) return;
  const ud = getUD(state.currentUser);
  ud.clicks[linkId] = (ud.clicks[linkId] || 0) + 1;
  saveUserData();
}

// ─── Seed Default Data ───────────────────────────
async function seedIfEmpty() {
  if (state.links.length > 0) return;
  try {
    const res  = await fetch('data/default-links.json');
    const data = await res.json();
    state.links      = data.links;
    state.categories = data.categories;
    saveLinks();
    saveCategories();
  } catch (e) {
    console.warn('Could not load default links:', e);
  }
}

// ─── ID Generator ───────────────────────────────
function uid() { return 'link-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ─── Favicon Util ───────────────────────────────
function faviconUrl(url) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=32&domain=${host}`;
  } catch { return null; }
}

function categoryIcon(catId) {
  const cat = state.categories.find(c => c.id === catId);
  return cat ? cat.icon : '🔗';
}

function categoryName(catId) {
  const cat = state.categories.find(c => c.id === catId);
  return cat ? cat.name : catId;
}

// ─── Search / Filter ────────────────────────────
function getFilteredLinks() {
  let links = [...state.links];

  // category filter
  if (state.activeCategory === 'favorites') {
    if (!state.currentUser) return [];
    const favs = getUD(state.currentUser).favorites;
    links = links.filter(l => favs.includes(l.id));
  } else if (state.activeCategory !== 'all') {
    links = links.filter(l => l.category === state.activeCategory);
  }

  // search filter
  const q = state.searchQuery.trim().toLowerCase();
  if (q) {
    links = links.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.url.toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q) ||
      (l.tags || []).some(t => t.toLowerCase().includes(q)) ||
      categoryName(l.category).toLowerCase().includes(q)
    );
  }

  // sort
  if (state.sortBy === 'frequency') {
    links.sort((a, b) => getClickCount(b.id) - getClickCount(a.id));
  } else if (state.sortBy === 'alpha') {
    links.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === 'recent') {
    // keep insertion order (links array order)
  }

  return links;
}

function getFavoriteLinks() {
  if (!state.currentUser) return [];
  const favIds = getUD(state.currentUser).favorites;
  return state.links
    .filter(l => favIds.includes(l.id))
    .sort((a, b) => getClickCount(b.id) - getClickCount(a.id));
}

// ─── Highlight ──────────────────────────────────
function highlight(text, q) {
  if (!q) return escHtml(text);
  const safe = escHtml(text);
  const regex = new RegExp(`(${escRegex(q)})`, 'gi');
  return safe.replace(regex, '<mark>$1</mark>');
}
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ─── Render ─────────────────────────────────────
function render() {
  renderSidebar();
  renderFavorites();
  renderLinks();
  renderUserBtn();
}

function renderUserBtn() {
  const btn = document.getElementById('user-btn');
  const name = state.currentUser || 'Select User';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  btn.querySelector('.user-avatar').textContent = initials;
  btn.querySelector('.user-name').textContent = name;
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const q = state.searchQuery.toLowerCase();

  // Count per category
  const counts = {};
  state.links.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1; });
  const favCount = state.currentUser ? getUD(state.currentUser).favorites.length : 0;
  const allCount = state.links.length;

  let html = `
    <div class="sidebar-label">Views</div>
    <div class="sidebar-item ${state.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
      <span class="si-icon">🗂️</span> All Links
      <span class="sidebar-count">${allCount}</span>
    </div>
    <div class="sidebar-item ${state.activeCategory === 'favorites' ? 'active' : ''}" data-cat="favorites">
      <span class="si-icon">⭐</span> Favorites
      <span class="sidebar-count">${favCount}</span>
    </div>
    <div class="sidebar-label">Categories</div>
  `;

  state.categories.forEach(cat => {
    const cnt = counts[cat.id] || 0;
    html += `
      <div class="sidebar-item ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <span class="si-icon">${cat.icon}</span> ${cat.name}
        <span class="sidebar-count">${cnt}</span>
      </div>`;
  });

  sidebar.innerHTML = html;

  sidebar.querySelectorAll('.sidebar-item').forEach(el => {
    el.addEventListener('click', () => {
      state.activeCategory = el.dataset.cat;
      render();
    });
  });
}

function renderFavorites() {
  const section = document.getElementById('favs-section');
  const wrap    = document.getElementById('favs-wrap');

  const favLinks = getFavoriteLinks();

  if (favLinks.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  const q = state.searchQuery.trim().toLowerCase();

  wrap.innerHTML = favLinks.map(link => {
    const fav = faviconUrl(link.url);
    const iconHtml = fav
      ? `<img src="${fav}" alt="" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
        + `<span style="display:none">${categoryIcon(link.category)}</span>`
      : categoryIcon(link.category);
    const cnt = getClickCount(link.id);
    return `
      <div class="fav-chip" data-id="${link.id}" title="${escHtml(link.url)}">
        <span class="fav-chip-icon">${iconHtml}</span>
        <span class="fav-chip-label">${highlight(link.title, q)}</span>
        ${cnt > 0 ? `<span class="fav-chip-count">${cnt}</span>` : ''}
      </div>`;
  }).join('');

  wrap.querySelectorAll('.fav-chip').forEach(el => {
    el.addEventListener('click', () => {
      const link = state.links.find(l => l.id === el.dataset.id);
      if (link) openLink(link);
    });
  });
}

function renderLinks() {
  const grid    = document.getElementById('links-grid');
  const noRes   = document.getElementById('no-results');
  const section = document.getElementById('links-section');
  const filtered = getFilteredLinks();
  const q = state.searchQuery.trim().toLowerCase();

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = '';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = filtered.map(link => renderCard(link, q)).join('');

  // Wire up card actions
  grid.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.link-card');
      const link = state.links.find(l => l.id === card.dataset.id);
      if (link) openLink(link);
    });
  });

  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.link-card');
      const link = state.links.find(l => l.id === card.dataset.id);
      if (link) copyToClipboard(link.url);
    });
  });

  grid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.link-card');
      toggleFavorite(card.dataset.id);
      render();
      toast(isFavorite(card.dataset.id) ? '⭐ Added to favorites' : 'Removed from favorites', 'success');
    });
  });

  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.link-card');
      deleteLink(card.dataset.id);
    });
  });
}

function renderCard(link, q) {
  const fav    = isFavorite(link.id);
  const clicks = getClickCount(link.id);
  const hot    = clicks >= 5;
  const faviUrl= faviconUrl(link.url);

  const iconHtml = faviUrl
    ? `<img src="${faviUrl}" alt="" onerror="this.style.display='none';this.parentElement.innerHTML='${categoryIcon(link.category)}'">`
    : categoryIcon(link.category);

  const tagsHtml = (link.tags || []).slice(0, 3).map(t =>
    `<span class="tag">${highlight(t, q)}</span>`).join('');

  const freqHtml = clicks > 0
    ? `<span class="freq-badge ${hot ? 'hot' : ''}">
         ${hot ? '🔥' : '↗'} ${clicks}
       </span>`
    : '';

  return `
    <div class="link-card ${fav ? 'is-fav' : ''}" data-id="${link.id}">
      <div class="card-top">
        <div class="card-favicon">${iconHtml}</div>
        <div class="card-title-wrap">
          <div class="card-title" title="${escHtml(link.title)}">${highlight(link.title, q)}</div>
          <div class="card-url">${highlight(link.url, q)}</div>
        </div>
      </div>
      ${link.description ? `<div class="card-desc">${highlight(link.description, q)}</div>` : ''}
      <div class="card-footer">
        <div class="tags">${tagsHtml}</div>
        ${freqHtml}
        <div class="card-actions">
          <button class="icon-btn copy-btn" title="Copy URL">📋</button>
          <button class="icon-btn fav-btn ${fav ? 'fav-active' : ''}" title="${fav ? 'Remove favorite' : 'Add to favorites'}">${fav ? '⭐' : '☆'}</button>
          <button class="icon-btn delete-btn" title="Delete link">🗑️</button>
          <button class="open-btn">Open ↗</button>
        </div>
      </div>
    </div>`;
}

// ─── Link Actions ───────────────────────────────
function openLink(link) {
  recordClick(link.id);
  window.open(link.url, '_blank', 'noopener,noreferrer');
  render();
}

function deleteLink(id) {
  if (!confirm('Delete this link?')) return;
  state.links = state.links.filter(l => l.id !== id);
  // remove from all user favorites + clicks
  Object.values(state.userData).forEach(ud => {
    ud.favorites = ud.favorites.filter(f => f !== id);
    delete ud.clicks[id];
  });
  saveLinks();
  saveUserData();
  render();
  toast('Link deleted', 'success');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast('URL copied to clipboard', 'success')).catch(() => toast('Copy failed', 'error'));
}

// ─── Add Link Modal ─────────────────────────────
function openAddModal(prefill = {}) {
  const overlay = document.getElementById('modal-add');
  const form    = document.getElementById('add-form');

  // populate category options
  const catSel = document.getElementById('add-category');
  catSel.innerHTML = state.categories.map(c =>
    `<option value="${c.id}">${c.icon} ${c.name}</option>`
  ).join('');

  // prefill from URL paste if provided
  if (prefill.url) document.getElementById('add-url').value = prefill.url;
  if (prefill.title) document.getElementById('add-title').value = prefill.title;

  openModal('modal-add');
  document.getElementById('add-url').focus();
}

document.getElementById('modal-add')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('add-title').value.trim();
  const url   = document.getElementById('add-url').value.trim();
  const cat   = document.getElementById('add-category').value;
  const desc  = document.getElementById('add-desc').value.trim();
  const tags  = document.getElementById('add-tags').value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

  if (!title || !url) return toast('Title and URL are required', 'error');

  // basic URL validation
  try { new URL(url); } catch { return toast('Invalid URL — include https://', 'error'); }

  const link = { id: uid(), title, url, category: cat, tags, description: desc, addedBy: state.currentUser || 'User' };
  state.links.unshift(link);
  saveLinks();
  render();
  closeModal('modal-add');
  document.getElementById('add-form').reset();
  toast(`✅ "${title}" added`, 'success');
});

// Auto-fetch title when URL is pasted
document.getElementById('add-url')?.addEventListener('blur', async () => {
  const urlInput   = document.getElementById('add-url');
  const titleInput = document.getElementById('add-title');
  const url = urlInput.value.trim();
  if (!url || titleInput.value.trim()) return;
  try {
    new URL(url);
    // Try to derive a sensible title from hostname
    const host = new URL(url).hostname.replace('www.', '');
    titleInput.placeholder = host;
  } catch {}
});

// ─── User Picker Modal ──────────────────────────
function openUserModal() {
  renderUserGrid();
  openModal('modal-user');
}

function renderUserGrid() {
  const grid = document.getElementById('user-grid');
  grid.innerHTML = state.users.map(u => {
    const initials = u.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    const selected = u === state.currentUser;
    return `
      <div class="user-tile ${selected ? 'selected' : ''}" data-user="${escHtml(u)}">
        <div class="u-avatar">${initials}</div>
        <div class="u-name">${escHtml(u)}</div>
      </div>`;
  }).join('') + `
    <div class="user-tile add-tile" id="show-add-user">
      <div class="u-avatar">+</div>
      <div class="u-name">Add User</div>
    </div>`;

  grid.querySelectorAll('.user-tile[data-user]').forEach(el => {
    el.addEventListener('click', () => {
      state.currentUser = el.dataset.user;
      saveCurrentUser();
      closeModal('modal-user');
      render();
      toast(`Welcome back, ${state.currentUser}!`, 'success');
    });
  });

  document.getElementById('show-add-user')?.addEventListener('click', () => {
    document.getElementById('new-user-wrap').style.display = 'flex';
    document.getElementById('new-user-input').focus();
  });
}

document.getElementById('btn-create-user')?.addEventListener('click', () => {
  const name = document.getElementById('new-user-input').value.trim();
  if (!name) return;
  if (state.users.includes(name)) return toast('User already exists', 'error');
  state.users.push(name);
  state.currentUser = name;
  saveUsers();
  saveCurrentUser();
  closeModal('modal-user');
  render();
  toast(`Welcome, ${name}! 🎉`, 'success');
});

// ─── Export / Import Modal ──────────────────────
function openExportModal() {
  const data = { categories: state.categories, links: state.links };
  document.getElementById('export-area').textContent = JSON.stringify(data, null, 2);
  openModal('modal-export');
}

document.getElementById('btn-copy-export')?.addEventListener('click', () => {
  copyToClipboard(document.getElementById('export-area').textContent);
});

document.getElementById('btn-import-confirm')?.addEventListener('click', () => {
  const raw = document.getElementById('import-input').value.trim();
  if (!raw) return toast('Paste JSON to import', 'error');
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.links)) throw new Error('Invalid format');
    // Merge: add links not already present (by URL)
    const existingUrls = new Set(state.links.map(l => l.url));
    let added = 0;
    data.links.forEach(l => {
      if (!existingUrls.has(l.url)) {
        state.links.push({ ...l, id: uid() });
        added++;
      }
    });
    if (data.categories) {
      const existingCatIds = new Set(state.categories.map(c => c.id));
      data.categories.forEach(c => { if (!existingCatIds.has(c.id)) state.categories.push(c); });
      saveCategories();
    }
    saveLinks();
    closeModal('modal-export');
    render();
    toast(`Imported ${added} new link${added !== 1 ? 's' : ''}`, 'success');
  } catch (e) {
    toast('Invalid JSON format', 'error');
  }
});

// ─── Modal Helpers ──────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  // reset new-user-wrap on user modal close
  if (id === 'modal-user') {
    const wrap = document.getElementById('new-user-wrap');
    if (wrap) { wrap.style.display = 'none'; document.getElementById('new-user-input').value = ''; }
  }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
});

// ─── Search ─────────────────────────────────────
document.getElementById('search-input')?.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  render();
});

// Cmd+K / Ctrl+K to focus search
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search-input').focus();
    document.getElementById('search-input').select();
  }
  if (e.key === 'Escape') {
    // close any open modal
    document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
    // clear search
    if (state.searchQuery) {
      state.searchQuery = '';
      document.getElementById('search-input').value = '';
      render();
    }
  }
});

// Sort
document.getElementById('sort-select')?.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  render();
});

// Header buttons
document.getElementById('btn-add-link')?.addEventListener('click', () => openAddModal());
document.getElementById('user-btn')?.addEventListener('click', openUserModal);
document.getElementById('btn-export')?.addEventListener('click', openExportModal);

// ─── Toast ──────────────────────────────────────
function toast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

// ─── Init ───────────────────────────────────────
async function init() {
  loadState();
  await seedIfEmpty();

  // First-time: no users at all → auto-prompt
  if (state.users.length === 0) {
    // Add a few default banker names
    state.users = ['Alex Morgan', 'Jamie Lee', 'Sam Rivera', 'Taylor Chen'];
    saveUsers();
  }

  // No current user → show picker
  if (!state.currentUser) {
    render();
    openModal('modal-user');
  } else {
    render();
  }
}

init();
