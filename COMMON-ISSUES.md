# Common issues

**Purpose:** What to do when X breaks. Each entry is a symptom you might see, then most-likely cause, then fix. Designed to grow over time as learners hit issues and PR them in. The first place to check when reality drifts from a lesson is `WHAT-CHANGED.md`; the second is here.

**Structure:** Grouped by where the symptom shows up (accounts, the agent app, going live). Each entry:

> ### Symptom: {one-line description}
> **You'll see:** {what the error or behavior looks like}
> **Most likely:** {cause in plain English}
> **Fix:** {numbered steps}
> **First seen in:** {lesson reference, optional}

**How to contribute:** See `CONTRIBUTING.md`. When you hit an issue, the contribution flow is: file an issue with a `common-issues` tag, or open a PR adding the entry here. Keep entries factual and short. Freshness-tagged issues (per `CONTRIBUTING.md`) often turn into entries here.

---

## Account creation

### Symptom: "GitHub asked me to verify my account and now I'm locked out"

**You'll see:** GitHub mid-signup challenges you with email verification, phone verification, or both, and the verification email/SMS hasn't arrived after a few minutes.

**Most likely:** Verification email is in spam, OR you're on a residential IP GitHub treats as suspicious, OR the SMS provider is rate-limited in your region.

**Fix:**
1. Check spam/promotions folders for the GitHub verification email.
2. If still missing after 5 minutes, request a re-send from the GitHub verification screen.
3. If SMS is failing, switch to email verification if offered.
4. If still stuck after 20 minutes, file an issue with GitHub support: [github.com/contact](https://github.com/contact). Do not create a second account in the meantime — that complicates support.

**First seen in:** Module 0 account creation.

## The agent app

### Symptom: "My agent app asks me to wait before I can keep going"

**You'll see:** On Path 2 (Codex, inside the ChatGPT desktop app), a message asking you to wait, or an offer to move to a paid plan, instead of your agent picking up your request.

**Most likely:** You've hit the free tier's daily allowance. That allowance is real, not unlimited — a heavy day can use it up. The exact size isn't published, and it isn't a failure on your part.

**Fix:**
1. Wait it out and pick your session back up once the allowance resets.
2. If you'd rather pay for a track with no built-in pauses, Path 1 (Claude Code desktop, $20/month) is the alternative.
3. Switching tracks costs you exactly one thing: creating the account you skipped the first time. Nothing else in this course locks you to the path you picked.

**First seen in:** Module 0 cost-path triage.

### Symptom: "The app is asking permission for something I don't understand"

**You'll see:** An approval prompt with wording you don't recognize, or a request that doesn't obviously connect to what you asked for.

**Most likely:** Your agent is asking before it does anything on your machine — that's the approval prompt working as designed, not a sign something's wrong.

**Fix:**
1. You always have one move, and it's always fair to use: ask your agent to "explain what this does in everyday words before I say yes." Wait for the explanation, then decide.
2. If the step can't be undone — anything you're about to paste into a dashboard, or anything that runs against data already saved — ask the fuller question instead, and wait for the answer: *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*
3. If a warning shows up that the answer didn't predict, approve nothing — hand the warning's words back to your agent instead.

**First seen in:** Module 2 (the engine room) and Module 4 (the thread project).

## Going live

### Symptom: "The live site behaves differently from my machine"

**You'll see:** A feature works when your agent shows it to you during the build, but looks or behaves differently on the public link.

**Most likely:** Your code deployed, but not every setting your code needs made the trip with it.

**Fix:**
1. Tell your agent exactly what's different on the live link versus at home.
2. Open the Vercel settings screen and read the one row you can check yourself: `NEXT_PUBLIC_SUPABASE_URL`. It should hold the address of your own Supabase project — the same address your Supabase dashboard shows for it.
3. Tell your agent whether it matches, and let it fix the live site from there. You're not auditing the rest of that screen — that stays your agent's job.

**First seen in:** Module 4, Lesson 8 (Likes, then live).

---

*This file grows as learners hit issues and PR them in — see "How to contribute" above.*
