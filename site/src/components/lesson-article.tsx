"use client";

// Renders pre-rendered lesson HTML and progressively enhances Mermaid fences
// into diagrams. The server HTML keeps `<pre><code class="language-mermaid">`
// so the diagram source stays readable without JavaScript; on the client we
// swap each fence for the rendered SVG. A fence that fails to parse stays as
// readable source instead of breaking the page.
//
// Mermaid bakes colours into the generated SVG, so unlike the rest of the site
// it can't follow the CSS-variable theme flip — it must be re-rendered when the
// theme changes. We therefore stash each diagram's source on its figure
// (data-mermaid-src) and re-render from it whenever the resolved theme changes.

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import type { ResolvedTheme } from "@/lib/theme";

type MermaidApi = typeof import("mermaid").default;

// Monochrome palettes matching the design tokens (app/globals.css). Light is
// the original neutral palette; dark mirrors the `.dark` token values.
const LIGHT_VARS = {
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
} as const;

const DARK_VARS = {
  primaryColor: "#27272a",
  primaryTextColor: "#fafafa",
  primaryBorderColor: "#3f3f46",
  secondaryColor: "#18181b",
  tertiaryColor: "#09090b",
  lineColor: "#a1a1aa",
  textColor: "#fafafa",
  noteBkgColor: "#18181b",
  noteBorderColor: "#3f3f46",
  noteTextColor: "#fafafa",
  actorBkg: "#27272a",
  actorBorder: "#3f3f46",
  actorTextColor: "#fafafa",
  signalColor: "#a1a1aa",
  signalTextColor: "#fafafa",
  labelBoxBkgColor: "#18181b",
  labelBoxBorderColor: "#3f3f46",
  edgeLabelBackground: "#09090b",
  clusterBkg: "#18181b",
  clusterBorder: "#27272a",
} as const;

// Mermaid's module and global config are a single shared singleton. That is
// safe because LessonArticle is rendered once per page; the config is mutated
// per render batch to swap the palette. If a second instance ever mounts on one
// surface, a theme flip mid-render could let a suspended loop finish with the
// other instance's palette — revisit the singleton then.
let mermaidModule: Promise<MermaidApi> | null = null;

// Import once, but (re)initialize on every call so the active theme's palette
// takes effect before a render batch.
function loadMermaid(theme: ResolvedTheme): Promise<MermaidApi> {
  if (!mermaidModule) {
    mermaidModule = import("mermaid").then((mod) => mod.default);
  }
  return mermaidModule.then((mermaid) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "neutral",
      fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      themeVariables: theme === "dark" ? DARK_VARS : LIGHT_VARS,
      // Without this, a parse failure draws an error diagram into a temp <div>
      // that mermaid leaves orphaned on document.body when it then re-throws —
      // a leak that compounds across theme flips. With it, render simply throws
      // (no orphan) and our catch keeps the readable source/diagram fallback.
      suppressErrorRendering: true,
    });
    return mermaid;
  });
}

let renderSequence = 0;

export function LessonArticle({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    void loadMermaid(resolvedTheme).then(async (mermaid) => {
      // 1. Re-render diagrams already on the page for the current theme.
      const figures = Array.from(
        container.querySelectorAll<HTMLElement>(
          ".mermaid-figure[data-mermaid-src]",
        ),
      );
      for (const figure of figures) {
        if (cancelled) return; // theme/lesson changed — abort the whole batch
        if (!figure.isConnected) continue; // this one detached — skip, not abort
        const source = figure.dataset.mermaidSrc ?? "";
        try {
          renderSequence += 1;
          const { svg } = await mermaid.render(
            `lesson-mermaid-${renderSequence}`,
            source,
          );
          if (cancelled) return;
          if (!figure.isConnected) continue;
          figure.innerHTML = svg;
        } catch {
          // Keep the previously rendered diagram rather than blanking it.
        }
      }

      // 2. Enhance any not-yet-rendered fences. On success replace the source
      // <pre> with a figure (stashing the source for future re-renders); on
      // failure leave the <pre> in place so it reads as text.
      const blocks = Array.from(
        container.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
      );
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
          if (cancelled) return;
          if (!pre.isConnected) continue;
          const figure = document.createElement("div");
          figure.className = "mermaid-figure";
          figure.dataset.mermaidSrc = source;
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
  }, [html, resolvedTheme]);

  // Image lightbox. Activating a `zoomable` image (click, or Enter/Space when
  // focused) opens it full-size in a native <dialog>. showModal() gives the
  // dim backdrop, Esc-to-close, and focus trapping for free; we add a caption,
  // a close button, and backdrop-click-to-dismiss, and restore focus to the
  // triggering image on close. Listeners are delegated on the container so the
  // effect never needs to rebind per image, and it stays independent of the
  // Mermaid effect above (different concern, its own dialog).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build the dialog once and reuse it for every image on the page.
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "lightbox-close";
    closeButton.setAttribute("aria-label", "Close image");
    closeButton.textContent = "×"; // ×
    const figure = document.createElement("figure");
    figure.className = "lightbox-figure";
    const fullImage = document.createElement("img");
    fullImage.className = "lightbox-image";
    const caption = document.createElement("figcaption");
    caption.className = "lightbox-caption";
    figure.append(fullImage, caption);
    dialog.append(closeButton, figure);
    document.body.append(dialog);

    // The image that opened the lightbox, so focus can return to it on close.
    let trigger: HTMLElement | null = null;

    const open = (source: HTMLImageElement) => {
      trigger = source;
      fullImage.src = source.currentSrc || source.src;
      const alt = source.getAttribute("alt") ?? "";
      fullImage.alt = alt;
      caption.textContent = alt;
      caption.hidden = alt.length === 0;
      dialog.showModal();
    };

    const close = () => {
      if (dialog.open) dialog.close();
    };

    const zoomableFrom = (event: Event): HTMLImageElement | null => {
      const target = event.target as HTMLElement | null;
      const image = target?.closest("img.zoomable");
      return image instanceof HTMLImageElement ? image : null;
    };

    const onClick = (event: MouseEvent) => {
      const image = zoomableFrom(event);
      if (image) open(image);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const image = zoomableFrom(event);
      if (image) {
        event.preventDefault(); // Space would otherwise scroll the page
        open(image);
      }
    };

    // A modal <dialog> fills the viewport as a centring layer; a click that
    // lands on the dialog itself (the dim area around the figure) dismisses.
    const onDialogClick = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };

    const onDialogClose = () => {
      trigger?.focus();
      trigger = null;
    };

    container.addEventListener("click", onClick);
    container.addEventListener("keydown", onKeydown);
    closeButton.addEventListener("click", close);
    dialog.addEventListener("click", onDialogClick);
    dialog.addEventListener("close", onDialogClose);

    return () => {
      container.removeEventListener("click", onClick);
      container.removeEventListener("keydown", onKeydown);
      closeButton.removeEventListener("click", close);
      dialog.removeEventListener("click", onDialogClick);
      dialog.removeEventListener("close", onDialogClose);
      close();
      dialog.remove();
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
