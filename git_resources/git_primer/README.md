# Git Primer

This primer is meant to give you a quick introduction to using version control through Git.

This is **not** meant to teach you every piece of syntax, but rather to give you a general understanding of how to track changes in your code so that you may contribute to shared code in a productive way.

You will learn the most amount of Git simply by **programming and using Git**. So, feel comfortable to look things up and write them down if you feel that helps you track common commands that you use in the coding you do!

## Why Should I Care?

Git (or some other form of version control) runs underneath almost every real codebase you will ever touch, on this team or afterward. It is as fundamental as knowing how to use a terminal. A team that uses it well can hand a codebase off between seasons and pick up exactly where the previous group left off; a team that doesn't loses that continuity every single year and starts over more than it needs to.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it.

- **Version Control**: a system that tracks changes to a project over time, recording what changed, when, why, and by whom, instead of relying on emailed files or folders named `final_final_v3`.
- **Commit**: an immutable snapshot of all tracked files at a point in time, linked to its parent commit(s) and identified by a hash.
- **Working Directory**: the actual files on your disk that you edit directly.
- **Staging Area (Index)**: the holding area for changes that will go into your next commit.
- **Repository**: the full committed history of a project, stored in Git's database.
- **Branch**: a movable pointer to a commit, not a copy of the files themselves.
- **HEAD**: Git's name for "where you currently are," almost always pointing at your checked-out branch, which in turn points at a commit.
- **Clone**: downloading a full copy of a remote repository's history and setting up a connection back to it.
- **origin**: the default name Git gives to the remote repository a project was cloned from.
- **Untracked File**: a file Git has never been told to track, so it won't be included in any commit until you `git add` it.
- **.gitignore**: a file listing patterns Git should never track (build artifacts, credentials, logs), so those files never show up as untracked in the first place.
- **git diff**: shows the literal line-by-line changes in your working directory, or (with `--staged`) in the staging area, that haven't been committed yet.
- **Upstream**: the remote branch a local branch is linked to, set once with `git push -u`, after which a plain `git push`/`git pull` know where to go.
- **Merge**: combining two branches' histories, either by fast-forwarding a pointer or creating a new merge commit.
- **Fast-Forward**: what happens when the target branch hasn't moved since you branched off, so Git just slides its pointer forward with no new commit created.
- **Merge Commit**: a new commit with two parents, created when merging branches that have diverged.
- **Rebase**: replaying one branch's unique commits, one at a time, on top of a new base commit, rewriting history to produce a linear-looking log.
- **`--force-with-lease`**: a safer form of force-push that refuses to overwrite a remote branch if it has changed since you last fetched it.
- **Fetch**: downloading a remote's latest commits and branches without changing any of your local branches or working directory.
- **Merge Conflict**: what happens when two branches have each changed the same line since their common ancestor, so Git can't automatically decide which version to keep; shown to you as `<<<<<<<`/`=======`/`>>>>>>>` conflict markers in the file.
- **git reset**: rewinds your current branch pointer to an earlier commit, with `--soft`, the default (mixed), or `--hard` controlling how much of the staging area and working directory get rewound along with it.
- **git revert**: undoes a commit's changes by creating a brand-new commit, without rewriting or removing the original; the safe way to undo something that's already been shared.
- **git commit --amend**: rewrites your most recent commit (message and/or contents) instead of creating a new one. Only safe on commits nobody else has already pulled.
- **git reflog**: a local log of everywhere `HEAD` has pointed, including commits no longer reachable from any branch; your way back after a bad reset or a lost branch.
- **git cherry-pick**: replays one specific commit from anywhere in the repo's history onto your current branch, as a new commit.
- **Detached HEAD**: a state where `HEAD` points directly at a commit instead of at a branch, so nothing you commit there is attached to any branch and can easily be lost.
- **git stash**: temporarily shelves uncommitted changes so your working directory is clean, to be restored later with `git stash pop`.
- **git log --graph**: draws the commit history as an actual graph, branches and merges included, instead of a flat list.
- **git show**: displays the full diff and metadata introduced by one specific commit.
- **git blame**: annotates every line of a file with the commit, author, and date that last changed it.
- **git bisect**: binary-searches your commit history between a known-good and known-bad commit to find exactly which one introduced a bug.
- **Tag**: a pointer to one specific commit that never moves, typically marking a release.
- **Semantic Versioning (semver)**: the `MAJOR.MINOR.PATCH` version-numbering convention, covered in full in `general_programming_resources/05_dependency_management`.
- **Conventional Commits**: the `<type>(<scope>): <subject>` commit message spec (the same format `CONTRIBUTING.md` already asks for) that lets tooling auto-generate changelogs and version bumps directly from commit history.
- **git archive**: exports a clean snapshot of one commit or tag as a zip or tarball, with no `.git` history included.
- **git worktree**: checks out a second branch, tag, or commit into a separate folder backed by the same repository, so you can work on two states of the code at once.

## What's in this Primer?

Read these in order:

0. [00 - Why Version Control Exists](00-why-version-control.md) - the three problems Git solves: history, collaboration, and safety
1. [01 - The Git Mental Model](01-git-mental-model.md) - snapshots, the three areas (working directory / staging / repository), and branches (and `HEAD`) as pointers
2. [02 - The Core Git Workflow](02-core-workflow.md) - clone, status, diff, add, commit, push/pull, log: the everyday cycle
3. [03 - Branching](03-branching.md) - creating, switching, comparing, and cleaning up branches without touching `main`
4. [04 - Merge vs. Rebase](04-merge-vs-rebase.md) - fast-forwards, merge commits, and when rebasing your own branch is safe
5. [05 - Resolving Conflicts](05-resolving-conflicts.md) - reading conflict markers and choosing how to resolve them
6. [06 - Solving Common Issues](06-solving-common-issues.md) - a troubleshooting reference: reset vs. revert, detached HEAD, rejected pushes, and more
7. [07 - Exploring History](07-exploring-history.md) - reading a codebase you didn't write: log, show, blame, and bisect
8. [08 - Tags, Worktrees, and Releases](08-tags-worktrees-and-releases.md) - building reproducible, release-worthy work

`CONTRIBUTING.md`, one level up, isn't part of this numbered sequence, but is required reading alongside it. It's where the branch naming, commit message, and pull request conventions this primer keeps pointing back to actually live.

## Exercises

Reading about Git only gets you so far. The `exercises` folder has a hands-on task paired with most of the files above, and the goal for each one is to actually run the commands in a real repo, not just read along.

- `exercise-1-basic-workflow.md` pairs with **02**
- `exercise-2-branching.md` pairs with **03**, and its reflection questions also exercise the fast-forward vs. merge-commit distinction from **04**
- `exercise-3-conflicts.md` pairs with **05**
- `exercise-4-fixing-mistakes.md` pairs with **06**
- `exercise-5-pull-request.md` pairs with the Pull Requests section of `CONTRIBUTING.md`
- `exercise-6-history-archaeology.md` pairs with **07**
- `exercise-7-tags-and-worktrees.md` pairs with **08**

**00** and **01** don't have their own exercise: they're the conceptual grounding everything else builds on, and there isn't a command to practice yet. Work through them, then start actually exercising once you hit **02**.
