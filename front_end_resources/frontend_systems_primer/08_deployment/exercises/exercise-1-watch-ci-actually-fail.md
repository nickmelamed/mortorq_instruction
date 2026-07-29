# Exercise 1: Watch CI Actually Fail (Then Fix It)

## Goal
See `.github/workflows/scouting-app-ci.yml` go red on a real pull request, for a real reason, before trusting that it would ever catch anything.

## Steps
1. Make sure this repository (or your fork of it) is pushed to GitHub and that you can see the **Actions** tab.
2. Create a new branch and introduce one small, genuine break — pick one:
   - A type error: change `validateEntry`'s return type usage somewhere so `npx tsc --noEmit` fails, or
   - A failing test: change one `expect(...)` value in `validation.test.ts` so it no longer matches what `validateEntry` actually returns.
3. Commit and push the branch, then open a pull request against `main`.
4. On the pull request, find the "scouting_app CI" check. Confirm it's red, and open its log — find the exact step that failed (typecheck, test, or build) and read the actual error message GitHub Actions produced, not just "it failed."
5. Fix the break for real (don't just revert your test/type change if you picked the type-error path — make the underlying code correct, then confirm your test/type change was actually catching something real).
6. Push the fix to the same branch and confirm the check turns green on the same pull request, without opening a new one.

## Self-Check
- [ ] I saw the "scouting_app CI" check fail on a real PR, not just read about it
- [ ] I identified which of the three steps (typecheck/test/build) failed, from the actual log, not by guessing
- [ ] I pushed a fix to the same branch and watched the same check turn green
- [ ] I can explain in one sentence what would have happened if Vercel had deployed this PR's preview anyway, red check or not

## Reflection
This repository's CI and Vercel's deploys are not wired together — a red check on this PR didn't stop (and wouldn't stop) a preview deploy from being created for it. What's the actual argument for keeping them separate by default, instead of always blocking a deploy on a failing check?
