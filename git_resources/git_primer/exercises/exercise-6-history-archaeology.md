# Exercise 6: History Archaeology

## Goal
Practice reading history you didn't just write, using the tools from `07-exploring-history.md`.

## Steps
1. Create a new repo with a file `calculator.py` containing a simple `add(a, b)` function. Commit it.
2. Make 3-4 more commits, each adding one more function to `calculator.py` (e.g., `subtract`, `multiply`, `divide`). Commit each separately with a clear message.
3. Partway through that sequence (pick a commit in the middle, not the last one), quietly introduce a bug in one of the functions - e.g., make `multiply` actually add instead. Don't mark this commit as special in any way.
4. Keep committing a couple more "normal" changes after the bug, so it's buried in the middle of the history.
5. Now, pretend you're a teammate who just noticed `multiply` is broken and has no idea why. Use only the tools below - not your memory of what you just did - to find the exact commit that broke it:
   - `git log --graph --oneline --all` to see the whole history at a glance
   - `git log -p calculator.py` to read through the diffs
   - `git show COMMIT_HASH` on a couple of suspects
   - `git bisect start` / `git bisect good` / `git bisect bad` to binary-search to the exact commit

## Verify
```bash
git bisect log
git log --oneline
```

## Reflection
- Which tool got you to the answer fastest: reading `log -p` linearly, or using `bisect`? Would your answer change if there were 500 commits instead of 6?
- What did `git bisect reset` do to your working directory afterward?
- If this bug had been buried in a large reformatting commit instead of a small one, how would `git blame` have misled you, and what would you have done next?
