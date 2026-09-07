import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { RouteTag } from "@/components/route-tag";
import { getModules, upcomingModules } from "@/lib/content";
import type { LessonRef, ModuleInfo } from "@/lib/content/types";
import { formatMinutes, lessonHref, lessonLabel, moduleLabel } from "@/lib/format";
import { getModuleProgressMap, type ProgressSummary } from "@/lib/progress";
import {
  hasRouteProgress,
  isRouteComplete,
  moduleRole,
  pickResumeLesson,
  routeEntry,
  routeStops,
} from "@/lib/route";
import { getUnlockState } from "@/lib/unlock";

// Reads the session cookie for per-module progress — render per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modules",
};

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

const linkClass =
  "underline underline-offset-2 transition-colors duration-150 hover:text-ink";

/** "“The save system” (Module 2, Lesson 3)" — the gate a learner has to
 *  complete, named as a lesson (not "the previous module") and linked. */
function GateName({
  gate,
  modules,
}: {
  gate: LessonRef;
  modules: ModuleInfo[];
}) {
  const mod = modules.find((entry) => entry.slug === gate.moduleSlug);
  return (
    <>
      <Link href={lessonHref(gate)} className={`text-ink-secondary ${linkClass}`}>
        “{gate.title}”
      </Link>
      {mod && <> ({lessonLabel(mod.number, gate.lessonNumber)})</>}
    </>
  );
}

export default async function ModulesPage() {
  const [modules, session] = await Promise.all([getModules(), auth()]);
  const userId = session?.user?.id ?? null;
  const [unlock, progressMap] = await Promise.all([
    getUnlockState(userId),
    userId
      ? getModuleProgressMap(userId, modules)
      : Promise.resolve<Map<string, ProgressSummary> | null>(null),
  ]);

  const resume = pickResumeLesson(modules, unlock.completed);
  const resumeModule = resume
    ? modules.find((mod) => mod.slug === resume.moduleSlug)
    : undefined;
  // "Your next step" only once a route lesson is complete: completing
  // reference material alone (Module 1, Module 2 Lessons 1–2) is not
  // progress along the route, so the card still says "Start here".
  const started = hasRouteProgress(modules, unlock.completed);
  // Once the route is done, resume falls back to unread reference — label it
  // as that, never as the next step on the route.
  const routeDone = isRouteComplete(modules, unlock.completed);
  const stops = routeStops(modules);

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Modules</h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          Module 0 is open to everyone and ends with your first build. From
          there the course follows one practical route, and each step on it
          opens when you complete the lesson before it. Module 1 and Module 2
          Lessons 1–2 are reference: read them whenever a build needs them.
          They never lock, and nothing waits on them.
        </p>

        {/* The route as a strip: one line, in order, with the reference
            modules left out because they are read on demand. */}
        <nav aria-label="Practical route" className="mt-6">
          <p className="font-sans text-sm leading-relaxed text-ink-secondary">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
              The route:{" "}
            </span>
            {stops.map((stop, index) => {
              const key =
                stop.kind === "module" ? stop.module.slug : stop.lesson.path;
              const href =
                stop.kind === "module"
                  ? `/modules/${stop.module.slug}`
                  : lessonHref(stop.lesson);
              const text =
                stop.kind === "module"
                  ? `${moduleLabel(stop.module.number)} · ${stop.module.shortTitle}`
                  : `${lessonLabel(stop.module.number, stop.lesson.lessonNumber)} · ${stop.lesson.title}`;
              return (
                <span key={key}>
                  {index > 0 && <span aria-hidden="true"> → </span>}
                  <Link href={href} className={linkClass}>
                    {text}
                  </Link>
                </span>
              );
            })}
          </p>
        </nav>

        {/* Where this viewer goes next: the first incomplete route lesson
            (the same pick as the dashboard's Resume), or the course start. */}
        {resume && (
          <div
            data-testid="catalog-next"
            className="mt-8 rounded-md border border-line-strong bg-surface p-6"
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              {routeDone
                ? "Route finished — reference you haven't read"
                : started
                  ? "Your next step"
                  : "Start here"}
            </p>
            <Link
              href={lessonHref(resume)}
              className="mt-2 block font-serif text-2xl leading-snug text-ink transition-colors duration-150 hover:text-ink-secondary"
            >
              {resume.title} →
            </Link>
            {resumeModule && (
              <p className="mt-1 font-mono text-xs text-ink-faint">
                {lessonLabel(resumeModule.number, resume.lessonNumber)} ·{" "}
                {formatMinutes(resume.estMinutes)}
              </p>
            )}
            {routeDone && (
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-secondary">
                Every lesson on the practical route is complete. What&apos;s
                left is reference you can read in any order.
              </p>
            )}
            {!userId && (
              <p className="mt-3 font-sans text-sm text-ink-secondary">
                <Link href="/signin" className={linkClass}>
                  Sign in
                </Link>{" "}
                to track which lessons you&apos;ve completed and pick up where
                you left off.
              </p>
            )}
          </div>
        )}

        <ol data-testid="module-list" className="mt-12 space-y-6">
          {modules.map((mod) => {
            const progress = progressMap?.get(mod.slug) ?? null;
            const unlocked = unlock.unlockedModules.has(mod.slug);
            const role = moduleRole(mod);
            const entry = routeEntry(modules, mod);
            const entryUnlocked =
              entry !== null && unlock.unlockedLessons.has(entry.entry.path);
            const tag =
              role === "mixed" && entry ? (
                <RouteTag
                  role="mixed"
                  label={`Route via Lesson ${Number(entry.entry.lessonNumber)}`}
                />
              ) : (
                <RouteTag role={role} />
              );

            const header = (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
                  <span>{moduleLabel(mod.number)}</span>
                  {tag}
                </p>
                <p className="font-mono text-xs text-ink-faint">
                  {mod.lessonCount} lessons · {formatMinutes(mod.totalMinutes)}
                </p>
              </div>
            );

            if (!unlocked) {
              return (
                <li key={mod.slug}>
                  <div
                    data-locked="true"
                    className="block rounded-lg border border-line p-6"
                  >
                    {header}
                    <h2 className="mt-2 font-serif text-2xl text-ink-secondary">
                      {mod.shortTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                      {mod.description}
                    </p>
                    <p
                      data-testid="module-gate"
                      className="mt-4 flex items-start gap-1.5 font-sans text-sm leading-relaxed text-ink-faint"
                    >
                      <span className="mt-1">
                        <LockIcon />
                      </span>
                      <span>
                        {entry?.gate ? (
                          <>
                            Opens after you complete{" "}
                            <GateName gate={entry.gate} modules={modules} />.
                          </>
                        ) : (
                          "Opens in course order."
                        )}
                      </span>
                    </p>
                  </div>
                </li>
              );
            }

            return (
              <li key={mod.slug}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className="group block rounded-lg border border-line p-6 transition-colors duration-150 hover:border-line-strong"
                >
                  {header}
                  <h2 className="mt-2 font-serif text-2xl text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                    {mod.shortTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {mod.description}
                  </p>
                  {role === "reference" && (
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink-faint">
                      Read any time. Nothing here locks, and no later lesson
                      waits on it.
                    </p>
                  )}
                  {role === "mixed" && entry && (
                    <p className="mt-3 flex items-start gap-1.5 font-sans text-sm leading-relaxed text-ink-faint">
                      {!entryUnlocked && (
                        <span className="mt-1">
                          <LockIcon />
                        </span>
                      )}
                      <span>
                        The route step here is Lesson{" "}
                        {Number(entry.entry.lessonNumber)}, “{entry.entry.title}”
                        {entryUnlocked || !entry.gate
                          ? ". The other lessons are reference you can read any time."
                          : ` — it opens after you complete “${entry.gate.title}”. The other lessons are reference you can read any time.`}
                      </span>
                    </p>
                  )}
                  {progress && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between font-mono text-xs text-ink-faint">
                        <span>
                          {progress.completed} of {progress.total} complete
                        </span>
                        <span>{progress.percent}%</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-surface-raised">
                        <div
                          className="h-1 rounded-full bg-ink transition-all duration-200"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>

        {upcomingModules(modules).length > 0 && (
          <>
            <h2 className="mt-16 font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              Coming later
            </h2>
            <ol className="mt-4 divide-y divide-line">
              {upcomingModules(modules).map((mod) => (
                <li
                  key={mod.number}
                  className="flex items-baseline gap-6 py-4"
                >
                  <span className="w-24 shrink-0 font-mono text-sm text-ink-faint">
                    {moduleLabel(mod.number)}
                  </span>
                  <span className="font-serif text-lg text-ink-faint">
                    {mod.shortTitle}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
