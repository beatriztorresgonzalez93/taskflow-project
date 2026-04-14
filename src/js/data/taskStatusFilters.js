// Configuracion de botones de filtro por estado de tareas (all/pending/completed).
// Incluye etiqueta y clases CSS para render dinamico.
const taskStatusFiltersData = [
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
