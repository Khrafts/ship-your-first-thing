import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getModules, UPCOMING_MODULES } from "@/lib/content";
import { formatMinutes, moduleLabel } from "@/lib/format";
import { getModuleProgressMap, type ProgressSummary } from "@/lib/progress";
import { getUnlockState } from "@/lib/unlock";

// Reads the session cookie for per-module progress — render per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modules",
};

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="6.5" rx="1" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export default async function ModulesPage() {
  const [modules, session] = await Promise.all([getModules(), auth()]);
  const userId = session?.user?.id ?? null;
  const [unlock, progressMap] = await Promise.all([
    getUnlockState(userId),
    userId
      ? getModuleProgressMap(userId, modules)
      : Promise.resolve<Map<string, ProgressSummary> | null>(null),
  ]);

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Modules</h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          The course in order. Each module builds on the one before it —
          start at Module 0 unless you know what you&apos;re skipping.
        </p>
        {!userId && (
          <p className="mt-3 font-sans text-sm text-ink-faint">
            <Link
              href="/signin"
              className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              Sign in
            </Link>{" "}
            to track which lessons you&apos;ve completed.
          </p>
        )}

        <ol className="mt-12 space-y-6">
          {modules.map((mod) => {
            const progress = progressMap?.get(mod.slug) ?? null;
            const unlocked = unlock.unlockedModules.has(mod.slug);

            if (!unlocked) {
              return (
                <li key={mod.slug}>
                  <div
                    aria-disabled="true"
                    className="block rounded-lg border border-line p-6"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                        {moduleLabel(mod.number)}
                      </p>
                      <p className="font-mono text-xs text-ink-faint">
                        {mod.lessonCount} lessons · {formatMinutes(mod.totalMinutes)}
                      </p>
                    </div>
                    <h2 className="mt-2 font-serif text-2xl text-ink-secondary">
                      {mod.shortTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                      {mod.description}
                    </p>
                    <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-ink-faint">
                      <LockIcon />
                      locked — complete the previous module
                    </p>
                  </div>
                </li>
              );
            }

            return (
              <li key={mod.slug}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className="group block rounded-lg border border-line p-6 transition-colors duration-150 hover:border-line-strong"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                      {moduleLabel(mod.number)}
                    </p>
                    <p className="font-mono text-xs text-ink-faint">
                      {mod.lessonCount} lessons · {formatMinutes(mod.totalMinutes)}
                    </p>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                    {mod.shortTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {mod.description}
                  </p>
                  {progress && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between font-mono text-xs text-ink-faint">
                        <span>
                          {progress.completed} of {progress.total} complete
                        </span>
                        <span>{progress.percent}%</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-surface-raised">
                        <div
                          className="h-1 rounded-full bg-ink transition-all duration-200"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>

        <h2 className="mt-16 font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
          Coming later
        </h2>
        <ol className="mt-4 divide-y divide-line">
          {UPCOMING_MODULES.map((mod) => (
            <li
              key={mod.number}
              className="flex items-baseline gap-6 py-4"
            >
              <span className="w-24 shrink-0 font-mono text-sm text-ink-faint">
                {moduleLabel(mod.number)}
              </span>
              <span className="font-serif text-lg text-ink-faint">
                {mod.shortTitle}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
