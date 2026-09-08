"use client";

import { useEffect, type RefObject } from "react";
import { attachPromptCopy } from "@/lib/prompt-copy";

/**
 * Wire the copy controls inside a rendered-markdown container. Re-runs when
 * the HTML string changes (a client-side navigation between lessons swaps
 * the innerHTML under the same element) and cleans up the previous binding —
 * listener and any pending "Copied" reset — first, so nothing stale survives
 * a navigation. Keyed on `html`, not on the element, for the same reason the
 * lightbox effect in lesson-article.tsx is.
 */
export function usePromptCopy(ref: RefObject<HTMLElement | null>, html: string): void {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    return attachPromptCopy(container);
  }, [ref, html]);
}
