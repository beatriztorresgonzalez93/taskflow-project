// ===== TIPOS (JSDoc) =====
/**
 * @typedef {"baja" | "media" | "alta"} TaskPriority
 */
/**
 * @typedef {{ id: string, text: string, done: boolean, priority: TaskPriority }} Task
 */
/**
 * @typedef {{ id: string, names: string[] }} GlobalSearchTarget
 */

// ===== CONSTANTES Y SELECTORES =====
const TASK_PRIORITIES = {
  BAJA: "baja",
  MEDIA: "media",
  ALTA: "alta",
};

const PRIORITY_COLORS = {
  [TASK_PRIORITIES.BAJA]: "#38bdf8", // azul
  [TASK_PRIORITIES.MEDIA]: "#fbbf24", // amarillo
  [TASK_PRIORITIES.ALTA]: "#fb7185", // rosa
};

const TASK_STATUS_FILTERS = {
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
};

const globalSearchEl = document.querySelector("#global-search");

// ======================================================================
// DRAGONES — DATA
// Lista para la galería principal de dragones (cards grandes con imagen).
// ======================================================================
const dragones = window.dragones;

// ======================================================================
// PERFILES — DATA
// Cards de jinetes (sección "Perfiles").
// ======================================================================
const perfiles = window.perfiles;

function crearPerfilHTML(perfil) {
  return `
      <article
        id="${perfil.id}"
        data-search-target="${perfil.searchTarget}"
        data-rider-status="${perfil.status}"
        data-rider-quadrant="${perfil.quadrantKey}"
        tabindex="0"
        class="group relative overflow-hidden flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[0_10px_40px_rgba(139,92,246,0.35)] focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-slate-700"
      >
        <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/30 via-blue-400/30 to-fuchsia-500/30 blur-[6px]"></div>
  
        <div class="flex min-w-0 items-center gap-3">
          <img
            class="h-11 w-11 rounded-full object-cover transition duration-300 group-hover:scale-110"
            src="${perfil.imagen}"
            alt="${perfil.alt}"
            loading="lazy"
          >
          <div class="min-w-0">
            <h3 class="truncate text-sm font-semibold">${perfil.nombre}</h3>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">Cuadrante: ${perfil.cuadrante}</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">Escuadrón: ${perfil.escuadron}</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">Estado: ${perfil.estadoTexto}</p>
          </div>
        </div>
  
        <div class="flex flex-col items-end gap-1">
          <span class="${perfil.rangoClass}">Rango: ${perfil.rango}</span>
          <p class="text-xs text-slate-600 dark:text-slate-400">Vínculo: ${perfil.vinculo}</p>
        </div>
  
        <div class="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-violet-400/20 -translate-x-full group-hover:translate-x-full"></div>
      </article>
    `;
}

// ======================================================================
// PERFILES — RENDER
// Pinta las cards en `#perfiles-grid`.
// ======================================================================
function renderPerfiles() {
  const contenedor = document.getElementById("perfiles-grid");
  if (!contenedor) return;

  contenedor.innerHTML = perfiles.map(crearPerfilHTML).join("");
}

// ======================================================================
// ===== BÚSQUEDA Y NAVEGACIÓN GLOBAL =====
/**
 * Mapa de nombres que se pueden escribir en el buscador global
 * hacia el id de la sección correspondiente.
 * Permite varios alias por elemento.
 * @type {GlobalSearchTarget[]}
 */
const GLOBAL_SEARCH_TARGETS = window.GLOBAL_SEARCH_TARGETS;

function crearDragonHTML(dragon) {
  return `
    <div class="group space-y-3 relative" id="${dragon.id}" data-search-target="${dragon.searchTarget}">
      <div class="relative overflow-visible">
        <div
          class="dragon-halo pointer-events-none absolute -z-10 rounded-[2rem] transition-opacity duration-500"
          style="inset: -0.35rem; background-color: ${dragon.haloColor}; filter: blur(1.25rem);">
        </div>

        <div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 ${dragon.overlayClass}"></div>

          <img
            src="${dragon.image}"
            alt="${dragon.alt}"
            loading="lazy"
            class="h-44 w-full object-cover object-center transition duration-500 group-hover:scale-105">

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>

          <div class="absolute inset-0 flex items-end p-4 opacity-0 translate-y-3 transition duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase tracking-widest ${dragon.archivoTextClass}">Archivo clasificado</span>
                <span class="rounded-full ${dragon.badgeBgClass} px-2 py-0.5 text-[10px] font-semibold ${dragon.badgeTextClass}">
                  ${dragon.badgeText}
                </span>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div class="rounded-lg border border-white/5 bg-white/5 p-2 backdrop-blur-sm">
                  <div class="text-slate-300">Rareza</div>
                  <div class="font-semibold">${dragon.rareza}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/5 p-2 backdrop-blur-sm">
                  <div class="text-slate-300">Estado</div>
                  <div class="font-semibold">${dragon.estado}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/5 p-2 backdrop-blur-sm">
                  <div class="text-slate-300">Afinidad</div>
                  <div class="font-semibold">${dragon.afinidad}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/5 p-2 backdrop-blur-sm">
                  <div class="text-slate-300">Zona</div>
                  <div class="font-semibold">${dragon.zona}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${dragon.hoverShadow} dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="text-sm font-semibold transition duration-300 ${dragon.hoverTitleClass}">
              ${dragon.nombre}
            </div>
            <div class="mt-1 text-xs text-slate-600 dark:text-slate-400">
              ${dragon.subtitulo}
            </div>
          </div>
          <span class="text-lg opacity-70 transition duration-300 group-hover:scale-110">${dragon.icono}</span>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span class="${dragon.chip1.className}">${dragon.chip1.text}</span>
          <span class="${dragon.chip2.className}">${dragon.chip2.text}</span>
        </div>
      </article>
    </div>
  `;
}
const misiones = window.misiones;

function crearMisionHTML(mision, index) {
  return `
    <div>
      <div class="text-sm font-semibold">${mision.titulo}</div>
      <div class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Riesgo: ${mision.riesgo} • Duración: ${mision.duracion}
      </div>

      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-label="Progreso misión ${index + 1}"
        aria-valuenow="${mision.progreso}"
        aria-valuemin="0"
        aria-valuemax="100">

        <div class="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-rose-300"
          style="width: ${mision.progreso}%">
        </div>
      </div>
    </div>
  `;
}

const rutasPrioritarias = window.rutasPrioritarias;

const actividadReciente = window.actividadReciente;

function crearActividadHTML(texto) {
  return `
    <li class="flex gap-2">
      <span class="mt-2 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.45)]"></span>
      ${texto}
    </li>
  `;
}

function renderActividad() {
  renderList("actividad-lista", actividadReciente, (texto) =>
    crearActividadHTML(texto),
  );
}

function crearRutaPrioritariaHTML(ruta) {
  return `
    <li class="flex items-center justify-between gap-3">
      <span>${ruta.nombre}</span>
      <span class="${ruta.badgeClass}">${ruta.estado}</span>
    </li>
  `;
}

function renderRutasPrioritarias() {
  renderList("rutas-prioritarias-lista", rutasPrioritarias, (ruta) =>
    crearRutaPrioritariaHTML(ruta),
  );
}

const resumenData = window.resumenData;

function crearResumenHTML(item) {
  return `
    <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-slate-900 dark:bg-black/30 dark:text-slate-200">
      <span class="text-slate-600 dark:text-slate-400">
        ${item.label}
      </span>
      <strong>${item.value}</strong>
    </div>
  `;
}

function renderResumen() {
  renderList("resumen-lista", resumenData, (item) => crearResumenHTML(item));
}

const estadoGeneral = window.estadoGeneral;

function crearEstadoHTML(item) {
  return `
    <article class="rounded-2xl border p-4 shadow-sm bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      
      <div class="text-xs text-slate-500 dark:text-slate-400">
        ${item.label}
      </div>

      ${
        item.type === "number"
          ? `<div class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
               ${item.value}
             </div>`
          : `<div class="mt-2 inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-700 dark:text-violet-200">
               ${item.value}
             </div>`
      }

    </article>
  `;
}

const kpisData = window.kpisData;

function crearKPIHTML(item) {
  return `
    <article class="rounded-2xl border p-4 shadow-sm border-slate-200 bg-white/90 dark:border-blue-500/10 dark:backdrop-blur-md dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] dark:bg-gradient-to-br dark:from-[#050a1a]/95 dark:via-[#0a1230]/90 dark:to-[#020617]/95">
      
      <div class="text-xs font-semibold text-slate-600 dark:text-slate-400">
        ${item.label}
      </div>

      <div class="mt-2 text-2xl font-bold">
        ${item.value}
      </div>

      <div class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        ${item.description}
      </div>

    </article>
  `;
}

const dragonesPrincipales = window.dragonesPrincipales;

function crearDragonPrincipalHTML(dragon) {
  return `
    <article
      id="${dragon.id}"
      data-search-target="${dragon.searchTarget}"
      class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${dragon.hoverShadow} dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="text-sm font-semibold">
        ${dragon.nombre}
      </div>

      <div class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        ${dragon.subtitulo}
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <span class="${dragon.chip1.className}">${dragon.chip1.text}</span>
        <span class="${dragon.chip2.className}">${dragon.chip2.text}</span>
      </div>

      <div class="${dragon.overlayClass}"></div>

      <div class="absolute right-3 top-3 text-xl opacity-0 transition duration-500 group-hover:scale-110 group-hover:opacity-100">
        ${dragon.icono}
      </div>
    </article>
  `;
}

const vinculosDestacados = window.vinculosDestacados;

function crearVinculoDestacadoHTML(item) {
  return `
    <div
      class="group ${item.glowClass} relative overflow-hidden rounded-xl border-l-4 ${item.borderClass} bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-50 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      <span
        class="absolute right-3 top-3 rounded-full border ${item.badgeBorderClass} ${item.badgeBgClass} px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${item.badgeTextClass} opacity-0 transition duration-300 group-hover:opacity-100"
      >
        ${item.badge}
      </span>

      <div
        class="flex items-center gap-2 text-sm font-semibold text-slate-800 transition duration-300 group-hover:text-slate-900 dark:text-slate-100 dark:group-hover:text-white"
      >
        <span class="${item.iconClass}">${item.icono}</span>
        ${item.titulo}
      </div>

      <p
        class="mt-1 text-xs text-slate-600 transition duration-300 group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-200"
      >
        ${item.descripcion}
      </p>
    </div>
  `;
}

// ======================================================================
// ARCHIVOS CLASIFICADOS — DATA + RENDER (SECCIÓN "ARCHIVOS SECRETOS")
// ======================================================================
const archivosClasificados = window.archivosClasificados;

function crearArchivoHTML(item) {
  return `
    <article class="secret-article">
      <h4 class="secret-title">${item.titulo}</h4>
      <p class="secret-desc">${item.descripcion}</p>
    </article>
  `;
}

function renderArchivosClasificados() {
  renderList(
    "secret-archivos",
    archivosClasificados,
    (item) => crearArchivoHTML(item),
  );
}

function renderVinculosDestacados() {
  renderList(
    "vinculos-destacados-grid",
    vinculosDestacados,
    (item) => crearVinculoDestacadoHTML(item),
  );
}

function renderDragonesPrincipales() {
  renderList(
    "dragones-principales-grid",
    dragonesPrincipales,
    (dragon) => crearDragonPrincipalHTML(dragon),
  );
}

// ======================================================================
// APP: DRAGONES — ORQUESTACIÓN
// init() pinta dragones + panel lateral (actividad/rutas) + misiones.
// ======================================================================
const DragonsApp = {
  dragones,
  misiones,
  rutasPrioritarias,
  actividadReciente,
  dragonesPrincipales,
  vinculosDestacados,
  crearDragonHTML,
  renderDragones,
  crearMisionHTML,
  renderActividad,
  crearRutaPrioritariaHTML,
  renderRutasPrioritarias,
  crearDragonPrincipalHTML,
  renderDragonesPrincipales,
  crearVinculoDestacadoHTML,
  renderVinculosDestacados,
  init() {
    this.renderDragonesPrincipales();
    this.renderDragones();
    this.renderActividad();
    this.renderRutasPrioritarias();
    renderList("lista-misiones", this.misiones, (m, i) =>
      this.crearMisionHTML(m, i),
    );
  },
};

function renderKPIs() {
  renderList("kpis", kpisData, (item) => crearKPIHTML(item));
}

function renderEstado() {
  renderList("estado-general", estadoGeneral, (item) => crearEstadoHTML(item));
}

function renderDragones() {
  const contenedor = document.getElementById("dragones-grid");
  if (!contenedor) return;

  contenedor.innerHTML = dragones.map(crearDragonHTML).join("");
}

renderDragones();
