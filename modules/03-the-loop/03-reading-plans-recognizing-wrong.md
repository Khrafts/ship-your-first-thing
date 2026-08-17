---
title: "Reading plans + recognizing wrong output"
module: "03-the-loop"
lesson_number: 03
est_minutes: 50
prereqs: ["02-planning-vs-execution"]
updated: "2026-08-17"
deviations: []
---

# Reading plans + recognizing wrong output

## Learning objective

By the end of this lesson, you will be able to name five observation patterns that flag wrong output, and run all five against your own page and your agent's own words — without reading a line of code.

## Why this matters

The page changed, the reply sounded pleased with itself, and you believed it. That is how most bad afternoons with these tools actually start — not with an obvious failure, but with a confident one. Nothing announces itself. Your agent writes the same way whether it worked from something real or invented the whole thing on the spot, so confidence tells you nothing, and "it looks fine" is a feeling rather than a check. What you need is a short list of specific things to look at, small enough to run every single time. Five of them cover almost everything, and none of them require you to open a file.

> **Following along:** Run this lesson in the app you picked in Module 0. Every exchange is shown for both apps; you only run your own. The panels show the shape of each exchange — your agent's exact words will differ, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

This lesson lives in the third step of the loop: **evaluate** (looking at what came back and deciding whether it matches what you actually wanted, [→ GLOSSARY](../../GLOSSARY.md#evaluate)). Lesson 2 sharpened the step before it — the **ask** (writing a specific request the agent can act on, [→ GLOSSARY](../../GLOSSARY.md#ask)) — and Lesson 1 gave you this one in its simplest form: refresh the page, does it match? That version holds up longer than you would think. This lesson is what you do when the answer is subtler than yes or no.

Start from the thing that makes it subtle. Your agent is fluent, and fluency is the wrong signal to trust. It produces smooth, plausible, well-organized sentences whether or not there is anything real behind them, and it does not sound less certain when it is guessing. Being wrong feels exactly like being right from where it sits.

The sharpest version of that has a name you met in Module 2: a **hallucination** (when your agent produces specific details that look correct but were invented — titles, names, values it had no way of knowing, [→ GLOSSARY](../../GLOSSARY.md#hallucination)). Module 2 gave you the one-line smell-test — it names something you never made or mentioned. This lesson is where you catch one on purpose, on your own page, and see how ordinary it looks while it is happening.

So what do you check against? Three things, and only three:

- **The page**, in your browser, refreshed.
- **The agent's own account** of what it just did.
- **The plan**, when you asked for one — Lesson 2's discipline paying off a lesson later.

You may be waiting for a fourth: the one where you open up what your agent wrote and check the work yourself. It isn't coming, and not because you haven't earned it yet. Checking the code is the agent's job — permanently, at every level of this course, including the real project you build in Module 4. That boundary is a feature of how this works, not a gap in your training. Your agent reads faster than you, never gets bored, and can look at any part of the project on demand; you can tell whether the thing in front of you is what you wanted, which it cannot do at all, because it cannot see your screen and has no idea what you meant. Each of you does the half you are actually good at. The three surfaces above are not the beginner version of evaluating. They are the whole job.

### An ask that has to be invented

Your practice page is where Lesson 2 left it: your name, the tagline, today's date, and a button below the date that hides it and brings it back. You are also in a fresh conversation, because that was the last thing Lesson 2 had you do — which matters more here than it did there.

Here is the new ask, and it is deliberately thin:

> Add a list of 3 favorite books below the button.

Read it once more as your agent has to read it. Which three books? Nothing in the folder says. Nothing earlier in the conversation says, because there is no earlier in the conversation. There is no place in the world it could look this up, since the answer exists only in your head and you did not say it out loud. That leaves it two options: ask you which books, or pick three. Watch which one it takes.

<!-- Grounded in a real agent run, 2026-08-17; presented in the desktop app's framing. -->

**In Claude Code desktop:**

> **You:** Add a list of 3 favorite books below the button.
> **The app asks:** Allow changes to `index.html`? — you approve.
> **The agent:** Added below the button, above the footer line: a small heading and a three-item list, each line a title with its author beside it in a quieter grey. The styling reuses the colours the page already has, so it follows the light and dark versions for free. One thing I did not do: render the page. There's no build step here, but I'd rather tell you that than imply I checked it visually — open it and confirm the spacing reads right above the footer.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

**In the ChatGPT app (Codex):**

> **You:** Add a list of 3 favorite books below the button.
> **The app asks:** Codex wants to change `index.html` — approve? — you approve.
> **The agent:** Done — a short heading and three books in a list, sitting under the button. You didn't say which books, so I put in three that suit your tagline. Refresh the page and tell me what they should be.

Two apps, two personalities, one outcome. The first one said nothing at all about where the titles came from; it described what it built, flagged a limit of its own checking, and stopped. The second mentioned that it had chosen for you — after the part about what it built, in the tone you would use for a detail rather than a problem. Neither of them refused, neither of them asked first, and neither of them could possibly have known. Both invented. That convergence is the lesson: this is not one app's flaw you can avoid by picking the other one.

### Now go and look

Refresh the browser tab. Below the button there is a small heading — "Three favourite books" — and three lines under it. On the day this lesson was run, they were *Shape Up* by Ryan Singer, *The Pragmatic Programmer* by Hunt and Thomas, and *Show Your Work!* by Austin Kleon.

Yours will be three different books, and that difference is the most useful thing on the page. Run the same ask twice and the list changes: when it was run a second time here, two titles stayed and the third became *Deep Work* by Cal Newport. Nothing was consulted, because there was nothing to consult.

Be precise about what went wrong, because it is not what a beginner expects. All three of those books are real. The authors are real. The list is spelled correctly, sits in the right place, and looks like it belongs on the page. The invented part is the claim that they are *yours* — a fact about you that your agent manufactured to fill a gap you left, and then presented in exactly the same voice it uses for things it actually knows. The work is fine. The output is wrong. Those are two different questions, and only the second one is yours.

### Five observation patterns

Five things to look for. You will run all five in the exercise; after a week they take about thirty seconds.

**1. Visual divergence — you asked for it and it isn't there.** You refresh, and the page looks exactly as it did before. No list, no heading, nothing where the new thing should be. The page is the ground truth, so however good the reply was, evaluate says no.

**2. Output divergence — it's there, and it's wrong.** Something appeared, in the right place, and the content is not what you meant. The book list is the case in front of you. So is a date that shows yesterday, a button whose label says the opposite of what it does, or a tagline that came back rewritten when you never asked for it to change. The shape is right; the substance isn't.

**3. Plan-vs-actual divergence — the plan promised more than the summary claims.** This one only exists if you asked for a plan first, which is half of why Lesson 2 exists. You are comparing two pieces of ordinary English, both written for you: what your agent said it would do, and what it afterwards says it did. If the plan mentioned styling the list to match the rest of the page and the summary never mentions styling again, that gap is worth one sentence: "Your plan mentioned styling the list to match the page — did that part happen?" You are not auditing the work. You are noticing that two paragraphs don't line up.

**4. Narration divergence — it says it did something the page doesn't show.** The reply mentions a button to clear the list; you refresh and there is no such button. This is the pattern where you have to actively decide who to believe, and the answer never changes: believe the page. Your agent is describing what it intended; the browser is showing you what exists.

**5. Something looks broken.** A block of red text where content should be. A region that has gone blank. Half the page missing below a certain point. You do not read it, work out what it means, or copy it anywhere — you say what you see and where you saw it, in plain words: *"there's a red block of text where the book list should be, and everything below it is gone."* Your agent can see the project; reading the details is its side of the arrangement, and it is faster at it than you will ever be. Your side is noticing and saying so.

What the five have in common is the point of the list: every one of them is something you can see with your eyes or read in plain English. Nothing on that list requires you to know what any of it is made of.

### Which one caught the books

Pattern 2 — output divergence. Watch the other four pass while it fails, because that is the part worth practicing:

- **Visual:** there is a list below the button. Passes.
- **Output:** those are not your favorite books, and nothing about the ask could have made them so. **Fails.**
- **Plan-vs-actual:** there was barely a plan — the agent went straight to work — and what it said afterwards matches what it did. Passes.
- **Narration:** everything the reply claimed is on the page. Passes.
- **Something broken:** the page renders cleanly. Passes.

Four out of five said fine. That is the reason for running all five rather than trusting a general impression: a general impression is a vote, and it would have lost four to one.

The patterns are not tidy compartments, either. Suppose the agent had stopped after two books — that trips pattern 2 (wrong content) and pattern 1 (a missing third line) at once, and pattern 3 as well if the plan had promised three. Overlap is normal and costs you nothing. Name the one that flagged the problem first. That is the one your **steer** (course-correcting when what came back is off, [→ GLOSSARY](../../GLOSSARY.md#steer)) gets written around, and steering is the whole of Lesson 4.

### Why this happens

Your agent is a very good writer with no way of knowing when it has run out of material. Writing fluent sentences is the thing it does; fluent sentences need specifics; and when there are no specifics available — no file that names your favorite books, no earlier message, no fact of any kind — it reaches for the most plausible candidates and writes them in with the same steady hand it uses for everything else. It is not lying, and it is not broken. It is finishing the sentence, which is what it was built to do.

The same mechanism covers a second case you will meet in the real project. Your agent's knowledge of the world stops at a date, so anything that changed after that date is simply not there — and instead of saying so, it fills the gap the same fluent way. The smell-test doesn't change: it named something specific and confident that you cannot find anywhere.

Which is why the fix is never "trust it less" in some general, anxious way. The fix is the five patterns, run every time, on the page in front of you.

## Exercise

Run the under-specified ask on your own page and put all five patterns through their paces. Plan twenty-five to thirty minutes.

1. **Confirm where you are.** Your practice page should show your name, your tagline, today's date, and a button below the date that hides it and brings it back. Click the button once each way to be sure. If it isn't there, run Lesson 2's exercise first.
2. **Ask straight out, with no plan step.** Type: *"Add a list of 3 favorite books below the button."* Approve what the app asks you to approve. You know from Lesson 2 that asking for a plan first is the better habit — skipping it here is deliberate, so you can watch what an under-specified ask produces when nothing catches it early.
3. **Run the five patterns, in order,** with the browser tab refreshed and your agent's reply on screen:
   - **Visual divergence:** is there a list below the button at all?
   - **Output divergence:** are those your actual favorite books?
   - **Plan-vs-actual divergence:** did your agent describe what it would do before doing it? Does its account afterwards match?
   - **Narration divergence:** does everything the reply claims actually show up on the page?
   - **Something looks broken:** does the page render cleanly, top to bottom?
4. **Write three sentences,** anywhere you like:
   - Which pattern flagged the problem first.
   - What your agent invented — the three titles, word for word.
   - What your next ask would be, in one sentence. That is the steer, and Lesson 4 is entirely about it.
5. **Do not save this one.** No "save this as a working version" at the end of this lesson — and that is deliberate. This state is wrong on purpose: you save working versions, not broken ones. Lesson 4 makes it right first, and then you save it.

Your deliverable is a practice page with three invented books on it, three sentences, and nothing saved.

## Checkpoint

You've got this if you can:

1. Name the five observation patterns without looking at this lesson.
2. Say which one caught the book list, and why the other four passed.

## Going deeper

Optional, only if you're curious:

- **Do it again with something else you never said.** Ask for "a short list of my three favorite films" or "a line about where I live", and watch the same thing happen with a straight face. Two or three repetitions is when the pattern stops being a lesson and starts being an instinct.
- **Module 5 puts you in front of three real failures.** Three walkthroughs, on the actual project you will have built by then, where you watch an agent get something wrong and then work out the recovery. This lesson gives you the noticing; those give you the recovering, on failures with real consequences instead of a throwaway page.
- **The next lesson is the other half of this one.** You are holding a wrong result right now and doing nothing about it. Lesson 4 is where you say the sentence that fixes it — and where you learn what to do when saying it twice hasn't worked.

## Loop check

> **Loop check — evaluate.** Lesson 1 named all four steps; this lesson goes deep on the third. Evaluating is not a feeling about the reply — it is five named checks against the page, your agent's own words, and the plan, and it never once involves reading what your agent wrote into the file. The loop step this lesson reinforces is **evaluate**.

## What you just did

You wrote an ask that could not be answered honestly, watched your agent answer it anyway with three books it made up, and named the pattern that caught it while four other checks were saying everything looked fine. Then you left it broken on purpose, which is its own small skill: knowing that a wrong page is a thing you fix rather than a thing you save. Lesson 4 is where you fix it — the three-part steer, what to do when your agent does far more than you asked, and the point where starting over beats trying again.

## Navigation

[← Previous: Planning vs execution conversations](./02-planning-vs-execution.md)
[Next: Steering + recovery →](./04-steering-and-recovery.md)
