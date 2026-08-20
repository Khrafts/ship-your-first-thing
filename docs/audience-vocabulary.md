# Audience-aware vocabulary contract

**Purpose:** Phase 1's voice contract (LESSON-12) bans tutorial fiction and filler, but it does not enforce *define-before-use*. After the 01-HUMAN-UAT walkthrough surfaced that M0+M1 prose drops technical terms (markdown, Codespace, Node, git, HTTP, DNS, schema, SQL) without defining them for the audience that, by definition, hasn't met those words yet, this contract makes per-module vocabulary explicit. Every lesson author rewrites against this contract; voice-lint.sh (Plan 01-8) enforces it programmatically.

**Three categories per module:**

1. **Safe** — terms a learner at this point in the course already knows or can infer from everyday usage. Use freely without a callout.
2. **Requires-callout** — terms the learner has not seen before in the course. First use in any lesson MUST follow the D-04 vocab callout pattern: `**term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#term))`. Subsequent uses inside the same lesson can drop the callout.
3. **Forbidden** — terms reserved for a later module. Do NOT use them in this module's prose, even with a callout. If the concept is unavoidable, use an analogy or defer to "you'll meet this in Module N."

The contract is incremental: every term Safe in M1 was Safe-or-Requires-callout in M0. A term added at any module joins the Safe set for every later module.

---

## Module 0 (M0)

Audience floor: comfortable using a computer; has used GitHub at most to view a page; has never written production code.

### Safe (no callout needed)

Everyday computing nouns the audience already uses:

- file, folder, browser, tab, window, menu, button, link, click, type, search, save, copy, paste, password, account, sign in, sign out, email, phone, message, internet, app, conversation, new chat, approve/reject (the buttons), approval prompt (the agent app's own approve-or-decline dialog — the compound is Safe from M0; the prompt-engineering sense of "prompt" stays reserved for M3+), download, install, dashboard, URL (as a "web address" — the structural details land in M1), ChatGPT (a consumer app brand the audience floor already meets in everyday use — see the ride-along note under Requires-callout)

### Requires-callout (D-04 pattern on first use)

Tool nouns introduced in M0 that the audience hasn't met:

- markdown, GitHub (as a *site*, distinct from "git"), repository (or repo), code editor, AI coding agent, API key, free tier, rate limit, token (as in AI-tool token, distinct from auth token in M1)

The agent-app tool nouns M0 names on the way to installing one (added 2026-08-15; the rebuilt M0 lessons already introduce each with a D-04 callout):

- Claude Code desktop (the paid track's agent app), Codex (the free track's agent app, which lives inside the ChatGPT desktop app), OpenCode desktop (named once as a third alternative and never taught), git (M0's narrow sense only — see the scope note below)

**`git` in M0 is the named-install caveat, nothing more.** M0 L5 (`05-install-your-agent-app.md`) names it once, in the Windows-only caveat about what gets installed alongside the agent app, with a D-04 callout; M2 L3 (`03-the-save-system.md`) is where it becomes the machinery the agent operates on the learner's behalf. An M0 lesson may not use `git` for anything beyond that install caveat — no commits, no saving, no version history. (Before 2026-08-15 this contract listed `git` as Forbidden-until-M2, which contradicted the shipped M0 L5 caveat.)

**`ChatGPT` rides along inside the `Codex` callout.** The lessons never write a standalone `**ChatGPT**` callout — the `**Codex**` callout defines the relationship in place ("the AI coding agent that lives inside the ChatGPT desktop app"), and the brand itself is an everyday consumer-app name at the audience floor. It is therefore classified Safe from M0 (see Safe above) rather than Requires-callout. Settled 2026-08-15; it had been listed as M2 Requires-callout, which no lesson honoured.

### Forbidden (deferred to a later module)

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake; amended 2026-08-16 — the slash commands never become legal in a later module either: the Module 3 reshoot retired typed commands and teaches "start a fresh conversation" instead, so `slash command` is Forbidden there too — see the Module 3 section):

- terminal (one boundary-naming exception — see the note below), command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`

**Boundary-naming exception (`terminal`), added 2026-08-15.** `terminal` stays Forbidden as a thing the learner ever opens, uses, or is told about as tooling. The one sanctioned use is *naming the boundary the learner never crosses*: M0 L5's "what you will never be asked to do" beat (and the exercise that asks the learner to recall it) and M2 L2's off-contract smell-test (the list of requests that mean you're being handed the wrong kind of instruction, and its exercise). In those places the word appears only inside a sentence that refuses it — never in an instruction the learner follows. Voice-lint check #6 has no exception mechanism, so it surfaces these as WARN lines; they are contract-sanctioned and stay. Any *other* appearance of the word in M0 or M2 prose is a real violation of the tier.

Reserved for M1+:

- HTTP, DNS, request, response, server, client, browser-as-program (M1 elevates the everyday "browser" noun to a technical role), database, schema, SQL, query, row, table, foreign key, API (as a *contract* — M1 bundle 2), authentication, authorization, session, cookie, deployment, CI/CD, build server, JWT, RLS

Reserved for M2+:

- commit, push, pull, branch, merge (git itself left this bucket on 2026-08-15 — it is Requires-callout in M0 for the install caveat only, and M2 re-introduces it as the machinery the agent operates; see the scope note above)

Reserved for M3+: prompt (the prompt-engineering sense; the compound "approval prompt" is Safe from M0 — see Safe above), context window. *(`/clear` and `/compact` left this list on 2026-08-16: they never become legal at M3 — they are retired course surface in every module, listed in the bucket above. `/tokens` was removed on 2026-08-15 for the same kind of reason: it is a deprecated command name the Module 3 section bans outright, not a term that becomes legal at M3.)*

**M0 rewrite implications (desktop-app shape, 2026-08-12):** M0 never names a Codespace or Node — Codespace is retired course surface under Hard Rule 15, not a deferred noun to define later. It names `git` exactly once, in M0 L5's Windows install caveat with a D-04 callout (see the scope note above), and never as something the learner operates. M0 instead introduces the **AI coding agent** desktop app (Claude Code desktop, or Codex in the ChatGPT desktop app) as the learner's whole working environment via a D-04 callout on first use, and the prose describes only what the agent app does and what the learner sees in it — never installed tooling, a pre-baked image, or anything running on a machine the learner operates directly. "Pure markdown" still gets a callout for **markdown**; there is no Codespace-shaped sentence left to rewrite.

---

## Module 1 (M1)

Audience floor: M0 complete. Every M0 Requires-callout term is now Safe.

### Safe (no callout needed)

All M0 Safe + all M0 Requires-callout. Plus terms M1's analogies introduce as Safe (the analogy nouns themselves):

- restaurant, customer, kitchen, waiter, menu, ticket, dish (bundle 1 analogy)
- filing cabinet, drawer, index card, paperwork, receptionist, clerk, inter-office mail (bundle 2 analogy)
- door staff, ID, hand stamp, VIP list, velvet rope, opening night, recipe binder, prep cooks, private kitchen, public restaurant (bundle 3+4 analogies)

### Requires-callout (D-04 pattern on first use)

Technical nouns M1 intentionally defines:

- HTTP, HTTP method, HTTP status code, URL (as a structural noun — was Safe in M0 as "web address"; in M1 we re-define structurally), DNS, server, browser (re-defined as a program, not a tab), request, response, HTML, database, row, schema, foreign key, query, SQL, API, authentication (authn), authorization (authz), session, session token, cookie, deployment, CI/CD, git, GitHub (as the host of git repos), Vercel

### Forbidden (deferred to a later module)

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake; amended 2026-08-16 — the slash commands never become legal in a later module either: the Module 3 reshoot retired typed commands and teaches "start a fresh conversation" instead, so `slash command` is Forbidden there too — see the Module 3 section):

- terminal, command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`

Reserved for M2+:

- commit, push, pull, branch, merge (terminal, IDE, package manager, npm, and runtime moved out of this bucket — they no longer become legal at M2; see the retired-course-surface bucket above)

Reserved for M3+:

- prompt (the prompt-engineering sense; the compound "approval prompt" is Safe from M0), context window, agent loop, planning conversation, execution conversation

*(`/clear` and `/compact` left this bullet on 2026-08-16 — they never become legal at M3; they stay in the retired-course-surface bucket above, Forbidden in every module.)*

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, JWT, RLS, WITH CHECK, USING, server action, revalidatePath

**M1 rewrite implications:** The current M1 lessons drop HTTP / DNS / methods / SQL / schema / foreign key as if defined; the existing 02-where-data-lives.md exemplar uses the callout pattern correctly for those terms (it was the exemplar of the pattern). The rewrite (Plan 01-6 Task 3) brings 01 and the new 03 + 04 up to the same standard, and confirms 02 has not regressed.

---

## Module 2 (M2) — Meet your agent, and the machinery it drives for you

Audience floor: M1 complete. Every M1 Requires-callout term (HTTP, DNS, server, browser-as-program, request, response, HTML, database, row, schema, foreign key, query, SQL, API, authentication, authorization, session, session token, cookie, deployment, CI/CD, git, GitHub-as-host, Vercel) is now Safe. M2 is the collapsed module: the learner meets their agent — Claude Code desktop, or Codex in the ChatGPT desktop app — and learns that the machinery a project used to require by hand (installing tools, managing packages, running git commands) is now the agent's job, not theirs.

### Safe (no callout needed)

- All M0 Safe + all M0 Requires-callout + all M1 Safe + all M1 Requires-callout.

### Requires-callout (D-04 pattern on first use)

New tool nouns introduced in M2 (in lesson order per D-20). Each is introduced Requires-callout on first use and is Safe after:

- **Claude Code desktop** — one of the course's two taught agent apps.
- **Codex** — the coding agent inside the ChatGPT desktop app; the course's other taught track, alongside Claude Code desktop. This callout is also where the ChatGPT relationship gets defined — the brand name itself is Safe from M0 and gets no callout of its own (its standalone **ChatGPT** row was removed here on 2026-08-15; see the M0 ride-along note).
- **OpenCode desktop** — named once as a third alternative agent app; not taught in this course.
- git (as a CONCEPT the agent operates on the learner's behalf — the learner names it and watches the agent use it; the noun was M0 Requires-callout for the Windows install caveat only, and M1 Requires-callout in its own right as a tool distinct from GitHub the site; M2 re-introduces it as something the agent DOES, not a tool the learner runs)
- GitHub (re-introduced as the account the agent saves work TO, distinct from M1's "GitHub-as-host" site definition)
- repository (as a git artifact — a saved project's home on GitHub; the learner sees its name and URL, never operates git on it directly)
- commit (a saved checkpoint of working code; the agent creates one when it says "save this as a working version")
- push (sending saved commits to GitHub; agent-performed)
- pull (bringing GitHub's saved state back down; agent-performed)
- branch (a separate line of work the agent can create to try something without touching the working version)
- merge (folding a branch's changes back into the working version; agent-performed)
- package (a piece of code someone else wrote that the app uses; the agent adds and manages these)
- dependency (a package the app needs to run; the agent manages the list)
- slash command (a typed instruction starting with `/` inside the agent app, distinct from an ordinary request in plain language)

### Forbidden (deferred to a later module)

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake; amended 2026-08-16 — the slash commands never become legal in a later module either: the Module 3 reshoot retired typed commands and teaches "start a fresh conversation" instead, so `slash command` is Forbidden there too — see the Module 3 section):

- terminal (one boundary-naming exception — the M0 note applies here too), command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`, `/cost`

**Boundary-naming exception (`terminal`).** Same exception as M0's, recorded there in full: M2 L2 (`02-the-engine-room.md`) may name `terminal` inside the off-contract smell-test — the list of requests that mean the learner is being handed the wrong kind of instruction — and in the exercise that rehearses it. The word appears only in a sentence that refuses it, never in an instruction. The lint surfaces these as WARN lines; they are contract-sanctioned. Added 2026-08-15.

Reserved for M3+:

- prompt (the prompt-engineering sense; the compound "approval prompt" is Safe from M0), context window, agent loop, planning conversation, execution conversation, intent (as named loop step), ask (as named loop step), evaluate (as named loop step), steer (as named loop step), hallucination *(anchor-lesson exception applies — see note below)*, drift *(anchor-lesson exception applies — see note below; M3 L2 and M3 L4 teach it in depth)*

*(`/clear`, `/compact`, `/context` and `/cost` left this bullet on 2026-08-16 — they never become legal at M3; they stay in the retired-course-surface bucket above, Forbidden in every module.)*

Reserved for M5+ *(first surfaced by M2's anchor lesson; taught in depth by the M5 watch-it-fail walkthroughs)*:

- risk-blindness *(anchor-lesson exception applies — see note below)*

Reserved (Module 3.5 is retired 2026-08-12; these terms have no active tier in any module. Next.js, React, `'use client'`, hydration, and file tree were re-homed to Module 4's Forbidden-in-M4 "Reserved for Module 7's curiosity track" block by the Phase 3 contract flip — see the Module 4 section):

- stack trace, error message anatomy, server component, client component, directive (React directive), file panel, diff summary, TypeScript, JSX, App Router, React Server Components

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, JWT, RLS, WITH CHECK, USING, server action, revalidatePath, Supabase

**M2 rewrite implications:** M2 no longer teaches tools as things the learner installs and runs by hand — that hands-on, terminal-and-package-manager shape is retired under Hard Rule 15. Instead M2 introduces the agent (Claude Code desktop, or Codex in the ChatGPT desktop app) and names the machinery the agent drives on the learner's behalf: git, GitHub, commits, packages, dependencies. The lesson body uses each term with a D-04 callout on first use and then drops the callout, but the callout defines what the learner SEES or SAYS (the agent reports "saved to GitHub"; the learner asks for a feature) — never a mechanism the learner performs themselves. Avoid mechanical descriptions ("a runtime is a software environment that executes...") — that framing described a retired hands-on step; describe what the agent does and what the learner observes instead.

**Anchor-lesson exception (`hallucination`, `drift`, `risk-blindness`).** All three are Forbidden as concept terms in M2 prose, with ONE exception: **M2 L1** (`01-your-ai-coding-agent.md`) is the Tenet 6 anchor lesson and introduces each with a D-04 callout in the "notice the name" framing, each paired with its own one-line smell-test and a pointer to where it goes deeper (M3 for hallucination and drift, M5 for risk-blindness). Every *other* M2 lesson defers — it names the failure mode in plain words ("the agent invents commands or packages that don't exist") and points to M2 L1. This resolves the apparent contradiction between the Forbidden tier and the shipped anchor lesson. The general principle (any module's anchor lesson may introduce an otherwise-Forbidden failure-mode term) lives in `docs/COURSE-AUTHORING.md` Part 7 § The anchor-lesson exception. *(Anchor duty moved from the former M2 L6, `06-ai-coding-agents.md`, on 2026-08-15 — that lesson was deleted when the remake collapsed Module 2 to three lessons; `drift` and `risk-blindness` were classified here in the same pass, having been anchored in the lesson but absent from this tier.)*

---

## Module 3 (M3)

Audience floor: M2 complete. Every M2 Requires-callout term is now Safe.

### Safe (no callout needed)

- All M0/M1/M2 Safe + all M2 Requires-callout.

### Requires-callout (D-04 pattern on first use)

- prompt
- context window
- agent loop
- planning conversation
- execution conversation
- intent (as named loop step, distinct from the everyday noun "intent")
- ask (as named loop step)
- evaluate (as named loop step)
- steer (as named loop step)
- hallucination (AI-output sense)
- drift (the agent-behaviour sense — first named by M2's anchor lesson; M3 L2 and M3 L4 are where the smell-test and the recovery are taught)
- over-engineering (M3 L4 callouts it today)

### Forbidden (deferred to a later module)

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake):

- terminal, command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, slash command

Reserved (Module 3.5 is retired 2026-08-12; these terms have no active tier in any module. Next.js, React, `'use client'`, hydration, and file tree were re-homed to Module 4's Forbidden-in-M4 "Reserved for Module 7's curiosity track" block by the Phase 3 contract flip — see the Module 4 section below):

- stack trace, error message anatomy, server component, client component, directive (React directive), file panel, diff summary, TypeScript, JSX, App Router, React Server Components

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, JWT, RLS, WITH CHECK, USING, server action, revalidatePath, Supabase

**M3 rewrite implications:** M3 lessons introduce the loop-step nouns (intent / ask / evaluate / steer) with D-04 callouts in L1 and use them freely after. The session-reset move is the plain phrase "start a fresh conversation" — no typed command is ever taught.

---

## Module 3.5 (M3.5)

**Retired 2026-08-12.** Module 3.5 is removed by the accessibility remake; see git history for the old tiers.

---

## Module 4 (M4) — Thread project build phases (Single-User + Multi-User Social Graph)

Audience floor: M3 complete. (Module 3.5 is retired 2026-08-12 — see its tombstoned section above; M4 now inherits directly from M3 rather than M3.5.)

**Pedagogical layer for M4+: the Execution-Floor Boundary** (CLAUDE.md hard rule 13; `docs/COURSE-AUTHORING.md` Part 6). The learner ships code via the agent — the agent authors; the learner states intent, observes the running app, runs the phase's check inventory (refusal checks + pre-flight questions), and tells the agent to save each working chunk. **The say-it-or-see-it rule (locked 2026-07-27) governs every term below:** a technical term may appear in an M4+ lesson ONLY if the learner must *say* it to the agent or *see* it in the running app or on a dashboard screen they operate themselves. Terms that existed only to be scanned for in the agent's diff or migration are cut — the learner never reads, scans, or judges anything the agent wrote. Where a term was cut, the observation it pointed at survives in behavioural form.

### Safe (no callout needed)

- All M0/M1/M2/M3 Safe + all M3 Requires-callout. (M3.5 contributed no terms — it is retired; see its tombstoned section above. The terms M4 used to inherit from it — Next.js, React, `'use client'`, hydration, file tree — are re-homed to the "Reserved for Module 7's curiosity track" bullet under Forbidden below, and no current M4 lesson uses any of them.)
- **plan** / **plan file** — the file the agent reads back to the learner in plain words at the start of every conversation. The learner says "the plan" and hears its contents; they never open or edit the file directly, so the term carries no mechanism to define and needs no callout.

### Requires-callout (D-04 pattern on first use; every entry passes say-it-or-see-it)

Build-phase nouns the learner says to the agent or sees on a screen they operate:

- **Supabase** — introduce as "the service that gives the thread project an account system, a database, and file storage in one." The learner says it in prompts and operates its dashboard (SQL Editor, key-copy screens); doesn't learn Supabase internals.
- **env var** / **environment variable** — introduce as "a named setting the deployed app reads at runtime that isn't checked into git (typically a secret)." The learner sees env vars listed on the Vercel settings screen; when the live site misbehaves but the local app works, the question to ask the agent is "is a setting missing on the live site?" GLOSSARY anchor `environment-variable` must exist before first callout.
- **`NEXT_PUBLIC_SUPABASE_URL`** — the one env-var name the learner really reads and compares themselves, on the Vercel settings screen, when checking that the live site points at the same Supabase project as their machine. The learner never learns the `NEXT_PUBLIC_` build rule; the agent decides which values need which prefix. The real key system is publishable/secret keys (`sb_publishable_…`, plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` on the settings screen); `NEXT_PUBLIC_SUPABASE_ANON_KEY` is retired and must not appear as a current claim in a lesson.
- **secret key** / **publishable key** — "Supabase's settings screen shows two keys; one is safe to be seen, one must never be." The learner copies the publishable one off the dashboard when the agent asks for it, and never pastes the secret one anywhere public; the agent uses each correctly in config. GLOSSARY anchor `publishable-key` must exist before first callout (see the model callout in rule 1 below).

The named skills the learner runs on every chunk:

- **smell-test** — the behavioural nose the learner develops for "something is off." First met as an unnamed observation skill in Module 3's evaluate step (M3.5's reading-floor lessons used to house a more advanced version of this skill; that module is retired — see its tombstoned section above); **M4 is where it is named and first called out**. In M4+ a smell-test is always one of two moves (CLAUDE.md hard rule 13): a **refusal check** or a **pre-flight question**. It is never "read what the agent wrote." Safe from M5 onward.
- **refusal check** — in the running app, try the thing that should NOT be allowed and confirm it is refused; if it goes through, tell the agent what you did and what should have stopped it.
- **pre-flight question** — before an irreversible step (a dashboard paste, anything run against data that already exists), ask the agent a named question about consequences and wait for the answer.
- **definition of done** / **test gate** — the ritual's name for the phase's check inventory. Introduce as "the checks the agent must run and show you before it may say done." Requires-callout on first use, in the plan lesson or Chunk 0; GLOSSARY anchor `definition-of-done` must exist before first callout.

### Forbidden in M4 specifically (deferred to Module 7 or out of scope for V1)

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake):

- terminal, command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`

Reserved for Module 7's curiosity track:

- React Server Components architecture (rendering execution model)
- RLS policy grammar as a concept (`USING` predicates, write-vs-read split, role-based policies)
- Hook lifecycle internals
- Server Action lifecycle internals
- Async/await semantics (event loop, microtasks, promise mechanics)
- TypeScript type system as a concept (`type` vs `interface`, generics, narrowing)
- Drizzle / Prisma / Kysely ORM internals (the thread project uses the Supabase JS client directly, not an ORM)
- Migration framework internals (Supabase migrations as a workflow vs. concept)

Re-homed here 2026-08-17 from the M3.5 orphan list (Module 3.5 is retired; these predate the desktop-app remake and fail say-it-or-see-it for M4):

- Next.js
- React
- `'use client'`
- hydration
- file tree

**Cut by the 2026-07-27 re-cut (fail say-it-or-see-it; may not appear in an M4 lesson body at all — not as a concept, not as a scan-target):** `RLS`, `WITH CHECK`, `USING`, `auth.uid()`, `OR author_id = auth.uid()`, `check (follower_id <> following_id)`, `follows_follower_idx` / `follows_following_idx`, `Server Action`, `revalidatePath`, `useOptimistic`, `async` / `await`, `cookies()` / `headers()` / `params`, `DROP TABLE`, the `NEXT_PUBLIC_` prefix as a standalone topic. These lived only inside code the agent wrote; each one's risk now surfaces as a refusal check or a pre-flight question instead (see the phase CONTEXT gates). Pasted dashboard code may *contain* such strings — that is cargo, not vocabulary; the lesson never asks the learner to read it.

### M4 say-it-or-see-it introduction rule (per Hard Rule 13; replaced the SYMPTOM-only rule 2026-07-27)

Every M4 Requires-callout term must name something the learner *says* to the agent or *sees* on a screen they operate — never something to find in the agent's code, and never a CONCEPT to understand from first principles.

1. **The D-04 callout defines what the learner does with the term**, not the mechanism. Wrong: `**publishable key** (a one-line definition: the JWT-shaped anon-role credential embedded in the client bundle...)`. Right: `**publishable key** (a one-line definition: the one of Supabase's two keys that is safe to be seen — you copy it off the dashboard when the agent asks; the other key never leaves the dashboard, [→ GLOSSARY](../../GLOSSARY.md#publishable-key))`.
2. **Surrounding prose does not exceed the callout's depth.** If the callout is operational, the next paragraph cannot start "behind the scenes, Postgres re-evaluates...". The callout is both floor and ceiling.
3. **The check inventory is the bridge between intent and recovery.** Each chunk maps to refusal checks and pre-flight questions in the phase's CONTEXT.md (`.planning/phases/NN-name/NN-CONTEXT.md`). The lesson states the intent; the check inventory tests the fence; the agent owns everything in between.

**M4 rewrite implications:** the re-cut against this contract landed with the M4 restructure on 2026-08-18. All nine shipped M4 lessons — the plan lesson plus the eight build lessons — are written against it, and none uses the retired SYMPTOM-only scan form it replaced, so they are the precedent for anything written next. When further build chunks are planned, this contract is what the planner uses to keep them on the Execution Floor. The phase's CONTEXT.md MUST be locked before plan-phase runs (CLAUDE.md hard rule 13).

---

## Module 5 (M5) — Operating the build

Audience floor: M4 complete. Every M4 Requires-callout term is now Safe (still say-it-or-see-it in framing; the term being Safe means "no callout needed on subsequent use," not "the learner now understands the mechanics").

### Safe (no callout needed)

- All M0–M4 Safe + all M4 Requires-callout.

### Requires-callout (D-04 pattern on first use)

- **watch-it-fail walkthrough** — a story where the agent fails on a known-bad pattern and you practice the recovery. Callout home: Lesson 02 (`02-the-fence-that-was-down.md`); the README may pre-name it in plain words.
- **multi-account testing** — the two-browser, alice+bob ritual: signing in as two real accounts at once to surface bugs single-user testing misses; first-class skill per LESSON-13. Callout home: Lesson 01 (`01-two-people-one-app.md`).
- **recovery prompt** — the message written after a check trips: say what you did and saw, ask the agent to find and fix it — never fix it yourself. Callout home: Lesson 01 (first trip) or Lesson 02.
- **regression** — a working feature that breaks because of an unrelated change; introduced in the context of "the agent's fix broke X." Callout home: Lesson 05 (`05-the-day-something-breaks.md`).
- **risk-blindness** — the agent proposes something that can't be undone with the same calm as a small fix. First named by M2's anchor lesson (M2 L1) with a one-line smell-test; M5's watch-it-fail walkthroughs put the learner in front of a real one. Classified here 2026-08-15. Callout home: Lesson 02 (first M5 use; reinforced without a second callout in Lesson 04).

**Removed 2026-08-19:** `deploy preview` and `env-var leak` were seeded for the retired fresh-fork-deploy lesson; no M5 lesson has a home for them. Under the desktop doctrine the learner never operates a branch/merge surface. M6/M7 may resurrect them if a lesson earns them.

### Forbidden in M5 specifically

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake):

- terminal, command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`

Reserved for Module 7 / out of scope:

- CI/CD pipeline internals (Vercel handles it; the learner doesn't configure it from scratch)
- Bundle analysis / size optimization
- Performance profiling
- Edge runtime vs. Node runtime distinctions
- Multi-region deployment

**M5 SYMPTOM-only rule:** The three watch-it-fail walkthroughs (LESSON-13) name the failure mode + the smell-test + the recovery prompt. The walkthroughs do NOT teach RLS grammar, Postgres internals, or React reconciliation — they teach the OBSERVATION ("I saw X; I asked the agent Y; the agent shipped Z") + the RECOVERY pattern. See COURSE-AUTHORING.md Part 7 § Anchor lessons for which limit each walkthrough surfaces.

**M5 rewrite implications (2026-08-19):** Unlike M4's rewrite implications, this is not a correction to shipped prose — the module lands with this phase, so this re-cut is the precedent Tasks 3–7 (and the Lesson-05 task, 8) author their lesson bodies against, not a repair of drifted lessons. The `.planning/phases/05-remake-operating/05-CONTEXT.md` gate is what this section encodes: five Requires-callout terms with their tier and callout home locked here, `deploy preview` and `env-var leak` adjudicated out (no lesson has a home for a branch/merge surface the learner never operates), and `risk-blindness` carried forward from its M2 anchor with no wording change needed. When Module 5's five lessons are planned and drafted, this contract — not the archived 2026-07-27 gate — is what keeps them on the say-it-or-see-it floor; no Module-5 lesson may be planned until the CONTEXT gate above is locked, and it already is.

---

## Module 6 (M6) — After it's live

Audience floor: M5 complete.

### Safe (no callout needed)

- All M0–M5 Safe + all M5 Requires-callout.

### Requires-callout (D-04 pattern on first use)

- **bug report** — introduce as "someone tells you the deployed app does something wrong; you reproduce it, then write a planning conversation."
- **reproduce** (in the bug-reproduction sense) — "open the deployed app, follow the steps, confirm you see the same wrong thing."
- **additive feature** — "a new feature you add to a working app without breaking the working parts."
- **prompt injection** — SYMPTOM-only: "a user supplies input designed to confuse the agent or the app." The learner does NOT learn attack vectors as a concept; the lesson teaches the SMELL-TEST as an AGENT-BEHAVIOR observation ("paste untrusted content from the live app — a user's comment or bio, a bug report someone sent — into the coding agent; watch whether the agent does only what you asked or starts acting on instructions hidden in the pasted text"). The recovery is learner-side: start a fresh conversation in the app, restate intent in your own words, and describe the content instead of pasting it verbatim. This is NOT an app-output-escaping check — a non-coder cannot audit sanitization, and the framework escapes stored user text by default, so that direction cannot fail on the shipped stack. *(Amended 2026-07-24 from the earlier "does the agent's code sanitize it before storing" phrasing, under the Phase 6 CONTEXT gate + CLAUDE.md HR 14; the "agent or the app" definition is unchanged. Amended again 2026-08-12: `/clear` replaced with "start a fresh conversation in the app" per CLAUDE.md hard rule 13's desktop-app phrasing.)*

### Forbidden in M6 specifically

**Retired course surface — agent territory under Hard Rule 15** (added 2026-08-12, desktop-app remake):

- terminal, command line, CLI, shell, Codespace, sandbox, npm, Node/runtime, package manager, IDE, localhost, `/clear`, `/compact`, `/context`

Reserved for Module 7:

- Prompt-injection attack-vector taxonomy (instruction injection, indirect injection, jailbreaking)
- Security hardening as a discipline (CSP, CSRF, XSS, secret rotation)
- Performance debugging (profilers, flame graphs)
- Test pyramid / test strategy
- Linting beyond the project's existing voice-lint
- Type-safety as a concept

**M6 SYMPTOM-only rule:** Prompt-injection is the headline M6 limit-and-smell-test pair. The lesson teaches WHAT THE SYMPTOM LOOKS LIKE (the coding agent starts doing something you never asked about right after you pasted content from outside) and WHAT THE SMELL-TEST IS ("paste the gate-supplied content sample into the agent; observe whether it stays on the task you asked for"). The recovery is learner-side (start a fresh conversation in the app; restate intent; describe don't paste). The lesson ships a fixed, gate-supplied content sample the learner copies and pastes — the learner never authors the payload. The sample is deliberately visible and harmless (it asks for a heading change and a maintenance banner, nothing destructive), and the shipped lesson does **not** promise the failure will reproduce: an agent may act on the payload, ignore it, or query it, and all three are results. What the learner is armed for is the shape — the paste, then work they never asked for — not a guaranteed observable failure. *(Amended 2026-08-20 to match the shipped lesson, which was authored to that honesty.)* The lesson does NOT teach attack-vector taxonomies, mitigation algorithms, or threat-modeling, and it is NOT an app-output-escaping check (the framework handles output-escaping by default).

---

## Module 7 (M7) — Where to go from here

Audience floor: M6 complete.

### Safe (no callout needed)

- Everything from M0–M6.

### Module 7 is the escape valve

Module 7 is the only module where the **forbidden lists from prior modules** can be revisited as "where to go next" pointers. Topics deferred from earlier modules surface here as curated curiosity tracks. The rule for M7 lessons:

**No "Retired course surface" Forbidden bucket here, and that omission is deliberate.** Every other module's Forbidden section restates the Hard-Rule-15 bucket (terminal, CLI, Codespace, npm, etc.); M7 doesn't, because M7 is the module where exactly those deferred topics are allowed to resurface as pointers under the rules below — restating them as Forbidden would contradict the module's own purpose.

1. **Topics are POINTERS, not curriculum.** A Module 7 lesson on "going deeper on RLS" links to canonical docs + names what's there; it does NOT replicate a Module 4 RLS deep-dive.
2. **Each pointer carries an "is this for you?" framing.** Module 7 names the LEARNER PROFILE that should follow each pointer (e.g., "if you want to operate the thread project long-term, this RLS reading is the next 30 minutes"; "if you're never going to touch RLS again, skip this").
3. **Translation keys count as Module 7 material.** The PROJECT.md decision to ship a translation key from the durable loop to other agents (Cursor, Cline, Continue) is Module 7's job.

### Requires-callout (D-04 pattern on first use)

- **translation key** — "the mapping from the loop (Module 3) to other AI coding agents (Cursor, Cline, Continue, etc.)."
- **curated resources** — Module 7's external pointers; date-stamped per the freshness model.

### M7 IS where deeper explanation lives

The "What NOT to Teach" appendix (COURSE-AUTHORING.md Part 8) repeatedly says "escape to Module 7 only" for traps like RLS grammar, async/await semantics, hook internals, hydration mechanism, bundler internals. Module 7 IS that escape. But Module 7 lessons are POINTERS, not deep-dives — the canonical content lives in external docs the learner is now equipped to read.

---

## Maintenance

When a new lesson introduces a new technical noun:

1. The author classifies it (Safe / Requires-callout / Forbidden) for THIS module and every subsequent module.
2. The author adds it to this contract in the same PR.
3. The author adds a `### {anchor}` entry to GLOSSARY.md.
4. voice-lint.sh (Plan 01-8) verifies the lesson uses the callout pattern on first use of any Requires-callout term and never uses Forbidden terms.

When a term that was Forbidden becomes legal in a later module:

1. The author moves it from Forbidden in the prior module's section to Requires-callout in the new module's section (the callout is mandatory the first time it's defined).
2. From the next module onward, the term joins Safe.

This file is authoritative. If a lint flags a violation that the lesson author believes is correct, update the contract first, then the lesson — never silently bypass.

**Gemini CLI retired 2026-08-12 with the remake.** Every `Gemini CLI` row is removed from this contract's tier lists. The taught tracks are now Claude Code desktop and Codex in the ChatGPT desktop app, with OpenCode desktop named once as a third alternative (CLAUDE.md hard rule 15). The M3 section carried a transitional exception until its lessons were reshot: **that exception closed 2026-08-16.** Module 3 now presents Claude Code desktop and Codex in parallel and teaches "start a fresh conversation" as the session-reset move, so no typed command becomes legal at M3 — `slash command` is Forbidden in the M3 section, and `/clear`/`/compact`/`/context`/`/cost` stay in the retired-course-surface bucket of every module's Forbidden tier.

**`magic link` retired from every tier list 2026-08-17.** The thread project's sign-in has been an email address and a password since 2026-07-25, and Module 4's own tier lists name no emailed sign-in link, so the term's `Reserved for M1+` / `Reserved for M4+` rows in the Module 0, 1, 2, and 3 sections were forward-references to a lesson that no longer teaches it. The term now has no active tier in any module. (`GLOSSARY.md`'s `authentication` entry still uses a magic link as one everyday *example* of proving who you are — that is illustration, not a course term, and it stays.)
