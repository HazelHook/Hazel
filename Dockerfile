FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY . /app
WORKDIR /app

FROM base AS build
COPY --from=base /root/.bun/bin/bun bun
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN ./bun build ./apps/api/src/index.ts --outdir ./dist
EXPOSE 3006
CMD [ "./bun", "run", "/dist/index.js" ]





