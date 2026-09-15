---
title: "Comments: a page for every post, and a thread under it"
module: "04-thread-project"
lesson_number: 07
est_minutes: 55
prereqs: ["06-feed"]
updated: "2026-09-08"
deviations: []
---

# Comments: a page for every post, and a thread under it

## What you'll have at the end

A page for every post that anyone can open and read, with a comment thread under it that only signed-in people can write into, where only a comment's author can edit or delete it — and the habit of settling who-may-change-what by trying the forbidden things yourself, after seeing a careful, reason-giving answer about those same rules turn out to be backwards. A comment thread is the first place two people write into the same spot, which turns "who may change what" into a question with something at stake.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

Every post gets its own address, and that page opens for anyone — signed in, signed out, or somebody who has never heard of your app. Under the post is its comment thread, oldest first. Signed in, you can leave a comment. On your own comments you get Edit and Delete; on everybody else's, neither. Reading is open to the street; writing is not.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say:

```prompt
Read the plan and the house rules, and tell me where we are.
```

Then:

```prompt
Give each post its own page that anyone can open and read, including all of its comments — works even when I'm signed out. If I'm signed in, I can leave a comment. People can only edit or delete the comments they wrote themselves, never anyone else's. Plan this before you write any code, and tell me how you'll stop a signed-out visitor from posting. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: every post has a page a signed-out visitor can open and read, comments included; a signed-in person can leave a comment and it appears in the thread; only a comment's author can edit or delete it; a signed-out visitor has no way to comment.
```

Check the plan against what you asked for — a page anyone can open, a thread under it, comments only their author can touch — and that "how you'll stop a signed-out visitor" came back as something specific. If it lists more than one defense, you want it to say which one still stands when the others are gone. Then:

```prompt
That matches what I want. Go ahead.
```

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6); presented in the desktop app's framing. -->

When this chunk was really built, the agent first offered two choices, each with a recommendation: should Edit turn a comment into a small form right on the page or open a page of its own; and should the date on every post card be the link to the post's page, or a "3 comments" link. The first is how it gets built — hand it back with *you choose*. The second changes what people see, so it is yours; either answer is fine. Its plan then ranked its own defenses: three walls, and only the third load-bearing — the comment box is not drawn for a signed-out visitor (a courtesy), the app checks again when a comment is sent, and the database refuses to store the comment at all. "Your database refuses it" is not something to take the plan's word for; it is something you go and attempt, signed out, below. Approve the steps as the app asks. When the build finished, the agent said what it had proved with the app running and said plainly where its testing ran out: it could not exercise commenting itself until the database change had gone in.

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and app behavior against a real run in each app — user-assisted evidence pass -->

## Before anything touches your database

Comments need somewhere to live. Before you approve the change:

```prompt
Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today.
```

Hold the answer to a plain standard: it should say what the change adds, and say in so many words whether anything already in there — your profiles, your posts, your follows — is removed or overwritten. From a change whose whole job is to add comments, expect: nothing existing is touched, and running it twice is harmless.

If your agent hands you something to paste instead of making the change itself, do it the way [Lesson 3](./03-profile.md) showed. Keep the answer in mind, because the dashboard may appear to disagree with it.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6). -->

When this chunk was really built, the dashboard's warning was not softened: *may permanently change or remove data*. A change whose whole job is to add comments says that because it is written to be safe to run twice — each rule is stated from scratch, which means clearing any earlier copy of it first, and the dashboard sees the clearing-away half and warns. It is not weighing what the change adds against what it removes. The answer had said nothing existing is touched, so the warning was accounted for, and continuing was the way through — on a database holding two test accounts and a handful of posts. If the dialog names something your answer did not predict — or you never asked — press nothing:

```prompt
The dashboard says this includes destructive operations, and that's not what you told me before I approved it. What in this change removes anything, and what happens to what is already in my database if it runs?
```

## Check it

Open the running app — if nothing is open:

```prompt
Start the app on my computer and open it in my browser.
```

Open a post's page from a post card, sign in, leave a comment, then edit your own comment: the words change and `· edited` lands on the date line.

> **TRY THIS:** in a private window that has never signed in, open a post's page. Read the post and every comment under it. Then look for any way to leave one of your own.
>
> **EXPECT:** the whole thread readable — and no comment box, or one that refuses; where you would type there is a way to sign in instead.
>
> **IF IT WORKS:**

```prompt
While signed out I could ⟨what you did⟩. A signed-out visitor should only be able to read. Fix that.
```

> **TRY THIS:** signed in as your second account in another browser, open a comment your first account wrote, and try to change it. Then try to remove it. If Edit or Delete controls show on it at all, use them.
>
> **EXPECT:** no way to do either, or the attempt refuses — and after a refresh the comment is still there, reading exactly as it did.
>
> **IF IT WORKS:**

```prompt
As ⟨account B⟩ I could ⟨edit/delete⟩ ⟨account A⟩'s comment. Only its owner should be able to. Fix that.
```

**"No error" is not the same as "refused."** When you try a forbidden thing, do not only watch for a complaint. Refresh the page and look at whether the thing actually changed. A forbidden delete that quietly does nothing is the fence holding; one that quietly works is the fence down — and only the refresh tells you which.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6). -->

Now the part this course would be dishonest to leave out. When this chunk was really built, a question about the comment rules went to the agent mid-build — what protects a comment from ending up under a different person's name. The answer was, by every standard this course had taught so far, a model answer: piece by piece, a reason for every part, naming which job each part did. One of its central claims was precisely backwards. Nobody caught that by reading it. It was caught by trying the forbidden things against the real database: a signed-out attempt to write a comment was refused outright; a signed-in account editing its own comment could **not** hand that comment to the other person's name — the fence the answer had mis-described was holding the whole time; and an attempt to delete somebody else's comment produced no error and changed nothing. A fluent explanation of who can edit what settles nothing. Trying to edit the thing settles it. Module 5's first walkthrough puts you in front of a build where this exact fence is genuinely down, and you practice the recovery.

Also from that run: signed out, a post's page showed the post and every comment with a way to sign in where a comment box would be; Edit on your own comment turned that one comment into a small form in place; the second person's own comment carried Edit and Delete while yours carried neither. The course's own outline had predicted a comment box a signed-out visitor could see but not use; what got built has no box at all. Both satisfy what was asked for — what you are checking is the app in front of you, not a prediction.

## If something is wrong

```prompt
I signed out and was still able to post a comment — that shouldn't be allowed. Find out why and fix it so signed-out visitors can read but not post.
```

```prompt
Signed in as a second person, I could edit a comment I didn't write. Only the comment's own author should be able to edit or delete it. Fix that.
```

- **A page says something does not exist** — "table not found" or wording close to it: the database change never went in. Say so, and your agent goes back to that step.
- **Your agent keeps circling:** start a fresh conversation and begin this chunk again from your last saved version.

## Save it

Look first, say the sentence second. Once you have clicked through the thread from both accounts and it holds:

```prompt
Save this as a working version.
```

```prompt
Confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.
```

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed. The report is a better class of words than reasons, and it is still words: the two pushes above are yours, whatever the report says.

1. Every post has a page a signed-out visitor can open and read, comments included.
2. A signed-in person can leave a comment and it appears in the thread.
3. Only a comment's author can edit or delete it.
4. A signed-out visitor has no way to comment.

If your agent says "done" without showing these:

```prompt
Run the checks we agreed on and show me the results first.
```

You're done when a signed-out window can read a whole thread and write nothing, your second account is refused when it tries to change or remove your comment, and you have a saved version. Next: likes, and then the whole app checked live.

## Navigation

[← Previous: The feed: the people you follow, plus you](./06-feed.md)
[Next: Likes, then live: a count that moves the instant you click →](./08-likes-and-go-live.md)
