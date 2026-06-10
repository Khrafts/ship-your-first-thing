# TENETS.md — The soul of the course

> Read this file first. Before authoring a lesson, before planning a phase, before reviewing a PR. Every other rule in this repo — CLAUDE.md hard rules, `docs/COURSE-AUTHORING.md` parts, `docs/audience-vocabulary.md` contract, `scripts/voice-lint.sh` checks, per-phase CONTEXT.md decisions — exists in service of the six tenets below. If a rule conflicts with a tenet, the tenet wins.

This course teaches **non-technical people** to ship a deployed product using AI coding agents. That sentence is the whole goal. Everything in this file is the answer to "what does *non-technical people* and *with AI coding agents* actually mean, and how do we keep faith with both at the same time?"

The audience floor: comfortable using a computer (browser, email, files), has used GitHub at most to view a page, has never written production code. The course's outcome: that learner ships a real, deployed product **and** recovers when the AI gets it wrong. The "and" is the differentiator. Anyone can copy commands until something breaks; the recovery skill — knowing the AI is wrong, knowing how to steer it back, knowing when to stop and think — is what this course is for.

---

## The Six Tenets

### Tenet 1 — Accessible to non-technical audience

**Plain statement.** Lessons avoid jargon and provide mental frameworks, not mechanics. The goal is the way a learner *thinks* about software, not the words they can recite.

**Why this exists.** A learner who has the right mental model can reason about almost any product. A learner buried in jargon stalls at the first unfamiliar word. Mechanics belong to the agent; mental frameworks belong to the learner.

**How an authoring agent applies it.**
- Every technical noun in lesson prose must pass `docs/audience-vocabulary.md` (Safe / Requires-callout / Forbidden / SYMPTOM-only).
- Frameworks-first / mechanics-second. The Core read teaches the *picture*; the *plumbing* either lives in `<details>` disclosure for M1+ or doesn't appear at all.
- If a word would force a fresh reader to slow down and decode, the word is either deferred or wrapped in a D-04 callout.

**Where it's enforced.**
- CLAUDE.md hard rule 4 (D-04 callout pattern is mandatory).
- `docs/audience-vocabulary.md` (per-module termlist contract).
- `scripts/voice-lint.sh` check #6 (jargon-density — ENFORCED).

---

### Tenet 2 — Practical enough to actually build with agents

**Plain statement.** Lessons earn their place by moving the learner closer to shipping a real product with an AI agent. Every exercise is deliverable-shaped; every concept is named because it's needed RIGHT NOW for the loop to work, not because the syllabus covers it.

**Why this exists.** A course full of theory teaches nothing. The skill is the loop — intent → ask → evaluate → steer — and the loop only becomes a skill through practice on something real. The thread project is the practice ground; every lesson either feeds the loop or sets up the next one that does.

**How an authoring agent applies it.**
- Every lesson has an Exercise (LESSON-05), and the Exercise produces a concrete artifact (a paper sketch, an Excalidraw diagram, a working commit, a deployed URL, a captured transcript).
- "Why this matters" (LESSON-02) follows the felt-pain template (D-A5..D-A8) — name the everyday scene, name the pain the lesson's tool resolves, name how it resolves.
- No lesson teaches a concept that isn't load-bearing for the next two lessons OR for the eventual shipped product. If you can't trace a lesson's content to the build, cut it or defer it to Module 7.

**Where it's enforced.**
- PROJECT.md philosophy: "The skill is the loop — intent → ask → evaluate → steer."
- COURSE-AUTHORING.md Part 1 (audience floor + the loop framing).
- COURSE-AUTHORING.md "Why this matters" felt-pain template (D-A5..D-A8).
- Implicit in lesson anatomy (LESSON-05 Exercise + LESSON-10 What-you-just-did connecting back to the loop).

---

### Tenet 3 — Relevant analogies only, load-bearing not decorative

**Plain statement.** Analogies do the heavy lifting of mental-model construction. Every analogy used must pass the D-A17 two-test gate: standalone (a complete everyday scene a non-coder can grasp without the tool being mentioned) and load-bearing (the mapping covers the lesson's central concept AND predicts at least one failure mode the lesson teaches the learner to spot).

**Why this exists.** Decorative analogies ("kind of like X") are filler that exhaust the learner's attention without giving any return. Load-bearing analogies do the inverse — they replace pages of prose with a felt picture, and they predict the failure modes the learner needs to spot when steering an agent. The restaurant, filing cabinet, door staff, recipe binder, workbench, sheet music, junior teammate, office directory, contractor, receipt, framed picture: all are load-bearing. Each one survived the two-test gate.

**How an authoring agent applies it.**
- The four D-07 locked analogies (restaurant / filing cabinet / door staff / recipe binder) are not creative territory. They get re-used in later modules; reinventing them breaks downstream lessons.
- New analogies for new lessons are proposed in the phase's CONTEXT.md with an explicit `Two-test gate: Standalone PASS / Load-bearing tie PASS|PARTIAL|FAIL` block before the lesson body is drafted.
- PARTIAL is allowed and ships with a known gap a later phase must extend or revise. FAIL means the analogy is rejected and a different picture is proposed.
- M2 L5 (`git-and-github.md`) and M3.5 L2 (`spotting-wrong-file-edits.md`) are the gold-standard exemplars. Match them.

**Where it's enforced.**
- CLAUDE.md hard rules 9 + 11 (D-07 locked analogies + D-A17 two-test gate).
- COURSE-AUTHORING.md Part 2 § Locked analogies + § Analogy two-test gate.
- Manual review at CONTEXT.md gate; no lint enforcement yet (deferred).

---

### Tenet 4 — Assumes nothing technical

**Plain statement.** The learner has not written production code. They may not know what a file *is* in a technical sense. They have not read documentation. They have not heard the words `HTTP`, `DNS`, `database`, `schema`, `SQL`, `JWT`, `RLS`, `localhost`, `CI/CD`, `magic link`, `NEXT_PUBLIC`, `WITH CHECK`, `useOptimistic`, `revalidatePath`, `Server Action`, `async/await`, `hydration`, `App Router`, or `Server Component` in a technical sense — and the course assumes they have not.

**Why this exists.** Every "you already know X" assumption silently excludes the audience the course exists for. If a learner can't follow because of an undefined term, the course failed at line 1 of that lesson.

**How an authoring agent applies it.**
- Audience-vocabulary contract is read BEFORE writing the lesson. Forbidden terms are not used (not even with a callout). Requires-callout terms get the D-04 pattern on first use. Safe terms are used freely.
- Every "obvious" assumption gets a sanity check: would a learner whose only computer experience is browser + email + files follow this sentence?
- "Just" and "simply" are red flags — they almost always paper over a technical assumption. Same for "as you can see," "obviously," and "of course."
- M1 explains *what a browser is* as a re-introduction (browser-as-program ≠ browser-as-tab). Don't assume the learner has graduated past their everyday usage.

**Where it's enforced.**
- CLAUDE.md hard rule 4 (D-04 callouts mandatory).
- `docs/audience-vocabulary.md` (the contract; updated when a new noun is introduced).
- `scripts/voice-lint.sh` check #6 (catches bare Forbidden terms and missing D-04 callouts).
- Voice-lint checks #1 (tutorial fiction) and #2 (filler) catch the most common floor-violation patterns.

---

### Tenet 5 — Bare minimum to steer, not to code

**Plain statement.** The course teaches the *minimum* knowledge needed for the learner to confidently steer an AI agent to produce a useful product. The course does NOT teach the learner to code. Every section in every lesson is either "the agent owns this" or "the learner owns this" — never both. Mechanics the agent owns are not taught at the audience floor.

**Why this exists.** The agent is faster, better, and more current at parsing code, reading errors, designing schemas, applying framework patterns, and chasing types. The learner is faster, better, and more current at knowing what they want, recognizing when the agent missed the point, applying a smell-test, and asking for help. Teaching the learner to do the agent's job is a waste of the learner's most precious resource — attention — at the exact moment the loop most needs it.

**How an authoring agent applies it.**
- **M3.5 observation floor (CLAUDE.md hard rule 12).** The learner observes code; the agent reads it. Per-topic floor table in COURSE-AUTHORING.md Part 4.
- **M4+ execution floor (CLAUDE.md hard rule 13).** The learner ships code via the agent; the agent authors it. The learner owns: stating intent at the feature level, observing the running app matches intent, running the **smell-test inventory** for the phase, committing each working chunk. The agent owns: schema authoring, RLS policy syntax, async/await mechanics, hook internals, type narrowing, dependency resolution, framework internals, deployment plumbing.
- When you must name a term to ground a steer, the term is a SYMPTOM, not a concept. The D-04 callout defines the symptom; surrounding prose does not exceed the callout's depth.
- The three audit questions (Q1–Q3 in COURSE-AUTHORING.md Part 4) run for every section *as you write it*, not at the end.

**Where it's enforced.**
- CLAUDE.md hard rule 12 (M3.5 observation floor — RULE).
- CLAUDE.md hard rule 13 (M4+ execution floor — RULE).
- COURSE-AUTHORING.md Part 4 (Agent-Responsibility Checkpoint Q1–Q3).
- COURSE-AUTHORING.md Part 5 (Execution-Floor Boundary — per-phase smell-test inventories).
- `lesson-template.md` Authors' notes (Q1–Q3 checklist).
- `scripts/voice-lint.sh` check #9 (M3.5 diagnostic-framing WARN-only).

---

### Tenet 6 — Practical understanding of AI / LLM / agent limitations

**Plain statement.** A learner who cannot recognize when the agent is wrong cannot recover when the agent is wrong. The course names six core agent limitations — hallucination, drift, context-window overflow, training cutoff, confident-wrong, risk-blindness — and arms the learner with a concrete smell-test for each. **Naming a failure mode without giving the learner the smell-test for it is forbidden** (CLAUDE.md hard rule 14).

**Why this exists.** The single most common way the loop fails — confident agent + non-technical user + no smell-test = a broken product the user can't recognize as broken — is the failure mode this course was built to prevent. The recovery skill is the differentiator. The skill comes from understanding the limits and having a named test for each. The smell-test is the bridge between "the agent might hallucinate" (abstract knowledge) and "the agent's `apiKey` reference doesn't match anything in our `.env` — let me ask it where that name came from" (practical skill).

**How an authoring agent applies it.**
- Whenever a lesson names an agent failure mode, the same lesson either (a) gives the learner a concrete smell-test for that failure mode, OR (b) explicitly forward-references the lesson where the smell-test lives. Never name a failure mode without arming the learner for it.
- The six limitations and their per-module surfaces are catalogued in COURSE-AUTHORING.md Part 6 — read it before authoring any lesson that mentions an agent failure mode.
- M2 L6 (`06-ai-coding-agents.md`) is the anchor lesson for Tenet 6. Three limits get their first surface there: hallucination, drift, risk-blindness. Each is named, illustrated with a one-sentence symptom, and pointed at the M3/M5 lesson where the corresponding smell-test lives.
- M3 L3 (`03-reading-plans-recognizing-wrong.md`) teaches the hallucination smell-test in depth. The lesson does NOT punt the *why* of hallucination to Module 7 — it grounds the mechanism non-technically in 2–3 sentences ("the agent writes fluent sentences; fluent sentences can contain invented details").
- M5 (operating the build) teaches three watch-it-fail walkthroughs that are explicit smell-test exercises against the deployed thread project.

**Where it's enforced.**
- CLAUDE.md hard rule 14 (AI-Limitation Pedagogy — RULE).
- COURSE-AUTHORING.md Part 6 (limits taxonomy + per-limit smell-test patterns).
- PROJECT.md philosophy: "Show AI failing and recovering — the recovery skill is the differentiator."
- LESSON-13 in REQUIREMENTS.md (Module 5 ships ≥3 hand-curated "watch the AI fail" walkthroughs).
- No lint enforcement yet (deferred to a future Phase 02.5 if WARN-level check #10 lands).

---

## How agents apply these tenets in practice

1. **Read this file before reading anything else.** TENETS.md is the first read for every authoring task.
2. **Read `docs/COURSE-AUTHORING.md` for the operational playbook.** The tenets state WHAT; COURSE-AUTHORING explains HOW.
3. **Read CLAUDE.md for the hard rules.** Twelve hard rules + two future-locked ones (13 + 14). Don't violate without explicit user permission.
4. **Run `scripts/voice-lint.sh` before every commit.** Exit code 0 is the gate. WARNs document the editorial backlog; VIOLATIONs block.
5. **Check the audience-vocabulary contract for the target module before writing.** Forbidden / Requires-callout / Safe / SYMPTOM-only.
6. **Apply the three audit questions (Q1–Q3) section-by-section as you write.** Symptom-and-steer is harder to retrofit than to draft.
7. **For build-phase lessons (M4+), confirm the phase has a CONTEXT.md with the smell-test inventory.** No execution-floor lesson ships without the inventory being locked.
8. **For any lesson that names an agent failure mode, confirm the smell-test is either in the same lesson or explicitly forward-referenced.** Hard Rule 14 is non-negotiable.

---

## What this file is NOT

- A checklist that replaces reading `docs/COURSE-AUTHORING.md`.
- A substitute for `docs/audience-vocabulary.md` (the per-module termlist contract).
- A negotiating position. The tenets are locked. Concrete rules and lints are adjustable; the tenets aren't.
- A grand statement of brand values. Each tenet exists because skipping it broke a specific lesson or audited drift in a specific module. The tenets are load-bearing pedagogy, not marketing.

---

## When to update this file

- Adding a tenet — only with explicit user approval. Six is the working number. Adding a seventh implies the existing six don't cover something material.
- Strengthening a tenet's enforcement (e.g., moving from GUIDANCE to ENFORCED via a new lint) — log the change, update the "Where it's enforced" section, link the relevant CLAUDE.md hard rule.
- Recording a tenet violation that shipped and was later caught — link the affected phase, the audit, the remediation. The course learns from its mistakes by writing them down.

---

## Cross-references

- `CLAUDE.md` — hard rules 1–14 (enforcement layer).
- `docs/COURSE-AUTHORING.md` — the authoring playbook (operational layer).
- `docs/audience-vocabulary.md` — per-module termlist contract.
- `.planning/PROJECT.md` Key Decisions — the historical decision log.
- `scripts/voice-lint.sh` — programmatic enforcement (where it exists).
- `lesson-template.md` — the nine-element lesson anatomy + the Q1–Q3 + Execution-Floor authors' notes.

---

*Last updated: 2026-05-18 — Initial lock. Six tenets consolidated from PROJECT.md philosophy + CLAUDE.md hard rules + COURSE-AUTHORING.md parts + audience-vocabulary contract + voice-lint checks + per-phase CONTEXT decision logs.*
