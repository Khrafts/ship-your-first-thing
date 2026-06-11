"use client";

// Renders pre-rendered lesson HTML and progressively enhances Mermaid fences
// into diagrams. The server HTML keeps `<pre><code class="language-mermaid">`
// so the diagram source stays readable without JavaScript; on the client we
// swap each fence for the rendered SVG. A fence that fails to parse stays as
// readable source instead of breaking the page.

import { useEffect, useRef } from "react";

type MermaidApi = typeof import("mermaid").default;

let mermaidPromise: Promise<MermaidApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily:
          'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
        themeVariables: {
          // Monochrome palette matching the site tokens.
          primaryColor: "#f4f4f5",
          primaryTextColor: "#09090b",
          primaryBorderColor: "#d4d4d8",
          secondaryColor: "#fafafa",
          tertiaryColor: "#ffffff",
          lineColor: "#52525b",
          textColor: "#09090b",
          noteBkgColor: "#fafafa",
          noteBorderColor: "#d4d4d8",
          noteTextColor: "#09090b",
          actorBkg: "#f4f4f5",
          actorBorder: "#d4d4d8",
          actorTextColor: "#09090b",
          signalColor: "#52525b",
          signalTextColor: "#09090b",
          labelBoxBkgColor: "#fafafa",
          labelBoxBorderColor: "#d4d4d8",
          edgeLabelBackground: "#ffffff",
          clusterBkg: "#fafafa",
          clusterBorder: "#e4e4e7",
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

let renderSequence = 0;

export function LessonArticle({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
    );
    if (blocks.length === 0) return;

    let cancelled = false;
    void loadMermaid().then(async (mermaid) => {
      for (const code of blocks) {
        if (cancelled) return;
        const pre = code.parentElement;
        if (!pre || !pre.isConnected) continue;
        const source = code.textContent ?? "";
        try {
          renderSequence += 1;
          const { svg } = await mermaid.render(
            `lesson-mermaid-${renderSequence}`,
            source,
          );
          if (cancelled || !pre.isConnected) return;
          const figure = document.createElement("div");
          figure.className = "mermaid-figure";
          figure.innerHTML = svg;
          pre.replaceWith(figure);
        } catch {
          // Leave the fenced source visible — it reads fine as text.
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
