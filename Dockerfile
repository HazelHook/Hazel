FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY . .

RUN bun install --production

COPY apps/backend/src src 
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3003