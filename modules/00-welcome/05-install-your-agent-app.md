---
title: "Install your agent app"
module: "00-welcome"
lesson_number: 05
est_minutes: 20
prereqs: ["04-account-creation"]
updated: "2026-08-15"
deviations: []
---

# Install your agent app

## Learning objective

By the end of this lesson, you will have installed and signed in to the agent app for the path you picked, opened it for the first time, and met the one control every action inside it runs through: the approval prompt.

## Why this matters

You picked a path and created the one account it needs in the last two lessons. This lesson is where that choice stops being a decision on paper and becomes a real, open window on your screen. For this course, the **AI coding agent** (a program that reads your project files, plans changes, and writes code on your behalf — guided by a conversation with you, [→ GLOSSARY](../../GLOSSARY.md#ai-coding-agent)) you install here isn't one tool among several — it's the only one. Every lesson from here forward happens inside this single app: reading, writing, saving, asking, approving. Get comfortable with its window now, before there's anything at stake in it.

## Core read

### One app, not a toolbox

Older courses hand you a list: install this editor, then this, then that other thing, then learn how they all talk to each other. This course doesn't. Whichever path you picked, you're installing exactly one program — a normal desktop app, the kind you already know how to download and open. That single app is where you'll talk to your agent, watch it work, and approve what it does. There's nothing else to set up underneath it.

### Claude Code desktop

If you picked the paid path, you're installing **Claude Code desktop** (an AI coding agent from Anthropic that opens in its own app window and does the writing and editing for you, [→ GLOSSARY](../../GLOSSARY.md#claude-code)).

**Step 1 — Download.** Go to [claude.com/download](https://claude.com/download) and download the installer for your computer.

<!-- SCREENSHOT SLOT: the claude.com/download page with the download button for the learner's operating system visible — captured in the user-assisted evidence pass -->

**Step 2 — Install.** Open the downloaded file and follow the on-screen install steps, the same way you'd install any app.

**Step 3 — Sign in.** Launch the app from wherever your computer keeps installed apps. Sign in with the Claude account you created in the last lesson.

<!-- SCREENSHOT SLOT: the Claude desktop app's sign-in screen — captured in the user-assisted evidence pass -->

**Step 4 — First open.** The app opens with a few tabs across the top. Click **Code** — that's the one this course uses.

<!-- SCREENSHOT SLOT: the Claude desktop app with the Code tab selected, showing the empty first-run state — captured in the user-assisted evidence pass -->

<!-- Tool claim source: code.claude.com/docs/en/desktop-quickstart, fetched 2026-08-15 (download platforms, sign-in flow, tab layout, Windows caveat, Manual-mode approval behavior); cross-checked against .planning/research/2026-08-12-desktop-agent-apps.md. -->

> **Note:** On Windows, the Code tab may ask to install one extra program the first time you point it at a real project, then ask you to restart the app. Approve both — it's a one-time step, and the app walks you through it. Macs usually don't need this extra step.

### Codex, inside the ChatGPT desktop app

If you picked the free path, you're installing the ChatGPT desktop app and using **Codex** (the AI coding agent that lives inside the ChatGPT desktop app — the free-track counterpart to Claude Code desktop, [→ GLOSSARY](../../GLOSSARY.md#codex)) from inside it.

**Step 1 — Download.** Go to [chatgpt.com/download](https://chatgpt.com/download) and download the app for your computer.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app download page — captured in the user-assisted evidence pass -->

**Step 2 — Install and sign in.** Open the downloaded file, follow the install steps, then open the app and sign in with the ChatGPT account you created in the last lesson.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app's sign-in screen — captured in the user-assisted evidence pass -->

**Step 3 — Find Codex.** Inside the app, a switch next to the message box lets you move from ordinary chat to Codex. Select it — that's the mode this course uses.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app with the Chat/Codex switch visible near the message box — captured in the user-assisted evidence pass -->

<!-- Tool claim source: chatgpt.com and help.openai.com return 403 to automated fetch (matches the 2026-08-12 research memo's note); the sign-in flow and Chat/Codex switch above are cross-checked against learn.chatgpt.com/codex/app and learn.chatgpt.com/codex/quickstart, fetched 2026-08-15, both of which loaded successfully. Free-tier and "for a limited time" wording follows .planning/research/2026-08-12-desktop-agent-apps.md, which neither of those pages contradicted or confirmed directly. -->

> **Note:** Codex is included free "for a limited time" on the Free plan. If that changes before you finish the course, the paid ChatGPT tiers keep Codex working the same way — nothing about how you use it changes, only what it costs.

> **Note:** If a button name or first-run screen looks different from what's described above, apps update between course revisions. On the course site, open the lesson chat ("Ask about this lesson") and describe what you see versus what this lesson says — it can help you reconcile the difference against this exact lesson.

### Meet the approval prompt

This is the one control that matters more than any button, tab, or menu in either app: **your agent proposes, and the app asks you before anything touches your machine.** You'll see this as a plain question — something like "allow this change?" — with an approve and a reject choice. Nothing happens to your files until you click approve.

This is true no matter which track you're on, and it's true for everything the agent does on a machine, all the way to the end of the course: it proposes, the app shows you what it wants to do, and you decide. You'll meet this control again — and go deeper on what to actually check before approving — in Module 2.

### What you will never be asked to do

Not in this lesson, not anywhere later in this course: open a terminal, type a command, or edit a file by hand. If a website, a search result, or anything outside this course tells you to do one of those things, you're off this course's path — close it and come back to these steps. Everything this course asks of you happens inside the one app window you just opened, through typing plain requests and clicking approve or reject.

### The third option: OpenCode desktop

There's a third agent app worth knowing exists: **OpenCode desktop** (a third AI-coding-agent app, free and capable, but the least beginner-friendly of the three, [→ GLOSSARY](../../GLOSSARY.md#opencode-desktop)). It's genuinely free and genuinely capable — but it's built for people comfortable finding their own way, not for a first-ever install. Its free models are trial models offered for a limited time, and they may learn from what you submit while you're using them. This course also hasn't verified how it saves your work. This course doesn't walk you through it.

## Exercise

1. Install the app for your path (Claude Code desktop, or the ChatGPT desktop app with Codex) and sign in with the account you made in the last lesson.
2. Open the tab or mode this course uses — Code for Claude Code desktop, Codex for the ChatGPT desktop app.
3. Find the approval prompt's controls. You don't need to trigger it yet — just locate the approve/reject buttons in the window so you recognize them next time.
4. Close the app, then reopen it. Confirm you're still signed in — you shouldn't have to sign in twice in one sitting.

## Checkpoint

You've got this if you can:

- Open your agent app and see that it recognizes you — your account name or picture shows up somewhere in the window.
- Say, in one sentence, what the approval prompt does before you've clicked anything on it.
- Name the one thing this course will never ask you to do (open a terminal or type a command).

## What you just did

You went from a picked path and a fresh account to an open, signed-in app window — the same window every remaining lesson in this course happens inside. Module 1 is reading and diagramming next: no more installing. When Module 2 picks the toolchain back up, it's this same app you'll be looking at, going one layer deeper on what the approval prompt is actually protecting.

## Navigation

[← Previous: Account creation](./04-account-creation.md)
[Next: Module 1 — Mental models →](../01-mental-models/README.md)
