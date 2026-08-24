# Exercise 4: Rebuild the Pyramid

## Goal
See the test pyramid's actual payoff instead of just recognizing its shape.

## Scenario
`examples/pyramid_shape/match_scoring.py` has three small functions: `clamp_score`, `bonus_for_speed`, and `total_match_score` (which combines the other two). `examples/pyramid_shape/test_cone_shaped.py` is an ice-cream-cone-shaped suite for it. It has three slow "full scenario" tests, each simulating the cost of standing up a whole system to check one case, none of them touching `clamp_score` or `bonus_for_speed` directly. There's a real bug hiding in `total_match_score`.

## Steps
1. Run `python3 test_cone_shaped.py` and record the printed total time and which test(s) failed.
   
2. Read the failure. Based on the cone suite alone, can you tell *which* of the three functions the bug is actually in? Write down your best guess and how confident you are.
   
3. Create `test_pyramid_shaped.py` in the same folder. Write direct unit tests for `clamp_score` (at least: a value inside range, a value above the max, a value below the min) and for `bonus_for_speed` (at least: a fast time, a slow time). No `sleep()`, no full-scenario setup, just calling each function directly with a specific input and asserting the exact output
   
4. Add one test for `total_match_score`. This is the same case that failed in the cone suite (a high base score with a speed bonus that should push it right up against the max).
   
5. Run your new file and time it, the same way `test_cone_shaped.py` timed itself. Compare the two total times.
   
6. Look at which tests passed and which failed this time. Which functions does the pyramid suite prove work correctly on their own? Given that, where must the bug actually be?
   
7. Fix the bug in `match_scoring.py`, then re-run both suites and confirm everything passes.

## Self-Check
- [ ] I recorded both suites' total run times, and the pyramid suite was dramatically faster
- [ ] My step-2 guess (from the cone suite alone) is written down before my step-6 answer (from the pyramid suite), so I can honestly compare how much more the pyramid suite actually told me
- [ ] `test_pyramid_shaped.py` has passing unit tests for `clamp_score` and `bonus_for_speed` in isolation, plus one test for `total_match_score`
- [ ] I can name the exact function the bug lives in, and explain how the passing unit tests proved it wasn't anywhere else
- [ ] Both suites pass after the fix

## Reflection
The interesting comparison isn't the total time, even though it's dramatic. The cone suite's failure told you *that* something was wrong with some combination of a base score and a speed bonus; the pyramid suite's failure told you `clamp_score` works, `bonus_for_speed` works, and therefore the bug has to be in how `total_match_score` combines them. This is what makes pyramid shape so helpful, it tells you precisely where the error is. 
