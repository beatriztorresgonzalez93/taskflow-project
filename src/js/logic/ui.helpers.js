// ======================================================================
// HELPERS UI COMPARTIDOS
// ======================================================================
// Utilidades pequeñas y reutilizables para scripts de la carpeta `logic/`.
// Incluye:
// - `highlightElementTemporarily`: resalta temporalmente un elemento.
// - `renderList`: renderiza una lista usando una función `createHTML`.
// - Clases/estilos del menú (nav) basados en `navItemsData`.
//
// Este archivo depende de que existan ciertas constantes globales léxicas
// definidas por la página (por ejemplo `navItemsData`).
// ======================================================================

// Helpers UI compartidos entre `app.js` y scripts extraídos (logic/*).

function highlightElementTemporarily(el, className, durationMs) {
  if (!el) return;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), durationMs);
}

function renderList(containerId, items, createHTML) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items.map(createHTML).join("");
}

const HIGHLIGHT_DURATION_MS = 2200;

const navItems = navItemsData;

const baseClass = "flex items-center gap-2 rounded-xl px-3 py-2 transition";

const activeClass =
  "border border-violet-200/60 bg-violet-50 text-violet-900 font-semibold shadow-sm hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100 dark:hover:bg-blue-400/15";

const normalClass =
  "text-slate-700 hover:bg-violet-50 dark:text-slate-200 dark:hover:bg-blue-400/10";

const ACTIVE_NAV_TOKENS = activeClass.split(/\s+/).filter(Boolean);
const NORMAL_NAV_TOKENS = normalClass.split(/\s+/).filter(Boolean);

function setActiveNavLink(linkId) {
  const nav = document.getElementById("nav-menu");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  links.forEach((a) => {
    a.classList.remove(...ACTIVE_NAV_TOKENS);
    a.classList.add(...NORMAL_NAV_TOKENS);
  });

  const activeLink = document.getElementById(linkId);
  if (!activeLink) return;
  activeLink.classList.remove(...NORMAL_NAV_TOKENS);
  activeLink.classList.add(...ACTIVE_NAV_TOKENS);
}

function crearNavItem(item) {
  const anchorId = (item.href || "").startsWith("#")
    ? `nav-${item.href.slice(1)}`
    : "";

  return `
    <a
       ${anchorId ? `id="${anchorId}"` : ""}
       href="${item.href}"
       class="${baseClass} ${item.active ? activeClass : normalClass}">
      ${item.icon} ${item.label}
    </a>
  `;
}

function renderNav() {
  const nav = document.getElementById("nav-menu");
  if (!nav) return;

  nav.innerHTML = navItems.map(crearNavItem).join("");
}

/**
 * Inicializa un grupo de botones de filtro: un solo activo con clase dada y callback al elegir.
 * Se usa en RidersApp (y también puede reutilizarse en otras secciones).
 *
 * @param {Object} options
 * @param {string} options.selector - Selector CSS de los botones.
 * @param {string} options.activeClass - Clase que se añade al botón activo.
 * @param {function(HTMLElement): string} options.getValue - Función que devuelve el valor del filtro desde el botón.
 * @param {function(string): void} options.onSelect - Se llama con el valor al pulsar; suele actualizar estado y re-render.
 * @param {string} [options.defaultSelector] - Selector del botón que debe quedar activo al cargar.
 * @returns {void}
 */
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

