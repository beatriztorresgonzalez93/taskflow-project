# Prompt engineering

## Estado del documento
Este archivo forma parte de la estructura inicial de documentación de la práctica.

## Introducción
En este documento se recogen distintos prompts utilizados durante la práctica para comprobar cómo cambia la respuesta de la IA según la forma de pedir las cosas. Se probaron prompts con rol, ejemplos, razonamiento paso a paso y restricciones claras, aplicados a tareas como generar código, refactorizar funciones y documentar el proyecto.

## Prompts útiles

**prompt 1**
Actúa como un desarrollador JavaScript senior y revisa este archivo app.js. Indica posibles mejoras de calidad del código.

Este prompt funciona bien porque define claramente un rol, en este caso el de un desarrollador JavaScript senior. Al hacer esto, la IA responde desde el punto de vista de alguien con experiencia en desarrollo y se centra en aspectos importantes como la organización del código, la legibilidad o las buenas prácticas.

Además, el prompt pide específicamente mejoras de calidad del código, lo que hace que la respuesta se enfoque en revisar la estructura, detectar posibles problemas y proponer mejoras sin cambiar necesariamente la funcionalidad del programa. Esto es útil cuando se quiere mejorar un proyecto existente sin romper su comportamiento.

También es un prompt claro y directo, lo que ayuda a que la IA entienda exactamente qué se espera de la respuesta y genere sugerencias concretas aplicables al proyecto.



**prompt 2**
Actúa como un desarrollador frontend senior y refactoriza la función renderTasks para que sea más clara sin cambiar su comportamiento.

Este prompt funciona bien porque define un rol claro (desarrollador frontend senior), lo que hace que la IA se centre en buenas prácticas y legibilidad del código. Además, incluye la restricción de no cambiar el comportamiento, por lo que la IA mejora la estructura de la función sin modificar su funcionamiento.



**prompt 3**
Explica paso a paso qué hace esta función
function loadTasks() {
  const stored = readStoredTasks();
  // Compatibilidad con tareas antiguas guardadas como texto simple
  tasks = stored.map(normalizeTask);
}

Este prompt funciona bien porque pide una explicación paso a paso, así que la IA divide la función en partes pequeñas y fáciles de entender. Eso ayuda mucho cuando quieres estudiar código o comprender mejor qué hace cada línea sin que la respuesta sea demasiado general.




**prompt 4**
Analiza este archivo JavaScript y detecta posibles problemas o malas prácticas.

Este prompt funciona bien porque es claro y abierto a la vez: le pide a la IA revisar el archivo completo y centrarse en problemas o malas prácticas, así que la respuesta suele ir orientada a calidad de código y mantenimiento. Además, no pide solo errores, sino también mejoras, por eso la IA da una revisión más completa y útil.




**prompt 5**
Sugiere cómo mejorar la organización del código de este archivo.

Este prompt funciona bien porque pide una mejora muy concreta, que es la organización del código, en lugar de una revisión general. Eso hace que la IA se centre en la estructura del archivo, la separación de responsabilidades y el orden de las funciones, dando sugerencias más útiles para mantener el proyecto limpio y fácil de entender.




**prompt 6**
Explica qué hace este archivo como si fuera documentación de un proyecto.

Este prompt funciona bien porque especifica el formato de la respuesta que se quiere obtener: una explicación como si fuera documentación de un proyecto. Eso hace que la IA organice la información de forma clara, separando responsabilidades y describiendo las funciones principales del archivo. Además, el resultado es útil para crear documentación técnica del proyecto.




**prompt 7**
Añade comentarios JSDoc en las funciones importantes

Este prompt funciona bien porque pide una tarea muy concreta y clara, que es añadir comentarios JSDoc a las funciones importantes. Al especificar el tipo de documentación que se quiere (JSDoc), la IA entiende el formato esperado y genera comentarios estructurados con descripción, parámetros y valores de retorno. Esto mejora la documentación del código sin cambiar su funcionamiento y facilita que otros desarrolladores entiendan mejor las funciones del proyecto.




**prompt 8**
Refactoriza esta función del archivo app.js para mejorar su legibilidad.

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

Restricciones:

No cambies el comportamiento de la función.

No añadas librerías externas.

No modifiques otras funciones del archivo.

Devuelve solo el código refactorizado.

Por qué funciona bien

Este prompt funciona bien porque utiliza restricciones claras en la respuesta. Al indicar exactamente qué cosas no se pueden cambiar, la IA se centra en mejorar la legibilidad del código sin modificar su funcionamiento. Esto permite obtener resultados más controlados y seguros cuando se trabaja sobre código existente.




**prompt 9**

Quiero que sigas este ejemplo:

Ejemplo:
Entrada: función JavaScript con nombres de variables poco claros.
Salida: misma función con nombres más descriptivos y mejor organización.

Ahora aplica ese mismo criterio a esta función del proyecto.
function addTask(text) {
  const clean = (text || "").trim();
  if (!clean) return "La tarea no puede estar vacía.";
  if (clean.length > 100) return "La tarea no puede superar 100 caracteres.";
  if (tasks.some((t) => (t.text || "").trim().toLowerCase() === clean.toLowerCase())) {
    return "Esa tarea ya existe.";
  }

  const task = {
    id: generateId(),
    text: clean,
    done: false,
  };

  tasks.push(task);
  commitTasks();
  return "";
}

Por qué funciona bien

Este prompt funciona bien porque utiliza few-shot prompting, es decir, proporciona un ejemplo del tipo de resultado esperado. Al ver un ejemplo previo, la IA entiende mejor el estilo de respuesta que se quiere y genera resultados más parecidos al formato indicado.



**prompt 10**
Actúa como un desarrollador JavaScript senior. Analiza esta función paso a paso y después propón una versión mejorada manteniendo exactamente el mismo comportamiento.

Por qué funciona bien

Este prompt funciona bien porque combina varias técnicas. Define un rol (desarrollador senior) y además pide un análisis paso a paso antes de proponer mejoras. Esto hace que la IA primero entienda el código y luego sugiera cambios de forma más razonada.