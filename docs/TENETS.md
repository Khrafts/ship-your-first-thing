# TENETS.md — The soul of the course

> Read this file first. Before authoring a lesson, before planning a phase, before reviewing a PR. Every other rule in this repo — CLAUDE.md hard rules, `docs/COURSE-AUTHORING.md` parts, `docs/audience-vocabulary.md` contract, `scripts/voice-lint.sh` checks, per-phase CONTEXT.md decisions — exists in service of the six tenets below. If a rule conflicts with a tenet, the tenet wins. When two tenets pull against each other, see "When tenets collide."

This course teaches **non-technical people** to ship a deployed product using AI coding agents. That sentence is the whole goal. Everything in this file is the answer to "what does *non-technical people* and *with AI coding agents* actually mean, and how do we keep faith with both at the same time?"

The audience floor: comfortable using a computer (browser, email, files), has used GitHub at most to view a page, has never written production code. The course's outcome: that learner ships a real, deployed product **and** recovers when the AI gets it wrong. The "and" is the differentiator. Anyone can copy commands until something breaks; the recovery skill — knowing the AI is wrong, knowing how to steer it back, knowing when to stop and think — is what this course is for.

Each tenet below states what it is and why it exists, then points to where it's operationalized (the HOW lives in `docs/COURSE-AUTHORING.md`, not here) and how far it's actually enforced (honestly — a lint, a hard rule, or human review).

---

## The Six Tenets

### Tenet 1 — Meet a non-technical reader where they are

**Plain statement.** The learner has used a computer (browser, email, files) but has never written production code, and may not know what a file *is* in a technical sense. Two facets, one tenet: (a) **assume nothing technical** — no term lands unless it's Safe, wrapped in a D-04 callout, or deferred; (b) **teach mental frameworks, not mechanics** — the goal is the way the learner *thinks* about software, not the words they can recite. "Just" and "simply" are red flags; they almost always paper over an assumption.

**Why this exists.** A learner with the right mental model can reason about almost any product; a learner buried in jargon stalls at the first unfamiliar word. Every "you already know X" assumption silently excludes the audience the course exists for — if a learner can't follow because of an undefined term, the course failed at line 1 of that lesson. Mechanics belong to the agent; frameworks belong to the learner.

**Operationalized:** `COURSE-AUTHORING.md` Part 1 (audience floor + three-tier vocab contract). `docs/audience-vocabulary.md` is the authoritative per-module term list.
**Enforced:** hard rule 4 (D-04 callout) · voice-lint check #6 (jargon-density), #1 (tutorial fiction), #2 (filler) — *ENFORCED (WARN) for M0–M3.5; human review for M4+*.

---

### Tenet 2 — Practical enough to actually build with agents

**Plain statement.** Lessons earn their place by moving the learner closer to shipping a real product with an AI agent. Every exercise is deliverable-shaped; every concept is named because it's needed RIGHT NOW for the loop to work, not because the syllabus covers it.

**Why this exists.** A course full of theory teaches nothing. The skill is the loop — intent → ask → evaluate → steer — and the loop only becomes a skill through practice on something real. The thread project is the practice ground; every lesson either feeds the loop or sets up the next one that does. If you can't trace a lesson's content to the build, cut it or defer it to Module 7.

**Operationalized:** `COURSE-AUTHORING.md` Part 1 (the loop framing) + the lesson anatomy (LESSON-05 Exercise produces a concrete artifact; LESSON-10 connects back to the loop).
**Enforced:** GUIDANCE (review — trace every lesson to the build or cut it).

---

### Tenet 3 — Relevant analogies only, load-bearing not decorative

**Plain statement.** Analogies do the heavy lifting of mental-model construction. Every analogy must pass the D-A17 two-test gate: **standalone** (a complete everyday scene a non-coder can grasp without the tool being named) and **load-bearing** (the mapping covers the lesson's central concept AND predicts at least one failure mode the lesson teaches the learner to spot).

**Why this exists.** Decorative analogies ("kind of like X") are filler that exhaust attention without return. Load-bearing analogies do the inverse — they replace pages of prose with a felt picture, and they predict the failure modes the learner needs to spot when steering an agent. The locked pictures (restaurant, filing cabinet, door staff, recipe binder, and the M2/M3.5 set) each survived the gate.

**Operationalized:** `COURSE-AUTHORING.md` Part 2 (locked analogies D-07 + the two-test gate D-A17). New analogies are proposed in the phase's CONTEXT.md with an explicit two-test verdict before the lesson body is drafted; M2 L5 and M3.5 L2 are the gold-standard exemplars.
**Enforced:** hard rules 9 + 11 · GUIDANCE (review at the CONTEXT.md gate; no lint).

---

### Tenet 4 — Coherent through-line

**Plain statement.** A module is one journey the learner can feel, not a pile of individually-correct lessons. Each lesson visibly grows from the last, and every module states its arc out loud — the `## What this module builds` spine at the top of its README. In each lesson, "Why this matters" may name the prior-lesson payoff it builds on, and "What you just did" names what it sets up next.

**Why this exists.** Local correctness doesn't add up to a learnable path. Without a stated through-line the learner re-orients from scratch at the top of every lesson, and coherence survives only by luck — a recurring analogy here, the loop there. Coherence is what turns forty correct lessons into one skill. (This is also the hook a future cross-course coherence pass works against: it makes every lesson honor its module's stated spine.)

**Operationalized:** `COURSE-AUTHORING.md` Part 3 (the module spine + the "sets up the next" rule + the coherence review question). The setup/closure this tenet asks for is narrative, distinct from the anxiety-management forward-refs that Part 1's pruning rule deletes.
**Enforced:** GUIDANCE (human review against the README spine; no lint — a grep can't tell a felt continuation from a syllabus recap).

---

### Tenet 5 — Bare minimum to steer, not to code

**Plain statement.** The course teaches the *minimum* needed for the learner to confidently steer an AI agent to a useful product. It does NOT teach the learner to code. Every section in every lesson is either "the agent owns this" or "the learner owns this" — never both. Mechanics the agent owns are not taught at the audience floor; when a term must be named to ground a steer, it's introduced as a SYMPTOM, not a concept.

**Why this exists.** The agent is faster, better, and more current at parsing code, reading errors, designing schemas, applying framework patterns, and chasing types. The learner is better at knowing what they want, recognizing when the agent missed the point, applying a smell-test, and asking for help. Teaching the learner to do the agent's job wastes their most precious resource — attention — at the exact moment the loop most needs it.

**Operationalized:** `COURSE-AUTHORING.md` Part 5 (M3.5 observation floor + the Q1–Q3 audit questions) and Part 6 (M4+ execution floor + per-phase smell-test inventories). Run Q1–Q3 against each section *as you write it*.
**Enforced:** hard rules 12 + 13 · voice-lint check #9 (M3.5 diagnostic-framing, WARN-only) — mostly GUIDANCE (review).

---

### Tenet 6 — Practical understanding of AI / LLM / agent limitations

**Plain statement.** A learner who cannot recognize when the agent is wrong cannot recover when the agent is wrong. The course names six core agent limitations — hallucination, drift, context-window overflow, training cutoff, confident-wrong, risk-blindness — and arms the learner with a concrete smell-test for each. **Naming a failure mode without giving the learner the smell-test for it is forbidden** (hard rule 14).

**Why this exists.** The single most common way the loop fails — confident agent + non-technical user + no smell-test = a broken product the user can't recognize as broken — is what this course was built to prevent. The recovery skill is the differentiator. The smell-test is the bridge between "the agent might hallucinate" (abstract) and "the agent's `apiKey` reference doesn't match anything in our `.env` — let me ask where that name came from" (practical).

**Operationalized:** `COURSE-AUTHORING.md` Part 7 (six-limitation taxonomy + per-limit smell-test patterns + anchor lessons + the anchor-lesson exception). M2 L6 is the Tenet 6 anchor; M3 L3 teaches the hallucination smell-test in depth; M5 ships three watch-it-fail walkthroughs.
**Enforced:** hard rule 14 · GUIDANCE (review; no lint yet).

---

## When tenets collide

The tenets mostly reinforce each other, but two pairs pull apart in practice. The resolutions are fixed:

- **Tenet 1 vs Tenet 6 — the anchor-lesson exception.** Tenet 1 says defer jargon; Tenet 6 says arm the learner against named failure modes. When a failure-mode term (e.g., `hallucination`) is Forbidden in a module's tier but the module needs to teach the failure mode, the module's **designated anchor lesson** introduces the term once — with a callout, in the "notice the name" framing. Every other lesson in that module defers in plain words and forward-references the anchor. (Full rule + the worked `hallucination` case: `COURSE-AUTHORING.md` Part 7.)
- **Tenet 4 vs Tenet 1 — coherence never overrides accessibility.** If making two lessons flow would require a jargon bridge, accessibility wins. Carry the through-line with the recurring analogy or the loop step, not with a technical term the learner hasn't met.
- **General rule.** When two tenets pull apart, the one protecting the learner's comprehension (Tenet 1) wins. Coherence (T4) and completeness (T2) yield to it.

---

## How agents apply these tenets in practice

1. **Read this file before reading anything else.** TENETS.md is the first read for every authoring task.
2. **Read `docs/COURSE-AUTHORING.md` for the operational playbook.** The tenets state WHAT; COURSE-AUTHORING explains HOW.
3. **Read CLAUDE.md for the hard rules.** Fourteen hard rules. Don't violate without explicit user permission.
4. **Run `scripts/voice-lint.sh` before every commit.** Exit code 0 is the gate. WARNs document the editorial backlog; VIOLATIONs block. Don't read "exit 0" as "contract satisfied" — check #6 only surfaces vocab gaps as WARN, and only for M0–M3.5.
5. **Check the audience-vocabulary contract for the target module before writing.** Forbidden / Requires-callout / Safe / SYMPTOM-only.
6. **Apply the three audit questions (Q1–Q3) section-by-section as you write** (COURSE-AUTHORING Part 5). Symptom-and-steer is harder to retrofit than to draft.
7. **Honor the module spine** (COURSE-AUTHORING Part 3): build on the named prior payoff, set up the next.
8. **For build-phase lessons (M4+), confirm the phase has a CONTEXT.md with the smell-test inventory.** No execution-floor lesson ships without the inventory being locked.
9. **For any lesson that names an agent failure mode, confirm the smell-test is either in the same lesson or explicitly forward-referenced.** Hard Rule 14 is non-negotiable.

---

## What this file is NOT

- A checklist that replaces reading `docs/COURSE-AUTHORING.md`.
- A substitute for `docs/audience-vocabulary.md` (the per-module termlist contract).
- A negotiating position. The tenets are locked. Concrete rules and lints are adjustable; the tenets aren't.
- A grand statement of brand values. Each tenet exists because skipping it broke a specific lesson or audited drift in a specific module. The tenets are load-bearing pedagogy, not marketing.

---

## When to update this file

- Adding a tenet — only with explicit user approval. Six is the working number. Adding a seventh implies the existing six don't cover something material.
- Strengthening a tenet's enforcement (e.g., moving from GUIDANCE to ENFORCED via a new lint) — log the change, update the tenet's **Enforced** line, link the relevant CLAUDE.md hard rule.
- Recording a tenet violation that shipped and was later caught — link the affected phase, the audit, the remediation. The course learns from its mistakes by writing them down.

---

## Cross-references

- `CLAUDE.md` — hard rules 1–14 (enforcement layer).
- `docs/COURSE-AUTHORING.md` — the authoring playbook (operational layer). Part 1 vocab · Part 3 coherence · Part 5 M3.5 floor · Part 6 M4+ floor · Part 7 AI-limitation.
- `docs/audience-vocabulary.md` — per-module termlist contract (the authoritative term list).
- `.planning/PROJECT.md` Key Decisions — the historical decision log.
- `scripts/voice-lint.sh` — programmatic enforcement (where it exists).
- `lesson-template.md` — the nine-element lesson anatomy + the Q1–Q3 + Execution-Floor authors' notes.

---

*Last updated: 2026-06-08 — Tenet renumber + coherence. Old Tenet 1 (accessible) and old Tenet 4 (assumes nothing technical) merged into the new Tenet 1 ("Meet a non-technical reader where they are"). New Tenet 4 ("Coherent through-line") added. Tenets 2, 3, 5, 6 unchanged in meaning; T5 (steer) and T6 (AI limitations) keep their numbers. Per-tenet structure trimmed to Plain statement + Why + Operationalized/Enforced pointers (the HOW moved to COURSE-AUTHORING). Earlier log entries elsewhere (e.g. WHAT-CHANGED.md before this date) reference the old six-tenet numbering.*
*Original lock: 2026-05-18 — six tenets consolidated from PROJECT.md philosophy + CLAUDE.md hard rules + COURSE-AUTHORING.md parts + audience-vocabulary contract + voice-lint checks + per-phase CONTEXT decision logs.*
