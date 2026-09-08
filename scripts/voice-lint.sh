#!/usr/bin/env bash
# voice-lint.sh — enforce Phase 1 LESSON-12 + D-18 + audience-vocabulary invariants across course markdown.
#
# Usage:
#   ./scripts/voice-lint.sh              # Default scan over the repo (excludes fixtures, .planning/, .claude/, node_modules/)
#   ./scripts/voice-lint.sh --self-test  # Iterate over scripts/voice-lint-fixtures/ and assert every fixture trips its target check.
#
# Exit code: 0 on clean, non-zero on any violation. Prints the offending file:line for each violation.
#
# What it lints (course-wide):
#   1. No tutorial fiction phrases — "in just a few clicks", "in just a couple clicks", "now you can simply", etc.
#   2. No filler phrases — "in today's fast-paced world", "in today's world", "in this day and age".
#   3. No GitHub-specific admonitions — `> [!NOTE]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!TIP]`, `> [!CAUTION]`.
#      (D-18 SSG-portability: must use universal `> **Note:**` blockquotes.)
#   4. Every `GLOSSARY.md#anchor` referenced in any module lesson must resolve to a matching `### anchor` line in GLOSSARY.md
#      (case-insensitive; permissive anchor charset).
#   5. Broken relative paths from modules/**/*.md to repo-root cross-cutting docs (GLOSSARY.md, BUDGET.md, etc.).
#   6. Jargon-density: terms marked Forbidden in docs/audience-vocabulary.md must not appear bare in that module's
#      lessons; terms marked Requires-callout must be linked to their GLOSSARY.md anchor somewhere in the lesson
#      (`[term](../../GLOSSARY.md#anchor)`; the link text may be longer than the term, e.g. `[Claude Code desktop]`).
#   7. Mermaid `<br>` / `<br/>` outside quoted node labels — GitHub's Mermaid renderer rejects HTML break tags in
#      sequenceDiagram Notes, sequenceDiagram messages, and flowchart edge labels. Only `["..."]` node labels accept them.
#   8. (retired 2026-08-16) M3 dual-agent rendering — removed with the desktop-app reshoot of Module 3.
#   9. Debugging-framing — WARN-only signals when any lesson drifts into learner-debugs posture
#      (CLAUDE.md hard rule 12). See the scan_debugging_framing comment for the pattern list.
#  10. (retired 2026-08-22) WHAT-CHANGED.md thin-entry contract — removed with the WHAT-CHANGED log
#      itself; the file stays on disk but its entry shape is no longer gated.
#  11. Glossary `Used in:` citations — WARN-only. Every lesson a GLOSSARY.md entry cites must exist,
#      and must either link that anchor or name the term. See the scan_glossary_used_in comment.
#  12. Prompt-and-callout bloat (added 2026-09-08). 12a — VIOLATION: the retired parenthetical vocab
#      callout `**term** (definition, [→ GLOSSARY](...))` in a lesson; the required form is a direct
#      link `[term](../../GLOSSARY.md#anchor)`. Promoted from WARN the same day, once no lesson carried
#      the old shape. 12b — WARN-only: a technology chore named inside a fenced `prompt` block (npm,
#      node, terminal, SQL, migration, .env, localhost, …) — learner prompts describe behaviour; the
#      agent owns setup and technical decisions.
#
# Note: `set -e` is intentionally omitted; grep returns 1 on no-match, which is our happy path.
# Code review findings closed: WR-01..WR-05, IN-04 (see .planning/phases/01-foundation-front-door/01-REVIEW.md).

set -uo pipefail

trap 'echo "voice-lint: interrupted" >&2; exit 130' INT

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Default scope: an array so it expands correctly inside quoted grep calls (WR-01 fix).
# Note: grep --exclude-dir matches by basename, not path — so we pass the directory's basename only.
# `--exclude=GLOB` matches filenames at any depth (also basename-only) and is used for
# self-documenting docs that quote banned patterns as illustrations (e.g., CLAUDE.md +
# docs/COURSE-AUTHORING.md describe what tutorial-fiction phrases look like and would
# otherwise trip the literal-phrase scans). Extend this list when adding a new authoring
# or agent-facing doc that needs the same exemption.
SCOPE_GLOBS=(
  --include=*.md
  --exclude-dir=.planning
  --exclude-dir=.claude
  --exclude-dir=.superpowers
  --exclude-dir=node_modules
  --exclude-dir=voice-lint-fixtures
  --exclude=CLAUDE.md
  --exclude=COURSE-AUTHORING.md
)

# Mirror of the basename-exempt list for scan functions that use `find` instead of
# `grep`'s built-in `--exclude` flag (scan_mermaid_br). Keep these two lists in sync.
SCOPE_EXEMPT_BASENAMES=(
  CLAUDE.md
  COURSE-AUTHORING.md
)

# Forbidden phrase patterns (literal substrings, case-insensitive).
TUTORIAL_PATTERNS=(
  'in just a few clicks'
  'in just a couple clicks'
  'now you can simply'
  'just like that'
  'as simple as that'
)

FILLER_PATTERNS=(
  "in today's fast-paced world"
  "in today's world"
  "in this day and age"
  'fast-paced world'
)

ADMONITION_PATTERNS=(
  '> \[!NOTE\]'
  '> \[!WARNING\]'
  '> \[!IMPORTANT\]'
  '> \[!TIP\]'
  '> \[!CAUTION\]'
)

# Repo-root cross-cutting artifacts the broken-relative-path check validates.
ROOT_ARTIFACTS=(
  GLOSSARY.md BUDGET.md CHEATSHEET.md COMMON-ISSUES.md
  CONTRIBUTING.md WHAT-CHANGED.md VERSIONS.md LICENSING.md
  README.md SETUP.md
)

VIOLATION_COUNT=0
WARN_COUNT=0

# Portable path-resolver: given a directory (relative or absolute) + a relative target,
# returns the normalized repo-root-relative path. Handles ./, ../, and plain segments.
# macOS bash 3.2 does not have GNU realpath -m, so we implement it in pure shell.
resolve_relative() {
  local base_dir="$1"
  local target="$2"
  # Combine, then normalize.
  local combined="${base_dir}/${target}"
  # Split into components on /, then collapse.
  local IFS='/'
  # shellcheck disable=SC2206
  local parts=($combined)
  local out=()
  local p
  for p in "${parts[@]}"; do
    if [ -z "$p" ] || [ "$p" = "." ]; then
      continue
    elif [ "$p" = ".." ]; then
      # Pop last component; if already empty, ignore (can't go above root).
      if [ "${#out[@]}" -gt 0 ]; then
        unset 'out[${#out[@]}-1]'
      fi
    else
      out+=("$p")
    fi
  done
  # Rejoin.
  local result=""
  for p in "${out[@]:-}"; do
    [ -z "$p" ] && continue
    if [ -z "$result" ]; then
      result="$p"
    else
      result="${result}/${p}"
    fi
  done
  printf '%s' "$result"
}

# Count lines in a string (treats empty string as 0 lines).
count_lines() {
  local s="$1"
  if [ -z "$s" ]; then
    printf '0'
  else
    printf '%s\n' "$s" | grep -c .
  fi
}

# Run the literal-phrase scans against a list of grep targets.
# Args: $1 = "default" | "fixtures" — selects scope.
scan_literal_phrases() {
  local mode="$1"
  local scope_args
  if [ "$mode" = "fixtures" ]; then
    scope_args=(--include=*.md)
    local roots=(scripts/voice-lint-fixtures)
  else
    scope_args=("${SCOPE_GLOBS[@]}")
    local roots=(.)
  fi

  echo "==> Scanning for tutorial fiction phrases..."
  local pat hits n
  for pat in "${TUTORIAL_PATTERNS[@]}"; do
    hits=$(grep -rni "${scope_args[@]}" -e "$pat" -- "${roots[@]}" 2>/dev/null || true)
    if [ -n "$hits" ]; then
      echo "VIOLATION (tutorial fiction): pattern \"$pat\""
      echo "$hits"
      n=$(count_lines "$hits")
      VIOLATION_COUNT=$((VIOLATION_COUNT + n))
    fi
  done

  echo "==> Scanning for filler phrases..."
  for pat in "${FILLER_PATTERNS[@]}"; do
    hits=$(grep -rni "${scope_args[@]}" -e "$pat" -- "${roots[@]}" 2>/dev/null || true)
    if [ -n "$hits" ]; then
      echo "VIOLATION (filler): pattern \"$pat\""
      echo "$hits"
      n=$(count_lines "$hits")
      VIOLATION_COUNT=$((VIOLATION_COUNT + n))
    fi
  done

  echo "==> Scanning for GitHub-specific admonitions (D-18 SSG-portability)..."
  for pat in "${ADMONITION_PATTERNS[@]}"; do
    hits=$(grep -rn "${scope_args[@]}" -e "$pat" -- "${roots[@]}" 2>/dev/null || true)
    if [ -n "$hits" ]; then
      echo "VIOLATION (GitHub admonition — D-18): pattern \"$pat\""
      echo "$hits"
      n=$(count_lines "$hits")
      VIOLATION_COUNT=$((VIOLATION_COUNT + n))
    fi
  done
}

# GLOSSARY anchor resolution + missing-GLOSSARY case (WR-02, WR-05, IN-04).
scan_glossary_anchors() {
  local mode="$1"
  local search_root
  if [ "$mode" = "fixtures" ]; then
    search_root="scripts/voice-lint-fixtures"
  else
    search_root="modules"
  fi

  echo "==> Scanning for unresolved GLOSSARY anchors..."
  local any_ref
  any_ref=$(grep -rohE 'GLOSSARY\.md#[A-Za-z0-9._-]+' "$search_root" 2>/dev/null | head -1 || true)

  if [ ! -f GLOSSARY.md ]; then
    if [ -n "$any_ref" ]; then
      echo "VIOLATION (GLOSSARY.md missing): lessons reference GLOSSARY anchors but GLOSSARY.md does not exist"
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
    fi
    return
  fi

  local anchors_used
  anchors_used=$(grep -rohE 'GLOSSARY\.md#[A-Za-z0-9._-]+' "$search_root" 2>/dev/null \
    | sed -E 's|.*GLOSSARY\.md#||' | sort -u || true)

  if [ -z "$anchors_used" ]; then
    return
  fi

  local anchor
  while IFS= read -r anchor; do
    [ -z "$anchor" ] && continue
    if ! grep -qiE "^### ${anchor}\$" GLOSSARY.md 2>/dev/null; then
      echo "VIOLATION (missing GLOSSARY anchor): \"$anchor\" referenced in $search_root/ but no \"### $anchor\" entry in GLOSSARY.md"
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
    fi
  done <<< "$anchors_used"
}

# Broken-relative-path check: for every link inside modules/**/*.md (or fixtures in self-test mode) that
# targets a root cross-cutting artifact, the resolved path (relative to the lesson's directory) must
# equal the artifact's repo-root path.
scan_broken_relative_paths() {
  local mode="$1"
  local roots
  if [ "$mode" = "fixtures" ]; then
    roots=(scripts/voice-lint-fixtures)
  else
    roots=(modules)
  fi

  echo "==> Scanning for broken relative paths to root cross-cutting docs..."

  # Build a single alternation of artifact basenames for the regex.
  local artifact_alt=""
  local a
  for a in "${ROOT_ARTIFACTS[@]}"; do
    if [ -z "$artifact_alt" ]; then
      artifact_alt="$a"
    else
      artifact_alt="${artifact_alt}|$a"
    fi
  done

  local lessons_list
  lessons_list=$(find "${roots[@]}" -type f -name '*.md' 2>/dev/null || true)
  [ -z "$lessons_list" ] && return

  local lesson lesson_dir link target expected resolved basename a matched
  while IFS= read -r lesson; do
    [ -z "$lesson" ] && continue
    lesson_dir=$(dirname "$lesson")

    # Extract every Markdown link target of the form ](XXX) where XXX ends in an artifact basename.
    # Capture into a variable (not piped into while — bash 3.2 runs piped while in subshell which
    # loses our VIOLATION_COUNT increments).
    local links_raw
    links_raw=$(grep -oE "\]\([^)]*(${artifact_alt})(#[^)]*)?\)" "$lesson" 2>/dev/null \
                | sed -E 's/^\]\(//; s/\)$//' || true)
    [ -z "$links_raw" ] && continue

    while IFS= read -r link; do
      [ -z "$link" ] && continue
      # Strip anchor for path resolution.
      target="${link%%#*}"
      # Determine which artifact basename this is.
      basename=$(printf '%s' "$target" | awk -F/ '{print $NF}')
      matched=""
      for a in "${ROOT_ARTIFACTS[@]}"; do
        if [ "$basename" = "$a" ]; then
          matched="$a"
          break
        fi
      done
      [ -z "$matched" ] && continue

      # Skip absolute URLs (http://, https://, mailto:) — those aren't relative paths.
      case "$target" in
        http://*|https://*|mailto:*) continue ;;
      esac

      expected="$matched"
      resolved=$(resolve_relative "$lesson_dir" "$target")
      # If the resolved path is a real file at that location, the link works — accept it.
      # This makes sibling-README links (e.g., modules/01-mental-models/README.md) pass while
      # still catching the Phase 1 bug shape: GLOSSARY.md from a sub-module resolving to a
      # non-existent modules/<sub>/GLOSSARY.md.
      if [ -f "$resolved" ]; then
        continue
      fi
      if [ "$resolved" != "$expected" ]; then
        echo "VIOLATION (broken relative path): $lesson links to '$link' which resolves to '$resolved', expected '$expected'"
        VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
      fi
    done <<< "$links_raw"
  done <<< "$lessons_list"
}

# Parse a section of docs/audience-vocabulary.md to extract bulleted terms.
# Args: $1 = module header (e.g., "Module 0 (M0)"), $2 = subsection ("Forbidden" | "Requires-callout"),
#       $3 = optional source file override (defaults to docs/audience-vocabulary.md; self-test uses
#       this to exercise the extractor directly against a fixture without touching the real contract).
# Strategy: locate the H2 line, then within that section find the H3 subsection, then read bullet lines
# until the next H2/H3 or EOF. A bullet line is one that starts with "- " (optionally with leading spaces).
# Terms may appear as plain "- term" or with descriptive text "- term (note...)" — we extract the first
# comma-or-paren-delimited token only.
# Two bullet shapes exist in the contract file:
#   (a) A plain comma-separated term list, e.g. "- HTTP, DNS, request, ..." — split on ", ".
#   (b) A bolded term (or slash-joined terms) followed by definition prose, e.g.
#       "- **Supabase** — introduce as \"...an account system, a database, and file storage
#       in one.\" ..." — here the definition prose is NOT parenthetical, so it survives the
#       paren-strip step, and comma-splitting the whole line turns its descriptive clauses
#       (like "a database") into phantom terms. For this shape we extract ONLY the leading
#       run of **term** segments (joined by " / " for entries like "**secret key** /
#       **publishable key**") and discard everything from the first non-bold separator on —
#       the definition text is never a term, no matter what punctuation it contains.
extract_vocab_terms() {
  local module_header="$1"
  local subsection="$2"
  local file="${3:-docs/audience-vocabulary.md}"
  [ ! -f "$file" ] && return

  awk -v mh="$module_header" -v subname="$subsection" '
    BEGIN { in_module = 0; in_sub = 0 }
    /^## / {
      if (index($0, mh) > 0) { in_module = 1; in_sub = 0; next }
      else { in_module = 0; in_sub = 0; next }
    }
    /^### / {
      if (in_module && index($0, subname) > 0) { in_sub = 1; next }
      else if (in_module) { in_sub = 0; next }
      else { next }
    }
    in_sub && /^- / {
      # Strip leading "- ".
      line = $0
      sub(/^- /, "", line)

      # Shape (b): bullet opens on a bolded term. Extract only the leading run of
      # **term** segments (optionally chained with " / "); everything after that —
      # the definition/description clause — is prose, not a term, and is dropped
      # whole (including any commas inside it).
      if (line ~ /^\*\*/) {
        rest = line
        while (match(rest, /^\*\*[^*]+\*\*/) > 0) {
          term = substr(rest, RSTART + 2, RLENGTH - 4)
          gsub(/^[ \t]+|[ \t]+$/, "", term)
          if (term != "") print term
          rest = substr(rest, RSTART + RLENGTH)
          if (match(rest, /^ \/ /) > 0) {
            rest = substr(rest, RSTART + RLENGTH)
          } else {
            break
          }
        }
        next
      }

      # Shape (a): plain comma-separated term list. Remove any inline parentheticals
      # globally (handles per-item descriptions like "browser-as-program (M1
      # elevates...)", "API (as a *contract*)"), then split on ", ".
      # Iteratively remove (....) groups (handles non-nested parens; we do not encounter nested
      # parens in the contract file).
      while (match(line, / *\([^)]*\)/) > 0) {
        line = substr(line, 1, RSTART - 1) substr(line, RSTART + RLENGTH)
      }
      # Multiple terms separated by ", " — split.
      m = split(line, parts, ", ")
      for (i = 1; i <= m; i++) {
        term = parts[i]
        gsub(/^[ \t]+|[ \t]+$/, "", term)
        gsub(/[.,;:]+$/, "", term)
        if (term != "") print term
      }
    }
  ' "$file"
}

# Strip transient content from a lesson body for jargon-density bare-term checks.
# Read from stdin, write to stdout. In-memory only.
# Applies (in order): frontmatter, fenced code blocks, blockquote lines, inline code spans,
# Markdown link destinations + image destinations, retired parenthetical callout definition clauses.
strip_lesson_for_bare_check() {
  awk '
    BEGIN { in_front = 0; in_fence = 0; front_seen = 0 }
    {
      line = $0
      # Frontmatter: between first --- and second --- at top of file.
      if (NR == 1 && line == "---") { in_front = 1; front_seen = 1; next }
      if (in_front) {
        if (line == "---") { in_front = 0 }
        next
      }
      # Fenced code blocks.
      if (line ~ /^```/) { in_fence = !in_fence; next }
      if (in_fence) next
      # Blockquote lines.
      if (line ~ /^> /) next
      print line
    }
  ' | sed -E '
    # Strip inline code spans (`...`). Use a non-greedy-ish approach: each `...` pair.
    s/`[^`]*`//g
    # Strip Markdown image alt+dest: ![alt](dest)
    s/!\[[^]]*\]\([^)]*\)//g
    # Strip Markdown link destinations: keep [text], drop (dest).
    # We only need to drop (dest) so terms inside dest URLs are not counted.
    s/\]\([^)]*\)/]/g
    # Strip retired parenthetical callout clauses: **term** (anything-up-to-closing-paren) → drop whole span.
    # Handles **term** followed by optional spaces and then a (...).
    s/\*\*[^*]+\*\* *\([^)]*\)//g
  '
}

# Find first occurrence line number of pattern in file, or 0 if not found.
# Args: $1 = file, $2 = pattern (egrep syntax), $3 = "icase" | "case"
find_first_line() {
  local file="$1"
  local pat="$2"
  local mode="$3"
  local flags="-nE"
  [ "$mode" = "icase" ] && flags="-niE"
  local result
  result=$(grep $flags -- "$pat" "$file" 2>/dev/null | head -1 | cut -d: -f1 || true)
  if [ -z "$result" ]; then
    printf '0'
  else
    printf '%s' "$result"
  fi
}

# Check whether a Requires-callout term is introduced in the lesson: a plain glossary link whose
# link text contains the term as a whole word (`[Claude Code desktop](../../GLOSSARY.md#claude-code)`
# introduces "Claude Code"; plural and possessive forms count). The retired parenthetical shape is
# still accepted here so an unmigrated lesson reports the real gap (check #12a) rather than two.
# Args: $1 = file, $2 = term (case-insensitive search). Returns 0 if found, 1 otherwise.
has_d04_callout() {
  local file="$1"
  local term="$2"
  # Escape regex metacharacters in term (we only support plain words / words-with-spaces).
  local term_esc
  term_esc=$(printf '%s' "$term" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
  grep -qiE "\[([^]]*[^]A-Za-z0-9])?${term_esc}(s|es|'s)?([^]A-Za-z0-9][^]]*)?\]\([^)]*GLOSSARY\.md#[^)]*\)" "$file" 2>/dev/null && return 0
  grep -qiE "\*\*${term_esc}\*\* *\([^)]*\[→ GLOSSARY\]\([^)]*\)\)" "$file" 2>/dev/null
}

# Apply per-module forbidden/requires-callout checks to a single lesson file.
# Args:
#   $1 = lesson_file
#   $2 = module_label (e.g., "M0")
#   $3 = module_header (e.g., "Module 0 (M0)")
#   $4 = severity ("violation" | "warn") — default-mode scan uses "warn" against real lessons
#        because M0/M1 content has known gaps against the strict contract that are being
#        triaged separately; self-test against the fixture uses "violation" so the fixture trips.
check_lesson_against_module_contract() {
  local lesson="$1"
  local mlabel="$2"
  local mheader="$3"
  local severity="${4:-violation}"

  local forbidden_terms requires_terms
  forbidden_terms=$(extract_vocab_terms "$mheader" "Forbidden")
  requires_terms=$(extract_vocab_terms "$mheader" "Requires-callout")

  # Skip terms that contain shell-metacharacter pitfalls (backticks, slashes) — those are
  # contract entries for things like `/clear`, `/compact` that aren't plain prose nouns and
  # don't lend themselves to bare-word scanning.
  filter_safe_terms() {
    while IFS= read -r t; do
      [ -z "$t" ] && continue
      case "$t" in
        *'`'*|*'/'*|*'\\'*|*'$'*|*'^'*) continue ;;
      esac
      printf '%s\n' "$t"
    done
  }

  forbidden_terms=$(printf '%s\n' "$forbidden_terms" | filter_safe_terms)
  requires_terms=$(printf '%s\n' "$requires_terms" | filter_safe_terms)

  emit_finding() {
    local sev="$1"
    local msg="$2"
    if [ "$sev" = "violation" ]; then
      echo "VIOLATION ${msg}"
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
    else
      echo "WARN ${msg}"
    fi
  }

  # Pre-strip the lesson body once. "approval prompt" is a Safe compound from M0 (the agent app's
  # own approve-or-decline dialog — docs/audience-vocabulary.md, Module 0 Safe list), so it is
  # removed before either arm looks for the bare word "prompt".
  local stripped
  stripped=$(strip_lesson_for_bare_check < "$lesson" | sed -E 's/approval prompts?//gI')
  # The Requires-callout arm reads the raw lesson so a link anywhere (including inside a
  # blockquote) counts; strip the same Safe compound and the ```prompt fence markers first —
  # a fence marker names a format, not the term.
  local raw_for_requires
  raw_for_requires=$(sed -E 's/approval prompts?//gI; /^[[:space:]]*(> *)?```/d' "$lesson")

  # --- Forbidden bare-term check ---
  local term acronyms="API HTTP DNS SQL JWT RLS CI/CD USING NEXT_PUBLIC"
  while IFS= read -r term; do
    [ -z "$term" ] && continue

    # Build the working text: start from stripped lesson, then apply compound stripping for this term.
    local work="$stripped"

    # Strip Requires-callout compound mentions: any Requires-callout term that contains this term.
    # Implementation note: BSD sed -E supports |-alternation and the "I" flag for case-insensitive
    # matching. We avoid \b (GNU-only). For boundary safety we replace via bracket-expressions.
    local rterm term_esc rterm_esc
    term_esc=$(printf '%s' "$term" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
    while IFS= read -r rterm; do
      [ -z "$rterm" ] && continue
      if [ "$rterm" != "$term" ] && printf '%s' "$rterm" | grep -qiwE -- "$term_esc"; then
        rterm_esc=$(printf '%s' "$rterm" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
        # Multi-word compound terms — plain case-insensitive global strip (won't substring-collide).
        work=$(printf '%s' "$work" | sed -E "s|${rterm_esc}||gI")
      fi
    done <<< "$requires_terms"

    # Strip brand-prefix compounds: [A-Z][a-z]+ <term> followed by a non-word char.
    # We consume the trailing boundary char and put a space back to preserve word separation.
    work=$(printf '%s' "$work" | sed -E "s|[A-Z][a-z]+ ${term_esc}[^A-Za-z0-9]| |g")
    # Also handle end-of-line case (no trailing boundary char).
    work=$(printf '%s' "$work" | sed -E "s|[A-Z][a-z]+ ${term_esc}$||g")

    # Strip M0 known compound suffixes: <term> (credit|credits|path|paths) followed by non-word char.
    # Use # as sed delimiter so the | inside the alternation doesn't terminate the regex.
    work=$(printf '%s' "$work" | sed -E "s#${term_esc} (credit|credits|path|paths)[^A-Za-z0-9]# #gI")
    work=$(printf '%s' "$work" | sed -E "s#${term_esc} (credit|credits|path|paths)\$##gI")

    # Determine case-sensitivity: strict acronyms only flag uppercase forms.
    local is_acronym=0
    case " $acronyms " in
      *" $term "*) is_acronym=1 ;;
    esac

    local match_line grep_flags="-nE"
    [ "$is_acronym" -eq 0 ] && grep_flags="-niE"
    # GNU grep supports \b; BSD grep -E does too as a Perl-style boundary. Use it if available;
    # if it fails, fall back to bracket-expression boundary.
    match_line=$(printf '%s\n' "$work" | grep $grep_flags "[^A-Za-z0-9_]${term_esc}[^A-Za-z0-9_]" 2>/dev/null | head -1 | cut -d: -f1 || true)
    if [ -z "$match_line" ]; then
      # Try start-of-line boundary or end-of-line boundary
      match_line=$(printf '%s\n' "$work" | grep $grep_flags "(^|[^A-Za-z0-9_])${term_esc}([^A-Za-z0-9_]|\$)" 2>/dev/null | head -1 | cut -d: -f1 || true)
    fi

    if [ -n "$match_line" ] && [ "$match_line" != "0" ]; then
      emit_finding "$severity" "(jargon-density forbidden): $lesson: line $match_line: forbidden term '$term' for module $mlabel appears bare (not inside callout, code, URL, blockquote, or recognized compound)"
    fi
  done <<< "$forbidden_terms"

  # --- Requires-callout: term used but never linked to its glossary anchor in this lesson ---
  while IFS= read -r term; do
    [ -z "$term" ] && continue
    local term_esc
    term_esc=$(printf '%s' "$term" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
    if printf '%s\n' "$raw_for_requires" | grep -qiwE -- "$term_esc" 2>/dev/null; then
      if ! has_d04_callout "$lesson" "$term"; then
        emit_finding "$severity" "(jargon-density callout-missing): $lesson: term '$term' used without a glossary link for module $mlabel"
      fi
    fi
  done <<< "$requires_terms"
}

# Run the jargon-density check across M0–M7 lessons.
# Args: $1 = mode ("default" | "fixtures")
scan_jargon_density() {
  local mode="$1"
  echo "==> Scanning for jargon-density violations (audience model)..."

  if [ ! -f docs/audience-vocabulary.md ]; then
    echo "  WARN: docs/audience-vocabulary.md not found; skipping jargon-density check"
    return
  fi

  if [ "$mode" = "fixtures" ]; then
    # In self-test, treat fixture #6 as if it were an M0 lesson so the contract check fires.
    # Strict mode: emit violations so the fixture trips the check.
    local fixture="scripts/voice-lint-fixtures/06-jargon-density.md"
    if [ -f "$fixture" ]; then
      check_lesson_against_module_contract "$fixture" "M0" "Module 0 (M0)" "violation"
    fi
    return
  fi

  # Default mode: run against M0–M7 lessons in WARN mode.
  # The audience-vocabulary contract is strict; current prose has known gaps against it
  # (e.g., bare "commit"/"push" in M1, missing "GitHub" callout in M0, plus a larger backlog
  # across M2/M3 whose prose predates this check covering those modules, and a fresh M4 pile
  # from the Phase 3 contract flip that adds modules/04-thread-project to this scan for the
  # first time). Those gaps are triaged via the editorial backlog, not by hard-failing the
  # lint. The check is still informative — it surfaces every gap as a WARN line so
  # contributors can see what would be flagged once the contract and prose converge. The
  # fixture self-test exercises the strict (violation) path.
  local lesson
  if [ -d modules/00-welcome ]; then
    for lesson in modules/00-welcome/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M0" "Module 0 (M0)" "warn"
    done
  fi
  if [ -d modules/01-mental-models ]; then
    for lesson in modules/01-mental-models/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M1" "Module 1 (M1)" "warn"
    done
  fi
  if [ -d modules/02-toolchain ]; then
    for lesson in modules/02-toolchain/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M2" "Module 2 (M2)" "warn"
    done
  fi
  if [ -d modules/03-the-loop ]; then
    for lesson in modules/03-the-loop/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M3" "Module 3 (M3)" "warn"
    done
  fi
  if [ -d modules/04-thread-project ]; then
    for lesson in modules/04-thread-project/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M4" "Module 4 (M4)" "warn"
    done
  fi
  if [ -d modules/05-operating ]; then
    for lesson in modules/05-operating/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M5" "Module 5 (M5)" "warn"
    done
  fi
  if [ -d modules/06-after-live ]; then
    for lesson in modules/06-after-live/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M6" "Module 6 (M6)" "warn"
    done
  fi
  if [ -d modules/07-where-next ]; then
    for lesson in modules/07-where-next/*.md; do
      [ -f "$lesson" ] || continue
      check_lesson_against_module_contract "$lesson" "M7" "Module 7 (M7)" "warn"
    done
  fi
}

# Mermaid <br>/<br/> outside quoted node labels check.
#
# GitHub's Mermaid parser rejects <br> and <br/> in sequenceDiagram Notes,
# sequenceDiagram messages, and flowchart edge labels — the `<` token is read as
# the start of an arrow shape. Only flowchart node labels wrapped in `["..."]`
# accept HTML break tags. This check catches the unsafe contexts before render.
#
# Algorithm: stream every .md file; track when inside a ```mermaid ... ``` fence;
# on each in-fence line, strip out `"..."` quoted regions, then look for <br>/<br/>
# in the residue. Emit a violation per offending line.
scan_mermaid_br() {
  local mode="$1"
  local roots
  if [ "$mode" = "fixtures" ]; then
    roots=(scripts/voice-lint-fixtures)
  else
    # Default scope: every .md file in the repo except the excluded dirs.
    # We let `find` walk and apply the same exclusions as SCOPE_GLOBS.
    roots=(.)
  fi

  echo "==> Scanning Mermaid blocks for <br> / <br/> outside quoted node labels..."

  # Mirror grep --exclude basenames from SCOPE_EXEMPT_BASENAMES (e.g., CLAUDE.md,
  # COURSE-AUTHORING.md) since `find` matches paths, not basenames.
  local find_exempt_args=()
  local exempt_name
  for exempt_name in "${SCOPE_EXEMPT_BASENAMES[@]}"; do
    find_exempt_args+=(-not -name "$exempt_name")
  done

  local files
  files=$(find "${roots[@]}" -type f -name '*.md' \
            -not -path '*/.planning/*' \
            -not -path '*/.claude/*' \
            -not -path '*/.superpowers/*' \
            -not -path '*/node_modules/*' \
            $([ "$mode" != "fixtures" ] && printf -- '-not -path */voice-lint-fixtures/*') \
            "${find_exempt_args[@]}" \
            2>/dev/null || true)
  [ -z "$files" ] && return

  local file violations
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    violations=$(awk '
      BEGIN { in_mermaid = 0 }
      /^```mermaid[[:space:]]*$/ { in_mermaid = 1; next }
      /^```[[:space:]]*$/ && in_mermaid { in_mermaid = 0; next }
      in_mermaid {
        # Strip every "..." quoted region (flowchart node labels — safe form).
        stripped = $0
        gsub(/"[^"]*"/, "", stripped)
        if (stripped ~ /<br\/?>/) {
          printf "%s:%d: Mermaid <br/<br/> outside quoted node label — GitHub renderer will reject; rewrite the note/message as a single line\n", FILENAME, NR
        }
      }
    ' "$file" 2>/dev/null || true)
    if [ -n "$violations" ]; then
      # Increment per offending line (one violation per line emitted).
      local count
      count=$(printf '%s\n' "$violations" | wc -l | tr -d ' ')
      printf 'VIOLATION (mermaid-br): %s\n' "$violations"
      VIOLATION_COUNT=$((VIOLATION_COUNT + count))
    fi
  done < <(printf '%s\n' "$files")
}

# (retired 2026-08-16) M3 dual-agent rendering check — removed with the desktop-app reshoot of Module 3.

# Debugging-framing check (CLAUDE.md hard rule 12; docs/COURSE-AUTHORING.md Part 4).
# (Historical name: M3.5 diagnostic-framing — widened course-wide in the accessibility
# remake on 2026-08-13; the M3.5-only scope and the fixture filename predate that widening,
# and Module 3.5 itself was retired on 2026-08-12.)
#
# Agent-Responsibility Boundary: the learner SPOTS symptoms and ASKS the agent. The agent
# OWNS reading errors, parsing code, framework mechanics, and diagnosing root causes.
# Lessons that drift into "here's how to debug X" / "here's the anatomy of an error
# message" / "common mistakes include..." / "renders on the server" cross the boundary.
#
# This check emits WARN-only signals (does not increment VIOLATION_COUNT) — the gate
# stays open; reviewers triage. WARNs do increment WARN_COUNT for the self-test.
#
# Scope: every *.md file under modules/, at any depth, except files whose basename is
# README.md — that `-not -name 'README.md'` filter is the ONLY exclusion applied, so any
# non-lesson markdown added under modules/ (say, inside a lesson's scratch/ subdirectory)
# is scanned as well.
# The check applies uniformly across all modules — the Agent-Responsibility Boundary
# (CLAUDE.md hard rule 12) is a course-wide invariant, not a per-module one.
#
# Patterns (case-insensitive, applied to stripped lesson body — frontmatter, fenced code,
# blockquote, inline code, link destinations, retired parenthetical callout definitions are stripped first):
#
#   9a: bare "stack trace" — Forbidden; agent's job to read it
#   9b: "common mistakes" — implies the learner debugs
#   9c: "to debug" — implies the learner debugs
#   9d: "if you see ... (error|exception|crash)" — diagnostic-framing
#   9e: "renders on the server" — rendering-execution-model framing
#   9f: "anatomy of" — concept-as-decomposition framing
#   9g: "four-part" or "four-step" — over-decomposition of agent territory
#   9h: ":N:M" line:column coordinate teaching adjacent to "line" or "column"
#   9i: "diagnose" used outside an agent-framing context
#
# Agent-framing carve-out: if the line contains "the agent" (case-insensitive), the
# match is suppressed. The rewrites legitimately say "the agent reads the stack trace"
# — that is the boundary statement, not a violation.
scan_debugging_framing() {
  local mode="$1"
  echo "==> Scanning lessons for debugging-framing patterns (WARN-only, CLAUDE.md hard rule 12)..."

  local files=()
  if [ "$mode" = "fixtures" ]; then
    local f
    for f in scripts/voice-lint-fixtures/09-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
  else
    local lessons_list
    lessons_list=$(find modules -type f -name '*.md' -not -name 'README.md' 2>/dev/null || true)
    while IFS= read -r f; do
      [ -n "$f" ] && [ -f "$f" ] && files+=("$f")
    done <<< "$lessons_list"
  fi

  [ "${#files[@]}" -eq 0 ] && return

  local file stripped lineno content lc
  for file in "${files[@]}"; do
    # Per-line strip preserving line numbers. Emits "lineno:content" pairs for each line
    # that should be scanned. Frontmatter / fenced code / blockquote lines emit "lineno:"
    # (empty content) so they are skipped during scanning but line numbering stays stable.
    stripped=$(awk '
      BEGIN { in_front = 0; in_fence = 0 }
      {
        if (NR == 1 && $0 == "---") { in_front = 1; print NR ":"; next }
        if (in_front) {
          if ($0 == "---") in_front = 0
          print NR ":"
          next
        }
        if ($0 ~ /^```/) { in_fence = !in_fence; print NR ":"; next }
        if (in_fence) { print NR ":"; next }
        if ($0 ~ /^> /) { print NR ":"; next }
        work = $0
        # Strip inline code spans
        gsub(/`[^`]*`/, "", work)
        # Strip retired parenthetical callout clauses: **term** (...)
        gsub(/\*\*[^*]+\*\* *\([^)]*\)/, "", work)
        # Strip image markdown !alt(dest)
        gsub(/!\[[^]]*\]\([^)]*\)/, "", work)
        # Strip Markdown link destinations: keep [text], drop (dest)
        gsub(/\]\([^)]*\)/, "]", work)
        print NR ":" work
      }
    ' "$file")

    while IFS=: read -r lineno content; do
      [ -z "$lineno" ] && continue
      [ -z "$content" ] && continue

      # Agent-carve-out: skip if line names "the agent" (the framing the rewrites use).
      if printf '%s' "$content" | grep -iqE 'the agent'; then
        continue
      fi

      lc=$(printf '%s' "$content" | tr '[:upper:]' '[:lower:]')

      # 9a: bare "stack trace"
      if printf '%s' "$lc" | grep -qE '(^|[^a-z0-9_])stack trace([^a-z0-9_]|$)'; then
        echo "WARN (debugging-framing 9a): $file:$lineno: bare 'stack trace' — learner-debugs posture — Hard Rule 12; rephrase or scope to agent-framing context"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9b: "common mistakes"
      if printf '%s' "$lc" | grep -qE 'common mistakes'; then
        echo "WARN (debugging-framing 9b): $file:$lineno: 'common mistakes' framing — implies the learner debugs; mechanics belong to the agent"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9c: "to debug"
      if printf '%s' "$lc" | grep -qE 'to debug'; then
        echo "WARN (debugging-framing 9c): $file:$lineno: 'to debug' framing — debugging is the agent's job"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9d: "if you see ... (error|exception|crash)" within ~60 chars
      if printf '%s' "$lc" | grep -qE 'if you see [^.]{0,60}(error|exception|crash)'; then
        echo "WARN (debugging-framing 9d): $file:$lineno: 'if you see X error/exception/crash' framing — diagnostic-teach posture; rewrite as symptom + ask-the-agent"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9e: "renders on the server"
      if printf '%s' "$lc" | grep -qE 'renders on the server'; then
        echo "WARN (debugging-framing 9e): $file:$lineno: 'renders on the server' framing — rendering-execution-model is Module 7 territory"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9f: "anatomy of"
      if printf '%s' "$lc" | grep -qE 'anatomy of'; then
        echo "WARN (debugging-framing 9f): $file:$lineno: 'anatomy of' framing — concept-as-decomposition implies learner parses; agent's job"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9g: "four-part" or "four-step"
      if printf '%s' "$lc" | grep -qE 'four-part|four-step'; then
        echo "WARN (debugging-framing 9g): $file:$lineno: 'four-part/four-step' framing — over-decomposition of agent territory"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9h: ":N:M" coordinate adjacent to "line" or "column"
      if printf '%s' "$lc" | grep -qE ':[0-9]+:[0-9]+' && printf '%s' "$lc" | grep -qE '(line|column)'; then
        echo "WARN (debugging-framing 9h): $file:$lineno: 'line:column' coordinate teaching — coordinates are the agent's reading; the learner names the file path, not the numbers"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9i: "diagnose" (not preceded by "the agent" — already filtered by carve-out)
      if printf '%s' "$lc" | grep -qE '(^|[^a-z0-9_])diagnose([^a-z0-9_]|$)'; then
        echo "WARN (debugging-framing 9i): $file:$lineno: 'diagnose' framing — diagnosis is the agent's job — learner-debugs posture — Hard Rule 12"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
    done <<< "$stripped"
  done
}

# Glossary `Used in:` citation check (#11) — WARN-only.
#
# Every `### anchor` entry in GLOSSARY.md carries a `Used in:` line naming the lessons where
# the term appears. Nothing validated those citations against the lessons they name, so a
# lesson edit could silently falsify them — which happened: a Module 1 rewrite left two
# entries citing prose that no longer existed, and neither the edit nor its review caught it.
# Check #4 validates the opposite direction (lesson anchor -> glossary entry) and is blind to
# a stale citation by construction.
#
# GLOSSARY.md's own header declares the two ways a citation can be truthful: the lesson
# "links here through a vocab callout" ("that link is the contract this file exists to keep"),
# or the lesson "uses the word in passing", with no callout and no link back. This check
# accepts either — a citation is satisfied by a `GLOSSARY.md#anchor` link in the named lesson
# OR by the term appearing in that lesson's prose. Encoding a stricter rule would enforce a
# contract the file does not claim to keep.
#
#   11a (cited file exists)  — every lesson path on a `Used in:` line must resolve to a real
#       file. Applied to every entry including self-declaring ones: a dead path is a defect
#       under either reading of the line. Nothing else in the lint validates GLOSSARY.md's
#       outbound links (check #5 only walks modules/** -> repo-root docs).
#   11b (term present)       — the cited lesson must link the anchor or name the term.
#       Skipped for self-declaring entries; see below.
#   11c (line cites nothing) — a `Used in:` line that claims usage but names no lesson at all is
#       a mangled or malformed citation. Self-declaring lines are exempt: citing nothing is the
#       correct shape for them.
#
# Self-declaring entries: a `Used in:` line whose first word after the colon is "no"
# ("no current lesson.", "no lesson calls it out; ...") states outright that no lesson uses
# the term. These are deliberate landing pads, and any lesson such a line goes on to cite is
# named for context ("... records that retirement", "... names it in passing") rather than as
# a usage claim. 11b is skipped for them; 11a still applies. Several such entries cite a lesson
# that does not name the term on purpose — without this carve-out the check would flag
# deliberate, verified content.
#
# Declared surface forms accepted by 11b, matched case-insensitively against the lesson with
# markdown link destinations stripped — stripping the destinations is what stops the anchor's
# own `GLOSSARY.md#anchor` href from satisfying the prose arm and making the check circular:
#   - a hyphen in the anchor may render as a hyphen, whitespace, `/`, `.`, or nothing
#     ("row-level security", "CI/CD", "Next.js", "server components");
#   - a trailing `s`, `es`, or `'s` (plural / possessive);
#   - a final `y` may render as `ies` ("dependency" -> "dependencies").
# Both ends are boundary-guarded so a short anchor ("api") cannot match inside a longer word
# ("rapid"). The relaxations only ever suppress a warning, never create one, which is the
# safe direction for a check whose false positives would get it disabled.
#
# `nextjs` is permanently link-arm-only: prose writes "Next.js", the anchor merges the words,
# and the separator flex has no hyphen to work on in a single-segment anchor, so the prose arm
# can never match it. That is a shape of the matcher, not a defect in the entry.
#
# Known gaps, all deliberate:
#   - An entry whose lesson keeps the callout link while the bolded term drifts is satisfied by
#     the link arm alone. That leaves the entry navigable, which is the contract the link stands
#     for, so it is not flagged.
#   - The self-declaring carve-out is asserted by the very text being validated: prefixing a line
#     with "no current lesson uses the word." permanently disables 11b for it, which is exactly
#     how the Module 1 defect was repaired. The check cannot tell a truthful landing pad from a
#     citation silenced to dodge the check. Second-guessing it would warn on five true statements,
#     so the carve-out stands and this stays a human-review responsibility.
#   - (Closed 2026-09-08.) Both arms used to end in `grep -q` under `set -o pipefail`, and the
#     prose arm did bite: a term matched near the top of a long lesson, `grep -q` exited, the
#     `sed` upstream took SIGPIPE, and the real match read as a miss. Both arms now end in
#     `grep -c`, which consumes its whole input.
glossary_term_regex() {
  local t out
  t=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')
  # Replace each hyphen with the separator class using sed rather than splitting on '-' into an
  # unquoted array: an unquoted split pathname-expands a glob metacharacter, and check #4's
  # anchor charset does not forbid one appearing in a future anchor.
  out=$(printf '%s' "$t" | sed -E 's|-|[-[:space:]/.]*|g')
  case "$out" in
    *y) out="${out%y}(y|ies)" ;;
  esac
  printf "(^|[^A-Za-z0-9])%s(s|es|'s)?([^A-Za-z0-9]|\$)" "$out"
}

scan_glossary_used_in() {
  local mode="$1"
  local glossary link_base
  if [ "$mode" = "fixtures" ]; then
    glossary="scripts/voice-lint-fixtures/11-glossary-used-in-citation.md"
    link_base="scripts/voice-lint-fixtures"
  else
    glossary="GLOSSARY.md"
    link_base="."
  fi

  echo "==> Scanning GLOSSARY 'Used in:' citations against the lessons they name (WARN-only)..."

  [ -f "$glossary" ] || return

  local lineno=0 anchor="" line self_declaring targets tgt path rel rx
  while IFS= read -r line; do
    lineno=$((lineno + 1))
    case "$line" in
      '### '*)
        anchor="${line#\#\#\# }"
        continue
        ;;
      'Used in:'*) ;;
      *) continue ;;
    esac
    [ -z "$anchor" ] && continue

    self_declaring=0
    case "$line" in
      'Used in: no '*) self_declaring=1 ;;
    esac

    # An optional `#fragment` is tolerated and stripped: without it a citation written as
    # `(./modules/x.md#section)` would be skipped silently, which is the failure mode this
    # whole check exists to prevent.
    targets=$(printf '%s\n' "$line" | grep -oE '\]\([^)]*\.md(#[^)]*)?\)' | sed -E 's/^\]\(//; s/\)$//; s/#.*$//' || true)
    if [ -z "$targets" ]; then
      # A self-declaring line legitimately cites nothing ("Used in: no current lesson." — five
      # entries today). A line that claims usage and yet names no lesson is a mangled or
      # malformed citation, and skipping it silently is the same shape of hole the fragment
      # tolerance above closes. Zero non-self-declaring lines lack a citation today, so this
      # arm cannot manufacture a false positive on any legitimate line shape now in the file.
      if [ "$self_declaring" -eq 0 ]; then
        echo "WARN (glossary-used-in 11c): $glossary:$lineno: entry \"$anchor\" claims usage but its 'Used in:' line names no lesson — the citation link is missing or malformed"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      continue
    fi

    while IFS= read -r tgt; do
      [ -z "$tgt" ] && continue
      rel="${tgt#./}"
      path="${link_base}/${rel}"
      path="${path#./}"
      if [ ! -f "$path" ]; then
        echo "WARN (glossary-used-in 11a): $glossary:$lineno: entry \"$anchor\" cites $rel, which does not exist"
        WARN_COUNT=$((WARN_COUNT + 1))
        continue
      fi
      [ "$self_declaring" -eq 1 ] && continue
      # Link arm. `grep -F "GLOSSARY.md#${anchor}"` would let a LONGER anchor's link satisfy a
      # shorter anchor that prefixes it — eight such pairs exist today (api/api-key, git/github,
      # http/http-method, http/http-status-code, prompt/prompt-injection, row/row-level-security,
      # server/server-components, session/session-token). Extract the anchors the lesson actually
      # references, using check #4's anchor charset, and compare whole-string with `grep -qxF`.
      # That settles the boundary by construction and interpolates the anchor into no pattern at
      # all, so a future anchor containing a regex metacharacter cannot widen the match.
      # Both arms end in `grep -c`, which reads its whole input, so an early match can never
      # close the pipe on the upstream stage (a `grep -q` here made a real match in a long
      # lesson read as a miss under pipefail — seen on M3 L4 for "steer", 2026-09-08).
      if [ "$(grep -oE 'GLOSSARY\.md#[A-Za-z0-9._-]+' "$path" \
        | sed -E 's|.*GLOSSARY\.md#||' | grep -cxF "$anchor")" -gt 0 ]; then
        continue
      fi
      rx=$(glossary_term_regex "$anchor")
      if [ "$(sed -E 's/\]\([^)]*\)/]/g' "$path" | grep -ciE "$rx")" -gt 0 ]; then
        continue
      fi
      echo "WARN (glossary-used-in 11b): $glossary:$lineno: entry \"$anchor\" cites $rel, but that lesson neither links #$anchor nor names the term — the citation may have been falsified by a later edit"
      WARN_COUNT=$((WARN_COUNT + 1))
    done <<< "$targets"
  done < "$glossary"
}

# Prompt-and-callout bloat check (#12). Added 2026-09-08 with the outcome-first revision.
#
# 12a — legacy parenthetical vocab callout. The course used to define every Requires-callout
#       term inline: `**term** (one-line definition, [→ GLOSSARY](../../GLOSSARY.md#anchor))`.
#       Those clauses read as interruptions, so the required form is now a plain direct link —
#       `[term](../../GLOSSARY.md#anchor)` — with the definition living in GLOSSARY.md. Any
#       surviving parenthetical form under modules/ or thread-project-template/ is a VIOLATION
#       (promoted from WARN once every lesson had migrated) so it does not creep back. Root docs
#       that quote the pattern as an illustration are not scanned.
#
# 12b — technology chore inside a fenced `prompt` block. Everything a learner copies and sends
#       to their agent lives in a ```prompt fence. Those prompts describe the behaviour the
#       learner wants; they never dictate tools, files, commands or storage. A prompt that names
#       npm, Node, a terminal, SQL, a migration, an .env file, a package file or localhost has
#       drifted into the agent's territory. Word-boundary matched, case-insensitive.
#
# 12a blocks (VIOLATION_COUNT); 12b is WARN-only (WARN_COUNT) — reviewers triage prompt wording.
scan_prompt_bloat() {
  local mode="$1"
  echo "==> Scanning lessons for retired vocab callouts (VIOLATION) and technology chores inside prompt fences (WARN-only) — check #12..."

  local files=()
  if [ "$mode" = "fixtures" ]; then
    local f
    for f in scripts/voice-lint-fixtures/12-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
  else
    local lessons_list
    lessons_list=$(find modules thread-project-template -type f -name '*.md' 2>/dev/null || true)
    while IFS= read -r f; do
      [ -n "$f" ] && [ -f "$f" ] && files+=("$f")
    done <<< "$lessons_list"
  fi

  [ "${#files[@]}" -eq 0 ] && return

  local chore_rx='(^|[^A-Za-z0-9_])(npm|pnpm|yarn|node\.js|nodejs|terminal|command line|sql|migration|migrations|\.env|env var|environment variable|package\.json|localhost)([^A-Za-z0-9_]|$)'
  local file lineno line fence in_prompt in_other
  for file in "${files[@]}"; do
    lineno=0; in_prompt=0; in_other=0
    while IFS= read -r line || [ -n "$line" ]; do
      lineno=$((lineno + 1))
      # Track fences. A ```prompt fence opens a prompt; any other ``` toggles an ordinary fence.
      # Fences may be indented (inside a list item) or blockquoted; strip that prefix first.
      fence=$(printf '%s' "$line" | sed -E 's/^[[:space:]]*(> *)?//')
      if [ "$in_prompt" -eq 0 ] && [ "$in_other" -eq 0 ]; then
        case "$fence" in
          '```prompt'*) in_prompt=1; continue ;;
          '```'*) in_other=1; continue ;;
        esac
      elif [ "$in_prompt" -eq 1 ]; then
        case "$fence" in
          '```'*) in_prompt=0; continue ;;
        esac
        if printf '%s' "$line" | grep -qiE "$chore_rx"; then
          echo "WARN (prompt-bloat 12b): $file:$lineno: a learner prompt names a technology chore — prompts describe behaviour; setup, tools and storage are the agent's to choose"
          WARN_COUNT=$((WARN_COUNT + 1))
        fi
        continue
      else
        case "$fence" in
          '```'*) in_other=0; continue ;;
        esac
        continue
      fi
      # 12a: legacy parenthetical callout, outside fences.
      if printf '%s' "$line" | grep -qE '\*\*[^*]+\*\* *\([^)]*\[→ GLOSSARY\]\([^)]*GLOSSARY\.md#[^)]*\)\)'; then
        echo "VIOLATION (callout-bloat 12a): $file:$lineno: retired parenthetical vocab callout — use a direct link [term](../../GLOSSARY.md#anchor) and keep the definition in GLOSSARY.md"
        VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
      fi
    done < "$file"
  done
}

# ===== Self-test mode =====
# Each fixture in scripts/voice-lint-fixtures/ MUST trip the check it's designed for.
# We run each scan_* function with mode="fixtures" and capture the violation count delta;
# if any expected fixture passes the lint clean, self-test fails.
run_self_test() {
  echo "==> voice-lint --self-test: running checks against scripts/voice-lint-fixtures/"

  local fail=0
  local before after

  # Tutorial fiction (fixture 01)
  before=$VIOLATION_COUNT
  scan_literal_phrases fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  # We just ran ALL literal-phrase checks against ALL fixtures — fixtures 01,02,03 each trip one.
  # Assert at least 3 violations were emitted in this pass.
  if [ "$((after - before))" -lt 3 ]; then
    echo "SELFTEST FAIL: literal-phrase fixtures (01,02,03) tripped only $((after - before)) violation(s); expected >= 3"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: literal-phrase fixtures tripped $((after - before)) violations"
  fi

  # GLOSSARY anchor (fixture 04) — expect at least one missing-anchor violation.
  before=$VIOLATION_COUNT
  scan_glossary_anchors fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  if [ "$((after - before))" -lt 1 ]; then
    echo "SELFTEST FAIL: GLOSSARY anchor fixture (04) did not trip; expected >= 1 violation"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: GLOSSARY anchor fixture tripped $((after - before)) violations"
  fi

  # Broken-relative-path (fixture 05) — expect at least one violation.
  before=$VIOLATION_COUNT
  scan_broken_relative_paths fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  if [ "$((after - before))" -lt 1 ]; then
    echo "SELFTEST FAIL: broken-relative-path fixture (05) did not trip; expected >= 1 violation"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: broken-relative-path fixture tripped $((after - before)) violations"
  fi

  # Jargon-density (fixture 06) — expect at least 2 violations (one forbidden + one callout-missing).
  before=$VIOLATION_COUNT
  scan_jargon_density fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  if [ "$((after - before))" -lt 2 ]; then
    echo "SELFTEST FAIL: jargon-density fixture (06) tripped only $((after - before)); expected >= 2 (one forbidden + one callout-missing)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: jargon-density fixture tripped $((after - before)) violations"
  fi

  # Plain glossary links must satisfy the Requires-callout arm (fixture 06 carries two: an exact
  # link text, and a link whose text is longer than the term). Neither may WARN as callout-missing.
  if grep -qE "term 'AI coding agent' used without" /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: jargon-density flagged 'AI coding agent' as callout-missing although the fixture links it with a plain [AI coding agent](../../GLOSSARY.md#ai-coding-agent)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif grep -qE "term 'Claude Code' used without" /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: jargon-density flagged 'Claude Code' as callout-missing although the fixture links it as [Claude Code desktop](../../GLOSSARY.md#claude-code)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: plain glossary links (exact and longer link text) satisfy the Requires-callout arm"
  fi

  # Vocab term extractor comma-clause fix (fixture 06-vocab-extractor-comma-clause) — proves
  # extract_vocab_terms() no longer explodes a bold-bullet's definition prose into phantom terms.
  # Exercises the extractor directly (via its file-path override) against a bullet shaped exactly
  # like the real M4 Supabase entry that produced the "a database" phantom term: the clean bolded
  # term must be extracted whole, and no comma-clause fragment from the definition text may appear.
  local vocab_fixture="scripts/voice-lint-fixtures/06-vocab-extractor-comma-clause.md"
  if [ -f "$vocab_fixture" ]; then
    local extracted
    extracted=$(extract_vocab_terms "Module Fixture (MF)" "Requires-callout" "$vocab_fixture")
    if ! printf '%s\n' "$extracted" | grep -qxF "Widget"; then
      echo "SELFTEST FAIL: vocab-extractor fixture did not yield the clean term 'Widget'; got:"
      printf '%s\n' "$extracted"
      fail=1
    elif printf '%s\n' "$extracted" | grep -qF "a widget"; then
      echo "SELFTEST FAIL: vocab-extractor fixture still emits a phantom comma-clause term ('a widget'); got:"
      printf '%s\n' "$extracted"
      fail=1
    else
      echo "  self-test OK: vocab-extractor fixture yields only the clean term, no phantom comma-clause fragment"
    fi
  else
    echo "SELFTEST FAIL: vocab-extractor fixture missing: $vocab_fixture"
    fail=1
  fi

  # Mermaid <br> outside quoted node labels (fixture 07) — expect at least 3 violations
  # (one sequenceDiagram Note, one sequenceDiagram message, one flowchart edge label).
  before=$VIOLATION_COUNT
  scan_mermaid_br fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  if [ "$((after - before))" -lt 3 ]; then
    echo "SELFTEST FAIL: mermaid-br fixture (07) tripped only $((after - before)); expected >= 3 (Note + message + edge label)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: mermaid-br fixture tripped $((after - before)) violations"
  fi

  # Debugging-framing (fixture 09, historically m35-diagnostic-framing) — WARN-only check;
  # assert >= 3 WARNs emitted.
  before=$WARN_COUNT
  scan_debugging_framing fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$WARN_COUNT
  if [ "$((after - before))" -lt 3 ]; then
    echo "SELFTEST FAIL: debugging-framing fixture (09) tripped only $((after - before)) WARN(s); expected >= 3"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: debugging-framing fixture tripped $((after - before)) WARNs"
  fi

  # Glossary Used-in citations (fixture 11) — WARN-only check. The fixture carries three
  # synthetic entries: one citing a lesson file that does not exist (11a), one citing a real
  # fixture file that never names the term and never links the anchor (11b), and one
  # self-declaring landing-pad entry that cites a real file it does not claim to use the term
  # in. Assert the first two WARN and the third does NOT — the carve-out is the half of this
  # check most likely to regress into false positives, so it is asserted, not assumed.
  before=$WARN_COUNT
  scan_glossary_used_in fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$WARN_COUNT
  if [ "$((after - before))" -lt 3 ]; then
    echo "SELFTEST FAIL: glossary-used-in fixture (11) tripped only $((after - before)) WARN(s); expected >= 3 (11a missing file + 11b term absent + 11c line cites nothing)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif ! grep -q 'glossary-used-in 11c' /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: glossary-used-in fixture (11) did not trip arm 11c (Used-in line claiming usage but naming no lesson)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif ! grep -q 'glossary-used-in 11a' /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: glossary-used-in fixture (11) did not trip arm 11a (citation to a nonexistent lesson)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif ! grep -q 'glossary-used-in 11b' /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: glossary-used-in fixture (11) did not trip arm 11b (cited lesson never names the term)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif grep -q 'orphan-sprocket' /tmp/voice-lint-selftest.out; then
    echo "SELFTEST FAIL: glossary-used-in check warned on the self-declaring landing-pad entry 'orphan-sprocket'; the carve-out has regressed"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: glossary-used-in fixture tripped $((after - before)) WARNs (11a + 11b + 11c) and left the self-declaring entry alone"
  fi

  # Prompt-and-callout bloat (fixture 12). The fixture carries one retired parenthetical callout
  # (12a — VIOLATION) and two ```prompt fences naming a technology chore (12b — WARN), one
  # top-level and one indented inside a list item; a clean prompt fence in the same file must NOT warn.
  local vbefore=$VIOLATION_COUNT
  before=$WARN_COUNT
  scan_prompt_bloat fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$WARN_COUNT
  local vafter=$VIOLATION_COUNT
  if [ "$((vafter - vbefore))" -ne 1 ]; then
    echo "SELFTEST FAIL: prompt-bloat fixture (12) produced $((vafter - vbefore)) VIOLATION(s) from arm 12a; expected exactly 1 (the retired parenthetical callout)"
    cat /tmp/voice-lint-selftest.out
    fail=1
  elif [ "$((after - before))" -ne 2 ]; then
    echo "SELFTEST FAIL: prompt-bloat fixture (12) produced $((after - before)) WARN(s) from arm 12b; expected exactly 2 (top-level + indented chore) — the clean prompt fence must not warn"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: prompt-bloat fixture produced 1 VIOLATION (12a) and 2 WARNs (12b top-level + indented) and left the clean prompt alone"
  fi

  if [ "$fail" -ne 0 ]; then
    echo "==> voice-lint.sh --self-test: FAIL"
    exit 1
  fi

  echo "==> voice-lint.sh --self-test: PASS (all fixtures tripped their target checks)"
  exit 0
}

# ===== Entry point =====
if [ "${1:-}" = "--self-test" ]; then
  run_self_test
fi

# Default run.
scan_literal_phrases default
scan_glossary_anchors default
scan_broken_relative_paths default
scan_jargon_density default
scan_mermaid_br default
scan_debugging_framing default
scan_glossary_used_in default
scan_prompt_bloat default

if [ "$VIOLATION_COUNT" -eq 0 ]; then
  echo "==> voice-lint.sh: PASS (0 violations)"
  exit 0
else
  echo "==> voice-lint.sh: FAIL ($VIOLATION_COUNT offending line(s) — see above)"
  exit 1
fi
