"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb, schema } from "@/db";

function revalidateCohortSurfaces(): void {
  revalidatePath("/cohorts");
  revalidatePath("/dashboard");
}

/**
 * Join an open cohort by slug. No-op when the cohort doesn't exist, is
 * closed, or the user is already a member (the composite primary key makes
 * the insert conflict-safe).
 */
export async function joinCohort(cohortSlug: string): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/signin");
  }

  const db = await getDb();
  const [cohort] = await db
    .select({ id: schema.cohorts.id })
    .from(schema.cohorts)
    .where(and(eq(schema.cohorts.slug, cohortSlug), eq(schema.cohorts.isOpen, true)))
    .limit(1);
  if (!cohort) {
    return;
  }

  await db
    .insert(schema.cohortMembers)
    .values({ cohortId: cohort.id, userId })
    .onConflictDoNothing();

  revalidateCohortSurfaces();
}

/**
 * Leave a cohort by slug. Deletes the membership row if one exists; leaving
 * works even after a cohort closes.
 */
export async function leaveCohort(cohortSlug: string): Promise<void> {
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
    return;
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
}
