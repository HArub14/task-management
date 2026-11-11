'use strict';

// ==========================================
// UUID helper (works on file:// without secure context)
// ==========================================
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ==========================================
// Constants
// ==========================================
const KEYS = {
  tasks: 'tm_tasks',
  currentUser: 'tm_current_user',
};

const MOCK_USERS = [
  { id: 'u1', email: 'alice@example.com', name: 'Alice Tanaka' },
  { id: 'u2', email: 'bob@example.com', name: 'Bob Suzuki' },
  { id: 'u3', email: 'carol@example.com', name: 'Carol Yamamoto' },
];

const STATUS = {
  todo: { label: '未着手', badgeClass: 'badge--todo' },
  in_progress: { label: '進行中', badgeClass: 'badge--in-progress' },
  done: { label: '完了', badgeClass: 'badge--done' },
};

const PRIORITY = {
  high: { label: '高', badgeClass: 'badge--high' },
  medium: { label: '中', badgeClass: 'badge--medium' },
  low: { label: '低', badgeClass: 'badge--low' },
};

const SEED_TASKS = [
  {
    id: 't1',
    title: 'ログイン画面のUIデザインレビュー',
    description: 'フィグマのデザインを確認し、フィードバックをまとめる。',
    status: 'in_progress',
    priority: 'high',
    due_date: '2026-11-15',
    assignee_id: 'u1',
    created_by: 'u1',
    created_at: '2026-11-01T09:00:00Z',
    updated_at: '2026-11-01T09:00:00Z',
  },
  {
    id: 't2',
    title: 'タスク一覧APIの設計',
    description: 'フィルター・ソート・ページングの仕様を決定する。',
    status: 'todo',
    priority: 'medium',
    due_date: '2026-11-20',
    assignee_id: 'u2',
    created_by: 'u1',
    created_at: '2026-11-02T10:30:00Z',
    updated_at: '2026-11-02T10:30:00Z',
  },
  {
    id: 't3',
    title: 'DB設計書のレビュー完了',
    description: null,
    status: 'done',
    priority: 'low',
    due_date: null,
    assignee_id: 'u3',
    created_by: 'u2',
    created_at: '2026-10-28T14:00:00Z',
    updated_at: '2026-11-03T11:00:00Z',
  },
];

// ==========================================
// Storage Layer
// ==========================================
function getTasks() {
  try {
    const raw = localStorage.getItem(KEYS.tasks);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveTasks(tasks) {
  localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
}

function getTaskById(id) {
  return getTasks().find(t => t.id === id) || null;
}

function createTask(fields) {
  const tasks = getTasks();
  const task = {
    id: generateId(),
    ...fields,
    created_by: getCurrentUser().id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.unshift(task);
  saveTasks(tasks);
  return task;
}

function updateTask(id, fields) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...fields, updated_at: new Date().toISOString() };
  saveTasks(tasks);
  return tasks[idx];
}

function deleteTask(id) {
  saveTasks(getTasks().filter(t => t.id !== id));
}

// ==========================================
// Auth
// ==========================================
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function login(email) {
  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) return false;
  localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  return true;
}

function logout() {
  localStorage.removeItem(KEYS.currentUser);
  navigate('#login');
}

// ==========================================
// Utils
// ==========================================
function navigate(hash) {
  window.location.hash = hash;
}

function getUserName(id) {
  if (!id) return null;
  return MOCK_USERS.find(u => u.id === id)?.name || null;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

function statusBadge(status) {
  const s = STATUS[status];
  if (!s) return '';
  return `<span class="badge ${s.badgeClass}">${s.label}</span>`;
}

function priorityBadge(priority) {
  if (!priority) return '<span class="detail-field__value--empty">—</span>';
  const p = PRIORITY[priority];
  if (!p) return '';
  return `<span class="badge ${p.badgeClass}">${p.label}</span>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// Icons (inline SVG helpers)
// ==========================================
const ICON = {
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
  empty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  grip: `<svg viewBox="0 0 10 16" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/></svg>`,
};

// ==========================================
// Sort Helpers
// ==========================================
function sortByPriority(tasks) {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3));
}

function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  });
}

// ==========================================
// App Shell
// ==========================================
function renderHeader() {
  const user = getCurrentUser();
  if (!user) return '';
  return `
    <header class="app-header">
      <a class="app-header__logo" href="#tasks">${ICON.logo} TaskManagement</a>
      <div class="app-header__user">
        <span>${escapeHtml(user.name)}</span>
        <button class="btn btn--ghost btn--sm" id="btn-logout">${ICON.logout} ログアウト</button>
      </div>
    </header>
  `;
}

function attachHeaderEvents() {
  const btn = document.getElementById('btn-logout');
  if (btn) btn.addEventListener('click', logout);
}

// ==========================================
// S01 — Login Screen
// ==========================================
function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-logo">${ICON.logo} TaskManagement</div>
        <p class="login-subtitle">タスク管理アプリ · プロトタイプ</p>

        <div id="login-alert"></div>

        <form class="form" id="login-form">
          <div class="form-group">
            <label class="form-label" for="email">メールアドレス <span class="required">*</span></label>
            <input class="form-input" type="email" id="email" placeholder="alice@example.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label class="form-label" for="password">パスワード <span class="required">*</span></label>
            <input class="form-input" type="password" id="password" placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button class="btn btn--primary btn--lg btn--full" type="submit">ログイン</button>
        </form>

        <div class="login-hint">
          <strong>プロトタイプ用アカウント</strong><br>
          alice@example.com<br>
          bob@example.com<br>
          carol@example.com<br>
          （パスワードは何でも可）
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const alertEl = document.getElementById('login-alert');

    if (login(email)) {
      navigate('#tasks');
    } else {
      alertEl.innerHTML = `<div class="alert alert--error" style="margin-bottom:16px">メールアドレスが見つかりません。上記のアカウントをお試しください。</div>`;
    }
  });
}

// ==========================================
// S02 — Task List Screen
// ==========================================
function renderTaskList() {
  const tasks = getTasks();

  let tableContent;
  if (tasks.length === 0) {
    tableContent = `
      <div class="empty-state">
        <div class="empty-state__icon">${ICON.empty}</div>
        <div class="empty-state__title">タスクがありません</div>
        <p class="empty-state__desc">「新規タスク作成」ボタンから最初のタスクを追加してください。</p>
      </div>
    `;
  } else {
    const rows = tasks.map(t => {
      const assignee = getUserName(t.assignee_id);
      const due = formatDate(t.due_date);
      return `
        <tr data-id="${escapeHtml(t.id)}" draggable="true">
          <td class="table__drag-handle" title="ドラッグして並び替え">${ICON.grip}</td>
          <td><span class="table__title">${escapeHtml(t.title)}</span></td>
          <td>${statusBadge(t.status)}</td>
          <td>${escapeHtml(assignee || '—')}</td>
          <td>${escapeHtml(due || '—')}</td>
          <td>${priorityBadge(t.priority)}</td>
        </tr>
      `;
    }).join('');

    tableContent = `
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="table__drag-col"></th>
              <th>タイトル</th>
              <th>ステータス</th>
              <th>担当者</th>
              <th>期限</th>
              <th>優先度</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="page">
      <div class="page-header">
        <h1 class="page-title">タスク一覧</h1>
        <div class="page-header__actions">
          <div class="sort-toolbar">
            <span class="sort-toolbar__label">並び替え</span>
            <button class="btn btn--secondary btn--sm" id="btn-sort-priority">優先度順</button>
            <button class="btn btn--secondary btn--sm" id="btn-sort-due">期限順</button>
          </div>
          <button class="btn btn--primary" id="btn-new-task">${ICON.plus} 新規タスク作成</button>
        </div>
      </div>
      ${tableContent}
    </main>
  `;

  attachHeaderEvents();

  document.getElementById('btn-new-task').addEventListener('click', () => navigate('#tasks/new'));

  document.getElementById('btn-sort-priority').addEventListener('click', () => {
    saveTasks(sortByPriority(getTasks()));
    renderTaskList();
  });

  document.getElementById('btn-sort-due').addEventListener('click', () => {
    saveTasks(sortByDueDate(getTasks()));
    renderTaskList();
  });

  document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('click', () => navigate(`#tasks/${row.dataset.id}`));
  });

  attachDragAndDrop();
}

function attachDragAndDrop() {
  let dragSrc = null;

  document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('dragstart', e => {
      dragSrc = row;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => row.classList.add('is-dragging'), 0);
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('is-dragging');
      document.querySelectorAll('.table tbody tr').forEach(r => r.classList.remove('drag-over'));
      dragSrc = null;
    });

    row.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (row === dragSrc) return;
      document.querySelectorAll('.table tbody tr').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });

    row.addEventListener('dragleave', e => {
      if (row.contains(e.relatedTarget)) return;
      row.classList.remove('drag-over');
    });

    row.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragSrc || dragSrc === row) return;

      const tasks = getTasks();
      const srcIdx = tasks.findIndex(t => t.id === dragSrc.dataset.id);
      const tgtIdx = tasks.findIndex(t => t.id === row.dataset.id);

      const [moved] = tasks.splice(srcIdx, 1);
      tasks.splice(srcIdx < tgtIdx ? tgtIdx - 1 : tgtIdx, 0, moved);
      saveTasks(tasks);

      renderTaskList();
    });
  });
}

// ==========================================
// S03 — Task Create Screen
// ==========================================
function renderTaskCreate() {
  const userOptions = MOCK_USERS.map(u =>
    `<option value="${u.id}">${escapeHtml(u.name)}</option>`
  ).join('');

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="page page--narrow">
      <button class="back-link" id="btn-back">${ICON.back} タスク一覧に戻る</button>
      <div class="card">
        <div class="card__body">
          <h1 class="page-title" style="margin-bottom:24px">新規タスク作成</h1>
          <form class="form" id="create-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="f-title">タイトル <span class="required">*</span></label>
              <input class="form-input" type="text" id="f-title" maxlength="100" placeholder="タスクのタイトルを入力" />
              <div class="form-error" id="err-title" style="display:none">タイトルは必須です</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-description">説明</label>
              <textarea class="form-textarea" id="f-description" placeholder="タスクの詳細を入力（任意）"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-status">ステータス <span class="required">*</span></label>
              <select class="form-select" id="f-status">
                <option value="todo">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="done">完了</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-priority">優先度</label>
              <select class="form-select" id="f-priority">
                <option value="">— 選択してください —</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-assignee">担当者</label>
              <select class="form-select" id="f-assignee">
                <option value="">— 選択してください —</option>
                ${userOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-due">期限</label>
              <input class="form-input" type="date" id="f-due" />
            </div>
            <div class="form-actions">
              <button class="btn btn--primary" type="submit">${ICON.save} タスクを作成</button>
              <button class="btn btn--secondary" type="button" id="btn-cancel">キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  `;

  attachHeaderEvents();

  document.getElementById('btn-back').addEventListener('click', () => navigate('#tasks'));
  document.getElementById('btn-cancel').addEventListener('click', () => navigate('#tasks'));

  document.getElementById('create-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('f-title').value.trim();
    const errEl = document.getElementById('err-title');
    const titleInput = document.getElementById('f-title');

    if (!title) {
      titleInput.classList.add('is-error');
      errEl.style.display = 'flex';
      titleInput.focus();
      return;
    }

    titleInput.classList.remove('is-error');
    errEl.style.display = 'none';

    createTask({
      title,
      description: document.getElementById('f-description').value.trim() || null,
      status: document.getElementById('f-status').value,
      priority: document.getElementById('f-priority').value || null,
      assignee_id: document.getElementById('f-assignee').value || null,
      due_date: document.getElementById('f-due').value || null,
    });

    navigate('#tasks');
  });
}

// ==========================================
// S04 — Task Detail / Edit Screen
// ==========================================
function renderTaskDetail(id) {
  const task = getTaskById(id);
  if (!task) {
    navigate('#tasks');
    return;
  }

  renderDetailView(task);
}

function renderDetailView(task) {
  const assignee = getUserName(task.assignee_id);
  const due = formatDate(task.due_date);

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="page page--narrow">
      <button class="back-link" id="btn-back">${ICON.back} タスク一覧に戻る</button>
      <div class="card">
        <div class="card__body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;gap:12px">
            <h1 class="page-title" style="flex:1">${escapeHtml(task.title)}</h1>
            <div style="display:flex;gap:8px;flex-shrink:0">
              <button class="btn btn--secondary btn--sm" id="btn-edit">${ICON.edit} 編集</button>
              <button class="btn btn--danger btn--sm" id="btn-delete">${ICON.trash} 削除</button>
            </div>
          </div>

          <div class="detail-fields">
            <div class="detail-field">
              <div class="detail-field__label">ステータス</div>
              <div class="detail-field__value">${statusBadge(task.status)}</div>
            </div>
            <div class="detail-field">
              <div class="detail-field__label">優先度</div>
              <div class="detail-field__value">${priorityBadge(task.priority)}</div>
            </div>
            <div class="detail-field">
              <div class="detail-field__label">担当者</div>
              <div class="detail-field__value ${assignee ? '' : 'detail-field__value--empty'}">${escapeHtml(assignee || '未設定')}</div>
            </div>
            <div class="detail-field">
              <div class="detail-field__label">期限</div>
              <div class="detail-field__value ${due ? '' : 'detail-field__value--empty'}">${escapeHtml(due || '未設定')}</div>
            </div>
            <div class="detail-field">
              <div class="detail-field__label">説明</div>
              <div class="detail-field__value ${task.description ? '' : 'detail-field__value--empty'}" style="white-space:pre-wrap">${escapeHtml(task.description || '説明なし')}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  attachHeaderEvents();

  document.getElementById('btn-back').addEventListener('click', () => navigate('#tasks'));

  document.getElementById('btn-edit').addEventListener('click', () => {
    renderEditView(task);
  });

  document.getElementById('btn-delete').addEventListener('click', () => {
    if (window.confirm(`「${task.title}」を削除しますか？\nこの操作は取り消せません。`)) {
      deleteTask(task.id);
      navigate('#tasks');
    }
  });
}

function renderEditView(task) {
  const userOptions = MOCK_USERS.map(u =>
    `<option value="${u.id}" ${u.id === task.assignee_id ? 'selected' : ''}>${escapeHtml(u.name)}</option>`
  ).join('');

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="page page--narrow">
      <button class="back-link" id="btn-back">${ICON.back} タスク一覧に戻る</button>
      <div class="card">
        <div class="card__body">
          <h1 class="page-title" style="margin-bottom:24px">タスクを編集</h1>
          <form class="form" id="edit-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="f-title">タイトル <span class="required">*</span></label>
              <input class="form-input" type="text" id="f-title" maxlength="100" value="${escapeHtml(task.title)}" />
              <div class="form-error" id="err-title" style="display:none">タイトルは必須です</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-description">説明</label>
              <textarea class="form-textarea" id="f-description">${escapeHtml(task.description || '')}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-status">ステータス <span class="required">*</span></label>
              <select class="form-select" id="f-status">
                <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>未着手</option>
                <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>進行中</option>
                <option value="done" ${task.status === 'done' ? 'selected' : ''}>完了</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-priority">優先度</label>
              <select class="form-select" id="f-priority">
                <option value="" ${!task.priority ? 'selected' : ''}>— 選択してください —</option>
                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>高</option>
                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>中</option>
                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>低</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-assignee">担当者</label>
              <select class="form-select" id="f-assignee">
                <option value="" ${!task.assignee_id ? 'selected' : ''}>— 選択してください —</option>
                ${userOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-due">期限</label>
              <input class="form-input" type="date" id="f-due" value="${escapeHtml(task.due_date || '')}" />
            </div>
            <div class="form-actions">
              <button class="btn btn--primary" type="submit">${ICON.save} 変更を保存</button>
              <button class="btn btn--secondary" type="button" id="btn-cancel">キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  `;

  attachHeaderEvents();

  document.getElementById('btn-back').addEventListener('click', () => navigate('#tasks'));
  document.getElementById('btn-cancel').addEventListener('click', () => renderDetailView(task));

  document.getElementById('edit-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('f-title').value.trim();
    const errEl = document.getElementById('err-title');
    const titleInput = document.getElementById('f-title');

    if (!title) {
      titleInput.classList.add('is-error');
      errEl.style.display = 'flex';
      titleInput.focus();
      return;
    }

    const updated = updateTask(task.id, {
      title,
      description: document.getElementById('f-description').value.trim() || null,
      status: document.getElementById('f-status').value,
      priority: document.getElementById('f-priority').value || null,
      assignee_id: document.getElementById('f-assignee').value || null,
      due_date: document.getElementById('f-due').value || null,
    });

    renderDetailView(updated);
  });
}

// ==========================================
// Router
// ==========================================
function router() {
  const hash = window.location.hash || '#login';
  const user = getCurrentUser();

  if (hash === '#login') {
    if (user) {
      navigate('#tasks');
      return;
    }
    renderLogin();
    return;
  }

  if (!user) {
    navigate('#login');
    return;
  }

  if (hash === '#tasks') {
    renderTaskList();
    return;
  }

  if (hash === '#tasks/new') {
    renderTaskCreate();
    return;
  }

  const detailMatch = hash.match(/^#tasks\/(.+)$/);
  if (detailMatch) {
    renderTaskDetail(detailMatch[1]);
    return;
  }

  navigate('#tasks');
}

// ==========================================
// Init
// ==========================================
function init() {
  if (getTasks() === null) {
    saveTasks(SEED_TASKS);
  }

  window.addEventListener('hashchange', router);
  router();
}

document.addEventListener('DOMContentLoaded', init);
