# Cloud How-To (Docusaurus + GitHub Pages)

A Docusaurus-powered documentation site for runbooks and mini-guides covering AWS and cloud tasks.

- Live site: https://tanmayj-hub.github.io/cloud-how-to-v2/
- Docs entry point: `docs/intro.md`

---

## What this repository does

This repo contains a **static documentation website** built with **Docusaurus**:

- Source content is written in Markdown under `docs/`
- The site is built into static files via `npm run build` (output in `build/`)
- A GitHub Actions workflow deploys the `build/` output to the **`gh-pages`** branch
- GitHub Pages serves the website from `gh-pages`

---

## Tech stack

- Docusaurus v3
- Node.js (workflow uses Node 20)
- GitHub Actions for CI/CD
- GitHub Pages for hosting

---

## Quick start (local development)

### Prerequisites
- Node.js **18+** (recommended: 20+)
- npm (included with Node)

Verify:
```bash
node -v
npm -v
````

### Install dependencies

```bash
npm ci
```

### Run locally

```bash
npm start
```

Local dev server runs at `http://localhost:3000`.

### Build (production)

```bash
npm run build
```

### Preview the production build locally

```bash
npm run serve
```

### Optional: Type-check

```bash
npm run typecheck
```

---

## Fork-and-deploy (recreate this setup in your own GitHub)

This section is the “copy exactly what I did” guide.

### Step 1 — Fork the repo

Fork this repository to your own GitHub account.

### Step 2 — Update Docusaurus GitHub Pages settings

Edit `docusaurus.config.ts` and update these fields to match *your* fork.

#### If your site URL will be a **project site** (most common)

Project site URL format:
`https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/`

Set:

```ts
url: 'https://<YOUR_USERNAME>.github.io',
baseUrl: '/<YOUR_REPO>/',
organizationName: '<YOUR_USERNAME>',
projectName: '<YOUR_REPO>',
```

Also update these (so links point to your fork):

* `editUrl` (for “Edit this page” links)
* navbar GitHub link: `href: 'https://github.com/<YOUR_USERNAME>/<YOUR_REPO>'`
* footer GitHub link similarly (if present)

#### If your site URL will be a **user site** (less common)

User site URL format:
`https://<YOUR_USERNAME>.github.io/`

In that case:

* `baseUrl` must be `'/'`
* repo name is typically `<YOUR_USERNAME>.github.io`

---

### Step 3 — Ensure GitHub Actions can deploy

This repo deploys via `.github/workflows/deploy.yml`.

Confirm workflow permissions (recommended):

* Repo → **Settings → Actions → General**
* Under “Workflow permissions”, choose:

  * **Read and write permissions**

This workflow already declares:

```yml
permissions:
  contents: write
```

---

### Step 4 — Enable GitHub Pages (serve from `gh-pages`)

In your forked repo:

1. **Settings → Pages**
2. Under “Build and deployment”:

   * Source: **Deploy from a branch**
   * Branch: **gh-pages**
   * Folder: **/(root)**
3. Save

Notes:

* You may not see `gh-pages` immediately. It is created after the first successful deploy workflow run.

---

### Step 5 — Trigger first deploy

Push any commit to `main` (or merge a PR). The workflow runs automatically on pushes to `main`.

Verify:

* Repo → **Actions** tab → latest workflow run is green
* A `gh-pages` branch exists
* Your Pages URL renders correctly

---

## How to add new runbooks (content workflow)

### 1) Create a new doc

Add a Markdown file under `docs/`, for example:

* `docs/ec2/index.md`
* `docs/ec2/launch-template.md`

You can start from:

* `docs/templates/runbook-template.md`

### 2) Add it to the sidebar

Update `sidebars.ts` so your new doc appears in navigation.

### 3) Validate locally

```bash
npm start
```

### 4) Deploy

Commit and push to `main`. GitHub Actions will build and deploy automatically.

---

## Contributing (how to add content via PR)

This repo is public. If you want to contribute runbooks or improvements:

### Contribution workflow

1. **Fork** the repo
2. Create a branch:

   ```bash
   git checkout -b feature/my-runbook
   ```
3. Add/edit docs under `docs/`
4. If you added a new page, update `sidebars.ts`
5. Validate locally:

   ```bash
   npm ci
   npm start
   ```
6. Commit and push:

   ```bash
   git add -A
   git commit -m "Add <topic> runbook"
   git push origin feature/my-runbook
   ```
7. Open a **Pull Request** to `main`

### Runbook standards (recommended)

When adding a new runbook, please:

* Use clear filenames (`kebab-case.md`)
* Include front-matter at the top:

  ```yaml
  ---
  title: "Clear Title"
  sidebar_label: "Short Label"
  ---
  ```
* Prefer this structure inside runbooks:

  * Overview
  * Prerequisites
  * Step-by-step instructions
  * Validation / “How to verify”
  * Troubleshooting
  * Cleanup (if applicable)
* Avoid hardcoding personal account IDs, secrets, or private links
* Keep instructions copy-paste-friendly (code blocks, exact commands)

### What reviewers will check

* Content renders correctly
* Links work
* Sidebar placement makes sense
* Instructions are safe, clear, and reproducible

---

## Repo structure (high level)

* `.github/workflows/deploy.yml` — builds and deploys to `gh-pages`
* `docs/` — all runbooks and guides (Markdown)
* `sidebars.ts` — sidebar navigation structure
* `docusaurus.config.ts` — site config (URLs, baseUrl, theme, nav, edit links)
* `src/` — homepage + custom React components + CSS
* `static/` — images and static assets

---

## Troubleshooting

### Site loads but CSS/images are broken

Cause: `baseUrl` mismatch.

If your Pages URL is:
`https://<USER>.github.io/<REPO>/`

Then `baseUrl` must be:
`/<REPO>/`

### `gh-pages` branch never appears

Common causes:

* Workflow did not run (no push to `main`)
* Workflow failed (check Actions logs)
* Pages is pointing to the wrong branch

### Deploy fails with permission errors

Fix:

* Settings → Actions → General → Workflow permissions → **Read and write**
* Re-run workflow

### The website shows an “Edit this page” button

That button is a link to GitHub’s editor using `editUrl`.

* Anyone can click it
* Only people with write access can merge changes
* Others can fork and open a PR

---

## License

MIT
