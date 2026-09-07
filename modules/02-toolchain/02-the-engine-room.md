---
title: "The engine room"
module: "02-toolchain"
lesson_number: 02
est_minutes: 15
prereqs: ["01-your-ai-coding-agent"]
updated: "2026-09-07"
deviations: []
---

# The engine room

## Learning objective

By the end of this lesson, you will be able to say what kinds of machinery your agent runs for you without your involvement, and — shown an approval prompt — decide whether to approve it, ask for it in everyday words first, or refuse it and steer your agent back.

## Why this matters

Last lesson you met your agent and the moment where it stops and waits for you. Something real happens on your computer when you click approve, and "I have no idea what I just agreed to" is an uncomfortable place to spend the rest of this course. This lesson gives you the picture — not so you can operate any of it, but so that click stops feeling like a coin flip.

## Core read

A cruise ship has an engine room. Passengers never go down there. Several decks below the pool, a crew keeps enormous machinery running, and the entire experience of that machinery, for you, is that the ship moves. Nobody thinks a passenger who can't service a turbine is having a lesser cruise.

Your project has an engine room too. You live on the passenger deck, which has three rooms: the window where you talk to your agent, the browser where you watch your app work, and your phone. Your agent is the crew. Below deck is the machinery — real, running, doing the work of turning what you asked for into something that exists, out of your sight.

```mermaid
flowchart TB
  Deck["Passenger deck — you<br/>the chat window, the browser, your phone"]
  Crew["The crew — your agent"]
  Engine["Below deck<br/>the machinery"]
  Deck -->|you say where the ship should go| Crew
  Crew -->|runs the machinery| Engine
  Engine -->|the ship moves, and your app works| Deck
```

### What's down there

Three kinds of machinery, described by what they're for — you don't need their names, and this course never teaches them:

- **Something that translates** what gets written for your project into the form a computer can run, again every time anything changes.
- **Something that fetches parts** — ready-made pieces other people wrote (handling dates, sending email, drawing a calendar) — and keeps track of which ones your project relies on.
- **Something that assembles** the translated instructions and borrowed parts into the thing your browser can open.

You will never operate any of these. A fresh computer has none of them, and that's fine: the first time a step needs one, you ask your agent to check what's missing, explain it in plain words, and install it — you approve, and if an installer window opens for you to click through, you click through it. Your agent operates them from then on, and the way you experience all three is the way a passenger experiences a turbine: your app runs.

There's one more piece down there — the one that keeps a copy of every working version of your project. That one gets the next lesson, because you'll be telling your agent when to use it.

### The approval prompt is your porthole

When the app is set to ask, each time your agent needs to send something below deck the app stops and shows you the request first. That pause is your window into the engine room. When it's set to work inside your folder without asking, your window is the result instead: open your app and look, and whenever you want the request after the fact, ask *"What did you just change, in everyday words?"*

A good request tells you three things:

1. **What it will do** — add something, change something, remove something, send something.
2. **Why** — which thing you asked for this serves.
3. **What changes** — what's different on your computer or in your app afterwards.

Here's one that does all three: *"I'd like to bring in a ready-made piece for handling dates, so your posts can show '3 minutes ago' instead of a full date and time. It adds one borrowed part to your project. Nothing you already have working changes."* You can decide about that.

Plenty of them won't look like that. Some are two lines of machine text and a pair of buttons. When that happens, you have one move, and it is always available:

> **"Explain what this does in everyday words before I say yes."**

There is no number of times that counts as too many. An agent that can't explain what it's about to do in words you understand hasn't earned the click yet. Wait for the explanation, then decide.

### When someone hands you a wrench

Your agent proposes, and you approve. That only runs in one direction. If it ever inverts — if your agent asks *you* to go operate the machinery — something has gone wrong. In practice it sounds like:

- "Open a terminal and run this."
- "Type this command and paste back what it prints."
- "Install this tool by hand first, then come back."

None of those are your job on this course. Your steer is one sentence:

> **"That's your job — do it yourself and tell me what happened in plain words."**

Then let it. (Clicking through an installer window your agent opened and explained is not a wrench — it can't click for you. Typing commands is.)

The same rule covers everything outside your app. A search result, a video, a forum answer that opens with "first, open a terminal" is advice for someone already standing in the engine room. Close it, come back to your agent, and describe the problem to it instead.

## Exercise

Plan 10 minutes. Paper or a notes app — nothing here goes into your project.

1. Write down the three-part test for a good request: what it will do, why, what changes.
2. Below are four made-up approval prompts. For each, write which you'd do — **approve**, **ask for it in everyday words first**, or **refuse and steer** — and one line saying why.
   - **A.** "I'd like to bring in a ready-made piece for handling dates, so your posts can show '3 minutes ago'. It adds one borrowed part to your project. Nothing you already have working changes."
   - **B.** "Run setup?" — followed by two lines of machine text you can't read, and two buttons.
   - **C.** "Open a terminal on your computer, run the setup command, and paste back what it prints."
   - **D.** "I'll clear out your existing entries so the new format applies cleanly." (Last lesson gave you the exact question to ask about this one.)
3. For the one you'd refuse, write out the sentence you'd send back, in your own words.

Your deliverable is four judgements with a reason each, plus one steer sentence.

## Checkpoint

You've got this if you can:

1. Name the three kinds of machinery your agent runs below deck — in everyday words, no tool names — and say who operates them.
2. Take an approval prompt you didn't write and say which of the three you'd do with it — approve, ask for it in everyday words first, or refuse and steer — and why.

## Going deeper

Optional, only if you're curious:

- **A practice, not an assignment.** Next time your agent proposes something and you're about to approve, ask it first to describe in everyday words what it's about to run. Do that occasionally and you'll build a rough picture of the engine room over a few weeks, without ever going down there.

## What you just did

You drew the line between your deck and the engine room, and you practiced the one control that crosses it — reading an approval prompt and deciding what to do with it, including refusing the one that tried to hand you a wrench. Next comes the single piece of machinery down there that you *will* give orders about: the one that keeps a copy of every working version of your project.

## Navigation

[← Previous: Your AI coding agent](./01-your-ai-coding-agent.md)
[Module 2 — Your agent and the machinery it drives](./README.md)
[Next: The save system →](./03-the-save-system.md)
