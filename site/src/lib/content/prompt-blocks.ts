// Rehype plugin: upgrade `prompt` fences into copyable prompt blocks.
//
// A ```prompt fence is the agreed source format for anything the learner
// pastes into their agent app. remark renders it as
// `<pre><code class="language-prompt">`, which is exactly what github.com
// shows (a plain code block). Here that <pre> is wrapped in a labelled block
// with a copy button and a status region:
//
//   <div class="prompt-block" data-prompt-block>
//     <div class="prompt-block-bar">
//       <span class="prompt-block-label">Prompt</span>
//       <span class="prompt-copy-status" role="status"></span>
//       <button type="button" class="prompt-copy" data-prompt-copy
//               aria-label="Copy prompt" hidden>Copy</button>
//     </div>
//     <pre class="prompt-block-text"><code class="language-prompt">…</code></pre>
//   </div>
//
// The button ships `hidden` and src/lib/prompt-copy.ts reveals it once
// JavaScript runs — a reader without JS sees the labelled prompt, never a
// control that cannot work. Label and button live outside the <pre>, so a
// hand-made selection of the prompt never drags them along. Only
// `language-prompt` qualifies: mermaid and code fences are left untouched.

import { visit } from "unist-util-visit";
import { PROMPT_COPY } from "@/lib/prompt-copy";

interface HastText {
  type: "text";
  value: string;
}

interface HastElement {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: Array<HastElement | HastText>;
}

interface HastParent {
  children: unknown[];
}

const PROMPT_LANGUAGE_CLASS = "language-prompt";

function isElement(node: unknown): node is HastElement {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as { type?: unknown }).type === "element"
  );
}

function classList(props: Record<string, unknown> | undefined): string[] {
  const raw = props?.className;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return raw.split(/\s+/).filter(Boolean);
  return [];
}

/** True for `<pre>` whose only element child is `<code class="language-prompt">`. */
export function isPromptFence(node: unknown): node is HastElement {
  if (!isElement(node) || node.tagName !== "pre") return false;
  const elements = node.children.filter(isElement);
  if (elements.length !== 1) return false;
  const code = elements[0];
  return code.tagName === "code" && classList(code.properties).includes(PROMPT_LANGUAGE_CLASS);
}

function el(
  tagName: string,
  properties: Record<string, unknown>,
  children: Array<HastElement | HastText> = [],
): HastElement {
  return { type: "element", tagName, properties, children };
}

function text(value: string): HastText {
  return { type: "text", value };
}

/** Build the wrapper around an existing prompt `<pre>`. */
export function promptBlock(pre: HastElement): HastElement {
  pre.properties = { ...pre.properties, className: ["prompt-block-text"] };
  return el("div", { className: ["prompt-block"], dataPromptBlock: true }, [
    el("div", { className: ["prompt-block-bar"] }, [
      el("span", { className: ["prompt-block-label"] }, [text(PROMPT_COPY.label)]),
      el("span", { className: ["prompt-copy-status"], role: "status", ariaAtomic: true }),
      el(
        "button",
        {
          type: "button",
          className: ["prompt-copy"],
          dataPromptCopy: true,
          ariaLabel: PROMPT_COPY.buttonName,
          hidden: true,
        },
        [text(PROMPT_COPY.button)],
      ),
    ]),
    pre,
  ]);
}

/** unified plugin. */
export default function rehypePromptBlocks() {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], "element", (rawNode, index, rawParent) => {
      const node: unknown = rawNode;
      const parent = rawParent as unknown as HastParent | undefined;
      if (!isPromptFence(node) || !parent || typeof index !== "number") return;
      parent.children[index] = promptBlock(node);
      return "skip"; // don't descend into the block we just built
    });
  };
}
