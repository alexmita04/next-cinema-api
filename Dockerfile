# Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Production
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs ./src ./src
COPY --chown=nodejs:nodejs package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

USER nodejs

CMD ["node", "src/server.js"]