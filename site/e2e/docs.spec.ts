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

  test("relative reference links resolve to their rendered doc routes", async ({ page }) => {
    await page.goto("/docs/setup");
    const link = page.locator('.prose a[href="/docs/versions"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL("/docs/versions");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Pinned tool versions");
  });
});
