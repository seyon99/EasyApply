FROM node:14
# App directory
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./.env ./
COPY ./craco.config.js ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000