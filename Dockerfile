FROM node:14-alpine
WORKDIR /app

COPY ./package*.json ./
RUN npm i

ENV REACT_APP_API_URL=/api
ENV DISABLE_ESLINT_PLUGIN=true

COPY ./ ./
RUN npm run build
CMD [ "npm", "run", "prod" ]