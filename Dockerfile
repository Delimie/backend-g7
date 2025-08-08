# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies (for Prisma)
RUN apk add --no-cache openssl

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port your app uses
EXPOSE 8000

# Start the application
CMD ["npm","run", "start"]