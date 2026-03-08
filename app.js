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

const stats = document.querySelector("#task-stats");

const STORAGE_KEY = "taskflow_tasks";
let tasks = [];

// ===== LOCALSTORAGE =====
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : [];

  // Compatibilidad con tareas antiguas guardadas como texto simple
  tasks = parsed.map((item) => {
    if (typeof item === "string") {
      return {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        text: item,
        done: false,
      };
    }

    return {
      id: item.id ?? (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
      text: item.text ?? "",
      done: Boolean(item.done),
    };
  });
}

// ===== LÓGICA =====
function addTask(text) {
  const clean = (text || "").trim();
  if (!clean) return;

  const task = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text: clean,
    done: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks(search ? search.value : "");
}

// ===== UI =====
function renderTasks(filterText = "") {
  if (!list) return;
  list.innerHTML = "";

  const q = (filterText || "").trim().toLowerCase();
  const filtered = q
    ? tasks.filter((t) => t.text.toLowerCase().includes(q))
    : tasks;

  // Ordenar: pendientes primero
  const ordered = [...filtered].sort((a, b) =>
    a.done === b.done ? 0 : a.done ? 1 : -1
  );

  if (ordered.length === 0) {
  const empty = document.createElement("li");
  empty.className =
    "rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 " +
    "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400";
  empty.textContent = q
    ? "No hay tareas que coincidan."
    : "Aún no tienes tareas. Añade la primera 🐉";
  list.appendChild(empty);

  updateStats(); // 
  return;
}
  

  ordered.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className =
      "flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 shadow-sm transition " +
      "hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60";

    const left = document.createElement("div");
    left.className = "flex min-w-0 items-center gap-3";

    const check = document.createElement("button");
    check.type = "button";
    check.setAttribute(
      "aria-label",
      task.done ? "Marcar como pendiente" : "Marcar como completada"
    );
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

    check.addEventListener("click", () => {
      tasks = tasks.map((t) =>
        t.id === task.id ? { ...t, done: !t.done } : t
      );
      saveTasks();
      renderTasks(search ? search.value : "");
    });

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

    const del = document.createElement("button");
    del.type = "button";
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

    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks(search ? search.value : "");
    });

    li.appendChild(left);
    li.appendChild(del);
    list.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  if (!stats) return;

  const pending = tasks.filter(t => !t.done).length;
  const completed = tasks.filter(t => t.done).length;

  stats.textContent = `${pending} pendientes · ${completed} completadas`;
}

// ===== EVENTOS =====
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input ? input.value : "");
  if (input) {
    input.value = "";
    input.focus();
  }
});

search?.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

btnNewTask?.addEventListener("click", () => {
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (modalInput) {
    modalInput.value = "";
    modalInput.focus();
  }
});

modalCancel?.addEventListener("click", () => {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modalSave?.addEventListener("click", () => {
  const text = modalInput ? modalInput.value : "";
  addTask(text);
  if (modalInput) modalInput.value = "";

  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

// ===== THEME TOGGLE =====
(() => {
  const root = document.documentElement;
  const THEME_KEY = "theme";

  function applyTheme(isDark) {
    root.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");

    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === "dark");

    const btn = document.getElementById("btnTheme");
    if (btn) {
      btn.addEventListener("click", () => {
        applyTheme(!root.classList.contains("dark"));
      });
    }

    loadTasks();
    renderTasks();
  });
})();