// Módulo independiente de riders: render + filtros (estado/cuadrante).

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

export function initRiders({ perfiles, crearPerfilHTML }) {
  let currentRiderStatusFilter = "all";
  let currentRiderQuadrantFilter = "all";

  function renderPerfiles() {
    const contenedor = document.getElementById("perfiles-grid");
    if (!contenedor) return;
    contenedor.innerHTML = perfiles.map(crearPerfilHTML).join("");
  }

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

      card.classList.toggle("hidden", !(matchesStatus && matchesQuadrant));
    });
  }

  function initRiderStatusFilters() {
    initToggleFilterGroup({
      selector: ".rider-status-filter",
      activeClass: "rider-filter-active",
      getValue: (btn) => btn.getAttribute("data-rider-status-filter") || "all",
      onSelect: (value) => {
        currentRiderStatusFilter = value;
        applyRiderFilters();
      },
      defaultSelector: '.rider-status-filter[data-rider-status-filter="all"]',
    });
  }

  function initRiderQuadrantFilters() {
    initToggleFilterGroup({
      selector: ".rider-quadrant-filter",
      activeClass: "rider-filter-active",
      getValue: (btn) =>
        btn.getAttribute("data-rider-quadrant-filter") || "all",
      onSelect: (value) => {
        currentRiderQuadrantFilter = value;
        applyRiderFilters();
      },
      defaultSelector: '.rider-quadrant-filter[data-rider-quadrant-filter="all"]',
    });
  }

  renderPerfiles();
  initRiderStatusFilters();
  initRiderQuadrantFilters();
  applyRiderFilters();
}

