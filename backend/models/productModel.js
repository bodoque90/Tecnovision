const db = require('../db');

const crearProducto = async (producto) => {
  // Agregamos 'categoria'
  const { nombre, descripcion, precio, stock, categoria } = producto;
  
  const queryText = 'INSERT INTO productos(nombre, descripcion, precio, stock, categoria) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [nombre, descripcion, precio, stock, categoria];

  try {
    const { rows } = await db.query(queryText, values);
    return rows[0];
  } catch (error) {
    console.error('Error creando el producto:', error);
    throw error;
  }
};

const obtenerTodos = async () => {
  const queryText = 'SELECT * FROM productos ORDER BY id ASC';
  try {
    const { rows } = await db.query(queryText);
    return rows;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

module.exports = {
  crearProducto,
  obtenerTodos,
};

// Actualizar un producto por id
const actualizarProducto = async (id, producto) => {
  const { nombre, descripcion, precio, stock, categoria } = producto;
  const queryText = 'UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, categoria=$5 WHERE id=$6 RETURNING *';
  const values = [nombre, descripcion, precio, stock, categoria, id];
  try {
    const { rows } = await db.query(queryText, values);
    return rows[0];
  } catch (error) {
    console.error('Error actualizando el producto:', error);
    throw error;
  }
};

// Eliminar un producto por id
const eliminarProducto = async (id) => {
  const queryText = 'DELETE FROM productos WHERE id = $1 RETURNING *';
  try {
    const { rows } = await db.query(queryText, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error eliminando el producto:', error);
    throw error;
  }
};

// Aumentar stock de un producto (cantidad puede ser positiva o negativa)
const aumentarStock = async (id, cantidad) => {
  const queryText = 'UPDATE productos SET stock = stock + $1 WHERE id = $2 RETURNING *';
  try {
    const { rows } = await db.query(queryText, [cantidad, id]);
    return rows[0];
  } catch (error) {
    console.error('Error aumentando stock:', error);
    throw error;
  }
};

module.exports = {
  crearProducto,
  obtenerTodos,
  actualizarProducto,
  eliminarProducto,
  aumentarStock,
};