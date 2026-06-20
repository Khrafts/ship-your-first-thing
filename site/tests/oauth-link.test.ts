import { describe, expect, it } from "vitest";
import {
  isAllowedProviderSignIn,
  shouldClearPlantedPassword,
} from "@/lib/auth/oauth-link";

describe("isAllowedProviderSignIn", () => {
  it("allows Google only when the profile reports a verified email", () => {
    expect(isAllowedProviderSignIn("google", { email_verified: true })).toBe(
      true,
    );
    expect(isAllowedProviderSignIn("google", { email_verified: false })).toBe(
      false,
    );
  });

  it("rejects Google when email_verified is missing or non-boolean-true", () => {
    expect(isAllowedProviderSignIn("google", {})).toBe(false);
    expect(isAllowedProviderSignIn("google", null)).toBe(false);
    expect(isAllowedProviderSignIn("google", undefined)).toBe(false);
    // A string "true" must not satisfy the strict boolean check.
    expect(isAllowedProviderSignIn("google", { email_verified: "true" })).toBe(
      false,
    );
  });

  it("passes through non-OAuth providers (credentials are gated elsewhere)", () => {
    expect(isAllowedProviderSignIn("credentials", undefined)).toBe(true);
    expect(isAllowedProviderSignIn(undefined, undefined)).toBe(true);
  });
});

describe("shouldClearPlantedPassword", () => {
  it("clears an unverified row's password (possible pre-registration hijack)", () => {
    expect(
      shouldClearPlantedPassword({ passwordHash: "hash", emailVerified: null }),
    ).toBe(true);
  });

  it("keeps the password of an already-verified row (owner-set, trusted)", () => {
    expect(
      shouldClearPlantedPassword({
        passwordHash: "hash",
        emailVerified: new Date(),
      }),
    ).toBe(false);
  });

  it("is a no-op for OAuth-only rows and missing rows", () => {
    expect(
      shouldClearPlantedPassword({ passwordHash: null, emailVerified: null }),
    ).toBe(false);
    expect(shouldClearPlantedPassword(null)).toBe(false);
    expect(shouldClearPlantedPassword(undefined)).toBe(false);
  });
});
