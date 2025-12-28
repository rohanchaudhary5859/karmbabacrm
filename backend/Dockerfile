FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client and run migrations at build time (optional)
RUN npx prisma generate || true

EXPOSE 5000
CMD ["node", "server.js"]
