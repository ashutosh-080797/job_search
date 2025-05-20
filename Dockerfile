# Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY frontend-app/package*.json ./
RUN npm install
COPY frontend-app/ .
RUN npm run build

# Build backend
FROM python:3.11-slim as backend-builder
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Final stage
FROM nginx:alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/build /usr/share/nginx/html

# Copy backend
COPY --from=backend-builder /app /app/backend

# Install Python and required packages
RUN apk add --no-cache python3 py3-pip
RUN pip3 install fastapi uvicorn

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80

# Start both nginx and backend server
CMD ["sh", "-c", "nginx && cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000"] 