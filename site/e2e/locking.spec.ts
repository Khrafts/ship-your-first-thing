import { expect, test, type Page } from "@playwright/test";
import {
  COMPLETE_LABEL,
  completeLessons,
  FIRST_LESSON_URL,
  MODULE_ZERO_LESSONS,
  signUp,
  uniqueEmail,
} from "./helpers";

// Progression model (src/lib/unlock.ts): Module 0 open to everyone; Module 1
// and Module 2 Lessons 1–2 on-demand (readable, never gating); the gating
// chain runs M0 L1 … M0 L6 → M2 L3 → M3 L1 → … This spec walks the real route.
const MODULE_ZERO_LESSON_TWO = MODULE_ZERO_LESSONS[1];
const MODULE_ZERO_LAST = MODULE_ZERO_LESSONS[5];
const MODULE_ONE_FIRST_LESSON = "/modules/01-mental-models/01-how-the-web-works";
const MODULE_TWO_FIRST_LESSON = "/modules/02-toolchain/01-your-ai-coding-agent";
const MODULE_TWO_SAVE_LESSON = "/modules/02-toolchain/03-the-save-system";
const MODULE_THREE_FIRST_LESSON = "/modules/03-the-loop/01-introducing-the-loop";

const LOCKED_HEADING = "This lesson is locked";

test.describe("progression (signed out)", () => {
  test("every Module 0 lesson is readable without an account", async ({ page }) => {
    for (const url of MODULE_ZERO_LESSONS) {
      await page.goto(url);
      await expect(
        page.getByRole("heading", { name: LOCKED_HEADING }),
      ).toHaveCount(0);
    }
    await page.goto(MODULE_ZERO_LESSON_TWO);
    await expect(
      page.getByRole("heading", { level: 1, name: "Hardware check" }),
    ).toBeVisible();
  });

  test("Module 1 and Module 2 Lessons 1–2 are readable without an account", async ({ page }) => {
    for (const [url, title] of [
      [MODULE_ONE_FIRST_LESSON, "How the web works"],
      [MODULE_TWO_FIRST_LESSON, "Your AI coding agent"],
    ] as const) {
      await page.goto(url);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
    }
  });

  test("the build-first lesson shows a practical-next card pointing at the save lesson", async ({ page }) => {
    await page.goto(MODULE_ZERO_LAST);
    const card = page.getByTestId("practical-next");
    await expect(card).toBeVisible();
    await expect(card.locator(`a[href="${MODULE_TWO_SAVE_LESSON}"]`)).toBeVisible();
    // Signed out there is no completion control, so the card must not tell
    // the reader only to "mark this lesson complete": it says the next step
    // opens once this lesson is recorded complete and links sign-in.
    await expect(card).toContainText("recording needs an account");
    await expect(card.getByRole("link", { name: "sign in" })).toHaveAttribute("href", "/signin");
    await expect(card).not.toContainText("Unlocks when you mark this lesson complete");
  });

  test("a reference lesson points back to the route, not at the reading-order next lesson", async ({ page }) => {
    // Signed out, no progress: Module 2 Lesson 2 (reference) sends the
    // reader to the start of the route; its "Next →" is the save lesson,
    // which stays a locked placeholder.
    await page.goto("/modules/02-toolchain/02-the-engine-room");
    const card = page.getByTestId("practical-next");
    await expect(card).toContainText("The practical route starts at");
    await expect(card.getByRole("link")).toHaveAttribute("href", FIRST_LESSON_URL);
    await expect(
      page.getByText("Complete “Build your first thing” to unlock"),
    ).toBeVisible();
  });

  test("Module 2 Lesson 3 is locked with a sign-in prompt", async ({ page }) => {
    await page.goto(MODULE_TWO_SAVE_LESSON);
    await expect(
      page.getByRole("heading", { name: LOCKED_HEADING }),
    ).toBeVisible();

    // Signed-out copy: Module 0 open, later lessons unlock in order, sign-in
    // link, and a pointer to the course's first lesson. Scoped to the article
    // — the site header carries its own "Sign in" link.
    const article = page.locator("article");
    await expect(
      article.getByText("Module 0 is open to everyone"),
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

// One fresh account walks the real route: finishing Module 0 opens Module 2
// Lesson 3 directly (Module 1 and M2 L1–L2 untouched), and finishing that
// opens Module 3. Serial — the tests share progress state in order.
test.describe("progression (signed in) — the practical route", () => {
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

  test("Module 2 Lesson 3 opens directly once all of Module 0 is complete", async () => {
    test.setTimeout(120_000);
    // Fresh account: the save lesson is locked and the card names Module 0's
    // last lesson as the way in.
    await page.goto(MODULE_TWO_SAVE_LESSON);
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    await expect(
      page.locator(`article a[href="${MODULE_ZERO_LAST}"]`),
    ).toContainText("Build your first thing");

    // Five of six Module 0 lessons: still locked.
    await completeLessons(page, MODULE_ZERO_LESSONS.slice(0, 5));
    await page.goto(MODULE_TWO_SAVE_LESSON);
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();

    // The build-first lesson: the save lesson opens. Module 1 and Module 2
    // Lessons 1–2 were never touched.
    await completeLessons(page, [MODULE_ZERO_LAST]);
    await page.goto(MODULE_TWO_SAVE_LESSON);
    await expect(
      page.getByRole("heading", { level: 1, name: "The save system" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: COMPLETE_LABEL, exact: true }),
    ).toBeVisible();

    // Module 3 is still gated behind the save lesson.
    await page.goto(MODULE_THREE_FIRST_LESSON);
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("completing Module 2 Lesson 3 opens Module 3's first lesson", async () => {
    await completeLessons(page, [MODULE_TWO_SAVE_LESSON]);
    await page.goto(MODULE_THREE_FIRST_LESSON);
    await expect(
      page.getByRole("heading", { level: 1, name: "Introducing the loop" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: COMPLETE_LABEL, exact: true }),
    ).toBeVisible();
  });
});
