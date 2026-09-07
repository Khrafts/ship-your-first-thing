---
title: "Caught before it ran: the question that goes before you press anything"
module: "05-operating"
lesson_number: "04"
est_minutes: 30
prereqs: ["03-the-missing-post"]
updated: "2026-09-07"
deviations:
  - staged-comment-wording
---

# Caught before it ran: the question that goes before you press anything

By the end of this lesson you can stop a database change that would delete real data before it runs, by asking one question first, and you can ask for a version of the same change that keeps what exists.

> **Last verified:** 2026-08-19. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

Nothing in this lesson touches your app. You rehearse the question now and ask it for real the next time your agent proposes a change to your database.

## What happened in that build

<!-- Deviation (staged-comment-wording): Lessons 02/03 end this comment "not the 2026-07 build, which passed this check". That clause cannot be used here — no chunk-7 evidence exists at all, so there is no run to have passed anything. The substituted clause states the absence instead. -->
<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

An app that had been live for a while, with real people's comments on it. Something in the comments started behaving oddly. The owner said what they saw and handed it over.

Their agent came back with an explanation and a file for the database, the same kind of file that had gone into the dashboard five times during the build. Paste this in, it said, and that clears it. Nothing about it looked different from the five before, and every one of those had only added things.

## The question

They did not paste it. First, the question you have asked before every database change since Module 4:

> **BEFORE YOU APPROVE ANYTHING THAT TOUCHES THE DATABASE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*

Ask it every time: before a dashboard paste, and before anything your agent proposes that goes near the place your app keeps things. Then wait. The answer should name what already exists and say what happens to each thing. "It's fine" is not an answer; ask again.

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

In that build, the answer said plainly that the table holding the comments would be removed and made again, and everything in it would go: every comment anybody had written since the app went live. It said so in the same even tone as a typo fix, with no warning around it. Your agent does not weigh what a change costs unless you ask. The question is the warning.

Nothing happened. The file stayed in the chat. Every comment stayed where it was. That is what a caught one looks like: you asked, you read a sentence, you did not press a button. It feels like nothing, which is why people stop doing it, and why it costs the most on the day it has lapsed.

## If the answer says something existing goes: the sentence back

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

You still have the problem the change was meant to fix, so what you want is not *no*. It is *the other version of this*:

> "This would delete a table that may have real data in it — is there a way to make this change that keeps what's already there?"

The first half repeats what you were told. The second half asks for another route. How that is done is your agent's job.

In that build, what came back changed what needed changing and left every comment in place. The owner asked the question again of the new version, because it is a question about the change in front of you, not a toll paid once. The second answer said nothing existing would be removed. That is the one that got pasted.

## The dashboard's own warning

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c6); presented in the desktop app's framing. -->

When you paste something into your Supabase dashboard and press Run, the dashboard sometimes stops you with its own warning, headed "Potential issue detected", saying the query includes destructive operations and may permanently change or remove data, with **Run query** and **Cancel** buttons.

The rule is a comparison. If the answer you already have explains the warning, **Run query** is the way through. If the warning names something your answer never mentioned, or you never asked, press nothing and paste the warning's words back to your agent.

When this course's own build met that dialog, the answer had already said nothing existing would be touched, so **Run query** was the right press.

<!-- Staged walkthrough story (known-bad pattern; the 2026-07 build produced no such proposal — no archived run exists for it). -->

The day it goes the other way is the day the dialog says data may be removed and your answer said nothing existing would be touched. Both cannot be true. Stop, even though you asked properly and got a clean answer.

## Three things that will argue you out of asking

You are mid-fix and want it over. The change looks small. The last five went fine. None of those says anything about what this change does to what you already have.

## Your turn

Nothing runs. Write two lines and compare them with the ones above.

1. Picture your agent coming back mid-fix with a file for your database, on an app where alice and bob have real posts and comments.
2. From memory, write the question you would send before pasting it.
3. Compare with the one above. Yours must ask whether anything existing is removed or overwritten, and ask for the list of exactly what changes.
4. Now picture the answer saying the comments would go along with their table. Write the one line you send back.
5. Compare. Yours must say what you were told, and ask for a version that keeps what is already there. If it only says stop, add the second half.
6. Keep both with the messages from Lessons 2 and 3.

## Next

Lesson 5 is the day none of these three applies: something worked yesterday and does not today, and nobody proposed anything.

## Navigation

[← Previous: The missing post: broken by what it doesn't show](./03-the-missing-post.md)
[Next: The day something breaks →](./05-the-day-something-breaks.md)
