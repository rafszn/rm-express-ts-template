export type CacheDriver = "memory" | "redis";
import cfg from "../../global/environment.config.js";

export const cacheConfig = {
  driver: (cfg.CACHE_DRIVER || "memory") as CacheDriver,
  redisUrl: cfg.REDIS_URL || "redis://localhost:6379",
};