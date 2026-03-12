## 🐉 Empíreo Archive – Taskflow

Aplicación web interactiva desarrollada como proyecto de prácticas en **Corner Estudios**.

Combina una maqueta temática inspirada en *Basgiath War College* con un **gestor de tareas completo**, usando solo **HTML + Tailwind CSS + JavaScript** y **LocalStorage** para la persistencia.

---

## 🚀 Funcionalidades principales

- **Gestión de tareas**
  - Añadir nuevas tareas desde formulario o modal `+ Nuevo`
  - Marcar tareas como completadas / pendientes
  - Editar el texto de una tarea existente
  - Eliminar tareas con **diálogo de confirmación**
  - Orden automático: tareas pendientes arriba, completadas abajo
  - Persistencia en el navegador mediante `localStorage`

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
  - Sidebar con **navegación, filtros y resumen** usando posición *sticky* para acompañar el scroll
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
- **LocalStorage API** – persistencia de tareas en el navegador

---

## 💾 Persistencia de datos

Las tareas se guardan en el navegador usando `localStorage` bajo la clave `taskflow_tasks`:

```js
localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
```

En la carga de la página:

- Si hay datos guardados, se **normalizan** para asegurar que todas las tareas tienen:
  - `id` único
  - `text`
  - `done` (boolean)
  - `priority` (`"baja" | "media" | "alta"`)
- Si no hay datos, se crean **tareas de ejemplo** para que la interfaz no aparezca vacía.

---

## 📂 Estructura del proyecto

Ruta base del proyecto:

- `index.html` – estructura principal de la interfaz
- `src/css/hero.css` – estilos personalizados del hero y correcciones de ancho/overflow
- `src/js/app.js` – lógica de la aplicación (tareas, filtros, tema, DOM)
- `dist/output.css` – CSS generado por Tailwind

---

## ▶️ Cómo ejecutar el proyecto

1. Clona o descarga este repositorio.
2. Abre la carpeta del proyecto en tu editor (VS Code / Cursor).
3. Lanza un servidor estático en la raíz, por ejemplo:

   ```bash
   npx serve . -p 3000
   ```

4. Abre en el navegador:

   ```text
   http://localhost:3000
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

