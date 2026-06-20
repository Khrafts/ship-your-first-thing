import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

// Email-verification tokens, stored in the Auth.js `verificationToken` table.
// Only the SHA-256 HASH of the token is persisted — the raw token lives solely
// in the email link. A leaked database read therefore can't be replayed into a
// valid confirmation. `identifier` is the (lowercased) email.

export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function tokenExpiry(now: Date): Date {
  return new Date(now.getTime() + TOKEN_TTL_MS);
}

/** A token whose expiry is at or before `now` is expired. */
export function isExpired(expires: Date, now: Date): boolean {
  return expires.getTime() <= now.getTime();
}

export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Issue a fresh token for `email`, returning the RAW token for the link.
 *  Clears any prior tokens for the same email so an older link stops working. */
export async function issueVerificationToken(email: string): Promise<string> {
  const identifier = email.trim().toLowerCase();
  await clearTokensFor(identifier);
  const db = await getDb();
  const raw = generateRawToken();
  await db.insert(schema.verificationTokens).values({
    identifier,
    token: hashToken(raw),
    expires: tokenExpiry(new Date()),
  });
  return raw;
}

/** Validate a raw token. On a match the row is deleted (single-use, even when
 *  expired) and the email is returned; otherwise null. */
export async function consumeVerificationToken(raw: string): Promise<string | null> {
  if (!raw) return null;
  const db = await getDb();
  const tokenHash = hashToken(raw);
  const row = await db.query.verificationTokens.findFirst({
    where: eq(schema.verificationTokens.token, tokenHash),
  });
  if (!row) return null;
  await db
    .delete(schema.verificationTokens)
    .where(eq(schema.verificationTokens.token, tokenHash));
  if (isExpired(row.expires, new Date())) return null;
  return row.identifier;
}

export async function clearTokensFor(email: string): Promise<void> {
  const db = await getDb();
  await db
    .delete(schema.verificationTokens)
    .where(eq(schema.verificationTokens.identifier, email.trim().toLowerCase()));
}
