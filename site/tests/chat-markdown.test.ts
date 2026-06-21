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
});
