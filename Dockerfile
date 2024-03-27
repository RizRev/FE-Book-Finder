FROM node:latest as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .    
COPY node_modules .

COPY . .

RUN npm run build           

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
