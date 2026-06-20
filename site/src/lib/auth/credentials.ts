import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

// Single source of truth for password verification, used by BOTH the Auth.js
// `authorize` callback (which refuses unverified accounts) and `signInAction`
// (which inspects the result to choose between the wrong-password message and
// the confirm-your-email prompt). Keeping the bcrypt comparison in one place
// means the two call sites can never drift apart.

export interface CredentialCheck {
  /** Present only when email exists AND the password matches. */
  user: { id: string; email: string; name: string | null } | null;
  /** Email exists and password matches. */
  ok: boolean;
  /** The matched user's email has been confirmed. Meaningful only when ok. */
  verified: boolean;
}

const FAILED: CredentialCheck = { user: null, ok: false, verified: false };

export async function verifyCredentials(
  rawEmail: string,
  password: string,
): Promise<CredentialCheck> {
  const email = rawEmail.trim().toLowerCase();
  if (email.length === 0 || password.length === 0) {
    return FAILED;
  }

  const db = await getDb();
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
  if (!user || !user.passwordHash) {
    return FAILED;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return FAILED;
  }

  return {
    user: { id: user.id, email: user.email, name: user.name },
    ok: true,
    verified: user.emailVerified != null,
  };
}
