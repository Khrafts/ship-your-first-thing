# BUDGET.md — Course costs, honestly

**Last verified:** 2026-05-08
**Freshness commitment:** This file is updated whenever a cost-affecting upstream changes. Check `WHAT-CHANGED.md` for the most recent revision date. If you spot stale numbers, file an issue tagged `freshness` (see `CONTRIBUTING.md`).

## Why this file exists

Most coding courses pretend the tools are free, then learners hit a paywall in the middle of Module 4 and quit. This file does the opposite: three honest cost paths, named, with concrete numbers and a course-completion projection per path. Pick yours before you create accounts (Module 0 walks you through the triage).

## The three paths

The course supports three named cost paths. All three reach the end of the thread project. They differ in friction, predictability, and how much they ask you to manage tokens manually.

### Path 1: Claude Code Pro — predictable, recommended for most

| Item | Cost (as of 2026-05-08) |
|---|---|
| Claude Code Pro subscription | $17/mo billed annually, or $20/mo billed monthly |
| GitHub account | Free |
| GitHub Codespaces (free tier) | 120 core-hours/mo on a 2-core machine = 60 clock-hours/mo |
| Vercel (hobby tier, course platform deploys + thread project) | Free for personal use |
| Supabase (free tier, thread project only — Phases 3 onward) | Free |

**Course-completion projection (Path 1):** ~$17–20/mo for the duration you take. A focused learner finishing Modules 0–7 in three months: **~$60 total**. A spread-out learner over six months: **~$120 total**.

**What "Pro" gives you:** A predictable monthly ceiling on Claude usage. You will not be surprised by a token bill. The trade-off is that Pro has rate limits — heavy days, you'll hit them. For non-technical learners, the predictability is worth it.

**Pick this path if:** You have $20/mo to spend on this and want the lowest cognitive overhead.

### Path 2: Gemini CLI free tier — the genuinely-free path

| Item | Cost (as of 2026-05-08) |
|---|---|
| Google account (for Gemini API key) | Free |
| Gemini CLI (the AI agent itself) | Free, open source, Google-maintained |
| Gemini API free tier (the model behind Gemini CLI) | $0 with generous daily limits — re-verified by Phase 2 |
| GitHub account + Codespaces + Vercel + Supabase | Free as in Path 1 |

**Course-completion projection (Path 2):** **$0**. The catch is rate limits and tier behavior — Google's free-tier mechanics shift, and a heavy day may hit the daily cap. Phase 2 of this course re-verifies the current daily/monthly caps before lessons are authored.

**What "free" actually means here:** The free tier is genuinely free, but it shapes how you work. You learn `/clear`, `/compact`, `/tokens` (or the Gemini CLI equivalent) as **token discipline** habits, not optional polish. Cost-careful learners often *prefer* this path because it teaches the discipline by force.

**Trade-offs vs Claude Code Pro:**
- **Plus:** Genuinely $0; no surprise bill possible.
- **Plus:** Same loop shape — CLI, plan-then-execute, file-aware. The course teaches the loop once and demonstrates on both surfaces.
- **Minus:** Tied to Google's free-tier behavior; if Google narrows the free tier mid-course, this path narrows with it.
- **Minus:** Rate limits exist. Some Module 4 days may push the cap.

**Pick this path if:** You're cost-conscious and willing to manage your token budget by hand.

### Path 3: Claude Code via Anthropic API — token-careful

| Item | Cost (as of 2026-05-08) |
|---|---|
| Anthropic account + API access | Free to create; pay-as-you-go for tokens |
| Claude Sonnet (recommended default) | ~$3 per million input tokens, ~$15 per million output tokens |
| Claude Opus (only for "watch the smartest model fail" demos) | ~$15 per million input tokens, ~$75 per million output tokens |
| GitHub + Codespaces + Vercel + Supabase | Free as in Paths 1 and 2 |

**Course-completion projection (Path 3):** **$30–$200 total** depending on token discipline. A carefully-managed learner using Sonnet, `/clear` between tasks, and short scoped prompts: **~$30–$60**. A learner who keeps the entire conversation context loaded and re-prompts repeatedly: **$200+** — and at the high end, **single prompts can eat 30–90% of a 5-hour budget** in a long debugging session. The course teaches the discipline that keeps this path cheap, but the discipline is real and deliberate.

**What "token-careful" means:** You will use `/clear`, `/compact`, `/tokens`, `/drop` (Module 3 covers them in depth). You will default to Sonnet, not Opus. You will start fresh sessions when context gets stale rather than letting it grow. This path turns into Path 1 (~$60–$120 total) if the discipline slips.

**Pick this path if:** You're cost-conscious **and** technically curious enough to manage tokens deliberately.

## Quick decision

| Question | Path |
|---|---|
| Do you have $20/mo to spend on this? | **Path 1 — Claude Code Pro.** |
| You want $0 and you're OK with rate limits? | **Path 2 — Gemini CLI free tier.** |
| You're $0–$60-curious and willing to watch tokens? | **Path 3 — Anthropic API token-careful.** |

Module 0 (`modules/00-welcome/03-cost-path-triage.md`) walks you through this triage in more detail before you create any accounts.

## Module-by-module cost divergences

This section grows as later phases author lessons. Phase 1 seeds the structure; Phases 2 and 3 fill in the specifics.

### Module 0 (Welcome) — all paths

No AI tokens used. Free for all three paths.

### Module 1 (Mental models) — all paths

No AI tokens used. Module 1 is reading + diagramming exercises. Free for all three paths.

### Modules 2 / 3 / 3.5 (Toolchain & The Loop)

*Per-path cost notes will be added by Phase 2 once Module 2/3/3.5 lessons are authored. The expected pattern: Modules 2 and 3 introduce the loop; token use is light and concentrated in Module 3 worked examples.*

### Module 4 (Thread project — design + build)

*Per-path cost notes added by Phase 3. Expected pattern: highest token use of the course, especially Chunks 4 and 5 (Friends + Feed) where context windows grow.*

### Module 5 (Operating the build)

*Per-path cost notes added by Phase 5. Watch-it-fail walkthroughs use Opus deliberately for the "smartest model fail" comparison; one-time small spike for Path 3 learners.*

## Hidden costs not on this table

These are zero or near-zero today but the course names them so you're not surprised:

- **Custom domain (optional):** ~$10–15/year if you want to own a domain for your deployed thread project. Vercel offers `*.vercel.app` subdomains free.
- **Codespaces over the free tier:** if you exceed 120 core-hours/mo on a 2-core machine, GitHub bills $0.18/core-hour after that. Most learners don't hit this. Setting auto-stop to 30 minutes (default) keeps you safe.

## How this file stays accurate

- Numbers above carry a `Last verified:` date. The freshness commitment is: when an upstream changes (Claude Code Pro pricing, Gemini API free-tier mechanics, Codespaces caps), this file updates within 30 days, and `WHAT-CHANGED.md` records the date.
- Quarterly smoke test (per `CONTRIBUTING.md`) re-verifies cost paths.
- If you find a number that's wrong, file an issue tagged `freshness`.

## Related artifacts

- [`VERSIONS.md`](./VERSIONS.md) — pinned tool versions; check before reasoning about a tool-specific cost.
- [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) — what shifted between course revisions.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to file a freshness issue or PR a correction.
