---
title: "The profile page: name, bio, and photo"
module: "04-thread-project"
lesson_number: 03
est_minutes: 50
prereqs: ["02-sign-in"]
updated: "2026-09-07"
deviations: []
---

# The profile page: name, bio, and photo

## What you'll have at the end

A profile for every signed-in person — a display name, a short bio, and a photo they upload — that anyone can read and only its owner can change. This is the first thing in the app that belongs to somebody, and the first place where "anyone can look, only the owner can change" turns into something you have to check. It is also the first time you run a step on your database dashboard that nobody can do for you.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

Every signed-in person gets a profile page with a display name, a short bio, and a photo uploaded from their computer. Anyone can look at anyone's profile; only its owner can change it. The page leaves an empty area where that person's posts will show up later. The thing to spot: a photo landing in a stranger's folder, or a stranger's in yours — nothing on the screen looks different when that happens, so you ask about it instead.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say: *"Read the plan and the house rules, and tell me where we are."* Then:

> I want signed-in people to create a profile with a display name, a short bio, and a photo they upload from their computer. Anyone can view any profile, but a person can only edit their own. The profile page should leave an empty area where that person's posts will appear later. Plan this out before you write any code, and tell me where the uploaded photos get stored. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: a signed-in person can set a name, a bio, and a photo, and all three are still there after a refresh; anyone can view any profile, signed in or not; only the owner of a profile sees anything that would change it; the photo survives signing out and signing back in.

Check the plan against what you asked for — a name, a bio, an uploaded photo, anyone can view, only the owner can edit, an empty space left for posts — and that it told you where the photos will live. Then:

> That matches what I want. Go ahead and build it.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c2); presented in the desktop app's framing. -->

Your agent may ask a question first. When this chunk was really built it asked one: should a profile's web address be the person's account id (recommended — nothing new needed, can never be taken) or a username people choose? The recommended one was picked, so every profile sits at an address like `/profile/8f3a1c2e-4b7d-49a1-9e02-6c5d8b1f0a33`; a long run of letters and numbers in the address bar is expected. Answer questions about what you want; to questions about how it gets built, "you choose" is a fine answer. Then approve the steps as the app asks, until it stops and hands you the dashboard step below.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

## The step only you can do

Your agent writes a file of instructions for your database — the profile, and the rules about who may read it, change it, and upload a photo — and cannot run it. Only you can, from your **Supabase** (a one-line definition: the service that holds your app's accounts and database — you open its dashboard when a lesson says to, [→ GLOSSARY](../../GLOSSARY.md#supabase)) dashboard. The file is full of code, and none of it is for you to read: you move it whole from one screen to another. Skipping it looks like every profile page failing with "table not found".

**First, the question.** Before every paste like this, from now on:

> **BEFORE YOU PASTE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*

Wait for the answer. On this chunk it is close to "nothing — your database has nothing in it yet"; you ask anyway so the habit exists before the day it matters, and because the answer is about to help you read a scary dialog.

**Then the paste.** Supabase dashboard → SQL Editor (in the strip of icons down the left edge) → new query → paste the whole file your agent tells you to open → Run.

![The Supabase dashboard, on the SQL Editor page, with a new query open and the agent's file pasted into it. A numbered marker ① points to the SQL Editor icon in the narrow strip of icons down the left edge — the page you open. Marker ② points to the large area in the middle where the whole file goes, shown here holding the last lines of it. Marker ③ points to the green Run button at the top right, which you press once the file is in.](../../screenshots/m4/03-profile/run-migration.png)

Pressing Run raises a dialog headed "Potential issue detected", warning that the query may permanently change or remove data.

![The same SQL Editor page with a dialog in the middle of the screen. A numbered marker ① points to the dialog, headed "Potential issue detected", which warns that the query includes destructive operations and may permanently change or remove data. Marker ② points to the "Run query" button at the bottom right of the dialog, beside a Cancel button — "Run query" is the one you press to continue.](../../screenshots/m4/03-profile/run-query-confirm.png)

The wording is alarming and the file is not: what trips it is a few lines that clear an earlier copy of the file's *own* rules before writing them again, which is what makes the file safe to run twice. **If the warning is accounted for by the answer you got, press Run query.** If it names something the answer did not predict — or you never asked — press nothing and hand its words back: *"The dialog says the query may permanently change or remove data. You told me nothing existing would change. Which is it?"* When it runs, the Results pane reads "Success. No rows returned" — nothing came back because nothing was asked for; things were made.

## Check it

Open the running app — *"Start the app on my computer and open it in my browser"* if nothing is open. In order: your own profile before anything is set (it should say the profile is not set up yet, offer a way to set it up, and already show an empty posts area); set a name, a bio, and a photo, save, refresh — all three still there; sign in as a second made-up person and open the first person's profile — a read-only page; edit again changing only the bio and leaving the photo box empty — the photo survives.

> **TRY THIS:** sign out — or use a private window — and open your profile's address directly. Read everything. Then look for any way to change the name, the bio, or the photo.
>
> **EXPECT:** name, bio, and photo all visible; no edit link, no form, no upload control.
>
> **IF YOU CAN EDIT:** *"Signed out, I could change a profile. Anyone can view a profile, but only its signed-in owner should be able to change it. Fix that."*

One fence you cannot push on from a browser is the photo storage itself — whether one person could get a file into another person's folder by going around the app. Ask instead, in plain words, and hold the answer against what you asked for:

> Who is allowed to upload a photo, and where does each person's photo go?

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c2). -->

When this chunk was really built, the reply said every upload lands in the uploader's own folder — and then volunteered something nobody had asked about: the size cap on a photo, and the check that a file is really an image, lived only in the app's own code, so someone with a real login who went around the app could push a 50 MB file into their own folder. It had left that out to keep the first version simple, and offered to close it later. A good answer says what was built and what was traded away. Your agent will not always raise a gap like that itself, and nothing in how it sounds will tell you which day this is; Module 5 walks you through that failing on purpose. The habit is the one you just used: ask who is allowed to do what.

Also from that run: the fresh profile read "You haven't set up your profile yet." with a "Set up your profile" link and a Posts section reading "Nothing here yet."; signed out, the same address showed everything and offered nothing to press; a second account saw exactly the same page; the edit form showed the current photo under "Leave the file empty to keep this photo."

## If something is wrong

- *"When I open someone else's profile I see an edit form on it — I should only be able to edit my own. Find out why and fix it."*
- *"I edited just my bio and my photo disappeared. Leaving the file box empty should keep the photo that's already there. Find out why and fix it."*
- **A page says something does not exist** — "table not found" or wording close to it: the file never made it into your database. Go back to the paste step, run it, reload.
- **Your agent keeps circling:** start a fresh conversation and begin this chunk again from your last saved version.

## Save it

Look first, say the sentence second — the habit for any chunk that changes the database or accepts a file. When you have clicked through it and it holds: *"Save this as a working version."* Then ask it to confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. A signed-in person can set a name, a bio, and a photo, and all three are still there after a refresh.
2. Anyone can view any profile, signed in or not.
3. Only the owner of a profile sees anything that would change it.
4. The photo survives signing out and signing back in.

If your agent says "done" without showing these, say: "Run the checks we agreed on and show me the results first."

You're done when a signed-out window can read your profile and change nothing, you can sign in and change it, and you have a saved version. If you like, ask your agent later to close the gap it named — the size and file-type limits — as a small separate ask. Next: posts, to fill the empty area on that profile.

## Navigation

[← Previous: Sign in with an email and a password](./02-sign-in.md)
[Next: Posts: write, edit, and delete your own →](./04-posts.md)
