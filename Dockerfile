# Etapa 1: build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npx tsc

# Etapa 2: execução
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/etl.js"]
