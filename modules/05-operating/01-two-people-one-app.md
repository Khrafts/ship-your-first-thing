---
title: "Two people, one app: the ritual that re-tests everything you shipped"
module: "05-operating"
lesson_number: "01"
est_minutes: 45
prereqs: ["04-thread-project (all nine lessons)"]
updated: "2026-08-19"
deviations: []
---

# Two people, one app: the ritual that re-tests everything you shipped

## Learning objective

By the end of this lesson, you will be able to run the two-browser, two-account ritual against your live app — four scenarios, in order — and turn anything that comes back wrong into a message your agent can act on.

## Why this matters

You have already done this once. The last thing Module 4 asked of you was to open your live link in two different browsers, sign in as two different people, and watch the two accounts behave toward each other — and it worked, which is exactly what makes it easy to file away as a finish line rather than as a tool. Everything an app can show you from one screen, you have already seen; what is left are the faults that live between two people, and not one of them is visible from a single account. This lesson gives that walk a name, an order, and four things to try, so it stops being the last step of a build and becomes the first thing you run whenever anything changes.

> **Following along:** This lesson runs against your own live app from Module 4, in the agent app you picked in Module 0. Your agent's exact words will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-19. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

Nothing gets built in this lesson. The split has not moved — your agent owns the code, the rules, and every fix; you own saying what you want, watching the running app, running the checks, and saying when to save. What is different is that here the checking is the whole job, with no new feature underneath it to make the time feel spent.

### Why one account can't tell you

A fault that only exists between two people is not a quiet fault. It is an invisible one.

Stand at your own screen and picture two versions of your app. In the first, following somebody puts them in your Following list and puts you in their Followers list. In the second, following somebody does both of those *and* quietly makes them follow you back. From where you are standing, those two apps are the same app. Same button, same list, same everything. The difference is sitting on a screen you are not looking at.

Your agent's report will not close that gap either. It describes what it set out to build in the same even, well-organized voice whether or not the thing it describes is standing, and it has no way of knowing which of its sentences is load-bearing. A calm, confident, fluent answer and a correct answer are two different things, and the only one of them you can check is the app.

So there is exactly one instrument that separates those two versions, and you already own it: a second account, in a second browser, being somebody else.

### alice and bob

Two accounts, and it is worth always using the same two names — **alice** and **bob**, the same pair Module 4 used for its examples. Names you do not have to think about are names you will actually use.

You almost certainly made both of them already; the walkthrough at the end of Module 4 needed two real accounts on the live app, and these are those. If one of them never got made, or you have lost track of which was which, make it now the way anybody else on the internet would: open your live link in the second browser and sign up. Accounts come from the app itself. There is nothing to ask your agent for, and nothing to set up anywhere else.

Two things about them. They are real accounts on the live app, not stand-ins and not sample data — the whole point is that the app treats them as two separate people. And two browser tabs will not do it: two tabs share one sign-in, and you will end up testing one account twice while believing you tested two.

### The workflow

Three steps, and they are the same three every time:

1. Open the live app in your everyday browser; sign in as **alice**.
2. Open a **different browser** (or a private/incognito window — it keeps its own sign-in); sign in as **bob** there. The two windows are now two different people at once.
3. Do a thing as alice; switch windows; watch what bob sees. Switch back; watch what alice sees.

That is **multi-account testing** (a one-line definition: testing your live app as two real people at once — alice signed in in one browser, bob in another — to surface the faults that testing on your own account never will, [→ GLOSSARY](../../GLOSSARY.md#multi-account-testing)), and it is a workflow rather than an idea. There is nothing underneath it to understand. Why a browser keeps its own sign-in, and why a second one does not inherit the first one's, is your agent's territory and stays there. Yours is the switching.

### The four scenarios

Run each of these against the LIVE app, in order. Two of them are things you are allowed to do, where you are watching what happens on the other person's screen. Two of them are the other shape — the refusal check you ran in every chunk of Module 4, where you try the thing that should not be allowed and confirm you are turned down.

- **Follow is one-directional:** alice follows bob → bob's window shows alice in his **Followers**; alice does NOT silently appear in bob's Following; neither profile shows a Follow button on its OWN page.
- **Feed differs per account:** alice and bob see different feeds; each sees their own posts plus the people they follow.
- **Nothing of the other person's is yours to change:** as bob, try to edit or delete alice's post and alice's comment — expect refusal both times.
- **Signed-out can read, can't act:** a third window signed in as nobody can READ public posts, threads, and like counts but cannot post, comment, like, or follow.

Two of those four are the ground the next lessons are built on, and it is worth knowing which as you run them. The third one — nothing of the other person's is yours to change — is where Lesson 2 goes: a build where that edit went through, on an app that looked perfectly healthy right up until somebody tried it. The second one, the feed, is Lesson 3's: a feed that was reported finished and was quietly leaving out the one post its owner had just written. You are running both checks today on an app you expect to pass them. That is the point of running them today.

### When one comes back wrong

Yours will most likely come back clean — your Module 4 build was checked against all four of these, chunk by chunk. Run them anyway, and know what you do on the day one of them does not.

What you do is write a **recovery prompt** (a one-line definition: the message you write after a check comes back wrong — you say exactly what you did and what you saw, then ask your agent to find and fix it, [→ GLOSSARY](../../GLOSSARY.md#recovery-prompt)). It has three parts and nothing else: what you did, what you saw, and what should have been true instead. Then you hand it over.

Say the first scenario comes back wrong — alice follows bob, and now alice is sitting in bob's Following list as well as his Followers:

> "Signed in as alice, I followed bob. Then I looked at bob's profile in the other browser, and alice is in his Following list as well as his Followers. Following somebody should never make them follow me back. Find out why and fix it, then I'll run the same check again."

Notice what is not in it. No guess at what caused it. No suggestion about where to look, no theory about which part of the app is at fault, and nothing that requires you to have opened anything. You are the only person in this exchange who can see what the app actually did, and that is the whole of your contribution — the finding-out is your agent's side of the line, and every sentence you spend guessing at it is a sentence pointing your agent somewhere you have no reason to point it.

And the last clause is not politeness. *Then I'll run the same check again* is what closes the loop: your agent will tell you it is fixed in the same calm voice it used before, and the only thing that settles it is running the scenario a second time and being refused. A check, not an assurance.

### What the ritual is actually for

Every feature Module 4 shipped ends up under one of those four scenarios. Signing in, profiles, posts, following, the feed, comments, likes — one pass of this ritual re-tests the lot of them, from the only seat that can see whether they hold. That is why it is the first lesson of this module rather than a footnote to the last one: it is the instrument every remaining lesson hands you something to point at.

And it costs about fifteen minutes, which is the other reason it works. A check you will actually run on a Tuesday beats a thorough one you will not.

## Exercise

Run the full ritual against your live app, and write one recovery prompt whether or not you need it. The deliverable is the four scenarios walked in order, plus one written message saved somewhere you can find it — a note file, a document, the back of an envelope.

1. **Set up the two windows.** Your everyday browser signed in as alice; a different browser, or a private window, signed in as bob. If one of the accounts does not exist yet, sign up for it in the second browser first.
2. **Scenario one — follow is one-directional.** As alice, follow bob. Switch to bob's window and open his profile: alice should be in his Followers, and his Following list should be untouched by anything you just did. Check both of your own pages for a Follow button while you are there; neither should offer one.
3. **Scenario two — feed differs per account.** Open alice's feed and bob's feed and compare them. Each should carry that person's own posts plus the people they follow, and the two should not be the same page.
4. **Scenario three — nothing of the other person's is yours to change.** As bob, open a post alice wrote and try to change or delete it. Then open a comment alice wrote and try the same. Both should refuse.
5. **Scenario four — signed-out can read, can't act.** Open a third window that has never signed in. Read a profile, a post's page and its thread, and the like counts. Then look for anything at all you can press: posting, commenting, liking, following. There should be nothing.
6. **Write one recovery prompt.** Pick any one of the four — the most interesting is usually the one you would least expect to fail — and write the message you *would* send if it had come back wrong. Three parts: what you did, what you saw, what should have been true. No cause, no theory, no instructions about where to look. If something did in fact come back wrong, send that one for real, and re-run the scenario once your agent says it is fixed.

## Checkpoint

You've got this if you can do both:

1. Have alice and bob signed in at once in two different browsers and walk the four scenarios end to end on your live link, saying out loud for each one what you expect before you look.
2. Write, for any one of those scenarios, the message you would send if it came back wrong — what you did, what you saw, what should have been true — and say why naming a cause in it would make it worse.

## Going deeper

Optional, only if you're curious:

- Lesson 2 is the third scenario going through. Same check, same two accounts, on a build where bob edits alice's comment and the change sticks — while everything on screen looks exactly as healthy as your app does right now. Nothing to do before it; you already have the instrument that catches it.

## Loop check

> **Loop check — evaluate.** This lesson is **evaluate** from a second seat. Everything you have evaluated so far, you evaluated as the person who built the thing: your account, your screen, your idea of what should happen. Half of what an app does is invisible from there, and no amount of care in the asking gets at it. Being the second person is not a different loop step — it is the same one, run from the only place the other half is visible.

## What you just did

You ran your live app through four scenarios as two people at once, and you wrote the message you would send if one of them had come back wrong. That is the whole ritual, and it is now yours for every app you build after this one — it takes fifteen minutes and it re-tests everything Module 4 shipped. What you have not done yet is watch one of these checks actually catch something. That is the next three lessons: three builds where something specific went wrong, starting with the one where the fence was down.

## Navigation

[← Previous: Likes, then live: a count that moves the instant you click](../04-thread-project/08-likes-and-go-live.md)
[Next: The fence that was down →](./02-the-fence-that-was-down.md)
