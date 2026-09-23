# Exercise 1: Trace the Chain, Then Close a Gap

## Goal
Confirm, from real log output, that the state machine, the PID loop, and the fault-tolerant sensor reader in `CapstoneRobot.java` are actually wired together rather than just sitting in the same file. Then, find and close a gap this demo shares with `08_error_handling_fault_tolerance`'s own demo: `SafeSensorReader` here still doesn't guard against an out-of-range reading, only a missing or stale one.

## Setup
Work in `10_capstone/java/CapstoneRobot.java`. Compile/run with:
```text
$ javac CapstoneRobot.java
$ java CapstoneRobot
```

## Part A — Trace a real run

1. Run the file as-is (`Constants.ACTIVE_PROFILE = COMP_BOT`). Find, in the printed log, the exact tick of each: the disconnect `WARN`, the `RAISING -> HOLDING` transition, the stale-reading `WARN`, and the `HOLDING -> IDLE` transition.
   
2. The disconnect (tick 40) fires while the machine is still in `RAISING`; the stale reading (tick 90) fires after it's already moved on to `HOLDING`. Using only what you can see in `ClimberStateMachine.periodic()`, explain in one sentence why `SafeSensorReader` catches both faults identically regardless of which state is currently active.
   
3. Change `Constants.ACTIVE_PROFILE` to `PRACTICE_BOT` and rerun. `KP` drops from `0.060` to `0.045`, which is a gentler gain. Before checking the new transition ticks, predict: will `RAISING` take *more* or *fewer* ticks to converge than the `COMP_BOT` run, and why, using what `04_control_loops_pid` said about what the P term actually does? Then check the real ticks and confirm your prediction.

## Part B — Close the out-of-range gap

4. Read `SafeSensorReader.readSafely()` closely. It checks for a missing value and a stale value, which are the same two checks `SensorFaultHandlingDemo.java` in `08_error_handling_fault_tolerance` has. Does anything stop a *present, fresh* reading of, say, `999.0` degrees from passing straight through and getting fed directly into `pid.calculate()`?
   
5. In `rawReadingForTick()`, add a third scripted case: at `tick == 70` (safely inside `HOLDING`, between the two existing faults), return a present, fresh reading of `999.0` degrees instead of the arm's real angle. The printed log only samples every 20 ticks, so temporarily add a `System.out.printf` inside `ClimberStateMachine.periodic()`'s `HOLDING` case that prints `measuredAngle`, `output`, and the arm's angle for ticks 68 through 73. Rerun and confirm your suspicion from step 4: does the `999.0` reading get treated as trustworthy, and does `output` swing wildly on that one tick as a result?
   
6. Add a bounds check to `SafeSensorReader`, reusing the `0.0`-to-`180.0` degree valid range from `08`'s own exercise: any present, fresh reading outside that range should be treated exactly like a stale or missing one;fall back to `lastKnownGood`, and log a `WARN` explaining why, in the same style as the existing two checks.
   
7. Rerun with your tick-70 script entry and your temporary tick 68–73 print still in place, and confirm the `999.0` reading now gets rejected, a `WARN` fires, and `output` and the arm's angle both stay smooth through tick 70 instead of spiking. Then remove the temporary print statement.

## Self-Check
- [ ] I found the exact tick of all four events in Part A's baseline run
- [ ] I can explain why the safety net catches faults identically in `RAISING` and `HOLDING`
- [ ] My `PRACTICE_BOT` prediction was directionally correct, or I can explain exactly why it wasn't
- [ ] I confirmed a `999.0` reading passes through unguarded before making any changes
- [ ] My bounds check rejects the `999.0` reading, logs a `WARN`, and the arm's motion around tick 70 is visibly stable after the fix, compared to visibly disturbed before it

## Reflection
Part A's point is one this primer has made before in pieces, now visible all at once: a state machine, a control loop, and a fault-tolerance layer that are actually integrated don't just happen to sit in the same file. The control loop only ever sees what the fault-tolerance layer decided was trustworthy, and the state machine only ever transitions based on what the control loop actually measured, all in the same tick. Part B is the sharper point. `08_error_handling_fault_tolerance` taught the out-of-range gap once, in isolation, where it was the whole lesson. Here it shows up again, unannounced, which is exactly how a real gap survives in a real codebase.
