import { NextResponse } from "next/server";
import { getOutbox } from "@/lib/email/outbox";

// Test-only window into the captured email outbox, so the Playwright suite can
// read the verification link the server "sent". Gated on an explicit
// EMAIL_TEST_OUTBOX=1 flag (set in playwright.config.ts, never on Railway) so
// it is a hard 404 in production regardless of NODE_ENV — the e2e suite runs a
// production build, so a NODE_ENV gate wouldn't work here.
export function GET(): NextResponse {
  if (process.env.EMAIL_TEST_OUTBOX !== "1") {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json({ emails: getOutbox() });
}
