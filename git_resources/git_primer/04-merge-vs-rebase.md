# Merge vs. Rebase: Different Ways of Resolving Remote and Local Changes

OK, so you've made some changes locally. You're finally ready to get those changes on the `main` branch - how do you go about doing this?  

## Merge: Combining Branch History 

With `git merge`, you are essentially combining the commit history of two branches. So, you aren't erasing any of the previous work; you are simply making sure that the `main` branch has access to your own branch's commits. 

The syntax is straightforward. You first run `git checkout main` to get back to your target branch (or replace `main` with any other target branch you want to merge with): 

```bash
git merge BRANCH_TO_MERGE
```

where the `BRANCH_TO_MERGE` is the branch you were doing work on that you want to merge with the target branch. 

### Fast-Forward vs. Merge Commit

Depending on what's happened on `main` since you branched off, `git merge` does one of two different things. 

**If `main` hasn't changed since you branched off**, Git can just slide the `main` pointer forward to point at your branch's latest commit - remember, from `01-git-mental-model.md`, a branch is just a pointer. No new commit gets created; your commits simply become part of `main`'s history. You'll see output like this: 

```bash
git checkout main
git merge feature/user-auth
```
```bash
Updating a1b2c3d..e4f5g6h
Fast-forward
 src/auth/login.py | 12 ++++++++++--
 1 file changed, 10 insertions(+), 2 deletions(-)
```

**If `main` *has* moved on** (say a teammate merged something else into `main` while you were working), Git can't just slide the pointer forward anymore - the two branches have diverged. Instead, Git creates a brand new commit that has **two parents**: the tip of `main` and the tip of your branch. You'll see output like this instead: 

```bash
Merge made by the 'ort' strategy.
 src/auth/login.py | 12 ++++++++++--
 1 file changed, 10 insertions(+), 2 deletions(-)
```

This is why you'll sometimes see a commit in `git log` that reads something like `Merge branch 'feature/user-auth' into main` - that's this merge commit. Both kinds of merges are completely normal; which one happens just depends on whether `main` moved while you weren't looking. 

## Rebase: Rewriting Commit History 

Sometimes, you realize that you don't want to run merge, because you need to change the commit history. 

For example, say someone committed some change to the repository while you were doing some work locally. You realize that the work you did should come before their work. So, you need to change the commit history to reflect that. 

There are several ways to run `git rebase` to change the commit history. However, these will be omitted because rebase is fairly challenging to work with when you have many people working on the same repository. Feel free to do some research on useful `rebase` commands, but you likely will be better off using `merge`. 

### A Note on `git pull --rebase`

You'll also sometimes see `git pull --rebase` recommended - `06-solving-common-issues.md` mentions it as an option when your branch has diverged from the remote. Instead of creating a merge commit like a normal `git pull` would, this **replays** your local commits one at a time on top of the latest remote commits, giving you a straight, linear history with no merge commits at all. 

It produces a cleaner-looking history, but it does so by rewriting commit history - exactly the kind of thing that gets risky on a branch other people are also working on. For our team, stick with a regular `git merge` (or a plain `git pull`) unless you specifically know why you want a rebase instead. It's good to know this option exists, but it's not something to reach for by default. 

## Fetch: Previewing Remote Content

You might only be interested in viewing the remote content without changing your local branches. Running `git fetch` allows you to download remote content to your working directory and you can therefore view any changes manually. 

You likely would be looking at files on the repo website anyway, but this is still useful if you'd rather have files stored locally as well. See `03-branching.md` for how to use `git fetch` together with `git checkout` to grab a remote branch you don't have locally yet. 
