// Shared content contract. The course markdown under ../modules/ is the
// canonical source (it must keep working on github.com); everything here is
// read-only chrome around it.

export interface LessonMeta {
  title: string;
  /** Parent module slug, e.g. "01-mental-models" or "04-thread-project". */
  module: string;
  /** Zero-padded string ("01".."06") — YAML may parse `01` as the number 1,
   *  so loaders must normalize back to the padded string form. */
  lessonNumber: string;
  estMinutes: number;
  /** Lesson basename slugs, possibly from earlier modules ("04-how-it-goes-live"). */
  prereqs: string[];
  /** ISO date string, e.g. "2026-05-16". */
  updated: string;
  deviations: string[];
  /** Optional repo-relative path of the lesson the course recommends as the
   *  practical next step when it differs from flat course order (the
   *  `next_practical` front-matter key, e.g. Module 0 Lesson 6 → Module 2
   *  Lesson 3). */
  nextPractical: string | null;
}

export interface LessonRef {
  moduleSlug: string;
  /** Lesson file basename without extension, e.g. "01-how-the-web-works". */
  lessonSlug: string;
  /** Repo-relative markdown path — the canonical lesson_path progress key,
   *  e.g. "modules/01-mental-models/01-how-the-web-works.md". */
  path: string;
  title: string;
  estMinutes: number;
  lessonNumber: string;
}

export interface Lesson extends LessonRef {
  meta: LessonMeta;
  /** Lesson body rendered to HTML (frontmatter stripped, links rewritten). */
  html: string;
  prev: LessonRef | null;
  next: LessonRef | null;
  /** Resolved `next_practical` target, when the front-matter names one that
   *  exists; rendered as a prominent card beside the sequential prev/next. */
  nextPractical: LessonRef | null;
}

export interface ModuleInfo {
  slug: string;
  /** Numeric module order — 0, 1, 2, 3, 4 — parsed as a decimal, so a
   *  fractional slug (the retired "03.5-reading-code") still sorts correctly. */
  number: number;
  /** Full README h1, e.g. "Module 2 — Your agent and the machinery it drives". */
  title: string;
  /** Title without the "Module N — " prefix. */
  shortTitle: string;
  /** One-line description derived from the module README. */
  description: string;
  lessonCount: number;
  totalMinutes: number;
  lessons: LessonRef[];
}

/** Modules named in the course README that have no content directory yet. */
export interface UpcomingModule {
  number: number;
  shortTitle: string;
}

export const UPCOMING_MODULES: UpcomingModule[] = [
  { number: 5, shortTitle: "Operating the build" },
  { number: 6, shortTitle: "After it's live" },
  { number: 7, shortTitle: "Where to go from here" },
];
