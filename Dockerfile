FROM node:24-alpine as builder

ARG TELEGRAM_LOGIN_CLIENT_ID
ENV TELEGRAM_LOGIN_CLIENT_ID=$TELEGRAM_LOGIN_CLIENT_ID

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM alpine:latest
COPY --from=builder /app/dist /app/temp

CMD ["sh", "-c", "cp -rf /app/temp/* /app/dist"]
