import Link from "next/link";
import { HeaderAuth } from "@/components/header-auth";
import { SITE_NAME } from "@/lib/copy";

/** Decorative brand mark (mark.svg geometry). Strokes inherit the link's text
 *  color via currentColor so it stays legible in any theme; aria-hidden keeps
 *  the link's accessible name as the wordmark alone. */
function BrandMark() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect x="3.2" y="3.2" width="249.6" height="249.6" rx="52.5" strokeWidth="6.4" />
      <g strokeWidth="7.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="98.2,93.9 132.3,128 98.2,162.1" />
        <polyline points="128.1,93.9 162.2,128 128.1,162.1" />
      </g>
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-medium tracking-tight sm:text-base"
        >
          <BrandMark />
          <span className="truncate">{SITE_NAME}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-3 font-sans text-sm text-ink-secondary sm:gap-4">
          <Link
            href="/modules"
            className="inline-flex h-14 items-center transition-colors duration-150 hover:text-ink"
          >
            Modules
          </Link>
          <Link
            href="/cohorts"
            className="inline-flex h-14 items-center transition-colors duration-150 hover:text-ink"
          >
            Cohorts
          </Link>
          <Link
            href="/glossary"
            className="hidden h-14 items-center transition-colors duration-150 hover:text-ink sm:inline-flex"
          >
            Glossary
          </Link>
          <HeaderAuth />
        </nav>
      </div>
    </header>
  );
}
