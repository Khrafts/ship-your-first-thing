# Ship Your First Thing — Open-Source AI-Assisted Vibecoding Course

## What This Is

An open-source, self-paced course that teaches non-technical people to ship a working, deployed product using AI coding tools. It is a standalone source of truth — a learner picks it up cold, works through it on their own, and ends with a real product they built and a durable mental model of how software is made. The course is not structured around any workshop or live event; live materials are derived downstream from this core text.

## Core Value

A learner who has never written production code can — by following this course alone — confidently ship a real, deployed software product **and** recover when the AI gets it wrong.

The "and" is non-negotiable. Anyone can copy commands until something breaks. The differentiator is the recovery skill: knowing the AI is wrong, knowing how to steer it back, and knowing when to stop and think.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**The course (deliverable as a GitHub repo of plain markdown):**

- [ ] Module 0 — Welcome & lightweight setup (Codespaces link + accounts only)
- [ ] Module 1 — How software works (mental models: client/server, browsers, databases, APIs, auth, deployment — all conceptual, restaurant analogy as anchor)
- [ ] Module 2 — The developer toolchain (each tool introduced as the answer to a problem the learner has just started to feel: IDE, terminal, runtime, package manager, git/GitHub, AI coding agents)
- [ ] Module 3 — Working with an AI coding agent (the loop in depth: planning vs. execution conversations, reading plans critically, recognizing wrong output, feeding errors back, when to start over)
- [ ] Module 3.5 — Reading code, just enough (pattern recognition for non-coders: "does this look right?", "is the AI editing the right file?", "what is this error pointing at?" — recovery requires this; the brief implied it but it deserves explicit treatment)
- [ ] Module 4 — Designing & building the thread project (interleaved design ↔ build chunks, not waterfall; chunk-by-chunk with commits between)
- [ ] Module 5 — Operating the build (handling things going sideways, deliberate "watch it fail" walkthroughs, multi-account testing, deploying to Vercel)
- [ ] Module 6 — After it's live (what "done" really means, fixing reported bugs, adding features without breaking what works, when to ask for human help)
- [ ] Module 7 — Where to go from here (what to learn next, what NOT to learn next, how to keep practicing the loop, curated resources)

**Cross-cutting artifacts:**

- [ ] `README.md` — what this is, who it's for, how to use
- [ ] `SETUP.md` — Codespaces flow, accounts, optional local install
- [ ] `GLOSSARY.md` — every term, plainly defined
- [ ] `CHEATSHEET.md` — one-page reference: common AI prompts, git basics, deploy commands
- [ ] `COMMON-ISSUES.md` — what to do when X breaks; designed to grow over time
- [ ] `WHAT-CHANGED.md` — freshness log; tools change, this records what

**Thread project (the product woven through Modules 4–6):**

- [ ] **Early-days social platform** — FB-circa-2006 / IG-circa-2011 in spirit
- [ ] Auth: sign up / sign in / sign out
- [ ] Profile: name, bio, avatar, list of own posts, edit own profile
- [ ] Posts: text + optional image (Supabase Storage), edit/delete own
- [ ] Friends: send request / accept / unfriend (bidirectional)
- [ ] Feed: chronological feed of friends' posts + own
- [ ] Post detail page with comments (any friend can comment)
- [ ] Likes on posts
- [ ] 5 screens + auth flow: Feed, own profile, other user's profile, post detail, friends list/requests
- [ ] Deployed to Vercel with working multi-user demo

**Lesson anatomy applied throughout:**

- [ ] Every lesson includes: learning objective, why this matters (2–4 sentences), core read (600–1500 words), vocabulary callouts (terms defined inline on first use), exercise (10–25 minutes), checkpoint ("you've got this if you can ___"), going-deeper pointers (optional)
- [ ] Adapt anatomy where a topic doesn't fit; note the deviation in the lesson

### Out of Scope

- **Multiple AI agent surfaces beyond Claude Code + Aider** — Cline and Continue are VS Code extensions with different ergonomics; teaching three diverges the loop demonstration. Aider was chosen as the free OSS counterpart because it shares Claude Code's mental model (CLI, file-aware, plan-then-execute, git-native) and works in Codespaces with no IDE dependency.
- **Multiple deploy targets** — Vercel only for V1. AWS / Render / Fly are valuable later, distracting now.
- **Multiple backend stacks** — Next.js + Supabase locked. Alternatives (Convex, Clerk + Vercel Postgres, custom Express) are Module 7 "where to go next" material.
- **Local-first setup as the default path** — Codespaces is the primary on-ramp; local install moves to an appendix.
- **Deep CSS, framework comparisons, type theory, build internals** — anything that doesn't directly serve the loop.
- **Live workshop materials, slide decks, video** — derived downstream from this course; not part of V1.
- **Real-time features (websockets), DMs, notifications, search, hashtags, blocking, multi-photo posts, algorithmic feed** — explicitly excluded from the thread project V1; Module 6 / future material.
- **Stripe / payments / ecommerce** — too many converging systems; the course would become about ecommerce, not the loop. Module 7 "where to go next" pointer only.
- **Tutorial fiction ("in just a few clicks…")** — the course is honest about friction. Excluded by design.
- **Filler prose** ("In today's fast-paced world…") — excluded by design.

## Context

**Audience:** Comfortable using a computer; has never written production code. Has used GitHub at most to view a page. Curious about building real software, intimidated by code. Self-paced. May or may not have budget for paid AI tools.

**Robustness target:** V1 is substantial. A learner who completes it should have genuine intuition for how software products are structured, be able to design a product at the component level on paper, understand the developer toolchain and *why* each tool exists, be fluent in the iterative loop with an AI coding agent (including recovery), and have shipped a working deployed product end-to-end.

**Robustness ≠ technical depth.** The hard work is making rich content accessible. Plain language, analogies, every term defined on first use. Where a deeper rabbit hole exists, mark it optional and link out — don't pull it inline.

**Course philosophy (load-bearing):**
1. Mental models before mechanics — a learner who can diagram a product can reason about almost any product.
2. One thread project woven throughout — the early-days social platform.
3. The skill is the loop — intent → ask → evaluate → steer. Every lesson reinforces it. Tools and concepts are scaffolding for the loop.
4. Show AI failing and recovering — the recovery skill is the differentiator. Don't pretend it always works.

**Freshness model (load-bearing):** AI tools change every few months. The course must be written so that the *loop* is durable while the keystrokes are explicitly ephemeral. Mechanisms:
- Date-stamp lessons that depend on tool-specific behavior
- `WHAT-CHANGED.md` log records what shifted between course revisions
- Inline framing throughout: "the loop is durable; the keystrokes are not"
- Sidebars where Claude Code Pro vs API vs Aider+free-tier diverge in cost/behavior

**Format:** Plain markdown in a GitHub repo. No static site generator for V1 — keeps the bar low and contributions easy. Mermaid diagrams render natively on GitHub.

## Constraints

- **Primary AI agent**: Claude Code — most capable; reflects how serious work is being done.
- **Free OSS AI agent**: Aider — shares Claude Code's mental model (CLI, file-aware, plan-then-execute, git-native), works in Codespaces, BYO model (OpenRouter free tier or local Ollama for genuinely $0). Worked examples in both agents wherever the workflow meaningfully differs.
- **Deploy target**: Vercel.
- **Quick-start environment**: GitHub Codespaces — removes local-install friction.
- **Code language**: TypeScript over JavaScript. AI agents use types as guardrails; the cost-benefit is favorable even for non-technical learners.
- **Frontend framework**: Next.js (App Router) — Vercel-native, abundant AI training data.
- **Backend / data**: Supabase — auth + Postgres + storage in one account, durable free tier, well-documented.
- **Site format**: Plain markdown in a GitHub repo for V1.
- **Lesson length**: Core reads typically 600–1500 words; adapt to topic.
- **Voice**: Plain language, define every term on first use, redefine after long gaps. No filler. No tutorial fiction.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Aider as the free OSS agent | Same mental model as Claude Code → loop is teachable as one shape with two surfaces; Cline/Continue are VS Code extensions with different ergonomics; Aider's BYO model unlocks genuinely free paths | — Pending |
| Module 0 stays minimal (accounts + Codespaces only) | Heavy setup before mental models is friction; "optional local setup" moves to appendix | — Pending |
| Add Module 3.5 "Reading code, just enough" | Recovery from AI mistakes requires some pattern recognition; brief implied it but didn't make it explicit; this is where most non-technical learners actually fail | — Pending |
| Interleave Modules 4 & 5 (design ↔ build) | Strict design-then-build is waterfall fiction; real product dev alternates; merge into a single design-and-build module with chunked design/build cycles | — Pending |
| Thread project: stripped-down social platform | User chose social over trackers; relatability of daily-use familiarity is real pedagogical asset; "lonely feed" risk solved by teaching multi-account testing as an explicit skill in Module 5 | — Pending |
| Multi-account testing as a taught skill | Solves the lonely-deploy problem and is itself a real-world testing technique every developer uses | — Pending |
| Backend: Next.js + Supabase | Single account = auth + Postgres + storage; Vercel deploy native; abundant AI training data; durable free tier | — Pending |
| TypeScript not JavaScript | AI agents use types as guardrails; reduces wrong-output rate even for learners who don't deeply read the types | — Pending |
| Markdown-in-GitHub for V1 (no static site generator) | Keeps the bar low for contributions; Mermaid renders natively; can graduate to a generator post-V1 if warranted | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-08 after initialization*
