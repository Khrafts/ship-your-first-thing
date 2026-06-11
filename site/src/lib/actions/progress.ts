"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getDb, schema } from "@/db";
import { getAllLessonRefs } from "@/lib/content";

export type ToggleLessonCompleteResult =
  | { ok: false; error: string }
  | { ok: true; completed: boolean };

/**
 * Toggle a lesson's completion for the signed-in user. The lessonPath is the
 * repo-relative markdown path ("modules/.../lesson.md") — the canonical
 * progress key on both render surfaces. Unknown paths are rejected so the
 * progress table only ever contains real lessons.
 */
export async function toggleLessonComplete(
  lessonPath: string,
): Promise<ToggleLessonCompleteResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false as const, error: "unauthenticated" };
  }

  const lessonRefs = await getAllLessonRefs();
  const known = lessonRefs.some((ref) => ref.path === lessonPath);
  if (!known) {
    return { ok: false as const, error: "unknown-lesson" };
  }

  const db = await getDb();
  const rowKey = and(
    eq(schema.lessonProgress.userId, userId),
    eq(schema.lessonProgress.lessonPath, lessonPath),
  );

  const existing = await db
    .select({ lessonPath: schema.lessonProgress.lessonPath })
    .from(schema.lessonProgress)
    .where(rowKey)
    .limit(1);

  let completed: boolean;
  try {
    if (existing.length > 0) {
      await db.delete(schema.lessonProgress).where(rowKey);
      completed = false;
    } else {
      await db
        .insert(schema.lessonProgress)
        .values({ userId, lessonPath })
        .onConflictDoNothing();
      completed = true;
    }
  } catch {
    // A JWT can outlive its user row (account deleted, database reseeded).
    // The insert then hits the user_id foreign key — treat that as a dead
    // session rather than letting the action throw.
    return { ok: false as const, error: "unauthenticated" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/modules");
  return { ok: true as const, completed };
}
