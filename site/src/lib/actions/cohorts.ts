"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb, schema } from "@/db";

export type CohortActionResult = { ok: true } | { ok: false; error: string };

function revalidateCohortSurfaces(): void {
  revalidatePath("/cohorts");
  revalidatePath("/dashboard");
}

/**
 * Join an open cohort by slug. Returns an error when the cohort doesn't
 * exist or has closed; joining when already a member succeeds (the composite
 * primary key makes the insert conflict-safe).
 */
export async function joinCohort(
  cohortSlug: string,
): Promise<CohortActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/signin");
  }

  const db = await getDb();
  const [cohort] = await db
    .select({ id: schema.cohorts.id, isOpen: schema.cohorts.isOpen })
    .from(schema.cohorts)
    .where(eq(schema.cohorts.slug, cohortSlug))
    .limit(1);
  if (!cohort || !cohort.isOpen) {
    return { ok: false, error: "This cohort closed before you joined." };
  }

  await db
    .insert(schema.cohortMembers)
    .values({ cohortId: cohort.id, userId })
    .onConflictDoNothing();

  revalidateCohortSurfaces();
  return { ok: true };
}

/**
 * Leave a cohort by slug. Deletes the membership row if one exists; leaving
 * works even after a cohort closes.
 */
export async function leaveCohort(
  cohortSlug: string,
): Promise<CohortActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/signin");
  }

  const db = await getDb();
  const [cohort] = await db
    .select({ id: schema.cohorts.id })
    .from(schema.cohorts)
    .where(eq(schema.cohorts.slug, cohortSlug))
    .limit(1);
  if (!cohort) {
    return { ok: false, error: "Couldn't find that cohort. Reload the page and try again." };
  }

  await db
    .delete(schema.cohortMembers)
    .where(
      and(
        eq(schema.cohortMembers.cohortId, cohort.id),
        eq(schema.cohortMembers.userId, userId),
      ),
    );

  revalidateCohortSurfaces();
  return { ok: true };
}
