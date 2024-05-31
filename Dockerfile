FROM node:21.7.3-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dev
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM dev as client-dev
CMD ["pnpm", "--filter", "client", "run", "dev"]

FROM dev as server-dev
CMD ["pnpm", "--filter", "server", "run", "dev"]