FROM node:21.7.3 as base

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./src/ ./src/

RUN npm ci
RUN npm run build

FROM node:21.7.3 as built
COPY --from=base ./dist/ ./
COPY --from=base ./node_modules/ ./node_modules/
COPY --from=base ./package.json ./

FROM built as prod
ENTRYPOINT [ "npm", "run", "start" ]

FROM base as dev
COPY nodemon.json ./nodemon.json
ENTRYPOINT [ "npm", "run", "dev" ]