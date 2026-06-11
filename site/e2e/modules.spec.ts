import { expect, test } from "@playwright/test";

test.describe("modules index", () => {
  test("shows 5 live module cards and 4 upcoming rows", async ({ page }) => {
    await page.goto("/modules");
    await expect(
      page.getByRole("heading", { level: 1, name: "Modules" }),
    ).toBeVisible();

    // First <ol> is the live module list; each card is a link.
    const liveCards = page.locator("ol").first().locator('a[href^="/modules/"]');
    await expect(liveCards).toHaveCount(5);

    await expect(
      page.getByRole("heading", { name: "Coming later" }),
    ).toBeVisible();
    // Second <ol> holds the upcoming (non-linked) modules.
    await expect(page.locator("ol").nth(1).locator("li")).toHaveCount(4);
  });
});

test.describe("module detail", () => {
  test("01-mental-models lists exactly 4 lesson rows with minute counts", async ({
    page,
  }) => {
    await page.goto("/modules/01-mental-models");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How software works",
    );

    // The lessons <ol> renders before the module README prose.
    const lessonRows = page.locator("ol").first().locator("a");
    await expect(lessonRows).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(lessonRows.nth(i)).toContainText(/\d+ min/);
    }
  });

  test("clicking a lesson row navigates to the lesson", async ({ page }) => {
    await page.goto("/modules/01-mental-models");
    await page.locator("ol").first().locator("a").first().click();
    await page.waitForURL("/modules/01-mental-models/01-how-the-web-works");
    await expect(
      page.getByRole("heading", { level: 1, name: "How the web works" }),
    ).toBeVisible();
  });

  test("dot-in-slug module route resolves (03.5 regression)", async ({
    page,
  }) => {
    const response = await page.goto("/modules/03.5-reading-code");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Reading code, just enough",
    );
  });
});
