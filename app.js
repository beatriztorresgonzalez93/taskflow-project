// ===== SELECTORES =====
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const search = document.querySelector("#task-search");

const btnNewTask = document.querySelector("#btn-new-task");

const modal = document.querySelector("#task-modal");
const modalInput = document.querySelector("#modal-task-input");
const modalCancel = document.querySelector("#modal-cancel");
const modalSave = document.querySelector("#modal-save");

const STORAGE_KEY = "taskflow_tasks";
let tasks = [];

// ===== LOCALSTORAGE =====
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

// ===== UI =====
function renderTasks(filterText = "") {
  list.innerHTML = "";

  const q = filterText.trim().toLowerCase();
  const filtered = q
    ? tasks.filter(t => t.text.toLowerCase().includes(q))
    : tasks;

    // Ordenar: pendientes primero, completadas después
const ordered = [...filtered].sort((a, b) => a.done - b.done);

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "task-empty";
    empty.textContent = q
      ? "No hay tareas que coincidan."
      : "Aún no tienes tareas. Añade la primera 🐉";
    list.appendChild(empty);
    return;
  }

  ordered.forEach(task => {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  if (task.done) li.classList.add("done");

  const left = document.createElement("div");
  left.className = "task-left";

  const check = document.createElement("button");
  check.type = "button";
  check.className = "task-check";
  check.setAttribute("aria-label", "Marcar como completada");
  check.textContent = task.done ? "✓" : "";

  check.addEventListener("click", () => {
    tasks = tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t);
    saveTasks();
    renderTasks(search?.value || "");
  });

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  span.addEventListener("click", () => {
  li.classList.toggle("expanded");
});

  left.appendChild(check);
  left.appendChild(span);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "task-delete";
  btn.textContent = "Eliminar";
  btn.addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks(search?.value || "");
  });

  li.appendChild(left);
  li.appendChild(btn);
  list.appendChild(li);
});
}

// ===== LÓGICA =====
function addTask(text) {
  const clean = text.trim();
  if (!clean) return;

  const task = {
  id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  text: clean,
  done: false
};

  tasks.push(task);
  saveTasks();
  renderTasks(search?.value || "");
}

// ===== EVENTOS =====
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

btnNewTask?.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modalInput.value = "";
  modalInput.focus();
});

modalCancel?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modalSave?.addEventListener("click", () => {
  const text = modalInput.value.trim();
  if (!text) return;

  addTask(text);
  modal.classList.add("hidden");
});

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.add("hidden");
  }
});

search?.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

// ===== INIT =====
loadTasks();
renderTasks();