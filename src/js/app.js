// ===== TIPOS (JSDoc) =====
/**
 * @typedef {"baja" | "media" | "alta"} TaskPriority
 */

/**
 * @typedef {{ id: string, text: string, done: boolean, priority: TaskPriority }} Task
 */

// ===== SELECTORES =====
const taskFormEl = document.querySelector("#task-form");
const taskInputEl = document.querySelector("#task-input");
const taskPriorityEl = document.querySelector("#task-priority");
const taskListEl = document.querySelector("#task-list");
const taskSearchEl = document.querySelector("#task-search");
const globalSearchEl = document.querySelector("#global-search");

const btnNewTaskEl = document.querySelector("#btn-new-task");

const taskModalEl = document.querySelector("#task-modal");
const taskModalInputEl = document.querySelector("#modal-task-input");
const taskModalPriorityEl = document.querySelector("#modal-task-priority");
const taskModalCancelEl = document.querySelector("#modal-cancel");
const taskModalSaveEl = document.querySelector("#modal-save");

const taskStatsEl = document.querySelector("#task-stats");
const taskErrorEl = document.querySelector("#task-error");

const STORAGE_KEY = "taskflow_tasks";
/** @type {Task[]} */
let tasks = [];
let currentFilter = "all";
let currentPriorityFilter = "all";
let currentRiderStatusFilter = "all";
let currentRiderQuadrantFilter = "all";

// ===== BÚSQUEDA GLOBAL (jinetes / dragones) =====
/**
 * Mapa de nombres que se pueden escribir en el buscador global
 * hacia el id de la sección correspondiente.
 * Permite varios alias por elemento.
 */
const GLOBAL_SEARCH_TARGETS = [
  { id: "jinete-violet", names: ["violet", "violet sorrengail"] },
  { id: "jinete-xaden", names: ["xaden", "xaden riorson"] },
  { id: "jinete-liam", names: ["liam", "liam mairi"] },
  { id: "jinete-imogen", names: ["imogen", "imogen cardulo"] },
  { id: "jinete-brennan", names: ["brennan", "brennan sorrengail"] },
  { id: "jinete-mira", names: ["mira", "mira sorrengail"] },
  { id: "jinete-dain", names: ["dain", "dain aetos"] },
  { id: "jinete-rhiannon", names: ["rhiannon", "rhiannon matthias"] },
  { id: "jinete-nolon", names: ["nolon"] },
  { id: "jinete-markham", names: ["markham"] },
  { id: "jinete-jesinia", names: ["jesinia"] },
  { id: "dragon-tairn", names: ["tairn"] },
  { id: "dragon-sgaeyl", names: ["sgaeyl"] },
  { id: "dragon-andarna", names: ["andarna"] },
  { id: "dragon-deigh", names: ["deigh"] },
  { id: "dragon-teine", names: ["teine"] },
  { id: "dragon-glaene", names: ["glaene", "glane"] },
  { id: "dragon-marbh", names: ["marbh"] },
  { id: "dragon-feirge", names: ["feirge"] },
  { id: "dragon-cath", names: ["cath"] },
];

// ===== LOCALSTORAGE =====
/**
 * Genera un identificador único para tareas (UUID o fallback con timestamp + random).
 * @returns {string}
 */
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

/**
 * Persiste el array `tasks` en localStorage bajo la clave STORAGE_KEY.
 * @returns {void}
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Lee y parsea las tareas guardadas en localStorage.
 * @returns {unknown[]} array de tareas en crudo (pueden no ser Task válidos)
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
 * Normaliza un valor cualquiera a una prioridad válida.
 * @param {string} value
 * @returns {TaskPriority}
 */
function normalizePriority(value) {
  return value === "baja" || value === "alta" || value === "media" ? value : "media";
}

/**
 * Normaliza cualquier representación almacenada de tarea a un objeto Task estándar.
 * @param {unknown} item
 * @returns {Task}
 */
function normalizeTask(item) {
  if (typeof item === "string") {
    return {
      id: generateId(),
      text: item,
      done: false,
      priority: "media",
    };
  }

  return {
    id: item?.id ?? generateId(),
    text: item?.text ?? "",
    done: Boolean(item?.done),
    priority: normalizePriority(item?.priority),
  };
}

/**
 * Carga las tareas desde localStorage; si no hay ninguna, inicializa con tareas de demo y las guarda.
 * @returns {void}
 */
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

/**
 * Busca un elemento de la página (jinete o dragón) a partir del texto
 * introducido en el buscador global y, si lo encuentra, hace scroll
 * suave hasta él.
 * @param {string} rawQuery
 * @returns {void}
 */
function runGlobalSearch(rawQuery) {
  const query = (rawQuery || "").trim().toLowerCase();
  if (!query) return;

  // 1) Intentar con el mapa explícito de nombres
  const directMatch = GLOBAL_SEARCH_TARGETS.find((target) =>
    target.names.some((name) => query.includes(name)),
  );

  let targetElement = directMatch ? document.getElementById(directMatch.id) : null;

  // 2) Fallback: buscar en elementos marcados con data-search-target
  if (!targetElement) {
    const all = document.querySelectorAll("[data-search-target]");
    for (const el of all) {
      const keywords = (el.getAttribute("data-search-target") || "").toLowerCase();
      if (keywords.includes(query)) {
        targetElement = /** @type {HTMLElement} */ (el);
        break;
      }
    }
  }

  if (!targetElement) return;

  targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

  targetElement.classList.add("mission-highlight");
  window.setTimeout(() => {
    targetElement.classList.remove("mission-highlight");
  }, 2200);

  if (typeof targetElement.focus === "function") {
    targetElement.focus();
  }
}

// ===== LÓGICA =====
/**
 * Devuelve el texto actual del campo de búsqueda de tareas.
 * @returns {string}
 */
function getCurrentFilter() {
  return taskSearchEl ? taskSearchEl.value : "";
}

/**
 * Guarda las tareas en localStorage y vuelve a renderizar la lista con el filtro de búsqueda actual.
 * @returns {void}
 */
function commitTasks() {
  saveTasks();
  renderTasks(getCurrentFilter());
}

/**
 * Muestra u oculta el mensaje de error debajo del formulario de tareas.
 * @param {string} [message] - Mensaje a mostrar; si está vacío o no se pasa, se oculta el bloque.
 * @returns {void}
 */
function showTaskError(message) {
  if (!taskErrorEl) return;
  taskErrorEl.textContent = message || "";
  taskErrorEl.classList.toggle("hidden", !message);
}

/**
 * Intenta crear una nueva tarea validando texto y prioridad.
 * @param {string} text
 * @param {string} [priority="media"]
 * @returns {string} mensaje de error o cadena vacía
 */
function addTask(text, priority = "media") {
  const clean = (text || "").trim();

  if (!clean) return "La tarea no puede estar vacía.";
  if (clean.length > 100) return "La tarea no puede superar 100 caracteres.";
  if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) {
    return "Esa tarea ya existe.";
  }

  const safePriority = normalizePriority(priority);

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
/**
 * Aplica el filtro de estado (todas / pendientes / completadas).
 * @param {Task[]} list
 * @returns {Task[]}
 */
function applyStatusFilter(list) {
  if (currentFilter === "pending") {
    return list.filter((task) => !task.done);
  }
  if (currentFilter === "completed") {
    return list.filter((task) => task.done);
  }
  return list;
}

/**
 * Aplica el filtro de prioridad (todas / baja / media / alta).
 * @param {Task[]} list
 * @returns {Task[]}
 */
function applyPriorityFilter(list) {
  if (currentPriorityFilter !== "all") {
    return list.filter((task) => task.priority === currentPriorityFilter);
  }
  return list;
}

/**
 * Devuelve las tareas filtradas por texto, estado y prioridad.
 * @param {string} [filterText=""]
 * @returns {{ q: string, filtered: Task[] }}
 */
function getFilteredTasks(filterText = "") {
  const q = filterText.trim().toLowerCase();

  let filtered = q
    ? tasks.filter((task) => task.text.toLowerCase().includes(q))
    : tasks;

  filtered = applyStatusFilter(filtered);
  filtered = applyPriorityFilter(filtered);

  return { q, filtered };
}

/**
 * Ordena la lista: primero pendientes, después completadas.
 * @param {Task[]} taskList
 * @returns {Task[]}
 */
function orderTasks(taskList) {
  return [...taskList].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
}

/**
 * Renderiza el estado vacío en la lista de tareas (sin resultados o sin tareas).
 * @param {string} q - Texto de búsqueda actual (para mensaje contextual).
 * @returns {void}
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
 * Crea el nodo DOM de un ítem de tarea (checkbox, texto, chip de prioridad, botones editar/eliminar).
 * @param {Task} task
 * @returns {HTMLLIElement}
 */
function createTaskListItem(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className =
    "rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 shadow-sm transition " +
    "hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60";

  const content = document.createElement("div");
  content.className = "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

  const left = document.createElement("div");
  left.className = "flex min-w-0 flex-1 items-start gap-3";

  const check = document.createElement("button");
  check.type = "button";
  check.dataset.action = "toggle";
  check.setAttribute("aria-label", task.done ? "Marcar como pendiente" : "Marcar como completada");
  check.className =
    "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition " +
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
  textRow.className = "flex w-full min-w-0 items-start gap-2";

  const span = document.createElement("span");
  span.className =
    "block min-w-0 flex-1 break-words text-base leading-6 transition " +
    (task.done
      ? "text-slate-400 line-through dark:text-slate-500"
      : "text-slate-900 dark:text-slate-100");
  span.textContent = task.text;

  const priorityChip = document.createElement("span");
  priorityChip.className = "mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-white/20";

  if (task.priority === "baja") {
    priorityChip.style.backgroundColor = "#38bdf8";
  } else if (task.priority === "alta") {
    priorityChip.style.backgroundColor = "#fb7185";
  } else {
    priorityChip.style.backgroundColor = "#fbbf24";
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
    "inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 shadow-sm transition " +
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
    "inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition " +
    "hover:bg-rose-100 hover:-translate-y-0.5 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40";
  del.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zM12 8a1 1 0 112 0v6a1 1 0 11-2 0V8z" />
      <path fill-rule="evenodd" d="M4 5a1 1 0 011-1h2.586A1 1 0 018.293 3.293l.414-.414A1 1 0 019.414 2h1.172a1 1 0 01.707.293l.414.414A1 1 0 0112.414 4H15a1 1 0 011 1v1H4V5zm1 3a1 1 0 011-1h8a1 1 0 011 1v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" clip-rule="evenodd" />
    </svg>
    <span>Eliminar</span>
  `;

  const actions = document.createElement("div");
  actions.className = "flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end";

  actions.appendChild(edit);
  actions.appendChild(del);

  content.appendChild(left);
  content.appendChild(actions);
  li.appendChild(content);

  return li;
}

/**
 * Inicializa los botones de filtro por estado (todas / pendientes / completadas): estilos activos y re-render.
 * @returns {void}
 */
function initTaskFilters() {
  const buttons = document.querySelectorAll(".task-filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;

      buttons.forEach((b) => {
        b.classList.remove("task-filter-active");
      });

      btn.classList.add("task-filter-active");

      renderTasks(taskSearchEl?.value || "");
    });
  });

  const defaultButton = document.querySelector('[data-filter="all"]');
  if (defaultButton) {
    defaultButton.classList.add("task-filter-active");
  }
}

/**
 * Inicializa los botones de filtro por prioridad (todas / baja / media / alta): estilos activos y re-render.
 * @returns {void}
 */
function initPriorityFilters() {
  const buttons = document.querySelectorAll(".priority-filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPriorityFilter = btn.dataset.priority || "all";

      buttons.forEach((b) => {
        b.classList.remove("priority-filter-active");
      });

      btn.classList.add("priority-filter-active");

      renderTasks(taskSearchEl?.value || "");
    });
  });
}

/**
 * Vacía la lista, aplica filtros y búsqueda, ordena y pinta las tareas o el estado vacío; actualiza estadísticas.
 * @param {string} [filterText=""] - Texto de búsqueda.
 * @returns {void}
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
 * Actualiza el texto de estadísticas (pendientes · completadas) en el DOM.
 * @returns {void}
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
 * Abre el modal de nueva tarea: lo hace visible, limpia input y prioridad y enfoca el input.
 * @returns {void}
 */
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

/**
 * Cierra el modal de nueva tarea (oculta y quita flex).
 * @returns {void}
 */
function closeModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.add("hidden");
  taskModalEl.classList.remove("flex");
}

// Escucha cambios en el buscador de tareas y vuelve a pintar la lista filtrada por texto.
taskSearchEl?.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

/**
 * Obtiene el botón con data-action que originó el click (si el click fue dentro de la lista de tareas).
 * @param {Event} e - Evento de click.
 * @returns {HTMLButtonElement | null}
 */
function getActionButtonFromEvent(e) {
  const btn = e.target.closest?.("button[data-action]");
  if (!btn || !taskListEl?.contains(btn)) return null;
  return btn;
}

/**
 * Obtiene el id de la tarea desde el botón (busca el li padre con data-id).
 * @param {HTMLButtonElement} btn
 * @returns {string | null}
 */
function getTaskIdFromButton(btn) {
  const li = btn.closest?.("li[data-id]");
  return li?.dataset?.id || null;
}

/**
 * Invierte el estado done de la tarea con el id dado.
 * @param {Task[]} taskList
 * @param {string} id
 * @returns {Task[]}
 */
function toggleTaskById(taskList, id) {
  return taskList.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

/**
 * Sustituye el texto de la tarea con el id dado.
 * @param {Task[]} taskList
 * @param {string} id
 * @param {string} newText
 * @returns {Task[]}
 */
function editTaskById(taskList, id, newText) {
  return taskList.map((t) => (t.id === id ? { ...t, text: newText } : t));
}

/**
 * Devuelve una copia del array sin la tarea con el id dado.
 * @param {Task[]} taskList
 * @param {string} id
 * @returns {Task[]}
 */
function deleteTaskById(taskList, id) {
  return taskList.filter((t) => t.id !== id);
}

/**
 * Ejecuta la acción (toggle / edit / delete) sobre la tarea con el id dado y actualiza estado y UI.
 * @param {string} action - "toggle" | "edit" | "delete"
 * @param {string} id - id de la tarea
 * @returns {void}
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

// Maneja los clics dentro de la lista:
// - Clic en "Editar" o "Eliminar": acción correspondiente
// - Clic en cualquier otra parte de la tarea (li): marcar / desmarcar como completada
taskListEl?.addEventListener("click", (e) => {
  // 1) ¿Se ha hecho clic en alguno de los botones de acción?
  const btn = getActionButtonFromEvent(e);
  if (btn) {
    const idFromBtn = getTaskIdFromButton(btn);
    if (!idFromBtn) return;
    handleTaskListAction(btn.dataset.action, idFromBtn);
    return;
  }

  // 2) Si no hay botón, pero el clic ha sido dentro de una tarea, alternar completada/pending
  const li = e.target.closest?.("li[data-id]");
  if (!li || !taskListEl?.contains(li)) return;

  const id = li.dataset.id;
  if (!id) return;

  tasks = toggleTaskById(tasks, id);
  commitTasks();
});

// Abre el modal al pulsar el botón "+ Nuevo" de la barra superior.
btnNewTaskEl?.addEventListener("click", () => {
  openModal();
});

// Cierra el modal al pulsar el botón "Cancelar".
taskModalCancelEl?.addEventListener("click", () => {
  closeModal();
});

// Intenta crear una nueva tarea desde el modal y lo cierra si todo va bien.
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

// Gestiona el envío del formulario embebido bajo la lista de tareas.
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


// Cierra el modal si está abierto al pulsar la tecla Escape.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && taskModalEl && !taskModalEl.classList.contains("hidden")) {
    closeModal();
  }
});

// ===== THEME TOGGLE =====
(() => {
  const root = document.documentElement;
  const THEME_KEY = "theme";

  /**
   * Actualiza icono y texto del botón de tema según modo oscuro/claro.
   * @param {boolean} isDark
   * @returns {void}
   */
  function updateThemeButton(isDark) {
    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");

    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  /**
   * Aplica el tema (clase dark en root y guarda en localStorage); actualiza el botón.
   * @param {boolean} isDark
   * @returns {void}
   */
  function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    updateThemeButton(isDark);
  }

  /**
   * Indica si el tema guardado en localStorage es oscuro.
   * @returns {boolean}
   */
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) === "dark";
  }

  /**
   * Enlaza el click del botón de tema para alternar dark/light.
   * @returns {void}
   */
  function initThemeToggle() {
    const btn = document.getElementById("btnTheme");
    if (!btn) return;

    btn.addEventListener("click", () => {
      setTheme(!root.classList.contains("dark"));
    });
  }

  /**
   * Inicializa el comportamiento especial del enlace "Misiones"
   * de la navegación lateral: hace scroll suave hasta la sección
   * y resalta temporalmente su card.
   * @returns {void}
   */
  function initMissionsNavHighlight() {
    const link = document.getElementById("nav-misiones");
    const missionsSection = document.getElementById("misiones");
    if (!link || !missionsSection) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      // Centrar la card de misiones en la ventana para que se vea completa
      missionsSection.scrollIntoView({ behavior: "smooth", block: "center" });

      missionsSection.classList.add("mission-highlight");
      window.setTimeout(() => {
        missionsSection.classList.remove("mission-highlight");
      }, 2200);
    });
  }

  /**
   * Inicializa el enlace "Archivo" para que lleve al bloque
   * de archivo clasificado y lo resalte brevemente.
   * @returns {void}
   */
  function initArchiveNavHighlight() {
    const link = document.getElementById("nav-archivo");
    const archiveSection = document.getElementById("archivo-clasificado");
    if (!link || !archiveSection) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      archiveSection.scrollIntoView({ behavior: "smooth", block: "center" });
      archiveSection.classList.add("mission-highlight");
      window.setTimeout(() => {
        archiveSection.classList.remove("mission-highlight");
      }, 2200);
    });
  }

  /**
   * Inicializa el buscador global de la cabecera para que,
   * al pulsar Enter, haga scroll hasta el jinete o dragón
   * cuyo nombre se haya escrito.
   * @returns {void}
   */
  function initGlobalSearch() {
    if (!globalSearchEl) return;

    globalSearchEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      runGlobalSearch(globalSearchEl.value);
    });
  }

  /**
   * Aplica conjuntamente los filtros de estado y cuadrante
   * sobre las cards de jinetes.
   * @returns {void}
   */
  function applyRiderFilters() {
    const riderCards = document.querySelectorAll("[data-rider-status]");
    riderCards.forEach((card) => {
      const status =
        /** @type {"active" | "training" | "archived" | null} */ (
          card.getAttribute("data-rider-status")
        );
      const quadrant =
        /** @type {"jinetes" | "curanderos" | "escribas" | null} */ (
          card.getAttribute("data-rider-quadrant")
        );

      const matchesStatus =
        currentRiderStatusFilter === "all" ||
        status === currentRiderStatusFilter;
      const matchesQuadrant =
        currentRiderQuadrantFilter === "all" ||
        quadrant === currentRiderQuadrantFilter;

      const shouldShow = matchesStatus && matchesQuadrant;
      card.classList.toggle("hidden", !shouldShow);
    });
  }

  /**
   * Inicializa los filtros de estado de jinetes (Activos / En entrenamiento / Archivados).
   * @returns {void}
   */
  function initRiderStatusFilters() {
    const buttons = document.querySelectorAll(".rider-status-filter");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentRiderStatusFilter =
          /** @type {"all" | "active" | "training" | "archived"} */ (
            btn.getAttribute("data-rider-status-filter") || "all"
          );

        buttons.forEach((b) => {
          b.classList.remove("rider-filter-active");
        });
        btn.classList.add("rider-filter-active");

        applyRiderFilters();
      });
    });

    // Estado inicial: Todos
    currentRiderStatusFilter = "all";
  }

  /**
   * Inicializa los filtros de cuadrante (Jinetes / Escribas / Curanderos / Todos).
   * @returns {void}
   */
  function initRiderQuadrantFilters() {
    const buttons = document.querySelectorAll(".rider-quadrant-filter");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentRiderQuadrantFilter =
          /** @type {"all" | "jinetes" | "escribas" | "curanderos"} */ (
            btn.getAttribute("data-rider-quadrant-filter") || "all"
          );

        buttons.forEach((b) => {
          b.classList.remove("rider-filter-active");
        });
        btn.classList.add("rider-filter-active");

        applyRiderFilters();
      });
    });

    // Estado inicial: Todos
    currentRiderQuadrantFilter = "all";

    const defaultBtn =
      /** @type {HTMLButtonElement | null} */ (
        document.querySelector(
          '.rider-quadrant-filter[data-rider-quadrant-filter="all"]',
        )
      );
    if (defaultBtn) {
      defaultBtn.classList.add("rider-filter-active");
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    setTheme(getSavedTheme());
    initThemeToggle();
    initGlobalSearch();
    initMissionsNavHighlight();
    initArchiveNavHighlight();
    initRiderStatusFilters();
    initRiderQuadrantFilters();
    applyRiderFilters();
    initTaskFilters();
    initPriorityFilters();
    loadTasks();
    renderTasks();
  });
})();