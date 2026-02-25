/**
 * YT Batch Upload — popup.js
 * MV3 Chrome Extension · YouTube Resumable Upload API
 */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────
let authToken = null;
let isUploading = false;

/**
 * @typedef {{ id: string, file: File, privacy: string, status: string, progress: number, errorMsg: string }} QueueItem
 * @type {QueueItem[]}
 */
const queue = [];

// ── DOM refs ───────────────────────────────────────────────────────────────
const authOverlay  = document.getElementById('auth-overlay');
const authDot      = document.getElementById('auth-dot');
const authLabel    = document.getElementById('auth-label');
const btnAuth      = document.getElementById('btn-auth');
const dropZone     = document.getElementById('drop-zone');
const browseLink   = document.getElementById('browse-link');
const fileInput    = document.getElementById('file-input');
const queueWrapper = document.getElementById('queue-wrapper');
const queueEmpty   = document.getElementById('queue-empty');
const countDone    = document.getElementById('count-done');
const countTotal   = document.getElementById('count-total');
const btnUpload    = document.getElementById('btn-upload');

// ── Auth ───────────────────────────────────────────────────────────────────
function getToken(interactive = true) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

function removeCachedToken(token) {
  return new Promise((resolve) => {
    chrome.identity.removeCachedAuthToken({ token }, resolve);
  });
}

async function refreshToken() {
  if (authToken) await removeCachedToken(authToken);
  authToken = await getToken(true);
  return authToken;
}

async function initAuth() {
  try {
    // Try silent first to avoid unnecessary popup
    authToken = await getToken(false);
    setAuthed(true);
  } catch {
    // Not yet authed — leave overlay visible
  }
}

function setAuthed(ok) {
  authOverlay.style.display = ok ? 'none' : 'flex';
  authDot.className = 'auth-dot' + (ok ? ' authed' : '');
  authLabel.textContent = ok ? 'Signed in' : 'Not signed in';
  updateFooter();
}

btnAuth.addEventListener('click', async () => {
  try {
    authToken = await getToken(true);
    setAuthed(true);
  } catch (err) {
    authDot.className = 'auth-dot error';
    authLabel.textContent = 'Auth failed';
    console.error('Auth error:', err);
  }
});

// ── File selection ─────────────────────────────────────────────────────────
browseLink.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.click();
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  addFiles(Array.from(fileInput.files));
  fileInput.value = '';
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('video/'));
  if (files.length) addFiles(files);
});

function addFiles(files) {
  for (const file of files) {
    queue.push({
      id: crypto.randomUUID(),
      file,
      privacy: 'private',
      status: 'queued',
      progress: 0,
      errorMsg: '',
    });
  }
  renderQueue();
  updateFooter();
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderQueue() {
  // Remove rows not in queue
  const existingIds = new Set(queue.map((q) => q.id));
  for (const el of queueWrapper.querySelectorAll('.queue-row')) {
    if (!existingIds.has(el.dataset.id)) el.remove();
  }

  queueEmpty.style.display = queue.length === 0 ? 'block' : 'none';

  for (const item of queue) {
    const existing = queueWrapper.querySelector(`.queue-row[data-id="${item.id}"]`);
    if (existing) {
      updateRow(existing, item);
    } else {
      const row = createRow(item);
      queueWrapper.appendChild(row);
    }
  }
}

function createRow(item) {
  const row = document.createElement('div');
  row.className = 'queue-row';
  row.dataset.id = item.id;

  row.innerHTML = `
    <div class="row-top">
      <span class="row-filename" title="${escHtml(item.file.name)}">${escHtml(item.file.name)}</span>
      <select class="row-privacy">
        <option value="private"  ${item.privacy === 'private'  ? 'selected' : ''}>Private</option>
        <option value="unlisted" ${item.privacy === 'unlisted' ? 'selected' : ''}>Unlisted</option>
        <option value="public"   ${item.privacy === 'public'   ? 'selected' : ''}>Public</option>
      </select>
      <span class="row-badge badge-queued">Queued</span>
      <button class="row-remove" title="Remove">✕</button>
    </div>
    <div class="row-progress">
      <div class="progress-track"><div class="progress-fill"></div></div>
      <div class="progress-label">
        <span class="progress-pct">0%</span>
        <span class="progress-size"></span>
      </div>
    </div>
    <div class="row-error-msg"></div>
    <button class="row-retry">Retry</button>
  `;

  row.querySelector('.row-privacy').addEventListener('change', (e) => {
    item.privacy = e.target.value;
  });

  row.querySelector('.row-remove').addEventListener('click', () => {
    const idx = queue.findIndex((q) => q.id === item.id);
    if (idx !== -1 && item.status === 'queued') {
      queue.splice(idx, 1);
      renderQueue();
      updateFooter();
    }
  });

  row.querySelector('.row-retry').addEventListener('click', () => {
    if (!isUploading) {
      item.status = 'queued';
      item.progress = 0;
      item.errorMsg = '';
      renderQueue();
      updateFooter();
      startQueue();
    }
  });

  updateRow(row, item);
  return row;
}

function updateRow(row, item) {
  row.className = `queue-row ${item.status}`;

  const badge = row.querySelector('.row-badge');
  const badgeMap = {
    queued:    ['Queued',    'badge-queued'],
    uploading: ['Uploading', 'badge-uploading'],
    done:      ['Done',      'badge-done'],
    error:     ['Error',     'badge-error'],
    skipped:   ['Skipped',   'badge-skipped'],
  };
  const [label, cls] = badgeMap[item.status] || ['—', 'badge-queued'];
  badge.textContent = label;
  badge.className = `row-badge ${cls}`;

  const privacy = row.querySelector('.row-privacy');
  privacy.value = item.privacy;
  privacy.disabled = item.status !== 'queued';

  const removeBtn = row.querySelector('.row-remove');
  removeBtn.style.display = item.status === 'queued' ? 'inline' : 'none';

  const progressEl = row.querySelector('.row-progress');
  const fill       = row.querySelector('.progress-fill');
  const pct        = row.querySelector('.progress-pct');
  const sizeEl     = row.querySelector('.progress-size');
  progressEl.style.display = item.status === 'uploading' || item.status === 'done' ? 'block' : 'none';
  fill.style.width = `${item.progress}%`;
  pct.textContent  = `${Math.round(item.progress)}%`;
  sizeEl.textContent = formatBytes(item.file.size);

  const errEl = row.querySelector('.row-error-msg');
  errEl.style.display = item.errorMsg ? 'block' : 'none';
  errEl.textContent   = item.errorMsg;

  const retryBtn = row.querySelector('.row-retry');
  retryBtn.style.display = item.status === 'error' ? 'inline-block' : 'none';
}

function updateFooter() {
  const done  = queue.filter((q) => q.status === 'done').length;
  const total = queue.length;
  countDone.textContent  = done;
  countTotal.textContent = total;
  btnUpload.disabled = total === 0 || isUploading || !authToken;
}

// ── Upload ─────────────────────────────────────────────────────────────────
btnUpload.addEventListener('click', () => {
  if (!isUploading && authToken) startQueue();
});

async function startQueue() {
  if (isUploading) return;
  isUploading = true;
  btnUpload.disabled = true;

  for (const item of queue) {
    if (item.status !== 'queued') continue;
    await uploadItem(item);
    updateFooter();
  }

  isUploading = false;
  updateFooter();
}

async function uploadItem(item, isRetry = false) {
  item.status   = 'uploading';
  item.progress = 0;
  item.errorMsg = '';
  renderQueue();

  try {
    const sessionUri = await createUploadSession(item);
    await uploadFile(item, sessionUri);
    item.status   = 'done';
    item.progress = 100;
  } catch (err) {
    if (err.status === 401 && !isRetry) {
      // Refresh token and retry once
      try {
        await refreshToken();
        return uploadItem(item, true);
      } catch {
        // Token refresh failed
      }
    }
    item.status   = 'error';
    item.errorMsg = err.message || 'Upload failed';
    console.error('Upload error for', item.file.name, err);
  }

  renderQueue();
}

async function createUploadSession(item) {
  const title = stripExtension(item.file.name);

  const metadata = {
    snippet: { title },
    status:  { privacyStatus: item.privacy },
  };

  const res = await fetchWithAuth(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': item.file.type || 'video/*',
        'X-Upload-Content-Length': item.file.size,
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!res.ok) {
    const err = new Error(`Session creation failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }

  const location = res.headers.get('Location');
  if (!location) throw new Error('No upload session URI returned');
  return location;
}

function uploadFile(item, sessionUri) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', sessionUri);
    xhr.setRequestHeader('Content-Type', item.file.type || 'application/octet-stream');
    xhr.setRequestHeader('Content-Range', `bytes 0-${item.file.size - 1}/${item.file.size}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        item.progress = (e.loaded / e.total) * 100;
        renderQueue();
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else if (xhr.status === 401) {
        const err = new Error('Unauthorized — token expired');
        err.status = 401;
        reject(err);
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.ontimeout = () => reject(new Error('Upload timed out'));

    xhr.send(item.file);
  });
}

async function fetchWithAuth(url, options = {}) {
  if (!authToken) throw new Error('Not authenticated');
  const headers = {
    Authorization: `Bearer ${authToken}`,
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, '');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

// ── Init ───────────────────────────────────────────────────────────────────
initAuth();
renderQueue();
updateFooter();
