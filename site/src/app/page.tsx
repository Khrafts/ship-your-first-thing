import Link from "next/link";
import ShipGameHero from "@/components/ship-game/ShipGameHero";
import { getModules, UPCOMING_MODULES } from "@/lib/content";
import { TAGLINE } from "@/lib/copy";
import { formatMinutes, moduleLabel } from "@/lib/format";

export default async function Home() {
  const modules = await getModules();
  const totalMinutes = modules.reduce((sum, mod) => sum + mod.totalMinutes, 0);
  const lessonCount = modules.reduce((sum, mod) => sum + mod.lessonCount, 0);

  return (
    <div className="px-6">
      {/* Mini arcade — sits above the hero copy, never replacing it */}
      <ShipGameHero />

      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-10 pb-20 sm:pt-12">
        <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-ink sm:text-6xl">
          Ship your first thing.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink-secondary">
          {TAGLINE}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/modules"
            className="inline-flex h-11 items-center rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary"
          >
            Start the course →
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink"
          >
            Create an account
          </Link>
        </div>
        <p className="mt-6 font-mono text-xs text-ink-faint">
          {modules.length} modules live · {lessonCount} lessons ·{" "}
          {formatMinutes(totalMinutes)} of reading · free and open source
        </p>
      </section>

      {/* How the course works */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl py-16">
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
            How the course works
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-sm text-ink-faint">01</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Build the mental models
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Plain-language lessons on how the web, data, access, and
                deployment fit together — no prior code required.
              </p>
            </div>
            <div>
              <p className="font-mono text-sm text-ink-faint">02</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Work the loop with an AI agent
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                State your intent, read what the agent did, and steer. The
                agent writes the code; you stay in charge of the outcome.
              </p>
            </div>
            <div>
              <p className="font-mono text-sm text-ink-faint">03</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Recover when it goes wrong
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                AI tools fail in predictable ways. You learn to spot the
                failure, name it, and get back on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module list */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
              The curriculum
            </h2>
            <Link
              href="/modules"
              className="font-sans text-sm text-ink-secondary underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              All modules →
            </Link>
          </div>
          <ol className="mt-8 divide-y divide-line">
            {modules.map((mod) => (
              <li key={mod.slug}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-28 shrink-0 font-mono text-sm text-ink-faint">
                    {moduleLabel(mod.number)}
                  </span>
                  <span className="font-serif text-lg text-ink transition-colors duration-150 group-hover:text-ink-secondary">
                    {mod.shortTitle}
                  </span>
                  <span className="font-mono text-xs text-ink-faint sm:ml-auto">
                    {mod.lessonCount} lessons · {formatMinutes(mod.totalMinutes)}
                  </span>
                </Link>
              </li>
            ))}
            {UPCOMING_MODULES.map((mod) => (
              <li
                key={mod.number}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-28 shrink-0 font-mono text-sm text-ink-faint">
                  {moduleLabel(mod.number)}
                </span>
                <span className="font-serif text-lg text-ink-faint">
                  {mod.shortTitle}
                </span>
                <span className="font-mono text-xs text-ink-faint sm:ml-auto">
                  coming later
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cohorts */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl py-16 pb-24">
          <h2 className="font-serif text-2xl text-ink">
            Self-paced, with company if you want it
          </h2>
          <p className="mt-4 leading-relaxed text-ink-secondary">
            Every lesson works on its own schedule. Cohorts add one live call
            per module for people who want to move through the course
            together.
          </p>
          <Link
            href="/cohorts"
            className="mt-6 inline-flex h-11 items-center rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink"
          >
            See upcoming cohorts
          </Link>
        </div>
      </section>
    </div>
  );
}
