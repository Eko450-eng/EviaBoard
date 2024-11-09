# Dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first to install dependencies
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy the build output from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Required for node to find the packages
ENV PATH=/app/node_modules/.bin:$PATH
ENV HOST=0.0.0.0
ENV PORT=8900
ENV NODE_ENV=production

# Expose the port the app will run on
EXPOSE 8900

# Start the application in production mode
CMD ["node", "build"]
