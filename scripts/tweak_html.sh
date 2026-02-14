#!/usr/bin/env bash
set -euo pipefail

usage(){
  cat <<EOF
Usage: $0 [file] [--no-backup]

Post-process the generated resume.html:
  - Remove email and phone contact items
  - Strip skill levels (": Master", etc.)
  - Replace CSS color variables with green accent palette

Default file: resume.html
By default the script creates a backup named <file>.bak
EOF
}

file=${1:-resume.html}
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

perl -0777 -pe '
  # Remove the email contact item (entire line + newline)
  s/^[ \t]*<span class="resume-contact-item"><span class="resume-contact-icon">📧<\/span>.*?<\/span>\n//m;

  # Remove the phone contact item (entire line + newline)
  s/^[ \t]*<span class="resume-contact-item"><span class="resume-contact-icon">📞<\/span>.*?<\/span>\n//m;

  # Strip skill level spans
  s/<span class="resume-skill-level">: (?:Novice|Beginner|Intermediate|Advanced|Master)<\/span>//g;

  # CSS color replacements (green accent palette)
  s/--keyword-color:\s*#569cd6/--keyword-color: #4ec9b0/g;
  s/--string-color:\s*#ce9178/--string-color: #6a9955/g;
  s/--class-color:\s*#4ec9b0/--class-color: #b5cea8/g;
  s/--function-color:\s*#dcdcaa/--function-color: #4fc1ff/g;
  s/--link-color:\s*#3794ff/--link-color: #4ec9b0/g;
' "$file" > "$tmp"

mv "$tmp" "$file"

if [ "$backup" -eq 1 ]; then
  echo "Tweaked $file (backup: $file.bak)"
else
  echo "Tweaked $file (no backup)"
fi
