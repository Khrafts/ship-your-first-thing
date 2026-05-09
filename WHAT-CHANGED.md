# WHAT-CHANGED.md — Freshness log

Reverse-chronological log of what shifted between course revisions. The first place to check when reality drifts from a lesson.

Each entry has the format:

> ## YYYY-MM-DD — {one-line summary}
> **What changed:** ...
> **Affected lessons / artifacts:** ...
> **What learners should do:** ...

---

## 2026-05-08 — Phase 1 close

**What changed:** Phase 1 (Foundation & Front Door) closed. Module 0 (5 lessons) and Module 1 (3 bundles) ship with the locked nine-element lesson anatomy and M0-variant baseline. All eight cross-cutting artifacts (README, SETUP, GLOSSARY, CHEATSHEET, COMMON-ISSUES, BUDGET, CONTRIBUTING, WHAT-CHANGED, plus standalone VERSIONS) shipped at Phase-1 depth. Editorial pass via `scripts/voice-lint.sh` returned clean on first run (zero violations across the full Phase 1 surface). Phase 1 success criteria #1–#5 satisfied.

**Affected lessons / artifacts:** All Phase 1 deliverables. The following invariants are now enforceable on every future PR via `scripts/voice-lint.sh`:
- No tutorial fiction (LESSON-12)
- No filler prose (LESSON-12)
- No GitHub-specific admonitions (D-18 SSG-portability)
- Every `GLOSSARY.md#anchor` used in any lesson resolves to a `### anchor` entry

**What learners should do:** No action. Phase 2 (Toolchain & The Loop) is the next phase to land; until then, Module 0 and Module 1 are the available content.

**What contributors should do:** Run `./scripts/voice-lint.sh` before opening a PR that touches course markdown. The lint step is documented in `CONTRIBUTING.md` as part of this same plan.

---

## 2026-05-08 — V1 baseline

**What changed:** Initial release of the course's v1 baseline. Module 0 (Welcome) and Module 1 (Mental models) ship with the locked nine-element lesson anatomy. Cross-cutting artifacts (README, SETUP, BUDGET, GLOSSARY, CHEATSHEET, COMMON-ISSUES, CONTRIBUTING, VERSIONS) ship with seed content sufficient for Phase 1 + linkable from Phase 2 onward. Dual MIT (code) + CC BY 4.0 (prose) licensing committed.

**Affected lessons / artifacts:** All v1 baseline. Lesson template locked at `lesson-template.md`; M0-variant locked at `lesson-template-m0.md`. Three named cost paths in `BUDGET.md`: Claude Code Pro / Gemini CLI free tier / Anthropic API token-careful.

**What learners should do:** Start with Module 0. If you came back to this entry because something seems off, check `VERSIONS.md` first — every tool the course is verified against has a `Last verified` date there.

**Decision-change context:** This release reflects the 2026-05-08 swap of the free OSS AI agent from Aider to Gemini CLI. The Aider/OpenRouter cost path that appeared in earlier research (`./.planning/research/SUMMARY.md`) is superseded by `BUDGET.md` Path 2 (Gemini CLI free tier).
