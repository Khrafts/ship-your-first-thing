import { expect, test } from "@playwright/test";
import { signUp, uniqueEmail } from "./helpers";

// Server-action round trips re-render the page; give them room.
const ACTION_TIMEOUT = 15_000;

// Session titles in week order, mirroring scripts/seed.ts SESSIONS.
const SEEDED_SESSIONS = [
  "Module 0 — Welcome & setup",
  "Module 1 — How software works",
  "Module 2 — Your agent and the machinery it drives",
  "Module 3 — The loop in depth",
];

test.describe("cohorts", () => {
  test("shows Cohort 1 with the seeded 4-week schedule and a signed-out join prompt", async ({
    page,
  }) => {
    await page.goto("/cohorts");
    await expect(page.getByRole("heading", { name: "Cohort 1" })).toBeVisible();

    // One row per session in scripts/seed.ts SESSIONS (Modules 0–3; the
    // Module 3.5 week was retired with the module). Keep in step with the seed.
    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(SEEDED_SESSIONS.length);
    for (const [i, title] of SEEDED_SESSIONS.entries()) {
      const cells = rows.nth(i).locator("td");
      await expect(cells.nth(0)).toHaveText(String(i + 1));
      await expect(cells.nth(1)).toHaveText(title);
    }

    // Signed-out join control: "Sign in to join this cohort." with the
    // "Sign in" rendered as a link.
    const joinPrompt = page.getByText(/to join this cohort/);
    await expect(joinPrompt).toBeVisible();
    await expect(
      joinPrompt.getByRole("link", { name: "Sign in" }),
    ).toBeVisible();
  });

  test("join and leave a cohort, dashboard reflects membership", async ({
    page,
  }) => {
    const email = uniqueEmail("cohort");
    await signUp(page, {
      name: "Cohort Joiner",
      email,
      password: "cohort-pass-1",
    });

    // Join: membership is confirmed in text and by the "Leave cohort" control.
    await page.goto("/cohorts");
    await page.getByRole("button", { name: "Join cohort" }).click();
    await expect(page.getByText("You're in this cohort.")).toBeVisible({
      timeout: ACTION_TIMEOUT,
    });
    await expect(
      page.getByRole("button", { name: "Leave cohort" }),
    ).toBeVisible();

    // Dashboard shows the cohort name, start date, and next upcoming call.
    await page.goto("/dashboard");
    const cohortCard = page.locator('a[href="/cohorts"]', {
      hasText: "Cohort 1",
    });
    await expect(cohortCard).toBeVisible();
    await expect(cohortCard).toContainText(/starts/);
    await expect(page.getByText(/Next call:/)).toBeVisible();

    // Leave reverts to the join state.
    await page.goto("/cohorts");
    await page.getByRole("button", { name: "Leave cohort" }).click();
    await expect(
      page.getByRole("button", { name: "Join cohort" }),
    ).toBeVisible({ timeout: ACTION_TIMEOUT });
  });
});
