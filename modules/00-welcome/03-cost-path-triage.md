---
title: "Cost-path triage"
module: "00-welcome"
lesson_number: 03
est_minutes: 15
prereqs: ["01-welcome", "02-hardware-check"]
updated: "2026-05-09"
deviations: []
---

# Cost-path triage

## Learning objective

By the end of this lesson, you will have picked one of the three named cost paths in this course and you will know which AI-coding-agent account you need to create in the next lesson — and which ones you can skip.

## Why this matters

The biggest reason learners quit this kind of course mid-Module-4 is **cost shock**: the free trial runs out, a single message to the AI has just eaten 30% of a daily budget, and panic kicks in. This lesson prevents that. The triage takes ten minutes; doing it now saves you from creating two accounts, paying for a subscription you don't need, or burning through a free tier in three days because nobody told you that talking to the AI costs something every time.

## Core read

There are three honest paths through this course. They differ in friction, predictability, and how much they ask you to manage tokens by hand. Pick one *before* the next lesson, where you'll create accounts. Picking before you create accounts means you don't end up with three sign-ups for tools you'll never use.

The triage is short. Walk through the questions in order. Stop at the first path that fits.

### Question 1: Do you have ~$20/month to spend on this?

> If **yes** → consider **Path 1: Claude Code Pro**. Skip to Question 2 if you want to confirm fit; otherwise go straight to "If you picked Path 1" below.
>
> If **no** → continue to Question 3 (the free-or-careful track).

### Question 2: Do you want predictability over savings?

> If **yes** → **Path 1: Claude Code Pro** ($17/mo annual / $20/mo monthly). Predictable monthly ceiling. Recommended for most. Skip to "If you picked Path 1" below.
>
> If **no** (you want to spend less even though you have the budget) → continue to Question 3.

### Question 3: Are you willing to learn **token-discipline** (the set of habits that keep AI-coding sessions cheap on pay-per-token plans, [→ GLOSSARY](../../GLOSSARY.md#token-discipline))?

> If **no** → **Path 2: Gemini CLI free tier**. The **free tier** (the portion of a paid service you can use at no cost, capped by hours, requests, or rate limits, [→ GLOSSARY](../../GLOSSARY.md#free-tier)) is genuinely free; **rate limits** (caps on how many calls you can make to a service in a window of time, [→ GLOSSARY](../../GLOSSARY.md#rate-limit)) enforce the discipline by default. Skip to "If you picked Path 2."
>
> If **yes** → continue to Question 4.

### Question 4: Are you OK with rate limits more than with a small bill?

> If **yes** (rate limits are fine) → **Path 2: Gemini CLI free tier**. $0. Tied to Google's free-tier behavior. Phase 2 of this course re-verifies the current daily/monthly caps before lessons are authored.
>
> If **no** (you'd rather pay a little to avoid rate limits) → **Path 3: Claude Code via Anthropic API (token-careful)**. $30–$200 total over the course depending on discipline. You will use Claude Sonnet (not Opus) by default; you will reset the conversation between unrelated tasks; you will watch the running token count like a hawk. Module 3 covers the discipline in depth.

That's the whole tree. Five questions, three paths.

### If you picked Path 1: Claude Code Pro

- Account you'll need next lesson: **Anthropic** (for Claude Code) plus the universal accounts (GitHub, plus later in the course Vercel and Supabase).
- Cost expectation: ~$60 over a 3-month focused completion; ~$120 over 6 months.
- Read `BUDGET.md` § "Path 1: Claude Code Pro" for the table.

### If you picked Path 2: Gemini CLI free tier

- Account you'll need next lesson: **Google** (for the Gemini API key) plus the universal accounts (GitHub, plus later Vercel and Supabase).
- Cost expectation: **$0**.
- Read `BUDGET.md` § "Path 2: Gemini CLI free tier" for the table.

### If you picked Path 3: Claude Code via Anthropic API (token-careful)

- Account you'll need next lesson: **Anthropic** (for the API) plus the universal accounts (GitHub, plus later Vercel and Supabase).
- Cost expectation: **$30–$200 total** depending on discipline.
- Read `BUDGET.md` § "Path 3: Claude Code via Anthropic API — token-careful" for the table — and read it carefully. This path is cheap if you watch tokens and ruinous if you don't.

### What if you change your mind later?

You can switch paths mid-course. The course's loop works on both Claude Code and Gemini CLI; lessons that meaningfully diverge between them show parallel walkthroughs (starting in Module 3). The cost is creating an additional account if you switch *to* a path you didn't pick in lesson 04.

## Exercise

1. Walk the four questions above out loud.
2. Write your chosen path on a piece of paper or in a note where you'll see it tomorrow.
3. Open `BUDGET.md` and read the row for your chosen path in detail — pay attention to the per-path course-completion projection in dollars.
4. If your chosen path is Path 3, read the token-discipline subsection of `BUDGET.md` twice. The discipline is the path.

## Checkpoint

You've got this if you can:

- Name your chosen path in one phrase.
- Tell a friend how much the course will cost you, end-to-end, in dollars (range is fine for Path 3).
- Name which AI-agent account you'll create in the next lesson (Anthropic, Google, or Anthropic for the API).

## What you just did

You picked the cost path *before* you created accounts. This is the second time you've done a triage-before-install in Module 0; it'll be the last time you do it formally, but the pattern continues — you'll do something like this every time the course introduces a tool with a cost. The discipline is: ask "what does this cost me?" before "how do I install it?" Module 3 generalizes the pattern to AI prompts.

## Navigation

[← Previous: Hardware check](./02-hardware-check.md)
[Next: Account creation →](./04-account-creation.md)
