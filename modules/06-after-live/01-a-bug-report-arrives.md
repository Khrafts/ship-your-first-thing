---
title: "A bug report arrives: the steer that starts with somebody else's words"
module: "06-after-live"
lesson_number: "01"
est_minutes: 40
prereqs: ["05-operating (all five lessons)"]
updated: "2026-08-20"
deviations:
  - long-core-read
---

# A bug report arrives: the steer that starts with somebody else's words

## Learning objective

By the end of this lesson, you will be able to turn a fault somebody else reported into a steer your agent can act on — by going to your running app and seeing the wrong thing with your own eyes first, handing over what you saw rather than what you think is causing it, and re-running the checks that used to pass once the repair comes back.

## Why this matters

Module 5 left you four moves for the day your live app stops behaving, and every one of them assumed you were the one who noticed. This is the other way that day starts. A message arrives from somebody who is using your app — not a tester, not you, a person — saying something on it is wrong. They will not describe it the way you would, they may be wrong about what is actually broken, and the whole time you are working out what to do, they are still sitting in front of the version that is not working. What is missing is the first move: how you get from a sentence somebody else wrote to something your agent can act on. Beginning that badly is what turns a ten-second fault into an afternoon.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. The failure it walks through comes from a build that is not yours — your app is not expected to have it, and the checks are the part you run for real.

> **Last verified:** 2026-08-20. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. It follows one repair from the message that starts it to the check that closes it, and the order those beats arrive in is the whole lesson — splitting them would hand you the ending without the part that earned it.

There is nothing to prepare for this module. No new account, no dashboard to open, nothing to install, nothing to set up. You start from the app exactly as Module 5 left it: live at its link, with alice and bob already on it.

Nothing gets built in this lesson either, and nothing of yours gets broken. The split has not moved — your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save.

### The message

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Picture somebody a few weeks ahead of you. Their app has been live for a month and the link has gone out to a dozen or so people — a few friends, two people from work, somebody's sister. On a Saturday morning, one of them sends this:

> "Hey — is your app broken? I tried to follow you back this morning and the follow button doesn't do anything. I've pressed it a few times now. Might be me."

That is a **bug report** (a one-line definition: somebody telling you the deployed app does something wrong, [→ GLOSSARY](../../GLOSSARY.md#bug-report)), and it is the first one in this course that did not come from you.

Read what it actually contains, because it is less than it looks. There is a symptom in it — the button does nothing — and there is a person's guess folded into the same sentence, and from outside the app those two arrive looking identical. It does not say what happened after they pressed. It does not say whether anything on the page moved. "Might be me" is the reporter telling you, accurately, that they have no idea what they are looking at, and there is no reason they should.

And there is somebody on the other end of it. They wanted to follow a person back, they pressed a button several times, they gave up, and now they are waiting to hear whether the thing you sent them is worth opening again. That waiting does not pause while you work. It is the one thing that separates this from every check you have run so far: those you started, at a moment you chose, on an app nobody else was looking at.

### Go and look

The first move is not a message to your agent. It is a trip to your own app.

Open the live link and do the thing the report describes. In the story, that meant signing in as bob in the second browser — on a phone, in fact, which is nearer to what the reporter was holding — finding a profile bob did not already follow, and pressing Follow.

That is **reproduce** (a one-line definition: opening the deployed app, following the steps in the report, and confirming you see the same wrong thing, [→ GLOSSARY](../../GLOSSARY.md#reproduce)), and for now it is the whole of the job.

Here is what they saw. They pressed Follow. Nothing on the page changed — the button still said Follow, the follower count under the name did not move, nothing appeared and nothing complained. So far, the report.

Then they reloaded the page. The button said Following, and the count had gone up by one.

Which is a different fault from the one that was reported, and it took about ten seconds to find. The follow had worked. Every press the reporter made had gone somewhere. What never happened was the screen saying so — and that is why a person pressed a working button several times and concluded the app was dead.

Notice how much of that came from doing two things in order rather than one. Press, then reload and look again. It is the same second move Module 5 built into every refusal check, for the same reason: *nothing happened on screen* and *nothing happened* are two different findings, and only the reload separates them.

Notice also where you stop. You now know the press lands and the screen does not show it. You do not know why, you have not looked, and you are not going to. Why a page shows one thing while the app underneath it holds another is your agent's side of the line and has been since Module 2.

### What you hand over

What you write now is a recovery prompt, sent from a starting point the last module did not cover: somebody else opened this, and you are the one who went and looked.

> "On my live app, signed in as bob on my phone: I pressed Follow on alice's profile and nothing on the page changed — the button still said Follow and the count didn't move. I reloaded the page and it had actually followed her. Somebody using the app hit this and thought the button was dead. Find out why the page doesn't show it and fix it, then I'll run the same check again."

The jobs are the ones you already know: who you were signed in as, what you did, what you saw, and what should have been true instead — then the handover, then the clause that says how this ends.

What is different is the temptation. You went and looked, you found something the reporter never mentioned, and it feels a great deal like having found *the problem*. You found a second symptom. A sentence like *the page isn't reloading after the follow saves* is a claim about machinery you have not opened and cannot check, and a confident wrong pointer costs more than no pointer at all. *Find out why* stays the whole of your instruction.

One more thing is missing from that message, deliberately: the reporter's own words. You did not forward their message. You went and looked, and you sent what you saw.

> **Heads up — you'll meet this again.** A bug report is a piece of writing composed by somebody who is not you, and handing it to your agent word-for-word is a different act from telling your agent what you saw. Text that arrives from outside your conversation can carry sentences aimed at your agent rather than at you, and an agent reading them can set off doing something you never asked for. Lesson 3 of this module — [`03-when-what-you-paste-isnt-yours.md`](./03-when-what-you-paste-isnt-yours.md) — is about exactly that: what it looks like, where you catch it, and what to do instead. Until then, the habit this lesson just gave you is already most of the defence: you go and look, and you hand over your own words.

### The repair, and what "done" has to arrive with

The repair came back the way repairs come back: quickly, evenly, specific about what had been changed, and confident. You know by now what that tone settles on its own, which is nothing.

A fix is a change, and this one was a change to an app a dozen people were using that morning. Module 5's last lesson left you the move for exactly this: a repair is held to a stated outcome the same way a feature is, and since nobody planned this one in advance, the outcome is a line you say alongside the description — *"Done is that pressing Follow changes the button and the count on the spot, without a reload."* Which checks actually prove that, and running them, is your agent's job and stays there. Yours is the sentence saying what finished looks like from outside.

And when the work comes back reported finished with no results attached, the sentence is the one Module 4 gave you and Module 5 used again:

> "Run the checks we agreed on and show me the results first."

Refusing "done" is not suspicion and it is not rudeness. It is the only way the word *done* gets to mean anything, because the alternative is that you are taking the report's word for the report.

### The net you cast afterwards

Then the second thing, and it is not about this fix at all.

Every fix lands somewhere, and sometimes it lands somewhere nobody was thinking about. Something that had worked since Module 4 quietly stops, and the news of it arrives inside exactly the same calm sentence as the fix, because as far as the report is concerned nothing went wrong. Module 5 named that for you: a regression, and it is the reason the checking does not end when the fix is confirmed.

So after any repair — and, from the next lesson on, after any change you made on purpose — you re-run the four scenarios in [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order, unchanged. Two browsers, two people, the whole ritual. That is the regression net, and the trigger is the part worth memorising: **after any change**, not after the changes that feel risky. Which parts of an app a change can reach is not something anybody at this floor is meant to work out, which is exactly why you run all four rather than choose between them.

In the story all four came back clean. Then the owner did the last thing, which was the small one: pressed Follow on a profile and watched the button change under their thumb, with nothing reloaded. Then they went back to the person who had messaged them on Saturday morning and told them it was fixed.

That last step is not decoration. Somebody was inconvenienced by your app and then waited. Telling them is the end of the arc.

### Your turn, on your own app

Nothing of yours was repaired today, so you are running the net on an app where you expect all four scenarios to come back clean. That is the point of running it now. The net is worth having on the day it catches something, and the only way to have it then is to have run it on a dozen quiet days when it caught nothing — the same argument as every check in Module 5, and it costs about fifteen minutes.

You are also running it before you need it. In the next lesson you change something on this app on purpose, which is the first time in this course that this net has a real chance of coming back dirty.

## Exercise

Two parts: one you run, one you write. The deliverable is four scenario results plus one written message you can find again.

1. **Cast the net.** Open your live link and run the four scenarios in [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order — alice in your everyday browser, bob in a second browser or a private window. Write down the result of each one. You are expecting four clean; note anything that surprises you.
2. **Take the report at the top of this lesson.** Read it once, then stop looking at this page.
3. **Write the handover from memory.** Assume you went to your own app and saw what the person in the story saw: the press changes nothing, the reload shows it worked. Write what you would send your agent.
4. **Then look back and compare.** Check yours for the four jobs — who you were signed in as, what you did, what you saw, what should have been true. Then check it for the three things that should not be in it: a guess at the cause, a suggestion about where to look, and the reporter's message pasted in as-is.
5. **If any of the four scenarios came back wrong,** that one is real and it is yours. Write the message for it too, and send that one for real.

## Checkpoint

You've got this if you can do both:

1. Say what you do between reading a bug report and writing anything to your agent — and say why *nothing happened on screen* is not yet a finding you can hand over.
2. Say what has to happen after your agent reports the repair finished: the two things that get re-run, who runs each of them, the trigger for the net, and the sentence you send if "done" arrives with no results attached.

## Going deeper

Optional, only if you're curious:

- Run the net from your phone rather than a second browser, on the public link. It is slower and more annoying, and it is also the screen most bug reports are actually written on — which occasionally makes the difference between reproducing something and deciding the reporter must have imagined it.
- Lesson 2 is the other half of this module's job. This lesson repaired something in a build that was not yours; the next one adds something small to an app that is very much yours, with the same net run afterwards for real. Nothing to prepare there either.

## Loop check

> **Loop check — steer.** This lesson is **steer** started by somebody else. Every steer up to now began inside your own head: you asked for something and judged what came back, or you opened your app and noticed it misbehaving. This one begins with another person's sentence — written by somebody who cannot see what you can see, about a screen you have not looked at yet, and wrong in at least one detail almost every time. Which is why the first move points away from your agent entirely. A steer has to be made of what *you* saw, so the report is never the steer; it is only the reason you went and looked. Everything that made your steers good in Module 5 still applies once you get there. What this lesson adds is the step before it, and the discipline of not skipping it because somebody is waiting.

## What you just did

You watched a repair run end to end in somebody else's build — from a message that got the fault slightly wrong, through the trip to the app that turned it into something specific, to the check that closed it — and then you cast the same net across your own live app and watched all four scenarios hold. You have the trigger now: after any change, the four scenarios, in order. Today that net had nothing to catch, because nothing of yours changed. In the next lesson something of yours changes on purpose, and that is the first time it can genuinely come back dirty.

## Navigation

[← Previous: The day something breaks: four moves, in order](../05-operating/05-the-day-something-breaks.md)
[Next: Adding without breaking →](./02-adding-without-breaking.md)
