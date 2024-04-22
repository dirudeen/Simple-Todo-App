FROM node:lts-alpine3.18
# switch user to root
USER root

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

USER node

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "server.js" ]