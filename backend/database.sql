\c mi_base_de_datos;

-- 2. Crear la tabla (Si no existe)
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('laptops', 'smartphones', 'audio', 'wearables'))
);