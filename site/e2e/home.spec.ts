import { expect, test } from "@playwright/test";
import { FOOTER_STACK_DIVERGENCE, TAGLINE } from "../src/lib/copy";

test.describe("home page", () => {
  test("hero shows the title and the real tagline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ship your first thing",
    );
    // Scoped to main: the footer repeats the tagline at desktop widths.
    await expect(
      page.locator("#main").getByText(TAGLINE, { exact: true }),
    ).toBeVisible();
  });

  test("curriculum lists live module cards and upcoming placeholders", async ({
    page,
  }) => {
    await page.goto("/");

    // Live modules link to /modules/<slug> (the hero CTA also matches, since
    // it points at Module 0).
    const moduleLinks = page.locator('a[href^="/modules/"]');
    expect(await moduleLinks.count()).toBeGreaterThanOrEqual(8);

    // Every module ships, so no "coming later" placeholder renders.
    await expect(page.getByText("coming later", { exact: true })).toHaveCount(0);
  });

  test("footer carries the locked stack-divergence line", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText(FOOTER_STACK_DIVERGENCE);
  });

  test("hero CTA navigates to Module 0 (the build-first entry)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Start — build your first thing →" }).click();
    await page.waitForURL("/modules/00-welcome");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome");
  });
});
