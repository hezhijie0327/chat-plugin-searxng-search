FROM node:20-alpine

ADD . /app

RUN npm i

CMD [ "npm", "run", "dev" ]
