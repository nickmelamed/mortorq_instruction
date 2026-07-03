# Branching: So you don't break things! 

Branches exist so you can work **without breaking main**.

We cover branch naming conventions in our `CONTRIBUTING.md` document. 

In the `git-mental-model` file, we talked about how branches are pointers for commits; they don't change anything on `main` **unless** you merge the changes. 

So, working on branches makes your life easy because you can do whatever you want without worrying about messing up the original code. 

## Branching syntax

Creating a branch: 
```bash
git branch BRANCH
```
where `BRANCH` is your branch name. 

Switching to a branch: 
```bash
git checkout BRANCH
```

Once you switch to a branch, this means any work you are doing on a file will be reflected **only in that branch**. 

You can also combine commands. 

Creating **and** switching to a branch: 

```bash 
git checkout -b BRANCH
```

Once you are on your own branch, you can get to programming! 

## Viewing Your Branches

To see what branches exist and which one you're currently on, run: 

```bash
git branch
```

This lists your **local** branches only, with a `*` next to whichever one you currently have checked out. If you also want to see branches that exist on the remote but that you don't have locally yet, add `-a`: 

```bash
git branch -a
```

## Pulling Files From a Different Branch

Sometimes you don't want to switch branches at all - you just want to grab one file's version from another branch. Maybe a teammate fixed something on `main` that you need in your feature branch, but you're not ready to merge everything else yet. 

To pull a single file from another branch into your current working directory: 

```bash
git checkout BRANCH -- path/to/file
```

This copies `path/to/file` exactly as it exists on `BRANCH` into your working directory (and stages it), without touching anything else in your branch. You never actually switch branches - you're just reaching over and grabbing one file. 

If you only want to **look** at a file from another branch without changing anything in your working directory, use `git show` instead: 

```bash
git show BRANCH:path/to/file
```

This prints the file's contents from that branch straight to your terminal. Nothing gets staged or copied - it's purely read-only. 

## Comparing Branches

Before merging, it's often useful to see exactly what's different between two branches: 

```bash
git diff BRANCH1 BRANCH2
```

You can also scope this to a single file: 

```bash
git diff BRANCH1 BRANCH2 -- path/to/file
```

## Deleting a Branch

Once a branch's work has been merged into `main`, you generally want to delete it locally to avoid clutter: 

```bash
git branch -d BRANCH
```

Git will refuse to delete a branch with `-d` if it has commits that haven't been merged anywhere yet - this is Git protecting you from losing work. If you are **certain** you want to delete a branch anyway (including any unmerged commits on it), use a capital `-D`: 

```bash
git branch -D BRANCH
```

Be careful with `-D` - this really can throw away work that isn't saved anywhere else. If you need to recover a branch you deleted this way, `git reflog` (covered in `06-solving-common-issues.md`) is usually your way back. 

## Renaming a Branch

If you misname a branch (e.g., you forgot the naming convention in `CONTRIBUTING.md`), you can rename the one you currently have checked out: 

```bash
git branch -m NEW_NAME
```

## Working with Remote Branches

If a teammate pushed a branch that you don't have locally yet, run: 

```bash
git fetch
```

This downloads all the latest remote branches and commits, but does **not** change any of your local branches or working directory - it just makes the remote's data available to you. From there, you can check out the branch like normal: 

```bash
git checkout BRANCH
```

If a remote branch named `BRANCH` exists (i.e., `origin/BRANCH`), Git is smart enough to automatically create a local branch that tracks it. 

## A Note on `git switch`

You may see `git switch BRANCH` used in place of `git checkout BRANCH`, and `git switch -c BRANCH` in place of `git checkout -b BRANCH`. These are newer, more specific commands - `checkout` historically did a lot of different jobs (switching branches, restoring files, etc.), and `switch` was introduced to just handle the branch-switching piece more clearly. Either works - this primer uses `checkout` since it's still the most common command you'll run into in older docs and tutorials, but don't be thrown off if you see `switch` elsewhere. 

## Resources
- **Official docs:** [Pro Git, Ch. 3.1 - Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) - the definitive explanation of branches as pointers.
- **Official docs:** [git-branch](https://git-scm.com/docs/git-branch), [git-switch](https://git-scm.com/docs/git-switch), [git-checkout](https://git-scm.com/docs/git-checkout) - full command references.
- **Blog:** [Using Branches - Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/using-branches) - practical walkthroughs of everything covered above.
- **Blog:** [A Successful Git Branching Model by Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/) - the famous "Gitflow" post; worth reading once you're comfortable with the basics, though our team's model here is simpler.
