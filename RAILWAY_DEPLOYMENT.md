# Railway Deployment Guide

## Architecture

This application consists of three services:
- **Web**: Next.js application (port 3000)
- **Worker**: Background worker processing Redis Stream messages
- **Database**: PostgreSQL + Redis (Railway-managed services)

## Local Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)

### Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Start all services:
```bash
npm run docker:up
```

3. View logs:
```bash
npm run docker:logs
```

4. Stop services:
```bash
npm run docker:down
```

### Access Points
- Next.js App: http://localhost:3000
- PgAdmin: http://localhost:5050 (dev profile only)
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Railway Production Deployment

### Step 1: Setup Railway Services

1. **Create PostgreSQL Database**
   - Add PostgreSQL plugin to your Railway project
   - Note the `DATABASE_URL` variable

2. **Create Redis Instance**
   - Add Redis plugin to your Railway project
   - Note the `REDIS_URL` variable

### Step 2: Deploy Next.js Application

1. **Create new service from GitHub repo**
   - Connect your repository
   - Railway will auto-detect `railway.json`

2. **Configure environment variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   NODE_ENV=production
   PORT=3000
   ```

3. **Deploy settings:**
   - Dockerfile: `Dockerfile`
   - Build command: Auto-detected
   - Start command: `node server.js`

### Step 3: Deploy Worker Service

1. **Create another service from the same repo**
   - Select "Add Service" → "From GitHub Repo"
   - Choose the same repository

2. **Configure the worker:**
   - In service settings, set Railway config path: `railway.worker.json`
   - Or manually set:
     - Dockerfile: `Dockerfile.worker`
     - Start command: `npx tsx worker.ts`

3. **Configure environment variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   NODE_ENV=production
   ```

### Step 4: Database Migrations

Railway will automatically run migrations on deployment. To run manually:

```bash
railway run npx prisma migrate deploy --schema=./lib/prisma/schema.prisma
```

## Environment Variables Reference

### Required for Both Services

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://host:6379` |
| `NODE_ENV` | Environment mode | `production` |

### Web Service Only

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port | `3000` |

## Docker Build Optimization

The Dockerfiles use multi-stage builds for optimal image size:

- **Web Image**: ~150-200MB (Alpine-based)
- **Worker Image**: ~100-150MB (Alpine-based)

### Build Locally

```bash
# Build web service
docker build -t nextjs-app -f Dockerfile .

# Build worker service
docker build -t score-worker -f Dockerfile.worker .
```

## Troubleshooting

### Web Service Issues

1. **Check logs:**
```bash
railway logs --service web
```

2. **Verify DATABASE_URL:**
```bash
railway variables --service web
```

3. **Test database connection:**
```bash
railway run --service web npx prisma db pull --schema=./lib/prisma/schema.prisma
```

### Worker Service Issues

1. **Check if worker is consuming messages:**
```bash
railway logs --service worker
```

2. **Verify Redis connection:**
```bash
railway run --service worker redis-cli -u $REDIS_URL ping
```

### Database Issues

1. **Run migrations manually:**
```bash
railway run --service web npx prisma migrate deploy --schema=./lib/prisma/schema.prisma
```

2. **Check migration status:**
```bash
railway run --service web npx prisma migrate status --schema=./lib/prisma/schema.prisma
```

## Monitoring

### Health Checks

- Web: `GET /api/leaderboard` should return 200
- Worker: Check logs for "Worker started listening..."

### Performance

- Both services use Alpine Linux for minimal footprint
- Node 20 with production optimizations
- Standalone Next.js output (~80% smaller)

## Scaling

### Horizontal Scaling

- **Web**: Can scale to multiple instances behind Railway's load balancer
- **Worker**: Single instance recommended (Redis Stream consumer group handles messages)

### Vertical Scaling

Adjust resources in Railway dashboard:
- Web: 512MB-1GB RAM recommended
- Worker: 256MB-512MB RAM recommended

## CI/CD

Railway automatically deploys on git push to main branch.

### Manual Deploy

```bash
railway up
```

### Rollback

```bash
railway rollback
```

## Security Best Practices

1. ✅ Environment variables (not hardcoded)
2. ✅ Non-root user in containers
3. ✅ Minimal Alpine base images
4. ✅ Production dependencies only
5. ✅ Health checks configured
6. 🔒 Ensure DATABASE_URL and REDIS_URL use SSL in production

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
