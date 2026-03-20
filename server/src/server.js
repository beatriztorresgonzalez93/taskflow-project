const app = require('./index');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Backend TaskFlow escuchando en http://localhost:${PORT}`);
});
