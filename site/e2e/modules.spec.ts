import { expect, test } from "@playwright/test";

test.describe("modules index", () => {
  test("signed out: Modules 0–2 are links, Modules 3–7 are locked cards", async ({
    page,
  }) => {
    await page.goto("/modules");
    await expect(
      page.getByRole("heading", { level: 1, name: "Modules" }),
    ).toBeVisible();

    // First <ol> is the live module list: 8 cards total.
    const liveList = page.locator("ol").first();
    await expect(liveList.locator("li")).toHaveCount(8);

    // Signed out: Module 0 (open), Module 1 (on-demand) and Module 2 (its
    // first lesson is on-demand) are anchors; Modules 3–7 are locked cards.
    const liveCards = liveList.locator('a[href^="/modules/"]');
    await expect(liveCards).toHaveCount(3);
    await expect(liveCards.first()).toHaveAttribute(
      "href",
      "/modules/00-welcome",
    );
    await expect(liveList.locator('[aria-disabled="true"]')).toHaveCount(5);
    await expect(
      liveList.getByText("locked — complete the previous module"),
    ).toHaveCount(5);

    // Spot-check 01-mental-models: an anchor, no lock indicator — it is
    // reference the learner can read at any time.
    const mentalModels = liveList.locator("li", {
      hasText: "How software works",
    });
    expect(await mentalModels.locator("a").count()).toBe(1);
    await expect(
      mentalModels.locator('[aria-disabled="true"]'),
    ).toHaveCount(0);

    // Every module ships, so the "Coming later" list no longer renders.
    await expect(
      page.getByRole("heading", { name: "Coming later" }),
    ).toHaveCount(0);
  });
});

test.describe("module detail", () => {
  test("03-the-loop lists 4 lesson rows, all locked for signed-out viewers", async ({
    page,
  }) => {
    await page.goto("/modules/03-the-loop");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "The loop in depth",
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

  test("01-mental-models lists 4 lesson rows, all readable for signed-out viewers", async ({
    page,
  }) => {
    await page.goto("/modules/01-mental-models");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How software works",
    );
    await expect(
      page.getByText(/This module unlocks after you finish/),
    ).toHaveCount(0);
    const lessonRows = page.locator("ol").first().locator("li");
    await expect(lessonRows).toHaveCount(4);
    expect(await page.locator("ol").first().locator("a").count()).toBe(4);
  });

  test("clicking the unlocked lesson row navigates to the lesson", async ({
    page,
  }) => {
    await page.goto("/modules/00-welcome");
    const lessonList = page.locator("ol").first();
    await expect(lessonList.locator("li")).toHaveCount(6);
    // Signed out, every Module 0 lesson is open, so all six rows are links.
    const lessonLinks = lessonList.locator("a");
    await expect(lessonLinks).toHaveCount(6);
    await lessonLinks.first().click();
    await page.waitForURL("/modules/00-welcome/01-welcome");
    await expect(
      page.getByRole("heading", { level: 1, name: "Welcome" }),
    ).toBeVisible();
  });

});
