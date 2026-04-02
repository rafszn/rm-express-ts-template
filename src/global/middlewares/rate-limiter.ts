import {
  Options,
  rateLimit,
  ipKeyGenerator,
  RateLimitRequestHandler,
} from "express-rate-limit";
import { HTTP_STATUS } from "../constants/http-status-codes.js";

const createRateLimiter = ({
  max,
  skip,
  message,
  windowMs,
  keyGenerator,
  keyPrefix = "rl",
}: CreateRateLimiterOptions): RateLimitRequestHandler => {
  return rateLimit({
    max,
    windowMs,
    legacyHeaders: false,
    standardHeaders: true,
    skip: skip ?? (() => false),
    keyGenerator:
      keyGenerator ?? ((req) => `${keyPrefix}:${ipKeyGenerator(req.ip ?? "")}`),

    handler: (_req, res) => {
      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: message ?? "Too many requests. Please try again later.",
      });
    },
  } as Partial<Options>);
};

const globalRateLimiter = createRateLimiter({
  max: 100,
  keyPrefix: "global",
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
});

const authRateLimiter = createRateLimiter({
  max: 10,
  keyPrefix: "auth",
  windowMs: 15 * 60 * 1000,
  message: "Too many auth attempts.",
});

const sensitiveRateLimiter = createRateLimiter({
  max: 30,
  keyPrefix: "sensitive",
  windowMs: 10 * 60 * 1000,
  message: "Too many requests on this route. Please try again shortly.",
});

const publicRateLimiter = createRateLimiter({
  max: 200,
  keyPrefix: "public",
  windowMs: 10 * 60 * 1000,
  message: "Too many requests. Please slow down.",
});

export {
  authRateLimiter,
  createRateLimiter,
  globalRateLimiter,
  publicRateLimiter,
  sensitiveRateLimiter,
};
