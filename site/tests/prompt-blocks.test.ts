import { describe, expect, it } from "vitest";
import { getLesson, renderCourseMarkdown } from "@/lib/content";
import { PROMPT_COPY } from "@/lib/prompt-copy";

// `prompt` fences are the agreed source format for anything a learner pastes
// into their agent app. github.com shows them as a plain code block; the site
// upgrades each one into a labelled block with a copy control. The control is
// server-rendered but `hidden` until the client proves it can copy, so a
// no-JavaScript reader never sees a button that cannot work.

async function render(markdown: string): Promise<string> {
  return renderCourseMarkdown(markdown, "modules/00-welcome");
}

describe("prompt fences", () => {
  it("wraps a prompt fence in a labelled block with a hidden copy control", async () => {
    const html = await render("Say this:\n\n```prompt\nMake me a page.\n```\n");
    expect(html).toContain('class="prompt-block"');
    expect(html).toContain("data-prompt-block");
    expect(html).toContain(`<span class="prompt-block-label">${PROMPT_COPY.label}</span>`);
    expect(html).toMatch(
      /<button type="button" class="prompt-copy" data-prompt-copy aria-label="Copy prompt" hidden>Copy<\/button>/,
    );
    expect(html).toContain('class="prompt-copy-status" role="status"');
    // The prompt text itself is untouched and still a code block for GitHub parity.
    expect(html).toContain('<pre class="prompt-block-text"><code class="language-prompt">Make me a page.\n</code></pre>');
  });

  it("keeps the label and control outside the <pre> so a manual selection copies only the prompt", async () => {
    const html = await render("```prompt\nHello agent.\n```\n");
    const pre = html.slice(html.indexOf("<pre"), html.indexOf("</pre>"));
    expect(pre).not.toContain(PROMPT_COPY.label);
    expect(pre).not.toContain("Copy");
  });

  it("wraps every prompt fence on the page, in order", async () => {
    const html = await render("```prompt\nFirst.\n```\n\ntext\n\n```prompt\nSecond.\n```\n");
    expect(html.match(/data-prompt-block/g)).toHaveLength(2);
    expect(html.indexOf("First.")).toBeLessThan(html.indexOf("Second."));
  });

  it("leaves mermaid, bash and untagged fences alone", async () => {
    const html = await render(
      "```mermaid\nflowchart LR\n  A --> B\n```\n\n```bash\nls\n```\n\n```\nplain\n```\n",
    );
    expect(html).not.toContain("prompt-block");
    expect(html).not.toContain("data-prompt-copy");
    expect(html).toContain('<code class="language-mermaid">');
    expect(html).toContain('<code class="language-bash">');
  });

  it("works inside a collapsed disclosure", async () => {
    const html = await render(
      "<details><summary>If it stalls</summary>\n\n```prompt\nTry again.\n```\n\n</details>\n",
    );
    expect(html).toContain("<details>");
    expect(html).toContain("data-prompt-block");
    expect(html.indexOf("data-prompt-block")).toBeGreaterThan(html.indexOf("<summary>"));
  });

  it("keeps prompt text escaped, never re-parsed as HTML", async () => {
    const html = await render("```prompt\nUse <b>bold</b> and <script>alert(1)</script>\n```\n");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#x3C;script>");
    expect(html).not.toContain("<b>");
  });
});

describe("prompt fences in the live curriculum", () => {
  it("the agent-intro lesson (public, never gates) renders its prompts as copyable blocks", async () => {
    const lesson = await getLesson("02-toolchain", "01-your-ai-coding-agent");
    expect(lesson).not.toBeNull();
    const blocks = lesson!.html.match(/data-prompt-block/g) ?? [];
    expect(blocks.length).toBeGreaterThanOrEqual(1);
    // Exactly one control per block, and none on any other fence.
    expect((lesson!.html.match(/data-prompt-copy/g) ?? []).length).toBe(blocks.length);
  });
});
