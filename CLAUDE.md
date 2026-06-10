# CLAUDE.md — Agent entry point for "Ship Your First Thing"

> If you're an AI agent (Claude, Gemini, Cursor, Copilot, etc.) working on this repo, read this file first. It tells you the rules of engagement and where the deeper knowledge lives.

## What this project is

An open-source course teaching a non-technical learner to ship a deployed app using AI coding agents. The course is **plain markdown**, no static-site-generator dependency, browsable on github.com. A separate Next.js + Postgres + Drizzle + Auth.js platform (Phase 01.1) renders the same markdown at `shipyourfirstthing.com` later — but every lesson must work on github.com first.

Audience floor: someone who has used a computer (browser, files, email) but has never written production code and has at most viewed a page on GitHub. Every technical term that doesn't pass that floor is either defined on first use or deferred to a later module.

## Authoritative documents — read in this order

1. **This file** — agent rules + pointers.
2. **`.planning/PROJECT.md`** — core value, locked decisions, requirements evolution rules. Source of truth for what the course is for and what it must NOT do.
3. **`.planning/REQUIREMENTS.md`** — locked requirements (LESSON-01…, DOC-01…, OPS-01…, etc.).
4. **`.planning/ROADMAP.md`** — milestone + phase structure, success criteria, dependency chains.
5. **`.planning/STATE.md`** — current position (which phase, which plans complete).
6. **`docs/COURSE-AUTHORING.md`** — the deep authoring knowledge base. Read it before writing or editing any lesson.
7. **`docs/audience-vocabulary.md`** — the per-module Safe / Requires-callout / Forbidden termlist contract. Update it when you introduce a new technical noun in any lesson.
8. **`lesson-template.md`** and **`lesson-template-m0.md`** — the nine-element lesson anatomy contract. Use the M0 variant for Module 0 lessons.
9. **`GLOSSARY.md`** — single source of truth for vocab anchors. Every `[→ GLOSSARY](../../GLOSSARY.md#anchor)` callout target lives here.

## Hard rules (do not violate without explicit user permission)

1. **No tutorial fiction.** Lines like "in just a few clicks", "now you can simply", "as simple as that" reintroduce friction the learner will hit in reality. `scripts/voice-lint.sh` catches these — keep it passing.
2. **No filler.** "In today's fast-paced world", "in this day and age" — cut on sight.
3. **No GitHub-specific admonitions.** `> [!NOTE]`, `> [!WARNING]`, `> [!TIP]` break under non-GitHub renderers. Use `> **Note:**`, `> **Warning:**` instead.
4. **Audience-vocabulary contract is law.** Before using a technical noun in a lesson, find it in `docs/audience-vocabulary.md` for that module. Safe → use freely. Requires-callout → apply the D-04 callout on first use. Forbidden → don't use it; defer to a later module or rewrite via analogy.
5. **D-04 vocab callout pattern is exact:** `**term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#anchor))`. The `../../` is mandatory from `modules/NN-slug/lesson.md` depth. Every anchor must exist as a `### anchor` line in `GLOSSARY.md`.
6. **D-18 SSG-portability.** Standard ` ```mermaid ` fences, relative internal links (no absolute URLs), repo-relative image paths, YAML front-matter, `<details><summary>` for collapsibles is OK (standard HTML5), no SSG-specific shortcodes.
7. **M1+ technical Mermaid is collapsed by default.** Wrap in `<details><summary>...</summary> ... </details>`. The simple-form analogy Mermaid stays visible; the technical version requires a click. See `docs/COURSE-AUTHORING.md` for the exact pattern and the GFM blank-line requirement.
8. **Mermaid HTML break rule.** `<br/>` is fine inside `["..."]` quoted node labels. `<br>` and `<br/>` BOTH break GitHub's Mermaid parser inside sequenceDiagram Notes, sequenceDiagram messages, and flowchart edge labels — write those as single-line text. `scripts/voice-lint.sh` catches this (check #7).
9. **Locked analogies (D-07) are not creative territory.** Bundle 1 = restaurant; bundle 2 = filing cabinet; bundle 3 = door staff / VIP list / hand stamp; bundle 4 = private kitchen → public restaurant. If you need a new analogy for a new lesson, propose it in `.planning/phases/{phase}/PLAN.md` BEFORE writing the lesson.
10. **`.planning/` is gitignored project-wide.** Plans, summaries, state, roadmap — none of it ships in PRs. Don't try to commit it. SUMMARY.md files written by executor agents go to the main repo's `.planning/` path even when the agent runs in a worktree.
11. **Analogies must pass the two-test gate (D-A17).** Before locking an analogy in `.planning/phases/{phase}/CONTEXT.md`, it must pass both tests with one-line evidence per test inside the entry: (a) **standalone** — the felt picture is a coherent everyday scene a non-coder can grasp without any tool-name entering the description; if you have to mention the tool to make the picture make sense, the picture is borrowing meaning rather than lending it. (b) **load-bearing tie** — the mapping covers the lesson's central concept AND predicts at least one failure mode the lesson teaches the learner to spot. Surface-level "kind of like X" is decorative, not load-bearing. If either test fails, propose a different picture. PARTIAL is allowed and means the analogy ships with a known gap a later phase must extend or revise. See `docs/COURSE-AUTHORING.md` for the worked-example contrast (D-42 PASS / PASS vs. D-43 PASS / PARTIAL).
12. **Agent-Responsibility Boundary (M3.5 floor).** Every lesson section is either "the agent handles this" or "the learner does this" — never both. The agent owns: reading errors, parsing code, diagnosing causes, framework mechanics, choosing which file to edit, build internals. The learner owns: stating intent, checking the agent edited the right file, recognizing wrongness, asking for help. Mechanics the agent owns must not be taught at the audience floor. Where a symptom term must be named to ground a steer (for example, `'use client'` or `hydration`), introduce it as a SYMPTOM, never as a concept to understand from first principles. The full boundary spec lives in `.planning/PROJECT.md` Key Decisions; the per-topic M3.5 floor lives in `docs/COURSE-AUTHORING.md` Part 4. `scripts/voice-lint.sh` check #9 emits WARN-level signals when M3.5 lessons drift into agent-territory framing.

## Before you commit

Run `./scripts/voice-lint.sh`. Exit code 0 is required. ~50 `WARN (jargon-density …)` lines are expected — they document the editorial backlog and don't block the gate. **Violations** (lines starting `VIOLATION (...)`) do block.

Run `./scripts/voice-lint.sh --self-test` if you modified `scripts/voice-lint.sh` itself or any file under `scripts/voice-lint-fixtures/`. Exit code 0 means every fixture trips its target check.

## Commit message conventions

Conventional commits scoped by phase + plan:

- `feat(01-3): add Module 0 lesson 03 cost-path triage` — new content.
- `fix(01): use ../../GLOSSARY.md relative path` — repair existing content.
- `docs(01-7): encode simple-first / bridge-collapsed convention` — doc-only changes.
- `test(01-8): add voice-lint fixture for jargon-density check` — fixture or test changes.
- `chore: merge executor worktree (...)` — orchestrator-generated merge commits.

Never reference AI assistants in commits, PR bodies, or branch names. No `Co-Authored-By:` lines naming a model.

## Common ways agents go wrong here (and how to not)

| Mistake | What actually happens | Right thing |
|---------|------------------------|-------------|
| Writing a "Module 1 lesson on auth" without checking `docs/audience-vocabulary.md` | You use `session`, `cookie`, `JWT` without callouts; voice-lint flags them; learner gets jargon-shocked. | Check the M1 termlist first. Forbidden terms get an analogy; Requires-callout terms get D-04 callouts on first use. |
| Adding a `> [!NOTE]` block | Breaks on Next.js/Docusaurus renderers; voice-lint flags. | Use `> **Note:**` blockquote. |
| Putting `<br/>` inside a sequenceDiagram Note | GitHub Mermaid parser rejects it: "Parse error … got 'INVALID'". | Write the Note as a single line. Use `<br/>` ONLY inside `["quoted node labels"]`. |
| Showing simple + technical Mermaid side-by-side (no disclosure) | Learner feels obligated to absorb the technical labels; M1's jargon-deferral defeats itself. | Wrap technical Mermaid in `<details><summary>…</summary> … </details>` per `docs/COURSE-AUTHORING.md`. |
| Putting Mermaid inside `<details>` without blank lines around the fence | GFM treats the body as raw HTML; the Mermaid block doesn't render at all. | Blank line after `<summary>`, before ` ```mermaid `, after closing ` ``` `, before `</details>`. All four are mandatory. |
| Linking to `GLOSSARY.md#term` from inside `modules/NN-slug/lesson.md` (no `../../`) | 404 on github.com. The lint catches this since Plan 01-8 (check #5). | Always use `../../GLOSSARY.md#anchor` from inside a `modules/` lesson. |
| Treating "Anthropic API" as a bare forbidden use of `API` | False positive. Brand-prefixed compounds are not bare uses. | The jargon-density check already strips `[A-Z][a-z]+ API` patterns. Don't fight the lint by rewording brand names. |
| Editing `STATE.md` / `ROADMAP.md` from inside a worktree executor agent | Last-merge-wins overwrites tracking. | Orchestrator owns those writes post-merge. Executors write SUMMARY.md only. |
| Creating a doc file because a task feels incomplete | Doc proliferation, drift, stale guidance. | Update an existing canonical doc (this CLAUDE.md, `docs/COURSE-AUTHORING.md`, `lesson-template.md`, `CONTRIBUTING.md`). New top-level docs require explicit user approval. |

## Where else to look

- **`docs/COURSE-AUTHORING.md`** — the full authoring playbook with worked examples.
- **`CONTRIBUTING.md`** — contributor-facing version (smaller scope, human-friendly).
- **`WHAT-CHANGED.md`** — reverse-chronological log of decisions that shifted between revisions.
- **`scripts/voice-lint.sh`** — the source of truth for what's enforced programmatically.
- **`scripts/voice-lint-fixtures/`** — synthetic content that intentionally trips each check; useful when figuring out what a check actually catches.

## When in doubt

Before changing locked decisions (analogies, lesson anatomy, audience-vocabulary categories, the disclosure pattern), check `.planning/phases/01-foundation-front-door/01-CONTEXT.md` for the decision log (D-01..D-18, with amendments). If the change you want isn't covered, ask the user before doing it.

This is a beginner-pedagogy project. The temptation to add "just one technical word" without a callout is the bug, not the feature. Default to the analogy.
