---
title: "The fence that was down: the check that settles what an answer can't"
module: "05-operating"
lesson_number: "02"
est_minutes: 40
prereqs: ["01-two-people-one-app"]
updated: "2026-08-19"
deviations:
  - long-core-read
---

# The fence that was down: the check that settles what an answer can't

## Learning objective

By the end of this lesson, you will be able to catch an access hole that no amount of testing on your own account could ever show you — by trying the forbidden edit as a second person on your live app — and close it with a written message and a second run of the same check, rather than with your agent's word that it is fixed.

## Why this matters

There is a version of your app you have never seen, and from where you are sitting it looks exactly like the one you have. Same pages, same buttons, the same even report saying the comments feature is finished. The one difference lives where no single screen can show it: whether the rule about who may change whose words is the one you asked for, or one a little looser than that. Module 4 left you a rule for precisely that gap — behavior settles what wording cannot — and a promise attached to it: that you would be put in front of a build where the fence was genuinely down, rather than only told that such builds exist. This is that build.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. The failure it walks through comes from a build that is not yours — your app is not expected to have it, and the checks are the part you run for real.

> **Last verified:** 2026-08-19. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. A walkthrough carries four things in one pass — the build that failed, the check you run on your own app, the message you would send, and the re-run that closes it — and splitting them would break the one thing they are here to show you, which is the order they happen in.

Nothing gets built in this lesson, and nothing of yours gets broken. The split has not moved: your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save.

What is new is the shape. This is a **watch-it-fail walkthrough** (a one-line definition: a story about a build where the agent shipped something known to be bad, told so you can practise the recovery before the app in question is yours, [→ GLOSSARY](../../GLOSSARY.md#watch-it-fail-walkthrough)), the first of three. Each one runs the same way: you watch somebody else's build fail, you run the same check against your own live app where you expect it to hold, and you write the message you would have sent if it hadn't. Watching is cheaper than breaking something of your own to make the point, and the check is the part you keep either way.

### A build that looked exactly like yours

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Picture somebody a few days behind you, working the chunk where comments arrive: the same feature you built near the end of Module 4, with the same limit written into the ask — people can only edit or delete the comments they wrote themselves, never anyone else's. Their agent planned it, built it, and reported it done with its checks run and shown.

Then they did what you did. Left a comment and watched it land in the thread. Clicked Edit on it, changed the words, watched `· edited` arrive on the date line. Opened a post's page in a window that had never signed in, read the whole thread, found nowhere to type. Everything behaved, and everything matched what they had asked for. Every one of those checks passed, and every one of them was run from one account.

Mid-build they had also asked the question worth asking: is this safe — can one person change another person's words? The answer came back sounding the way a solid answer sounds: unhurried, specific, working through the thing rather than waving at it, and landing on a plain yes — only a comment's author can change that comment. Nothing in it read as thin or evasive. It was calm, it was organized, and the app on screen agreed with it.

Module 1's door staff are still working this door. Everyone who signs in gets a stamp on the way past, and the stamp is what the staff inside read before they let anybody touch anything. The stamp this build was meant to hand out said *you may change your own words*. The one it was actually handing out said something nearer to *you may change anything in here* — a stamp that gets you backstage. From the front of the queue those two are the same stamp: same ink, same door, same staff. You find out which one you were given by walking up to a door that should not open for you and pushing on it.

So: two browsers, two people. Alice writes a comment under a post. Bob, signed in in the other window, opens that same post — and there is an Edit link sitting on alice's comment, where he should have had nothing at all. He clicks it. The comment turns into a small form in place. He changes a word and saves.

The page comes back with alice's comment reading what bob typed, still under alice's name, with `· edited` on the date line. He refreshes, because "no error" is not the same as "refused" — and it is still bob's words. Nothing errored. Nothing warned. No screen in that app looked any different after than before.

### Where the story turns

Two things went wrong there, and only one of them is about words on a screen.

The first is that the build shipped with a fence down, and nothing about the way it was handed over marked it as different from any other afternoon's work. That is **risk-blindness** (a one-line definition: your agent proposes and reports things with real consequences in the same even voice it uses for a spelling fix, because weighing what a change costs when it goes wrong is not something it does unless you make it, [→ GLOSSARY](../../GLOSSARY.md#risk-blindness)) — the name you were handed in Module 2 with a promise attached, that this module would put you in front of a real one. This is the real one, and notice what it did not look like. No warning, no hedge, no "you may want to check this before you show anyone." A fence that is down does not look like anything. It is an absence, and absences do not announce themselves.

The second is the answer. It was not a lie and it was not a lazy answer — by every mark this course has taught you to look for, it was a good one. It was also wrong, and the app it described was open to anybody with a login. Module 4's comments chunk left you the rule for exactly this moment: behavior settles what wording cannot. The app looking fine settles nothing, because a fence being down looks like nothing. The answer sounding right settles nothing either, because sounding right is a property of the sentence and not of your app. Between them they can keep a build looking healthy indefinitely, and the only thing that disagrees is somebody pushing on the door.

### What a refusal actually looks like

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6); presented in the desktop app's framing. -->

One thing to carry before you try this on your own app, because it decides whether your check tells you the truth or a comfortable version of it.

When this chunk was really built for this course, the fences held — pushed on from two accounts, and tried directly against the database besides. But one of them held in a way that could easily be read as the opposite. The attempt to delete somebody else's comment — made against the database directly, not through any screen — produced no error at all: no complaint, no warning, nothing to react to. The comment was simply still there afterwards, exactly as its author had left it.

That is what a refusal can look like — not a message, just nothing having happened. Which makes the check two moves rather than one. Try the forbidden thing, then refresh the page and read what is actually there. A forbidden edit that quietly does nothing is the fence holding; a forbidden edit that quietly works is the fence down. Only the refresh separates them.

The other tell in that real build was on the page from the start: somebody else's comment carried no Edit and no Delete at all, while your own carried both. A fence that is up tends to show up as things missing from the screen rather than as anything that talks to you.

### Your turn, on your own app

This is the **refusal check** (a one-line definition: in the running app you try the thing that should NOT be allowed and confirm it is refused — and if it goes through, you tell your agent what you did and what should have stopped it, [→ GLOSSARY](../../GLOSSARY.md#refusal-check)) you have run in every chunk since sign-in, pointed now at the one thing this lesson is about. Set up the two windows from the last lesson — alice in your everyday browser, bob in a different browser or a private window — and go:

> **TRY THIS:** signed in as bob, open a post alice wrote and find a comment of hers in the thread under it. Look for any way in to her words — an Edit link, a box you can type in, anything. If there is one, use it: change a word and save.
>
> **EXPECT:** nothing to click in the first place, or an attempt that refuses — and, after a refresh, alice's comment reading exactly as alice wrote it.
>
> **IF IT WORKS:** it is not yours to fix. Write the message below and hand it over.

Yours will almost certainly refuse; the chunk where comments arrived was checked against exactly this as it was built. Run it today anyway, on an app you expect to pass, because two minutes spent on a check that passes is what makes you quick at the one that doesn't.

### The message you would send

Say it does go through one day — on this app, or on the next thing you build with somebody else's writing in it. What you write is a **recovery prompt** (a one-line definition: the message you write after a check comes back wrong — you say exactly what you did and what you saw, then ask your agent to find and fix it, [→ GLOSSARY](../../GLOSSARY.md#recovery-prompt)), and for this check it reads like this:

> "Signed in as bob, I edited a comment alice wrote, and the change stuck. Only a comment's author should be able to change it. Find out what allows this and fix it, then I'll run the same check again."

Send it as it stands if your two accounts are named that, or swap in your own names and whatever you actually tried. Four jobs, in order: who you were signed in as, what you did, what you saw happen, and what should have been true instead. Then it hands over the part that is not yours.

*Find out what allows this* is the load-bearing phrase. You cannot see what allows it, nothing in this course has asked you to, and nothing in it ever will. A sentence guessing at the cause — *I think the rule about editing is too loose* — feels like helping, and it is the one thing in the message that can do damage: it points your agent somewhere you have no reason to point it, and a confident wrong pointer costs more than no pointer at all. You are the only person in this exchange who watched the app do the thing. That is your whole contribution, and nobody else can supply it.

The last clause is not manners either. *Then I'll run the same check again* names how this ends.

### The re-run

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

In that build, the fix came back the way fixes come back: quickly, with an even account of what had been changed, and an assurance that only a comment's author could edit a comment now.

Which is what the first answer had said.

So the person went back to the two windows and did the only thing that could settle it. Alice's comment, bob's screen, same post, same route in. This time there was no Edit link on it anywhere and no way through to the words. The attempt that had gone through half an hour earlier came back refused.

That is what closed it — not the second assurance, which read exactly like the first one and had exactly as much standing. You cannot tell a fluent right answer from a fluent wrong one by looking at it, and you never have to. The check takes fifteen seconds, you already know how to run it, and it is the only thing in this lesson that ever settled anything.

## Exercise

Run both halves of the check against your live app, and write the message you would send if either half had gone through. The deliverable is two refusals watched with your own eyes — one on a comment, one on a post — plus one written message saved somewhere you can find it again.

1. **Set up the two windows.** Your everyday browser signed in as alice; a different browser, or a private window, signed in as bob. If alice has no comment anywhere yet, write one now — post something as alice, then comment on it as alice, so bob has something of hers to push on.
2. **Push on the comment.** As bob, open that post and find alice's comment. Look for any way at all in to it: an Edit link, a Delete, a box that takes a cursor. If you find one, use it — change a word, save, and see what happens.
3. **Refresh and read it again.** This is the half that people skip. Reload the page and read alice's comment. It should say exactly what alice wrote. "Nothing complained" is not the result you are after; "the words are unchanged" is.
4. **Push on the post.** Same two moves against alice's post itself — try to change it, try to remove it, refresh, and read it again.
5. **Write the recovery prompt.** Adapt the one in this lesson for whichever of the two you would rather not have go through. Name who you were signed in as, what you did, what you saw, and what should have been true — then hand the finding-out over, and end with the clause about running the check again. No guess at the cause.
6. **If either one did go through,** send that message for real, and when your agent says it is fixed, go back to steps 2 to 4 and run the check again. The refusal closes it, not the report.

## Checkpoint

You've got this if you can do both:

1. Run the cross-account attempt on your live app against both a comment and a post, saying out loud before each one what you expect to see — and say what you would conclude if the words had changed and nothing at all had complained.
2. Write the message you would send if one of them had gone through, and say why the sentence guessing at the cause is the one to leave out, and what the last clause of that message is for.

## Going deeper

Optional, only if you're curious:

- Run the same two attempts from your phone, signed in as bob on your own data connection, on the public link rather than anything on your machine. Same expected result — and it is a useful habit for the day somebody tells you something is wrong and the only screen you have on you is that one.
- Lesson 3 is the same walkthrough shape pointed at a failure that never announces itself, even when somebody does push on it: a feed reported finished, quietly leaving out the one post its owner had just written. Nothing to prepare — the instrument is the one you already have.

## Loop check

> **Loop check — steer.** This lesson is **steer**, at its narrowest and most disciplined. The steer here is one short message, and its quality is measured almost entirely by what you managed to leave out of it: no cause, no theory, no suggestion about where to look, nothing that required you to open anything. What you did, what you saw, what should have been true — and then the handover. And a steer is not finished when your agent says the work is finished. It is finished when the check that caught the problem comes back refused.

## What you just did

You watched a build fail the one check a person testing on their own account can never run, and then you ran that same check against your own live app from a second seat — on a comment and on a post — and watched it hold. You wrote the message you would send on the day it doesn't, and you know now what closes that message out: not the fix report, which will read exactly as confidently as the answer that was wrong, but the same fifteen-second attempt, run a second time, and refused. That failure at least announced itself the moment somebody pushed on it. The next one doesn't announce itself at all.

## Navigation

[← Previous: Two people, one app: the ritual that re-tests everything you shipped](./01-two-people-one-app.md)
[Next: The missing post →](./03-the-missing-post.md)
