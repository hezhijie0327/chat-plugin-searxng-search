ARG NODEJS_VERSION="22"

FROM node:${NODEJS_VERSION}-slim AS base

ARG USE_CN_MIRROR

RUN \
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/deb.debian.org/mirrors.ustc.edu.cn/g" "/etc/apt/sources.list.d/debian.sources"; \
    fi \
    && apt update \
    && apt install -qy ca-certificates \
    && mkdir -p /distroless/bin /distroless/etc/ssl/certs /distroless/lib \
    && cp /usr/lib/$(arch)-linux-gnu/libdl.so.2 /distroless/lib/libdl.so.2 \
    && cp /usr/lib/$(arch)-linux-gnu/libstdc++.so.6 /distroless/lib/libstdc++.so.6 \
    && cp /usr/lib/$(arch)-linux-gnu/libgcc_s.so.1 /distroless/lib/libgcc_s.so.1 \
    && cp /usr/local/bin/node /distroless/bin/node \
    && cp /etc/ssl/certs/ca-certificates.crt /distroless/etc/ssl/certs/ca-certificates.crt \
    && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

FROM base AS builder

ARG USE_CN_MIRROR

ADD . /app

WORKDIR /app

ENV \
    DOCKER="true" \
    NODE_ENV="production" \
    PNPM_HOME="/pnpm"

RUN \
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        npm config set registry "https://registry.npmmirror.com/"; \
    fi \
    && export COREPACK_NPM_REGISTRY=$(npm config get registry | sed 's/\/$//') \
    && corepack enable \
    && corepack use pnpm \
    && pnpm i \
    && npm run build

FROM busybox:latest AS app

COPY --from=base /distroless/ /

COPY --from=builder /app/public /app/public

COPY --from=builder /app/.next/standalone /app/
COPY --from=builder /app/.next/static /app/.next/static

#COPY --from=builder /app/node_modules /app/node_modules

FROM scratch

COPY --from=app / /

ENV PORT="3000" \
    PRODUCTION_URL=""

EXPOSE 3000/tcp

CMD \
    sed "s|http://localhost:3000|${PRODUCTION_URL:-http://localhost:3000}|g" "/app/public/manifest-dev.json" > "/app/public/manifest.json" \
    && node "/app/server.js"
