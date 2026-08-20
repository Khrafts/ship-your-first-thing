---
title: "Steering and recovery"
module: "03-the-loop"
lesson_number: 04
est_minutes: 55
prereqs: ["03-reading-plans-recognizing-wrong"]
updated: "2026-08-17"
deviations: []
---

# Steering and recovery

## Learning objective

By the end of this lesson, you will be able to write a three-part steer, recognize when your agent has done far more than you asked and pull it back to scope, and know when starting a fresh conversation beats writing another steer.

## Why this matters

You are looking at a page with three books on it that were never yours, and you already know it is wrong. Knowing is not the same as fixing. The sentence you say next either lands in ten seconds, or it sends your agent off rebuilding half the page in a direction you never asked for — and then you have two problems where you had one. This lesson is the three moves that keep the second thing from happening: how to write the sentence, how to spot the moment your agent has run away with the job, and how to tell when saying it again is not going to work at all.

> **Following along:** Run this lesson in the app you picked in Module 0. Every exchange is shown for both apps; you only run your own. The panels show the shape of each exchange — your agent's exact words will differ, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

This is the fourth step of the loop: the **steer** (course-correcting when what came back is off, [→ GLOSSARY](../../GLOSSARY.md#steer)). It closes the circle. You knew what you wanted, you asked for it, you looked at what came back and it was not right — and now you say the thing that makes it right.

Most steers are undramatic. A steer is one more **ask** (writing a specific request the agent can act on, [→ GLOSSARY](../../GLOSSARY.md#ask)), written with the advantage of knowing exactly how the last one went wrong. Most of the time it is two sentences and it lands on the first try. The reason this lesson runs an hour is not the steer that works — it is the other two cases: the steer that produces far more than you wanted, and the session where steering has stopped helping at all. Those are the ones that eat afternoons.

### Steer #1 — fixing the invented list

Start with the one in front of you. Your agent invented three books; you want a placeholder in their place until you decide what really goes there.

> These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Replaced. The three titles are gone and the section now reads "Add your three favorite books here." I kept the small heading above it — that labels the section rather than being part of the made-up data, so dropping it would leave a floating sentence with nothing to explain it. Two small things worth your call: the heading spells it "favourite" and your placeholder says "favorite", so both spellings now sit two lines apart; and you wrote it in lower case, but I've put a capital on it since it reads as a sentence on the page.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Done — the three books are gone and the line now reads "Add your three favorite books here." Refresh the page and it should be the only thing under the heading.

One of them handed two judgement calls back to you on the way past; the other did the job and pointed you at the page. Neither asked what "placeholder text" meant, because it did not need to — you had said the words you wanted on the page. Both landed on the first try, and that is the ordinary case: most steers are one exchange and then you are moving again.

That is the canonical pattern, and it has three moving parts worth naming.

### Anatomy of a steer ask

1. **What was wrong**, in one sentence. "These books are not actually my favorites." "The button does not hide the date." "The page came back blank."
2. **What you actually want**, in one sentence. "Replace them with placeholder text saying this." "Make the click hide the date." "Put the date back where it was."
3. **Any limit you want held**, in one sentence — optional, and the one people leave out. "Keep the button working." "Don't change anything else on the page."

Two ways to get this wrong, and they fail in opposite directions.

The first is **"fix it."** Two words, no information. Your agent knows something displeased you and has to guess which thing — so it guesses, and now you are steering the guess as well as the original problem.

The second is over-correcting: answering a small problem with a long list of instructions about how to solve it. It feels safer, and it does the opposite. A pile of specifics invites a pile of work, and you end up steering a bigger result than the one you were unhappy with. Two specific sentences beat ten. Short steers usually land in one pass; long ones usually need a steer of their own.

### Steer #2 — the open-ended ask

Now try the loosest ask in the lesson, on purpose:

> Make the list look like a real bookshelf

Read what you just asked for. "A real bookshelf" is a picture in your head and nowhere else — the placeholder text does not say how far to take it, and neither do you. An ask with no edges is an invitation, and what it invites is **over-engineering** (when your agent does much more than you asked for, because nothing in the ask said where to stop, [→ GLOSSARY](../../GLOSSARY.md#over-engineering)).

The exchange below was approved so you can see the whole shape of the over-shoot. In your own run you may well see it coming when the app asks you to approve, and stop it there instead, which is the cheapest steer there is.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Make the list look like a real bookshelf
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done. The list is now three upright spines standing on a plank, with the last one leaning into the gap at the end the way a half-full shelf does. Each spine carries a label — "Book one", "Book two", "Book three", with "Author" under each — and your line "Add your three favorite books here." has moved down to sit under the shelf as a caption. I picked three spine colours and checked each against the text so they stay readable in both the light and dark versions of the page. One thing I could not do: I have not seen it rendered. Open it and check two things — whether the spines are thick enough for the text at your font size, and whether the lean reads as leaning or as crooked.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Make the list look like a real bookshelf
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Here's a bookshelf. The three lines are standing books on a shelf board now, with a wood-grain background, a different colour per spine, and a soft shadow under each so they sit on the shelf instead of floating. I put "Book one / Book two / Book three" on the spines so there is something to read on them. Want me to add cover pictures next?

Both of them heard "bookshelf" and built one. That is the divergence and the convergence at once: the apps differ in how much they narrate and what they offer next, and neither of them treated "real bookshelf" as a small styling change. Nothing here is disobedience. It is enthusiasm pointed at an ask that never said where to stop.

### Recognizing it

Two things give over-engineering away, and you can see both without knowing anything about how the page is built.

**The response is bigger than the task.** You asked for one thing to look different, and what came back describes several new things — a plank, spines, a lean, a set of colors — where you were expecting a sentence. When a small ask produces a long answer, the extra length is work you did not ask for.

**It adds things nobody asked for.** One exchange after you told your agent to take three invented books off your page, it put three invented book labels back on. "Book one", "Book two", "Author" — none of that was in your ask. It also moved your placeholder line somewhere else without mentioning it first, then handed you two homework questions about a shelf you never wanted.

The same shape takes three other forms you will meet in Module 4: your agent reaches for a new tool to do something small, spreads a one-line change across extra files, or proposes rebuilding a thing that already works. New tools, extra files, big rebuilds — when a modest ask produces any of those, that is the smell.

The fix is not to distrust your agent. It is to put an edge on the ask.

### The steer back to scope

> Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else.

Three sentences doing three jobs. "Too much" names the over-shoot without arguing about it. The middle sentence restates what you actually wanted, small and concrete. And **"Nothing else"** is the edge the first ask was missing — the shortest way to say *do not go looking for anything to improve.*

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Reverted. The spines, the plank, the lean and the spine colours are all gone. What is left is the plain list with a wood-grain panel behind it and more space between the lines. One change to flag: your single line "Add your three favorite books here." is now three separate rows, because that is what gives the list lines to space apart. Say the word if you would rather have the one sentence back.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else.
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Scaled it back. The books are a plain list again on a wooden background, with the lines further apart. Nothing else on the page changed.

Both scaled back on the first try, and neither argued. The interesting difference is the last line of the first one: it flagged a side effect — your one sentence is now three rows — that you would otherwise have found on the page and wondered about. That is worth a decision, not a shrug. Refresh the page and take the sixty seconds: is the wood there, are the lines further apart, and is the placeholder still saying what you want it to say?

Notice what the over-shoot cost you: one wasted exchange and one approval. Not an afternoon. That is what steering is for, and most sessions never get worse than this.

### When steering stops working

Some sessions do get worse than that. You write the scope-steer and the next reply over-shoots again. You rule something out and it comes back two replies later. Every steer produces something slightly further from what you wanted, and you find yourself explaining, for the third time, a thing you explained clearly the first time.

That is **drift** (when the agent loses the thread of what it agreed to do, usually deep into a long session, [→ GLOSSARY](../../GLOSSARY.md#drift)), and Lesson 2 gave you the smell-test: the latest reply is about something you did not ask for. It also gave you the limit — two tries. Past two clear restatements, more steering is not going to work, because the problem is no longer your wording. It is the conversation.

So you do what Lesson 2 taught: **start a fresh conversation.**

Think of it the way you think about a meeting that has gone in circles. Nobody in the room is being difficult, everyone has heard everything twice, and the useful thing is not another lap — it is to stop, walk out, and come back at it from the top with one clear question. That is what a new conversation buys you. The hole your agent dug itself into was made of things it said and things you said back, and none of that follows it into the new conversation.

Two things make this cheap rather than frightening. The first is that your work was never in the conversation: your folder and your page are files on your computer, and they sit where they were no matter how many conversations you start or end. The second is that your saved versions are the floor you land on. If the session left the page in a state you do not want, you do not have to fix it by hand or explain what went wrong. You say:

> Take us back to the last saved working version.

That sentence is always available, and the only thing it costs you is whatever happened since your last save. Your agent does the work of getting back there, and going back is not an admission that you failed — it is the reason you save. It is also why the gap between saves is worth keeping short: the sentence is cheap in proportion to how recently you used the other one.

Notice how long that gap is right now. Lesson 3 ended unsaved on purpose, so your last working version is the page as it stood at the end of Lesson 2 — before any of the books existed. Rolling back today would take the list with it. That is the argument for saving the moment something works rather than at the end of an afternoon.

You have not had to reach for it in this lesson, because the scope-steer landed. When you do reach for it, what follows is the same either way — re-ask, with the edge you now know the first ask was missing:

> The practice page has a list of placeholder text. Give the list a wooden background and comfortable line spacing. Nothing else.

Run that against a page at the placeholder stage, in a conversation with no history behind it, and it lands in one pass: the wood goes on, the lines get more room, and nothing else moves. Your agent says as much without being asked — heading, button, footer and background all untouched. No shelf, no invented labels, no side effect to decide about afterwards.

The lesson is not that starting over is better. It is that the tighter ask was always available: "Nothing else" did in the first sentence what the scope-steer had to do in the third, and it did it before anything was built.

### When something looks broken

One more case, and it is the one people brace for. Sometimes a change does not leave you with a wrong page — it leaves you with a page that has clearly fallen over. A block of red text where your list used to be. A region gone blank. Everything below a certain point missing.

You do not need to read any of it. Say what you see, in the plainest words you have, and hand it straight back:

> The page went blank after that change.

> There's a red error where the list was.

That is the whole move. Your agent can look at the project itself, and working out what the red text means is its side of the arrangement — it will read the details and come back with a fix, usually in one round. What it does not have is the one thing you do: you looked at the page and it was broken. Noticing and saying so is the job.

Two or three rounds of this is normal. If it is still stuck after that — the same problem, described differently, the third time round — you have stopped steering and started going in circles, and the fresh conversation is the faster path. Same signal, same move.

### The loop closes

Module 3 ends here, and it ends where it started: on one page, with four moves. You worked out what you wanted, asked for it, looked at what came back, and said what should be different. One lesson per step, four iterations, on a page that did not exist before Lesson 1.

You also ran every one of those steps in two apps, which was the other half of the point. The windows look different, the wording is different, one narrates more than the other. The four moves did not change once. That is the thing you are actually taking to Module 4 — not an app, a habit that outlives whichever app you happen to be holding.

Your page is working now, so finish it properly:

> Save this as a working version — the practice page is done.

> **Note:** The practice page was always throwaway. Your real project starts in Module 4 and does not build on this one, so you can ask your agent to delete the practice folder if you want the clean slate — or keep it as a souvenir of the first thing you ever made this way. Either is fine. The loop you ran on it is what carries forward.

## Exercise

Run the full steer sequence on your own page, over-shoot included. Plan twenty-five to thirty minutes.

1. **Steer #1 — fix the invented list.** Your page should still show the three books your agent made up in Lesson 3. Type: *"These books are not actually my favorites. Please replace with placeholder text saying 'add your three favorite books here.'"* Approve what the app asks you to approve.
2. **Go and look.** Refresh the browser tab. The books should be gone and your placeholder line should be sitting where they were. Click the show/hide button once each way to confirm nothing else broke.
3. **Steer #2 — the loose ask.** Type: *"Make the list look like a real bookshelf"* and read the reply before you touch anything. Is the answer bigger than the ask? Is it adding things you never mentioned? **If what it proposes is much larger than what you asked for, decline it when the app asks you to approve** rather than approving and undoing it afterwards — then steer back with step 4. Approving it first is also fine; you will just be steering a shelf instead of a proposal.
4. **Steer back to scope.** Type: *"Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else."*
5. **Go and look again.** Refresh. Wooden background, more space between the lines, placeholder text still saying what you want it to say — and check whether your agent flagged anything it changed on the side.
6. **Reset the list so there is something to compare.** You are about to reach the same result by a second route, so put the page back to where that route starts. Type: *"Put the list back to plain placeholder text, nothing else."* Refresh and confirm the wood is gone.
7. **Practice the fresh start.** Start a fresh conversation in your app and type the tighter version of the same ask: *"The practice page has a list of placeholder text. Give the list a wooden background and comfortable line spacing. Nothing else."* Watch what one ask with an edge on it from the first word does in a conversation that has never heard of a bookshelf.
8. **Save it.** Say: *"Save this as a working version — the practice page is done."*

Then write four sentences, anywhere you like:

- What the open-ended ask invited your agent to do.
- The sentence you used to steer it back, and what it gave up.
- What the fresh start produced, compared to the steered version.
- Which of the two felt cleaner on this task — and whether you would reach for the same one next time.

Your deliverable is a finished practice page, saved as a working version, and four sentences.

## Checkpoint

You've got this if you can:

1. Write a steer in its three parts — what was wrong, what you want, and any limit you want held.
2. Name the two things that give over-engineering away, and write the sentence that pulls a run-away ask back to scope.
3. Say when you stop steering and start a fresh conversation instead.

## Going deeper

Optional, only if you're curious:

- **Module 5 puts you through three real recoveries.** Three walkthroughs, each on an app with real information in it, where an agent gets something genuinely wrong and you work out the way back. This lesson gives you the moves on a throwaway page; those give you the same moves when something is actually at stake.
- **Module 6 is steering under pressure.** Fixing a bug in a product that is already live, where someone may be looking at the broken version while you work. The feeling is different. The loop is not.
- **Module 7 covers session hygiene.** When to start fresh, when to switch to a different agent, and when the right move is to leave the keyboard entirely. The patterns generalize well past AI coding — they belong to any tool with a tight feedback loop.

## Loop check

> **Loop check — steer.** Lesson 1 named all four steps; this lesson closes the loop on the last one. A steer is a short ask written with the advantage of hindsight — what was wrong, what you want, what limit to hold — and its two failure modes have their own answers: an over-shoot gets an edge put on it, and a conversation that has stopped listening gets replaced rather than argued with. The loop step this lesson reinforces is **steer**.

## What you just did

You took a wrong page and made it right in one sentence, then watched your agent turn a loose ask into a bookshelf nobody wanted and pulled it back with three more. You practiced the move that beats steering when steering has stopped working, and you finished the page and saved it. That is the whole loop, run end to end on something real: Module 4 hands you a project worth building and you run the same four moves on it, for weeks instead of an afternoon.

## Navigation

[← Previous: Reading plans + recognizing wrong output](./03-reading-plans-recognizing-wrong.md)
[Next: Module 4 — Designing & building the thread project →](../04-thread-project/README.md)
