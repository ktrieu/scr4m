FROM node:21.7.3 as base

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY src/ ./src
COPY index.html ./
COPY public/ ./

RUN npm ci

FROM base as dev
ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]