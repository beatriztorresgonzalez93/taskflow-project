// ===== SELECTORES =====
const taskFormEl = document.querySelector("#task-form");
const taskInputEl = document.querySelector("#task-input");
const taskPriorityEl = document.querySelector("#task-priority");
const taskListEl = document.querySelector("#task-list");
const taskSearchEl = document.querySelector("#task-search");

const btnNewTaskEl = document.querySelector("#btn-new-task");

const taskModalEl = document.querySelector("#task-modal");
const taskModalInputEl = document.querySelector("#modal-task-input");
const taskModalPriorityEl = document.querySelector("#modal-task-priority");
const taskModalCancelEl = document.querySelector("#modal-cancel");
const taskModalSaveEl = document.querySelector("#modal-save");

const taskStatsEl = document.querySelector("#task-stats");
const taskErrorEl = document.querySelector("#task-error");

const STORAGE_KEY = "taskflow_tasks";
let tasks = [];
let currentFilter = "all";
let currentPriorityFilter = "all";

// ===== LOCALSTORAGE =====
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function readStoredTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeTask(item) {
  if (typeof item === "string") {
    return {
      id: generateId(),
      text: item,
      done: false,
      priority: "media",
    };
  }

  const priority =
    item?.priority === "baja" || item?.priority === "alta" || item?.priority === "media"
      ? item.priority
      : "media";

  return {
    id: item?.id ?? generateId(),
    text: item?.text ?? "",
    done: Boolean(item?.done),
    priority,
  };
}

function loadTasks() {
  const stored = readStoredTasks();

  if (stored.length === 0) {
    const demoTasks = [
      normalizeTask({
        id: crypto.randomUUID(),
        text: "Entrenamiento de combate con dragón",
        done: false,
        priority: "alta",
      }),
      normalizeTask({
        id: crypto.randomUUID(),
        text: "Estudiar historia del Cuadrante de Jinetes",
        done: false,
        priority: "media",
      }),
      normalizeTask({
        id: crypto.randomUUID(),
        text: "Cuidar el equipo de montar dragón",
        done: false,
        priority: "baja",
      }),
    ];

    tasks = demoTasks;
    saveTasks();
    return;
  }

  tasks = stored.map(normalizeTask);
}

// ===== LÓGICA =====
function getCurrentFilter() {
  return taskSearchEl ? taskSearchEl.value : "";
}

function commitTasks() {
  saveTasks();
  renderTasks(getCurrentFilter());
}

function showTaskError(message) {
  if (!taskErrorEl) return;
  taskErrorEl.textContent = message || "";
  taskErrorEl.classList.toggle("hidden", !message);
}

function addTask(text, priority = "media") {
  const clean = (text || "").trim();

  if (!clean) return "La tarea no puede estar vacía.";
  if (clean.length > 100) return "La tarea no puede superar 100 caracteres.";
  if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) {
    return "Esa tarea ya existe.";
  }

  const safePriority =
    priority === "baja" || priority === "alta" || priority === "media"
      ? priority
      : "media";

      console.log("priority recibida:", priority);
      console.log("safePriority:", safePriority);

  const task = {
    id: generateId(),
    text: clean,
    done: false,
    priority: safePriority,
  };

  tasks.push(task);
  commitTasks();
  return "";
}

// ===== UI =====
function getFilteredTasks(filterText = "") {
  const q = filterText.trim().toLowerCase();

  let filtered = q
    ? tasks.filter((task) => task.text.toLowerCase().includes(q))
    : tasks;

  if (currentFilter === "pending") {
    filtered = filtered.filter((task) => !task.done);
  } else if (currentFilter === "completed") {
    filtered = filtered.filter((task) => task.done);
  }

  if (currentPriorityFilter !== "all") {
    filtered = filtered.filter((task) => task.priority === currentPriorityFilter);
  }

  return { q, filtered };
}

function orderTasks(taskList) {
  return [...taskList].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
}

function renderEmptyState(q) {
  if (!taskListEl) return;

  const empty = document.createElement("li");
  empty.className =
    "rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 " +
    "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400";
  empty.textContent = q ? "No hay tareas que coincidan." : "Aún no tienes tareas. Añade la primera 🐉";
  taskListEl.appendChild(empty);

  updateStats();
}

function createTaskListItem(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className =
    "flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 shadow-sm transition " +
    "hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60";

  const left = document.createElement("div");
  left.className = "flex min-w-0 flex-1 items-center gap-3";

  const check = document.createElement("button");
  check.type = "button";
  check.dataset.action = "toggle";
  check.setAttribute("aria-label", task.done ? "Marcar como pendiente" : "Marcar como completada");
  check.className =
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition " +
    (task.done
      ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
      : "border-slate-300 bg-white text-transparent hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900");
  check.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.415 0l-3-3A1 1 0 016.454 9.54l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
  `;

  const textWrap = document.createElement("div");
  textWrap.className = "min-w-0 flex-1";

  const textRow = document.createElement("div");
  textRow.className = "flex items-center gap-2 w-full min-w-0";

  const span = document.createElement("span");
  span.className =
    "block min-w-0 flex-1 text-base transition " +
    (task.done
      ? "text-slate-400 line-through dark:text-slate-500"
      : "text-slate-900 dark:text-slate-100");
  span.textContent = task.text;

  const priorityChip = document.createElement("span");
priorityChip.className = "inline-block h-4 w-4 rounded-full shrink-0 border border-white/20";



if (task.priority === "baja") {
  priorityChip.style.backgroundColor = "#38bdf8"; // azul
} else if (task.priority === "alta") {
  priorityChip.style.backgroundColor = "#fb7185"; // rojo/rosa
} else {
  priorityChip.style.backgroundColor = "#fbbf24"; // naranja
}

  textRow.appendChild(span);
  textRow.appendChild(priorityChip);
  textWrap.appendChild(textRow);

  left.appendChild(check);
  left.appendChild(textWrap);

  const edit = document.createElement("button");
  edit.type = "button";
  edit.dataset.action = "edit";
  edit.className =
    "inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 shadow-sm transition " +
    "hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-100 dark:hover:bg-violet-400/20 dark:hover:border-violet-400/30";
  edit.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9-4 1 1-4 9.9-9.9a2 2 0 012.828 0z"/>
    </svg>
    <span>Editar</span>
  `;

  const del = document.createElement("button");
  del.type = "button";
  del.dataset.action = "delete";
  del.className =
    "inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition " +
    "hover:bg-rose-100 hover:-translate-y-0.5 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40";
  del.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zM12 8a1 1 0 112 0v6a1 1 0 11-2 0V8z" />
      <path fill-rule="evenodd" d="M4 5a1 1 0 011-1h2.586A1 1 0 018.293 3.293l.414-.414A1 1 0 019.414 2h1.172a1 1 0 01.707.293l.414.414A1 1 0 0112.414 4H15a1 1 0 011 1v1H4V5zm1 3a1 1 0 011-1h8a1 1 0 011 1v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" clip-rule="evenodd" />
    </svg>
    <span>Eliminar</span>
  `;

  const actions = document.createElement("div");
  actions.className = "flex shrink-0 items-center gap-2";

  actions.appendChild(edit);
  actions.appendChild(del);

  li.appendChild(left);
  li.appendChild(actions);

  return li;
}

function initTaskFilters() {
  const buttons = document.querySelectorAll(".task-filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;

      buttons.forEach((b) => {
        b.classList.remove("ring-2", "ring-violet-300", "shadow-lg", "scale-105");
        b.classList.add("shadow-sm");
      });

      btn.classList.remove("shadow-sm");
      btn.classList.add("ring-2", "ring-violet-300", "shadow-lg", "scale-105");

      renderTasks(taskSearchEl?.value || "");
    });
  });

  const defaultButton = document.querySelector('[data-filter="all"]');
  if (defaultButton) {
    defaultButton.classList.add("ring-2", "ring-violet-300", "shadow-lg", "scale-105");
  }
}

function initPriorityFilters() {
  const buttons = document.querySelectorAll(".priority-filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPriorityFilter = btn.dataset.priority || "all";

      buttons.forEach((b) => {
        b.classList.remove("ring-2", "ring-slate-300", "shadow-lg", "scale-105");
        b.classList.add("shadow-sm");
      });

      btn.classList.remove("shadow-sm");
      btn.classList.add("ring-2", "ring-slate-300", "shadow-lg", "scale-105");

      renderTasks(taskSearchEl?.value || "");
    });
  });
}

function renderTasks(filterText = "") {
  if (!taskListEl) return;
  taskListEl.innerHTML = "";

  const { q: query, filtered: filteredTasks } = getFilteredTasks(filterText);
  const sortedTasks = orderTasks(filteredTasks);

  if (sortedTasks.length === 0) {
    renderEmptyState(query);
    return;
  }

  sortedTasks.forEach((task) => {
    taskListEl.appendChild(createTaskListItem(task));
  });

  updateStats();
}

function updateStats() {
  if (!taskStatsEl) return;

  let pending = 0;
  let completed = 0;

  for (const t of tasks) {
    if (t.done) {
      completed++;
    } else {
      pending++;
    }
  }

  taskStatsEl.textContent = `${pending} pendientes · ${completed} completadas`;
}

// ===== EVENTOS =====
function openModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.remove("hidden");
  taskModalEl.classList.add("flex");
  if (taskModalInputEl) {
    taskModalInputEl.value = "";
    taskModalInputEl.focus();
  }
  if (taskModalPriorityEl) {
    taskModalPriorityEl.value = "media";
  }
}

function closeModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.add("hidden");
  taskModalEl.classList.remove("flex");
}

taskSearchEl?.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

function getActionButtonFromEvent(e) {
  const btn = e.target.closest?.("button[data-action]");
  if (!btn || !taskListEl?.contains(btn)) return null;
  return btn;
}

function getTaskIdFromButton(btn) {
  const li = btn.closest?.("li[data-id]");
  return li?.dataset?.id || null;
}

function toggleTaskById(taskList, id) {
  return taskList.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

function editTaskById(taskList, id, newText) {
  return taskList.map((t) => (t.id === id ? { ...t, text: newText } : t));
}

function deleteTaskById(taskList, id) {
  return taskList.filter((t) => t.id !== id);
}

function handleTaskListAction(action, id) {
  if (action === "toggle") {
    tasks = toggleTaskById(tasks, id);
    commitTasks();
    return;
  }

  if (action === "edit") {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (!taskToEdit) return;

    const newText = prompt("Edita la tarea:", taskToEdit.text);
    if (newText === null) return;

    const trimmedText = newText.trim();
    if (!trimmedText) return;

    tasks = editTaskById(tasks, id, trimmedText);
    commitTasks();
    return;
  }

  if (action === "delete") {
    if (!confirm("¿Seguro que quieres eliminar esta tarea?")) {
      return;
    }

    tasks = deleteTaskById(tasks, id);
    commitTasks();
  }
}

taskListEl?.addEventListener("click", (e) => {
  const btn = getActionButtonFromEvent(e);
  if (!btn) return;

  const id = getTaskIdFromButton(btn);
  if (!id) return;

  handleTaskListAction(btn.dataset.action, id);
});

btnNewTaskEl?.addEventListener("click", () => {
  openModal();
});

taskModalCancelEl?.addEventListener("click", () => {
  closeModal();
});

taskModalSaveEl?.addEventListener("click", () => {
  const text = taskModalInputEl ? taskModalInputEl.value : "";
  const priority = taskModalPriorityEl ? taskModalPriorityEl.value : "media";

  const error = addTask(text, priority);
  if (error) {
    alert(error);
    return;
  }

  if (taskModalInputEl) taskModalInputEl.value = "";
  if (taskModalPriorityEl) taskModalPriorityEl.value = "media";

  closeModal();
});

// Si usas también formulario normal, descomenta esto:

taskFormEl?.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInputEl ? taskInputEl.value : "";
  const priority = taskPriorityEl ? taskPriorityEl.value : "media";

  const error = addTask(text, priority);

  if (error) {
    showTaskError(error);
    return;
  }

  showTaskError("");

  if (taskInputEl) {
    taskInputEl.value = "";
    taskInputEl.focus();
  }

  if (taskPriorityEl) {
    taskPriorityEl.value = "media";
  }
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && taskModalEl && !taskModalEl.classList.contains("hidden")) {
    closeModal();
  }
});

// ===== THEME TOGGLE =====
(() => {
  const root = document.documentElement;
  const THEME_KEY = "theme";

  function updateThemeButton(isDark) {
    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");

    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    updateThemeButton(isDark);
  }

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) === "dark";
  }

  function initThemeToggle() {
    const btn = document.getElementById("btnTheme");
    if (!btn) return;

    btn.addEventListener("click", () => {
      setTheme(!root.classList.contains("dark"));
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    setTheme(getSavedTheme());
    initThemeToggle();
    initTaskFilters();
    initPriorityFilters();
    loadTasks();
    renderTasks();
  });
})();