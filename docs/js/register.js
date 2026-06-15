import { API_BASE } from "../constants/index.js";

const form = document.getElementById("register-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");
const titleInput = document.getElementById("title");
const titleError = document.getElementById("title-error");

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

  const body = { title };
  const author = document.getElementById("author").value.trim();
  const totalPages = document.getElementById("totalPages").value;
  const genre = document.getElementById("genre").value;

  if (author) body.author = author;
  if (totalPages) body.totalPages = Number(totalPages);
  if (genre) body.genre = genre;

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving…";

  try {
    const res = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    window.location.href = "index.html";
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Add Book";
  }
});
