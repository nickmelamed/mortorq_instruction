# The Core Git Workflow

This is basic workflow you will use the vast majority of the time you are using git. 

## 1. Get the Code

Before you can do any of the below, you need a local copy of the repository on your computer.

If the repository already exists (which will be true almost all of the time on our team), you **clone** it:

```bash
git clone REMOTE_URL
```
The remote URL can be copied by clicking the "Code" button on the GitHub web page. 

This downloads the full history of the project and sets up a connection back to the remote repository (called `origin`) so `git pull` and `git push` know where to send and receive changes.

If you are starting a brand new project from scratch (rare for us), you instead run:

```bash
git init
```

This turns your current folder into a new, empty Git repository with no history and no remote connection yet.

## 2. Check status
```bash
git status
```

Always start here. To explain what outputs you might see when running this, let's look at an example output: 

```bash
On branch feature/user-auth 
Your branch is ahead of 'origin/feature/user-auth' by 1 commit. 
  (use "git push" to publish your local commits)

Your branch is behind 'origin/feature/user-auth' by 2 commits.
  (use "git pull" to update your local branch)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/auth/login.py
        new file:   src/auth/session.py
        deleted:    src/auth/legacy_auth.py

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/auth/login.py
        modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        notes/debugging.txt
        tmp/test_output.json

```
Let's go through each of these lines to see what this means. 

```bash
On branch feature/user-auth 
```

This tells you what branch you are doing your work on in the working directory. This can also be referred to as programming "locally". 

```bash
Your branch is ahead of 'origin/feature/user-auth' by 1 commit. 
  (use "git push" to publish your local commits)
```

The `origin/feature/user-auth` is the repository branch that corresponds to our working directory branch; we know it is remote because it has `origin` at the beginning. 

Our branch being ahead by one commit means that we have made changes, used `git add` to stage them (meaning they are ready to be pushed to our remote repository), but have not actually used `git push` to get them there. 

```bash
Your branch is behind 'origin/feature/user-auth' by 2 commits.
  (use "git pull" to update your local branch)
```

So how is this command also possible? How can we be ahead of our remote branch by one but also behind by 2? This is because earlier, there were two new commits pushed to our remote repo, but we never used `git pull` to get those changes to our local branch. We will address how to address this issue of getting remote changes into our local branch a bit later, but for now know that usually you can just run `git pull` and those changes will be reflected in your local branch. 

```bash 
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/auth/login.py
        new file:   src/auth/session.py
        deleted:    src/auth/legacy_auth.py
```

These are changes that are in the staging area, and only these changes will be able to be committed and pushed to our remote branch. Note that it makes the distinction between files that are modified, added, or deleted. 

```bash 
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        notes/debugging.txt
        tmp/test_output.json
```

If a file is untracked, this means it has been changed, but is only in the working directory and not in the staging area. So, no changes here will be committed. Of note, `login.py` is included in **both** the staging area and the working directory, which implies that we made changes, put them in the staging area, but then made more changes and did not run `git add` to get it into the staging area. 

### A Note on Untracked Files: `.gitignore`

Some files should never show up as "Untracked" in the first place. This could include things like build artifacts, log files, editor settings, credentials, etc. You don't want to accidentally `git add` these, and you don't want them cluttering your `git status` output every time.

In particular, you NEVER want to publish things like API keys that you would have in your `.env` file, where someone running a web scraper can steal your key and run up a bill. In fact, if you try to push it, GitHub will send you a warning and stop the commit because you are publishing sensitive information! 

To handle this, add a file called `.gitignore` to the root of your repository, and list one pattern per line for anything Git should ignore:

```text
*.log
__pycache__/
.env
build/
```

Once a pattern is in `.gitignore`, Git will stop showing matching files as untracked, and `git add .` will skip them automatically. Set this up **early** in a project. If a file is already tracked, adding it to `.gitignore` later won't stop Git from tracking it (you'd need to run `git rm --cached FILE` first).

## 3. Make Changes 

At this point, you should feel comfortable changing your files as is. Once you do that, move onto the next step. 

## 4. Review Your Changes

Before staging anything, it's worth looking at exactly what you changed: 

```bash
git diff
```

This shows every unstaged change in your working directory, line by line. This is a great quick sanity check that you didn't leave in a stray debug print, or change something you didn't mean to. You can scope it to one file with `git diff FILE`. 

Once you've staged something (see the next step), `git diff` will stop showing it, since it now only shows *unstaged* changes. To see what's staged and about to be committed, use: 

```bash
git diff --staged
```

Making a habit of checking `git diff --staged` right before you commit is one of the easiest ways to keep commits as the clean, logical units `CONTRIBUTING.md` asks for. 

## 5. Stage Changes

You can stage changes for an individual file like so: 

```bash 
git add FILE
```

where `FILE` is replaced by the file you want to stage the changes for. You can also add multiple files by listing them out like `git add FILE1 FILE2` and so on.  

Note you can add all changes in the working directory by replacing `FILE` w/ `.`, but it is usually easier to list out individual files for keeping commits as logical units instead of just every change you've made. 

### Staging Only Part of a File

Sometimes you've made several unrelated changes in the same file, and you only want to commit some of them. Instead of `git add FILE`, you can run:

```bash
git add -p FILE
```

This puts Git into "patch mode"; it shows you each chunk of changes (a "hunk") one at a time and asks whether you want to stage it (`y`), skip it (`n`), or a few other options. This lets you build clean, logical commits even when your working directory is messy.

## 6. Commit Changes 

You can do a commit like so: 

```bash 
git commit -m "Here is my commit message!"
```

A commit message is a helpful (and "optional") way to explain what your commits are for. We cover how to do your commit messages in the `CONTRIBUTING.md` file, so for now just understand that you should always add a message so people understand what you are doing! 

## 7. Sync w/ Remote

We discussed this earlier, so here is the way you should handle commits: 

```bash
git pull
git push
```

`git pull` ensures all remote changes are reflected in our local branch, `git push` so that our local changes are reflected in the remote branch. It is **crucial** to run things in this order so your commit history is an accurate reflection of the programming changes. 

Note: the very first time you push a brand new branch, plain `git push` won't know where to send it. You need to tell Git which remote branch to link to: 

```bash
git push -u origin BRANCH
```

The `-u` (short for `--set-upstream`) only needs to be run once per branch - after that, a plain `git push` will remember where to go. 

## 8. Review Your History

Once you've made a few commits, you'll want to look back at them. Run:

```bash
git log
```

This shows your commit history for the current branch: commit hash, author, date, and message, most recent first. For a quicker, one-line-per-commit view that's easier to scan, use:

```bash
git log --oneline
```

Note that `git log` only shows commits reachable from where you currently are. It won't show commits on a branch you never merged, or commits you "lost" by doing something like a reset. For that, see `git reflog` in `06-solving-common-issues.md`.

## Resources
- **Official docs:** [git-status](https://git-scm.com/docs/git-status), [git-diff](https://git-scm.com/docs/git-diff), [git-add](https://git-scm.com/docs/git-add), [git-commit](https://git-scm.com/docs/git-commit), [git-log](https://git-scm.com/docs/git-log) - the full reference for every command in this chapter.
- **Official docs:** [Pro Git, Ch. 2.2 - Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) - the book-length version of this chapter's workflow.
- **Official docs:** [GitHub Docs - Ignoring Files](https://docs.github.com/en/get-started/git-basics/ignoring-files) - more detail on `.gitignore` patterns and syntax.
- **Reference:** [github/gitignore](https://github.com/github/gitignore) - ready-made `.gitignore` templates for most languages and tools.
