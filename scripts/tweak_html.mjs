#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const file = process.argv[2] || "resume.html";
const noBackup = process.argv.includes("--no-backup");

let content;
try {
  content = readFileSync(file, "utf-8");
} catch {
  console.error(`File not found: ${file}`);
  process.exit(2);
}

if (!noBackup) copyFileSync(file, `${file}.bak`);

// Remove email contact item
content = content.replace(
  /^[ \t]*<span class="resume-contact-item"><span class="resume-contact-icon">📧<\/span>.*?<\/span>\n/m,
  "",
);

// Remove phone contact item
content = content.replace(
  /^[ \t]*<span class="resume-contact-item"><span class="resume-contact-icon">📞<\/span>.*?<\/span>\n/m,
  "",
);

// Strip skill level spans
content = content.replaceAll(
  /<span class="resume-skill-level">: (?:Novice|Beginner|Intermediate|Advanced|Master)<\/span>/g,
  "",
);

// CSS color replacements (green accent palette)
const colorSwaps = [
  ["--keyword-color: #569cd6", "--keyword-color: #4ec9b0"],
  ["--string-color: #ce9178", "--string-color: #6a9955"],
  ["--class-color: #4ec9b0", "--class-color: #b5cea8"],
  ["--function-color: #dcdcaa", "--function-color: #4fc1ff"],
  ["--link-color: #3794ff", "--link-color: #4ec9b0"],
];
for (const [from, to] of colorSwaps) {
  content = content.replaceAll(from, to);
}

writeFileSync(file, content);
console.log(
  `Tweaked ${file}${noBackup ? " (no backup)" : ` (backup: ${file}.bak)`}`,
);
