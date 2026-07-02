import { Redis } from "ioredis";
import cfg from "../../../global/environment.config.js";

function createRedisClient(): Redis | null {
  if (!cfg.REDIS_URL) {
    console.warn("[Redis] REDIS_URL is not set. Redis client was not created.");
    return null;
  }

  const redis = new Redis(cfg.REDIS_URL, {
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
  });

  redis.on("connect", () => {
    console.info("[Redis] Connected.");
  });

  redis.on("ready", () => {
    console.info("[Redis] Ready.");
  });

  redis.on("error", (error) => {
    console.error("[Redis] Error:", error.message);
  });

  redis.on("close", () => {
    console.warn("[Redis] Connection closed.");
  });

  return redis;
}

export const redisClient = createRedisClient();
