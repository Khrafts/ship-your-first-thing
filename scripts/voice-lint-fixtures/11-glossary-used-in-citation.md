---
fixture: true
trips: glossary-used-in
---

# Fixture for check #11 (glossary `Used in:` citations)

This file is a synthetic stand-in for `GLOSSARY.md`. In `--self-test` mode check #11 reads this
file instead of the real glossary and resolves each cited path relative to this directory, so
the three entries below exercise both arms of the check and its one carve-out. The terms are
invented; none of them appears anywhere in the course.

### zephyr-widget
A synthetic term whose citation points at a lesson file that was never created. *Example: none.*
Used in: [Fixture lesson that does not exist](./11-no-such-lesson.md).

### quantum-doodad
A synthetic term whose citation points at a real file that never names it and never links the
anchor — the falsified-citation shape this check exists to catch. *Example: none.*
Used in: [Fixture lesson that never names the term](./09-m35-diagnostic-framing.md).

### orphan-sprocket
A synthetic term that self-declares no lesson uses it, then names a real file for context. This
entry must NOT warn: arm 11a passes because the file exists, and arm 11b is skipped because the
line opens with "no". *Example: none.*
Used in: no current lesson. [Fixture lesson](./09-m35-diagnostic-framing.md) records the retirement.

### mangled-cog
A synthetic term whose `Used in:` line claims usage but names no lesson at all — the shape a
mangled or half-deleted citation link leaves behind. *Example: none.*
Used in: Fixture lesson (link mangled away).
