# Quick Railway Deploy

## Step 1: Setup Railway Project

1. Go to [Railway](https://railway.app) and create a new project
2. Add **PostgreSQL** database (click "New" → "Database" → "PostgreSQL")
3. Add **Redis** database (click "New" → "Database" → "Redis")

## Step 2: Deploy Web Service

1. Click "New" → "GitHub Repo" → Select your repository
2. Railway will auto-detect the Dockerfile
3. In service settings:
   - Name it "web" or "api"
   - Add variables:
     - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
     - `REDIS_URL` = `${{Redis.REDIS_URL}}`
     - `NODE_ENV` = `production`
4. Deploy

## Step 3: Deploy Worker Service

1. Click "New" → "GitHub Repo" → Select the **same** repository
2. In service settings:
   - Name it "worker"
   - Settings → Change Dockerfile path to `Dockerfile.worker`
   - Add variables:
     - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
     - `REDIS_URL` = `${{Redis.REDIS_URL}}`
     - `NODE_ENV` = `production`
3. Deploy

## That's It!

Both services will:
- ✅ Build automatically
- ✅ Run migrations on startup
- ✅ Connect to Postgres and Redis
- ✅ Restart on failure

## Check Logs

- Web: Check deployment logs for "Ready on port 3000"
- Worker: Check for "Worker started listening..."

## Test

- Visit your web service URL
- Check `/api/leaderboard` endpoint
- Submit scores via `/api/submit-score`
- Worker will process them from Redis

## Common Issues

**Build fails with Prisma error:**
- Make sure DATABASE_URL is set (even with dummy value during build)

**App crashes on startup:**
- Check DATABASE_URL and REDIS_URL are correct
- Make sure Postgres and Redis are in the same project

**Worker not processing:**
- Check Redis connection in worker logs
- Verify both services use same Redis instance
