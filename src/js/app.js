// ===== SELECTORES =====
const taskFormEl = document.querySelector("#task-form");
const taskInputEl = document.querySelector("#task-input");
const taskListEl = document.querySelector("#task-list");
const taskSearchEl = document.querySelector("#task-search");

const btnNewTaskEl = document.querySelector("#btn-new-task");

const taskModalEl = document.querySelector("#task-modal");
const taskModalInputEl = document.querySelector("#modal-task-input");
const taskModalCancelEl = document.querySelector("#modal-cancel");
const taskModalSaveEl = document.querySelector("#modal-save");

const taskStatsEl = document.querySelector("#task-stats");
const taskErrorEl = document.querySelector("#task-error");

const STORAGE_KEY = "taskflow_tasks";
let tasks = [];

// ===== LOCALSTORAGE =====
/**
 * Genera un identificador pseudo-único para una tarea.
 * @returns {string} ID único.
 */
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

/**
 * Persiste el estado actual de las tareas en localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Lee y parsea los datos crudos de tareas desde localStorage.
 * Devuelve siempre un array seguro, aunque el JSON esté corrupto.
 * @returns {unknown[]} Array con los datos almacenados.
 */
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

/**
 * Normaliza cualquier representación almacenada de tarea a un objeto Task estándar.
 * @param {unknown} item Elemento leído de almacenamiento (string u objeto).
 * @returns {{id: string, text: string, done: boolean}} Tarea normalizada.
 */
function normalizeTask(item) {
  if (typeof item === "string") {
    return {
      id: generateId(),
      text: item,
      done: false,
    };
  }

  return {
    id: item?.id ?? generateId(),
    text: item?.text ?? "",
    done: Boolean(item?.done),
  };
}

/**
 * Carga las tareas desde localStorage y normaliza su estructura.
 * Mantiene compatibilidad con tareas antiguas guardadas como texto plano.
 */
function loadTasks() {
  const stored = readStoredTasks();
  // Compatibilidad con tareas antiguas guardadas como texto simple
  tasks = stored.map(normalizeTask);
}

// ===== LÓGICA =====
/**
 * Obtiene el texto actual del filtro de búsqueda.
 * @returns {string} Texto del input de búsqueda o cadena vacía.
 */
function getCurrentFilter() {
  return taskSearchEl ? taskSearchEl.value : "";
}

/**
 * Guarda las tareas y vuelve a renderizar la lista respetando el filtro actual.
 */
function commitTasks() {
  saveTasks();
  renderTasks(getCurrentFilter());
}

/**
 * Muestra u oculta el mensaje de error del formulario de tareas.
 * @param {string} message Mensaje de error a mostrar. Si está vacío, se oculta.
 */
function showTaskError(message) {
  if (!taskErrorEl) return;
  taskErrorEl.textContent = message || "";
  taskErrorEl.classList.toggle("hidden", !message);
}

/**
 * Intenta añadir una nueva tarea validando contenido, longitud y duplicados.
 * @param {string} text Texto introducido por el usuario.
 * @returns {string} Mensaje de error si falla la validación, o cadena vacía si todo va bien.
 */
function addTask(text) {
  const clean = (text || "").trim();
  if (!clean) return "La tarea no puede estar vacía.";
  if (clean.length > 100) return "La tarea no puede superar 100 caracteres.";
  if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) {
    return "Esa tarea ya existe.";
  }

  const task = {
    id: generateId(),
    text: clean,
    done: false,
  };

  tasks.push(task);
  commitTasks();
  return "";
}

// ===== UI =====
/**
 * Devuelve las tareas filtradas por texto de búsqueda.
 * @param {string} [filterText=""] Texto introducido por el usuario.
 * @returns {{ q: string, filtered: Array<{id: string, text: string, done: boolean}> }} Objeto con texto normalizado y lista filtrada.
 */
function getFilteredTasks(filterText = "") {
  const q = (filterText || "").trim().toLowerCase();
  const filtered = q ? tasks.filter((t) => t.text.toLowerCase().includes(q)) : tasks;
  return { q, filtered };
}

/**
 * Ordena una lista de tareas colocando primero las pendientes.
 * @param {Array<{id: string, text: string, done: boolean}>} taskList Lista de tareas a ordenar.
 * @returns {Array<{id: string, text: string, done: boolean}>} Nueva lista ordenada.
 */
function orderTasks(taskList) {
  // Ordenar: pendientes primero
  return [...taskList].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
}

/**
 * Renderiza un mensaje de estado vacío en la lista de tareas.
 * @param {string} q Texto de filtro ya normalizado.
 */
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

/**
 * Crea el elemento de lista (<li>) correspondiente a una tarea.
 * @param {{id: string, text: string, done: boolean}} task Objeto tarea a representar.
 * @returns {HTMLLIElement} Elemento de lista listo para insertar en el DOM.
 */
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

  const span = document.createElement("span");
  span.className =
    "block text-base transition " +
    (task.done
      ? "text-slate-400 line-through dark:text-slate-500"
      : "text-slate-900 dark:text-slate-100");
  span.textContent = task.text;

  textWrap.appendChild(span);
  left.appendChild(check);
  left.appendChild(textWrap);

  const edit = document.createElement("button");
  edit.type = "button";
  edit.dataset.action = "edit";
  edit.className =
    "inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition " +
    "hover:bg-violet-100 hover:-translate-y-0.5 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/40";

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

/**
 * Renderiza la lista de tareas en pantalla aplicando filtro de texto y orden.
 * @param {string} [filterText=""] Texto de búsqueda para filtrar por contenido.
 */
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

/**
 * Actualiza el resumen numérico de tareas pendientes y completadas.
 */
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
/**
 * Abre el modal de nueva tarea y enfoca el campo de entrada.
 */
function openModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.remove("hidden");
  taskModalEl.classList.add("flex");
  if (taskModalInputEl) {
    taskModalInputEl.value = "";
    taskModalInputEl.focus();
  }
}

/**
 * Cierra el modal de nueva tarea.
 */
function closeModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.add("hidden");
  taskModalEl.classList.remove("flex");
}

taskFormEl?.addEventListener("submit", (e) => {
  e.preventDefault();
  const error = addTask(taskInputEl ? taskInputEl.value : "");
  if (error) {
    showTaskError(error);
    return;
  }
  showTaskError("");
  if (taskInputEl) {
    taskInputEl.value = "";
    taskInputEl.focus();
  }
});

taskSearchEl?.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

/**
 * Obtiene el botón de acción dentro de un evento de click en la lista de tareas.
 * @param {MouseEvent} e Evento de click disparado sobre la lista.
 * @returns {HTMLButtonElement | null} Botón con data-action o null si no aplica.
 */
function getActionButtonFromEvent(e) {
  const btn = e.target.closest?.("button[data-action]");
  if (!btn || !taskListEl?.contains(btn)) return null;
  return btn;
}

/**
 * Recupera el ID de tarea asociado a un botón dentro de su elemento <li>.
 * @param {HTMLElement} btn Botón contenido dentro de la tarea.
 * @returns {string | null} Identificador de la tarea o null si no se encuentra.
 */
function getTaskIdFromButton(btn) {
  const li = btn.closest?.("li[data-id]");
  return li?.dataset?.id || null;
}

/**
 * Alterna el estado de completado de una tarea en una lista dada.
 * @param {Array<{id: string, text: string, done: boolean}>} taskList Lista actual de tareas.
 * @param {string} id ID de la tarea a alternar.
 * @returns {Array<{id: string, text: string, done: boolean}>} Nueva lista con la tarea actualizada.
 */
function toggleTaskById(taskList, id) {
  return taskList.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

function editTaskById(taskList, id, newText) {
  return taskList.map((t) =>
    t.id === id ? { ...t, text: newText } : t
  );
}

/**
 * Elimina una tarea por ID de una lista dada.
 * @param {Array<{id: string, text: string, done: boolean}>} taskList Lista actual de tareas.
 * @param {string} id ID de la tarea a eliminar.
 * @returns {Array<{id: string, text: string, done: boolean}>} Nueva lista sin la tarea indicada.
 */
function deleteTaskById(taskList, id) {
  return taskList.filter((t) => t.id !== id);
}

/**
 * Aplica la acción correspondiente (toggle o delete) sobre la lista global de tareas.
 * @param {"toggle" | "delete"} action Acción solicitada.
 * @param {string} id ID de la tarea objetivo.
 */
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
  const error = addTask(text);
  if (error) {
    alert(error);
    return;
  }
  if (taskModalInputEl) taskModalInputEl.value = "";
  closeModal();
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

    loadTasks();
    renderTasks();
  });
})();