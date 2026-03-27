import { Request, Response, NextFunction } from "express";

type RateInfo = {
  count: number;
  windowStart: number;
};

const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

const rateMap = new Map<string, RateInfo>();

export function ipRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.headers["x-forwarded-for"]?.toString().split(",")[0] || "unknown";
  const key = `${req.path}:${ip}`;
  const now = Date.now();

  const existing = rateMap.get(key);
  if (!existing) {
    rateMap.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (now - existing.windowStart > WINDOW_MS) {
    rateMap.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (existing.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  existing.count += 1;
  rateMap.set(key, existing);
  next();
}
