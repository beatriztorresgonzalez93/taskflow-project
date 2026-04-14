// Arranque: tema oscuro + inicialización de secciones estáticas.
// Debe cargarse después de `app.js` (para tener disponibles las funciones globales de render).

(function () {
  const root = document.documentElement;
  const THEME_STORAGE_KEY = "taskflow-theme";

  function updateThemeButton(isDark) {
    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    updateThemeButton(isDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // Si localStorage no está disponible, seguimos sin persistencia.
    }
  }

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark") return true;
      if (saved === "light") return false;
    } catch {
      // Ignoramos errores de acceso a localStorage.
    }

    // Por defecto, la app arranca en modo oscuro.
    return true;
  }

  function initThemeToggle() {
    const btn = document.getElementById("btnTheme");
    if (!btn) return;
    btn.addEventListener("click", () =>
      setTheme(!root.classList.contains("dark")),
    );
  }

  // ==============================================================
  // FILTROS (tareas y jinetes): render de botones
  // ==============================================================
  const taskStatusFilters = taskStatusFiltersData;
  const taskPriorityFilters = taskPriorityFiltersData;

  function renderTaskFilters() {
    const taskFiltersContainer = document.getElementById("task-filters");
    const priorityFiltersContainer =
      document.getElementById("priority-filters");

    if (taskFiltersContainer) {
      taskFiltersContainer.innerHTML = taskStatusFilters
        .map(
          (filter) => `
          <button
            type="button"
            data-filter="${filter.value}"
            class="${filter.className}">
            ${filter.label}
          </button>
        `,
        )
        .join("");
    }

    if (priorityFiltersContainer) {
      priorityFiltersContainer.innerHTML = taskPriorityFilters
        .map(
          (filter) => `
          <button
            type="button"
            data-priority="${filter.value}"
            class="${filter.className}">
            ${filter.label}
          </button>
        `,
        )
        .join("");
    }
  }

  const baseBtn = "rounded-full px-3 py-1 text-xs font-semibold transition";
  const activeBtn =
    "text-white bg-gradient-to-r from-violet-600/80 to-fuchsia-500/70 hover:-translate-y-0.5 hover:from-violet-500/90 hover:to-fuchsia-400/80";
  const normalBtn =
    "border border-violet-200/60 bg-white/80 text-violet-900 hover:bg-violet-50 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-slate-200 dark:hover:bg-blue-400/10";

  const quadrantFilters = quadrantFiltersData;
  const statusFilters = statusFiltersData;

  function crearFiltroHTML(filter, type) {
    const typeClass =
      type === "rider-status"
        ? "rider-status-filter"
        : "rider-quadrant-filter";
    return `
      <button
        type="button"
        class="${type} ${typeClass} ${baseBtn} ${
      filter.active ? activeBtn : normalBtn
    }"
        data-${type}-filter="${filter.value}">
        ${filter.label}
      </button>
    `;
  }

  function renderFiltros() {
    const quadrantContainer = document.getElementById("filter-quadrant");
    const statusContainer = document.getElementById("filter-status");

    if (quadrantContainer) {
      quadrantContainer.innerHTML = quadrantFilters
        .map((f) => crearFiltroHTML(f, "rider-quadrant"))
        .join("");
    }

    if (statusContainer) {
      statusContainer.innerHTML = statusFilters
        .map((f) => crearFiltroHTML(f, "rider-status"))
        .join("");
    }
  }

  function initStaticSections() {
    // Panel lateral / resumen
    renderResumen();
    renderKPIs();
    renderEstado();
    renderVinculosDestacados();

    // Navegación principal
    renderNav();
    setActiveNavLink(
      (location.hash ? `nav-${location.hash.slice(1)}` : "") || "nav-perfiles",
    );

    // Archivo
    renderArchivosClasificados();

    // Filtros visuales (botones) generados dinámicamente
    renderTaskFilters();
    renderFiltros();
  }

  addEventListener("DOMContentLoaded", () => {
    setTheme(getPreferredTheme());
    initThemeToggle();

    // Mantener la app funcional incluso si alguna sección falla.
    try {
      initStaticSections();
    } catch (err) {
      console.error("startup:initStaticSections failed", err);
    }

    // Apps extraídas
    try {
      if (typeof DragonsApp !== "undefined") DragonsApp.init();
    } catch (err) {
      console.error("startup:DragonsApp.init failed", err);
    }

    try {
      if (typeof initGlobalSearch === "function") initGlobalSearch();
    } catch (err) {
      console.error("startup:initGlobalSearch failed", err);
    }

    try {
      if (typeof initNavScrollHighlights === "function")
        initNavScrollHighlights();
    } catch (err) {
      console.error("startup:initNavScrollHighlights failed", err);
    }

    try {
      RidersApp?.init?.();
    } catch (err) {
      console.error("startup:RidersApp.init failed", err);
    }

    try {
      TaskApp?.init?.();
    } catch (err) {
      console.error("startup:TaskApp.init failed", err);
    }

    // PANEL FLOTANTE: "Registro del Archivo"
    const infoBtn = document.getElementById("archive-info-btn");
    const infoPanel = document.getElementById("archive-info-panel");
    const infoClose = document.getElementById("archive-info-close");

    function setInfoButtonVisible(isVisible) {
      if (!infoBtn) return;
      infoBtn.classList.toggle("opacity-0", !isVisible);
      infoBtn.classList.toggle("pointer-events-none", !isVisible);
      infoBtn.classList.toggle("translate-y-1", !isVisible);
    }

    function setInfoOpen(isOpen) {
      if (!infoPanel) return;
      infoPanel.classList.toggle("hidden", !isOpen);
    }

    infoBtn?.addEventListener("click", () => setInfoOpen(true));
    infoClose?.addEventListener("click", () => setInfoOpen(false));
    infoPanel?.addEventListener("click", (e) => {
      // click fuera del panel (overlay) cierra
      if (e.target === infoPanel.firstElementChild) setInfoOpen(false);
    });

    // Mostrar el botón SOLO al final del scroll (y nunca si no hay scroll real).
    function updateInfoVisibility() {
      const scrollEl =
        document.scrollingElement || document.documentElement || document.body;
      const maxScroll =
        (scrollEl.scrollHeight || 0) - (scrollEl.clientHeight || 0);

      // Si la página no requiere scroll, mantenlo oculto.
      if (maxScroll <= 50) return setInfoButtonVisible(false);

      const atBottom = (scrollEl.scrollTop || 0) >= maxScroll - 2;
      setInfoButtonVisible(atBottom);
    }

    updateInfoVisibility();
    addEventListener("scroll", updateInfoVisibility, { passive: true });
    addEventListener("resize", updateInfoVisibility);
  });
})();

