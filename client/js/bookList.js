const PAGE_SIZE = 20;

let allBooks = [];
let filters = { status: "", genre: "" };
let currentPage = 1;

// API
async function fetchBooks() {
  const res = await fetch("http://localhost:3000/api/books");
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`);
  return res.json();
}

async function deleteBook(id) {
  const res = await fetch(`http://localhost:3000/api/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete book: ${res.status}`);
}

// Filter
function getFilteredBooks() {
  return allBooks.filter((book) => {
    const statusMatch =
      !filters.status || (book.status ?? "UNREAD") === filters.status;
    const genreMatch = !filters.genre || book.genre === filters.genre;
    return statusMatch && genreMatch;
  });
}

// Card
function createStatusBadge(status) {
  const span = document.createElement("span");
  span.className = `status-badge status-${status.toLowerCase()}`;
  span.textContent = status;
  return span;
}

function createBookCard(book) {
  const a = document.createElement("a");
  a.className = "book-card";
  a.href = `book.html?id=${book._id}`;

  const info = document.createElement("div");
  info.className = "book-info";

  const title = document.createElement("span");
  title.className = "book-title";
  title.textContent = book.title;

  const sub = document.createElement("span");
  sub.className = "book-subtitle";
  const parts = [book.author || "Unknown author"];
  if (book.genre) parts.push(book.genre.replace("-", "‑"));
  sub.textContent = parts.join(" · ");

  info.append(title, sub);

  const meta = document.createElement("div");
  meta.className = "book-meta";

  meta.append(createStatusBadge(book.status ?? "UNREAD"));

  if (book.totalPages) {
    const pages = document.createElement("span");
    pages.className = "book-pages";
    pages.textContent = `${book.totalPages} pages`;
    meta.append(pages);
  }

  const editBtn = document.createElement("button");
  editBtn.className = "btn-edit";
  editBtn.textContent = "✎";
  editBtn.setAttribute("aria-label", "Edit book");
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `edit.html?id=${book._id}`;
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "✕";
  deleteBtn.setAttribute("aria-label", "Delete book");
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${book.title}"?`)) return;
    try {
      await deleteBook(book._id);
      allBooks = allBooks.filter((b) => b._id !== book._id);
      const totalPages = Math.ceil(getFilteredBooks().length / PAGE_SIZE);
      if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
      render();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  });

  meta.append(editBtn, deleteBtn);
  a.append(info, meta);
  return a;
}

// Pagination
function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  if (totalPages <= 1) {
    pagination.hidden = true;
    return;
  }

  pagination.hidden = false;
  pagination.innerHTML = "";

  const prev = document.createElement("button");
  prev.className = "btn btn-secondary page-btn";
  prev.textContent = "← Prev";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => {
    currentPage--;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const info = document.createElement("span");
  info.className = "page-info";
  info.textContent = `Page ${currentPage} of ${totalPages}`;

  const next = document.createElement("button");
  next.className = "btn btn-secondary page-btn";
  next.textContent = "Next →";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () => {
    currentPage++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  pagination.append(prev, info, next);
}

// Render
function render() {
  const list = document.getElementById("book-list");
  list.innerHTML = "";

  const filtered = getFilteredBooks();
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageBooks = filtered.slice(start, start + PAGE_SIZE);

  if (filtered.length === 0) {
    const li = document.createElement("li");
    const msg = document.createElement("p");
    msg.className = "status-message";
    msg.textContent = "No books found.";
    li.append(msg);
    list.append(li);
  } else {
    pageBooks.forEach((book) => {
      const li = document.createElement("li");
      li.append(createBookCard(book));
      list.append(li);
    });
  }

  renderPagination(filtered.length);
}

// Filter event listeners
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filters.status = btn.dataset.status;
    currentPage = 1;
    render();
  });
});

document.getElementById("genre-filter").addEventListener("change", (e) => {
  filters.genre = e.target.value;
  currentPage = 1;
  render();
});

// Init
async function init() {
  const list = document.getElementById("book-list");
  try {
    allBooks = await fetchBooks();
    render();
  } catch (err) {
    list.innerHTML = "";
    const li = document.createElement("li");
    const msg = document.createElement("p");
    msg.className = "status-message";
    msg.textContent = `Error: ${err.message}`;
    li.append(msg);
    list.append(li);
  }
}

init();
