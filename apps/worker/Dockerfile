FROM imbios/bun-node:20-debian as base


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# RUN apk add --no-cache libc6-compat

RUN apt-get update \
    && apt-get install -y python3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


FROM base AS builder

# Set working directory
WORKDIR /app
COPY . .


RUN pnpm dlx turbo prune worker --docker 
RUN find /app/out/full -name "node_modules" -type d -exec rm -rf '{}' +

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=worker...

FROM base AS runner
WORKDIR /app


COPY --from=installer /app .

RUN chmod +x /usr/local/bin/docker-entrypoint.sh


CMD ["bun", "apps/worker/src/index.ts"]

EXPOSE 3003