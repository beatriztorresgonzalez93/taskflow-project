## 🐉 Empíreo Archive – Taskflow

Aplicación web interactiva desarrollada como proyecto de prácticas en **Corner Estudios**.

Combina una maqueta temática inspirada en _Basgiath War College_ con un gestor de tareas con frontend y backend separados.

---

## 🚀 Funcionalidades principales

- **Gestión de tareas**
  - Añadir nuevas tareas desde formulario o modal `+ Nuevo`
  - Marcar tareas como completadas / pendientes
  - Editar el texto de una tarea existente
  - Eliminar tareas con **diálogo de confirmación**
  - Orden automático: tareas pendientes arriba, completadas abajo
  - Persistencia vía API backend (no en `localStorage`)

- **Prioridades con chips de color**
  - Tres niveles: **baja (azul)**, **media (amarillo)** y **alta (rojo/rosa)**
  - Cada tarea muestra un pequeño **chip de color** según su prioridad
  - Selector de prioridad tanto en el formulario como en el modal
  - **Filtro por prioridad**: ver todas, solo baja, media o alta

- **Filtros y búsqueda**
  - Filtro por **estado**: todas, pendientes, completadas
  - Filtro por **prioridad**
  - **Búsqueda en tiempo real** por texto
  - Combinación de filtros + búsqueda sobre la misma lista

- **Interfaz y UX**
  - Diseño responsive basado en **Tailwind CSS**
  - Tema claro / oscuro con **toggle persistente** (se guarda la elección)
  - Sidebar con **navegación, filtros y resumen** con posicionamiento `fixed` en escritorio (`md:fixed`)
  - Hero ilustrado coherente con la temática de archivo de dragones

---

## 🧠 Tecnologías utilizadas

- **HTML5** – estructura semántica de la página
- **Tailwind CSS** – maquetación y estilos (layout, responsive, dark mode, etc.)
- **CSS personalizado** (`hero.css`) – ajustes visuales específicos del hero y correcciones de layout
- **JavaScript (ES6+)**
  - Manipulación del DOM
  - Gestión de eventos (click, submit, input, keydown)
  - Organización del código con funciones puras y tipos JSDoc
- **Node.js + Express** – API REST de tareas
- **LocalStorage API** – persistencia del tema (claro/oscuro)

---

## 💾 Persistencia de datos

- Las tareas se guardan en el backend (`server/src/services/task.service.js`), en memoria del proceso.
- En despliegue serverless esto **no es persistencia definitiva**: puede resetearse.
- `localStorage` se usa solo para guardar la preferencia de tema (modo claro/oscuro).

---

## 📂 Estructura del proyecto

Ruta base del proyecto:

- `index.html` – estructura principal de la interfaz
- `src/js/app.js` – lógica de UI y render
- `src/js/api.js` – cliente HTTP para la API
- `server/src/index.js` – app Express
- `server/src/routes/task.routes.js` – rutas REST
- `server/src/controllers/task.controller.js` – validación y respuestas HTTP
- `server/src/services/task.service.js` – lógica de tareas en memoria
- `server/api/index.js` – entrypoint serverless para Vercel
- `server/vercel.json` – rewrites para backend en Vercel

---

## ▶️ Cómo ejecutar el proyecto

1. Clona o descarga este repositorio.
2. Abre la carpeta del proyecto en tu editor (VS Code / Cursor).
3. Arranca backend:

   ```bash
   npm run dev
   ```

4. En otra terminal, sirve el frontend:

   ```bash
   npx serve . -p 5500
   ```

5. Abre en el navegador:

   ```text
   http://localhost:5500
   ```

> También puedes usar extensiones tipo **Live Server** para tener recarga automática al guardar.

---

## 📌 Ejemplos de uso

- **Crear una tarea rápida**
  1. Haz clic en el botón **`+ Nuevo`** de la barra superior.
  2. Escribe el texto de la tarea en el modal (por ejemplo: `Revisión del archivo de dragones`).
  3. Elige una **prioridad** (baja, media, alta).
  4. Pulsa **Guardar**. La tarea aparecerá al principio de la lista.

- **Marcar una tarea como completada**
  1. Localiza la tarea en la lista.
  2. Haz clic en el **círculo de la izquierda** (checkbox estilizado).
  3. La tarea se mostrará con texto tachado y se moverá debajo de las pendientes.

- **Editar una tarea existente**
  1. Busca la tarea que quieres cambiar.
  2. Pulsa el botón **Editar** (botón violeta).
  3. Modifica el texto en el cuadro de diálogo y confirma.

- **Eliminar una tarea**
  1. Pulsa el botón **Eliminar** (botón rojo) de la tarea.
  2. Confirma en el mensaje: `¿Seguro que quieres eliminar esta tarea?`.
  3. La tarea desaparecerá de la lista y del almacenamiento.

- **Filtrar por estado y prioridad**
  1. Usa los **botones de filtro de estado** (todas / pendientes / completadas) para centrarte en un tipo.
  2. Usa los **botones de prioridad** (todas / baja / media / alta) para combinar filtros.
  3. Opcionalmente, escribe texto en el buscador para filtrar aún más.

- **Cambiar entre modo claro y oscuro**
  1. Haz clic en el botón de **tema** de la barra superior.
  2. El icono cambiará (🌙 / ☀️) y se actualizarán los estilos.
  3. La preferencia se guarda, así que cuando vuelvas a abrir la página se mantendrá el último modo.

---

## 🧩 Posibles mejoras futuras

- Añadir fechas de vencimiento a las tareas y ordenar por fecha/prioridad.
- Agrupar tareas por secciones o categorías.
- Exportar/Importar tareas (JSON) para moverlas entre navegadores.
- Añadir tests básicos de la lógica de filtrado y prioridades.


## 📝 Resumen para entenderlo yo

Esta app tiene dos partes:

- Una parte bonita que veo en pantalla (frontend).
- Una parte que recibe y gestiona las tareas (backend).

Ahora mismo estan en dos proyectos de Vercel distintos, pero conectados entre si.
O sea, frontend y backend son dos proyectos separados, pero “se hablan” por HTTP usando la URL del backend.

Cuando creo una tarea:

1. La escribo en la web.
2. La web se la envia al backend.
3. El backend la guarda y responde.
4. La web vuelve a pedir la lista y la muestra actualizada.

Como esta organizado el backend (capas):

**server.js**
Es el archivo que arranca el backend en local.
Define el puerto con `process.env.PORT || 3000` y hace `app.listen(...)`.

**router.js**
Define las rutas HTTP (qué URL existe y a qué función va).
Ejemplo mental: “si llega POST /tasks, llámame a X”.

**controller.js**
Recibe la petición, valida datos, decide respuesta HTTP (200, 400, etc.).
Es el “jefe” de cada endpoint.

**service.js**
Tiene la lógica de negocio y acceso a datos (crear, editar, borrar tareas).
Es donde realmente “pasan cosas” con las tareas.
Además, aquí se guardan las tareas en memoria con un array: `let tasks = []`.


Importante:

- Las tareas no usan `localStorage`.
- El modo claro/oscuro si usa `localStorage`.
- Las tareas ahora se guardan en memoria del backend, asi que si se reinicia, se pueden perder.