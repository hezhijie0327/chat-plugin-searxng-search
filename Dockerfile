FROM node:20-alpine

ADD . /app

RUN \
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g" "/etc/apk/repositories"; \
        npm config set registry "https://registry.npmmirror.com/"; \
    fi \
    && npm i

CMD [ "npm", "run", "dev" ]
