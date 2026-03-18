const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());

const loggerAcademico = (req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion}ms)`);
  });

  next();
};

app.use(loggerAcademico);

app.use('/api/v1/tasks', taskRoutes);

app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/crear-prueba', (req, res) => {
    const nueva = {
      id: Date.now(),
      text: 'Tarea de prueba',
      done: false
    };
  
    res.json(nueva);
  });