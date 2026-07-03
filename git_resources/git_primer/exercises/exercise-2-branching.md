# Exercise 2: Branching

## Goal
Work safely without touching `main`, then clean up after yourself.

## Steps
1. Run `git branch` to see what branches currently exist
2. Create a feature branch
3. Make a change
4. Commit
5. Switch back to main
6. Merge your branch
7. Delete the feature branch now that it's merged

## Questions
- When did `main` change?
- What commit moved the branch pointer?
- Look at the output of your merge - did it say `Fast-forward`, or did it create a merge commit? Why do you think that happened (see `04-merge-vs-rebase.md`)?
- What happened when you deleted the branch with `git branch -d`? What do you think would've happened if you'd tried `-D` *before* merging?