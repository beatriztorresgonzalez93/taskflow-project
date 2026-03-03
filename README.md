# Taskflow Project

Proyecto de prácticas Corner Estudios

# 🐉 Empíreo Archive – Taskflow Interactive

Aplicación web desarrollada con **HTML, CSS y JavaScript** que integra una maqueta visual temática (Basgiath War College) con un sistema dinámico de gestión de tareas.

El proyecto transforma una interfaz estática en una aplicación interactiva utilizando manipulación del DOM y almacenamiento local.

---

## 🚀 Funcionalidades

### Gestión de tareas
- Añadir nuevas tareas
- Eliminar tareas
- Marcar tareas como completadas
- Orden automático (pendientes arriba, completadas abajo)
- Persistencia con LocalStorage

### Filtro de búsqueda
- Búsqueda en tiempo real
- Filtrado dinámico por texto

### Integración UI
- Modal para añadir tareas desde el botón "+ Nuevo"
- Diseño coherente con la estética del proyecto

---

## 🧠 Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox + Grid)
- JavaScript (ES6)
- DOM Manipulation
- LocalStorage API

---

## 💾 Persistencia de datos

Las tareas se almacenan en el navegador utilizando:

```js
localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));