import { expect, test, type Page } from "@playwright/test";
import {
  COMPLETE_LABEL,
  completeLessons,
  FIRST_LESSON_URL,
  MODULE_ZERO_LESSONS,
  signUp,
  uniqueEmail,
} from "./helpers";

// Second lesson of the course — locked for anyone who hasn't completed the
// first one (src/lib/unlock.ts sequential model).
const LESSON_TWO_URL = MODULE_ZERO_LESSONS[1];
// First lesson of module 1 — unlocks only once all of Module 0 is complete.
const MODULE_ONE_FIRST_LESSON = "/modules/01-mental-models/01-how-the-web-works";

const LOCKED_HEADING = "This lesson is locked";

test.describe("sequential locking (signed out)", () => {
  test("lesson 2 of module 0 is locked with a sign-in prompt", async ({
    page,
  }) => {
    await page.goto(LESSON_TWO_URL);
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toBeVisible();

    // Signed-out copy: unlock-in-order explainer with a sign-in link, plus a
    // pointer to the course's first lesson. Scoped to the article — the site
    // header carries its own "Sign in" link.
    const article = page.locator("article");
    await expect(
      article.getByText("Lessons unlock in order as you complete them."),
    ).toBeVisible();
    await expect(
      article.getByRole("link", { name: "Sign in" }),
    ).toHaveAttribute("href", "/signin");
    await expect(
      article.locator(`a[href="${FIRST_LESSON_URL}"]`),
    ).toBeVisible();

    // The lesson body is withheld: no mark-complete control renders.
    expect(
      await page.getByRole("button", { name: COMPLETE_LABEL }).count(),
    ).toBe(0);
  });
});

// One fresh account walks the whole gate: lesson 1 unlocks lesson 2, and
// finishing Module 0 unlocks module 1. Serial — the tests share progress
// state in order.
test.describe("sequential locking (signed in)", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await signUp(page, {
      name: "Locking Walker",
      email: uniqueEmail("locking"),
      password: "locking-pass-1",
    });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("lesson 2 stays locked until lesson 1 is complete", async () => {
    // Fresh account: lesson 2 is locked, and the card names the gating
    // lesson (“Welcome”) as the way in.
    await page.goto(LESSON_TWO_URL);
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toBeVisible();
    await expect(
      page.locator(`article a[href="${FIRST_LESSON_URL}"]`),
    ).toContainText("Welcome");

    await completeLessons(page, [FIRST_LESSON_URL]);

    // Lesson 2 now renders its body, locked card gone.
    await page.goto(LESSON_TWO_URL);
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: COMPLETE_LABEL, exact: true }),
    ).toBeVisible();
  });

  test("completing module 0 unlocks the first mental-models lesson", async () => {
    test.setTimeout(120_000);
    // Only lesson 1 is complete so far — module 1 is still gated.
    await page.goto(MODULE_ONE_FIRST_LESSON);
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toBeVisible();

    await completeLessons(page, MODULE_ZERO_LESSONS.slice(1));

    await page.goto(MODULE_ONE_FIRST_LESSON);
    await expect(
      page.getByRole("heading", { level: 1, name: "How the web works" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: COMPLETE_LABEL, exact: true }),
    ).toBeVisible();
  });
});
