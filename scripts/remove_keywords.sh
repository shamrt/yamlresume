#!/usr/bin/env bash
set -euo pipefail

usage(){
  cat <<EOF
Usage: $0 [file] [--no-backup]

Default file: resume.tex
By default the script creates a backup named <file>.bak
EOF
}

file=${1:-resume.tex}
shift || true
backup=1
if [ "${1:-}" = "--no-backup" ]; then
  backup=0
fi

if [ ! -f "$file" ]; then
  echo "File not found: $file" >&2
  usage
  exit 2
fi

if [ "$backup" -eq 1 ]; then
  cp -- "$file" "$file.bak" 2>/dev/null || cp "$file" "$file.bak"
fi

tmp=$(mktemp)
perl -0777 -pe 's/(?:Novice|Beginner|Intermediate|Advanced|Master) \\hfill \\textbf\{Keywords\}: //g' "$file" > "$tmp"
mv "$tmp" "$file"

if [ "$backup" -eq 1 ]; then
  echo "Removed occurrences from $file (backup: $file.bak)"
else
  echo "Removed occurrences from $file (no backup)"
fi
