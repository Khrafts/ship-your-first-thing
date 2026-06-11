// Desktop-only lesson rail for lesson pages. Server component: the layout
// fetches the module + unlock state and passes them in, so this stays a pure
// props -> markup mapping. Hidden below lg — small screens rely on the lesson
// page's own breadcrumb and prev/next navigation.

import Link from "next/link";
import type { ModuleInfo } from "@/lib/content/types";
import type { UnlockState } from "@/lib/unlock";

interface ModuleSidebarProps {
  module: ModuleInfo;
  /** Lesson basename slug of the lesson being viewed. */
  currentLessonSlug: string;
  unlock: UnlockState;
  signedIn: boolean;
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="6.5" rx="1" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export function ModuleSidebar({
  module: mod,
  currentLessonSlug,
  unlock,
  signedIn,
}: ModuleSidebarProps) {
  const completedCount = mod.lessons.filter((lesson) =>
    unlock.completed.has(lesson.path),
  ).length;

  return (
    <aside
      aria-label="Lessons in this module"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-64 shrink-0 self-start overflow-y-auto border-r border-line lg:block"
    >
      <div className="py-12 pl-2 pr-5">
        <div className="pl-3">
          <Link
            href={`/modules/${mod.slug}`}
            className="inline-flex min-h-11 items-center font-serif text-lg leading-snug text-ink transition-colors duration-150 hover:text-ink-secondary"
          >
            {mod.shortTitle}
          </Link>
          {signedIn && (
            <p className="font-mono text-xs text-ink-faint">
              {completedCount}/{mod.lessons.length} complete
            </p>
          )}
        </div>

        <ol className="mt-4">
          {mod.lessons.map((lesson) => {
            const isCurrent = lesson.lessonSlug === currentLessonSlug;
            const completed = unlock.completed.has(lesson.path);
            const lessonUnlocked = unlock.unlockedLessons.has(lesson.path);
            const rowBase =
              "flex min-h-11 items-center gap-2 border-l-2 py-1.5 pl-3 pr-1";

            if (isCurrent) {
              return (
                <li key={lesson.path}>
                  <span
                    aria-current="page"
                    className={`${rowBase} border-ink font-medium text-ink`}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs text-ink-faint">
                      {lesson.lessonNumber}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-snug">
                      {lesson.title}
                    </span>
                    {completed && <CheckIcon />}
                  </span>
                </li>
              );
            }

            if (!lessonUnlocked) {
              return (
                <li key={lesson.path}>
                  <span
                    aria-disabled="true"
                    className={`${rowBase} border-transparent text-ink-faint`}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs">
                      {lesson.lessonNumber}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-snug">
                      {lesson.title}
                    </span>
                    <LockIcon />
                  </span>
                </li>
              );
            }

            return (
              <li key={lesson.path}>
                <Link
                  href={`/modules/${lesson.moduleSlug}/${lesson.lessonSlug}`}
                  className={`${rowBase} border-transparent text-ink-secondary transition-colors duration-150 hover:text-ink`}
                >
                  <span className="w-5 shrink-0 font-mono text-xs text-ink-faint">
                    {lesson.lessonNumber}
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-snug">
                    {lesson.title}
                  </span>
                  {completed && <CheckIcon />}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-line pt-4 pl-3">
          <Link
            href="/modules"
            className="inline-flex min-h-11 items-center font-sans text-sm text-ink-faint transition-colors duration-150 hover:text-ink"
          >
            ← All modules
          </Link>
        </div>
      </div>
    </aside>
  );
}
