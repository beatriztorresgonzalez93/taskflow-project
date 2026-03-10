# Flujo de trabajo con Cursor

## Estado del documento
Este archivo forma parte de la estructura inicial de documentación de la práctica.

## Introducción
En este documento voy a documentar cómo se ha utilizado Cursor durante la práctica, incluyendo atajos de teclado, las tareas realizadas con ayuda de la herramienta y su integración en el desarrollo del proyecto.

**Atajos de teclado utilizados**

Durante el uso de Cursor se utilizaron principalmente los siguientes atajos:

Ctrl + L para abrir el chat contextual y hacer preguntas a la IA sobre el código.

Ctrl + K para modificar o mejorar código seleccionado con ayuda de la inteligencia artificial.

Ctrl + I para usar Composer y generar cambios más amplios en el código.

Ctrl + P para buscar y abrir rápidamente archivos del proyecto.

Ctrl + J para abrir la terminal

Estos atajos permiten interactuar rápidamente con las herramientas de IA directamente desde el editor.

**Ejemplos concretos donde Cursor ha mejorado el código**
Durante las pruebas con Cursor se preguntó cómo mejorar el código del archivo app.js.


### Ejemplo 1: Evitar repetir lógica

Cursor detectó que se repetía varias veces la llamada a:

renderTasks(search ? search.value : "");

Para mejorar el código, Cursor propuso crear una función auxiliar:

function getCurrentFilter() {
  return search ? search.value : "";
}

De esta forma el código evita repetir la misma lógica en varios lugares y resulta más limpio y fácil de mantener.

### Ejemplo 2: Optimización de updateStats

Cursor también sugirió mejorar la función updateStats.

La versión original filtraba el array de tareas dos veces para contar tareas pendientes y completadas. Cursor propuso recorrer el array solo una vez:

let pending = 0;
let completed = 0;

for (const t of tasks) {
  if (t.done) completed++;
  else pending++;
}

Esto hace que el código sea más eficiente y más fácil de leer.