# syntax=docker/dockerfile:1

############################
#  Stage 1 — build the site #
############################
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The site and the API share one domain, so the API is addressed relatively.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

#######################################################
#  Stage 2 — Caddy serves the site and proxies /api    #
#######################################################
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
