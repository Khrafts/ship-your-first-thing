import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { HeaderAuth } from "@/components/header-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_NAME } from "@/lib/copy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* The link carries the accessible name (aria-label); the artwork inside
            is decorative either way, so the mark is aria-hidden and the lockup's
            alt is empty — no double announcement at either breakpoint. */}
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="flex items-center rounded-sm text-ink transition-opacity duration-150 hover:opacity-70"
        >
          {/* Phones get the compact mark only. The full two-line lockup is
              ~2.4:1 wide, so squeezing it into the ~100px of header a phone can
              spare crushes the wordmark into something illegible. The mark reads
              cleanly at any size and leaves room for the nav. `currentColor`
              keeps it in step with the theme (see BrandMark). */}
          <BrandMark className="h-9 w-9 sm:hidden" />
          {/* From `sm` up there's room for the full lockup. The asset is the
              monochrome dark-ink lockup, correct on the light paper header;
              `dark:invert` flips the same artwork light when the header does. */}
          <Image
            src="/brand/lockup-light.png"
            alt=""
            width={1028}
            height={424}
            priority
            sizes="140px"
            className="hidden h-14 w-auto sm:block dark:invert"
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
