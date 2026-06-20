// Content loader: reads the canonical course markdown from the repo root
// (../modules, ../GLOSSARY.md, ../SETUP.md relative to site/) and renders it
// to HTML for the site chrome. The markdown itself is read-only — every
// transform here (link rewriting, heading ids) happens at render time so the
// course keeps working on github.com untouched.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { GITHUB_REPO_URL } from "@/lib/copy";
import type { Lesson, LessonMeta, LessonRef, ModuleInfo } from "./types";

export type { Lesson, LessonMeta, LessonRef, ModuleInfo, UpcomingModule } from "./types";
export { UPCOMING_MODULES } from "./types";

/** Repo root holding modules/, GLOSSARY.md, SETUP.md. The site always runs
 *  with cwd = site/ (dev, build, start, Docker), so the parent directory is
 *  the default; CONTENT_ROOT overrides it for unusual layouts. */
function contentRoot(): string {
  const override = process.env.CONTENT_ROOT;
  if (override && override.length > 0) {
    return path.resolve(override);
  }
  return path.resolve(process.cwd(), "..");
}

// ---------------------------------------------------------------------------
// Link rewriting
// ---------------------------------------------------------------------------

/** Raw-content host for the GitHub fallback. Blob URLs serve an HTML page,
 *  so image targets must point at raw.githubusercontent.com instead. */
const GITHUB_RAW_URL = GITHUB_REPO_URL.replace(
  "https://github.com/",
  "https://raw.githubusercontent.com/",
);

const IMAGE_EXTENSION = /\.(?:png|jpe?g|gif|svg|webp)$/i;

/** Root-level docs the site renders at /docs/<slug>: slug → repo-root
 *  filename. GLOSSARY.md (/glossary) and README.md (/modules) have their own
 *  routes and stay out of this table. */
const DOC_FILES: Record<string, string> = {
  setup: "SETUP.md",
  budget: "BUDGET.md",
  cheatsheet: "CHEATSHEET.md",
  "common-issues": "COMMON-ISSUES.md",
  "what-changed": "WHAT-CHANGED.md",
  versions: "VERSIONS.md",
  contributing: "CONTRIBUTING.md",
  licensing: "LICENSING.md",
};

/** Slugs /docs/[slug] statically renders. */
export const DOC_SLUGS = Object.keys(DOC_FILES);

/** Inverse of DOC_FILES: resolved root filename → /docs slug. */
const ROOT_DOC_ROUTES = new Map(
  Object.entries(DOC_FILES).map(([slug, fileName]) => [fileName, slug]),
);

/**
 * Map a repo-relative markdown link (resolved against the source file's
 * directory) onto a site route. Anything the site doesn't render falls back
 * to the GitHub blob URL (raw URL for images) so no internal course link
 * 404s.
 */
export function rewriteUrl(url: string, sourceDir: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(url)) {
    return url; // absolute, protocol-relative, same-page anchor, or site-absolute
  }
  const hashIndex = url.indexOf("#");
  const pathPart = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
  if (pathPart.length === 0) {
    return url;
  }

  const resolved = path.posix.normalize(path.posix.join(sourceDir, pathPart));
  if (resolved.startsWith("..")) {
    return url; // escapes the repo — leave untouched
  }

  if (resolved === "GLOSSARY.md") return `/glossary${hash}`;
  if (resolved === "README.md") return `/modules${hash}`;
  const docSlug = ROOT_DOC_ROUTES.get(resolved);
  if (docSlug) return `/docs/${docSlug}${hash}`;

  const lessonMatch = resolved.match(/^modules\/([^/]+)\/([^/]+)\.md$/);
  if (lessonMatch) {
    const [, moduleSlug, basename] = lessonMatch;
    return basename === "README"
      ? `/modules/${moduleSlug}${hash}`
      : `/modules/${moduleSlug}/${basename}${hash}`;
  }
  const moduleMatch = resolved.match(/^modules\/([^/]+)\/?$/);
  if (moduleMatch) {
    return `/modules/${moduleMatch[1]}${hash}`;
  }

  if (IMAGE_EXTENSION.test(resolved)) {
    return `${GITHUB_RAW_URL}/main/${resolved}${hash}`;
  }
  return `${GITHUB_REPO_URL}/blob/main/${resolved}${hash}`;
}

interface UrlNode {
  url: string;
}

function hasUrl(node: unknown): node is UrlNode {
  return (
    typeof node === "object" &&
    node !== null &&
    "url" in node &&
    typeof (node as UrlNode).url === "string"
  );
}

// ---------------------------------------------------------------------------
// Markdown rendering
// ---------------------------------------------------------------------------

// Minimal structural hast types — the `hast` type package is not directly
// resolvable under the pnpm layout (it is a transitive dep of the rehype
// packages), and these two shapes are all the h1-drop plugin needs.
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { id?: string };
}

interface HastRoot {
  type: string;
  children: HastNode[];
}

/**
 * Remove the document-leading `<h1>` — pages render their own h1 chrome.
 * Runs AFTER rehype-slug so the h1 still participates in heading-id dedup
 * (GitHub suffixes a later identically-slugged heading with `-1`; stripping
 * the h1 from the markdown beforehand made the site's ids diverge). Only a
 * leading h1 is dropped — a `# ` line inside a code fence or a mid-document
 * h1 stays put.
 */
function dropLeadingH1(tree: HastRoot): void {
  for (let i = 0; i < tree.children.length; i += 1) {
    const node = tree.children[i];
    if (
      node.type === "comment" ||
      (node.type === "text" && (node.value ?? "").trim() === "")
    ) {
      continue; // whitespace / comments ahead of the first real block
    }
    if (node.type === "element" && node.tagName === "h1") {
      tree.children.splice(i, 1);
    }
    return;
  }
}

/**
 * Remove the trailing `## Navigation` section. Lessons and module READMEs
 * carry prev/next links in the markdown so the course navigates on
 * github.com, where there is no chrome; the site renders its own prev/next
 * cards, so keeping the section would show navigation twice. The content
 * contract fixes Navigation as the last section, so everything from the
 * `<h2 id="navigation">` to the end of the document goes. Runs after
 * rehype-slug (the id is how the section is found). No-op for documents
 * without that heading (glossary, setup).
 */
function dropNavigationSection(tree: HastRoot): void {
  const index = tree.children.findIndex(
    (node) =>
      node.type === "element" &&
      node.tagName === "h2" &&
      node.properties?.id === "navigation",
  );
  if (index !== -1) {
    tree.children.splice(index);
  }
}

/**
 * Remove the `## Lessons in this module` section from rendered module
 * READMEs: the module page renders its own lock-aware lesson rows, and the
 * README's list links straight to lessons regardless of unlock state. The
 * section is mid-document, so removal stops at the next h2. No-op for
 * documents without the heading.
 */
function dropLessonListSection(tree: HastRoot): void {
  const start = tree.children.findIndex(
    (node) =>
      node.type === "element" &&
      node.tagName === "h2" &&
      node.properties?.id === "lessons-in-this-module",
  );
  if (start === -1) {
    return;
  }
  let end = tree.children.length;
  for (let i = start + 1; i < tree.children.length; i += 1) {
    const node = tree.children[i];
    if (node.type === "element" && node.tagName === "h2") {
      end = i;
      break;
    }
  }
  tree.children.splice(start, end - start);
}

/**
 * Render course markdown to HTML. Mermaid fences stay as
 * `<pre><code class="language-mermaid">` so the client can hydrate them into
 * diagrams (and the source stays readable without JavaScript). Raw HTML
 * (`<details><summary>` disclosures) passes through; headings get slug ids so
 * glossary anchors like #browser resolve. The leading h1 is dropped post-slug
 * (see dropLeadingH1) because pages render their own h1 chrome.
 */
async function renderMarkdown(markdown: string, sourceDir: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      visit(tree, ["link", "image", "definition"], (node) => {
        if (hasUrl(node)) {
          node.url = rewriteUrl(node.url, sourceDir);
        }
      });
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(() => (tree) => {
      dropLeadingH1(tree as unknown as HastRoot);
      dropNavigationSection(tree as unknown as HastRoot);
      dropLessonListSection(tree as unknown as HastRoot);
    })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

// ---------------------------------------------------------------------------
// Module / lesson discovery
// ---------------------------------------------------------------------------

function padLessonNumber(raw: unknown): string {
  return String(raw ?? "").padStart(2, "0");
}

function toStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => String(item));
}

interface ParsedFrontmatter {
  title: string;
  module: string;
  lessonNumber: string;
  estMinutes: number;
  prereqs: string[];
  updated: string;
  deviations: string[];
}

function parseFrontmatter(data: Record<string, unknown>, fallbackModule: string): ParsedFrontmatter {
  return {
    title: String(data.title ?? ""),
    module: String(data.module ?? fallbackModule),
    lessonNumber: padLessonNumber(data.lesson_number),
    estMinutes: Number(data.est_minutes ?? 0),
    prereqs: toStringArray(data.prereqs),
    updated: String(data.updated ?? ""),
    deviations: toStringArray(data.deviations),
  };
}

function firstSentence(paragraph: string): string {
  const match = paragraph.match(/^[\s\S]+?[.!?](?=\s|$)/);
  return (match ? match[0] : paragraph).replace(/\s+/g, " ").trim();
}

/** Title (h1) and one-line description (first sentence after the h1). */
function parseModuleReadme(markdown: string): { title: string; description: string } {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const afterTitle = titleMatch
    ? markdown.slice((titleMatch.index ?? 0) + titleMatch[0].length)
    : markdown;
  const paragraph = afterTitle
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#"));
  return { title, description: paragraph ? firstSentence(paragraph) : "" };
}

async function loadModule(slug: string): Promise<ModuleInfo> {
  const moduleDir = path.join(contentRoot(), "modules", slug);
  const readme = await readFile(path.join(moduleDir, "README.md"), "utf8");
  const { title, description } = parseModuleReadme(readme);

  const entries = await readdir(moduleDir, { withFileTypes: true });
  const lessonFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^\d[\d.]*-.+\.md$/.test(name))
    .sort();

  const lessons: LessonRef[] = [];
  for (const fileName of lessonFiles) {
    const raw = await readFile(path.join(moduleDir, fileName), "utf8");
    const { data } = matter(raw);
    const meta = parseFrontmatter(data, slug);
    lessons.push({
      moduleSlug: slug,
      lessonSlug: fileName.replace(/\.md$/, ""),
      path: `modules/${slug}/${fileName}`,
      title: meta.title,
      estMinutes: meta.estMinutes,
      lessonNumber: meta.lessonNumber,
    });
  }

  const number = Number.parseFloat(slug);
  return {
    slug,
    number: Number.isNaN(number) ? 0 : number,
    title,
    shortTitle: title.replace(/^Module\s+[\d.]+\s+—\s+/, ""),
    description,
    lessonCount: lessons.length,
    totalMinutes: lessons.reduce((sum, lesson) => sum + lesson.estMinutes, 0),
    lessons,
  };
}

async function loadModules(): Promise<ModuleInfo[]> {
  const modulesDir = path.join(contentRoot(), "modules");
  const entries = await readdir(modulesDir, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && /^\d/.test(entry.name))
    .map((entry) => entry.name);
  const modules = await Promise.all(slugs.map((slug) => loadModule(slug)));
  modules.sort((a, b) => a.number - b.number);
  return modules;
}

// Promise-level caches: in production the content is immutable for the life
// of the process (the markdown ships with the deploy), so keyed caches keep
// lesson HTML from being re-rendered on every request. In development both
// caches are bypassed so markdown edits show on reload. Rejected promises are
// evicted so one transient fs error doesn't poison the route until restart.
let modulesCache: Promise<ModuleInfo[]> | null = null;
const htmlCache = new Map<string, Promise<string>>();

function cachedHtml(key: string, render: () => Promise<string>): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    return render();
  }
  let cached = htmlCache.get(key);
  if (!cached) {
    cached = render();
    cached.catch(() => {
      htmlCache.delete(key);
    });
    htmlCache.set(key, cached);
  }
  return cached;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All content modules in course order (0, 1, 2, 3, 3.5, …). */
export function getModules(): Promise<ModuleInfo[]> {
  if (process.env.NODE_ENV === "development") {
    return loadModules();
  }
  let cached = modulesCache;
  if (!cached) {
    cached = loadModules();
    cached.catch(() => {
      modulesCache = null;
    });
    modulesCache = cached;
  }
  return cached;
}

export async function getModule(slug: string): Promise<ModuleInfo | null> {
  const modules = await getModules();
  return modules.find((mod) => mod.slug === slug) ?? null;
}

/** Every lesson in course order — the canonical lesson_path universe. */
export async function getAllLessonRefs(): Promise<LessonRef[]> {
  const modules = await getModules();
  return modules.flatMap((mod) => mod.lessons);
}

/** Full lesson: rendered HTML plus prev/next in course order. */
export async function getLesson(
  moduleSlug: string,
  lessonSlug: string,
): Promise<Lesson | null> {
  const allLessons = await getAllLessonRefs();
  const index = allLessons.findIndex(
    (lesson) => lesson.moduleSlug === moduleSlug && lesson.lessonSlug === lessonSlug,
  );
  if (index === -1) {
    return null;
  }
  const ref = allLessons[index];

  const filePath = path.join(contentRoot(), ref.path);
  const raw = await readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = parseFrontmatter(data, moduleSlug);

  const html = await cachedHtml(ref.path, () =>
    renderMarkdown(content, `modules/${moduleSlug}`),
  );

  const meta: LessonMeta = {
    title: parsed.title,
    module: parsed.module,
    lessonNumber: parsed.lessonNumber,
    estMinutes: parsed.estMinutes,
    prereqs: parsed.prereqs,
    updated: parsed.updated,
    deviations: parsed.deviations,
  };

  return {
    ...ref,
    meta,
    html,
    prev: index > 0 ? allLessons[index - 1] : null,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}

/** Hard cap on lesson text sent to the chat model (keeps the prompt bounded). */
export const LESSON_CONTEXT_CAP = 12_000;

/**
 * Lesson title + raw markdown body for the chat tutor's context. Validates the
 * path against the lesson allowlist (so the chat can never read arbitrary
 * files), strips frontmatter, and caps the body length. Returns null for
 * unknown paths.
 */
export async function getLessonContext(
  lessonPath: string,
): Promise<{ title: string; body: string } | null> {
  const refs = await getAllLessonRefs();
  const ref = refs.find((r) => r.path === lessonPath);
  if (!ref) {
    return null;
  }
  const raw = await readFile(path.join(contentRoot(), ref.path), "utf8");
  const { data, content } = matter(raw);
  const title = String(data.title ?? ref.title ?? "").trim();
  const body = content.trim().slice(0, LESSON_CONTEXT_CAP);
  return { title, body };
}

/** Module README body (h1 stripped) rendered to HTML. */
export function getModuleReadmeHtml(slug: string): Promise<string> {
  return cachedHtml(`modules/${slug}/README.md`, async () => {
    const raw = await readFile(
      path.join(contentRoot(), "modules", slug, "README.md"),
      "utf8",
    );
    return renderMarkdown(raw, `modules/${slug}`);
  });
}

/** GLOSSARY.md rendered to HTML — `### term` headings become id anchors. */
export function getGlossaryHtml(): Promise<string> {
  return cachedHtml("GLOSSARY.md", async () => {
    const raw = await readFile(path.join(contentRoot(), "GLOSSARY.md"), "utf8");
    return renderMarkdown(raw, "");
  });
}

/**
 * Root doc (SETUP.md, BUDGET.md, …) rendered to HTML for /docs/[slug]. The
 * title comes from the doc's leading h1 — the render pipeline drops that h1
 * from the body, so it has to be read off the raw markdown first. Returns
 * null for slugs outside the DOC_FILES whitelist. The rendered HTML stays
 * cached per file; the raw read for the title is cheap by comparison.
 */
export async function getDocHtml(
  slug: string,
): Promise<{ title: string; html: string } | null> {
  const fileName = DOC_FILES[slug];
  if (!fileName) {
    return null;
  }
  const raw = await readFile(path.join(contentRoot(), fileName), "utf8");
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;
  const html = await cachedHtml(fileName, () => renderMarkdown(raw, ""));
  return { title, html };
}
