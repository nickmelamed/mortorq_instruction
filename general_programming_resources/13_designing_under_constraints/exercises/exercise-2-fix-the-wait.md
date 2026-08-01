# Exercise 2: Fix the Wait

## Goal
Replace exact-equality waiting with a real tolerance, and see exactly how much that was costing you.

## Scenario
Build on your fix from Exercise 1. Add a counter to `sync_until_stable` that tracks how many times it calls `api.get_average_score()`, and print it once the loop finishes.

Run it. It will finish — eventually — but not quickly, and not because the code ever decided the value was "close enough." `current != previous` only becomes `False` once two consecutive calls happen to produce the exact same 64-bit float, which here only happens once the `step` in `fake_tba_api.py` underflows past what floating-point precision can represent. That's an accident of this specific simulation's numbers, not a real stopping condition — a live feed with real, noisy data has no reason to ever hand you two bit-identical readings in a row.

## Steps
1. Confirm the call count for yourself. Note how many calls it took, and compare that to how many calls it would take for the value to look "close enough" by eye (print `current` each iteration and see how early the visible digits stop changing).
2. Add a `TOLERANCE` constant and change the loop condition from `current != previous` to something based on `abs(current - previous) > TOLERANCE`.
3. Re-run with your counter still in place. Compare the new call count to the old one.

## Self-Check
- [ ] I measured (not guessed) how many calls the original exact-equality version took
- [ ] My fixed version uses a named `TOLERANCE` constant, not a bare magic number buried in the condition
- [ ] My fixed version finishes in meaningfully fewer calls than the original
- [ ] I can state in one sentence why the original version "worked" at all despite the bug, and why that's a bad reason to trust it in production

## Reflection
The original version didn't hang forever, which might make it feel like a smaller bug than it is — but it terminated by floating-point accident, not by design, and it burned dozens of real API calls doing it. Against a real API with a rate limit, a per-request cost, or an actual round trip over bad venue wifi, that difference is exactly the "budget" `13`'s concept.md talks about, not just a style nitpick.
