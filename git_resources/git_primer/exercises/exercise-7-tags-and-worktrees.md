# Exercise 7: Tags and Worktrees

## Goal
Practice marking a reproducible release point and working on two states of the code at once, using the tools from `08-tags-worktrees-and-releases.md`.

## Steps
1. In an existing repo (reuse the one from Exercise 6, or any other), make sure `main` is in a working state and commit if needed.
2. Create an annotated tag marking this state as a release: `git tag -a v1.0.0 -m "..."`.
3. Make a new commit on `main` that changes something (any change is fine).
4. Without touching your current working directory, create a worktree checked out to `v1.0.0` in a sibling folder: `git worktree add ../v1-check v1.0.0`.
5. Confirm the file contents differ between your two folders; `main` should have your step-3 change, `../v1-check` should not.
6. From inside `../v1-check`, run `git archive --format=zip -o ../release.zip v1.0.0` to produce a clean, historyless copy of that release.
7. Clean up: `git worktree remove ../v1-check`.

## Verify
```bash
git tag
git worktree list
git log --oneline --all
```

## Reflection
- What state was `HEAD` in inside `../v1-check`? Why (see `06-solving-common-issues.md`)?
- Could you have accomplished step 4-5 by just `git checkout v1.0.0` in your original folder instead of using a worktree? What would you have lost by doing it that way?
- Unzip `release.zip` somewhere; is there a `.git` folder in it? Why does that matter if you were handing this to someone outside the team?
