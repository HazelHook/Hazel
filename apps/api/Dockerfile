FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash


# ? -------------------------
FROM gcr.io/distroless/base



WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun

COPY packed packed



ENV ENV production
CMD ["./bun", "./packed/index.js"]

EXPOSE 3006
