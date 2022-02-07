FROM node:14-alpine
WORKDIR /app

ENV t=1

COPY ./package*.json ./
RUN npm i

CMD [ "npm", "start" ]
