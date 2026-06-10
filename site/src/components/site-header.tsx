import Link from "next/link";
import { SITE_NAME } from "@/lib/copy";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-medium">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ink-secondary">
          <Link href="/modules">Modules</Link>
          <Link href="/cohorts">Cohorts</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
