# React Frontend Dockerfile
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies and build the project
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the built files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
