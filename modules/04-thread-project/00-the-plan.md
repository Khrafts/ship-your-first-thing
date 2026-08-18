---
title: "The plan: what you're building, and who with"
module: "04-thread-project"
lesson_number: 00
est_minutes: 45
prereqs: ["03-the-loop (all four lessons)"]
updated: "2026-08-17"
deviations: []
---

# The plan: what you're building, and who with

## Learning objective

By the end of this lesson, you will be able to co-write your project's plan with your agent — what your app is, who it's for, and which features get built in which order — and check that the written plan says your own intent back to you before any building starts.

## Why this matters

Module 3 ran the whole loop on a throwaway page across one afternoon. This module runs the same four moves for weeks, on something you actually want to exist, and that stretch is where memory stops being enough on its own. With nothing written down, the app you described on Monday quietly becomes a different app by Thursday, and neither of you can point at where it changed. The hour you spend agreeing on the thing first is the hour every later ask points back at.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

This lesson builds nothing you can open in a browser. What it produces is a page of writing that the next eight lessons all point back at, and the habit that makes that page worth having.

### What a plan is here

Not a document with headings you fill in to look professional. Four questions, answered in plain words, in one file your agent keeps and re-reads:

- **What is this app?** Two or three sentences describing the thing itself, not its features. "A place where the people in my book club post what they're reading and see what everyone else is reading."
- **Who is it for?** One or two sentences. "The eleven of us, plus whoever we invite. Nobody signs up off the street."
- **What gets built, and in what order?** A numbered list of features, small enough that each one is a working thing you can see.
- **What are you deliberately not building?** The question people skip, and the one that saves the most time.

That last question deserves its paragraph. In Module 3 you watched a loose ask turn into a whole bookshelf nobody wanted, and you pulled it back with three sentences. That was one afternoon on a practice page. Over eight chunks the same enthusiasm has eight chances to run, and writing down "no direct messages, no notifications, no search" is how you spend one sentence now instead of a steer later. Nothing on that list is banned forever. It is out of *this* build.

### The thread project

The app this module builds is the **thread project**: a small social app of the kind Threads and Instagram are underneath. The first thing on the list is getting it online and empty — a live web address anyone can open, before there is anything on it to look at. After that: someone signs in, keeps a profile with a name and a bio and a photo, writes posts, follows other people, reads one feed of the newest posts from the people they follow plus their own, opens a post to comment on it, and likes it. Eight features, one per lesson from here on.

The subject on top of that is yours. A book club, a running group, a street full of neighbours swapping tool loans — the words in your plan should be the words you would use telling a friend about it, and your agent will use them right back at you for the rest of the module. What does not move is the eight features and the order they come in. Every lesson from here is written against that order, each one landing on the working thing the last one left behind, so the plan you write today carries the same eight in the same sequence.

### Every feature comes with a definition of done

Here is the part that makes a written plan more than a nice intention. Each feature in the plan carries its own **definition of done** (a one-line definition: the checks your agent must run and show you, in plain words, before it is allowed to say a piece of work is finished, [→ GLOSSARY](../../GLOSSARY.md#definition-of-done)).

The ritual runs like this. Before a chunk starts, the two of you agree on a short list of things that must be true when it is over — "a brand-new email address can sign in and lands inside the app", "signing out and refreshing leaves you signed out". Your agent builds. Then, before the word "done" is allowed out of its mouth, it runs those checks itself and tells you the results the way you would tell a friend: *I signed out and tried to open the profile editor — it sent me to the sign-in page, which is what we wanted.*

Your side of it is one sentence, and it is the whole skill: **when "done" arrives without the report, you send it back.** *"Run the checks we agreed on and show me the results first."* Not because your agent is dishonest — because "I've finished it" is a claim about the work and a check is evidence about the app, and only one of those two things has ever kept a broken feature out of your project. Every lesson from here ends with the list for that chunk, so you never have to invent one.

### The house rules that come with the plan

The plan file is not the only thing that goes into your project folder. Alongside it your agent writes a short set of house rules for itself — how to talk to you, when to stop and ask, what "done" means, and one line that matters more than the rest: *read the plan at the start of every conversation.*

That line is doing quiet work. You will start dozens of conversations over this module, and every one of them starts with an agent that has no memory of the last. The plan is what makes the twentieth conversation know what the first one was for. You never open that file or the house rules, and nothing in this course asks you to read them. You will notice them working: a fresh conversation that opens by telling you where you are in the build, instead of asking.

### Writing it, together

You do not fill in a form. You answer questions. Open your agent and give it this:

> Set up my thread project: create the project folder, put the plan file in it, and fill it in with me. Ask me what the app is, who it's for, and what we're building, one question at a time — keep it in my words.

Two things in that ask are load-bearing. **One question at a time** stops the wall of eleven questions that makes you skim and answer three of them properly. **Keep it in my words** stops your plan coming back in language you would not have used, which is the difference between a page you can check and a page you can only nod at.

<!-- Grounded in the shipped thread-project contract files (thread-project-template/PLAN.md and its house-rules twins); no archived m4-cN transcript covers this step, so the exchange below is narrated at shape level only, in the desktop app's framing. Claude-side app behavior is memo-verified (Manual mode: the app proposes, you approve or reject, and files are not changed until you accept). -->

**In Claude Code desktop:** the app asks before it makes the folder and again before it writes the plan file, the same approval pause you have been approving since Module 2 — and until you accept, nothing on your machine has changed. Then the questions start. What is this app? You answer in a sentence or two. Who is it for? You answer. It proposes the eight features in build order and asks whether that order works for you, and it asks what you are choosing not to build. When it has your answers it writes them into the plan file, asks you to approve that too, and reads the finished plan back to you in the chat.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):** the same shape, with the app's own approval prompt before it creates anything in your folder. The questions come one at a time, your answers go into the plan file, and the finished plan comes back to you in the conversation.

Answer in your own voice and resist the urge to sound technical. "People post what they're reading and everyone can see it" is a better line in a plan than anything with the word *platform* in it, because in six conversations' time you can still tell whether the app in front of you matches it.

### The check: does the plan say it back?

The plan is written. One check before you leave, and it is the only one this lesson has.

**TRY THIS:** ask your agent to read the plan back to you in plain words — what the app is, who it's for, and the features in order.

**EXPECT:** what comes back matches what you meant. Your app, described the way you would describe it. Your audience. Eight features in the order you agreed.

**IF IT DOESN'T:** say what is off, in one sentence, and have it update the file. *"The bit about who it's for is wrong — it's for a private group of people who already know each other, not for anyone who finds it."* Then ask for the read-back again.

This is a small check with a long reach. A plan that says something slightly different from what you meant does not stay a small wrongness — it is the thing eight chunks of building get measured against, and the mismatch shows up as a feature you did not want, in week three, with no obvious cause.

### Saving it

When the plan says back what you meant, tell your agent to save it: *"Save this as a working version."* That sentence is yours to say — your agent handles every part of what saving involves, and it does not decide on its own when a thing is worth keeping. You decide; it saves. A plan you agreed on is the first thing in this project worth keeping.

## Exercise

Twenty-five minutes, in your own agent app. Nothing to download.

1. **Decide the subject before you open the app.** One sentence: what is your version of the thread project about, and who are the people in it? Write it on paper if that helps.
2. **Run the setup ask.** Give your agent the ask from this lesson word for word, or in your own words with the same two limits in it — one question at a time, and keep it in my words.
3. **Answer the questions in your own voice.** Short sentences. No borrowed vocabulary.
4. **Steer one thing you do not like.** There will be something: a sentence that is nearly right, an order you would rather change, a feature described in words you would not use. Say what is off and what you want instead, in one sentence, the way you steered in Module 3. Do not let a nearly-right plan through on the grounds that it is close enough — this is the cheapest moment in the whole module to fix it.
5. **Add what you are not building.** At least two things. "No direct messages. No notifications."
6. **Run the check.** Ask for the read-back. Compare it against your sentence from step 1.
7. **Save it.** Say: *"Save this as a working version."*

Your deliverable is a plan file you agreed with, a read-back that matched, and a saved version — plus one sentence written down for yourself: the thing you steered, and why.

## Definition of done

Before you accept "done", your agent shows you the results of these checks, in plain words:

1. The plan file exists in your project, and reads back — in plain words, and in the words you used — what the app is, who it is for, and the eight features in build order, with your "deliberately not building" list alongside them.
2. Your agent confirms it will re-read the plan at the start of every conversation from here on.

If your agent says "done" without showing these, say: "Run the checks we agreed on and show me the results first."

## Checkpoint

You've got this if you can:

- Point at the plan and say, without opening it, what your app is, who it's for, and which feature gets built next.
- Say what you do when your agent reports a piece of work finished and shows you nothing.

## Going deeper

Nothing to read — something to notice. The next lesson builds the first feature on your list — the app online and empty, at a public web address, with nothing on it yet — and its first ask starts from the plan you just wrote. Watch how much shorter that ask is than it would have been an hour ago.

## Loop check

> **Loop check — intent.** Every step of the loop is measured against intent, and this lesson is the one place in the module where intent is the entire job: no ask against a running app, no evaluate, no steer on something built — just getting what you actually want out of your head and onto a page both of you can point at. The loop step this lesson reinforces is **intent**.

## What you just did

You wrote down what you are building and who it is for, in your own words, by answering your agent's questions instead of filling in a form. You steered the part that came back wrong while it was still one sentence, checked the plan by having it read back to you, and saved it. That page is what the next eight lessons all start from: in Lesson 1 you build the first feature on it — the app online and empty, at a public web address, with nothing on it yet.

## Navigation

[← Previous: Steering and recovery](../03-the-loop/04-steering-and-recovery.md)
[Next: Hello-world deploy: an empty app, truly online →](./01-hello-world-deploy.md)
