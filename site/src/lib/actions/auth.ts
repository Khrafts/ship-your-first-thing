"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { getDb, schema } from "@/db";
import { AUTH_COPY } from "@/lib/copy";

export type AuthActionState = { error: string } | undefined;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return { error: "Enter your name." };
  }
  if (!EMAIL_SHAPE.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: AUTH_COPY.weakPassword };
  }

  const db = await getDb();
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
  if (existing) {
    return { error: AUTH_COPY.emailTaken };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(schema.users).values({ name, email, passwordHash });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: AUTH_COPY.invalidCredentials };
    }
    // Next.js signals redirects by throwing — anything that isn't an
    // AuthError (including NEXT_REDIRECT) must propagate.
    throw error;
  }
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
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: AUTH_COPY.invalidCredentials };
    }
    // Next.js signals redirects by throwing — anything that isn't an
    // AuthError (including NEXT_REDIRECT) must propagate.
    throw error;
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
