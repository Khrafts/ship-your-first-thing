import { defineConfig, devices } from "@playwright/test";

// The e2e suite runs against a production build backed by an embedded PGlite
// database (no DATABASE_URL), so it needs no external services. Run
// `pnpm e2e:full` to build + test, or `pnpm e2e` after a manual build.
//
// Playwright starts the webServer plugin BEFORE globalSetup runs, so the
// database reset (wipe + migrate + seed) lives in e2e/global-setup.ts and the
// webServer command only starts the already-built server. That is safe
// because the server opens its PGlite handle lazily, on the first request —
// see e2e/global-setup.ts for the full ordering note.
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } },
    },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: "",
      PGLITE_DATA_DIR: ".data/e2e",
      AUTH_SECRET: "e2e-test-secret-not-for-production",
      AUTH_TRUST_HOST: "true",
      // No SMTP_HOST → mail is captured to the in-memory outbox; this flag
      // exposes /api/test/outbox so the suite can read the verification link.
      EMAIL_TEST_OUTBOX: "1",
    },
  },
});
