# 10 - Capstone: One System, Not Nine Topics

## Why this Exists

Every topic so far in this primer has been demonstrated in isolation, on purpose. One idea per file, so it's easy to see clearly. But several of these topics aren't actually separate ideas so much as facets of one system, and FRC just gives you an unusually sharp view into how those pieces depend on each other. This module is one scenario, `CapstoneRobot.java`, that genuinely needs concurrency's periodic-loop shape, a state machine, a PID loop, fault-tolerant sensor reads, structured logging, and profile-aware configuration all at once, because a real endgame mechanism actually has all of these requirements simultaneously.

Not every topic in this primer belongs in this particular scenario, though. `02_communication_serialization` and `05_apis_networking` solve problems a single mechanism's control loop doesn't have (talking to other machines, not just itself), and `06_testing_debugging` is about verifying code before you trust it, not a property of the running system itself. So this module wires together the six patterns a real endgame mechanism actually needs simultaneously, not all nine topics in the primer.

## The Scenario: an Endgame Climber Arm

A climber arm needs to raise to a target angle and then hold it there against gravity until the match ends. Unlike `03_state_machines`'s `AutonomousStateMachine` (which transitions on a fixed tick countdown standing in for a sensor) this state machine transitions on a real convergence check against a live PID loop's own error. The state machine and the control loop aren't two separate systems bolted together; they're reading from the same measurement, every tick.

```text
                    error within tolerance,
                    held for 5 straight ticks
   +-----------+  --------------------------->  +-----------+  ---- 50 ticks ---->  +--------+
   |  RAISING  |                                |  HOLDING  |    held at setpoint    |  IDLE  |
   +-----------+                                +-----------+                        +--------+
   PID drives the arm                            PID keeps correcting                nothing
   toward SETPOINT_DEGREES,                      for gravity -- stopping              left to
   tick after tick                                the output here would let           do
                                                    the arm sag back down
```

This is exactly `04_control_loops_pid`'s "hit *and hold*" framing, structural: `HOLDING` keeps calling `pid.calculate()` every tick, not just freezing the last output, because a PID controller that stops running the instant it reaches the target immediately starts drifting away from it again.

## Where Prior Topics Show Up

- **`01_concurrency_realtime_loops`** — `main()` drives `ClimberStateMachine.periodic()` in a fixed-rate tick loop, `Constants.DT_SECONDS` matching the same 20ms period every other demo in this primer has used. Nothing in `periodic()` blocks; the whole routine is fast, bounded work, tick after tick, the same shape `01` argued for.
- **`03_state_machines`** — `RAISING -> HOLDING -> IDLE`, the same enum-plus-transition-listener shape as `AutonomousStateMachine.java`. The difference is what triggers a transition: real convergence, not a countdown.
- **`04_control_loops_pid`** — `SimplePIDController` is the identical class from `PidLoopDemo.java`, doing the identical job: poll a sensor, compute error against a setpoint, act.
- **`07_logging_observability`** — `StructuredLogger` is the same shape as `StructuredLoggingDemo.java`'s, attached both to state transitions *and* to every sensor fault, so a real post-mortem could search this run's log for `WARN` lines and find exactly when and why the controller fell back to a stale value.
- **`08_error_handling_fault_tolerance`** — `SafeSensorReader` wraps the arm's angle sensor with the same disconnect/stale check as `SensorFaultHandlingDemo.java`. Critically, `RAISING`'s PID loop never sees a `null` or a 500ms-old reading directly; it only ever sees whatever `SafeSensorReader` decided was trustworthy that tick.
- **`09_configuration_constants_management`** — `Constants.ACTIVE_PROFILE` switches `KP` between a `PRACTICE_BOT` and `COMP_BOT` value, the same profile-switch pattern as `Constants.java`. Flipping it changes how quickly the arm converges without touching anything else in the file.

One notable absence: `06_testing_debugging` doesn't show up in this list. This module has no automated tests of its own, only the manual trace-and-predict work in this unit's exercise. A real version of this climber arm would still be worth unit-testing piece by piece exactly the way `06` teaches (the PID math, the state machine's transition logic, the fault-tolerant sensor reader, each in isolation) before ever trusting the fully wired-together version end to end.

## What Happens in One Run

Two sensor faults are scripted in on purpose, so both of `SafeSensorReader`'s branches fire for real instead of only in theory: tick 40 is a disconnect (no value at all), and tick 90 is a present-but-500ms-stale reading. Neither one derails the run. The state machine keeps converging on schedule, because the fallback to `lastKnownGood` keeps feeding PID a reasonable number instead of a `null` or a garbage one.

Under the default `COMP_BOT` profile, a real run looks like this:

```text
tick 40: WARN  climber arm sensor reported no value; falling back to last known-good  lastKnownGoodDegrees=85.88
tick 53: INFO  state transition  from=RAISING to=HOLDING armAngleDegrees=89.77
tick 90: WARN  climber arm sensor reading stale; falling back to last known-good  ageMs=500 lastKnownGoodDegrees=91.79
tick 103: INFO  state transition  from=HOLDING to=IDLE armAngleDegrees=91.67
```

Notice the disconnect at tick 40 happens *before* `RAISING` has converged, and the stale reading at tick 90 happens *after* the machine has already moved on to `HOLDING`. The safety net doesn't care which state is currently active, because `SafeSensorReader` sits underneath the state machine, not inside one particular state's logic.

## Putting it together

`java/CapstoneRobot.java` runs the full scenario above, tick by tick, printing the arm's angle periodically and a structured log line for every transition and every sensor fault. No hardware, no WPILib project. It is standalone, exactly like every other demo in this primer.

```text
$ cd java
$ javac CapstoneRobot.java
$ java CapstoneRobot
```

## Resources

This module doesn't introduce new material, so there's nothing new to link. Every citation that matters is already in `01` through `09`'s own `Resources` sections.
