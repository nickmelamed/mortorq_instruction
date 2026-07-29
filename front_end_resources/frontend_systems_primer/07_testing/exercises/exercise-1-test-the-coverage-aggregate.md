# Exercise 1: Write Tests for `coverageByTeam`

## Goal
Apply `validation.test.ts`'s exact pattern — a pure function, no rendering, no mocking, just inputs and expected outputs — to a different pure function that currently has no direct tests of its own.

## Background
`output/aggregate.ts`'s `coverageByTeam` is only exercised *indirectly* right now, through `PickList.test.tsx` and `TeamCoverageChart`. That's not nothing, but it means a bug in `coverageByTeam` itself would show up as a confusing failure in a pick-list test, instead of a focused failure that points straight at the function that's actually wrong. `general_programming_resources/07_testing_philosophy` calls this out directly: a good test "fails for exactly one reason."

## Steps
1. Create `src/output/aggregate.test.ts`, following `validation.test.ts`'s shape: import `describe`, `it`, `expect` from `"vitest"`, import `coverageByTeam`, and write focused cases for:
   - An empty array of entries returns an empty array.
   - Multiple entries for the same team number are counted together, not one row per entry.
   - The result is sorted by team number ascending, numerically — not alphabetically (a real risk: with `"1515"`, `"254"`, and `"118"`, alphabetical sorting swaps the last two, giving `"118", "1515", "254"` instead of the correct `"118", "254", "1515"` — confirm your test would actually catch that if someone accidentally swapped in `.localeCompare()`).
   - Entries can construct a shared partial `StoredEntry` factory the same way `PickList.test.tsx` already does, rather than writing out every field by hand in every test.
2. Run `npm test` and confirm all new tests pass alongside the existing 12.
3. `npx tsc --noEmit` passes.

## Self-Check
- [ ] Every test in the new file tests exactly one behavior
- [ ] The numeric-vs-alphabetical sort case would actually fail if `coverageByTeam` used `.localeCompare()` instead of numeric subtraction (try it briefly, on purpose, to confirm — then revert)
- [ ] `npm test` shows all tests passing, old and new
- [ ] `npx tsc --noEmit` passes

## Reflection
Before this exercise, `coverageByTeam`'s sort order was only ever confirmed as a side effect of `PickList.test.tsx` checking rendered team names in order. What's actually lost by only testing something indirectly like that, even when the indirect test currently passes?
