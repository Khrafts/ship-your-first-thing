#!/usr/bin/env bash
# voice-lint.sh — enforce Phase 1 LESSON-12 + D-18 invariants across course markdown.
#
# Usage: ./scripts/voice-lint.sh
# Exit code: 0 on clean, non-zero on any violation. Prints the offending file:line for each violation.
#
# What it lints (course-wide):
#   1. No tutorial fiction phrases — "in just a few clicks", "in just a couple clicks", "now you can simply", etc.
#   2. No filler phrases — "in today's fast-paced world", "in today's world", "in this day and age".
#   3. No GitHub-specific admonitions — `> [!NOTE]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!TIP]`, `> [!CAUTION]`.
#      (D-18 SSG-portability: must use universal `> **Note:**` blockquotes.)
#   4. Every `GLOSSARY.md#anchor` referenced in any module lesson must resolve to a matching `### anchor` line in GLOSSARY.md.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Files in scope: anything that ships course content. Excludes .planning/, .claude/, node_modules/.
SCOPE='--include=*.md --exclude-dir=.planning --exclude-dir=.claude --exclude-dir=node_modules'

VIOLATIONS=0

echo "==> Scanning for tutorial fiction phrases..."
TUTORIAL_PATTERNS=(
  'in just a few clicks'
  'in just a couple clicks'
  'now you can simply'
  'just like that'
  'as simple as that'
)
for pat in "${TUTORIAL_PATTERNS[@]}"; do
  HITS=$(grep -rni $SCOPE "$pat" . 2>/dev/null || true)
  if [ -n "$HITS" ]; then
    echo "VIOLATION (tutorial fiction): pattern \"$pat\""
    echo "$HITS"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

echo "==> Scanning for filler phrases..."
FILLER_PATTERNS=(
  "in today's fast-paced world"
  "in today's world"
  "in this day and age"
  'fast-paced world'
)
for pat in "${FILLER_PATTERNS[@]}"; do
  HITS=$(grep -rni $SCOPE "$pat" . 2>/dev/null || true)
  if [ -n "$HITS" ]; then
    echo "VIOLATION (filler): pattern \"$pat\""
    echo "$HITS"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

echo "==> Scanning for GitHub-specific admonitions (D-18 SSG-portability)..."
ADMONITION_PATTERNS=(
  '> \[!NOTE\]'
  '> \[!WARNING\]'
  '> \[!IMPORTANT\]'
  '> \[!TIP\]'
  '> \[!CAUTION\]'
)
for pat in "${ADMONITION_PATTERNS[@]}"; do
  HITS=$(grep -rn $SCOPE "$pat" . 2>/dev/null || true)
  if [ -n "$HITS" ]; then
    echo "VIOLATION (GitHub admonition — D-18): pattern \"$pat\""
    echo "$HITS"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

echo "==> Scanning for unresolved GLOSSARY anchors..."
if [ -f GLOSSARY.md ]; then
  ANCHORS_USED=$(grep -rohE 'GLOSSARY\.md#[a-z][a-z0-9-]*' modules/ 2>/dev/null | sed 's|GLOSSARY.md#||' | sort -u)
  for anchor in $ANCHORS_USED; do
    if ! grep -q "^### ${anchor}$" GLOSSARY.md 2>/dev/null; then
      echo "VIOLATION (missing GLOSSARY anchor): \"$anchor\" used in modules/ but no \"### $anchor\" entry in GLOSSARY.md"
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  done
fi

if [ "$VIOLATIONS" -eq 0 ]; then
  echo "==> voice-lint.sh: PASS (0 violations)"
  exit 0
else
  echo "==> voice-lint.sh: FAIL ($VIOLATIONS violation categories — see above)"
  exit 1
fi
