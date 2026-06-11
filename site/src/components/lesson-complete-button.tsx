"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleLessonComplete } from "@/lib/actions/progress";

export function LessonCompleteButton({
  lessonPath,
  initialCompleted,
}: {
  lessonPath: string;
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleLessonComplete(lessonPath);
      if (result.ok) {
        setCompleted(result.completed);
        setError(null);
        // Re-render the server page so the prev/next nav reflects the new
        // unlock state without a manual reload.
        router.refresh();
      } else {
        setError("Couldn't save your progress. Try again.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={
          completed
            ? "h-11 cursor-pointer rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink disabled:cursor-default disabled:text-ink-disabled"
            : "h-11 cursor-pointer rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary disabled:cursor-default disabled:bg-ink-disabled"
        }
      >
        {pending
          ? "Saving…"
          : completed
            ? "✓ Completed — mark as not done"
            : "Mark lesson complete"}
      </button>
      {error && (
        <p role="alert" className="font-sans text-sm text-ink-secondary">
          {error}
        </p>
      )}
    </div>
  );
}
