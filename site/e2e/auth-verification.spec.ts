import { expect, test } from "@playwright/test";
import { AUTH_COPY } from "../src/lib/copy";
import {
  confirmEmail,
  signUpUnverified,
  uniqueEmail,
  verificationLinkFor,
} from "./helpers";

const PASSWORD = "correct-horse-9";

test.describe("email confirmation", () => {
  test("sign-up does not sign you in — it asks you to confirm your email", async ({
    page,
  }) => {
    const email = uniqueEmail("verify-pending");
    await signUpUnverified(page, {
      name: "Pending Person",
      email,
      password: PASSWORD,
    });

    // Still signed out: the protected dashboard bounces to sign-in.
    await page.goto("/dashboard");
    await page.waitForURL(/\/signin/);
    await expect(
      page.getByRole("heading", { name: AUTH_COPY.signInTitle }),
    ).toBeVisible();
  });

  test("clicking the confirmation link activates the account, then sign-in works", async ({
    page,
  }) => {
    const email = uniqueEmail("verify-activate");
    await signUpUnverified(page, {
      name: "Activate Person",
      email,
      password: PASSWORD,
    });

    await confirmEmail(page, email);
    await expect(page.getByText(AUTH_COPY.verifiedBanner)).toBeVisible();

    // Now the same credentials sign in successfully.
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("/dashboard");
  });

  test("signing in before confirming is blocked and offers a resend", async ({
    page,
  }) => {
    const email = uniqueEmail("verify-blocked");
    await signUpUnverified(page, {
      name: "Blocked Person",
      email,
      password: PASSWORD,
    });

    await page.goto("/signin");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Blocked with the confirm-first message, not the wrong-password message.
    await expect(page.getByText(AUTH_COPY.needsVerification)).toBeVisible();
    await expect(page).toHaveURL("/signin");
    await expect(
      page.getByRole("button", { name: AUTH_COPY.resendButton }),
    ).toBeVisible();
  });

  test("an invalid confirmation link lands on sign-in with an error", async ({
    page,
  }) => {
    await page.goto("/verify-email?token=not-a-real-token");
    await page
      .getByRole("button", { name: AUTH_COPY.confirmEmailButton })
      .click();
    await page.waitForURL(/\/signin\?error=verification/);
    await expect(page.getByText(AUTH_COPY.verificationError)).toBeVisible();
  });

  test("visiting the link without confirming does not consume the token", async ({
    page,
  }) => {
    // Simulates an email-gateway link scanner fetching the page (GET) before
    // the human clicks: the single-use token must survive until the POST.
    const email = uniqueEmail("verify-prefetch");
    await signUpUnverified(page, {
      name: "Prefetch Person",
      email,
      password: PASSWORD,
    });

    const link = await verificationLinkFor(page, email);
    await page.goto(link); // first GET — must NOT activate or burn the token
    await page.goto(link); // a second GET still shows the confirm page
    await page
      .getByRole("button", { name: AUTH_COPY.confirmEmailButton })
      .click();
    await page.waitForURL(/\/signin\?verified=1/);
  });

  test("resend issues another working link", async ({ page }) => {
    const email = uniqueEmail("verify-resend");
    await signUpUnverified(page, {
      name: "Resend Person",
      email,
      password: PASSWORD,
    });

    // Trigger the blocked state, then resend from there.
    await page.goto("/signin");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("button", { name: AUTH_COPY.resendButton }).click();
    await expect(page.getByText(AUTH_COPY.resent)).toBeVisible();

    // The freshly resent link activates the account (confirmEmail follows the
    // latest captured link and presses the confirm button).
    await confirmEmail(page, email);
    await expect(page).toHaveURL(/\/signin\?verified=1/);
  });
});
