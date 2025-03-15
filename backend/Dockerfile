# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Instalar Chrome primero
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    # Hacer Chrome accesible a Puppeteer
    && ln -s /usr/bin/google-chrome-stable /usr/bin/chrome

# Configurar variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chrome

# Ahora instalar dependencias de Node.js
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18

WORKDIR /app

# Instalar Chrome en la etapa de producción también
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    # Hacer Chrome accesible a Puppeteer
    && ln -s /usr/bin/google-chrome-stable /usr/bin/chrome

# Configurar variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chrome

# Copiar los archivos construidos
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Crear directorio para archivos subidos
RUN mkdir -p uploads && chmod 777 uploads

# Exponer puerto
EXPOSE 3000

# Iniciar aplicación
CMD ["npm", "run", "start:prod"]