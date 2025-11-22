require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Importamos cors


const db = require('./db');
// DEBUG: imprimir tipo/estado de las vars de entorno relacionadas con BD
console.log('DB ENV:', {
  POSTGRES_USER: typeof process.env.POSTGRES_USER === 'undefined' ? null : process.env.POSTGRES_USER,
  POSTGRES_HOST: typeof process.env.POSTGRES_HOST === 'undefined' ? null : process.env.POSTGRES_HOST,
  POSTGRES_DB: typeof process.env.POSTGRES_DB === 'undefined' ? null : process.env.POSTGRES_DB,
  POSTGRES_PASSWORD_type: typeof process.env.POSTGRES_PASSWORD,
  POSTGRES_PASSWORD_len: process.env.POSTGRES_PASSWORD ? String(process.env.POSTGRES_PASSWORD).length : 0,
});

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



// (La llamada a app.listen se realiza al final del archivo)

// PUT /api/productos/:id -> actualizar producto
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria } = req.body;

  if (!nombre || precio === undefined || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
  }

  try {
    const actualizado = await productModel.actualizarProducto(id, { nombre, descripcion, precio, stock: stock || 0, categoria });
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE /api/productos/:id -> eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await productModel.eliminarProducto(id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado', producto: eliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// PATCH /api/productos/:id/aumentar -> aumentar stock
app.patch('/api/productos/:id/aumentar', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  const qty = Number(cantidad) || 0;
  if (qty === 0) return res.status(400).json({ error: 'Cantidad inválida' });

  try {
    const actualizado = await productModel.aumentarStock(id, qty);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al aumentar stock' });
  }
});

// POST /api/checkout -> procesar compra y descontar stock (transacción)
const { pool } = db;
app.post('/api/checkout', async (req, res) => {
  const { items } = req.body; // items: [{ id, cantidad }]
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Carrito vacío' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updatedProducts = [];

    for (const it of items) {
      const id = Number(it.id);
      const cantidad = Number(it.cantidad) || 0;
      if (!id || cantidad <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Item inválido en carrito' });
      }

      const { rows } = await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING *',
        [cantidad, id]
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Stock insuficiente', productId: id });
      }

      updatedProducts.push(rows[0]);
    }

    await client.query('COMMIT');
    res.json({ success: true, products: updatedProducts });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error en checkout:', error);
    res.status(500).json({ error: 'Error procesando pago' });
  } finally {
    client.release();
  }
});

// iniciar servidor al final para asegurarnos que todas las rutas estén registradas
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});