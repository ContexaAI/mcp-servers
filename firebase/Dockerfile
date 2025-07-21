FROM node:lts-alpine

WORKDIR /app

# Copy package files and install all dependencies (including dev dependencies)
COPY package*.json ./
RUN npm ci

# Copy rest of the source code
COPY . .

# Build the project explicitly
RUN npm run build

# Expose HTTP port
EXPOSE 8080

# Expose the MCP server on stdio
CMD [ "node", "dist/index.js" ]