# HTML Resume + GitHub Pages Deployment Design

## Goal

Generate a web-native HTML resume from the same YAML source used for the LaTeX/PDF resume, and auto-deploy it to GitHub Pages at `sha.nemart.in`.

## Approach

**Approach 1 (chosen):** yamlresume native HTML + TinyTeX in CI.

yamlresume v0.9+ supports HTML output natively. Adding an `engine: html` layout to `resume.yml` generates self-contained HTML alongside the existing LaTeX. GitHub Actions handles the full build (HTML + PDF) and deploys to Pages.

### Alternatives Considered

- **Split builds (HTML in CI, PDF manual):** Faster CI but PDF drifts out of sync.
- **Docker-based CI with full TeX Live:** Overkill (~4GB image) for a single resume.

## Design

### 1. YAML Changes

Add HTML layout(s) to `resume.yml`:

```yaml
layouts:
  - engine: latex
    # ... existing config unchanged ...
  - engine: html
    template: calm
  - engine: html
    template: vscode
```

Both `calm` (minimalist, moderncv-inspired) and `vscode` (dark, developer-oriented) templates will be tried. One will be kept after preview.

### 2. Build Pipeline

No new scripts needed. `yamlresume build --no-pdf` already generates all layout outputs (`.tex` + `.html`) in one pass. The existing 3-stage pipeline is unchanged:

1. `npm run build:tex` — generates `.tex` and `.html`
2. `npm run build:theme-tweaks` — patches `.tex` (strips skill levels)
3. `npm run build:pdf` — compiles `.tex` to `.pdf`

**Note:** `remove_keywords.sh` only patches `.tex`. HTML may still show skill level prefixes. To be evaluated after preview.

### 3. GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

**Trigger:** Push to `main` (filtered to resume.yml, package.json, scripts/, workflow file).

**Steps:**

1. Checkout repo
2. Setup Node.js (v25 via volta)
3. `npm install`
4. Install TinyTeX + required packages (moderncv, ctex, fontawesome5, enumitem, etc.)
5. Cache TinyTeX installation
6. `npm run build`
7. Assemble deploy directory: `index.html` + `resume.pdf` + `CNAME`
8. Deploy via `actions/deploy-pages`

Uses modern GitHub Pages deployment (no `gh-pages` branch).

### 4. Custom Domain

- DNS: `CNAME` record `sha.nemart.in` -> `shamrt.github.io`
- `CNAME` file deployed as part of the artifact
- HTTPS enforced via GitHub Pages settings

### 5. Out of Scope

- No custom CSS or theming (using built-in templates as-is)
- No static site generator
- No `gh-pages` branch
- No client-side JavaScript
- No PDF-from-HTML (using real LaTeX pipeline)
