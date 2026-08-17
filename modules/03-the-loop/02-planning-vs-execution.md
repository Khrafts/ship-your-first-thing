---
title: "Planning vs execution conversations"
module: "03-the-loop"
lesson_number: 02
est_minutes: 50
prereqs: ["01-introducing-the-loop"]
updated: "2026-08-17"
deviations: []
---

# Planning vs execution conversations

## Learning objective

By the end of this lesson, you will be able to tell a planning ask from an execution ask, and know when — and how — to start a fresh conversation.

## Why this matters

Lesson 1's iteration was one sentence long and it landed on the first try. Plenty of them do not. You say what you want, what comes back is nearly right, you say it again with more words, and the reply after that is about something you never mentioned. An hour in, you have a page you like less than the one you started with and no idea which turn was the wrong one. Two moves account for most of that hour. The first is asking for the plan before asking for the work, so a misunderstanding costs you thirty seconds instead of thirty minutes. The second is knowing when a conversation is past saving, and starting a new one on purpose instead of pushing harder on a tired one.

> **Following along:** Run this lesson in the app you picked in Module 0. Every exchange is shown for both apps; you only run your own. The panels show the shape of each exchange — your agent's exact words will differ, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

This lesson lives inside one step of the loop: the **ask** (writing a specific request the agent can act on, [→ GLOSSARY](../../GLOSSARY.md#ask)). Every ask you will ever write is one of two kinds, and telling them apart is worth more than any other single habit in this module.

A **planning conversation** (a session where you ask the agent to describe what it would do, without changing anything yet, [→ GLOSSARY](../../GLOSSARY.md#planning-conversation)) costs you a minute and changes nothing. You ask for the plan, you read it, you push back on the parts that aren't what you meant. An **execution conversation** (a session where you ask the agent to actually make the change, [→ GLOSSARY](../../GLOSSARY.md#execution-conversation)) is where the work — and the mess — happens. Every change might be the wrong change, and every wrong change is something you now have to notice and undo.

So: plan first, then execute. Even on something small. The plan is the cheapest place in the whole process to catch a misunderstanding, because at that point the misunderstanding is one sentence you can correct instead of a page you have to walk back.

The important part is that planning is a **sentence**, not a button. You get a planning conversation by asking for one:

> Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do.

Three pieces. "Plan:" up front, so the shape of the reply is set before the agent reads anything else. The outcome you want, in your own words. Then the constraint — "Don't make changes yet" — which is the load-bearing half of the sentence; without it most agents go straight to work. That sentence does the same job in every app, this year and next, which is why it is what this course teaches. (Claude Code desktop also ships a Plan mode you can switch on if you like it. It is a convenience, not a requirement — the sentence works with or without it.)

### The planning ask

Here is that ask landing in both apps, on the practice page from Lesson 1.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do.
> **The agent:** Here's what I'd do. Put a button under the date, starting with the label "Hide the date" — the date starts out visible, so that's the action you'd want next. Style it from the colours the page already uses, so it looks right in both light and dark. Then wire it up so a click hides or shows the date and flips the button's label to match. It's about six lines of new code and there's nothing to install. Two decisions I'd be making for you: the button hides the whole date line rather than leaving an empty gap where it was, and the footer will shift up a little whenever the date is hidden — I'd let it move, unless you'd rather the layout stayed perfectly still. Nothing changed yet. Want me to go ahead?

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do.
> **The agent:** Plan: add a button directly under the date, have a click hide the date and the next click bring it back, and keep the button's label saying which of the two it will do next. Styling stays in line with what's on the page already. I haven't touched anything — tell me to go ahead when you're happy with this.

Both apps stopped where you told them to stop, which is the first thing to notice: the constraint held. After that they diverge in how much they volunteer. One laid out its reasoning and named two decisions it was making on your behalf — including one, the footer shifting up, that you would never have thought to ask about and might not have wanted. The other gave you the shape and waited. Neither is the better agent; you are reading a plan either way, and reading it is the whole point. If a plan says something you did not intend — "I'll move the tagline up to make room" — this is the moment where saying "no, leave the tagline where it is" costs you one sentence.

### The execution ask

When the plan looks right, you say so. That is the entire second half:

> OK, please proceed with the plan.

You do not restate the task. The agent still has the plan in front of it — that is what a conversation is for.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** OK, please proceed with the plan.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done — the button is in, sitting under the date, and it flips its own label between "Hide the date" and "Show the date" as you click. One thing I should be straight about: I checked my work by reading it back, not by opening the page — I haven't watched it run. Want me to open it in your browser so you can click it, or will you take it from here?

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** OK, please proceed with the plan.
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Built it. The button sits below the date, and its label changes as you click. Refresh the page and try it.

Same divergence, second verse: one narrated a limit of its own work, the other pointed you at the page. What they have in common is the part that matters — both of them handed the checking back to you, because neither of them can see your screen. The running page is the ground truth, and it stays the ground truth for the rest of this course.

So go and look. Refresh the page in your browser and click the button. The date should disappear, and the button should now read "Show the date". Click it again and the date comes back. Notice that the label change is not a surprise: the plan told you it was coming. That is what reading a plan buys you — you knew what "done" would look like before it was done.

### When a conversation stops working

Your agent has a fixed amount of room to hold a conversation in. It has a name: the **context window** (the amount of text the agent can see at once — your conversation history plus anything it has read, [→ GLOSSARY](../../GLOSSARY.md#context-window)). Picture a notepad with a fixed number of pages, where everything said gets written down. When the pages run out, older notes get torn out to make room for new ones. Nothing announces this. The agent keeps writing on the notepad and keeps sounding exactly as sure of itself as it did on page one.

What you feel from the outside is **drift** (when the agent loses the thread of what it agreed to do, usually deep into a long session, [→ GLOSSARY](../../GLOSSARY.md#drift)) — the thing Module 2 told you to expect, now close enough to describe. It is a strange thing to sit through, because nothing looks broken. The replies are still fluent, still confident, still fast. They are just about a slightly different job than the one you are doing — an instruction you gave forty minutes ago has quietly stopped applying, because for the agent it is no longer there.

The smell-test is one sentence: **the latest reply is about something you didn't ask for.** Not wrong, not badly written — about the wrong thing. Something you ruled out comes back. A part of the page you told it to leave alone changes. It answers a question you asked half an hour ago rather than the one you just asked.

When you smell it, do this, in order:

1. **Restate what you want,** in one plain sentence, as if it were the first thing you had said today. "Right now I want one thing: the button below the date, and nothing else on the page touched."
2. **If the next reply is still about the wrong thing, stop restating.** Two tries is the limit. Past that you are spending your afternoon reminding the agent of things it can no longer hold on to.

Which brings you to the second move in this lesson.

### The reset move — start a fresh conversation

When restating doesn't hold, you start a fresh conversation. A blank notepad, nothing torn out, none of the muddle.

Both apps put this within reach. In Claude Code desktop you start a new conversation in the same Code tab you have been working in. In the ChatGPT app it is the same new-chat move you already use there for anything else. It is a normal, cheap, everyday thing to do — not an admission that something went wrong.

Three moments call for it:

- **Between unrelated tasks.** You finished the button; now you want to change the tagline. Different job, fresh conversation.
- **When replies have drifted and restating hasn't held.** You have said it twice. Say it once more, in a new conversation, where it is the only thing said so far.
- **When a long session just feels muddy.** You do not need better evidence than that. The feeling is usually right and the reset is cheap.

Here is the part worth being precise about, because it is where the fear lives. Starting fresh does not throw away your work. Your folder, your page, and every version you have told your agent to save are files on your computer — they sit exactly where they were, untouched by anything happening in a chat window. What a fresh conversation does lose is the conversation: what you said, what it agreed to, what you two decided about the footer. That is the entire cost, and it is also exactly why the save sentence from Module 2 matters so much. Saved work survives a reset. A verbal agreement does not.

One caution about what "fresh" means. Your agent can still look at the folder it is pointed at, so a new conversation is not a blank agent — it is an agent that can read your page but does not remember your reasons. Ask it what you were working on and it will honestly say it has no record of it, then describe what it finds in the folder and guess at the rest. Sometimes the guess is wrong. Treat the first message of a fresh conversation as if you were talking to someone competent who just walked in: say what you want now, in full.

> **Note:** Written 2026-08-17. Some pages, videos, and older notes will tell you to reset by typing something that starts with a `/` into the chat box. That is a different, typed way of working with these tools, and it is not this course's way. You start a fresh conversation with the app's own control, the same way you would start any other new conversation.

## Exercise

Run one planning conversation and one execution conversation on the practice page from Lesson 1, then reset on purpose. Plan twenty-five to thirty minutes.

1. **Open your agent app** and the browser tab with your practice page in it. The page should show your name, your tagline, and today's date.
2. **Ask for the plan.** Type: *"Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do."*
3. **Read the plan properly** — this is the exercise, not a formality. If anything in it is unclear or not what you meant, ask exactly one follow-up question before you go further.
4. **Ask for the work.** Type: *"OK, please proceed with the plan."* Approve what the app asks you to approve.
5. **Go and click it.** Refresh the browser tab and click the button. The date should hide and come back. If it doesn't, say what you saw and what should be different — that is steering, and Lesson 4 gives it a whole hour.
6. **Save it.** Say: *"Save this as a working version, with a one-line note about what changed"* — the note being that the date now has a show/hide button.
7. **Start a fresh conversation** in your app, and ask it: *"What were we just working on?"* Read the answer. Then look at your browser tab and refresh it once more.

Then write three sentences, anywhere you like:

- One thing the plan told you that you would not have thought to ask about.
- What the agent said in the fresh conversation when you asked what you were working on.
- What was still there on the page after the reset — and what wasn't.

Your deliverable is a working show/hide button on the practice page, a saved working version, and three sentences.

## Checkpoint

You've got this if you can:

1. Say in one sentence what makes a planning ask different from an execution ask.
2. Name the three moments when you start a fresh conversation.

## Going deeper

Optional, only if you're curious:

- **Try the plan step on something bigger.** The bigger the job, the more the plan earns. Ask your agent to plan a change you have no intention of making — three more sections on the page, say — and read what it proposes. Reading plans you will never run is cheap practice for the ones you will.
- **Watch what a fresh conversation can and can't see.** After the reset in the exercise, ask: *"What do you think this page is for?"* It will answer from the page itself, confidently, and it may well be wrong — it is reading, not remembering. That gap between reading and remembering is the whole reason you say things again after a reset.
- **The next lesson is about not being fooled.** Lesson 3 takes the step after the ask — deciding whether what came back is actually right — and turns it into five specific things to look for, including the case where your agent hands you something it made up entirely.

## Loop check

> **Loop check — ask.** Lesson 1 named all four steps; this lesson sharpens the second one. A good ask now comes in two halves — the plan, then the go-ahead — and it comes with a limit: when two clear asks in a row don't land, the problem is the conversation, not the wording, and you start a fresh one. The loop step this lesson reinforces is **ask**.

## What you just did

You split one small change into a plan and an execution, read the plan before anything moved, and caught what the agent decided on your behalf while it was still one sentence to correct. Then you did the thing most people avoid for far too long: you threw away a conversation on purpose and watched your page survive it untouched. Lesson 3 hands you the other half of this skill — how to tell whether what came back is right at all, including when your agent invents something and tells you about it with a completely straight face.

## Navigation

[← Previous: Introducing the loop](./01-introducing-the-loop.md)
[Next: Reading plans + recognizing wrong output →](./03-reading-plans-recognizing-wrong.md)
