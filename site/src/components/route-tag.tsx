// Small mono label that says whether a module or lesson is on the practical
// route or is reference read on demand. Pure markup; used by the catalog, the
// module landing, the lesson header and the sidebar so the wording is the
// same everywhere.

import type { LessonRole, ModuleRole } from "@/lib/route";

const LABELS: Record<LessonRole | ModuleRole, string> = {
  route: "On the route",
  reference: "Reference · read any time",
  mixed: "Route + reference",
};

export function routeTagLabel(role: LessonRole | ModuleRole): string {
  return LABELS[role];
}

export function RouteTag({
  role,
  label,
  className = "",
}: {
  role: LessonRole | ModuleRole;
  /** Override the default wording (e.g. "Route via Lesson 3" for Module 2). */
  label?: string;
  className?: string;
}) {
  const tone =
    role === "reference"
      ? "text-ink-faint"
      : "text-ink-secondary";
  return (
    <span
      data-route-role={role}
      className={`font-mono text-xs uppercase tracking-wider ${tone} ${className}`}
    >
      {label ?? LABELS[role]}
    </span>
  );
}
