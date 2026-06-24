import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getModules } from "@/lib/content";
import { getResumeLesson } from "@/lib/progress";

// Where "Take the course →" sends a visitor, decided per request:
//   signed out       → /signup
//   signed in        → the next incomplete lesson (resume where you are)
//   signed in, done  → /modules (the course index)
//
// Isolating this here keeps the landing page (/) static and cacheable — only
// this tiny endpoint reads the session, so the marketing page never has to.
export const dynamic = "force-dynamic";

export default async function ContinuePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/signup");
  }

  const modules = await getModules();
  const resume = await getResumeLesson(userId, modules);
  redirect(
    resume ? `/modules/${resume.moduleSlug}/${resume.lessonSlug}` : "/modules",
  );
}
