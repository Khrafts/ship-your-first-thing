"use client";

import { useActionState } from "react";
import {
  signInAction,
  signUpAction,
  type AuthActionState,
} from "@/lib/actions/auth";
import { AUTH_COPY } from "@/lib/copy";

const INPUT_CLASSES =
  "h-11 w-full rounded-md border border-line-strong bg-paper px-3 text-base text-ink transition-colors duration-150 focus:border-ink";

const LABEL_CLASSES = "block font-sans text-sm font-medium text-ink";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signup" ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(action, undefined);

  const idPrefix = mode === "signup" ? "signup" : "signin";

  return (
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

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full cursor-pointer rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary disabled:cursor-default disabled:bg-ink-disabled"
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
  );
}
