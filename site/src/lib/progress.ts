// Server-only progress query helpers. Callers pass in the module list from
// the content loader so this file stays a pure (db + modules) -> numbers
// layer with no dependency on the markdown pipeline.

import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { LessonRef, ModuleInfo } from "@/lib/content/types";

export interface ProgressSummary {
  completed: number;
  total: number;
  /** Whole-number 0..100. 0 when the lesson set is empty. */
  percent: number;
}

function summarize(lessons: LessonRef[], completedPaths: Set<string>): ProgressSummary {
  const total = lessons.length;
  const completed = lessons.reduce(
    (count, lesson) => (completedPaths.has(lesson.path) ? count + 1 : count),
    0,
  );
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}

/** Every lesson_path the user has marked complete, as a Set for O(1) lookups. */
export async function getCompletedLessonPaths(userId: string): Promise<Set<string>> {
  const db = await getDb();
  const rows = await db
    .select({ lessonPath: schema.lessonProgress.lessonPath })
    .from(schema.lessonProgress)
    .where(eq(schema.lessonProgress.userId, userId));
  return new Set(rows.map((row) => row.lessonPath));
}

/** Per-module completion counts, keyed by module slug. */
export async function getModuleProgressMap(
  userId: string,
  modules: ModuleInfo[],
): Promise<Map<string, ProgressSummary>> {
  const completedPaths = await getCompletedLessonPaths(userId);
  const map = new Map<string, ProgressSummary>();
  for (const mod of modules) {
    map.set(mod.slug, summarize(mod.lessons, completedPaths));
  }
  return map;
}

/**
 * First lesson in course order (modules as passed, lessons in module order)
 * the user has not completed. Null when every lesson is done.
 */
export async function getResumeLesson(
  userId: string,
  modules: ModuleInfo[],
): Promise<LessonRef | null> {
  const completedPaths = await getCompletedLessonPaths(userId);
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completedPaths.has(lesson.path)) {
        return lesson;
      }
    }
  }
  return null;
}

/** Completion counts across every lesson in every module passed in. */
export async function getOverallProgress(
  userId: string,
  modules: ModuleInfo[],
): Promise<ProgressSummary> {
  const completedPaths = await getCompletedLessonPaths(userId);
  const allLessons = modules.flatMap((mod) => mod.lessons);
  return summarize(allLessons, completedPaths);
}
