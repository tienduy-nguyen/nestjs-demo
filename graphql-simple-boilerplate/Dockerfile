FROM node:lts:alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
COPY ./src/common/prisma ./src/common/prisma

RUN yarn install
RUN yarn prisma generate

COPY . ./

CMD ["yarn", "start:dev"]