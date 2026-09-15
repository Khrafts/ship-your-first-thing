---
fixture: true
trips: jargon-density
---

# Voice-lint fixture: jargon density

This fixture intentionally violates `docs/audience-vocabulary.md` for Module 0 in two ways.

First, it uses the term Codespace in prose without ever linking it to its glossary anchor, even though Codespace is Requires-callout for M0. The lint must flag the missing link.

Two other M0 Requires-callout terms appear here in the required plain-link form and must NOT be flagged: an [AI coding agent](../../GLOSSARY.md#ai-coding-agent) with the exact term as link text, and [Claude Code desktop](../../GLOSSARY.md#claude-code), whose link text is longer than the term "Claude Code". Self-test asserts neither is reported as callout-missing.

Second, the API responded with an error. The bare term API is Forbidden in M0 (M0 lessons may write "Anthropic API" or "API key" because those are brand-prefix or contract-compound forms, but a bare "API" outside any callout is a violation). The lint must flag this too.

This file is not a real lesson.
