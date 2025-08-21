# Imagen base
FROM node:18-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias primero
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias de producción
RUN pnpm install --frozen-lockfile

# Copiar resto del proyecto
COPY . .

# Construir la app
RUN pnpm run build

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "run", "start:prod"]
