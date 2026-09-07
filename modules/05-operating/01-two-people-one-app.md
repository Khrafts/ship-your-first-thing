---
title: "Two people, one app: the ritual that re-tests everything you shipped"
module: "05-operating"
lesson_number: "01"
est_minutes: 45
prereqs: ["04-thread-project (all nine lessons)"]
updated: "2026-09-07"
deviations: []
---

# Two people, one app: the ritual that re-tests everything you shipped

By the end of this lesson you can run four checks against your live app as two people at once, and write the message to send when one of them comes back wrong.

> **Last verified:** 2026-08-19. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Why one account is not enough

Picture two versions of your app. In one, following somebody puts them in your Following list and you in their Followers list. In the other, following somebody also quietly makes them follow you back. From your own screen the two look identical. The difference is on a screen you are not looking at.

Your agent's report cannot tell you which one you have. It describes what it set out to build, in the same calm voice either way. The only thing that can tell you is a second account, in a second browser, being somebody else.

## Set up: two browsers, two people

Use the same two names every time: **alice** and **bob**. You made both at the end of Module 4. If one is missing, open your live link in the second browser and sign up, the way anybody else would. There is nothing to ask your agent for.

1. Open the live app in your everyday browser. Sign in as **alice**.
2. Open a **different browser**, or a private/incognito window. Sign in as **bob** there. (Two tabs in the same browser share one sign-in, so tabs will not do.)
3. Do something as alice. Switch windows. Look at what bob sees. Switch back.

Why a private window keeps its own sign-in is your agent's business. Yours is the switching.

## The four checks, in order

Run these against the **live** app, in this order. Two of them watch the other person's screen. Two of them try something that should be refused.

1. **Follow is one-directional.** As alice, follow bob. In bob's window, bob's profile shows alice under **Followers**, and alice does **not** appear in bob's Following list. Neither profile shows a Follow button on its own page.
2. **Feeds differ per account.** Alice's feed and bob's feed are different pages. Each shows that person's own posts plus posts from the people they follow.
3. **Nothing of the other person's is yours to change.** As bob, try to edit or delete alice's post, then alice's comment. Both should be refused. Then refresh and read alice's words: "nothing complained" is not the result you want; "the words are unchanged" is.
4. **Signed out can read, cannot act.** In a third window that has never signed in, you can read public posts, threads, and like counts, but there is nothing to press for posting, commenting, liking, or following.

From now on, run all four **after any change** to your app: a fix, a new feature, anything. You cannot see which parts of an app a change reached, so you run all four rather than guess.

## If one comes back wrong

Write a message with three parts: what you did, what you saw, and what should have been true. Then hand it over. Say the first check comes back wrong:

> "Signed in as alice, I followed bob. Then I looked at bob's profile in the other browser, and alice is in his Following list as well as his Followers. Following somebody should never make them follow me back. Find out why and fix it, then I'll run the same check again."

Leave out any guess about the cause. You are the only person who saw what the app did, and that is the whole of what you add. A guess points your agent somewhere it has no reason to look.

When your agent says it is fixed, run the same check again. The re-run closes it, not the report.

## Your turn

Run all four checks against your live app and write one message, whether or not you need it. Keep the message somewhere you can find it again.

1. Set up the two windows: alice in your everyday browser, bob in a different browser or a private window.
2. Run check 1. As alice, follow bob. In bob's window, open his profile and look at both lists. Look for a Follow button on each person's own page; there should be none.
3. Run check 2. Compare alice's feed and bob's feed.
4. Run check 3. As bob, try to change and delete alice's post, then alice's comment. Refresh and read both.
5. Run check 4. In a third window that has never signed in, read a profile, a post and its thread, and the like counts. Look for anything you can press.
6. Pick any one check and write the message you *would* send if it had failed: what you did, what you saw, what should have been true. No cause, no theory. If something did fail, send that message for real, and re-run the check once your agent says it is fixed.

## Next

Lesson 2 is check 3 going through: a build where bob edited alice's comment and the change stuck, while everything on screen looked healthy.

## Navigation

[← Previous: Likes, then live: a count that moves the instant you click](../04-thread-project/08-likes-and-go-live.md)
[Next: The fence that was down →](./02-the-fence-that-was-down.md)
