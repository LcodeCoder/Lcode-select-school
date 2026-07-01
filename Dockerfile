FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server ./server
COPY scripts/materials-out/articles.json ./scripts/materials-out/articles.json
ENV DB_PATH=/data/views.db
ENV SEED_PATH=/app/scripts/materials-out/articles.json
ENV PORT=80
EXPOSE 80
CMD ["node", "server/index.js"]
