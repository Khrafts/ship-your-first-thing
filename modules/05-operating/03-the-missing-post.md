---
title: "The missing post: broken by what it doesn't show"
module: "05-operating"
lesson_number: "03"
est_minutes: 30
prereqs: ["02-the-fence-that-was-down"]
updated: "2026-08-19"
deviations: []
---

# The missing post: broken by what it doesn't show

## Learning objective

By the end of this lesson, you will be able to catch a feature that is broken by what it doesn't show — by doing the most ordinary thing your app does and then looking for the one item that should have landed — and to name what is missing precisely enough that your agent can go and find why.

## Why this matters

Every failure this course has put in front of you so far has been the kind that answers back. You push on a door that should hold, and it either holds or it doesn't; either way something happens and you are standing there when it does. This one never answers. The screen is full, nothing is red, the report says finished — and the one thing that should be on the page isn't, which looks exactly like a page. "Done" plus a screen that looks like it works is a very convincing imitation of checked, and this lesson is about the difference between them.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. The failure it walks through comes from a build that is not yours — your app is not expected to have it, and the checks are the part you run for real.

> **Last verified:** 2026-08-19. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

Nothing gets built in this lesson, and nothing of yours gets broken. The split has not moved: your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save.

This is the second **watch-it-fail walkthrough** (a one-line definition: a story about a build where the agent shipped something known to be bad, told so you can practise the recovery before the app in question is yours, [→ GLOSSARY](../../GLOSSARY.md#watch-it-fail-walkthrough)) of three, and it runs the way the last one did: watch somebody else's build fail, run the same check on your own live app where you expect it to hold, write the message you would have sent if it hadn't. What changes is the failure: the last one had to be provoked, and this one sat in plain sight on a page its owner opened every day and still went unseen.

### The feed that looked finished

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Another build, a chunk earlier than the last one: the home feed. The same feature you built in the middle of Module 4, asked for the same way — the newest posts from the people I follow, and my own posts too, newest at the top. The agent planned it, built it, ran its checks and reported it finished.

And it looked finished. The home page had a feed on it: real posts from the accounts they had followed, names and photos attached, newest at the top and older ones down the page. Bylines went through to profiles; follow somebody new and their posts turned up. Nothing blank, nothing broken, nothing red. They used the app like that for days.

What they never did in those days was look for one specific thing: something they had written themselves. Their own posts were not in that feed. Not late, not out of order, not in a second list further down — absent. Every one was fine on their profile, exactly where they had written it, so nothing was lost and nothing failed loudly enough to notice. Their feed was a version of the app in which they had never written anything, and a feed like that looks precisely like a feed.

### Why nothing caught it

Nothing caught it because there was nothing to catch.

Think about how you have found problems so far. A page that will not load. A button that does nothing. A door that opens when it should have held. Every one is an event — you are there when it happens. A missing post is not an event. It is a thing that fails to happen, on a page busy with things that are happening, and no screen in that app will ever show it to you. Even the person whose posts are absent sees a page that behaves perfectly.

And the report said finished, in the same steady, well-organized voice every chunk that went right had been reported in. That was not a lie and not carelessness: your agent describes the work it set out to do, and it cannot stand where you stand and look at your feed with your eyes. "Done" is a statement about the work, never about your app. The only thing that can tell you about your app is your app.

### One thing you can do with your hands

So the whole of this test is behaviour — nothing to open, nothing to read. The check for this failure, entire:

> Post something, open your feed, and look for it.

There it is: pass. Not there: the catch — and the catch is all of it. You do not need to know why your own post is missing, and nothing in this course will ask you to.

One distinction before you run it, because a feed is full of things that are legitimately absent. Somebody you do not follow does not belong in your feed — that absence is the feature working. Your own post is the one absence that is never correct: you asked for the people you follow *plus you*, and you cannot follow yourself. So the check works by making a post and looking for it, rather than by reading the page and asking whether it seems about right.

### When this feed was really built for this course, the check passed

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c5); presented in the desktop app's framing. -->

Same as last lesson: the build this course was made from does not have this fault. The feed chunk was checked for exactly this, in the situation that hides it best — a new account following nobody, where a feed of only the people you follow comes back empty and looks entirely reasonable doing it.

Bob signed in, following no one, with nothing written. His feed said so in plain words: "Your feed is empty. Follow someone, or write your first post on your profile." He wrote a post from his profile and went back to the home page, and there it was — on a feed belonging to somebody who follows nobody. Then Alice, who had followed Bob, opened hers: Bob's newest at the top, her own from two days earlier underneath — one stream, not his posts in one block and hers in another.

That is the healthy version, and it is what yours should do. The build above is a story about one that didn't — told because a check you have only ever watched pass is the easiest kind to stop running.

### Your turn, on your own app

Two accounts again, the two windows from Lesson 1: alice in your everyday browser, bob in a different browser or a private window. No forbidden move this time: you do the most ordinary thing your app does, then look at one page.

> **TRY THIS:** as alice, write a post. Then open the home page and read down the feed until you find it. Do the same in the other window as bob: write a post as bob, open bob's feed, look for it.
>
> **EXPECT:** each post on the feed of the person who wrote it, at or near the top — and bob's own post on bob's feed whether or not bob follows anybody at all.
>
> **IF IT'S MISSING:** it is not yours to fix. Write the message below and hand it over.

Yours will almost certainly be there; your build was held to this check as it was made. Run it today anyway, because a check you have run on a calm afternoon is one you will still know how to run on a day that isn't.

### The message you would send

If a post of yours is ever not there, what you write is a **recovery prompt** (a one-line definition: the message you write after a check comes back wrong — you say exactly what you did and what you saw, then ask your agent to find and fix it, [→ GLOSSARY](../../GLOSSARY.md#recovery-prompt)). This failure has two faces, so there are two of them:

> "I posted something and then opened my feed, and it's completely empty even though I can see the post on my profile. Find out why my own posts aren't in my feed and fix it."

> "I see posts from people I follow, but never my own. I want both in the feed. Find out why and fix it."

Send the first if your feed came back with nothing on it at all — the shape this takes when you follow nobody and the only posts that could have been there were your own. Send the second for the build above: a feed with plenty on it, quietly missing you. Swap in your own words for what you saw.

Each does the same three jobs and then stops. What was done — *I posted something and then opened my feed*. What was seen, in the plainest terms — *it's completely empty*, *never my own*. What should have been true instead, which the second says outright: *I want both in the feed*, so what counts as correct is not left to somebody who wasn't there. Then the finding-out is handed over — the part that was never yours. The one extra clause, *even though I can see the post on my profile*, is a second observation and not a theory: it settles that the post exists, so nobody goes off checking whether the writing went through. Observations are the only thing you can safely add: you are the only person here who has looked at the screen. A guess at the cause reads like helping and sends your agent somewhere you have no reason to send it.

The end of this one is the end of the last one. The fix comes back with a calm account of what changed and an assurance that your posts are in the feed now — with exactly the standing the first report had. Post something, open your feed, look for it. That is what closes it.

## Exercise

Run the check from both seats, and write down which of the two messages you would send. The deliverable is two feeds looked at with your own eyes, plus one written line naming a message and the reason for it.

1. **Set up the two windows.** Your everyday browser signed in as alice; a different browser, or a private window, signed in as bob.
2. **Post as bob, then look at bob's feed.** Write a post as bob, then open bob's home page. Bob's own post should be there — and it should be there regardless of how many people bob follows, including none.
3. **Look for bob's post in alice's feed.** Switch windows. If alice already follows bob — she probably does, from Module 4 — bob's new post should be sitting at the top of her feed. If she doesn't follow him, it should not be there at all, and that is the app being right rather than wrong. Follow bob from alice's window and look again: now it is there.
4. **Post as alice, then look at alice's feed.** The same move as step 2 from the other seat: alice's own post at the top of alice's own feed, with bob's underneath, newest first.
5. **Write one line.** If bob's own post had been missing from bob's own feed in step 2, which of the two messages in this lesson would you send — and why, in one sentence? Save it with the message you wrote last lesson.

## Checkpoint

You've got this if you can do both:

1. Post from each of your two accounts and say, before you look, exactly what each feed should have on it — including which absence from alice's feed would mean the app is working and which would mean it is not.
2. Say which of the two messages fits a feed that came back completely empty and which fits a feed that came back full, and say what the clause about seeing the post on your profile is doing in the first one.

## Going deeper

Optional, only if you're curious:

- The same check has the same shape on anything you build later that gathers things from more than one place — a notifications list, a search results page, an inbox. Make the thing yourself, then go and look for it where it should have landed. The absence worth checking for is always your own.
- Lesson 4 is the last of the three, and its failure hasn't happened yet at the moment you catch it: a change handed to you to run against your live app that would have taken real information with it. The instrument changes — a question you ask before you press anything, rather than a look at the app afterwards. Nothing to prepare.

## Loop check

> **Loop check — evaluate.** This lesson is **evaluate**, pointed at the app rather than at an answer. There is almost nothing to the doing of it: one post, one page, one look. What makes it hard is that a page full of correct things tells you nothing at all about the one thing that is not on it — so evaluating here means deciding what should be there *before* you look, and then going to find that specific thing, instead of reading the screen and asking yourself whether it seems fine. Seems fine is what this failure is made of.

## What you just did

You met a build whose feed was reported finished while quietly leaving out everything its owner had written, and then you did the ordinary thing on your own live app from both seats — posted, opened the feed, went looking — and watched your own posts turn up where they belong. You also know now which absence is the app working and which is the app failing, which is what makes this check something you can run rather than something you squint at. Two failures down, and both were already there when you arrived. The third one hasn't happened yet: it is sitting in a change waiting to be approved, and the only thing standing between it and information you care about is a question asked first.

## Navigation

[← Previous: The fence that was down: the check that settles what an answer can't](./02-the-fence-that-was-down.md)
[Next: Caught before it ran →](./04-caught-before-it-ran.md)
