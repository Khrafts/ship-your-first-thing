import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ProseHtml } from "@/components/prose-html";
import { RouteTag } from "@/components/route-tag";
import { getModule, getModuleReadmeHtml, getModules } from "@/lib/content";
import type { LessonRef, ModuleInfo } from "@/lib/content/types";
import { formatMinutes, lessonHref, lessonLabel, moduleLabel } from "@/lib/format";
import {
  hasRouteProgress,
  isRouteComplete,
  lessonRole,
  moduleRole,
  pickResumeLesson,
  routeEntry,
} from "@/lib/route";
import { gatingLesson, getUnlockState } from "@/lib/unlock";

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

const linkClass =
  "underline underline-offset-2 transition-colors duration-150 hover:text-ink";

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
      <Link href={lessonHref(gate)} className={linkClass}>
        “{gate.title}”
      </Link>
      {mod && <> ({lessonLabel(mod.number, gate.lessonNumber)})</>}
    </>
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

  const role = moduleRole(mod);
  const entry = routeEntry(modules, mod);
  const moduleUnlocked = unlock.unlockedModules.has(mod.slug);
  const entryUnlocked =
    entry !== null && unlock.unlockedLessons.has(entry.entry.path);
  // The route step this viewer should take next, course-wide (same pick as
  // the dashboard's Resume). Null once everything is complete.
  const resume = pickResumeLesson(modules, unlock.completed);
  const resumeModule = resume
    ? modules.find((candidate) => candidate.slug === resume.moduleSlug)
    : undefined;
  const resumeHere = resume !== null && resume.moduleSlug === mod.slug;
  const moduleDone = mod.lessons.every((lesson) => unlock.completed.has(lesson.path));
  // "Next up" / "continues at" only once a route lesson is complete. A
  // learner who has only read reference (say, all of Module 1) has not
  // started the route, so the box still says it "starts at" Module 0.
  const started = hasRouteProgress(modules, unlock.completed);
  // Route done: resume now falls back to unread reference, so the box must
  // not call it "your route".
  const routeDone = isRouteComplete(modules, unlock.completed);

  const signInHint = !userId && (
    <>
      {" "}
      <Link href="/signin" className={linkClass}>
        Sign in
      </Link>{" "}
      to track your progress.
    </>
  );

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

        <p className="mt-8 flex flex-wrap items-baseline gap-x-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
          <span>
            {moduleLabel(mod.number)} · {mod.lessonCount} lessons ·{" "}
            {formatMinutes(mod.totalMinutes)}
          </span>
          {role === "mixed" && entry ? (
            <RouteTag
              role="mixed"
              label={`Route via Lesson ${Number(entry.entry.lessonNumber)}`}
            />
          ) : (
            <RouteTag role={role} />
          )}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink">
          {mod.shortTitle}
        </h1>

        {/* Locked route module: name the lesson that opens it, not "the
            previous module" (Module 3 opens after Module 2 Lesson 3). */}
        {!moduleUnlocked && entry?.gate && (
          <div
            data-testid="module-gate"
            className="mt-8 rounded-lg border border-line bg-surface px-5 py-4 font-sans text-sm leading-relaxed text-ink-secondary"
          >
            This module unlocks after you finish{" "}
            <GateName gate={entry.gate} modules={modules} />.
            {signInHint}
          </div>
        )}

        {/* Reference module: say it plainly, and point back to the route. */}
        {role === "reference" && (
          <div className="mt-8 rounded-lg border border-line bg-surface px-5 py-4 font-sans text-sm leading-relaxed text-ink-secondary">
            Reference you can read any time. Nothing here locks, and no later
            lesson waits on it — open it the first time a build needs one of
            these pictures.
          </div>
        )}

        {/* Mixed module (Module 2): which lesson is the route step, and what
            opens it. */}
        {role === "mixed" && entry && (
          <div className="mt-8 rounded-lg border border-line bg-surface px-5 py-4 font-sans text-sm leading-relaxed text-ink-secondary">
            The route step in this module is Lesson{" "}
            {Number(entry.entry.lessonNumber)},{" "}
            {entryUnlocked ? (
              <Link href={lessonHref(entry.entry)} className={linkClass}>
                “{entry.entry.title}”
              </Link>
            ) : (
              <>“{entry.entry.title}”</>
            )}
            {entryUnlocked || !entry.gate ? (
              "."
            ) : (
              <>
                {" "}
                — it opens after you finish{" "}
                <GateName gate={entry.gate} modules={modules} />.
              </>
            )}{" "}
            The other lessons are reference you can read any time.
            {!entryUnlocked && signInHint}
          </div>
        )}

        {/* Next step for this viewer: inside this module when the route
            continues here, otherwise where it does continue. */}
        {resume && (
          <div
            data-testid="module-next"
            className="mt-6 rounded-md border border-line-strong bg-surface p-6"
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              {routeDone
                ? resumeHere
                  ? "Route finished — unread in this module"
                  : "Route finished — reference you haven't read"
                : resumeHere
                  ? started
                    ? "Next up in this module"
                    : "Start here"
                  : moduleDone
                    ? started
                      ? "You've finished this module — your route continues at"
                      : "You've finished this module — the practical route starts at"
                    : started
                      ? "Your route continues at"
                      : "The practical route starts at"}
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
          </div>
        )}

        <h2 className="mt-12 font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
          Lessons
        </h2>
        <ol className="mt-4 divide-y divide-line rounded-lg border border-line">
          {mod.lessons.map((lesson) => {
            const completed = unlock.completed.has(lesson.path);
            const lessonUnlocked = unlock.unlockedLessons.has(lesson.path);
            const isReference =
              role === "mixed" && lessonRole(mod.slug, lesson.path) === "reference";
            // For a locked row, name the gate only when it lives outside this
            // module — inside it, the order of the rows already says so.
            const gate = lessonUnlocked ? null : gatingLesson(modules, lesson.path);
            const outsideGate =
              gate && gate.moduleSlug !== mod.slug ? gate : null;

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
                    <span className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-2 font-serif text-lg">
                        <LockIcon />
                        {lesson.title}
                      </span>
                      {outsideGate && (
                        <span className="mt-0.5 block font-sans text-xs">
                          Opens after “{outsideGate.title}”
                        </span>
                      )}
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
                  href={lessonHref(lesson)}
                  className="group flex items-baseline gap-4 px-5 py-4"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-ink-faint">
                    {completed ? "✓" : lesson.lessonNumber}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                      {lesson.title}
                    </span>
                    {isReference && (
                      <RouteTag role="reference" className="ml-3" />
                    )}
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
          <ProseHtml html={readmeHtml} />
        </div>
      </div>
    </div>
  );
}
