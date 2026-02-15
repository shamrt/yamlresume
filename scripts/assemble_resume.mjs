#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parse, stringify } from "yaml";

const SCHEMA_COMMENT =
  "# yaml-language-server: $schema=https://yamlresume.dev/schema.json";
const CAREER_START_YEAR = 2005;

// Parse partials
const basics = parse(readFileSync("src/basics.yml", "utf-8"));
const work = parse(readFileSync("src/work.yml", "utf-8"));
const education = parse(readFileSync("src/education.yml", "utf-8"));
const skills = parse(readFileSync("src/skills.yml", "utf-8"));
const config = parse(readFileSync("src/config.yml", "utf-8"));

// Compute dynamic values
const yearsExperience = new Date().getFullYear() - CAREER_START_YEAR;

// Inject into basics summary
basics.basics.summary = basics.basics.summary.replace(
  "{{years_experience}}",
  String(yearsExperience),
);

// Merge into final structure
const resume = {
  content: {
    ...basics,
    ...work,
    ...education,
    ...skills,
  },
  ...config,
};

// Write output
const yamlStr = stringify(resume, { lineWidth: 0 });
writeFileSync("resume.yml", `${SCHEMA_COMMENT}\n---\n${yamlStr}`);
console.log(`Assembled resume.yml (${yearsExperience}+ years of experience)`);
