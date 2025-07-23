FROM node:lts-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Build the project explicitly
RUN npm run build && chmod +x dist/index.js

# Expose HTTP port
EXPOSE 8080

# Expose the MCP server on stdio
CMD [ "node", "dist/index.js" ]