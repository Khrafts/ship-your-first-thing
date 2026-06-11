// Playwright global setup: reset the embedded e2e database to a known state.
//
// Ordering note (verified against Playwright 1.60 source): the webServer
// plugin starts BEFORE globalSetup runs. That is safe here because the
// production server opens its PGlite handle lazily — on the first request —
// and the readiness check for a `port`-based webServer is a plain TCP
// connect, not an HTTP request. So by the time any test sends a request, this
// setup has already wiped, migrated, and seeded the database the server will
// open. (Putting migrate/seed inside webServer.command would invert that:
// globalSetup would wipe the freshly seeded data.)

import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const SITE_DIR = path.resolve(__dirname, "..");
const E2E_DATA_DIR = path.join(SITE_DIR, ".data", "e2e");

// Same env contract as playwright.config.ts webServer.env: an empty
// DATABASE_URL selects the embedded PGlite driver.
const DB_ENV = {
  ...process.env,
  DATABASE_URL: "",
  PGLITE_DATA_DIR: ".data/e2e",
};

export default async function globalSetup(): Promise<void> {
  rmSync(E2E_DATA_DIR, { recursive: true, force: true });
  execFileSync("pnpm", ["db:migrate"], { cwd: SITE_DIR, env: DB_ENV, stdio: "inherit" });
  execFileSync("pnpm", ["db:seed"], { cwd: SITE_DIR, env: DB_ENV, stdio: "inherit" });
}
