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