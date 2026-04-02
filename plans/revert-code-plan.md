# Git Revert Guide - Restore Previous Code

## Overview
This plan provides instructions for reverting code to a state before the last task was started.

## Git Options for Reverting

### Option 1: View Recent Commits (Recommended First Step)
```bash
git log --oneline -20
```
This shows the last 20 commits. Identify the commit BEFORE your task started.

### Option 2: Revert a Single Commit (Safe - Creates new commit)
```bash
git revert <commit-hash>
```
- Creates a NEW commit that undoes the specified commit
- Does NOT change history
- Safe for shared branches

### Option 3: Reset to Previous Commit (History Rewriting)
```bash
git reset --hard <commit-hash>
```
- Moves HEAD to the specified commit
- Discards all commits after
- **WARNING**: Do NOT use on shared branches

### Option 4: Checkout Previous State (Read-Only)
```bash
git checkout <commit-hash> -- <file-path>
```
- Restores ONLY a specific file to a previous state
- Does not change commits

### Option 5: Stash Changes (If You Have Uncommitted Work)
```bash
git stash
```
- Temporarily saves uncommitted changes
- You can restore later with `git stash pop`

## Recommended Workflow

### Step 1: Identify What to Revert
```bash
# View recent commits
git log --oneline -10

# View changes in last commit
git show --stat <commit-hash>
```

### Step 2: Choose Revert Strategy

**For uncommitted changes (working directory):**
```bash
# See what would be reverted
git diff

# Revert specific file
git checkout HEAD -- src/components/DirectorPage.js

# Revert all changes
git checkout -- .
```

**For committed changes:**
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>
```

**For hard reset (WARNING - destructive):**
```bash
# Reset to commit before your task
git reset --hard <commit-hash>

# Push forced update (only if you understand consequences)
git push origin HEAD --force
```

## Files to Consider Reverting

Based on the current state, you may want to revert:
- `src/components/DirectorPage.js` - Main page component
- `src/lib/cinematicTheme.js` - Design system (if created in task)
- `src/lib/directorAgentRuntime.js` - Agent runtime (if created in task)

## Verification Steps

After reverting:
1. Run `git status` to confirm changes
2. Run your application to verify functionality
3. Check that designs match your expectations

## Rollback Plan

If revert causes issues:
```bash
# Get current HEAD
git reflog

# Return to state before reset
git reset --hard <previous-head>
```
