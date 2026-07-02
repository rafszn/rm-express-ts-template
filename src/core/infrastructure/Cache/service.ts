import { cacheConfig } from "./config.js";
import { redisClient } from "../Redis/client.js";
import { CacheService } from "./contracts/cache.contract.js";
import { RedisCacheAdapterImpl } from "./adapters/redis-cache.adapter.js";
import { MemoryCacheAdapterImpl } from "./adapters/memory-cache.adapter.js";

function createCacheService(): CacheService {
  if (cacheConfig.driver === "redis") {
    if (!redisClient) {
      console.warn(
        "[Cache] CACHE_DRIVER is redis, but REDIS_URL is missing. Falling back to memory cache.",
      );
      return new MemoryCacheAdapterImpl();
    }
    return new RedisCacheAdapterImpl(redisClient);
  }
  return new MemoryCacheAdapterImpl();
}

export const cacheService = createCacheService();
