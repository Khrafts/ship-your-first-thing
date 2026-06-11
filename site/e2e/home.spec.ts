import { expect, test } from "@playwright/test";
import { FOOTER_STACK_DIVERGENCE, TAGLINE } from "../src/lib/copy";

test.describe("home page", () => {
  test("hero shows the title and the real tagline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ship your first thing",
    );
    await expect(page.getByText(TAGLINE, { exact: true })).toBeVisible();
  });

  test("curriculum lists live module cards and upcoming placeholders", async ({
    page,
  }) => {
    await page.goto("/");

    // Live modules link to /modules/<slug>; the hero CTA (href="/modules")
    // does not match this prefix.
    const moduleLinks = page.locator('a[href^="/modules/"]');
    expect(await moduleLinks.count()).toBeGreaterThanOrEqual(5);

    // The home page renders the upcoming label lowercase ("coming later").
    await expect(page.getByText("coming later", { exact: true })).toHaveCount(4);
  });

  test("footer carries the locked stack-divergence line", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText(FOOTER_STACK_DIVERGENCE);
  });

  test("hero CTA navigates to the modules index", async ({ page }) => {
    await page.goto("/");
    // The home page's modules CTA reads "Start the course →" (there is no
    // "Browse the modules" control anywhere in the app).
    await page.getByRole("link", { name: "Start the course →" }).click();
    await page.waitForURL("/modules");
    await expect(
      page.getByRole("heading", { level: 1, name: "Modules" }),
    ).toBeVisible();
  });
});
