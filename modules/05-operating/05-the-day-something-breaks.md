---
title: "The day something breaks: four moves, in order"
module: "05-operating"
lesson_number: "05"
est_minutes: 30
prereqs: ["04-caught-before-it-ran"]
updated: "2026-09-08"
deviations: []
---

# The day something breaks: four moves, in order

By the end of this lesson you have four moves for the day your live app stops behaving: describe what you see and hand it over, re-run the checks after any fix, go back to a saved working version safely, and start a fresh conversation when the conversation itself is the problem.

> **Last verified:** 2026-08-19. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

<!-- No build is narrated in this lesson: every scene here is second-person rehearsal, not a claim about the 2026-07 build run. Neither the grounded nor the staged-story comment applies. -->

On a break-day you did not pick the time or the feature, and the app stays up with people able to open it. So the moves are decided in advance. Two you run every time. Two you reach for when going forward has stopped paying.

## Move 1 — Describe what you see

Three things: **where** you were looking (your live link, on your phone or in a browser), **what the page showed**, in the plainest words you own, and **since when** ("this morning", "since Friday").

```prompt
On my live link, opening any profile shows a blank page since this morning. Find out why and fix it.
```

No guess at the cause. *Find out why* is the whole instruction.

A page that has fallen over can be described without reading it. A block of red text where your feed used to be, an empty page, a section that has gone: say where it is and what it replaced. Reading the words in it is your agent's job.

If your agent says something it needs is not installed or set up:

```prompt
Install or set up whatever is missing. Ask me only for the things only I can do, and tell me when it's ready.
```

## Move 2 — After any fix, re-run the checks

A fix is a change, and a change can break something else that was working. The fix report will not tell you, because as far as the report is concerned nothing went wrong.

Two sets of checks run after any fix.

**Your agent's.** Nobody planned this fix, so you say what done means when you hand it over:

```prompt
Done is that I can open any profile and see it. Run that check and show me the result before you say done.
```

If the work comes back without results:

```prompt
Run the checks we agreed on and show me the results first.
```

**Yours.** The four checks from [Lesson 1](./01-two-people-one-app.md), in order, on the live link. Then the thing that was broken this morning, done again from the outside. That closes it, not the report.

<a id="move-3--go-back-when-forward-is-losing"></a>

## Move 3 — Go back when forward is losing

Some fixes do not land. You describe, your agent changes something, and it is differently wrong. Round two is differently wrong again. That is when you go back to a saved working version instead of trying a third round.

**What going back does and does not do.** It restores the files your agent wrote: the pages, the plan, the settings in the project. It does **not** undo anything outside those files. What people have typed into your app since then stays where it is stored. An email that went out stays sent. Anything you changed on a dashboard stays changed. On a live app, the part outside the files is the part other people are using.

So on a live app, ask before you say the sentence:

```prompt
Which saved working version is from before this started, and what does its note say? If we go back to it, what changes on my computer, what changes on the live link, and what stays exactly as it is — including anything people have typed in and anything on a dashboard?
```

Wait for the answer. The version it names should be the one whose note describes the app as it was when it last worked. If the newest save is not that one, because you saved something this morning that turned out to be part of the problem, say so:

```prompt
Not that one; the one whose note says ___.
```

The list of what stays as it is should hold no surprise. Then the sentence, with the version you agreed on:

```prompt
Take us back to the saved working version whose note says ___.
```

Your agent does all of it. Going back costs you the work since that save, which is the reason to say *save this as a working version* often on ordinary days.

**After a restore**, run the four checks again on the live link, because going back is itself a change. If the live link still shows what it showed this morning, say so and ask what it would take to bring the live copy in line with the version you went back to, and what that would change, before you say yes. Then:

```prompt
What outside the files might not match the version we went back to?
```

Then hand the problem over again, from the description you wrote in Move 1.

## Move 4 — Start a fresh conversation

When you have explained the same thing a third time and the replies keep going somewhere you did not ask for, the conversation is the problem, not the app. Start a fresh conversation. Your app, your saved versions, and your plan are all still where they were.

You carry two things across. The plan comes by itself, because your house rules have your agent read it at the start of every conversation. And you bring your description: where, what the page shows, since when. Do not carry across a summary of everything already tried; that is how the tangle follows you.

## The order

Move 1 always, first. Move 2 always, after any fix and after any going-back. Moves 3 and 4 when forward has stopped paying, and the only mistake with either is reaching for it late.

None of the four asks you to know what broke or to read anything your agent wrote. You look at your app, say what it is doing, and keep saying it until the app agrees with you again.

## Your turn

A rehearsal. Nothing on your app changes. The only thing you send is a question.

1. Picture opening your live link on your phone and finding every profile blank: yours, alice's, bob's. Everything else looks normal, and you have not touched the project since last week.
2. From memory, write the message you would send: where, what the page showed, since when, and the handover.
3. Compare with the one in Move 1. Check for what should not be there: a guess at the cause, a suggestion about where to look.
4. Open your agent app and ask the Move 3 question in your own words: which saved working version is the last one from when the app was working, what its note says, and what would change on your computer, on the live link, and not at all if you went back to it. If your agent asks to run something so it can look, approve it. If it offers to go ahead and go back:

   ```prompt
   Not today — just the answer.
   ```

   Write the answer down: the version, its note, and the list of what would stay as it is.
5. Look at the gap. What would going back cost you today? If the honest answer is "more than I would like", say *save this as a working version* more often. What would it not bring back? Whatever your agent listed as staying put is the part of your app that lives outside the files.

## Next

Module 6 is about changing an app that is already running: fixing and adding without breaking what works.

## Navigation

[← Previous: Caught before it ran: the question that goes before you press anything](./04-caught-before-it-ran.md)
[Next: Module 6 — After it's live →](../06-after-live/README.md)
