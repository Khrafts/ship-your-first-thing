import { expect, type Page } from "@playwright/test";

/** First lesson of the course — the only lesson signed-out viewers can open. */
export const FIRST_LESSON_URL = "/modules/00-welcome/01-welcome";

/**
 * Module 0's lessons in flat course order. Completing all five unlocks the
 * first mental-models lesson under the sequential model (src/lib/unlock.ts).
 */
export const MODULE_ZERO_LESSONS = [
  FIRST_LESSON_URL,
  "/modules/00-welcome/02-hardware-check",
  "/modules/00-welcome/03-cost-path-triage",
  "/modules/00-welcome/04-account-creation",
  "/modules/00-welcome/05-codespaces-walkthrough",
] as const;

// Exact button labels from lesson-complete-button.tsx.
export const COMPLETE_LABEL = "Mark lesson complete";
export const COMPLETED_PATTERN = /mark as not done/;

let emailCounter = 0;

/**
 * Deterministic unique email per test run: process pid + a monotonic counter.
 * The suite runs with one worker, so a module-level counter is enough; the
 * pid keeps reruns against a surviving database from colliding.
 */
export function uniqueEmail(prefix: string): string {
  emailCounter += 1;
  return `${prefix}-${process.pid}-${emailCounter}@example.com`;
}

export interface SignUpDetails {
  name: string;
  email: string;
  password: string;
}

export interface SignInDetails {
  email: string;
  password: string;
}

/** Create an account through the real /signup form and wait for /dashboard. */
export async function signUp(
  page: Page,
  { name, email, password }: SignUpDetails,
): Promise<void> {
  await page.goto("/signup");
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("/dashboard");
}

/** Sign in through the real /signin form and wait for /dashboard. */
export async function signIn(
  page: Page,
  { email, password }: SignInDetails,
): Promise<void> {
  await page.goto("/signin");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("/dashboard");
}

/**
 * Mark each lesson complete through the real UI button, in order, waiting
 * for the completed state between steps. Requires a signed-in page whose
 * progress has already unlocked the first path in the list.
 */
export async function completeLessons(
  page: Page,
  paths: readonly string[],
): Promise<void> {
  for (const url of paths) {
    await page.goto(url);
    await page
      .getByRole("button", { name: COMPLETE_LABEL, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: COMPLETED_PATTERN }),
    ).toBeVisible();
  }
}

/** Complete all five Module 0 lessons — unlocks 01-mental-models. */
export async function completeModuleZero(page: Page): Promise<void> {
  await completeLessons(page, MODULE_ZERO_LESSONS);
}

/**
 * End the session via the dashboard's sign-out control, scoped to main —
 * the session-aware site header carries its own "Sign out" button — and
 * wait for the redirect back to the home page.
 */
export async function signOutFromDashboard(page: Page): Promise<void> {
  await page.goto("/dashboard");
  await page.locator("main").getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("/");
}
