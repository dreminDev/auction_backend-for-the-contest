FROM oven/bun:latest

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json bun.lock ./
COPY migrate-mongo-config.js ./
COPY prisma.config.ts ./

# Устанавливаем зависимости
RUN bun install

# Копируем исходный код
COPY . .

# Копируем .env.example в .env если .env не существует
RUN if [ ! -f .env ]; then cp .env.example .env; fi

ARG DATABASE_URL=mongodb://localhost:27017/auction
ENV DATABASE_URL=${DATABASE_URL}

RUN bunx prisma generate
RUN bunx prisma db push

EXPOSE 5000

CMD ["sh", "-c", "bunx migrate-mongo up && bun run index.ts"]

