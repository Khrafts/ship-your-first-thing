---
title: "The fence that was down: the check that settles what an answer can't"
module: "05-operating"
lesson_number: "02"
est_minutes: 40
prereqs: ["01-two-people-one-app"]
updated: "2026-09-08"
deviations: []
---

# The fence that was down: the check that settles what an answer can't

By the end of this lesson you can catch a hole that testing on your own account can never show you, by trying the forbidden edit as a second person on your live app. If it goes through, you hand it over and re-run the check once it is fixed.

> **Last verified:** 2026-08-19. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

This lesson tells you about a build that was not yours, then has you run the same check on your own app. Your app is not expected to have this fault. The check is the part you run for real.

## What happened in that build

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Somebody built the comments feature with the same rule you used: people can only edit or delete their own comments. Their agent built it and reported it done, with its checks shown.

They tested it from one account. Left a comment, edited it, saw `· edited` appear. Opened a post in a signed-out window and found nowhere to type. Everything passed. Mid-build they had also asked whether one person could change another person's words, and got a calm, specific no.

Then, two browsers. Alice wrote a comment. Bob opened the same post in the other window, and there was an Edit link on alice's comment. He changed a word and saved. The page showed bob's words under alice's name. He refreshed. Still bob's words. No error, no warning.

Two things to take from it. Your agent will ship a hole and hand it over in the same calm voice as a good afternoon's work; it does not warn you. And an answer that sounds right settles nothing. Only pushing on the door does.

## What a refusal looks like

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6); presented in the desktop app's framing. -->

When this feature was really built for this course, the fences held. But one of them held silently: an attempt to delete somebody else's comment produced no error at all. The comment was simply still there afterwards.

So the check is two moves. Try the forbidden thing, then refresh and read what is actually there. A forbidden edit that quietly does nothing is the fence holding. One that quietly works is the fence down.

The other tell: in that real build, somebody else's comment showed no Edit and no Delete at all, while your own showed both.

## Check it on your app

Two windows, as in Lesson 1: alice in your everyday browser, bob in a different browser or a private window.

> **TRY THIS:** signed in as bob, open a post alice wrote and find a comment of hers under it. Look for any way in to her words: an Edit link, a box you can type in, anything. If there is one, use it: change a word and save.
>
> **EXPECT:** nothing to click in the first place, or an attempt that is refused. After a refresh, alice's comment reads exactly as alice wrote it.
>
> **IF IT WORKS:** it is not yours to fix. Send the message below.

## If it goes through: the message

```prompt
Signed in as bob, I edited a comment alice wrote, and the change stuck. Only a comment's author should be able to change it. Find out what allows this and fix it, then I'll run the same check again.
```

Swap in your own names and what you actually tried. Four things, in order: who you were signed in as, what you did, what you saw, what should have been true. Leave out any guess at the cause. A guess is the one thing in the message that can do damage.

## What closes it

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

In that build the fix came back quickly, with a calm account of what changed and an assurance that only a comment's author could edit it now. Which is what the first answer had said.

So the person went back to the two windows. Alice's comment, bob's screen, same post. No Edit link, no way in. That closed it. The second assurance read exactly like the first and settled nothing.

## Your turn

Run the check against a comment and a post, and write the message you would send.

1. Set up the two windows. If alice has no comment anywhere yet, post something as alice and comment on it as alice.
2. As bob, open that post and find alice's comment. Look for an Edit link, a Delete, or a box that takes a cursor. If you find one, use it: change a word and save.
3. Refresh and read alice's comment. It should say exactly what alice wrote.
4. Do the same two moves against alice's post itself: try to change it, try to remove it, refresh, read.
5. Write the message for whichever of the two you would rather not have go through. No guess at the cause. End with the clause about running the check again.
6. If either one did go through, send that message for real. When your agent says it is fixed, repeat steps 2 to 4.

## Next

Lesson 3 is a failure that never announces itself, even when somebody pushes on it: a feed reported finished, quietly missing its owner's own post.

## Navigation

[← Previous: Two people, one app: the ritual that re-tests everything you shipped](./01-two-people-one-app.md)
[Next: The missing post →](./03-the-missing-post.md)
