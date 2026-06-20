// Centralized user-visible copy. Strings marked LOCKED come from the
// project's planning decisions and must not be reworded.

// LOCKED (D-A15): verbatim stack-divergence footer line, shown sitewide.
export const FOOTER_STACK_DIVERGENCE =
  "This site runs on Next.js + Postgres + Drizzle + Auth.js. The thread project you'll build runs on Next.js + Supabase. Same shape, different services — see Module 7 for why.";

export const FOOTER_LICENSE =
  "Course content CC BY 4.0 · Site code MIT";

export const SITE_NAME = "Ship Your First Thing";

// README line 3 — the course's own description of itself.
export const TAGLINE =
  "An open-source, self-paced course that teaches non-technical people to ship a real, deployed product using AI coding tools — and recover when the AI gets it wrong.";

export const GITHUB_REPO_URL = "https://github.com/Khrafts/ship-your-first-thing";

export const AUTH_COPY = {
  signInTitle: "Sign in",
  signUpTitle: "Create your account",
  emailLabel: "Email",
  passwordLabel: "Password",
  nameLabel: "Name",
  signInButton: "Sign in",
  signUpButton: "Create account",
  signOutButton: "Sign out",
  toSignUp: "New here? Create an account",
  toSignIn: "Already have an account? Sign in",
  invalidCredentials: "That email and password combination doesn't match.",
  emailTaken: "An account with that email already exists.",
  weakPassword: "Password needs at least 8 characters.",

  // Google OAuth
  continueWithGoogle: "Continue with Google",
  orDivider: "or",

  // Email confirmation flow
  checkEmailTitle: "Check your email",
  checkEmailLead: "We sent a confirmation link to",
  checkEmailBody:
    "Click the link to activate your account. It expires in 24 hours.",
  needsVerification:
    "Confirm your email before signing in — check your inbox for the link.",
  resendButton: "Resend confirmation email",
  resendingButton: "Sending…",
  resent: "Sent. Check your inbox for a new confirmation link.",
  verifiedBanner: "Your email is confirmed. Sign in to continue.",
  verificationError:
    "That confirmation link is invalid or has expired. Sign in to get a new one.",
} as const;
