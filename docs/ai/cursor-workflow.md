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

readStoredTasks(): lee de almacenamiento del navegador, hace JSON.parse con try/catch y garantiza devolver siempre un array válido.
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
setTheme(isDark): aplica/quita la clase dark, actualiza el botón y mantiene coherencia de UI.
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

### Consultas utilizando el servidor MCP

**consulta 1**
¿Puedes acceder a GitHub usando el servidor MCP configurado?

Sí.

Puedo acceder a GitHub a través del servidor MCP user-github que tienes configurado.
Si queremos hacer algo concreto (listar repos, issues, PRs, etc.), usaría las herramientas de ese servidor vía MCP, pero antes tendría que leer sus descriptores en mcps/user-github para ver exactamente qué operaciones expone y con qué parámetros.

**consulta 2**

Analiza el repositorio de GitHub vinculado a este proyecto

Análisis del repositorio vinculado (taskflow-project)
Repositorio remoto

URL: https://github.com/beatriztorresgonzalez93/taskflow-project
Remoto configurado como origin (fetch/push).
Actualmente: 0 estrellas, 0 forks, sin issues ni PR públicos destacados.
Tipo de proyecto (según tu código local)

Proyecto frontend estático (HTML + CSS + JS) con Tailwind (via dist/output.css) y un tema claro/oscuro.
Implementa una interfaz rica tipo “dashboard” (index.html) y una mini app de tareas (TaskFlow) controlada por:
src/js/app.js: lógica de tareas (renderizado, validaciones, tema).
src/css/hero.css: estilos específicos del hero con imágenes en assets/.
Estructura y organización principal

Raíz: index.html, package.json, tailwind.config.js, postcss.config.js, dist/ (CSS generado), assets/ (imágenes), docs/ y README.md.
src/:
src/js/app.js: código JS modularizado y refactorizado (helpers para storage, render, eventos, tema).
src/css/hero.css: estilos personalizados del hero con fondos en modo claro/oscuro.
Calidad del código actual (lo que hemos ido mejorando)

Funciones pequeñas y con responsabilidad clara (loadTasks, renderTasks, updateStats, helpers de eventos).
Se usan validaciones en el formulario:
Sin tareas vacías o solo espacios.
Límite de 100 caracteres.
Sin duplicados (comparación normalizada).
Feedback de error visible en el formulario y alert en el modal.
Se ha aplicado delegación de eventos en la lista de tareas y JSDoc en funciones clave.
Tema claro/oscuro encapsulado en helpers (setTheme, getSavedTheme, updateThemeButton, etc.).
En resumen, el repositorio de GitHub vinculado es tu proyecto actual de interfaz + gestor de tareas, con una estructura ya bastante ordenada y código JavaScript refactorizado y documentado; a nivel público en GitHub todavía está “limpio” (sin issues ni PRs, ni estrellas).




**consulta 3**
Lista todos los archivos del proyecto
Voy a listar solo los archivos propios del proyecto (raíz, src, assets, dist, docs), excluyendo node_modules, para que la lista sea útil y legible.

Archivos del proyecto (excluyendo node_modules)
Raíz del proyecto

Directorios:
assets/
dist/
docs/
src/
node_modules/ (dependencias, lo excluimos del detalle)
Archivos:
index.html
package.json
package-lock.json
postcss.config.js
tailwind.config.js
README.md
src/

src/js/app.js
src/css/app.css
src/css/hero.css
dist/

dist/output.css
docs/ai/

docs/ai/prompt-engineering.md
docs/ai/ai-comparison.md
docs/ai/cursor-workflow.md
docs/ai/experiments.md
docs/ai/reflection.md


**consulta 4**

Analiza index.html
Análisis de index.html (resumen)
Head y estilos

Define página en español, título “Empíreo Archive • TaskFlow”.
Carga fuentes de Google (Cinzel, Inter).
Carga Tailwind compilado ./dist/output.css?v=1 y los estilos específicos del hero ./src/css/hero.css?v=1.
Layout general

body con fondo degradado y soporte dark mode (clases dark:*).
Estructura principal tipo dashboard:
Topbar fijo con brand (Empíreo Archive), buscador visual y botones:
#btn-new-task (abre modal de nueva tarea).
#btnTheme con #themeIcon y #themeText (toggle de tema que maneja app.js).
Sidebar (izquierda)

Secciones:
Navegación: links internos a #perfiles, #dragones, #misiones, #archivo.
Filtros: chips visuales de cuadrante y estado (solo UI, sin lógica).
Resumen: KPIs estáticos (Perfiles, Dragones, Escuadrones).
Contenido principal (derecha)

Hero: sección .hero-banner con texto “Basgiath War College”; el fondo y efectos los controla hero.css.
Módulo “Mis tareas”:
#task-stats: texto inicial “0 pendientes · 0 completadas”.
Formulario #task-form:
#task-input (nueva tarea).
<p id="task-error"> para mostrar errores de validación.
Buscador #task-search.
Lista <ul id="task-list"> donde app.js inyecta las tareas.
Secciones estáticas:
KPIs (“Perfiles”, “Dragones”, “Misiones”).
Lista de perfiles, dragones, misiones, etc. (maqueta UI con imágenes en assets/...).
Nota al final (#archivo) indicando que es una maqueta UI y que botones/pestañas son solo visuales.
Footer con créditos.
Modal de nueva tarea

#task-modal con input #modal-task-input y botones:
#modal-cancel (cierra modal).
#modal-save (crea nueva tarea).
Toda esta interacción se maneja en src/js/app.js.
Script

Al final del body se incluye ./src/js/app.js, que:
Gestiona tareas (render + validaciones).
Maneja formulario, búsqueda, modal.
Controla el theme toggle (claro/oscuro).




**consulta 5**
Muestra los commits recientes del repositorio taskflow-project

Commits recientes de taskflow-project (últimos 10)
ed669a3 — agregada informacion de Cursor (valiadiones, refactorizacion, comentariosJSDoc), en Cursor-workflow.md
cc46d30 — refactorizacion de codigo, reestructuración de archivos, validadiones en formulario y comentarios JSDoc
00925df — Documentación de comparación y uso de Cursor
955f0b4 — Estructura inicial de documentación
4ac723b — Backup antes de cambios
5c3ad86 — Actualización práctica Corner
dea4730 — Tailwind design system + dark mode + UI improvements
bc338b4 — Corrección layout móvil, expansión de tareas y solape de chips en perfiles
d41c359 — Añadir sistema de tareas interactivo con modal y persistencia
e0c4d2e — Tipografía épica (Cinzel) + ajustes finales UI



### Instalación y configuración de un servidor MCP en Cursor

**1. Acceso a la configuración de Cursor**

Para comenzar, se abrió el editor Cursor y se accedió al menú de configuración del programa.
Dentro del panel de ajustes se localizó la sección Tools & MCP, que permite añadir servidores MCP para ampliar las capacidades de la inteligencia artificial.

**2. Creación del archivo de configuración MCP**

Cursor genera automáticamente un archivo de configuración llamado:

.cursor/mcp.json

Este archivo se utiliza para definir los servidores MCP que se conectarán al editor.

Inicialmente el archivo contiene una estructura básica:

{
  "mcpServers": {}
}
**3. Instalación del servidor MCP filesystem**

Para permitir que la IA acceda a los archivos del proyecto se añadió un servidor MCP de tipo filesystem.

Se modificó el archivo mcp.json añadiendo la siguiente configuración:

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "."
      ]
    }
  }
}

Este servidor permite a la inteligencia artificial explorar los archivos del proyecto y analizar su contenido.

**4. Instalación del servidor MCP de GitHub**

Además, se configuró un servidor MCP para conectar la IA con GitHub.

Para ello se generó previamente un token de acceso personal en GitHub desde:

https://github.com/settings/tokens

Después se añadió la configuración correspondiente en el archivo mcp.json:

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "."
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {}
    }
  }
}

Este servidor permite a la IA consultar información de repositorios de GitHub.

**5. Reinicio del editor**

Una vez guardado el archivo de configuración, se reinició el editor Cursor para que los nuevos servidores MCP fueran cargados correctamente.

**6. Verificación del funcionamiento**

Para comprobar que la instalación funcionaba correctamente, se realizaron varias consultas a la IA relacionadas con el proyecto y con repositorios de GitHub.
Gracias a los servidores MCP configurados, la IA pudo acceder a información de los archivos del proyecto y realizar análisis del código.



### Utilidad de MCP en proyectos reales

El Model Context Protocol (MCP) permite que una inteligencia artificial pueda conectarse con diferentes herramientas externas, como archivos del proyecto, repositorios de GitHub o servicios online. Esto hace que la IA no solo responda preguntas, sino que también pueda acceder a información real del proyecto.

En proyectos reales puede ser útil en varias situaciones. Por ejemplo, permite que la IA pueda leer directamente los archivos del proyecto y analizar el código para detectar posibles mejoras o errores. Esto puede ayudar mucho a los desarrolladores cuando están revisando su propio código o intentando entender partes del proyecto.

También puede servir para conectarse con repositorios de GitHub y consultar información sobre commits, cambios recientes o la estructura de un repositorio. De esta forma la IA puede ayudar a revisar código o entender cómo ha evolucionado un proyecto.

Otra utilidad es automatizar ciertas tareas del desarrollo, como generar documentación, explicar partes del código o sugerir mejoras en la estructura del proyecto.

En general, MCP hace que las herramientas de inteligencia artificial sean más útiles en el trabajo diario de programación, ya que pueden interactuar directamente con el entorno del proyecto en lugar de limitarse solo a responder preguntas.
