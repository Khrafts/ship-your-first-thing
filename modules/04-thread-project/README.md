# Module 4 — Designing & building the thread project

Module 4 is where you stop practicing and start shipping. Across eight lessons you build one real product — the thread project, a small social app where people sign in, keep a profile, write posts, follow each other, read a feed, comment, and like. You build it in chunks: one lesson, one working feature, one saved version you can go back to. Your coding agent writes the code. You decide what gets built, check that what came back matches what you asked for, and save the working version before starting the next chunk.

Every lesson runs the full loop you named in Module 3 — intent → ask → evaluate → steer — once per chunk. `evaluate` carries the most weight in this module, because every chunk ends with you opening the running app and comparing it against what you actually asked for.

## What this module builds

By the end of this module you have a live social app at a public address that other people can open. Someone signs in with an email address and a password, sets a name and a bio and a photo, writes posts, follows other people, reads one feed of the newest posts from the people they follow plus their own, opens a post and comments on it, and likes it.

Done looks like this: you open the live link in two different browsers, sign in as two different people, and watch the two accounts behave correctly toward each other — one follows the other and shows up in the right list, each feed carries the right posts, each person can edit only their own words, and a signed-out visitor can read the public parts without being able to change anything.

Each lesson builds on the last:

- **Lesson 0 — Hello-world deploy:** get an empty app onto a public address — your first **deploy** (a one-line definition: moving an app off your own machine to a public address anyone on the internet can reach, [→ GLOSSARY](../../GLOSSARY.md#deployment)) — before a single feature exists, so every later chunk ships onto something already known to work → sets up Lesson 1 with a live app nobody can sign in to yet.
- **Lesson 1 — Sign in with an email and a password:** people sign up and sign in with an email address and a password, stay signed in when the page reloads, and can sign out → sets up Lesson 2 with a signed-in person who has nothing to their name yet.
- **Lesson 2 — The profile page:** a name, a bio, and a photo — anyone can look at a profile, only its owner can change it → sets up Lesson 3 by leaving an empty space on the profile where posts will go.
- **Lesson 3 — Writing posts:** write, edit, and delete your own posts, with an optional image, and let signed-out visitors read them → sets up Lesson 4 with every profile still an island, because nobody can follow anybody.
- **Lesson 4 — Follow and followers:** follow another person, unfollow them, and see both lists on a profile — following someone does not make them follow you back → sets up Lesson 5 with a set of people whose posts now need somewhere to land.
- **Lesson 5 — The feed:** one page carrying the newest posts from the people you follow and your own, newest first → sets up Lesson 6 by putting posts in front of readers who want to reply.
- **Lesson 6 — Comments:** every post gets a page anyone can open and read; signed-in people can comment, and only a comment's author can edit or delete it → sets up Lesson 7 with one reaction still missing.
- **Lesson 7 — Likes, then live:** a like count that moves the instant you click, then the whole app re-checked live with two real accounts → sets up Module 5, where you operate what you shipped.

The thread that ties it together: one app grows across eight lessons and never stops working. Each lesson ends with a feature you can see in a browser and a saved version you can return to, so you are never more than one chunk away from something that worked.

## How this module works

You are not writing this code. Your agent is. The split is the same in every lesson, and no lesson crosses it.

**The agent owns the code.** How the data is shaped. How the rules about who may see and change what get written. What happens between a click in your browser and the **server** (a one-line definition: a program that runs continuously, waiting for requests, [→ GLOSSARY](../../GLOSSARY.md#server)) that answers it. Which files to touch, and every error that shows up along the way. None of that is taught here, and you are never asked to write or repair it.

**You own four things:**

1. **Stating intent at the feature level.** "Signed-out visitors should be able to read the posts on my profile but not write one." What, not how. Every lesson starts here.
2. **Observing the running app.** Open it. Click things. Sign out and look again. Sign in as a second person in a second browser and watch how the two accounts see each other. Most of what goes wrong in this module is visible without reading a line of code.
3. **Running the smell-test.** A **smell-test** (a one-line definition: one thing to look for and one question to ask when it is not there, [→ GLOSSARY](../../GLOSSARY.md#smell-test)) is a check you can run without understanding the code underneath. Each lesson hands you a short list of them — things to look for in what the agent changed, or in the app in front of you. You are looking, not decoding.
4. **Saving each working chunk.** The moment a feature works, you save it into **git** (a one-line definition: the tool from Module 2 that keeps every version of your project so you can go back to one, [→ GLOSSARY](../../GLOSSARY.md#git)). That saved version — a **commit** (a one-line definition: one saved snapshot of the project, with a one-line note about what changed, [→ GLOSSARY](../../GLOSSARY.md#commit)) — is your way back when the next chunk goes sideways. And when the agent has been heading the wrong way for several turns, `/clear` and restart the chunk from that commit — the same recovery move you learned in Module 3.

### What a smell-test looks like

You do not need to understand what something means to check whether it is there. Three you will meet in this module:

- Lesson 1 asks you to look for **`await cookies()`** (a one-line definition: a label to scan for, not to decode — the `await` should be in front of `cookies()`, [→ GLOSSARY](../../GLOSSARY.md#async-cookies)) in the agent's changes. If you see a bare `cookies()` instead, you ask the agent why.
- Lesson 3 asks you to look for **`WITH CHECK`** (a one-line definition: a label to scan for, not to decode — it belongs next to every rule that lets someone edit something, [→ GLOSSARY](../../GLOSSARY.md#with-check)) in the agent's changes. If it is not there, you ask the agent what stops a person from editing a post to look like somebody else wrote it.
- Lesson 5 asks you to open your own feed and check that your newest post is near the top of it. If it is not, you tell the agent your own posts are missing from your feed.

You are not reading any of this for meaning, and no lesson explains it. You check whether it is there, and you ask when it is not. The agent explains and fixes; you notice. If the wording differs from what the lesson shows, that is still a question for the agent — ask what it used instead.

## Lessons in this module

Lessons 0, 1, and 2 are published — the links below are live. The rest are on the way; this page shows where the module goes. The filenames and their order are fixed, so this is the sequence you will work through:

0. [`00-hello-world-deploy.md`](./00-hello-world-deploy.md) — an empty app at a public address before any feature exists
1. [`01-sign-in.md`](./01-sign-in.md) — sign in with an email and a password, and stay signed in across a reload
2. [`02-profile.md`](./02-profile.md) — name, bio, photo: anyone looks, only the owner changes
3. `03-posts.md` — write, edit, delete your own posts; signed-out visitors can read them
4. `04-follow.md` — follow, unfollow, and two lists that stay one-directional
5. `05-feed.md` — the people you follow, plus you, newest first
6. `06-comments.md` — a page per post; signed-in people reply, authors edit their own
7. `07-likes-and-go-live.md` — a count that moves on click, then the whole app re-checked live

## Before you start

You need Modules 0 through 3.5 finished, all of them. Module 0 got your workspace and your agent running; Module 1 gave you the shape of a web product; Module 2 gave you the tools; Module 3 gave you the loop; Module 3.5 gave you the observation floor — reading a file tree, spotting a wrong-file edit, following an error message back to one of your files, and recognizing a missing `'use client'`. This module uses all five, every chunk.

## Navigation

[← Module 3.5 — Reading code, just enough](../03.5-reading-code/README.md)
[Next: Module 5 — Operating the build →](../../README.md)
