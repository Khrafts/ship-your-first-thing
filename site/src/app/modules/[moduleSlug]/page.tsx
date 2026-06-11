import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getModule, getModuleReadmeHtml, getModules } from "@/lib/content";
import { formatMinutes, moduleLabel } from "@/lib/format";
import { getUnlockState } from "@/lib/unlock";

// Reads the session cookie for completion checkmarks — render per request.
export const dynamic = "force-dynamic";

interface ModulePageProps {
  params: Promise<{ moduleSlug: string }>;
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = await getModule(moduleSlug);
  return { title: mod ? mod.title : "Module not found" };
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

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleSlug } = await params;
  const mod = await getModule(moduleSlug);
  if (!mod) {
    notFound();
  }

  const [readmeHtml, session, modules] = await Promise.all([
    getModuleReadmeHtml(mod.slug),
    auth(),
    getModules(),
  ]);
  const userId = session?.user?.id ?? null;
  const unlock = await getUnlockState(userId);

  const moduleUnlocked = unlock.unlockedModules.has(mod.slug);
  const moduleIndex = modules.findIndex((entry) => entry.slug === mod.slug);
  const previousModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <nav className="font-sans text-sm text-ink-faint">
          <Link
            href="/modules"
            className="-my-3 inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            ← All modules
          </Link>
        </nav>

        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-ink-faint">
          {moduleLabel(mod.number)} · {mod.lessonCount} lessons ·{" "}
          {formatMinutes(mod.totalMinutes)}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink">
          {mod.shortTitle}
        </h1>

        {!moduleUnlocked && previousModule && (
          <div className="mt-8 rounded-lg border border-line bg-surface px-5 py-4 font-sans text-sm leading-relaxed text-ink-secondary">
            This module unlocks after you finish {previousModule.shortTitle}.
            {!userId && (
              <>
                {" "}
                <Link
                  href="/signin"
                  className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
                >
                  Sign in
                </Link>{" "}
                to track your progress.
              </>
            )}
          </div>
        )}

        <h2 className="mt-12 font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
          Lessons
        </h2>
        <ol className="mt-4 divide-y divide-line rounded-lg border border-line">
          {mod.lessons.map((lesson) => {
            const completed = unlock.completed.has(lesson.path);
            const lessonUnlocked = unlock.unlockedLessons.has(lesson.path);

            if (!lessonUnlocked) {
              return (
                <li key={lesson.path}>
                  <div
                    aria-disabled="true"
                    className="flex items-baseline gap-4 px-5 py-4 text-ink-faint"
                  >
                    <span className="w-8 shrink-0 font-mono text-sm">
                      {lesson.lessonNumber}
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-2 font-serif text-lg">
                      <LockIcon />
                      {lesson.title}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-xs">
                      {formatMinutes(lesson.estMinutes)}
                    </span>
                  </div>
                </li>
              );
            }

            return (
              <li key={lesson.path}>
                <Link
                  href={`/modules/${lesson.moduleSlug}/${lesson.lessonSlug}`}
                  className="group flex items-baseline gap-4 px-5 py-4"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-ink-faint">
                    {completed ? "✓" : lesson.lessonNumber}
                  </span>
                  <span className="font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                    {lesson.title}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-xs text-ink-faint">
                    {formatMinutes(lesson.estMinutes)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 border-t border-line pt-10">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </div>
      </div>
    </div>
  );
}
