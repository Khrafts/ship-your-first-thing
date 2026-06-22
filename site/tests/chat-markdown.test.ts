import { describe, expect, it } from "vitest";
import { renderAssistantMarkdown } from "@/components/lesson-chat/markdown";

describe("renderAssistantMarkdown", () => {
  it("escapes raw HTML so model output cannot inject markup", () => {
    const html = renderAssistantMarkdown("<img src=x onerror=alert(1)> hello");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("renders **bold** and `inline code`", () => {
    const html = renderAssistantMarkdown("use **npm** and the `dev` script");
    expect(html).toContain("<strong>npm</strong>");
    expect(html).toContain("<code>dev</code>");
  });

  it("renders a fenced code block, escaping its contents", () => {
    const html = renderAssistantMarkdown("```\n<b>x</b>\n```");
    expect(html).toContain("<pre>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).not.toContain("<b>x</b>");
  });

  it("does not apply bold/italic inside code", () => {
    const html = renderAssistantMarkdown("`**not bold**`");
    expect(html).toContain("<code>**not bold**</code>");
    expect(html).not.toContain("<strong>");
  });

  it("renders bullet lists", () => {
    const html = renderAssistantMarkdown("- one\n- two");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<li>two</li>");
  });

  it("renders headings at their level (the reported ### bug)", () => {
    const html = renderAssistantMarkdown("# Title\n## Section\n### Detail");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<h2>Section</h2>");
    expect(html).toContain("<h3>Detail</h3>");
    expect(html).not.toContain("###");
  });

  it("does not treat bare or spaceless hashes as headings", () => {
    const html = renderAssistantMarkdown("#nospace and C# code");
    expect(html).not.toContain("<h1>");
    expect(html).toContain("#nospace and C# code");
  });

  it("renders ordered lists", () => {
    const html = renderAssistantMarkdown("1. first\n2. second");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>first</li>");
    expect(html).toContain("<li>second</li>");
  });

  it("renders blockquotes", () => {
    const html = renderAssistantMarkdown("> a quoted note");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("a quoted note");
  });

  it("renders a horizontal rule and not a list item", () => {
    const html = renderAssistantMarkdown("above\n\n---\n\nbelow");
    expect(html).toContain("<hr>");
    expect(html).not.toContain("<li>");
  });

  it("renders safe links and rejects unsafe protocols", () => {
    const safe = renderAssistantMarkdown("see [the docs](https://example.com/x)");
    expect(safe).toContain('href="https://example.com/x"');
    expect(safe).toContain('rel="noopener noreferrer nofollow"');
    expect(safe).toContain(">the docs</a>");

    const unsafe = renderAssistantMarkdown("[tap me](javascript:alert(1))");
    expect(unsafe).not.toContain("<a");
    expect(unsafe).not.toContain("javascript:alert(1)</a>");
  });

  it("groups soft-wrapped lines into one paragraph with <br>", () => {
    const html = renderAssistantMarkdown("line one\nline two\n\nnew para");
    expect(html).toBe("<p>line one<br>line two</p><p>new para</p>");
  });
});
