import Link from "next/link";
import { HeaderAuth } from "@/components/header-auth";
import { SITE_NAME } from "@/lib/copy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-medium tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 font-sans text-sm text-ink-secondary">
          <Link
            href="/modules"
            className="transition-colors duration-150 hover:text-ink"
          >
            Modules
          </Link>
          <Link
            href="/cohorts"
            className="transition-colors duration-150 hover:text-ink"
          >
            Cohorts
          </Link>
          <Link
            href="/glossary"
            className="hidden transition-colors duration-150 hover:text-ink sm:inline"
          >
            Glossary
          </Link>
          <HeaderAuth />
        </nav>
      </div>
    </header>
  );
}
