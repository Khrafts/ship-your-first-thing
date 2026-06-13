# Contributing

Thank you for considering contributing to Ship Your First Thing. This is an open-source course. The best contributions are usually small, factual, and aimed at making the next learner's experience smoother.

## What we want most

In rough priority order:

1. **`COMMON-ISSUES.md` entries** — you hit something that broke; you fixed it; the fix is reproducible. PR it.
2. **`WHAT-CHANGED.md` updates** — a tool released a new version that affects a lesson. Add a thin entry per [the entry rules](#adding-a-what-changed-entry).
3. **Freshness fixes** — a screenshot, command, or version reference is stale. PR a correction.
4. **Vocab/glossary fills** — a lesson uses a term that isn't yet in `GLOSSARY.md`. PR an entry.
5. **Voice fixes** — you spotted tutorial fiction (the *frictionless-clicks* trope where reality has ten steps and bureaucracy) or filler (the *fast-paced-world* opener that says nothing). PR a rewrite.

## If you're authoring a new lesson or editing one substantially

Read **`docs/COURSE-AUTHORING.md`** first. It covers the audience-vocabulary contract, the nine-element lesson anatomy, the M1+ diagram convention (simple-first analogy Mermaid visible + technical Mermaid wrapped in a `<details>` disclosure), the Mermaid `<br/>` rule, and the full voice-lint check inventory. Skipping that doc and freelancing a lesson is the most common way agents and humans both break the course's audience contract.

If you're an AI agent (Claude, Gemini, Cursor, Copilot, etc.) running on this repo, **`CLAUDE.md`** at the root is your entry point — it lists the hard rules and points at the deeper authoring playbook.

## Adding a WHAT-CHANGED entry

`WHAT-CHANGED.md` is a learner-facing freshness log, not a contributor changelog. **PR bodies and commit messages are the contributor changelog of record** — depth goes there, never in the entry.

An entry is required when your change: updates a verified tool version (`VERSIONS.md` step 2), re-captures a transcript or screenshot, shifts a lesson's content meaningfully, changes a locked decision, or closes a phase. One entry per PR — a multi-lesson re-capture pass is ONE batched entry naming the lessons in its **Change:** line, not one entry per lesson.

Insert the entry at the top of the live region (above the boundary comment, newest first), in exactly this shape:

```markdown
## YYYY-MM-DD — plain-words summary (72 characters or fewer)

**Change:** What shifted, in one or two sentences a Module 0 reader can follow.
**If you're affected:** One concrete action — or the literal sentence "No learner action — internal change."
**Details:** Links only: the PR, plus the doc that owns the substance (VERSIONS.md, CHEATSHEET.md, …).
```

voice-lint check #10 blocks an entry in the live region that breaks any of these:

- At most 6 non-blank body lines per entry; summary at most 72 characters; no line over 300 characters (the caps count bytes, so a summary heavy in `—`/curly quotes has a little less headroom).
- All three labels present: `**Change:**`, `**If you're affected:**`, `**Details:**`.
- A dated `## YYYY-MM-DD — summary` heading, and the boundary comment still in place.
- No internal codenames (decision IDs `D-xx`/`CD-xx`, `Plan n-n`, `Wave n`, `Phase n`, success-criterion `SC #n`) and no `.planning/` paths — those mean nothing to learners. Put them in the PR body.

Review-enforced (not lint-checked, but expected):

- Start the summary with `Internal:` when the entry has no learner-visible effect, so learners can skip it from the heading alone.
- Entries below the boundary comment are historical and preserved verbatim — never edit them. The lint only scans the live region above the boundary, so an entry placed below it escapes the caps entirely; always insert above the boundary.

### Re-running a Module 3 transcript capture

This is the canonical re-capture protocol (the historical per-lesson copies live inside the collapsed `WHAT-CHANGED.md` entries). When Claude Code or Gemini CLI changes its output shape, open a PR that:

1. Re-runs the lesson's capture phases against `modules/03-the-loop/scratch/index.html` in its per-lesson state.
2. Replaces the fenced transcript blocks verbatim — real captures, never idealized. Do not clean up hallucinations or over-engineering; they are the pedagogy.
3. Bumps the lesson's front-matter `updated:` date AND its `> **Last captured:**` date.
4. Adds ONE thin WHAT-CHANGED entry covering every lesson re-captured in that PR.

## What we do NOT want yet

- New module content. The course's V1 scope is locked (see `.planning/REQUIREMENTS.md`). Out-of-scope feature ideas live in `.planning/ROADMAP.md` Out of Scope.
- Style/grammar bikeshedding. Fix factual errors, not voice opinions.
- New static-site-generator integrations. The course is plain markdown for V1; the deployed course platform at `https://shipyourfirstthing.com` lives in `site/` and is not contributor-facing yet.

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
- Jargon-density check against `docs/audience-vocabulary.md`: every term marked `Requires-callout` in a lesson must appear inside the D-04 vocab-callout the first time it appears; every term marked `Forbidden` must not appear bare. Today the prose across M0–M3.5 has known gaps against the strict contract — those are surfaced as `WARN` lines (run `./scripts/voice-lint.sh | grep -c '^WARN'` for the live count) and triaged via the editorial backlog rather than hard-failing the lint. New lessons should aim for clean strict output. The check scans **M0–M3.5**; M4–M7 are human-review until those modules exist. — added in Plan 01-8, extended to M2–M3.5 on 2026-06-08
- Check #8 (m3-dual-agent) catches missing `Claude Code:` or `Gemini CLI:` labels in M3 lessons (per D-27) — added in Plan 02-02
- Check #9 (m35-diagnostic-framing) flags M3.5 prose drifting into agent-owned mechanics — WARN-only, per CLAUDE.md hard rule 12
- Check #10 (whatchanged-entry-shape) enforces the [thin-entry contract](#adding-a-what-changed-entry) on `WHAT-CHANGED.md`'s live region — dated heading, three labeled lines, size caps, no internal codenames — added 2026-06-12

## Tooling / package manager

Lessons + thread project use **npm**; the course platform at `site/` uses **pnpm**. Both are valid; pick npm in lesson code unless a platform PR explicitly says otherwise.

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
