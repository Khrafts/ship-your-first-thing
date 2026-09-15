# BUDGET.md — Course costs, honestly

**Last verified:** 2026-09-08.
**Freshness commitment:** This file is updated whenever a cost-affecting upstream changes. If you spot stale numbers, file an issue tagged `freshness` (see `CONTRIBUTING.md`).

## Why this file exists

Most coding courses pretend the tools are free, then learners hit a paywall partway through and quit. This file does the opposite: the three honest cost tracks this course teaches, named, with concrete numbers, so you can pick yours before you create a single account. [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md) walks you through the same triage, at the moment you need it.

## The three tracks

Every path through this course costs you something — money, or limits, or both. There's no free-forever option. **All three can ask you to wait on a heavy day.**

### Path 1: Claude Code desktop — predictable cost, not unlimited use

| Item | Cost |
|---|---|
| Claude Pro (includes Claude Code desktop) | $20/month billed monthly, or $17/month billed annually |
| Everything else the course needs | Free (see the module rows below) |

That $20 is the floor — no free plan includes Claude Code. What it buys: every lesson in this course, with a usage allowance that resets on a schedule. On a heavy day the app can tell you to wait until it resets. Nothing in this course needs any paid extra.

<!-- Source: code.claude.com/docs/en/desktop-quickstart, fetched 2026-09-08 ("Claude Code requires a Pro, Max, Team, or Enterprise subscription"); support.claude.com/en/articles/11145838 (usage limits), confirmed 2026-09-07. -->

**Pick Path 1 if:** you have $20/month you're comfortable spending on this course and you'd rather pay for a bigger, predictable allowance than manage a free one.

### Path 2: Codex, inside the ChatGPT desktop app — free to start

| Item | Cost |
|---|---|
| ChatGPT Free plan (includes Codex) | $0 — no card, no subscription |
| ChatGPT Go / Plus (optional upgrade, same path) | $8/month / $20/month — a bigger allowance, same app |
| Everything else the course needs | Free (see the module rows below) |

Codex is included on every ChatGPT plan, including Free. The allowance is measured in messages per five-hour window and varies by plan and model; OpenAI says the published figures are estimates, not fixed limits. On a heavy day the app may ask you to wait, or offer you a paid plan. What OpenAI includes on the free plan can change.

<!-- Source: learn.chatgpt.com/codex/pricing, fetched 2026-09-08 ("ChatGPT Work and Codex are included in your ChatGPT Free, Go, Plus, Pro, Business, Edu, or Enterprise plan"; Free $0, Go $8/month, Plus $20/month; "measured in local messages per five-hour period"; "These estimates are not fixed message limits"). The August "for a limited time" wording is no longer on the page. -->

**Pick Path 2 if:** $0 matters more to you than a bigger allowance, and you're happy to use a ChatGPT account.

### Path 3: OpenCode desktop — free models, no account

| Item | Cost |
|---|---|
| OpenCode desktop with a model marked Free | $0 — no account needed to start |
| OpenCode Go (optional) | $10/month for a larger set of models with its own usage limits |
| Everything else the course needs | Free (see the module rows below) |

OpenCode is open source and ships with free models provided by OpenCode. Each is offered "for a limited time": the list changes, and a model you were using can be withdrawn. While a model is free, what you send it may be used to improve that model, so keep private information out of your prompts. If you reach a free model's limits, you can switch to another free one; the paid plan is optional, and OpenCode can also use a paid ChatGPT account you already have (not a Claude plan — Anthropic doesn't allow it).

<!-- Source: opencode.ai ("Free models included or connect any model from any provider"), opencode.ai/docs/zen/ (each free model "is available on OpenCode for a limited time"; "During its free period, collected data may be used to improve the model"), opencode.ai/docs/go/ ("OpenCode Go is a low cost $10/month subscription"; "If you reach the usage limit, you can continue using the free models") — all fetched 2026-09-08. No sign-in for the Free picker: director's observation, 2026-09-08. -->

**Pick Path 3 if:** you want $0 with no account, and you're fine with the free models changing under you.

### Switching is cheap

You can switch later: install the other app, sign in if needed, and open your existing project folder. The same build-and-check approach applies.

### Retired paths

Gemini CLI (the free track through 2026-08-12) and the earlier pay-per-use path are retired. None of the current tracks asks you to manage a running total by hand.

## Quick decision

| Question | Answer |
|---|---|
| Can you spend $20/month on this course? | **Yes → Path 1, Claude Code desktop.** Flat, predictable cost; a larger allowance that can still make you wait on a heavy day. |
| (If no) Happy to use a ChatGPT account? | **Yes → Path 2, Codex in the ChatGPT desktop app.** Free to start, upgradeable in place. |
| (If no) Want $0 with no account at all? | **Yes → Path 3, OpenCode desktop.** Free models that change over time; keep private data out. |

## Module-by-module costs

- **Module 0 (Welcome):** Lessons 1–5 use no AI. Lesson 6 is your first real use of your agent — a short session, well inside any path's allowance on an ordinary day. No account beyond the one Lesson 4 creates.
- **Module 1 (Mental models):** No AI use. Reading and drawing.
- **Modules 2 and 3 (Toolchain, the loop):** Light AI use. Module 2 Lesson 3 adds a free GitHub account.
- **Module 4 (Thread project):** Adds two more free accounts: Supabase (your database) and Vercel (where the app goes live); both free plans cover everything this module builds. The course's heaviest AI use, and the module where any path is most likely to ask you to wait.
- **Modules 5 and 6 (Operating, after it's live):** No new accounts, no new costs. Ordinary AI use on the app Module 4 left live.
- **Module 7 (Where to go from here):** No AI use, no accounts.

## Hidden costs not on this table

- **Custom domain (optional):** ~$10–15/year if you want to own a domain for your deployed thread project. Vercel offers `*.vercel.app` subdomains free.

## How this file stays accurate

- When an upstream changes (Claude Pro pricing, ChatGPT plan mechanics, OpenCode's free models, Supabase or Vercel free-tier terms), this file updates within 30 days.
- Quarterly smoke test (per `CONTRIBUTING.md`) re-verifies all three tracks.
- If you find a number that's wrong, file an issue tagged `freshness`.

## Related artifacts

- [`VERSIONS.md`](./VERSIONS.md) — pinned tool versions; check before reasoning about a tool-specific cost.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to file a freshness issue or PR a correction.
