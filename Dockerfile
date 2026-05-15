# Stage 1: Build
FROM node:20-slim AS builder
# Install system dependencies
RUN apt-get update && apt-get install -y openssl libssl-dev libc6 python3 make g++
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1



# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Set dummy database URL for build time to prevent failures during static optimization
ARG DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/resonara"
ENV DATABASE_URL=$DATABASE_URL


# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
# Note: Next.js will use the output: 'standalone' from next.config.ts
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl
WORKDIR /app



ENV NODE_ENV=production

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/sh -m nextjs


# Install prisma and dotenv to run migrations
RUN npm install prisma dotenv



# Copy only the necessary files for standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Create upload directory and ensure correct permissions
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Run migrations and then start the server
CMD ["sh", "-c", "if [ -z \"$DATABASE_URL\" ]; then echo 'WARNING: DATABASE_URL is not set. Skipping prisma db push.'; else npx prisma db push --accept-data-loss || echo 'WARNING: Prisma db push failed, continuing anyway.'; fi && node server.js"]
