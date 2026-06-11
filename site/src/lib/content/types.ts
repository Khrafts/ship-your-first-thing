// Shared content contract. The course markdown under ../modules/ is the
// canonical source (it must keep working on github.com); everything here is
// read-only chrome around it.

export interface LessonMeta {
  title: string;
  /** Parent module slug, e.g. "01-mental-models" or "03.5-reading-code". */
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
}

export interface ModuleInfo {
  slug: string;
  /** Numeric module order — 0, 1, 2, 3, 3.5 — parsed as a decimal. */
  number: number;
  /** Full README h1, e.g. "Module 3.5 — Reading code, just enough". */
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
  { number: 4, shortTitle: "Designing & building the thread project" },
  { number: 5, shortTitle: "Operating the build" },
  { number: 6, shortTitle: "After it's live" },
  { number: 7, shortTitle: "Where to go from here" },
];
