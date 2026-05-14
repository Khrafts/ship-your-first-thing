---
fixture: true
trips: m3-dual-agent
---

# Fixture for check #8 (m3-dual-agent)

This fixture intentionally trips the M3 dual-agent rendering check by including a `Claude Code:` standalone-line label without the sibling `Gemini CLI:` label. D-27 demands every Module 3 lesson present both agents in parallel.

```text
Claude Code:
> I'll add today's date below the tagline.
```

(no Gemini CLI block — that's the violation)
