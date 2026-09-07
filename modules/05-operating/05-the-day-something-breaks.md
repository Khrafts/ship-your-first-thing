---
title: "The day something breaks: four moves, in order"
module: "05-operating"
lesson_number: "05"
est_minutes: 30
prereqs: ["04-caught-before-it-ran"]
updated: "2026-09-07"
deviations:
  - long-core-read
---

# The day something breaks: four moves, in order

## Learning objective

By the end of this lesson, you will be able to run the four moves that cover the day your live app stops behaving: describe what you see and hand it over, re-run the checks that used to pass after any fix, ask what going back to a saved working version would and would not undo before asking for it, and start a fresh conversation when the conversation itself has become the problem.

## Why this matters

Everything you have done with your agent so far started the same way: you sat down, you opened the app, and you decided what the session was about. The day something breaks does not start there. It starts on your phone in a queue, or with a message from the one person you gave the link to, or with a page you happened to open that is not the page you built — and none of it is your idea. Nothing about that day is harder than what you already did in Module 4. What is missing is a way to begin, and beginning badly is what turns a small fault into a long one.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. Your agent's exact words will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-19. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. It carries four moves that only make sense as a set — the third and fourth exist because the first two ran out of road — and splitting them across two lessons would hand you half a rhythm and call it one.

<!-- No build is narrated in this lesson: every scene here is second-person rehearsal, not a claim about the 2026-07 build run. Neither the grounded nor the staged-story comment applies. -->

Nothing gets built in this lesson, and nothing of yours gets broken. The split has not moved: your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save.

### The day starts in the wrong place

Every session in Module 4 began with you holding the thread. Your plan was open, you knew which feature was next, and the conversation started because you started it. Both of the checks this module has drilled — the one you run in the app and the one you ask before anything runs — sit inside that same shape: you chose the moment.

A break-day inverts all of it. You did not pick the time, you did not pick the feature, and the first thing you know about it is a screen doing something wrong. And the app stays up the whole time. Module 1 gave you the picture of a private kitchen becoming a public restaurant, and that is exactly where you are now: the door is open, people can walk in, and there is no quiet evening in which to take the room apart. That is not a reason to hurry. It is the reason to have moves you do not have to invent while somebody is standing at the counter.

There are four of them. Two you run every time. Two you reach for when going forward has stopped paying.

### Move 1 — Describe what you see, not what you guess

You already know the shape of this message, because you have been writing it since the start of this module: what you did, what you saw, what should have been true. A break-day changes one thing about it. Often you did not *do* anything — the app was fine and now it is not — so the first part turns into where you were looking rather than what you pressed.

So the description carries three things. **Where** — your live link, opened on your phone, or in your everyday browser, or on the second one. **What the page showed** — in the plainest words you own. **Since when**, as near as you can say it, which is usually "this morning" or "since I last looked on Friday" and that is precise enough.

Then you hand it over. One line does it:

> "On my live link, opening any profile shows a blank page since this morning. Find out why and fix it."

That is a **recovery prompt** (a one-line definition: the message you write after a check comes back wrong — you say exactly what you did and what you saw, then ask your agent to find and fix it, [→ GLOSSARY](../../GLOSSARY.md#recovery-prompt)), sent from a different starting point than the last three. Same three jobs, same handover, same thing carefully left out of it: any guess at the cause. On a day when you have no idea what happened, the temptation to supply a theory is at its strongest and the theory is at its worst — you have less to go on than you have ever had. *Find out why* is the whole of your instruction, and it is enough.

One thing that trips people on a bad morning: a page that has fallen over is still something you can describe without reading a word of it. A block of red text where your feed used to be, a page that comes up empty, a section that has gone missing — you say where it is and what it replaced. Reading the words in it is your agent's side of the line, and it has always been. Copying them out is not your job either. Saying *there is red text where the feed was* is a complete report.

### Move 2 — After any fix, re-run the checks that used to pass

The fix comes back. It comes back the way every report in this module has come back: even, organized, specific about what changed, and confident. You know by now what that tone is worth on its own.

But this move is not about whether the fix worked. It is about the rest of your app.

A fix is a change, and a change lands somewhere. Sometimes it lands somewhere you were not thinking about, and something that had been working since Module 4 quietly stops. That is a **regression** (a one-line definition: a feature that was working and stopped working because of a change made somewhere else entirely, [→ GLOSSARY](../../GLOSSARY.md#regression)) — and it arrives inside exactly the same calm sentence as the fix itself, because as far as the report is concerned nothing went wrong. The profiles are back. The report is true. It is just not the whole truth about your app, and nothing in it was ever going to be.

So after any fix, two things run, and they are the two you already have.

**The ones your agent runs and shows you.** Every feature in your plan came with a **definition of done** (a one-line definition: the checks your agent must run and show you, in plain words, before it is allowed to say a piece of work is finished, [→ GLOSSARY](../../GLOSSARY.md#definition-of-done)), agreed before the work started. That did not stop applying when the building stopped. A fix gets a gate exactly like a feature does, with one difference: nobody planned this one, so nothing was agreed in advance. You supply the agreement yourself, in the same breath as the description — one line saying what done means for this fix — *"Done is that I can open any profile and see it."* Once that is said, the sentence when the work comes back without its results is the sentence Module 4 gave you:

> "Run the checks we agreed on and show me the results first."

**The one you run yourself.** Lesson 1's ritual — two browsers, two people, four scenarios in order. It re-tests everything Module 4 shipped, which is precisely the sweep you want after a change whose reach you cannot see. And you cannot see it: which parts of an app a change can touch is not something anybody at this floor is meant to work out, which is why the answer is to run the whole ritual rather than to pick.

Then the last one: the thing that was broken this morning, done again from the outside. Open a profile. That is what closes it — the same shape that has closed every check in this module. Not the report.

### Move 3 — Go back when forward is losing

Some fixes do not land. You describe, your agent changes something, you look — and it is not better, it is differently wrong. Round two makes it differently wrong again. Somewhere in there you cross from fixing into digging, and the useful thing is not another round.

Every time you said *"Save this as a working version"* you left yourself a place to stand. All of them are still there, and you have used one: in Module 3, on the practice page, you said the sentence on purpose and watched the placeholder come back. It is the same sentence here. What is different is what stands around the files now — and that is why, on a live app, a question goes in front of it.

The question first. Going back restores the files your agent wrote — the pages, the plan, the settings that live in the project. It does not undo anything that happened outside those files: what people have typed into your app since then stays where it is stored, an email that went out stays sent, anything you changed on a dashboard stays changed. Module 2 said this when you first met the sentence; this is the day it stops being a footnote, because on a live app the part outside the files is the part other people are using. So before the sentence, ask:

> "Which saved working version is the one from before this started, and what does its note say? If we go back to it, what changes on my computer, what changes on the live link, and what stays exactly as it is — what people have typed in, and anything on a dashboard?"

Then wait for the answer, in plain words. The version it names should be the one whose note describes the app as it was when it last worked; if the newest save is not that one — you saved something this morning that turned out to be part of the problem — say so: *"Not that one; the one whose note says ___."* And the list of what stays as it is should hold no surprise. This is the same shape as every question this module has put in front of a change that cannot be taken back, and it belongs here for the same reason: once the live copy has moved, the people using it have moved with it.

Then the sentence, with the version you agreed on named in it:

> "Take us back to the saved working version whose note says ___."

Your agent does every part of that. There is nothing for you to find, nothing to choose from, nothing to open — the going-back is machinery, and machinery has been your agent's side of this arrangement since Module 2. Your side is the question, the sentence, and the check.

Two things worth holding about it. The first is that going back is not a defeat; it is the reason the saving was worth doing. What it hands back is the files as they were at that save, and what it costs you is the work your agent wrote since — which is the argument for saying the save sentence often rather than at the end of the day. What it does not hand back is anything outside the files, and no save point ever claimed to.

The second is that going back is itself a change, so Move 2 applies to it too. Run the ritual after a restore, the same as after a fix — on the live link, not only on your computer. If the live link is still showing what it showed this morning, say so, and ask what it would take to bring the live copy in line with the version you went back to and what that would change, before you say yes. Then ask the question Module 2 gave you for afterwards — *"What outside the files might not match the version we went back to?"* — and hand the problem over again, from the description you already wrote in Move 1, which is still accurate, still yours, and still the only sentence in the exchange nobody else could have supplied.

### Move 4 — When the conversation itself is the problem, start fresh

There is one more failure that is not about your app at all, and Module 3 already taught you to spot it: you explain the same thing a third time, the replies keep going somewhere you did not ask for, and every round leaves you further from where you started. That is the conversation being the problem, not the app and not your wording. It reads the same on a live app as it did on a practice page.

The move is the same too: **start a fresh conversation.** Nothing of yours is inside the old one. Your app is where it was, your saved versions are where they were, and your plan is where it was. What you leave behind is only the tangle.

You carry two things across. The plan comes with you by itself — your project's house rules have your agent reading it at the start of every conversation, which is why a fresh one starts oriented instead of blank. And you bring your description: where you were looking, what the page shows, since when. Update it if the app has changed under you since the morning, because it may have. What you deliberately do not carry across is a summary of everything that was already tried — that is a history of your agent's work, not of yours, and rebuilding it by hand is how the tangle follows you into the new conversation.

### The order is the point

Move 1 always, and first. Move 2 always, after any fix and after any going-back. Moves 3 and 4 are the ones you reach for when forward has stopped paying, and the only real mistake available with either of them is reaching late. Both cost one conversation and the work your agent wrote since the save you go back to — and neither hands back anything that happened outside the files, which is what the question in front of Move 3 is for. An afternoon of rounds costs more than that every time.

Notice what none of the four asks of you. Not to know what broke. Not to have a theory. Not to open, read, or judge anything your agent wrote — not on a calm day and not on this one. What they ask is that you look at your app, say what it is doing, and keep saying it until the app agrees with you again.

## Exercise

A rehearsal. Nothing on your app breaks, nothing changes, and the only thing you actually send is a question. The going-back sentence is not said today: you said it once in Module 3, on the practice page, and on a live app it waits for the question in front of it. The deliverable is one written message plus one written-down answer from your agent.

1. **Set the scene.** Picture opening your live link on your phone and finding that every profile comes up blank — yours, alice's, bob's. Everything else looks normal: the home page loads, the feed has posts on it, and you have not touched the project since last week.
2. **Write the message from memory.** Before looking back at this lesson, write what you would send. Where you were looking, what the page showed, since when — and the handover.
3. **Compare it with the one in this lesson.** *"On my live link, opening any profile shows a blank page since this morning. Find out why and fix it."* Check yours for the three jobs, then check it for what should not be there: a guess at the cause, a suggestion about where to look, anything that would have needed you to open something first.
4. **Ask the question that goes in front of the sentence.** Open your agent app and ask, in your own words: *"Which saved working version is the last one from when the app was working, and what does its note say? If we went back to it, what would change on my computer, what would change on the live link, and what would stay exactly as it is — what people have typed in, and anything on a dashboard?"* Nothing about your app changes — it is a question, and going back is not what you are doing today. If your agent asks to run something so it can go and look, that is safe to approve; if it offers to go ahead and go back, say *"Not today — just the answer."* Write the answer down: the version, its note, and the list of what would stay as it is.
5. **Look at the gap.** With that answer in front of you, ask yourself two things. What would going back cost you today, in your agent's work? If the honest answer is "more than I would like", the fix is not to remember harder on the bad morning; it is to say *"Save this as a working version"* more often on the ordinary ones. And what would it not bring back? Whatever your agent listed as staying put is the part of your app that lives outside the files — which is why on the day itself the question, not the sentence, is the first thing you say.

## Checkpoint

You've got this if you can do all three:

1. Say the four moves in order without looking them up, and say which two you run every single time and which two you reach for when going forward has stopped paying.
2. Write the message for a live app whose profiles have gone blank, and say what done means for that fix in one line before you hand it over — and then say what happens after your agent reports it finished: what gets re-run, who runs each part of it, and the sentence you send if "done" arrives without the results.
3. Say what going back to a saved version restores and what it leaves exactly as it is on a live app, and the question you ask before saying the sentence.

## Going deeper

Optional, only if you're curious:

- The four moves are not about this app. Anything you ever run that other people use will have a morning like this one, and the moves do not change with the product: describe rather than guess, re-check the parts nobody touched, go back to something that worked, start fresh when the conversation has stopped moving. What changes is only what you are looking at when you write the first line.
- Module 6 — After it's live — is next, and it is about changing an app that is already running: adding to it and repairing it without breaking what works. It starts from exactly here, with the moves this lesson leaves you. Nothing to prepare.

## Loop check

> **Loop check — steer.** This lesson is **steer** with nothing in front of it. Every other steer in this course followed something you asked for: you made a request, you looked at what came back, you said what should be different. Here there is no request to correct — the app simply stopped agreeing with what it did yesterday, and nobody proposed anything. The four moves are what turn that into a steer anyway. One description makes it something that can be handed over. One re-run makes it something that can be finished. And the last two are the admission that a steer which is not landing is worth abandoning early rather than repeating loudly.

## What you just did

You wrote the message you would send on a morning that starts badly, and you asked your agent the question that tells you what a bad morning would cost you as things stand right now — and what going back would not bring back. That closes this module. You can re-test any app you build as two people at once; you have watched three builds fail in three different ways and written the message that hands each one back; and you now have four moves for the day it is your own link, with somebody on the other end of it waiting. At the end of Module 4 your app was live. It is operated now, which is a different thing and the one that lasts. Module 6 is about changing it while keeping it that way.

## Navigation

[← Previous: Caught before it ran: the question that goes before you press anything](./04-caught-before-it-ran.md)
[Next: Module 6 — After it's live →](../06-after-live/README.md)

It starts from the app you now know how to operate.
