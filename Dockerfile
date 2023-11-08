FROM node:20.9-alpine as builder
ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN --mount=type=cache,target=/app/builder/.npm \
  npm set cache /app/builder/.npm && \
  npm install --legacy-peer-deps
