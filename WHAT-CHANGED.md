# WHAT-CHANGED.md — Freshness log

Reverse-chronological log of what shifted between course revisions. The first place to check when reality drifts from a lesson.

Each entry has the format:

> ## YYYY-MM-DD — {one-line summary}
> **What changed:** ...
> **Affected lessons / artifacts:** ...
> **What learners should do:** ...

---

## 2026-05-18 — Six Tenets canonicalized: TENETS.md + Hard Rules 13 + 14 + COURSE-AUTHORING Parts 5/6/7

**What changed:** The course's soul — six tenets the project has stated philosophically since the start — is now captured in a single canonical artifact (`docs/TENETS.md`) plus enforcement in CLAUDE.md hard rules 13 (Execution-Responsibility Boundary for M4+ build phases) and 14 (AI-Limitation Pedagogy — never name an agent failure mode without arming the learner with a smell-test). `docs/COURSE-AUTHORING.md` gains three new parts: Part 5 (Execution-Floor Boundary), Part 6 (AI-Limitation Pedagogy with the six-limitation taxonomy), Part 7 (What NOT to Teach appendix with 12 high-temptation traps). Existing Parts 5–9 renumber to 8–12. `docs/audience-vocabulary.md` extends through Modules 4, 5, 6, 7 — the M4 SYMPTOM-only term list pre-classifies the heavy build-phase nouns (`WITH CHECK`, `useOptimistic`, `revalidatePath`, `Server Action`, async `cookies()` / `headers()` / `params`, RLS, Supabase) so the build-phase planner inherits the right framing. `lesson-template.md` gains Execution-Floor + AI-Limitation Pedagogy margin comments and two new Authors' notes bullets.

**Why now:** Post-Phase-02.2 audit (six parallel Explore agents covering every shipped module + GSD framework + future-phase planning state) surfaced three structural problems. (1) **The soul was in pieces** — six tenets scattered across PROJECT.md philosophy, CLAUDE.md hard rules, COURSE-AUTHORING.md parts, audience-vocabulary contract, per-phase CONTEXT decision logs, and voice-lint checks, with no canonical entry point. New agents had to read all of them to internalize. (2) **Hard Rule 12 stops at M3.5** — it locks the *observation floor* for code-reading, but the build phases (M4–M6, where the learner ships code via the agent) had no equivalent *execution floor*. Phases 3–6 success criteria in ROADMAP.md already use jargon-shaped framing (`@supabase/ssr cookies() correctly awaited`, RLS `WITH CHECK`, `useOptimistic`) that would translate 1:1 into mechanics-teaching unless the boundary were re-locked. (3) **Tenet 6 (practical understanding of AI/LLM/agent limitations) had no anchor** — PROJECT.md philosophy mentions "show AI failing and recovering" but nothing in templates, lints, or hard rules constrained how limits get taught. The audit found M2 L6 (the AI-coding-agents lesson) names the briefing loop but never names the three things every agent gets wrong; M3 L3 names hallucination but punts the *why* to Module 7. Hard Rule 14 closes that gap with a forward-reference template.

**Affected artifacts:**
- `docs/TENETS.md` (new) — the canonical first-read soul document. Six tenets stated as a contract.
- `CLAUDE.md` — Hard Rule 13 (Execution-Responsibility Boundary M4+) + Hard Rule 14 (AI-Limitation Pedagogy). Authoritative-documents list updated to point to TENETS.md as the first read.
- `docs/COURSE-AUTHORING.md` — new Part 5 (Execution-Floor Boundary), Part 6 (AI-Limitation Pedagogy), Part 7 (What NOT to Teach). Existing Parts 5–9 renumber to 8–12. Cross-references inside the doc updated.
- `docs/audience-vocabulary.md` — M4 / M5 / M6 / M7 sections added. M4 SYMPTOM-only contract pre-classifies the heavy build-phase nouns. M7 named as the canonical "escape valve" for deferred deep-dives.
- `lesson-template.md` — Execution-Floor Checkpoint margin comment + AI-Limitation Pedagogy margin comment + two new Authors' notes bullets.
- `.planning/PROJECT.md` (gitignored) — Key Decisions row "Six Tenets canonicalized as TENETS.md" added.
- `.planning/ROADMAP.md` (gitignored) — Phase 02.3 (Framework Lock) and Phase 02.4 (Lesson polish under Six-Tenets contract) inserted. Phases 3 / 4 / 5 / 6 gain a "Pre-planning gate" section requiring CONTEXT.md to be locked before `/gsd-plan-phase` runs.
- `.planning/STATE.md` (gitignored) — Roadmap Evolution updated with the new phase insertions.
- This file (`WHAT-CHANGED.md`) — this entry.

**Two new phases — what each does:**

*Phase 02.3 (Framework Lock).* Ships the mutations above. No lesson content edits — pure framework work. Single PR. Unblocks Phase 02.4.

*Phase 02.4 (Lesson polish under Six-Tenets contract).* Brings 12 shipped lessons into compliance. Biggest single edits: (a) M2 L6 gains a "Three things agents get wrong" section anchoring Tenet 6 (hallucination / drift / risk-blindness with concrete symptoms + Hard Rule 14 forward-references to where the smell-tests live); (b) M3 L3 un-punts the hallucination mechanism — replaces the Module-7 forward-reference paragraph with 2–3 non-technical sentences grounding *why* agents invent details. Module 1 lessons (L1–L4) shed pre-Hard-Rule-12 jargon drift (HTML syntax in body, foreign-key lookup mechanics, cookie flags, deployment-failure config-fluency). M2 L3 reframes TypeScript as SYMPTOM not CONCEPT. M3 L1 / L2 / L4 receive small steering-skill + context-window-framing polishes. M3.5 L1 / L3 / L4 receive final-seam tightening. M2 L5 + M3.5 L2 are DO-NOT-TOUCH (gold-standard exemplars).

**Build-phase gating (Phases 3 / 4 / 5 / 6):** Each future build phase now requires `.planning/phases/NN-NAME/NN-CONTEXT.md` to be locked BEFORE `/gsd-plan-phase` runs. CONTEXT.md must carry: (a) per-chunk boundary table (agent-territory vs. learner-territory); (b) smell-test inventory with LOOK FOR / IF PRESENT / IF ABSENT entries; (c) Tenet 6 surfaces (which lessons name which agent failure mode + the smell-test for each); (d) phase-specific vocab additions per the audience-vocabulary contract. The pre-planning gate prevents the build-phase planner from inheriting ROADMAP success-criteria jargon framing — the original drift vector audited in M3.5 L1 / L3 / L4.

**What does NOT change:** Lesson bodies for M0, M1, M2, M3, M3.5 are unchanged in Phase 02.3. They are Phase 02.4's territory. M2 L5 (`05-git-and-github.md`) and M3.5 L2 (`02-spotting-wrong-file-edits.md`) stay gold-standard exemplars under Phase 02.4 (DO-NOT-TOUCH). Locked analogies survive: D-07 (restaurant / filing cabinet / door staff / recipe binder), D-40..D-48 (workbench / librarian / sheet-music / corner-store / junior teammate / office directory / contractor / receipt / framed-picture-vs-touchscreen). All survive verbatim through Phase 02.4. Hard Rule 12 (M3.5 Agent-Responsibility Boundary) stands unchanged — Hard Rule 13 extends it to M4+, Hard Rule 14 adds Tenet 6 enforcement. The audience-vocabulary contract is incremental — every term Safe in M3.5 remains Safe in M4+. The nine-element lesson anatomy is unchanged. The voice-lint script is unchanged this phase (check #10 for Hard Rule 14 enforcement deferred to optional Phase 02.5 if WARN-level enforcement becomes useful).

**What contributors should do:** Read `docs/TENETS.md` FIRST when authoring or revising any lesson. The six tenets are the soul; everything else (CLAUDE.md hard rules, COURSE-AUTHORING parts, audience-vocabulary contract, voice-lint checks) serves them. When authoring an M4+ build-phase lesson: confirm `.planning/phases/NN-NAME/NN-CONTEXT.md` is locked with the smell-test inventory BEFORE writing. When naming an agent failure mode (hallucination, drift, context-window overflow, training cutoff, confident-wrong, risk-blindness, prompt-injection): give the learner a concrete smell-test in the same lesson OR a Hard Rule 14 forward-reference (`> **Heads up — you'll meet this again.** ... The smell-test for catching it lives in {Module N Lesson NN slug}; for now, just notice the name.`). Vague "we'll cover this later" doesn't satisfy Hard Rule 14. When unsure whether to teach a mechanic: check the "What NOT to Teach" appendix in COURSE-AUTHORING.md Part 7 — twelve high-temptation traps catalogued upfront, each with the right move + where to escape to.

---

## 2026-05-18 — Phase 02.2 Wave 0: Agent-Responsibility Boundary lock

**What changed:** Locked the Agent-Responsibility Boundary as a load-bearing decision across CLAUDE.md, `docs/COURSE-AUTHORING.md`, `docs/audience-vocabulary.md`, `lesson-template.md`, and `scripts/voice-lint.sh`. The boundary answers a question the course never made explicit before: **the AI agent owns** reading errors, parsing code, diagnosing causes, framework mechanics, choosing which file to edit, build internals. **The learner owns** stating intent, checking the agent edited the right file, recognizing wrongness, asking for help. Every lesson section is one role or the other — never both. The boundary is operationalized by three audit questions (Q1–Q3) lesson authors run before shipping any M3.5 or M3.5-adjacent lesson.

**Why now:** Post-Phase-02.1 audit found three M3.5 lessons drifted from the locked D-33 observation-only floor into junior-dev territory: **L1** explains URL routing and the App Router model as foundational concepts; **L3** teaches stack-trace anatomy and `:line:column` parsing; **L4** teaches the server/client rendering execution model as a first principle. Root cause is structural: D-33 lived only in `02-CONTEXT.md` as guidance, not in CLAUDE.md hard rules; voice-lint enforces vocab callouts but not explanation depth; the audience-vocabulary contract classifies terms but does not constrain how deeply the lesson body explains them. Wave 0 closes the structural hole; Wave 1 rewrites L1/L3/L4 under the new contract.

**Affected artifacts (Wave 0):**
- `CLAUDE.md` — Hard Rule 12 (Agent-Responsibility Boundary).
- `docs/COURSE-AUTHORING.md` — new Part 4 (Agent-Responsibility Checkpoint + M3.5 Observation-Only Floor table). Existing Parts 4–8 renumber to 5–9.
- `docs/audience-vocabulary.md` — M3.5 SYMPTOM-only addendum + four classification moves: `stack trace` and `error message anatomy` move Requires-callout → Forbidden in M3.5; `'use client'`, `server component`, `client component`, `hydration` annotated SYMPTOM-only; `TypeScript`, `JSX`, `App Router`, `React Server Components` annotated `do-not-introduce` in current M3.5 lessons (reserved for Module 7).
- `lesson-template.md` — Agent-Responsibility Checkpoint margin comment in Core read template + new Authors' notes bullet.
- `.planning/PROJECT.md` — Key Decisions row (gitignored, persists locally for agents reading the file).
- `.planning/ROADMAP.md` — Phase 02.2 widened: header renamed to "Agent-Responsibility Boundary lock + M3.5 contract enforcement", scope now includes Wave 0 contract lock + Wave 1 lesson rewrites + Wave 2 phase close. Original framework-name lint scope work (Hole 2) deferred to Wave 3.
- `scripts/voice-lint.sh` — check #9 `scan_m35_diagnostic_framing` (WARN-only) + new `WARN_COUNT` global. Patterns 9a–9i catch diagnostic-framing drift in M3.5 body prose; agent-carve-out skips lines containing "the agent" (the rewrites legitimately say "the agent reads the stack trace"). Scope is `modules/03.5-reading-code/0[1-4]-*.md` only; M3 L4's "Anatomy of a steer ask" heading is out of scope by design.
- `scripts/voice-lint-fixtures/09-m35-diagnostic-framing.md` (new fixture; trips ≥3 WARNs in self-test, currently 8).
- `scripts/voice-lint-fixtures/README.md` — row 9.

**M3.5 L2 promotion.** `modules/03.5-reading-code/02-spotting-wrong-file-edits.md` passes all three audit questions (Q1–Q3) without changes and is the M3.5 gold-standard exemplar going forward (parallel to M2 L5's role in Phase 02.1's D-A16). DO-NOT-TOUCH for the rest of Phase 02.2.

**Current state of voice-lint.** `./scripts/voice-lint.sh` exits 0 (PASS). Check #9 emits 4 WARNs against M3.5 L3 (3× bare `stack trace`, 1× `diagnose`) — these will go to zero after the Wave 1 L3 rewrite. L1 and L4 emit no WARNs from check #9; their drift is concept-explanation depth rather than specific framing words, which the new Part 4 audit questions handle by hand. `./scripts/voice-lint.sh --self-test` exits 0 (all 9 fixtures trip their target checks).

**What contributors should do:** Read CLAUDE.md hard rule 12 and `docs/COURSE-AUTHORING.md` Part 4 before authoring or revising any M3.5 lesson — and treat it as the audit gate for any later module that surfaces code, errors, or framework mechanics. When you see a check #9 WARN, decide between (a) rewrite the line as symptom + steer, (b) wrap the agent's job in agent-framing language ("the agent reads X"), or (c) cut the line entirely if it teaches mechanics the agent owns. Voice-lint WARNs do not block the gate; they document the editorial backlog.

**What does NOT change:** The core audience-floor contract (never written production code, computer-comfortable, Module 7 for deeper knowledge). The lesson anatomy. The vocabulary callout pattern. The M3.5 sample-app scaffold. The locked analogies D-40..D-48 — all survive Wave 1 unchanged. M3.5 L2 (the new gold-standard exemplar). Any M0/M1/M2/M3 lesson prose.

**Phase 02.2 Wave 1 close (appended 2026-05-18).** L1, L3, and L4 rewritten under the Agent-Responsibility Boundary. L1: cut App Router / URL-routing / TypeScript / JSX D-04 callouts; reframed Core read body around "this folder is where pages live" (office-directory analogy preserved). L3: cut stack-trace + error-message-anatomy D-04 callouts + four-part anatomy rule + `:line:column` parsing; reframed around "find the first line whose path starts with `./app/`, paste the full error to your agent" (receipt analogy preserved). L4: cut the WHY-the-split explanation + rendering-execution model + JSX callout + React Server Components callout; rewrote server-component / client-component / hydration D-04 callouts as SYMPTOM-only; collapsed "What you just closed" into What-you-just-did breadcrumb (framed-picture-vs-touchscreen analogy preserved). `GLOSSARY.md` `### hydration` entry rewritten to symptom-only definition. Voice-lint check #9 now emits zero WARNs against M3.5 (was 4 against L3 before the rewrite). The L1→L2→L3→L4 prev/next chain is unbroken; the four-analogy narrative arc (office directory → contractor → receipt → gallery) reads coherently. M3.5 L2 untouched.

---

## 2026-05-14 — Phase 2 close (Modules 2, 3, 3.5 shipped)

**What changed:** Phase 2 (Toolchain & The Loop) closed. Three modules shipped — Module 2 (6 lessons: IDE, terminal, runtime/Node, npm, git+GitHub, AI coding agents), Module 3 (4 lessons, dual-agent: Claude Code + Gemini CLI in parallel per D-27 / LESSON-14), and Module 3.5 (4 lessons, strictly observational floor per D-33). 14 new lessons total. The prev/next chain runs unbroken from `modules/01-mental-models/04-how-it-goes-live.md` through `modules/03.5-reading-code/04-use-client-and-server-split.md` and lands on the course README as the Phase 3 placeholder. `GLOSSARY.md` and `CHEATSHEET.md` grew in same-PR with each lesson per D-36. `docs/audience-vocabulary.md` gained M2/M3/M3.5 sections per D-37; voice-lint enforces the audience-vocabulary classification programmatically. `voice-lint --self-test` continues to exit 0 (all six fixture types still trip their target checks).

**Slash-command migration (Open Q2).** The deprecated `/tokens` slash command is now split into `/context` (window usage) + `/cost` (spend) on Claude Code. Gemini CLI's equivalents are `/stats` (= Claude's `/context`) and `/compress` (= Claude's `/compact`). M3 L2 (`02-planning-vs-execution.md`) teaches the current names and ships a historical note pointing out the `/tokens` deprecation. The same-PR migration off `/tokens` ran in Plan 02-02 (Wave 1) across `CHEATSHEET.md` (AI prompts + Token discipline sections), `BUDGET.md` (Path 2 + Path 3 prose), and `GLOSSARY.md` (`token-discipline` entry). One-pass switch — no compatibility shim for the legacy name.

**`.claudeignore` + `.claude/settings.json` decision (Open Q1).** OPS-03 templates at `thread-project-template/` use the community-pattern `.claudeignore` plus the official `.claude/settings.json` permission deny-list. Claude Code does NOT natively support `.claudeignore` as of May 2026 (Anthropic GitHub issue #29455 — the `.claudeignore` file is a community convention only); the supplement is the official `settings.json` `permissions.deny` list, which IS the supported hard-enforcement mechanism Phase 3 Chunk 0 will copy. `.geminiignore` follows Gemini CLI's documented ignore-file syntax (planner-discretion per D-38; Phase 2 researcher confirmed in May 2026).

**voice-lint check #8 (Open Q5).** `scripts/voice-lint.sh` gained check #8 `m3-dual-agent`: every M3 lesson (`modules/03-the-loop/0[1-4]*.md`) must contain BOTH `Claude Code:` AND `Gemini CLI:` as standalone-line labels (D-27 enforcement). Fixture: `scripts/voice-lint-fixtures/08-m3-dual-agent.md`. `--self-test` still exits 0; the fixture trips check #8 with 1 violation.

**New repo directories.** `thread-project-template/` (OPS-03; Phase 3 Chunk 0 copies the contents — 5 files: `README.md`, `.gitignore`, `.claudeignore`, `.geminiignore`, `.claude/settings.json`). `screenshots/m3/<lesson-slug>/` (D-26 — paralleling `diagrams/`; M3 screenshot + capture-brief surface). `modules/03-the-loop/scratch/` (D-31 — single-file `index.html` worked example, progressed across L1→L4, throwaway-by-design after the M3 finale per the L4 note).

**M3.5 sample-app.** `modules/03.5-reading-code/sample-app/` is reference-only (D-34). The sample-app's `package.json` lists Next.js + React peer dependencies but the learner does NOT run `npm install` against it — they read it from the file panel and from inline excerpts in the lessons. Required files: `app/layout.tsx`, `app/page.tsx`, `app/components/InteractiveButton.tsx` (has `'use client'`), `app/components/StaticHero.tsx` (no `'use client'`), `app/components/Footer.tsx`.

**VERSIONS.md update (Open Q6).** Phase 2 capture work pinned Claude Code, Gemini CLI, Node 20.x LTS, and npm 10.x. Pinned versions are tracked in `VERSIONS.md`; existing Node + npm rows from Phase 1 carry the verified date forward to 2026-05-14 alongside the Claude Code + Gemini CLI rows that are new in this revision.

**CHEATSHEET backfill (Plan 02-17 Task 2).** The phase-close coverage audit surfaced two trivial CHEATSHEET gaps: `npm --version` (referenced in M2 L4 paired with `node --version`) and `git pull` (vocab-callout target in M2 L5). Both backfilled in the same close pass per the same-PR D-36 convention.

**SC#2 wording proposal (deferred).** Phase 2 ROADMAP success criterion #2 currently reads "with **both** Claude Code AND Gemini CLI." CONTEXT.md D-29 + this phase's Plan 02-17 propose softening to "with their chosen agent (Claude Code or Gemini CLI), shown in parallel with the other agent's transcript in every M3 lesson" — aligning SC#2 with what the M3 lessons actually deliver (both transcripts shown; one agent run). The user-action checkpoint in Plan 02-17 was answered **defer** in this pass; no ROADMAP edit applied. The proposal is preserved here for the next revisit.

**Affected lessons / artifacts:** `modules/02-toolchain/{01-ide,02-terminal,03-runtime-node,04-package-manager-npm,05-git-and-github,06-ai-coding-agents,README}.md`; `modules/03-the-loop/{01-introducing-the-loop,02-planning-vs-execution,03-reading-plans-recognizing-wrong,04-steering-and-recovery,README}.md` + `scratch/{index.html,README.md}`; `modules/03.5-reading-code/{01-reading-a-file-tree,02-spotting-wrong-file-edits,03-error-message-to-file-pointer,04-use-client-and-server-split,README}.md` + `sample-app/`; `thread-project-template/` (5 files); `screenshots/m3/` (4 capture briefs); `scripts/voice-lint.sh` (check #8) + `scripts/voice-lint-fixtures/08-m3-dual-agent.md`; `docs/audience-vocabulary.md` (M2/M3/M3.5 sections); `GLOSSARY.md` (+30 anchors across the phase); `CHEATSHEET.md` (token-discipline migration + npm --version + git pull); `BUDGET.md` (slash-command migration); `VERSIONS.md` (Claude Code + Gemini CLI rows); `WHAT-CHANGED.md` (this entry).

**What learners should do:** Phase 2 closes the foundation for the agent loop and the bare minimum of code-reading you need to recognize wrong-file edits. If your `claude` or `gemini` session looks different from any M3 lesson's captured transcript, that is a freshness signal — every M3 lesson's `> **Last captured:** 2026-05-14.` callout sets your expectations. Phase 3 (Single-User Vertical Slice) is the next phase to land and picks up from `modules/03.5-reading-code/04-use-client-and-server-split.md`. Until Phase 3 lands, the course README links forward to "Module 4 lands in Phase 3."

**What contributors should do:** Run `./scripts/voice-lint.sh` from a clean checkout — it should exit 0 across the full Phase 2 surface (0 violations; jargon-density WARNs are the documented editorial backlog from Phase 1 and are non-blocking). Run `./scripts/voice-lint.sh --self-test` if you modify the lint script — all 6 fixture types must trip their target checks. If you add a new technical noun to any M2/M3/M3.5 lesson, classify it in `docs/audience-vocabulary.md` AND add a `### anchor` to `GLOSSARY.md` in the same PR. If you author a re-usable command or AI prompt, add it to `CHEATSHEET.md` in the same PR. The M3 transcripts are real captures (D-28) — re-captures replace placeholders verbatim, bump `updated:` + `Last captured:` dates, and add a WHAT-CHANGED entry.

---

## 2026-05-14 — Phase 2 Wave 3 M3 L4 transcripts captured + Module 3 module-close

**What changed:** Module 3 Lesson 4 (`modules/03-the-loop/04-steering-and-recovery.md`) shipped, with paired Claude Code + Gemini CLI captures from 2026-05-14 (D-28). The lesson teaches the STEER step of the agent loop: three-part steer asks (what was wrong / what you want / any constraint), recognizing over-engineering on open-ended asks, scope-steering back to a tight constraint, feeding errors back as the simplest steer, and `/clear` as hygiene (not failure) when steering stalls. The worked example walks three steers against the post-L3 scratch state: (a) replace the hallucinated book titles with placeholder text, (b) the deliberately open-ended "make the list look like a real bookshelf" ask that produces over-engineering from both agents, (c) the scope-steer back to inline-CSS-only. New GLOSSARY anchor: `over-engineering`. The scratch/index.html starter is progressed to its final M3 state — placeholder-text `<ul>` wrapped in inline CSS (wooden background, line spacing, no frameworks). Module 3 ends here; the lesson includes the D-31 finale note ("you can delete the scratch directory now — your real project starts in Module 4"). Module 3.5 (Wave 4) is next.

**Affected lessons / artifacts:** `modules/03-the-loop/04-steering-and-recovery.md` (new); `modules/03-the-loop/scratch/index.html` (final M3 state — placeholder text + inline CSS for a wooden bookshelf look). One new GLOSSARY anchor: `over-engineering`. Capture brief at `screenshots/m3/04-steering-and-recovery/CAPTURE.md`.

**What learners should do:** Module 3 is complete. You can delete `modules/03-the-loop/scratch/` before moving to Module 3.5 — the next module's reference scaffold (`modules/03.5-reading-code/sample-app/`) is unrelated. Your captured agent will probably suggest DIFFERENT over-engineering shapes than the lesson shows (Tailwind vs. CSS Grid vs. image lookups vs. multi-file refactors). That is fine — the point is recognizing the over-shoot, not memorizing which framework each agent reaches for first.

**What contributors should do:** The transcripts are real captures, not idealized (D-28). If a re-capture is needed (e.g., Claude Code 2.x or Gemini CLI's output shape changes), open a PR that re-runs L4's three capture phases (Phase A steer-the-hallucination, Phase B open-ended-then-over-engineering, Phase C scope-steer-back) against `modules/03-the-loop/scratch/index.html` in its post-L3 state, replaces the lesson's six transcript placeholders + three divergence annotations with the new verbatim captures, bumps the `updated:` and `Last captured:` dates, and adds a new WHAT-CHANGED entry. The lesson is engineered around real over-engineering — do NOT clean it up; the over-shoot IS the pedagogy that the scope-steer recovers from.

---

## 2026-05-14 — Phase 2 Wave 3 M3 L3 transcripts captured

**What changed:** Module 3 Lesson 3 (`modules/03-the-loop/03-reading-plans-recognizing-wrong.md`) shipped, with paired Claude Code + Gemini CLI captures from 2026-05-14 (D-28). The lesson teaches the EVALUATE step of the agent loop using observation-based detection (D-30) — five patterns: visual divergence, output divergence, plan-vs-actual divergence, narration divergence, error messages. The worked example is the deliberately under-specified ask "Add a list of 3 favorite books below the button," engineered to produce hallucinations from both agents. The lesson SHIPS the hallucinated book titles verbatim — recognizing the hallucination is the point; M3 L4 walks through the steer that replaces them with placeholder text. New GLOSSARY anchor: `hallucination`. The scratch/index.html starter is progressed to include the hallucinated list (D-31 L3 progression).

**Affected lessons / artifacts:** `modules/03-the-loop/03-reading-plans-recognizing-wrong.md` (new); `modules/03-the-loop/scratch/index.html` (static `<ul>` with three book titles added). One new GLOSSARY anchor: `hallucination`. Capture brief at `screenshots/m3/03-reading-plans-recognizing-wrong/CAPTURE.md`.

**What learners should do:** Your agent will almost certainly invent DIFFERENT book titles than the lesson shows. That is fine — the point is recognizing that the agent invented anything at all. The lesson's `> **Last captured:** 2026-05-14.` callout sets expectations.

**What contributors should do:** The transcripts are real captures, not idealized (D-28). If a re-capture is needed (e.g., Claude Code 2.x or Gemini CLI's output shape changes), open a PR that re-runs the L3 ask against `modules/03-the-loop/scratch/index.html` in its post-L2 state, replaces the lesson's transcript placeholders with the new verbatim captures, bumps the `updated:` and `Last captured:` dates, and adds a new WHAT-CHANGED entry. The lesson is engineered around real hallucinations — do NOT clean them up; the L3 hallucination IS the pedagogy.

---

## 2026-05-14 — Phase 2 Wave 3 M3 L2 transcripts captured

**What changed:** Module 3 Lesson 2 (`modules/03-the-loop/02-planning-vs-execution.md`) shipped, with paired Claude Code + Gemini CLI captures from 2026-05-14 (D-28). The lesson teaches planning vs execution conversations and introduces the six core slash commands (`/clear`, `/compact`, `/context`, `/cost` for Claude Code; `/clear`, `/compress`, `/stats` for Gemini CLI). The scratch/index.html starter is progressed to include a show/hide button below the date (D-31 L2 progression).

**Affected lessons / artifacts:** `modules/03-the-loop/02-planning-vs-execution.md` (new); `modules/03-the-loop/scratch/index.html` (button + date logic). Nine new GLOSSARY anchors: `context-window`, `execution-conversation`, `planning-conversation`, `slash-clear`, `slash-compact`, `slash-compress`, `slash-context`, `slash-cost`, `slash-stats`. Capture brief at `screenshots/m3/02-planning-vs-execution/CAPTURE.md`.

**What learners should do:** If `/context` (Claude Code) or `/stats` (Gemini CLI) returns a different output shape than the lesson shows, that is a freshness signal; the four-command kit is durable but the keystroke output may evolve. The lesson's `> **Last captured:** 2026-05-14.` callout sets expectations.

**What contributors should do:** The transcripts are real captures, not idealized (D-28). If a re-capture is needed (e.g., Claude Code 2.x ships a different `/context` output shape, or Gemini CLI renames `/stats`), open a PR that re-runs L2's three capture phases (planning conversation, execution conversation, slash-command outputs) against `modules/03-the-loop/scratch/index.html` in its post-L1 state, replaces the six fenced blocks, bumps the `updated:` and `Last captured:` dates, and adds a new WHAT-CHANGED entry.

---

## 2026-05-14 — Phase 2 Wave 3 M3 L1 transcripts captured

**What changed:** Module 3 Lesson 1 (`modules/03-the-loop/01-introducing-the-loop.md`) shipped, with paired Claude Code + Gemini CLI transcripts captured against `modules/03-the-loop/scratch/index.html` on 2026-05-14 (D-28). The scratch file's `<script>` body was updated from the empty starter to the actual code one of the agents produced during capture (per D-28 — real, not idealized).

**Affected lessons / artifacts:** `modules/03-the-loop/01-introducing-the-loop.md` (new lesson); `modules/03-the-loop/scratch/index.html` (`<script>` body filled with the date-display code the agent produced). Six new GLOSSARY anchors: `agent-loop`, `ask`, `evaluate`, `intent`, `prompt`, `steer`. Screenshots and capture brief at `screenshots/m3/01-introducing-the-loop/`.

**What learners should do:** If your `claude` or `gemini` session in 2026 looks meaningfully different from the transcripts in the lesson, that is a freshness signal — the lesson's `> **Last captured:** 2026-05-14.` callout is there to set your expectations. Your loop still runs; the keystrokes may have shifted.

**What contributors should do:** The transcripts are real captures, not idealized. If a re-capture is needed (e.g., Claude Code 2.x ships and the response shape changes, or Gemini CLI updates its CLI UI), open a PR that re-runs the L1 capture session against `modules/03-the-loop/scratch/index.html`, replaces the fenced blocks with the new transcripts, bumps the `updated:` date AND `Last captured:` date in the lesson, and adds a new WHAT-CHANGED entry.

---

## 2026-05-14 — Phase 2 Wave 1 scaffolding + slash-command migration

**What changed:** Phase 2 Wave 1 ships three coordinated cross-cutting updates ahead of Module 2/3/3.5 lesson authoring.

1. **Slash-command name correction.** The Claude Code canonical command names for context-window and spend tracking are `/context` (window usage) + `/cost` (spend) — NOT the legacy name. The legacy name appeared in `CHEATSHEET.md` (AI prompts + Token discipline sections), `BUDGET.md` (Path 2 + Path 3 prose), and `GLOSSARY.md` (the `token-discipline` entry). All three are corrected in this revision. Gemini CLI's equivalents `/compress` (= Claude's `/compact`) and `/stats` (= Claude's `/context`) are added to `CHEATSHEET.md` alongside the Claude Code commands.

2. **AI agent ignore-file templates shipped** (`thread-project-template/`). The `thread-project-template/` directory at repo root now ships five files: `README.md`, `.gitignore`, `.claudeignore`, `.geminiignore`, `.claude/settings.json`. The `.claudeignore` ships as a community-pattern + future-proofing template (Claude Code does NOT natively support `.claudeignore` in May 2026 — see GitHub issue #29455). `.claude/settings.json` with `permissions.deny` rules is the officially-supported hard-enforcement mechanism Phase 3 Chunk 0 will copy. Module 2 Lesson 6 (`modules/02-toolchain/06-ai-coding-agents.md`) references both.

3. **Voice-lint check #8 (M3 dual-agent rendering).** `scripts/voice-lint.sh` gets a new check that every Module 3 lesson (`modules/03-the-loop/0[1-4]*.md`) contains both `Claude Code:` and `Gemini CLI:` as standalone-line labels. Fixture `scripts/voice-lint-fixtures/08-m3-dual-agent.md` trips the check; wired into `--self-test`. Enforces D-27 (every M3 lesson is dual-agent) programmatically.

**Affected lessons / artifacts:** `CHEATSHEET.md`, `BUDGET.md`, `GLOSSARY.md`, `WHAT-CHANGED.md` (this entry), `CONTRIBUTING.md` (lint reference line). New files: `thread-project-template/{README.md,.gitignore,.claudeignore,.geminiignore,.claude/settings.json}`, `modules/03-the-loop/scratch/{index.html,README.md}`, `modules/03.5-reading-code/sample-app/*` (8 files), `scripts/voice-lint-fixtures/08-m3-dual-agent.md`.

**What learners should do:** If you've been using the legacy slash-command name from an older copy of `CHEATSHEET.md`, the actual command in Claude Code is `/context` (for window usage) and `/cost` (for spend). On Gemini CLI, the analogous commands are `/stats` (window usage) and `/compress` (= Claude's `/compact`).

**What contributors should do:** Run `./scripts/voice-lint.sh --self-test` after pulling — fixture 08 must trip check #8. If you write a Module 3 lesson, both `Claude Code:` and `Gemini CLI:` MUST appear as standalone-line labels (D-27); the lint enforces it.

---

## 2026-05-10 — Phase 1 gap closure (M0/M1 audience pass, M1 bundle 3 split, voice-lint upgrade)

**What changed:** After the 01-HUMAN-UAT.md walkthrough surfaced three editorial gaps in the original Phase 1 close, plans 01-6 / 01-7 / 01-8 shipped to close them.

1. **Audience-aware vocabulary contract.** `docs/audience-vocabulary.md` now classifies every technical noun for M0 and M1 into three categories: Safe (use freely), Requires-callout (D-04 pattern on first use), Forbidden (deferred to a later module). All five M0 lessons and the four M1 lessons were rewritten against the contract. Nine new GLOSSARY anchors added (markdown, Codespace, code-editor, ai-coding-agent, terminal, api-key, free-tier, rate-limit, token-discipline).

2. **M1 expanded from three bundles to four.** The original bundle 3 (`03-who-can-do-what.md`) mixed authentication and deployment as if they were one concept. It now splits cleanly: `03-who-can-do-what.md` is auth-only (door-staff / VIP-list / hand-stamp analogy); a new `04-how-it-goes-live.md` covers deployment (private kitchen → public restaurant analogy). The M1 README, prev/next nav chain (02 → 03 → 04 → course README), and 01-CONTEXT.md D-06 amendment block all reflect the four-bundle shape. The original D-06 wording is preserved above the amendment for traceability.

3. **Simple-first / bridge-second Mermaid convention.** Every M1 Mermaid now teaches the concept twice: an analogy-only diagram first (using only the locked D-07 nouns — restaurant / filing-cabinet / door-staff / opening-night family), then the technical Mermaid with `= browser`, SQL/HTTP shorthand, and CI/CD labels preceded by a `> *Bridge to the real terms:*` blockquote. `lesson-template.md` encodes the pattern with a worked example. New `diagrams/how-it-goes-live.md` standalone source mirrors bundle 4's lesson.

4. **`scripts/voice-lint.sh` near-total rewrite.** Grew 92 → 645 lines. WR-01..WR-05 + IN-04 shell-hygiene fixes from `01-REVIEW.md` are all resolved (quoted variables, `--` end-of-options sentinels, per-line VIOLATIONS counter, case-insensitive GLOSSARY anchor resolution, missing-GLOSSARY emits violation). Two new checks: broken-relative-path (catches the GLOSSARY 404 bug shape fixed in `fe2450b`) and jargon-density (parses `docs/audience-vocabulary.md` and flags Forbidden bare uses + missing D-04 callouts for Requires-callout terms). New `--self-test` mode runs the lint against `scripts/voice-lint-fixtures/*.md`; each fixture intentionally trips one check.

**Affected lessons / artifacts:** All Module 0 lessons, all Module 1 lessons (including the new bundle 4), `lesson-template.md` + `lesson-template-m0.md`, GLOSSARY.md, `scripts/voice-lint.sh`, CONTRIBUTING.md (pre-push checklist references new checks). New files: `docs/audience-vocabulary.md`, `modules/01-mental-models/04-how-it-goes-live.md`, `diagrams/how-it-goes-live.md`, `scripts/voice-lint-fixtures/{01..06}.md` + README. Phase 1's ROADMAP entry now shows 8/8 Complete.

**What learners should do:** No action. The bundle-3 split adds bundle 4 (deployment) — a learner who finished the original three-bundle M1 can now read the new bundle 4 lesson to complete the four-bundle mental model.

**What contributors should do:** `scripts/voice-lint.sh --self-test` is now part of the lint surface — run it from a clean checkout if you modify the lint. The default `scripts/voice-lint.sh` still passes (0 violations) but emits ~50 `WARN (jargon-density …)` lines covering the audience-vocabulary editorial backlog. The WARNs are not blocking; they document remaining tightening opportunities the editorial team will close incrementally. If you author a new lesson, classify every new technical noun in `docs/audience-vocabulary.md` AND add a `GLOSSARY.md#anchor` entry in the same PR.

---

## 2026-05-08 — Phase 1 close

**What changed:** Phase 1 (Foundation & Front Door) closed. Module 0 (5 lessons) and Module 1 (3 bundles) ship with the locked nine-element lesson anatomy and M0-variant baseline. All eight cross-cutting artifacts (README, SETUP, GLOSSARY, CHEATSHEET, COMMON-ISSUES, BUDGET, CONTRIBUTING, WHAT-CHANGED, plus standalone VERSIONS) shipped at Phase-1 depth. Editorial pass via `scripts/voice-lint.sh` returned clean on first run (zero violations across the full Phase 1 surface). Phase 1 success criteria #1–#5 satisfied.

**Affected lessons / artifacts:** All Phase 1 deliverables. The following invariants are now enforceable on every future PR via `scripts/voice-lint.sh`:
- No tutorial fiction (LESSON-12)
- No filler prose (LESSON-12)
- No GitHub-specific admonitions (D-18 SSG-portability)
- Every `GLOSSARY.md#anchor` used in any lesson resolves to a `### anchor` entry

**What learners should do:** No action. Phase 2 (Toolchain & The Loop) is the next phase to land; until then, Module 0 and Module 1 are the available content.

**What contributors should do:** Run `./scripts/voice-lint.sh` before opening a PR that touches course markdown. The lint step is documented in `CONTRIBUTING.md` as part of this same plan.

---

## 2026-05-08 — V1 baseline

**What changed:** Initial release of the course's v1 baseline. Module 0 (Welcome) and Module 1 (Mental models) ship with the locked nine-element lesson anatomy. Cross-cutting artifacts (README, SETUP, BUDGET, GLOSSARY, CHEATSHEET, COMMON-ISSUES, CONTRIBUTING, VERSIONS) ship with seed content sufficient for Phase 1 + linkable from Phase 2 onward. Dual MIT (code) + CC BY 4.0 (prose) licensing committed.

**Affected lessons / artifacts:** All v1 baseline. Lesson template locked at `lesson-template.md`; M0-variant locked at `lesson-template-m0.md`. Three named cost paths in `BUDGET.md`: Claude Code Pro / Gemini CLI free tier / Anthropic API token-careful.

**What learners should do:** Start with Module 0. If you came back to this entry because something seems off, check `VERSIONS.md` first — every tool the course is verified against has a `Last verified` date there.

**Decision-change context:** This release reflects the 2026-05-08 swap of the free OSS AI agent from Aider to Gemini CLI. The Aider/OpenRouter cost path that appeared in earlier research (`./.planning/research/SUMMARY.md`) is superseded by `BUDGET.md` Path 2 (Gemini CLI free tier).
