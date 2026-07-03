# Exercise 4: Fixing Mistakes

## Goal
Practice recovering from the everyday mistakes covered in `06-solving-common-issues.md` - a bad commit, a typo'd message, and messy uncommitted work.

## Steps
1. Create two files, `a.txt` and `b.txt`. Stage and commit them **together** in a single commit.
2. Realize `b.txt` shouldn't have been part of that commit. Undo the commit but keep your changes staged (`git reset --soft HEAD~1`), then unstage just `b.txt`.
3. Commit `a.txt` on its own with a clear message.
4. Notice a typo in that commit message. Fix it **without** creating a new commit.
5. Make a messy, uncommitted change to `a.txt` that you're not ready to commit yet. Stash it, confirm your working directory is clean, then bring the change back.
6. Make one more change to `a.txt` and commit it. Now imagine this commit already got pushed and merged into `main`, so `reset` is off the table - use `git revert` to undo it instead.

## Verify
```bash
git status
git log --oneline
git stash list
```

## Reflection
- What command let you undo a commit but keep the changes staged?
- What's the difference between `git reset --soft` and `git reset --hard`? Why does it matter which one you pick?
- When would you reach for `git stash` instead of just committing work-in-progress?
- After running `git revert`, is the original commit still in your `git log`? Why does that matter for a commit that's already been shared with teammates?
