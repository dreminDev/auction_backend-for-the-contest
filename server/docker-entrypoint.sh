#!/usr/bin/env bash
set -euo pipefail

# Run Prisma generate and Mongo migrations before app start.
bunx prisma generate

retries=30
until bunx migrate-mongo up; do
  retries=$((retries - 1))
  if [ "$retries" -le 0 ]; then
    echo "migrate-mongo failed after retries" >&2
    exit 1
  fi
  echo "migrate-mongo failed, retrying in 2s..."
  sleep 2
done

# Apply Prisma schema to database
bunx prisma db push

exec "$@"
