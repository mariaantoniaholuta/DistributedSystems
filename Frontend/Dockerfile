FROM node:16 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_BACKEND_ENDPOINT_1=http://localhost:8080
ENV REACT_APP_BACKEND_ENDPOINT_2=http://localhost:8081

RUN npm run build


CMD ["npm", "start"]

