# Common issues

**Purpose:** What to do when X breaks. Each entry is a symptom you might see, then most-likely cause, then fix. It grows as learners hit issues and PR them in.

**Structure:** Grouped by where the symptom shows up (accounts, the agent app, going live). Each entry:

> ### Symptom: {one-line description}
> **You'll see:** {what the error or behavior looks like}
> **Most likely:** {cause in plain English}
> **Fix:** {numbered steps}
> **First seen in:** {lesson reference, optional}

**How to contribute:** See `CONTRIBUTING.md`. File an issue with a `common-issues` tag, or open a PR adding the entry here. Keep entries factual and short.

---

## Accounts

### Symptom: "A sign-up asked me to verify and the message never came"

**You'll see:** GitHub, Claude or ChatGPT challenges you with email or phone verification mid-signup, and nothing arrives after a few minutes.

**Most likely:** The email is in spam, or the provider is slow in your region.

**Fix:**
1. Check spam and promotions folders.
2. After 5 minutes, request a re-send from the verification screen. If SMS is failing, switch to email verification if offered.
3. Still stuck after 20 minutes: contact that service's support. Do not create a second account in the meantime — that complicates support.

**First seen in:** Module 0 Lesson 4, Module 2 Lesson 3.

## The agent app

### Symptom: "The app says a program is missing and won't open my folder"

**You'll see:** Claude Code desktop (most often on Windows) tells you Git — or another named program — must be installed before it can open a local folder.

**Most likely:** Your computer has never had that helper program, and the agent can't install it for you because it isn't running yet.

**Fix:**
1. Follow the official installer for the program the message names — for Git, [git-scm.com/downloads](https://git-scm.com/downloads) — and accept its defaults.
2. If the installer asks for your computer's administrator password, type it into the installer's own window, never into a chat.
3. Close and reopen the app, then try the folder again. Anything else your project needs later, your agent installs when it's needed.

**First seen in:** Module 0 Lesson 5.

### Symptom: "My agent asked me a technical question I can't answer"

**You'll see:** "Should I set up version control?", "Which framework do you prefer?", "Which language should I write it in?"

**Most likely:** The agent is being polite about a decision that is its job, not yours.

**Fix:**
1. Hand it back:

   ```prompt
   I don't have a preference. Choose the simplest option that's easy to change later, and tell me what you chose.
   ```

2. At the start of your next project, send the house rule from [`CHEATSHEET.md`](./CHEATSHEET.md) first; it heads off most of these.
3. Answer only questions about behavior, cost, privacy, or which accounts to sign in to.

**First seen in:** Module 0 Lesson 6.

### Symptom: "My agent app asks me to wait before I can keep going"

**You'll see:** A message asking you to wait, an offer to move to a paid plan, or (OpenCode) a free model that stops responding or disappears from the list.

**Most likely:** You've hit your allowance. Every path has one — it's real, not unlimited — and a heavy day can use it up. It isn't a failure on your part.

**Fix:**
1. Save first if you can: *"Save this as a working version, with a one-line note about what changed."*
2. Wait it out and pick your session back up once the allowance resets; on OpenCode, pick another model marked Free.
3. If it keeps happening, a paid plan on the same path is the smallest change; switching paths costs only the account you skipped.

**First seen in:** Module 0 Lesson 3.

### Symptom: "The app is asking permission for something I don't understand"

**You'll see:** An approval prompt with wording you don't recognize, or a request that doesn't obviously connect to what you asked for.

**Most likely:** Your agent is asking before it does something on your machine — the approval prompt working as designed. (Not seeing a question at all is also normal: how often the app asks is a setting — Module 0 Lesson 5 shows where it lives.)

**Fix:**
1. Ask, and wait for the answer:

   ```prompt
   Explain what this does in everyday words before I say yes.
   ```

2. If the step can't be undone — anything you're about to paste into a dashboard, or anything that runs against data already saved — ask the pre-flight question from [`CHEATSHEET.md`](./CHEATSHEET.md) instead.
3. If a warning shows up that the answer didn't predict, approve nothing — hand the warning's words back to your agent.

**First seen in:** Module 2 Lesson 2, Module 4.

### Symptom: "My agent told me to open a terminal or type a command"

**You'll see:** "Run this command", "paste back what it prints", "install this by hand first".

**Most likely:** The agent has handed you its own job.

**Fix:**
1. Send:

   ```prompt
   That's your job — do it yourself and tell me what happened in plain words.
   ```

2. Clicking through an installer window it opened for you is fine; typing commands is not.

**First seen in:** Module 2 Lesson 2.

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
