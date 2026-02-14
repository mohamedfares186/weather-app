FROM node:lts-alpine

WORKDIR /weather-app

COPY package*.json .

RUN  npm install

COPY . .

CMD [ "node", "src/main.mjs" ]