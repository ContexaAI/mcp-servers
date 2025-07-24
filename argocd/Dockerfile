FROM node:lts-alpine

WORKDIR /app

# Copy package files and install dependencies without running prepare scripts
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy rest of the source code
COPY . .

# Build the project
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose HTTP port
EXPOSE 8080

# Expose the MCP server on stdio
CMD [ "node", "dist/index.js" ]
