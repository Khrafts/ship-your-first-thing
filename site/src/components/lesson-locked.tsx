// Locked-lesson card. Server-compatible — pure markup, no client hooks. The
// page keeps its h1/meta header visible (titles are public; the canonical
// markdown lives on github.com) and swaps the lesson body for this card when
// the viewer hasn't unlocked the lesson yet (see src/lib/unlock.ts).

import Link from "next/link";

/** Inline 1.5px-stroke padlock glyph (design tokens forbid emoji icons). */
export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

interface LessonLink {
  title: string;
  href: string;
}

export function LessonLocked({
  signedIn,
  prev,
  firstLesson,
}: {
  signedIn: boolean;
  /** The lesson whose completion unlocks this one (flat course order). */
  prev: LessonLink | null;
  /** First lesson of the course — the signed-out starting point. */
  firstLesson: LessonLink;
}) {
  return (
    <div className="mt-10 rounded-md border border-line bg-surface p-8">
      <div className="flex items-center gap-3">
        <LockIcon className="h-5 w-5 shrink-0 text-ink-faint" />
        <h2 className="font-serif text-2xl leading-snug tracking-tight text-ink">
          This lesson is locked
        </h2>
      </div>
      {signedIn && prev ? (
        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-secondary">
          Complete{" "}
          <Link
            href={prev.href}
            className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            “{prev.title}”
          </Link>{" "}
          to unlock this lesson.
        </p>
      ) : (
        <div className="mt-4 font-sans text-sm leading-relaxed text-ink-secondary">
          <p>
            Lessons unlock in order as you complete them.{" "}
            <Link
              href="/signin"
              className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              Sign in
            </Link>{" "}
            to track your progress.
          </p>
          <p className="mt-2">
            Start at the beginning:{" "}
            <Link
              href={firstLesson.href}
              className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              {firstLesson.title}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
