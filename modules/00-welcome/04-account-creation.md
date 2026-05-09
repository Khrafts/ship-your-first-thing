---
title: "Account creation"
module: "00-welcome"
lesson_number: 04
est_minutes: 20
prereqs: ["03-cost-path-triage"]
updated: "2026-05-08"
deviations: []
---

# Account creation

## Learning objective

By the end of this lesson, you will have created exactly the accounts your chosen cost path requires — and not the ones it doesn't.

## Why this matters

You did the triage in the last lesson. This lesson is the payoff: create three to four accounts, no more. Most courses ask you to set up six accounts before you've earned the cognitive credit to know what they're for. This one creates accounts only as you need them; the AI-agent account matches the path you picked; the rest of the build accounts (Vercel, Supabase) wait until Phase 3 when the thread project actually starts.

## Core read

You'll create accounts in this order: GitHub first (everyone needs it), then your chosen AI-agent account.

**Account 1: GitHub.**
Everyone needs GitHub — this is where the course lives, where Codespaces runs, and where you'll push your work. Sign up at [github.com](https://github.com) with an email you'll keep using. Use a real-looking username; this is your public identity in OSS.

If GitHub asks for email verification or phone verification and the message doesn't arrive: see `COMMON-ISSUES.md` § "GitHub asked me to verify my account and now I'm locked out." Don't create a second account while you wait for verification.

**Account 2: Your AI-agent account, based on the path you picked.**

> If you picked **Path 1 (Claude Code Pro)** or **Path 3 (Claude Code via Anthropic API)**:
> Create an Anthropic account at [console.anthropic.com](https://console.anthropic.com).
> - Path 1 learners: subscribe to Claude Code Pro. Annual is cheaper if you're committed to the course; monthly is fine if you want to test the waters.
> - Path 3 learners: do **not** subscribe to Pro. Add a small amount of API credit (start with $10–$20) and bookmark the usage dashboard. You'll need it.

> If you picked **Path 2 (Gemini CLI free tier)**:
> Create or sign into a Google account. Then visit [ai.google.dev](https://ai.google.dev) (the Google AI Studio surface) and generate a Gemini API key. Save the key in a place you'll remember; you'll plug it into Gemini CLI in Phase 2.

**Accounts you do NOT need yet:**

- **Vercel** and **Supabase** are not needed until Phase 3 (the thread project). Create them when you start Phase 3, not now. If you create them now, the trial timers start counting against you.
- **OpenAI / OpenRouter / etc.** — none of the three paths require these.

That's it. One or two accounts, depending on path.

### What "save the key" means

For the Gemini CLI path: when you generate an API key, you'll see a long string starting with `AI...`. Treat it like a password. Don't paste it into a chat. Don't commit it to a public repo. The course will teach you environment-variable hygiene in Module 4 (`Pitfall 12: NEXT_PUBLIC leaks` is real and named); for now, save the key in your password manager.

For the Anthropic API path: same hygiene applies. The key looks like `sk-ant-...`.

### Why we don't make you create Supabase / Vercel yet

Supabase and Vercel free tiers are real and generous, but they have inactivity timers. Creating them at the start of Module 0 means by the time you reach Phase 3, the timer may have already started counting and your free Supabase project may be paused. Better to create them in Phase 3 when you'll use them within hours.

## Exercise

1. Create your GitHub account (if you don't already have one). Confirm you can sign in.
2. Create your AI-agent account based on your path.
3. If you're on Path 2 (Gemini CLI), generate and save your API key.
4. If you're on Path 1 (Claude Code Pro), subscribe.
5. If you're on Path 3 (Claude Code API), add $10–$20 of API credit. Do not subscribe to Pro.

## Checkpoint

You've got this if you can:

- Sign into your GitHub account.
- Sign into your AI-agent account (Anthropic or Google).
- Tell a friend exactly which accounts you skipped and why ("I'm not creating Vercel/Supabase yet because Phase 3 is when the timers matter").

## What you just did

You created exactly the accounts you need, no more. The pattern — create-as-you-need, not create-everything-up-front — is the same pattern that prevents your free Codespaces hours from running out, your Supabase project from auto-pausing, and your inbox from filling with marketing emails from tools you'll never use again.

## Navigation

[← Previous: Cost-path triage](./03-cost-path-triage.md)
[Next: Codespaces walkthrough →](./05-codespaces-walkthrough.md)
