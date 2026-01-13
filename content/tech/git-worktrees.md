---
title: Git worktrees for parallel development
date: 2026-01-11
---

Git worktrees allow you to check out multiple branches simultaneously in different directories.

## The Problem

When working on a feature branch, you sometimes need to quickly switch to fix a bug on main. Stashing, switching, and unstashing is tedious.

## The Solution

```bash
# Create a worktree for the main branch
git worktree add ../project-main main

# Now you have two directories:
# ./project (feature branch)
# ./project-main (main branch)
```

## Key Benefits

- **No context switching** - Each worktree is a complete checkout
- **Faster CI checks** - Run tests in parallel across branches
- **Cleaner workflow** - No more stash conflicts

## Cleanup

```bash
# Remove a worktree when done
git worktree remove ../project-main
```

This has become essential for my workflow when juggling multiple PRs.
