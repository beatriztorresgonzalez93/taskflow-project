// Datos de "dragones principales" para cards destacadas.
// Version reducida frente a `dragones.js`, enfocada en el bloque principal.
window.dragonesPrincipales = [
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
