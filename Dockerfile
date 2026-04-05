# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_BACKEND_URL
ARG VITE_PORT

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_PORT=$VITE_PORT

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
