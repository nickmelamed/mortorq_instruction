# Exercise 2: Make a Test Order-Dependent (Break This on Purpose)

## Goal
See what `general_programming_resources/07_testing_philosophy` means by "independent" tests by actually breaking independence, instead of only recognizing the definition on the page.

## Background
`PickList.test.tsx`'s `beforeEach(() => { localStorage.clear(); })` exists for a specific reason: `PickList` reads its starting order from `localStorage` the moment it mounts, and one test (`"picks up a previously-saved order..."`) deliberately writes to it. Without the clear between tests, whatever one test leaves behind in `localStorage` is still sitting there when the next test starts — real shared mutable state, the exact thing `07_testing_philosophy` warns an independent test shouldn't depend on.

## Steps
1. In `PickList.test.tsx`, comment out the `beforeEach(() => { localStorage.clear(); })` block entirely.
2. Cut the `"picks up a previously-saved order on a fresh render..."` test (the last one in the file) and paste it as the *first* test inside the `describe` block, above `"starts ranked by team number when nothing has been saved yet."`
3. Run `npm test`. Look at how many tests fail, and read a couple of the failure messages closely — notice they're not all failing for the same superficial reason (one is a plain ordering mismatch, another is `.toBeDisabled()` failing outright).
4. For each failing test, trace *why* it's failing. None of them are failing because anything is wrong with `PickList.tsx` itself — confirm that by checking `git status` or `git diff`: is the component file even touched?
5. Undo both changes — restore `beforeEach`, move the test back to where it was — and confirm all tests pass again.

## Self-Check
- [ ] I can state how many of the five tests failed after both changes, and confirm that number surprised me or didn't match my first guess
- [ ] I traced at least two different failing tests back to the same root cause: leftover `localStorage` state from an earlier test
- [ ] I confirmed `PickList.tsx` itself was never touched — the tests broke, not the component
- [ ] I restored both changes and confirmed `npm test` is back to all green

## Reflection
Every failing test in this exercise was telling the truth about *something* — just not about a bug in `PickList.tsx`. If a teammate saw this many red tests after a change that only touched a test file, what would you want them to check *first*, before assuming the component broke?
