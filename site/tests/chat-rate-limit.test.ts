import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/chat/rate-limit";

describe("rate limiter", () => {
  it("allows up to perMin requests then blocks within the minute", () => {
    const t = 1_000_000;
    const rl = createRateLimiter({ perMin: 2, perDay: 100, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    expect(rl.check("u").ok).toBe(true);
    const blocked = rl.check("u");
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("recovers after the minute window passes", () => {
    let t = 0;
    const rl = createRateLimiter({ perMin: 1, perDay: 100, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    expect(rl.check("u").ok).toBe(false);
    t += 61_000;
    expect(rl.check("u").ok).toBe(true);
  });

  it("enforces the daily cap independently of the minute cap", () => {
    let t = 0;
    const rl = createRateLimiter({ perMin: 100, perDay: 2, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    t += 2_000;
    expect(rl.check("u").ok).toBe(true);
    t += 2_000;
    expect(rl.check("u").ok).toBe(false);
  });

  it("tracks users independently", () => {
    const t = 0;
    const rl = createRateLimiter({ perMin: 1, perDay: 10, now: () => t });
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("b").ok).toBe(true);
  });
});
