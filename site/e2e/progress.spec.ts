import { expect, test } from "@playwright/test";
import { signUp, uniqueEmail } from "./helpers";

const LESSON_URL = "/modules/01-mental-models/01-how-the-web-works";
// Exact button labels from lesson-complete-button.tsx.
const COMPLETE_LABEL = "Mark lesson complete";
const COMPLETED_PATTERN = /mark as not done/;
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

    // Complete the first mental-models lesson.
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
      page.locator('a[href="/modules/01-mental-models"]'),
    ).toContainText("1/4");

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
