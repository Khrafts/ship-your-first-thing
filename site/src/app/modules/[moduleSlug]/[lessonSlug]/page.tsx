import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { LessonArticle } from "@/components/lesson-article";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { getLesson, getModule } from "@/lib/content";
import { formatDateUtc, formatMinutes } from "@/lib/format";
import { getCompletedLessonPaths } from "@/lib/progress";

// Reads the session cookie for the completion toggle — render per request.
export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = await getLesson(moduleSlug, lessonSlug);
  return { title: lesson ? lesson.title : "Lesson not found" };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = await getLesson(moduleSlug, lessonSlug);
  if (!lesson) {
    notFound();
  }

  const [session, mod] = await Promise.all([
    auth(),
    getModule(lesson.moduleSlug),
  ]);
  const userId = session?.user?.id;
  const completed = userId
    ? (await getCompletedLessonPaths(userId)).has(lesson.path)
    : false;

  return (
    <div className="px-6">
      <article className="mx-auto max-w-3xl py-16">
        <nav className="font-sans text-sm text-ink-faint">
          <Link
            href={`/modules/${lesson.moduleSlug}`}
            className="-my-3 inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            ← {mod?.shortTitle ?? lesson.moduleSlug}
          </Link>
        </nav>

        <header className="mt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Lesson {lesson.lessonNumber} · {formatMinutes(lesson.estMinutes)}
            {lesson.meta.updated && ` · updated ${formatDateUtc(lesson.meta.updated)}`}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight text-ink">
            {lesson.title}
          </h1>
        </header>

        <div className="mt-10">
          <LessonArticle html={lesson.html} />
        </div>

        <div className="mt-14 border-t border-line pt-8">
          {userId ? (
            <LessonCompleteButton
              lessonPath={lesson.path}
              initialCompleted={completed}
            />
          ) : (
            <p className="font-sans text-sm text-ink-secondary">
              <Link
                href="/signin"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
              >
                Sign in
              </Link>{" "}
              to track your progress through the course.
            </p>
          )}
        </div>

        <nav className="mt-10 flex flex-col gap-4 border-t border-line pt-8 font-sans text-sm sm:flex-row sm:justify-between">
          {lesson.prev ? (
            <Link
              href={`/modules/${lesson.prev.moduleSlug}/${lesson.prev.lessonSlug}`}
              className="group max-w-xs"
            >
              <span className="text-ink-faint">← Previous</span>
              <span className="mt-1 block text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                {lesson.prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {lesson.next ? (
            <Link
              href={`/modules/${lesson.next.moduleSlug}/${lesson.next.lessonSlug}`}
              className="group max-w-xs sm:text-right"
            >
              <span className="text-ink-faint">Next →</span>
              <span className="mt-1 block text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                {lesson.next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
