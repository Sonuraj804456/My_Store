FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 3000

# Run in dev mode
CMD ["pnpm", "run", "dev"]
