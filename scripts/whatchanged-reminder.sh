#!/usr/bin/env bash
# whatchanged-reminder.sh — advisory PR-time nudge: when a pull request changes
# learner-facing content (lessons, pinned versions, captures) but adds no new
# WHAT-CHANGED.md entry, remind the author and print a ready-to-fill stub.
#
# This is a REMINDER, never a gate. It emits a GitHub Actions warning annotation
# plus a step-summary note and ALWAYS exits 0, so it can never block a legitimate
# PR. The hard gate on entry *shape* is voice-lint check #10; this script catches
# the orthogonal failure — an entry that is *missing entirely*.
#
# Why a separate script (not a voice-lint check): voice-lint scans file CONTENT in
# the working tree. This needs the PR's git DIFF (which files changed, and whether
# WHAT-CHANGED.md gained an entry) — information voice-lint has no access to.
# Keeping it separate preserves voice-lint's "scan content" contract.
#
# Usage:
#   ./scripts/whatchanged-reminder.sh              # CI mode: diff BASE_SHA..HEAD, emit annotation, exit 0
#   ./scripts/whatchanged-reminder.sh --check      # Policy mode: read CHANGED_FILES/ENTRY_ADDED/OPT_OUT env, echo verdict
#   ./scripts/whatchanged-reminder.sh --self-test  # Run synthetic policy cases, assert each, exit 0/1
#
# Verdicts: REMIND (trigger touched, no entry) | OK (no trigger, or entry present) | SKIP (opted out).
# Opt out: a `no-changelog` PR label, or `[skip changelog]` in the PR body.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- Policy (the testable core) -------------------------------------------------

# is_trigger PATH -> 0 if the path is learner-facing content whose change should
# be logged in WHAT-CHANGED.md; 1 otherwise. Exclusions (author-facing files that
# live inside a trigger directory but are not learner content) are checked first.
is_trigger() {
  local f="$1"
  case "$f" in
    */CAPTURE.md) return 1 ;;          # capture briefs — author-facing, not learner content
    screenshots/README.md) return 1 ;; # screenshot conventions doc
  esac
  case "$f" in
    modules/*) return 0 ;;     # lesson bodies, module READMEs, scratch examples
    VERSIONS.md) return 0 ;;   # pinned tool versions a lesson is true against
    screenshots/*) return 0 ;; # captured transcripts / browser screenshots
  esac
  return 1
}

# classify_change -> echoes REMIND | OK | SKIP from these globals:
#   CHANGED_FILES  newline-separated changed paths
#   ENTRY_ADDED    "true" if the PR added a new dated WHAT-CHANGED.md entry
#   OPT_OUT        "true" if the PR opted out of the reminder
classify_change() {
  if [ "${OPT_OUT:-false}" = "true" ]; then
    echo "SKIP"
    return
  fi
  local matched=false f
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if is_trigger "$f"; then
      matched=true
      break
    fi
  done <<<"${CHANGED_FILES:-}"
  if [ "$matched" = false ]; then
    echo "OK"
    return
  fi
  if [ "${ENTRY_ADDED:-false}" = "true" ]; then
    echo "OK"
    return
  fi
  echo "REMIND"
}

# --- Self-test ------------------------------------------------------------------

run_self_test() {
  echo "==> whatchanged-reminder --self-test: running policy cases"
  local fail=0 n=0

  assert() {
    # assert DESC EXPECTED FILES ENTRY_ADDED OPT_OUT
    local desc="$1" expected="$2"
    CHANGED_FILES="$3"
    ENTRY_ADDED="$4"
    OPT_OUT="$5"
    local got
    got="$(classify_change)"
    n=$((n + 1))
    if [ "$got" = "$expected" ]; then
      echo "  OK   [$desc] -> $got"
    else
      echo "  FAIL [$desc] expected $expected, got $got"
      fail=1
    fi
  }

  assert "lesson changed, no entry"           REMIND "modules/03-the-loop/01-x.md"             false false
  assert "lesson changed, entry added"        OK     "modules/03-the-loop/01-x.md"             true  false
  assert "VERSIONS bumped, no entry"          REMIND "VERSIONS.md"                             false false
  assert "screenshot recaptured, no entry"    REMIND "screenshots/m3/01/a.png"                false false
  assert "only site code changed"             OK     "site/src/lib/content/index.ts"          false false
  assert "capture brief only (excluded)"      OK     "screenshots/m3/01/CAPTURE.md"           false false
  assert "screenshots README (excluded)"      OK     "screenshots/README.md"                   false false
  assert "lesson changed but opted out"       SKIP   "modules/03-the-loop/01-x.md"             false true
  assert "mixed: one trigger among many"      REMIND $'site/src/app/page.tsx\nmodules/00-welcome/01-welcome.md' false false
  assert "no files changed"                   OK     ""                                        false false
  assert "module README changed, no entry"    REMIND "modules/02-toolchain/README.md"          false false

  echo "  ($n cases)"
  if [ "$fail" -ne 0 ]; then
    echo "==> whatchanged-reminder --self-test: FAIL"
    exit 1
  fi
  echo "==> whatchanged-reminder --self-test: PASS"
  exit 0
}

# --- CI mode (default) ----------------------------------------------------------

ci_run() {
  local base="${BASE_SHA:-}"
  if [ -z "$base" ] || ! git rev-parse --verify --quiet "$base" >/dev/null; then
    echo "whatchanged-reminder: BASE_SHA unavailable or unresolvable; skipping (advisory only)"
    exit 0
  fi

  CHANGED_FILES="$(git diff --name-only "$base" HEAD 2>/dev/null || true)"
  # Capture the diff first, then match with a here-string. `git diff | grep -q`
  # trips the pipefail + SIGPIPE gotcha: grep -q closes the pipe on first match,
  # git exits 141, and pipefail propagates that non-zero — which would wrongly
  # read as "no entry added" even when a dated entry is present.
  local wc_diff
  wc_diff="$(git diff "$base" HEAD -- WHAT-CHANGED.md 2>/dev/null || true)"
  if grep -qE '^\+## [0-9]{4}-[0-9]{2}-[0-9]{2}' <<<"$wc_diff"; then
    ENTRY_ADDED=true
  else
    ENTRY_ADDED=false
  fi
  OPT_OUT="${OPT_OUT:-false}"

  local verdict
  verdict="$(classify_change)"
  echo "whatchanged-reminder: verdict=$verdict"
  [ "$verdict" = "REMIND" ] || exit 0

  local date_today pr_ref
  date_today="$(date -u +%F)"
  pr_ref="the PR"
  [ -n "${PR_NUMBER:-}" ] && pr_ref="#${PR_NUMBER}"

  # Built as a plain quoted string (not a `$(cat <<EOF)` heredoc): bash 3.2 — still
  # the default on macOS — mis-parses a heredoc nested in command substitution.
  local stub
  stub="## ${date_today} — <one-line summary: replace me>

**Change:** <what shifted, in one or two plain sentences — replace me>
**If you're affected:** <the one thing to do — or \"No learner action — internal change.\">
**Details:** ${pr_ref}"

  # Non-blocking annotation (shows in the PR's checks; never fails the job).
  echo "::warning title=Add a WHAT-CHANGED entry?::This PR changes learner-facing content but adds no WHAT-CHANGED.md entry. Add one above the check #10 boundary, or apply the 'no-changelog' label / add [skip changelog] to the PR body if no learner is affected."

  if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    {
      echo "### Add a WHAT-CHANGED entry?"
      echo
      echo "This PR changes learner-facing content (a lesson, \`VERSIONS.md\`, or a capture) but does not add a new dated entry to \`WHAT-CHANGED.md\`."
      echo
      echo "If a learner reading an older copy could be affected, paste this above the check #10 boundary in \`WHAT-CHANGED.md\` and fill it in:"
      echo
      echo '```markdown'
      echo "$stub"
      echo '```'
      echo
      echo "If no learner is affected (an internal-only change), either say so in the entry's **If you're affected:** line, or skip the reminder with a \`no-changelog\` label or \`[skip changelog]\` in the PR body."
      echo
      echo "See [CONTRIBUTING.md → Adding a WHAT-CHANGED entry](./CONTRIBUTING.md#adding-a-what-changed-entry). This is advisory — it never blocks the PR."
    } >>"$GITHUB_STEP_SUMMARY"
  else
    echo "--- suggested WHAT-CHANGED entry ---"
    echo "$stub"
  fi

  exit 0
}

# --- Entry point ----------------------------------------------------------------

case "${1:-}" in
  --self-test) run_self_test ;;
  --check) classify_change ;;
  "") ci_run ;;
  *)
    echo "usage: $0 [--check|--self-test]" >&2
    exit 2
    ;;
esac
