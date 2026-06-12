FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM alpine:latest
COPY --from=builder /app/dist /app/dist
