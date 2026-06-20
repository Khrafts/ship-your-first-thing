// Resolving the app's public origin so server code can build absolute links
// (e.g. the email-verification URL). Pure `baseUrlFrom` is unit-tested; the
// async wrapper reads the live request headers. `next/headers` is imported
// lazily so this module stays importable from plain Node (vitest).

/** Build the origin from request headers + env, with an explicit override
 *  taking precedence. A trailing slash on the override is stripped so callers
 *  can safely append `/verify-email?...`. */
export function baseUrlFrom(
  headersList: { get(name: string): string | null },
  env: Record<string, string | undefined>,
): string {
  const override = env.AUTH_URL || env.APP_URL;
  if (override) {
    return override.replace(/\/+$/, "");
  }
  // No trusted origin configured. This value is used to build the confirmation
  // link mailed to a user, so deriving it from the request Host header is a
  // verification-link-poisoning vector (a forged Host → the victim's email
  // points at an attacker domain → token theft → account takeover). Fail
  // closed in production: demand an explicit, operator-set origin. The header
  // fallback is for local dev / e2e only, where no real mail is sent.
  if (env.NODE_ENV === "production") {
    throw new Error(
      "APP_URL (or AUTH_URL) must be set in production so confirmation-email links use a trusted origin, not the request Host header.",
    );
  }
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

/** Request-scoped convenience: resolve the origin from the live headers. Only
 *  call inside a server action or route handler. */
export async function getBaseUrl(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  return baseUrlFrom(headersList, process.env);
}
