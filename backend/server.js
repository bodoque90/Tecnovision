require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Importamos cors


const db = require('./db');

const productModel = require('./models/productModel');
const app = express();
const port = 3001; // Usamos un puerto diferente al de React (que usa el 3000)

app.use(express.json());
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

app.get('/api/productos', async (req, res) => {
  try {
    const productos = await productModel.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// POST /api/productos
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria } = req.body;

  // Validación: Ahora requerimos también la categoría
  if (!nombre || precio === undefined || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
  }

  // Validación extra (Opcional pero recomendada): Verificar que la categoría sea válida antes de ir a la BD
  const categoriasValidas = ['laptops', 'smartphones', 'audio', 'wearables'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría no válida. Opciones: laptops, smartphones, audio, wearables' });
  }

  try {
    const nuevoProducto = await productModel.crearProducto({ 
      nombre, 
      descripcion, 
      precio, 
      stock: stock || 0,
      categoria 
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    // Si falla la BD (por ejemplo, si el CHECK falla)
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});



// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});