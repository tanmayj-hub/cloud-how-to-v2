---
sidebar_position: 2
title: Docs conventions
---

# Docs conventions

This site uses an opinionated “runbook” format so guides stay consistent and skimmable.

## Runbook structure

Most pages follow this pattern:

1. **Snapshot**
   - Goal, estimated time, cost, and skill level
2. **Prerequisites**
   - Required AWS access, tools, and any assumptions
3. **Step-by-step**
   - Explicit, numbered actions (Console and/or CLI)
4. **Validation & troubleshooting**
   - Quick checks to confirm things work
   - Common failure modes and fixes
5. **Cleanup**
   - How to remove resources and stop ongoing cost
6. **References**
   - Official AWS docs and other authoritative sources

## Writing guidelines

- **Be explicit.** Assume the reader is doing this for the first time.
- **Avoid secrets and personal data.** Use placeholders (example: `YOUR_EMAIL`, `example.com`).
- **Prefer safe defaults.** Note security considerations and least-privilege IAM.
- **Separate “must do” from “nice to have.”** Use callouts for optional enhancements.
- **Use copy/paste blocks.** Readers should be able to follow with minimal rewriting.

## CLI style

- Use `bash` blocks and keep them single-purpose.
- If a value must be replaced, use obvious placeholders:

```bash
aws s3 ls s3://YOUR_BUCKET_NAME
```

## Status of pages

Some pages may be evolving. If you see a section that is incomplete or unclear, open a GitHub issue or submit a PR.
