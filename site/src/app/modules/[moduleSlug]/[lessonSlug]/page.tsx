import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { LessonArticle } from "@/components/lesson-article";
import { LessonChat } from "@/components/lesson-chat/lesson-chat";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { LessonLocked, LockIcon } from "@/components/lesson-locked";
import { RouteTag } from "@/components/route-tag";
import { getAllLessonRefs, getLesson, getModule, getModules } from "@/lib/content";
import type { LessonRef } from "@/lib/content/types";
import { formatDateUtc, formatMinutes, lessonHref, lessonLabel } from "@/lib/format";
import { hasRouteProgress, isRouteComplete, lessonRole, routePointer } from "@/lib/route";
import { gatingLesson, getUnlockState } from "@/lib/unlock";

// Reads the session cookie for gating + the completion toggle — render per
// request.
export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = await getLesson(moduleSlug, lessonSlug);
  return { title: lesson ? lesson.title : "Lesson not found" };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = await getLesson(moduleSlug, lessonSlug);
  if (!lesson) {
    notFound();
  }

  const [session, mod, modules] = await Promise.all([
    auth(),
    getModule(lesson.moduleSlug),
    getModules(),
  ]);
  const userId = session?.user?.id ?? null;
  const unlock = await getUnlockState(userId);
  const unlocked = unlock.unlockedLessons.has(lesson.path);
  const completed = unlock.completed.has(lesson.path);
  const nextUnlocked =
    lesson.next !== null && unlock.unlockedLessons.has(lesson.next.path);
  // The lesson that actually gates this one / the next one (chain order, not
  // flat order — see gatingLesson).
  const gate = gatingLesson(modules, lesson.path);
  const nextGate = lesson.next ? gatingLesson(modules, lesson.next.path) : null;
  const role = lessonRole(lesson.moduleSlug, lesson.path);
  const nextRole = lesson.next
    ? lessonRole(lesson.next.moduleSlug, lesson.next.path)
    : null;

  // Where the route points from here (src/lib/route.ts): the next route
  // lesson on a route lesson, or the way back to the route on a reference
  // lesson. A `next_practical` in the front matter names the route lesson
  // explicitly and wins when present. The card renders only when it says
  // something the reading-order "Next →" below does not.
  const pointer = routePointer(modules, lesson.moduleSlug, lesson.path, unlock.completed);
  const routeTarget: LessonRef | null =
    pointer?.kind === "next-step"
      ? (lesson.nextPractical ?? pointer.lesson)
      : (pointer?.lesson ?? null);
  const showRouteCard =
    routeTarget !== null &&
    (pointer?.kind === "return" || routeTarget.path !== lesson.next?.path);
  const routeTargetUnlocked =
    routeTarget !== null && unlock.unlockedLessons.has(routeTarget.path);
  const routeTargetModule = routeTarget
    ? modules.find((entry) => entry.slug === routeTarget.moduleSlug)
    : undefined;
  const gateModule = gate
    ? modules.find((entry) => entry.slug === gate.moduleSlug)
    : undefined;
  // A reference lesson read after the whole route is done: say so plainly
  // instead of pointing at another reference lesson as if it were the route.
  const routeDoneNote = role === "reference" && isRouteComplete(modules, unlock.completed);
  // "Your route continues at" only once a route lesson is complete —
  // completing this reference lesson (or any other) is not route progress.
  const routeStarted = hasRouteProgress(modules, unlock.completed);

  // Title and meta stay visible on locked lessons — the content is gated for
  // pacing, not secrecy (the markdown is public on github.com).
  const lessonHeader = (
    <>
      <nav className="font-sans text-sm text-ink-faint">
        <Link
          href={`/modules/${lesson.moduleSlug}`}
          className="-my-3 inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
        >
          ← {mod?.shortTitle ?? lesson.moduleSlug}
        </Link>
      </nav>

      <header className="mt-8">
        <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
          <span>
            Lesson {lesson.lessonNumber} · {formatMinutes(lesson.estMinutes)}
            {lesson.meta.updated && ` · updated ${formatDateUtc(lesson.meta.updated)}`}
          </span>
          <RouteTag role={role} />
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight text-ink">
          {lesson.title}
        </h1>
      </header>
    </>
  );

  if (!unlocked) {
    const firstLesson = (await getAllLessonRefs())[0];
    return (
      <div className="px-6">
        <article className="mx-auto max-w-3xl py-16">
          {lessonHeader}
          <LessonLocked
            signedIn={userId !== null}
            gate={
              gate
                ? {
                    title: gate.title,
                    href: lessonHref(gate),
                    label: gateModule
                      ? lessonLabel(gateModule.number, gate.lessonNumber)
                      : undefined,
                  }
                : null
            }
            firstLesson={{
              title: firstLesson.title,
              href: lessonHref(firstLesson),
            }}
          />
        </article>
      </div>
    );
  }

  return (
    <div className="px-6">
      <article className="mx-auto max-w-3xl py-16">
        {lessonHeader}

        <div className="mt-10">
          <LessonArticle html={lesson.html} />
        </div>

        <div className="mt-14 border-t border-line pt-8">
          {userId ? (
            <LessonCompleteButton
              lessonPath={lesson.path}
              initialCompleted={completed}
            />
          ) : (
            <p className="font-sans text-sm text-ink-secondary">
              <Link
                href="/signin"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
              >
                Sign in
              </Link>{" "}
              to track your progress through the course.
            </p>
          )}
        </div>

        {showRouteCard && routeTarget && (
          <aside
            data-testid="practical-next"
            className="mt-10 rounded-md border border-line-strong bg-surface p-6"
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              {pointer?.kind === "return"
                ? routeStarted
                  ? "Your route continues at"
                  : "The practical route starts at"
                : "Practical next step"}
            </p>
            <Link
              href={lessonHref(routeTarget)}
              className="mt-2 block font-serif text-2xl leading-snug text-ink transition-colors duration-150 hover:text-ink-secondary"
            >
              {routeTarget.title} →
            </Link>
            {routeTargetModule && (
              <p className="mt-1 font-mono text-xs text-ink-faint">
                {lessonLabel(routeTargetModule.number, routeTarget.lessonNumber)} ·{" "}
                {formatMinutes(routeTarget.estMinutes)}
              </p>
            )}
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-secondary">
              {pointer?.kind === "return"
                ? `This lesson is reference: read it whenever a build needs it — nothing later waits on it.${
                    nextRole === "reference"
                      ? " The reading-order next lesson below is more reference."
                      : ""
                  }`
                : routeTargetUnlocked ? (
                  "The lesson this course recommends you do next. The reading-order next lesson below is reference you can read whenever a build needs it."
                ) : userId ? (
                  "Unlocks when you mark this lesson complete. The reading-order next lesson below is reference you can read whenever a build needs it."
                ) : (
                  // Signed out there is no completion control on this page,
                  // so "mark this lesson complete" is not something the
                  // reader can do: say what actually opens the next step.
                  <>
                    It opens once this lesson is recorded as complete, and
                    recording needs an account:{" "}
                    <Link
                      href="/signin"
                      className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
                    >
                      sign in
                    </Link>
                    , come back here and mark this lesson complete. The
                    reading-order next lesson below is reference you can read
                    without an account whenever a build needs it.
                  </>
                )}
            </p>
          </aside>
        )}

        {routeDoneNote && (
          <aside
            data-testid="route-done"
            className="mt-10 rounded-md border border-line bg-surface p-6 font-sans text-sm leading-relaxed text-ink-secondary"
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              Reference
            </p>
            <p className="mt-2">
              You&apos;ve finished the practical route. This lesson is
              reference: read it in any order, whenever a build needs it.
            </p>
          </aside>
        )}

        <nav className="mt-10 flex flex-col gap-4 border-t border-line pt-8 font-sans text-sm sm:flex-row sm:justify-between">
          {lesson.prev ? (
            <Link href={lessonHref(lesson.prev)} className="group max-w-xs">
              <span className="text-ink-faint">← Previous</span>
              <span className="mt-1 block text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                {lesson.prev.title}
              </span>
              <RouteTag
                role={lessonRole(lesson.prev.moduleSlug, lesson.prev.path)}
                className="mt-1 block"
              />
            </Link>
          ) : (
            <span />
          )}
          {lesson.next ? (
            nextUnlocked ? (
              <Link
                href={lessonHref(lesson.next)}
                className="group max-w-xs sm:text-right"
              >
                <span className="text-ink-faint">Next →</span>
                <span className="mt-1 block text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                  {lesson.next.title}
                </span>
                {nextRole && <RouteTag role={nextRole} className="mt-1 block" />}
              </Link>
            ) : (
              <div className="max-w-xs text-ink-faint sm:text-right">
                <span className="inline-flex items-center gap-1.5">
                  <LockIcon className="h-3.5 w-3.5 shrink-0" />
                  Next →
                </span>
                <span className="mt-1 block">{lesson.next.title}</span>
                {nextRole && <RouteTag role={nextRole} className="mt-1 block" />}
                <span className="mt-1 block text-xs">
                  {nextGate && nextGate.path !== lesson.path
                    ? `Complete “${nextGate.title}” to unlock`
                    : "Mark this lesson complete to unlock"}
                </span>
              </div>
            )
          ) : (
            <span />
          )}
        </nav>
      </article>

      {userId && (
        <LessonChat lessonPath={lesson.path} lessonTitle={lesson.title} />
      )}
    </div>
  );
}
