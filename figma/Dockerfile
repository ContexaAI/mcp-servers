FROM node:22.14-alpine AS builder

COPY ./ /app

WORKDIR /app

RUN npm install

FROM node:22.14-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production
ENV FIGMA_API_KEY=figma-api-key
ENV FIGMA_OAUTH_TOKEN=figma-oauth-token

RUN npm ci --ignore-scripts --omit-dev


# Expose HTTP port
EXPOSE 8080

ENTRYPOINT ["node", "dist/cli.js"]