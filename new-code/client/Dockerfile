FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=0
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "start"] 