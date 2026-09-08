"use client";

// Rendered course markdown for surfaces without the lesson article's extra
// behaviour (docs, glossary, module READMEs): the HTML plus the prompt copy
// controls. Lessons use LessonArticle, which adds Mermaid and the lightbox on
// top of the same hook.

import { useMemo, useRef } from "react";
import { usePromptCopy } from "@/components/use-prompt-copy";

export function ProseHtml({ html, className = "prose" }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => ({ __html: html }), [html]);
  usePromptCopy(ref, html);
  return <div ref={ref} className={className} dangerouslySetInnerHTML={markup} />;
}
