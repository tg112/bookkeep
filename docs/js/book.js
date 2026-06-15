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
  } catch (err) {
    renderError(err.message);
  }
}

init();
