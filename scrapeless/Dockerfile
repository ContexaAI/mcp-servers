FROM node:22.14-alpine AS builder

COPY ./ /app

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm npm install

FROM node:22.14-alpine AS release

WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

RUN npm ci --ignore-scripts --omit-dev

# Expose HTTP port
EXPOSE 8080

ENTRYPOINT ["node", "build/index.js"]