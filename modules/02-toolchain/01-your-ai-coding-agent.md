---
title: "Your AI coding agent"
module: "02-toolchain"
lesson_number: 01
est_minutes: 15
prereqs: ["04-how-it-goes-live"]
updated: "2026-09-08"
deviations: []
---

# Your AI coding agent

## Learning objective

By the end of this lesson, you will be able to name your AI coding agent, name the app it lives in, and say — in your own words — how to spot each of the three most common ways it goes wrong, and what to say when it does.

## Why this matters

You're about to hand the writing of a real app to a program you've met exactly once — for one page, back in Module 0. You've seen the control that can stop it before it acts: the approval prompt. What you don't have yet is a read on the program itself — the three most common ways it goes wrong on you, named now so you recognize the shape the moment one shows up.

## Core read

You want to delegate the writing.

An [AI coding agent](../../GLOSSARY.md#ai-coding-agent) is the one app you installed in Module 0. Inside its window you say what you want in plain language, and it changes the files that make up your project. There's no separate editor to open first — the agent app is the whole environment.

This course teaches three of these apps, because they do the same job from different homes:

- [Claude Code desktop](../../GLOSSARY.md#claude-code) — Anthropic's agent, in its own app window. You work from its **Code** section.
- [Codex](../../GLOSSARY.md#codex) — OpenAI's agent, which you switch to inside the ChatGPT desktop app. ChatGPT is the app; Codex is the agent in it.
- [OpenCode desktop](../../GLOSSARY.md#opencode-desktop) — an open-source agent app that runs on free models provided by OpenCode.

Different window, same job: read your files, propose changes, show you the result.

A conversation with any of them has a fixed shape. You say what you want — the outcome, not the steps. The agent reads your files, works out a plan, and proposes changes. When the app is set to ask (Module 0 showed you the setting), it stops at the approval prompt and you approve or reject. When it isn't set to ask, the same control is still yours one step later: you look at the result and say what should be different. You say, it proposes, you check — that's the whole rhythm.

### When your agent gets it wrong

Three ways this goes wrong happen often enough to know on day one — each with the one thing to say.

**It makes things up.** It states a file, a fact or a feature that doesn't exist, as calmly as something true. The word people use for this is [hallucination](../../GLOSSARY.md#hallucination). How you spot it: it names a thing you never made or mentioned. What you say:

```prompt
Where did that come from?
```

**It wanders off what you asked.** Partway through a long conversation the replies are about something you didn't ask for. How you spot it: the latest reply doesn't match your last ask. What you say: restate what you want, from the top, in your own words.

**It treats a risky change like a small one.** It proposes deleting, sending or spending with the same calm as fixing a typo. How you spot it: any proposal that deletes something, sends something, or spends money. What you say, before you approve — and wait for the answer:

```prompt
What could go wrong if we do this?
```

Module 3 practises the first two on a throwaway page; Module 5 puts a real risky change in front of you.

For your agent, sounding sure and being right are two different things, and only one shows on the screen. You are the check.

## Exercise

Plan 10 minutes. No installing — you already did that in Module 0.

1. Open your agent app and get to the window this course uses.
2. In a scratch note or on paper, write one sentence naming your agent and the app it lives in.
3. Write the three ways it goes wrong, one line each, in your own words: what it looks like, and the one thing you'd say.
4. Picture a proposal from your agent that deletes, sends, or spends something. Write the exact question you'd ask before you click approve.

You don't need to keep the note. The point is writing the three spot-it, say-it lines once in your own words.

## Checkpoint

You've got this if you can:

1. Name your AI coding agent and the app it lives in.
2. Say, in your own words, how you'd spot each of the three ways it goes wrong, and what you'd say.

## Going deeper

Optional, only if you're curious — skim, don't memorize:

- Claude Code desktop: [code.claude.com/docs/en/desktop](https://code.claude.com/docs/en/desktop)
- Codex: [developers.openai.com/codex](https://developers.openai.com/codex)
- OpenCode: [opencode.ai/docs](https://opencode.ai/docs)

## What you just did

You named your agent and the app it lives in, and met the three most common ways it goes wrong — each with the one thing to say. The next lesson is what's happening when you click approve.

## Navigation

[← Previous: How it goes live](../01-mental-models/04-how-it-goes-live.md)
[Next: The engine room →](./02-the-engine-room.md)
