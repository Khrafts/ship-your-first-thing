import { expect, test } from "@playwright/test";

test.describe("modules index", () => {
  test("signed out: Module 0 is a link, the other 4 live modules are locked cards", async ({
    page,
  }) => {
    await page.goto("/modules");
    await expect(
      page.getByRole("heading", { level: 1, name: "Modules" }),
    ).toBeVisible();

    // First <ol> is the live module list: 5 cards total.
    const liveList = page.locator("ol").first();
    await expect(liveList.locator("li")).toHaveCount(5);

    // For a signed-out viewer only Module 0 is unlocked, so it is the only
    // anchor; the remaining four render as aria-disabled locked cards.
    const liveCards = liveList.locator('a[href^="/modules/"]');
    await expect(liveCards).toHaveCount(1);
    await expect(liveCards.first()).toHaveAttribute(
      "href",
      "/modules/00-welcome",
    );
    await expect(liveList.locator('[aria-disabled="true"]')).toHaveCount(4);
    await expect(
      liveList.getByText("locked — complete the previous module"),
    ).toHaveCount(4);

    // Spot-check 01-mental-models: not an anchor, and its card carries the
    // lock indicator (inline svg glyph + the locked line).
    const mentalModels = liveList.locator("li", {
      hasText: "How software works",
    });
    expect(await mentalModels.locator("a").count()).toBe(0);
    await expect(
      mentalModels.locator('[aria-disabled="true"]'),
    ).toBeVisible();
    await expect(mentalModels.locator("svg")).toBeVisible();
    await expect(mentalModels).toContainText(
      "locked — complete the previous module",
    );

    await expect(
      page.getByRole("heading", { name: "Coming later" }),
    ).toBeVisible();
    // Second <ol> holds the upcoming (non-linked) modules.
    await expect(page.locator("ol").nth(1).locator("li")).toHaveCount(4);
  });
});

test.describe("module detail", () => {
  test("01-mental-models lists 4 lesson rows, all locked for signed-out viewers", async ({
    page,
  }) => {
    await page.goto("/modules/01-mental-models");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How software works",
    );

    // The locked-module banner explains the gate.
    await expect(
      page.getByText(/This module unlocks after you finish/),
    ).toBeVisible();

    // The lessons <ol> renders before the module README prose. Rows keep
    // their titles and minute counts but none of them is an anchor.
    const lessonRows = page.locator("ol").first().locator("li");
    await expect(lessonRows).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(lessonRows.nth(i)).toContainText(/\d+ min/);
      await expect(
        lessonRows.nth(i).locator('[aria-disabled="true"]'),
      ).toBeVisible();
    }
    expect(await page.locator("ol").first().locator("a").count()).toBe(0);
  });

  test("clicking the unlocked lesson row navigates to the lesson", async ({
    page,
  }) => {
    await page.goto("/modules/00-welcome");
    const lessonList = page.locator("ol").first();
    await expect(lessonList.locator("li")).toHaveCount(5);
    // Signed out, only the first lesson of the course is unlocked / a link.
    const lessonLinks = lessonList.locator("a");
    await expect(lessonLinks).toHaveCount(1);
    await lessonLinks.first().click();
    await page.waitForURL("/modules/00-welcome/01-welcome");
    await expect(
      page.getByRole("heading", { level: 1, name: "Welcome" }),
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
