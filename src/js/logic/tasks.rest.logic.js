// ======================================================================
// TAREAS — REST (fetch) SIN API CLIENT + SIN LOCALSTORAGE
// ======================================================================
// Encargado de:
// - Obtener tareas desde el backend: `GET /api/v1/tasks`
// - Crear tareas: `POST /api/v1/tasks`
// - Actualizar estado: `PATCH /api/v1/tasks/:id`
// - Borrar tareas: `DELETE /api/v1/tasks/:id`
// - Mostrar también el estado de conexión a la BD llamando
//   `GET /api/v1/health` (para confirmar si Supabase + tabla `tasks`
//   están accesibles con las claves configuradas).
//
// Todo usa `fetch` contra `TASKFLOW_API_BASE_URL` o
// `http://localhost:3000`.
// ======================================================================

(function () {
  // Nota: encapsulamos en IIFE para evitar redeclaraciones durante live-reload.

  // ===== TIPOS (JSDoc) =====
  /**
   * @typedef {"baja" | "media" | "alta"} TaskPriority
   */

  /**
   * @typedef {{ id: string, text: string, done: boolean, priority: TaskPriority }} Task
   */

  const TASK_PRIORITIES = { BAJA: "baja", MEDIA: "media", ALTA: "alta" };
  const PRIORITY_COLORS = {
    [TASK_PRIORITIES.BAJA]: "#38bdf8",
    [TASK_PRIORITIES.MEDIA]: "#fbbf24",
    [TASK_PRIORITIES.ALTA]: "#fb7185",
  };

  const TASK_STATUS_FILTERS = { ALL: "all", PENDING: "pending", COMPLETED: "completed" };

  // ===== SELECTORES DOM =====
  let taskInputEl;
  let taskPriorityEl;
  let taskListEl;
  let taskSearchEl;
  let btnNewTaskEl;

  let taskModalEl;
  let taskModalInputEl;
  let taskModalPriorityEl;
  let taskModalCancelEl;
  let taskModalSaveEl;

  let taskStatsEl;
  let taskErrorEl;

  /** @type {{ supabase: boolean, database: string | null, dbMessage: string | null }} */
  let apiHealth = { supabase: false, database: null, dbMessage: null };

  /** @type {Task[]} */
  let tasks = [];
  let currentFilter = TASK_STATUS_FILTERS.ALL;
  let currentPriorityFilter = "all";

  function cacheDom() {
    taskInputEl = document.querySelector("#task-input");
    taskPriorityEl = document.querySelector("#task-priority");
    taskListEl = document.querySelector("#task-list");
    taskSearchEl = document.querySelector("#task-search");

    btnNewTaskEl = document.querySelector("#btn-new-task");

    taskModalEl = document.querySelector("#task-modal");
    taskModalInputEl = document.querySelector("#modal-task-input");
    taskModalPriorityEl = document.querySelector("#modal-task-priority");
    taskModalCancelEl = document.querySelector("#modal-cancel");
    taskModalSaveEl = document.querySelector("#modal-save");

    taskStatsEl = document.querySelector("#task-stats");
    taskErrorEl = document.querySelector("#task-error");
  }

  function normalizePriority(value) {
    if (value === TASK_PRIORITIES.BAJA) return TASK_PRIORITIES.BAJA;
    if (value === TASK_PRIORITIES.ALTA) return TASK_PRIORITIES.ALTA;
    return TASK_PRIORITIES.MEDIA;
  }

  function getApiBase() {
    return TASKFLOW_API_BASE_URL || "http://localhost:3000";
  }

  async function apiRequest(path, { method = "GET", body } = {}) {
    const url = `${getApiBase()}${path}`;

    const res = await fetch(url, {
      method,
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message =
        (data && typeof data.message === "string" && data.message) ||
        res.statusText ||
        `HTTP ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    return data;
  }

  async function refreshApiHealth() {
    try {
      const h = await apiRequest("/api/v1/health", { method: "GET" });
      apiHealth = {
        supabase: Boolean(h?.supabase),
        database:
          h == null ? null : typeof h.database === "string" || h.database === null ? h.database : null,
        dbMessage: typeof h?.dbMessage === "string" ? h.dbMessage : null,
      };
    } catch (err) {
      // Compatibilidad con despliegues antiguos: si no existe /health (404),
      // no marcamos API caída; simplemente omitimos el detalle de health.
      if (err && typeof err === "object" && err.status === 404) {
        apiHealth = {
          supabase: false,
          database: null,
          dbMessage: null,
        };
        updateStats();
        return;
      }
      apiHealth = {
        supabase: false,
        database: "unreachable",
        dbMessage: "No hay respuesta del backend (¿npm run dev:server?)",
      };
    }
    updateStats();
  }

  function showTaskError(message) {
    if (!taskErrorEl) return;
    taskErrorEl.textContent = message || "";
    taskErrorEl.classList.toggle("hidden", !message);
  }

  function orderTasks(taskList) {
    return [...taskList].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  }

  function applyStatusFilter(list) {
    if (currentFilter === TASK_STATUS_FILTERS.PENDING) return list.filter((t) => !t.done);
    if (currentFilter === TASK_STATUS_FILTERS.COMPLETED) return list.filter((t) => t.done);
    return list;
  }

  function applyPriorityFilter(list) {
    if (currentPriorityFilter !== "all") return list.filter((t) => t.priority === currentPriorityFilter);
    return list;
  }

  function getFilteredTasks(filterText = "") {
    const q = filterText.trim().toLowerCase();
    let filtered = q ? tasks.filter((t) => (t.text || "").toLowerCase().includes(q)) : tasks;
    filtered = applyStatusFilter(filtered);
    filtered = applyPriorityFilter(filtered);
    return { q, filtered };
  }

  function updateStats() {
    if (!taskStatsEl) return;
    let pending = 0;
    let completed = 0;
    for (const t of tasks) {
      if (t.done) completed++;
      else pending++;
    }
    let line = `${pending} pendientes · ${completed} completadas`;
    if (apiHealth.database === "ok") {
      line += " · Base de datos: conectada (Supabase)";
    } else if (apiHealth.database === "error") {
      const msg = (apiHealth.dbMessage || "error").slice(0, 120);
      line += ` · Base de datos: error — ${msg}`;
    } else if (apiHealth.database === "unreachable") {
      line += ` · API: ${apiHealth.dbMessage || "sin conexión"}`;
    } else if (!apiHealth.supabase && apiHealth.database === null) {
      line += " · Datos en memoria (sin Supabase en el servidor)";
    }
    taskStatsEl.textContent = line;
  }

  function renderEmptyState(q) {
    if (!taskListEl) return;
    taskListEl.innerHTML = "";

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
      (task.done ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-900 dark:text-slate-100");
    span.textContent = task.text;

    const priorityChip = document.createElement("span");
    priorityChip.className = "mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-white/20";
    priorityChip.style.backgroundColor = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[TASK_PRIORITIES.MEDIA];

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

  function renderTasks(filterText = "") {
    if (!taskListEl) return;
    taskListEl.innerHTML = "";

    const { q, filtered } = getFilteredTasks(filterText);
    const sorted = orderTasks(filtered);

    if (sorted.length === 0) {
      renderEmptyState(q);
      return;
    }

    for (const task of sorted) taskListEl.appendChild(createTaskListItem(task));
    updateStats();
  }

  async function loadTasksAndRender() {
    showTaskError("");
    taskStatsEl && (taskStatsEl.textContent = "Cargando tareas...");
    const rows = await apiRequest("/api/v1/tasks", { method: "GET" }).catch((err) => {
      showTaskError(err instanceof Error ? err.message : "Error al cargar tareas");
      throw err;
    });
    tasks = Array.isArray(rows) ? rows.map((r) => ({ id: String(r.id), text: r.text ?? r.title ?? "", done: Boolean(r.done), priority: normalizePriority(r.priority) })) : [];
    renderTasks(taskSearchEl?.value || "");
  }

  async function createTask(text, priority) {
    // title -> text para encajar con el backend simplificado
    const created = await apiRequest("/api/v1/tasks", {
      method: "POST",
      body: { text, priority, done: false },
    });
    return created;
  }

  async function patchTask(id, patch) {
    const updated = await apiRequest(`/api/v1/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
    });
    return updated;
  }

  async function deleteTask(id) {
    await apiRequest(`/api/v1/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  function toggleTaskById(taskList, id) {
    return taskList.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  function initToggleFilterGroup(options) {
    const { selector, activeClass, getValue, onSelect, defaultSelector } = options;
    const buttons = document.querySelectorAll(selector);
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = getValue(btn);
        onSelect(value);
        buttons.forEach((b) => b.classList.remove(activeClass));
        btn.classList.add(activeClass);
      });
    });

    if (defaultSelector) {
      const defaultBtn = document.querySelector(defaultSelector);
      if (defaultBtn) defaultBtn.classList.add(activeClass);
    }
  }

  function initTaskFilters() {
    initToggleFilterGroup({
      selector: ".task-filter-btn",
      activeClass: "task-filter-active",
      getValue: (btn) => btn.dataset.filter,
      onSelect: (value) => {
        currentFilter = value;
        renderTasks(taskSearchEl?.value || "");
      },
      defaultSelector: `[data-filter="${TASK_STATUS_FILTERS.ALL}"]`,
    });
  }

  function initPriorityFilters() {
    initToggleFilterGroup({
      selector: ".priority-filter-btn",
      activeClass: "priority-filter-active",
      getValue: (btn) => btn.dataset.priority || "all",
      onSelect: (value) => {
        currentPriorityFilter = value;
        renderTasks(taskSearchEl?.value || "");
      },
      defaultSelector: '.priority-filter-btn[data-priority="all"]',
    });
  }

  async function handleTaskListAction(action, id) {
    try {
      if (action === "toggle") {
        const current = tasks.find((t) => t.id === id);
        const nextDone = !current?.done;
        await patchTask(id, { done: nextDone });
      } else if (action === "edit") {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (!taskToEdit) return;
        const newText = prompt("Edita la tarea:", taskToEdit.text);
        if (newText === null) return;
        const trimmed = newText.trim();
        if (!trimmed) return;
        await patchTask(id, { text: trimmed });
      } else if (action === "delete") {
        if (!confirm("¿Seguro que quieres eliminar esta tarea?")) return;
        await deleteTask(id);
      }

      await loadTasksAndRender();
    } catch (err) {
      showTaskError(err instanceof Error ? err.message : "Error en la operación");
      console.error("tasks: action failed", err);
    }
  }

  function openModal() {
    if (!taskModalEl) return;
    taskModalEl.classList.remove("hidden");
    taskModalEl.classList.add("flex");
    if (taskModalInputEl) {
      taskModalInputEl.value = "";
      taskModalInputEl.focus();
    }
    if (taskModalPriorityEl) taskModalPriorityEl.value = TASK_PRIORITIES.MEDIA;
  }

  function closeModal() {
    if (!taskModalEl) return;
    taskModalEl.classList.add("hidden");
    taskModalEl.classList.remove("flex");
  }

  function submitNewTask(text, priority, { onError, onSuccess } = {}) {
    const clean = (text || "").trim();
    if (!clean) {
      onError?.("La tarea no puede estar vacía.");
      return;
    }
    if (clean.length > 100) {
      onError?.("La tarea no puede superar 100 caracteres.");
      return;
    }
    // Evitamos duplicados en UI (y backend valida solo title obligatorio).
    if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) {
      onError?.("Esa tarea ya existe.");
      return;
    }

    void (async () => {
      try {
        await createTask(clean, priority);
        onSuccess?.();
        await loadTasksAndRender();
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "Error creando tarea");
      }
    })();
  }

  function initTasksUI() {
    taskSearchEl?.addEventListener("input", (e) => renderTasks(e.target.value));

    taskListEl?.addEventListener("click", (e) => {
      const btn = e.target.closest?.("button[data-action]");
      if (btn) {
        const id = btn.closest?.("li[data-id]")?.dataset?.id;
        if (!id) return;
        void handleTaskListAction(btn.dataset.action, id);
        return;
      }

      const li = e.target.closest?.("li[data-id]");
      if (!li || !taskListEl.contains(li)) return;
      const id = li.dataset.id;
      if (!id) return;
      void handleTaskListAction("toggle", id);
    });

    btnNewTaskEl?.addEventListener("click", () => openModal());
    taskModalCancelEl?.addEventListener("click", () => closeModal());

    taskModalSaveEl?.addEventListener("click", () => {
      const text = taskModalInputEl ? taskModalInputEl.value : "";
      const priority = taskModalPriorityEl ? taskModalPriorityEl.value : TASK_PRIORITIES.MEDIA;
      submitNewTask(text, priority, {
        onError: (msg) => alert(msg),
        onSuccess: () => {
          if (taskModalInputEl) taskModalInputEl.value = "";
          if (taskModalPriorityEl) taskModalPriorityEl.value = TASK_PRIORITIES.MEDIA;
          closeModal();
        },
      });
    });

    // Formulario embebido
    document.querySelector("#task-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = taskInputEl ? taskInputEl.value : "";
      const priority = taskPriorityEl ? taskPriorityEl.value : TASK_PRIORITIES.MEDIA;
      submitNewTask(text, priority, {
        onError: (msg) => showTaskError(msg),
        onSuccess: () => {
          showTaskError("");
          if (taskInputEl) {
            taskInputEl.value = "";
            taskInputEl.focus();
          }
          if (taskPriorityEl) taskPriorityEl.value = TASK_PRIORITIES.MEDIA;
        },
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (taskModalEl && !taskModalEl.classList.contains("hidden")) closeModal();
    });
  }

  const TaskApp = {
    init() {
      cacheDom();
      initTaskFilters();
      initPriorityFilters();
      initTasksUI();
      void (async () => {
        await refreshApiHealth();
        await loadTasksAndRender();
      })();
    },
  };

  // Exponemos una referencia estable para `startup.js` entre scripts clásicos.
  globalThis.TaskApp = TaskApp;
})();

