import { API_BASE } from "../constants/index.js";

const id = new URLSearchParams(location.search).get("id");

async function fetchBook(bookId) {
  const res = await fetch(`${API_BASE}/books/${bookId}`);
  if (!res.ok) throw new Error(`Failed to fetch book: ${res.status}`);
  return res.json();
}

function progressPercent(current, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

function renderBook(book) {
  document.title = `${book.title} — Bookkeep`;

  const pct = progressPercent(book.currentPage ?? 0, book.totalPages);

  const detail = document.getElementById("book-detail");
  detail.innerHTML = `
    <div class="detail-card card">
      <div class="detail-header">
        <div class="detail-badges">
          ${book.genre ? `<span class="genre-badge">${book.genre.replace("-", "&#8209;")}</span>` : ""}
          <span class="status-badge status-${(book.status ?? "UNREAD").toLowerCase()}">${book.status ?? "UNREAD"}</span>
        </div>
        <h1 class="detail-title">${escapeHtml(book.title)}</h1>
        <p class="detail-author">${escapeHtml(book.author ?? "Unknown author")}</p>
      </div>

      <hr class="divider" />

      <div class="detail-section">
        <h2 class="detail-section-label">Reading Progress</h2>
        <div class="progress-stats">
          <span class="progress-pages">
            <strong>${book.currentPage ?? 0}</strong>
            ${book.totalPages ? ` / ${book.totalPages} pages` : " pages read"}
          </span>
          ${book.totalPages ? `<span class="progress-pct">${pct}%</span>` : ""}
        </div>
        ${
          book.totalPages
            ? `<div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${pct}%"></div>
               </div>`
            : ""
        }
      </div>

      ${
        book.totalPages
          ? `<div class="detail-meta-grid">
              <div class="meta-item">
                <span class="meta-label">Total Pages</span>
                <span class="meta-value">${book.totalPages}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Pages Left</span>
                <span class="meta-value">${Math.max(0, book.totalPages - (book.currentPage ?? 0))}</span>
              </div>
            </div>`
          : ""
      }
    </div>
  `;
}

function renderError(msg) {
  const detail = document.getElementById("book-detail");
  detail.innerHTML = `<p class="status-message">${escapeHtml(msg)}</p>`;
}

// ── Notes ──
async function fetchNotes(bookId) {
  const res = await fetch(`${API_BASE}/books/${bookId}/notes`);
  if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
  return res.json();
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function createNoteCard(note) {
  const li = document.createElement("li");
  li.className = "note-card";

  const body = document.createElement("p");
  body.className = "note-content";
  body.textContent = note.content;

  const meta = document.createElement("div");
  meta.className = "note-meta";
  const stamp = document.createElement("span");
  stamp.className = "note-date";
  stamp.textContent = formatDate(note.updatedAt ?? note.createdAt);
  meta.append(stamp);
  if (note.page != null) {
    const page = document.createElement("span");
    page.className = "note-page";
    page.textContent = `· p.${note.page}`;
    meta.append(page);
  }

  const actions = document.createElement("div");
  actions.className = "note-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary note-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => startEditNote(li, note));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-secondary note-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
      await refreshNotes();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  });

  actions.append(editBtn, deleteBtn);
  li.append(body, meta, actions);
  return li;
}

function startEditNote(li, note) {
  li.innerHTML = "";

  const textarea = document.createElement("textarea");
  textarea.className = "note-textarea";
  textarea.rows = 3;
  textarea.value = note.content;

  const row = document.createElement("div");
  row.className = "note-form-row";

  const pageInput = document.createElement("input");
  pageInput.className = "note-page-input";
  pageInput.type = "number";
  pageInput.min = "1";
  pageInput.placeholder = "Page (optional)";
  if (note.page != null) pageInput.value = note.page;

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn note-btn";
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", async () => {
    const content = textarea.value.trim();
    if (!content) return;
    const pageVal = pageInput.value.trim();
    try {
      const res = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          page: pageVal === "" ? null : Number(pageVal),
        }),
      });
      if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);
      await refreshNotes();
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-secondary note-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => refreshNotes());

  row.append(pageInput, saveBtn, cancelBtn);
  li.append(textarea, row);
  textarea.focus();
}

function renderNotes(notes) {
  const list = document.getElementById("notes-list");
  list.innerHTML = "";

  if (!notes.length) {
    const li = document.createElement("li");
    li.className = "notes-empty";
    li.textContent = "No notes yet.";
    list.append(li);
    return;
  }

  notes.forEach((note) => list.append(createNoteCard(note)));
}

async function refreshNotes() {
  try {
    const notes = await fetchNotes(id);
    renderNotes(notes);
  } catch (err) {
    const list = document.getElementById("notes-list");
    list.innerHTML = "";
    const li = document.createElement("li");
    li.className = "notes-empty";
    li.textContent = err.message;
    list.append(li);
  }
}

function setupNoteForm() {
  const form = document.getElementById("note-form");
  const content = document.getElementById("note-content");
  const pageInput = document.getElementById("note-page");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = content.value.trim();
    if (!text) return;
    const pageVal = pageInput.value.trim();
    try {
      const res = await fetch(`${API_BASE}/books/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          page: pageVal === "" ? null : Number(pageVal),
        }),
      });
      if (!res.ok) throw new Error(`Failed to add note: ${res.status}`);
      form.reset();
      await refreshNotes();
    } catch (err) {
      alert(`Failed to add note: ${err.message}`);
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function init() {
  if (!id) {
    renderError("No book ID specified.");
    return;
  }
  try {
    const book = await fetchBook(id);
    renderBook(book);
    document.getElementById("notes").hidden = false;
    setupNoteForm();
    await refreshNotes();
  } catch (err) {
    renderError(err.message);
  }
}

init();
