---
title: Publish a static website on GitHub Pages with GitHub Actions CI/CD
sidebar_position: 1
tags:
  - github
  - github-pages
  - github-actions
  - ci-cd
  - static-site
---

# Publish a static website on GitHub Pages with GitHub Actions CI/CD

## Overview

This runbook shows how to host a **plain static website** (HTML/CSS/JS) on **GitHub Pages** and configure **GitHub Actions** so every push to `main` automatically publishes the latest version.

This is ideal for:
- Portfolios
- Landing pages
- Simple documentation sites (already built as static files)

This runbook assumes you are **not using Docusaurus** and you already have a static site (or a build output folder like `dist/`).

---

## Quick checklist (copy/paste plan)

- [ ] Put your static site files in a folder (recommended: `site/`)
- [ ] Add `.github/workflows/deploy.yml`
- [ ] Push to `main` and confirm workflow is green
- [ ] Configure GitHub Pages to serve from `gh-pages` branch (root)
- [ ] Open your Pages URL and validate CSS/images are loading

---

## Prerequisites

- A GitHub repository
- A static website (plain HTML/CSS/JS) **or** a build output folder (`dist/`, `build/`, etc.)
- Basic Git knowledge (commit/push)

Optional (but recommended):
- Use **relative asset paths** in HTML (important for “project sites”)

✅ Good:
```html
<link rel="stylesheet" href="./styles.css" />
<script src="./app.js" defer></script>
<img src="./assets/me.png" alt="Me" />
````

⚠️ Risky for project sites:

```html
<link rel="stylesheet" href="/styles.css" />
```

---

## Key concept: GitHub Pages URL types

GitHub Pages has two common hosting patterns:

### 1) User site (root)

* Repo name: `YOUR_USERNAME.github.io`
* URL: `https://YOUR_USERNAME.github.io/`
* Hosted at root `/`

### 2) Project site (subpath)

* Repo name: anything (example: `my-portfolio`)
* URL: `https://YOUR_USERNAME.github.io/my-portfolio/`
* Hosted under `/<repo-name>/`

If you are using a **project site**, relative paths matter more.

---

## Recommended repo layout (simple + safe)

Store the website in a folder named `site/`:

```text
my-portfolio/
  site/
    index.html
    styles.css
    app.js
    assets/
      ...
  .github/
    workflows/
      deploy.yml
  README.md
```

Why this layout:

* CI/CD deploys only the `site/` folder
* Your repo can still contain other files without being published

---

## Step-by-step implementation

### Step 1 — Add your site files

Put your static website into `site/`.

Example:

```text
site/index.html
site/styles.css
site/app.js
site/assets/...
```

Commit and push:

```bash
git add -A
git commit -m "Add static site"
git push origin main
```

---

### Step 2 — Add GitHub Actions workflow (CI/CD)

Create this file:

```text
.github/workflows/deploy.yml
```

Paste this workflow:

```yml
name: Deploy static site to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # No build step needed if your site is already plain HTML/CSS/JS in /site

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

Commit and push:

```bash
git add -A
git commit -m "Add GitHub Pages deploy workflow"
git push origin main
```

---

### Step 3 — Configure GitHub Pages to serve from `gh-pages`

In GitHub:

1. Repo → **Settings**
2. **Pages**
3. Under **Build and deployment**:

   * Source: **Deploy from a branch**
   * Branch: **gh-pages**
   * Folder: **/(root)**
4. Save

Notes:

* `gh-pages` branch is created after the first successful workflow run.
* If it does not appear, check the Actions logs.

---

## Validation (how to confirm it worked)

1. Repo → **Actions**

   * Latest run should be **green**
2. Repo → **Settings → Pages**

   * Confirm the published URL is shown
3. Open the URL and verify:

   * Page loads
   * CSS is applied
   * Images and JS work

---

## Optional: If your site needs a build step (React/Vite/etc.)

If your repo needs building and the output folder is `dist/`, use this workflow instead.

> Replace `npm run build` and `publish_dir` if your framework differs.

```yml
name: Deploy static site to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Important (project sites):

* Many frameworks need a base path like `/<repo-name>/`.
* For Vite, this is commonly configured via a `base` setting.

---

## Troubleshooting

### Problem: CSS/images are broken (common on project sites)

**Cause:** Using absolute paths like `/styles.css` which resolve to the wrong location.

**Fix:**

* Use `./styles.css` and `./assets/...`
* If using a framework, set the correct base path for project sites

---

### Problem: `gh-pages` branch never appears

**Cause:** Workflow did not run or failed.

**Fix:**

* Repo → **Actions** → open logs
* Confirm you pushed to `main`
* Confirm the workflow file exists in `.github/workflows/deploy.yml`

---

### Problem: Deploy fails due to permissions

**Cause:** Workflow token cannot push to `gh-pages`.

**Fix:**

* Repo → **Settings → Actions → General**
* Workflow permissions: set to **Read and write**
* Re-run workflow

---

### Problem: “Edit this page” / edit button confusion

That is just a GitHub link to edit files in the repo.

* Anyone can click it
* Only maintainers can merge directly
* Others can fork and open a PR

---

## Notes / Best practices

* Keep website files under `site/` (or `dist/`) to avoid publishing repo internals
* Prefer relative paths for assets if hosting under a subpath
* Keep `main` as the source branch; `gh-pages` as deploy output only

````