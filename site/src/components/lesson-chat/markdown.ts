// Escape-first minimal markdown for assistant turns. Everything is HTML-escaped
// before any transform, so no model output can become live markup. The output is
// a fixed allow-list of inert tags — headings, paragraphs, line breaks, emphasis,
// inline + fenced code, ordered/unordered lists, blockquotes, horizontal rules,
// and links whose protocol is validated against a safe allow-list. None of these
// can carry script; links are the only tag that carries a URL, and an unsafe
// protocol (javascript:, data:, …) is rejected and falls back to inert text.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Only http(s), mailto, and site-relative URLs become real links. Anything else
// (javascript:, data:, vbscript:, bare schemes) is left as inert escaped text.
const SAFE_URL = /^(?:https?:\/\/|mailto:|\/)/i;

// Operates on already-escaped text — [ ] ( ) survive escaping, so the markdown
// link pattern still matches, and the captured URL is already attribute-safe
// (its &, <, >, " are escaped). Unsafe protocols fall back to the literal text.
function linkify(escaped: string): string {
  return escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text: string, url: string) => {
    if (!SAFE_URL.test(url)) return match;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${text}</a>`;
  });
}

function inline(escaped: string): string {
  // Operates on already-escaped text; never reintroduces raw HTML. Asterisk-only
  // emphasis (no underscores) so identifiers like file_name / snake_case survive.
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

// Inline code first (so its contents are escaped and shielded from links/bold/
// italic), then escape the rest and apply links + emphasis.
function inlineWithCode(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }
      return inline(linkify(escapeHtml(part)));
    })
    .join("");
}

const FENCE = /^\s*```/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const HR = /^\s*([-*_])(?:\s*\1){2,}\s*$/;
const BLOCKQUOTE = /^\s*>\s?(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;
const UNORDERED = /^\s*[-*+]\s+(.*)$/;

// HR is checked before the list patterns, so a rule like `---` or `* * *` is
// never mistaken for a list item.
function isBlockStart(line: string): boolean {
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    HR.test(line) ||
    BLOCKQUOTE.test(line) ||
    ORDERED.test(line) ||
    UNORDERED.test(line)
  );
}

export function renderAssistantMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      out.push(listType === "ul" ? "</ul>" : "</ol>");
      listType = null;
    }
  };
  const openList = (type: "ul" | "ol") => {
    if (listType !== type) {
      closeList();
      out.push(type === "ul" ? "<ul>" : "<ol>");
      listType = type;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block — contents escaped verbatim, no inline transforms.
    if (FENCE.test(line)) {
      closeList();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !FENCE.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence (no-op if the stream ended mid-block)
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // Heading (# … ######). A space after the hashes is required, so #tag and
    // bare hashes stay as text.
    const heading = line.match(HEADING);
    if (heading) {
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineWithCode(heading[2].trim())}</h${level}>`);
      i += 1;
      continue;
    }

    // Horizontal rule — checked ahead of lists so `---` isn't read as a bullet.
    if (HR.test(line)) {
      closeList();
      out.push("<hr>");
      i += 1;
      continue;
    }

    // Blockquote — gather the consecutive quoted run and render its inner
    // markdown recursively (the > markers are stripped, so it can't re-enter).
    if (BLOCKQUOTE.test(line)) {
      closeList();
      const quoted: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(BLOCKQUOTE);
        if (!m) break;
        quoted.push(m[1]);
        i += 1;
      }
      out.push(`<blockquote>${renderAssistantMarkdown(quoted.join("\n"))}</blockquote>`);
      continue;
    }

    // Ordered list item.
    const ordered = line.match(ORDERED);
    if (ordered) {
      openList("ol");
      out.push(`<li>${inlineWithCode(ordered[1])}</li>`);
      i += 1;
      continue;
    }

    // Unordered list item.
    const unordered = line.match(UNORDERED);
    if (unordered) {
      openList("ul");
      out.push(`<li>${inlineWithCode(unordered[1])}</li>`);
      i += 1;
      continue;
    }

    closeList();

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    // Paragraph — gather consecutive plain lines into one block, preserving the
    // model's soft line breaks as <br> (chat convention), so wrapped prose isn't
    // split into a stack of gappy single-line paragraphs.
    const para: string[] = [inlineWithCode(line)];
    i += 1;
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      para.push(inlineWithCode(lines[i]));
      i += 1;
    }
    out.push(`<p>${para.join("<br>")}</p>`);
  }

  closeList();
  return out.join("");
}
