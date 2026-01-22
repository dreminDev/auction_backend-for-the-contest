FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN DATABASE_URL="mongodb://localhost:27017/placeholder" bunx prisma generate
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 5000

ENTRYPOINT ["bash", "/app/docker-entrypoint.sh"]
CMD ["bun", "run", "index.ts"]
