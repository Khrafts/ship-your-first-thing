interface RateLimiterOptions {
  perMin: number;
  perDay: number;
  now?: () => number;
}

export interface RateDecision {
  ok: boolean;
  retryAfterSec?: number;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * 60_000;

/**
 * In-memory per-user sliding-window limiter. Single-instance only (fine at
 * current scale); OpenRouter's own 429 is the cross-instance backstop. Keeps a
 * timestamp list per user, pruned to the last day on each check.
 */
export function createRateLimiter({ perMin, perDay, now = () => Date.now() }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return {
    check(userId: string): RateDecision {
      const t = now();
      const recent = (hits.get(userId) ?? []).filter((ts) => t - ts < DAY);
      const inMinute = recent.filter((ts) => t - ts < MINUTE).length;
      const inDay = recent.length;

      if (inMinute >= perMin) {
        const oldestInWindow = recent.find((ts) => t - ts < MINUTE) ?? t;
        return { ok: false, retryAfterSec: Math.ceil((MINUTE - (t - oldestInWindow)) / 1000) };
      }
      if (inDay >= perDay) {
        return { ok: false, retryAfterSec: Math.ceil((DAY - (t - recent[0])) / 1000) };
      }
      recent.push(t);
      hits.set(userId, recent);
      return { ok: true };
    },
  };
}

function envInt(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

/** Process-wide singleton used by the route. */
export const chatRateLimiter = createRateLimiter({
  perMin: envInt("CHAT_RATE_PER_MIN", 10),
  perDay: envInt("CHAT_RATE_PER_DAY", 40),
});
