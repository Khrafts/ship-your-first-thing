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

- file, folder, browser, tab, window, menu, button, link, click, type, search, save, copy, paste, password, account, sign in, sign out, email, phone, message, internet, URL (as a "web address" — the structural details land in M1)

### Requires-callout (D-04 pattern on first use)

Tool nouns introduced in M0 that the audience hasn't met:

- markdown, GitHub (as a *site*, distinct from "git"), Codespace, repository (or repo), terminal, code editor, AI coding agent, API key, free tier, rate limit, token (as in AI-tool token, distinct from auth token in M1)

### Forbidden (deferred to a later module)

Reserved for M1+:

- HTTP, DNS, request, response, server, client, browser-as-program (M1 elevates the everyday "browser" noun to a technical role), database, schema, SQL, query, row, table, foreign key, API (as a *contract* — M1 bundle 2), authentication, authorization, session, cookie, deployment, localhost, CI/CD, build server, JWT, RLS, magic link

Reserved for M2+:

- IDE, runtime, package manager, Node, npm, git (as a tool, distinct from "GitHub" the site), commit, push, pull, branch, merge

Reserved for M3+: prompt, context window, `/clear`, `/compact`, `/tokens`

**M0 rewrite implications:** The user-flagged exemplar `02-hardware-check.md` drops "pure markdown", "Codespace", "Node", "git", "Codespace image" — every one of those is in the M0 Requires-callout or Forbidden list. The rewrite (Plan 01-6 Task 2) replaces "pure markdown" with a callout for **markdown**, defers "Node" and "git" entirely (the prose can say "the Codespace already has the tools Module 2+ will need pre-installed" without naming them), defines **Codespace** the first time it appears via callout, and replaces "Codespace image" with prose that doesn't introduce a new noun.

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

- HTTP, HTTP method, HTTP status code, URL (as a structural noun — was Safe in M0 as "web address"; in M1 we re-define structurally), DNS, server, browser (re-defined as a program, not a tab), request, response, HTML, database, row, schema, foreign key, query, SQL, API, authentication (authn), authorization (authz), session, session token, cookie, localhost, deployment, CI/CD, git, GitHub (as the host of git repos), Vercel

### Forbidden (deferred to a later module)

Reserved for M2+:

- IDE, terminal-as-developer-tool, package manager, npm, runtime, commit, push, pull, branch, merge (terminal appears as "where commands run" in M0 Codespaces lesson via callout; M1 doesn't name it again)

Reserved for M3+:

- prompt, context window, `/clear`, `/compact`, agent loop, planning conversation, execution conversation

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, magic link (as Supabase Auth implementation), JWT, RLS, WITH CHECK, USING, server action, revalidatePath

**M1 rewrite implications:** The current M1 lessons drop HTTP / DNS / methods / SQL / schema / foreign key as if defined; the existing 02-where-data-lives.md exemplar uses the callout pattern correctly for those terms (it was the exemplar of the pattern). The rewrite (Plan 01-6 Task 3) brings 01 and the new 03 + 04 up to the same standard, and confirms 02 has not regressed.

---

## Module 2 (M2)

Audience floor: M1 complete. Every M1 Requires-callout term (HTTP, DNS, server, browser-as-program, request, response, HTML, database, row, schema, foreign key, query, SQL, API, authentication, authorization, session, session token, cookie, localhost, deployment, CI/CD, git, GitHub-as-host, Vercel) is now Safe.

### Safe (no callout needed)

- All M0 Safe + all M0 Requires-callout + all M1 Safe + all M1 Requires-callout.

### Requires-callout (D-04 pattern on first use)

New tool nouns introduced in M2 (in lesson order per D-20):

- IDE
- terminal (re-introduced as "the developer tool surface" — was M0 Requires-callout for "where commands run"; M2 promotes it to a named tool category)
- runtime
- Node (or Node.js — pick one canonical form per lesson; cite the install command from CD-12)
- package manager
- npm
- package
- dependency
- git (as a TOOL, distinct from M1's "GitHub-as-host"; the noun was M1 Requires-callout; M2 L5 re-introduces it as a tool you USE, not just a site)
- repository (as a git artifact, distinct from M0's casual "GitHub repo" mention)
- commit
- push
- pull
- branch
- merge
- Claude Code
- Gemini CLI
- slash command

### Forbidden (deferred to a later module)

Reserved for M3+:

- prompt, context window, `/clear`, `/compact`, `/context`, `/cost`, `/compress`, `/stats`, agent loop, planning conversation, execution conversation, intent (as named loop step), ask (as named loop step), evaluate (as named loop step), steer (as named loop step), hallucination

Reserved for M3.5+:

- file tree, stack trace, error message anatomy, `'use client'`, server component, client component, hydration, directive (React directive), file panel, diff summary

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, magic link (Supabase Auth), JWT, RLS, WITH CHECK, USING, server action, revalidatePath

**M2 rewrite implications:** M2 introduces tools as nouns the learner now operates. The hands-on shape of each tool (key commands, install path) is shown via CHEATSHEET + VERSIONS.md; the lesson body uses the term with a D-04 callout on first use and then drops the callout. Avoid mechanical descriptions ("a runtime is a software environment that executes...") — use the felt-problem framing locked in D-20.

---

## Module 3 (M3)

Audience floor: M2 complete. Every M2 Requires-callout term is now Safe.

### Safe (no callout needed)

- All M0/M1/M2 Safe + all M2 Requires-callout.

### Requires-callout (D-04 pattern on first use)

- prompt
- context window
- `/clear`
- `/compact`
- `/context`
- `/cost`
- `/compress` (Gemini CLI's equivalent of Claude Code's `/compact` — note the divergence; cf. RESEARCH.md State-of-the-Art table)
- `/stats` (Gemini CLI)
- agent loop
- planning conversation
- execution conversation
- intent (as named loop step, distinct from the everyday noun "intent")
- ask (as named loop step)
- evaluate (as named loop step)
- steer (as named loop step)
- hallucination (AI-output sense)

### Forbidden (deferred to a later module)

Reserved for M3.5+:

- file tree, stack trace, error message anatomy, `'use client'`, server component, client component, hydration, directive (React directive), file panel, diff summary

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, magic link, JWT, RLS, WITH CHECK, USING, server action, revalidatePath

**M3 rewrite implications:** M3 names the loop. Every lesson uses the loop-step nouns (intent / ask / evaluate / steer) freely AFTER the first-use callout in M3 L1. The slash commands appear in CHEATSHEET first; lessons re-introduce them with D-04 callouts only at first lesson-internal use. CRITICAL: do NOT introduce `/tokens` — that's the deprecated name. M3 L2 teaches the canonical commands `/context` (Claude Code, window usage) and `/cost` (Claude Code, spend), plus Gemini CLI's `/compress` and `/stats`. The same-PR migration of CHEATSHEET/BUDGET/GLOSSARY off `/tokens` ships in Plan 02-02 (Wave 1) before any M3 lesson is written.

---

## Module 3.5 (M3.5)

Audience floor: M3 complete. Every M3 Requires-callout term is now Safe.

### Safe (no callout needed)

- All M0/M1/M2/M3 Safe + all M3 Requires-callout.

### Requires-callout (D-04 pattern on first use)

- file tree
- stack trace
- error message anatomy (note: introduced as a phrase, not "stack trace" — D-33 floor: the lesson teaches finding the first line that mentions YOUR file, not line-by-line stack-trace parsing)
- `'use client'`
- server component
- client component
- hydration (introduced as a SYMPTOM term — "hydration error in plain English" — per D-33 floor; NOT as a technical explanation)
- directive (React directive sense)
- file panel
- diff summary

### Forbidden (deferred to a later module)

Reserved for M4+:

- env var, environment variable, NEXT_PUBLIC, secret key, publishable key, magic link, JWT, RLS, WITH CHECK, USING, server action, revalidatePath

**M3.5 rewrite implications:** M3.5 is the FIRST module where code surface is visible. D-33 floor is the load-bearing pedagogical constraint: every term above is introduced ONLY at the "you can detect this symptom" level. Do NOT extend `'use client'` into a first-principles RSC explanation. Do NOT extend `stack trace` into line-by-line parsing. If a lesson author wants to go deeper, the deeper explanation belongs in Module 7's "where to go next" track — not in M3.5. The four exercises must match the four D-35 shapes: annotation (L1) / judgment (L2) / tracing (L3) / ask-the-agent (L4).

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
