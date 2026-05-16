# Contributing

Thank you for considering contributing to Ship Your First Thing. This is an open-source course. The best contributions are usually small, factual, and aimed at making the next learner's experience smoother.

## What we want most

In rough priority order:

1. **`COMMON-ISSUES.md` entries** — you hit something that broke; you fixed it; the fix is reproducible. PR it.
2. **`WHAT-CHANGED.md` updates** — a tool released a new version that affects a lesson. Note it.
3. **Freshness fixes** — a screenshot, command, or version reference is stale. PR a correction.
4. **Vocab/glossary fills** — a lesson uses a term that isn't yet in `GLOSSARY.md`. PR an entry.
5. **Voice fixes** — you spotted tutorial fiction (the *frictionless-clicks* trope where reality has ten steps and bureaucracy) or filler (the *fast-paced-world* opener that says nothing). PR a rewrite.

## If you're authoring a new lesson or editing one substantially

Read **`docs/COURSE-AUTHORING.md`** first. It covers the audience-vocabulary contract, the nine-element lesson anatomy, the M1+ diagram convention (simple-first analogy Mermaid visible + technical Mermaid wrapped in a `<details>` disclosure), the Mermaid `<br/>` rule, and the full voice-lint check inventory. Skipping that doc and freelancing a lesson is the most common way agents and humans both break the course's audience contract.

If you're an AI agent (Claude, Gemini, Cursor, Copilot, etc.) running on this repo, **`CLAUDE.md`** at the root is your entry point — it lists the hard rules and points at the deeper authoring playbook.

## What we do NOT want yet

- New module content. The course's V1 scope is locked (see `.planning/REQUIREMENTS.md`). Out-of-scope feature ideas live in `.planning/ROADMAP.md` Out of Scope.
- Style/grammar bikeshedding. Fix factual errors, not voice opinions.
- New static-site-generator integrations. The course is plain markdown for V1; the deployed course platform at `https://shipyourfirstthing.com` is owned by Phase 01.1 and not contributor-facing.

## How to PR

1. Fork this repo.
2. Make your change on a topic branch (`git checkout -b common-issues/codespaces-port`).
3. Run any verification commands from the affected lesson's `## Checkpoint` section.
4. PR against `main`. Include in the PR description:
   - **What you changed** (one sentence)
   - **Why** (one sentence)
   - **Tested how** (the command you ran or the lesson section you re-read)

### Before you push: run the voice lint

From the repo root:

```bash
./scripts/voice-lint.sh
```

The script enforces (and exits non-zero on violation):
- No tutorial fiction phrases (the *frictionless-clicks* trope) — LESSON-12
- No filler prose (the *fast-paced-world* opener) — LESSON-12
- No GitHub-specific admonitions like the bracketed-bang note syntax — Phase 1 D-18 (universal `> **Note:**` blockquotes only)
- Every `GLOSSARY.md#anchor` used in lessons resolves to a `### anchor` entry in `GLOSSARY.md` (case-insensitive)
- Every relative path from a lesson to a repo-root cross-cutting doc (`GLOSSARY.md`, `BUDGET.md`, `CHEATSHEET.md`, `COMMON-ISSUES.md`, `CONTRIBUTING.md`, `WHAT-CHANGED.md`, `VERSIONS.md`, `LICENSING.md`, `README.md`, `SETUP.md`) resolves to a real file (the broken-relative-path check catches the bare-`GLOSSARY.md#anchor` 404 bug shape) — added in Plan 01-8
- Jargon-density check against `docs/audience-vocabulary.md`: every term marked `Requires-callout` in a lesson must appear inside the D-04 vocab-callout the first time it appears; every term marked `Forbidden` must not appear bare. Today the M0/M1 prose has known gaps against the strict contract — those are surfaced as `WARN` lines and triaged via the editorial backlog rather than hard-failing the lint. New lessons should aim for clean strict output. — added in Plan 01-8
- Check #8 (m3-dual-agent) catches missing `Claude Code:` or `Gemini CLI:` labels in M3 lessons (per D-27) — added in Plan 02-02

## Tooling / package manager

Lessons + thread project use **npm**; the deferred course platform uses **pnpm**. Both are valid; pick npm in lesson code unless the deferred platform PR explicitly says otherwise.

If the script reports violations, fix them before pushing. `WARN` lines do not fail the lint but flag content that the strict contract would reject; please fix new `WARN` lines you introduce.

To verify the lint itself, run:

```bash
./scripts/voice-lint.sh --self-test
```

This iterates over `scripts/voice-lint-fixtures/` and asserts every fixture trips the check it targets. If `--self-test` fails, a lint check has regressed — fix the check, not the fixture.

## Issue tags

- `freshness` — a tool, version, or upstream behavior changed and a lesson is now stale. The maintainer triages these in the quarterly smoke-test (below).
- `common-issues` — you hit a reproducible issue. Maintainer or you can convert this into a `COMMON-ISSUES.md` entry.
- `voice` — tutorial fiction or filler was spotted in a lesson. Editorial pass treats this as a hard fix.
- `vocab` — a term is used without a `GLOSSARY.md` anchor. Editorial pass.

## Quarterly smoke-test ritual

Phase 1 ships the *documented ritual* in CONTRIBUTING.md; Phase 5 OPS-02 ships the *first dry-run* of it. The ritual is the same in both phases — the formal OPS-02 acceptance is the dry-run, not the documentation.

Once per quarter, the maintainer (or any willing contributor) does this:

1. Open a fresh GitHub Codespace from `main`.
2. Walk through Module 0 → Module 4 Chunk 1 (the Auth chunk in the thread project; lands in Phase 3).
3. Note any deviation between what's written and what actually happens.
4. For each deviation, file an issue tagged `freshness` with:
   - The lesson path (e.g., `modules/01-mental-models/02-where-data-lives.md`)
   - What's stale
   - What you saw instead
5. The maintainer batches these into a revision pass; updates `VERSIONS.md`, `WHAT-CHANGED.md`, and the affected lessons.

The first dry-run of this ritual happens before Phase 5 closes.

## License of contributions

By contributing prose to this repo (lessons, glossary entries, common-issues entries, etc.) you agree to license your contribution under CC BY 4.0 (see `LICENSE-content`). By contributing code (TypeScript, scripts, configuration), you agree to MIT (see `LICENSE`). See `LICENSING.md` for the full split.

## Where to ask questions

Open a GitHub Discussion (or an issue tagged `question` until Discussions are enabled). The course is self-paced and async by design; do not expect same-day replies, but expect replies eventually.
