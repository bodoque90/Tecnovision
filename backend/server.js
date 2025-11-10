require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Importamos cors


const db = require('./db');
const app = express();
const port = 3001; // Usamos un puerto diferente al de React (que usa el 3000)


app.use(cors());

// Nuestra ruta de API
app.get('/api/mensaje', async (req, res) => {
  try {
    // Usamos la función 'query' que exportamos
    const result = await db.query('SELECT NOW()');
    const horaDeLaBD = result.rows[0].now;

    res.json({
      message: `¡Conexión a BD exitosa! Hora de la BD: ${horaDeLaBD}`
    });

  } catch (error) {
    console.error('Error al consultar la base de datos', error);
    res.status(500).json({ message: 'Error conectando a la BD' });
  }
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});