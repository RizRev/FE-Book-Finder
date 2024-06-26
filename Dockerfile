FROM node:latest as build

WORKDIR /app

COPY package.json .   

RUN npm install

COPY . .

RUN npm run build           

EXPOSE 7000

CMD [ "npm", "run", "preview" ]
