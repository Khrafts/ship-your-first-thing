---
title: "The save system"
module: "02-toolchain"
lesson_number: 03
est_minutes: 25
prereqs: ["02-the-engine-room"]
updated: "2026-08-15"
deviations: []
---

# The save system

## Learning objective

By the end of this lesson, you will be able to tell your agent — in one sentence, in your own words — to save a working version of your project, say where that version goes, and name the sentence that takes you back to it.

## Why this matters

Whether you came here straight from the checklist you built in Module 0 or through the two lessons before this one, you've already used the machinery this lesson is about — once, when you said "save this as a working version." (Lesson 2's picture, if you skipped it: everything your agent runs for you sits below deck on a ship, and you stay on the passenger deck; this is the one piece of it you give orders about.) Here's why it earns a lesson of its own: you're about to spend weeks changing a project you don't read yourself, one change at a time, and some of those changes will turn out wrong. Without somewhere to fall back to, every one of them is a gamble with everything you've built so far. With somewhere to fall back to, the worst afternoon of your project costs you an afternoon.

## Core read

Think about how a video game handles the fact that you're going to fail.

You play a level. You finish it. The game records where you are — your position, your inventory, everything you earned getting there — and then you carry on into the next level, which is harder, and which you will probably die in a few times. When you do, you don't start the whole game over. You start again from the save point at the end of the last level, still holding everything you'd earned by then. The distance between the last save point and the disaster is the entire cost of the disaster.

And if the game keeps a cloud save, that copy isn't only on the machine in front of you. Your console can die, get stolen, or be left at a friend's house, and the run is still there when you sign in somewhere else.

Two things fall out of that picture, and both of them are about fear. A game with save points is a game you can afford to be bold in, because the cost of being wrong is bounded and known before you take the risk. And a game with a cloud save is a game whose progress isn't hostage to one piece of hardware.

Your project works exactly this way. One difference: the save points aren't automatic. Someone has to decide that you've reached one — and that someone is you.

### The two names under it

Two names sit underneath the picture, and you'll hear both of them from your agent.

The save system itself is **git** (the machinery that records a complete working version of your project each time your agent saves one, so any of them can be returned to later, [→ GLOSSARY](../../GLOSSARY.md#git)). It's the fourth kind of machinery from the engine room — running below deck, operated entirely by your agent. If you're on Windows and picked Claude Code desktop, you installed it back in Module 0 and haven't opened it since. You never will.

The cloud save is **GitHub** (the site where your project gets its own home page on the internet, holding a copy of every version your agent saves, [→ GLOSSARY](../../GLOSSARY.md#github)) — the account you created in Module 0. Once your project exists, it gets a home page there, at a normal web address you can open in your browser like any other page. That page is where your project lives. If your laptop stopped working tonight, the project would still be there tomorrow, and so would every version of it your agent had saved.

Your agent operates both of those. Your verb is "save." And they're two separate things: the save point itself lives on your computer, and the copy on the project's home page exists only once your agent has connected the project to GitHub — which is why the Module 0 save was on this computer only, and why you told your agent "not yet" if it offered to put a copy online.

```mermaid
flowchart LR
  Level["You get something working<br/>a level cleared"]
  Save["Your agent saves it<br/>a save point"]
  Home["The project's home page on GitHub<br/>the cloud save"]
  Bad["A change goes wrong"]
  Level -->|you say the save sentence| Save
  Save -->|your agent sends a copy up| Home
  Save -->|you carry on changing things| Bad
  Bad -->|take us back to the last saved working version| Save
```

### The ritual

There is one sentence to say, and it doesn't change for the rest of this course:

> **"Save this as a working version, with a one-line note about what changed."**

You say it after every working chunk — every time a piece of what you're building actually works.

What counts as working is not the agent announcing that it finished. It's you opening your app in your browser and seeing the thing you wanted do the thing you wanted. Agent says done, you look, it does what you meant — *that's* a save point.

Everything after your sentence belongs to your agent. It records the version, writes the note, and — once the project has a home page on GitHub — sends the copy up there too, then tells you in plain words when it's done. Until that connection exists, a save is a save point on this computer and nothing more; the first time you want the cloud copy, you say so ("put a copy of this project on GitHub"), your agent walks you through signing in to the GitHub account you made in Module 0, and from then on it sends each save up as well — when the sending works. You may meet the approval step from last lesson somewhere in the middle, because saving is machinery like everything else below deck. Approve it, and carry on. A save is real when your agent confirms it — so if it's quiet, ask: *"Confirm the working version is saved on this computer, and whether the copy on GitHub is up to date."* Two answers, because they are two different things: the save here can succeed while the copy up there doesn't go. If it says the copy didn't go up, the save on this computer is still real; ask what it needs to send the copy, do it if the answer is signing in to GitHub in your browser, and ask "what does this do?" first if the answer is anything else.

The one-line note matters more than it looks. "Added the like button under each post" and "fixed the wrong date showing on old posts" are notes that mean something weeks later; "update" is a note that means nothing to anybody. You will never read that list of notes yourself — your agent reads it back to you in plain words when you need to pick a version to return to. A list full of "update" leaves neither of you anything to go on.

### The failure this predicts

The save-point picture predicts the mistake every new player makes, and it's the one to guard against here: playing for three hours without touching a save point.

Go a whole afternoon without saving and one bad change costs you the afternoon, not the last ten minutes. There's nothing dramatic about how this happens. You get something working, you don't stop, you change four more things, two of them break something you can't name, and the nearest solid ground is now hours behind you.

So: after every working chunk. Not at the end of the day. Not once it's "properly finished." The moment something works, that's a save point — even if it's small, even if you're about to change it again in five minutes. Small and frequent beats large and tidy, every time.

### The move that makes everything else safe

The second thing the picture predicts is about fear, and it's the more useful half.

When something has gone wrong — the app stopped working, the last hour made things worse, you've lost the thread of what changed — you have one sentence:

> **"Take us back to the last saved working version."**

That sentence is always available to you. It is not an admission of failure, it is not a thing to feel sheepish about, and there is no number of times that counts as too many. Your agent does the whole thing; you don't touch any of the machinery involved. What you get back is the project's *files* exactly as they were at your last save point, and the only thing you lose is whatever happened to them after it.

One boundary to carry into the bigger builds, stated plainly so it never surprises you: going back restores what your agent wrote — the pages, the settings, the plan. It doesn't undo things that happened *outside* those files. Once your app is live with other people using it, the things they typed in live somewhere else and stay as they are; an email that was sent stays sent; a change made on a dashboard stays made. The files come back. Then open the app and check it the way you'd check any change, and ask your agent: *"What outside the files might not match the version we went back to?"* — a dashboard setting or saved information can still be out of step with the restored files, and that's a thing to know before you carry on. Going back doesn't rewind the world around the files, and no save point claims to.

Which is precisely why the ritual is worth the twenty seconds. Every save point you lay down shortens the distance that sentence can cost you.

And because that sentence exists, experiments get cheap. "Try it and see" is a legitimate way to work when the failure case is one sentence away from undone. Module 3 teaches you when to reach for it — the signals that mean stop and go back rather than keep going. Module 4 is where you'll use it on something real.

### What you'll never be doing

Being plain about this, because a lot of writing on the internet assumes otherwise: no lesson in this course will ever hand you a save command to type, two disagreeing versions of your work to untangle by hand, or a list of past versions to read and interpret. Not in this module, not in the build modules, not once.

If you find yourself in front of instructions that do — a search result, a video, a well-meaning friend who learned this the old way — that isn't how this course works. It's a set of directions written for someone standing in the engine room, and you're on the passenger deck. Close it, come back to your agent, and describe what you actually want in your own words.

And if your agent is the one handing you the wrench, you already have the sentence for that from last lesson:

> **"That's your job — do it yourself and tell me what happened in plain words."**

## Exercise

Plan 15 to 20 minutes. Steps 1–4 are an optional warm-up on paper or in a notes app — skip them if you'd rather go straight to the real thing. Step 5 is the exercise: it uses the checklist page from Module 0, which is the project you already have.

1. Write out the save sentence, word for word: *"Save this as a working version, with a one-line note about what changed."* Then write it again in your own words, the way you'd actually say it.
2. Write out the recovery sentence the same way — once as it appears above, once in your own words.
3. For each of these four moments, write **save now** or **not yet**, plus one line saying why:
   - You changed the wording on a button, opened your app in your browser, and it reads the way you wanted.
   - Your agent says it finished the sign-in feature. You haven't opened your app yet.
   - Sign-in works and you've just watched it work. You're about to try adding photo uploads, which you suspect will be messy.
   - It's six in the evening and three separate things are half-working.
4. Write one sentence answering both halves of this: where does your project live once it exists, and what would still be true about it if your laptop died tonight?
5. **Now do it for real, on the checklist from Module 0.** Open your agent app, point it at the `my-first-thing` folder, and say: *"Put a copy of this project on GitHub, then save this as a working version with a one-line note about what changed."* Your agent will take you through signing in to the GitHub account you created in Module 0 — approve what's about your folder and that sign-in, and ask "what does this do?" about anything else. When it says it's done, ask: *"Confirm the working version is saved on this computer, confirm the copy on GitHub is up to date, and give me the web address of the project's home page."* Open that address in your browser: your checklist's name should be on it. That page is the cloud save. If your agent says the copy didn't go up, the save on this computer is still real — ask what it needs to send the copy, and do it if it's a GitHub sign-in in your browser. From now on, when you save this project, that same two-part question is how you know both halves happened.

Your deliverable is a checklist that now has a home page on GitHub, with your agent confirming both the save on this computer and the copy up there. The written warm-up, if you did it, is yours to keep or bin.

## Checkpoint

You've got this if you can:

1. Say the save sentence in your own words, including the part about the one-line note.
2. Say where your project will live once it exists, and what happens to it if your computer stops working tonight.
3. Say the one thing going back to a saved version does *not* undo, once other people are using your app.

## Going deeper

Optional, only if you're curious:

- **The home page is yours to look at.** Once your project exists, its page on GitHub is an ordinary web page in your browser: the project's name, its files, and a dated list of every version your agent saved with the one-line notes beside them. Nothing on that page is homework, and no part of this course depends on you reading it — but it's yours, and looking at a web page can't break anything.
- **The habit outlives the tool.** Deciding *this, right here, is worth being able to come back to* is the transferable skill. Whatever you end up building with in five years will have some version of a save point in it, and the people who use it well are the ones who stop and lay one down while things are still working.

## Loop check

> **Loop check — intent.** Deciding that a piece of work is worth coming back to happens before you say anything to your agent — it's part of what you carry into a session, not something you sort out afterwards. Module 2 is still pre-loop; the loop step this lesson reinforces is **intent**: planning to work in small savable pieces before you start.

## What you just did

You learned the one sentence that lays down a save point and the one sentence that returns you to it, you decided which moments are worth saving, and you gave the checklist from Module 0 the half its first save was missing: a copy that survives this computer. That's the whole of your relationship with the machinery that keeps your work safe: two sentences, said at the right moments, with your agent doing everything underneath. Module 3 is where both sentences land in a real conversation, as you work with your agent through a change from start to finish.

## Navigation

[← Previous: The engine room](./02-the-engine-room.md)
[Next: Module 3 — The loop in depth →](../03-the-loop/README.md)
