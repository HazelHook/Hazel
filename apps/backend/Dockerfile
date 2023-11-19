FROM oven/bun

WORKDIR /app
RUN ls -la


COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable

RUN pnpm install --production


COPY apps/backend/src src 
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3003