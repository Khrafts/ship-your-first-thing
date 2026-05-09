---
title: "Lesson title goes here"
module: "01-mental-models"            # the module folder slug
lesson_number: 02                     # the NN in the filename
est_minutes: 45                       # rough total time for read + exercise
prereqs: []                           # list of prior lesson slugs the reader needs
updated: "2026-05-08"                 # date-stamp per LESSON-08; only required for tool-dependent lessons but recommended for all
deviations: []                        # per D-02: list any anatomy elements the lesson skips, e.g. [no-going-deeper] or [short-core-read]
---

# {Lesson title}

## Learning objective

<!-- LESSON-01 — One sentence. Begin with "By the end of this lesson, you will be able to..." -->

## Why this matters

<!-- LESSON-02 — 2–4 sentences. Connect to the learner's lived experience or to the build payoff later in the course. -->

## Core read

<!-- LESSON-03 — 600–1500 words typical. Adapt to topic; if the read is shorter or longer, declare via front-matter `deviations: [short-core-read]` or `[long-core-read]` AND add a `> **Deviation note:**` blockquote inline at the top of this section. -->

<!-- LESSON-04 — Define vocabulary inline on first use using this pattern:
     **term** (one-line definition, [→ GLOSSARY](GLOSSARY.md#term))
     Redefine after long gaps. -->

<!-- LESSON-11 — Use Mermaid for spatial or relational concepts. Standard fenced block:
     ```mermaid
     flowchart LR
       A[Customer] --> B[Waiter]
       B --> C[Kitchen]
     ```
-->

## Exercise

<!-- LESSON-05 — 10–25 minutes. Be concrete. State the deliverable. State whether pencil + paper, excalidraw.com, code, or other is acceptable. -->

## Checkpoint

<!-- LESSON-06 — "You've got this if you can ___" — one or two short, testable claims. -->

## Going deeper

<!-- LESSON-07 — Optional pointers (links, books, deeper rabbit holes). NEVER required. If the lesson has none, declare via front-matter `deviations: [no-going-deeper]` AND remove this section. -->

## Loop check

<!-- LESSON-09 — Name which loop step (intent / ask / evaluate / steer) this lesson reinforces, with one sentence connecting it to the lesson content.
     For Module 1 (pre-loop), per Phase 1 D-05, ALL Loop checks name `intent`:
     > **Loop check — intent.** Knowing how a database is structured changes the *ask* you'll write in Module 3 — but the loop step this lesson reinforces is **intent**: knowing what you're trying to build before you start asking. -->

## What you just did

<!-- LESSON-10 — 2–4 sentences recapping the exercise and connecting it back to the durable AI-coding loop. -->

## Navigation

<!-- prev/next markdown links per OPS-05 -->

[← Previous: {prev lesson title}](./{prev-slug}.md)
[Next: {next lesson title} →](./{next-slug}.md)

---

## Authors' notes (delete in shipped lessons)

- **D-01:** This template is the skeleton; the exemplar is `modules/01-mental-models/02-where-data-lives.md`. Refer to it for tone and depth.
- **D-02 deviations rule:** If you skip or shorten any anatomy element, add it to the front-matter `deviations: []` array AND drop a `> **Deviation note:**` blockquote near the affected section explaining why.
- **D-04 vocab callout pattern:** `**term** (one-line definition, [→ GLOSSARY](GLOSSARY.md#term))` — auditable by grep. The GLOSSARY anchor is the contract that ensures GLOSSARY.md mirrors lesson vocabulary.
- **D-05 Loop check intent framing for M1:** Module 1 is pre-loop. Every M1 Loop check names `intent`.
- **D-18 SSG-portability rules:** standard ` ```mermaid ` fences; universal `> **Note:**` / `> **Warning:**` blockquotes (NOT the GitHub-flavored bracketed-bang admonition syntax — that breaks under non-GitHub renderers like Next.js/Docusaurus); relative internal links; YAML front-matter; repo-relative image paths.
