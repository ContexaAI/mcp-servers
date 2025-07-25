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

# Start the MCP server with Contexa transport
CMD [ "npm", "start" ]
