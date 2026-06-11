import type { Metadata } from "next";
import { getSetupHtml } from "@/lib/content";

export const metadata: Metadata = {
  title: "Setup",
};

export default async function SetupPage() {
  const html = await getSetupHtml();

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Setup</h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          The accounts and environment the course expects, and the two
          supported ways to get a working setup.
        </p>
        <div
          className="prose mt-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
