import {
  createCacheEntry,
  isCacheValid,
  getCacheValue,
  setCacheValue,
  clearCacheEntries,
  cleanupExpiredCache,
  DEFAULT_CACHE_EXPIRATION,
} from "../cache.utils";
import type { CacheEntry } from "../../types/state.types";

describe("Cache Utils", () => {
  describe("createCacheEntry", () => {
    it("should create a cache entry with default TTL", () => {
      const data = { test: "value" };
      const entry = createCacheEntry(data);

      expect(entry.data).toEqual(data);
      expect(entry.timestamp).toBeDefined();
      expect(entry.expiresAt).toBe(entry.timestamp + DEFAULT_CACHE_EXPIRATION);
    });

    it("should create a cache entry with custom TTL", () => {
      const data = "test";
      const ttl = 10000;
      const entry = createCacheEntry(data, ttl);

      expect(entry.data).toBe(data);
      expect(entry.expiresAt).toBe(entry.timestamp + ttl);
    });

    it("should create cache entries with increasing timestamps", () => {
      const entry1 = createCacheEntry("first");
      const entry2 = createCacheEntry("second");

      expect(entry2.timestamp).toBeGreaterThanOrEqual(entry1.timestamp);
    });
  });

  describe("isCacheValid", () => {
    it("should return true for non-expired entry", () => {
      const entry: CacheEntry<string> = {
        data: "test",
        timestamp: Date.now(),
        expiresAt: Date.now() + 10000,
      };

      expect(isCacheValid(entry)).toBe(true);
    });

    it("should return false for expired entry", () => {
      const entry: CacheEntry<string> = {
        data: "test",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 1000,
      };

      expect(isCacheValid(entry)).toBe(false);
    });

    it("should return false for entry expiring exactly now", () => {
      const now = Date.now();
      const entry: CacheEntry<string> = {
        data: "test",
        timestamp: now - 1000,
        expiresAt: now,
      };

      expect(isCacheValid(entry)).toBe(false);
    });
  });

  describe("getCacheValue", () => {
    let cache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
      cache = new Map();
    });

    it("should return null for non-existent key", () => {
      const result = getCacheValue<string>(cache, "nonexistent");
      expect(result).toBeNull();
    });

    it("should return cached value for valid entry", () => {
      const data = { test: "value" };
      const entry = createCacheEntry(data, 10000);
      cache.set("test-key", entry);

      const result = getCacheValue<typeof data>(cache, "test-key");
      expect(result).toEqual(data);
    });

    it("should return null and remove expired entry", () => {
      const entry: CacheEntry<string> = {
        data: "test",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 1000,
      };
      cache.set("expired-key", entry);

      const result = getCacheValue<string>(cache, "expired-key");
      expect(result).toBeNull();
      expect(cache.has("expired-key")).toBe(false);
    });

    it("should handle different data types", () => {
      const numberEntry = createCacheEntry(42);
      const stringEntry = createCacheEntry("hello");
      const arrayEntry = createCacheEntry([1, 2, 3]);
      const objectEntry = createCacheEntry({ key: "value" });

      cache.set("number", numberEntry);
      cache.set("string", stringEntry);
      cache.set("array", arrayEntry);
      cache.set("object", objectEntry);

      expect(getCacheValue<number>(cache, "number")).toBe(42);
      expect(getCacheValue<string>(cache, "string")).toBe("hello");
      expect(getCacheValue<number[]>(cache, "array")).toEqual([1, 2, 3]);
      expect(getCacheValue<{ key: string }>(cache, "object")).toEqual({
        key: "value",
      });
    });
  });

  describe("setCacheValue", () => {
    let cache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
      cache = new Map();
    });

    it("should set cache value with default TTL", () => {
      setCacheValue(cache, "test-key", "test-value");

      expect(cache.has("test-key")).toBe(true);
      const entry = cache.get("test-key") as CacheEntry<string>;
      expect(entry.data).toBe("test-value");
      expect(entry.expiresAt).toBe(entry.timestamp + DEFAULT_CACHE_EXPIRATION);
    });

    it("should set cache value with custom TTL", () => {
      const ttl = 5000;
      setCacheValue(cache, "test-key", "test-value", ttl);

      const entry = cache.get("test-key") as CacheEntry<string>;
      expect(entry.expiresAt).toBe(entry.timestamp + ttl);
    });

    it("should overwrite existing cache entry", () => {
      setCacheValue(cache, "key", "old-value");
      setCacheValue(cache, "key", "new-value");

      const result = getCacheValue<string>(cache, "key");
      expect(result).toBe("new-value");
    });

    it("should cache complex objects", () => {
      const complexData = {
        id: 1,
        name: "Test",
        nested: { value: "nested" },
        array: [1, 2, 3],
      };

      setCacheValue(cache, "complex", complexData);
      const result = getCacheValue<typeof complexData>(cache, "complex");
      expect(result).toEqual(complexData);
    });
  });

  describe("clearCacheEntries", () => {
    let cache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
      cache = new Map();
      setCacheValue(cache, "key1", "value1");
      setCacheValue(cache, "key2", "value2");
      setCacheValue(cache, "key3", "value3");
    });

    it("should clear specific cache entry", () => {
      clearCacheEntries(cache, "key1");

      expect(cache.has("key1")).toBe(false);
      expect(cache.has("key2")).toBe(true);
      expect(cache.has("key3")).toBe(true);
    });

    it("should clear all cache entries when no key provided", () => {
      clearCacheEntries(cache);

      expect(cache.size).toBe(0);
    });

    it("should not throw error for non-existent key", () => {
      expect(() => clearCacheEntries(cache, "nonexistent")).not.toThrow();
    });

    it("should handle clearing already empty cache", () => {
      const emptyCache = new Map();
      clearCacheEntries(emptyCache);

      expect(emptyCache.size).toBe(0);
    });
  });

  describe("cleanupExpiredCache", () => {
    let cache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
      cache = new Map();
    });

    it("should remove only expired entries", () => {
      // Add valid entry
      const validEntry = createCacheEntry("valid", 10000);
      cache.set("valid", validEntry);

      // Add expired entries
      const expiredEntry1: CacheEntry<string> = {
        data: "expired1",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 5000,
      };
      const expiredEntry2: CacheEntry<string> = {
        data: "expired2",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 1,
      };
      cache.set("expired1", expiredEntry1);
      cache.set("expired2", expiredEntry2);

      cleanupExpiredCache(cache);

      expect(cache.has("valid")).toBe(true);
      expect(cache.has("expired1")).toBe(false);
      expect(cache.has("expired2")).toBe(false);
      expect(cache.size).toBe(1);
    });

    it("should not remove any entries if all are valid", () => {
      setCacheValue(cache, "key1", "value1", 10000);
      setCacheValue(cache, "key2", "value2", 10000);
      setCacheValue(cache, "key3", "value3", 10000);

      cleanupExpiredCache(cache);

      expect(cache.size).toBe(3);
    });

    it("should remove all entries if all are expired", () => {
      const expiredEntry1: CacheEntry<string> = {
        data: "expired1",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 5000,
      };
      const expiredEntry2: CacheEntry<string> = {
        data: "expired2",
        timestamp: Date.now() - 10000,
        expiresAt: Date.now() - 1000,
      };
      cache.set("expired1", expiredEntry1);
      cache.set("expired2", expiredEntry2);

      cleanupExpiredCache(cache);

      expect(cache.size).toBe(0);
    });

    it("should handle empty cache", () => {
      cleanupExpiredCache(cache);

      expect(cache.size).toBe(0);
    });
  });

  describe("Integration tests", () => {
    let cache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
      cache = new Map();
    });

    it("should handle typical cache workflow", () => {
      // Set values
      setCacheValue(cache, "user1", { name: "Alice" });
      setCacheValue(cache, "user2", { name: "Bob" });

      // Get values
      expect(getCacheValue(cache, "user1")).toEqual({ name: "Alice" });
      expect(getCacheValue(cache, "user2")).toEqual({ name: "Bob" });

      // Clear specific entry
      clearCacheEntries(cache, "user1");
      expect(getCacheValue(cache, "user1")).toBeNull();
      expect(getCacheValue(cache, "user2")).toEqual({ name: "Bob" });

      // Clear all
      clearCacheEntries(cache);
      expect(cache.size).toBe(0);
    });

    it("should auto-cleanup expired entries on access", () => {
      // Set entry with very short TTL
      const shortLivedEntry: CacheEntry<string> = {
        data: "short-lived",
        timestamp: Date.now() - 100,
        expiresAt: Date.now() - 1,
      };
      cache.set("short-lived", shortLivedEntry);

      // Set long-lived entry
      setCacheValue(cache, "long-lived", "value", 10000);

      // Accessing expired entry should remove it
      expect(getCacheValue(cache, "short-lived")).toBeNull();
      expect(cache.has("short-lived")).toBe(false);

      // Long-lived entry should still exist
      expect(getCacheValue(cache, "long-lived")).toBe("value");
      expect(cache.size).toBe(1);
    });
  });
});
