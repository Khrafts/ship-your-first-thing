import { FOOTER_LICENSE, FOOTER_STACK_DIVERGENCE, GITHUB_REPO_URL } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-sm text-ink-secondary">
        <p>{FOOTER_STACK_DIVERGENCE}</p>
        <p>
          {FOOTER_LICENSE} ·{" "}
          <a href={GITHUB_REPO_URL} className="underline underline-offset-2">
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
