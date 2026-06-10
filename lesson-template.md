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
     **term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#term))
     The `../../` prefix is correct for lessons at modules/NN-slug/lesson.md (two
     directories deep from repo root, where GLOSSARY.md lives). Adjust if your
     lesson is at a different depth.
     Redefine after long gaps. -->

<!-- LESSON-04 cross-ref — Agent-Responsibility Checkpoint: see CLAUDE.md hard rule 12 and
     docs/COURSE-AUTHORING.md Part 4. For M3.5 (and any later lesson surfacing code, errors,
     or framework mechanics), every D-04 callout introduces the term as a SYMPTOM, not as a
     concept to understand from first principles. The surrounding prose cannot exceed the
     callout's explanation depth. Mechanics the agent owns — reading errors, parsing code,
     framework internals — must not be taught at the audience floor. -->

<!-- LESSON-11 — Use Mermaid for spatial or relational concepts. Standard fenced block.

     For Module 1 (mental-model lessons), use the simple-first / bridge-collapsed convention introduced in Plan 01-7 (and tightened post-UAT): every technical Mermaid (one that uses HTTP / SQL / schema / `=` annotations / `Build server`-style hybrid labels) MUST be (a) preceded by a sibling simple-form Mermaid that uses ONLY the lesson's analogy nouns, and (b) wrapped in a `<details><summary>...</summary> ... </details>` disclosure so the technical diagram is collapsed by default. The summary line frames the disclosure as optional and names which later module covers those technical terms hands-on. Inside the disclosure, a `> *Peek ahead — skim, don't memorize:*` callout carries the analogy→real-term mapping, then the Mermaid block.

     **Critical formatting:** blank lines are required (a) after `<summary>`, (b) before the ` ```mermaid ` fence, (c) after the closing ` ``` `, and (d) before `</details>`. Without them GFM treats the body as raw HTML and the fenced Mermaid block will not render.

     Example:

     ```mermaid
     flowchart LR
       Customer[Customer]
       Waiter[Waiter]
       Kitchen[Kitchen]
       Customer -->|orders| Waiter
       Waiter -->|brings ticket| Kitchen
     ```

     <details>
     <summary>Optional: same picture with the technical labels (Module 3 hands-on)</summary>

     > *Peek ahead — skim, don't memorize:* The same picture with the real names labeled. You'll meet **HTTP**, **server**, and **browser** properly in Module 3. If the labeled diagram feels heavy, close this and move on.

     ```mermaid
     flowchart LR
       Customer["Customer<br/>= browser"]
       Waiter["Waiter<br/>= HTTP"]
       Kitchen["Kitchen<br/>= server"]
       Customer -->|orders| Waiter
       Waiter -->|brings ticket| Kitchen
     ```

     </details>

     The corresponding `diagrams/*.md` standalone source mirrors the order of forms in the lesson body, but uses plain H3 section headers (`### Bridge to the real terms`) instead of `<details>` wrapping — those files are reference docs for contributors, not learner-facing prose. For Module 2+ (toolchain, the loop, building), the bridge convention is optional — by Module 2 the learner has the vocabulary to read technical diagrams directly. Use the disclosure pattern only when introducing a NEW concept whose terminology has not been taught yet. M0 lessons stay diagram-light per existing convention. -->


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
- **D-04 vocab callout pattern:** `**term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#term))` — auditable by grep. The `../../` prefix assumes the lesson lives at `modules/NN-slug/lesson.md` (two directories deep from repo root); adjust the relative path if your lesson is at a different depth. The GLOSSARY anchor is the contract that ensures GLOSSARY.md mirrors lesson vocabulary.
- **Agent-Responsibility Checkpoint (CLAUDE.md hard rule 12; `docs/COURSE-AUTHORING.md` Part 4):** Before shipping any M3.5 or M3.5-adjacent lesson, walk every major section through three audit questions: (1) does this section ask the learner to do something the agent does better and faster? (2) does this section explain mechanics — framework rules, rendering execution, error-message anatomy — the learner does not need to direct the agent? (3) is any term used as a concept to understand from first principles when it should be used as a symptom only? If any answer is yes, rewrite to symptom-and-steer or defer to Module 7. The per-topic floor table lives in COURSE-AUTHORING.md Part 4. `scripts/voice-lint.sh` check #9 emits WARN-level signals when M3.5 lessons drift into agent-territory framing — review WARNs but they do not block the gate.
- **Audience-aware vocabulary contract:** Every technical noun in lesson prose must be classified per `docs/audience-vocabulary.md`: Safe (use freely), Requires-callout (apply the D-04 pattern on first use), or Forbidden (do not use; defer to a later module). The contract is incremental — every term that becomes safe in module N is safe in modules N+1 and onward. If you introduce a new technical noun, update `docs/audience-vocabulary.md` AND `GLOSSARY.md` in the same PR. `scripts/voice-lint.sh` (Plan 01-8) verifies first-use of Requires-callout terms and absence of Forbidden terms.
- **Diagram convention (M1+, Plan 01-7, post-UAT tightening):** Simple-first / bridge-collapsed. Every technical Mermaid is preceded by a simple-form sibling using only analogy nouns AND wrapped in a `<details><summary>...</summary> ... </details>` disclosure so the technical diagram is collapsed by default. The summary names which later module covers those technical terms hands-on. Inside the disclosure: a `> *Peek ahead — skim, don't memorize:*` callout with the analogy→real-term mapping, then the Mermaid block. Blank lines required around the fenced code block inside the disclosure or GFM will not render the Mermaid. This collapse-by-default treatment is load-bearing — a learner who sees both diagrams side-by-side feels obligated to absorb the technical labels and reintroduces the very jargon M1 is designed to defer. M0 stays diagram-light. M2+ uses the disclosure pattern only when introducing new technical vocabulary. The corresponding `diagrams/*.md` standalone source files use plain H3 section headers and stay open (their audience is contributors, not learners).
- **D-05 Loop check intent framing for M1:** Module 1 is pre-loop. Every M1 Loop check names `intent`.
- **D-18 SSG-portability rules:** standard ` ```mermaid ` fences; universal `> **Note:**` / `> **Warning:**` blockquotes (NOT the GitHub-flavored bracketed-bang admonition syntax — that breaks under non-GitHub renderers like Next.js/Docusaurus); relative internal links; YAML front-matter; repo-relative image paths.
