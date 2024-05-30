FROM node:21.7.3-alpine as base

WORKDIR /app

COPY ./server/package.json ./
COPY ./server/package-lock.json ./
COPY ./server/tsconfig.json ./
COPY ./server/src/ ./src/
COPY ./server/do-db-cert.crt ./do-db-cert.crt

RUN npm ci
RUN npm run build

FROM node:21.7.3-alpine as built
COPY --from=base /app/dist/ ./dist/
COPY --from=base /app/node_modules/ ./node_modules/
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/do-db-cert.crt ./do-db-cert.crt

FROM built as prod
CMD [ "npm", "run", "start" ]

FROM base as dev
COPY ./server/nodemon.json ./nodemon.json
CMD [ "npm", "run", "dev" ]