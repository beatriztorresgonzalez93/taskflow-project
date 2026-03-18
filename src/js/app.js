import { getTasks, createTask, deleteTask, updateTask } from './api.js';
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

const RIDER_STATUS = {
  ACTIVE: "active",
  TRAINING: "training",
  ARCHIVED: "archived",
};

const RIDER_QUADRANTS = {
  JINETES: "jinetes",
  CURANDEROS: "curanderos",
  ESCRIBAS: "escribas",
};

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

const MAX_TASK_LENGTH = 100;
const HIGHLIGHT_DURATION_MS = 2200;

// ======================================================================
// DRAGONES — DATA
// Lista para la galería principal de dragones (cards grandes con imagen).
// ======================================================================
const dragones = [
  {
    id: "dragon-feirge",
    searchTarget: "feirge dragon azul rhiannon",
    haloColor: "rgba(56, 189, 248, 0.85)",
    overlayClass: "bg-sky-500/15",
    image: "assets/cath.png",
    alt: "Feirge",
    badgeText: "AZUL",
    badgeTextClass: "text-sky-200",
    badgeBgClass: "bg-sky-400/20",
    archivoTextClass: "text-sky-200",
    rareza: "Ligera",
    estado: "Activo",
    afinidad: "Velocidad",
    zona: "Patrulla rápida",
    nombre: "Feirge",
    subtitulo: "Azul claro • Rol: Apoyo aéreo",
    icono: "💨",
    hoverTitleClass: "group-hover:text-sky-700 dark:group-hover:text-sky-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(56,189,248,0.25)]",
    chip1: {
      text: "Vínculo táctico",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Respuesta rápida",
      className:
        "rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold text-sky-700 transition duration-300 group-hover:bg-sky-500/25 dark:text-sky-300",
    },
  },
  {
    id: "dragon-cath",
    searchTarget: "cath dragon bronce exploración ruta exterior",
    haloColor: "rgba(251, 146, 60, 0.85)",
    overlayClass: "bg-amber-500/15",
    image: "assets/feirge.png",
    alt: "Cath",
    badgeText: "NARANJA",
    badgeTextClass: "text-amber-200",
    badgeBgClass: "bg-amber-400/20",
    archivoTextClass: "text-amber-200",
    rareza: "Alta",
    estado: "Activo",
    afinidad: "Exploración",
    zona: "Ruta exterior",
    nombre: "Cath",
    subtitulo: "Bronce • Exploración de largo alcance",
    icono: "🧭",
    hoverTitleClass:
      "group-hover:text-amber-700 dark:group-hover:text-amber-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(251,146,60,0.25)]",
    chip1: {
      text: "Cartografía",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Largo alcance",
      className:
        "rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition duration-300 group-hover:bg-amber-500/25 dark:text-amber-300",
    },
  },
  {
    id: "dragon-glaene",
    searchTarget: "glaene dragon rojo imogen",
    haloColor: "rgba(244, 63, 94, 0.85)",
    overlayClass: "bg-rose-500/15",
    image: "assets/glane.png",
    alt: "Glaene",
    badgeText: "ROJO",
    badgeTextClass: "text-sky-200",
    badgeBgClass: "bg-sky-400/20",
    archivoTextClass: "text-sky-200",
    rareza: "Élite",
    estado: "Activo",
    afinidad: "Tormenta",
    zona: "Cordillera",
    nombre: "Glaene",
    subtitulo: "Rojo • Jinete: Imogen",
    icono: "⚡",
    hoverTitleClass: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
    chip1: {
      text: "Élite",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Respuesta táctica",
      className:
        "rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition duration-300 group-hover:bg-rose-500/25 dark:text-rose-300",
    },
  },
  {
    id: "dragon-deigh",
    searchTarget: "deigh dragon rojo liam",
    haloColor: "rgba(14, 165, 233, 0.85)",
    overlayClass: "bg-sky-500/15",
    image: "assets/deigh.png",
    alt: "Deigh",
    badgeText: "AZUL",
    badgeTextClass: "text-rose-200",
    badgeBgClass: "bg-rose-400/20",
    archivoTextClass: "text-rose-200",
    rareza: "Alta",
    estado: "Activo",
    afinidad: "Combate",
    zona: "Patrulla aérea",
    nombre: "Deigh",
    subtitulo: "Azul • Jinete: Liam",
    icono: "⚔️",
    hoverTitleClass: "group-hover:text-sky-700 dark:group-hover:text-sky-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
    chip1: {
      text: "Vínculo fuerte",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Ataque rápido",
      className:
        "rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold text-sky-700 transition duration-300 group-hover:bg-sky-500/25 dark:text-sky-300",
    },
  },
  {
    id: "dragon-teine",
    searchTarget: "teine dragon verde mira",
    haloColor: "rgba(16, 185, 129, 0.85)",
    overlayClass: "bg-emerald-500/15",
    image: "assets/teine.png",
    alt: "Teine",
    badgeText: "VERDE",
    badgeTextClass: "text-emerald-200",
    badgeBgClass: "bg-emerald-400/20",
    archivoTextClass: "text-emerald-200",
    rareza: "Estable",
    estado: "Activo",
    afinidad: "Naturaleza",
    zona: "Bosque exterior",
    nombre: "Teine",
    subtitulo: "Verde • Jinete: Mira",
    icono: "🌿",
    hoverTitleClass:
      "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
    chip1: {
      text: "Frontera",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Estable",
      className:
        "rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition duration-300 group-hover:bg-emerald-500/25 dark:text-emerald-300",
    },
  },
  {
    id: "dragon-marbh",
    searchTarget: "marbh dragon rojo brennan",
    haloColor: "rgba(244, 63, 94, 0.85)",
    overlayClass: "bg-rose-500/15",
    image: "assets/marhb.png",
    alt: "Marbh",
    badgeText: "ROJO",
    badgeTextClass: "text-rose-200",
    badgeBgClass: "bg-rose-400/20",
    archivoTextClass: "text-rose-200",
    rareza: "Alta",
    estado: "Reservado",
    afinidad: "Fuego",
    zona: "Terreno volcánico",
    nombre: "Marbh",
    subtitulo: "Rojo • Jinete: Brennan",
    icono: "🔥",
    hoverTitleClass: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
    hoverShadow: "group-hover:shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
    chip1: {
      text: "Reservado",
      className:
        "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold transition duration-300 group-hover:bg-slate-200 dark:bg-slate-950 dark:group-hover:bg-slate-800",
    },
    chip2: {
      text: "Amenaza alta",
      className:
        "rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition duration-300 group-hover:bg-rose-500/25 dark:text-rose-300",
    },
  },
];

// ======================================================================
// PERFILES — DATA
// Cards de jinetes (sección "Perfiles").
// ======================================================================
const perfiles = [
  {
    id: "jinete-violet",
    searchTarget: "violet violet sorrengail tairn andarna",
    status: "active",
    quadrantKey: "jinetes",
    nombre: "Violet Sorrengail",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Alto",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    vinculo: "Tairn / Andarna",
    imagen: "assets/violet.png",
    alt: "Violet Sorrengail",
  },
  {
    id: "jinete-xaden",
    searchTarget: "xaden xaden riorson sgaeyl",
    status: "active",
    quadrantKey: "jinetes",
    nombre: "Xaden Riorson",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Alto",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
    vinculo: "Sgaeyl",
    imagen: "assets/xaden.png",
    alt: "Xaden Riorson",
  },
  {
    id: "jinete-liam",
    searchTarget: "liam liam mairi",
    status: "training",
    quadrantKey: "jinetes",
    nombre: "Liam Mairi",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Entrenamiento",
    rango: "Alto",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
    vinculo: "Deigh",
    imagen: "assets/liam.png",
    alt: "Liam Mairi",
  },
  {
    id: "jinete-imogen",
    searchTarget: "imogen imogen cardulo glaene",
    status: "training",
    quadrantKey: "jinetes",
    nombre: "Imogen Cardulo",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Entrenamiento",
    rango: "Medio",
    rangoClass:
      "rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300",
    vinculo: "Glaene",
    imagen: "assets/imogen.png",
    alt: "Imogen Cardulo",
  },
  {
    id: "jinete-brennan",
    searchTarget: "brennan brennan sorrengail marbh",
    status: "archived",
    quadrantKey: "curanderos",
    nombre: "Brennan Sorrengail",
    cuadrante: "Curanderos",
    escuadron: "Fourth Wing",
    estadoTexto: "Archivado",
    rango: "Alto",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
    vinculo: "Marbh",
    imagen: "assets/brennan.png",
    alt: "Brennan Sorrengail",
  },
  {
    id: "jinete-mira",
    searchTarget: "mira mira sorrengail",
    status: "archived",
    quadrantKey: "jinetes",
    nombre: "Mira Sorrengail",
    cuadrante: "Jinetes",
    escuadron: "Frontera",
    estadoTexto: "Archivado",
    rango: "Alto",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
    vinculo: "Teine",
    imagen: "assets/mira.png",
    alt: "Mira Sorrengail",
  },
  {
    id: "jinete-dain",
    searchTarget: "dain aetos jinete fourth wing cath",
    status: "active",
    quadrantKey: "jinetes",
    nombre: "Dain Aetos",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Medio",
    rangoClass:
      "rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300",
    vinculo: "Cath",
    imagen: "assets/dain.png",
    alt: "Dain Aetos",
  },
  {
    id: "jinete-rhiannon",
    searchTarget: "rhiannon matthias jinete fourth wing feirge",
    status: "training",
    quadrantKey: "jinetes",
    nombre: "Rhiannon Matthias",
    cuadrante: "Jinetes",
    escuadron: "Fourth Wing",
    estadoTexto: "Entrenamiento",
    rango: "Bajo",
    rangoClass:
      "rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300",
    vinculo: "Feirge",
    imagen: "assets/rhiannon.png",
    alt: "Rhiannon Matthias",
  },
  {
    id: "jinete-nolon",
    searchTarget: "nolon curandero fourth wing",
    status: "active",
    quadrantKey: "curanderos",
    nombre: "Nolon Colbersy",
    cuadrante: "Curanderos",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Medio",
    rangoClass:
      "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
    vinculo: "—",
    imagen: "assets/nolon.png",
    alt: "Nolon",
  },
  {
    id: "jinete-markham",
    searchTarget: "markham escribas fourth wing",
    status: "active",
    quadrantKey: "escribas",
    nombre: "Markham",
    cuadrante: "Escribas",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Medio",
    rangoClass:
      "rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300",
    vinculo: "—",
    imagen: "assets/markham.png",
    alt: "Markham",
  },
  {
    id: "jinete-jesinia",
    searchTarget: "jesinia escribas fourth wing",
    status: "active",
    quadrantKey: "escribas",
    nombre: "Jesinia Neilwart",
    cuadrante: "Escribas",
    escuadron: "Fourth Wing",
    estadoTexto: "Activo",
    rango: "Bajo",
    rangoClass:
      "rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300",
    vinculo: "—",
    imagen: "assets/jesinia.png",
    alt: "Jesinia",
  },
];

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
// TAREAS — ESTADO GLOBAL (EN MEMORIA)
// - tasks: fuente de verdad (se sincroniza con localStorage)
// - filtros actuales: tareas + filtros de perfiles
// ======================================================================
/** @type {Task[]} */
let tasks = [];
let currentFilter = "all";
let currentPriorityFilter = "all";
let currentRiderStatusFilter = "all";
let currentRiderQuadrantFilter = "all";

// ===== BÚSQUEDA Y NAVEGACIÓN GLOBAL =====
/**
 * Mapa de nombres que se pueden escribir en el buscador global
 * hacia el id de la sección correspondiente.
 * Permite varios alias por elemento.
 * @type {GlobalSearchTarget[]}
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
const misiones = [
  {
    titulo: "Patrulla del límite norte",
    riesgo: "Alto",
    duracion: "2 días",
    progreso: 72,
  },
  {
    titulo: "Informe para escribas",
    riesgo: "Medio",
    duracion: "6 horas",
    progreso: 40,
  },
  {
    titulo: "Escolta de suministros a Basgiath",
    riesgo: "Medio",
    duracion: "1 día",
    progreso: 58,
  },
  {
    titulo: "Reconocimiento de grietas en la frontera",
    riesgo: "Alto",
    duracion: "3 días",
    progreso: 86,
  },
  {
    titulo: "Evaluación de jinetes novatos",
    riesgo: "Bajo",
    duracion: "4 horas",
    progreso: 24,
  },
];

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

const rutasPrioritarias = [
  {
    nombre: "Basgiath → Samara",
    estado: "Estable",
    badgeClass:
      "rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold dark:bg-slate-950",
  },
  {
    nombre: "Frontera Este",
    estado: "Vigilancia",
    badgeClass:
      "rounded-full bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-200",
  },
  {
    nombre: "Límite Norte",
    estado: "Alta prioridad",
    badgeClass:
      "rounded-full bg-rose-500/15 px-2 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300",
  },
];

const actividadReciente = [
  "Asignación a misión de reconocimiento (48h)",
  "Revisión médica completada",
  "Entrenamiento de vínculo avanzado",
  "Llegada de informes desde la frontera oriental",
  "Vínculo de Mira y Teine marcado como estable",
];

function crearActividadHTML(texto) {
  return `
    <li class="flex gap-2">
      <span class="mt-2 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.45)]"></span>
      ${texto}
    </li>
  `;
}

function renderActividad() {
  renderList("actividad-lista", actividadReciente, (texto, index) =>
    crearActividadHTML(texto, index),
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
  renderList("rutas-prioritarias-lista", rutasPrioritarias, (ruta, index) =>
    crearRutaPrioritariaHTML(ruta, index),
  );
}

// ======================================================================
// UTILIDADES UI — HIGHLIGHT + RENDER DE LISTAS
// - highlightElementTemporarily: resalta y limpia clase
// - renderList: helper para pintar arrays en contenedores
// ======================================================================
/**
 * Añade una clase a un elemento y la elimina pasado un tiempo (resaltar secciones/cards).
 * @param {HTMLElement | null} el
 * @param {string} className
 * @param {number} durationMs
 */
function highlightElementTemporarily(el, className, durationMs) {
  if (!el) return;
  el.classList.add(className);
  window.setTimeout(() => el.classList.remove(className), durationMs);
}

/**
 * Render genérico de listas: recibe el id del contenedor,
 * un array de elementos y una función que devuelve el HTML de cada ítem.
 * @param {string} containerId
 * @param {any[]} items
 * @param {(item: any, index: number) => string} createHTML
 */
function renderList(containerId, items, createHTML) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(createHTML).join("");
}
const taskStatusFilters = [
  {
    value: "all",
    label: "Todas",
    className:
      "task-filter-btn rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition bg-gradient-to-r from-violet-600/80 via-purple-600/70 to-fuchsia-500/60 hover:-translate-y-0.5 hover:shadow-lg hover:from-violet-500/90 hover:via-purple-500/80 hover:to-fuchsia-400/70 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:text-white dark:focus:ring-violet-400 dark:focus:ring-offset-slate-950",
  },
  {
    value: "pending",
    label: "Pendientes",
    className:
      "task-filter-btn rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition bg-gradient-to-r from-violet-600/80 via-purple-600/70 to-fuchsia-500/60 hover:-translate-y-0.5 hover:shadow-lg hover:from-violet-500/90 hover:via-purple-500/80 hover:to-fuchsia-400/70 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:text-white dark:focus:ring-violet-400 dark:focus:ring-offset-slate-950",
  },
  {
    value: "completed",
    label: "Completadas",
    className:
      "task-filter-btn rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition bg-gradient-to-r from-violet-600/80 via-purple-600/70 to-fuchsia-500/60 hover:-translate-y-0.5 hover:shadow-lg hover:from-violet-500/90 hover:via-purple-500/80 hover:to-fuchsia-400/70 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:text-white dark:focus:ring-violet-400 dark:focus:ring-offset-slate-950",
  },
];

const taskPriorityFilters = [
  {
    value: "all",
    label: "Todas",
    className:
      "priority-filter-btn rounded-full px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition bg-slate-100 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  },
  {
    value: "baja",
    label: "Baja",
    className:
      "priority-filter-btn rounded-full px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm transition bg-sky-100 hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/25",
  },
  {
    value: "media",
    label: "Media",
    className:
      "priority-filter-btn rounded-full px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm transition bg-amber-100 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25",
  },
  {
    value: "alta",
    label: "Alta",
    className:
      "priority-filter-btn rounded-full px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition bg-rose-100 hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25",
  },
];

function renderTaskFilters() {
  const taskFiltersContainer = document.getElementById("task-filters");
  const priorityFiltersContainer = document.getElementById("priority-filters");

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

const resumenData = [
  { label: "Perfiles", value: 11 },
  { label: "Dragones", value: 9 },
  { label: "Escuadrones", value: 4 },
];

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
  renderList("resumen-lista", resumenData, (item, index) =>
    crearResumenHTML(item, index),
  );
}

const navItems = [
  {
    href: "#perfiles",
    label: "Perfiles",
    icon: "👤",
  },
  {
    href: "#dragones",
    label: "Dragones",
    icon: "🐲",
  },
  {
    href: "#misiones",
    label: "Misiones",
    icon: "🗺️",
  },
  {
    href: "#archivo-clasificado",
    label: "Archivo",
    icon: "🗄️",
  },
];

const estadoGeneral = [
  {
    label: "Vínculos activos",
    value: 7,
    type: "number",
  },
  {
    label: "Misiones en curso",
    value: 5,
    type: "number",
  },
  {
    label: "Nivel de alerta",
    value: "Moderado",
    type: "badge",
  },
];

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

const kpisData = [
  {
    label: "Perfiles",
    value: 11,
    description: "Totales, 9 activos / 2 inactivos",
  },
  {
    label: "Dragones",
    value: 9,
    description: "Vinculados, 7 activos / 2 inactivos",
  },
  {
    label: "Escuadrones",
    value: 4,
    description: "Activos en la actualidad",
  },
];

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

const dragonesPrincipales = [
  {
    id: "dragon-tairn",
    searchTarget: "tairn dragon negro violet",
    nombre: "Tairn",
    subtitulo: "Tipo: Negro • Temperamento: Letal",
    chip1: {
      text: "Vínculo fuerte",
      className:
        "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-950",
    },
    chip2: {
      text: "Amenaza alta",
      className:
        "rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300",
    },
    overlayClass:
      "pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent opacity-0 blur-[6px] transition duration-500 group-hover:opacity-100",
    hoverShadow: "hover:shadow-[0_10px_40px_rgba(244,63,94,0.35)]",
    icono: "🔥",
  },
  {
    id: "dragon-sgaeyl",
    searchTarget: "sgaeyl dragon azul xaden",
    nombre: "Sgaeyl",
    subtitulo: "Tipo: Azul • Conducta: Reservada",
    chip1: {
      text: "Vínculo fuerte",
      className:
        "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-950",
    },
    chip2: {
      text: "Élite",
      className:
        "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-950",
    },
    overlayClass:
      "pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 blur-[6px] transition duration-500 group-hover:opacity-100",
    hoverShadow: "hover:shadow-[0_10px_40px_rgba(59,130,246,0.35)]",
    icono: "⚡",
  },
  {
    id: "dragon-andarna",
    searchTarget: "andarna dragon dorado violet",
    nombre: "Andarna",
    subtitulo: "Tipo: Dorado • Estado: Joven",
    chip1: {
      text: "Protegida",
      className:
        "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-950",
    },
    chip2: {
      text: "Observación",
      className:
        "rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300",
    },
    overlayClass:
      "pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/25 to-transparent opacity-0 blur-[6px] transition duration-500 group-hover:opacity-100",
    hoverShadow: "hover:shadow-[0_10px_40px_rgba(251,191,36,0.35)]",
    icono: "✨",
  },
];

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

const vinculosDestacados = [
  {
    glowClass: "link-card-glow-violet",
    borderClass: "border-violet-500 dark:border-violet-400/70",
    badgeBorderClass: "border-violet-500/30 dark:border-violet-400/50",
    badgeBgClass: "bg-violet-500/10 dark:bg-violet-500/30",
    badgeTextClass: "text-violet-700 dark:text-violet-100",
    iconClass: "text-violet-500 dark:text-violet-400",
    badge: "Archivo prioritario",
    icono: "✦",
    titulo: "Violet • Tairn / Andarna",
    descripcion:
      "Vínculo excepcional con doble conexión dracónica y valor estratégico extraordinario.",
  },
  {
    glowClass: "link-card-glow-indigo",
    borderClass: "border-indigo-500 dark:border-indigo-400/70",
    badgeBorderClass: "border-indigo-500/30 dark:border-indigo-400/50",
    badgeBgClass: "bg-indigo-500/10 dark:bg-indigo-500/30",
    badgeTextClass: "text-indigo-700 dark:text-indigo-100",
    iconClass: "text-indigo-500 dark:text-indigo-400",
    badge: "Enlace élite",
    icono: "⚡",
    titulo: "Xaden • Sgaeyl",
    descripcion:
      "Enlace de élite marcado por disciplina, liderazgo y capacidad ofensiva.",
  },
  {
    glowClass: "link-card-glow-emerald",
    borderClass: "border-emerald-500 dark:border-emerald-400/70",
    badgeBorderClass: "border-emerald-500/30 dark:border-emerald-400/50",
    badgeBgClass: "bg-emerald-500/10 dark:bg-emerald-500/30",
    badgeTextClass: "text-emerald-700 dark:text-emerald-100",
    iconClass: "text-emerald-500 dark:text-emerald-400",
    badge: "Guardia fronteriza",
    icono: "🛡",
    titulo: "Mira • Teine",
    descripcion:
      "Pareja consolidada en frontera, fiable en despliegues prolongados y vigilancia.",
  },
  {
    glowClass: "link-card-glow-amber",
    borderClass: "border-amber-500 dark:border-amber-400/70",
    badgeBorderClass: "border-amber-500/30 dark:border-amber-400/50",
    badgeBgClass: "bg-amber-500/10 dark:bg-amber-500/30",
    badgeTextClass: "text-amber-700 dark:text-amber-100",
    iconClass: "text-amber-500 dark:text-amber-400",
    badge: "Respuesta inmediata",
    icono: "🔥",
    titulo: "Liam • Deigh",
    descripcion:
      "Vínculo de respuesta rápida con alto nivel de coordinación aérea y defensa cercana.",
  },
];

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
const archivosClasificados = [
  {
    titulo: "Expedición Áridis I",
    descripcion:
      "Reconocimiento inicial de territorios áridos al sur de Navarre. Objetivo: localizar hábitats de dragones no registrados y evaluar condiciones de nidificación.",
  },
  {
    titulo: "Informe de patrulla — Sector Dunas",
    descripcion:
      "Avistamientos de actividad dracónica en formaciones rocosas del cinturón árido oriental. Se recomienda despliegue de exploradores para confirmar presencia de nuevas especies.",
  },
  {
    titulo: "Cartografía del desierto occidental",
    descripcion:
      "Actualización de rutas aéreas seguras para expediciones de largo alcance. Se identifican corrientes térmicas favorables para dragones de gran envergadura.",
  },
  {
    titulo: 'Proyecto "Nido Seco"',
    descripcion:
      "Operación en curso destinada a localizar zonas de incubación en regiones áridas. El archivo sugiere presencia potencial de linajes antiguos adaptados al clima extremo.",
  },
];

function crearArchivoHTML(item) {
  return `
    <article class="secret-article">
      <h4 class="secret-title">${item.titulo}</h4>
      <p class="secret-desc">${item.descripcion}</p>
    </article>
  `;
}

function renderArchivosClasificados() {
  renderList("secret-archivos", archivosClasificados, (item, index) =>
    crearArchivoHTML(item, index),
  );
}

function renderVinculosDestacados() {
  renderList("vinculos-destacados-grid", vinculosDestacados, (item, index) =>
    crearVinculoDestacadoHTML(item, index),
  );
}

function renderDragonesPrincipales() {
  renderList(
    "dragones-principales-grid",
    dragonesPrincipales,
    (dragon, index) => crearDragonPrincipalHTML(dragon, index),
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

    const misionesContainer = document.getElementById("lista-misiones");
    if (misionesContainer) {
      misionesContainer.innerHTML = this.misiones
        .map((m, i) => this.crearMisionHTML(m, i))
        .join("");
    }
  },
};

function renderKPIs() {
  renderList("kpis", kpisData, (item, index) => crearKPIHTML(item, index));
}

function renderEstado() {
  renderList("estado-general", estadoGeneral, (item, index) =>
    crearEstadoHTML(item, index),
  );
}

const baseClass = "flex items-center gap-2 rounded-xl px-3 py-2 transition";

const activeClass =
  "border border-violet-200/60 bg-violet-50 text-violet-900 font-semibold shadow-sm hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100 dark:hover:bg-blue-400/15";

const normalClass =
  "text-slate-700 hover:bg-violet-50 dark:text-slate-200 dark:hover:bg-blue-400/10";

const ACTIVE_NAV_TOKENS = activeClass.split(/\s+/).filter(Boolean);
const NORMAL_NAV_TOKENS = normalClass.split(/\s+/).filter(Boolean);

/**
 * Aplica estilo "activo" a un link del menú y lo quita del resto.
 * @param {string} linkId
 * @returns {void}
 */
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
 * Busca jinete/dragón por texto del buscador global, hace scroll suave y resalta.
 * @param {string} rawQuery
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

const baseBtn = "rounded-full px-3 py-1 text-xs font-semibold transition";

const activeBtn =
  "text-white bg-gradient-to-r from-violet-600/80 to-fuchsia-500/70 hover:-translate-y-0.5 hover:from-violet-500/90 hover:to-fuchsia-400/80";

const normalBtn =
  "border border-violet-200/60 bg-white/80 text-violet-900 hover:bg-violet-50 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-slate-200 dark:hover:bg-blue-400/10";

const quadrantFilters = [
  { label: "Todos", value: "all", active: true },
  { label: "Jinetes", value: "jinetes" },
  { label: "Escribas", value: "escribas" },
  { label: "Curanderos", value: "curanderos" },
];

const statusFilters = [
  { label: "Todos", value: "all", active: true },
  { label: "Activos", value: "active" },
  { label: "En entrenamiento", value: "training" },
  { label: "Archivados", value: "archived" },
];

function crearFiltroHTML(filter, type) {
  const typeClass =
    type === "rider-status" ? "rider-status-filter" : "rider-quadrant-filter";
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

renderFiltros();

function renderDragones() {
  const contenedor = document.getElementById("dragones-grid");
  if (!contenedor) return;

  contenedor.innerHTML = dragones.map(crearDragonHTML).join("");
}

renderDragones();

// ======================================================================
// TAREAS — MÓDULO COMPLETO
// Fuente de verdad: backend (API). Incluye: LÓGICA (CRUD), FILTROS, RENDER y EVENTOS.
// ======================================================================
/**
 * Genera un identificador único para tareas (UUID o fallback con timestamp + random).
 * @returns {string}
 */
function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

/**
 * Normaliza un valor cualquiera a una prioridad válida.
 * @param {string} value
 * @returns {TaskPriority}
 */
function normalizePriority(value) {
  if (value === TASK_PRIORITIES.BAJA) return TASK_PRIORITIES.BAJA;
  if (value === TASK_PRIORITIES.ALTA) return TASK_PRIORITIES.ALTA;
  if (value === TASK_PRIORITIES.MEDIA) return TASK_PRIORITIES.MEDIA;
  return TASK_PRIORITIES.MEDIA;
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
      priority: TASK_PRIORITIES.MEDIA,
    };
  }

  return {
    // Backend ids suelen venir como number; en la UI el id viaja como string (dataset).
    id: String(item?.id ?? generateId()),
    text: item?.text ?? "",
    done: Boolean(item?.done),
    priority: normalizePriority(item?.priority),
  };
}

/**
 * Carga las tareas desde el backend.
 * @returns {Promise<void>}
 */
async function loadTasks() {
  try {
    const backendTasks = await getTasks();
    tasks = Array.isArray(backendTasks)
      ? backendTasks.map(normalizeTask)
      : [];
  } catch (error) {
    console.error("Error al cargar tareas del backend:", error);
    tasks = [];
  }
}

// ===== TAREAS — LÓGICA =====
/**
 * Devuelve el texto actual del campo de búsqueda de tareas.
 * @returns {string}
 */
function getCurrentTaskSearchText() {
  return taskSearchEl ? taskSearchEl.value : "";
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
 * Intenta crear una nueva tarea validando texto y prioridad y persistiendo en backend.
 * @param {string} text
 * @param {string} [priority="media"]
 * @returns {Promise<string>} mensaje de error o cadena vacía
 */
async function addTask(text, priority = TASK_PRIORITIES.MEDIA) {
  const clean = (text || "").trim();

  if (!clean) return "La tarea no puede estar vacía.";
  if (clean.length > MAX_TASK_LENGTH) {
    return `La tarea no puede superar ${MAX_TASK_LENGTH} caracteres.`;
  }
  if (
    tasks.some(
      (t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase(),
    )
  ) {
    return "Esa tarea ya existe.";
  }

  const safePriority = normalizePriority(priority);
  try {
    const created = await createTask(clean, safePriority);
    if (created && created.error) return created.error;
    await loadTasksFromBackend();
    return "";
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return "Error al crear la tarea.";
  }
}

// ===== TAREAS — FILTROS Y RENDER =====
/**
 * Aplica el filtro de estado (todas / pendientes / completadas).
 * @param {Task[]} list
 * @returns {Task[]}
 */
function applyStatusFilter(list) {
  if (currentFilter === TASK_STATUS_FILTERS.PENDING) {
    return list.filter((task) => !task.done);
  }
  if (currentFilter === TASK_STATUS_FILTERS.COMPLETED) {
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
  return [...taskList].sort((a, b) =>
    a.done === b.done ? 0 : a.done ? 1 : -1,
  );
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
  empty.textContent = q
    ? "No hay tareas que coincidan."
    : "Aún no tienes tareas. Añade la primera 🐉";
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
  content.className =
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

  const left = document.createElement("div");
  left.className = "flex min-w-0 flex-1 items-start gap-3";

  const check = document.createElement("button");
  check.type = "button";
  check.dataset.action = "toggle";
  check.setAttribute(
    "aria-label",
    task.done ? "Marcar como pendiente" : "Marcar como completada",
  );
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
  priorityChip.className =
    "mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-white/20";
  priorityChip.style.backgroundColor =
    PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[TASK_PRIORITIES.MEDIA];

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

  del.addEventListener("click", async (e) => {
    // Evita que el click burbujee y dispare el handler delegado de la lista.
    e.stopPropagation();
    await handleTaskListAction("delete", task.id);
  });

  const actions = document.createElement("div");
  actions.className =
    "flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end";

  actions.appendChild(edit);
  actions.appendChild(del);

  content.appendChild(left);
  content.appendChild(actions);
  li.appendChild(content);

  return li;
}

/**
 * Inicializa un grupo de botones de filtro: un solo activo con clase dada y callback al elegir.
 * @param {Object} options
 * @param {string} options.selector - Selector CSS de los botones.
 * @param {string} options.activeClass - Clase que se añade al botón activo.
 * @param {function(HTMLElement): string} options.getValue - Función que devuelve el valor del filtro desde el botón.
 * @param {function(string): void} options.onSelect - Se llama con el valor al pulsar; suele actualizar estado y re-render.
 * @param {string} [options.defaultSelector] - Selector del botón que debe quedar activo al cargar.
 * @returns {void}
 */
function initToggleFilterGroup(options) {
  const { selector, activeClass, getValue, onSelect, defaultSelector } =
    options;
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

/**
 * Inicializa los botones de filtro por estado (todas / pendientes / completadas): estilos activos y re-render.
 * @returns {void}
 */
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

/**
 * Inicializa los botones de filtro por prioridad (todas / baja / media / alta): estilos activos y re-render.
 * @returns {void}
 */
function initPriorityFilters() {
  initToggleFilterGroup({
    selector: ".priority-filter-btn",
    activeClass: "priority-filter-active",
    getValue: (btn) => btn.dataset.priority || "all",
    onSelect: (value) => {
      currentPriorityFilter = value;
      renderTasks(taskSearchEl?.value || "");
    },
  });
}

/**
 * Vacía la lista, aplica filtros y búsqueda, ordena y pinta las tareas o el estado vacío; actualiza estadísticas.
 * @param {string} [filterText=""] - Texto de búsqueda.
 * @returns {void}
 */
// RENDER PRINCIPAL: aplica filtros/orden/búsqueda y pinta la lista de tareas.
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

/**
 * Recarga tareas desde el backend y re-renderiza la lista aplicando filtros/búsqueda.
 * @returns {Promise<void>}
 */
async function loadTasksFromBackend() {
  try {
    const backendTasks = await getTasks();
    tasks = Array.isArray(backendTasks)
      ? backendTasks.map(normalizeTask)
      : [];
    renderTasks(taskSearchEl?.value || "");
  } catch (error) {
    console.error("Error al cargar tareas del backend:", error);
  }
}

// ===== TAREAS — EVENTOS Y HANDLERS =====
/**
 * Abre el modal de nueva tarea: lo hace visible, limpia input y prioridad y enfoca el input.
 * @returns {void}
 */
// MODAL: abre el diálogo y deja valores por defecto.
function openModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.remove("hidden");
  taskModalEl.classList.add("flex");
  if (taskModalInputEl) {
    taskModalInputEl.value = "";
    taskModalInputEl.focus();
  }
  if (taskModalPriorityEl) {
    taskModalPriorityEl.value = TASK_PRIORITIES.MEDIA;
  }
}

/**
 * Cierra el modal de nueva tarea (oculta y quita flex).
 * @returns {void}
 */
// MODAL: cierra el diálogo sin guardar.
function closeModal() {
  if (!taskModalEl) return;
  taskModalEl.classList.add("hidden");
  taskModalEl.classList.remove("flex");
}

/**
 * Intenta crear una tarea con el texto y prioridad dados; si hay error llama a onError,
 * si tiene éxito llama a onSuccess. Unifica la lógica del modal y del formulario.
 * @param {string} text
 * @param {string} priority
 * @param {{ onError?: (message: string) => void, onSuccess?: () => void }} callbacks
 * @returns {void}
 */
// PUNTO ÚNICO DE ENTRADA: crear tarea desde modal o desde el formulario.
async function submitNewTask(text, priority, { onError, onSuccess } = {}) {
  const error = await addTask(text, priority);
  if (error) {
    if (typeof onError === "function") onError(error);
    return;
  }
  if (typeof onSuccess === "function") onSuccess();
}

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
 * Ejecuta la acción (toggle / edit / delete) sobre la tarea con el id dado y actualiza estado y UI.
 * @param {string} action - "toggle" | "edit" | "delete"
 * @param {string} id - id de la tarea
 * @returns {void}
 */
async function handleTaskListAction(action, id) {
  try {
    if (action === "toggle") {
      const taskToToggle = tasks.find((t) => t.id === id);
      if (!taskToToggle) return;
      await updateTask(id, { done: !taskToToggle.done });
      await loadTasksFromBackend();
      return;
    }

    if (action === "edit") {
      const taskToEdit = tasks.find((t) => t.id === id);
      if (!taskToEdit) return;

      const newText = prompt("Edita la tarea:", taskToEdit.text);
      if (newText === null) return;

      const trimmedText = newText.trim();
      if (!trimmedText) return;

      await updateTask(id, { text: trimmedText });
      await loadTasksFromBackend();
      return;
    }

    if (action === "delete") {
      if (!confirm("¿Seguro que quieres eliminar esta tarea?")) {
        return;
      }
      await deleteTask(id);
      await loadTasksFromBackend();
    }
  } catch (error) {
    console.error("Error en acción de tarea:", error);
    alert("No se pudo completar la acción. Revisa la consola.");
  }
}

/**
 * Inicializa todos los eventos relacionados con tareas (lista, filtros locales, modal y formulario).
 * @returns {void}
 */
// EVENTOS: engancha listeners (click/submit/keydown) y coordina acciones sobre `tasks`.
function initTasksUI() {
  // Búsqueda de tareas por texto
  taskSearchEl?.addEventListener("input", (e) => {
    renderTasks(e.target.value);
  });

  // Clics en la lista: botones de acción o toggle al hacer clic en la tarjeta
  taskListEl?.addEventListener("click", (e) => {
    const btn = getActionButtonFromEvent(e);
    if (btn) {
      const idFromBtn = getTaskIdFromButton(btn);
      if (!idFromBtn) return;
      void handleTaskListAction(btn.dataset.action, idFromBtn);
      return;
    }

    const li = e.target.closest?.("li[data-id]");
    if (!li || !taskListEl?.contains(li)) return;

    const id = li.dataset.id;
    if (!id) return;

    void handleTaskListAction("toggle", id);
  });

  // Botón "+ Nuevo" abre el modal
  btnNewTaskEl?.addEventListener("click", () => {
    openModal();
  });

  // Botón "Cancelar" cierra el modal
  taskModalCancelEl?.addEventListener("click", () => {
    closeModal();
  });

  // Guardar desde el modal
  taskModalSaveEl?.addEventListener("click", async () => {
    const text = taskModalInputEl ? taskModalInputEl.value : "";
    const priority = taskModalPriorityEl
      ? taskModalPriorityEl.value
      : TASK_PRIORITIES.MEDIA;
    await submitNewTask(text, priority, {
      onError: (msg) => alert(msg),
      onSuccess: () => {
        if (taskModalInputEl) taskModalInputEl.value = "";
        if (taskModalPriorityEl)
          taskModalPriorityEl.value = TASK_PRIORITIES.MEDIA;
        closeModal();
      },
    });
  });

  // Formulario embebido bajo la lista
  taskFormEl?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = taskInputEl ? taskInputEl.value : "";
    const priority = taskPriorityEl
      ? taskPriorityEl.value
      : TASK_PRIORITIES.MEDIA;
    await submitNewTask(text, priority, {
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

  // Escape cierra el modal si está abierto
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      taskModalEl &&
      !taskModalEl.classList.contains("hidden")
    ) {
      closeModal();
    }
  });
}

// ======================================================================
// APP: TASKAPP — API INTERNA DEL MÓDULO DE TAREAS
// Agrupa helpers + estado (getters/setters) para inicialización y handlers.
// ======================================================================
const TaskApp = {
  get tasks() {
    return tasks;
  },
  set tasks(value) {
    tasks = value;
  },
  get currentFilter() {
    return currentFilter;
  },
  set currentFilter(value) {
    currentFilter = value;
  },
  get currentPriorityFilter() {
    return currentPriorityFilter;
  },
  set currentPriorityFilter(value) {
    currentPriorityFilter = value;
  },
  generateId,
  normalizePriority,
  normalizeTask,
  loadTasks,
  getCurrentTaskSearchText,
  showTaskError,
  addTask,
  applyStatusFilter,
  applyPriorityFilter,
  getFilteredTasks,
  orderTasks,
  renderEmptyState,
  createTaskListItem,
  updateStats,
  handleTaskListAction,
  openModal,
  closeModal,
  submitNewTask,
  initTaskFilters,
  initPriorityFilters,
  initTasksUI,
  renderTasks,
  async init() {
    // Orden recomendado: filtros/UI → cargar backend → render final.
    this.initTaskFilters();
    this.initPriorityFilters();
    this.initTasksUI();
    await this.loadTasks();
    this.renderTasks(taskSearchEl?.value || "");
  },
};

// ======================================================================
// JINETES / PERFILES — NAVEGACIÓN + FILTROS
// - Links de navegación: scroll suave + highlight
// - Filtros: estado (active/training/archived) y cuadrante
// - RidersApp: orquestación de render + filtros
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

/**
 * Inicializa el enlace "Misiones": scroll suave y resalte temporal de la card.
 * @returns {void}
 */
function initMissionsNavHighlight() {
  setupNavScrollAndHighlight({
    linkId: "nav-misiones",
    targetId: "misiones",
  });
}

/**
 * Inicializa el enlace "Archivo": scroll al bloque clasificado y resalte temporal.
 * @returns {void}
 */
function initArchiveNavHighlight() {
  setupNavScrollAndHighlight({
    linkId: "nav-archivo-clasificado",
    targetId: "archivo-clasificado",
    highlightTarget: "self",
  });
}

/**
 * Inicializa el enlace "Perfiles": scroll suave y resalte temporal del bloque.
 * @returns {void}
 */
function initProfilesNavHighlight() {
  setupNavScrollAndHighlight({
    linkId: "nav-perfiles",
    targetId: "perfiles",
  });
}

/**
 * Inicializa el enlace "Dragones": scroll suave y resalte temporal del bloque.
 * @returns {void}
 */
function initDragonsNavHighlight() {
  setupNavScrollAndHighlight({
    linkId: "nav-dragones",
    targetId: "dragones",
  });
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

// ===== TEMA Y ARRANQUE =====
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
    btn.addEventListener("click", () =>
      setTheme(!root.classList.contains("dark")),
    );
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

  window.addEventListener("DOMContentLoaded", () => {
    setTheme(getSavedTheme());
    initThemeToggle();
    initStaticSections();
    DragonsApp.init();
    initGlobalSearch();
    initProfilesNavHighlight();
    initDragonsNavHighlight();
    initMissionsNavHighlight();
    initArchiveNavHighlight();
    RidersApp.init();
    TaskApp.init();

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
    window.addEventListener("scroll", updateInfoVisibility, { passive: true });
    window.addEventListener("resize", updateInfoVisibility);
  });

})();
