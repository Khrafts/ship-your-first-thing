---
title: "Put your app online"
module: "04-thread-project"
lesson_number: 01
est_minutes: 55
prereqs: ["00-the-plan"]
updated: "2026-09-07"
deviations: []
---

# Put your app online

## What you'll have at the end

An empty app at a real public web address, connected to your database, checked from your own phone — and everything the app needs installed on this computer by your agent. It is the only one of the eight features that ends with nothing to look at, and that is the point: every later feature lands on ground already known to work in public, so when sign-in misbehaves you know the trouble is in sign-in.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

Three things have to be true at once: the app is live at an address anyone can open, that address is wired to your **Supabase** (a one-line definition: the service that holds your app's accounts and database — you open its dashboard when a lesson says to, [→ GLOSSARY](../../GLOSSARY.md#supabase)) database, and the wiring is set up in the live place, not only on your machine.

Your agent does all of it: installing whatever this computer is missing, creating the empty app, connecting it to your database, setting up the project's saved history, and getting it live on **Vercel** (a one-line definition: the service that runs your app on the public internet at a web address, [→ GLOSSARY](../../GLOSSARY.md#vercel)). Two things are yours: two accounts have to exist, and if your agent asks you for one labelled value off a dashboard, you hand it over — after the question below.

## Before you ask

**Create the two accounts.** A Supabase account, where your database will live, and a Vercel account, where the app goes live. Both are created in your browser, by you; both free plans cover everything this module builds. Your agent cannot sign up on your behalf or click the confirmation link in your email, so ask it to walk you through them one at a time — which page to open, what to call the project, what to bring back — while you do the typing and confirming.

**Look at your keys screen once.** On the Supabase dashboard, find the keys screen for your project. It lists more than one key, each beside a label, and the one you want is labelled "publishable" — its value begins `sb_publishable_`. Read those opening letters once, so you know what your own dashboard calls the thing your agent may ask you for. You are not copying anything yet.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say: *"Read the plan and the house rules, and tell me where we are."* Then:

> Build the first feature on the plan, in this folder: start a brand-new app, connect it to my database, and get it live at a public web address I can open from my phone. No features yet, just an empty page that's really online. First check what this computer already has and install anything the app needs — tell me what each thing is for in plain words, ask me only for the approvals only I can give, and check each one works before you build. Tell me what you'll do, and what you need from me, before you write anything. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: the app opens at a public web address anyone with the link can reach; the page carries my project's name; the live page and the page on my own computer show the same thing; nothing labelled secret is anywhere a visitor to the live page could reach.

Read what comes back and check one thing: does its plan match what you asked for — tools installed first, an empty app, connected to your database, live at a public address that works from a phone? If it has added a sign-in page or anything else further down your plan, say so in one sentence and have it cut back to the one feature. Then:

> That matches what I want. Go ahead. Tell me each time you need me to copy something from a dashboard, and each time you're about to install something.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0); the install-first clause was added 2026-09-07 and has not been run against either app. Presented in the desktop app's framing. -->

The run is a series of approval pauses — in Claude Code desktop, Accept or Reject, and nothing on your machine changes until you accept; in the ChatGPT app, its own prompt wherever it is set to ask. Expect the first pauses to be installs, each one named before it happens; then the empty app, the wiring to your database, the project's saved history and its home page online, then going live. At the end it hands you a link. When this chunk was really built, the agent finished by saying the app was live, giving the link, listing what it had done in plain words, and noting it had not needed anything copied from a dashboard that time — and that it would flag it clearly the moment a step did.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

## The one thing you copy

If your agent asks you for a value off your Supabase dashboard:

> **BEFORE YOU COPY** anything: look at the label next to it. The only key you ever copy is the one labelled **publishable key** (a one-line definition: the one of Supabase's two keys that is safe to be seen — you copy it off the dashboard when your agent asks for it, and the other one, labelled secret, never leaves the dashboard, [→ GLOSSARY](../../GLOSSARY.md#publishable-key)), the one whose value begins `sb_publishable_`.
>
> **IF YOUR AGENT ASKS FOR THE SECRET ONE:** *"Why does this step need the secret key, and where exactly will it live?"* — and wait for the answer.

Find the row with the right label, copy what sits next to it, hand it over. There is nothing in it to read.

Your agent can ask for that key by an older name, in the same certain voice it uses for everything else. What tells you is the label on your own screen not matching the words in the chat:

> The key on my Supabase dashboard is labelled publishable and starts with `sb_publishable_`. Are you reaching for an out-of-date name?

## Check it

> **TRY THIS:** open the live link on your phone, on your own data connection — not your home wifi, and not the computer that built it.
>
> **EXPECT:** the page loads. Something plain, carrying your project's name, with nothing on it to do.
>
> **IF IT DOESN'T:** *"The live link doesn't load on my phone — is a setting missing on the live site?"*

The phone is not a formality. The most common way a first deploy looks finished and is not: the app runs on the machine that built it, where all the connection settings already live, and the live site was never told about any of them — so it works for you and fails for everyone else. Your own computer cannot catch that. Your phone can. An error screen, or a page that spins forever, is a fail. Plain and empty is a pass.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0). -->

When this chunk was really built, the live page came up at a real public address: a near-black page with one line of centred text reading "thread project — online", and a second line saying the pipeline was live. Two lines of text — and a success, because they travelled from a database, through a hosting service, onto a screen that had nothing to do with the machine that made them.

<!-- VERCEL VERIFICATION SLOT: verify the settings-screen claim against a real Vercel deploy — user-assisted evidence pass -->

Your Vercel dashboard has a settings screen listing what the live site knows about. The phone is still the check; you read one line of that screen yourself in the last lesson of this module.

## Two places your app runs from now on

The copy on your own computer: your agent starts it, it is alive only while it runs, and it is where every change lands first. The live link: the copy Vercel rebuilds from each save that goes up. Knowing which one you are looking at is half of every check in this module. Two sentences to keep:

> Start the app on my computer and open it in my browser.

> Stop the app and start it again, then tell me what you see.

Say the first whenever there is nothing to look at — after a fresh conversation, after you closed the agent app, when a tab shows nothing or says it cannot connect. Say the second when a repair looks like it did nothing. A blank tab at home is usually an app that is not running, not a broken app. Every lesson's checks run on your own computer; the live link is checked here, on your phone, and again in the last lesson with two accounts.

Your database is in neither place. Your Supabase project — the accounts, and soon the profiles, posts, follows and comments — is one place that both copies use. An account you make at home is an account on the live link; a switch you flip on the Supabase dashboard is flipped for both. Until the last lesson, that is fine, for one reason: everything in this app is test accounts with made-up addresses and made-up posts. Keep it that way.

## If something is wrong

- **Works at home, not on the phone:** *"On my computer the page loads, but the public link is blank or shows an error. I want both to behave the same. Find out why and fix it."*
- **An install fails:** *"The install of that tool didn't work — tell me what you tried, and what my options are."* Pick one of its options; do not try to install anything yourself.
- **Your agent keeps circling** — reworking the same thing, losing the thread of what you asked: start a fresh conversation and begin this chunk again from your last saved version.
- **The blocker is outside the app.** When this chunk was really built, the first attempt to go live failed because the hosting account had been suspended over a billing problem. Once the account was sorted out, the fix was one message: *"Earlier we set this app up and connected it to my database, but getting it live failed because my account was suspended. I've fixed it now — it's on the free plan. Pick up where we left off: get the app live at a public web address I can open from my phone, and give me the link."* Fix the outside thing, then tell your agent to resume — and say where you left off, because it will not remember.

<!-- The outside-blocker paragraph is grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0). -->

## Save it

The moment the live link loads on your phone: *"Save this as a working version."* Your agent does every part of what that involves and never decides on its own that something is worth keeping.

From now on a save is four things in a row, and only the first two happen on your computer. The files change as your agent works. A save keeps a version of them on this computer, with a note. The copy goes up to the project's home page online — when the sending works. And Vercel rebuilds the public copy from what went up — when the rebuild works. So the live link shows the last version whose rebuild succeeded: usually your last save, not guaranteed, and never the half-finished middle of a chunk.

The saved version on this computer is real the moment your agent confirms it — your way back whether or not the copy went up or the public copy rebuilt. So when it says "saved", ask it to confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully. Three answers, because any one can fail while the others hold. If the upload or the rebuild failed, you still have your saved version; say what you saw and let your agent find out why. The last answer is the one to wait for before you show anyone the live link.

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. The app opens at a public web address that anyone with the link can reach.
2. The page carries your project's name.
3. The live page and the page running on your own machine show the same thing.
4. Nothing labelled secret is anywhere a visitor to your live page could reach.

If your agent says "done" without showing these, say: "Run the checks we agreed on and show me the results first."

You're done when the live link loads on your phone and you have a saved version. Next: a front door, so people can sign in with an email address and a password.

## Navigation

[← Previous: The plan: what you're building, and who with](./00-the-plan.md)
[Next: Sign in with an email and a password →](./02-sign-in.md)
