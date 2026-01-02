# Cloud How-To

A Docusaurus-powered documentation site for **runbooks and mini-guides** covering AWS and cloud tasks.

- Live site: https://tanmayj-hub.github.io/cloud-how-to/
- Docs entry point: `docs/intro.md`

## Local setup

### Prerequisites

- Node.js **18+**
- npm (comes with Node)

### Install

```bash
npm ci
```

### Run locally

```bash
npm start
```

Docusaurus will start a local dev server (default: `http://localhost:3000`).

### Build

```bash
npm run build
```

Static output is generated in the `build/` directory.

## Deployment

This site is deployed to **GitHub Pages** via GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Trigger: pushes to `main`
- Output branch: `gh-pages`

## Repo structure

- `docs/` — runbooks and guides
- `sidebars.ts` — sidebar navigation
- `docusaurus.config.ts` — site configuration
- `src/` — homepage and styling
- `static/` — images and static assets

## Contributing

1. Create a new branch
2. Add/edit docs under `docs/`
3. Use the runbook format: `docs/templates/runbook-template.md`
4. Open a PR

## License

MIT
