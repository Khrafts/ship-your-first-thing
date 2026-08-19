---
title: "Your AI coding agent"
module: "02-toolchain"
lesson_number: 01
est_minutes: 25
prereqs: ["04-how-it-goes-live"]
updated: "2026-08-15"
deviations: []
---

# Your AI coding agent

## Learning objective

By the end of this lesson, you will be able to name your AI coding agent, name the app it lives in, and state — in your own words — the smell-test for each of its three most common failure modes.

## Why this matters

You're about to hand the writing of a real app to a program you've barely met. You already know what a deployed app is made of — code, database, who can do what, how it goes live — and you've seen the one control that guards everything this program does: the approval prompt. What you don't have yet is a read on the program itself — the three most common ways it can go wrong on you, named now so you recognize the shape the moment one shows up.

## Core read

You want to delegate the writing.

An **AI coding agent** (a program that reads your project files, plans changes, and writes code on your behalf — guided by a conversation with you, [→ GLOSSARY](../../GLOSSARY.md#ai-coding-agent)) is not a website you visit or a plugin bolted onto something else. It's the one app you installed in Module 0 — a normal desktop window, the kind you already knew how to download and open before this course. Inside that window you talk to it in plain language, the same way you'd write a message to someone, and it does the work of changing the files that make up your project. It doesn't wait for you to open a code editor first, because there isn't one — the agent app is the whole environment. It is where you'll spend nearly every remaining hour of this course.

This course teaches two of these apps, side by side, because they do the same job from different homes. If you picked the paid path, your agent is **Claude Code desktop** (Anthropic's AI coding agent, run from its own desktop app window; this course's paid track, [→ GLOSSARY](../../GLOSSARY.md#claude-code)) — you open it directly and work from its Code tab. If you picked the free path, your agent is **Codex** (the AI coding agent that lives inside the ChatGPT desktop app — the free-track counterpart to Claude Code desktop, [→ GLOSSARY](../../GLOSSARY.md#codex)) — you open the ChatGPT desktop app and switch into it from the message box. Different window, different name, same job: read your files, propose changes, wait for you to say yes. Every lesson from here shows both side by side, because the skill you're learning is the same on either one — only the app around it changes.

A third app is worth knowing exists, even though this course doesn't teach it: **OpenCode desktop** (a third AI-coding-agent app, free and capable, but the least user-friendly of the three, [→ GLOSSARY](../../GLOSSARY.md#opencode-desktop)). It's genuinely free and genuinely capable, but it's built for people comfortable finding their own way — its free models are limited-time trial models that may learn from what you submit, this course hasn't verified how it saves your work, and it's the least polished of the three, still in beta. If someone mentions it, now you know what it is. This course sticks with the two apps above.

A conversation with either app has a fixed shape. You say what you want, in your own words — the outcome, not the steps. The agent reads your files, works out a plan, and proposes changes. Then the app stops and asks you: the approval prompt you met in Module 0, the same "allow this change?" question, every time, for anything that touches your machine. You click approve, and the change happens. You click reject, and it doesn't. That three-beat rhythm — you say, it proposes, you approve — is the whole shape of working with an agent. The next lesson in this module opens that same approval prompt back up and goes deeper on what it's actually protecting.

### When your agent gets it wrong

Three ways this goes sideways happen often enough, and matter enough, that this course names them now — each with the one thing to do about it.

**Hallucination** (the agent states something that doesn't exist — a file, a fact, a feature — with the same confidence as something true, [→ GLOSSARY](../../GLOSSARY.md#hallucination)) shows up as a detail you never gave it. Smell-test: it names a thing you never made or mentioned. Ask it, plainly: "where did that come from?"

**Drift** (the work slides away from what you actually asked for, usually partway through a long session, [→ GLOSSARY](../../GLOSSARY.md#drift)) shows up as an answer to a question you didn't ask. Smell-test: the latest reply is about something you didn't ask for. Restate what you want, from the top, in your own words.

**Risk-blindness** (the agent proposes something that can't be undone with the same calm as a small fix, [→ GLOSSARY](../../GLOSSARY.md#risk-blindness)) shows up right at the approval prompt. Smell-test: any proposal that deletes something, sends something, or spends money gets one question first — "what could go wrong if we do this?" — and you wait for the answer before you approve.

These three are not the whole list — they're the three worth knowing on day one. Module 3 goes deeper on hallucination and on drift; for risk-blindness, Module 5 puts you in front of a real one.

None of this makes your agent a search engine or a mind reader. It doesn't know your actual preferences unless you've told it. It isn't always right, and it doesn't know when it's wrong — confidence and correctness are two different things for it, and only one of them shows up on the screen. That's the whole reason this course spends an entire module, right after this one, on the skill of steering: noticing when the agent's output doesn't match what you asked for, and knowing what to do about it. You just met the three earliest, most common ways it goes sideways. Module 3 teaches the skill that catches all of them.

## Exercise

Plan 10 to 15 minutes. No installing — you already did that in Module 0.

1. Open your agent app (the one you installed in Module 0) and get to the window this course uses — the Code tab in Claude Code desktop, or the Codex switch in the ChatGPT desktop app.
2. In a scratch note — any plain-text file, a notes app, or paper — write one sentence naming your agent and the app it lives in.
3. Write the three failure modes from this lesson, one line each, in your own words: what it looks like, and the one thing you'd do about it.
4. Picture a proposal from your agent that deletes, sends, or spends something. Write the exact question you'd ask before you click approve.
5. You don't need to keep the note afterward — the point is writing the three smell-tests once in your own words, not the file itself.

## Checkpoint

You've got this if you can:

1. Name your AI coding agent and the app it lives in.
2. Say, in your own words, the smell-test for hallucination, for drift, and for risk-blindness.

## Going deeper

Optional, only if you're curious:

- **Claude Code desktop's own documentation**, at `https://code.claude.com/docs`. Skim the quickstart; you don't need to memorize anything — the next lesson covers what you actually need.
- **Codex's documentation inside ChatGPT's help site**, at `https://learn.chatgpt.com/codex`. Same advice: skim, don't memorize.

## Loop check

> **Loop check — intent.** Knowing which of the three smell-tests you're watching for — before you say what you want — changes the *intent* you bring into every session with your agent, all the way through this course. The loop itself lands in Module 3; the loop step this lesson reinforces is **intent**: knowing what could go wrong before you ask for anything.

## What you just did

You named your agent, named the app it lives in, and met the three most common ways it can go sideways — each with the one question or move that catches it. The next lesson in this module opens the app back up and goes deeper on what's actually happening when you click approve.

## Navigation

[← Previous: How it goes live](../01-mental-models/04-how-it-goes-live.md)
[Next: The engine room →](./02-the-engine-room.md)
