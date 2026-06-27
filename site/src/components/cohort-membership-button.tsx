"use client";

import { useState, useTransition } from "react";
import { joinCohort, leaveCohort } from "@/lib/actions/cohorts";

const JOIN_BUTTON =
  "inline-flex h-11 cursor-pointer items-center rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:opacity-90 disabled:cursor-default disabled:bg-ink-disabled";
const LEAVE_BUTTON =
  "inline-flex h-11 cursor-pointer items-center rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink disabled:cursor-default disabled:text-ink-disabled";

export function CohortMembershipButton({
  cohortSlug,
  action,
}: {
  cohortSlug: string;
  action: "join" | "leave";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result =
        action === "join"
          ? await joinCohort(cohortSlug)
          : await leaveCohort(cohortSlug);
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={action === "join" ? JOIN_BUTTON : LEAVE_BUTTON}
      >
        {pending
          ? action === "join"
            ? "Joining…"
            : "Leaving…"
          : action === "join"
            ? "Join cohort"
            : "Leave cohort"}
      </button>
      {error && (
        <p role="alert" className="font-sans text-sm text-ink-secondary">
          {error}
        </p>
      )}
    </div>
  );
}
