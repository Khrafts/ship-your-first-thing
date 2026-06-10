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
#      lessons; terms marked Requires-callout must appear inside a D-04 vocab-callout the first time they appear.
#   7. Mermaid `<br>` / `<br/>` outside quoted node labels — GitHub's Mermaid renderer rejects HTML break tags in
#      sequenceDiagram Notes, sequenceDiagram messages, and flowchart edge labels. Only `["..."]` node labels accept them.
#   8. M3 dual-agent rendering — every Module 3 lesson (modules/03-the-loop/0[1-4]-*.md) MUST contain both
#      `Claude Code:` and `Gemini CLI:` as standalone-line labels (D-27 enforceability). Skip cleanly when no
#      matching files exist (Wave 0/1/2 runs).
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
# Args: $1 = module header (e.g., "Module 0 (M0)"), $2 = subsection ("Forbidden" | "Requires-callout")
# Strategy: locate the H2 line, then within that section find the H3 subsection, then read bullet lines
# until the next H2/H3 or EOF. A bullet line is one that starts with "- " (optionally with leading spaces).
# Terms may appear as plain "- term" or with descriptive text "- term (note...)" — we extract the first
# comma-or-paren-delimited token only.
extract_vocab_terms() {
  local module_header="$1"
  local subsection="$2"
  local file="docs/audience-vocabulary.md"
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
      # Strip leading "- ", then remove any inline parentheticals globally (handles per-item
      # descriptions like "browser-as-program (M1 elevates...)", "API (as a *contract*)").
      line = $0
      sub(/^- /, "", line)
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
# Markdown link destinations + image destinations, D-04 callout definition clauses.
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
      # Blockquote lines (D-04 callouts inside blockquote stripping handled by per-line "> " removal).
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
    # Strip D-04 callout definition clauses: **term** (anything-up-to-closing-paren) → drop whole span.
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

# Check whether a Requires-callout pattern (D-04 callout) for term exists in the lesson body.
# Args: $1 = file, $2 = term (case-insensitive search). Returns 0 if found, 1 otherwise.
has_d04_callout() {
  local file="$1"
  local term="$2"
  # Escape regex metacharacters in term (we only support plain words / words-with-spaces).
  local term_esc
  term_esc=$(printf '%s' "$term" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
  # Pattern: **term** (...[→ GLOSSARY](...))
  # Use grep -iE; the pattern spans one line (callouts are inline).
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

  # Pre-strip the lesson body once.
  local stripped
  stripped=$(strip_lesson_for_bare_check < "$lesson")

  # --- Forbidden bare-term check ---
  local term acronyms="API HTTP DNS SQL JWT RLS CI/CD"
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

  # --- Requires-callout: term used but no D-04 callout in the lesson ---
  while IFS= read -r term; do
    [ -z "$term" ] && continue
    local term_esc
    term_esc=$(printf '%s' "$term" | sed -E 's/[][\\.^$*+?(){}|]/\\&/g')
    if grep -qiwE -- "$term_esc" "$lesson" 2>/dev/null; then
      if ! has_d04_callout "$lesson" "$term"; then
        emit_finding "$severity" "(jargon-density callout-missing): $lesson: term '$term' used without D-04 callout for module $mlabel"
      fi
    fi
  done <<< "$requires_terms"
}

# Run the jargon-density check across M0 and M1 lessons.
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

  # Default mode: run against M0 and M1 lessons in WARN mode.
  # The audience-vocabulary contract is strict; current M0/M1 prose has known gaps against it
  # (e.g., bare "commit"/"push" in M1, missing "GitHub" callout in M0). Those gaps are triaged
  # via the editorial backlog, not by hard-failing the lint. The check is still informative —
  # it surfaces every gap as a WARN line so contributors can see what would be flagged once the
  # contract and prose converge. The fixture self-test exercises the strict (violation) path.
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

# M3 dual-agent rendering check.
#
# D-27 mandates every Module 3 lesson present BOTH agents in parallel — the lesson body
# must contain `Claude Code:` and `Gemini CLI:` as standalone-line labels (the canonical
# dual-agent rendering pattern D-25). Drifting to single-agent in any M3 lesson silently
# teaches the opposite of the pedagogy ("the loop is durable across agents").
#
# Algorithm: glob modules/03-the-loop/0[1-4]-*.md (M3 lessons; excludes README.md and the
# scratch/ subdirectory). For each match, grep -c '^Claude Code:$' AND '^Gemini CLI:$'
# must each be >= 1. If either is 0, emit a VIOLATION. If the glob matches nothing
# (Wave 3 hasn't run yet), return cleanly — this check doesn't block Wave 0/1/2 runs.
#
# In self-test mode, also scan scripts/voice-lint-fixtures/08-*.md so the fixture trips.
scan_m3_dual_agent() {
  local mode="$1"
  echo "==> Scanning M3 lessons for dual-agent rendering (D-27)..."

  local files=()
  if [ "$mode" = "fixtures" ]; then
    # Fixture mode: scan only the fixture(s).
    local f
    for f in scripts/voice-lint-fixtures/08-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
  else
    # Default mode: scan M3 lessons matching 0[1-4]-*.md (numbered 01..04 with a slug).
    # README.md and other non-numbered files are excluded.
    local f
    for f in modules/03-the-loop/0[1-4]-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
  fi

  # Glob may produce no matches — return cleanly.
  [ "${#files[@]}" -eq 0 ] && return

  local file claude_count gemini_count
  for file in "${files[@]}"; do
    claude_count=$(grep -c '^Claude Code:$' -- "$file" 2>/dev/null || true)
    gemini_count=$(grep -c '^Gemini CLI:$' -- "$file" 2>/dev/null || true)
    # grep -c on no-match still prints 0; normalize empty just in case.
    [ -z "$claude_count" ] && claude_count=0
    [ -z "$gemini_count" ] && gemini_count=0
    if [ "$claude_count" -eq 0 ] || [ "$gemini_count" -eq 0 ]; then
      echo "VIOLATION (m3-dual-agent): $file is missing Claude Code: or Gemini CLI: standalone-line label (D-27); found Claude Code:=$claude_count, Gemini CLI:=$gemini_count"
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
    fi
  done
}

# M3.5 diagnostic-framing check (CLAUDE.md hard rule 12; docs/COURSE-AUTHORING.md Part 4).
#
# M3.5 Observation-Only Floor: the learner SPOTS symptoms and ASKS the agent. The agent
# OWNS reading errors, parsing code, framework mechanics, and diagnosing root causes.
# Lessons that drift into "here's how to debug X" / "here's the anatomy of an error
# message" / "common mistakes include..." / "renders on the server" cross the boundary.
#
# This check emits WARN-only signals (does not increment VIOLATION_COUNT) — the gate
# stays open; reviewers triage. WARNs do increment WARN_COUNT for the self-test.
#
# Scope: modules/03.5-reading-code/0[1-4]-*.md only. README and non-numbered files are
# excluded. M0/M1/M2/M3 lessons are out of scope by design (steering and recovery in M3
# IS the learner's job; Anatomy-of-a-steer-ask in M3 L4 is correct in context).
#
# Patterns (case-insensitive, applied to stripped lesson body — frontmatter, fenced code,
# blockquote, inline code, link destinations, D-04 callout definitions are stripped first):
#
#   9a: bare "stack trace" — M3.5 Forbidden (moved 2026-05-18); agent's job to read it
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
scan_m35_diagnostic_framing() {
  local mode="$1"
  echo "==> Scanning M3.5 lessons for diagnostic-framing patterns (WARN-only, CLAUDE.md hard rule 12)..."

  local files=()
  if [ "$mode" = "fixtures" ]; then
    local f
    for f in scripts/voice-lint-fixtures/09-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
  else
    local f
    for f in modules/03.5-reading-code/0[1-4]-*.md; do
      [ -f "$f" ] && files+=("$f")
    done
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
        # Strip D-04 callout definition clauses: **term** (...)
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
        echo "WARN (m35-diagnostic-framing 9a): $file:$lineno: bare 'stack trace' — M3.5 Forbidden under CLAUDE.md hard rule 12; rephrase or scope to agent-framing context"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9b: "common mistakes"
      if printf '%s' "$lc" | grep -qE 'common mistakes'; then
        echo "WARN (m35-diagnostic-framing 9b): $file:$lineno: 'common mistakes' framing — implies the learner debugs; mechanics belong to the agent"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9c: "to debug"
      if printf '%s' "$lc" | grep -qE 'to debug'; then
        echo "WARN (m35-diagnostic-framing 9c): $file:$lineno: 'to debug' framing — debugging is the agent's job at the M3.5 floor"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9d: "if you see ... (error|exception|crash)" within ~60 chars
      if printf '%s' "$lc" | grep -qE 'if you see [^.]{0,60}(error|exception|crash)'; then
        echo "WARN (m35-diagnostic-framing 9d): $file:$lineno: 'if you see X error/exception/crash' framing — diagnostic-teach posture; rewrite as symptom + ask-the-agent"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9e: "renders on the server"
      if printf '%s' "$lc" | grep -qE 'renders on the server'; then
        echo "WARN (m35-diagnostic-framing 9e): $file:$lineno: 'renders on the server' framing — rendering-execution-model is Module 7 territory, not M3.5"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9f: "anatomy of"
      if printf '%s' "$lc" | grep -qE 'anatomy of'; then
        echo "WARN (m35-diagnostic-framing 9f): $file:$lineno: 'anatomy of' framing — concept-as-decomposition implies learner parses; agent's job"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9g: "four-part" or "four-step"
      if printf '%s' "$lc" | grep -qE 'four-part|four-step'; then
        echo "WARN (m35-diagnostic-framing 9g): $file:$lineno: 'four-part/four-step' framing — over-decomposition of agent territory"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9h: ":N:M" coordinate adjacent to "line" or "column"
      if printf '%s' "$lc" | grep -qE ':[0-9]+:[0-9]+' && printf '%s' "$lc" | grep -qE '(line|column)'; then
        echo "WARN (m35-diagnostic-framing 9h): $file:$lineno: 'line:column' coordinate teaching — coordinates are the agent's reading; the learner names the file path, not the numbers"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
      # 9i: "diagnose" (not preceded by "the agent" — already filtered by carve-out)
      if printf '%s' "$lc" | grep -qE '(^|[^a-z0-9_])diagnose([^a-z0-9_]|$)'; then
        echo "WARN (m35-diagnostic-framing 9i): $file:$lineno: 'diagnose' framing — diagnosis is the agent's job at the M3.5 floor"
        WARN_COUNT=$((WARN_COUNT + 1))
      fi
    done <<< "$stripped"
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

  # M3 dual-agent rendering (fixture 08) — expect at least 1 violation (fixture has only
  # the Claude Code: label, missing Gemini CLI: — D-27 demands both).
  before=$VIOLATION_COUNT
  scan_m3_dual_agent fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$VIOLATION_COUNT
  if [ "$((after - before))" -lt 1 ]; then
    echo "SELFTEST FAIL: m3-dual-agent fixture (08) tripped only $((after - before)); expected >= 1"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: m3-dual-agent fixture tripped $((after - before)) violations"
  fi

  # M3.5 diagnostic-framing (fixture 09) — WARN-only check; assert >= 3 WARNs emitted.
  before=$WARN_COUNT
  scan_m35_diagnostic_framing fixtures >/tmp/voice-lint-selftest.out 2>&1 || true
  after=$WARN_COUNT
  if [ "$((after - before))" -lt 3 ]; then
    echo "SELFTEST FAIL: m35-diagnostic-framing fixture (09) tripped only $((after - before)) WARN(s); expected >= 3"
    cat /tmp/voice-lint-selftest.out
    fail=1
  else
    echo "  self-test OK: m35-diagnostic-framing fixture tripped $((after - before)) WARNs"
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
scan_m3_dual_agent default
scan_m35_diagnostic_framing default

if [ "$VIOLATION_COUNT" -eq 0 ]; then
  echo "==> voice-lint.sh: PASS (0 violations)"
  exit 0
else
  echo "==> voice-lint.sh: FAIL ($VIOLATION_COUNT offending line(s) — see above)"
  exit 1
fi
