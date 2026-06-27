import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import {
  FOOTER_LICENSE,
  FOOTER_STACK_DIVERGENCE,
  GITHUB_REPO_URL,
  SITE_NAME,
  TAGLINE,
} from "@/lib/copy";

// Footer link groups. Splitting the flat eight-link row into two labeled
// columns gives the eye a hierarchy to scan instead of one undifferentiated
// wall: "Course" is the product, "Reference" is the supporting docs.
const COURSE_LINKS = [
  { href: "/modules", label: "Modules" },
  { href: "/cohorts", label: "Cohorts" },
  { href: "/glossary", label: "Glossary" },
  { href: "/dashboard", label: "Dashboard" },
];

const REFERENCE_LINKS = [
  { href: "/docs/setup", label: "Setup guide" },
  { href: "/docs/budget", label: "Budget" },
  { href: "/docs/cheatsheet", label: "Cheatsheet" },
  { href: "/docs/common-issues", label: "Common issues" },
];

// Reuses the eyebrow treatment the home page already uses for section labels
// ("How the course works", "The curriculum") so the footer reads as part of the
// same system.
const COLUMN_LABEL =
  "font-sans text-xs font-medium uppercase tracking-widest text-ink-faint";

// No underline at rest (the column heading already frames these as nav); the
// underline + ink color arrive on hover/focus. min-h-11 keeps each a 44px
// touch target.
const FOOTER_LINK =
  "inline-flex min-h-11 items-center text-sm text-ink-secondary underline-offset-2 transition-colors duration-150 hover:text-ink hover:underline";

function LinkColumn({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={label}>
      <h2 className={COLUMN_LABEL}>{label}</h2>
      <ul className="mt-2 flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={FOOTER_LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Brand + link columns. On phones the brand spans the top and the two
            link columns sit side by side; from `sm` up they share one row. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              aria-label={SITE_NAME}
              className="inline-flex items-center gap-2.5 text-ink transition-opacity duration-150 hover:opacity-70"
            >
              <BrandMark className="h-7 w-7 shrink-0" />
              <span className="font-serif text-base leading-snug">
                {SITE_NAME}
              </span>
            </Link>
            {/* Reuses the canonical tagline to anchor the brand block; hidden on
                phones, where it would just repeat the hero above the fold. */}
            <p className="mt-4 hidden max-w-xs text-sm leading-relaxed text-ink-secondary sm:block">
              {TAGLINE}
            </p>
          </div>
          <LinkColumn label="Course" links={COURSE_LINKS} />
          <LinkColumn label="Reference" links={REFERENCE_LINKS} />
        </div>

        {/* Legal row, separated from the nav by a hairline. The stack-divergence
            line is constrained to a readable measure rather than running the
            full container width. */}
        <div className="mt-12 space-y-3 border-t border-line pt-6 text-sm text-ink-faint">
          <p className="max-w-2xl">{FOOTER_STACK_DIVERGENCE}</p>
          <p>
            <Link
              href="/docs/licensing"
              className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              {FOOTER_LICENSE}
            </Link>{" "}
            ·{" "}
            <a
              href={GITHUB_REPO_URL}
              className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
