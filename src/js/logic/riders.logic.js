// ======================================================================
// JINETES / PERFILES — NAVEGACIÓN + FILTROS
// ======================================================================
// Encargado de:
// - Manejar el scroll suave y highlight al navegar por secciones del UI.
// - Orquestar la renderización de la vista de "jinetes/perfiles"
//   (cards), aplicando filtros (estado / cuadrante).
// - Actualizar el estado del menú activo según la sección visitada.
//
// Este módulo no habla con la BD: opera sobre el DOM y datos ya
// disponibles en la página.
// ======================================================================
// ===== NAVEGACIÓN Y FILTROS JINETES =====
/**
 * Helper genérico: click en link → scroll suave → highlight (en el contenedor tipo "card").
 * @param {{linkId: string, targetId: string, afterHighlight?: (target: HTMLElement) => void}} config
 * @returns {void}
 */
function setupNavScrollAndHighlight(config) {
  const link = document.getElementById(config.linkId);
  const target = document.getElementById(config.targetId);
  if (!link || !target) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();

    setActiveNavLink(config.linkId);
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const highlightTarget =
      config.highlightTarget === "self"
        ? target
        : target.closest("section") ||
          target.closest("article") ||
          target.closest("div") ||
          target;

    highlightElementTemporarily(
      /** @type {HTMLElement} */ (highlightTarget),
      "mission-highlight",
      HIGHLIGHT_DURATION_MS,
    );

    if (typeof config.afterHighlight === "function") config.afterHighlight(target);
  });
}

const NAV_SCROLL_HIGHLIGHTS = [
  { linkId: "nav-perfiles", targetId: "perfiles" },
  { linkId: "nav-dragones", targetId: "dragones" },
  { linkId: "nav-misiones", targetId: "misiones" },
  {
    linkId: "nav-archivo-clasificado",
    targetId: "archivo-clasificado",
    highlightTarget: "self",
  },
];

function initNavScrollHighlights() {
  NAV_SCROLL_HIGHLIGHTS.forEach((config) =>
    setupNavScrollAndHighlight(config),
  );
}

/**
 * Busca jinete/dragón por texto del buscador global, hace scroll suave y resalta.
 * @param {string} rawQuery
 * @returns {void}
 */
function runGlobalSearch(rawQuery) {
  const query = (rawQuery || "").trim().toLowerCase();
  if (!query) return;

  const directMatch = GLOBAL_SEARCH_TARGETS.find((t) =>
    t.names.some((name) => query.includes(name)),
  );
  let targetElement = directMatch
    ? document.getElementById(directMatch.id)
    : null;

  if (!targetElement) {
    const all = document.querySelectorAll("[data-search-target]");
    for (const el of all) {
      const keywords = (
        el.getAttribute("data-search-target") || ""
      ).toLowerCase();
      if (keywords.includes(query)) {
        targetElement = /** @type {HTMLElement} */ (el);
        break;
      }
    }
  }

  if (!targetElement) return;
  targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
  highlightElementTemporarily(
    targetElement,
    "mission-highlight",
    HIGHLIGHT_DURATION_MS,
  );
  if (typeof targetElement.focus === "function") targetElement.focus();
}

/**
 * Inicializa el buscador global: Enter hace scroll al jinete/dragón buscado.
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
 * Aplica filtros de estado y cuadrante sobre las cards de jinetes.
 * @returns {void}
 */
function applyRiderFilters() {
  const riderCards = document.querySelectorAll("[data-rider-status]");
  riderCards.forEach((card) => {
    const status = /** @type {"active" | "training" | "archived" | null} */ (
      card.getAttribute("data-rider-status")
    );
    const quadrant =
      /** @type {"jinetes" | "curanderos" | "escribas" | null} */ (
        card.getAttribute("data-rider-quadrant")
      );

    const matchesStatus =
      currentRiderStatusFilter === "all" || status === currentRiderStatusFilter;
    const matchesQuadrant =
      currentRiderQuadrantFilter === "all" ||
      quadrant === currentRiderQuadrantFilter;
    card.classList.toggle("hidden", !(matchesStatus && matchesQuadrant));
  });
}

/**
 * Inicializa filtros de estado de jinetes (Activos / Entrenamiento / Archivados).
 * @returns {void}
 */
function initRiderStatusFilters() {
  initToggleFilterGroup({
    selector: ".rider-status-filter",
    activeClass: "rider-filter-active",
    getValue: (btn) => btn.getAttribute("data-rider-status-filter") || "all",
    onSelect: (value) => {
      currentRiderStatusFilter =
        /** @type {"all" | "active" | "training" | "archived"} */ (value);
      applyRiderFilters();
    },
    defaultSelector: '.rider-status-filter[data-rider-status-filter="all"]',
  });
  currentRiderStatusFilter = "all";
}

/**
 * Inicializa filtros de cuadrante (Jinetes / Escribas / Curanderos / Todos).
 * @returns {void}
 */
function initRiderQuadrantFilters() {
  initToggleFilterGroup({
    selector: ".rider-quadrant-filter",
    activeClass: "rider-filter-active",
    getValue: (btn) => btn.getAttribute("data-rider-quadrant-filter") || "all",
    onSelect: (value) => {
      currentRiderQuadrantFilter =
        /** @type {"all" | "jinetes" | "escribas" | "curanderos"} */ (value);
      applyRiderFilters();
    },
    defaultSelector: '.rider-quadrant-filter[data-rider-quadrant-filter="all"]',
  });
  currentRiderQuadrantFilter = "all";
}

// ======================================================================
// APP: RIDERSAPP — ORQUESTACIÓN DE PERFILES
// init() pinta perfiles y deja filtros activos.
// ======================================================================
const RidersApp = {
  get currentStatusFilter() {
    return currentRiderStatusFilter;
  },
  set currentStatusFilter(value) {
    currentRiderStatusFilter = value;
  },
  get currentQuadrantFilter() {
    return currentRiderQuadrantFilter;
  },
  set currentQuadrantFilter(value) {
    currentRiderQuadrantFilter = value;
  },
  perfiles,
  crearPerfilHTML,
  renderPerfiles,
  applyRiderFilters,
  initRiderStatusFilters,
  initRiderQuadrantFilters,
  init() {
    // Render inicial → listeners de filtros → aplicar filtros por defecto
    this.renderPerfiles();
    this.initRiderStatusFilters();
    this.initRiderQuadrantFilters();
    this.applyRiderFilters();
  },
};

// Exponemos una referencia estable para `startup.js` entre scripts clásicos.
globalThis.RidersApp = RidersApp;

