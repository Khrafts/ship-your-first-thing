import { expect, test } from "@playwright/test";
import { AUTH_COPY } from "../src/lib/copy";
import { signIn, signOutFromDashboard, signUp, uniqueEmail } from "./helpers";

const PASSWORD = "correct-horse-9";

test.describe("auth", () => {
  test("sign-up lands on the dashboard with a sign-out control", async ({
    page,
  }) => {
    const email = uniqueEmail("auth-signup");
    await signUp(page, { name: "Signup Person", email, password: PASSWORD });

    await expect(page).toHaveURL("/dashboard");
    // Sign-out controls exist in both the dashboard body and the
    // session-aware header.
    await expect(
      page.locator("main").getByRole("button", { name: AUTH_COPY.signOutButton }),
    ).toBeVisible();
    await expect(
      page
        .locator("header")
        .getByRole("button", { name: AUTH_COPY.signOutButton }),
    ).toBeVisible();
  });

  test("sign-out returns home and ends the session", async ({ page }) => {
    const email = uniqueEmail("auth-signout");
    await signUp(page, { name: "Signout Person", email, password: PASSWORD });

    await page
      .locator("main")
      .getByRole("button", { name: AUTH_COPY.signOutButton })
      .click();
    await page.waitForURL("/");

    // Signed-out proof: the header flips to a "Sign in" link and the
    // dashboard redirects to the sign-in page.
    await expect(
      page.locator("header").getByRole("link", { name: "Sign in" }),
    ).toBeVisible();
    await page.goto("/dashboard");
    await page.waitForURL(/\/signin/);
    await expect(
      page.getByRole("heading", { name: AUTH_COPY.signInTitle }),
    ).toBeVisible();
  });

  test("sign-in works with previously created credentials", async ({
    page,
  }) => {
    const email = uniqueEmail("auth-signin");
    await signUp(page, { name: "Signin Person", email, password: PASSWORD });
    await signOutFromDashboard(page);

    await signIn(page, { email, password: PASSWORD });
    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.locator("main").getByRole("button", { name: AUTH_COPY.signOutButton }),
    ).toBeVisible();
  });

  test("wrong password shows the exact mismatch copy", async ({ page }) => {
    const email = uniqueEmail("auth-wrongpw");
    await signUp(page, { name: "Wrongpw Person", email, password: PASSWORD });
    await signOutFromDashboard(page);

    await page.goto("/signin");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill("not-the-password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Scoped to the form — Next's route announcer is also role="alert".
    await expect(page.locator("form").getByRole("alert")).toHaveText(
      AUTH_COPY.invalidCredentials,
    );
    await expect(page).toHaveURL("/signin");
  });

  test("duplicate-email signup shows the exact email-taken copy", async ({
    page,
  }) => {
    const email = uniqueEmail("auth-dup");
    await signUp(page, { name: "First Person", email, password: PASSWORD });
    await signOutFromDashboard(page);

    await page.goto("/signup");
    await page.getByLabel("Name", { exact: true }).fill("Second Person");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.locator("form").getByRole("alert")).toHaveText(
      AUTH_COPY.emailTaken,
    );
  });
});
