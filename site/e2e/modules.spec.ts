import { expect, test } from "@playwright/test";

test.describe("modules index", () => {
  test("signed out: Modules 0–2 are links, Modules 3–7 are locked cards that name their gating lesson", async ({
    page,
  }) => {
    await page.goto("/modules");
    await expect(
      page.getByRole("heading", { level: 1, name: "Modules" }),
    ).toBeVisible();

    // The route strip and the start-here card come before the module list.
    await expect(
      page.getByRole("navigation", { name: "Practical route" }),
    ).toBeVisible();
    await expect(
      page.getByTestId("catalog-next").getByRole("link", { name: /Welcome/ }),
    ).toHaveAttribute("href", "/modules/00-welcome/01-welcome");

    // The module list: 8 cards in course order.
    const liveList = page.getByTestId("module-list");
    await expect(liveList.locator("li")).toHaveCount(8);

    // Signed out: Module 0 (open), Module 1 (reference) and Module 2 (its
    // first lesson is reference) are card-level anchors; Modules 3–7 are
    // locked cards.
    const liveCards = liveList.locator('li > a[href^="/modules/"]');
    await expect(liveCards).toHaveCount(3);
    await expect(liveCards.first()).toHaveAttribute(
      "href",
      "/modules/00-welcome",
    );
    const gates = liveList.getByTestId("module-gate");
    await expect(gates).toHaveCount(5);

    // Locked guidance names the gating lesson, not "the previous module":
    // Module 3 opens after Module 2 Lesson 3 (the save lesson), and the card
    // links to it.
    const loop = liveList.locator("li", { hasText: "The loop in depth" });
    await expect(loop.getByTestId("module-gate")).toContainText(
      "Opens after you complete “The save system” (Module 2, Lesson 3)",
    );
    await expect(
      loop.getByRole("link", { name: /The save system/ }),
    ).toHaveAttribute("href", "/modules/02-toolchain/03-the-save-system");
    await expect(
      liveList.getByText("complete the previous module"),
    ).toHaveCount(0);

    // Module 1 is reference: an anchor, no gate, labelled as reference.
    const mentalModels = liveList.locator("li", {
      hasText: "How software works",
    });
    expect(await mentalModels.locator("a").count()).toBe(1);
    await expect(mentalModels.getByTestId("module-gate")).toHaveCount(0);
    await expect(mentalModels).toContainText("Reference · read any time");

    // Module 2 is mixed: readable, but the card says the route runs through
    // Lesson 3 and what opens it.
    const toolchain = liveList.locator("li", {
      hasText: "Your agent and the machinery it drives",
    });
    await expect(toolchain).toContainText("Route via Lesson 3");
    await expect(toolchain).toContainText(
      "opens after you complete “Build your first thing”",
    );

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

    // The locked-module banner names the gating lesson (Module 2 Lesson 3,
    // not "Module 2") and links to it.
    const gate = page.getByTestId("module-gate");
    await expect(gate).toContainText(
      "This module unlocks after you finish “The save system” (Module 2, Lesson 3)",
    );
    await expect(
      gate.getByRole("link", { name: /The save system/ }),
    ).toHaveAttribute("href", "/modules/02-toolchain/03-the-save-system");
    // Signed out, the next step is the start of the route.
    await expect(
      page.getByTestId("module-next").getByRole("link"),
    ).toHaveAttribute("href", "/modules/00-welcome/01-welcome");

    // The lessons <ol> renders before the module README prose. Rows keep
    // their titles and estimated durations but none of them is an anchor.
    // Durations come from each lesson's `est_minutes` front-matter and
    // render through formatMinutes, which rolls 60 minutes over to "1 hr"
    // rather than "60 min" — so the expected strings are pinned per row.
    const expectedDurations = ["45 min", "50 min", "50 min", "1 hr"];
    const lessonRows = page.locator("ol").first().locator("li");
    await expect(lessonRows).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(lessonRows.nth(i)).toContainText(expectedDurations[i]);
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

  test("02-toolchain marks Lessons 1–2 as reference and Lesson 3 as the gated route step", async ({
    page,
  }) => {
    await page.goto("/modules/02-toolchain");
    await expect(page.getByText("Route via Lesson 3").first()).toBeVisible();
    const lessonRows = page.locator("ol").first().locator("li");
    await expect(lessonRows).toHaveCount(3);
    // Lessons 1–2: links, tagged reference. Lesson 3: locked, and the row
    // says which lesson (outside this module) opens it.
    await expect(lessonRows.nth(0).locator("a")).toHaveCount(1);
    await expect(lessonRows.nth(0)).toContainText("Reference · read any time");
    await expect(lessonRows.nth(1).locator("a")).toHaveCount(1);
    await expect(lessonRows.nth(2).locator("a")).toHaveCount(0);
    await expect(
      lessonRows.nth(2).locator('[aria-disabled="true"]'),
    ).toBeVisible();
    await expect(lessonRows.nth(2)).toContainText(
      "Opens after “Build your first thing”",
    );
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
