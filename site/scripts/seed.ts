// Seeds the first cohort and its per-module call schedule. Connects through
// the same env contract as scripts/migrate.ts (DATABASE_URL for Postgres,
// PGLITE_DATA_DIR / .data/pglite for embedded PGlite) via getDb().
//
//   tsx scripts/seed.ts             upsert cohort-1 by slug; sessions are
//                                   deleted and reinserted (members survive)
//   tsx scripts/seed.ts --if-empty  exit 0 silently if any cohort exists
//
// Relative import on purpose: tsx resolves TS path aliases poorly from
// scripts/, so we reach into the src tree directly.

import { eq } from "drizzle-orm";
import { getDb, schema } from "../src/db";

const COHORT = {
  slug: "cohort-1",
  name: "Cohort 1",
  description:
    "The first group working through the course together. One live call per module — the dense modules get a longer call.",
};

const SESSIONS = [
  {
    weekNumber: 1,
    moduleSlug: "00-welcome",
    title: "Module 0 — Welcome & setup",
    durationMinutes: 60,
  },
  {
    weekNumber: 2,
    moduleSlug: "01-mental-models",
    title: "Module 1 — How software works",
    durationMinutes: 90,
  },
  {
    weekNumber: 3,
    moduleSlug: "02-toolchain",
    title: "Module 2 — The developer toolchain",
    durationMinutes: 90,
  },
  {
    weekNumber: 4,
    moduleSlug: "03-the-loop",
    title: "Module 3 — The loop in depth",
    durationMinutes: 90,
  },
  {
    weekNumber: 5,
    moduleSlug: "03.5-reading-code",
    title: "Module 3.5 — Reading code, just enough",
    durationMinutes: 60,
  },
] as const;

/** Next Monday strictly after today, as a YYYY-MM-DD string (UTC date math). */
function nextMondayIso(now: Date): string {
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilMonday),
  );
  return monday.toISOString().slice(0, 10);
}

/** startsOn + (weekNumber - 1) weeks, at 17:00 UTC. */
function sessionTimestamp(startsOnIso: string, weekNumber: number): Date {
  const [year, month, day] = startsOnIso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + (weekNumber - 1) * 7, 17, 0, 0));
}

async function main() {
  const ifEmpty = process.argv.includes("--if-empty");
  const db = await getDb();

  if (ifEmpty) {
    const existing = await db
      .select({ id: schema.cohorts.id })
      .from(schema.cohorts)
      .limit(1);
    if (existing.length > 0) {
      process.exit(0);
    }
  }

  const startsOn = nextMondayIso(new Date());

  // Upsert by slug rather than delete + reinsert the cohort row: a cascade
  // delete would also wipe cohort_member rows for re-runs against live data.
  const [cohort] = await db
    .insert(schema.cohorts)
    .values({
      slug: COHORT.slug,
      name: COHORT.name,
      description: COHORT.description,
      startsOn,
      isOpen: true,
    })
    .onConflictDoUpdate({
      target: schema.cohorts.slug,
      set: {
        name: COHORT.name,
        description: COHORT.description,
        startsOn,
        isOpen: true,
      },
    })
    .returning({ id: schema.cohorts.id });

  console.log(`cohort ${COHORT.slug} (${COHORT.name}) — starts ${startsOn}`);

  // Sessions are derived data: replace wholesale so reruns stay consistent.
  await db
    .delete(schema.cohortSessions)
    .where(eq(schema.cohortSessions.cohortId, cohort.id));

  for (const session of SESSIONS) {
    const scheduledAt = sessionTimestamp(startsOn, session.weekNumber);
    await db.insert(schema.cohortSessions).values({
      cohortId: cohort.id,
      weekNumber: session.weekNumber,
      moduleSlug: session.moduleSlug,
      title: session.title,
      scheduledAt,
      durationMinutes: session.durationMinutes,
      callUrl: null,
      notes: null,
    });
    console.log(
      `session week ${session.weekNumber}: ${session.title} — ${scheduledAt.toISOString()} (${session.durationMinutes} min)`,
    );
  }

  // Explicit exit: the pg Pool (and PGlite handle) inside getDb() would
  // otherwise keep the event loop alive.
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
