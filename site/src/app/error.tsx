"use client";

import Link from "next/link";

// Route-segment error boundary. Next.js requires error boundaries to be
// client components; this one stays dependency-free and monochrome.

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-6">
      <div className="mx-auto mt-16 mb-24 w-full max-w-sm rounded-lg border border-line p-8">
        <h1 className="font-serif text-2xl text-ink">
          Something broke on our side
        </h1>
        <p className="mt-4 text-sm text-ink-secondary">
          The page hit an error we didn&apos;t handle — you can retry, or head
          back to the module list.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 h-11 w-full cursor-pointer rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary"
        >
          Try again
        </button>
        <p className="mt-6 text-sm text-ink-secondary">
          <Link
            href="/modules"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Back to the modules
          </Link>
        </p>
      </div>
    </div>
  );
}
