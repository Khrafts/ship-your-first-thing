// Progression model, shaped around the build-first entry (Module 0 Lesson 6
// "Build your first thing") and the practical route it closes with:
//
//   Module 0 (all open) → Module 2 Lesson 3 (save) → Module 3 (the loop) →
//   Module 4 → …, with Module 1 and Module 2 Lessons 1–2 read on demand.
//
// Concretely:
//
// 1. Module 0 is open to everyone, signed in or not. A visitor can install the
//    agent app and build their first page without an account; signing in only
//    adds progress tracking.
// 2. On-demand lessons — all of Module 1 (mental models) and Module 2 Lessons
//    1–2 (agent failure modes, the engine room) — are always readable and
//    never gate anything.
// 3. Everything else forms the gating chain, in flat course order:
//    M0 L1 … M0 L6 → M2 L3 → M3 L1 → … A chain lesson is viewable when it is
//    the first in the chain, when the previous chain lesson is complete, or
//    when it is itself already complete (un-completing an earlier lesson must
//    not lock content the learner has finished). So completing Module 0's last
//    lesson unlocks Module 2 Lesson 3 directly, and completing that unlocks
//    Module 3's first lesson.
//
// A module is unlocked when its first lesson is. Locking is pacing, not
// secrecy — the canonical markdown is public on github.com.

import { getModules } from "@/lib/content";
import type { LessonRef, ModuleInfo } from "@/lib/content/types";
import { getCompletedLessonPaths } from "@/lib/progress";
import { chainLessons, chainPredecessor, isOnDemand, OPEN_MODULES } from "@/lib/route";

export { ON_DEMAND_LESSONS, ON_DEMAND_MODULES, OPEN_MODULES } from "@/lib/route";

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
  const unlockedLessons = new Set<string>();

  // Always-open lessons: open modules and on-demand lessons.
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (OPEN_MODULES.has(mod.slug) || isOnDemand(mod.slug, lesson.path)) {
        unlockedLessons.add(lesson.path);
      }
    }
  }

  // Sequential chain over the gating lessons.
  const chain = chainLessons(modules);
  for (let i = 0; i < chain.length; i += 1) {
    const lessonPath = chain[i].path;
    if (
      i === 0 ||
      completed.has(chain[i - 1].path) ||
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

/**
 * The lesson whose completion unlocks `lessonPath` — the previous lesson in
 * the gating chain (which skips on-demand lessons), or null for the first
 * chain lesson and for always-open / on-demand lessons. Used by the locked
 * card and the "next" hint, which must not name the flat-order neighbour
 * when that neighbour isn't the gate (Module 2 Lesson 3's gate is Module 0
 * Lesson 6, not Module 2 Lesson 2).
 */
export function gatingLesson(
  modules: ModuleInfo[],
  lessonPath: string,
): LessonRef | null {
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (lesson.path !== lessonPath) continue;
      if (OPEN_MODULES.has(mod.slug) || isOnDemand(mod.slug, lesson.path)) {
        return null;
      }
    }
  }
  return chainPredecessor(modules, lessonPath);
}

/** Unlock state for the current viewer; userId null = signed out (no progress). */
export async function getUnlockState(userId: string | null): Promise<UnlockState> {
  const modules = await getModules();
  const completed = userId
    ? await getCompletedLessonPaths(userId)
    : new Set<string>();
  return computeUnlockState(modules, completed);
}
