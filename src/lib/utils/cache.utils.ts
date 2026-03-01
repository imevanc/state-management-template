import type { CacheEntry } from "../types/state.types";

/**
 * Cache utility functions for the state management system
 */

export const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

/**
 * Create a new cache entry with expiration
 */
export function createCacheEntry<T>(
  data: T,
  ttl: number = DEFAULT_CACHE_EXPIRATION,
): CacheEntry<T> {
  const timestamp = Date.now();
  return {
    data,
    timestamp,
    expiresAt: timestamp + ttl,
  };
}

/**
 * Check if a cache entry is still valid
 */
export function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() < entry.expiresAt;
}

/**
 * Get value from cache if valid, otherwise return null
 */
export function getCacheValue<T>(
  cache: Map<string, CacheEntry<unknown>>,
  key: string,
): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    return null;
  }

  if (!isCacheValid(entry)) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Set value in cache with optional TTL
 */
export function setCacheValue<T>(
  cache: Map<string, CacheEntry<unknown>>,
  key: string,
  value: T,
  ttl: number = DEFAULT_CACHE_EXPIRATION,
): void {
  const entry = createCacheEntry(value, ttl);
  cache.set(key, entry);
}

/**
 * Clear cache entries (specific key or all)
 */
export function clearCacheEntries(
  cache: Map<string, CacheEntry<unknown>>,
  key?: string,
): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredCache(
  cache: Map<string, CacheEntry<unknown>>,
): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
    }
  }
}
