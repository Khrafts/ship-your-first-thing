# BUDGET.md — Course costs, honestly

**Last verified:** 2026-08-18
**Freshness commitment:** This file is updated whenever a cost-affecting upstream changes. Check `WHAT-CHANGED.md` for the most recent revision date. If you spot stale numbers, file an issue tagged `freshness` (see `CONTRIBUTING.md`).

## Why this file exists

Most coding courses pretend the tools are free, then learners hit a paywall partway through and quit. This file does the opposite: the two honest cost tracks this course teaches, named, with concrete numbers, so you can pick yours before you create a single account. [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md) walks you through the same triage, at the moment you need it.

## The two tracks (and a third option)

Every path through this course costs you something — money, or limits, or both. There's no free-forever option. What you're choosing between is: pay a predictable monthly amount and get a track with no built-in interruptions (Path 1), or pay nothing and accept that the free allowance can run out on a busy day, or change, without much warning (Path 2). Both are honest paths.

### Path 1: Claude Code desktop — predictable

| Item | Cost |
|---|---|
| Claude Code desktop (Pro) | $20/month billed monthly, or $17/month billed annually |
| Everything else the course needs | Free (see the module rows below) |

That $20 is the floor — there's no cheaper way to get Claude Code desktop, and no free plan includes it. What it buys: every lesson in this course, every day, with nothing that runs out partway through a workday.

**Pick Path 1 if:** you have $20/month you're comfortable spending on this course and you'd rather pay for predictability than manage a free allowance.

### Path 2: Codex, inside the ChatGPT desktop app — free to start

| Item | Cost |
|---|---|
| ChatGPT desktop app + Codex (free tier) | $0 to start — no card, no subscription |
| ChatGPT Plus (optional upgrade, same path) | Keeps Codex working the same way if the free tier ever narrows |
| Everything else the course needs | Free (see the module rows below) |

Codex is included on the free tier of ChatGPT, and that's genuinely free — this course confirmed it end-to-end before writing a single Path 2 lesson. Two honest catches. First, OpenAI's own wording says Codex is on the Free plan "for a limited time." If that changes before you finish the course, it doesn't strand you — the paid ChatGPT plans keep Codex working exactly the same way, at a monthly cost instead of free. Second, the free allowance is real, not unlimited: on a heavy day, the app may ask you to wait before you can keep going, or offer you a paid plan. The exact size of that allowance isn't published and can change, so treat "it might ask you to wait sometimes" as the honest expectation, not a specific number.

**Pick Path 2 if:** $0 matters more to you than never waiting, and you're fine with an occasional pause on a heavy day.

### Switching is cheap

Nothing in this course locks you to the path you pick today. Lessons that meaningfully differ between the two tracks show both side by side, so switching later costs you exactly one thing: creating the account you skipped the first time.

### The third option: OpenCode desktop

There's a third agent app worth knowing exists: OpenCode desktop. It's genuinely free and genuinely capable, but it's built for people comfortable finding their own way, not for a first-ever build, and it's the least polished of the three — still in beta. Cost-wise, its free models are trial models offered for a limited time, and they may learn from what you submit while you're using them; this course also hasn't verified how it saves your work, so there's no cost or safety story here as settled as Path 1 or Path 2's. This file names it so you know it exists — it isn't a path this course walks you through.

### Retired: Gemini CLI

Gemini CLI was this course's free track through 2026-08-12. It's retired — the free track is Path 2, Codex inside the ChatGPT desktop app. See [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md).

### No pay-per-use path

Earlier versions of this course had a third path: pay only for what you use, by pasting a long code that identifies your account into a separate program and watching a running total so it didn't add up. That path is retired, along with the separate program it needed to run in. Both of this course's tracks live entirely inside one app window, and neither asks you to manage a running total by hand.

## Quick decision

Two questions, in order:

| Question | Answer |
|---|---|
| Can you spend $20/month on this course? | **Yes → Path 1, Claude Code desktop.** Flat, predictable, no built-in pauses. |
| (If no) Are you OK with an occasional wait on a heavy day, in exchange for $0? | **Yes → Path 2, Codex in the ChatGPT desktop app.** Free to start, upgradeable in place if you ever need to. |

Switching later is cheap — see above. [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md) walks through this triage in more detail before you create any accounts.

## Module-by-module cost divergences

### Module 0 (Welcome) — both tracks

No AI tokens used. Free for both tracks.

### Module 1 (Mental models) — both tracks

No AI tokens used. Module 1 is reading and diagramming exercises. Free for both tracks.

### Modules 2 and 3 (Toolchain & The Loop) — both tracks

Expect token use to stay light through these modules. Neither path's per-lesson cost should differ from its baseline: Path 1 stays inside the flat $20/month ceiling, Path 2 stays inside the free ChatGPT allowance, with the same occasional-wait possibility as any other day.

> **Note:** Module 3.5 (the code-reading module that sat between Modules 3 and 4) was retired 2026-08-12, alongside the rest of the terminal-era course. What used to be "Modules 2 / 3 / 3.5" is now Modules 2 and 3.

### Module 4 (Thread project — build)

Module 4 adds two more accounts: Supabase (your database) and Vercel (where the app goes live). Both are free tier — the lessons state that both free plans cover everything this module builds. Expect this to be the course's heaviest module for AI use; the divergence between paths is the same shape as every other module, not a new one — Path 1 stays inside its flat ceiling, Path 2 stays inside its free allowance.

### Module 5 (Operating the build)

Not yet authored under the two-track rebuild — see [`README.md`](./README.md). Expect the same shape as every other module: Path 1 inside its flat $20/month ceiling, Path 2 inside its free allowance with the same occasional-wait possibility.

## Hidden costs not on this table

These are zero or near-zero today but the course names them so you're not surprised:

- **Custom domain (optional):** ~$10–15/year if you want to own a domain for your deployed thread project. Vercel offers `*.vercel.app` subdomains free.

## How this file stays accurate

- Numbers above carry a `Last verified:` date. The freshness commitment is: when an upstream changes (Claude Code Pro pricing, ChatGPT's free-tier mechanics, Supabase or Vercel free-tier terms), this file updates within 30 days, and `WHAT-CHANGED.md` records the date.
- Quarterly smoke test (per `CONTRIBUTING.md`) re-verifies both tracks.
- If you find a number that's wrong, file an issue tagged `freshness`.

## Related artifacts

- [`VERSIONS.md`](./VERSIONS.md) — pinned tool versions; check before reasoning about a tool-specific cost.
- [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) — what shifted between course revisions.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to file a freshness issue or PR a correction.
