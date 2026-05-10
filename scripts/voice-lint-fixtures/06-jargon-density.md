---
fixture: true
trips: jargon-density
---

# Voice-lint fixture: jargon density

This fixture intentionally violates `docs/audience-vocabulary.md` for Module 0 in two ways.

First, it uses the term Codespace in prose without ever defining it via the D-04 vocab callout pattern, even though Codespace is Requires-callout for M0. The lint must flag the missing callout.

Second, the API responded with an error. The bare term API is Forbidden in M0 (M0 lessons may write "Anthropic API" or "API key" because those are brand-prefix or contract-compound forms, but a bare "API" outside any callout is a violation). The lint must flag this too.

This file is not a real lesson.
