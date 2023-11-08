FROM nx-workspace-base-image:0.1 AS builder

WORKDIR /app/builder

ARG NODE_ENV
ARG BUILD_FLAG
ARG START_TIME

COPY . .

RUN npx nx reset

RUN npx nx run api:build:production 

FROM node:20.9-alpine

WORKDIR /app

COPY --from=builder /app/builder/dist ./

ENV NODE_ENV=$NODE_ENV

ENV START_TIME=$START_TIME

CMD ["node", "./apps/api/main.js"]