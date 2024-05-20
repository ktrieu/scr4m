FROM nginx:1.26.0 as base

FROM base AS dev
COPY ./proxy/nginx.dev.template ./etc/nginx/templates/default.conf.template

FROM node:21.7.3-alpine as node-builder

COPY ../client/package.json ./
COPY ../client/package-lock.json ./
COPY ../client/tsconfig.json ./
COPY ../client/tsconfig.node.json ./
COPY ../client/vite.config.ts ./
COPY ../client/src/ ./src
COPY ../client/index.html ./
COPY ../client/public/ ./

RUN npm ci
RUN npm run build

FROM base as prod
COPY --from=node-builder ./dist/. /var/www/html/client
COPY ./proxy/nginx.prod.template ./etc/nginx/templates/default.conf.template
