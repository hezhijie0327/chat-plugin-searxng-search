FROM node:20-alpine AS builder

ARG USE_CN_MIRROR

ADD . /app

WORKDIR /app

RUN \
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g" "/etc/apk/repositories"; \
        npm config set registry "https://registry.npmmirror.com/"; \
    fi \
    && npm i \
    && npm run build

FROM scratch AS app

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

FROM node:20-alpine

COPY --from=app /app /app

WORKDIR /app

ENV PORT="3000" \
    PRODUCTION_URL="" \
    SEARXNG_INSTANCE_URL=""

EXPOSE 3000/tcp

CMD \
    cat "/app/public/manifest-dev.json" | sed "s|http://localhost:3000|${PRODUCTION_URL:-http://localhost:3000}|g" > "/app/public/manifest.json"; \
    npm run start
