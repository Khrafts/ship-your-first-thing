// Escape-first minimal markdown for assistant turns. Everything is HTML-escaped
// before any transform, so no model output can become live markup. Supports
// fenced code blocks, inline code, bold, italics, and bullet lists — nothing
// that can carry a URL or raw HTML.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(escaped: string): string {
  // Operates on already-escaped text; never reintroduces raw HTML.
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

// Inline code first (so its contents are escaped and shielded from bold/italic),
// then escape the rest and apply emphasis.
function inlineWithCode(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }
      return inline(escapeHtml(part));
    })
    .join("");
}

export function renderAssistantMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith("```")) {
      closeList();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // Bullet list item
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${inlineWithCode(bullet[1])}</li>`);
      i += 1;
      continue;
    }

    closeList();
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    out.push(`<p>${inlineWithCode(line)}</p>`);
    i += 1;
  }
  closeList();
  return out.join("");
}
