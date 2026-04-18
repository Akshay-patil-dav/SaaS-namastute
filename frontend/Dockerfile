# ─────────────────────────────────────────────────────────────────────────────
#  Namustute Frontend — Dockerfile
#  Multi-stage build:
#    Stage 1 (builder) → Node installs deps and builds Vite production bundle
#    Stage 2 (runtime) → Nginx serves the static files
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars so Vite can embed them at build time
ARG VITE_API_BASE_URL=http://localhost:3000/api
ARG VITE_BACKEND_BASE_URL=http://localhost:3000
ARG VITE_FRONTEND_URL=http://localhost:5173

# Write a .env file so Vite picks up the variables
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env && \
    echo "VITE_BACKEND_BASE_URL=${VITE_BACKEND_BASE_URL}" >> .env && \
    echo "VITE_FRONTEND_URL=${VITE_FRONTEND_URL}" >> .env

# Copy package files and install (cached layer)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Nginx Runtime ────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
