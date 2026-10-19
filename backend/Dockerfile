# Built from the repo root (context: .) so npm can use the workspace lockfile.
FROM node:20.19-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci --workspace=backend --include-workspace-root=false
COPY backend backend
RUN npm run build --workspace=backend

FROM node:20.19-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci --workspace=backend --include-workspace-root=false --omit=dev
COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/backend/migrations backend/migrations
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
