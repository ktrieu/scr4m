FROM node:21.7.3 as base

WORKDIR /app

COPY ./server/package.json ./
COPY ./server/package-lock.json ./
COPY ./server/tsconfig.json ./
COPY ./server/src/ ./src/

RUN npm ci
RUN npm run build

FROM node:21.7.3 as built
COPY --from=base /app/dist/ ./dist/
COPY --from=base /app/node_modules/ ./node_modules/
COPY --from=base /app/package.json ./package.json

FROM built as prod
ENTRYPOINT [ "npm", "run", "start" ]

FROM base as dev
COPY nodemon.json ./nodemon.json
ENTRYPOINT [ "npm", "run", "dev" ]