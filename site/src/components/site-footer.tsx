import Link from "next/link";
import { FOOTER_LICENSE, FOOTER_STACK_DIVERGENCE, GITHUB_REPO_URL } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-sm text-ink-secondary">
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6">
          <Link
            href="/modules"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Modules
          </Link>
          <Link
            href="/cohorts"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Cohorts
          </Link>
          <Link
            href="/glossary"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Glossary
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Dashboard
          </Link>
          <Link
            href="/docs/setup"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Setup guide
          </Link>
          <Link
            href="/docs/budget"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Budget
          </Link>
          <Link
            href="/docs/cheatsheet"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Cheatsheet
          </Link>
          <Link
            href="/docs/common-issues"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Common issues
          </Link>
        </nav>
        <p>{FOOTER_STACK_DIVERGENCE}</p>
        <p>
          <Link
            href="/docs/licensing"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            {FOOTER_LICENSE}
          </Link>{" "}
          ·{" "}
          <a href={GITHUB_REPO_URL} className="underline underline-offset-2">
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
