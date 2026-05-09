# Common issues

**Purpose:** What to do when X breaks. Each entry is a symptom you might see, then most-likely cause, then fix. Designed to grow over time as learners hit issues and PR them in. The first place to check when reality drifts from a lesson is `WHAT-CHANGED.md`; the second is here.

**Structure:** Grouped by where the symptom shows up (Codespaces, accounts, tools, build, deploy). Each entry:

> ### Symptom: {one-line description}
> **You'll see:** {what the error or behavior looks like}
> **Most likely:** {cause in plain English}
> **Fix:** {numbered steps}
> **First seen in:** {lesson reference, optional}

**How to contribute:** See `CONTRIBUTING.md`. When you hit an issue, the contribution flow is: file an issue with a `common-issues` tag, or open a PR adding the entry here. Keep entries factual and short. Freshness-tagged issues (per `CONTRIBUTING.md`) often turn into entries here.

---

## Codespaces

### Symptom: "Your free tier is exhausted" notification

**You'll see:** A banner in GitHub Codespaces or a refusal to start a new Codespace.

**Most likely:** You hit the 120 core-hours/month free-tier ceiling on a 2-core machine (= 60 clock-hours). A 4-core machine burns the budget twice as fast. Stopped Codespaces still consume storage but not core-hours; running ones do.

**Fix:**
1. Check usage at [github.com/settings/billing](https://github.com/settings/billing) → Codespaces.
2. Stop any running Codespaces you don't need: from the [github.com/codespaces](https://github.com/codespaces) page.
3. Lower your machine spec to 2-core if you're on 4-core.
4. Set auto-stop to 30 minutes idle if it's not already (default in this course's `.devcontainer.json`).
5. If you're stuck out of free hours, the local install path in `SETUP.md` is the escape hatch.

**First seen in:** Module 0 hardware check.

### Symptom: "I clicked localhost:3000 and nothing loaded"

**You'll see:** Browser shows "this site can't be reached" when you try `localhost:3000` from your laptop browser while the dev server runs in Codespaces.

**Most likely:** Codespaces forwards ports to a Codespaces-issued URL, not to your laptop's `localhost`. The terminal where you ran `npm run dev` shows a clickable forwarded URL — that's the one to use, not `localhost`.

**Fix:**
1. Go to your Codespaces terminal where `npm run dev` is running.
2. Look for a line that says `Local: ... <some-url>.app.github.dev`.
3. Click that URL or copy it into your browser. That's the one wired to the running dev server.

**First seen in:** Module 2 (port-forwarding lesson — *lands in Phase 2*).

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

---

*Phases 2 onward will append entries here as Module 2/3/4 lessons surface real issues.*
