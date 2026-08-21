# Module 6 — After it's live

Module 5 ended with your app operated rather than merely live: re-testable as two people, with three ways a build goes wrong already met on purpose, and four moves ready for the morning something stops behaving. Nothing in it asked you to change your app. That was the point — you were learning to hold something steady.

Module 6 is about changing it while keeping it that way.

That turns out to be a different skill from building was. In Module 4 every chunk landed on an app that was still private, still empty, and still yours alone; the worst case was that a feature did not work yet. Now there is a public link, there are people on the other end of it, and everything you add lands next to something that already works and that somebody is already using. The moves do not change — intent, ask, evaluate, steer, exactly as Module 3 left them. What changes is that you are working with the door open.

## What this module builds

By the end of this module you can take a fault somebody else reported and turn it into a repair you can actually check; you have added one new thing to your live app and proved that the rest of it still works; you know what it looks like when text from outside your conversation pulls your agent off the job you gave it, and where you stop it; and you know the conditions under which the right move is to stop steering and ask a person instead.

Only one lesson here changes your app on purpose. Lesson 2 is the build, and it is the only place in the module where anything of yours is meant to move. The rest is a repair watched in somebody else's build (with a net cast over your own), a moment met at an approval prompt, and a set of conditions worth recognising before you are standing in them.

Each lesson builds on the last:

- **Lesson 1 — A bug report arrives:** somebody using your app tells you it is doing something wrong — a **bug report** (a one-line definition: somebody telling you the deployed app does something wrong, [→ GLOSSARY](../../GLOSSARY.md#bug-report)) — and you go and see it for yourself before you say a word to your agent. You watch the whole repair run in a build that is not yours, and then run the after-a-change check on your own app, where you expect it clean → sets up Lesson 2 by putting that check in your hands before you make a change that could genuinely trip it.
- **Lesson 2 — Adding without breaking:** the module's only build. One small new thing on your profile, asked for with a definition of done written into the ask, and the same check run afterwards for real — this time on an app you changed on purpose → sets up Lesson 3 by leaving you in the habit of asking what a change touches before you approve it.
- **Lesson 3 — When what you paste isn't yours:** what happens when text somebody else wrote gets handed to an agent that is pointed at your real project, and it starts on something you never asked for. Where you notice it, and why declining at the approval prompt is what keeps your app untouched → sets up Lesson 4 with the last of the things you can catch yourself.
- **Lesson 4 — When to ask a person:** nothing runs in this one. The conditions that mean steering has stopped working, what to bring to somebody who can help, and why stopping is a move rather than a failure → closes the module.

The thread that ties it together: everything in this module is about an app that is already running. Nothing here is a fresh start, and nothing here gets to break what is already there.

## How this module works

The split is the one you have had since Module 4, and it does not move here either. Your agent owns the code, the rules, the schema, every error and every fix — including all of the repair in Lesson 1 and all of the building in Lesson 2. You own saying what you want, watching the running app, running the checks, saying when to save, and knowing when to stop.

Your checks are the two you already have, and neither of them asks you to look at anything your agent wrote. The refusal check: in the running app, you try the thing that should not be allowed and confirm you are turned down. The pre-flight question: before a step nobody can take back, you ask your agent what it changes and wait for the answer. Module 4 taught you both and Module 5 turned them into things you run on their own.

What Module 6 adds is a trigger rather than a new check. After any change — a repair somebody else's report started, or something you added because you wanted it — you re-run the four scenarios from [Module 5 Lesson 1](../05-operating/01-two-people-one-app.md), in order. Lesson 1 has you run that net on an app where nothing was repaired, so you expect it clean and the habit is cheap to build. Lesson 2 is where it runs for real, after a change you made, and where it can honestly come back dirty.

Every ask in this module is written once and works in either taught app. You run only the app you picked in Module 0 — the same one you have built with all along.

## Lessons in this module

1. [`01-a-bug-report-arrives.md`](./01-a-bug-report-arrives.md) — somebody reports your live app doing something wrong; the trip to the app that turns their sentence into your steer, and the net you cast after any repair
2. [`02-adding-without-breaking.md`](./02-adding-without-breaking.md) — one small addition to your live app, with a definition of done written into the ask and the net run afterwards for real
3. [`03-when-what-you-paste-isnt-yours.md`](./03-when-what-you-paste-isnt-yours.md) — outside text that carries instructions for your agent, and the approval prompt where you turn it down
4. [`04-when-to-ask-a-person.md`](./04-when-to-ask-a-person.md) — the conditions that mean it is time to stop steering, and what to bring when you do

## Before you start

Module 5, complete — and nothing else. There is nothing to prepare for this module: no new account, no dashboard, nothing to install and nothing to set up. It starts from your app exactly as Module 5 left it, live at its link with your two accounts already on it, and from the operating moves that module ends with.

## Navigation

[← Module 5 — Operating the build](../05-operating/README.md)

Module 7 — Where to go from here — comes next.
