import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOC_SLUGS, getDocHtml } from "@/lib/content";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocHtml(slug);
  if (!doc) {
    return {};
  }
  return { title: doc.title };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = await getDocHtml(slug);
  if (!doc) {
    notFound();
  }

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="font-serif text-4xl tracking-tight text-ink">
          {doc.title}
        </h1>
        <div
          className="prose mt-12"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
