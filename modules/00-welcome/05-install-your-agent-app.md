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

By the end of this lesson, you will have installed and signed in to the agent app for the path you picked, opened it for the first time, and met the approval prompt — and the setting that decides how often you see it.

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

<!-- Tool claim source: code.claude.com/docs/en/desktop-quickstart, fetched 2026-08-15 (Windows requires installing `git` separately for local sessions; most Macs already have it); download page `git-scm.com/downloads/win`, per the 2026-08-12 desktop-agent research memo. -->

> **Note:** On Windows, one extra step comes first: download and install **git** (part of the save system your agent operates for you later in this course — you install it once now and never open it yourself, [→ GLOSSARY](../../GLOSSARY.md#git)) from [git-scm.com/downloads/win](https://git-scm.com/downloads/win) — the same download-and-run-the-installer step you just did for Claude Code desktop — then restart Claude Code desktop. Most Macs already have it, so this step is Windows-only.

### Codex, inside the ChatGPT desktop app

If you picked the free path, you're installing the ChatGPT desktop app and using **Codex** (the AI coding agent that lives inside the ChatGPT desktop app — the free-track counterpart to Claude Code desktop, [→ GLOSSARY](../../GLOSSARY.md#codex)) from inside it.

**Step 1 — Download.** Go to [chatgpt.com/download](https://chatgpt.com/download) and download the app for your computer.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app download page — captured in the user-assisted evidence pass -->

**Step 2 — Install and sign in.** Open the downloaded file, follow the install steps, then open the app and sign in with the ChatGPT account you created in the last lesson.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app's sign-in screen — captured in the user-assisted evidence pass -->

**Step 3 — Find Codex.** Inside the app, a switch next to the message box lets you move from ordinary chat to Codex. Select it — that's the mode this course uses.

<!-- SCREENSHOT SLOT: the ChatGPT desktop app with the Chat/Codex switch visible near the message box — captured in the user-assisted evidence pass -->

<!-- Tool claim source: chatgpt.com and help.openai.com return 403 to automated fetch (matches the 2026-08-12 research memo's note); the sign-in flow and Chat/Codex switch above are cross-checked against learn.chatgpt.com/codex/app and learn.chatgpt.com/codex/quickstart, fetched 2026-08-15, both of which loaded successfully. Free-tier and "for a limited time" wording follows the 2026-08-12 desktop-agent research memo, which neither of those pages contradicted or confirmed directly. -->

> **Note:** Codex is included free "for a limited time" on the Free plan. If that changes before you finish the course, the paid ChatGPT tiers keep Codex working the same way — nothing about how you use it changes, only what it costs.

> **Note:** If a button name or first-run screen looks different from what's described above, apps update between course revisions. On the course site, open the lesson chat ("Ask about this lesson") and describe what you see versus what this lesson says — it can help you reconcile the difference against this exact lesson.

### Meet the approval prompt

This is the control that matters more than any button, tab, or menu in either app: **your agent proposes a change, and the app can stop and ask you before it happens.** You'll see this as a plain question — something like "allow this change?" — with an approve and a reject choice.

One honest thing to know before you rely on it: **how often the app asks is a setting, not a guarantee, and the two apps set it differently.** Claude Code desktop has a selector next to the send button. On the plan this course uses it starts in a mode called **Auto**, where the app makes changes on its own while a background check watches for risky ones; switching that selector to **Manual** makes it ask before each change, and that's the setting this course assumes. The ChatGPT desktop app with Codex has a permissions control below the message box; its usual setting lets Codex work inside the one folder you've chosen without asking, and asks before it reaches outside that folder or out to the internet. Neither is wrong. What matters is that you know which one you're looking at, so silence never reads as "nothing happened."

Either way, your control doesn't depend on the question appearing. Whether the app asked or not, you look at the result and say what should be different — the next lesson has you do exactly that on a page of your own. Module 2 goes deeper on what to check when the app does ask.

<!-- Tool claim source: code.claude.com/docs/en/desktop ("Choose a permission mode" — Manual: "Claude asks before editing files or running commands"; Auto: "executes all actions with background safety checks"; "mode selector next to the send button") and code.claude.com/docs/en/permission-modes ("On Pro, Max, and Team plans, the built-in starting permission mode is auto mode"), fetched 2026-09-07. learn.chatgpt.com/docs/agent-approvals-security ("Ask for approval … lets ChatGPT work within the current workspace and pauses before reaching beyond that boundary"; the default preset "can read files, make edits, and run commands in the workspace"; "the permissions control below the composer"), fetched 2026-09-07. This replaced an earlier claim that every action in both apps waits for approval, which the project could not evidence and which the docs contradict. -->

### What you will never be asked to do

Not in this lesson, not anywhere later in this course: open a terminal, type a command, or edit a file by hand. If a website, a search result, or anything outside this course tells you to do one of those things, you're off this course's path — close it and come back to these steps. Everything this course asks of you happens inside the one app window you just opened, through typing plain requests and clicking approve or reject.

### The third option: OpenCode desktop

There's a third agent app worth knowing exists: **OpenCode desktop** (a third AI-coding-agent app, free and capable, but the least user-friendly of the three, [→ GLOSSARY](../../GLOSSARY.md#opencode-desktop)). It's genuinely free and genuinely capable — but it's built for people comfortable finding their own way, not for a first-ever install. Its free models are trial models offered for a limited time, and they may learn from what you submit while you're using them. This course also hasn't verified how it saves your work. And it's the least polished of the three — still in beta. This course doesn't walk you through it.

## Exercise

1. Install the app for your path (Claude Code desktop, or the ChatGPT desktop app with Codex) and sign in with the account you made in the last lesson.
2. Open the tab or mode this course uses — Code for Claude Code desktop, Codex for the ChatGPT desktop app.
3. Find the setting that controls how often the app asks: the selector next to the send button in Claude Code desktop (set it to Manual), or the permissions control below the message box in the ChatGPT desktop app (leave it as it is — read what it says). You don't need to trigger an approval yet; you only need to know where the setting lives.
4. Close the app, then reopen it. Confirm you're still signed in — you shouldn't have to sign in twice in one sitting.

## Checkpoint

You've got this if you can:

- Open your agent app and see that it recognizes you — your account name or picture shows up somewhere in the window.
- Say, in one sentence, what the approval prompt does — and why silence from it doesn't mean nothing happened.
- Name the one thing this course will never ask you to do (open a terminal or type a command).

## What you just did

You went from a picked path and a fresh account to an open, signed-in app window — the same window every remaining lesson in this course happens inside. Nothing more to install. The next lesson is the reason you installed it: in one sitting, your agent builds a page that's yours, and you check it, change it, and save it.

## Navigation

[← Previous: Account creation](./04-account-creation.md)
[Next: Build your first thing →](./06-build-your-first-thing.md)
