"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { getDb, schema } from "@/db";
import { AUTH_COPY } from "@/lib/copy";
import { getBaseUrl } from "@/lib/auth/base-url";
import { verifyCredentials } from "@/lib/auth/credentials";
import { issueVerificationToken } from "@/lib/auth/verification-token";
import { sendVerificationEmail } from "@/lib/email/send";

// Form-action results. `undefined` is the idle/just-redirected state. The
// status discriminant drives which panel the form renders.
export type AuthActionState =
  | { status: "error"; message: string }
  | { status: "checkEmail"; email: string }
  | { status: "needsVerification"; email: string }
  | { status: "resent" }
  | undefined;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mint a token, build the absolute link, and send the confirmation email. */
async function sendConfirmation(email: string): Promise<void> {
  const token = await issueVerificationToken(email);
  const base = await getBaseUrl();
  const url = `${base}/verify-email?token=${encodeURIComponent(token)}`;
  await sendVerificationEmail(email, url);
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length === 0) {
    return { status: "error", message: "Enter your name." };
  }
  if (!EMAIL_SHAPE.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { status: "error", message: AUTH_COPY.weakPassword };
  }

  const db = await getDb();
  // Fast path: skip the bcrypt work when the email is already taken. The
  // insert below is still the authoritative check — two concurrent signups
  // can both pass this read. (An unverified account recovers via the
  // sign-in page's resend prompt, not by signing up again — which is why a
  // repeat signup deliberately can't reset the existing password.)
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
  if (existing) {
    return { status: "error", message: AUTH_COPY.emailTaken };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // emailVerified stays null: the account is inactive until the link is clicked.
  const inserted = await db
    .insert(schema.users)
    .values({ name, email, passwordHash })
    .onConflictDoNothing({ target: schema.users.email })
    .returning({ id: schema.users.id });
  if (inserted.length === 0) {
    return { status: "error", message: AUTH_COPY.emailTaken };
  }

  await sendConfirmation(email);
  return { status: "checkEmail", email };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      // authorize() returns null for BOTH wrong-password and unverified.
      // Recompute (failure path only) to tell the learner which it was.
      const check = await verifyCredentials(email, password);
      if (check.ok && !check.verified) {
        return { status: "needsVerification", email };
      }
      return { status: "error", message: AUTH_COPY.invalidCredentials };
    }
    // Next.js signals redirects by throwing — anything that isn't an
    // AuthError (including NEXT_REDIRECT) must propagate.
    throw error;
  }
}

export async function resendVerificationAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (EMAIL_SHAPE.test(email)) {
    const db = await getDb();
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    if (user && user.emailVerified == null) {
      await sendConfirmation(email);
    }
  }

  // Always the same result — never reveal whether the email exists or its
  // verification state (account-enumeration defense).
  return { status: "resent" };
}

export async function signInWithGoogleAction(): Promise<void> {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
