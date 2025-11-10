// server.js (Backend)

const express = require('express');
const cors = require('cors'); // Importamos cors
const app = express();
const port = 3001; // Usamos un puerto diferente al de React (que usa el 3000)

// -----------------------------------------------------------------
// MIDDLEWARE
// Esto es clave para permitir que React (en localhost:3000)
// se comunique con este servidor (en localhost:3001)
app.use(cors());
// -----------------------------------------------------------------

// Nuestra ruta de API
app.get('/api/mensaje', (req, res) => {
  // Enviamos un JSON como respuesta
  res.json({ message: "¡Hola! Este mensaje viene del servidor Node.js" });
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});