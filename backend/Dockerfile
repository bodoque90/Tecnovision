FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código
COPY . .

# Exponer puerto
EXPOSE 3001

# Iniciar
CMD ["node", "server.js"]