#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy --schema=./lib/prisma/schema.prisma

echo "Starting application..."
exec node server.js
