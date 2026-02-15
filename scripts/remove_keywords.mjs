#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const file = process.argv[2] || "resume.tex";
const noBackup = process.argv.includes("--no-backup");

let content;
try {
  content = readFileSync(file, "utf-8");
} catch {
  console.error(`File not found: ${file}`);
  process.exit(2);
}

if (!noBackup) copyFileSync(file, `${file}.bak`);

content = content.replaceAll(
  /(?:Novice|Beginner|Intermediate|Advanced|Master) \\hfill \\textbf\{Keywords\}: /g,
  "",
);

writeFileSync(file, content);
console.log(
  `Removed occurrences from ${file}${noBackup ? " (no backup)" : ` (backup: ${file}.bak)`}`,
);
