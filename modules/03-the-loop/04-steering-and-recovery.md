---
title: "Steering and recovery"
module: "03-the-loop"
lesson_number: 04
est_minutes: 45
prereqs: ["03-reading-plans-recognizing-wrong"]
updated: "2026-09-07"
deviations: []
---

# Steering and recovery

## Learning objective

By the end of this lesson, you will be able to write a three-part steer, recognize when your agent has done far more than you asked and pull it back, go back to a saved working version on purpose and check what it gave you back, and know when starting a fresh conversation beats writing another steer.

## Why this matters

You are looking at a page with three books on it that were never yours, and you already know it is wrong. Knowing is not the same as fixing. The sentence you say next either lands in ten seconds, or it sends your agent off rebuilding half the page in a direction you never asked for — and then you have two problems where you had one. This lesson is also where you say the sentence that takes you back to solid ground — once, on purpose, on a page where nothing is at stake — so the first time you need it on something real, it is not new.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

A steer is one more ask, written knowing exactly how the last one went wrong. Most of the time it is two sentences and lands on the first try. This lesson is mostly about the other two cases: the steer that produces far more than you wanted, and the session where steering has stopped helping at all.

### Steer #1 — fixing the invented list

Your page has three books on it that aren't yours; you want a placeholder in their place until you decide what really goes there.

> These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."

Your agent's exact words will differ from the run below; that is normal.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Replaced. The three titles are gone and the section now reads "Add your three favorite books here." […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

It landed on the first try. That is the ordinary case.

### The three parts of a steer

1. **What was wrong**, in one sentence. "These books are not actually my favorites."
2. **What you actually want**, in one sentence. "Replace them with placeholder text saying this."
3. **Any limit you want held**, in one sentence — optional, and the one people leave out. "Don't change anything else on the page."

Two ways to get this wrong. **"Fix it"** — two words, no information; your agent has to guess which thing displeased you. And over-correcting — answering a small problem with a long list of instructions. Two specific sentences beat ten.

### Lay down a save point first

Refresh the page: the books are gone, the placeholder line is where they were, and the show/hide button still works. That is a working page — and Lesson 3 ended unsaved on purpose, so your last saved version is the page as it stood at the end of Lesson 2. Close that gap now:

> Save this as a working version — the list is placeholder text.

If saving needs something set up, use the check-first sentence from Lesson 1. Then ask it to confirm the save and read you the note, and wait for that. If it offers to put a copy online, "not yet" — this page is throwaway. This save matters: the next ask is loose on purpose, and you are going to come back to exactly this page by saying one sentence.

### Steer #2 — the open-ended ask

Now the loosest ask in the lesson, on purpose:

> Make the list look like a real bookshelf

"A real bookshelf" is a picture in your head and nowhere else. An ask with no edges is an invitation, and what it invites is your agent doing far more than you asked, because nothing in the ask said where to stop.

The exchange below was approved so you can see the whole shape of the over-shoot. In your own run you may see it coming when the app asks you to approve, and stop it there — the cheapest steer there is. You may also get no over-shoot at all, or a question back about what you meant; the steer section below says what to do then.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Make the list look like a real bookshelf
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Done. The list is now three upright spines standing on a plank, with the last one leaning into the gap at the end the way a half-full shelf does. Each spine carries a label — "Book one", "Book two", "Book three", with "Author" under each — and your line "Add your three favorite books here." has moved down to sit under the shelf as a caption. […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

It heard "bookshelf" and built one. Nothing here is disobedience. It is enthusiasm pointed at an ask that never said where to stop.

### Recognizing it

Two things give it away, and you can see both without knowing anything about how the page is built.

**The reply is bigger than the ask.** You asked for one thing to look different, and what came back describes several new things — a plank, spines, a lean, a set of colours. When a small ask produces a long answer, the extra length is work you did not ask for.

**It adds things nobody asked for.** One exchange after you told your agent to take three invented books off your page, it put three invented book labels back on. It also moved your placeholder line without mentioning it first.

In Module 4 the same shape takes three other forms: your agent reaches for a new tool to do something small, spreads a one-line change across extra files, or proposes rebuilding a thing that already works. When a modest ask produces any of those, put an edge on the ask.

### The steer back to scope

> Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else.

"Too much" names the over-shoot without arguing. The middle sentence restates what you wanted, small and concrete. **"Nothing else"** is the edge the first ask was missing.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Reverted. The spines, the plank, the lean and the spine colours are all gone. What is left is the plain list with a wood-grain panel behind it and more space between the lines. One change to flag: your single line "Add your three favorite books here." is now three separate rows, because that is what gives the list lines to space apart. […]

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass. No Codex transcript is shown: the illustrative Codex panel that sat under this slot at 2c1c329 was never verified against a real run and was removed in the 2026-09-07 plain-language pass. -->

If your agent never over-shot — a modest change, or a question back — skip this steer: answer with the small version ("a wooden background and a little more line spacing, nothing else") and the page lands in the same place. Note the agent above flagged a side effect — your one sentence is now three rows — that you would otherwise have found on the page and wondered about. Refresh and take sixty seconds: is the wood there, are the lines further apart, is the placeholder still saying what you want?

The over-shoot cost you one wasted exchange and one approval. Not an afternoon.

### When steering stops working

Some sessions get worse than that. You write the scope-steer and the next reply over-shoots again. You rule something out and it comes back two replies later. You find yourself explaining, for the third time, a thing you explained clearly the first time.

Lesson 2 gave you the tell — the latest reply is about something you did not ask for — and the limit: two tries. Past two clear restatements, the problem is no longer your wording. It is the conversation.

So **start a fresh conversation.** A fresh conversation may not know which folder you were in — if the app asks, or your agent seems lost, point it at the `loop-practice` folder again the way you did in Lesson 1. And it knows nothing about the old conversation, so your first ask has to say where things stand: what's on the page now and what you want changed.

Your work was never in the conversation: your folder and page are files on your computer, and they sit where they were no matter how many conversations you start or end. And your saved versions are the floor you land on. If the session left the page in a state you do not want, you say:

> Take us back to the last saved working version.

That sentence is always available. What it costs you is whatever changed in the files since your last save — which is why you keep the gap between saves short. Right now the gap is small: your last save is the placeholder page, and everything since is the wood and the line spacing.

So say it now, on purpose, while nothing is at stake. Say the sentence, approve if the app asks (it is about this folder), refresh the page. You should see the page from the save point — placeholder line back, wood gone, show/hide button still working. When you ask *"Confirm which saved version we're on now, and read me its note,"* you should hear the note you gave it a few minutes ago. Three things to notice. Your agent brought the *file* back; the browser tab may still show the wood until the page is reloaded, and whether your agent reloads it or leaves that to you varies — so refresh, and check the page rather than the reply. The app asked before it did it, or didn't, depending on your setting — the page was the check either way. And going back cost you exactly what the gap held: one wooden background, which you can have back in one ask.

![A practice page open in a browser after going back to the saved version: the name "Riley", the tagline "Learning by building", the date "7 September 2026", a button labelled "Hide the date", and below it a plain grey panel reading "Add your three favorite books here." There is no wooden background.](../../screenshots/m3/04-steering-and-recovery/restored-page-example.png)

*One possible example, with a sample name and date; your page may differ.*

<!-- The go-back rehearsal (this paragraph and exercise steps 2, 6, 7) was authored 2026-09-07 without a recorded agent run; no transcript panel is shown for it, by design (the browser page is the check). Claimed: the saved file returns, the browser tab shows the restored page once reloaded (by the agent or by the learner refreshing), the app may or may not show an approval depending on the setting, the agent confirms which version it is on. Not verified on a live install: whether either agent asks for confirmation before discarding changes, whether it reloads the browser tab itself, and the wording of its report. The director's separate desktop restore trial is the evidence for those. -->

If the page does not come back the way the save point left it, the exercise says what to do — and the first thing it says is not to save what is on the page now. A save point is a working version you looked at and were happy with.

Then, in a fresh conversation, the re-ask with the edge the first ask was missing:

> The practice page has a list of placeholder text. Give the list a wooden background and comfortable line spacing. Nothing else.

Run that against the page you just went back to, in a conversation with no history, and it lands in one pass. The lesson is not that starting over is better. It is that the tighter ask was always available: "Nothing else" did in the first sentence what the scope-steer had to do in the third.

### When something looks broken

Sometimes a change leaves you with a page that has clearly fallen over. A block of red text where your list used to be. A region gone blank. Everything below a certain point missing.

You do not need to read any of it. Say what you see, in the plainest words you have:

> The page went blank after that change.

> There's a red error where the list was.

Your agent can look at the project itself; working out what the red text means is its side. Two or three rounds of this is normal. If it is still stuck after that — the same problem, described differently, the third time round — you have stopped steering and started going in circles, and the fresh conversation is the faster path.

### Finish the page

Your page is working now, so finish it properly:

> Save this as a working version — the practice page is done.

> **Note:** The practice page was always throwaway. Your real project starts in Module 4 and does not build on this one, so you can ask your agent to delete the practice folder if you want the clean slate — or keep it as a souvenir.

## Exercise

Run the full steer sequence on your own page — over-shoot included, if your agent gives you one — and the way back to a saved version, once, on purpose. Plan thirty minutes.

1. **Steer #1 — fix the not-yours list.** Your page should still show the three books from Lesson 3. Type: *"These books are not actually my favorites. Please replace with placeholder text saying 'add your three favorite books here.'"* Approve what the app asks.
2. **Go and look, then save.** Refresh. The books should be gone and your placeholder line sitting where they were. Click the show/hide button once each way to confirm nothing else broke. Then say: *"Save this as a working version — the list is placeholder text."* If saving needs something set up, use the check-first sentence from Lesson 1. Ask: *"Confirm the working version is saved, and tell me what the note says."* If it offers to put a copy online, "not yet." Don't go on to step 3 until you have heard the confirmation; step 6 depends on this save.
3. **Steer #2 — the loose ask.** Type: *"Make the list look like a real bookshelf"* and read the reply before you touch anything. Is the answer bigger than the ask? Is it adding things you never mentioned? **If what it proposes is much larger than what you asked for, decline it when the app asks you to approve** rather than approving and undoing afterwards — then steer back with step 4. Approving it first is also fine; you will just be steering a shelf instead of a proposal.
4. **Steer back to scope.** Type: *"Too much. I just want the list to have a wooden background and a little more line spacing. Nothing else."* **If there was no over-shoot** — the reply was modest — or **if your agent asked what you meant** by a bookshelf, you don't need this steer: answer *"A wooden background and a little more line spacing. Nothing else."* and go on to step 5. The over-shoot is a thing to recognise when it happens, not a thing to make happen.
5. **Go and look again.** Refresh. Wooden background, more space between the lines, placeholder text still saying what you want — and check whether your agent flagged anything it changed on the side.
6. **Go back on purpose.** Say: *"Take us back to the last saved working version."* If the app asks you to approve, it's about this folder — approve. If your agent asks which version, say: *"The one whose note says the list is placeholder text."* If it asks whether you're sure, because going back drops everything since the save: yes, that's the point — the wood is what you're giving up. Then refresh the page. **Expect:** the wooden background is gone, the placeholder line is back under the button, the date is still there, and the show/hide button still works. Now ask: *"Confirm which saved version we're on now, and read me its note."* You should hear the note from step 2. If the page and the note both match, skip step 7 and go to step 8. If the picture is different, say what you see — it will be one of these:
   - **The wood is still there after the refresh.** Say: *"I refreshed and the wooden background is still there. Which saved version are we on, and what does its note say?"* If the note is the one from step 2, say: *"Take us back to that one, and tell me when it's done,"* then refresh again. If the note is about the show/hide button — that is Lesson 2's save — or your agent says there is no saved version, the step-2 save didn't land: go to step 7.
   - **The placeholder line is missing and so is the wood** — name, tagline, date, button, and nothing under it. The page went back to Lesson 2's save, which means the step-2 save didn't land. Go to step 7.
   - **Anything else** — a blank page, red text where the list was. Say what you see in the plainest words you have: *"The page went blank after going back."* Once the page is showing again, check it against **Expect** above; if it still isn't the save point's page, go to step 7.
7. **Only if step 6 didn't land — rebuild the save point, then go back again.** Don't save what's on the page now: it has the wood on it, and a save point is a working version you looked at, not a label. Put the page back to where step 2 left it: *"Put the list back to plain placeholder text saying 'Add your three favorite books here', with no wooden background and the normal line spacing. Change nothing else."* Refresh: placeholder line, no wood, button works. Now save it: *"Save this as a working version — the list is placeholder text."* Ask it to confirm the save and read you the note, and do not go on without hearing it. Then make the change again, small this time: *"Give the list a wooden background and a little more line spacing. Nothing else."* Refresh: wood. Now say the sentence again: *"Take us back to the last saved working version."* Approve if the app asks, refresh. **If the placeholder is back and the wood is gone,** ask for the confirmation and the note as in step 6, and go on to step 8. **If it still isn't** — you have now saved with a confirmation, changed, and gone back, and the page didn't follow — stop repeating. Say: *"Going back to the saved version isn't bringing the placeholder page back. Tell me in plain words what's stopping it."* Whatever the answer, have it put the page at placeholder for now — *"Put the list back to plain placeholder text, no wooden background, nothing else"* — carry on to step 8, and put what happened in your fifth sentence below. The way back didn't work in this folder today; that is a thing to settle with your agent before Module 4, where the sentence is not a rehearsal.
8. **Practice the fresh start.** Start a fresh conversation in your app. If it asks which folder, or your agent doesn't seem to know where the page is, point it at `loop-practice` again. The page is at the placeholder stage because you went back to it. Now type the tighter version of the same ask: *"The practice page has a list of placeholder text. Give the list a wooden background and comfortable line spacing. Nothing else."* Watch what one ask with an edge on it does in a conversation that has never heard of a bookshelf.
9. **Save it.** Say: *"Save this as a working version — the practice page is done."*

Then write five sentences, anywhere you like:

- What the open-ended ask invited your agent to do.
- The sentence you used to steer it back, and what it gave up — or, if there was nothing to pull back, what you said to keep it small.
- What going back to the saved version gave you back, and what it left alone — including whether the browser tab changed on its own or only when you refreshed.
- What the fresh start produced, compared to the steered version.
- Which of the two felt cleaner on this task.

Your deliverable is a finished practice page, saved as a working version, and five sentences.

## Checkpoint

You've got this if you can:

1. Write a steer in its three parts — what was wrong, what you want, and any limit you want held.
2. Name the two things that give away an over-shoot, and write the sentence that pulls it back to scope.
3. Say when you stop steering and start a fresh conversation instead.
4. Say what going back to a saved version gave you back, and what it left alone.

## What you just did

You took a wrong page and made it right in one sentence, pulled a runaway ask back to scope, went back to a save point on purpose and watched the page come back, practised the fresh start, and saved the page finished. Module 4 hands you a project worth building and you run the same four moves on it, for weeks instead of an afternoon.

## Navigation

[← Previous: Check the plan and the result](./03-reading-plans-recognizing-wrong.md)
[Next: Module 4 — Designing & building the thread project →](../04-thread-project/README.md)
