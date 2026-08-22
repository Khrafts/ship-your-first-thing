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

An entry is required when your change: updates a verified tool version (`VERSIONS.md` step 2), refreshes a conversation panel or a screenshot, shifts a lesson's content meaningfully, changes a locked decision, or closes a phase. One entry per PR — a multi-lesson refresh pass is ONE batched entry naming the lessons in its **Change:** line, not one entry per lesson.

Insert the entry at the top of the live region (above the boundary comment, newest first), in exactly this shape:

```markdown
## YYYY-MM-DD — plain-words summary (72 characters or fewer)

**Change:** What shifted, in one or two sentences a Module 0 reader can follow.
**If you're affected:** One concrete action — or the literal sentence "No learner action — internal change."
**Details:** Links only: the PR, plus the doc that owns the substance (VERSIONS.md, CHEATSHEET.md, …).
```

voice-lint check #10 blocks an entry in the live region that breaks any of these:

- At most 6 non-blank body lines per entry; summary at most 72 characters; no line over 300 characters (the caps count bytes, so a summary heavy in `—`/curly quotes has a little less headroom).
- The 300-character cap applies to **every line in the live region**, including rows of the `## Fast answers` triage table — not just the lines inside a dated entry. A table row cannot be wrapped without breaking the table, so when a row trips the cap the fix is to shorten it, never to split it across lines. Existing rows run 144–292 bytes; stay in that range.
- All three labels present: `**Change:**`, `**If you're affected:**`, `**Details:**`.
- A dated `## YYYY-MM-DD — summary` heading, and the boundary comment still in place.
- No internal codenames (decision IDs `D-xx`/`CD-xx`, `Plan n-n`, `Wave n`, `Phase n`, success-criterion `SC #n`) and no `.planning/` paths — those mean nothing to learners. Put them in the PR body.

Review-enforced (not lint-checked, but expected):

- Start the summary with `Internal:` when the entry has no learner-visible effect, so learners can skip it from the heading alone.
- Entries below the boundary comment are historical and preserved verbatim — never edit them. The lint only scans the live region above the boundary, so an entry placed below it escapes the caps entirely; always insert above the boundary.

**Forgot one?** When you open a PR that changes learner-facing content (a lesson, `VERSIONS.md`, or a capture) without adding an entry, the `whatchanged-reminder` check posts a note and a ready-to-fill stub in the PR's summary. It is advisory — it never blocks the PR, and it is the complement to check #10: #10 validates an entry you *wrote*, the reminder catches one you *forgot*. If your change genuinely needs no entry, dismiss it by adding the `no-changelog` label or putting `[skip changelog]` in the PR description.

### Refreshing a Module 3 conversation panel

Every Module 3 ask is shown twice — once in Claude Code desktop, once in the ChatGPT app (Codex) — as a prose conversation panel, not a terminal transcript. This is the canonical refresh protocol (the historical per-lesson capture copies live inside the collapsed `WHAT-CHANGED.md` entries). When either app's behavior visibly drifts from what a lesson's panels show, open a PR that:

1. Re-runs that lesson's asks in the named app, against the `loop-practice` page in its per-lesson state.
2. Updates the panel wording to match what the app actually did — real behavior, never idealized. Do not clean up hallucinations or over-engineering; they are the pedagogy the lesson teaches the learner to recognize.
3. Updates the grounding comments that sit above the panels (the dated `Grounded in a real agent run` line above a Claude Code panel, the verification slot above a Codex one) so the note matches the wording it vouches for.
4. Bumps the lesson's front-matter `updated:` date AND its `> **Last verified:**` date.
5. Adds ONE thin WHAT-CHANGED entry covering every lesson refreshed in that pass.

## What we do NOT want yet

- New module content. The course's V1 scope is locked (see `.planning/REQUIREMENTS.md`). Out-of-scope feature ideas live in `.planning/ROADMAP.md` Out of Scope.
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
