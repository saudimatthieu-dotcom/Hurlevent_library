FROM node:24-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
# prisma generate (run by postinstall) reads DATABASE_URL but doesn't connect
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["npm", "start"]
