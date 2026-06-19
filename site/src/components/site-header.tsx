import Image from "next/image";
import Link from "next/link";
import { HeaderAuth } from "@/components/header-auth";
import { SITE_NAME } from "@/lib/copy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center rounded-sm transition-opacity duration-150 hover:opacity-70"
        >
          {/* Full brand lockup (icon + wordmark). The site is light-only, so the
              light variant always sits correctly on the paper header. alt gives
              the link its accessible name. */}
          <Image
            src="/brand/lockup-light.png"
            alt={SITE_NAME}
            width={1028}
            height={424}
            priority
            className="h-10 w-auto"
          />
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
