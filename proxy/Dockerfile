FROM nginx:1.26.0 as base

FROM base AS dev
COPY ./proxy/nginx.dev.template ./etc/nginx/templates/default.conf.template

FROM node:21.7.3-alpine as node-builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID $VITE_GOOGLE_CLIENT_ID

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter client... build

FROM base as prod
COPY --from=node-builder /app/client/dist/ /var/www/html/client
COPY ./proxy/nginx.prod.template ./etc/nginx/templates/default.conf.template
