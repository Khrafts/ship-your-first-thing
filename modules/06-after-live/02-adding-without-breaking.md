---
title: "Adding without breaking: one new thing, and proof the rest still works"
module: "06-after-live"
lesson_number: "02"
est_minutes: 55
prereqs: ["01-a-bug-report-arrives"]
updated: "2026-08-20"
deviations:
  - long-core-read
---

# Adding without breaking: one new thing, and proof the rest still works

## Learning objective

By the end of this lesson, you will be able to add one small new feature to your live app by saying what you want at the feature level, writing the definition of done into the ask itself so your agent has to prove the work before it may call it finished, and then confirming with your own eyes both that the new thing behaves and that nothing else stopped.

## Why this matters

Everything you have built so far landed somewhere forgiving. Module 4's chunks stacked onto an app that was private and mostly empty, where the worst case was a feature that did not work yet. Module 5 taught you to hold a live app steady without changing a thing on it. The last lesson watched a repair run in somebody else's build and had you run the net on your own. Today you change your own running app on purpose, while it is live at its link and people can open it. The risk is not that the new thing fails — you will see that in about ten seconds. The risk is the other one: something you finished weeks ago quietly stops working, the new feature looks perfect, and nothing in what your agent tells you distinguishes the two.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. Your agent's exact words will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-20. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. It carries one build from the ask to the save, and the ask itself is the lesson — splitting the read would separate the ask from the proof it is written to force.

Nothing about the split moves today, and it is worth saying out loud before anything gets built, because this is the lesson where the temptation to help is strongest. Your agent owns where the new thing is stored, the rules about who may change it, how it gets onto the page, and every save into your project's history. You own saying what you want, writing down what finished means, opening the running app and looking, running your checks, and saying when to save.

**What you are adding:** one more line on the profile. A short, single-line **currently** — what that person is working on right now. It sits with the name and the bio on the profile page you built in [Module 4 Lesson 3](../04-thread-project/03-profile.md). Anyone can read it. Only its owner can change it.

That is deliberately small. It is an **additive feature** (a one-line definition: a new feature you add to a working app without breaking the parts that already work, [→ GLOSSARY](../../GLOSSARY.md#additive-feature)), and small is the whole point of the first one you do on a live app. You want the new thing to be simple enough that if something goes wrong afterwards, there is no argument about what caused it.

The access question on it is one you have already answered twice. Module 1 gave you the door staff and the list they hold: getting through the door is one thing, and being on the list for a particular thing is another. The currently line is on the same list as the name and the bio — everyone may read the profile, and the list says exactly one person may write on it. You are not being asked to build that fence or to check how it was built. You are being asked to push on it afterwards, which is a different job and yours.

### Saying what you want, at the level you want it

The ask goes out at the level of the feature, in the words you would use to describe it to a friend. Not where it is stored, not what it is called underneath, not how the page gets it — those are the parts you have never written and are not going to start writing today.

What is new is what goes in the ask alongside the description.

### The ask that carries its own definition of done

Until now, the **definition of done** (a one-line definition: the checks your agent must run and show you, in plain words, before it is allowed to say a piece of work is finished, [→ GLOSSARY](../../GLOSSARY.md#definition-of-done)) arrived from the outside. Module 4 printed one at the end of each chunk, and your job was to hold your agent to it. Nobody is printing this one. You are adding something to your app that no lesson planned, so the list of what must be true before "done" is allowed out is yours to write — and the place to write it is inside the ask itself, before any work starts.

That ordering matters more than it looks. A definition of done written afterwards is a complaint. Written into the ask, it is a condition: your agent knows before it begins that finishing means demonstrating, not announcing.

Here is the whole ask, gate included:

> "On my live app I'd like one more line on the profile: a short single-line 'currently' — what that person is working on right now. It sits with the name and the bio, anyone can read it, and only its owner can change it. It's optional, so a profile with nothing in it should look normal rather than broken.
>
> Plan it before you write anything, and tell me whether this touches anything already stored.
>
> Before you tell me this is done, run these and show me what each one did:
>
> - I can set my own currently line, save it, and it is still there after a refresh.
> - Someone else's profile shows their currently line and gives me no way to change it.
> - A profile with no currently line set reads normally, with nothing broken or empty-looking on it.
> - The four checks I run on this app after any change still pass — the two-account ones and the signed-out one. Tell me what each one did."

Read what those four lines have in common. Every one of them is an outcome somebody could watch happen on a screen. None of them names a file, a rule, a tool, or a technique, and none of them could be satisfied by your agent describing its own work back to you. That is the test for a line belonging in a definition of done: could a person with no idea how the app is built watch it be true or not true? If not, it is a description, and descriptions are what this list exists to replace.

The fourth line is the one that makes this a live-app ask rather than a Module 4 one. Those four checks are the scenarios in [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md) — the ones you ran in the last lesson on an app where nothing had changed. Pointing your agent at them is not the same as running them, and it does not retire your own turn with them. It is the difference between your agent knowing what it is expected not to break and finding out afterwards.

### The question before anything touches what is already there

A new line on a profile is a change to what your app stores, and your app now stores real things: two profiles with photos on them, posts, follows, a comment thread. Module 4's last chunk widened one rule for exactly this moment, and it has been waiting for a day like today.

Before you approve anything that touches your database — whether it arrives as a file for you to paste on your dashboard, [the way every one in Module 4 did](../04-thread-project/04-posts.md), or as a step your agent asks you to approve — one thing goes first. It is a **pre-flight question** (a one-line definition: before a step you cannot take back, you ask your agent a named question about what it changes, and wait for the answer, [→ GLOSSARY](../../GLOSSARY.md#pre-flight-question)), and it is the same sentence you have sent before every one of these:

> **BEFORE YOU APPROVE ANYTHING THAT TOUCHES THE DATABASE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*
>
> **THEN THE ADJUDICATION RULE:** if a dashboard warning appears that the answer did not predict, stop and hand the warning's words back.

Then wait for the answer, and read it for one thing: does it name what already exists — your profiles, your posts, your follows, your comments — and say what happens to each? On this change the honest answer should be that nothing existing is removed or replaced and one new line is added alongside. An answer that only describes what is being added has not answered the question, and the fix is to ask it again rather than to work out what it meant.

Your agent will not raise this on its own. It will describe a change that cannot be taken back in the same even voice it uses for renaming a button — not carelessly, but because weighing what a step costs when it goes wrong is not something it does unprompted. Module 5's third walkthrough, [Caught before it ran](../05-operating/04-caught-before-it-ran.md), is where you watched that play out and where the question earns its keep. Today you are asking it for real, on your own data.

### When "done" comes back

Two ways it can come back, and only one of them is finished.

If the report arrives with the results — each line of your gate, and what happened when it was checked — read it for coverage rather than for tone. Every line you wrote has an outcome next to it, or the gate was not run.

If it comes back reported finished with nothing attached, you already have the sentence, and it has not changed since Module 4:

> "Run the checks we agreed on and show me the results first."

That is the entire ritual on your side. You do not argue about whether the work is done, and you do not go looking for yourself. You ask for the thing you agreed on before the work started, which is why writing it into the ask was worth the extra minute.

### Go and look

Your agent's report is a layer, not the answer. Open the live app.

Sign in as your first account, set a currently line on your own profile — a genuine one, a few words about what you are actually doing — and save it. It appears with your name and your bio. Refresh the page: still there. Then open your second account's profile and read the line it has, or the profile as it looks with nothing set.

Then one more look, from the seat you have not used yet: open a window that has never signed in and read a profile from there. *Anyone can read it* was half of what you asked for, and a window with nobody signed into it is the only place that half is visible. The line reads, and nothing on the page invites you to change it. That is what the rest of the world sees.

This is the part nobody can do for you, and it is not a formality. You are the only person in this exchange who knows what you meant by "a short line about what you're working on", and a feature can pass every check on the list and still not be the thing you asked for.

### The refusal check, on the new surface

Then the one that pushes rather than watches. This is a **refusal check** (a one-line definition: in the running app you try the thing that should NOT be allowed and confirm it is refused — and if it goes through, you tell your agent what you did and what should have stopped it, [→ GLOSSARY](../../GLOSSARY.md#refusal-check)), pointed at the new line, because the new line is a new place with somebody's name on it — and every new place with somebody's name on it gets one.

> **TRY THIS:** signed in as your second account in a different browser, open your first account's profile and try to change its currently line — including by opening that profile's editing address directly.
>
> **EXPECT:** no way to change it, or the attempt refuses. Refresh afterwards and read the line: it still says what its owner wrote.
>
> **IF IT WORKS:** hand it back in one sentence — *"Signed in as bob, I changed alice's currently line and the change stuck. Only a profile's owner should be able to change it. Find out why and fix it, then I'll run the same check again."*

The refresh at the end is not optional and it is the half people skip. Nothing visibly happening and nothing actually happening look identical from the outside, and only reading the line afterwards separates them.

### The net, for real this time

Now the four scenarios in [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order, unchanged. Two browsers, two people, the whole ritual — exactly as you ran it in the last lesson.

The trigger has not changed either: after any change. What has changed is your position. Last lesson you ran the net on an app where nothing of yours had been touched, and all four came back clean because there was nothing for them to catch. Today you changed something. This is the first time in this course that the net has a real chance of coming back dirty, and that possibility is the reason the habit was worth building on a quiet day.

Note also that your agent reported on these same four. Running them yourself anyway is not a lack of trust and it is not duplicated work: your agent checked the app it believes it built, and you are checking the app that is actually live, as two people, in two browsers, with your own hands.

### If one comes back dirty

Say it plainly, because this is the outcome the whole module has been preparing you for. A scenario that passed last lesson and fails this one is a regression: something that worked has stopped working because of a change made somewhere else. It has nothing to do with the currently line except in timing, and timing is the most useful thing you know.

Three moves, in order.

**Do not save.** The sentence that saves a working version is for a version that works. A save made now records the broken state as the one you would go back to.

**Write it the way you have written every one of these** — what you did, what you saw, what should have been true instead — and add the one clause that only exists today:

> "Signed in as bob, I opened my feed and alice's posts are missing from it. Each account should see its own posts plus the people it follows. This passed the last time I ran these, before we added the currently line to the profile. Find out why and fix it, then I'll run the same check again."

*This passed before we added the currently line* is not a guess at a cause. It is a fact about when you saw each thing, it is the sort of fact nobody but you can supply, and it narrows the search without pointing your agent anywhere. That is the exact line between what you are allowed to say and what you are not: when things happened is yours; why they happened is not.

**Then run the whole net again** when the repair comes back — not only the scenario that failed. A repair is a change, and a change is what the trigger is about.

If the same scenario keeps failing across two or three rounds, stop steering it. Module 5 left you the sentence for exactly this:

> "Take us back to the last saved working version."

Your agent does every part of that, the same as it does the saving; your side is the sentence. Then start a fresh conversation and begin this feature again from your last saved version — and because going back is itself a change, the net runs after a restore too, the same as after a fix. The saved version is why that is a small decision rather than a frightening one.

### Saving it

When the new line reads right, the refusal check refused, and all four scenarios came back clean — then, and not before:

> "Save this as a working version."

Your agent does the saving. It always has. Your verb is the one in that sentence.

## Exercise

Add the currently line to your live app. The deliverable is a running app with a working currently line on the profile, one refusal watched with your own eyes, four scenario results written down, and a saved version.

1. **Start a fresh conversation and send the ask** — the one from this lesson, or your own words carrying the same four gate lines. Write the gate into the ask before you send it, not after.
2. **Check the plan against what you asked for**, including its answer on whether anything already stored is touched.
3. **Ask the pre-flight before you approve anything that touches your database:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."* Wait for the answer, and check it names what already exists. If a dashboard warning appears that the answer did not predict, hand the warning's words back rather than pressing past it.
4. **When "done" arrives, look for the results.** If they are not there: *"Run the checks we agreed on and show me the results first."*
5. **Go and look.** Set your own currently line, save, refresh. Open the other account's profile, then open a window that has never signed in and read a profile from there — that last seat is the one that shows you what a visitor actually gets.
6. **Run the refusal check** from this lesson, as your second account, and refresh afterwards to read the line rather than taking silence for a refusal.
7. **Cast the net.** The four scenarios in [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order. Write down the result of each.
8. **If any came back wrong,** do not save. Write the message — what you did, what you saw, what should have been true, and that it passed before this change — send it, and re-run all four when the repair comes back.
9. **When the new line reads right and all four are clean:** *"Save this as a working version."*

## Checkpoint

You've got this if you can do both:

1. Say what makes a line belong in a definition of done rather than in a description of the work — and say why writing it into the ask is different from asking for it afterwards.
2. Say what you do, in order, when one of the four scenarios comes back wrong after a change you made on purpose — including the one thing you can now tell your agent that you could not tell it last week, and the one thing you must not do until the net is clean.

## Going deeper

Optional, only if you're curious:

- Add a second small thing on your own, with no lesson in front of you: pick something one line long, write the ask with its own gate, and run the same three-part close — look, push, cast the net. The second one is where this stops being a procedure you are following.
- Ask your agent what it would have done differently if you had not written the gate into the ask. The answer is usually revealing about how much of "done" is a judgement call, and whose.

## Loop check

> **Loop check — ask.** This lesson is **ask**, carrying something it has never carried before. Every ask up to now described the work: build this, change that, find out why. The judging came later, from you, once something existed to judge. This ask does both halves at once — it says what to build and what must be true before the word "done" is allowed out — and the second half is what turns a request into a condition. Notice what that costs you: nothing at the keyboard, one extra minute of thinking about what finished actually looks like from outside the app. And notice what it buys: your agent cannot report success without producing evidence, and you never have to work out afterwards whether you are being unreasonable for wanting some. A definition of done invented after a disappointment is an argument. Written into the ask, it is the terms.

## What you just did

You added something to a live app on purpose — a small one, deliberately — by writing the definition of done into the ask so that finishing meant demonstrating, then checking the new line with your own eyes, pushing on it as somebody who should not be allowed to change it, and casting the net across everything that was already working. That is the full shape of changing a running app without breaking it, and you now have it end to end. It also leaves you in a habit worth carrying into the next lesson: asking what a change touches before you approve it. In the next lesson that habit meets something new — a moment where the change waiting behind the approval prompt is not one you asked for at all.

## Navigation

[← Previous: A bug report arrives: the steer that starts with somebody else's words](./01-a-bug-report-arrives.md)
[Next: When what you paste isn't yours →](./03-when-what-you-paste-isnt-yours.md)
