let tasks = [];
let nextId = 1;

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: nextId++,
    text: data.text,
    priority: data.priority || 'media',
    done: false
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
    const index = tasks.findIndex(t => t.id === id);
  
    if (index === -1) {
      throw new Error('NOT_FOUND');
    }
  
    tasks.splice(index, 1);
  };

const actualizarTarea = (id, patch) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  const task = tasks[index];

  if (patch.text !== undefined) task.text = patch.text;
  if (patch.done !== undefined) task.done = patch.done;
  if (patch.priority !== undefined) task.priority = patch.priority;

  return task;
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea,
};