# Exercise 5: Opening a Pull Request

## Goal
Practice the full path from a local branch to a reviewed change on `main`, following the conventions in `CONTRIBUTING.md`.

## Steps
1. Create a branch following the naming convention in `CONTRIBUTING.md` (e.g., `test/pr-practice/your-name`).
2. Make a small, harmless change (e.g., add your name to a `CONTRIBUTORS.txt` file) and commit it using the commit message format from `CONTRIBUTING.md`.
3. Push your branch to the remote for the first time: `git push -u origin BRANCH`.
4. On GitHub, open a pull request from your branch into `main`.
5. Fill out the PR description, add a label, and request a review, following the "Pull Requests" section of `CONTRIBUTING.md`.
6. Once approved, merge the PR.

## Reflection
- What did `git push -u` do differently from a plain `git push`?
- Looking at your PR on GitHub, can you tell what changed and why just from the title, description, and commit history? If not, what's missing?
- What would you do if a teammate pushed new commits to `main` while your PR was still open?
