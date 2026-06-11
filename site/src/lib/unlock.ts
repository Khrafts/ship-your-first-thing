// Sequential progression model. The course unlocks in order: a lesson is
// viewable when it is the very first lesson, when the previous lesson (in
// flat course order, across module boundaries) is complete, or when it is
// itself already complete (un-completing an earlier lesson must not lock
// content the learner has finished). A module is unlocked when its first
// lesson is. Signed-out visitors have no progress, so only the first lesson
// of the course is open to them — the canonical markdown remains public on
// github.com; locking here is pacing, not secrecy.

import { getModules } from "@/lib/content";
import type { ModuleInfo } from "@/lib/content/types";
import { getCompletedLessonPaths } from "@/lib/progress";

export interface UnlockState {
  /** lesson_path values the viewer has completed. */
  completed: Set<string>;
  /** lesson_path values the viewer may open. */
  unlockedLessons: Set<string>;
  /** module slugs whose first lesson is unlocked. */
  unlockedModules: Set<string>;
}

export function computeUnlockState(
  modules: ModuleInfo[],
  completed: Set<string>,
): UnlockState {
  const lessons = modules.flatMap((mod) => mod.lessons);
  const unlockedLessons = new Set<string>();
  for (let i = 0; i < lessons.length; i += 1) {
    const lessonPath = lessons[i].path;
    if (
      i === 0 ||
      completed.has(lessons[i - 1].path) ||
      completed.has(lessonPath)
    ) {
      unlockedLessons.add(lessonPath);
    }
  }
  const unlockedModules = new Set<string>();
  for (const mod of modules) {
    const first = mod.lessons[0];
    if (!first || unlockedLessons.has(first.path)) {
      unlockedModules.add(mod.slug);
    }
  }
  return { completed, unlockedLessons, unlockedModules };
}

/** Unlock state for the current viewer; userId null = signed out (no progress). */
export async function getUnlockState(userId: string | null): Promise<UnlockState> {
  const modules = await getModules();
  const completed = userId
    ? await getCompletedLessonPaths(userId)
    : new Set<string>();
  return computeUnlockState(modules, completed);
}
