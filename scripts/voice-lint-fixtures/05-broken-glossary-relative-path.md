---
fixture: true
trips: broken-relative-path
---

# Voice-lint fixture: broken GLOSSARY relative path

The next callout uses `GLOSSARY.md#api` (no `../../` prefix) — a renderer would resolve this to `scripts/voice-lint-fixtures/GLOSSARY.md` (which doesn't exist) instead of the repo-root file. The lint must catch it.

Example callout: **api** (the contract between two programs, [→ GLOSSARY](GLOSSARY.md#api)).

This file is not a real lesson.
