FROM node:lts-alpine

WORKDIR /app

# Copy package files and install dependencies without running prepare scripts
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy rest of the source code
COPY . .

# Build the project explicitly
RUN npm run build

# Expose HTTP port
EXPOSE 8080

# Expose the MCP server on stdio with dotenv support
CMD [ "node", "-r", "dotenv/config", "dist/stdio.js" ]