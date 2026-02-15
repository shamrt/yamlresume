# yamlresume

A resume managed as modular YAML files, compiled to PDF, HTML, and LaTeX using [yamlresume](https://yamlresume.dev).

## How it works

Resume content lives in `src/` as separate YAML files (`basics.yml`, `work.yml`, `education.yml`, `skills.yml`, `config.yml`). A build pipeline assembles them into a single `resume.yml`, compiles to LaTeX/HTML, applies post-processing tweaks, and generates a final PDF.

## Setup

```bash
npm install
```

Requires Node.js (managed via [Volta](https://volta.sh)) and XeLaTeX for PDF generation.

## Usage

```bash
npm run build       # Full pipeline: assemble → compile → tweaks → PDF
npm run dev         # Live preview server
npm run validate    # Validate against YAMLResume schema
```

## License

MIT
