// The course's practical route, as data. Shared by the unlock model
// (src/lib/unlock.ts), the resume picker (src/lib/progress.ts) and the
// catalog / module / lesson pages, so every surface agrees on which lessons
// gate, which are on-demand reference, and what the learner's next step is.
// Pure — no db, no markdown pipeline.
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
 * The chain lesson immediately before `lessonPath` — null for the first chain
 * lesson and for lessons that are not on the chain at all. The unlock model
 * treats this as the gate (see gatingLesson in src/lib/unlock.ts).
 */
export function chainPredecessor(
  modules: ModuleInfo[],
  lessonPath: string,
): LessonRef | null {
  const chain = chainLessons(modules);
  const index = chain.findIndex((lesson) => lesson.path === lessonPath);
  return index > 0 ? chain[index - 1] : null;
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

// ---------------------------------------------------------------------------
// Route vs. reference — what the pages label and how they point ahead
// ---------------------------------------------------------------------------

/** "route": on the practical route (gates the next step). "reference": read
 *  on demand, never a prerequisite. */
export type LessonRole = "route" | "reference";

export function lessonRole(moduleSlug: string, lessonPath: string): LessonRole {
  return isOnDemand(moduleSlug, lessonPath) ? "reference" : "route";
}

/** "mixed": some lessons are reference and some are on the route (Module 2). */
export type ModuleRole = "route" | "reference" | "mixed";

export function moduleRole(mod: ModuleInfo): ModuleRole {
  const roles = new Set(mod.lessons.map((lesson) => lessonRole(mod.slug, lesson.path)));
  if (roles.size === 2) return "mixed";
  return roles.has("reference") ? "reference" : "route";
}

/**
 * The lesson after `lessonPath` on the practical route: the next chain
 * lesson, skipping reference material (Module 0 Lesson 6 → Module 2 Lesson 3,
 * not Module 1 Lesson 1). Null for reference lessons and for the last lesson
 * on the route.
 */
export function nextRouteLesson(
  modules: ModuleInfo[],
  lessonPath: string,
): LessonRef | null {
  const chain = chainLessons(modules);
  const index = chain.findIndex((lesson) => lesson.path === lessonPath);
  return index >= 0 && index < chain.length - 1 ? chain[index + 1] : null;
}

/**
 * The first incomplete lesson on the practical route, or null once the whole
 * route is complete. Unlike pickResumeLesson this never falls back to
 * reference material, so a surface that says "your route continues at" can
 * only ever name a route lesson.
 */
export function nextRouteStep(
  modules: ModuleInfo[],
  completed: Set<string>,
): LessonRef | null {
  return chainLessons(modules).find((lesson) => !completed.has(lesson.path)) ?? null;
}

export function isRouteComplete(modules: ModuleInfo[], completed: Set<string>): boolean {
  return nextRouteStep(modules, completed) === null;
}

/**
 * Whether this learner has completed at least one lesson on the practical
 * route. This — not "has completed anything" — is what decides between
 * "Start here / the practical route starts at" and "Your next step / your
 * route continues at": completing only reference material (Module 1, Module
 * 2 Lessons 1–2) is not progress along the route, and a surface must not
 * say the route "continues" when it has not been started.
 */
export function hasRouteProgress(modules: ModuleInfo[], completed: Set<string>): boolean {
  return chainLessons(modules).some((lesson) => completed.has(lesson.path));
}

/**
 * How a lesson page points the learner ahead:
 *
 * - on a route lesson, the next route lesson ("next-step");
 * - on a reference lesson, the lesson to return to ("return") — the first
 *   incomplete route lesson for this learner's progress, so a signed-in
 *   reader who opened Module 1 from Module 4 is sent back to Module 4, and a
 *   visitor with no progress is sent to the start of the route.
 *
 * Null at the end of the route, and on a reference lesson once the route is
 * complete — there is no route step left to return to, and another unread
 * reference lesson must not be dressed up as one.
 */
export type RoutePointer =
  | { kind: "next-step"; lesson: LessonRef }
  | { kind: "return"; lesson: LessonRef };

export function routePointer(
  modules: ModuleInfo[],
  moduleSlug: string,
  lessonPath: string,
  completed: Set<string>,
): RoutePointer | null {
  if (lessonRole(moduleSlug, lessonPath) === "reference") {
    const lesson = nextRouteStep(modules, completed);
    return lesson ? { kind: "return", lesson } : null;
  }
  const lesson = nextRouteLesson(modules, lessonPath);
  return lesson ? { kind: "next-step", lesson } : null;
}

/**
 * Where a module joins the practical route: its first route lesson and the
 * lesson whose completion opens it. Null for an all-reference module. The
 * gate is null when the entry is the very start of the route (Module 0).
 *
 * This is what the catalog and module landing name instead of "the previous
 * module": Module 3 opens after Module 2 Lesson 3, not after "Module 2".
 */
export interface RouteEntry {
  entry: LessonRef;
  gate: LessonRef | null;
}

export function routeEntry(modules: ModuleInfo[], mod: ModuleInfo): RouteEntry | null {
  const entry = mod.lessons.find((lesson) => lessonRole(mod.slug, lesson.path) === "route");
  if (!entry) return null;
  return { entry, gate: chainPredecessor(modules, entry.path) };
}

/**
 * The route as a short sequence of stops for the catalog: a whole module
 * when every lesson in it is on the route, otherwise the individual route
 * lessons (Module 2 contributes only Lesson 3). Reference modules are
 * omitted — they are read on demand, not walked in order.
 */
export type RouteStop =
  | { kind: "module"; module: ModuleInfo }
  | { kind: "lesson"; module: ModuleInfo; lesson: LessonRef };

export function routeStops(modules: ModuleInfo[]): RouteStop[] {
  const stops: RouteStop[] = [];
  for (const mod of modules) {
    const role = moduleRole(mod);
    if (role === "reference") continue;
    if (role === "route") {
      stops.push({ kind: "module", module: mod });
      continue;
    }
    for (const lesson of mod.lessons) {
      if (lessonRole(mod.slug, lesson.path) === "route") {
        stops.push({ kind: "lesson", module: mod, lesson });
      }
    }
  }
  return stops;
}
