import { expect, test } from "@playwright/test";
import { FIRST_LESSON_URL, signUp, uniqueEmail } from "./helpers";

test.describe("lesson chat", () => {
  test("signed-in learner can chat, and the transcript persists", async ({ page }) => {
    await signUp(page, {
      name: "Chat Learner",
      email: uniqueEmail("chat"),
      password: "correct-horse-battery",
    });

    await page.goto(FIRST_LESSON_URL);

    const fab = page.getByRole("button", { name: "Ask about this lesson" });
    await expect(fab).toBeVisible();
    await fab.click();

    const input = page.getByPlaceholder("Ask about this lesson…");
    await input.fill("What will I learn here?");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    // Mock backend streams a deterministic reply containing "mock tutor reply".
    // The user bubble is matched exactly — the assistant reply echoes the
    // question ("You asked: …"), so a substring match would hit two elements.
    await expect(page.getByText(/mock tutor reply/i)).toBeVisible();
    await expect(page.getByText("What will I learn here?", { exact: true })).toBeVisible();

    // Reload → transcript restored, FAB now says "Continue the chat".
    await page.reload();
    await expect(page.getByRole("button", { name: "Continue the chat" })).toBeVisible();
    await page.getByRole("button", { name: "Continue the chat" }).click();
    await expect(page.getByText("What will I learn here?", { exact: true })).toBeVisible();

    // New chat clears the transcript.
    await page.getByRole("button", { name: "New chat" }).click();
    await expect(page.getByText("What will I learn here?", { exact: true })).toHaveCount(0);
  });

  test("signed-out viewer sees no chat affordance", async ({ page }) => {
    await page.goto(FIRST_LESSON_URL);
    await expect(page.getByRole("button", { name: "Ask about this lesson" })).toHaveCount(0);
  });
});
