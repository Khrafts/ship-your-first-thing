---
title: "Plan before you build"
module: "03-the-loop"
lesson_number: 02
est_minutes: 35
prereqs: ["01-introducing-the-loop"]
updated: "2026-09-07"
deviations: []
---

# Plan before you build

## Learning objective

By the end of this lesson, you will be able to ask for a plan before asking for the work, and know when — and how — to start a fresh conversation.

## Why this matters

You say what you want, what comes back is nearly right, you say it again with more words, and the reply after that is about something you never mentioned. An hour in, you have a page you like less than the one you started with. Two moves account for most of that hour: asking for the plan before asking for the work, so a misunderstanding costs thirty seconds instead of thirty minutes; and knowing when a conversation is past saving, and starting a new one on purpose.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

Every ask is one of two kinds: **"tell me what you'd do"** or **"go and do it."** The first costs a minute and changes nothing. The second is where the work — and the mess — happens. Ask for the plan first whenever a wrong answer would cost you more than a minute. Planning is a sentence, not a button:

> Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do.

"Plan:" up front. The outcome you want, in your own words. Then "Don't make changes yet" — without it most agents go straight to work. (Claude Code desktop also has a Plan mode you can switch on; the sentence works with or without it.)

### The planning ask

Your agent's exact words will differ from the run below; that is normal.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do.
> **The agent:** Here's what I'd do. Put a button under the date, starting with the label "Hide the date" — the date starts out visible, so that's the action you'd want next. […] Two decisions I'd be making for you: the button hides the whole date line rather than leaving an empty gap where it was, and the footer will shift up a little whenever the date is hidden — I'd let it move, unless you'd rather the layout stayed perfectly still. Nothing changed yet. Want me to go ahead?

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

Read the plan. If it says something you did not intend — "I'll move the tagline up to make room" — saying "no, leave the tagline where it is" costs you one sentence now.

### The execution ask

When the plan looks right:

> OK, please proceed with the plan.

You don't restate the task; your agent still has the plan in front of it.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** OK, please proceed with the plan.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done — the button is in, sitting under the date, and it flips its own label between "Hide the date" and "Show the date" as you click. One thing I should be straight about: I checked my work by reading it back, not by opening the page — I haven't watched it run. […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

Go and look: refresh the page and click the button. The date should disappear and the button should now read "Show the date". Click again and the date comes back. The label change is not a surprise — the plan told you it was coming.

### When a conversation stops working

A conversation has a limited memory. As it gets long, older parts fall out silently, and the replies stay fluent and confident — just about a slightly different job than the one you set.

The tell is one sentence: **the latest reply is about something you didn't ask for.** Something you ruled out comes back. A part of the page you told it to leave alone changes.

When you see it:

1. **Restate what you want,** in one plain sentence, as if it were the first thing you'd said today. "Right now I want one thing: the button below the date, and nothing else on the page touched."
2. **If the next reply is still about the wrong thing, stop restating.** Two tries is the limit.

### The reset move — start a fresh conversation

When restating doesn't hold, start a fresh conversation. In Claude Code desktop you start a new conversation in the same Code tab. In the ChatGPT app it is the same new-chat move you already use.

Three moments call for it:

- **Between unrelated tasks.** You finished the button; now you want to change the tagline.
- **When replies have stopped matching what you asked and restating hasn't held.**
- **When a long session just feels muddy.** The feeling is usually right and the reset is cheap.

Starting fresh does not throw away your work: your folder, your page, and every saved version are files on your computer. What you lose is the conversation — what you said, what it agreed to. A fresh conversation can still read your folder but does not remember your reasons, so say what you want now, in full — and if it doesn't know which folder you mean, point it at `loop-practice` again.

> **Note:** Written 2026-08-17. Some pages, videos, and older notes will tell you to reset by typing something that starts with a `/` into the chat box. That is a different, typed way of working with these tools, and it is not this course's way. You start a fresh conversation with the app's own control, the same way you would start any other new conversation.

## Exercise

Run one plan, one go-ahead, then reset on purpose. Plan twenty minutes.

1. **Open your agent app** and the browser tab with your practice page. It should show your name, your tagline, and today's date.
2. **Ask for the plan.** Type: *"Plan: I want a button below the date that shows or hides the date when clicked. Don't make changes yet — describe what you would do."*
3. **Read the plan properly.** If anything in it is unclear or not what you meant, ask exactly one follow-up question before going further.
4. **Ask for the work.** Type: *"OK, please proceed with the plan."* Approve what the app asks you to approve.
5. **Go and click it.** Refresh the browser tab and click the button. The date should hide and come back. If it doesn't, say what you saw and what should be different.
6. **Save it.** Say: *"Save this as a working version, with a one-line note about what changed"* — the note being that the date now has a show/hide button. If saving needs something set up, use the check-first sentence from Lesson 1. Ask it to confirm the save.
7. **Start a fresh conversation** in your app, and ask: *"What were we just working on?"* Read the answer. Then refresh your browser tab once more.

Then write three sentences, anywhere you like:

- One thing the plan told you that you would not have thought to ask about.
- What your agent said in the fresh conversation when you asked what you were working on.
- What was still on the page after the reset — and what wasn't.

Your deliverable is a working show/hide button on the practice page, a saved working version, and three sentences.

## Checkpoint

You've got this if you can:

1. Say in one sentence what makes a planning ask different from a go-ahead.
2. Name the three moments when you start a fresh conversation.

## Going deeper

Optional, only if you're curious:

- **Try the plan step on something bigger.** Ask your agent to plan a change you have no intention of making — three more sections on the page, say — and read what it proposes.
- **Watch what a fresh conversation can and can't see.** After the reset, ask: *"What do you think this page is for?"* It will answer from the page itself, confidently, and may be wrong — it is reading, not remembering.

## What you just did

You split one small change into a plan and a go-ahead, caught what your agent decided on your behalf while it was still one sentence to correct, then threw away a conversation on purpose and watched your page survive it. Lesson 3: telling whether what came back is right at all.

## Navigation

[← Previous: Introducing the loop](./01-introducing-the-loop.md)
[Next: Check the plan and the result →](./03-reading-plans-recognizing-wrong.md)
