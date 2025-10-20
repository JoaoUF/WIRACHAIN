# Multi-stage Dockerfile for Vite + React + TypeScript (production)
# Builds the app from frontend/ and serves with nginx.
#
# Build example:
#   docker build -t wirachain_frontend:latest -f docker/frontend/Dockerfile --build-arg VITE_API_URL=http://web:8000 .
# Compose will pass VITE_API_URL as shown in the compose snippet below.

########################
# 1) Build stage
########################
FROM node:22-alpine AS build

# Accept a VITE_ build arg that will be available to Vite at build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Workdir where we copy frontend sources
WORKDIR /app

# Copy frontend package files for better cache usage
COPY frontend/package.json frontend/package-lock.json* ./ 

# Install deps (use npm ci when lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy the rest of the frontend sources
COPY frontend/ ./frontend
WORKDIR /app/frontend

# Build the production assets (expects "build": "vite build" in frontend/package.json)
RUN npm run build

########################
# 2) Production stage (nginx)
########################
FROM nginx:stable-alpine AS production

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]