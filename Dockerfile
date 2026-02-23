# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.server.json vite.config.ts ./
COPY src/ src/
COPY public/ public/
COPY views/ views/

RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist/ dist/
COPY --from=builder /app/public/ public/
COPY --from=builder /app/views/ views/

EXPOSE 4001

USER node

CMD ["node", "dist/server/bin/www.js"]
