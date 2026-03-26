/** @type {import('tailwindcss').Config} */
// Configuracion de Tailwind CSS.
// Define donde buscar clases (content) para generar solo el CSS necesario
// y permite extender tema/plugins del proyecto.
module.exports = {
  content: [
    "./index.html",
    "./*.html",
    "./**/*.html",
    "./**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}