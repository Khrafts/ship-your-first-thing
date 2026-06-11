import type { Metadata } from "next";
import { getGlossaryHtml } from "@/lib/content";

export const metadata: Metadata = {
  title: "Glossary",
};

export default async function GlossaryPage() {
  const html = await getGlossaryHtml();

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">
          Glossary
        </h1>
        <p className="mt-4 leading-relaxed text-ink-secondary">
          Every domain and tool term the course uses, defined in plain
          language. Lessons link here the first time a term appears.
        </p>
        <div
          className="prose mt-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
