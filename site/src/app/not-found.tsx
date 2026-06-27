import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-24">
        <h1 className="font-serif text-4xl tracking-tight text-ink">
          Not found
        </h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          There&apos;s no page at this address — the link may be out of date,
          or the address has a typo.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:opacity-90"
          >
            Back to the homepage
          </Link>
          <Link
            href="/modules"
            className="inline-flex h-11 items-center rounded-md border border-line-strong px-5 font-sans text-sm font-medium text-ink transition-colors duration-150 hover:border-ink"
          >
            Browse the modules
          </Link>
        </div>
      </div>
    </div>
  );
}
