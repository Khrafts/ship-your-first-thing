---
title: "Introducing the loop"
module: "03-the-loop"
lesson_number: 01
est_minutes: 30
prereqs: ["03-the-save-system"]
updated: "2026-09-07"
deviations: []
---

# Introducing the loop

## Learning objective

By the end of this lesson, you will be able to name the four steps of working with your agent — intent, ask, evaluate, steer — and run all four once, in your own app, on a practice page your agent builds for you.

## Why this matters

You ask for something, what comes back isn't it, you ask again in different words, and forty minutes later you have a strong feeling that this isn't working and no idea which part to change. Naming the four parts turns that feeling into a decision. The window will be redesigned and the buttons will move, and the four steps will still be the four steps.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

Every session with your agent moves through the same four steps, in the same order:

1. **Intent** — know what you want before you type.
2. **Ask** — say it, in plain words. A specific ask produces specific work; a vague one produces vague work.
3. **Evaluate** — look at the page and decide whether it matches what you wanted.
4. **Steer** — say what you saw and what should be different.

Your agent writes with the same easy confidence whether it is right or wrong, so a confident reply is not evidence of a correct one. Lesson 3 shows you how to catch that.

### Setup — your agent builds the practice page

Ask your agent for something to practise on — a separate page from the checklist you built in Module 0, so nothing you use is underneath the mistakes this module makes on purpose. The exchanges in this module are from one real Claude Code desktop run. If you use the ChatGPT app with Codex, send the same sentences and check the same page; its replies were not recorded for this course. Your agent's exact words will differ, and that is normal.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Create a folder called `loop-practice` somewhere easy to find, with one page in it called `index.html` that shows my name and a one-line tagline, and open it in my browser.
> **The agent:** I'll put a folder called `loop-practice` on your Desktop, with one page in it called `index.html` showing your name above a one-line tagline.
> **The app asks:** Allow creating `loop-practice/index.html`? — you approve.
> **The agent:** Written. Now I'll open it in your browser.
> **The app asks:** Allow opening the page in your browser? — you approve.
> **The agent:** Done — it should be up in your browser now. I can't see your screen, so confirm it rendered. […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

If your app is set to work inside the folder without asking, you won't see the pause — the page, not the pause, is what you check. If your agent guessed your name or tagline wrong, tell it what they should say.

### 1. Intent

What do you actually want? For this lesson: **add today's date below the tagline.** A concrete change in a concrete place — not "make the page nicer", which hands your agent the job of guessing. If you can't picture the finished thing well enough to know whether you got it, you can't check what comes back.

### 2. Ask

Into the chat window:

> Add today's date below the tagline.

That's the whole ask. It names the outcome; the how belongs to your agent.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Add today's date below the tagline.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done — the date now sits directly under the tagline, above the line at the bottom, in the same muted grey as the small text so it reads as one tier down. One thing to be aware of: it's written in as fixed text, so it will still say 17 August 2026 tomorrow. […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

### 3. Evaluate

**Refresh the page in your browser.** Does today's date sit below the tagline? If yes, done. If no, you steer. The page is what you check — reading the code is your agent's job, not yours.

Your agent's own words are the second thing to read. Above, it said something the page can't show you: the date is fixed text, so it will still say the same thing next week. On this throwaway page that isn't worth fixing; on something you cared about, it would be your next ask.

### 4. Steer

When the page isn't right, say what you saw, then what should be different:

- "The date appeared above the tagline — it should be below."
- "The date is showing yesterday's — it should be today's."
- "You added the date, but the tagline changed too. Put the tagline back the way it was."

No apology, no explanation of how, no starting over.

## Exercise

Run the whole thing yourself, in your own app. Plan twenty minutes.

1. **Open your agent app** and get to the tab or mode this course uses — **Code** for Claude Code desktop, Codex for the ChatGPT desktop app.
2. **Run the setup ask.** Type: *"Create a folder called `loop-practice` somewhere easy to find, with one page in it called `index.html` that shows my name and a one-line tagline, and open it in my browser."* This page is one file and needs nothing installed. Approve what's about making this folder and page or opening it in your browser; ask "what does this do, and why do you need it?" about anything else — installing something, connecting an account, reaching the internet. Leave the browser tab open; you'll come back to it all module.
3. **If the name or tagline is wrong,** tell it what they should say.
4. **Set your intent.** Say it out loud or write it down: add today's date below the tagline.
5. **Ask.** Type: *"Add today's date below the tagline."* Nothing else.
6. **Evaluate.** Refresh the browser tab. Is today's date below the tagline? Read what your agent said, too.
7. **Steer only if you need to.** One short follow-up naming what you saw and what should be different. Refresh again.
8. **Save it.** This is a new folder on a computer that may have nothing set up for saving yet, so check first.

   > Before you save, say: *"Before you save, check whether this computer has everything you need to save working versions. If something is missing, tell me in plain words what it is and why you need it, then help me install it. Tell me before anything needs my approval, and tell me when it's ready."* Approve what it explains is about saving in this folder; if it opens an installer for you to click through, that's normal — it can't click for you. If that installer asks for your computer's administrator password, type it into the installer's own window, never into the chat. It may ask for a name and an email to label your saves: give the same email you used for GitHub. If it says an install didn't work, don't repeat it blindly — say: *"The install didn't work. Tell me in plain words what happened and what you'd try next."* If two tries don't land, stop here: your page is still in its folder, and you can come back to this step in a fresh conversation. Then say: *"Save this as a working version, with a one-line note about what changed."*

   The note is that the practice page now shows the date. If it offers to put a copy online, "not yet" — this page is throwaway. Then ask it to confirm the save.

Then write three sentences anywhere you like:

- What shape did your agent's first response take — a plan, a question, or straight to work?
- Did you need to steer? If so, what did you say?
- One thing about your agent's behaviour that surprised you.

Your deliverable is a browser tab showing your name, your tagline, and today's date under it — plus a saved working version and three sentences.

## Checkpoint

You've got this if you can:

1. Name the four steps, in order, without looking at this lesson.
2. Say whether your own run needed a steer, and what the evidence was either way.

## What you just did

You ran the four steps once, on a page that didn't exist until you asked for it. Lesson 2 goes deeper on the ask, Lesson 3 on checking, Lesson 4 on steering — all on this same page.

## Navigation

[← Previous: The save system](../02-toolchain/03-the-save-system.md)
[Next: Plan before you build →](./02-planning-vs-execution.md)
