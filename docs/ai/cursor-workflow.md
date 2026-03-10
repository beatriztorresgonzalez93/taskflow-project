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


### 5 refactorizaciones del código - mensajes de Cursor


**save+render refactorizada**
refactorización “segura” (sin cambiar funcionalidad): centralizar save+render, extraer open/close del modal, unificar generación de id, y cambiar los listeners por-tarea a un solo listener en la lista (delegación de eventos).



**loadTasks refactorizada**
He dividido la lógica en tres partes más claras:

readStoredTasks(): lee de localStorage, hace JSON.parse con try/catch y garantiza devolver siempre un array válido.
normalizeTask(item): convierte cada elemento almacenado (string o objeto) a un objeto { id, text, done } consistente, reutilizando generateId().
loadTasks(): ahora solo orquesta: llama a readStoredTasks() y hace tasks = stored.map(normalizeTask) manteniendo la compatibilidad con datos antiguos.



**renderTasks() refactorizada**
La separé en funciones pequeñas para que sea más legible y mantenible, sin cambiar el comportamiento:

getFilteredTasks(filterText): obtiene q (búsqueda normalizada) y la lista filtrada.
orderTasks(taskList): ordena poniendo pendientes primero.
renderEmptyState(q): pinta el <li> de “no hay tareas / no coinciden”.
createTaskListItem(task): construye el <li> de una tarea (con los mismos estilos y data-action para la delegación de eventos).
Y renderTasks() ahora solo orquesta: limpia la lista, filtra/ordena, renderiza vacío o items, y llama a updateStats().



**Theme toggle refactorizado**
He separado el bloque final en funciones con responsabilidades claras (sin cambiar el comportamiento):

getSavedTheme(): lee si el tema guardado es "dark".
updateThemeButton(isDark): actualiza icono (themeIcon) y texto (themeText).
setTheme(isDark): aplica/quita la clase dark, guarda en localStorage y actualiza el botón.
initThemeToggle(): engancha el click del botón btnTheme.
En DOMContentLoaded ahora hace setTheme(getSavedTheme()), inicializa el toggle y luego carga/renderiza las tareas.




**Click refectorizado**
Listo: también refactoricé el click de la lista
Ahora el list?.addEventListener("click", ...) quedó mucho más corto, y moví la lógica a helpers:

getActionButtonFromEvent(e): encuentra el botón con data-action (o null).
getTaskIdFromButton(btn): obtiene el data-id del <li>.
toggleTaskById(tasks, id) y deleteTaskById(tasks, id): devuelven el nuevo array.
handleTaskListAction(action, id): aplica la acción y llama a commitTasks().
Comportamiento igual, pero más fácil de leer y mantener.




### Mejora de los nombres de las variables - mensajes de cursor
Apliqué un renombrado consistente (sin cambiar comportamiento):

Elementos DOM con sufijo El: taskFormEl, taskInputEl, taskListEl, taskSearchEl, taskModalEl, taskModalInputEl, taskStatsEl, etc.
Botón: btnNewTask → btnNewTaskEl
Actualicé todas las referencias (eventos, render, modal y stats) para usar los nuevos nombres.
No quedaron errores de lint.




### Reestructuración de archivos - Mensajes de Cursor
Reorganización de código fuente: moví app.js a src/js/app.js y hero.css a src/css/hero.css, dejando la raíz más limpia.
HTML actualizado: en index.html ahora:
El CSS apunta a ./src/css/hero.css?v=1
El script apunta a ./src/js/app.js
Separación clara: la raíz queda para HTML, configuración y dist/ (build); y src/ concentra tu código fuente JS/CSS.


### Añadir validiciones al formulario - Mensajes de cursor

**Validacón 1**
Añadí la validación en addTask() para no permitir tareas de más de 100 caracteres (simplemente no se añade si supera el límite).

function addTask(text) {
  const clean = (text || "").trim();
  if (!clean) return;
  if (clean.length > 100) return;
  const task = {
    id: generateId(),
    text: clean,
    done: false,
  };
  tasks.push(task);
  commitTasks();
}


**Validacón 2**
Añadí la validación en addTask() para evitar tareas duplicadas (compara ignorando mayúsculas/minúsculas y espacios laterales).

function addTask(text) {
  const clean = (text || "").trim();
  if (!clean) return;
  if (clean.length > 100) return;
  if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) return;
  const task = {
    id: generateId(),
    text: clean,
    done: false,
  };
  tasks.push(task);
  commitTasks();
}

**Validación 3**
Feedback al usuario añadido
En el formulario principal: ahora, si la tarea es inválida (vacía/solo espacios, >100 caracteres o duplicada), se muestra un mensaje en #task-error debajo del input.
En el modal: si es inválida, se muestra un alert() con el motivo.
Cambios hechos en:

index.html: añadido <p id="task-error" ...></p> debajo del input.
src/js/app.js: addTask() ahora devuelve un mensaje de error (o "" si todo OK) y el submit lo muestra.



### Añadir comentarios JSDoc - Mensajes de Cursor
He añadido JSDoc en las funciones principales:

loadTasks: qué hace y que mantiene compatibilidad con formatos antiguos.
addTask: describe la validación y que devuelve un string de error o vacío.
createTaskListItem: tipos del objeto task y retorno HTMLLIElement.
renderTasks: explica filtro y orden, con el parámetro filterText.
updateStats: indica que actualiza el resumen de pendientes/completadas.
No he cambiado nada de la lógica, solo documentación.