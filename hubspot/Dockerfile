FROM node:lts-alpine
WORKDIR /app

COPY . /app

RUN npm install --production --ignore-scripts

EXPOSE 8080

CMD ["node", "dist/sse.js"]

