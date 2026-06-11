import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb, schema } from "@/db";
import { joinCohort, leaveCohort } from "@/lib/actions/cohorts";
import { formatDateTimeUtc, formatDateUtc, formatMinutes } from "@/lib/format";

// Reads the database and the session cookie — render per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cohorts",
};

const BUTTON_PRIMARY =
  "inline-flex h-11 cursor-pointer items-center rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary";
const BUTTON_SECONDARY =
  "inline-flex h-11 cursor-pointer items-center rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink";

export default async function CohortsPage() {
  const [db, session] = await Promise.all([getDb(), auth()]);
  const userId = session?.user?.id ?? null;

  const cohorts = await db
    .select()
    .from(schema.cohorts)
    .orderBy(asc(schema.cohorts.startsOn));

  const memberships = userId
    ? await db
        .select({ cohortId: schema.cohortMembers.cohortId })
        .from(schema.cohortMembers)
        .where(eq(schema.cohortMembers.userId, userId))
    : [];
  const memberOf = new Set(memberships.map((row) => row.cohortId));

  const allSessions = await db
    .select()
    .from(schema.cohortSessions)
    .orderBy(asc(schema.cohortSessions.weekNumber));
  const sessionsByCohort = new Map<string, typeof allSessions>();
  for (const s of allSessions) {
    const list = sessionsByCohort.get(s.cohortId) ?? [];
    list.push(s);
    sessionsByCohort.set(s.cohortId, list);
  }

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Cohorts</h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          The course is self-paced — a cohort adds one live call per module
          for people who want to move through it together. Joining changes
          your schedule, not your access: every lesson stays open to everyone.
        </p>

        {cohorts.length === 0 && (
          <p className="mt-12 rounded-lg border border-line p-6 font-sans text-sm text-ink-secondary">
            No cohorts are scheduled right now. Check back, or work through
            the course self-paced — it&apos;s the same material.
          </p>
        )}

        <div className="mt-12 space-y-10">
          {cohorts.map((cohort) => {
            const sessions = sessionsByCohort.get(cohort.id) ?? [];
            const isMember = memberOf.has(cohort.id);

            return (
              <section
                key={cohort.id}
                className="rounded-lg border border-line p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-serif text-2xl text-ink">{cohort.name}</h2>
                  <p className="font-mono text-xs text-ink-faint">
                    starts {formatDateUtc(cohort.startsOn)}
                    {!cohort.isOpen && " · closed to new members"}
                  </p>
                </div>
                {cohort.description && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                    {cohort.description}
                  </p>
                )}

                {sessions.length > 0 && (
                  <table className="mt-6 w-full border-collapse font-sans text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
                        <th className="py-2 pr-4 font-medium">Week</th>
                        <th className="py-2 pr-4 font-medium">Call</th>
                        <th className="py-2 font-medium">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr key={s.id} className="border-b border-line">
                          <td className="py-2.5 pr-4 font-mono text-xs text-ink-faint">
                            {s.weekNumber}
                          </td>
                          <td className="py-2.5 pr-4 text-ink">{s.title}</td>
                          <td className="py-2.5 text-ink-secondary">
                            {formatDateTimeUtc(s.scheduledAt)} ·{" "}
                            {formatMinutes(s.durationMinutes)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="mt-6">
                  {!userId ? (
                    <p className="font-sans text-sm text-ink-secondary">
                      <Link
                        href="/signin"
                        className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
                      >
                        Sign in
                      </Link>{" "}
                      to join this cohort.
                    </p>
                  ) : isMember ? (
                    <form action={leaveCohort.bind(null, cohort.slug)}>
                      <button type="submit" className={BUTTON_SECONDARY}>
                        Leave cohort
                      </button>
                    </form>
                  ) : cohort.isOpen ? (
                    <form action={joinCohort.bind(null, cohort.slug)}>
                      <button type="submit" className={BUTTON_PRIMARY}>
                        Join cohort
                      </button>
                    </form>
                  ) : (
                    <p className="font-sans text-sm text-ink-faint">
                      This cohort is closed to new members.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
