import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb, schema } from "@/db";
import { signOutAction } from "@/lib/actions/auth";
import { getModules } from "@/lib/content";
import { formatDateUtc, moduleLabel } from "@/lib/format";
import {
  getModuleProgressMap,
  getOverallProgress,
  getResumeLesson,
} from "@/lib/progress";

// Session-gated — render per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/signin");
  }

  const modules = await getModules();
  const [overall, resume, progressMap, db] = await Promise.all([
    getOverallProgress(userId, modules),
    getResumeLesson(userId, modules),
    getModuleProgressMap(userId, modules),
    getDb(),
  ]);

  const cohortRows = await db
    .select({
      name: schema.cohorts.name,
      slug: schema.cohorts.slug,
      startsOn: schema.cohorts.startsOn,
    })
    .from(schema.cohortMembers)
    .innerJoin(schema.cohorts, eq(schema.cohortMembers.cohortId, schema.cohorts.id))
    .where(eq(schema.cohortMembers.userId, userId))
    .orderBy(asc(schema.cohorts.startsOn));

  const displayName = session.user.name ?? session.user.email ?? "there";

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-serif text-4xl tracking-tight text-ink">
            Hi, {displayName}
          </h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="cursor-pointer font-sans text-sm text-ink-secondary underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Overall progress */}
        <section className="mt-10 rounded-lg border border-line p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              Course progress
            </h2>
            <p className="font-mono text-sm text-ink">
              {overall.completed} / {overall.total} lessons · {overall.percent}%
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-raised">
            <div
              className="h-1.5 rounded-full bg-ink transition-all duration-200"
              style={{ width: `${overall.percent}%` }}
            />
          </div>
          <div className="mt-6">
            {resume ? (
              <Link
                href={`/modules/${resume.moduleSlug}/${resume.lessonSlug}`}
                className="inline-flex h-11 items-center rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary"
              >
                {overall.completed === 0 ? "Start" : "Resume"}: {resume.title} →
              </Link>
            ) : (
              <p className="font-sans text-sm text-ink-secondary">
                You&apos;ve completed every lesson currently published. More
                modules are on the way.
              </p>
            )}
          </div>
        </section>

        {/* Per-module breakdown */}
        <section className="mt-10">
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
            By module
          </h2>
          <ol className="mt-4 divide-y divide-line rounded-lg border border-line">
            {modules.map((mod) => {
              const progress = progressMap.get(mod.slug);
              return (
                <li key={mod.slug}>
                  <Link
                    href={`/modules/${mod.slug}`}
                    className="group flex items-center gap-4 px-5 py-4"
                  >
                    <span className="w-24 shrink-0 font-mono text-xs text-ink-faint">
                      {moduleLabel(mod.number)}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                      {mod.shortTitle}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-ink-faint">
                      {progress
                        ? `${progress.completed}/${progress.total}`
                        : `0/${mod.lessonCount}`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Cohorts */}
        <section className="mt-10">
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
            Your cohorts
          </h2>
          {cohortRows.length === 0 ? (
            <p className="mt-4 font-sans text-sm text-ink-secondary">
              You&apos;re not in a cohort. The course works fine self-paced —
              or{" "}
              <Link
                href="/cohorts"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
              >
                see upcoming cohorts
              </Link>{" "}
              if you&apos;d like a schedule and company.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
              {cohortRows.map((cohort) => (
                <li key={cohort.slug}>
                  <Link
                    href="/cohorts"
                    className="group flex items-baseline justify-between gap-4 px-5 py-4"
                  >
                    <span className="font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                      {cohort.name}
                    </span>
                    <span className="font-mono text-xs text-ink-faint">
                      starts {formatDateUtc(cohort.startsOn)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
