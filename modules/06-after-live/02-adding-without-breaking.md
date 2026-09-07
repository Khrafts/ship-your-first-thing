---
title: "Adding without breaking: one new thing, and proof the rest still works"
module: "06-after-live"
lesson_number: "02"
est_minutes: 55
prereqs: ["01-a-bug-report-arrives"]
updated: "2026-09-07"
deviations: []
---

# Adding without breaking: one new thing, and proof the rest still works

By the end of this lesson you have added one small feature to your live app, with the checks written into the ask so your agent has to show its results before it says done, and you have confirmed with your own eyes that the new thing works and nothing else stopped.

> **Last verified:** 2026-08-20. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

Your app has been public since the first chunk of Module 4. What is new today is that you are adding something nobody planned, next to features that already work and that people may be using. The new thing failing is not the risk; you will see that in ten seconds. The risk is that something finished weeks ago quietly stops, and nothing in your agent's report tells you.

Your agent owns where the new thing is stored, the rules about who may change it, how it gets onto the page, and every save. You own the ask, the checks, and saying when to save.

## What you are adding

One more line on the profile: a short, single-line **currently**, what that person is working on right now. It sits with the name and the bio on the profile page from [Module 4 Lesson 3](../04-thread-project/03-profile.md). Anyone can read it. Only its owner can change it. It is deliberately small: if something goes wrong afterwards, there is no argument about what caused it.

## Do: send the ask

Start a fresh conversation with your project folder selected. Like every ask in Module 4, this one ends with the checks your agent must run before it says done. Nobody wrote these checks for you this time, so they are in the ask below. Copy it whole, or use your own words with the same checks:

> "On my live app I'd like one more line on the profile: a short single-line 'currently' — what that person is working on right now. It sits with the name and the bio, anyone can read it, and only its owner can change it. It's optional, so a profile with nothing in it should look normal rather than broken.
>
> Plan it before you write anything, and tell me whether this touches anything already stored. If anything this needs isn't installed on this computer, tell me, install it — ask me first if it needs my approval — and confirm it works before you go on.
>
> Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing:
>
> - I can set my own currently line, save it, and it is still there after a refresh.
> - Someone else's profile shows their currently line and gives me no way to change it.
> - A profile with no currently line set reads normally, with nothing broken or empty-looking on it.
> - When one person follows another, the person followed shows them under Followers, and the follower does not appear in the followed person's Following list.
> - Two different signed-in people see different feeds, each showing their own posts plus posts from the people they follow.
> - A signed-in person cannot edit or delete another person's post or comment.
> - A visitor who is not signed in can read public posts, threads, and like counts, but cannot post, comment, like, or follow."

The last four are the four checks from [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), written out so your agent knows exactly what must still work. Every line is something a person could watch happen on a screen. That is the test for a check: could somebody with no idea how the app is built watch it be true or false?

Read the plan that comes back and check it matches what you asked for, including its answer on whether anything already stored is touched.

## Ask: before anything touches your database

Your app now stores real things: profiles, posts, follows, comments. Before you approve anything that touches the database, whether it is a file to paste on your dashboard, [as in Module 4](../04-thread-project/04-posts.md), or a step your agent asks you to approve:

> **BEFORE YOU APPROVE ANYTHING THAT TOUCHES THE DATABASE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*

Read the answer for one thing: does it name what already exists and say what happens to each? On this change the honest answer is that nothing existing is removed or replaced, and one new line is added. An answer that only describes what is being added has not answered; ask again.

If your dashboard shows a warning the answer did not predict, press nothing and paste the warning's words back to your agent. Your agent will not raise any of this on its own; [Module 5 Lesson 4](../05-operating/04-caught-before-it-ran.md) is where you watched that.

## Check: what "done" arrives with

If the report comes with the results, one for each line you wrote, read it for coverage: every line has an outcome next to it, or the checks were not run. If it comes back finished with nothing attached:

> "Run the checks we agreed on and show me the results first."

## Check: go and look

Sign in as your first account, set a currently line on your own profile, a real one, and save it. Refresh: still there. Open your second account's profile and read its line, or the profile as it looks with nothing set. Then open a window that has never signed in and read a profile from there: the line reads, and nothing invites you to change it. You are the only person who knows what you meant by "a short line about what you're working on".

## Check: try the thing that should be refused

> **TRY THIS:** signed in as your second account in a different browser, open your first account's profile and try to change its currently line, including by opening that profile's editing address directly.
>
> **EXPECT:** no way to change it, or the attempt is refused. Refresh afterwards and read the line: it still says what its owner wrote.
>
> **IF IT WORKS:** *"Signed in as bob, I changed alice's currently line and the change stuck. Only a profile's owner should be able to change it. Find out why and fix it, then I'll run the same check again."*

## Check: the four from Module 5, yourself

Now the four checks from [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order, two browsers, two people. Your agent reported on the same four; you are checking the app that is actually live, with your own hands. Today is the first time they have a real chance of failing.

## If one fails

A check that passed last lesson and fails today means something that worked has stopped because of this change. Three moves, in order.

**Do not save.** A save made now records the broken state as the one you would go back to.

**Send the message,** with the one clause that only exists today:

> "Signed in as bob, I opened my feed and alice's posts are missing from it. Each account should see its own posts plus the people it follows. This passed the last time I ran these, before we added the currently line to the profile. Find out why and fix it, then I'll run the same check again."

*This passed before we added the currently line* is a fact about when you saw each thing, not a guess at the cause. When things happened is yours to say; why is not.

**When the repair comes back, run all four again,** not only the one that failed.

If the same check keeps failing after two or three rounds, stop steering it and go back to the last save that passed the checks. On a live app that is a question first, then a sentence. Ask which saved version is from before this feature started, what its note says, and what going back would change on your computer, on the live link, and not at all. Going back restores the files; what people have typed in since, and anything you changed on a dashboard, stay as they are. The full question is in [Module 5 Lesson 5, Move 3](../05-operating/05-the-day-something-breaks.md#move-3--go-back-when-forward-is-losing). Then:

> "Take us back to the saved working version whose note says ___."

Then start a fresh conversation and begin this feature again from that version. Run the four checks after the restore too, on the live link.

## Save

When the new line reads right, the forbidden edit was refused, and all four checks passed:

> "Save this as a working version."

Then ask for all three parts of the report: saved on this computer, the copy went up, and the live copy rebuilt successfully.

## Your turn

1. Start a fresh conversation and send the ask above, checks included.
2. Check the plan against what you asked for, including whether anything already stored is touched.
3. Before approving anything that touches the database, ask: *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."* If a dashboard warning appears that the answer did not predict, paste its words back rather than pressing past it.
4. When "done" arrives, look for the results. If they are not there: *"Run the checks we agreed on and show me the results first."*
5. Set your own currently line, save, refresh. Open the other account's profile, then a window that has never signed in.
6. As your second account, try to change the first account's line. Refresh and read it.
7. Run the four checks from Module 5 Lesson 1. Write down each result.
8. If any failed: do not save. Send the message, with the clause that it passed before this change. Re-run all four when the repair comes back.
9. When everything passes: *"Save this as a working version."*

## Navigation

[← Previous: A bug report arrives: the steer that starts with somebody else's words](./01-a-bug-report-arrives.md)
[Next: When what you paste isn't yours →](./03-when-what-you-paste-isnt-yours.md)
