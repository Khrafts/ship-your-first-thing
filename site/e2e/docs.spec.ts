import { expect, test } from "@playwright/test";

// Root-level course docs render at /docs/<slug> (src/lib/content DOC_FILES).
// The page h1 comes from each doc's leading markdown h1.
test.describe("docs pages", () => {
  test("/docs/budget renders the BUDGET doc", async ({ page }) => {
    const response = await page.goto("/docs/budget");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Course costs, honestly",
    );
    // The rendered body mentions the three cost paths.
    await expect(page.locator(".prose")).toContainText("Path 1");
  });

  test("/docs/cheatsheet renders the cheatsheet doc", async ({ page }) => {
    const response = await page.goto("/docs/cheatsheet");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Cheatsheet" }),
    ).toBeVisible();
  });

  test("unknown doc slug 404s", async ({ page }) => {
    const response = await page.goto("/docs/not-a-doc");
    expect(response?.status()).toBe(404);
  });

  test("lesson links to BUDGET.md resolve to /docs/budget", async ({
    page,
  }) => {
    // The course's first lesson (publicly viewable) links BUDGET.md; the
    // markdown pipeline rewrites root-doc links onto /docs routes.
    await page.goto("/modules/00-welcome/01-welcome");
    const budgetLinks = page.locator('article a[href="/docs/budget"]');
    expect(await budgetLinks.count()).toBeGreaterThanOrEqual(1);
    await budgetLinks.first().click();
    await page.waitForURL("/docs/budget");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Course costs, honestly",
    );
  });
});
