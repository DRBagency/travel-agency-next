---
name: commit
description: Commit and push all changes to origin main
allowed-tools: Bash(git:*)
---

Review all staged and unstaged changes, then create a single commit with a clear, concise message and push.

Steps:
1. Run `git status` and `git diff` to see all changes.
2. Run `git log --oneline -5` to match the repo's commit message style.
3. Stage only the relevant modified/new files (avoid secrets, .env, large binaries).
4. Write a commit message that:
   - Starts with a short summary line (imperative mood, under 72 chars)
   - Optionally adds a blank line + body for context if the change is non-trivial
   - Ends with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
5. Create the commit and run `git status` to confirm success.
6. Push to `origin main` with `git push origin main`.
