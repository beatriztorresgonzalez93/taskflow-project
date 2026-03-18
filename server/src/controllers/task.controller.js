const taskService = require('../services/task.service');

const getTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
};

const createTask = (req, res) => {
  const { text, priority } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return res.status(400).json({
      error: 'El texto es obligatorio y debe tener al menos 3 caracteres'
    });
  }

  const prioridadesValidas = ['baja', 'media', 'alta'];

  if (priority && !prioridadesValidas.includes(priority)) {
    return res.status(400).json({
      error: 'La prioridad debe ser baja, media o alta'
    });
  }

  const nueva = taskService.crearTarea({
    text: text.trim(),
    priority
  });

  res.status(201).json(nueva);
};

const deleteTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { text, done, priority } = req.body || {};

    if (text !== undefined) {
      if (typeof text !== "string" || text.trim().length < 3) {
        return res.status(400).json({
          error: "El texto es obligatorio y debe tener al menos 3 caracteres",
        });
      }
    }

    if (done !== undefined && typeof done !== "boolean") {
      return res.status(400).json({
        error: "El campo 'done' debe ser booleano",
      });
    }

    const prioridadesValidas = ["baja", "media", "alta"];
    if (priority !== undefined) {
      if (!prioridadesValidas.includes(priority)) {
        return res.status(400).json({
          error: "La prioridad debe ser baja, media o alta",
        });
      }
    }

    const updated = taskService.actualizarTarea(id, {
      text: text !== undefined ? text.trim() : undefined,
      done,
      priority,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};