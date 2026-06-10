import { defineConfig, devices } from "@playwright/test";

// The e2e suite runs against a production build backed by an embedded PGlite
// database (no DATABASE_URL), so it needs no external services. Run
// `pnpm e2e:full` to build + test, or `pnpm e2e` after a manual build.
// global-setup wipes the e2e database; the webServer command then migrates,
// seeds, and starts the server sequentially (PGlite is single-process).
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
    command: `pnpm db:migrate && pnpm db:seed && pnpm start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: "",
      PGLITE_DATA_DIR: ".data/e2e",
      AUTH_SECRET: "e2e-test-secret-not-for-production",
      AUTH_TRUST_HOST: "true",
    },
  },
});
