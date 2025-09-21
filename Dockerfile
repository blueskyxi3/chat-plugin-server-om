# Stage 1: Build the application
FROM node:20-slim AS builder

# Install bun
RUN npm install -g bun

# Set working directory
WORKDIR /app

# Copy package.json, bun.lockb (if exists), and other necessary files
COPY package.json bun.lockb* ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN bun run build

# Stage 2: Run the application
FROM node:20-slim AS runner

# Install bun in the runner stage
RUN npm install -g bun

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3500

# Set environment to production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["bun", "run", "start"]