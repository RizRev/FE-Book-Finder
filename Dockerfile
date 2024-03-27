FROM node:latest as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .    

RUN npm ci                  

COPY . .

RUN npm run build           

FROM node:latest as production

WORKDIR /app

COPY --from=build /app/package.json .            
COPY --from=build /app/package-lock.json .       
COPY --from=build /app/node_modules ./node_modules 
COPY --from=build /app/build ./build            

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
