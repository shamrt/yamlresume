# Resume Repo Setup Design

## Goal

Set up the `yamlresume` repo to match the structure and tooling of `yamlresume-lianne`, populated with Shane's resume content targeting software/engineering roles.

## Approach

Mirror `yamlresume-lianne` exactly: same build pipeline, dev tooling, and layout configuration.

## Repo Structure

```
yamlresume/
├── resume.yml
├── package.json
├── commitlint.config.cjs
├── scripts/
│   └── install-tex.sh
├── src/
│   └── old-yaml/           # Existing old resume files kept as reference
└── .gitignore
```

### Build Pipeline

1. `yamlresume build --no-pdf resume.yml` — generates `.tex`
2. `xelatex resume.tex` — generates PDF

### Dev Tooling

- yamlresume (latest)
- commitlint (conventional commits)
- husky + lint-staged
- prettier, eslint
- volta (Node 25.2.1)

## Resume Content

### Summary

- Experienced software developer with 18+ years building for the web
- Specializing in front-end architecture, design systems, developer experience, and engineering leadership
- Background in research methods and data analysis (Psychology, York University)

### Work Experience (2016+, reverse chronological)

1. **Vantage Inc.** (Apr 2024–Present) — Details TBD (user will provide)

2. **Plooto Inc.** — Staff Front-end Developer (Jan 2023–Mar 2024)
   - Modernized 9-year-old Durandal/Knockout app: led React migration, modern build tooling
   - New component library (Storybook + MUI), standardized patterns (i18n, data fetching, config)
   - Test coverage from ~2% to 30%+
   - CI pipeline from 10+ min to 5 min
   - RFCs, guidelines, roadmaps for Engineering team
   - Codebase reorganization (Yarn workspaces, Bulletproof architecture)

3. **RewardOps** — Multiple roles (Mar 2019–Jan 2023)
   - Front-end Architect, Software Dev Manager, Lead Software Developer, Senior Software Developer
   - Built dev team from scratch (up to 11 reports), mentored leads/managers
   - Led Ember-to-React transition, MXaaS product inception to launch
   - RushJS monorepo, Webpack-to-Vite (30X improvement)
   - RTK Query (90% less boilerplate), combined Node servers (-30K LOC)
   - Test suite performance (5X+), FOSS contributions

4. **RBC** — Senior Front-End Developer (Oct 2016–Feb 2019)
   - Angular apps for online banking modernization
   - RBC Digital Frameworks component library (POC) with full test coverage
   - Core web icons and styling libraries
   - Testing, accessibility, linting, CI/CD standards advocacy

### Education

- BA (Specialized Hons.), Psychology — York University, 2015
  - Graduated summa cum laude (8.63/9.00)

### Skills (flat keyword list, no category headers)

- JavaScript, TypeScript, Node, React, Redux, Ember, Angular, Ruby, Python, R, C
- TDD/BDD, Jest, RTL, Playwright, Cypress, Storybook
- Webpack, Vite, Monorepo tooling (Yarn, Nx, Rush, Lerna)
- CI/CD (Jenkins, Buildkite), Docker, Git
- PostgreSQL, MySQL, MongoDB, SQLite
- CSS-in-JS, Sass, Semantic HTML, Accessibility (WCAG, ARIA)
- REST APIs, MVC, System Architecture
- Technical Leadership, Mentoring, RFC/Documentation

### Layout

- Template: `moderncv-casual`
- Font size: 11pt
- Section order: Summary, Experience, Education, Skills
- No page numbers

## Open Items

- Vantage Inc. role details (user will provide separately)
