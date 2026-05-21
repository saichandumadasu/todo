/**
 * app.js — Frontend logic for the Todo microservice UI.
 *
 * HOW TO CHANGE THE API URL:
 *   • Local dev  → leave API_BASE as http://localhost:8000
 *   • Docker     → leave API_BASE as http://localhost:8000
 *                  (docker-compose exposes port 8000 to the host)
 */
const API_BASE = "http://localhost:8000";

// ── State ─────────────────────────────────────────────────────────────────────
let todos = [];          // full list fetched from the API
let activeFilter = "all"; // "all" | "active" | "completed"

// ── DOM refs ──────────────────────────────────────────────────────────────────
const form       = document.getElementById("add-form");
const input      = document.getElementById("todo-input");
const list       = document.getElementById("todo-list");
const countEl    = document.getElementById("item-count");
const errorEl    = document.getElementById("error-banner");
const filterBtns = document.querySelectorAll(".filter-btn");

// ── Helpers ───────────────────────────────────────────────────────────────────

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  setTimeout(() => errorEl.classList.add("hidden"), 4000);
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${res.status}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
}

// ── Render ────────────────────────────────────────────────────────────────────

function filteredTodos() {
  if (activeFilter === "active")    return todos.filter(t => !t.completed);
  if (activeFilter === "completed") return todos.filter(t =>  t.completed);
  return todos;
}

function renderList() {
  const visible = filteredTodos();
  list.innerHTML = "";

  if (visible.length === 0) {
    list.innerHTML = `<li class="empty-state">No todos here — add one above!</li>`;
  } else {
    visible.forEach(todo => {
      const li = document.createElement("li");
      li.className = `todo-item${todo.completed ? " completed" : ""}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? "checked" : ""} aria-label="Toggle complete" />
        <span class="todo-title">${escapeHtml(todo.title)}</span>
        <button class="delete-btn" aria-label="Delete todo">✕</button>
      `;

      // Toggle complete
      li.querySelector("input").addEventListener("change", () => toggleTodo(todo.id, !todo.completed));
      // Delete
      li.querySelector(".delete-btn").addEventListener("click", () => deleteTodo(todo.id));

      list.appendChild(li);
    });
  }

  // Update footer count
  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} item${remaining !== 1 ? "s" : ""} left`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── API actions ───────────────────────────────────────────────────────────────

async function loadTodos() {
  try {
    todos = await apiFetch("/api/todos");
    renderList();
  } catch (err) {
    showError(`Could not load todos: ${err.message}`);
  }
}

async function addTodo(title) {
  try {
    const created = await apiFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    todos.unshift(created); // prepend (API returns newest-first)
    renderList();
  } catch (err) {
    showError(`Could not add todo: ${err.message}`);
  }
}

async function toggleTodo(id, completed) {
  try {
    const updated = await apiFetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed }),
    });
    todos = todos.map(t => (t.id === id ? updated : t));
    renderList();
  } catch (err) {
    showError(`Could not update todo: ${err.message}`);
    await loadTodos(); // re-sync on failure
  }
}

async function deleteTodo(id) {
  try {
    await apiFetch(`/api/todos/${id}`, { method: "DELETE" });
    todos = todos.filter(t => t.id !== id);
    renderList();
  } catch (err) {
    showError(`Could not delete todo: ${err.message}`);
  }
}

// ── Event listeners ───────────────────────────────────────────────────────────

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  input.value = "";
  addTodo(title);
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderList();
  });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
loadTodos();
