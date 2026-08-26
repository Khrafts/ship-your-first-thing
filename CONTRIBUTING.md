# Contributing

Thank you for considering contributing to Ship Your First Thing. This is an open-source course. The best contributions are usually small, factual, and aimed at making the next learner's experience smoother.

## What we want most

In rough priority order:

1. **`COMMON-ISSUES.md` entries** — you hit something that broke; you fixed it; the fix is reproducible. PR it.
2. **Freshness fixes** — a screenshot, command, or version reference is stale. PR a correction.
3. **Vocab/glossary fills** — a lesson uses a term that isn't yet in `GLOSSARY.md`. PR an entry.
4. **Voice fixes** — you spotted tutorial fiction (the *frictionless-clicks* trope where reality has ten steps and bureaucracy) or filler (the *fast-paced-world* opener that says nothing). PR a rewrite.

## If you're authoring a new lesson or editing one substantially

Read **`docs/COURSE-AUTHORING.md`** first. It covers the audience-vocabulary contract, the nine-element lesson anatomy, the M1+ diagram convention (simple-first analogy Mermaid visible + technical Mermaid wrapped in a `<details>` disclosure), the Mermaid `<br/>` rule, and the full voice-lint check inventory. Skipping that doc and freelancing a lesson is the most common way agents and humans both break the course's audience contract.

If you're an AI agent (Claude, Gemini, Cursor, Copilot, etc.) running on this repo, **`CLAUDE.md`** at the root is your entry point — it lists the hard rules and points at the deeper authoring playbook.

> **Note:** Those documents cite paths beginning `.planning/` — the maintainer's phase plans, roadmap, requirements, and per-phase decision logs. That directory is gitignored project-wide, so your fork does not contain it and no PR can add it. Nothing you need in order to contribute lives there: `README.md` says what the course covers, `docs/TENETS.md` what it is trying to be, `CLAUDE.md` the hard rules, and `docs/COURSE-AUTHORING.md` the authoring playbook. Read a `.planning/` path as a note about where a decision was recorded, not as a document you are expected to open.

## Adding a WHAT-CHANGED entry

**Don't — the log closed on 2026-08-22.** `WHAT-CHANGED.md` stays in the repo as the record of what changed up to that date, and the lessons still link to it for exactly that. Nothing adds to it: no PR is expected to, and no lint check gates it.

Two things follow for contributors:

- **Never edit an existing entry.** They are the record; editing one rewrites history a learner may have already read.
- **Depth belongs in your PR body and commit messages**, which were always the contributor changelog of record.

When a lesson has drifted from what a tool actually does now, the fix is the lesson itself — see [Refreshing a Module 3 conversation panel](#refreshing-a-module-3-conversation-panel) for the pattern, and note that lessons route a learner's live drift question to the in-lesson chat, not to this log.

### Refreshing a Module 3 conversation panel

Every Module 3 ask is shown twice — once in Claude Code desktop, once in the ChatGPT app (Codex) — as a prose conversation panel, not a terminal transcript. This is the canonical refresh protocol (the historical per-lesson capture copies live inside the collapsed `WHAT-CHANGED.md` entries). When either app's behavior visibly drifts from what a lesson's panels show, open a PR that:

1. Re-runs that lesson's asks in the named app, against the `loop-practice` page in its per-lesson state.
2. Updates the panel wording to match what the app actually did — real behavior, never idealized. Do not clean up hallucinations or over-engineering; they are the pedagogy the lesson teaches the learner to recognize.
3. Updates the grounding comments that sit above the panels (the dated `Grounded in a real agent run` line above a Claude Code panel, the verification slot above a Codex one) so the note matches the wording it vouches for.
4. Bumps the lesson's front-matter `updated:` date AND its `> **Last verified:**` date.

## What we do NOT want yet

- New module content. The course's V1 scope is locked, and the module list in [`README.md`](./README.md#table-of-contents) is what it ships — if a module is not in that list, it is not in V1. Out-of-scope feature ideas belong in an issue, not a branch; the maintainer tracks them outside this repo.
- Style/grammar bikeshedding. Fix factual errors, not voice opinions.
- New static-site-generator integrations. The course is plain markdown for V1; the deployed course platform at `https://shipyourfirstthing.com` lives in `site/` and is not contributor-facing yet.

## How to PR

1. Fork this repo.
2. Make your change on a topic branch (`git checkout -b common-issues/github-verification`).
3. Re-read the affected lesson's `## Checkpoint` section and confirm every line in it is still true after your change.
4. PR against `main`. Include in the PR description:
   - **What you changed** (one sentence)
   - **Why** (one sentence)
   - **Tested how** (the lesson section you re-read, or the lint run below)

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
- Jargon-density check against `docs/audience-vocabulary.md`: every term marked `Requires-callout` in a lesson must appear inside the D-04 vocab-callout the first time it appears; every term marked `Forbidden` must not appear bare. Today the prose across M0–M7 has known gaps against the strict contract — those are surfaced as `WARN` lines (run `./scripts/voice-lint.sh | grep -c '^WARN'` for the live count) and triaged via the editorial backlog rather than hard-failing the lint. New lessons should aim for clean strict output. The check scans **M0–M7**. — added in Plan 01-8; extended to M2–M3.5 on 2026-06-08, then to M4, M5, M6 and M7 as each of those modules shipped (the runner guards each block on the module directory existing). The Module 3.5 scan block went away with that module's retirement on 2026-08-12
- Check #9 (debugging-framing) flags lesson prose under `modules/` drifting into agent-owned mechanics — WARN-only, per CLAUDE.md hard rule 12. The runner scans every `*.md` under `modules/` **except `README.md`**, and within a scanned file it skips front-matter, fenced code blocks, and blockquote lines — so a module README, a code fence, or a `>` callout never trips it

## Tooling / package manager

Lessons + thread project use **npm**; the course platform at `site/` uses **pnpm**. Both are valid; pick npm in lesson code unless a platform PR explicitly says otherwise.

If the script reports violations, fix them before pushing. `WARN` lines do not fail the lint but flag content that the strict contract would reject; please fix new `WARN` lines you introduce.

To verify the lint itself, run:

```bash
./scripts/voice-lint.sh --self-test
```

This iterates over `scripts/voice-lint-fixtures/` and asserts every fixture trips the check it targets. If `--self-test` fails, a lint check has regressed — fix the check, not the fixture.

## Issue tags

- `freshness` — a tool, version, or upstream behavior changed and a lesson is now stale — including an external link that no longer reaches what the lesson says it reaches. The maintainer triages these in the quarterly smoke-test (below).
- `common-issues` — you hit a reproducible issue. Maintainer or you can convert this into a `COMMON-ISSUES.md` entry.
- `voice` — tutorial fiction or filler was spotted in a lesson. Editorial pass treats this as a hard fix.
- `vocab` — a term is used without a `GLOSSARY.md` anchor. Editorial pass.

## Quarterly smoke-test ritual

This ritual is the course's freshness cadence, and it is documented and ready to run. Its first full dry-run is still outstanding: walking a clean install start to finish needs a person driving a desktop app on their own machine, which is not something the repo can do for itself. Until that happens, treat the steps below as written but unrehearsed — a step that doesn't match what you meet is worth a `freshness` issue in its own right.

Once per quarter, the maintainer (or any willing contributor) does this:

1. Install a clean copy of an agent app — Claude Code desktop or Codex in the ChatGPT desktop app — following [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md) (the course retired the GitHub Codespaces launch flow 2026-08-12; see `WHAT-CHANGED.md`).
2. Walk through Module 0 → Module 4 Chunk 2 (the sign-in chunk in the thread project, `modules/04-thread-project/02-sign-in.md`).
3. Note any deviation between what's written and what actually happens.
4. **Re-check every dated external link** — the step below, in this same pass. Deviations it turns up are deviations for step 5 like any other.
5. For each deviation, file an issue tagged `freshness` with:
   - The lesson path (e.g., `modules/01-mental-models/02-where-data-lives.md`)
   - What's stale
   - What you saw instead
6. The maintainer batches these into a revision pass; updates `VERSIONS.md`, `WHAT-CHANGED.md`, and the affected lessons.

### Link freshness — dated pointers to other people's documentation

*Locked 2026-08-21.* Some lessons — Module 7 Lesson 3 above all — point at documentation this repo does not control. An outbound link is the one thing in
this course that can rot without anybody touching the repo: the page moves, the section is rewritten, the product renames the feature, and the lesson goes
on claiming it. This is **step 4 of the ritual above, not a second cadence.** There is one cadence or none.

**The stamp.** Every curated external pointer ends with its own verification date, as the last sentence of the pointer's line:

```
- [Row Level Security](https://example.invalid/docs/rls) — the rules that decide who can read and change each row, with worked examples. **Link last verified: 2026-08-21.**
```

Bold label, ISO date, full stop. No admonition, no HTML, no table — it renders as plain bold text on github.com and under every SSG the course has to survive.
One stamp per external link, placed after the one-line description of what is there, so the reader meets the topic and the "is this for you?" framing before
the housekeeping.

**What the date means.** It is the date somebody last opened that link and confirmed it still reaches *what the lesson says it reaches*. It is **not** the
date the link was added and **not** the date the lesson was edited. Those three diverge, and the divergence is the entire value of the stamp.

**What to do with each link, in this pass.** Open it. Then exactly one of:

- Still reaches what the pointer claims → refresh the date. Nothing else changes.
- Moved, but the new page still covers the topic → update the URL and the date in the same edit.
- No longer covers what the pointer claims, or is gone → **do not refresh the date.** Re-cut the pointer or drop it, and file the `freshness` issue.
  A refreshed stamp over a claim that has drifted is worse than a stale one: the stamp is the only thing telling a reader the claim was ever checked.

**Scope.** The stamp is required on Module 7 Lesson 3's curated pointers and permitted anywhere else; this step covers every dated external link under
`modules/`. Undated external links in older lessons (Module 1's "Going deeper" lists, Module 0's signup links) are outside it until they adopt the stamp —
adopting it is what enrols a link in the cadence.

**The learner is not part of this.** This is a maintainer contract with a learner-visible date; it asks a reader for nothing. A lesson carrying dated
pointers says once, above the list, what to do if one is dead — in the same shape as the `> **Last verified:**` tutor-drift banner, pointing at the
in-lesson tutor rather than at a task:

> **If one of these links is dead:** nothing here touches your app and there is nothing you need to fix — on the course site, open the lesson chat
> ("Ask about this lesson"), tell it which pointer you were following, and it can tell you what that pointer was about and what to search for instead.

Anyone who *wants* to report a dead link has the `freshness` issue tag above. Nobody is asked to.

## License of contributions

By contributing prose to this repo (lessons, glossary entries, common-issues entries, etc.) you agree to license your contribution under CC BY 4.0 (see `LICENSE-content`). By contributing code (TypeScript, scripts, configuration), you agree to MIT (see `LICENSE`). See `LICENSING.md` for the full split.

## Where to ask questions

Open a GitHub Discussion (or an issue tagged `question` until Discussions are enabled). The course is self-paced and async by design; do not expect same-day replies, but expect replies eventually.
