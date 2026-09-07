---
title: "A bug report arrives: the steer that starts with somebody else's words"
module: "06-after-live"
lesson_number: "01"
est_minutes: 40
prereqs: ["05-operating (all five lessons)"]
updated: "2026-09-07"
deviations: []
---

# A bug report arrives: the steer that starts with somebody else's words

By the end of this lesson you can take a fault somebody else reported, see it in your own app first, hand over what you saw, and re-run the checks once the repair comes back.

> **Last verified:** 2026-08-20. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

This lesson follows a repair in a build that was not yours, then has you run the after-a-change checks on your own app.

## The message

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Somebody's app has been live for a month, with the link out to a dozen people. On a Saturday morning, one of them sends this:

> "Hey — is your app broken? I tried to follow you back this morning and the follow button doesn't do anything. I've pressed it a few times now. Might be me."

It contains less than it looks: one symptom, and the reporter's own guess folded into the same sentence. It does not say what happened after they pressed. And there is somebody waiting to hear whether the app is worth opening again.

## Go and look

The first move is not a message to your agent. Open the live link and do what the report describes. In the story: sign in as bob in the second browser, on a phone, find a profile bob does not follow, press Follow.

What they saw: nothing on the page changed. The button still said Follow; the count did not move. Then they reloaded the page. The button said Following, and the count had gone up by one.

That is a different fault from the one reported, found in ten seconds. The follow worked; the screen never said so. Press, then reload and look again: *nothing happened on screen* and *nothing happened* are two different findings.

Stop there. You know the press lands and the screen does not show it. Why is your agent's job.

## What you hand over

> "On my live app, signed in as bob on my phone: I pressed Follow on alice's profile and nothing on the page changed — the button still said Follow and the count didn't move. I reloaded the page and it had actually followed her. Somebody using the app hit this and thought the button was dead. Find out why the page doesn't show it and fix it, then I'll run the same check again."

Who you were signed in as, what you did, what you saw, what should have been true, then the handover. Two things are deliberately missing. No guess at the cause: you found a second symptom, not the problem, and a sentence like *the page isn't reloading after the follow saves* points your agent at machinery you have not seen. And not the reporter's own words: you went and looked, and you sent what you saw.

> **You'll meet this again in Lesson 3.** Handing your agent somebody else's message word for word is a different act from telling it what you saw. Text from outside your conversation can carry sentences aimed at your agent, and an agent reading them can start on work you never asked for. [Lesson 3](./03-when-what-you-paste-isnt-yours.md) shows what that looks like and where you stop it. Until then: go and look, and hand over your own words.

## When the repair comes back

Nobody planned this fix, so you say what done means when you hand it over: *"Done is that pressing Follow changes the button and the count on the spot, without a reload."* Which checks prove that, and running them, is your agent's job. If the work comes back reported finished with no results:

> "Run the checks we agreed on and show me the results first."

Then the four checks from [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order, on the live link. A fix can break something else that was working, and the fix report will not say so. Run all four after any change, not only the changes that feel risky.

In the story all four came back clean. Then the owner pressed Follow on a profile and watched the button change under their thumb, with no reload. Then they told the person who had messaged them that it was fixed.

## Your turn

Nothing of yours was repaired today, so you are running the four checks on an app where you expect them all to pass. In the next lesson you change something on purpose, and that is the first time they have a real chance of failing.

1. Open your live link and run the four checks from [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order: alice in your everyday browser, bob in a second browser or a private window. Write down each result.
2. Read the report at the top of this lesson once, then stop looking at this page.
3. From memory, write what you would send your agent, assuming you saw what the person in the story saw: the press changes nothing, the reload shows it worked.
4. Compare. Yours should have who you were signed in as, what you did, what you saw, what should have been true. It should not have a guess at the cause, a suggestion about where to look, or the reporter's message pasted in.
5. If any of the four checks failed, that one is real. Write the message for it and send it.

## Navigation

[← Previous: The day something breaks: four moves, in order](../05-operating/05-the-day-something-breaks.md)
[Next: Adding without breaking →](./02-adding-without-breaking.md)
