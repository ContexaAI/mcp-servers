FROM node:lts-alpine
WORKDIR /app

COPY . /app

RUN npm install --production --ignore-scripts

# Expose HTTP port
EXPOSE 8080

CMD ["node", "dist/index.js"]

