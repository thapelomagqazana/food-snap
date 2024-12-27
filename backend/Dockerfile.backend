# Node.js Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
