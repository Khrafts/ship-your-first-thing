import { expect, test } from "@playwright/test";
import {
  COMPLETE_LABEL,
  COMPLETED_PATTERN,
  completeLessons,
  FIRST_LESSON_URL,
  MODULE_ZERO_LESSONS,
  signUp,
  uniqueEmail,
} from "./helpers";

// The first lesson of the course (Module 0 is open to everyone; see
// src/lib/unlock.ts).
const LESSON_URL = FIRST_LESSON_URL;
// 38 published lessons across the 8 live modules (6+4+3+4+9+5+4+3).
const TOTAL_LESSONS = 38;
const SAVE_LESSON_URL = "/modules/02-toolchain/03-the-save-system";
const LOOP_LESSON_ONE_URL = "/modules/03-the-loop/01-introducing-the-loop";
const LOOP_LESSON_TWO_URL = "/modules/03-the-loop/02-planning-vs-execution";

test.describe("lesson progress", () => {
  test("complete and un-complete a lesson, dashboard tracks it", async ({
    page,
  }) => {
    const email = uniqueEmail("progress");
    await signUp(page, {
      name: "Progress Person",
      email,
      password: "progress-pass-1",
    });

    // Fresh dashboard: nothing completed. (Copy reads "0 / 23 lessons".)
    await expect(
      page.getByText(`0 / ${TOTAL_LESSONS} lessons`),
    ).toBeVisible();
    const resume = page.getByRole("link", { name: /^(Start|Resume):/ });
    await expect(resume).toBeVisible();

    // Complete the first lesson of the course.
    await page.goto(LESSON_URL);
    await page
      .getByRole("button", { name: COMPLETE_LABEL, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: COMPLETED_PATTERN }),
    ).toBeVisible();

    // Dashboard reflects the completion.
    await page.goto("/dashboard");
    await expect(
      page.getByText(`1 / ${TOTAL_LESSONS} lessons`),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/modules/00-welcome"]'),
    ).toContainText("1/6");

    // The resume card no longer points at the completed lesson.
    const resumeHref = await page
      .getByRole("link", { name: /^(Start|Resume):/ })
      .getAttribute("href");
    expect(resumeHref).not.toBe(LESSON_URL);

    // Un-complete returns the button to its initial state.
    await page.goto(LESSON_URL);
    await page.getByRole("button", { name: COMPLETED_PATTERN }).click();
    await expect(
      page.getByRole("button", { name: COMPLETE_LABEL, exact: true }),
    ).toBeVisible();

    // And the dashboard count drops back.
    await page.goto("/dashboard");
    await expect(
      page.getByText(`0 / ${TOTAL_LESSONS} lessons`),
    ).toBeVisible();
  });

  // Resume follows the practical route (src/lib/route.ts), not flat order:
  // a learner who finished Module 0 and skipped Module 1 is sent to Module 2
  // Lesson 3, and one mid-Module 3 stays in Module 3.
  test("resume follows the practical route past the on-demand reference lessons", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await signUp(page, {
      name: "Route Follower",
      email: uniqueEmail("route"),
      password: "route-pass-1",
    });
    const resume = () =>
      page.getByRole("link", { name: /^(Start|Resume):/ }).getAttribute("href");

    await completeLessons(page, MODULE_ZERO_LESSONS);
    await page.goto("/dashboard");
    expect(await resume()).toBe(SAVE_LESSON_URL);
    await page.goto("/continue");
    await page.waitForURL(SAVE_LESSON_URL);

    await completeLessons(page, [SAVE_LESSON_URL, LOOP_LESSON_ONE_URL]);
    await page.goto("/dashboard");
    expect(await resume()).toBe(LOOP_LESSON_TWO_URL);
  });
});
