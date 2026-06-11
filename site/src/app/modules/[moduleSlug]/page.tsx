import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getModule, getModuleReadmeHtml } from "@/lib/content";
import { formatMinutes, moduleLabel } from "@/lib/format";
import { getCompletedLessonPaths } from "@/lib/progress";

// Reads the session cookie for completion checkmarks — render per request.
export const dynamic = "force-dynamic";

interface ModulePageProps {
  params: Promise<{ moduleSlug: string }>;
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = await getModule(moduleSlug);
  return { title: mod ? mod.title : "Module not found" };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleSlug } = await params;
  const mod = await getModule(moduleSlug);
  if (!mod) {
    notFound();
  }

  const [readmeHtml, session] = await Promise.all([
    getModuleReadmeHtml(mod.slug),
    auth(),
  ]);
  const completedPaths = session?.user?.id
    ? await getCompletedLessonPaths(session.user.id)
    : new Set<string>();

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <nav className="font-sans text-sm text-ink-faint">
          <Link
            href="/modules"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            ← All modules
          </Link>
        </nav>

        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-ink-faint">
          {moduleLabel(mod.number)} · {mod.lessonCount} lessons ·{" "}
          {formatMinutes(mod.totalMinutes)}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink">
          {mod.shortTitle}
        </h1>

        <h2 className="mt-12 font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
          Lessons
        </h2>
        <ol className="mt-4 divide-y divide-line rounded-lg border border-line">
          {mod.lessons.map((lesson) => {
            const completed = completedPaths.has(lesson.path);
            return (
              <li key={lesson.path}>
                <Link
                  href={`/modules/${lesson.moduleSlug}/${lesson.lessonSlug}`}
                  className="group flex items-baseline gap-4 px-5 py-4"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-ink-faint">
                    {completed ? "✓" : lesson.lessonNumber}
                  </span>
                  <span className="font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                    {lesson.title}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-xs text-ink-faint">
                    {formatMinutes(lesson.estMinutes)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 border-t border-line pt-10">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </div>
      </div>
    </div>
  );
}
