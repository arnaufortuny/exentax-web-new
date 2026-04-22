import { randomUUID } from "crypto";
import { logger } from "./logger";
import { evictExpired } from "./store-cleanup";

/**
 * Distributed lock store for slot and booking locks.
 *
 * Production: Redis SET NX PX (single-node Redis is sufficient for our scale,
 * Redlock not required). All instances coordinate through the same Redis
 * server, so two Node processes cannot enter the same critical section.
 *
 * Fallback: in-memory promise chain per key. Preserves the historical
 * single-process semantics when REDIS_URL is unset or Redis is unreachable.
 *
 * The withSlotLock / withBookingLock interface in route-helpers.ts stays
 * exactly the same — only the internal acquire/release changes.
 */
export interface LockStore {
  /**
   * Run `fn` while holding an exclusive lock on (scope, key).
   *
   * - `ttlMs`: how long the underlying Redis key lives if the holder dies
   *   (auto-release safety net). Must be >= the maximum expected fn() duration.
   * - `waitMs`: how long to wait to acquire the lock before rejecting with
   *   "Lock timeout". Bounds acquisition wait only; once the lock is held,
   *   `fn` runs to completion (TTL provides the safety net for crashes).
   */
  withLock<T>(scope: string, key: string, ttlMs: number, waitMs: number, fn: () => Promise<T>): Promise<T>;
  cleanup(): Promise<void>;
}

interface InMemoryEntry {
  chain: Promise<unknown>;
  ts: number;
  settled: boolean;
}

class InMemoryLockStore implements LockStore {
  private maps = new Map<string, Map<string, InMemoryEntry>>();

  private getMap(scope: string): Map<string, InMemoryEntry> {
    let m = this.maps.get(scope);
    if (!m) {
      m = new Map();
      this.maps.set(scope, m);
    }
    return m;
  }

  withLock<T>(scope: string, key: string, _ttlMs: number, waitMs: number, fn: () => Promise<T>): Promise<T> {
    const map = this.getMap(scope);
    const prev = map.get(key)?.chain ?? Promise.resolve();

    const run = new Promise<T>((resolve, reject) => {
      let acquired = false;
      const waitTimer = setTimeout(() => {
        if (!acquired) reject(new Error(`Lock timeout for ${scope}:${key}`));
      }, waitMs);
      prev.catch(() => {}).then(() => {
        // We hold the in-memory lock now; cancel the acquisition-wait timer.
        // fn() then runs to completion (no fn-duration timeout, matching the
        // Redis path semantics).
        acquired = true;
        clearTimeout(waitTimer);
        fn().then(resolve).catch(reject);
      });
    });

    const cleanup = run.then(() => {}, () => {});
    const entry: InMemoryEntry = { chain: cleanup, ts: Date.now(), settled: false };
    map.set(key, entry);
    cleanup.then(() => {
      entry.settled = true;
      if (map.get(key) === entry) map.delete(key);
    });
    return run;
  }

  async cleanup(): Promise<void> {
    const STALE_AGE = 5 * 60_000;
    const now = Date.now();
    evictExpired(this.maps.values(), (entry: InMemoryEntry) => entry.settled && now - entry.ts > STALE_AGE);
  }
}

const RELEASE_LUA = `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;

class RedisLockStore implements LockStore {
  private client: any;
  private fallback = new InMemoryLockStore();

  constructor(client: any) {
    this.client = client;
  }

  private async tryAcquire(redisKey: string, token: string, ttlMs: number, waitMs: number): Promise<boolean> {
    const deadline = Date.now() + waitMs;
    let attempt = 0;
    while (true) {
      const ok = await this.client.set(redisKey, token, "PX", ttlMs, "NX");
      if (ok === "OK") return true;
      const remaining = deadline - Date.now();
      if (remaining <= 0) return false;
      const backoff = Math.min(50 + attempt * 25, 200) + Math.floor(Math.random() * 25);
      await new Promise((r) => setTimeout(r, Math.min(backoff, remaining)));
      attempt++;
    }
  }

  private async release(redisKey: string, token: string): Promise<void> {
    try {
      await this.client.eval(RELEASE_LUA, 1, redisKey, token);
    } catch (err) {
      logger.warn(
        `[lock] Redis release failed for ${redisKey}: ${err instanceof Error ? err.message : String(err)}`,
        "lock",
      );
    }
  }

  async withLock<T>(scope: string, key: string, ttlMs: number, waitMs: number, fn: () => Promise<T>): Promise<T> {
    const redisKey = `lock:${scope}:${key}`;
    const token = randomUUID();

    let acquired = false;
    try {
      acquired = await this.tryAcquire(redisKey, token, ttlMs, waitMs);
    } catch (err) {
      logger.warn(
        `[lock] Redis acquire failed for ${redisKey} — falling back to in-memory lock: ${err instanceof Error ? err.message : String(err)}`,
        "lock",
      );
      return this.fallback.withLock(scope, key, ttlMs, waitMs, fn);
    }

    if (!acquired) {
      throw new Error(`Lock timeout for ${scope}:${key}`);
    }

    try {
      return await fn();
    } finally {
      await this.release(redisKey, token);
    }
  }

  async cleanup(): Promise<void> {
    await this.fallback.cleanup();
  }
}

let _store: LockStore | null = null;
let _initPromise: Promise<LockStore> | null = null;

export function getLockStore(): Promise<LockStore> {
  if (_store) return Promise.resolve(_store);
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
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
        _store = new RedisLockStore(client);
        logger.info("Locks: using Redis store", "lock");
        return _store;
      } catch (err) {
        logger.warn(
          `Redis connection failed — falling back to in-memory locks: ${err instanceof Error ? err.message : String(err)}`,
          "lock",
        );
      }
    }

    _store = new InMemoryLockStore();
    logger.info("Locks: using in-memory store", "lock");
    return _store;
  })();

  return _initPromise;
}
