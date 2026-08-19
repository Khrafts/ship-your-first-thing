---
title: "Caught before it ran: the question that goes before you press anything"
module: "05-operating"
lesson_number: "04"
est_minutes: 30
prereqs: ["03-the-missing-post"]
updated: "2026-08-19"
deviations:
  - long-core-read
  - staged-comment-wording
---

# Caught before it ran: the question that goes before you press anything

## Learning objective

By the end of this lesson, you will be able to stop a database change that would cost you real information before it ever runs — by asking one named question first and holding the answer against what is already in there — and to send back one sentence asking for a version of the same change that keeps what exists.

## Why this matters

The last two lessons put you in front of things that had already happened. Something was wrong before you arrived: a fence that was down before anybody pushed on it, a post missing from a feed its owner opened every day. Both were recoverable, and neither cost anybody anything they could not get back. This one is different in the only way that matters. The damage is still in the future at the moment you meet it, sitting in a change nobody has run yet — and the whole of your defence is a question you have been asking since your first empty app, back when there was nothing in your database worth losing. This is the lesson where there is.

> **Following along:** Unlike the other walkthroughs, this lesson runs nothing against your own live app — nothing here touches it. The failure it walks through comes from a build that is not yours, and the check is a question you rehearse now and ask for real, in the agent app you picked in Module 0, the next time your agent proposes a change to your database.

> **Last verified:** 2026-08-19. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. This walkthrough has two surfaces the danger can reach you on rather than one — your agent's own answer, and the warning your dashboard raises by itself — and the rule for the second only makes sense once you are holding the first. Splitting them would leave half a rule on either side of the break.

Nothing gets built in this lesson, and nothing of yours gets broken. The split has not moved: your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save.

This is the third **watch-it-fail walkthrough** (a one-line definition: a story about a build where the agent shipped something known to be bad, told so you can practise the recovery before the app in question is yours, [→ GLOSSARY](../../GLOSSARY.md#watch-it-fail-walkthrough)), and the last of them. The two before it ended with you standing in your own running app, doing something and looking at what came back. This one cannot end there. What goes wrong here has not happened yet at the moment it gets caught, so there is no screen anywhere showing it — and the instrument is a sentence you send before anything runs.

### A change handed over mid-fix

<!-- Deviation (staged-comment-wording): Lessons 02/03 end this comment "not the 2026-07 build, which passed this check". That clause cannot be used here — no chunk-7 evidence exists at all, so there is no run to have passed anything. The substituted clause states the absence instead. -->
<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

Another build, further along than either of the last two: live for a while, with real accounts on it and writing on it that belonged to other people. Something in the comments had started behaving oddly, and the person did the ordinary thing — said what they saw, handed it over, and let their agent go and find out why.

Their agent came back with an account of what was wrong and a file for the database, the same kind of file that had gone into the dashboard five times while the app was being built. Paste this in, it said, and that clears it. The file was full of code and none of it was for reading — cargo, the way all five of the others had been, moved whole from one screen to another.

Nothing in how it arrived marked it as different from those five. Same steady voice, same shape of handover, same screen waiting at the other end of it. And every one of those five had been an addition: things that did not exist before, going in beside things that already did.

### The question goes first

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

They did not paste it. What they did first was the thing Module 4 had made them do before all five of the others:

> **BEFORE YOU APPROVE ANYTHING THAT TOUCHES THE DATABASE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*

That is a **pre-flight question** (a one-line definition: before a step you cannot take back, you ask your agent a named question about what it changes, and wait for the answer, [→ GLOSSARY](../../GLOSSARY.md#pre-flight-question)) — one of only two checks this course teaches you to run, and the only one of the two that works on something that has not happened.

The answer came back as evenly as everything else had. It said, in plain words, that the table the app keeps its comments in would be removed and made again, and that everything sitting in it today would go with it — every comment anybody had written on that app since it went live.

There was no warning wrapped around that sentence. Nothing paused before it, nothing marked it out from the sentences either side of it, nothing asked whether that was alright. It sat in the middle of a tidy, well-organized reply, in the register a person uses to mention that they have also fixed a typo.

That is risk-blindness again, in its other shape. In Lesson 2 it was a build handed over with a fence down and nothing in the handover marking that afternoon out from any other. Here it is a change handed over that would cost real information, described perfectly accurately, in the same voice as the rest of the paragraph. Nothing weighed what this change costs if it is wrong against what it is worth if it is right — not out of carelessness, but because weighing that is not something your agent does unless somebody makes it. Your question is what makes it.

### Nothing had run yet

Here is the part worth sitting with, because it is the whole win and it does not feel like one.

Nothing happened. There is no next thing in that story. Every comment was still exactly where its author had left it, because the file was still sitting in the chat where it had been handed over, and the only events of the afternoon were one question and one answer.

That is what a caught one looks like, and it is why this is the hardest of the three to keep doing. The two before it you found by their damage — an edit that stuck, a post that was not there — and finding them was a relief, because something was visibly wrong and now you knew. This one has no damage to find. The moment you get it right feels like nothing at all: you asked something, you read a sentence, you did not press a button. A check that pays off by making the day uneventful is a check people quietly stop running, and it is the one that costs the most on the day it has lapsed.

### The other way this arrives

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6); presented in the desktop app's framing. -->

There is a second surface where this can reach you, and you met it during Module 4.

When you paste something into your Supabase dashboard and press Run, the dashboard sometimes stops you with a warning of its own, headed "Potential issue detected" — saying the query includes destructive operations and may permanently change or remove data, and offering **Run query** and **Cancel**. Module 4 gave you the rule for it, and the rule is a comparison rather than a judgement. If the warning is accounted for by the answer you already have in hand, **Run query** is the way through. If it names something your answer did not predict — or you never asked — you press nothing and hand the dialog's words back.

When this course's own build met that dialog for real, it went the harmless direction. The answer to the pre-flight question had already said that nothing existing would be touched, the dialog's warning was accounted for by that answer, and **Run query** was the right press. The dashboard had matched some wording in the file against words it treats as dangerous; it was not weighing what the file added against what it removed.

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

The day it goes the other way is the day that dialog names something your answer never mentioned. Your answer said nothing existing would be touched; the screen in front of you says this may permanently remove data. Both of those cannot be true, and you are one press from finding out which. That is a stop — and it is a stop even though you did the pre-flight properly and got a clean answer back. Especially then. A disagreement between what you were told and what a screen you operate yourself is saying is the strongest signal anybody ever hands you for free, and the only right response to it is to press nothing and say so.

### The sentence you send back

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

Stopping is half of it. The other half is that you still have the problem the change was there to fix — so what you want is not *no*, it is *the other version of this*.

What you send is your **recovery prompt** (a one-line definition: the message you write after a check comes back wrong — you say exactly what you did and what you saw, then ask your agent to find and fix it, [→ GLOSSARY](../../GLOSSARY.md#recovery-prompt)) for this check, and it is one line:

> "This would delete a table that may have real data in it — is there a way to make this change that keeps what's already there?"

Both halves are load-bearing. The first names what you were told, in your own words and without softening it: *this would delete a table that may have real data in it*. Notice *may*. You are not claiming to know what is in there and you do not have to — it is enough that the answer you were given did not rule it out.

The second half is the ask, and it is the half people leave off. *Is there a way to make this change that keeps what's already there?* — not "don't do this", not "are you sure", but a request for another route to the same place. You are not overruling the account of what was wrong; you are ruling out one way of getting there and asking for another. How that gets done stays exactly where it has always been: it is your agent's to work out, and none of the working-out is yours.

In that build, what came back was a version that changed what needed changing and left every comment where it was. The person asked the pre-flight question of that one too, because it is a question about the change in front of you and not a toll you pay once per problem. The second answer said nothing existing would be removed. That is the one that got pasted.

### Your turn, on your own app

There is nothing to break here and nothing to try. The other check you know — the **refusal check** (a one-line definition: in the running app you try the thing that should not be allowed and confirm you are turned down — and if it goes through, you tell your agent what you did and what should have stopped it, [→ GLOSSARY](../../GLOSSARY.md#refusal-check)) — needs a running app and something already built to push on. This one has neither, by design: it fires while the thing is still a proposal, which is the only moment it is worth anything.

So the drill on your own app is the ritual itself, and it is short enough to say in one breath: **before any change that touches your database, the question goes first, and you wait for the answer.** Every time. On this app and on the next one, whether you are mid-build with a plan open or fixing something on an ordinary Tuesday. Not only before a dashboard paste — before anything your agent proposes that goes near the place your app keeps things.

Three things will argue you out of it, and they are worth naming now because the exercise is written against them. You are mid-fix and you want this over. The change looks small. The last five went fine. Not one of those is a statement about what this particular change does to what you already have, which is the only thing the question is about.

## Exercise

Nothing runs, nothing changes, and your live app is not touched. The deliverable is two written lines — a question and a sentence sent back — plus what you notice when you compare them against the ones this course locked.

1. **Set the scene.** Picture your agent coming back mid-fix with a file for your database and telling you it has to go in before the thing you reported will behave. Your app is live, and your two accounts have real posts and real comments on it.
2. **Write the question from memory.** Before looking back at anything in this lesson, write down what you would send before pasting that file. Say what you want to know about the things already in there.
3. **Compare it with the locked one.** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."* Check yours for the two jobs it does: it asks whether anything existing is removed or overwritten, and it asks for the list — exactly what changes for data that exists today. A question that can be answered with "it's fine" is not this question.
4. **Write the sentence back, from memory.** Now picture the answer saying that the comments your app is holding would go along with the table they sit in. Write the one line you send in reply.
5. **Compare it with the locked one.** *"This would delete a table that may have real data in it — is there a way to make this change that keeps what's already there?"* Check yours for both halves: the plain statement of what you were told, and the request for a version that keeps what is already there. If yours only says stop, add the second half — you still have the problem the change was meant to fix.
6. **Save both** alongside the messages you wrote in Lessons 2 and 3. Three lessons, three written lines, one place to find them.

## Checkpoint

You've got this if you can do both:

1. Say, without looking it up, the question you send before any change that touches your database — and say what you do when the answer names something already in there as being removed, and what you do when the dashboard's own warning says something the answer never mentioned.
2. Say what the second half of the sentence back is for, and why "don't run it" on its own is a worse message than the one this lesson gives you.

## Going deeper

Optional, only if you're curious:

- The same question fits anything that cannot be taken back, not only databases. Sending mail to real addresses, taking something down, changing something a live app is leaning on right now — each of those is a place to ask what this changes for what already exists, and then wait. The database version is the one you meet most often, which is why it is the one with words locked to it.
- Lesson 5 is the last of this module, and it covers the day none of these three applies: something that worked on Monday and does not on Tuesday, with nobody having proposed anything at all. What you say, in what order, and the sentence that takes you back to the last version that worked. Nothing to prepare.

## Loop check

> **Loop check — ask.** This lesson is **ask**, at its narrowest: one question with a known shape, sent at a known moment, before a known kind of step. Every other ask in this course has been a request for work to happen. This one asks for nothing to be done at all — it asks what a proposed piece of work would cost, and then it waits, which is the part that makes it a check rather than a courtesy. The sentence you send back is an ask too: it asks for another route to the same place, and leaves the route to the only party who can work one out.

## What you just did

You met the third and last of the three builds, and this one never got as far as breaking: a change that would have taken real information with it, stopped by one question asked before anybody pressed anything, and turned into a workable one by a single sentence sent back. You wrote both of those in your own words and held them against the wordings this course locked. That gives you all three shapes a failure comes in — one already done and visible the moment somebody pushes on it, one already done and invisible until you go looking, one not done at all and never going to be. What is left is the day it is none of the three, and that is the next lesson.

## Navigation

[← Previous: The missing post: broken by what it doesn't show](./03-the-missing-post.md)
[Next: The day something breaks →](./05-the-day-something-breaks.md)
