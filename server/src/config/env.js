const dotenv = require('dotenv');
const path = require('path');

// 👇 subimos hasta la raíz del proyecto correctamente
const envPath = path.join(process.cwd(), '.env');

dotenv.config({ path: envPath });

console.log('Ruta .env:', envPath);
console.log('PORT leído:', process.env.PORT);

if (!process.env.PORT) {
  throw new Error('El puerto no está definido');
}

module.exports = {
  PORT: process.env.PORT
};