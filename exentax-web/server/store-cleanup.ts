/**
 * Shared TTL / overflow eviction helpers used by the in-memory backends of
 * `lock-store.ts` and `rate-limit-store.ts`. Centralizes the eviction logic
 * so both stores share the same semantics.
 *
 *  - `evictExpired(maps, isExpired)` walks every nested map and removes any
 *    entry for which `isExpired(entry)` returns true. Returns the number of
 *    entries removed for callers that want to log it.
 *
 *  - `enforceMaxSize(map, maxEntries)` drops the oldest insertion-ordered
 *    entries when a single map exceeds `maxEntries`. Used to bound memory
 *    in burst scenarios. Returns the number of entries dropped.
 */

export function evictExpired<TEntry>(
  maps: Iterable<Map<string, TEntry>>,
  isExpired: (entry: TEntry) => boolean,
): number {
  let removed = 0;
  for (const map of maps) {
    for (const [key, entry] of map.entries()) {
      if (isExpired(entry)) {
        map.delete(key);
        removed++;
      }
    }
  }
  return removed;
}

export function enforceMaxSize<TEntry>(map: Map<string, TEntry>, maxEntries: number): number {
  if (map.size <= maxEntries) return 0;
  const overflow = map.size - maxEntries;
  let removed = 0;
  for (const key of map.keys()) {
    if (removed >= overflow) break;
    map.delete(key);
    removed++;
  }
  return removed;
}
