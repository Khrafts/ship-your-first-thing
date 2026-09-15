---
title: "The missing post: broken by what it doesn't show"
module: "05-operating"
lesson_number: "03"
est_minutes: 30
prereqs: ["02-the-fence-that-was-down"]
updated: "2026-09-08"
deviations: []
---

# The missing post: broken by what it doesn't show

By the end of this lesson you can catch a feature that is broken by what it does not show, by doing the most ordinary thing your app does and then looking for the one item that should have landed.

> **Last verified:** 2026-08-19. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

Like Lesson 2, this tells you about a build that was not yours, then has you run the same check on your own app.

## What happened in that build

<!-- Staged walkthrough story (known-bad pattern; not the 2026-07 build, which passed this check). -->

Somebody asked for the home feed the way you did: the newest posts from the people I follow, and my own posts too, newest at the top. The agent built it and reported it finished.

It looked finished. Real posts from people they followed, names and photos, newest at the top. They used it for days.

What they never did was look for something they had written themselves. Their own posts were not in the feed. Not late, not out of order: absent. Each one was still fine on their profile, so nothing was lost and nothing failed loudly. A feed missing your own posts looks exactly like a feed.

Every problem you have found so far was an event: a page that would not load, a door that opened when it should not. A missing post is not an event. Nothing on the screen will show it to you. The report said finished because your agent describes the work it did; it cannot look at your feed with your eyes.

## The check

Post something, open your feed, and look for it.

There: pass. Not there: caught. You do not need to know why.

One distinction: a feed is full of things that are correctly absent. Somebody you do not follow does not belong in your feed. Your own post is the one absence that is never correct. So make a post and look for it, rather than reading the page and asking whether it seems about right.

## When this feed was really built for this course

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c5); presented in the desktop app's framing. -->

The build this course was made from passed this check, in the situation that hides the fault best: a new account following nobody. Bob signed in with nothing written; his feed said "Your feed is empty. Follow someone, or write your first post on your profile." He wrote a post from his profile, went back to the home page, and there it was. Alice, who followed bob, saw bob's newest at the top and her own older one underneath, in one stream. That is what yours should do.

## Check it on your app

Two windows again: alice in your everyday browser, bob in a different browser or a private window.

> **TRY THIS:** as alice, write a post. Open the home page and read down the feed until you find it. Then in the other window: write a post as bob, open bob's feed, look for it.
>
> **EXPECT:** each post on the feed of the person who wrote it, at or near the top. Bob's own post is on bob's feed whether or not bob follows anybody.
>
> **IF IT'S MISSING:** it is not yours to fix. Send one of the messages below.

## If a post is missing: the message

This failure has two faces, so there are two messages.

If your feed came back completely empty:

```prompt
I posted something and then opened my feed, and it's completely empty even though I can see the post on my profile. Find out why my own posts aren't in my feed and fix it.
```

If your feed has plenty on it but never your own:

```prompt
I see posts from people I follow, but never my own. I want both in the feed. Find out why and fix it.
```

Swap in your own words for what you saw. The clause *even though I can see the post on my profile* is a second observation, not a theory: it tells your agent the post exists. Observations are safe to add. Guesses at the cause are not.

When the fix comes back: post something, open your feed, look for it. That closes it.

## Your turn

1. Set up the two windows.
2. Post as bob, then open bob's home page. Bob's own post should be there, however many people bob follows, including none.
3. Switch to alice. If alice follows bob, his new post should be at the top of her feed. If she does not, it should not be there, and that is correct. Follow bob from alice's window and look again.
4. Post as alice, then open alice's feed: her post at the top, bob's underneath.
5. Write one line: if bob's own post had been missing in step 2, which of the two messages would you send, and why? Keep it with the message from Lesson 2.

## Next

Lesson 4 is a failure that has not happened yet when you catch it: a database change waiting for approval that would have deleted real data. The check is a question you ask before you press anything.

## Navigation

[← Previous: The fence that was down: the check that settles what an answer can't](./02-the-fence-that-was-down.md)
[Next: Caught before it ran →](./04-caught-before-it-ran.md)
