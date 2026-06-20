// Pure decision helpers for the OAuth sign-in / account-linking security
// controls, kept separate from auth.ts so they can be unit-tested without
// standing up Auth.js. Both encode guarantees the auto-linking design depends
// on but that Auth.js does NOT enforce on its own.

/**
 * Whether an OAuth sign-in may proceed. The account-linking design is only safe
 * because the provider has verified the email it asserts — so enforce that,
 * don't assume it. Google must report email_verified === true; non-OAuth
 * providers (credentials) are gated elsewhere and pass here.
 */
export function isAllowedProviderSignIn(
  provider: string | undefined,
  profile: unknown,
): boolean {
  if (provider === "google") {
    return (
      (profile as { email_verified?: unknown } | null | undefined)
        ?.email_verified === true
    );
  }
  return true;
}

/**
 * Whether to drop a row's password when an OAuth account links to it. A
 * password on a NOT-yet-verified row is untrusted: it may have been planted by
 * someone who never proved ownership of the email (pre-registration hijack).
 * Linking proves the provider owns the email, so activate the account but
 * invalidate the unproven password. A password on an already-verified row was
 * set by the confirmed owner and is kept.
 */
export function shouldClearPlantedPassword(
  existing:
    | { passwordHash: string | null; emailVerified: Date | null }
    | null
    | undefined,
): boolean {
  return (
    !!existing && existing.passwordHash != null && existing.emailVerified == null
  );
}
