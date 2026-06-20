import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { consumeVerificationToken } from "@/lib/auth/verification-token";

// GET /verify-email?token=... — the link the confirmation email points at.
// A valid, unexpired, single-use token activates the account and bounces to
// the sign-in page with a success banner; anything else lands on sign-in with
// an error banner (where a Resend control is available).
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const email = await consumeVerificationToken(token);

  if (!email) {
    return NextResponse.redirect(
      new URL("/signin?error=verification", request.nextUrl.origin),
    );
  }

  const db = await getDb();
  await db
    .update(schema.users)
    .set({ emailVerified: new Date() })
    .where(eq(schema.users.email, email));

  return NextResponse.redirect(
    new URL("/signin?verified=1", request.nextUrl.origin),
  );
}
