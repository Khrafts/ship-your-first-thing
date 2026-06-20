import { describe, expect, it } from "vitest";
import { baseUrlFrom } from "@/lib/auth/base-url";

/** Minimal Headers-like stand-in: only `.get` is used by baseUrlFrom. */
function headers(map: Record<string, string>): { get(name: string): string | null } {
  const lower = new Map(
    Object.entries(map).map(([k, v]) => [k.toLowerCase(), v]),
  );
  return { get: (name) => lower.get(name.toLowerCase()) ?? null };
}

describe("baseUrlFrom", () => {
  it("prefers an explicit AUTH_URL override and strips a trailing slash", () => {
    const url = baseUrlFrom(headers({ host: "ignored.example" }), {
      AUTH_URL: "https://shipyourfirstthing.com/",
    });
    expect(url).toBe("https://shipyourfirstthing.com");
  });

  it("falls back to APP_URL when AUTH_URL is absent", () => {
    const url = baseUrlFrom(headers({ host: "ignored.example" }), {
      APP_URL: "https://app.example.com",
    });
    expect(url).toBe("https://app.example.com");
  });

  it("builds from forwarded proto + host behind a proxy", () => {
    const url = baseUrlFrom(
      headers({ "x-forwarded-proto": "https", host: "shipyourfirstthing.com" }),
      {},
    );
    expect(url).toBe("https://shipyourfirstthing.com");
  });

  it("defaults to http and localhost when nothing is present (dev)", () => {
    const url = baseUrlFrom(headers({}), {});
    expect(url).toBe("http://localhost:3000");
  });

  it("refuses to trust the request Host in production (poisoning guard)", () => {
    expect(() =>
      baseUrlFrom(headers({ host: "attacker.example" }), {
        NODE_ENV: "production",
      }),
    ).toThrow(/APP_URL/);
  });

  it("in production, uses the explicit override and ignores the Host", () => {
    const url = baseUrlFrom(headers({ host: "attacker.example" }), {
      NODE_ENV: "production",
      APP_URL: "https://shipyourfirstthing.com",
    });
    expect(url).toBe("https://shipyourfirstthing.com");
  });
});
