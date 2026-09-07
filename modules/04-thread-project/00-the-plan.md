---
title: "The plan: what you're building, and who with"
module: "04-thread-project"
lesson_number: 00
est_minutes: 50
prereqs: ["03-the-loop (all four lessons)"]
updated: "2026-09-07"
deviations: []
---

# The plan: what you're building, and who with

## What you'll have at the end

A written plan your agent keeps — what your app is, who it's for, and the eight features in build order — plus a short set of house rules your agent follows for the rest of the module, both read back to you in your own words before anything gets built. This module runs for weeks, on something you want to exist; with nothing written down, the app you described on Monday quietly becomes a different app by Thursday.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What the plan holds

Four questions, answered in plain words, in one file your agent keeps and re-reads:

- **What is this app?** Two or three sentences about the thing itself. "A place where the people in my book club post what they're reading and see what everyone else is reading."
- **Who is it for?** "The eleven of us, plus whoever we invite. Nobody signs up off the street."
- **What gets built, and in what order?** The eight features below, fixed, because every lesson from here is written against that order.
- **What are you deliberately not building?** "No direct messages, no notifications, no search" costs one sentence now instead of a correction later. Nothing on that list is banned forever — it is out of *this* build.

The app is a small social app of the kind Threads and Instagram are underneath: first online and empty, then sign-in, a profile, posts, follow, a feed, comments, likes. The subject on top is yours — a book club, a running group, a street of neighbours swapping tool loans. Use the words you would use telling a friend about it; your agent will use them right back at you.

## The house rules that come with the plan

Alongside the plan, your agent writes a short set of rules for itself: how to talk to you, when to stop and ask, what "done" means, what to do when you say save, what to do when a tool is missing from this computer, and the one that matters most — *read the plan at the start of every conversation, and open by saying where we are.* Your agent does not know these rules until you say them; nothing in this course reaches into your folder. So the ask below spells them out and tells your agent to put them in the one file it reads by itself every time a conversation starts here. You never open that file.

You will notice the rules working: a fresh conversation opens by telling you where you are in the build, instead of asking. When it opens by asking what the project is instead, say: *"Read the plan and the house rules in this folder, and tell me where we are."*

## Do this

**1. Decide the subject before you open the app.** One sentence: what is your version of this app about, and who are the people in it?

**2. Make a new, empty folder** — not `my-first-thing` from Module 0 and not `loop-practice` from Module 3. Call it something like `thread-project`. Point your agent at it the way Module 0 showed you: in Claude Code desktop, open the **Code** tab, choose **Local**, click **Select folder**, and pick it; in the ChatGPT app with Codex, open a folder and pick it. Check the setting that decides how often the app asks before it acts — **Manual** in Claude Code desktop; in the ChatGPT app, read what the permissions control under the message box says. Nothing needs installing before you start. Every fresh conversation from here starts by selecting this folder again.

**3. Give your agent this ask.** It is long because your agent has never read this course, and everything it needs to know has to arrive in your words:

> Set up my thread project in this folder. Write the plan file and fill it in with me: ask me what the app is and who it's for, one question at a time, and keep it in my words. The features are fixed. Put these eight in the plan, in this order, as the list of what gets built: 1. Get it online, empty — the app gets a live web address anyone can open, before it does anything. 2. Sign in — a visitor can create an account and sign in with an email address and a password. 3. Profile — a signed-in person can set their name, a photo, and a short bio. 4. Posts — a signed-in person can write, edit, and delete their own posts. 5. Follow — a signed-in person can follow and unfollow other people. 6. Feed — a signed-in person sees posts from the people they follow, plus their own. 7. Comments — anyone can read the comments on a post; a signed-in person can add one. 8. Likes, then live — a signed-in person can like a post, and the whole app is checked at its public address with two accounts in two different browsers. Then ask me what I'm deliberately not building, and write that down too.
>
> Also write yourself a short set of house rules, and put them in the file this app reads on its own at the start of every conversation in this folder — CLAUDE.md if you are Claude Code, AGENTS.md if you are Codex. The rules: I'm not a programmer, and I'm not trying to become one. I decide what gets built; you write every line of code and run everything that runs on this computer, and you never hand me something to type or run — that's your job. Assume this computer has none of the tools a web app needs. Whenever a step needs a tool that isn't installed, tell me in plain words what it is and why you need it, install it yourself, ask me only for the approvals that only I can give — if something needs an administrator password or an account sign-in, tell me which installer or sign-in window is asking and I'll type it there myself; never ask me to put a password, a sign-in code, or account details into this conversation — and check that it works before you go on; if an install fails, stop and tell me what you tried and what I can do next. Talk to me in everyday words, and never give me code, error text, or file names as an explanation. Before anything that can't be undone — deleting or overwriting information, spending money, changing a setting on one of my accounts, anything I would paste into a dashboard — stop, tell me in plain words what could go wrong, and wait for my answer. Before you say "done" on any piece of work, run the checks we agreed on for it and show me the results in plain words; if you can't run one, say so instead of guessing. When I say "save this as a working version", save a version with a one-line note about what changed, then tell me whether the copy went up and whether the live copy rebuilt successfully. When I ask to see the app, start it on my computer if it isn't running and tell me the address to open. When you're stuck, say so, with at most three options. And at the start of every conversation, read the plan and these rules, and open by telling me in a sentence or two where we are and what comes next.
>
> When both are written, read the plan and the house rules back to me in plain words, and then stop. Don't build anything yet — the first feature is a separate ask.

Four things in that ask do the work. **One question at a time** stops the wall of questions you would skim. **Keep it in my words** means the plan comes back as a page you can check. **The eight features, in order** means your agent has the list because you gave it the list. **Stop, don't build** is the edge from Module 3: an agent that starts on the first feature has reached past what you asked.

<!-- Grounded in the shipped thread-project contract files (thread-project-template/PLAN.md and its house-rules twins), which the ask above restates in learner words; no archived m4-cN transcript covers this step, and the self-contained ask (reshaped 2026-09-07, tool-install rule added the same day) has not been run against either app, so the exchange below is described at shape level only. Claude-side app behavior is memo-verified (Manual mode: the app proposes, you approve or reject, and files are not changed until you accept). -->

With Manual set in Claude Code desktop, the app asks before it writes the plan file and again before the house rules — approve those. In the ChatGPT app, its own approval prompt appears wherever it is set to ask. Then the questions come one at a time. Answer in your own voice: "people post what they're reading and everyone can see it" is a better line in a plan than anything with the word *platform* in it.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**4. Steer one thing you do not like.** A sentence that is nearly right, a feature described in words you would not use. Say what is off and what you want instead, in one sentence. This is the cheapest moment in the whole module to fix it.

**5. Add what you are not building.** At least two things. "No direct messages. No notifications."

## Check it

**TRY THIS:** ask your agent to read the plan back in plain words — what the app is, who it's for, the features in order, and what you are not building — and then the house rules, with the name of the file they are in.

**EXPECT:** what comes back matches what you meant. Your app, described the way you would describe it. Your audience. Eight features in the order you gave. The house rules in the same plain words you used, including the tool-install rule and where a password goes (the installer or sign-in window, never this conversation), from a file your agent says it reads on its own every time a conversation starts.

**IF IT DOESN'T:** say what is off, in one sentence, and have it update the file. *"The bit about who it's for is wrong — it's for a private group of people who already know each other, not for anyone who finds it."* Then ask for the read-back again. If the house rules come back thin, or your agent is not sure which file it put them in: *"The house rules should include that you read the plan at the start of every conversation and open by telling me where we are — put that in, and tell me which file it's in."*

Then **start a fresh conversation** in your app, with the same folder selected, and say nothing but hello. Your agent should open by telling you where you are — a plan written, nothing built, the first feature next. If it opens by asking what the project is, the rules did not take: say *"Read the plan and the house rules in this folder, and tell me where we are,"* then ask it why it did not do that on its own, and have it fix the rules. This is the one time in the module you get to test the fresh start with nothing at stake.

## Save it

When the plan says back what you meant: *"Save this as a working version."* Your agent handles every part of saving; you decide when.

This folder is new and this computer may have nothing installed, so the very first save is likely where the tool-install rule first runs: your agent may say a tool is missing, install it, and show you an approval prompt or two — approve those. If it offers to put a copy of the project online now, the way Module 2 did, yes is a fine answer; the next lesson needs the copy there anyway. When it says it is done, ask: *"Confirm the working version is saved on this computer, whether a copy is online yet, and whether everything the save needed is installed and working."*

If an install fails, do not try to fix it yourself: *"The install didn't work — tell me what you tried, and what my options are."* Pick one of its options, or stop for the day and come back to it; nothing is lost.

## What "done" means

You wrote these into the ask as the read-back-and-stop at its end. Before you accept "done", your agent shows you, in plain words:

1. The plan file exists in your project, and reads back — in plain words, and in the words you used — what the app is, who it is for, and the eight features in build order, with your "deliberately not building" list alongside them.
2. The house rules exist in the file your agent reads on its own at the start of every conversation in this folder, and your agent reads them back to you in plain words — including that it re-reads the plan at the start of every conversation and opens by saying where you are.
3. Nothing has been built. The first feature is the next lesson's ask, not this one's.

If your agent says "done" without showing these, say: "Run the checks we agreed on and show me the results first."

You're done when you can say, without opening the plan, what your app is, who it's for, and which feature gets built next — and when a fresh conversation has opened knowing where it was. Next: the first feature on the list, the app online and empty.

## Navigation

[← Previous: Steering and recovery](../03-the-loop/04-steering-and-recovery.md)
[Next: Put your app online →](./01-hello-world-deploy.md)
