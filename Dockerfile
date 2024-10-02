FROM node:20-alpine

ARG USE_CN_MIRROR

ADD . /app

WORKDIR /app

RUN \
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g" "/etc/apk/repositories"; \
        npm config set registry "https://registry.npmmirror.com/"; \
    fi \
    && npm i

EXPOSE 3000/tcp

CMD \
    npm run dev
