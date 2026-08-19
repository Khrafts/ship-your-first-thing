# Module 5 — Operating the build

Module 4 ended at a finish line: a live app at a public address, walked end to end by two real accounts. Module 5 is about the days after that one. Nothing new gets built here — no features, no chunks, no plan to work down. The app you already have is the app this module works on.

What changes is what you are doing with it. Building has an obvious shape: you ask for a thing, you watch it appear, you save it. Operating has none of that shape. It is re-checking something that already works, meeting the ways these tools fail before one of them costs you anything, and knowing what to say on an ordinary Tuesday when your live link stops behaving. Those are the skills for the day your app is not new anymore — and they are the ones nobody shows you, because there is nothing to point at when you are done.

Every ask in this module is written once and works in either taught app. You run only the app you picked in Module 0 — the same one you built with.

## What this module builds

By the end of this module you can re-test any app you ever build as two people at once, you have watched three builds go wrong in three different ways and written the message that hands each one back, and you know the moves that cover the day something on your live app breaks — including the sentence that takes you back to the last version that worked.

Nothing in your app has to change for this module to have done its job. What it leaves you with is a set of things you can run: on this app, and on the next one.

Each lesson builds on the last:

- **Lesson 1 — Two people, one app:** the two-browser ritual — two accounts signed in at once, four scenarios run in order against your live link, and the message you write when one of them comes back wrong → sets up Lesson 2 by putting that check in your hands before you watch a build fail it.
- **Lesson 2 — The fence that was down:** a build where one person can change another person's words, and the moment a check settles what a confident, well-organized answer could not → sets up Lesson 3 with a failure that at least announced itself when somebody pushed on it.
- **Lesson 3 — The missing post:** a feed that looks alive, reports finished, and quietly leaves out the one thing its owner wrote → sets up Lesson 4 by moving from something that is already wrong to something that has not happened yet.
- **Lesson 4 — Caught before it ran:** a change that would have taken real data with it, stopped at the door by one question asked before anybody pressed anything → sets up Lesson 5 with all three failures behind you.
- **Lesson 5 — The day something breaks:** what you say, and in what order, when the live app stops behaving — and how to get back to the version that worked → sets up Module 6, which is about changing an app that is already running: fixing and adding without breaking what works.

The thread that ties it together: every skill in this module is something you *run*, not something you know. Each one ends in a sentence you say out loud to your agent.

## How this module works

The split has not moved since Module 4, and it does not move here. Your agent owns the code, the rules, every error, and every fix. You own saying what you want, watching the running app, running the checks, and saying when to save. What is different is that in this module the checking *is* the work — there is no feature underneath it to distract you from how much of the job it actually is.

Operating, at this floor, is three things:

1. **Re-test it as two people.** One account can only ever tell you how the app behaves for one account. Lesson 1 turns that into a ritual with an order to it.
2. **Meet the known failures on purpose.** Three lessons, three ways a build goes wrong, met deliberately rather than at the worst possible moment.
3. **Know the moves for the day something breaks.** What to say, in what order, and how to get back to something that worked.

### The three lessons where you watch a build fail

Lessons 2, 3 and 4 are not about breaking your own app. Each one tells you about a build where something specific went wrong — what the person asked for, what the agent did, what the screen looked like, and the moment the thing was finally caught. Then you run that same check against your own live app, where you expect it to come back clean, and you write out the message you would have sent if it had not.

That is the promise Module 4 kept making you. You meet a build where the fence is genuinely down. You do not have to live in one.

### Your checks are the two you already know

Neither of them asks you to look at anything your agent wrote, and that has not changed either. The refusal check: in the running app, you try the thing that should not be allowed and confirm you are turned down. The pre-flight question: before a step nobody can take back, you ask your agent what it changes and wait for the answer. Module 4 taught you both. This module is where they stop being part of a build chunk and become something you run on their own.

## Lessons in this module

1. [`01-two-people-one-app.md`](./01-two-people-one-app.md) — two browsers, two accounts, four scenarios, and the message you write when one comes back wrong
2. [`02-the-fence-that-was-down.md`](./02-the-fence-that-was-down.md) — a build where one person could edit another person's words, and the check that settled it
3. [`03-the-missing-post.md`](./03-the-missing-post.md) — a feed reported finished, with its owner's own posts silently missing from it
4. [`04-caught-before-it-ran.md`](./04-caught-before-it-ran.md) — the database change that would have taken real data with it, stopped by one question
5. [`05-the-day-something-breaks.md`](./05-the-day-something-breaks.md) — the operating rhythm: what you say, in what order, and how to get back

## Before you start

Module 4, complete — your app live at its public address. Every lesson in this module runs against that link and the accounts you already made on it, so a half-finished build has nothing here to work on. Modules 0 through 3 still apply underneath: the app you picked, the machinery your agent drives, and the loop you run with it.

## Navigation

[← Module 4 — Designing & building the thread project](../04-thread-project/README.md)

Module 6 — After it's live — comes next. It starts once you have the operating moves this module ends with.
