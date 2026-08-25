# Exercise 2: Fix the Wait

## Goal
Replace exact-equality waiting with a real tolerance, and see exactly how much that was costing you.

## Scenario
Build on your fix from Exercise 1. Add a counter to `sync_until_stable` that tracks how many times it calls `api.get_average_score()`, and print it once the loop finishes.

Run it. It will finish eventually, but not quickly, and not because the code ever decided the value was "close enough." `current != previous` only becomes `False` once two consecutive calls happen to produce the exact same 64-bit float, which here only happens once the `step` in `fake_tba_api.py` underflows past what floating-point precision can represent. That's an accident of this specific simulation's numbers, not a real stopping condition.

## Steps
1. Confirm the call count for yourself. Note how many calls it took, and compare that to how many calls it would take for the value to look "close enough" by eye (print `current` each iteration and see how early the visible digits stop changing).
   
2. Add a `TOLERANCE` constant and change the loop condition from `current != previous` to something based on `abs(current - previous) > TOLERANCE`.
   
3. Re-run with your counter still in place. Compare the new call count to the old one.
   
4. **Tolerance alone isn't a budget.** Add a separate `MAX_CALLS` constant (15 is a reasonable choice) and a check inside the loop: if the call count reaches `MAX_CALLS` before the tolerance condition is satisfied, stop and return whatever `current` value you have, instead of continuing to poll. This is a hard ceiling, independent of `TOLERANCE` — it should fire even if someone else picks a bad tolerance later.
   
5. Confirm your ceiling doesn't get in the way of normal operation: rerun with your step-2 `TOLERANCE` and confirm it still converges well under `MAX_CALLS` calls, the same as step 3.
   
6. Now prove the ceiling actually does something. Temporarily set `TOLERANCE` to something unreasonably tight — far smaller than any real sensor or API value could ever resolve, like `0.0000001` — and rerun. Without step 4's ceiling, this recreates the *exact* bug you just fixed in steps 1-3, just more slowly; with it, confirm the loop stops at `MAX_CALLS` and falls back cleanly instead of burning dozens of calls chasing a tolerance nobody could justify. Restore your real `TOLERANCE` afterward.

## Self-Check
- [ ] I measured (not guessed) how many calls the original exact-equality version took
- [ ] My fixed version uses a named `TOLERANCE` constant, not a bare magic number buried in the condition
- [ ] My fixed version finishes in meaningfully fewer calls than the original
- [ ] I can state in one sentence why the original version "worked" at all despite the bug, and why that's a bad reason to trust it in production
- [ ] My `MAX_CALLS` ceiling doesn't trigger under normal (reasonable-`TOLERANCE`) operation
- [ ] I forced the ceiling to trigger with an unreasonably tight `TOLERANCE`, confirmed it stopped at exactly `MAX_CALLS`, and restored the real value afterward

## Reflection
The original version didn't hang forever; it terminated by floating-point accident, not by design, and it burned dozens of real API calls doing it. Against a real API with a rate limit, a per-request cost, or an actual round trip over bad venue wifi, that difference is exactly the "budget" `13`'s concept.md talks about, not just a style nitpick. Steps 4-6 make the same point from the other direction: `TOLERANCE` and `MAX_CALLS` are two separate decisions, not one. A good tolerance keeps the *normal* case fast; a budget ceiling is what protects you from a *bad* tolerance — your own, or whoever edits this code after you — instead of trusting every future value of `TOLERANCE` to be a reasonable one forever.
