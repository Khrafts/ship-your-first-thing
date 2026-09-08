---
title: "The profile page: name, bio, and photo"
module: "04-thread-project"
lesson_number: 03
est_minutes: 50
prereqs: ["02-sign-in"]
updated: "2026-09-08"
deviations: []
---

# The profile page: name, bio, and photo

## What you'll have at the end

A profile for every signed-in person — a display name, a short bio, and a photo they upload — that anyone can read and only its owner can change. This is the first thing in the app that belongs to somebody, and the first place where "anyone can look, only the owner can change" turns into something you have to check. It is also the first time your database changes shape, which is where the question you ask before anything you can't take back gets its first outing.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

Every signed-in person gets a profile page with a display name, a short bio, and a photo uploaded from their computer. Anyone can look at anyone's profile; only its owner can change it. The page leaves an empty area where that person's posts will show up later. The thing to spot: a photo landing in a stranger's folder, or a stranger's in yours — nothing on the screen looks different when that happens, so you ask about it instead.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say:

```prompt
Read the plan and the house rules, and tell me where we are.
```

Then:

```prompt
I want signed-in people to create a profile with a display name, a short bio, and a photo they upload from their computer. Anyone can view any profile, but a person can only edit their own. The profile page should leave an empty area where that person's posts will appear later. Plan this out before you write any code, and tell me where the uploaded photos get stored and who can get at them. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: a signed-in person can set a name, a bio, and a photo, and all three are still there after a refresh; anyone can view any profile, signed in or not; only the owner of a profile sees anything that would change it; the photo survives signing out and signing back in.
```

Check the plan against what you asked for — a name, a bio, an uploaded photo, anyone can view, only the owner can edit, an empty space left for posts — and that it told you where the photos will live and who can get at them. Then:

```prompt
That matches what I want. Go ahead and build it.
```

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c2); presented in the desktop app's framing. -->

Your agent may ask a question first. When this chunk was really built it asked one: should a profile's web address be the person's account id (recommended — nothing new needed, can never be taken) or a username people choose? That is a question about how it gets built, dressed as a question for you. Hand it back:

```prompt
You choose — pick the simplest option that's easy to change later, and tell me in one line what you picked.
```

The recommended one was picked, so every profile sits at an address like `/profile/8f3a1c2e-4b7d-49a1-9e02-6c5d8b1f0a33`; a long run of letters and numbers in the address bar is expected. Questions about what you want — should strangers see the photo, should the bio have a limit — are yours to answer in your own words. Then approve the steps as the app asks.

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and app behavior against a real run in each app — user-assisted evidence pass -->

## Before anything touches your database

This chunk changes the shape of your database — a profile has to have somewhere to live. Your agent normally makes that change itself; if it says it needs you to sign in to the service first, sign in through the window it names and nothing else. Either way, before you approve the change:

```prompt
Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today.
```

Wait for the answer. On this chunk it is close to "nothing — your database has nothing in it yet"; you ask anyway so the habit exists before the day it matters.

**If your agent hands you something to paste instead.** Some agents cannot run the change and hand you a file to paste into the service's dashboard. The file is full of code, and none of it is for you to read: you move it whole from one screen to another, on the screen your agent names. When this chunk was really built on [Supabase](../../GLOSSARY.md#supabase), that screen was the SQL Editor — new query, paste the whole file, Run:

![The Supabase dashboard, on the SQL Editor page, with a new query open and the agent's file pasted into it. A numbered marker ① points to the SQL Editor icon in the narrow strip of icons down the left edge — the page you open. Marker ② points to the large area in the middle where the whole file goes, shown here holding the last lines of it. Marker ③ points to the green Run button at the top right, which you press once the file is in.](../../screenshots/m4/03-profile/run-migration.png)

Pressing Run raised a dialog headed "Potential issue detected", warning that the query may permanently change or remove data:

![The same SQL Editor page with a dialog in the middle of the screen. A numbered marker ① points to the dialog, headed "Potential issue detected", which warns that the query includes destructive operations and may permanently change or remove data. Marker ② points to the "Run query" button at the bottom right of the dialog, beside a Cancel button — "Run query" is the one you press to continue.](../../screenshots/m4/03-profile/run-query-confirm.png)

The rule for any dashboard warning is a comparison. **If the warning is accounted for by the answer you got, continue.** If it names something the answer did not predict — or you never asked — press nothing and hand its words back:

```prompt
The dashboard says this may permanently change or remove data. You told me nothing existing would change. Which is it?
```

Skipping the change altogether looks like every profile page failing with wording close to "table not found" — say so, and your agent goes back to this step.

## Check it

Open the running app — if nothing is open:

```prompt
Start the app on my computer and open it in my browser.
```

In order: your own profile before anything is set (it should say the profile is not set up yet, offer a way to set it up, and already show an empty posts area); set a name, a bio, and a photo, save, refresh — all three still there; sign in as a second made-up person and open the first person's profile — a read-only page; edit again changing only the bio and leaving the photo box empty — the photo survives.

> **TRY THIS:** sign out — or use a private window — and open your profile's address directly. Read everything. Then look for any way to change the name, the bio, or the photo.
>
> **EXPECT:** name, bio, and photo all visible; no edit link, no form, no upload control.
>
> **IF YOU CAN EDIT:**

```prompt
Signed out, I could change a profile. Anyone can view a profile, but only its signed-in owner should be able to change it. Fix that.
```

One fence you cannot push on from a browser is the photo storage itself — whether one person could get a file into another person's folder by going around the app. Ask instead, in plain words, and hold the answer against what you asked for:

```prompt
Who is allowed to upload a photo, and where does each person's photo go?
```

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c2). -->

When this chunk was really built, the reply said every upload lands in the uploader's own folder — and then volunteered something nobody had asked about: the size cap on a photo, and the check that a file is really an image, lived only in the app's own code, so someone with a real login who went around the app could push a 50 MB file into their own folder. It had left that out to keep the first version simple, and offered to close it later. A good answer says what was built and what was traded away. Your agent will not always raise a gap like that itself, and nothing in how it sounds will tell you which day this is; Module 5 walks you through that failing on purpose. The habit is the one you just used: ask who is allowed to do what.

Also from that run: the fresh profile read "You haven't set up your profile yet." with a "Set up your profile" link and a Posts section reading "Nothing here yet."; signed out, the same address showed everything and offered nothing to press; a second account saw exactly the same page; the edit form showed the current photo under "Leave the file empty to keep this photo."

## If something is wrong

```prompt
When I open someone else's profile I see an edit form on it — I should only be able to edit my own. Find out why and fix it.
```

```prompt
I edited just my bio and my photo disappeared. Leaving the file box empty should keep the photo that's already there. Find out why and fix it.
```

- **A page says something does not exist** — "table not found" or wording close to it:

  ```prompt
  Every profile page says something like "table not found". Find out why and fix it — if the database change never went in, walk me through it again.
  ```

- **Your agent keeps circling:** start a fresh conversation and begin this chunk again from your last saved version.

## Save it

Look first, say the sentence second — the habit for any chunk that changes the database or accepts a file. When you have clicked through it and it holds:

```prompt
Save this as a working version.
```

```prompt
Confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.
```

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. A signed-in person can set a name, a bio, and a photo, and all three are still there after a refresh.
2. Anyone can view any profile, signed in or not.
3. Only the owner of a profile sees anything that would change it.
4. The photo survives signing out and signing back in.

If your agent says "done" without showing these:

```prompt
Run the checks we agreed on and show me the results first.
```

You're done when a signed-out window can read your profile and change nothing, you can sign in and change it, and you have a saved version. If you like, ask your agent later to close the gap it named — the size and file-type limits — as a small separate ask. Next: posts, to fill the empty area on that profile.

## Navigation

[← Previous: Sign in with an email and a password](./02-sign-in.md)
[Next: Posts: write, edit, and delete your own →](./04-posts.md)
