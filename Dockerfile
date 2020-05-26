FROM node:alpine
RUN apk add --no-cache make gcc g++ python
RUN yarn global add nodemon

USER node
RUN mkdir /home/node/200_OK_admin
WORKDIR /home/node/200_OK_admin
COPY --chown=node:node yarn.lock package.json ./
RUN yarn install

COPY --chown=node:node . .

ENTRYPOINT ["yarn", "dev"]