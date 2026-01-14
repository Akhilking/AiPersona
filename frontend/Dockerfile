# Frontend Dockerfile for AI Persona Shopping
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build for production
RUN npm run build

# Expose port
EXPOSE 5173

# Run preview server (or use nginx for production)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
