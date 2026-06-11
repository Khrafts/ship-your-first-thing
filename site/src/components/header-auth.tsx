"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutAction } from "@/lib/actions/auth";

// Client island so the header can reflect session state without opting
// every (otherwise static) page into per-request rendering — the session
// is read from Auth.js's /api/auth/session endpoint after hydration.
// Re-checked on every route change: server-action redirects (sign-in,
// sign-out) navigate client-side without remounting the layout, so a
// mount-only fetch would show stale auth state.

type AuthState = "loading" | "signed-out" | "signed-in";

export function HeaderAuth() {
  const [state, setState] = useState<AuthState>("loading");
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((session) => {
        if (!cancelled) {
          setState(session?.user ? "signed-in" : "signed-out");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState("signed-out");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (state === "loading") {
    return <span aria-hidden className="inline-block h-5 w-20" />;
  }

  if (state === "signed-in") {
    return (
      <span className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="transition-colors duration-150 hover:text-ink"
        >
          Dashboard
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="cursor-pointer transition-colors duration-150 hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </span>
    );
  }

  return (
    <Link
      href="/signin"
      className="transition-colors duration-150 hover:text-ink"
    >
      Sign in
    </Link>
  );
}
