FROM node:23.11.0-alpine
WORKDIR /delivery-service
COPY package.json ./
RUN npm i
COPY server.js /delivery-service/
EXPOSE 80
CMD [ "node" , "server.js" ]



