# HTML Resume + GitHub Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Auto-deploy an HTML resume and PDF to GitHub Pages at `sha.nemart.in` from the existing YAML source.

**Architecture:** Add HTML layout(s) to `resume.yml` so `yamlresume build` generates HTML alongside LaTeX. A GitHub Actions workflow installs Node + TinyTeX, runs the full build, and deploys the HTML + PDF to GitHub Pages. Custom domain via CNAME.

**Tech Stack:** yamlresume (HTML engine), TinyTeX (CI LaTeX), GitHub Actions, GitHub Pages

---

### Task 1: Add HTML layouts to resume.yml for preview

**Files:**

- Modify: `resume.yml:177-198` (layouts section)

**Step 1: Add both HTML layouts to resume.yml**

Append after the existing LaTeX layout entry (after line 198):

```yaml
- engine: html
  template: calm
- engine: html
  template: vscode
```

**Step 2: Build and preview both templates**

Run: `npx yamlresume build --no-pdf resume.yml`
Expected: Generates `resume.tex`, `resume.0.html` (calm), `resume.1.html` (vscode)

Run: `open resume.0.html resume.1.html`
Expected: Both open in browser for visual comparison

**Step 3: Commit**

```bash
git add resume.yml
git commit -m "feat: add HTML layouts (calm + vscode) for preview"
```

---

### Task 2: Choose template and finalize resume.yml

**Files:**

- Modify: `resume.yml:177-end` (layouts section)

**Step 1: Ask user which template they prefer**

After previewing both, ask the user to pick `calm` or `vscode`.

**Step 2: Remove the unchosen layout from resume.yml**

Keep only one HTML layout so the output is `resume.html` (no index suffix).

**Step 3: Verify build output**

Run: `npx yamlresume build --no-pdf resume.yml`
Expected: Generates `resume.tex` and `resume.html`

**Step 4: Check if skill levels appear in HTML**

Run: `grep -c "Master" resume.html`
If skill levels are present, note this for a potential follow-up task.

**Step 5: Commit**

```bash
git add resume.yml
git commit -m "feat: finalize HTML template choice"
```

---

### Task 3: Update .gitignore for HTML output

**Files:**

- Modify: `.gitignore`

**Step 1: Read current .gitignore**

Check what's currently ignored. LaTeX artifacts (`.tex`, `.pdf`, `.aux`, etc.) are already ignored.

**Step 2: Add HTML to .gitignore**

Add `*.html` to the LaTeX artifacts section (HTML is a build artifact, not source).

**Step 3: Verify resume.html is ignored**

Run: `git status`
Expected: `resume.html` no longer shows as untracked (if it was before)

**Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: add HTML to gitignore (build artifact)"
```

---

### Task 4: Create GitHub Actions workflow

**Files:**

- Create: `.github/workflows/deploy.yml`

**Step 1: Create workflow directory**

Run: `mkdir -p .github/workflows`

**Step 2: Write the workflow file**

```yaml
name: Build and Deploy Resume

on:
  push:
    branches: [main]
    paths:
      - "resume.yml"
      - "package.json"
      - "package-lock.json"
      - "scripts/**"
      - ".github/workflows/deploy.yml"
  workflow_dispatch: # Allow manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: "package.json"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup TinyTeX
        uses: r-lib/actions/setup-tinytex@v2

      - name: Cache TinyTeX packages
        uses: actions/cache@v4
        with:
          path: ~/texmf
          key: tinytex-packages-${{ runner.os }}-${{ hashFiles('.github/workflows/deploy.yml') }}

      - name: Install LaTeX packages
        run: |
          tlmgr install \
            moderncv \
            ctex \
            fontawesome5 \
            enumitem \
            adjustbox \
            tcolorbox \
            collectbox \
            ucs \
            environ \
            trimspaces \
            titling \
            rsfs \
            texliveonfly \
            xkeyval \
            fancyhdr \
            microtype \
            lm \
            etoolbox \
            colortbl \
            multirow \
            arydshln

      - name: Build resume
        run: npm run build

      - name: Assemble deploy directory
        run: |
          mkdir -p _site
          cp resume.html _site/index.html
          cp resume.pdf _site/resume.pdf
          echo "sha.nemart.in" > _site/CNAME

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Verify YAML syntax**

Run: `npx yamlresume validate` or just eyeball the indentation.

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for Pages deployment"
```

---

### Task 5: Enable GitHub Pages in repo settings

**Step 1: Configure Pages source to GitHub Actions**

Run:

```bash
gh api repos/{owner}/{repo}/pages -X PUT -f build_type=workflow -f source='{"branch":"main","path":"/"}'
```

Or if Pages isn't enabled yet:

```bash
gh api repos/{owner}/{repo}/pages -X POST -f build_type=workflow -f source='{"branch":"main","path":"/"}'
```

**Step 2: Verify Pages is configured**

Run: `gh api repos/{owner}/{repo}/pages`
Expected: Shows `"build_type": "workflow"` and the URL.

---

### Task 6: Push and verify first deployment

**Step 1: Push all commits to main**

Run: `git push origin main`

**Step 2: Watch the workflow run**

Run: `gh run watch`
Expected: Workflow completes successfully.

**Step 3: Verify deployment**

Run: `gh api repos/{owner}/{repo}/pages`
Check the URL and open it in browser.

---

### Task 7: Configure custom domain DNS

**Step 1: Confirm the CNAME is in the deployed artifact**

Run: `curl -s https://shamrt.github.io/yamlresume/CNAME` (or check the Pages URL)

**Step 2: User configures DNS**

The user needs to add a CNAME record at their DNS provider:

- Type: `CNAME`
- Name: `sha`
- Value: `shamrt.github.io`

**Step 3: Configure custom domain in GitHub**

Run:

```bash
gh api repos/{owner}/{repo}/pages -X PUT -f cname=sha.nemart.in
```

**Step 4: Wait for DNS propagation and verify**

Run: `dig sha.nemart.in CNAME`
Expected: Points to `shamrt.github.io`

**Step 5: Enable HTTPS**

Run:

```bash
gh api repos/{owner}/{repo}/pages -X PUT -f https_enforced=true
```

**Step 6: Verify site is live**

Open: `https://sha.nemart.in` in browser.
Expected: HTML resume loads with HTTPS.
