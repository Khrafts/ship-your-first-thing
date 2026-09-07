// The course's practical route, as data. Shared by the unlock model
// (src/lib/unlock.ts) and the resume picker (src/lib/progress.ts) so both
// agree on which lessons gate and which are on-demand reference. Pure —
// no db, no markdown pipeline.
//
//   Module 0 (all open) → Module 2 Lesson 3 (save) → Module 3 (the loop) →
//   Module 4 → …, with Module 1 and Module 2 Lessons 1–2 read on demand.

import type { LessonRef, ModuleInfo } from "@/lib/content/types";

/** Modules open to every visitor, signed in or not, regardless of progress. */
export const OPEN_MODULES: ReadonlySet<string> = new Set(["00-welcome"]);

/** Modules that are always readable and never gate a later lesson. */
export const ON_DEMAND_MODULES: ReadonlySet<string> = new Set(["01-mental-models"]);

/** Individual lessons (lesson_path) that are always readable and never gate. */
export const ON_DEMAND_LESSONS: ReadonlySet<string> = new Set([
  "modules/02-toolchain/01-your-ai-coding-agent.md",
  "modules/02-toolchain/02-the-engine-room.md",
]);

export function isOnDemand(moduleSlug: string, lessonPath: string): boolean {
  return ON_DEMAND_MODULES.has(moduleSlug) || ON_DEMAND_LESSONS.has(lessonPath);
}

/** The gating chain: every lesson that is not on-demand, in flat course order. */
export function chainLessons(modules: ModuleInfo[]): LessonRef[] {
  return modules.flatMap((mod) =>
    mod.lessons.filter((lesson) => !isOnDemand(mod.slug, lesson.path)),
  );
}

/**
 * Where "Resume" should send a learner: the first incomplete lesson on the
 * practical route (the gating chain). Only when the whole chain is complete
 * does it fall back to the first incomplete on-demand lesson, so reference
 * material never pulls a learner back off the route but is still offered
 * once the route is done. Null when everything is complete.
 */
export function pickResumeLesson(
  modules: ModuleInfo[],
  completed: Set<string>,
): LessonRef | null {
  for (const lesson of chainLessons(modules)) {
    if (!completed.has(lesson.path)) return lesson;
  }
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completed.has(lesson.path)) return lesson;
    }
  }
  return null;
}
