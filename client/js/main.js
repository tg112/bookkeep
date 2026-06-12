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

function createBookCard(book, li) {
  const a = document.createElement("a");
  a.className = "book-card";
  a.href = `book.html?id=${book._id}`;

  const info = document.createElement("div");
  info.className = "book-info";

  const title = document.createElement("span");
  title.className = "book-title";
  title.textContent = book.title;

  const author = document.createElement("span");
  author.className = "book-author";
  author.textContent = book.author || "Unknown author";

  info.append(title, author);

  const meta = document.createElement("div");
  meta.className = "book-meta";

  const pages = document.createElement("span");
  pages.className = "book-pages";
  pages.textContent = book.pages ? `${book.pages} pages` : "";

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
      li.remove();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  });

  meta.append(pages, deleteBtn);
  a.append(info, meta);
  return a;
}

async function renderBookList() {
  const list = document.getElementById("book-list");

  try {
    const books = await fetchBooks();

    if (books.length === 0) {
      const msg = document.createElement("p");
      msg.className = "status-message";
      msg.textContent = "No books found.";
      list.replaceWith(msg);
      return;
    }

    books.forEach((book) => {
      const li = document.createElement("li");
      li.append(createBookCard(book, li));
      list.append(li);
    });
  } catch (err) {
    const msg = document.createElement("p");
    msg.className = "status-message";
    msg.textContent = `Error: ${err.message}`;
    list.replaceWith(msg);
  }
}

renderBookList();
