// Lesson-page shell: puts the desktop module sidebar to the left of the
// lesson article. The lesson page keeps its own max-w-3xl centering inside
// the flex-1 column; below lg the sidebar is hidden and the layout collapses
// to the page content alone.

import type { ReactNode } from "react";
import { auth } from "@/auth";
import { ModuleSidebar } from "@/components/module-sidebar";
import { getModule } from "@/lib/content";
import { getUnlockState } from "@/lib/unlock";

interface LessonLayoutProps {
  children: ReactNode;
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export default async function LessonLayout({
  children,
  params,
}: LessonLayoutProps) {
  const { moduleSlug, lessonSlug } = await params;
  const [mod, session] = await Promise.all([getModule(moduleSlug), auth()]);

  // Unknown module: render the page alone — it calls notFound() itself.
  if (!mod) {
    return children;
  }

  const userId = session?.user?.id ?? null;
  const unlock = await getUnlockState(userId);

  return (
    <div className="mx-auto flex max-w-6xl">
      <ModuleSidebar
        module={mod}
        currentLessonSlug={lessonSlug}
        unlock={unlock}
        signedIn={userId !== null}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
