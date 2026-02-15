# YAML Splitting + Dynamic Basics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split `resume.yml` into section-based partials in `src/`, with a Node assembly script that computes years of experience dynamically.

**Architecture:** Source YAML lives in `src/` as 5 partial files. A `scripts/assemble_resume.mjs` script uses the `yaml` npm package to parse, merge, inject computed values, and write `resume.yml`. The existing build pipeline runs after assembly.

**Tech Stack:** `yaml` npm package, Node.js ESM scripts

---

### Task 1: Install the `yaml` package

**Files:**

- Modify: `package.json`

**Step 1: Install yaml as a dependency**

Run: `npm install yaml`
Expected: `yaml` added to `dependencies` in `package.json`

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add yaml package"
```

---

### Task 2: Split resume.yml into src/ partials

**Files:**

- Create: `src/basics.yml`
- Create: `src/work.yml`
- Create: `src/education.yml`
- Create: `src/skills.yml`
- Create: `src/config.yml`

**Step 1: Create `src/basics.yml`**

```yaml
basics:
  name: Shane Martin
  headline: Software Developer & Front-End Architect
  email: sh@nemart.in
  summary: |
    - Experienced software developer with {{years_experience}}+ years building for the web, specializing in front-end architecture, design systems, developer experience, and engineering leadership.
    - Deep expertise in modernizing legacy codebases, building component libraries, and establishing robust development standards and tooling that help teams deliver better software faster.
    - Background in research methods and data analysis from a Specialized Honours Psychology degree at York University.

location:
  city: Toronto
  region: Ontario
  country: Canada
profiles:
  - network: LinkedIn
    url: https://www.linkedin.com/in/shamrt/
    username: shamrt
  - network: GitHub
    url: https://github.com/shamrt
    username: shamrt
```

Note: `{{years_experience}}` replaces the hardcoded `18`.

**Step 2: Create `src/work.yml`**

Copy the `work:` section from `resume.yml` (lines 24-107) into `src/work.yml`. The file should start with `work:` as the top-level key, containing the full array of 7 work entries.

**Step 3: Create `src/education.yml`**

```yaml
education:
  - institution: York University
    degree: Bachelor
    area: Psychology (Specialized Honours)
    score: "8.63/9.00"
    startDate: Sep 1, 2010
    endDate: Apr 30, 2015
    summary: |
      Graduated summa cum laude. Research focused on meta-cognition, digital history, research methods, statistics, and data analysis.
```

**Step 4: Create `src/skills.yml`**

Copy the `skills:` section from `resume.yml` (lines 108-162) into `src/skills.yml`. The file should start with `skills:` as the top-level key.

**Step 5: Create `src/config.yml`**

```yaml
locale:
  language: en

layouts:
  - engine: latex
    page:
      margins:
        top: 2.5cm
        left: 1.5cm
        right: 1.5cm
        bottom: 2.5cm
      showPageNumbers: false
    template: moderncv-banking
    typography:
      fontSize: 11pt
    sections:
      aliases:
        basics: Summary
        work: Experience
      order:
        - basics
        - work
        - education
        - skills
  - engine: html
    template: vscode
```

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: split resume.yml into section-based partials in src/"
```

---

### Task 3: Create the assembly script

**Files:**

- Create: `scripts/assemble_resume.mjs`

**Step 1: Write the assembly script**

```javascript
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
```

**Step 2: Test it**

Run: `node scripts/assemble_resume.mjs`
Expected: `resume.yml` is generated with `21+ years` in the summary.

Run: `grep "years building" resume.yml`
Expected: Contains `21+ years building` (or current year minus 2005).

Run: `npx yamlresume validate resume.yml`
Expected: Validation passes (possibly with the summary length warning).

**Step 3: Commit**

```bash
git add scripts/assemble_resume.mjs
git commit -m "feat: add assembly script with dynamic years of experience"
```

---

### Task 4: Update build pipeline and gitignore

**Files:**

- Modify: `package.json:5-10` (scripts section)
- Modify: `.gitignore:104-116` (build output section)

**Step 1: Add assemble script and update build chain in package.json**

In the `scripts` section, add the `assemble` script and prepend it to `build`:

```json
"assemble": "node ./scripts/assemble_resume.mjs",
"build": "npm run assemble && npm run build:tex && npm run build:theme-tweaks && npm run build:html-tweaks && npm run build:pdf",
```

**Step 2: Add resume.yml to .gitignore**

In the `# YAMLResume build output` section, add `resume.yml`:

```
# YAMLResume build output
resume.yml
*.aux
```

**Step 3: Remove resume.yml from git tracking**

Run: `git rm --cached resume.yml`
Expected: `resume.yml` is removed from the index but still exists on disk.

**Step 4: Verify full build works**

Run: `npm run build`
Expected: Full pipeline succeeds — assemble, generate .tex + .html, post-process, compile PDF.

**Step 5: Commit**

```bash
git add package.json .gitignore
git commit -m "feat: wire assembly into build pipeline, gitignore resume.yml"
```

---

### Task 5: Update GitHub Actions workflow paths

**Files:**

- Modify: `.github/workflows/deploy.yml:6-11` (paths filter)

**Step 1: Add src/ to the paths trigger**

The workflow triggers on file changes. Add `src/**` so changes to partials trigger a deploy:

```yaml
paths:
  - "resume.yml"
  - "src/**"
  - "package.json"
  - "package-lock.json"
  - "scripts/**"
  - ".github/workflows/deploy.yml"
```

Note: Keep `resume.yml` in paths too — if someone manually edits it, the deploy should still trigger.

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add src/ to workflow trigger paths"
```

---

### Task 6: Push and verify deployment

**Step 1: Push all commits**

Run: `git push origin main`

**Step 2: Watch the workflow**

Run: `gh run list --repo shamrt/yamlresume --limit 1 --json databaseId -q '.[0].databaseId'`
Then: `gh run watch <run-id> --repo shamrt/yamlresume`
Expected: Workflow completes successfully.

**Step 3: Verify the live site**

Run: `open https://sha.nemart.in/`
Expected: Site loads with updated years of experience.
