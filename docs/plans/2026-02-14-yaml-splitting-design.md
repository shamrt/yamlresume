# YAML Splitting + Dynamic Basics Design

## Goal

Split `resume.yml` into section-based partials in `src/`, and compute years of experience dynamically at build time.

## Approach

Use the `yaml` npm package to parse partials, deep-merge them, inject computed values, and write the assembled `resume.yml`.

## Design

### File Structure

```
src/
  basics.yml        # name, headline, email, summary (with {{years_experience}} placeholder)
  work.yml          # all work entries
  education.yml     # education entries
  skills.yml        # skill groups
  config.yml        # locale + layouts
scripts/
  assemble_resume.mjs   # parse, merge, inject computed values, write resume.yml
```

`resume.yml` at the project root becomes a build artifact (generated, gitignored). Source of truth is `src/`.

### Assembly Script

`scripts/assemble_resume.mjs`:

1. Parse each `src/*.yml` file with the `yaml` library
2. Deep-merge into `{ content: { basics, work, education, skills }, locale, layouts }`
3. Compute `years_experience` from `new Date().getFullYear() - 2005`
4. Replace `{{years_experience}}` placeholder in `basics.summary`
5. Write result to `resume.yml` with `yaml.stringify()`, preserving multiline strings
6. Prepend schema comment (`# yaml-language-server: $schema=...`)

### Build Pipeline

```
assemble -> build:tex -> theme-tweaks -> html-tweaks -> build:pdf
```

New npm script: `"assemble": "node ./scripts/assemble_resume.mjs"`

### Gitignore

Add `resume.yml` to `.gitignore` (now a build artifact).

### Out of Scope

- No other dynamic fields beyond `{{years_experience}}`
- No template engine - just one string replacement
- No changes to GitHub Actions workflow (already runs `npm run build`)
