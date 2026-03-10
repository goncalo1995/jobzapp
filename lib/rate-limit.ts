import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// A stricter limit for AI endpoints (e.g., 5 requests per minute)
export const aiRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/ai',
});

// Helper for applying rate limits in route handlers
export async function checkRateLimit(req: NextRequest, isAiRoute = false) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const limiter = isAiRoute ? aiRatelimit : ratelimit;
  
  const { success, pending, limit, reset, remaining } = await limiter.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }
  
  return null; // Return null if successful, meaning the request can proceed
}
