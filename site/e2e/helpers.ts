import type { Page } from "@playwright/test";

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
 * End the session via the dashboard's sign-out control, scoped to main —
 * the session-aware site header carries its own "Sign out" button — and
 * wait for the redirect back to the home page.
 */
export async function signOutFromDashboard(page: Page): Promise<void> {
  await page.goto("/dashboard");
  await page.locator("main").getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("/");
}
