---
title: "Check the plan and the result"
module: "03-the-loop"
lesson_number: 03
est_minutes: 35
prereqs: ["02-planning-vs-execution"]
updated: "2026-09-08"
deviations: []
---

# Check the plan and the result

## Learning objective

By the end of this lesson, you will be able to run five checks that flag wrong output — against your page and your agent's own words, without reading a line of code — and catch your agent making something up.

## Why this matters

The page changed, the reply sounded pleased with itself, and you believed it. That is how most bad afternoons with these tools start — not with an obvious failure, but with a confident one. Your agent writes the same way whether it worked from something real or invented the whole thing, so "it looks fine" is a feeling rather than a check. What you need is a short list of specific things to look at, small enough to run every time.

> **Last verified:** 2026-08-17. If your agent behaves differently from what this lesson shows, the app moved and the steps didn't. On the course site, the lesson chat ("Ask about this lesson") can reconcile what you see against this exact lesson.

## Core read

Your agent is fluent, and fluency is the wrong signal to trust: it does not sound less certain when guessing. When it has nothing to go on, it makes something up and presents it as finished work. The word people use for this is [hallucination](../../GLOSSARY.md#hallucination); the tell is one line: **it names something you never made or mentioned.** This lesson is where you catch one on purpose, on your own page.

What you check against — three things, only three:

- **The page**, in your browser, refreshed.
- **Your agent's own account** of what it just did.
- **The plan**, when you asked for one.

There is no fourth where you open what your agent wrote and check it yourself. That is its job; telling whether the thing in front of you is what you wanted is yours.

### An ask that has to be invented

Your practice page is where Lesson 2 left it: name, tagline, today's date, and a button that hides and shows the date. You are in a fresh conversation, which may not know which folder it's in. If the app asks which folder, or your agent seems unsure where the page is, point it at `loop-practice` again and say what's there:

```prompt
The practice page in this folder shows my name, a tagline, today's date, and a button that hides and shows the date.
```

The new ask is deliberately thin:

```prompt
Add a list of 3 favorite books below the button.
```

Which three books? The answer exists only in your head. Your agent can ask you, put in labelled placeholders, tell you it picked three — or pick three and say nothing. Watch which one it takes. Your agent's exact words will differ from the run below.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Add a list of 3 favorite books below the button.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Added below the button, above the footer line: a small heading and a three-item list, each line a title with its author beside it in a quieter grey. […]

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and UI behavior against a real run of each — user-assisted evidence pass. -->

It did not ask first, and it could not possibly have known. It invented.

### If yours did something else

Agents change between the day a lesson is written and the day you run it. Three other things yours may do — all three end with the page in the same state, so Lesson 4 starts the same either way:

- **It asked you which books.** That's the honest answer. Don't hand it three real ones; you'd lose the thing this lesson is for. Say:

  ```prompt
  I haven't decided. Put in three made-up example books for now so I can see the layout.
  ```

- **It put in placeholders** — lines like "Book one" or "Your favorite book here" — and told you so. Also honest. Say:

  ```prompt
  Replace the placeholders with three made-up example books, titles and authors, so I can see how a real list looks.
  ```

- **It picked three and told you it had guessed.** Still an invention presented as finished work; the disclosure just came with it. Run the five checks as written.

Do not run the ask again and again until your agent fails the way the panel shows. This lesson needs a list on the page that isn't yours, however it got there.

### Now go and look

Refresh the browser tab. Below the button there is a small heading — "Three favourite books" — and three lines under it. On the day this lesson was run, they were *Shape Up* by Ryan Singer, *The Pragmatic Programmer* by Hunt and Thomas, and *Show Your Work!* by Austin Kleon. Run the same ask twice and the list changes: when it was run a second time here, two titles stayed and the third became *Deep Work* by Cal Newport. Nothing was consulted, because there was nothing to consult.

All three books are real, and the list looks like it belongs. The invented part is the claim that they are *yours*. The work is fine. The output is wrong.

### Five checks

**1. You asked for it and it isn't there.** You refresh, and the page looks exactly as before. However good the reply was, the answer is no.

**2. It's there, and it's wrong.** Something appeared, in the right place, and the content is not what you meant. The book list. A date that shows yesterday. A tagline that came back rewritten when you never asked.

**3. The plan promised more than the reply claims.** Only exists if you asked for a plan first. If the plan mentioned styling the list to match the page and the reply never mentions styling, that gap is worth one sentence:

```prompt
Your plan mentioned styling the list to match the page — did that part happen?
```

**4. It says it did something the page doesn't show.** The reply mentions a button to clear the list; you refresh and there is no such button. Believe the page.

**5. Something looks broken.** A block of red text where content should be. A region gone blank. Half the page missing. You do not read it or work out what it means — you say what you see and where:

```prompt
There's a red block of text where the book list should be, and everything below it is gone.
```

### Which one caught the books

Check 2. Watch the other four pass while it fails:

- **Isn't there:** there is a list below the button. Passes.
- **There, and wrong:** those are not your favorite books. **Fails.** (If your agent asked first or labelled its guess, this check still trips — the list is still not yours.)
- **Plan vs reply:** there was barely a plan, and what it said afterwards matches what it did. Passes.
- **Says vs shows:** everything the reply claimed is on the page. Passes.
- **Broken:** the page renders cleanly. Passes.

Four out of five said fine — which is why you run all five rather than trusting a general impression. Name the one that flagged the problem first; that is the one your next ask gets written around.

### Why this happens

Your agent is a very good writer with no way of knowing when it has run out of material. Fluent sentences need specifics; when there are none — no file naming your favorite books, no earlier message — it reaches for the most plausible candidates and writes them in with the same steady hand it uses for everything else. It is not lying. It is finishing the sentence.

The same thing covers a second case: your agent's knowledge stops at a date, and anything that changed after it is filled in the same fluent way. The tell doesn't change: it named something specific and confident that you cannot find anywhere.

## Exercise

Run the thin ask on your own page and put all five checks through their paces. Plan twenty minutes.

1. **Confirm where you are.** Your practice page should show your name, your tagline, today's date, and a button that hides and shows the date. Click the button once each way. If it isn't there, run Lesson 2's exercise first. This is a fresh conversation, so if the app asks which folder — or your agent doesn't seem to know the page — point it at `loop-practice` and tell it what's on the page in one sentence.
2. **Ask straight out, with no plan step:**

   ```prompt
   Add a list of 3 favorite books below the button.
   ```

   Approve what the app asks. Skipping the plan is deliberate here, so you can watch what a thin ask produces when nothing catches it early. If your agent asks which books, or puts in placeholders, use the matching reply from "If yours did something else". Don't repeat the ask hoping for a different behaviour.
3. **Run the five checks, in order,** with the browser tab refreshed and your agent's reply on screen:
   - Is there a list below the button at all?
   - Are those your actual favorite books?
   - Did your agent describe what it would do before doing it? Does its account afterwards match?
   - Does everything the reply claims actually show up on the page?
   - Does the page render cleanly, top to bottom?
4. **Write three sentences,** anywhere you like:
   - Which check flagged the problem first.
   - What your agent invented — the three titles, word for word.
   - What your next ask would be, in one sentence. That is the steer.
5. **Do not save this one.** This state is wrong on purpose: you save working versions, not broken ones. Lesson 4 makes it right first, and then you save it.

Your deliverable is a practice page with three books on it that aren't yours — invented outright, or made-up examples you asked for — three sentences, and nothing saved.

## Checkpoint

You've got this if you can:

1. Name the five checks without looking at this lesson.
2. Say which one caught the book list, and why the other four passed.

## Going deeper

Optional, only if you're curious:

- **Do it again with something else you never said.** Ask for "a short list of my three favorite films" or "a line about where I live", and watch the same thing happen. Two or three repetitions is when the pattern becomes an instinct.

## What you just did

You wrote an ask that could not be answered honestly, watched how your agent handled it, and named the check that caught the not-yours list while four others said everything looked fine. You left it broken on purpose: a wrong page is a thing you fix, not a thing you save — Lesson 4 fixes it.

## Navigation

[← Previous: Plan before you build](./02-planning-vs-execution.md)
[Next: Steering + recovery →](./04-steering-and-recovery.md)
