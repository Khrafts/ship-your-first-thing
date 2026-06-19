import { expect, test } from "@playwright/test";

// Each test gets an isolated browser context (fresh localStorage), so a choice
// saved in one test never leaks into another. The toggle's accessible name is
// "Switch to dark theme" / "Switch to light theme", which is how we locate it.
const TOGGLE_NAME = /^Switch to (dark|light) theme$/;

test.describe("dark mode", () => {
  test("a fresh visit follows the OS preference (system default)", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("one click flips light → dark, the next flips back", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    const button = page.getByRole("button", { name: TOGGLE_NAME });

    await expect(html).not.toHaveClass(/dark/); // first visit, OS light → light
    await button.click(); // one click → dark
    await expect(html).toHaveClass(/dark/);
    await button.click(); // one click → back to light
    await expect(html).not.toHaveClass(/dark/);
  });

  test("from a dark OS, a single click goes straight to light", async ({
    page,
  }) => {
    // The bug this guards: with a 3-way cycle and a dark OS, the first click
    // landed on "system" (still dark) instead of light. A binary toggle must
    // reach light in exactly one click.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/); // system default → dark via OS
    await page.getByRole("button", { name: TOGGLE_NAME }).click();
    await expect(html).not.toHaveClass(/dark/); // one click → light
  });

  test("the choice persists across a reload with no flash on first paint", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const button = page.getByRole("button", { name: TOGGLE_NAME });
    await button.click(); // light → dark
    await expect(page.locator("html")).toHaveClass(/dark/);

    // After reload the class must already be present (the pre-paint script set
    // it before render) — that is the no-flash guarantee.
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("applying dark mode actually changes the page background colour", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const button = page.getByRole("button", { name: TOGGLE_NAME });

    const lightBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(lightBg).toBe("rgb(255, 255, 255)"); // --paper light

    await button.click(); // light → dark
    const darkBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(darkBg).toBe("rgb(9, 9, 11)"); // --paper dark
  });

  test("a corrupt stored value falls back to the OS preference, not light", async ({
    page,
  }) => {
    // Regression guard: an unrecognised localStorage value must be treated as
    // follow-the-OS by the pre-paint script, exactly as the provider does. With
    // a dark OS that means dark on first paint — not a light flash. addInitScript
    // seeds the value before the page's own scripts run.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      localStorage.setItem("syft-theme", "nonsense");
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
