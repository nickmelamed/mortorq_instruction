# Exploring History: Reading a Codebase You Didn't Write

Back in `00-why-version-control.md`, we said Git's whole job is answering **what changed, when, why, and by whom**. Everything up to this point in the primer has been about *making* history, with committing, branching, merging. This file is about *reading* it. 

This matters most on a team: the person debugging a function at 11pm before competition rarely wrote that function. The tools below let you reconstruct the reasoning behind any line of code without having to ask around.

## Visualizing the Commit Graph

`git log` on its own (see `02-core-workflow.md`) only shows a straight line of commits on your current branch. To actually see the shape of the project - branches splitting off, merges coming back together - run: 

```bash
git log --graph --oneline --all
```

`--graph` draws the commit DAG (Directed Acyclic Graph - don't worry about this definition here) using `*` and `|` characters, `--oneline` keeps each commit to a single line (hash + message), and `--all` shows every branch, not just the one you're on. This is the single best command for building the mental picture from `01-git-mental-model.md` - branches as pointers, commits as a graph - directly in your terminal. 

It's common to alias this, since it's long to type: 

```bash
git config --global alias.tree "log --graph --oneline --all"
```

After that, `git tree` runs the same command. 

## Reading a File's History

Sometimes you don't want the whole project's history, just one file's. 

```bash
git log -p path/to/file
```

The `-p` flag ("patch") shows the actual diff introduced by each commit that touched that file, not just the commit message. This is the fastest way to answer "how did this function get to look the way it does?". You can watch it evolve commit by commit. 

If the file has ever been renamed or moved, plain `git log` will stop at the rename. Use `--follow` to track it across the rename: 

```bash
git log --follow path/to/file
```

## Inspecting One Commit

`03-branching.md` introduced `git show BRANCH:path/to/file` for peeking at a file on another branch. `git show` has a more common use, though: given just a commit hash, it shows you the full diff that commit introduced. 

```bash
git show COMMIT_HASH
```

This prints the commit message, author, date, and the complete diff, all in one place. If `git log --oneline` gives you a list of suspects, `git show` lets you interrogate any one of them. 

## Finding Who Changed a Line

`git blame` annotates every line of a file with the commit hash, author, and date that last changed it: 

```bash
git blame path/to/file
```

For a big file, you usually don't want the whole thing annotated, and should scope it to the lines you actually care about: 

```bash
git blame -L 40,60 path/to/file
```

A word of caution: `git blame` tells you the *last* commit to touch a line, not necessarily the commit that's most meaningful to understand. A large reformatting or refactor commit can end up "blamed" for every line it touched, even if the actual logic hasn't changed since long before. When that happens, `git show` the suspicious commit first, because if it's just a mechanical reformat, use `git log -p` on that file to keep digging further back. 

## Finding *Which* Commit Broke Something

Sometimes you know code broke somewhere in the last 50 commits, but not where. Instead of checking each commit out by hand, `git bisect` binary-searches history for you (we actually cover binary search in `back_end_resources`): 

```bash
git bisect start
git bisect bad HEAD              # the current commit is broken
git bisect good a1b2c3d          # this older commit was known to work
```

Git checks out a commit roughly halfway between `good` and `bad`, and puts you in a detached HEAD state (see `06-solving-common-issues.md`) so you can test it. Test it however you'd normally test that code, then tell Git the result: 

```bash
git bisect good   # this commit works fine
# or
git bisect bad    # this commit is already broken
```

Git narrows the range and checks out a new midpoint each time. Since it's a binary search, finding the culprit among 50 commits takes about 6 steps, not 50. Once it identifies the exact commit, run: 

```bash
git bisect reset
```

to return to where you started (your branch and `HEAD` are untouched by the whole process - `bisect` only ever moves you around in read-only detached-HEAD checkouts). 

This exact workflow is the "actual command" that `general_programming_resources/06_debugging_methodology`'s bisect exercise (`exercises/exercise-2-bisect-the-regression.md`) points you back here for. Go try it once you've got the idea. 

## Resources
- **Official docs:** [git-log](https://git-scm.com/docs/git-log), [git-show](https://git-scm.com/docs/git-show), [git-blame](https://git-scm.com/docs/git-blame), [git-bisect](https://git-scm.com/docs/git-bisect) - full command references for everything in this chapter.
- **Official docs:** [Pro Git, Ch. 7.10 - Debugging with Git](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git) - the canonical walkthrough of `blame` and `bisect` together.
- **Blog:** [Advanced Git Log - Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/git-log) - practical examples of filtering, formatting, and reading `git log` output.
- **Tool:** [git-bisect run](https://git-scm.com/docs/git-bisect#_bisect_run) - once you're comfortable with manual `bisect`, this automates the "test, mark good/bad" loop with a script instead of doing it by hand.
