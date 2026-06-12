const id = new URLSearchParams(location.search).get("id");

const form = document.getElementById("edit-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");
const titleInput = document.getElementById("title");
const titleError = document.getElementById("title-error");

async function fetchBook(bookId) {
  const res = await fetch(`http://localhost:3000/api/books/${bookId}`);
  if (!res.ok) throw new Error(`Failed to fetch book: ${res.status}`);
  return res.json();
}

function prefill(book) {
  document.title = `Edit "${book.title}" — Bookkeep`;
  document.getElementById("back-btn").href = `book.html?id=${id}`;

  titleInput.value = book.title ?? "";
  document.getElementById("author").value = book.author ?? "";
  document.getElementById("totalPages").value = book.totalPages ?? "";
  document.getElementById("currentPage").value = book.currentPage ?? 0;

  const genreSelect = document.getElementById("genre");
  if (book.genre) genreSelect.value = book.genre;

  document.getElementById("status").value = book.status ?? "UNREAD";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  titleError.textContent = "";
  formError.hidden = true;

  const title = titleInput.value.trim();
  if (!title) {
    titleError.textContent = "Title is required.";
    titleInput.focus();
    return;
  }

  const author = document.getElementById("author").value.trim();
  const totalPages = document.getElementById("totalPages").value;
  const currentPage = document.getElementById("currentPage").value;
  const genre = document.getElementById("genre").value;
  const status = document.getElementById("status").value;

  const body = { title };
  if (author) body.author = author;
  if (totalPages) body.totalPages = Number(totalPages);
  if (currentPage !== "") body.currentPage = Number(currentPage);
  if (genre) body.genre = genre;
  if (status) body.status = status;

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving…";

  try {
    const res = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    window.location.href = `book.html?id=${id}`;
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Changes";
  }
});

async function init() {
  if (!id) {
    formError.textContent = "No book ID specified.";
    formError.hidden = false;
    return;
  }
  try {
    const book = await fetchBook(id);
    prefill(book);
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
}

init();
