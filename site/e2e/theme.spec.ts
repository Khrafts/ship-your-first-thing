import { expect, test } from "@playwright/test";

// Each test gets an isolated browser context (fresh localStorage), so a choice
// saved in one test never leaks into another. The toggle's accessible name
// always starts with "Theme:", which is how we locate it.
const TOGGLE_NAME = /^Theme:/;

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

  test("the toggle cycles system → light → dark and applies the class", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    const button = page.getByRole("button", { name: TOGGLE_NAME });

    await expect(html).not.toHaveClass(/dark/); // system → light (OS is light)
    await button.click(); // → light
    await expect(html).not.toHaveClass(/dark/);
    await button.click(); // → dark
    await expect(html).toHaveClass(/dark/);
    await button.click(); // → system (OS is light)
    await expect(html).not.toHaveClass(/dark/);
  });

  test("the choice persists across a reload with no flash on first paint", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const button = page.getByRole("button", { name: TOGGLE_NAME });
    await button.click(); // light
    await button.click(); // dark
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

    await button.click(); // light
    await button.click(); // dark
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
