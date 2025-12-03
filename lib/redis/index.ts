import Redis from 'ioredis';

// Support both REDIS_URL (Railway/production) and REDIS_HOST/PORT (local)
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });

export { redis };