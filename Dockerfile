FROM node:21.7.3-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY . /app
WORKDIR /app
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base as client-dev
CMD ["pnpm", "--parallel", "--filter", "client...", "run", "dev"]

FROM base as server-dev
CMD ["pnpm", "--parallel", "--filter", "server...", "run", "dev"]

FROM base as built
RUN pnpm -r build
RUN pnpm --filter server deploy --legacy /prod/server

FROM base as server-prod
COPY --from=built /prod/server /prod/server
WORKDIR /prod/server
CMD ["pnpm", "run", "start"]