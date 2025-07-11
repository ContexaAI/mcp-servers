# Use the official Node.js 18 image as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy the rest of the application code into the container
COPY src/ ./src/
COPY tsconfig.json ./

# Build the project for Docker
RUN npm run build

# Use a minimal node image as the base image for running
FROM node:18-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --production --ignore-scripts

# Copy the built application from the builder stage
COPY --from=builder /app/build ./build

# Expose HTTP port
EXPOSE 8080

# Run the application
ENTRYPOINT ["node", "build/index.js"]