import { describe, expect, it } from "vitest";
import {
  TOKEN_TTL_MS,
  hashToken,
  isExpired,
  tokenExpiry,
} from "@/lib/auth/verification-token";

describe("hashToken", () => {
  it("is a deterministic 64-char hex SHA-256 digest", () => {
    const a = hashToken("some-raw-token");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken("some-raw-token")).toBe(a);
  });

  it("differs for different inputs (so the raw token is what's checked)", () => {
    expect(hashToken("token-a")).not.toBe(hashToken("token-b"));
  });
});

describe("token expiry", () => {
  it("computes an expiry TOKEN_TTL_MS after the given instant", () => {
    const now = new Date("2026-06-19T00:00:00.000Z");
    expect(tokenExpiry(now).getTime()).toBe(now.getTime() + TOKEN_TTL_MS);
  });

  it("treats an expiry strictly in the past as expired", () => {
    const now = new Date("2026-06-19T00:00:00.000Z");
    const past = new Date(now.getTime() - 1);
    const future = new Date(now.getTime() + 1);
    expect(isExpired(past, now)).toBe(true);
    expect(isExpired(future, now)).toBe(false);
  });
});
