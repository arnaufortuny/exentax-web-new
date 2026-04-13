import { logger } from "./logger";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  check(limiterKey: string, entryKey: string, maxRequests: number, windowMs: number): Promise<boolean>;
  cleanup(): Promise<void>;
}

class MemoryStore implements RateLimitStore {
  private maps = new Map<string, Map<string, RateLimitEntry>>();
  private readonly MAX_ENTRIES = 10_000;

  private getMap(limiterKey: string): Map<string, RateLimitEntry> {
    let m = this.maps.get(limiterKey);
    if (!m) {
      m = new Map();
      this.maps.set(limiterKey, m);
    }
    return m;
  }

  async check(limiterKey: string, entryKey: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const map = this.getMap(limiterKey);
    const now = Date.now();
    const entry = map.get(entryKey);
    if (!entry || now > entry.resetAt) {
      map.set(entryKey, { count: 1, resetAt: now + windowMs });
      if (map.size > this.MAX_ENTRIES) {
        let removed = 0;
        const overflow = map.size - this.MAX_ENTRIES;
        for (const key of map.keys()) {
          if (removed >= overflow) break;
          map.delete(key);
          removed++;
        }
      }
      return true;
    }
    entry.count++;
    return entry.count <= maxRequests;
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const map of this.maps.values()) {
      for (const [k, entry] of map.entries()) {
        if (now > entry.resetAt) map.delete(k);
      }
    }
  }
}

class RedisStore implements RateLimitStore {
  private client: any;
  private fallback = new MemoryStore();

  constructor(client: any) {
    this.client = client;
  }

  async check(limiterKey: string, entryKey: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const redisKey = `rl:${limiterKey}:${entryKey}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);
    try {
      const current = await this.client.incr(redisKey);
      if (current === 1) {
        await this.client.expire(redisKey, ttlSeconds);
      }
      return current <= maxRequests;
    } catch (err) {
      logger.warn("Redis rate limit check failed — falling back to in-memory enforcement", "rate-limit");
      return this.fallback.check(limiterKey, entryKey, maxRequests, windowMs);
    }
  }

  async cleanup(): Promise<void> {
    await this.fallback.cleanup();
  }
}

let _store: RateLimitStore | null = null;

export async function getRateLimitStore(): Promise<RateLimitStore> {
  if (_store) return _store;

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const { default: Redis } = await import("ioredis");
      const client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 3000,
        retryStrategy: (times: number) => (times > 3 ? null : Math.min(times * 200, 2000)),
      });
      await client.connect();
      _store = new RedisStore(client);
      logger.info("Rate limiting: using Redis store", "rate-limit");
      return _store;
    } catch (err) {
      logger.warn("Redis connection failed — falling back to in-memory rate limiting", "rate-limit");
    }
  }

  _store = new MemoryStore();
  logger.info("Rate limiting: using in-memory store", "rate-limit");
  return _store;
}
