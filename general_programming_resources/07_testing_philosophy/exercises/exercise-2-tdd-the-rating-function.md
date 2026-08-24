# Exercise 2: TDD the Rating Function

## Goal
Build a small function entirely through red-green-refactor.

## Scenario
You're building `rate_climb_time(seconds)`, which should return a rating string:

- under 3 seconds: `"excellent"`
- 3 seconds up to (but not including) 5 seconds: `"good"`
- 5 seconds or more: `"needs work"`

No implementation exists yet. You're going to write it by writing the tests first, one at a time, and only ever writing enough code to make the current failing test pass.

## Steps
1. Create `rating.py` (empty for now) and `test_rating.py`. In `test_rating.py`, write exactly one test: `assert rate_climb_time(2) == "excellent"`. Run it and confirm it fails, and check *why* it fails (an import error or a missing function, not a typo in your test). This is `06_debugging_methodology`'s "test your hypothesis directly" habit.
   
2. **Green.** Write the smallest possible amount of code in `rating.py` that makes that one test pass. (It's fine, on purpose, if the simplest thing that passes one test is something trivial; the next step's job is to expose that lack of coverage). 
   
3. Add a second test: `assert rate_climb_time(6) == "needs work"`. Run both tests. If your step-2 implementation was too narrow, this one should fail. Confirm it does, then write just enough code to make both tests pass.
   
4. Add a boundary test: `assert rate_climb_time(3) == "good"`. This is the case most likely to break a careless implementation (`<` vs. `<=` in the wrong place). Run it, fix your comparisons if it fails, and confirm all three tests pass together.
   
5. Add one more test for the middle case: `assert rate_climb_time(4) == "good"`. Confirm it passes without any further changes. If it doesn't, your boundary logic from step 4 is still wrong somewhere.
   
6. **Refactor.** With all four tests passing, look at your implementation: if `3` and `5` appear as bare numbers more than once, pull them into named constants (`02_code_organization_modularization`'s naming lesson, applied here). Rerun all four tests after refactoring and confirm every single one still passes, unchanged.

## Self-Check
- [ ] Every test was written *before* the code that made it pass, in the order given above
- [ ] I confirmed the very first test failed for the right reason before writing any implementation
- [ ] All four tests pass together, including the two boundary-adjacent cases (`3` and `4`)
- [ ] I refactored at least one thing (named constants, or similar) after all tests were green, and confirmed nothing broke afterward

## Reflection
Notice how much step 4 mattered. Steps 2 and 3 alone can pass with an implementation that's subtly wrong right at the boundary, because `seconds <= 3` instead of `seconds < 3` for "excellent" passes both of the first two tests while silently misclassifying a 3-second climb. The boundary test is what actually forces the implementation to be correct, not just correct-looking. This is the real argument for writing tests first! 
