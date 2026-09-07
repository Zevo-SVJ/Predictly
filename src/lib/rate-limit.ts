import "server-only";

import {
  ANON_FORECASTS_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
  USER_FORECASTS_PER_WINDOW,
} from "./config";

/**
 * In-process sliding-window limiter.
 *
 * Deliberately simple: forecasting is the only expensive endpoint, and this is
 * enough to stop casual abuse of a single instance. The interface is the part
 * that matters — swapping in Redis or Upstash later means replacing `hit`
 * without touching callers.
 */
const globalForLimiter = globalThis as unknown as {
  __predictlyRateLimit?: Map<string, number[]>;
};
const hits = (globalForLimiter.__predictlyRateLimit ??= new Map<string, number[]>());

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix ms when the oldest hit in the window expires. */
  resetAt: number;
}

export function checkRateLimit(key: string, isAuthenticated: boolean): RateLimitResult {
  const limit = isAuthenticated ? USER_FORECASTS_PER_WINDOW : ANON_FORECASTS_PER_WINDOW;
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  const recent = (hits.get(key) ?? []).filter((time) => time > cutoff);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, remaining: 0, resetAt: (recent[0] ?? now) + RATE_LIMIT_WINDOW_MS };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [existingKey, times] of hits) {
      if (times.every((time) => time <= cutoff)) hits.delete(existingKey);
    }
  }

  return { allowed: true, remaining: limit - recent.length, resetAt: now + RATE_LIMIT_WINDOW_MS };
}

/** Best-effort client identity from proxy headers, falling back to a shared bucket. */
export function clientKey(headers: Headers, userId: string | null): string {
  if (userId) return `user:${userId}`;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = headers.get("x-real-ip")?.trim();
  return `ip:${forwarded || real || "unknown"}`;
}
