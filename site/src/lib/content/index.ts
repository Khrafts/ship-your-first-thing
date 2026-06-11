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

/**
 * Map a repo-relative markdown link (resolved against the source file's
 * directory) onto a site route. Anything the site doesn't render falls back
 * to the GitHub blob URL so no internal course link 404s.
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
  if (resolved === "SETUP.md") return `/docs/setup${hash}`;
  if (resolved === "README.md") return `/modules${hash}`;

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

/**
 * Render course markdown to HTML. Mermaid fences stay as
 * `<pre><code class="language-mermaid">` so the client can hydrate them into
 * diagrams (and the source stays readable without JavaScript). Raw HTML
 * (`<details><summary>` disclosures) passes through; headings get slug ids so
 * glossary anchors like #browser resolve.
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
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

/** Drop the first `# ` heading line — pages render their own h1 chrome. */
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s.*\r?\n/m, "");
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

// Promise-level caches: content is immutable for the life of the process
// (the markdown ships with the deploy). Keyed caches keep lesson HTML from
// being re-rendered on every request.
let modulesCache: Promise<ModuleInfo[]> | null = null;
const htmlCache = new Map<string, Promise<string>>();

function cachedHtml(key: string, render: () => Promise<string>): Promise<string> {
  let cached = htmlCache.get(key);
  if (!cached) {
    cached = render();
    htmlCache.set(key, cached);
  }
  return cached;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All content modules in course order (0, 1, 2, 3, 3.5, …). */
export function getModules(): Promise<ModuleInfo[]> {
  if (!modulesCache) {
    modulesCache = loadModules();
  }
  return modulesCache;
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
    renderMarkdown(stripLeadingH1(content), `modules/${moduleSlug}`),
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

/** Module README body (h1 stripped) rendered to HTML. */
export function getModuleReadmeHtml(slug: string): Promise<string> {
  return cachedHtml(`modules/${slug}/README.md`, async () => {
    const raw = await readFile(
      path.join(contentRoot(), "modules", slug, "README.md"),
      "utf8",
    );
    return renderMarkdown(stripLeadingH1(raw), `modules/${slug}`);
  });
}

/** GLOSSARY.md rendered to HTML — `### term` headings become id anchors. */
export function getGlossaryHtml(): Promise<string> {
  return cachedHtml("GLOSSARY.md", async () => {
    const raw = await readFile(path.join(contentRoot(), "GLOSSARY.md"), "utf8");
    return renderMarkdown(stripLeadingH1(raw), "");
  });
}

/** SETUP.md rendered to HTML for /docs/setup. */
export function getSetupHtml(): Promise<string> {
  return cachedHtml("SETUP.md", async () => {
    const raw = await readFile(path.join(contentRoot(), "SETUP.md"), "utf8");
    return renderMarkdown(stripLeadingH1(raw), "");
  });
}
