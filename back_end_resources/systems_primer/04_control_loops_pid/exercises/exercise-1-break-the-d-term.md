# Exercise 1: Break the D Term (and the P Term)

## Goal
Watch what a PID controller actually does when you remove its damping — the overshoot/oscillation failure `concept.md` said would need a full tuning unit to master, made visible here in three small runs.

## Setup
Work in `04_control_loops_pid/java/PidLoopDemo.java`. Compile/run with:
```text
$ javac PidLoopDemo.java
$ java PidLoopDemo
```

## Steps
1. Run the file as-is and record the final printed angle (should land close to the 90-degree setpoint). Note whether the printed `error` column ever goes negative (meaning the arm overshot past 90 and had to come back).
2. Change the controller's construction line to `new SimplePIDController(0.06, 0.02, 0.0)` — removing the D term entirely — and rerun. Compare the last several printed ticks to the original run: does the arm settle as cleanly, or does `error` swing between positive and negative for longer before settling?
3. Reset D back to `0.006`, then instead push P much higher: try `new SimplePIDController(0.4, 0.02, 0.006)`. Rerun. What happens to `error` over the run — does it converge, oscillate with roughly constant size, or grow?
4. In one or two sentences each: what job was D actually doing in step 2 that its absence exposed, and what went wrong in step 3 that D alone couldn't fix?

## Self-Check
- [ ] I recorded the baseline run's final angle and whether `error` crossed zero
- [ ] I ran the D=0 version and can point to specific printed ticks where it visibly overshoots or settles more slowly than the baseline
- [ ] I ran the high-P version and correctly characterized its behavior (converging / oscillating / diverging)
- [ ] My two sentences describe D's damping role and why high P alone destabilizes the loop, not just "it got worse"

## Reflection
D reacts to *how fast* error is changing, which is exactly what stops a controller from slamming into the target at full speed and sailing past it. Take D away and P alone will happily keep pushing right up to (and past) the setpoint, because P only ever looks at the error's current size, never its rate of change. Push P too high on top of that and the correction itself becomes too aggressive relative to how fast the simulated arm actually responds each tick — the controller keeps overcorrecting in both directions, which is oscillation. This is a real preview of what an actual tuning session looks like: change one gain, run it, read the shape of the error column, not just its final value.
