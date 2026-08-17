---
title: "Introducing the loop"
module: "03-the-loop"
lesson_number: 01
est_minutes: 45
prereqs: ["03-the-save-system"]
updated: "2026-08-17"
deviations: []
---

# Introducing the loop

## Learning objective

By the end of this lesson, you will be able to name the four steps of the AI-coding loop (intent → ask → evaluate → steer) and run one complete iteration of them in your agent app, on a practice page your agent builds for you.

## Why this matters

You have an agent, you know what it runs for you below deck, and you know the sentence that saves your work. What you don't have yet is a way to talk about a session that is going badly — and sessions go badly routinely. You ask for something, what comes back isn't it, you ask again in slightly different words, and forty minutes later you have a strong feeling that this isn't working and no idea which part to change. Naming the four parts is what turns that feeling into a decision. The names outlive the app, too: the window will be redesigned, the buttons will move, and the four steps will still be the four steps.

> **Following along:** Run this lesson in the app you picked in Module 0. Every exchange is shown for both apps; you only run your own. The panels show the shape of each exchange — your agent's exact words will differ, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

AI coding agents look like magic for about an hour, and then they look like something better: predictable. Every session you will ever run with one moves through the same four steps, in the same order, however big or small the job is.

**intent** (knowing what you are trying to build before you start asking, [→ GLOSSARY](../../GLOSSARY.md#intent)). **ask** (writing a specific request the agent can act on, [→ GLOSSARY](../../GLOSSARY.md#ask)). **evaluate** (looking at what came back and deciding whether it matches your intent, [→ GLOSSARY](../../GLOSSARY.md#evaluate)). **steer** (course-correcting when what came back is off, [→ GLOSSARY](../../GLOSSARY.md#steer)). Together, the four-step shape is the **agent loop** (the cycle of intent → ask → evaluate → steer, repeated until the job is done, [→ GLOSSARY](../../GLOSSARY.md#agent-loop)). Module 1 taught you the shape of software; Module 2 taught you the shape of your agent. This module teaches you the shape of the work itself.

The text you type at each ask is a **prompt** (the words you send your agent describing what you want, [→ GLOSSARY](../../GLOSSARY.md#prompt)). A specific one produces specific work; a vague one produces vague work. The loop is the discipline of getting from vague to specific without starting over every time.

Here is what a steer sounds like, so you know the shape before you need it. Suppose you asked for today's date below the tagline and it landed above it instead. You would say: "The date appeared above the tagline — it should be below." That is the whole move. Name what you saw, name what should be different. This lesson's example is small enough that you will probably not need to steer at all; the sample is there so the fourth step isn't a stranger when you do.

One thing to carry through all four steps, because it changes how you read everything your agent tells you:

> **Heads up — you'll meet this again.** Your agent writes with the same easy confidence whether it is right or wrong, so a confident answer is not evidence of a correct one. The smell-test for catching it lives in Module 3 Lesson 3 (`03-reading-plans-recognizing-wrong`); for now, just notice the pattern.

### Setup — your agent builds the practice page

There is nothing to download for this module. The first thing you do is ask your agent to make you something to practice on — which is also your first look at the whole loop, end to end, on something real. Here is the exchange, in both apps. The sentence you type is the same either way, and you can use it word for word.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Create a folder called `loop-practice` somewhere easy to find, with one page in it called `index.html` that shows my name and a one-line tagline, and open it in my browser.
> **The agent:** I'll put a folder called `loop-practice` on your Desktop, with one page in it called `index.html` showing your name above a one-line tagline.
> **The app asks:** Allow creating `loop-practice/index.html`? — you approve.
> **The agent:** Written. Now I'll open it in your browser.
> **The app asks:** Allow opening the page in your browser? — you approve.
> **The agent:** Done — it should be up in your browser now. I can't see your screen, so confirm it rendered. Two things I filled in for you: your name, which I took from your computer's saved settings since you didn't give me one, and the tagline — "Building things that ship, and teaching other people to ship theirs." That one is my invention, not yours. Tell me what either should say and I'll change it.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Create a folder called `loop-practice` somewhere easy to find, with one page in it called `index.html` that shows my name and a one-line tagline, and open it in my browser.
> **The agent:** Here's the plan: a `loop-practice` folder in an easy place, one page inside it called `index.html` with your name as the heading and a one-line tagline under it, then I'll open it in your browser. You didn't give me a tagline, so I'll put something in as a placeholder and you can tell me what it should say.
> **The app asks:** Codex wants to make changes to your files — approve? — you approve.
> **The agent:** Made it and opened it. Have a look and tell me what the name and the tagline should actually say.

Two apps, one sentence from you, and something exists that didn't exist before. Both of them did the same three things: said what they were going to do, stopped and waited for your approval, then reported back. That pause is the approval prompt from Module 2, and this is it happening on something real for the first time.

Notice what your surfaces are here, because they don't change for the rest of the course. You have the chat window, where you say what you want and read what your agent says back. And you have a browser tab, where you look at the thing itself. That's it. There is no third place you're supposed to be looking, and nothing on this page is yours to open up and read.

If your agent guessed your name or your tagline wrong, tell it what they should say and let it fix them. That exchange — you noticed something was off, you said what should be different, it changed — is the loop, already, on your first try.

### 1. intent

Before you type anything: what do you actually want?

Your intent for this lesson is one sentence: **add today's date below the tagline.**

Look at the shape of that sentence. It names a concrete change — today's date — in a concrete place — below the tagline. It isn't "make the page nicer." It isn't "add something dynamic." Those are wishes, and a wish hands the agent the job of guessing what you meant, which it will do confidently and often wrongly.

The work of the intent step happens entirely in your head, before you open your mouth: deciding what *done* looks like specifically enough that you would recognize it. If you can't picture the finished thing well enough to know whether you got it, you can't evaluate what comes back, and without evaluation the rest of the loop is just hoping.

It is also the cheapest step by a wide margin. Two minutes here saves twenty minutes of steering later.

### 2. ask

Now you type. Into the chat window in your agent app, in your own words:

> Add today's date below the tagline.

That's the whole prompt. Notice what it doesn't contain: nothing about which part of the page to change, nothing about how to work out what today is, nothing about what the date should look like. Those are engine-room decisions, and you have an agent precisely so you don't make them. Your ask names the outcome; the how belongs to the agent.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Add today's date below the tagline.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done — the date now sits directly under the tagline, above the line at the bottom, in the same muted grey as the small text so it reads as one tier down. One thing to be aware of: it's written in as fixed text, so it will still say 17 August 2026 tomorrow. If you want it to show the real current date every time the page is opened, say the word and I'll change it to do that.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Add today's date below the tagline.
> **The agent:** I'll add today's date as a line under the tagline, styled to sit quietly against the rest of the page.
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Added. Refresh the page and today's date should be under the tagline.

The two apps shaped the same ask differently, and that is worth watching for rather than worrying about. One volunteered a trade-off it had made and offered you a different version; the other did the job and told you to go look. Neither is wrong, and the difference isn't a ranking — it's the personality of the app around the agent. The loop underneath is identical on both.

### 3. evaluate

There is one surface for this step, and it is the same surface every time: **refresh the page in your browser.**

Then answer one question, the one you set in the intent step: does today's date sit below the tagline?

If yes, the loop closed in one iteration. If no, you steer. That is the whole of the evaluate step at this size, and the reason it's this simple is a rule that holds for the rest of the course: **the running page is the ground truth, and reading the code to check your agent's work is your agent's job, not yours.** You are not missing a step by not looking. There is no hidden layer of checking that a more advanced learner would be doing here.

The agent's own words are your second signal, and they carry things the page can't show you. In the exchange above, the agent said something you would never have discovered by looking: the date is written in as fixed text, so it will still say the same thing next week. The page was right for today and would quietly be wrong tomorrow. That's why you read what your agent says as well as looking, and why "it looks fine" is not the same as "I checked."

On the practice page that trade-off costs nothing and isn't worth fixing — this page gets thrown away at the end of the module. On something you cared about, it would be a steer. Lesson 3 turns this step into five specific things to look for.

### 4. steer

When evaluate says no, you steer. A steer is one more ask, informed by what just came back:

- "The date appeared above the tagline — it should be below."
- "The date is showing yesterday's — it should be today's."
- "You added the date, but the tagline changed too. Put the tagline back the way it was."

Each of those does the same two things: names what you saw, names what should be different. It doesn't apologize, it doesn't explain how to do it, and it doesn't start over. Steering is intent → ask again, with what just happened as new context.

That's the loop end to end: four steps, one iteration. Most real work chains several — ask, look, small steer, look again, done. Lesson 4 is where steering gets its own hour, including the harder case: what to do when steering itself stops working.

## Exercise

Run the whole thing yourself, in your own app. Plan twenty to twenty-five minutes.

1. **Open your agent app** and get to the tab or mode this course uses — Code for Claude Code desktop, Codex for the ChatGPT desktop app.
2. **Run the setup ask.** Type: *"Create a folder called `loop-practice` somewhere easy to find, with one page in it called `index.html` that shows my name and a one-line tagline, and open it in my browser."* Read each approval prompt before you approve it — this is the first time it's real. Everything it asks for on this step is safe to approve. When the page opens in your browser, leave that tab open; you'll come back to it several times this module.
3. **If the name or tagline is wrong,** tell it what they should say and let it fix them.
4. **Set your intent.** Say it out loud or write it down: add today's date below the tagline.
5. **Ask.** Type: *"Add today's date below the tagline."* Nothing else — resist the urge to explain how.
6. **Evaluate.** Switch to the browser tab and refresh. Is today's date below the tagline? Read what your agent said, too, in case it told you something the page doesn't show.
7. **Steer only if you need to.** One short follow-up naming what you saw and what should be different. Then refresh again.
8. **Save it.** Say the sentence from Module 2: *"Save this as a working version, with a one-line note about what changed"* — the note being that the practice page now shows the date. This is the first time you've said it to something real, so your agent may need to do a little setup first and show you an approval prompt or two along the way. Approve them and let it work.

Then write three sentences anywhere you like — a note on your phone, a scrap of paper, a document on your computer:

- What shape did your agent's first response take? Did it lay out a plan first, ask you something, or go straight to doing it?
- Did you need to steer? If so, what did you say?
- What is one thing about your agent's behavior that surprised you?

Your deliverable is a browser tab showing your name, your tagline, and today's date under it — plus a saved working version and three sentences.

## Checkpoint

You've got this if you can:

1. Name the four loop steps, in order, without looking at this lesson.
2. Say whether your own iteration needed a steer, and what the evidence was either way.

## Going deeper

Optional, only if you're curious:

- **The ask step gets sharper next.** Lesson 2 splits asks into two kinds — the ones where you want a plan and no changes yet, and the ones where you want the work done — and adds the move for when a conversation has been going long enough to get muddy.
- **The evaluate step gets five patterns.** Lesson 3 turns "does it look right?" into five specific things to check, including the case where your agent invents something out of nothing and hands it to you with a straight face.
- **The steer step gets an anatomy.** Lesson 4 breaks a good steer into three parts, shows you what it looks like when your agent does far more than you asked, and names the point where starting a fresh conversation beats steering again.

## Loop check

> **Loop check — intent.** This lesson names all four steps, but the one it reinforces is *intent* — because the other three are all measured against it. You ran an iteration with a sharp intent ("add today's date below the tagline"), and that sharpness is what made the evaluate step a one-second question instead of a judgement call. The loop step this lesson reinforces is **intent**: knowing what you're trying to build before you start asking.

## What you just did

You met the loop end to end and ran one full iteration of it — on a page that didn't exist until you asked for it, in an app that stopped and checked with you before touching anything. You also said the save sentence for the first time on something real. The next three lessons take the same page and go one step deeper each time: Lesson 2 on the ask, Lesson 3 on evaluate, Lesson 4 on steer. By the end of the module you'll have run four iterations on the same page and seen every step from the inside.

## Navigation

[← Previous: The save system](../02-toolchain/03-the-save-system.md)
[Next: Planning vs execution conversations →](./02-planning-vs-execution.md)
