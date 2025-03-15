# Etapa de construcción
FROM node:18-alpine AS build
WORKDIR /app

# Configurar npm para mayor velocidad
RUN npm config set progress=false \
    && npm config set fund=false \
    && npm config set audit=false \
    && npm config set loglevel=error

# Copiar archivos de configuración
COPY package*.json tsconfig.json vite.config.ts ./

# Crear el archivo tsconfig.node.json faltante
RUN echo '{ \
  "compilerOptions": { \
    "composite": true, \
    "skipLibCheck": true, \
    "module": "ESNext", \
    "moduleResolution": "bundler", \
    "allowSyntheticDefaultImports": true \
  }, \
  "include": ["vite.config.ts"] \
}' > tsconfig.node.json

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Crear un archivo .env con la URL del backend
RUN echo "VITE_API_URL=/api" > .env

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Eliminar los archivos de configuración por defecto de nginx
RUN rm -rf ./*

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist .

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]