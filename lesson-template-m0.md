---
title: "Lesson title goes here"
module: "00-welcome"
lesson_number: 01
est_minutes: 20
prereqs: []
updated: "2026-05-08"
deviations: []
---

# {Lesson title}

<!-- M0 variant template — per Phase 1 D-03.
     Required sections (LESSON-01..LESSON-06, LESSON-08, LESSON-10): front-matter, learning objective, why-this-matters, core read, exercise, checkpoint, "what you just did" recap.
     Optional sections (LESSON-07, LESSON-09): going-deeper, Loop check.
     M0 lessons that follow this variant are NOT treated as deviations — the variant IS the M0 baseline.
-->

## Learning objective

## Why this matters

## Core read

<!-- LESSON-03 — Adapt length to topic. M0 reads can be shorter than M1 (200–800 words is fine for Module 0; 600–1500 is the M1+ norm). -->

<!-- LESSON-04 vocab callout pattern: **term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#term))
     The `../../` prefix is correct for M0 lessons at modules/00-welcome/lesson.md
     (two directories deep from repo root, where GLOSSARY.md lives). -->

## Exercise

<!-- LESSON-05 — 10–25 min. M0 exercises are setup-tasks (create an account, run a command, click through a flow), not diagramming. -->

## Checkpoint

## What you just did

## Navigation

[← Previous: {prev}](./{prev-slug}.md)
[Next: {next} →](./{next-slug}.md)

---

## Authors' notes (delete in shipped lessons)

- **D-03:** This is the M0 baseline. M0 lessons that follow this variant do NOT need to declare deviations.
- **Optional sections:** Loop check and going-deeper are optional in M0. If you include either, follow the same patterns as `lesson-template.md`.
- **Audience-aware vocabulary contract (M0 baseline):** Module 0 lessons rewrite against the M0 section of `docs/audience-vocabulary.md`. The M0 audience has not met HTTP, DNS, server, database, schema, SQL, deployment, or any auth term — those are Forbidden in M0. The terms M0 introduces (markdown, Codespace, repo, terminal, code editor, AI coding agent, API key, free tier, rate limit, token) require the D-04 callout on first use. `scripts/voice-lint.sh` (Plan 01-8) verifies the contract.
- **D-18:** SSG-portability rules apply.
