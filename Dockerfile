FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

USER node

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]