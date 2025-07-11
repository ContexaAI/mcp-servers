FROM node:22.14.0-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for build)
RUN npm install --include=dev --ignore-scripts

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose HTTP port
EXPOSE 8080

# Command will be provided by smithery.yaml
CMD ["node", "dist/index.js"] 