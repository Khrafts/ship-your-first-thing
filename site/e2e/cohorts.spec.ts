import { expect, test } from "@playwright/test";
import { signUp, uniqueEmail } from "./helpers";

// Server-action round trips re-render the page; give them room.
const ACTION_TIMEOUT = 15_000;

test.describe("cohorts", () => {
  test("shows Cohort 1 with a 5-week schedule and a signed-out join prompt", async ({
    page,
  }) => {
    await page.goto("/cohorts");
    await expect(page.getByRole("heading", { name: "Cohort 1" })).toBeVisible();

    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(5);
    for (let week = 1; week <= 5; week += 1) {
      await expect(rows.nth(week - 1).locator("td").first()).toHaveText(
        String(week),
      );
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
