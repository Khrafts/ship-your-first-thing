# voice-lint fixtures

Each file in this directory intentionally trips exactly one check in `scripts/voice-lint.sh`. The default scan excludes this directory; `./scripts/voice-lint.sh --self-test` iterates over it and asserts every fixture violates its target check.

| Fixture                                   | Tripped check                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| `01-tutorial-fiction.md`                  | Tutorial fiction phrase ("in just a few clicks")                                 |
| `02-filler.md`                            | Filler phrase ("in today's fast-paced world")                                    |
| `03-github-admonition.md`                 | GitHub-specific `> [!NOTE]` admonition (D-18 SSG-portability)                    |
| `04-missing-glossary-anchor.md`           | Reference to a GLOSSARY anchor that does not exist                               |
| `05-broken-glossary-relative-path.md`     | Relative link to a root cross-cutting doc that resolves to the wrong location    |
| `06-jargon-density.md`                    | M0 Forbidden term used bare + M0 Requires-callout term used without D-04 callout |
| `07-mermaid-br-outside-quotes.md`         | `<br>` / `<br/>` in sequenceDiagram Notes / messages / flowchart edge labels (GitHub render breaker; node-label `["…<br/>…"]` is the safe form) |
| `08-m3-dual-agent.md`                     | M3 lesson missing one of the dual-agent labels (`Claude Code:` present, `Gemini CLI:` absent) — D-27 demands both as standalone-line labels |
| `09-m35-diagnostic-framing.md`            | M3.5 lesson teaching diagnostic framing (stack-trace anatomy, "to debug", "common mistakes", "renders on the server", `:line:column` parsing, "anatomy of", "four-part") — CLAUDE.md hard rule 12 / Agent-Responsibility Boundary. WARN-only; check #9 emits ≥ 3 WARNs against this fixture. |
| `10-what-changed-entry-shape.md`          | WHAT-CHANGED.md thin-entry contract: undated live-region heading, missing `**If you're affected:**` label, > 6 non-blank body lines, > 72-char summary, > 300-char line, internal codenames (`D-27`, `Wave 3`, `.planning/`). Content below the boundary comment must NOT trip — proves the region bound. Check #10 emits ≥ 6 violations against this fixture. |

Fixtures must NOT use real course content — they are synthetic so they are unmistakable next to real lessons. Each fixture has a `fixture: true` frontmatter field and a `trips:` field naming the check it targets.
