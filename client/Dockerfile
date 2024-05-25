FROM node:21.7.3-alpine as base

WORKDIR /app

COPY ./client/package.json ./package.json
COPY ./client/package-lock.json ./package-lock.json
COPY ./client/tsconfig.json ./tsconfig.json
COPY ./client/tsconfig.node.json ./tsconfig.node.json
COPY ./client/vite.config.ts ./vite.config.ts
COPY ./client/src/ ./src
COPY ./client/index.html ./index.html
COPY ./client/public/ ./public/

RUN npm ci

FROM base as dev
CMD [ "npm", "run", "dev", "--", "--host" ]