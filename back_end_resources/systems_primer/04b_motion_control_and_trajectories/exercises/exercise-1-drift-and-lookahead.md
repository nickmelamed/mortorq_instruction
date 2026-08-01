# Exercise 1: Drift Doesn't Lie, and Neither Does Lookahead

## Goal
Confirm two of this module's claims with real numbers instead of taking them on faith: that odometry drift compounds from a small per-tick bias, and that lookahead distance trades path-hugging for smoothness.

## Part A — Odometry drift

Work in `04b_motion_control_and_trajectories/java/OdometryDemo.java`. Compile/run with:
```text
$ javac OdometryDemo.java
$ java OdometryDemo
```

1. In the "No correction" run, record the printed `drift` value at `t=10.0s` (tick 500) and at `t=20.0s` (tick 1000). Is the drift at 20s roughly double the drift at 10s, or is the relationship not that simple? (`SENSED_DISTANCE_SCALE` biases every tick's distance by a *constant* percentage — think about what that implies as the robot keeps moving along a curve, not a straight line.)
2. Change `SENSED_DISTANCE_SCALE` from `1.02` (2% error) to `1.10` (10% error) — a much more badly-calibrated wheel — and rerun. How much bigger is the drift at `t=20.0s` compared to your original 2% run? Is the increase proportional to the change in bias (5x the bias → roughly 5x the drift), or something else?
3. Change the correction interval in `main()` from `250` (every 5 seconds) to `750` (every 15 seconds) and rerun the corrected version. Explain, using the printed drift values, why the correction interval matters even though the correction itself still perfectly resets the estimate every time it fires.

## Part B — Lookahead distance

Work in `04b_motion_control_and_trajectories/java/PurePursuitDemo.java`. Compile/run with:
```text
$ javac PurePursuitDemo.java
$ java PurePursuitDemo
```

4. Run it as-is and record the total tick count printed at the end.
5. Change `LOOKAHEAD_DISTANCE` from `1.0` to `0.3` (a short lookahead) and rerun. Then try `3.0` (a long lookahead). Record the tick count each time, and watch the intermediate `pose=` lines for any visibly jerky or wide-swinging steering.
6. Does your short-lookahead run behave the way `concept.md`'s "hugs the path tightly but reacts jerkily" description predicts? Does the long-lookahead run "cut corners smoothly"? Point to specific printed lines that support your answer.

## Self-Check
- [ ] I recorded drift at t=10s and t=20s for the baseline and can state whether it doubled or not
- [ ] I compared 2% vs. 10% bias and stated whether drift scaled proportionally
- [ ] I can explain, in terms of how long uncorrected drift is allowed to accumulate, why a longer correction interval produces worse peak drift even though each correction is still perfect
- [ ] I ran all three lookahead values and matched (or refuted, with evidence) `concept.md`'s tight-vs-jerky / smooth-vs-cutting-corners claim using my own printed output

## Reflection
Both halves of this exercise are really the same lesson from two different angles: a small, *constant* per-step error or approximation compounds into something much larger the longer it's allowed to run uncorrected — true whether the "step" is a tick of biased odometry or a tick of a controller chasing a lookahead point poorly matched to the path's curvature. Neither PID (`04`) nor Pure Pursuit is "wrong" when this happens; both are working exactly as designed on bad inputs (a stale position estimate, a badly-tuned lookahead). The fix in both cases has the same shape, too: bound how far you let the error run before something resets it — an absolute correction for drift, a better-tuned parameter for lookahead — rather than trusting an uncorrected estimate indefinitely.
