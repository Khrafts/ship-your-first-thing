import { expect, test } from "@playwright/test";
import {
  COMPLETE_LABEL,
  COMPLETED_PATTERN,
  FIRST_LESSON_URL,
  signUp,
  uniqueEmail,
} from "./helpers";

// The first lesson of the course — the only lesson a fresh, zero-progress
// account has unlocked under the sequential model (src/lib/unlock.ts).
const LESSON_URL = FIRST_LESSON_URL;
// 23 published lessons across the 5 live modules.
const TOTAL_LESSONS = 23;

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
    ).toContainText("1/5");

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
});
