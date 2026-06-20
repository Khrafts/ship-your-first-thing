"use client";

import { useActionState } from "react";
import {
  resendVerificationAction,
  signInAction,
  signInWithGoogleAction,
  signUpAction,
  type AuthActionState,
} from "@/lib/actions/auth";
import { AUTH_COPY } from "@/lib/copy";

const INPUT_CLASSES =
  "h-11 w-full rounded-md border border-line-strong bg-paper px-3 text-base text-ink transition-colors duration-150 focus:border-ink";

const LABEL_CLASSES = "block font-sans text-sm font-medium text-ink";

const PRIMARY_BUTTON_CLASSES =
  "h-11 w-full cursor-pointer rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary disabled:cursor-default disabled:bg-ink-disabled";

const SECONDARY_BUTTON_CLASSES =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-line-strong bg-paper px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink disabled:cursor-default disabled:opacity-60";

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

/** Independent resend control: its own action state so reporting "sent"
 *  doesn't disturb the parent sign-in/sign-up form. */
function ResendControl({ email }: { email: string }) {
  const [state, action, pending] = useActionState<AuthActionState, FormData>(
    resendVerificationAction,
    undefined,
  );

  if (state?.status === "resent") {
    return <p className="text-sm text-ink-secondary">{AUTH_COPY.resent}</p>;
  }

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer text-sm font-medium text-ink underline underline-offset-2 transition-colors duration-150 hover:text-ink-secondary disabled:cursor-default disabled:text-ink-disabled"
      >
        {pending ? AUTH_COPY.resendingButton : AUTH_COPY.resendButton}
      </button>
    </form>
  );
}

function GoogleButton() {
  return (
    <form action={signInWithGoogleAction}>
      <button type="submit" className={SECONDARY_BUTTON_CLASSES}>
        <GoogleIcon />
        {AUTH_COPY.continueWithGoogle}
      </button>
    </form>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-line" />
      <span className="font-sans text-xs text-ink-secondary">
        {AUTH_COPY.orDivider}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signup" ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(action, undefined);

  const idPrefix = mode === "signup" ? "signup" : "signin";

  // Terminal success state for sign-up: the form is replaced by a "check your
  // email" panel — there's nothing more to type here.
  if (state?.status === "checkEmail") {
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-xl text-ink">
          {AUTH_COPY.checkEmailTitle}
        </h2>
        <p className="text-sm text-ink-secondary">
          {AUTH_COPY.checkEmailLead}{" "}
          <strong className="text-ink">{state.email}</strong>.{" "}
          {AUTH_COPY.checkEmailBody}
        </p>
        <ResendControl email={state.email} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton />
      <Divider />

      <form action={formAction} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label htmlFor={`${idPrefix}-name`} className={LABEL_CLASSES}>
              {AUTH_COPY.nameLabel}
            </label>
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              className={INPUT_CLASSES}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-email`} className={LABEL_CLASSES}>
            {AUTH_COPY.emailLabel}
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={INPUT_CLASSES}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-password`} className={LABEL_CLASSES}>
            {AUTH_COPY.passwordLabel}
          </label>
          <input
            id={`${idPrefix}-password`}
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={mode === "signup" ? 8 : undefined}
            className={INPUT_CLASSES}
          />
        </div>

        {state?.status === "error" && (
          <p role="alert" className="text-sm font-medium text-ink">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={PRIMARY_BUTTON_CLASSES}
        >
          {pending
            ? mode === "signup"
              ? "Creating account…"
              : "Signing in…"
            : mode === "signup"
              ? AUTH_COPY.signUpButton
              : AUTH_COPY.signInButton}
        </button>
      </form>

      {/* Rendered as a sibling of the form, never nested inside it: the resend
          control is its own <form>, and a form-in-a-form is invalid HTML that
          browsers drop (the button would submit the sign-in form instead). */}
      {state?.status === "needsVerification" && (
        <div role="alert" className="space-y-2">
          <p className="text-sm font-medium text-ink">
            {AUTH_COPY.needsVerification}
          </p>
          <ResendControl email={state.email} />
        </div>
      )}
    </div>
  );
}
