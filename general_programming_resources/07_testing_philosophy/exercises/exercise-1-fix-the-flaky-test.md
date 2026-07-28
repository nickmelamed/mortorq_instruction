# Exercise 1: Fix the Flaky Test

## Goal
Figure out why a pair of tests only pass depending on the order they run in, and fix them so each one passes independently, every time, regardless of order.

## Scenario
`examples/flaky_test/test_score_tracker.py` has two tests, `test_add_single_score` and `test_add_multiple_scores`, each checking `ScoreTracker` in what looks like a perfectly reasonable way. Run them with `run_tests.py` and you'll see one pass and one fail — but which one fails depends entirely on the order you run them in.

## Steps
1. From `examples/flaky_test/`, run `python3 run_tests.py` and note which test fails.
2. Now run `python3 run_tests.py reversed` and note that a *different* test fails this time, even though neither test's code changed at all.
3. Look at `test_score_tracker.py` closely and find exactly what's being shared between the two tests that shouldn't be. (Hint: check where `tracker` is created, and how many times.)
4. Fix it so each test creates its own independent `ScoreTracker` instead of sharing one. You'll need to restructure the two test functions so each builds the tracker it needs.
5. Re-run both `python3 run_tests.py` and `python3 run_tests.py reversed` and confirm both tests now PASS in both orders.

## Self-Check
- [ ] I can state, in one sentence, exactly what was shared between the two tests and why that caused the failure
- [ ] Both tests pass when run in the original order
- [ ] Both tests pass when run in the reversed order
- [ ] Neither test's assertions or expected values changed — only how the tracker is created did

## Reflection
Nothing was wrong with `ScoreTracker` itself, and nothing was wrong with either test's logic in isolation — the bug was entirely in the fact that both tests depended on the same object surviving between them. This is exactly the "independent" property from `concept.md`: a well-written test shouldn't care what ran before it, or in what order. The fix you just made — give each test its own fresh setup instead of sharing state — is one of the single most common fixes for flaky tests in real codebases, in any language or framework.
